// Deterministic seeded layout (FR006-FR008, AC031, adr/0004).
// The same catalog revision produces the identical layout on every machine,
// every build, every test run. No Math.random, no clocks.
import type { GraphNode } from '../catalog/merge';
import type { Sector } from '../catalog/schema';

export interface PositionedNode extends GraphNode {
  x: number;
  y: number;
  z: number;
}

// mulberry32: tiny, fast, deterministic PRNG seeded from the node slug.
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedFromSlug(slug: string): number {
  let h = 2166136261;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function layoutNodes(
  nodes: GraphNode[],
  sectors: Sector[],
): PositionedNode[] {
  const anchorById = new Map<string, { x: number; y: number; z: number }>(
    sectors.map((s) => [s.id, s.anchorPosition]),
  );

  return nodes.map((node) => {
    const anchor = anchorById.get(node.sector);
    if (!anchor) throw new Error(`layout: unknown sector ${node.sector}`);
    const rand = mulberry32(seedFromSlug(node.slug));
    // Anchors sit closer to the sector core; small stars scatter wider.
    // Radius and angles derive only from the slug seed and the weight.
    const spread = 6 + (1 - node.weight) * 14;
    const angle = rand() * Math.PI * 2;
    const radius = 2 + rand() * spread;
    const depth = (rand() - 0.5) * 6;
    return {
      ...node,
      x: anchor.x + Math.cos(angle) * radius,
      y: anchor.y + depth,
      z: anchor.z + Math.sin(angle) * radius,
    };
  });
}

// Stable content hash of the positioned layout, used by the determinism gate
// (AC031): two independent runs over the same inputs must produce equal hashes.
export function layoutHash(nodes: PositionedNode[]): string {
  const canonical = nodes
    .slice()
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map(
      (n) => `${n.slug}:${n.x.toFixed(6)},${n.y.toFixed(6)},${n.z.toFixed(6)}`,
    )
    .join('|');
  let h = 2166136261;
  for (let i = 0; i < canonical.length; i++) {
    h ^= canonical.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16);
}
