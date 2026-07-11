# NIXFRED GALAXY Decisions

Status: APPROVED record. All 80 recommended defaults in the interview were accepted on 2026-07-10 under Fred's directive that the requirements pack is the starting point and its accepted defaults mechanic applies. Any number Fred did not change became an accepted decision.

This file contains four parts:

1. The structured decision record, filled from the accepted defaults.
2. A compact table of all 80 interview questions and their accepted default answers.
3. The canonical rulings recorded on 2026-07-10.
4. The PENDING-FRED items that genuinely require Fred's personal input and cannot safely default.

Interview question references use Q followed by the number from `01_INTERVIEW.md`. Discovery references use D followed by the number from `06_DISCOVERY_INTERVIEW.md`. Requirement IDs reference `docs/PRD.md`.

## Part 1. Structured decision record

Note: Part 5, the Fred session rulings of 2026-07-11, is the supreme layer of this record. Where a Part 5 ruling touches an item below, Part 5 governs. The two direct overrides are marked inline (F20 camera memory, F21 easter eggs).

### Product

1. Final name: NIXFRED GALAXY. Fixed target, confirmed Q10.
2. Primary audience: technical leaders first, then hiring managers, architects, builders, curious peers, and general visitors, in that order. Q2.
3. Primary purpose: create wonder first, prove technical range second, drive professional contact third. Q1.
4. Emotional target: calm, cinematic, precise, and quietly strange. Wonder before proof. Q1 and art direction.
5. One sentence visitor takeaway: Fred has built a large, connected body of technical, creative, professional, and personal work. Q3. Lead line `Every project. One connected system.` Q4.

### Visual system

1. Map dimensionality: constrained 2.5D. Depth, parallax, and camera movement without disorientation or hidden labels. Q13.
2. Renderer: Three.js, lazy loaded only when interactive mode is used. Fixed target and canonical ruling 1.
3. Central core: the NIXFRED node as the navigation hub, not a normal project star. Q10.
4. Sector model: six sectors as distinctive luminous field regions around the core, IT, Labs, Work, Signal, Clients, Personal. Cyber cartography, an observatory built inside a terminal, not a stock galaxy wallpaper. Q14 and art direction.
5. Palette: inherit the nixfred.com sector colors with careful contrast adjustments. IT coral, Labs green, Work cyan, Signal amber, Clients violet, Personal soft silver. Q15.
6. Typography: a strong geometric display face for names, a monospaced face for coordinates, status, commands, paths, and dates, and a readable sans for descriptions. Japanese accent text kept only in small labels and interface metadata. Locally bundled, no render blocking font CDN. Q24 and art direction.
7. Motion intensity: calm and cinematic. Slow drift, gentle depth, restrained pulses, no visual carnival. Startup sequence finishes within about 1.5 seconds and never blocks interaction. Q19 and Q20.
8. Audio: optional ambient audio with a visible control, off by default, never autoplaying, preference remembered locally. Q26.
9. Signature events: the Larry anomaly as a moving or self repositioning node, the rare Sky Walrus background drift, the ignition sequence, the path trace, and the historical bloom in timeline mode. Q25, Q27, and art direction. Every effect harmless, reversible, and ignored by accessibility tooling. OVERRIDE F21: Sky Walrus is the only easter egg in v1; the typed `whoami`, `larry`, and `home` commands and any Konami state are cut.

### Content

1. Canonical project source: `nixfred/nixfred.github.io/portfolio.json`. Galaxy never becomes a competing master list. Q49 and DR001.
2. Snapshot policy: a committed validated snapshot is used for deterministic builds. A scheduled workflow checks weekly, updates the snapshot, validates it, and opens an automated pull request. Production builds never fetch the catalog at runtime. Q51, DR002, DR010.
3. Project status vocabulary: active, evolving, archived, client, experiment, memorial. Archived work stays visible but dim with an explicit status. Q8 and product requirements.
4. Relation types: initial set is `built_on`, `shared_subject`, `shared_technology`, `client_work`, `personal_history`, and `chronology`. Every inferred edge must carry a visible reason in the data. Q52 and Q60. See canonical ruling on relation vocabulary in Part 3.
5. Timeline precision: launch dates come only from Git history, published content, or a Fred supplied decision. Unknown dates remain unknown and may group into a `DATE NOT RECORDED` bucket. Timeline mode stays disabled until trustworthy dates exist for every included project or the unknown state is explicitly designed. Q40, Q53, FR045, FR048.
6. Screenshot policy: screenshots appear only in the detail panel and generated Open Graph cards. The main sky stays abstract and fast. Q62.
7. Description policy: one sharp sentence in the panel, then an optional detail section of roughly 60 to 120 words. No more than six visible tags per project. Q55 and Q56.

