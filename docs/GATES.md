# NIXFRED GALAXY Gates and Traceability Matrix

Status: Binding. Updated 2026-07-11 to incorporate `docs/DECISIONS.md` Part 5 (Fred session rulings F1 through F30) and the new requirement DR011. This file is the single traceability matrix for `galaxy.nixfred.com`. Every requirement in the requirements pack maps to exactly one row here, every row names the mechanism that proves it, the evidence that mechanism produces, the enforcement class, and the phase gate where it must first pass. A requirement without a passing gate is not done. Build success alone is never evidence for browser behavior.

This file integrates and does not re-invent. Where `docs/TEST_PLAN.md` assigned an acceptance criterion a class and mechanism, this file uses exactly that. Where `docs/CI_CD.md` mapped a job to requirement IDs, this file uses exactly those jobs. Genuine contradictions between the source documents are resolved in the matrix and listed in the RECONCILIATIONS section at the end.

## 1. How to read this file

### 1.1 Enforcement classes

Every row is one of three classes. The class decides what a failure does. The classes match `docs/TEST_PLAN.md` section 1.

| Class | Meaning | Effect of failure |
|-------|---------|-------------------|
| BLOCK | Automated, deterministic, gates the release. | Fails CI. No preview promotion, no production deploy. |
| WARN | Automated, surfaced in the job summary. | Recorded and reviewed. Does not gate unless a hard threshold is crossed. |
| MANUAL | Human review or a named procedure where a subjective or operational judgment cannot be automated. | Recorded in `docs/evidence/` and rolled up in `docs/RELEASE_REPORT.md` with a named reviewer and an evidence link. |

Some rows carry an automated blocking part and a separate human judgment, shown as `BLOCK / MANUAL`. For those rows the automated part gates the release and the human judgment is recorded as a MANUAL sub check against the same evidence. Counting rule: a row that blocks in any part counts as BLOCK, because BLOCK is what gates. A row with no automated gate but a required human procedure counts as MANUAL. A row that only annotates counts as WARN. Class totals in the final rollup use this rule.

### 1.2 Phase gates

Gates G0 through G6 come from `docs/EXECUTION_PLAN.md`. Each phase ends at a gate. A gate passes only when every row assigned to it passes with recorded evidence. A failed gate blocks the next phase. Discovering broken work from an earlier phase reopens that phase gate: fix backward before building forward.

| Gate | Phase | Theme |
|------|-------|-------|
| G0 | Provisioning | Repository, secrets, Pages project, branch protection. |
| G1 | Foundation | Toolchain, data pipeline, green empty CI. |
| G2 | Atlas first | Accessible HTML shell, Atlas, project pages, headers, preview pipeline, settled content authored. |
| G3 | The Galaxy | Three.js map, selection, reduced motion, mobile, WebGL fallback. |
| G4 | Features | Palette, filters, tours, compare, session features, timeline machinery. |
| G5 | Polish and hardening | Visual baselines, performance budgets, security pass, design bible rubric. |
| G6 | Launch | Production, custom domain verification, domain census, rollback, homepage card. |

The gate column records the phase where a row must first pass. Many rows keep passing in every later phase, and the STANDING ENFORCEMENT section names the rows that must keep passing after launch.

### 1.3 The rule of the matrix

A gate passes only when every row assigned to that gate passes with evidence. The GATE ROLLUP section lists the row IDs bound to each gate. A gate cannot be declared passed while any of its rows is unproven, failing, or lacking its evidence artifact.

## 2. The master matrix

Columns: ID, requirement summary, enforcement mechanism, evidence artifact, class, first gate. Test file and script names are the canonical names from `docs/TEST_PLAN.md`. Workflow and job names are the canonical names from `docs/CI_CD.md`. Family order: FR, DR, VR, AR, PR, SR, AN, IN, then AC001 to AC058, then WC01 to WC15, then the settled content decision row F1F2.

### 2.1 Functional requirements FR001 to FR065

