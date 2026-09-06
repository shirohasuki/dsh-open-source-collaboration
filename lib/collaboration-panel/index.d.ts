import { Context } from "@deepseek-ai/cordis";

//#region src/collaboration-panel/index.d.ts
declare const name = "collaboration-panel";
declare const inject: string[];
type Kind = 'issue' | 'pr';
interface BoardItem {
  repo: string;
  kind: Kind;
  number: number;
  title: string;
  author: string;
  updatedAt: string;
  url: string;
}
interface BoardDetail extends BoardItem {
  state: string;
  body: string;
  labels: string[];
  assignees: string[];
  requestedReviewers: string[];
}
declare function issueSearchQuery(repo: string, login: string): string;
declare function prSearchQuery(repo: string, login: string): string;
declare function mapSearchItem(raw: any, kind: Kind): BoardItem;
declare function mapDetail(raw: any, repo: string, kind: Kind): BoardDetail;
declare function apply(ctx: Context): void;
//#endregion
export { BoardDetail, BoardItem, Kind, apply, inject, issueSearchQuery, mapDetail, mapSearchItem, name, prSearchQuery };