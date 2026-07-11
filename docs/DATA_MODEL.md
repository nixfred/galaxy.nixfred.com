# DATA MODEL

Status: Approved data architecture for implementation. Read alongside `docs/ARCHITECTURE.md` section 5, which explains how these files are combined at build time.

## 1. Ownership model

There is exactly one canonical identity source for a project: `nixfred/nixfred.github.io/portfolio.json`, referenced here as upstream. Galaxy never maintains a second master list (AC003, non negotiable principle 1 in the execution directive). Every file under `src/data/` is either a read only snapshot of upstream, or Galaxy specific information keyed by a stable slug that Galaxy itself owns. Nothing in this document invents upstream's exact current field names; those are confirmed by `scripts/sync-catalog.ts` against the live file at sync time, and any field named below as upstream owned is a contract Galaxy requires from upstream, not a transcription of a schema this document has inspected directly. Where that distinction matters, it is called out.

| File | Owner | Committed to git |
|---|---|---|
| `src/data/portfolio.snapshot.json` | Upstream (mirrored) | Yes, DR002 |
| `src/data/galaxy.enrichment.json` | Galaxy | Yes |
| `src/data/relationships.json` | Galaxy | Yes |
| `src/data/sectors.json` | Galaxy | Yes |
| `src/data/tours.json` | Galaxy | Yes |
| `src/content/projects/<slug>.md` | Galaxy (editorial) | Yes |
| generated graph artifact | Derived | No, build time only |

## 2. `portfolio.snapshot.json`

A committed, read only copy of the upstream catalog, refreshed only by the scheduled sync workflow (section 8). Galaxy's build never fetches this data live (DR001, DR002, DR010).

Minimum contract Galaxy requires from every upstream record, confirmed by the main site integration requirements IN002 to IN006, which describe adding an object to this file "using the existing schema" with a title, a tag, a section, and a description:

```ts
interface UpstreamProjectRecord {
  title: string;               // public title, IN003
  url: string;                 // canonical URL, must be HTTPS, SR003
  section: string;              // upstream section name, resolved to one of the six
                                //   sectors via sectors.json catalogSections, IN005, F16
  tag?: string;                 // e.g. "Map", IN004; upstream may support multiple
  description: string;          // short description shown on nixfred.com
  // Additional fields (identifier, host, dates, images) exist upstream.
  // PENDING-FRED: exact full upstream field list, confirmed only once
  // scripts/sync-catalog.ts reads the live file.
}
```

`scripts/sync-catalog.ts` writes the fetched records into `portfolio.snapshot.json` verbatim (no field renaming, no filtering) so the snapshot is always a faithful mirror. Everything Galaxy adds lives in the enrichment file, never inside this one.

## 3. `galaxy.enrichment.json`

Keyed by stable slug (section 7). Adds every field the product requirements' content model lists that upstream does not already own, matching DR003.

```ts
interface EnrichmentRecord {
  slug: string;                        // stable identifier, minted once, section 7
  upstreamRef: string;                 // the upstream url or id this slug resolves to
  status:
    | "active" | "evolving" | "archived"
    | "client" | "experiment" | "memorial"; // AC001 vocabulary, interview D83
  launchDate?: string;                 // ISO date, only from git history, published
                                        // content, or an explicit Fred decision, FR053
  revisionDates?: string[];            // major rebuild dates, optional, FR046
  weight: number;                      // editorial importance, drives star size, FR009
  colorRole?: string;                  // optional override of the sector default hue
  technologies?: string[];             // max 6 shown, interview Q55
  position?: { x: number; y: number; z: number } | null;
                                        // manual anchor override, null = seeded, FR008
  thumbnail?: string;                  // optional, path or upstream asset ref
  socialImage?: string;                // optional, for the generated Open Graph card
  repositoryUrl?: string;              // only when the mapping is confirmed, FR019
  accessibilityLabel?: string;         // optional override for the default label
  featured: boolean;                   // controls persistent label and larger core
  visibility: "public" | "omitted";    // "omitted" keeps unreleased work out, Q9
  provenance: string;                  // free text: how this record's non trivial
                                        // fields were determined, required whenever a
                                        // date, relation, or status is not self evident
  tourMembership?: string[];           // tour ids this project participates in
}
```

