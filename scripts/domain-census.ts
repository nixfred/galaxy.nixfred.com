// DR011 total coverage census, privacy scoped per ruling R9 (docs/DECISIONS.md).
//
// R9 discipline, enforced in code:
// 1. Raw zone enumeration NEVER leaves this process: not written to disk, not
//    printed. Only filtered, census-eligible results appear in output.
// 2. Census-eligible = serves public HTML over HTTPS with HTTP 200.
// 3. Everything else appears as aggregate counts only, never by name.
// 4. Gaps = eligible live properties absent from the catalog and not excused
//    in src/data/census-exclusions.json (each exclusion carries a reason).
//
// Env: CF_DNS_READ_TOKEN, CF_ZONE_NIXFRED_COM, CF_ZONE_NIXFRED_TECH.
// Exit 0 with "no gaps" or informational report; exit 1 on gaps when --strict
// (the G6 launch gate runs --strict; Phase 1+ informational runs do not).
import {
  censusExclusionsSchema,
  snapshotSchema,
} from '../src/lib/catalog/schema';

const token = process.env.CF_DNS_READ_TOKEN;
const zones = [
  { name: 'nixfred.com', id: process.env.CF_ZONE_NIXFRED_COM },
  { name: 'nixfred.tech', id: process.env.CF_ZONE_NIXFRED_TECH },
];
const strict = process.argv.includes('--strict');

if (!token || zones.some((z) => !z.id)) {
  console.error(
    'census: CF_DNS_READ_TOKEN, CF_ZONE_NIXFRED_COM, CF_ZONE_NIXFRED_TECH required',
  );
  process.exit(1);
}

interface DnsRecord {
  type: string;
  name: string;
}

async function listRecords(zoneId: string): Promise<DnsRecord[]> {
  const records: DnsRecord[] = [];
  let page = 1;
  for (;;) {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records?per_page=100&page=${page}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const data = (await res.json()) as {
      success: boolean;
      result: DnsRecord[];
      result_info: { total_pages: number };
    };
    if (!data.success) throw new Error(`zone list failed for ${zoneId}`);
    records.push(...data.result);
    if (page >= data.result_info.total_pages) break;
    page++;
  }
  return records;
}

async function isEligible(hostname: string): Promise<boolean> {
  // Census-eligible: public HTML over HTTPS with HTTP 200 (R9 point 2).
  try {
    const res = await fetch(`https://${hostname}/`, {
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
    });
    const type = res.headers.get('content-type') ?? '';
    return res.status === 200 && type.includes('text/html');
  } catch {
    return false;
  }
}

// Hosts already represented in the catalog (by URL hostname).
const snapshot = snapshotSchema.parse(
  JSON.parse(await Bun.file('src/data/portfolio.snapshot.json').text()),
);
const catalogHosts = new Set(
  snapshot.entries.map((e) => new URL(e.url).hostname.replace(/^www\./, '')),
);
const exclusions = censusExclusionsSchema.parse(
  JSON.parse(await Bun.file('src/data/census-exclusions.json').text()),
);
const excluded = new Set(exclusions.exclusions.map((e) => e.hostname));

let nonWebCount = 0;
let ineligibleCount = 0;
let coveredCount = 0;
const gaps: string[] = [];

for (const zone of zones) {
  const records = await listRecords(zone.id as string);
  // Candidate hostnames: A/AAAA/CNAME records only; anything else is not a
  // website surface and is counted, never named (R9 point 3).
  const hosts = new Set<string>();
  for (const r of records) {
    if (r.type === 'A' || r.type === 'AAAA' || r.type === 'CNAME') {
      hosts.add(r.name.replace(/^www\./, ''));
    } else {
      nonWebCount++;
    }
  }
  for (const host of hosts) {
    if (catalogHosts.has(host)) {
      coveredCount++;
      continue;
    }
    if (excluded.has(host)) {
      coveredCount++;
      continue;
    }
    if (await isEligible(host)) {
      // Eligible and uncovered: a DR011 gap. Naming it is allowed because it
      // is, by definition, an already public website (R9 point 4).
      gaps.push(host);
    } else {
      ineligibleCount++;
    }
  }
}

console.log('DOMAIN CENSUS (DR011, scoped per R9)');
console.log(` covered or excluded hosts: ${coveredCount}`);
console.log(` non-website DNS records:   ${nonWebCount} (aggregate only)`);
console.log(` non-eligible hosts:        ${ineligibleCount} (aggregate only)`);
if (gaps.length) {
  console.log(` COVERAGE GAPS (${gaps.length}):`);
  for (const g of gaps.sort()) console.log(`  - ${g}`);
  if (strict) {
    console.error('census: gaps present; DR011 blocks launch (strict mode).');
    process.exit(1);
  }
} else {
  console.log(' coverage gaps: none');
}
