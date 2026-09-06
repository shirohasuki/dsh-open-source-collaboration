import { Context, Service } from "@deepseek-ai/cordis";
import z from "@deepseek-ai/schemastery";

//#region src/repository-manage/index.d.ts
interface Config {
  /** name -> git clone URL */
  repos: Record<string, string>;
}
declare module '@deepseek-ai/cordis' {
  interface Context {
    repos: Repos;
  }
}
declare class Repos extends Service {
  static inject: string[];
  static Config: z<Config>;
  private readonly root;
  private readonly urls;
  constructor(ctx: Context, config: Config);
  /** Expected path for a configured repo name. */
  path(name: string): string;
  /** Absolute path of an ensured repo; throws if not cloned yet. */
  get(name: string): string;
  /** Clone into workspace/<name> when absent; reuse existing git checkout. */
  ensure(name: string): string;
}
//#endregion
export { Config, Repos as default };