| ID | Requirement | Enforcement mechanism | Evidence artifact | Class | Gate |
|----|-------------|-----------------------|-------------------|-------|------|
| FR001 | HTML shell before bundle loads | `tests/e2e/shell.spec.ts` pre hydration assertion | First viewport assertion log | BLOCK | G2 |
| FR002 | Shell holds name, actions, links, status; permanent nixfred.com and GitHub repo links every mode and viewport (F33) | `tests/e2e/shell.spec.ts` element presence including both permanent links on every tested route | Shell element assertion log | BLOCK | G2 |
| FR003 | Shell usable if bundle fails | `tests/e2e/shell.spec.ts`, `tests/e2e/webgl-fallback.spec.ts` | Fallback trace | BLOCK | G2 |
| FR004 | Version visible at all times, every mode and viewport (F32) | `tests/e2e/shell.spec.ts` asserts the version element on every tested route and viewport and matches `build.json`; production smoke re-verifies against the deployed commit | Version visibility assertion | BLOCK | G2 |
| FR005 | Constrained 2.5D Three.js map | `tests/e2e/explore.spec.ts` | Explore trace | BLOCK | G3 |
| FR006 | Deterministic positions per revision | `tests/unit/layout-determinism.test.ts` | Coordinate hash equality | BLOCK | G1 |
| FR007 | Stable sector anchors for six sectors | `scripts/validate-catalog.ts`, `tests/unit/layout-determinism.test.ts` | Sector schema and anchor log | BLOCK | G1 |
| FR008 | Manual plus seeded node placement | `tests/unit/layout-determinism.test.ts` override assertion | Placement stability log | BLOCK | G1 |
| FR009 | Node size encodes editorial weight | `tests/e2e/explore.spec.ts` size attribute assertion | Node size attribute log | BLOCK | G3 |
| FR010 | Brightness encodes status, archived quiet | `tests/e2e/explore.spec.ts` status attribute assertion | Status brightness log | BLOCK | G3 |
| FR011 | Depth and drift without obstruction | `tests/e2e/explore.spec.ts` input during motion, design bible rubric | Input timing log, rubric note | BLOCK / MANUAL | G3 |
| FR012 | Renderer adapts to device capability | `tests/unit` quality profile, browser config test | Quality profile assertion | BLOCK | G3 |
| FR013 | Pause when hidden, reduce when idle | `tests/e2e/explore.spec.ts` frame counter across hidden | Frame counter assertion | BLOCK | G3 |
| FR014 | Stop decorative motion on reduced motion | `tests/e2e/reduced-motion.spec.ts` frame identity | Reduced motion frame gallery | BLOCK | G3 |
| FR015 | All input paths can select a node | `tests/e2e/explore.spec.ts`, `keyboard.spec.ts` | Selection path pass list | BLOCK | G3 |
| FR016 | Focus camera without disorienting spin | `tests/e2e/explore.spec.ts` focus transition frames | Focus transition frame gallery | BLOCK | G3 |
| FR017 | Selection lights relations and sector path | `tests/e2e/explore.spec.ts` | Selected state trace | BLOCK | G3 |
| FR018 | Single click selects and opens panel | `tests/e2e/explore.spec.ts` single click (F18), `mobile.spec.ts` | Panel open trace | BLOCK | G3 |
| FR019 | Detail view shows required fields | `tests/e2e/explore.spec.ts` field assertions | Panel field assertion log | BLOCK | G3 |
| FR020 | Selection updates stable history URL | `tests/unit/deep-link.test.ts`, `tests/e2e/deep-links.spec.ts` | URL state test output | BLOCK | G3 |
| FR021 | Close restores context, session camera memory | `tests/e2e/keyboard.spec.ts` focus return, `explore.spec.ts` session camera restore (F20) | Focus return and camera restore trace | BLOCK | G3 |
| FR022 | Double click opens external, new tab, safe attrs | `tests/e2e/explore.spec.ts` double click and rel and target (F19) behavior test; the link safety attribute half (HTTPS, rel attributes) is already proven at G2 by `scripts/validate-catalog.ts` under AC005 | Link attribute and double click assertion | BLOCK | G3 |
| FR023 | Palette opens on the three shortcuts | `tests/e2e/search.spec.ts` shortcut coverage | Shortcut coverage log | BLOCK | G2 |
| FR024 | Search matches all indexed fields | `tests/e2e/search.spec.ts`, `tests/unit/filters.test.ts` | Search field coverage log | BLOCK | G2 |
| FR025 | Results keyboard and screen reader ready | `tests/e2e/keyboard.spec.ts`, `search.spec.ts` | Keyboard result trace | BLOCK | G2 |
| FR026 | Result focuses map, panel, deep link | `tests/e2e/search.spec.ts` | Search to map trace | BLOCK | G4 |
| FR027 | Palette exposes mode and nav commands | `tests/e2e/search.spec.ts` command list assertion | Command coverage log | BLOCK | G4 |
| FR028 | Isolate one or more sectors | `tests/unit/filters.test.ts`, `tests/e2e/atlas.spec.ts` | Filter unit and Atlas trace | BLOCK | G2 |
| FR029 | Filter preserves selection and camera | `tests/e2e/explore.spec.ts` | Camera preservation trace | BLOCK | G4 |
| FR030 | Show visible counts for active filters | `tests/unit/filters.test.ts`, `tests/e2e/atlas.spec.ts` | Filter count assertion | BLOCK | G2 |
| FR031 | Filters operate in Map and Atlas | `tests/e2e/explore.spec.ts`, `atlas.spec.ts` | Cross mode filter trace | BLOCK | G4 |
| FR032 | Relationship references two valid slugs | `scripts/validate-graph.ts`, `tests/unit/graph-integrity.test.ts` | Graph validation report | BLOCK | G1 |
| FR033 | Relationship has type, strength, reason | `scripts/validate-graph.ts`, `tests/unit/graph-integrity.test.ts` | Graph validation report | BLOCK | G1 |
| FR034 | Direct relations shown on selection | `tests/e2e/explore.spec.ts` | Selected relation trace | BLOCK | G3 |
| FR035 | Compare shortest meaningful path | `tests/unit/graph-integrity.test.ts`, `tests/e2e/compare.spec.ts` | Path calculation output | BLOCK | G4 |
| FR036 | Compare explains each edge plainly | `tests/e2e/compare.spec.ts` copy assertion | Compare copy assertion | BLOCK | G4 |
| FR037 | Auto edges visually weaker than curated | `tests/e2e/explore.spec.ts` provenance style, visual review | Edge style assertion, visual note | BLOCK / MANUAL | G4 |
| FR038 | Never render full graph by default | `tests/e2e/explore.spec.ts` overview edge cap | Overview edge count assertion | BLOCK | G3 |
| FR039 | At least three guided tours | `tests/unit/filters.test.ts` tour count, `tours.spec.ts` | Tour count and flow trace | BLOCK | G4 |
| FR040 | Tour holds all required parts | `scripts/validate-catalog.ts` tour schema, `tours.spec.ts` | Tour schema and flow log | BLOCK | G4 |
| FR041 | Pause, skip, back, exit, resume tour | `tests/e2e/tours.spec.ts` ordered flow | Tour flow trace | BLOCK | G4 |
| FR042 | Tours never trap keyboard focus | `tests/e2e/keyboard.spec.ts`, `tours.spec.ts` | No trap assertion | BLOCK | G4 |
| FR043 | Tour state produces shareable URL | `tests/e2e/deep-links.spec.ts`, `tours.spec.ts` | Tour deep link trace | BLOCK | G4 |
| FR044 | Initial three named tours present | `tests/unit` tour data assertion, `tours.spec.ts` | Tour identity assertion | BLOCK | G4 |
| FR045 | Timeline disabled until dates trustworthy | `tests/unit` timeline gating, content review | Gating assertion, content note | BLOCK / MANUAL | G4 |
| FR046 | Timeline reveals by date, positions fixed | `tests/e2e` timeline, `tests/unit` reveal logic | Timeline reveal trace | BLOCK | G4 |
| FR047 | Timeline keyboard and date announcements | `tests/e2e/keyboard.spec.ts` timeline | Timeline keyboard trace | BLOCK | G4 |
| FR048 | Unknown dates never guessed | `scripts/validate-catalog.ts`, schema test | Unknown date assertion | BLOCK | G1 |
| FR049 | Atlas is complete HTML catalog | `tests/e2e/atlas.spec.ts` | Atlas presence trace | BLOCK | G2 |
| FR050 | Atlas has search, filters, links, tours | `tests/e2e/atlas.spec.ts` | Atlas feature trace | BLOCK | G2 |
| FR051 | Atlas at `/atlas/` and persistent control | `tests/e2e/atlas.spec.ts` | Atlas route and control assertion | BLOCK | G2 |
| FR052 | Atlas is automatic WebGL fallback | `tests/e2e/webgl-fallback.spec.ts` | Forced failure trace | BLOCK | G3 |
| FR053 | Canvas not only names in a11y tree | `tests/e2e/keyboard.spec.ts`, `atlas.spec.ts` a11y tree | Accessibility tree snapshot | BLOCK | G3 |
| FR054 | Project page per public slug | Generated route test, `atlas.spec.ts` | Per slug route pass list | BLOCK | G2 |
| FR055 | Project page canonical and OG metadata | `tests/e2e` project page meta, build assertion | Metadata assertion log | BLOCK | G2 |
| FR056 | Project page opens map focused | `tests/e2e/deep-links.spec.ts` | Focus from page trace | BLOCK | G3 |
| FR057 | Session pins without account | `tests/e2e` pin flow | Pin flow trace | BLOCK | G4 |
| FR058 | Pins do not persist without approval | `tests/e2e` no network pin, source review | Storage scope assertion, source note | BLOCK / MANUAL | G4 |
| FR059 | Surprise Me seeded, no repeats | `tests/unit/filters.test.ts` seeded sequence | Deterministic sequence assertion | BLOCK | G4 |
| FR060 | Share copies stable state link | `tests/e2e/deep-links.spec.ts` share | Share link assertion | BLOCK | G4 |
| FR061 | Clear fallback on WebGL or data failure | `tests/e2e/webgl-fallback.spec.ts` | Fallback screenshot and trace | BLOCK | G3 |
| FR062 | One bad thumbnail does not break catalog | `tests/e2e` thumbnail failure fallback | Thumbnail fallback trace | BLOCK | G2 |
| FR063 | Invalid graph fails build not runtime | `scripts/validate-graph.ts`, `catalog-invalid.json` fixture | Negative validation output | BLOCK | G1 |
| FR064 | Runtime errors logged, no private data | `tests/e2e` console assertion, production smoke | Console cleanliness log | BLOCK | G3 |
| FR065 | Custom 404 with search, Atlas, return | `tests/e2e` 404 route, axe on 404 | 404 route trace, axe report | BLOCK | G2 |

