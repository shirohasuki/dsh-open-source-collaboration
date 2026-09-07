import type { IncomingMessage, ServerResponse } from 'node:http'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { Context, Service } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import z from '@deepseek-ai/schemastery'
import type {} from '@deepseek-ai/dsh-host-webserver'
import type { AuthorizationInteraction } from '@deepseek-ai/dsh-authorization'
import { KEY } from './constants.ts'
import { githubCloneUrl, githubJson, login, runDeviceFlow, whoami, type WhoamiResult } from './github.ts'
import type { Config } from './config.ts'
import { isRepoRef } from '../repo-ref.ts'
export { KEY } from './constants.ts'
export type { Config } from './config.ts'

declare module '@deepseek-ai/cordis' {
  interface Context {
    role: Role
  }
}

export { isMaintainer, parsePermission } from './permissions.ts'

export default class Role extends Service {
  static inject = ['tools', 'authorization', 'credentials', 'webServer']
  static Config: z<Config> = z.object({
    clientId: z.string().default('Ov23lixMRqTArZkZ92EI'),
    scopes: z.string().default('read:user repo'),
    apiBaseUrl: z.string().default('https://api.github.com'),
    oauthBaseUrl: z.string().default('https://github.com'),
  })

  readonly config: Config
  private readonly reposPath: string

  get watchlist(): readonly string[] {
    return this.loadRepos()
  }

  constructor(ctx: Context, config: Config) {
    super(ctx, 'role')
    if (!config.clientId) throw new Error('role: clientId required')
    this.config = config
    const dshHome = process.env.DSH_HOME
    if (!dshHome) throw new Error('role: DSH_HOME required')
    this.reposPath = join(dshHome, 'open-source-collaboration', 'repos.json')
    mkdirSync(dirname(this.reposPath), { recursive: true })
    if (!existsSync(this.reposPath)) this.saveRepos([])

    ctx.authorization.registerFlow({
      key: KEY,
      label: 'GitHub (role)',
      methods: [{ id: 'oauth', label: 'Sign in with GitHub' }],
      run: async (session) => runDeviceFlow({ ctx: this.ctx, config: this.config, watchlist: this.watchlist }, session),
    })

    ctx.tools.register(defineTool({
      name: 'role_whoami',
      description: 'Return GitHub login and maintainer map for configured repos. Throws if not logged in.',
      parameters: {},
      output: {
        schema: {
          type: 'object',
          properties: {
            login: { type: 'string', required: true },
            maintainers: { type: 'json', required: true },
            errors: { type: 'json', required: true },
          },
          additionalProperties: false,
        },
        render: (_args, value) => [{ type: 'text', text: JSON.stringify(value) }],
      },
      execute: async () => whoami({ ctx: this.ctx, config: this.config, watchlist: this.watchlist }),
    }))

    ctx.effect(() => ctx.webServer.register({
      kind: 'exact',
      path: '/integrations/role/login',
      handler: (req, res) => void this.handleLogin(req, res),
    }), 'role: login')

    ctx.effect(() => ctx.webServer.register({
      kind: 'exact',
      path: '/integrations/role/repos',
      handler: (req, res) => void this.handleRepos(req, res),
    }), 'role: repos')
  }

  private loadRepos(): string[] {
    const value: unknown = JSON.parse(readFileSync(this.reposPath, 'utf8'))
    if (!Array.isArray(value)) throw new Error('role: repos file must contain an array: ' + this.reposPath)
    for (const repo of value) {
      if (!isRepoRef(repo)) throw new Error('role: bad repo ' + String(repo) + '; expected owner/name with safe path segments')
    }
    return value
  }

  private saveRepos(repos: string[]): void {
    writeFileSync(this.reposPath, JSON.stringify(repos, null, 2) + '\n')
  }

  private async handleRepos(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      if (req.method === 'GET') {
        res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
        res.end(JSON.stringify(this.watchlist))
        return
      }
      if (req.method !== 'POST' && req.method !== 'PUT' && req.method !== 'DELETE') {
        res.writeHead(405, { 'content-type': 'text/plain; charset=utf-8' })
        res.end('method not allowed')
        return
      }
      const chunks: Buffer[] = []
      for await (const chunk of req) chunks.push(Buffer.from(chunk))
      const body = JSON.parse(Buffer.concat(chunks).toString('utf8')) as { repo?: unknown }
      if (!isRepoRef(body.repo)) throw new Error('role: bad repo ' + String(body.repo) + '; expected owner/name with safe path segments')
      const repos = this.watchlist
      if (req.method === 'DELETE') this.saveRepos(repos.filter(repo => repo !== body.repo))
      else if (!repos.includes(body.repo)) this.saveRepos([...repos, body.repo])
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
      res.end(JSON.stringify(this.watchlist))
    } catch (err) {
      res.writeHead(400, { 'content-type': 'text/plain; charset=utf-8' })
      res.end(err instanceof Error ? err.message : String(err))
    }
  }

  private async handleLogin(req: IncomingMessage, res: ServerResponse): Promise<void> {
    if (req.method !== 'POST') {
      res.writeHead(405, { 'content-type': 'text/plain; charset=utf-8' })
      res.end('POST only')
      return
    }
    res.writeHead(200, {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-store',
      connection: 'keep-alive',
    })
    const send = (event: string, data: unknown) => {
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
    }
    const ac = new AbortController()
    req.on('close', () => ac.abort())
    try {
      const { login } = await this.login({
        notify: (n) => send('notice', n),
        prompt: async () => {
          throw new Error('role: device flow does not prompt')
        },
      }, ac.signal)
      send('done', { login })
    } catch (err) {
      send('error', { message: err instanceof Error ? err.message : String(err) })
    }
    res.end()
  }

  async login(interaction: AuthorizationInteraction, signal?: AbortSignal): Promise<{ login: string }> {
    return login({ ctx: this.ctx, config: this.config, watchlist: this.watchlist }, interaction, signal)
  }

  async whoami(): Promise<WhoamiResult> {
    return whoami({ ctx: this.ctx, config: this.config, watchlist: this.watchlist })
  }

  async githubJson(path: string, init?: RequestInit): Promise<unknown> {
    return githubJson({ ctx: this.ctx, config: this.config, watchlist: this.watchlist }, path, init)
  }

  async githubCloneUrl(repo: string): Promise<string> {
    return githubCloneUrl({ ctx: this.ctx, config: this.config, watchlist: this.watchlist }, repo)
  }
}
