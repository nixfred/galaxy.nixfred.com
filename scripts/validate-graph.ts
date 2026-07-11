// Graph validation gate (DR004, DR008, FR032-FR033, and the F2 hero edge
// assertion from docs/GATES.md section 2.11). Exits nonzero on failure.
import {
  relationshipsSchema,
  sectorsSchema,
  toursSchema,
  snapshotSchema,
  slugFromTitle,
} from '../src/lib/catalog/schema';

// The five hero edge records enforcing Fred's four named relationships,
// decision F2, 2026-07-11 (the intelligence pipeline is two edges).
const HERO_EDGES: Array<[string, string]> = [
  ['meet-larry', 'build-your-own-larry'],
  ['build-your-own-larry', 'ai-infrastructure-portfolio'],
  ['artemis-tracker', 'where-physics-starts-sweating'],
  ['the-nix-times', 'intel'],
  ['intel', 'ai-signal'],
];

const failures: string[] = [];

const snapshot = snapshotSchema.parse(
  JSON.parse(await Bun.file('src/data/portfolio.snapshot.json').text()),
);
const slugs = new Set(snapshot.entries.map((e) => slugFromTitle(e.title)));

const relationships = relationshipsSchema.safeParse(
  JSON.parse(await Bun.file('src/data/relationships.json').text()),
);
if (!relationships.success) {
  failures.push(`relationships schema: ${relationships.error.message}`);
}

const sectors = sectorsSchema.safeParse(
  JSON.parse(await Bun.file('src/data/sectors.json').text()),
);
if (!sectors.success) {
  failures.push(`sectors schema: ${sectors.error.message}`);
}

const tours = toursSchema.safeParse(
  JSON.parse(await Bun.file('src/data/tours.json').text()),
);
if (!tours.success) {
  failures.push(`tours schema: ${tours.error.message}`);
}

if (relationships.success) {
  const seen = new Set<string>();
  for (const e of relationships.data.edges) {
    if (!slugs.has(e.source)) failures.push(`edge source unknown: ${e.source}`);
    if (!slugs.has(e.target)) failures.push(`edge target unknown: ${e.target}`);
    if (e.source === e.target) failures.push(`self edge: ${e.source}`);
    const key = `${e.source}->${e.target}`;
    if (seen.has(key)) failures.push(`duplicate edge: ${key}`);
    seen.add(key);
  }
  // F2 assertion: every hero edge present in either direction.
  for (const [a, b] of HERO_EDGES) {
    if (!seen.has(`${a}->${b}`) && !seen.has(`${b}->${a}`)) {
      failures.push(`F2 hero edge missing: ${a} <-> ${b}`);
    }
  }
}

if (sectors.success && snapshot.entries.length) {
  // Every catalog section must map into exactly one sector, except Featured,
  // which keeps a true sector through enrichment sectorOverride (F16 note in
  // docs/DATA_MODEL.md). Unmapped sections fail loudly.
  const mapped = new Set(
    sectors.data.sectors.flatMap((s) => s.catalogSections),
  );
  const sections = new Set(snapshot.entries.map((e) => e.section));
  for (const sec of sections) {
    if (sec === 'Featured') continue;
    if (!mapped.has(sec)) failures.push(`catalog section unmapped: ${sec}`);
  }
}

if (tours.success) {
  for (const tour of tours.data.tours) {
    for (const stop of tour.stops) {
      if (!slugs.has(stop.slug)) {
        failures.push(`tour ${tour.id} references unknown slug ${stop.slug}`);
      }
    }
  }
  const ids = tours.data.tours.map((t) => t.id);
  for (const required of [
    'start-here',
    'ai-and-infrastructure',
    'space-and-physics',
  ]) {
    if (!ids.includes(required))
      failures.push(`required tour missing: ${required} (R7)`);
  }
}

if (failures.length) {
  console.error(`GRAPH VALIDATION FAILED (${failures.length}):`);
  for (const f of failures) console.error(` - ${f}`);
  process.exit(1);
}
console.log(
  'graph validation passed: edges, F2 hero edges, sectors, tours (R7).',
);
