// Bundle budget gate (PR004, PR005, AC036; blocking on hard violations).
// Budgets from docs/PRD.md: shell JS < 150KB compressed, visualization chunk
// < 300KB compressed. The visualization budget arms itself when a three.js
// chunk first appears (Phase 3); until then it reports absent.
import { readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const DIST = 'dist';
const SHELL_BUDGET = 150 * 1024;
const VIZ_BUDGET = 300 * 1024;

if (!existsSync(DIST)) {
  console.error('report-bundle: dist/ not found; run build first');
  process.exit(1);
}

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

const jsFiles = walk(DIST).filter((f) => f.endsWith('.js'));
let shellTotal = 0;
let vizTotal = 0;
const rows: string[] = [];

for (const f of jsFiles) {
  const gz = gzipSync(await Bun.file(f).arrayBuffer().then(Buffer.from)).length;
  const isViz = /three|galaxy-?stage|renderer/i.test(f);
  if (isViz) vizTotal += gz;
  else shellTotal += gz;
  rows.push(`${isViz ? 'viz  ' : 'shell'} ${gz.toString().padStart(8)}B ${f}`);
}

console.log('BUNDLE REPORT (gzip)');
for (const r of rows) console.log(' ' + r);
console.log(` shell total: ${shellTotal}B / budget ${SHELL_BUDGET}B`);
console.log(
  ` viz total:   ${vizTotal ? `${vizTotal}B / budget ${VIZ_BUDGET}B` : 'absent (arms in Phase 3)'}`,
);

const failures: string[] = [];
if (shellTotal > SHELL_BUDGET) {
  failures.push(`shell JS ${shellTotal}B exceeds ${SHELL_BUDGET}B (PR004)`);
}
if (vizTotal > VIZ_BUDGET) {
  failures.push(`visualization ${vizTotal}B exceeds ${VIZ_BUDGET}B (PR005)`);
}
if (failures.length) {
  console.error('BUDGET FAILED:');
  for (const f of failures) console.error(' - ' + f);
  process.exit(1);
}
console.log('bundle budgets passed.');