### 2.2 Data requirements DR001 to DR011

| ID | Requirement | Enforcement mechanism | Evidence artifact | Class | Gate |
|----|-------------|-----------------------|-------------------|-------|------|
| DR001 | Import upstream `portfolio.json` | `scripts/sync-catalog.ts`, `sync-catalog.yml` | Sync run log | BLOCK | G1 |
| DR002 | Store catalog as committed snapshot | `scripts/sync-catalog.ts`, `tests/unit/catalog-merge.test.ts` | Snapshot and merge output | BLOCK | G1 |
| DR003 | Enrichment file adds stable fields | `tests/unit/catalog-merge.test.ts` | Enrichment merge output | BLOCK | G1 |
| DR004 | Relationship file has full provenance | `scripts/validate-graph.ts`, `tests/unit/graph-integrity.test.ts` | Graph validation report | BLOCK | G1 |
| DR005 | Sector file has label, anchor, order | `scripts/validate-catalog.ts`, `tests/unit` sector schema | Sector schema output | BLOCK | G1 |
| DR006 | Tour file has nodes, narration, camera | `scripts/validate-catalog.ts` tour schema, `tests/unit` | Tour schema output | BLOCK | G1 |
| DR007 | All data validates strict schemas | `scripts/validate-catalog.ts`, `validate-graph.ts`, `typecheck` | Schema validation output | BLOCK | G1 |
| DR008 | Bad data fails CI | `catalog-invalid.json` fixture, `validate-catalog.ts`, `validate-graph.ts` | Negative validation output | BLOCK | G1 |
| DR009 | Sync produces readable change report | `scripts/sync-catalog.ts`, `tests/unit/catalog-merge.test.ts` | Change report fixture output | BLOCK | G1 |
| DR010 | No runtime catalog fetch in production | `tests/fixtures` offline suite, build, source review | Offline test and network trace | BLOCK | G1 |
| DR011 | Every reachable nixfred property on the map | `scripts/domain-census.ts` Cloudflare zone DNS enumeration of both zones plus reachability probe, filtered to census-eligible public web properties per ruling R9, diffed against the catalog, at launch and in `scheduled_checks.yml` | Filtered domain census report artifact | BLOCK | G6 |

DR011 covers both zones, `nixfred.com` and `nixfred.tech`, including apex paths and every subdomain. A census-eligible live property missing from the map is a blocking launch gap, resolved only by adding the entry upstream to `portfolio.json` or to the enrichment layer, never by a silent exception. Eligibility, output discipline, and the editorial exclusion mechanism are governed by ruling R9 in `docs/DECISIONS.md`. The census runs informationally, non-blocking, from Phase 1 of `docs/EXECUTION_PLAN.md` onward to surface catalog coverage gaps early; the blocking DR011 assertion stays at Gate G6. Per decision F3, recorded 2026-07-11.

### 2.3 Visual requirements VR001 to VR010

| ID | Requirement | Enforcement mechanism | Evidence artifact | Class | Gate |
|----|-------------|-----------------------|-------------------|-------|------|
| VR001 | Near black, terminal, restrained color | `tests/visual/desktop.spec.ts`, design bible rubric WC15 | Visual baselines, rubric note | MANUAL | G5 |
| VR002 | Share nixfred.com DNA, not its layout | Design bible rubric, Fred review | Rubric note in `docs/RELEASE_REPORT.md` | MANUAL | G5 |
| VR003 | Alive before interaction, never blocks | `tests/e2e/explore.spec.ts` input timing, rubric WC07 | Input timing log, rubric note | BLOCK / MANUAL | G3 |
| VR004 | Major labels legible at overview | `tests/visual/desktop.spec.ts`, `tablet.spec.ts`, axe contrast | Overview baselines, contrast result | BLOCK / MANUAL | G5 |
| VR005 | Selected state obvious without color | `tests/e2e/explore.spec.ts` state attributes, visual review | State attribute log, visual note | BLOCK / MANUAL | G3 |
| VR006 | Avoid bloom, glitch, low contrast gray | Design bible rubric WC03 and WC15, axe contrast | Rubric note, contrast result | MANUAL | G5 |
| VR007 | Every animation has reduced motion form | `tests/e2e/reduced-motion.spec.ts` | Reduced motion frame gallery | BLOCK | G3 |
| VR008 | Loading reports real states not fake | `tests/e2e/shell.spec.ts` loading states, rubric WC12 | Loading state assertion | BLOCK | G3 |
| VR009 | Desktop, tablet, mobile, not shrink | `tests/e2e/mobile.spec.ts`, visual tablet and mobile | Control set assertion, baselines | BLOCK / MANUAL | G3 |
| VR010 | OG image reads at social size | OG card art, review | OG render note in `docs/RELEASE_REPORT.md` | MANUAL | G5 |

