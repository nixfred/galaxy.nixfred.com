// Generates the Open Graph card (VR010, docs/ART_DIRECTION.md "Open Graph
// art"): the name, the primary line, a central node with six sector regions,
// and the domain, readable at social preview size. Deterministic: the star
// positions are seeded, so the same catalog produces the same card. Written
// to public/og/default.png so it ships with the static build.
import { Resvg } from '@resvg/resvg-js';
import { mkdirSync } from 'node:fs';
import { sectorsSchema } from '../src/lib/catalog/schema';
import sectorsRaw from '../src/data/sectors.json';

const W = 1200;
const H = 630;

const sectors = sectorsSchema.parse(sectorsRaw).sectors;

// Sector cores from the design bible (BD02), keyed by id.
const CORES: Record<string, string> = {
  it: '#FF6B4A',
  labs: '#4ADE80',
  work: '#38BDF8',
  signal: '#FBBF24',
  clients: '#B794F6',
  personal: '#C9D3DC',
};

// Deterministic scatter around each sector region (mulberry32 by sector id).
function seeded(id: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const cx = W * 0.5;
const cy = H * 0.52;
const stars: string[] = [];
const lines: string[] = [];

sectors.forEach((sector, i) => {
  const angle = (i / sectors.length) * Math.PI * 2 - Math.PI / 2;
  const sxCenter = cx + Math.cos(angle) * 300;
  const syCenter = cy + Math.sin(angle) * 150;
  const core = CORES[sector.id] ?? '#38BDF8';
  const rand = seeded(sector.id);
  lines.push(
    `<line x1="${cx}" y1="${cy}" x2="${sxCenter.toFixed(1)}" y2="${syCenter.toFixed(1)}" stroke="${core}" stroke-opacity="0.18" stroke-width="1.5"/>`,
  );
  for (let s = 0; s < 6; s++) {
    const px = sxCenter + (rand() - 0.5) * 150;
    const py = syCenter + (rand() - 0.5) * 90;
    const r = 2 + rand() * 3;
    stars.push(
      `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${r.toFixed(1)}" fill="${core}" fill-opacity="0.9"/>`,
      `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${(r * 3).toFixed(1)}" fill="${core}" fill-opacity="0.12"/>`,
    );
  }
});

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#05070A"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <defs>
    <radialGradient id="glow" cx="50%" cy="52%" r="60%">
      <stop offset="0%" stop-color="#0B0F14" stop-opacity="1"/>
      <stop offset="100%" stop-color="#05070A" stop-opacity="1"/>
    </radialGradient>
  </defs>
  ${lines.join('\n  ')}
  ${stars.join('\n  ')}
  <circle cx="${cx}" cy="${cy}" r="8" fill="#F2F4F7"/>
  <circle cx="${cx}" cy="${cy}" r="26" fill="#F2F4F7" fill-opacity="0.14"/>
  <text x="64" y="96" font-family="'Space Grotesk', system-ui, sans-serif" font-size="30" letter-spacing="4" fill="#5A6B7A">NIXFRED GALAXY // CATALOG ONLINE</text>
  <text x="64" y="${H - 150}" font-family="'Space Grotesk', system-ui, sans-serif" font-weight="700" font-size="76" fill="#F2F4F7">Every project.</text>
  <text x="64" y="${H - 70}" font-family="'Space Grotesk', system-ui, sans-serif" font-weight="700" font-size="76" fill="#F2F4F7">One connected system.</text>
  <text x="${W - 64}" y="${H - 40}" text-anchor="end" font-family="'JetBrains Mono', monospace" font-size="26" fill="#38BDF8">galaxy.nixfred.com</text>
</svg>`;

mkdirSync('public/og', { recursive: true });
const png = new Resvg(svg, { fitTo: { mode: 'width', value: W } })
  .render()
  .asPng();
await Bun.write('public/og/default.png', png);
console.log(`og/default.png written: ${W}x${H}, ${png.length} bytes`);
