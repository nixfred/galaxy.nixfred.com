// FR035/FR036 compare path over the real relationship graph.
import { describe, expect, it } from 'vitest';
import { shortestMeaningfulPath } from '@lib/graph/pathfind';
import { relationshipsSchema } from '@lib/catalog/schema';
import relationshipsRaw from '@data/relationships.json';

const edges = relationshipsSchema.parse(relationshipsRaw).edges;

describe('compare mode pathfinding (FR035, FR036)', () => {
  it('finds the hero-edge path Meet Larry to AI Infrastructure Portfolio', () => {
    const path = shortestMeaningfulPath(
      edges,
      'meet-larry',
      'ai-infrastructure-portfolio',
    );
    expect(path.found).toBe(true);
    // meet-larry -> build-your-own-larry -> ai-infrastructure-portfolio
    expect(path.slugs).toEqual([
      'meet-larry',
      'build-your-own-larry',
      'ai-infrastructure-portfolio',
    ]);
    expect(path.steps).toHaveLength(2);
    for (const step of path.steps) {
      expect(step.reason.length).toBeGreaterThan(8);
      expect(step.type).toBeTruthy();
    }
  });

  it('walks the intelligence pipeline end to end', () => {
    const path = shortestMeaningfulPath(edges, 'the-nix-times', 'ai-signal');
    expect(path.found).toBe(true);
    expect(path.slugs).toEqual(['the-nix-times', 'intel', 'ai-signal']);
  });

  it('reports no path rather than inventing one', () => {
    const path = shortestMeaningfulPath(edges, 'meet-larry', 'no-such-project');
    expect(path.found).toBe(false);
    expect(path.steps).toEqual([]);
  });

  it('is symmetric and deterministic', () => {
    const a = shortestMeaningfulPath(
      edges,
      'artemis-tracker',
      'where-physics-starts-sweating',
    );
    const b = shortestMeaningfulPath(
      edges,
      'where-physics-starts-sweating',
      'artemis-tracker',
    );
    expect(a.found).toBe(true);
    expect(b.found).toBe(true);
    expect(a.slugs.slice().reverse()).toEqual(b.slugs);
  });
});