Long form editorial copy (the 60 to 120 word optional detail block, interview Q56) does not live in this JSON file. It lives in `src/content/projects/<slug>.md`, described in section 6, so it can be authored as readable markdown and validated through Astro content collections rather than as an escaped JSON string.

## 4. `relationships.json`

Typed edges. Every edge references two valid slugs and must carry a type, a strength, and a human readable reason, matching DR004 and FR032 to FR033.

```ts
type RelationType =
  | "built_on"
  | "shared_subject"
  | "shared_technology"
  | "client_work"
  | "personal_history"
  | "chronology";

interface RelationshipRecord {
  source: string;               // slug
  target: string;                // slug, source !== target, no self relations
  type: RelationType;
  strength: number;              // 0 to 1, drives line intensity
  reason: string;                 // required, non empty, human readable, FR033
  provenance: "manual" | "inferred";
                                   // inferred edges render weaker than manual, FR037
}
```

Relation type meanings, accepted per interview question 60:

| Type | Meaning |
|---|---|
| `built_on` | The source project is technically built on the target: a direct dependency, foundation, or extracted component relationship. |
| `shared_subject` | Both projects address the same topical subject or domain without a direct technical dependency between them. |
| `shared_technology` | Both projects share a named, architecturally meaningful technology choice, not an incidental one like both using TypeScript. |
| `client_work` | Connects a client engagement to the supporting infrastructure, tooling, or personal work that enabled it, without implying ownership of the client's business. |
| `personal_history` | Connects work to a personal, family, caregiving, or memorial context rather than a technical fact. Treated with the visual restraint the art direction requires for personal and memorial content. |
| `chronology` | A sequential connection in time, such as one version of a project leading directly to the next, independent of whether it is also `built_on`. |

An automatic similarity pass (Larry inferring an initial graph from category, subject, shared technology, and chronology, interview question 52) may populate `provenance: "inferred"` edges. Every inferred edge must still carry a `reason` string describing what was matched; a blank or generic reason fails validation the same as a missing one. Promoting an edge from inferred to manual is a content decision Fred or Larry makes explicitly during authoring, not something the sync process does automatically.

## 5. `sectors.json`

DR005. One record per sector, matching the six sectors accepted by default and confirmed by F17 in `docs/DECISIONS.md`: IT, Labs, Work, Signal, Clients, Personal.

```ts
interface SectorRecord {
  id: string;                    // e.g. "it", "labs", "work", "signal", "clients", "personal"
  label: string;                  // display label, e.g. "SIGNAL"
  shortLabel?: string;             // for tight UI contexts
  colorToken: string;               // references a design token, not a raw hex value
  catalogSections?: string[];       // upstream `section` values that resolve to this
                                     // sector, e.g. ["Signal & Noise"] for signal, F16
  anchor: { x: number; y: number; z: number };
                                     // fixed manual coordinate, ADR-0004
  order: number;                    // stable display and legend ordering
  description: string;
}
```

Sector anchors are hand placed, not computed, because they establish the stable regions every seeded node position is relative to (FR007, ADR-0004). Changing an anchor is a deliberate art direction change, not a data update, and it invalidates committed visual regression snapshots for any node near that sector.

### Catalog section to sector mapping (F16)

The upstream catalog's `section` field does not map one to one onto the six map sectors, so `sectors.json` records the mapping in `catalogSections`:

1. The catalog section `Signal & Noise` maps to sector id `signal`, whose display `label` is `SIGNAL`, shortened from the catalog name (F16 in `docs/DECISIONS.md`).
2. The live catalog also carries `Featured` and `Portfolio` sections, which are not sectors of their own. A `Featured` entry keeps its true sector and is marked `featured: true` in `galaxy.enrichment.json`. A `Portfolio` entry belongs to the `Clients` sector. `scripts/sync-catalog.ts` and `merge.ts` resolve every upstream `section` to one of the six sectors through this table; a `section` that resolves to none of the six fails validation as an unknown sector.

## 6. `tours.json` and `src/content/projects/<slug>.md`

DR006. One record per guided tour.

```ts
interface TourStep {
  slug: string;                    // project slug for this step
  cameraTarget?: { x: number; y: number; z: number };
                                     // optional explicit override; defaults to the
                                     // node's own computed position
  narration: string;                // short copy shown during this step
}

interface TourRecord {
  id: string;
  title: string;                     // e.g. "START HERE"
  purpose: string;                    // one line promise, shown before starting
  steps: TourStep[];
  estimatedDurationSeconds?: number;
  shareable: true;                    // every tour produces a stable URL, FR043
}
```

