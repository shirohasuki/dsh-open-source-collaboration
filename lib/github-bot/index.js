import { Context, Service } from "@deepseek-ai/cordis";
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
	const signingInput = `${encode({
		alg: "RS256",
		typ: "JWT"
	})}.${encode({
		iat: now - 60,
		exp: now + 540,
		iss: appId
	})}`;
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
	return {
		token: result.token,
		expiresAt: result.expires_at
	};
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
			name: "github_bot_installation_token",
			description: "Mint a GitHub App installation token for a configured organization.",
			parameters: { org: {
				type: "string",
				required: true
			} },
			output: {
				schema: {
					type: "object",
					properties: {
						token: {
							type: "string",
							required: true
						},
						expiresAt: {
							type: "string",
							required: true
						},
						org: {
							type: "string",
							required: true
						}
					},
					additionalProperties: false
				},
				render: (_args, value) => [{
					type: "text",
					text: JSON.stringify(value)
				}]
			},
			execute: async ({ org }) => {
				const orgConfig = this.config.orgs[org];
				if (!orgConfig) throw new Error(`github-bot: unknown org ${org}`);
				return {
					...await createInstallationToken(orgConfig),
					org
				};
			}
		}));
		ctx.tools.register(defineTool({
			name: "github_bot_orgs",
			description: "List configured GitHub App organization logins.",
			parameters: {},
			output: {
				schema: {
					type: "array",
					items: { type: "string" }
				},
				render: (_args, value) => [{
					type: "text",
					text: JSON.stringify(value)
				}]
			},
			execute: async () => Object.keys(this.config.orgs)
		}));
	}
};

//#endregion
export { createAppJwt, createInstallationToken, GitHubBot as default, readPrivateKey };