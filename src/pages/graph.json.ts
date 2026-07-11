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
  toursSchema,
} from '@lib/catalog/schema';
import snapshotRaw from '@data/portfolio.snapshot.json';
import enrichmentRaw from '@data/galaxy.enrichment.json';
import sectorsRaw from '@data/sectors.json';
import relationshipsRaw from '@data/relationships.json';
import toursRaw from '@data/tours.json';
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
  // Only tours whose stops all resolve to real slugs and that Fred marked
  // ready ship to the client; validate-graph already gates references at CI.
  const nodeSlugs = new Set(
    mergeCatalog(snapshot, enrichment, sectors).nodes.map((n) => n.slug),
  );
  const tours = toursSchema
    .parse(toursRaw)
    .tours.filter((t) => t.stops.every((s) => nodeSlugs.has(s.slug)));
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
    tours: tours.map((t) => ({
      id: t.id,
      title: t.title,
      promise: t.promise,
      stops: t.stops.map((s) => ({ slug: s.slug, narration: s.narration })),
    })),
  };

  return new Response(JSON.stringify(graph), {
    headers: { 'Content-Type': 'application/json' },
  });
};
