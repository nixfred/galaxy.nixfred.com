// Writes dist/build.json (FR004, F27, F32, AC050) after the build.
// Version format per decision F27: v<date>-<short sha>. Values come from the
// environment CI provides; local runs get honest development markers, never
// fabricated release identity.
import { existsSync } from 'node:fs';

const commit = process.env.GITHUB_SHA ?? 'uncommitted';
const branch =
  process.env.GITHUB_REF_NAME ?? process.env.BRANCH_NAME ?? 'local';
const builtAt = new Date().toISOString();
const short = commit === 'uncommitted' ? 'dev' : commit.slice(0, 7);
const date = builtAt.slice(0, 10);
const version = commit === 'uncommitted' ? 'dev-local' : `v${date}-${short}`;

let catalogRevision = 'unsynced';
try {
  const snap = JSON.parse(
    await Bun.file('src/data/portfolio.snapshot.json').text(),
  ) as { meta?: { sourceSha?: string } };
  catalogRevision = snap.meta?.sourceSha?.slice(0, 12) ?? 'unsynced';
} catch {
  // Honest default stands.
}

const info = { version, commit, builtAt, branch, catalogRevision };

if (!existsSync('dist')) {
  console.error('generate-build-info: dist/ not found; run build first');
  process.exit(1);
}
await Bun.write('dist/build.json', JSON.stringify(info, null, 2) + '\n');
console.log(
  `build.json written: ${version} (${branch}, catalog ${catalogRevision})`,
);