### 2.4 Accessibility requirements AR001 to AR010

| ID | Requirement | Enforcement mechanism | Evidence artifact | Class | Gate |
|----|-------------|-----------------------|-------------------|-------|------|
| AR001 | WCAG 2.2 AA essential content | `test:a11y` axe, manual screen reader matrix | Axe reports, screen reader notes | BLOCK / MANUAL | G2 |
| AR002 | Skip link, focus, headings, semantics | `test:a11y` axe, `tests/e2e/keyboard.spec.ts` | Axe report, keyboard trace | BLOCK | G2 |
| AR003 | Every action keyboard only | `tests/e2e/keyboard.spec.ts` | Keyboard per action pass list | BLOCK | G2 |
| AR004 | Focus into panel, return on close | `tests/e2e/keyboard.spec.ts` | Focus movement trace | BLOCK | G3 |
| AR005 | No autoplay sound, visible audio control | `tests/e2e/shell.spec.ts` no autoplay and control present (F12 audio ships), source review | Autoplay assertion, control assertion, source note | BLOCK / MANUAL | G2 |
| AR006 | Visible pause motion during motion | `tests/e2e/explore.spec.ts` | Pause control screenshot, frame comparison | BLOCK | G3 |
| AR007 | Respect reduced motion, contrast, save data | `tests/e2e/reduced-motion.spec.ts`, media query assertions | Media query assertion log | BLOCK | G3 |
| AR008 | HTML star list, not narrated canvas | `tests/e2e/keyboard.spec.ts` a11y tree | Accessibility tree snapshot | BLOCK | G3 |
| AR009 | Touch targets large enough | `tests/e2e/mobile.spec.ts` target size | Target size assertion | BLOCK | G3 |
| AR010 | Zero serious or critical axe | `test:a11y` axe on required routes and states | Axe JSON per route and state | BLOCK | G2 |

### 2.5 Performance requirements PR001 to PR012

| ID | Requirement | Enforcement mechanism | Evidence artifact | Class | Gate |
|----|-------------|-----------------------|-------------------|-------|------|
| PR001 | Shell and CSS before Three.js bundle | `tests/e2e/shell.spec.ts` network trace | Network trace with load order | BLOCK | G3 |
| PR002 | Visualization bundle lazy loaded | `tests/e2e/shell.spec.ts` network trace | Lazy chunk timing trace | BLOCK | G3 |
| PR003 | No screenshots until panel opens | `tests/e2e/shell.spec.ts` network trace | Deferred image trace | BLOCK | G3 |
| PR004 | Shell JS under 150 KB compressed | `scripts/report-bundle.ts` | Bundle budget report | BLOCK | G2 |
| PR005 | Viz chunk under 300 KB compressed | `scripts/report-bundle.ts` | Bundle budget report | BLOCK | G3 |
| PR006 | Route transfer under 1.5 MB, 1 MB mobile | `scripts/report-bundle.ts` | Route transfer report | BLOCK | G3 |
| PR007 | LCP under 2.5 s CI mobile | Lighthouse CI mobile profile | Lighthouse report | BLOCK | G5 |
| PR008 | CLS under 0.1 | Lighthouse CI mobile profile | Lighthouse report | BLOCK | G5 |
| PR009 | INP under 200 ms ordinary controls | Lighthouse CI mobile profile | Lighthouse report | BLOCK | G5 |
| PR010 | 60 fps desktop, 30 fps mobile | CI frame instrument (floor) at G3, authoritative measurement on F29 devices (MacBook Pro M4 Max 60 fps, Fred iPhone 30 fps) at G5 | Frame timing log, reference device note | WARN / MANUAL | G3 |
| PR011 | Cap DPR, reduce effects on weak devices | `tests/unit` quality profile, browser config test | Quality profile assertion | BLOCK | G3 |
| PR012 | CI reports sizes and Lighthouse in summary | `scripts/report-bundle.ts`, Lighthouse CI job summary | Job summary report section | WARN | G2 |

### 2.6 Security requirements SR001 to SR010

| ID | Requirement | Enforcement mechanism | Evidence artifact | Class | Gate |
|----|-------------|-----------------------|-------------------|-------|------|
| SR001 | No secrets in client code | Secret scan, build output scan | Secret scan report | BLOCK | G1 |
| SR002 | No private catalog data committed | Public sync only, secret scan, review | Scan report, review note | BLOCK / MANUAL | G1 |
| SR003 | External links HTTPS | `scripts/validate-catalog.ts`, `scripts/check-links.ts` | URL validation output | BLOCK | G1 |
| SR004 | Restrictive CSP compatible with assets | `public/_headers`, `tests/e2e/security-headers.spec.ts` | Header assertion log | BLOCK | G2 |
| SR005 | Content type, referrer, permissions headers | `tests/e2e/security-headers.spec.ts` | Header assertion log | BLOCK | G2 |
| SR006 | No ad, replay, chat, marketing scripts | CSP allowlist, network allowlist test, source review | Allowlist report, source note | BLOCK / MANUAL | G2 |
| SR007 | No raw untrusted HTML from data | ESLint `set:html` ban, Astro escaping, `rehype-sanitize` | Lint result, escaping review | BLOCK | G1 |
| SR008 | Dependency scan blocks critical and high | `ci.yml` full-tree dependency audit of the complete lockfile (primary, blocking gate); `security.yml` `dependency-review-action` as a PR-time supplement covering only changed dependencies | Dependency scan report | BLOCK | G1 |
| SR009 | Third party actions pinned to SHAs | Workflow pin lint scan | Action pin report | BLOCK | G1 |
| SR010 | `SECURITY.md` with reporting path | `SECURITY.md` deliverable publishing `frednix@gmail.com` and GitHub private reporting (F28), doc review | Documentation review note | MANUAL | G1 |

### 2.7 Analytics requirements AN001 to AN004

| ID | Requirement | Enforcement mechanism | Evidence artifact | Class | Gate |
|----|-------------|-----------------------|-------------------|-------|------|
| AN001 | Cloudflare Web Analytics only | Network allowlist test, source review | Network trace, source note | BLOCK / MANUAL | G2 |
| AN002 | No cookie banner, no optional cookies | `tests/e2e/security-headers.spec.ts` no Set-Cookie | Cookie absence assertion | BLOCK | G2 |
| AN003 | No PII from pins, search, camera, audio | Network allowlist test, source review | Allowlist report, source note | BLOCK / MANUAL | G4 |
| AN004 | Analytics never blocks the app | `tests/e2e` analytics defer and block test | App resilience trace | BLOCK | G2 |