### Interaction

1. Entrance behavior: a skippable startup sequence of about 1.5 seconds. The visitor may skip immediately. Repeat visits use a shortened entrance unless the visitor requests the full sequence. Q20 and product requirements.
2. Camera controls: pan, zoom, constrained orbit, click to focus, wheel to zoom, Escape to return, and keyboard access to every command. Pitch limited and roll prevented so the interface stays legible. Q30 and Q31.
3. Click behavior: selecting a star focuses the camera, illuminates related lines, and opens a right side detail panel without leaving the map. Q32.
4. Link target behavior: Open Project opens the project in a new tab, preserves the current galaxy state, and uses safe link attributes. Q33 and FR022.
5. Search behavior: `Command K`, `Control K`, and `/` open search and commands. The chosen result receives focus, its panel opens, and the URL updates. Results stay visible in the map. Q36 and Q37.
6. Tour behavior: three launch tours, each supporting pause, skip, back, exit, and resume, without trapping keyboard focus, each with a shareable URL. Q39, FR041, FR043.
7. URL state: every project, sector, and tour selection updates a stable deep link. Every public project also has a crawlable page at `/project/<slug>/`. Q34 and Q35.
8. Preference persistence: OVERRIDE F20 governs camera memory. The camera position is remembered during the browser session, so returning from a project tab restores the prior view. A fresh browser visit still begins at the intentional overview and deep linked state is preserved. Pins are session only with no account and do not leave the browser unless Fred explicitly approves local persistence. Q43, Q44 as amended by F20, FR058.

### Repository

1. GitHub owner: `nixfred`. Fixed target and execution directive.
2. Repository name: `galaxy.nixfred.com`. Fixed target.
3. Visibility: public. Q63.
4. Main branch policy: `main` is the only production branch. Pushing `main` deploys production. Force pushes to `main` and deletion of `main` are prohibited. Q67 and CI/CD contract.
5. Review requirement: no outside reviewer is required for this personal repository. Branch protection requires all CI checks. Feature work uses branches and pull requests. Q65 and Q69.
6. Dependency update policy: Dependabot opens grouped weekly updates for Bun packages and GitHub Actions. Third party Actions are pinned to immutable commit SHAs and annotated with the intended release. Q77 and Q78.
7. License: MIT for source code. Project screenshots and personal writing retain their original rights unless explicitly licensed. Q64.

### Deployment

1. Cloudflare Pages project name: `galaxy-nixfred-com`. Fixed target.
2. Production domain: `galaxy.nixfred.com`. Fixed target and D130.
3. Production approval policy: automatic deployment on merge to `main`. No manual GitHub environment approval. The automated quality gates are the approval. Q67 and Q68.
4. Preview access policy: every pull request receives a Cloudflare preview deployment. Previews must not be indexable. Public preview URLs are the default unless Fred requests Cloudflare Access protection. Q66 and PENDING-FRED item on preview access.
5. Release identifier policy: a static `/build.json` exposes the public commit SHA, build time, version, branch, and catalog revision. Q74. The release tag form is a minor PENDING-FRED item with a safe default.
6. Artifact retention: a minor PENDING-FRED item. Safe default is 30 days for build artifacts and 90 days for test reports until Fred sets a policy.
7. Rollback policy: when production smoke tests fail, mark the deployment failed, immediately restore the previous successful production deployment, and open a GitHub issue containing the evidence. A preview deployment is never a rollback target. Rollback proceeds without asking whether it is allowed. Q75.

### Privacy and operations

1. Analytics: Cloudflare Web Analytics only. No additional analytics, cookies, advertising, session replay, or fingerprinting. Q73 and AN001.
2. Event collection: no personally identifiable session data. Project pinning, search history, and camera behavior are not collected. AN003.
3. Error tracking: no external service for version one. Runtime errors are captured to the browser console with actionable context and no private data. Q80 and FR064.
4. Uptime monitoring: the scheduled checks workflow verifies the custom domain, essential assets, and published project links on a weekly schedule and produces an issue only when actionable failure thresholds are met. CI/CD contract.
5. Notifications: GitHub deployment records, job summaries, and issues only. Nothing beyond GitHub for version one. Q80.
6. Public build metadata: `/build.json` is present and production verification confirms the live metadata matches the expected commit. Q74 and FR004.