The launch set is `start-here`, `ai-and-infrastructure`, and `space-and-physics` unless Fred changes it (FR044).

`src/content/projects/<slug>.md` is an Astro content collection, schema validated through `src/content.config.ts`. Frontmatter mirrors the identifying fields needed to cross check against `galaxy.enrichment.json` (at minimum `slug`), and the markdown body is the optional long description. A project with no file here simply has no long description; the short description from upstream and the one sentence panel copy remain sufficient, per interview question 56's "optional detail section."

## 7. Slug stability

The slug is the key every other file references: `relationships.json`, `tours.json`, deep link URLs (FR020), crawlable page paths (`/project/<slug>/`, FR054), and session pins. It must never change once assigned.

Rule: a slug is derived once, at the first sync that introduces a given upstream record, from the upstream canonical URL with its protocol and host stripped and the remainder kebab cased; or from an explicit manual override in `galaxy.enrichment.json` when the derived value would collide with an existing slug or misrepresent the project. Once `slug` exists as a key in `galaxy.enrichment.json`, `scripts/sync-catalog.ts` must never regenerate or alter it, even if the corresponding upstream title or URL changes. If a later sync detects that the stored `upstreamRef` no longer matches the record it originally pointed to, that is reported in the change report (section 8) as a mismatch for human review, not resolved automatically.

## 8. Validation rules and CI failure conditions

DR007 requires every data file to validate against strict TypeScript types and runtime schemas (Zod or an equivalent validator, run inside `scripts/validate-catalog.ts` and `scripts/validate-graph.ts`). DR008 lists the conditions that must fail CI:

| Condition | Checked in |
|---|---|
| Duplicate slugs | `validate-catalog.ts` |
| Unknown sectors (a project or relationship referencing a sector id not in `sectors.json`) | `validate-catalog.ts` |
| Unknown relationship endpoints (a `source` or `target` slug with no matching enrichment record) | `validate-graph.ts` |
| Invalid URLs (non HTTPS, malformed) | `validate-catalog.ts`, SR003 |
| Unsupported status values (outside the AC001 vocabulary) | `validate-catalog.ts` |
| Missing titles | `validate-catalog.ts` |
| Missing descriptions | `validate-catalog.ts` |

Additional invariants enforced even though DR008 does not name them individually, because FR032, FR033, and AC030 require them: self relations (`source === target`), duplicate edges between the same pair with the same type, a relationship missing a `type`, `strength`, or non empty `reason`, and a tour step referencing a slug with no enrichment record. `validate-graph.ts` runs the same `merge.ts` and `layout.ts` code path the production build uses (`docs/ARCHITECTURE.md` section 5), so a passing validation is a guarantee about the artifact that will actually ship.

### Required content presence (F1, F2)

Two sets of records are settled required content and must be present for `validate-graph.ts` to pass:

1. The seven anchor stars Fred chose directly (F1 in `docs/DECISIONS.md`): Meet Larry, Build Your Own Larry, The Universe As I See It, YouTube Library, Sky Walrus, Where Physics Starts Sweating, and The Code Audit, with AI Signal elevated alongside them. Each anchor is `featured: true` in `galaxy.enrichment.json`, and its `provenance` string records that Fred selected it directly, never an inferred weighting.
2. The five guaranteed hero edges in `relationships.json` (F2), always discoverable relationships, each `provenance: "manual"`: Meet Larry to Build Your Own Larry, Build Your Own Larry to AI Infrastructure Portfolio, Artemis Tracker to Where Physics Starts Sweating, The Nix Times to INTEL, and INTEL to AI Signal.

`validate-graph.ts` verifies that all seven anchors resolve to featured enrichment records with Fred provenance and that all five hero edges exist with manual provenance. A missing anchor or a missing hero edge fails CI.

### Domain census (DR011)

