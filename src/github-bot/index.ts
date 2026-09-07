import { Context, Service } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import z from '@deepseek-ai/schemastery'
import { Config } from './config.ts'
import { createInstallationToken } from './token.ts'
import type { OrgConfig } from './config.ts'

export type { Config, OrgConfig } from './config.ts'

export interface CommitChange {
  path: string
  content: string
}

export interface PullRequestResult {
  number: number
  url: string
  commitSha: string
  branch: string
  base: string
}

interface CommitPullRequestInput {
  org: string
  repo: string
  base: string
  branch: string
  message: string
  title: string
  body: string
  changes: CommitChange[]
}

export default class GitHubBot extends Service {
  static inject = ['tools']
  static Config: z<Config> = Config

  declare readonly config: Config

  constructor(ctx: Context, config: Config) {
    super(ctx, 'githubBot')
    this.config = config

    ctx.tools.register(defineTool({
      name: 'github_bot_commit_pull_request',
      description: 'Commit files, push a branch, and open a pull request with the configured GitHub App.',
      parameters: {
        org: { type: 'string', required: true },
        repo: { type: 'string', required: true, description: 'Repository in owner/name form.' },
        base: { type: 'string', required: true },
        branch: { type: 'string', required: true },
        message: { type: 'string', required: true },
        title: { type: 'string', required: true },
        body: { type: 'string', required: true },
        changes: {
          type: 'array',
          required: true,
          items: {
            type: 'object',
            properties: {
              path: { type: 'string', required: true },
              content: { type: 'string', required: true },
            },
            additionalProperties: false,
          },
        },
      },
      output: {
        schema: {
          type: 'object',
          properties: {
            number: { type: 'number', required: true },
            url: { type: 'string', required: true },
            commitSha: { type: 'string', required: true },
            branch: { type: 'string', required: true },
            base: { type: 'string', required: true },
          },
          additionalProperties: false,
        },
        render: (_args, value) => [{ type: 'text', text: JSON.stringify(value) }],
      },
      execute: async args => this.commitAndOpenPullRequest(args as CommitPullRequestInput),
    }))

    ctx.tools.register(defineTool({
      name: 'github_bot_orgs',
      description: 'List configured GitHub App organization logins.',
      parameters: {},
      output: {
        schema: { type: 'array', items: { type: 'string' } },
        render: (_args, value) => [{ type: 'text', text: JSON.stringify(value) }],
      },
      execute: async () => Object.keys(this.config.orgs),
    }))
  }

  async commitAndOpenPullRequest(input: CommitPullRequestInput): Promise<PullRequestResult> {
    const repoParts = input.repo?.split('/')
    if (!repoParts || repoParts.length !== 2 || repoParts.some(part => !part || part === '.' || part === '..')) {
      throw new Error('github-bot: repo must be in owner/name form')
    }
    if (!input.changes?.length) throw new Error('github-bot: changes must not be empty')
    const [owner, repo] = repoParts
    const orgConfig: OrgConfig | undefined = this.config.orgs[input.org]
    if (!orgConfig) throw new Error(`github-bot: unknown org ${input.org}`)
    const { token } = await createInstallationToken(orgConfig)
    const request = (path: string, init?: RequestInit) => this.request(orgConfig, token, path, init)
    const baseRef = await request(`/repos/${owner}/${repo}/git/ref/heads/${encodeURIComponent(input.base)}`) as { object: { sha: string } }
    const parentSha = baseRef.object.sha
    const parent = await request(`/repos/${owner}/${repo}/git/commits/${parentSha}`) as { tree: { sha: string } }
    const blobs = await Promise.all(input.changes.map(async change => {
      const blob = await request(`/repos/${owner}/${repo}/git/blobs`, {
        method: 'POST',
        body: JSON.stringify({ content: change.content, encoding: 'utf-8' }),
      }) as { sha: string }
      return { path: change.path, mode: '100644', type: 'blob', sha: blob.sha }
    }))
    const tree = await request(`/repos/${owner}/${repo}/git/trees`, {
      method: 'POST',
      body: JSON.stringify({ base_tree: parent.tree.sha, tree: blobs }),
    }) as { sha: string }
    const commit = await request(`/repos/${owner}/${repo}/git/commits`, {
      method: 'POST',
      body: JSON.stringify({ message: input.message, tree: tree.sha, parents: [parentSha] }),
    }) as { sha: string }
    await request(`/repos/${owner}/${repo}/git/refs`, {
      method: 'POST',
      body: JSON.stringify({ ref: `refs/heads/${input.branch}`, sha: commit.sha }),
    })
    const pull = await request(`/repos/${owner}/${repo}/pulls`, {
      method: 'POST',
      body: JSON.stringify({ title: input.title, body: input.body, head: input.branch, base: input.base }),
    }) as { number: number; html_url: string }
    return { number: pull.number, url: pull.html_url, commitSha: commit.sha, branch: input.branch, base: input.base }
  }

  private async request(config: OrgConfig, token: string, path: string, init?: RequestInit): Promise<unknown> {
    const headers = new Headers(init?.headers)
    headers.set('accept', 'application/vnd.github+json')
    headers.set('authorization', `Bearer ${token}`)
    headers.set('content-type', 'application/json')
    headers.set('x-github-api-version', '2022-11-28')
    const response = await fetch(`${config.apiBaseUrl ?? 'https://api.github.com'}${path}`, { ...init, headers })
    const text = await response.text()
    if (!response.ok) throw new Error(`github-bot: GitHub API ${response.status}: ${text}`)
    return text.length === 0 ? null : JSON.parse(text)
  }
}

declare module '@deepseek-ai/cordis' {
  interface Context {
    githubBot: GitHubBot
  }
}