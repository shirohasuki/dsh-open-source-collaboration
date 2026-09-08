//#region src/repo-ref.ts
const SAFE_REPO_SEGMENT = /^[A-Za-z0-9._-]+$/;
function isRepoRef(value) {
	if (typeof value !== "string") return false;
	const parts = value.split("/");
	return parts.length === 2 && parts.every((part) => part !== "." && part !== ".." && SAFE_REPO_SEGMENT.test(part));
}

//#endregion
export { isRepoRef as t };