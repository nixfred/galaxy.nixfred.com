// Build metadata rendered into the shell and served at /build.json.
// The version identifier format is settled by decision F27: date plus short SHA.
// getBuildInfo runs at BUILD time (SSG frontmatter executes in node), so it
// reads process.env directly with the same derivation as
// scripts/generate-build-info.ts: the rendered footer (F32) and /build.json
// (AC050) can never disagree about identity. Local dev builds get honest
// development markers, never fabricated release values.
export interface BuildInfo {
  version: string;
  commit: string;
  builtAt: string;
  branch: string;
}

export function getBuildInfo(): BuildInfo {
  const commit = process.env.GITHUB_SHA ?? 'uncommitted';
  const branch = process.env.GITHUB_REF_NAME ?? 'local';
  const date = new Date().toISOString().slice(0, 10);
  const version =
    commit === 'uncommitted' ? 'dev-local' : `v${date}-${commit.slice(0, 7)}`;
  return {
    version,
    commit,
    builtAt: new Date().toISOString(),
    branch,
  };
}
