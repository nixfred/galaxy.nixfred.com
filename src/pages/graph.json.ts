// Static graph artifact for the client-side scene (docs/ARCHITECTURE.md
// section 5, docs/DATA_MODEL.md section 9). Astro emits this as a build-time
// static file; GalaxyStage's controller fetches it once during hydration.
// Not a live upstream call (DR010): generated from the same committed data
// and the same merge.ts/layout.ts code path the SSG pages already run.
import type { APIRoute } from 'astro';
import { mergeCatalog } from '@lib/catalog/merge';
import { layoutNodes } from '@lib/graph/layout';
import {
  snapshotSchema,
  enrichmentSchema,
  sectorsSchema,
  relationshipsSchema,
} from '@lib/catalog/schema';
import snapshotRaw from '@data/portfolio.snapshot.json';
import enrichmentRaw from '@data/galaxy.enrichment.json';
import sectorsRaw from '@data/sectors.json';
import relationshipsRaw from '@data/relationships.json';
import type { GalaxyGraph } from '@lib/graph/types';

export const prerender = true;

export const GET: APIRoute = () => {
  const snapshot = snapshotSchema.parse(snapshotRaw);
  const enrichment = enrichmentSchema.parse(enrichmentRaw).records;
  const sectors = sectorsSchema
    .parse(sectorsRaw)
    .sectors.slice()
    .sort((a, b) => a.order - b.order);
  const edges = relationshipsSchema.parse(relationshipsRaw).edges;
  const { nodes } = mergeCatalog(snapshot, enrichment, sectors);
  const positioned = layoutNodes(nodes, sectors);

  const graph: GalaxyGraph = {
    catalogRevision: snapshot.meta.sourceSha.slice(0, 12),
    generatedAt: new Date().toISOString(),
    nodes: positioned.map((n) => ({
      slug: n.slug,
      title: n.title,
      url: n.url,
      desc: n.desc,
      sector: n.sector,
      featured: n.featured,
      anchor: n.anchor,
      weight: n.weight,
      status: n.status,
      position: { x: n.x, y: n.y, z: n.z },
    })),
    edges,
    sectors: sectors.map((s) => ({
      id: s.id,
      label: s.label,
      mapLabel: s.mapLabel,
      colorToken: s.colorToken,
      anchorPosition: s.anchorPosition,
      order: s.order,
    })),
  };

  return new Response(JSON.stringify(graph), {
    headers: { 'Content-Type': 'application/json' },
  });
};
