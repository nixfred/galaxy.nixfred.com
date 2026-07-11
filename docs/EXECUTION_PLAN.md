# EXECUTION PLAN

> The phased build sequence for NIXFRED GALAXY. Each phase ends at a gate. A gate passes only when every check passes with recorded evidence. A failed gate blocks the next phase. This plan is executed by invoking `/goal` (see `GOAL.md`).

## How gates work

1. Each gate below lists blocking checks. All must pass.
2. Evidence for each check is produced per `docs/GATES.md` and referenced in the phase completion note.
3. Phase completion is recorded as a git commit whose message names the gate and links the evidence.
4. Discovering broken work from an earlier phase reopens that phase's gate. Fix backward before building forward.

## Phase 0: Provisioning

Stand up the delivery infrastructure before writing application code.

Work:
1. Verify tooling: `gh auth status`, `wrangler whoami`, `git remote -v`, Bun installed.
2. Create the GitHub repository `nixfred/galaxy.nixfred.com`, public, description and homepage set, default branch `main`, push the planning docs as the initial commits.
3. Configure branch protection: all CI checks required, force pushes and deletion blocked, no outside reviewer required.
4. Set repository secrets `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN` (minimally scoped token), and `CF_DNS_READ_TOKEN` (a separate Cloudflare token scoped to Zone:Zone:Read plus Zone:DNS:Read for the `nixfred.com` and `nixfred.tech` zones only, used solely by the DR011 domain census), plus the non-secret variables `CF_ZONE_NIXFRED_COM` and `CF_ZONE_NIXFRED_TECH` and the rest of the variables per `docs/CI_CD.md`.
5. Create or reuse the Cloudflare Pages project `galaxy-nixfred-com`, production branch `main`.
6. Configure Dependabot per `docs/CI_CD.md`.
7. Record all provisioning results in `docs/OPERATIONS.md` completion notes.

GATE G0 (blocking checks):
1. Repository exists with correct visibility, description, default branch, and protection rules.
2. `gh auth status` and `wrangler whoami` verified and recorded (no credentials in output captured).
3. Secrets and variables present, including the census token `CF_DNS_READ_TOKEN` and the zone variables `CF_ZONE_NIXFRED_COM` and `CF_ZONE_NIXFRED_TECH` (names verified, values never echoed).
4. Pages project exists and reports the correct production branch.
5. Planning docs committed and pushed; `git remote -v` recorded and confirmed pointing only at `nixfred/galaxy.nixfred.com`.

## Phase 1: Foundation

The toolchain, the data pipeline, and a green empty CI. No visuals yet.

Work:
1. Scaffold Astro with strict TypeScript, Bun, `.bun-version`, and the repo tree from `docs/ARCHITECTURE.md`.
2. Wire ESLint, Prettier, tsconfig strict, Vitest, Playwright, axe integration.
3. Implement the data layer per `docs/DATA_MODEL.md`: sync script, committed snapshot of the upstream catalog, enrichment file, relationships file, sectors file, tours file, schema validation, generated graph artifact.
4. Implement `scripts/` validators: data validation, graph validation, link check, bundle budget report, build info generation.
5. Stand up `ci.yml` with the full blocking job set from `docs/CI_CD.md`, plus the preview and production workflows (production verification can only fully pass once the site exists; wire the skeleton now).
6. Author the required `package.json` scripts (`check:all` runs everything CI runs).
7. Wire an informational, non-blocking domain census run (`scripts/domain-census.ts`, DR011) from this phase forward, surfacing catalog coverage gaps early in the job summary. The blocking DR011 assertion stays at Gate G6 per `docs/GATES.md`.

GATE G1 (blocking checks):
1. `bun run check:all` passes locally from a clean clone.
2. CI is green on `main` with every blocking job running (format, lint, typecheck, astro check, data validation, unit tests, build, budget report).
3. The catalog snapshot validates; deliberately broken fixture data fails validation (negative test recorded).
4. Layout determinism unit test passes: same catalog revision produces an identical generated graph artifact hash twice.
5. Dependabot and pinned-SHA action policy verified in the workflow files.

