// Data contracts per docs/DATA_MODEL.md. Every file that enters the build
// validates against these schemas; invalid data fails the build (DR007, DR008).
import { z } from 'zod';

// The six launch relation types, ruling R6 in docs/DECISIONS.md.
export const RELATION_TYPES = [
  'built_on',
  'shared_subject',
  'shared_technology',
  'client_work',
  'personal_history',
  'chronology',
] as const;

export const SECTOR_IDS = [
  'it',
  'labs',
  'work',
  'signal',
  'clients',
  'personal',
] as const;

export const STATUS_VALUES = [
  'active',
  'evolving',
  'archived',
  'client',
  'experiment',
  'memorial',
] as const;

// Provenance: who asserted a fact. "fred" is a direct decision, "inferred"
// is Larry's marked editorial judgment, "upstream" came from portfolio.json.
export const PROVENANCE = ['fred', 'inferred', 'upstream'] as const;

// One entry of the upstream portfolio.json snapshot. Field names mirror the
// upstream file exactly; the snapshot is written only by sync-catalog (DR002).
export const snapshotEntrySchema = z.object({
  title: z.string().min(1),
  url: z.string().url().startsWith('https://'),
  section: z.string().min(1),
  desc: z.string().min(1),
  path: z.string().optional(),
  tag: z.string().optional(),
  tagClass: z.string().optional(),
  hero: z.unknown().optional(),
  danger: z.unknown().optional(),
});

export const snapshotSchema = z.object({
  meta: z.object({
    source: z.literal('nixfred/nixfred.github.io/portfolio.json'),
    sourceSha: z.string().min(1),
    syncedAt: z.string().min(1),
    entryCount: z.number().int().positive(),
  }),
  entries: z.array(snapshotEntrySchema).min(1),
});

export const enrichmentRecordSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  status: z.enum(STATUS_VALUES).optional(),
  anchor: z.boolean().optional(),
  weight: z.number().min(0).max(1).optional(),
  sectorOverride: z.enum(SECTOR_IDS).optional(),
  launchDate: z
    .string()
    .regex(/^\d{4}(-\d{2})?(-\d{2})?$/)
    .optional(),
  technologies: z.array(z.string()).max(12).optional(),
  repoUrl: z.string().url().optional(),
  manualPosition: z
    .object({ x: z.number(), y: z.number(), z: z.number() })
    .optional(),
  longDescription: z.string().max(1200).optional(),
  provenance: z.enum(PROVENANCE),
  note: z.string().optional(),
});

export const enrichmentSchema = z.object({
  records: z.array(enrichmentRecordSchema),
});

export const relationshipSchema = z.object({
  source: z.string().min(1),
  target: z.string().min(1),
  type: z.enum(RELATION_TYPES),
  strength: z.number().min(0).max(1),
  reason: z.string().min(8),
  provenance: z.enum(PROVENANCE),
});

export const relationshipsSchema = z.object({
  edges: z.array(relationshipSchema),
});

export const sectorSchema = z.object({
  id: z.enum(SECTOR_IDS),
  label: z.string().min(1),
  mapLabel: z.string().min(1),
  colorToken: z.string().min(1),
  anchorPosition: z.object({ x: z.number(), y: z.number(), z: z.number() }),
  order: z.number().int().min(0),
  description: z.string().min(1),
  catalogSections: z.array(z.string().min(1)).min(1),
});

export const sectorsSchema = z.object({
  sectors: z.array(sectorSchema).length(6),
});

export const tourStopSchema = z.object({
  slug: z.string().min(1),
  narration: z.string().min(1).max(400),
});

export const tourSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  title: z.string().min(1),
  promise: z.string().min(1),
  status: z.enum(['draft', 'ready']),
  stops: z.array(tourStopSchema).min(3),
});

export const toursSchema = z.object({
  tours: z.array(tourSchema).min(3),
});

export const censusExclusionSchema = z.object({
  hostname: z.string().min(1),
  reason: z.string().min(8),
  addedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const censusExclusionsSchema = z.object({
  exclusions: z.array(censusExclusionSchema),
});

export type SnapshotEntry = z.infer<typeof snapshotEntrySchema>;
export type Snapshot = z.infer<typeof snapshotSchema>;
export type EnrichmentRecord = z.infer<typeof enrichmentRecordSchema>;
export type Relationship = z.infer<typeof relationshipSchema>;
export type Sector = z.infer<typeof sectorSchema>;
export type Tour = z.infer<typeof tourSchema>;

// Slug derivation: the stable identity rule from docs/DATA_MODEL.md.
// Lowercase, ASCII, kebab. Applied to upstream titles; collisions fail CI.
export function slugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}
