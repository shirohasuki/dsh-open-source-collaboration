import { Context, Service } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import z from '@deepseek-ai/schemastery'
import { Config } from './config.ts'
import { createInstallationToken } from './token.ts'
import type { OrgConfig } from './config.ts'

export type { Config, OrgConfig } from './config.ts'
export { createAppJwt, createInstallationToken, readPrivateKey } from './token.ts'

export default class GitHubBot extends Service {
  static inject = ['tools']
  static Config: z<Config> = Config

  declare readonly config: Config

  constructor(ctx: Context, config: Config) {
    super(ctx, 'githubBot')
    this.config = config

    ctx.tools.register(defineTool({
      name: 'github_bot_installation_token',
      description: 'Mint a GitHub App installation token for a configured organization.',
      parameters: {
        org: { type: 'string', required: true },
      },
      output: {
        schema: {
          type: 'object',
          properties: {
            token: { type: 'string', required: true },
            expiresAt: { type: 'string', required: true },
            org: { type: 'string', required: true },
          },
          additionalProperties: false,
        },
        render: (_args, value) => [{ type: 'text', text: JSON.stringify(value) }],
      },
      execute: async ({ org }) => {
        const orgConfig: OrgConfig | undefined = this.config.orgs[org]
        if (!orgConfig) throw new Error(`github-bot: unknown org ${org}`)
        const token = await createInstallationToken(orgConfig)
        return { ...token, org }
      },
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
}

declare module '@deepseek-ai/cordis' {
  interface Context {
    githubBot: GitHubBot
  }
}
