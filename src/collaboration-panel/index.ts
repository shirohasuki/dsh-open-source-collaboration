import type { IncomingMessage, ServerResponse } from 'node:http'
import { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-host-webserver'

export const name = 'collaboration-panel'
export const inject = ['role', 'webServer']

export type Kind = 'issue' | 'pr'

export interface BoardItem {
  repo: string
  kind: Kind
  number: number
  title: string
  author: string
  updatedAt: string
  url: string
}

export interface BoardError {
  repo: string
  kind: 'error'
  message: string
}

export type BoardEntry = BoardItem | BoardError

export interface BoardDetail extends BoardItem {
  state: string
  body: string
  labels: string[]
  assignees: string[]
  requestedReviewers: string[]
}

export function issueSearchQuery(repo: string, login: string): string {
  return `repo:${repo} is:issue is:open assignee:${login}`
}

export function prSearchQuery(repo: string, login: string): string {
  return `repo:${repo} is:pr is:open review-requested:${login}`
}

export function mapSearchItem(raw: any, kind: Kind): BoardItem {
  const m = String(raw.repository_url).match(/\/repos\/([^/]+\/[^/]+)$/)
  if (!m) throw new Error(`collaboration-panel: bad repository_url ${raw.repository_url}`)
  return {
    repo: m[1],
    kind,
    number: raw.number,
    title: raw.title,
    author: raw.user.login,
    updatedAt: raw.updated_at,
    url: raw.html_url,
  }
}

export function mapDetail(raw: any, repo: string, kind: Kind): BoardDetail {
  return {
    repo,
    kind,
    number: raw.number,
    title: raw.title,
    author: raw.user.login,
    updatedAt: raw.updated_at,
    url: raw.html_url,
    state: raw.state,
    body: raw.body == null ? '' : raw.body,
    labels: raw.labels.map((l: any) => l.name),
    assignees: raw.assignees.map((a: any) => a.login),
    requestedReviewers: kind === 'pr'
      ? raw.requested_reviewers.map((r: any) => r.login)
      : [],
  }
}

async function listItems(ctx: Context): Promise<BoardEntry[]> {
  const identity = await ctx.role.whoami()
  const permissionErrors = identity.errors
  const items: BoardEntry[] = []
  for (const repo of ctx.role.watchlist) {
    const permissionError = permissionErrors[repo]
    if (permissionError) {
      items.push({ repo, kind: 'error', message: permissionError.message })
      continue
    }
    try {
      for (const [kind, q] of [
        ['issue', issueSearchQuery(repo, identity.login)],
        ['pr', prSearchQuery(repo, identity.login)],
      ] as const) {
        const body: any = await ctx.role.githubJson(
          `/search/issues?q=${encodeURIComponent(q)}&per_page=50`,
        )
        for (const raw of body.items) items.push(mapSearchItem(raw, kind))
      }
    } catch (error) {
      if (!(error instanceof Error) || error.name !== 'GitHubHttpError') throw error
      const status = (error as Error & { status?: unknown }).status
      if (status !== 403 && status !== 404) throw error
      items.push({ repo, kind: 'error', message: error.message })
    }
  }
  items.sort((a, b) => {
    if (a.kind === 'error') return b.kind === 'error' ? a.repo.localeCompare(b.repo) : -1
    if (b.kind === 'error') return 1
    return b.updatedAt.localeCompare(a.updatedAt)
  })
  return items
}

async function getDetail(ctx: Context, repo: string, number: number): Promise<BoardDetail> {
  if (!ctx.role.watchlist.includes(repo)) throw new Error(`collaboration-panel: unknown repo ${repo}`)
  const [owner, name_] = repo.split('/')
  const issue: any = await ctx.role.githubJson(`/repos/${owner}/${name_}/issues/${number}`)
  if (issue.pull_request) {
    const pr: any = await ctx.role.githubJson(`/repos/${owner}/${name_}/pulls/${number}`)
    return mapDetail(pr, repo, 'pr')
  }
  return mapDetail(issue, repo, 'issue')
}

function write(res: ServerResponse, status: number, type: string, body: string) {
  res.writeHead(status, { 'content-type': type, 'cache-control': 'no-store' })
  res.end(body)
}

export function apply(ctx: Context) {
  // prefix matches /integrations/collaboration-panel/items and /integrations/collaboration-panel/items/<repo>/<n>
  ctx.effect(() => ctx.webServer.register({
    kind: 'prefix',
    path: '/integrations/collaboration-panel/items',
    handler: async (req: IncomingMessage, res: ServerResponse) => {
      try {
        const pathname = new URL(req.url!, 'http://local').pathname
        if (pathname === '/integrations/collaboration-panel/items') {
          write(res, 200, 'application/json; charset=utf-8', JSON.stringify(await listItems(ctx)))
          return
        }
        const rest = pathname.slice('/integrations/collaboration-panel/items/'.length)
        const slash = rest.lastIndexOf('/')
        if (slash <= 0) throw new Error(`collaboration-panel: bad path ${pathname}`)
        const repo = decodeURIComponent(rest.slice(0, slash))
        const number = Number(rest.slice(slash + 1))
        if (!Number.isInteger(number)) throw new Error(`collaboration-panel: bad number ${pathname}`)
        write(res, 200, 'application/json; charset=utf-8', JSON.stringify(await getDetail(ctx, repo, number)))
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        write(res, message.includes('not logged in') || message.startsWith('GitHub 401:') ? 401 : 500, 'text/plain; charset=utf-8', message)
      }
    },
  }), 'collaboration-panel: api')
}