### Launch

1. Main site placement: a visually prominent card or featured treatment on nixfred.com, not buried in the ordinary grid. Added only after the production custom domain passes verification. Product requirements and IN001.
2. Main site shortcut: a keyboard shortcut on nixfred.com may open Galaxy only if Fred approves. PENDING-FRED item.
3. Card copy: title `NIXFRED GALAXY`, tag `Map`, section `Labs`, description per IN006. IN003 through IN006.
4. Test group: PENDING-FRED item. Safe default is public launch when all gates are green with no private test group.
5. Target date: PENDING-FRED item. Safe default is to ship when green with no fixed date.
6. Definition of amazing: PENDING-FRED item. Non-blocking. Follow up captured as GitHub issues per AC058.

## Part 2. Interview question table

All 80 questions from `01_INTERVIEW.md`. Every answer is the recommended default, accepted 2026-07-10.

### Product identity

| Q | Topic | Accepted decision |
|---|-------|-------------------|
| 1 | Primary purpose | Wonder first, technical range second, professional contact third |
| 2 | First audience | Technical leaders, then hiring managers, architects, builders, peers, general visitors |
| 3 | Ten second understanding | Fred built a large, connected body of technical, creative, professional, and personal work |
| 4 | Main line | `Every project. One connected system.` |
| 5 | Supporting line | `Move through the work as a living map. Follow the lines between AI, infrastructure, security, space, clients, and memory.` |
| 6 | Opening action | `ENTER THE MAP` |
| 7 | Coverage | Show every public project. Tours and filters create curated views |
| 8 | Archived work | Yes, shown as a dim archived star with explicit status |
| 9 | Private work | No, unless Fred creates a public teaser with no private details |
| 10 | NIXFRED as central node | Yes, the navigation hub, not a normal project star |
| 11 | Biography amount | One short identity line, a nixfred.com link, and a resume link. Projects carry the story |
| 12 | Professional call to action | `See the resume` and `Explore the source` |

### Art direction

| Q | Topic | Accepted decision |
|---|-------|-------------------|
| 13 | Dimensionality | Constrained 2.5D |
| 14 | Visual language | Cyber cartography, an observatory built inside a terminal |
| 15 | Sector colors | Inherit nixfred.com colors: IT coral, Labs green, Work cyan, Signal amber, Clients violet, Personal soft silver |
| 16 | Background | Very subtle sector clouds that recede behind selected content, no loud wallpaper |
| 17 | Star size | Editorial importance and featured status, not traffic or popularity |
| 18 | Star brightness | Live status and current relevance. Archived stays visible but dim |
| 19 | Motion intensity | Calm and cinematic, slow drift, gentle depth, restrained pulses |
| 20 | Startup sequence | Yes, finishes within about 1.5 seconds, never blocks interaction |
| 21 | Labels | Major stars always labeled. Minor stars reveal labels on focus, hover, keyboard, or proximity |
| 22 | Relationship lines visibility | Active node relationships, sector skeletons, and selected tour path only. No permanent spaghetti |
| 23 | Line animation | Yes, slow signal travel, stops in reduced motion |
| 24 | Japanese accents | Yes, only in small labels and interface metadata |
| 25 | Astronaut image | No on the main map. Optional in About panel or final tour stop |
| 26 | Audio | Optional ambient, visible control, off by default, never autoplaying |
| 27 | Sky Walrus egg | Yes, a tiny satellite crosses the outer map after exploration |
| 28 | Icons | Abstract sector glyphs and line geometry, not logo stickers |

### Interaction

