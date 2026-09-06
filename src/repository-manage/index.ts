import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Context, Service } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import z from '@deepseek-ai/schemastery'

/** harness repo root: packages/open-source-collaboration/lib -> ../../../.. */
const HARNESS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..')

export interface Config {}

declare module '@deepseek-ai/cordis' {
  interface Context {
    repos: Repos
  }
}

export default class Repos extends Service {
  static inject = ['tools', 'role']
  static Config: z<Config> = z.object({})

  private readonly root = join(HARNESS_ROOT, 'workspace')
  private readonly role: Context['role']
  private selectedRepo: string | undefined

  get watchlist(): readonly string[] {
    return this.role.watchlist
  }
  get selected(): string | undefined {
    return this.selectedRepo
  }

  select(repo: string): string {
    if (!this.role.watchlist.includes(repo)) throw new Error('unknown repo: ' + repo)
    this.selectedRepo = repo
    return repo
  }

  constructor(ctx: Context, config: Config) {
    super(ctx, 'repos')
    this.role = ctx.role

    ctx.tools.register(
      defineTool({
        name: 'ensure_repo',
        description: 'Clone a configured repository into workspace/<name> if missing. Returns the absolute path.',
        parameters: {
          name: {
            type: 'string',
            required: true,
            description: 'Repository name from the configured list, e.g. "buckyball"',
          },
        },
        output: {
          schema: { type: 'string' },
          render: (_args, value) => [{ type: 'text', text: value }],
        },
        execute: async args => this.ensure(args.name),
      }),
    )

    ctx.tools.register(
      defineTool({
        name: 'list_repos',
        description: 'List configured workspace repositories and whether each has been ensured.',
        parameters: {},
        output: {
          schema: { type: 'string' },
          render: (_args, value) => [{ type: 'text', text: value }],
        },
        execute: async () => {
          return this.role.watchlist
            .map(repo => {
              const name = repo.split('/')[1]
              const dir = join(this.root, name)
              const state = existsSync(join(dir, '.git')) ? 'ready' : 'missing'
              return `${name}\t${state}\t${dir}`
            })
            .join('\n')
        },
      }),
    )
  }

  private repoRef(name: string): string {
    const repo = this.role.watchlist.find(repo => repo.split('/')[1] === name)
    if (repo === undefined) throw new Error('unknown repo: ' + name)
    return repo
  }

  /** Expected path for a configured repo name. */
  path(name: string): string {
    const repoName = this.repoRef(name).split('/')[1]
    return join(this.root, repoName)
  }

  /** Absolute path of an ensured repo; throws if not cloned yet. */
  get(name: string): string {
    const dir = this.path(name)
    if (!existsSync(join(dir, '.git'))) {
      throw new Error(`repo not ensured: ${name}; call ensure_repo first`)
    }
    return dir
  }

  /** Clone into workspace/<name> when absent; reuse existing git checkout. */
  ensure(name: string): string {
    const dir = this.path(name)
    if (existsSync(dir)) {
      if (!existsSync(join(dir, '.git'))) {
        throw new Error(`${dir} exists but is not a git repository`)
      }
      return dir
    }
    mkdirSync(this.root, { recursive: true })
    const [owner, repoName] = this.repoRef(name).split('/')
    const result = spawnSync('git', ['clone', 'https://github.com/' + owner + '/' + repoName + '.git', dir], {
      stdio: 'inherit',
    })
    if (result.status !== 0) throw new Error(`git clone failed for ${name}`)
    return dir
  }
}