### 2.8 Integration requirements IN001 to IN007

| ID | Requirement | Enforcement mechanism | Evidence artifact | Class | Gate |
|----|-------------|-----------------------|-------------------|-------|------|
| IN001 | Card only after domain verified | Human sequencing, separate pull request | Sequencing note in `docs/RELEASE_REPORT.md` | MANUAL | G6 |
| IN002 | Add object to `portfolio.json` schema | `nixfred.github.io` pull request, schema validate | Pull request URL, validation output | MANUAL | G6 |
| IN003 | Card title NIXFRED GALAXY | Pull request content review | Pull request content note | MANUAL | G6 |
| IN004 | Tag Map | Pull request content review | Pull request content note | MANUAL | G6 |
| IN005 | Section Labs | Pull request content review | Pull request content note | MANUAL | G6 |
| IN006 | Recommended description text | Pull request content review | Pull request content note | MANUAL | G6 |
| IN007 | Entry from canonical catalog everywhere | `tests/e2e` homepage card smoke | Homepage card smoke result | BLOCK | G6 |

### 2.9 Acceptance criteria AC001 to AC058

Class and mechanism for every AC row are taken directly from `docs/TEST_PLAN.md` section 3. Gate is the first phase where the criterion is a blocking or recorded check per `docs/EXECUTION_PLAN.md`.

| ID | Requirement | Enforcement mechanism | Evidence artifact | Class | Gate |
|----|-------------|-----------------------|-------------------|-------|------|
| AC001 | Purpose clear in first viewport | `tests/e2e/shell.spec.ts`, `tests/visual/desktop.spec.ts`, tone review | First viewport screenshot, text log | BLOCK / MANUAL | G2 |
| AC002 | Map has every eligible catalog entry | `tests/unit/catalog-merge.test.ts`, `graph-integrity.test.ts` | Count and slug diff report | BLOCK | G2 |
| AC003 | No manual duplicate master list | `tests/unit/catalog-merge.test.ts` import assertion, data flow review | Import allowlist assertion | BLOCK / MANUAL | G1 |
| AC004 | Reachable via Map, Atlas, search, page | `explore.spec.ts`, `search.spec.ts`, `atlas.spec.ts`, `deep-links.spec.ts` | Route coverage report | BLOCK | G2 |
| AC005 | External links HTTPS and safe | `scripts/validate-catalog.ts`, `explore.spec.ts`, `check-links.ts` | Validation and attribute log | BLOCK | G1 |
| AC006 | Reads as cyber cartography | Fred review of production preview | Named acceptance note in `docs/RELEASE_REPORT.md` | MANUAL | G5 |
| AC007 | Major labels readable at overview | `tests/visual/desktop.spec.ts`, `tablet.spec.ts` | Overview screenshots | BLOCK / MANUAL | G5 |
| AC008 | Active state distinct without color | `tests/e2e/explore.spec.ts` state attributes, axe contrast | State attribute log, contrast result | BLOCK / MANUAL | G3 |
| AC009 | Motion before interaction, no block | `tests/e2e/explore.spec.ts` ordered frames, input timing | Ordered frame gallery, timing log | BLOCK | G3 |
| AC010 | Reduced motion stops decorative motion | `tests/e2e/reduced-motion.spec.ts` frame identity | Reduced motion frame gallery | BLOCK | G3 |
| AC011 | Mobile deliberate, not shrunken desktop | `tests/e2e/mobile.spec.ts`, design judgment | Phone trace and video | BLOCK / MANUAL | G3 |
| AC012 | Pointer explore full lifecycle | `tests/e2e/explore.spec.ts` | Playwright trace, focus frames | BLOCK | G3 |
| AC013 | Every action keyboard only | `tests/e2e/keyboard.spec.ts` | Keyboard per action pass list | BLOCK | G3 |
| AC014 | Search opens on shortcuts, focuses | `tests/e2e/search.spec.ts` | Search trace, shortcut log | BLOCK | G4 |
| AC015 | Selection stable deep link | `tests/unit/deep-link.test.ts`, `deep-links.spec.ts` | URL serialization output | BLOCK | G3 |
| AC016 | Direct links restore state | `tests/e2e/deep-links.spec.ts` | Deep link restore trace | BLOCK | G3 |
| AC017 | Sector filters in Map and Atlas | `explore.spec.ts`, `atlas.spec.ts`, `filters.test.ts` | Cross mode filter trace | BLOCK | G4 |
| AC018 | Tours full control set | `tests/e2e/tours.spec.ts` ordered flow | Tour flow trace, transition frames | BLOCK | G4 |
| AC019 | Compare explains the path | `graph-integrity.test.ts`, `compare.spec.ts` | Path output, compare copy assertion | BLOCK | G4 |
| AC020 | Surprise Me avoids repeats | `tests/unit/filters.test.ts` seeded | Deterministic sequence assertion | BLOCK | G4 |
| AC021 | Atlas usable with JS disabled | `tests/e2e/atlas.spec.ts` JS disabled | JS disabled trace, static HTML | BLOCK | G2 |
| AC022 | Forced WebGL failure opens Atlas | `tests/e2e/webgl-fallback.spec.ts` | Forced failure trace, screenshot | BLOCK | G3 |
| AC023 | Canvas not only a11y representation | `keyboard.spec.ts`, `atlas.spec.ts` a11y tree | Accessibility tree snapshot | BLOCK | G3 |
| AC024 | Focus enters and exits panels | `tests/e2e/keyboard.spec.ts` | Focus movement trace | BLOCK | G3 |
| AC025 | Zero serious or critical axe | `test:a11y` axe on required routes and states | Axe JSON report per route | BLOCK | G2 |
| AC026 | Obvious pause for continuous motion | `tests/e2e/explore.spec.ts` | Pause screenshot, toggle frames | BLOCK | G3 |
| AC027 | No audio without user action | `tests/e2e/shell.spec.ts` autoplay off with control (F12 audio ships), source review | Autoplay assertion, source note | BLOCK / MANUAL | G2 |
| AC028 | Snapshot validates against schema | `scripts/validate-catalog.ts`, `catalog-merge.test.ts` | Schema validation output | BLOCK | G1 |
| AC029 | Enrichment maps to known slugs | `scripts/validate-catalog.ts`, `catalog-merge.test.ts` | Enrichment mapping report | BLOCK | G1 |
| AC030 | Relationships valid and complete | `scripts/validate-graph.ts`, `graph-integrity.test.ts` | Graph validation report | BLOCK | G1 |
| AC031 | Layout deterministic per revision | `tests/unit/layout-determinism.test.ts`, cross build hash | Hash equality assertion | BLOCK | G1 |
| AC032 | Unknown dates remain unknown | `scripts/validate-catalog.ts`, schema test | Unknown date assertion | BLOCK | G1 |
| AC033 | Sync makes report, keeps enrichment | `tests/unit/catalog-merge.test.ts` sync fixtures | Sync change report output | BLOCK | G1 |
| AC034 | Three.js lazy loaded | `tests/e2e/shell.spec.ts` network trace | Lazy chunk timing trace | BLOCK | G3 |
| AC035 | Shell works before viz loads | `tests/e2e/shell.spec.ts` throttled | Throttled shell trace | BLOCK | G3 |
| AC036 | Bundle budgets pass | `scripts/report-bundle.ts` | Bundle budget report | BLOCK | G2 |
| AC037 | Lighthouse budgets pass or exception | Lighthouse CI mobile profile | Lighthouse report | BLOCK | G5 |
| AC038 | Renderer pauses when hidden | `tests/e2e` frame counter across visibility | Frame counter assertion | BLOCK | G3 |
| AC039 | Low capability reduces DPR and effects | `tests/unit` quality profile, browser config test | Quality profile assertion | BLOCK | G3 |
| AC040 | No credentials anywhere | `security.yml` gitleaks full git history scan, GitHub secret scanning push protection, `ci.yml` build output scan, review | Secret scan report, review note | BLOCK / MANUAL | G1 |
| AC041 | Security headers on custom domain | `security-headers.spec.ts`, production smoke | Header assertion, production check | BLOCK | G2 |
| AC042 | No unapproved third party scripts | Network allowlist test | Request allowlist report | BLOCK | G2 |
| AC043 | Cloudflare Web Analytics only | Allowlist test, source review | Network trace, source note | BLOCK / MANUAL | G2 |
| AC044 | Actions pinned to immutable commits | Workflow pin lint scan, workflow review | Action pin report, review note | BLOCK / MANUAL | G1 |
| AC045 | PRs run all blocking checks | `ci.yml` full job set, `ci-status` gate | Successful workflow run URL | BLOCK | G1 |
| AC046 | PR gets verified preview deploy | `preview.yml` deploy and smoke | Deployment record, smoke result | BLOCK | G2 |
| AC047 | Exact tested artifact deploys | `ci.yml` digest, `preview.yml` and `production.yml` verify | Artifact digest in job summary | BLOCK | G2 |
| AC048 | Merge to main deploys, no prompt | `production.yml` on `main`, empty required reviewers | Successful main workflow run | BLOCK | G6 |
| AC049 | Production success after domain smoke | `production.yml` job dependency order | Workflow dependency graph | BLOCK | G6 |
| AC050 | `/build.json` reports commit and revision | `production.yml` build.json check | Production build.json check | BLOCK | G6 |
| AC051 | Prior deployment as rollback target | `production.yml` capture, `docs/OPERATIONS.md` inventory | Deployment inventory listing | MANUAL | G6 |
| AC052 | Rollback runbook rehearsed | Controlled `rollback.yml` rehearsal, runbook | Runbook test record | MANUAL | G6 |
| AC053 | Domain live TLS serving build | `production.yml` smoke, command line check | TLS and content smoke result | BLOCK | G6 |
| AC054 | Canonical points to custom domain | `production.yml` canonical assertion | Canonical tag assertion | BLOCK | G6 |
| AC055 | Homepage entry only after verify | Separate pull request, sequencing by hand | Pull request URL, sequencing note | MANUAL | G6 |
| AC056 | Homepage card opens production domain | `tests/e2e` homepage card smoke | Homepage card smoke result | BLOCK | G6 |
| AC057 | Docs match implementation | Documentation review at release | Documentation review note | MANUAL | G5 |
| AC058 | Fred final review, follow ups filed | Fred review, GitHub issues | Issue list or acceptance note | MANUAL | G6 |