| Q | Topic | Accepted decision |
|---|-------|-------------------|
| 29 | Initial camera | Full system with central NIXFRED node visible and one quiet prompt to begin a tour |
| 30 | Desktop controls | Pan, zoom, constrained orbit, click to focus, wheel zoom, Escape to return, full keyboard access |
| 31 | Free rotation | No. Limit pitch and prevent roll |
| 32 | On selection | Camera focuses, related lines illuminate, right side detail panel opens without leaving the map |
| 33 | Open project | New tab, preserve galaxy state |
| 34 | Shareable URLs | Yes, every selection updates a stable deep link |
| 35 | Crawlable pages | Yes, generate `/project/<slug>/` pages |
| 36 | Command palette | Yes, `Command K`, `Control K`, and `/` |
| 37 | Search moves camera | Yes, result focuses, panel opens, URL updates |
| 38 | Sector filters | Yes, isolate one or several sectors without destroying camera position |
| 39 | Guided tours | Yes, launch with Start Here, AI and Infrastructure, Space and Physics |
| 40 | Timeline mode | Yes, once trustworthy launch dates exist for every included project |
| 41 | Random jump | Yes, called `SURPRISE ME` |
| 42 | Compare projects | Yes, highlights shortest meaningful path and explains the connection |
| 43 | Pin favorites | Yes, session state only, no account |
| 44 | Remember camera | No by default. Deep linked state preserved, fresh visit begins at overview |
| 45 | Mobile | Simplified 2D map, touch friendly filters, bottom detail sheet, no unrestricted 3D |
| 46 | Reduced motion | Stop drift, pulses, signal travel, parallax, choreography. Keep instant focus and full function |
| 47 | WebGL failure | Auto load Atlas mode with a quiet unavailable message |
| 48 | Atlas as first class | Yes, a visible `ATLAS` control is always available |

### Data and storytelling

| Q | Topic | Accepted decision |
|---|-------|-------------------|
| 49 | Upstream catalog | Yes, `nixfred/nixfred.github.io/portfolio.json`, never a competing master list |
| 50 | Added data | Separate enrichment file keyed by stable slug |
| 51 | Upstream changes | Weekly scheduled workflow updates a committed snapshot, validates, opens an automated PR. No live runtime fetch |
| 52 | First relationship map | Yes, Larry infers an initial graph, every inferred edge carries a visible reason |
| 53 | Launch dates | Yes, only from Git history, published content, or Fred decision. Unknown stays unknown |
| 54 | Public repos in panels | Yes, when the repository mapping is confirmed |
| 55 | Technology tags | Yes, no more than six visible tags per project |
| 56 | Detail copy length | One sentence in the panel, optional 60 to 120 word detail |
| 57 | Client projects | Yes, in a distinct Clients region, no implied ownership of the client business |
| 58 | Personal projects | Yes, treated quietly and respectfully, especially caregiving and memorial work |
| 59 | Private or employer material | Only the public landing page and public description. No private feeds, documents, metrics, or internal data |
| 60 | Edge types | Yes: `built_on`, `shared_subject`, `shared_technology`, `client_work`, `personal_history`, `chronology` |
| 61 | Positions algorithmic | No. Deterministic category anchors, seeded placement, manual coordinates for major nodes |
| 62 | Screenshots | Only in the detail panel and generated Open Graph cards. Main sky stays abstract |

### Operations and governance

| Q | Topic | Accepted decision |
|---|-------|-------------------|
| 63 | Public repository | Yes |
| 64 | License | MIT for source. Screenshots and personal writing retain original rights |
| 65 | Pull requests | Yes, branch, open PR, review preview, merge on green, no extra permission question |
| 66 | Preview per PR | Yes |
| 67 | Auto production on merge | Yes, pushing `main` deploys production |
| 68 | Manual environment approval | No, automated quality gates are the approval |
| 69 | Branch protection checks | Yes, all CI checks, no outside reviewer required |
| 70 | Blocking checks | Format, lint, strict type check, Astro check, data validation, unit, end to end, accessibility, build, broken link, visual regression, critical performance |
| 71 | Performance regressions block | Yes for large regressions and hard budget failures. Small changes become warnings |
| 72 | Visual regression snapshots | Yes for desktop, tablet, mobile, Atlas, reduced motion, and selected project states |
| 73 | Cloudflare Web Analytics | Yes. No other analytics, cookies, ads, replay, or fingerprinting |
| 74 | Build info endpoint | Yes, `/build.json` with commit SHA, build time, version, branch, catalog revision |
| 75 | Failed smoke tests | Mark failed, restore prior successful deployment, open a GitHub issue. No permission question |
| 76 | Auto add to nixfred.com | Yes, open and merge a `portfolio.json` change only after production is verified |
| 77 | Automated dependency updates | Yes, Dependabot grouped weekly for Bun packages and Actions |
| 78 | Pin Actions | Yes, pin to immutable commit SHAs with intended release annotation |
| 79 | Contact form | No, use links to resume, GitHub, LinkedIn, and nixfred.com |
| 80 | External notifications | No for version one, GitHub records, summaries, and issues are sufficient |

