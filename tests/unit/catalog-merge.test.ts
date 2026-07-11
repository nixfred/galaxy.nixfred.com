// Merge integrity: real data joins cleanly, invalid fixtures fail loudly.
import { describe, expect, it } from 'vitest';
import { mergeCatalog } from '@lib/catalog/merge';
import {
  snapshotSchema,
  enrichmentSchema,
  sectorsSchema,
  slugFromTitle,
} from '@lib/catalog/schema';
import snapshotRaw from '@data/portfolio.snapshot.json';
import enrichmentRaw from '@data/galaxy.enrichment.json';
import sectorsRaw from '@data/sectors.json';
import invalidCatalog from '../fixtures/catalog-invalid.json';

const snapshot = snapshotSchema.parse(snapshotRaw);
const enrichment = enrichmentSchema.parse(enrichmentRaw).records;
const sectors = sectorsSchema.parse(sectorsRaw).sectors;

describe('catalog merge (DR003, AC002)', () => {
  it('produces one node per catalog entry, no drops, no inventions', () => {
    const { nodes } = mergeCatalog(snapshot, enrichment, sectors);
    expect(nodes.length).toBe(snapshot.entries.length);
    const slugs = new Set(nodes.map((n) => n.slug));
    for (const e of snapshot.entries) {
      expect(slugs.has(slugFromTitle(e.title))).toBe(true);
    }
  });

  it('carries the seven F1 anchors with full weight', () => {
    const { nodes } = mergeCatalog(snapshot, enrichment, sectors);
    const anchors = nodes.filter((n) => n.anchor);
    expect(anchors.length).toBe(7);
    for (const a of anchors) expect(a.weight).toBe(1);
  });

  it('maps every node to one of the six sectors', () => {
    const { nodes } = mergeCatalog(snapshot, enrichment, sectors);
    const valid = new Set<string>(sectors.map((s) => s.id));
    for (const n of nodes) expect(valid.has(n.sector)).toBe(true);
  });

  it('reports orphaned enrichment instead of silently dropping it (AC033)', () => {
    const withOrphan = [
      ...enrichment,
      {
        slug: 'no-such-project',
        provenance: 'inferred' as const,
      },
    ];
    const { orphanedEnrichment } = mergeCatalog(snapshot, withOrphan, sectors);
    expect(orphanedEnrichment).toContain('no-such-project');
  });

  it('rejects an invalid catalog fixture (FR063 negative test)', () => {
    expect(() => snapshotSchema.parse(invalidCatalog)).toThrow();
  });
});
