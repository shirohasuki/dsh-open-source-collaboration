import { Context, Service } from "@deepseek-ai/cordis";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineTool } from "@deepseek-ai/dsh-tools";
import z from "@deepseek-ai/schemastery";

//#region src/repo-ref.ts
const SAFE_REPO_SEGMENT = /^[A-Za-z0-9._-]+$/;
function isRepoRef(value) {
	if (typeof value !== "string") return false;
	const parts = value.split("/");
	return parts.length === 2 && parts.every((part) => part !== "." && part !== ".." && SAFE_REPO_SEGMENT.test(part));
}

//#endregion
//#region src/repository-manage/index.ts
/** harness repo root: packages/open-source-collaboration/lib -> ../../../.. */
const HARNESS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../../..");
var Repos = class extends Service {
	static inject = ["tools", "role"];
	static Config = z.object({});
	root = join(HARNESS_ROOT, "workspace");
	role;
	selectedRepo;
	get watchlist() {
		return this.role.watchlist;
	}
	get selected() {
		return this.selectedRepo;
	}
	select(repo) {
		this.repoRef(repo);
		this.selectedRepo = repo;
		return repo;
	}
	constructor(ctx, config) {
		super(ctx, "repos");
		this.role = ctx.role;
		ctx.tools.register(defineTool({
			name: "ensure_repo",
			description: "Clone a configured repository into workspace/<owner>/<repo> if missing. Returns the absolute path.",
			parameters: { name: {
				type: "string",
				required: true,
				description: "Repository reference from the configured list, e.g. DangoSys/buckyball"
			} },
			output: {
				schema: { type: "string" },
				render: (_args, value) => [{
					type: "text",
					text: value
				}]
			},
			execute: async (args) => this.ensure(args.name)
		}));
		ctx.tools.register(defineTool({
			name: "list_repos",
			description: "List configured workspace repositories and whether each has been ensured.",
			parameters: {},
			output: {
				schema: { type: "string" },
				render: (_args, value) => [{
					type: "text",
					text: value
				}]
			},
			execute: async () => {
				return this.role.watchlist.map((repo) => {
					const dir = join(this.root, repo);
					return `${repo}\t${existsSync(join(dir, ".git")) ? "ready" : "missing"}\t${dir}`;
				}).join("\n");
			}
		}));
	}
	repoRef(name) {
		if (!isRepoRef(name)) throw new Error("invalid repo ref: " + name);
		if (!this.role.watchlist.includes(name)) throw new Error("unknown repo: " + name);
		return name;
	}
	/** Expected path for a configured repository reference. */
	path(name) {
		return join(this.root, this.repoRef(name));
	}
	/** Absolute path of an ensured repo; throws if not cloned yet. */
	get(name) {
		const dir = this.path(name);
		if (!existsSync(join(dir, ".git"))) throw new Error(`repo not ensured: ${name}; call ensure_repo first`);
		return dir;
	}
	/** Clone into workspace/<owner>/<repo> when absent; reuse existing git checkout. */
	async ensure(name) {
		const dir = this.path(name);
		if (existsSync(dir)) {
			if (!existsSync(join(dir, ".git"))) throw new Error(`${dir} exists but is not a git repository`);
			return dir;
		}
		mkdirSync(dirname(dir), { recursive: true });
		const cloneUrl = await this.role.githubCloneUrl(this.repoRef(name));
		if (spawnSync("git", ["clone", cloneUrl, dir], { stdio: "inherit" }).status !== 0) throw new Error(`git clone failed for ${name}`);
		return dir;
	}
};

//#endregion
export { Repos as default };