AC041's first pass at G2 is preview evidence only: the header assertion runs against a Cloudflare preview deployment, which proves `public/_headers` is wired correctly but is not the custom domain. The row does not close on that preview evidence alone. It closes only when `production.yml`'s custom domain smoke re-asserts the same headers on `https://galaxy.nixfred.com` at G6 (Standing enforcement item 5), which is the actual proof the requirement's own name calls for.

### 2.10 World class rubric WC01 to WC15

These are the binary acceptance checks from `docs/warroom/04_ADVERSARIAL_CRITIQUE.md` section 3, numbered in document order. They are the gate for AC006. Each is answerable yes or no by a person on the running site on real hardware. A "mostly" is a fail. All are MANUAL, applied against the running preview during the design bible rubric review at G5, and reconfirmed on production at G6. Named automated support is listed where a test backs the human judgment. The same numbering is shared with `docs/DESIGN_BIBLE.md`. Decision F9 chose an even blend of the four metaphors and answered the critic's drift warning with enforcement, not thesis, so WC02 (template test) and WC15 (kill list absent) remain fully blocking rubric gates.

| ID | Rubric check | Review mechanism and automated support | Evidence artifact | Class | Gate |
|----|--------------|----------------------------------------|-------------------|-------|------|
| WC01 | First viewport truth | Rubric review, support `tests/e2e/shell.spec.ts` (AC001) | Rubric note, first viewport screenshot | MANUAL | G5 |
| WC02 | Template test, identifiable if stripped | Rubric review on running preview | Rubric note in `docs/RELEASE_REPORT.md` | MANUAL | G5 |
| WC03 | Text legibility, no glow or hairline | Rubric review, support axe contrast (AC008, AC025) | Rubric note, contrast result | MANUAL | G5 |
| WC04 | Monospace discipline | Rubric review on running preview | Rubric note | MANUAL | G5 |
| WC05 | Camera obedience, no drift or overshoot | Rubric review, support `explore.spec.ts` focus frames (AC012) | Rubric note, focus frame gallery | MANUAL | G5 |
| WC06 | Input latency under 200 ms | Rubric review, support Lighthouse INP (PR009, AC037) | Rubric note, Lighthouse report | MANUAL | G5 |
| WC07 | Motion restraint while reading | Rubric review, support `explore.spec.ts` panel calm | Rubric note, panel calm trace | MANUAL | G5 |
| WC08 | Graph never a hairball | Rubric review, support `explore.spec.ts` overview cap (FR038) | Rubric note, overview edge assertion | MANUAL | G5 |
| WC09 | Color hierarchy, saturation on focus | Rubric review on running preview | Rubric note | MANUAL | G5 |
| WC10 | Composition, not scatter | Rubric review at real catalog size | Rubric note | MANUAL | G5 |
| WC11 | Metadata credibility, no filler | Rubric review, support graph validation (AC030) | Rubric note, validation report | MANUAL | G5 |
| WC12 | Loading honesty, no fake percentage | Rubric review, support `shell.spec.ts` loading states (VR008) | Rubric note, loading assertion | MANUAL | G5 |
| WC13 | Mobile intentionality | Rubric review, support `mobile.spec.ts` (AC011) | Rubric note, phone trace | MANUAL | G5 |
| WC14 | Reduced motion is designed | Rubric review, support `reduced-motion.spec.ts` (AC010) | Rubric note, reduced motion gallery | MANUAL | G5 |
| WC15 | Kill list is absent | Rubric review scanning for every section 1 cliche | Rubric note in `docs/RELEASE_REPORT.md` | MANUAL | G5 |

