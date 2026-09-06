import { Context } from "@deepseek-ai/cordis";

//#region src/collaboration-panel/index.ts
const name = "collaboration-panel";
const inject = ["role", "webServer"];
function issueSearchQuery(repo, login) {
	return `repo:${repo} is:issue is:open assignee:${login}`;
}
function prSearchQuery(repo, login) {
	return `repo:${repo} is:pr is:open review-requested:${login}`;
}
function mapSearchItem(raw, kind) {
	const m = String(raw.repository_url).match(/\/repos\/([^/]+\/[^/]+)$/);
	if (!m) throw new Error(`collaboration-panel: bad repository_url ${raw.repository_url}`);
	return {
		repo: m[1],
		kind,
		number: raw.number,
		title: raw.title,
		author: raw.user.login,
		updatedAt: raw.updated_at,
		url: raw.html_url
	};
}
function mapDetail(raw, repo, kind) {
	return {
		repo,
		kind,
		number: raw.number,
		title: raw.title,
		author: raw.user.login,
		updatedAt: raw.updated_at,
		url: raw.html_url,
		state: raw.state,
		body: raw.body == null ? "" : raw.body,
		labels: raw.labels.map((l) => l.name),
		assignees: raw.assignees.map((a) => a.login),
		requestedReviewers: kind === "pr" ? raw.requested_reviewers.map((r) => r.login) : []
	};
}
async function listItems(ctx) {
	const { login } = await ctx.role.whoami();
	const items = [];
	for (const repo of ctx.role.repos) for (const [kind, q] of [["issue", issueSearchQuery(repo, login)], ["pr", prSearchQuery(repo, login)]]) {
		const body = await ctx.role.githubJson(`/search/issues?q=${encodeURIComponent(q)}&per_page=50`);
		for (const raw of body.items) items.push(mapSearchItem(raw, kind));
	}
	items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
	return items;
}
async function getDetail(ctx, repo, number) {
	if (!ctx.role.repos.includes(repo)) throw new Error(`collaboration-panel: unknown repo ${repo}`);
	const [owner, name_] = repo.split("/");
	const issue = await ctx.role.githubJson(`/repos/${owner}/${name_}/issues/${number}`);
	if (issue.pull_request) return mapDetail(await ctx.role.githubJson(`/repos/${owner}/${name_}/pulls/${number}`), repo, "pr");
	return mapDetail(issue, repo, "issue");
}
function write(res, status, type, body) {
	res.writeHead(status, {
		"content-type": type,
		"cache-control": "no-store"
	});
	res.end(body);
}
function apply(ctx) {
	ctx.effect(() => ctx.webServer.register({
		kind: "prefix",
		path: "/integrations/collaboration-panel/items",
		handler: async (req, res) => {
			try {
				const pathname = new URL(req.url, "http://local").pathname;
				if (pathname === "/integrations/collaboration-panel/items") {
					write(res, 200, "application/json; charset=utf-8", JSON.stringify(await listItems(ctx)));
					return;
				}
				const rest = pathname.slice(40);
				const slash = rest.lastIndexOf("/");
				if (slash <= 0) throw new Error(`collaboration-panel: bad path ${pathname}`);
				const repo = decodeURIComponent(rest.slice(0, slash));
				const number = Number(rest.slice(slash + 1));
				if (!Number.isInteger(number)) throw new Error(`collaboration-panel: bad number ${pathname}`);
				write(res, 200, "application/json; charset=utf-8", JSON.stringify(await getDetail(ctx, repo, number)));
			} catch (err) {
				const message = err instanceof Error ? err.message : String(err);
				write(res, message.includes("not logged in") ? 401 : 500, "text/plain; charset=utf-8", message);
			}
		}
	}), "collaboration-panel: api");
}

//#endregion
export { apply, inject, issueSearchQuery, mapDetail, mapSearchItem, name, prSearchQuery };