## Part 3. Canonical rulings recorded 2026-07-10

These rulings are settled and are not to be re-litigated.

R1. Stack. Astro static output with strict TypeScript, Bun as the pinned package manager and lockfile, Three.js lazy loaded only for interactive mode, Playwright for browser and smoke tests, Vitest for unit tests, axe for accessibility, and Wrangler Direct Upload to the Cloudflare Pages project `galaxy-nixfred-com` with configuration in `wrangler.jsonc`. The earlier architecture draft that recommended Vite, React, and React Three Fiber is superseded. The professional file manifest is the canonical repository tree.

R2. Defaults accepted. All 80 recommended defaults in the interview are accepted as decisions per Fred's 2026-07-10 directive that the pack is the starting point and its defaults mechanic applies.

R3. Stable IDs. The requirement IDs FR001 through FR065, DR001 through DR010, VR001 through VR010, AR001 through AR010, PR001 through PR012, SR001 through SR010, AN001 through AN004, IN001 through IN007, and the acceptance IDs AC001 through AC058 are stable. Reference them by ID and never renumber.

R4. Public repository safety. The repository is public. Nothing private may appear. No secrets, no family, health, or recovery details, no internal infrastructure facts. Personal and memorial projects are referenced only as the public site already references them.

R5. No invented facts. Never invent dates, project facts, or metrics. Unknown values receive an explicit PENDING-FRED marker rather than a fabricated value.

R6. Relation vocabulary reconciliation. The accepted initial relation type set is the six from Q60: `built_on`, `shared_subject`, `shared_technology`, `client_work`, `personal_history`, `chronology`. The richer verbs listed in the source product requirements and discovery interview, such as inspired, evolved into, supports, and same series, are treated as candidate future types, not launch types. Adding any of them is a later decision to record here. This resolves the conflict between the three source documents in favor of the accepted interview default.

R7. Launch tour names. The three launch tours are Start Here, AI and Infrastructure, and Space and Physics, per Q39 and FR044. Where a source document called the second tour AI Systems, the FR044 name AI and Infrastructure governs.

R8. Canonical workflow set. The delivery pipeline uses seven GitHub Actions workflows: `ci.yml`, `preview.yml`, `production.yml`, `rollback.yml`, `scheduled_checks.yml`, `security.yml`, and `sync-catalog.yml`, as specified in `docs/CI_CD.md`. This resolves the naming conflict between the CI/CD requirements document and the professional file manifest in favor of the CI/CD contract, because its mandatory `production.yml` and `rollback.yml` behaviors carry acceptance criteria (AC051, AC052) and because least privilege forbids merging workflows with different permission profiles. The manifest's `deploy.yml` is delivered as `production.yml`; the manifest's five workflow list is superseded on this one point. `docs/ARCHITECTURE.md` section 10 defers to `docs/CI_CD.md` for workflow decomposition.

R9. Census privacy scoping, recorded 2026-07-11. The DR011 domain census satisfies decision F3 (every public web property appears) while honoring ruling R4 (no internal infrastructure facts in public):

1. Raw zone enumeration output never leaves the workflow run: never committed, never uploaded as an artifact, never printed to logs, never included in issue bodies.
2. A hostname or path is census-eligible only if it serves public HTML over HTTPS with an HTTP 200 response, meaning it is a public web property.
3. DNS records that are not public websites (mail, TXT, service CNAMEs, API endpoints, tooling, anything failing the eligibility check) appear in outputs only as aggregate counts, never by name.
4. The public census report and any GitHub issue may name only census-eligible gaps, public websites missing from the map.
5. An editorial exclusion file `src/data/census-exclusions.json` may exclude a census-eligible public website from the map requirement, each entry carrying a reason, entries limited to already-public websites, exclusions auditable and never silent.

## Part 4. PENDING-FRED items

These items genuinely require Fred's personal input and cannot safely default. Each states the build phase that needs it and the safe fallback if it stays unanswered. Nothing here blocks the start of the build. Every fallback keeps the site shippable and truthful.

### Blocking-quality content decisions