## Phase 2: Atlas first

Build the complete accessible HTML experience before any WebGL. Content before spectacle: the fallback becomes the foundation, and every project is reachable, crawlable, and testable from this phase forward.

Work:
1. Application shell per FR001 to FR004: usable HTML before any bundle, site name, primary statement, entry actions, build revision.
2. Atlas mode at `/atlas/` per FR049 to FR053: full catalog, search, sector filters, status filters, tags, relationship links, tour access.
3. Crawlable project pages at `/project/<slug>/` per FR054 to FR056 with canonical and Open Graph metadata.
4. Custom 404 per FR065. Security headers via `public/_headers` per `docs/SECURITY_PLAN.md`. `robots.txt`, sitemap, `manifest.webmanifest`, `/build.json`.
5. Command palette in HTML form (full function without the map).

GATE G2 (blocking checks):
1. Every catalog project reachable through Atlas, search, and its own page (automated count and slug comparison per AC002, AC004).
2. Atlas works with JavaScript disabled before hydration (AC021).
3. axe reports zero serious or critical violations on shell, Atlas, project page, and 404 (AC025 subset).
4. Keyboard-only pass through Atlas, search, and project pages (e2e suite green).
5. Headers present on a preview deployment (AC041 rehearsal), preview deploy pipeline proven green end to end.
6. Bundle budget: shell JavaScript under 150 KB compressed (PR004).

## Phase 3: The Galaxy

The Three.js map: world class rendering per the war room, with full interaction parity.

Work:
1. Renderer, scene, and quality tiers per `docs/warroom/02_WEBGL_CRAFT.md` and `docs/ARCHITECTURE.md`: instanced stars, sector atmosphere, relationship lines, selective glow, DPR caps, hidden-page pause, context loss recovery.
2. Deterministic layout: sector anchors, manual positions for major nodes, seeded placement (FR006 to FR008).
3. Constrained camera rig: pan, zoom, pitch-clamped orbit, no roll, focus transitions, overview return (FR016, interview Q30 to Q31).
4. Selection lifecycle: focus, relationship illumination, detail panel, URL deep link, history semantics (FR015 to FR022).
5. Visual identity per `docs/DESIGN_BIBLE.md` and `docs/ART_DIRECTION.md`: entrance sequence under 1.5 seconds to interactive, boot line, ignition choreography, label hierarchy with collision fade.
6. WebGL failure automatically opens Atlas (FR052); ATLAS control always visible (FR051).
7. Reduced motion mode: full behavioral spec from `docs/INTERACTION_SPEC.md`.
8. Mobile composition: simplified map, touch model, bottom sheet (FR018, interview Q45).

GATE G3 (blocking checks):
1. Layout determinism holds in the browser: snapshot hash test across repeated builds (AC031).
2. Entrance is skippable and never blocks input; input available within 1.5 seconds (ordered frame evidence per AC009).
3. WebGL failure injection lands in Atlas automatically (AC022).
4. Full keyboard parity: every map action possible without a pointer (AC013 suite).
5. Reduced motion stops decorative motion (ordered frame comparison, AC010).
6. Deep links restore state after scene ready (AC015, AC016).
7. Frame budget: 60 fps desktop and stable 30 fps mobile profiles on CI reference settings, no unbounded allocation over a ten minute soak (performance suite).
8. Visualization chunk under 300 KB compressed, lazy loaded (AC034, PR005).
9. Renderer pauses when the document is hidden (AC038).

## Phase 4: Features

Everything that makes it an instrument, not a screensaver.

Work:
1. Command palette on the map: Cmd-K, Ctrl-K, slash; commands for modes, tours, help (FR023 to FR027).
2. Sector and status filters with camera preservation and live counts (FR028 to FR031).
3. Guided tours: Start Here, AI and Infrastructure, Space and Physics; pause, next, previous, exit, resume, shareable URLs, no focus traps (FR039 to FR044).
4. Compare mode: shortest meaningful path with plain language edge explanations (FR035, FR036).
5. SURPRISE ME with seeded no-repeat behavior (FR059).
6. Session pins and share links (FR057 to FR060).
7. Timeline mode: build the machinery, ship it disabled unless every included project has a trustworthy date (FR045 to FR048); dates only from git history, published content, or Fred.
8. Easter eggs per decisions: Sky Walrus event, Larry anomaly, terminal commands, all harmless and invisible to accessibility tooling.

