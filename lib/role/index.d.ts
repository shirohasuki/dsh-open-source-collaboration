import { Context, Service } from "@deepseek-ai/cordis";
import z from "@deepseek-ai/schemastery";
import * as _deepseek_ai_dsh_credentials0 from "@deepseek-ai/dsh-credentials";
import { AuthorizationInteraction } from "@deepseek-ai/dsh-authorization";

//#region src/role/config.d.ts
interface Config {
  clientId: string;
  repos: string[];
  scopes: string;
  apiBaseUrl: string;
  oauthBaseUrl: string;
}
//#endregion
//#region src/role/constants.d.ts
declare const KEY: _deepseek_ai_dsh_credentials0.CredentialKey;
//#endregion
//#region src/role/permissions.d.ts
declare function isMaintainer(permission: string): boolean;
declare function parsePermission(body: unknown): string;
//#endregion
//#region src/role/index.d.ts
declare module '@deepseek-ai/cordis' {
  interface Context {
    role: Role;
  }
}
declare class Role extends Service {
  static inject: string[];
  static Config: z<Config>;
  readonly config: Config;
  get repos(): readonly string[];
  constructor(ctx: Context, config: Config);
  private handleLogin;
  login(interaction: AuthorizationInteraction, signal?: AbortSignal): Promise<{
    login: string;
  }>;
  whoami(): Promise<{
    login: string;
    maintainers: Record<string, boolean>;
  }>;
  githubJson(path: string, init?: RequestInit): Promise<unknown>;
}
//#endregion
export { type Config, KEY, Role as default, isMaintainer, parsePermission };