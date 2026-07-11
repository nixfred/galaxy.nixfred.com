// Build metadata rendered into the shell and served at /build.json.
// The version identifier format is settled by decision F27: date plus short SHA.
// Values are injected by scripts/generate-build-info.ts during CI; local dev
// falls back to marked development values, never fabricated release values.
export interface BuildInfo {
  version: string;
  commit: string;
  builtAt: string;
  branch: string;
  catalogRevision: string;
}

export function getBuildInfo(): BuildInfo {
  return {
    version: import.meta.env.PUBLIC_BUILD_VERSION ?? 'dev-local',
    commit: import.meta.env.PUBLIC_BUILD_COMMIT ?? 'uncommitted',
    builtAt: import.meta.env.PUBLIC_BUILD_TIME ?? 'not-a-release',
    branch: import.meta.env.PUBLIC_BUILD_BRANCH ?? 'local',
    catalogRevision: import.meta.env.PUBLIC_CATALOG_REVISION ?? 'unsynced',
  };
}
