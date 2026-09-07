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
//#region src/github-bot/index.d.ts
interface CommitChange {
  path: string;
  content: string;
}
interface PullRequestResult {
  number: number;
  url: string;
  commitSha: string;
  branch: string;
  base: string;
}
interface CommitPullRequestInput {
  org: string;
  repo: string;
  base: string;
  branch: string;
  message: string;
  title: string;
  body: string;
  changes: CommitChange[];
}
declare class GitHubBot extends Service {
  static inject: string[];
  static Config: z<Config>;
  readonly config: Config;
  constructor(ctx: Context, config: Config);
  commitAndOpenPullRequest(input: CommitPullRequestInput): Promise<PullRequestResult>;
  private request;
}
declare module '@deepseek-ai/cordis' {
  interface Context {
    githubBot: GitHubBot;
  }
}
//#endregion
export { type CommitChange, type Config, GitHubBot as default, type OrgConfig, type PullRequestResult };
