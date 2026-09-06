import type { IncomingMessage, ServerResponse } from 'node:http'
import { Context, Service } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import z from '@deepseek-ai/schemastery'
import type {} from '@deepseek-ai/dsh-host-webserver'
import type { AuthorizationInteraction } from '@deepseek-ai/dsh-authorization'
import { KEY } from './constants.ts'
import { githubJson, login, runDeviceFlow, whoami } from './github.ts'
import type { Config } from './config.ts'
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
    repos: z.array(z.string()).default(['DangoSys/buckyball', 'DangoSys/harness']),
    scopes: z.string().default('read:user repo'),
    apiBaseUrl: z.string().default('https://api.github.com'),
    oauthBaseUrl: z.string().default('https://github.com'),
  })

  readonly config: Config

  get repos(): readonly string[] {
    return this.config.repos
  }

  constructor(ctx: Context, config: Config) {
    super(ctx, 'role')
    if (!config.clientId) throw new Error('role: clientId required')
    if (config.repos.length === 0) throw new Error('role: repos must be non-empty')
    for (const repo of config.repos) {
      if (!/^[^/]+\/[^/]+$/.test(repo)) throw new Error(`role: bad repo ${repo}`)
    }
    this.config = config

    ctx.authorization.registerFlow({
      key: KEY,
      label: 'GitHub (role)',
      methods: [{ id: 'oauth', label: 'Sign in with GitHub' }],
      run: async (session) => runDeviceFlow({ ctx: this.ctx, config: this.config }, session),
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
          },
          additionalProperties: false,
        },
        render: (_args, value) => [{ type: 'text', text: JSON.stringify(value) }],
      },
      execute: async () => whoami({ ctx: this.ctx, config: this.config }),
    }))

    ctx.effect(() => ctx.webServer.register({
      kind: 'exact',
      path: '/integrations/role/login',
      handler: (req, res) => void this.handleLogin(req, res),
    }), 'role: login')
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
    return login({ ctx: this.ctx, config: this.config }, interaction, signal)
  }

  async whoami(): Promise<{ login: string; maintainers: Record<string, boolean> }> {
    return whoami({ ctx: this.ctx, config: this.config })
  }

  async githubJson(path: string, init?: RequestInit): Promise<unknown> {
    return githubJson({ ctx: this.ctx, config: this.config }, path, init)
  }
}
