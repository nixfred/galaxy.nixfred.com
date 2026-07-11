// Sync the upstream catalog into the committed snapshot (DR001, DR002, DR009).
// The snapshot is the only file this script writes. It never touches the
// enrichment layer (AC033: sync never silently discards enrichment).
// Usage: bun run data:sync
import { snapshotEntrySchema, slugFromTitle } from '../src/lib/catalog/schema';

// The source repo nixfred/nixfred.github.io is private, but the catalog is
// published publicly by the live site itself, which is the canonical published
// artifact (DR001). The snapshot revision is the sha256 of the fetched bytes.
const UPSTREAM_URL = 'https://nixfred.com/portfolio.json';
const SNAPSHOT_PATH = new URL(
  '../src/data/portfolio.snapshot.json',
  import.meta.url,
);

async function main(): Promise<void> {
  const res = await fetch(UPSTREAM_URL, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`Upstream fetch failed: ${res.status} ${res.statusText}`);
  }
  const raw = await res.text();
  const hasher = new Bun.CryptoHasher('sha256');
  hasher.update(raw);
  const contentSha = hasher.digest('hex');
  const parsed = JSON.parse(raw) as { entries?: unknown[] };
  if (!Array.isArray(parsed.entries)) {
    throw new Error('Upstream portfolio.json has no entries array');
  }

  const entries = parsed.entries.map((e, i) => {
    const result = snapshotEntrySchema.safeParse(e);
    if (!result.success) {
      throw new Error(
        `Upstream entry ${i} failed validation: ${result.error.message}`,
      );
    }
    return result.data;
  });

  // Slug collision check (DR008).
  const seen = new Map<string, string>();
  for (const e of entries) {
    const slug = slugFromTitle(e.title);
    const prior = seen.get(slug);
    if (prior) {
      throw new Error(`Slug collision: "${prior}" and "${e.title}" -> ${slug}`);
    }
    seen.set(slug, e.title);
  }

  const snapshot = {
    meta: {
      source: 'nixfred/nixfred.github.io/portfolio.json' as const,
      sourceSha: contentSha,
      syncedAt: new Date().toISOString(),
      entryCount: entries.length,
    },
    entries,
  };

  // Change report (DR009): diff against the prior snapshot when one exists.
  let report = 'CATALOG SYNC REPORT\n';
  try {
    const prior = JSON.parse(
      await Bun.file(SNAPSHOT_PATH).text(),
    ) as typeof snapshot;
    const priorSlugs = new Set(
      prior.entries.map((e) => slugFromTitle(e.title)),
    );
    const nextSlugs = new Set(entries.map((e) => slugFromTitle(e.title)));
    const added = [...nextSlugs].filter((s) => !priorSlugs.has(s));
    const removed = [...priorSlugs].filter((s) => !nextSlugs.has(s));
    report += `prior: ${prior.entries.length} entries (sha ${prior.meta.sourceSha.slice(0, 7)})\n`;
    report += `next:  ${entries.length} entries (sha ${contentSha.slice(0, 7)})\n`;
    report += `added:   ${added.length ? added.join(', ') : 'none'}\n`;
    report += `removed: ${removed.length ? removed.join(', ') : 'none'}\n`;
  } catch {
    report += `initial sync: ${entries.length} entries (sha ${contentSha.slice(0, 7)})\n`;
  }

  await Bun.write(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2) + '\n');
  console.log(report);
  console.log(`Snapshot written: ${entries.length} entries.`);
}

await main();
