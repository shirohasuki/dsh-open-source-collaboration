import { Context, Service } from "@deepseek-ai/cordis";
import z from "@deepseek-ai/schemastery";

//#region src/repository-manage/index.d.ts
interface Config {}
declare module '@deepseek-ai/cordis' {
  interface Context {
    repos: Repos;
  }
}
declare class Repos extends Service {
  static inject: string[];
  static Config: z<Config>;
  private readonly root;
  private readonly role;
  private selectedRepo;
  get watchlist(): readonly string[];
  get selected(): string | undefined;
  select(repo: string): string;
  constructor(ctx: Context, config: Config);
  private repoRef;
  /** Expected path for a configured repository reference. */
  path(name: string): string;
  /** Absolute path of an ensured repo; throws if not cloned yet. */
  get(name: string): string;
  /** Clone into workspace/<owner>/<repo> when absent; reuse existing git checkout. */
  ensure(name: string): string;
}
//#endregion
export { Config, Repos as default };