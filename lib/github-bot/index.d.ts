import { Context, Service } from "@deepseek-ai/cordis";
import z from "@deepseek-ai/schemastery";

//#region src/github-bot/config.d.ts
interface OrgConfig {
  appId: number;
  installationId: number;
  privateKeyFile: string;
  apiBaseUrl?: string;
}
interface Config {
  orgs: Record<string, OrgConfig>;
}
declare const Config: z<Config>;
//#endregion
//#region src/github-bot/token.d.ts
interface InstallationTokenConfig {
  appId: number;
  installationId: number;
  privateKeyFile: string;
  apiBaseUrl?: string;
}
interface InstallationToken {
  token: string;
  expiresAt: string;
}
declare function readPrivateKey(path: string): string;
declare function createAppJwt(appId: number, pem: string): string;
declare function createInstallationToken(config: InstallationTokenConfig): Promise<InstallationToken>;
//#endregion
//#region src/github-bot/index.d.ts
declare class GitHubBot extends Service {
  static inject: string[];
  static Config: z<Config>;
  readonly config: Config;
  constructor(ctx: Context, config: Config);
}
declare module '@deepseek-ai/cordis' {
  interface Context {
    githubBot: GitHubBot;
  }
}
//#endregion
export { type Config, type OrgConfig, createAppJwt, createInstallationToken, GitHubBot as default, readPrivateKey };