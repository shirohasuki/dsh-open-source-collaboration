import { Context, Service } from "@deepseek-ai/cordis";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { defineTool } from "@deepseek-ai/dsh-tools";
import z from "@deepseek-ai/schemastery";
import { credentialKey } from "@deepseek-ai/dsh-credentials";

//#region src/role/constants.ts
const KEY = credentialKey("role", "github");

//#endregion
//#region src/role/permissions.ts
function isMaintainer(permission) {
	return permission === "admin" || permission === "maintain";
}
function parsePermission(body) {
	if (body === null || typeof body !== "object") throw new Error("role: permission response is not an object");
	const permission = body.permission;
	if (typeof permission !== "string" || permission.length === 0) throw new Error("role: permission field missing");
	return permission;
}

//#endregion
//#region src/role/github.ts
class GitHubHttpError extends Error {
  constructor(status, body) {
    super(`GitHub ${status}: ${body}`);
    this.name = "GitHubHttpError";
    this.status = status;
  }
}

function sleep(ms, signal) {
	return new Promise((resolve$1, reject) => {
		if (signal?.aborted) {
			reject(signal.reason ?? /* @__PURE__ */ new Error("aborted"));
			return;
		}
		const timer = setTimeout(resolve$1, ms);
		signal?.addEventListener("abort", () => {
			clearTimeout(timer);
			reject(signal.reason ?? /* @__PURE__ */ new Error("aborted"));
		}, { once: true });
	});
}
async function login(role, interaction, signal) {
	const outcome = await role.ctx.authorization.begin({
		key: KEY,
		method: "oauth",
		interaction,
		signal
	});
	if (outcome.status !== "authorized") throw new Error(`role: login ${outcome.status}`);
	const user = await githubJson(role, "/user");
	if (typeof user.login !== "string" || user.login.length === 0) throw new Error("role: /user missing login");
	return { login: user.login };
}
async function whoami(role) {
  const user = await githubJson(role, "/user");
  if (typeof user.login !== "string" || user.login.length === 0) throw new Error("role: /user missing login");
  const maintainers = {};
  const errors = {};
  for (const repo of role.watchlist) {
    const [owner, name] = repo.split("/");
    try {
      maintainers[repo] = isMaintainer(parsePermission(await githubJson(role, `/repos/${owner}/${name}/collaborators/${user.login}/permission`)));
    } catch (error) {
      if (!(error instanceof GitHubHttpError)) throw error;
      errors[repo] = { status: error.status, message: error.message };
    }
  }
  return { login: user.login, maintainers, errors };
}
async function githubJson(role, path, init) {
	const record = await role.ctx.credentials.readRecord(KEY);
	if (record === void 0) throw new Error("not logged in");
	if (record.kind !== "grant") throw new Error("role: credential is not a grant");
	const payload = record.payload;
	if (typeof payload?.accessToken !== "string" || payload.accessToken.length === 0) throw new Error("role: grant missing accessToken");
	const url = `${role.config.apiBaseUrl.replace(/\/+$/, "")}${path}`;
	const headers = new Headers(init?.headers);
	headers.set("Accept", "application/vnd.github+json");
	headers.set("Authorization", `Bearer ${payload.accessToken}`);
	headers.set("X-GitHub-Api-Version", "2022-11-28");
	headers.set("User-Agent", "dsh-role");
	const response = await fetch(url, {
		...init,
		headers
	});
	const text = await response.text();
	if (!response.ok) throw new GitHubHttpError(response.status, text);
	return text.length === 0 ? null : JSON.parse(text);
}
async function runDeviceFlow(role, session) {
	const base = role.config.oauthBaseUrl.replace(/\/+$/, "");
	const codeResponse = await fetch(`${base}/login/device/code`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			client_id: role.config.clientId,
			scope: role.config.scopes
		}),
		signal: session.signal
	});
	const codeBody = await codeResponse.json();
	if (!codeResponse.ok) throw new Error(`role: device code HTTP ${codeResponse.status}: ${JSON.stringify(codeBody)}`);
	const deviceCode = codeBody.device_code;
	const userCode = codeBody.user_code;
	const verificationUri = codeBody.verification_uri;
	let interval = Number(codeBody.interval ?? 5);
	const expiresIn = Number(codeBody.expires_in);
	if (typeof deviceCode !== "string" || typeof userCode !== "string" || typeof verificationUri !== "string") throw new Error(`role: bad device code response: ${JSON.stringify(codeBody)}`);
	if (!Number.isFinite(interval) || interval <= 0 || !Number.isFinite(expiresIn) || expiresIn <= 0) throw new Error(`role: bad device code timing: ${JSON.stringify(codeBody)}`);
	session.notify({
		message: "Enter this code on the verification page to finish signing in.",
		url: verificationUri,
		code: userCode
	});
	const deadline = Date.now() + expiresIn * 1e3;
	while (Date.now() < deadline) {
		await sleep(interval * 1e3, session.signal);
		const tokenBody = await (await fetch(`${base}/login/oauth/access_token`, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				client_id: role.config.clientId,
				device_code: deviceCode,
				grant_type: "urn:ietf:params:oauth:grant-type:device_code"
			}),
			signal: session.signal
		})).json();
		if (typeof tokenBody.access_token === "string" && tokenBody.access_token.length > 0) {
			await role.ctx.credentials.modifyRecord(KEY, async () => ({
				kind: "grant",
				payload: { accessToken: tokenBody.access_token }
			}));
			return;
		}
		if (tokenBody.error === "authorization_pending") continue;
		if (tokenBody.error === "slow_down") {
			interval += 5;
			continue;
		}
		if (tokenBody.error === "access_denied" || tokenBody.error === "expired_token") throw new Error(`role: device flow ${tokenBody.error}`);
		throw new Error(`role: device flow poll failed: ${JSON.stringify(tokenBody)}`);
	}
	throw new Error("role: device flow expired");
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
//#region src/role/index.ts
var Role = class extends Service {
	static inject = [
		"tools",
		"authorization",
		"credentials",
		"webServer"
	];
	static Config = z.object({
		clientId: z.string().default("Ov23lixMRqTArZkZ92EI"),
		scopes: z.string().default("read:user repo"),
		apiBaseUrl: z.string().default("https://api.github.com"),
		oauthBaseUrl: z.string().default("https://github.com")
	});
	config;
	reposPath;
	get watchlist() {
		return this.loadRepos();
	}
	constructor(ctx, config) {
		super(ctx, "role");
		if (!config.clientId) throw new Error("role: clientId required");
		this.config = config;
		const dshHome = process.env.DSH_HOME;
		if (!dshHome) throw new Error("role: DSH_HOME required");
		this.reposPath = join(dshHome, "open-source-collaboration", "repos.json");
		mkdirSync(dirname(this.reposPath), { recursive: true });
		if (!existsSync(this.reposPath)) this.saveRepos([]);
		ctx.authorization.registerFlow({
			key: KEY,
			label: "GitHub (role)",
			methods: [{
				id: "oauth",
				label: "Sign in with GitHub"
			}],
			run: async (session) => runDeviceFlow({
				ctx: this.ctx,
				config: this.config,
				watchlist: this.watchlist
			}, session)
		});
		ctx.tools.register(defineTool({
			name: "role_whoami",
			description: "Return GitHub login and maintainer map for configured repos. Throws if not logged in.",
			parameters: {},
			output: {
				schema: {
					type: "object",
					properties: {
						login: {
							type: "string",
							required: true
						},
						maintainers: {
							type: "json",
							required: true
						}
						errors: {
							type: "json",
							required: true
						},
					},
					additionalProperties: false
				},
				render: (_args, value) => [{
					type: "text",
					text: JSON.stringify(value)
				}]
			},
			execute: async () => whoami({
				ctx: this.ctx,
				config: this.config,
				watchlist: this.watchlist
			})
		}));
		ctx.effect(() => ctx.webServer.register({
			kind: "exact",
			path: "/integrations/role/login",
			handler: (req, res) => void this.handleLogin(req, res)
		}), "role: login");
		ctx.effect(() => ctx.webServer.register({
			kind: "exact",
			path: "/integrations/role/repos",
			handler: (req, res) => void this.handleRepos(req, res)
		}), "role: repos");
	}
	loadRepos() {
		const value = JSON.parse(readFileSync(this.reposPath, "utf8"));
		if (!Array.isArray(value)) throw new Error("role: repos file must contain an array: " + this.reposPath);
		for (const repo of value) if (!isRepoRef(repo)) throw new Error("role: bad repo " + String(repo) + "; expected owner/name with safe path segments");
		return value;
	}
	saveRepos(repos) {
		writeFileSync(this.reposPath, JSON.stringify(repos, null, 2) + "\n");
	}
	async handleRepos(req, res) {
		try {
			if (req.method === "GET") {
				res.writeHead(200, {
					"content-type": "application/json; charset=utf-8",
					"cache-control": "no-store"
				});
				res.end(JSON.stringify(this.watchlist));
				return;
			}
			if (req.method !== "POST" && req.method !== "PUT" && req.method !== "DELETE") {
				res.writeHead(405, { "content-type": "text/plain; charset=utf-8" });
				res.end("method not allowed");
				return;
			}
			const chunks = [];
			for await (const chunk of req) chunks.push(Buffer.from(chunk));
			const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
			if (!isRepoRef(body.repo)) throw new Error("role: bad repo " + String(body.repo) + "; expected owner/name with safe path segments");
			const repos = this.watchlist;
			if (req.method === "DELETE") this.saveRepos(repos.filter((repo) => repo !== body.repo));
			else if (!repos.includes(body.repo)) this.saveRepos([...repos, body.repo]);
			res.writeHead(200, {
				"content-type": "application/json; charset=utf-8",
				"cache-control": "no-store"
			});
			res.end(JSON.stringify(this.watchlist));
		} catch (err) {
			res.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
			res.end(err instanceof Error ? err.message : String(err));
		}
	}
	async handleLogin(req, res) {
		if (req.method !== "POST") {
			res.writeHead(405, { "content-type": "text/plain; charset=utf-8" });
			res.end("POST only");
			return;
		}
		res.writeHead(200, {
			"content-type": "text/event-stream; charset=utf-8",
			"cache-control": "no-store",
			connection: "keep-alive"
		});
		const send = (event, data) => {
			res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
		};
		const ac = new AbortController();
		req.on("close", () => ac.abort());
		try {
			const { login: login$1 } = await this.login({
				notify: (n) => send("notice", n),
				prompt: async () => {
					throw new Error("role: device flow does not prompt");
				}
			}, ac.signal);
			send("done", { login: login$1 });
		} catch (err) {
			send("error", { message: err instanceof Error ? err.message : String(err) });
		}
		res.end();
	}
	async login(interaction, signal) {
		return login({
			ctx: this.ctx,
			config: this.config,
			watchlist: this.watchlist
		}, interaction, signal);
	}
	async whoami() {
		return whoami({
			ctx: this.ctx,
			config: this.config,
			watchlist: this.watchlist
		});
	}
	async githubJson(path, init) {
		return githubJson({
			ctx: this.ctx,
			config: this.config,
			watchlist: this.watchlist
		}, path, init);
	}
};

//#endregion
export { KEY, Role as default, isMaintainer, parsePermission };