P1. Five brightest anchor projects. Discovery D37.
Phase: data enrichment and layout authoring. Sets the manual weight in `galaxy.enrichment.json` that drives FR009 star sizing and the manual coordinates for major nodes in FR008 and FR061.
Fallback: Larry derives weight from the `featured` flag in `portfolio.json` plus conservative editorial judgment and marks the provenance as inferred. The map still ships with a sensible hierarchy, but the brightest five reflect Larry's inference rather than Fred's intent until confirmed.

P2. Three project connections that must be visible. Discovery D54.
Phase: relationship authoring. Sets guaranteed hero edges in `relationships.json` under FR032 through FR034.
Fallback: Larry infers the initial graph per Q52 with a visible reason on every edge. No specific connection is guaranteed to be surfaced at the overview level until Fred names the three.

P3. Relationships that must never be inferred automatically. Discovery D53.
Phase: relationship authoring and content safety.
Fallback: Larry stays conservative, especially on personal, family, and memorial links, consistent with R4 and Q58. If a sensitive inferred edge is uncertain, it is omitted rather than published.

### Launch and environment decisions

P4. Reference devices, one mobile and one desktop. Discovery D154 and D155.
Phase: performance budgets, the Playwright device and viewport matrix, and CI, affecting PR007, PR010, and acceptance evidence.
Fallback: use a standard mid tier Android class device profile for mobile and a common 1440 by 900 desktop viewport, documented as an assumption in `docs/ARCHITECTURE.md` and `docs/TEST_PLAN.md`. Budgets are enforced against those profiles until Fred names real devices.

P5. Target launch date. Discovery D168.
Phase: launch and operations.
Fallback: no fixed date. Ship when all blocking gates are green.

P6. Test group before public launch. Discovery D169.
Phase: launch.
Fallback: no private test group. Public launch proceeds when green, and follow up is captured as GitHub issues per AC058.

P7. nixfred.com keyboard shortcut to open Galaxy. Product requirements and Discovery D72.
Phase: main site integration, after production verification, in the IN work.
Fallback: ship Galaxy without a nixfred.com keyboard shortcut. The prominent featured card is sufficient.

P8. Preview access privacy. Discovery D134.
Phase: CI/CD preview configuration.
Fallback: preview URLs are public but not indexable. Cloudflare Access protection is added only if Fred requests it.

### Copy and identity overrides

P9. Launch copy overrides. Discovery D6, D163, D164, D165, and the shell lines Q4, Q5, Q6.
Phase: shell copy and main site card.
Fallback: use the accepted defaults. Lead line `Every project. One connected system.`, supporting line and opening action per Q5 and Q6, and homepage card copy per IN003 through IN006. Only an override needs Fred.

P10. Name form and employer visibility. Discovery D8 and D9.
Phase: shell identity line and About panel.
Fallback: present as `Fred Nix` and `NIXFRED`. Keep the employer role out of the foreground to respect R4, and keep the Work sector framed generically. Adjust only if Fred specifies a name form or employer treatment.

### Minor deferrable items

P11. Release identifier form and artifact retention. Discovery D136 and D138.
Phase: CI/CD.
RESOLVED: release identifiers settled by F27 (date plus short SHA). Retention settled 2026-07-11 by reconciliation with `docs/CI_CD.md`: build artifacts 30 days, test reports 14 days, release evidence 90 days.

P12. Definition of amazing, one secret to discover, and three visual references. Discovery D170, D100, and D106.
Phase: art authoring and final acceptance. Non-blocking.
Fallback: the art direction is already fully specified as cyber cartography, and the default easter eggs, Sky Walrus plus the typed `whoami`, `larry`, and `home` commands, apply. These inputs enrich the experience but do not gate the release.

P13. Preferred security contact email for `SECURITY.md`.
Phase: Phase 2, when repository documentation ships publicly.
Fallback: GitHub private vulnerability reporting is the only stated channel until Fred names an email.

P14. HSTS scope. Whether `includeSubDomains` lives at the galaxy host or the Cloudflare zone, and whether the apex should ever be preloaded.
Phase: Phase 2 headers work.
Fallback: HSTS on the galaxy host without `preload` and without zone level changes, exactly as `docs/SECURITY_PLAN.md` drafts it.

