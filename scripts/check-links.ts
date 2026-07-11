// Internal link integrity gate (blocking per docs/CI_CD.md 3.7).
// Walks dist/ HTML, verifies every internal href/src resolves to a built file.
// External links are recorded, not fetched (the scheduled checks own that).
import { readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';

const DIST = 'dist';

function htmlFiles(dir: string): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...htmlFiles(p));
    else if (name.endsWith('.html')) out.push(p);
  }
  return out;
}

if (!existsSync(DIST)) {
  console.error('check-links: dist/ not found; run build first');
  process.exit(1);
}

const failures: string[] = [];
let internal = 0;
let external = 0;

const attrRe = /(?:href|src)="([^"#?]+)[^"]*"/g;

for (const file of htmlFiles(DIST)) {
  const html = await Bun.file(file).text();
  for (const match of html.matchAll(attrRe)) {
    const target = match[1] ?? '';
    if (!target || target.startsWith('data:')) continue;
    if (/^https?:\/\//.test(target)) {
      external++;
      if (target.startsWith('http://')) {
        failures.push(`${file}: insecure external link ${target} (SR003)`);
      }
      continue;
    }
    if (target.startsWith('mailto:')) continue;
    internal++;
    const base = target.startsWith('/')
      ? join(DIST, target)
      : resolve(dirname(file), target);
    const candidates = [
      base,
      join(base, 'index.html'),
      `${base}.html`,
      base.replace(/\/$/, '') + '/index.html',
    ];
    if (!candidates.some((c) => existsSync(c))) {
      failures.push(`${file}: broken internal link ${target}`);
    }
  }
}

if (failures.length) {
  console.error(`LINK CHECK FAILED (${failures.length}):`);
  for (const f of failures) console.error(` - ${f}`);
  process.exit(1);
}
console.log(
  `link check passed: ${internal} internal resolved, ${external} external recorded (https only).`,
);
