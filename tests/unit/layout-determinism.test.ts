// AC031 gate: same catalog revision, identical layout, every run.
import { describe, expect, it } from 'vitest';
import { mergeCatalog } from '@lib/catalog/merge';
import { layoutNodes, layoutHash } from '@lib/graph/layout';
import {
  snapshotSchema,
  enrichmentSchema,
  sectorsSchema,
} from '@lib/catalog/schema';
import snapshotRaw from '@data/portfolio.snapshot.json';
import enrichmentRaw from '@data/galaxy.enrichment.json';
import sectorsRaw from '@data/sectors.json';

const snapshot = snapshotSchema.parse(snapshotRaw);
const enrichment = enrichmentSchema.parse(enrichmentRaw).records;
const sectors = sectorsSchema.parse(sectorsRaw).sectors;

describe('layout determinism (AC031, FR006)', () => {
  it('produces an identical layout hash across independent runs', () => {
    const runA = layoutHash(
      layoutNodes(mergeCatalog(snapshot, enrichment, sectors).nodes, sectors),
    );
    const runB = layoutHash(
      layoutNodes(mergeCatalog(snapshot, enrichment, sectors).nodes, sectors),
    );
    expect(runA).toBe(runB);
  });

  it('positions every node inside its sector neighborhood', () => {
    const { nodes } = mergeCatalog(snapshot, enrichment, sectors);
    const positioned = layoutNodes(nodes, sectors);
    const anchors = new Map<string, { x: number; y: number; z: number }>(
      sectors.map((s) => [s.id, s.anchorPosition]),
    );
    for (const n of positioned) {
      const a = anchors.get(n.sector)!;
      const dist = Math.hypot(n.x - a.x, n.z - a.z);
      expect(dist, `${n.slug} strayed from sector ${n.sector}`).toBeLessThan(
        25,
      );
    }
  });

  it('changes the hash when a position-relevant input changes', () => {
    const base = mergeCatalog(snapshot, enrichment, sectors).nodes;
    const moved = base.map((n) =>
      n.slug === 'meet-larry' ? { ...n, weight: 0.05 } : n,
    );
    expect(layoutHash(layoutNodes(base, sectors))).not.toBe(
      layoutHash(layoutNodes(moved, sectors)),
    );
  });
});