P15. Weak but WebGL capable devices. Whether such devices should proactively default to Atlas mode rather than only falling back on outright WebGL failure. Discovery D157.
Phase: Phase 3 quality tiers.
Fallback: automatic fallback only on WebGL failure per FR052. The lowest quality tier plus the always visible ATLAS control per FR051 covers weak devices without overriding visitor choice.

P16. Firefox visual fidelity. Whether Firefox must match Chromium and WebKit pixel for pixel. Discovery D153.
Phase: Phase 5 visual regression baselines.
Fallback: Firefox behavioral end to end tests are blocking, Firefox visual regression deltas are warnings, per `docs/TEST_PLAN.md`.

## Part 5. Fred session rulings, recorded 2026-07-11

Fred answered a 28 question preference interview in person, producing 30 numbered rulings, F1 through F30 (some questions yielded more than one ruling). These answers are settled decisions. Where an answer overrides an earlier accepted default or a war room position, the override is explicit and governs. Resolution status of Part 4 items is noted per item.

### Content anchors (resolves P1, P2)

F1. Anchor stars, the brightest nodes on the map, chosen by Fred: Meet Larry, Build Your Own Larry, The Universe As I See It, YouTube Library, Sky Walrus, Where Physics Starts Sweating, The Code Audit. Seven anchors, not five. AI Signal (aiwatch.nixfred.com) is also elevated per Fred's note. Provenance: Fred directly, not inferred. P1 RESOLVED.

F2. Guaranteed hero edges, always discoverable relationships: Meet Larry to Build Your Own Larry (the story to the guide), Build Your Own Larry to AI Infrastructure Portfolio (the patterns are the practice), Artemis Tracker to Where Physics Starts Sweating (the space and physics constellation), The Nix Times to INTEL to AI Signal (the intelligence pipeline). P2 RESOLVED.

F3. TOTAL COVERAGE MANDATE. Fred's words: if it is available at `*.nixfred.com`, `nixfred.com/*`, `*.nixfred.tech`, or `nixfred.tech/*` and reachable from the internet, it appears on this site, no matter how small. This is a new blocking requirement beyond the portfolio.json catalog. Enforcement: a domain census (Cloudflare zone DNS enumeration for both zones plus reachability probing) is diffed against the galaxy catalog; any live property missing from the map is a blocking launch gap, resolved by adding it upstream to portfolio.json (which stays the canonical identity source per DR001) or to the enrichment layer. The census also runs in `scheduled_checks.yml` after launch. Recorded as requirement DR011 in `docs/PRD.md` and gated in `docs/GATES.md`.

### Identity and feel

F4. Site identity: `Fred Nix`, with the NIXFRED wordmark carrying the brand. P10 RESOLVED.

F5. Emotional target: formidable but human. The scale lands first, the warmth is in the details.

F6. Scene feel: scientific base with cinematic moments and a deliberate cyberpunk streak. Unambiguously dark. This tunes, not replaces, the cyber cartography direction.

F7. Scanlines and digital noise: whisper level, chrome details only, never over body text, never animated.

F8. Star anatomy: soft halo plus thin technical status ring, per the visual identity seat's design.

F9. Design thesis: EVEN BLEND of the four metaphors (star atlas, mission control, terminal, memory map). This OVERRIDES the adversarial critic's tiebreaker ruling (atlas geometry, terminal voice). The critic's warning that even blends drift generic is answered by enforcement, not by the thesis: the template test WC rubric item and the cliche kill list remain fully blocking. `docs/DESIGN_BIBLE.md` must reflect this override.

### Entrance, motion, audio

