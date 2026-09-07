import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Context, Service } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import z from '@deepseek-ai/schemastery'
import { isRepoRef } from '../repo-ref.ts'

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
    this.repoRef(repo)
    this.selectedRepo = repo
    return repo
  }

  constructor(ctx: Context, config: Config) {
    super(ctx, 'repos')
    this.role = ctx.role

    ctx.tools.register(
      defineTool({
        name: 'ensure_repo',
        description: 'Clone a configured repository into workspace/<owner>/<repo> if missing. Returns the absolute path.',
        parameters: {
          name: {
            type: 'string',
            required: true,
            description: 'Repository reference from the configured list, e.g. "DangoSys/buckyball"',
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
              const dir = join(this.root, repo)
              const state = existsSync(join(dir, '.git')) ? 'ready' : 'missing'
              return `${repo}\t${state}\t${dir}`
            })
            .join('\n')
        },
      }),
    )
  }

  private repoRef(name: string): string {
    if (!isRepoRef(name)) throw new Error('invalid repo ref: ' + name)
    if (!this.role.watchlist.includes(name)) throw new Error('unknown repo: ' + name)
    return name
  }

  /** Expected path for a configured repository reference. */
  path(name: string): string {
    return join(this.root, this.repoRef(name))
  }

  /** Absolute path of an ensured repo; throws if not cloned yet. */
  get(name: string): string {
    const dir = this.path(name)
    if (!existsSync(join(dir, '.git'))) {
      throw new Error(`repo not ensured: ${name}; call ensure_repo first`)
    }
    return dir
  }

  /** Clone into workspace/<owner>/<repo> when absent; reuse existing git checkout. */
  ensure(name: string): string {
    const dir = this.path(name)
    if (existsSync(dir)) {
      if (!existsSync(join(dir, '.git'))) {
        throw new Error(`${dir} exists but is not a git repository`)
      }
      return dir
    }
    mkdirSync(dirname(dir), { recursive: true })
    const [owner, repoName] = this.repoRef(name).split('/')
    const result = spawnSync('git', ['clone', 'https://github.com/' + owner + '/' + repoName + '.git', dir], {
      stdio: 'inherit',
    })
    if (result.status !== 0) throw new Error(`git clone failed for ${name}`)
    return dir
  }
}
