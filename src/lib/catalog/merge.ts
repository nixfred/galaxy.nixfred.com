// Build-time join of snapshot + enrichment + sectors into graph nodes
// (docs/DATA_MODEL.md, docs/ARCHITECTURE.md data flow). Pure and deterministic:
// no clocks, no randomness beyond the seeded layout in layout.ts.
import type { Snapshot, EnrichmentRecord, Sector } from './schema';
import { slugFromTitle } from './schema';

export interface GraphNode {
  slug: string;
  title: string;
  url: string;
  desc: string;
  sector: string;
  featured: boolean;
  anchor: boolean;
  weight: number;
  status?: string | undefined;
  launchDate?: string | undefined;
  technologies?: string[] | undefined;
  repoUrl?: string | undefined;
}

export interface MergeResult {
  nodes: GraphNode[];
  orphanedEnrichment: string[];
}

export function mergeCatalog(
  snapshot: Snapshot,
  enrichment: EnrichmentRecord[],
  sectors: Sector[],
): MergeResult {
  const bySlug = new Map(enrichment.map((r) => [r.slug, r]));
  const sectionToSector = new Map<string, string>();
  for (const s of sectors) {
    for (const cs of s.catalogSections) sectionToSector.set(cs, s.id);
  }

  const nodes: GraphNode[] = snapshot.entries.map((e) => {
    const slug = slugFromTitle(e.title);
    const rec = bySlug.get(slug);
    const featured = e.section === 'Featured';
    const sector =
      rec?.sectorOverride ?? sectionToSector.get(e.section) ?? 'unmapped';
    if (sector === 'unmapped') {
      // Featured entries without an override, or unknown sections, must fail
      // the build rather than render mislabeled (DR008, FR063).
      throw new Error(
        `No sector for "${e.title}" (section "${e.section}"). Featured entries need an enrichment sectorOverride.`,
      );
    }
    return {
      slug,
      title: e.title,
      url: e.url,
      desc: e.desc,
      sector,
      featured,
      anchor: rec?.anchor ?? false,
      // Weight: anchors carry Fred's weight, others a modest default that the
      // renderer treats as a small star. Not invented importance, a floor.
      weight: rec?.weight ?? 0.3,
      status: rec?.status,
      launchDate: rec?.launchDate,
      technologies: rec?.technologies,
      repoUrl: rec?.repoUrl,
    };
  });

  const nodeSlugs = new Set(nodes.map((n) => n.slug));
  const orphanedEnrichment = enrichment
    .filter((r) => !nodeSlugs.has(r.slug))
    .map((r) => r.slug);

  return { nodes, orphanedEnrichment };
}