F10. Title arrival: a cinematic event, a designed moment with real presence. Constraints that still bind: interactive within 1.5 seconds, fully skippable, never blocking input (accepted defaults Q20, and the identity seat's honored-input rule).

F11. Entrance frequency: full cinematic experience on first entry. Repeat visits use the shortened entrance per the accepted default, with the full sequence available on request.

F12. Audio: ships in v1 as optional ambient with quiet interface tones, off by default, visible control, never autoplaying, preference remembered locally. Confirms the accepted default Q26.

F13. The Larry anomaly: approved as designed, a small moving object with subtly changing relation lines, tasteful, never implying private data access.

### Center and sectors

F14. Central core: the NIXFRED core node, a luminous clickable navigation hub. Clicking opens the About and identity panel, which links back to nixfred.com, full circle.

F15. Core instrumentation: quiet monospace live totals near the core (project count, sectors, status), derived from real data only.

F16. Sector label: SIGNAL on the map, shortened from the catalog's Signal & Noise section name. The mapping is recorded in `sectors.json`.

F17. Sector count: six. IT, Labs, Work, Signal, Clients, Personal.

### Interaction

F18. Single click on a star: select and open the panel in one action.

F19. Double click on a star: opens the external project in a new tab. This OVERRIDES the earlier avoid-double-click default. Touch behavior keeps first tap focus, second tap open per the accepted mobile default.

F20. Camera memory: the map remembers the camera position during the session, so returning from a project tab restores where the visitor was. This OVERRIDES accepted default Q44 (fresh overview every arrival). A fresh browser visit still begins at the intentional overview; deep links still restore their exact state.

F21. Easter eggs: Sky Walrus ONLY. The typed `whoami`, `larry`, and `home` commands and any Konami state are CUT from v1. This narrows the P12 fallback. The Larry anomaly is a designed feature per F13, not an easter egg, and survives.

### Launch and operations

F22. Launch date: ship when green, no fixed date. P5 RESOLVED.

F23. Test group: none. Public when green, follow ups as GitHub issues. P6 RESOLVED.

F24. Homepage placement: a visually prominent Featured card on nixfred.com, joining the existing Featured row. Not a supercard, no replacement of existing cards.

F25. Firefox: behavioral parity blocking, visual deltas warn. Confirms the P16 fallback. P16 RESOLVED.

F26. Preview deployments: public with noindex. P8 RESOLVED.

F27. Release identifiers: date plus short SHA tags. Resolves the release identifier half of P11. Retention reconciled with `docs/CI_CD.md` categories: build artifacts 30 days, test reports 14 days, release evidence 90 days.

F28. Security contact: `frednix@gmail.com` published in `SECURITY.md`, alongside GitHub private vulnerability reporting. Fred chose to publish this address. P13 RESOLVED.

F29. Reference devices: Fred's actual hardware defines the bar. Desktop: MacBook Pro, Apple M4 Max, 36 GB (Mac16,5), 60 fps target. Mobile: Fred's iPhone, 30 fps target, exact model to be recorded at Phase 5 sign off. CI approximates both with documented matching profiles; the P4 CI fallback profiles remain the automated stand-ins. P4 RESOLVED.

F33. Permanent outbound links, recorded 2026-07-11. Fred's direct order: the site displays, at all times alongside the F32 version number, a link back to `nixfred.com` and a link to this public GitHub repository (`github.com/nixfred/galaxy.nixfred.com`) so others can study and reuse the system. Present in every mode (map, Atlas, project pages, 404) and every viewport, in the footer or system panel. The repository README carries the reciprocal invitation. Extends FR002's return link requirement; enforced with the FR002 and FR004 gate rows.

F32. Version always visible, recorded 2026-07-11. Fred's direct order: the site displays a version number somewhere on the page at all times, in every mode (map, Atlas, project pages, 404), on every viewport. This hardens FR004 from "footer or system panel" to an unconditional always-visible element. The displayed version is the F27 release identifier (date plus short SHA) rendered from build metadata, consistent with `/build.json`. Enforcement: the FR004 gate row verifies the version element is present and correct on every tested route and viewport, and production smoke verification confirms the displayed version matches the deployed commit.

F31. Trunk based development, recorded 2026-07-11. Fred's direct order: the build commits and pushes directly to `main` at every step, as meticulous version control and as a public showcase of how CI/CD is properly done. This OVERRIDES the Q65 PR-based feature workflow for Larry's build work. Consequences: (a) branch protection blocks force pushes and deletion of `main` but does not require pre-push status checks, because required checks are incompatible with direct pushes; (b) the quality gate moves entirely to the pipeline: `production.yml` deploys only after the full `ci.yml` validation of that push succeeds, so a red push to `main` can never reach production; (c) `preview.yml` and the PR path remain fully wired for automated pull requests (Dependabot, sync-catalog) and any future contributor; (d) every push message remains a searchable breadcrumb documenting what changed and which gate it serves. The repository itself is a deliverable: a public demonstration of disciplined trunk based delivery.

F30. Artifact and log retention categories: build artifacts 30 days, test reports 14 days, release evidence 90 days. This reconciliation resolves P11's retention half by establishing the three separate categories and their retention spans. Recorded in `docs/CI_CD.md` section 12 and `docs/OPERATIONS.md` facts table.
