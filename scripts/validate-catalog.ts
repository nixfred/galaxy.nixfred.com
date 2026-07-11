// Catalog validation gate (DR007, DR008, and the F1 anchor assertion from
// docs/GATES.md section 2.11). Exits nonzero on any failure; CI blocks.
// Usage: bun run scripts/validate-catalog.ts [--snapshot path] [--enrichment path]
import {
  snapshotSchema,
  enrichmentSchema,
  slugFromTitle,
} from '../src/lib/catalog/schema';

// The seven Fred-provenance anchors, decision F1, 2026-07-11.
export const FRED_ANCHORS = [
  'meet-larry',
  'build-your-own-larry',
  'the-universe-as-i-see-it',
  'youtube-library',
  'sky-walrus',
  'where-physics-starts-sweating',
  'the-code-audit',
] as const;

function arg(name: string, fallback: string): string {
  const i = process.argv.indexOf(name);
  const value = i > -1 ? process.argv[i + 1] : undefined;
  return value ?? fallback;
}

const snapshotPath = arg('--snapshot', 'src/data/portfolio.snapshot.json');
const enrichmentPath = arg('--enrichment', 'src/data/galaxy.enrichment.json');

const failures: string[] = [];

const snapshotRaw = JSON.parse(await Bun.file(snapshotPath).text());
const snapshot = snapshotSchema.safeParse(snapshotRaw);
if (!snapshot.success) {
  failures.push(`snapshot schema: ${snapshot.error.message}`);
}

const enrichmentRaw = JSON.parse(await Bun.file(enrichmentPath).text());
const enrichment = enrichmentSchema.safeParse(enrichmentRaw);
if (!enrichment.success) {
  failures.push(`enrichment schema: ${enrichment.error.message}`);
}

if (snapshot.success && enrichment.success) {
  const slugs = new Set(
    snapshot.data.entries.map((e) => slugFromTitle(e.title)),
  );

  // Orphaned enrichment is retained, never silently discarded (AC033), but it
  // is loudly reported so a rename upstream cannot quietly strand curation.
  for (const rec of enrichment.data.records) {
    if (!slugs.has(rec.slug)) {
      failures.push(
        `enrichment slug "${rec.slug}" has no matching catalog entry (orphan; fix the slug or restore the upstream entry)`,
      );
    }
  }

  // F1 assertion: exactly the seven named anchors, all provenance fred.
  const anchors = enrichment.data.records.filter((r) => r.anchor === true);
  const anchorSlugs = anchors.map((a) => a.slug).sort();
  const expected = [...FRED_ANCHORS].sort();
  if (JSON.stringify(anchorSlugs) !== JSON.stringify(expected)) {
    failures.push(
      `F1 anchor set mismatch. expected [${expected.join(', ')}] got [${anchorSlugs.join(', ')}]`,
    );
  }
  for (const a of anchors) {
    if (a.provenance !== 'fred') {
      failures.push(`F1 anchor "${a.slug}" must carry provenance fred`);
    }
  }

  // Duplicate enrichment slugs (DR008).
  const seen = new Set<string>();
  for (const rec of enrichment.data.records) {
    if (seen.has(rec.slug))
      failures.push(`duplicate enrichment slug ${rec.slug}`);
    seen.add(rec.slug);
  }
}

if (failures.length) {
  console.error(`CATALOG VALIDATION FAILED (${failures.length}):`);
  for (const f of failures) console.error(` - ${f}`);
  process.exit(1);
}
console.log('catalog validation passed: snapshot, enrichment, F1 anchors.');
