import { Service } from "@deepseek-ai/cordis";
import { defineTool } from "@deepseek-ai/dsh-tools";
import z from "@deepseek-ai/schemastery";
import { readFileSync } from "node:fs";
import { createSign } from "node:crypto";

//#region src/github-bot/config.ts
const Config = z.object({ orgs: z.dict(z.object({
  appId: z.number(),
  installationId: z.number(),
  privateKeyFile: z.string(),
  apiBaseUrl: z.string().default("https://api.github.com")
})) });
//#endregion
//#region src/github-bot/token.ts
function readPrivateKey(path) {
  if (!path) throw new Error("github-bot: privateKeyFile is required");
  try {
    const pem = readFileSync(path, "utf8");
    if (!pem) throw new Error("private key file is empty");
    return pem;
  } catch (error) {
    throw new Error(`github-bot: cannot read private key file ${path}`, { cause: error });
  }
}
function createAppJwt(appId, pem) {
  const now = Math.floor(Date.now() / 1e3);
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
  const signingInput = `${encode({ alg: "RS256", typ: "JWT" })}.${encode({ iat: now - 60, exp: now + 540, iss: appId })}`;
  return `${signingInput}.${createSign("RSA-SHA256").update(signingInput).end().sign(pem).toString("base64url")}`;
}
async function createInstallationToken(config) {
  const jwt = createAppJwt(config.appId, readPrivateKey(config.privateKeyFile));
  const response = await fetch(`${config.apiBaseUrl ?? "https://api.github.com"}/app/installations/${config.installationId}/access_tokens`, {
    method: "POST",
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${jwt}`,
      "x-github-api-version": "2022-11-28"
    }
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`github-bot: GitHub API ${response.status}: ${body}`);
  const result = JSON.parse(body);
  return { token: result.token, expiresAt: result.expires_at };
}
//#endregion
//#region src/repo-ref.ts
const SAFE_REPO_SEGMENT = /^[A-Za-z0-9._-]+$/;
function isRepoRef(value) {
  if (typeof value !== "string") return false;
  const parts = value.split("/");
  return parts.length === 2 && parts.every((part) => part !== "." && part !== ".." && SAFE_REPO_SEGMENT.test(part));
}
//#endregion
//#region src/github-bot/index.ts
var GitHubBot = class extends Service {
  static inject = ["tools"];
  static Config = Config;
  constructor(ctx, config) {
    super(ctx, "githubBot");
    this.config = config;
    ctx.tools.register(defineTool({
      name: "github_bot_commit_pull_request",
      description: "Commit files, push a branch, and open a pull request with the configured GitHub App.",
      parameters: {
        org: { type: "string", required: true },
        repo: { type: "string", required: true, description: "Repository in owner/name form." },
        base: { type: "string", required: true },
        branch: { type: "string", required: true },
        message: { type: "string", required: true },
        title: { type: "string", required: true },
        body: { type: "string", required: true },
        changes: {
          type: "array",
          required: true,
          items: {
            type: "object",
            properties: {
              path: { type: "string", required: true },
              content: { type: "string", required: true }
            },
            additionalProperties: false
          }
        }
      },
      output: {
        schema: {
          type: "object",
          properties: {
            number: { type: "number", required: true },
            url: { type: "string", required: true },
            commitSha: { type: "string", required: true },
            branch: { type: "string", required: true },
            base: { type: "string", required: true }
          },
          additionalProperties: false
        },
        render: (_args, value) => [{ type: "text", text: JSON.stringify(value) }]
      },
      execute: async (args) => this.commitAndOpenPullRequest(args)
    }));
    ctx.tools.register(defineTool({
      name: "github_bot_orgs",
      description: "List configured GitHub App organization logins.",
      parameters: {},
      output: {
        schema: { type: "array", items: { type: "string" } },
        render: (_args, value) => [{ type: "text", text: JSON.stringify(value) }]
      },
      execute: async () => Object.keys(this.config.orgs)
    }));
  }
  async commitAndOpenPullRequest(input) {
    if (!isRepoRef(input.repo)) {
      throw new Error("github-bot: repo must be in owner/name form");
    }
    if (!input.changes?.length) throw new Error("github-bot: changes must not be empty");
    const [owner, repo] = input.repo.split("/");
    const orgConfig = this.config.orgs[input.org];
    if (!orgConfig) throw new Error(`github-bot: unknown org ${input.org}`);
    const { token } = await createInstallationToken(orgConfig);
    const request = (path, init) => this.request(orgConfig, token, path, init);
    const branchPath = `/repos/${owner}/${repo}/git/ref/heads/${encodeURIComponent(input.branch)}`;
    try {
      const branchRef = await request(branchPath);
      throw new Error(`github-bot: branch ${input.branch} already exists at ${branchRef.object.sha}; use a unique branch name`);
    } catch (error) {
      if (!(error instanceof Error) || !error.message.startsWith("github-bot: GitHub API 404:")) throw error;
    }
    const baseRef = await request(`/repos/${owner}/${repo}/git/ref/heads/${encodeURIComponent(input.base)}`);
    const parentSha = baseRef.object.sha;
    const parent = await request(`/repos/${owner}/${repo}/git/commits/${parentSha}`);
    const blobs = await Promise.all(input.changes.map(async (change) => {
      const blob = await request(`/repos/${owner}/${repo}/git/blobs`, {
        method: "POST",
        body: JSON.stringify({ content: change.content, encoding: "utf-8" })
      });
      return { path: change.path, mode: "100644", type: "blob", sha: blob.sha };
    }));
    const tree = await request(`/repos/${owner}/${repo}/git/trees`, {
      method: "POST",
      body: JSON.stringify({ base_tree: parent.tree.sha, tree: blobs })
    });
    const commit = await request(`/repos/${owner}/${repo}/git/commits`, {
      method: "POST",
      body: JSON.stringify({ message: input.message, tree: tree.sha, parents: [parentSha] })
    });
    await request(`/repos/${owner}/${repo}/git/refs`, {
      method: "POST",
      body: JSON.stringify({ ref: `refs/heads/${input.branch}`, sha: commit.sha })
    });
    const pull = await request(`/repos/${owner}/${repo}/pulls`, {
      method: "POST",
      body: JSON.stringify({ title: input.title, body: input.body, head: input.branch, base: input.base })
    });
    return { number: pull.number, url: pull.html_url, commitSha: commit.sha, branch: input.branch, base: input.base };
  }
  async request(config, token, path, init) {
    const headers = new Headers(init?.headers);
    headers.set("accept", "application/vnd.github+json");
    headers.set("authorization", `Bearer ${token}`);
    headers.set("content-type", "application/json");
    headers.set("x-github-api-version", "2022-11-28");
    const response = await fetch(`${config.apiBaseUrl ?? "https://api.github.com"}${path}`, { ...init, headers });
    const text = await response.text();
    if (!response.ok) throw new Error(`github-bot: GitHub API ${response.status}: ${text}`);
    return text.length === 0 ? null : JSON.parse(text);
  }
};
//#endregion
export { GitHubBot as default };