GATE G4 (blocking checks):
1. All feature e2e suites green: search, tours, compare, filters, deep links (AC014, AC017, AC018, AC019).
2. SURPRISE ME determinism unit test (AC020).
3. Tour URLs restore tour state (AC043 behavior, AC016 pattern).
4. Focus management: panel open moves focus in, close returns it, no traps (AC024).
5. axe zero serious or critical across all routes and feature states (AC025 full).
6. Ordered frame evidence for tour transitions and compare highlighting.

## Phase 5: Polish and hardening

Make world class measurable, then measure it.

Work:
1. Visual regression baselines: desktop, tablet, mobile, Atlas, reduced motion, selected states (interview Q72).
2. Performance tuning to every PR budget; Lighthouse CI wired with budgets as blocking checks.
3. Full security pass per `docs/SECURITY_PLAN.md`: headers verified, CSP tightened, secret scan, dependency audit, action pinning audit.
4. The war room rubric from `docs/DESIGN_BIBLE.md` applied to the running preview, every failure fixed and rechecked.
5. Open Graph card art per `docs/ART_DIRECTION.md`.
6. Cross-browser sweep per the matrix in `docs/TEST_PLAN.md`.
7. Documentation truth pass: README, ARCHITECTURE, DATA_MODEL, OPERATIONS match the implementation (AC057).

GATE G5 (blocking checks):
1. Full CI matrix green including visual, a11y, performance, security header suites.
2. Lighthouse and bundle budgets pass (AC036, AC037).
3. Zero rubric failures outstanding from the design bible review.
4. Secret scan of full git history clean (AC040).
5. Ten minute exploration soak: stable memory, no console errors (AC038 family, launch acceptance 5).

## Phase 6: Launch

Production, verification, evidence, and the homepage card.

Work:
1. Merge to `main`; production workflow deploys via Wrangler Direct Upload.
2. Attach and verify `galaxy.nixfred.com` custom domain: DNS, certificate, headers, `/build.json` commit match.
3. Production smoke suite against the live domain; automatic rollback path armed per `docs/OPERATIONS.md`.
4. Rollback rehearsal: exercise the documented runbook in a controlled test (AC052).
5. Generate `docs/RELEASE_REPORT.md` with the full 14-item evidence contract from `docs/CI_CD.md`.
6. Fred reviews the live production experience; verdict recorded, follow-ups filed as GitHub issues (AC058).
7. Only after verification: PR to `nixfred/nixfred.github.io` adding the portfolio card per IN001 to IN007; verify the card live.

GATE G6 (blocking checks):
1. `https://galaxy.nixfred.com` live with valid TLS serving the verified build (AC053).
2. Every acceptance criterion AC001 to AC058 marked passed with evidence in `docs/GATES.md` tracking.
3. `docs/RELEASE_REPORT.md` complete.
4. Rollback rehearsal recorded.
5. Fred's review recorded; the launch is not complete without it.
6. nixfred.com card live and opening the production domain (AC055, AC056).

## Standing rules across all phases

1. Trunk based development per decision F31: Larry commits and pushes directly to `main` at every meaningful step, with `production.yml` gated on that push's full `ci.yml` validation so a red push never deploys. The PR path with preview deployments stays wired for automated pull requests (Dependabot, sync-catalog) and future contributors (interview Q66 to Q69 as amended by F31).
2. Every commit message is a searchable breadcrumb with full context.
3. PENDING-FRED items in `docs/DECISIONS.md` resolve by their documented deadline phase or their safe fallback applies.
4. Any requirement change is recorded in `docs/DECISIONS.md` before implementation.