### 2.11 Settled content decision F1F2

Content anchors and hero edges settled by Fred in `docs/DECISIONS.md` Part 5, recorded 2026-07-11, enforced as one data authoring gate so the map's editorial spine is provable, not assumed. Sky Walrus is one of the seven anchors and is the only easter egg in v1 per decision F21; the cut typed commands and Konami state carry no rows. The Sky Walrus harmless and accessibility invisible property is enforced by AC025 (axe zero violations on the aria hidden canvas) and by the WC15 kill list absence check, so it needs no separate row.

| ID | Requirement | Enforcement mechanism | Evidence artifact | Class | Gate |
|----|-------------|-----------------------|-------------------|-------|------|
| F1F2 | Seven Fred anchors and five hero edges | `scripts/validate-catalog.ts` asserts `galaxy.enrichment.json` marks exactly the seven named anchors with Fred provenance, `scripts/validate-graph.ts` asserts `relationships.json` contains the five hero edge records | Anchor provenance and hero edge assertion | BLOCK | G2 |

F1 anchors, from decision F1: Meet Larry, Build Your Own Larry, The Universe As I See It, YouTube Library, Sky Walrus, Where Physics Starts Sweating, The Code Audit. AI Signal is separately elevated in brightness per Fred's note and is not part of the exact seven anchor assertion. F2 hero edges, from decision F2, are five directed edge records enforcing four named relationships: Meet Larry to Build Your Own Larry, Build Your Own Larry to AI Infrastructure Portfolio, Artemis Tracker to Where Physics Starts Sweating, and the intelligence pipeline as two edges, The Nix Times to INTEL and INTEL to AI Signal.

## 3. Gate rollup

For each gate, the row IDs that must first pass at that gate. A gate passes only when every listed row passes with its evidence artifact recorded. Rows keep passing in later phases; this list is the first point of proof, which operationalizes the blocking checks in `docs/EXECUTION_PLAN.md` and extends them where that plan defers to `docs/GATES.md`.

### G0 Provisioning
No requirement matrix rows resolve here. G0 is verified by its own five provisioning checks in `docs/EXECUTION_PLAN.md`: repository visibility and protection, verified tooling auth, present secrets and variables, Pages project with correct production branch, and a confirmed remote. The security setup that these rows depend on begins here but first passes at G1.

### G1 Foundation (35 rows)
FR006, FR007, FR008, FR032, FR033, FR048, FR063, DR001, DR002, DR003, DR004, DR005, DR006, DR007, DR008, DR009, DR010, SR001, SR002, SR003, SR007, SR008, SR009, SR010, AC003, AC005, AC028, AC029, AC030, AC031, AC032, AC033, AC040, AC044, AC045.

### G2 Atlas first (42 rows)
FR001, FR002, FR003, FR004, FR023, FR024, FR025, FR028, FR030, FR049, FR050, FR051, FR054, FR055, FR062, FR065, AR001, AR002, AR003, AR005, AR010, PR004, PR012, SR004, SR005, SR006, AN001, AN002, AN004, AC001, AC002, AC004, AC021, AC025, AC027, AC036, AC041, AC042, AC043, AC046, AC047, F1F2.

### G3 The Galaxy (55 rows)
FR005, FR009, FR010, FR011, FR012, FR013, FR014, FR015, FR016, FR017, FR018, FR019, FR020, FR021, FR022, FR034, FR038, FR052, FR053, FR056, FR061, FR064, VR003, VR005, VR007, VR008, VR009, AR004, AR006, AR007, AR008, AR009, PR001, PR002, PR003, PR005, PR006, PR010, PR011, AC008, AC009, AC010, AC011, AC012, AC013, AC015, AC016, AC022, AC023, AC024, AC026, AC034, AC035, AC038, AC039.

### G4 Features (26 rows)
FR026, FR027, FR029, FR031, FR035, FR036, FR037, FR039, FR040, FR041, FR042, FR043, FR044, FR045, FR046, FR047, FR057, FR058, FR059, FR060, AN003, AC014, AC017, AC018, AC019, AC020.

### G5 Polish and hardening (27 rows)
VR001, VR002, VR004, VR006, VR010, PR007, PR008, PR009, AC006, AC007, AC037, AC057, WC01, WC02, WC03, WC04, WC05, WC06, WC07, WC08, WC09, WC10, WC11, WC12, WC13, WC14, WC15.

### G6 Launch (18 rows)
DR011, IN001, IN002, IN003, IN004, IN005, IN006, IN007, AC048, AC049, AC050, AC051, AC052, AC053, AC054, AC055, AC056, AC058.

## 4. Evidence ledger protocol

Every row produces an evidence artifact. Evidence is where a reviewer verifies the row actually passed, not just that the pipeline was green.

1. Automated rows, being BLOCK and WARN. Evidence lives in the CI run: uploaded artifacts and the job summary. `ci.yml` uploads `site-dist-<sha>` and `ci-reports-<sha>` (test, coverage, accessibility, visual, bundle reports). Motion galleries, axe JSON, frame identity results, the artifact digest, and the domain census report are retained per run. The job summary carries bundle sizes, Lighthouse results, the artifact digest, and pin scan output. The evidence reference for an automated row is the workflow run URL plus the artifact name.