DR011 makes total coverage a blocking requirement beyond the catalog: every property reachable at `*.nixfred.com`, `nixfred.com/*`, `*.nixfred.tech`, or `nixfred.tech/*` must appear on the map. A census script (`scripts/domain-census.ts`) enumerates the Cloudflare zone DNS records for both zones, `nixfred.com` and `nixfred.tech`, probes each hostname for reachability, and diffs the live set against the merged catalog. Any live property that has no corresponding node is reported as a gap. A live property missing from the map is a blocking launch gap, resolved by adding the entry upstream to `portfolio.json` (the canonical identity source per DR001) or to `galaxy.enrichment.json`, never by a silent exception. The census runs before launch as a gate (`docs/GATES.md`) and again on the maintenance schedule (section 10).

Dates are never invented. `launchDate` and `revisionDates` are only ever populated from git history, published content, or an explicit Fred decision recorded in `docs/DECISIONS.md` (FR048, FR053, AC032, DR requirement on honest chronology). A project with no known date simply omits the field; the timeline groups it under an explicit "date not recorded" state rather than guessing (art direction, timeline mode section).

## 9. Generated graph artifact

Not committed. Produced at build time by `src/lib/catalog/merge.ts` and `src/lib/graph/layout.ts` from the five committed data files, and consumed by the Astro static pages and the client side scene as described in `docs/ARCHITECTURE.md` section 5.

```ts
interface GeneratedGraph {
  catalogRevision: string;          // checksum of the five source files
  generatedAt: string;               // ISO timestamp, build time only
  nodes: GraphNode[];
  edges: RelationshipRecord[];       // validated, resolved against nodes
  sectors: SectorRecord[];
  tours: TourRecord[];
}

interface GraphNode {
  slug: string;
  title: string;
  url: string;
  sectorId: string;
  description: string;
  status: EnrichmentRecord["status"];
  position: { x: number; y: number; z: number }; // final, deterministic, FR006
  size: number;                      // derived from weight and featured, FR009
  brightness: number;                // derived from status, FR010
  technologies: string[];
  featured: boolean;
  accessibilityLabel: string;
}
```

`catalogRevision` is a hash of `portfolio.snapshot.json`, `galaxy.enrichment.json`, `relationships.json`, `sectors.json`, and `tours.json` together. Two builds against the same revision must produce byte identical `nodes[].position` values (AC031, verified by a snapshot hash test across repeated builds). `catalogRevision` also travels into `build.json` so a live deployment's data snapshot can be verified against the commit it claims to represent (AC050).

## 10. Sync behavior

Interview question 51: a scheduled workflow checks weekly, updates the committed snapshot, validates it, and opens an automated pull request; production builds never depend on a live remote fetch.

`scripts/sync-catalog.ts`, run by the `sync-catalog.yml` scheduled workflow (`docs/ARCHITECTURE.md` section 10):

1. Fetches the live upstream `portfolio.json`.
2. Diffs it against the committed `portfolio.snapshot.json`.
3. For each upstream record, resolves it to an existing slug through the stored `upstreamRef` mapping in `galaxy.enrichment.json`, or mints a new slug for a genuinely new record (section 7).
4. Writes the updated `portfolio.snapshot.json`.
5. Produces a human readable change report (DR009): additions with their new slug and title, removals, and changed fields per existing slug.
6. Runs `validate-catalog.ts` and `validate-graph.ts` against the result.
7. Opens a pull request carrying the updated snapshot and the change report; it never pushes directly to `main`, consistent with the branch protection model.

Separately from the catalog sync, the DR011 domain census (section 8) runs on the maintenance schedule in `scheduled_checks.yml` (`docs/ARCHITECTURE.md` section 10, `docs/CI_CD.md`), enumerating both Cloudflare zones and diffing reachable properties against the merged catalog so that a newly published property is caught as a coverage gap rather than silently missing.

Enrichment is never silently discarded (AC033). If an upstream record disappears, its `galaxy.enrichment.json` row is left untouched, not deleted, so any relationships, tour membership, or authored copy tied to that slug survive; the merge step simply has no matching upstream record to pair it with, so no node renders for it in that build. Whether an orphaned enrichment row should ever be promoted back into the graph as an explicitly archived, no longer listed upstream project is not resolved in the requirements pack. PENDING-FRED: this specific edge case (a project removed upstream but Fred wants it to remain visible in Galaxy as archived) needs an explicit decision before it can be implemented; until then, the safe default is that removal from upstream means the node stops rendering, and the change report surfaces this clearly enough that it is never a silent loss.
