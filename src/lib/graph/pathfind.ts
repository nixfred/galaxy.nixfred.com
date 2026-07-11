// Compare mode pathfinding (FR035, FR036): the shortest meaningful path
// between two projects over the TYPED relationship graph, with a plain
// language explanation for every hop. Never invents a poetic connection: if
// no typed path exists, it says so. Breadth-first over undirected edges gives
// the fewest-hops path; ties break deterministically by slug for stable
// output (the layout is deterministic, so compare results are too).
import type { SceneEdge } from './types';

export interface PathStep {
  from: string;
  to: string;
  type: string;
  reason: string;
}

export interface ComparePath {
  found: boolean;
  slugs: string[];
  steps: PathStep[];
}

export function shortestMeaningfulPath(
  edges: SceneEdge[],
  from: string,
  to: string,
): ComparePath {
  if (from === to) return { found: true, slugs: [from], steps: [] };

  // Adjacency with the edge that produced each neighbor, so an explanation is
  // always available. Deterministic neighbor order by target slug.
  const adj = new Map<string, Array<{ to: string; edge: SceneEdge }>>();
  const add = (a: string, b: string, edge: SceneEdge): void => {
    if (!adj.has(a)) adj.set(a, []);
    adj.get(a)!.push({ to: b, edge });
  };
  for (const edge of edges) {
    add(edge.source, edge.target, edge);
    add(edge.target, edge.source, edge);
  }
  for (const list of adj.values()) {
    list.sort((x, y) => x.to.localeCompare(y.to));
  }

  const prev = new Map<string, { from: string; edge: SceneEdge }>();
  const visited = new Set<string>([from]);
  const queue: string[] = [from];
  while (queue.length) {
    const node = queue.shift()!;
    if (node === to) break;
    for (const { to: next, edge } of adj.get(node) ?? []) {
      if (visited.has(next)) continue;
      visited.add(next);
      prev.set(next, { from: node, edge });
      queue.push(next);
    }
  }

  if (!visited.has(to)) return { found: false, slugs: [], steps: [] };

  const slugs: string[] = [to];
  const steps: PathStep[] = [];
  let cursor = to;
  while (cursor !== from) {
    const back = prev.get(cursor)!;
    steps.unshift({
      from: back.from,
      to: cursor,
      type: back.edge.type,
      reason: back.edge.reason,
    });
    cursor = back.from;
    slugs.unshift(cursor);
  }
  return { found: true, slugs, steps };
}