2. Manual rows, being MANUAL and the MANUAL half of dual rows. Evidence lives in dated Markdown notes under `docs/evidence/`. Naming convention: `docs/evidence/<YYYY-MM-DD>-<row-id>-<short-slug>.md`, for example `docs/evidence/2026-07-11-AC006-cyber-cartography.md`. Each note records the reviewer, the date, the row ID, the running artifact reviewed (preview URL, screenshot, or trace), and the yes or no verdict. The manual screen reader matrix, the design bible rubric checklist WC01 to WC15, the PR010 reference device measurement, and the rollback rehearsal record are manual notes.

3. Launch rollup. `docs/RELEASE_REPORT.md` is the final launch rollup. It aggregates the automated run URLs, the manual notes, and the 14 item deployment evidence contract from `docs/CI_CD.md` section 9. A release is complete only when every G6 row and every standing row references its evidence in this report.

4. Gate passing commits. Phase completion is a git commit whose message names the gate and links the evidence, per `docs/EXECUTION_PLAN.md`. A commit that claims a gate must reference the run URL or the `docs/evidence/` notes for every row assigned to that gate. A gate is not passed by assertion, only by referenced evidence.

## 5. Standing enforcement

These rows do not stop mattering at launch. They must keep passing, and a regression reopens the named gate.

1. `scheduled_checks.yml` monitoring. Keeps AC005 external links, AC028 catalog schema, DR011 total domain coverage, and the ongoing half of AC053 domain health and AC056 homepage card passing after launch. Default daily, the census on the maintenance schedule. An actionable failure, including any newly discovered live property missing from the map, opens or updates a single tracking issue and reopens G6.

2. `security.yml` scanning. Keeps SR009 action pinning, AC044, and AC040 secret scanning (gitleaks full git history) passing on every push, pull request, and weekly schedule, and supplements `ci.yml`'s primary, full-tree SR008 dependency audit with a PR-time dependency review of changed dependencies. A new critical or high advisory without a dated exception in `docs/DECISIONS.md` reopens G5, and a repointed unpinned action reopens G1.

3. `sync-catalog.yml` validation. Keeps AC002 catalog completeness, AC003 no manual master list, AC033 sync report and enrichment preservation, and the F1F2 anchor and hero edge assertions passing as upstream changes. Every sync pull request runs the full `ci.yml` and `preview.yml`, so a sync that breaks any G1 or G2 data row reopens that gate before it can merge.

4. `ci.yml` on every change. Every G1 through G4 automated row reruns on every pull request and on `main`. Any regression fails `ci-status` and blocks promotion, which reopens the gate that row belongs to.

5. Production smoke in `production.yml`. Reasserts AC041, AC049, AC050, AC053, and AC054 on every production deploy. A failed smoke starts the auto rollback path and reopens G6.

What reopens a gate: any row assigned to that gate failing after it was marked passed, or evidence for that row going missing or stale. Fix backward to the reopened gate before resuming forward work.

## 6. Reconciliations

Genuine contradictions between the source documents, resolved here so the matrix is internally consistent.

1. Frame rate class, EXECUTION_PLAN versus TEST_PLAN, now anchored by F29. `docs/EXECUTION_PLAN.md` gate G3 check 7 lists 60 fps desktop and stable 30 fps mobile as a blocking check on CI reference settings. `docs/TEST_PLAN.md` section 9.5 states CI can only WARN on instrumented frame drops and that the authoritative 60 and 30 targets require an approved reference device as a MANUAL measurement. Decision F29 names those devices: Fred's MacBook Pro M4 Max for 60 fps and Fred's iPhone for 30 fps, with CI approximating both through documented profiles. Resolution, PR010 is recorded as WARN and MANUAL with first gate G3: the CI frame instrument enforces a failure floor that blocks gross jank at G3, and the authoritative 60 and 30 confirmation is a MANUAL measurement on the F29 devices recorded at G5. The G3 blocking intent is preserved as the instrumented floor, not as an authoritative frame rate claim.

2. Workflow permissions, SECURITY_PLAN versus CI_CD. `docs/SECURITY_PLAN.md` section 3.1 grants `preview.yml` `statuses: write` and omits `actions: read`, and grants `production.yml` `contents: write` and `deployments: write` without `issues: write`. `docs/CI_CD.md` section 11 grants `preview.yml` `actions: read` and no `statuses: write`, and grants `production.yml` `issues: write` for the auto rollback incident issue. Resolution, `docs/CI_CD.md` is authoritative for CI/CD by its own reconciliation rule, so the CI_CD permission sets govern: `preview.yml` uses `actions: read` to download the artifact, and `production.yml` holds `issues: write` so auto rollback can open an incident. This affects only the wiring of AC046 and AC048 rows, not their class or gate.

3. Rollback readiness, automated capture versus MANUAL acceptance. `docs/CI_CD.md` has `production.yml` capture `PREVIOUS_DEPLOYMENT` automatically and auto rollback on failure, which reads as automated. `docs/TEST_PLAN.md` classes AC051 and AC052 as MANUAL operational checks. Resolution, AC051 and AC052 stay MANUAL: the automated capture and auto rollback in `production.yml` are supporting safeguards and their run output is evidence, but acceptance is closed by the recorded deployment inventory in `docs/OPERATIONS.md` and the controlled rollback rehearsal record, which are human procedures. The gate for both is G6.

4. Preview noindex placement, SECURITY_PLAN versus CI_CD, confirmed by F26. `docs/SECURITY_PLAN.md` section 2 states `_headers` is the wrong place for a blanket noindex and defers it to build time. `docs/CI_CD.md` section 7 bakes noindex into the preview artifact at build time and verifies both the header and the meta tag. Decision F26 settles previews as public with noindex. These agree in intent; the apparent tension is only about wording. No matrix row changes: preview noindex is verified inside the `preview.yml` smoke that backs AC046, and production omits it so AC054 canonical indexing is unaffected.

5. Design thesis, F9 override of the critic's tiebreaker. `docs/warroom/04_ADVERSARIAL_CRITIQUE.md` section 4 recommends atlas geometry and terminal voice as the metaphor tiebreaker. Decision F9 overrides this with an even blend of all four metaphors and directs `docs/DESIGN_BIBLE.md` to reflect the override. Resolution, no matrix row changes: F9 explicitly answers the drift risk with enforcement, so WC02 and WC15 remain blocking MANUAL rubric gates at G5, which is exactly how they are recorded here. The override changes the design thesis, not the gates that police it.
