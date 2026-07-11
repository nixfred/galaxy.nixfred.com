# NIXFRED GALAXY Test Plan

Owner: Quality Engineering
Standard of proof: a requirement passes only with captured evidence. A green build alone is never evidence of browser behavior. A single screenshot is never proof of motion, camera movement, hover behavior, loading behavior, or a guided flow. Motion is proven with an ordered frame sequence or a frame scrub artifact, per the operating law in the execution directive.

This plan maps every acceptance criterion AC001 through AC058 to a concrete test file or procedure, the evidence artifact it produces, and its enforcement class. It defines the motion evidence method, determinism testing, WebGL failure injection, the viewport and browser matrix, performance verification, fixtures, the production smoke suite, and the exact split between checks that block a release and checks that warn.

## 1. Enforcement classes

Every check is one of three classes. The class decides what a failure does.

| Class | Meaning | Effect of failure |
|-------|---------|-------------------|
| BLOCK | Automated, deterministic, gates the release | Fails CI. No preview promotion, no production deploy. |
| WARN | Automated, reported in the job summary | Recorded and surfaced. Does not gate unless a hard threshold is crossed. |
| MANUAL | Human review, used only where the matrix requires Fred review or a subjective judgment cannot be automated | Recorded in `docs/RELEASE_REPORT.md` with a named reviewer and a link to the evidence. |

The default is BLOCK. WARN is reserved for signals that are meaningful but noisy: visual snapshot diffs pending first approval, small performance deltas, and external link status drift. MANUAL is reserved for the criteria whose acceptance matrix row names Fred review, plus the small set of subjective visual and operational judgments listed in the coverage gap section.

## 2. Test pyramid for this product

The product is a static Astro site with a lazily loaded Three.js scene, a canonical catalog pipeline, and a mandatory accessible Atlas. The pyramid is weighted toward fast deterministic data and unit tests at the base, a broad band of behavioral browser tests in the middle, and a thin, high value cap of visual, motion, performance, and production smoke evidence.

1. Data and unit tests. Vitest. The catalog merge, graph integrity, deterministic layout, deep link serialization, filter logic, and seeded random selection. These are the fastest gate and they run first. Files: `tests/unit/catalog-merge.test.ts`, `tests/unit/graph-integrity.test.ts`, `tests/unit/layout-determinism.test.ts`, `tests/unit/deep-link.test.ts`, `tests/unit/filters.test.ts`. The data validation scripts `scripts/validate-catalog.ts` and `scripts/validate-graph.ts` are exercised both as CI steps and through these unit tests using fixtures.

2. End to end behavioral tests. Playwright against the built artifact served locally. Shell readiness, exploration, search, keyboard only operation, tours, compare, Atlas, mobile, reduced motion, WebGL fallback, deep links, and security headers. Files under `tests/e2e/`.

3. Visual regression. Playwright screenshot snapshots at fixed viewports for desktop, tablet, mobile, Atlas, and reduced motion. Files under `tests/visual/`. Committed baselines per interview decision 72.

4. Accessibility. Axe integrated into Playwright, run across required routes and interaction states. Zero serious or critical violations, per AR010 and AC025.

5. Motion evidence. Ordered frame sequences captured through Playwright at fixed intervals during the entrance, camera focus, tour transitions, and the reduced motion comparison. Stored as CI artifacts. This band exists specifically because a still image cannot prove or disprove motion.

6. Performance. Lighthouse CI against the CI mobile profile, the bundle and asset budget gate in `scripts/report-bundle.ts`, and a renderer pause and quality profile test.

7. Security headers and network allowlist. Header presence on preview and on the custom domain, plus a request allowlist proving no unapproved third party scripts and Cloudflare Web Analytics as the only analytics.

8. Production smoke. A tagged Playwright subset that runs against the live custom domain after deployment and confirms the release is real, not just built.

## 3. Acceptance matrix coverage AC001 to AC058

Each row states the criterion, the concrete proof, the evidence artifact retained in CI or the release report, and the enforcement class. Where a criterion needs both automation and a human judgment, the automated part blocks and the judgment is recorded as MANUAL against the same evidence.

### Product acceptance

| AC | Proof | Evidence artifact | Class |
|----|-------|-------------------|-------|
| AC001 | `tests/e2e/shell.spec.ts` asserts the site name and primary statement render inside the first viewport before hydration. `tests/visual/desktop.spec.ts` captures the first viewport. Copy tone reviewed by Fred. | First viewport screenshot, text assertion log | BLOCK for presence, MANUAL for tone |
| AC002 | `tests/unit/catalog-merge.test.ts` and `tests/unit/graph-integrity.test.ts` count eligible catalog entries and compare the produced node slug set against the snapshot slug set. | Count and slug diff report | BLOCK |
| AC003 | `tests/unit/catalog-merge.test.ts` asserts the app imports only the generated graph artifact and that no component holds a hardcoded project array. Data flow reviewed against `docs/DATA_MODEL.md`. | Merge test output, import allowlist assertion | BLOCK for the import assertion, MANUAL for the data flow review |
| AC004 | `tests/e2e/explore.spec.ts`, `tests/e2e/search.spec.ts`, `tests/e2e/atlas.spec.ts`, and `tests/e2e/deep-links.spec.ts` reach each project through Map, Atlas, search, and its `/project/<slug>/` page. A generated route test asserts one page exists per public slug. | Route coverage report, per slug pass list | BLOCK |
| AC005 | `scripts/validate-catalog.ts` asserts every external link uses HTTPS. `tests/e2e/explore.spec.ts` asserts Open Project links carry `target="_blank"` and `rel="noopener noreferrer"`. `scripts/check-links.ts` reports internal link integrity. | Validation output, link attribute assertion | BLOCK |

### Visual acceptance

| AC | Proof | Evidence artifact | Class |
|----|-------|-------------------|-------|
| AC006 | Fred reviews the production preview against the cyber cartography thesis in the art direction. | Named acceptance note in `docs/RELEASE_REPORT.md` | MANUAL |
| AC007 | `tests/visual/desktop.spec.ts` and `tests/visual/tablet.spec.ts` capture the overview at the desktop and laptop viewports. Snapshot diff gates regressions once baselines are approved. | Overview screenshots at required viewports | BLOCK on snapshot diff, MANUAL on first legibility approval |
| AC008 | `tests/e2e/explore.spec.ts` asserts the active node, related nodes, and active paths carry non color state, being a selection ring, stroke weight, and glyph, not hue alone. Axe contrast check on labels. Visual review confirms the encoding. | Selected state screenshot set, DOM state attribute assertion, axe contrast result | BLOCK for the state attribute and contrast assertions, MANUAL for the color independence judgment |
| AC009 | `tests/e2e/explore.spec.ts` captures an ordered frame sequence during the entrance and asserts a shell control is focusable and clickable before the entrance completes, proving motion does not block input. | Ordered frame gallery, input timing assertion | BLOCK |
| AC010 | `tests/e2e/reduced-motion.spec.ts` emulates `prefers-reduced-motion: reduce`, captures an ordered frame sequence, and asserts consecutive settled frames are identical, proving continuous decorative motion has stopped. A media query unit assertion confirms the mode is read. | Reduced motion frame gallery, frame identity assertion | BLOCK |
| AC011 | `tests/e2e/mobile.spec.ts` records a phone viewport interaction using first tap focus and second tap open, and asserts the mobile control set differs from desktop. Trace video retained. | Phone interaction trace and video, control set assertion | BLOCK for the interaction assertions, MANUAL for the deliberate design judgment |

### Interaction acceptance

| AC | Proof | Evidence artifact | Class |
|----|-------|-------------------|-------|
| AC012 | `tests/e2e/explore.spec.ts` exercises pan, zoom, constrained orbit, selection, deselection, and return to overview with pointer input, with an ordered frame gallery for the focus transition. | Playwright trace, focus transition frame gallery | BLOCK |
| AC013 | `tests/e2e/keyboard.spec.ts` performs every essential action with keyboard only: navigate stars, select, open and close the panel, open the palette, run a tour, filter, and return home. | Keyboard trace, per action pass list | BLOCK |
| AC014 | `tests/e2e/search.spec.ts` opens the palette with Command K, Control K, and slash, then confirms the chosen project receives focus and its panel opens. | Search trace, shortcut coverage log | BLOCK |
| AC015 | `tests/unit/deep-link.test.ts` asserts selection produces a stable URL. `tests/e2e/deep-links.spec.ts` reloads that URL and confirms the same selection. | URL serialization test output, reload assertion | BLOCK |
| AC016 | `tests/e2e/deep-links.spec.ts` loads project, sector, and tour deep links directly and confirms the intended state is restored after the scene becomes ready. | Deep link restore trace | BLOCK |
| AC017 | `tests/e2e/explore.spec.ts` and `tests/e2e/atlas.spec.ts` apply sector filters in both modes. `tests/unit/filters.test.ts` proves the filter logic and counts. | Cross mode filter trace, filter unit output | BLOCK |
| AC018 | `tests/e2e/tours.spec.ts` runs an ordered flow: start, pause, next, previous, exit, and resume, with an ordered frame gallery for one tour transition. | Tour flow trace, transition frame gallery | BLOCK |
| AC019 | `tests/unit/graph-integrity.test.ts` proves the shortest meaningful path calculation. `tests/e2e/compare.spec.ts` confirms the plain language explanation of each edge renders. | Path calculation test output, compare copy assertion | BLOCK |
| AC020 | `tests/unit/filters.test.ts` or a dedicated seeded random assertion proves SURPRISE ME uses a seeded session sequence and avoids immediate repeats deterministically. | Deterministic sequence assertion | BLOCK |

### Fallback and accessibility acceptance

| AC | Proof | Evidence artifact | Class |
|----|-------|-------------------|-------|
| AC021 | `tests/e2e/atlas.spec.ts` loads `/atlas/` with JavaScript disabled and confirms the catalog is fully present and usable. Static HTML inspection confirms server rendered content. | JS disabled Atlas trace, static HTML snapshot | BLOCK |
| AC022 | `tests/e2e/webgl-fallback.spec.ts` forces WebGL context creation to fail through an init script and asserts Atlas mode opens automatically with a quiet notice. | Forced failure trace, fallback screenshot | BLOCK |
| AC023 | `tests/e2e/keyboard.spec.ts` and `tests/e2e/atlas.spec.ts` inspect the accessibility tree and assert project names and descriptions exist as HTML, not only inside the canvas. | Accessibility tree snapshot | BLOCK |
| AC024 | `tests/e2e/keyboard.spec.ts` asserts focus moves into the project panel on open and returns to the initiating control on close, with no trap. | Focus movement trace | BLOCK |
| AC025 | The axe integration runs on required routes and states and reports zero serious or critical violations. See section 6 and `docs/ACCESSIBILITY.md`. | Axe JSON report per route and state | BLOCK |
| AC026 | `tests/e2e/explore.spec.ts` asserts an always visible pause motion control exists while continuous motion is active and that toggling it stops motion, confirmed by frame identity. | Pause control screenshot, toggle frame comparison | BLOCK |
| AC027 | Audio ships in version one per F12, so this row is live, not trivially satisfied. `tests/e2e/shell.spec.ts` asserts no audio context resumes and no audible playback begins without a user gesture. Source review confirms audio is off by default. | Autoplay assertion, source review note | BLOCK for the automated assertion, MANUAL for the source review |
| AR005 | Audio ships off by default per F12. `tests/e2e/shell.spec.ts` and an accessibility review assert a visible, keyboard operable audio control exists, that enabling and muting work, that nothing autoplays, and that the preference persists on the local device only. | Audio control assertion, off by default trace, review note | BLOCK for the automated checks, MANUAL for the review |

### Data acceptance

| AC | Proof | Evidence artifact | Class |
|----|-------|-------------------|-------|
| AC028 | `scripts/validate-catalog.ts` validates the committed snapshot against the strict schema. Exercised in CI and in `tests/unit/catalog-merge.test.ts`. | Schema validation output | BLOCK |
| AC029 | `scripts/validate-catalog.ts` and `tests/unit/catalog-merge.test.ts` assert every enrichment record maps to a known upstream slug and that orphaned enrichment fails. | Enrichment mapping report | BLOCK |
| AC030 | `scripts/validate-graph.ts` and `tests/unit/graph-integrity.test.ts` assert every relationship references two valid nodes and includes type, strength, reason, and provenance, rejecting self edges and duplicate edges. | Graph validation report | BLOCK |
| AC031 | `tests/unit/layout-determinism.test.ts` computes the layout twice from the same catalog revision and asserts an identical coordinate hash. A repeat build check compares the generated graph hash across two builds. See section 5. | Layout hash equality assertion, cross build hash log | BLOCK |
| AC032 | `scripts/validate-catalog.ts` and a schema test assert unknown dates remain an explicit unknown state and are never coerced to a value. | Unknown date assertion | BLOCK |
| AC033 | `tests/unit/catalog-merge.test.ts` runs the sync against fixtures and asserts a readable change report is produced and that enrichment is never silently discarded on upstream change. | Sync change report fixture output | BLOCK |

### Performance acceptance

| AC | Proof | Evidence artifact | Class |
|----|-------|-------------------|-------|
| AC034 | `tests/e2e/shell.spec.ts` records the network trace and asserts the Three.js chunk is not requested until interactive mode is entered. | Network trace with lazy chunk timing | BLOCK |
| AC035 | `tests/e2e/shell.spec.ts` throttles the network and asserts shell controls, being Enter the Map, Atlas, search, and the return link, are operable before the scene finishes loading. | Throttled shell trace | BLOCK |
| AC036 | `scripts/report-bundle.ts` measures compressed shell JavaScript against PR004 at 150 KB, the visualization chunk against PR005 at 300 KB, and route transfer against PR006. | Bundle budget report in the job summary | BLOCK on hard budget failure |
| AC037 | Lighthouse CI runs the mobile profile and checks LCP against PR007, CLS against PR008, and INP against PR009. A failure requires a documented approved exception in `docs/DECISIONS.md`. | Lighthouse report in the job summary | BLOCK unless an approved exception is recorded |
| AC038 | A renderer pause test drives a visibility change to hidden and asserts the animation loop stops advancing, then resumes on visible. | Frame counter assertion across visibility change | BLOCK |
| AC039 | `tests/unit` quality profile test asserts low capability mode reduces device pixel ratio and effect density. A browser configuration test confirms the profile applies. | Quality profile unit output, applied profile assertion | BLOCK |

### Security and privacy acceptance

| AC | Proof | Evidence artifact | Class |
|----|-------|-------------------|-------|
| AC040 | A secret scan runs over the working tree and the full Git history and over the build output. Manual review confirms no credential appears in browser source or logs. | Secret scan report | BLOCK for the scan, MANUAL for the review |
| AC041 | `tests/e2e/security-headers.spec.ts` asserts the content security policy, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and frame protection are present. The production smoke run repeats this against the custom domain. | Header assertion log, production header check | BLOCK |
| AC042 | A network allowlist assertion in `tests/e2e/security-headers.spec.ts` or a dedicated allowlist test fails on any request to an unapproved third party origin. | Request allowlist report | BLOCK |
| AC043 | The allowlist test and a source review confirm Cloudflare Web Analytics is the only analytics system and no other beacon loads. | Network trace, source review note | BLOCK for the allowlist, MANUAL for the source review |
| AC044 | A workflow lint asserts every third party GitHub Action is pinned to an immutable commit SHA. Workflow review confirms intent annotations. | Action pin report | BLOCK for the pin scan, MANUAL for the review |

### CI and CD acceptance

| AC | Proof | Evidence artifact | Class |
|----|-------|-------------------|-------|
| AC045 | A pull request run of `ci.yml` executes format, lint, type check, Astro check, data validation, unit, e2e, accessibility, build, and budget jobs. | Successful pull request workflow run URL | BLOCK |
| AC046 | `preview.yml` produces a Cloudflare preview deployment for the pull request and runs live smoke tests against the preview URL. | GitHub deployment record, preview smoke result | BLOCK |
| AC047 | The deploy job verifies the artifact digest matches the artifact that passed CI and records it in the job summary. | Artifact digest in the job summary | BLOCK |
| AC048 | A merge to `main` triggers `production.yml` with no manual environment approval, per interview decision 68. | Successful main workflow run | BLOCK |
| AC049 | `production.yml` marks production successful only after the custom domain smoke job passes, enforced by job dependency order. | Workflow dependency graph, job summary | BLOCK |
| AC050 | The production smoke run fetches `/build.json` and asserts it reports the deployed commit SHA and the catalog revision. | Production `/build.json` check | BLOCK |
| AC051 | A deployment inventory command lists a prior healthy Cloudflare deployment available as a rollback target and records it in `docs/OPERATIONS.md`. | Deployment inventory listing | MANUAL operational check |
| AC052 | A controlled rollback rehearsal simulates a failed smoke check and exercises `rollback.yml` in a nonproduction or controlled test, recorded in the runbook. | Runbook test record | MANUAL rehearsal |

### Launch acceptance

| AC | Proof | Evidence artifact | Class |
|----|-------|-------------------|-------|
| AC053 | The production smoke run confirms `galaxy.nixfred.com` serves the production build over valid TLS, verified in the browser and from the command line. | TLS and content smoke result | BLOCK |
| AC054 | The production smoke run asserts the rendered canonical metadata points to the custom domain. | Canonical tag assertion | BLOCK |
| AC055 | The nixfred.com catalog entry is added through a separate pull request only after production verification, per IN001 and interview decision 76. Sequencing verified by hand and recorded. | Separate pull request URL, sequencing note | MANUAL |
| AC056 | After integration, a smoke test loads the live nixfred.com homepage and confirms the NIXFRED GALAXY card opens the correct production domain. | Homepage card smoke result | BLOCK once integration is live |
| AC057 | Documentation review confirms README, architecture, data model, this test plan, operations, and CI and CD docs match the final implementation. | Documentation review note in `docs/RELEASE_REPORT.md` | MANUAL |
| AC058 | Fred reviews the final production experience and records any follow up as GitHub issues rather than untracked notes. | GitHub issue list or explicit acceptance note | MANUAL |
| DR011 | The domain census (`scripts/domain-census.ts`, `docs/DATA_MODEL.md` section 8) enumerates the Cloudflare zone DNS for `nixfred.com` and `nixfred.tech`, probes reachability, and diffs the reachable set against the merged catalog. The launch census report shows zero uncovered live properties. Any gap blocks launch until the property is added upstream or to the enrichment layer. | Launch domain census report | BLOCK |

## 4. Motion evidence methodology

A still image cannot show drift, camera travel, a tour transition, or the difference between full motion and reduced motion. Motion is therefore proven with ordered frame sequences captured by Playwright and stored as CI artifacts.

Method. For each motion under test, the spec captures screenshots at a fixed interval into a numbered sequence, for example `entrance/frame-000.png` through `entrance/frame-000N.png` at a stable cadence such as one frame every 100 milliseconds across a fixed window. The frames are uploaded as a CI artifact and, where useful, composed into a single contact sheet as a frame scrub artifact. The captures cover four motions:

1. Entrance. Frames across the entrance window, paired with an assertion that a shell control is interactive before the last frame. This proves motion exists and does not block input, satisfying AC009.
2. Camera focus. Frames across a project focus transition, proving the camera moves with acceleration and deceleration rather than a jump, supporting AC012.
3. Tour transition. Frames across one tour step change, proving the coordinated camera move and route illumination, supporting AC018.
4. Reduced motion comparison. The same entrance and focus captured with `prefers-reduced-motion: reduce` emulated.

Assertions on the frames make the evidence a gate, not just a gallery.

1. Motion present. Consecutive frames in the full motion entrance and focus sequences must differ above a pixel difference threshold, proving movement actually occurred.
2. Motion stopped. Consecutive settled frames in the reduced motion sequence must be identical within a near zero threshold, proving continuous decorative motion has stopped, satisfying AC010 and AC026 for the pause control.
3. Input not blocked. The interactive assertion during the entrance proves no long animation delays basic navigation.

The frame galleries and the pass or fail of these assertions are retained per run so a reviewer can scrub the motion after the fact.

## 5. Determinism testing

The layout is deterministic by contract: the same catalog revision produces the same layout on every load and in every test run, per FR006. This is what makes snapshot hash testing valid for AC031.

1. In process determinism. `tests/unit/layout-determinism.test.ts` computes the layout twice from the same fixed catalog revision and asserts the two coordinate sets hash to the same value. It also asserts that the seeded placement is stable, that manual coordinates override seeded placement, and that reordering input records does not change output positions.
2. Cross build determinism. A CI step builds the generated graph, records the hash of the layout coordinates in the build metadata, rebuilds, and asserts the two hashes match. Any nondeterminism in the layout pipeline fails here before it can poison visual snapshots.
3. Snapshot validity. Because the layout is stable, the committed visual baselines in `tests/visual/` are meaningful. A layout hash change is expected to accompany any intentional catalog revision and is reviewed alongside the new baselines.

## 6. Accessibility automation

Axe runs inside Playwright with the WCAG 2.2 AA rule tags and fails on any serious or critical violation, satisfying AR010 and AC025. The decorative canvas is excluded because it is marked aria hidden, while its HTML mirror, the accessible star list and the Atlas, is included. The full route and state matrix, the manual screen reader matrix, and the exact axe configuration live in `docs/ACCESSIBILITY.md`. In summary, axe scans the home shell before and after hydration, the Atlas, a representative project page, and the 404, across the default state, panel open, palette open, filters applied, tour active, reduced motion, mobile viewport, and the WebGL fallback state.

## 7. WebGL failure injection

The fallback must be proven, not assumed. Two independent failure paths are injected.

1. No JavaScript before hydration. `tests/e2e/atlas.spec.ts` runs a browser context with JavaScript disabled and asserts `/atlas/` is fully present and usable from server rendered HTML, satisfying AC021.
2. Forced WebGL failure. `tests/e2e/webgl-fallback.spec.ts` uses an init script to override `HTMLCanvasElement.prototype.getContext` so that any request for a `webgl` or `webgl2` context returns null, then asserts the application detects the failure, automatically opens Atlas mode, and shows a quiet unavailable notice, satisfying AC022 and AC052 of the fallback intent. A companion path dispatches a simulated context loss to confirm the running scene recovers or presents the fallback rather than freezing.

Both paths assert that project names and descriptions remain reachable in the accessibility tree, tying the fallback back to AC023.

## 8. Viewport and browser matrix

Viewports are chosen to cover the required desktop and laptop overview legibility, a tablet composition, and a deliberate phone composition, not a shrunken desktop.

| Profile | Viewport | Primary use |
|---------|----------|-------------|
| Desktop | 1920 by 1080 | Overview legibility, visual baseline, full motion |
| Laptop | 1440 by 900 | Overview legibility at the smaller desktop size required by AC007 |
| Tablet | 820 by 1180 | Tablet composition and visual baseline |
| Phone | 390 by 844 | Deliberate mobile interaction model, first tap focus and second tap open |

Browsers are chosen for behavioral coverage and for the two rendering engines that matter to real visitors.

| Browser | Role | Class |
|---------|------|-------|
| Chromium | Primary behavioral and visual engine, runs the full e2e, visual, a11y, and motion suites | BLOCK |
| WebKit | Safari engine parity for behavior and accessibility, runs e2e and a11y | BLOCK |
| Firefox | Behavioral coverage, runs e2e | BLOCK on behavior, WARN on visual fidelity |

Reasoning. Chromium is the reference for visual baselines and motion because it is the most stable screenshot engine and the CI Lighthouse engine. WebKit is a blocking behavioral and accessibility target because Safari on macOS and iOS is a first class visitor path and its focus and reduced motion behavior differ from Chromium. Firefox blocks on behavior but only warns on pixel fidelity, per F25: Firefox behavioral parity is blocking and visual deltas warn.

## 9. Performance verification

Performance maps to PR004 through PR012 and to AC036 through AC039.

1. Bundle and asset budgets. `scripts/report-bundle.ts` measures compressed shell JavaScript against PR004 at under 150 KB, the lazy visualization chunk against PR005 at under 300 KB, and the initial route transfer against PR006 at under 1.5 MB on desktop and under 1 MB on mobile. A hard budget failure is BLOCK. A small regression under threshold is WARN in the job summary, per interview decision 71.
2. Lighthouse budgets. Lighthouse CI runs the mobile profile and enforces PR007 LCP under 2.5 seconds, PR008 CLS under 0.1, and PR009 INP under 200 milliseconds for ordinary controls. A hard failure is BLOCK unless a documented exception exists in `docs/DECISIONS.md`, satisfying AC037.
3. Renderer pause. The AC038 test asserts the animation loop halts when the document is hidden and resumes when visible, using a frame counter that must not advance while hidden.
4. Quality profile. The AC039 test asserts low capability mode caps device pixel ratio and reduces particle, glow, and line density, satisfying PR011.
5. Frame rate targets. PR010 targets 60 frames per second on desktop and a stable 30 on mobile. CI can instrument frame timing during a scripted interaction and WARN on sustained drops, but the authoritative 60 and 30 targets are a MANUAL measurement on Fred's reference devices fixed by F29: the 60 fps desktop bar is Fred's MacBook Pro, Apple M4 Max, 36 GB (Mac16,5), and the 30 fps mobile bar is Fred's iPhone, with the exact model recorded at Phase 5 sign off. CI approximates both with the documented matching profiles, see section 13.
6. Reporting. Per PR012, CI writes asset sizes, bundle sizes, and Lighthouse results into the job summary on every run.

## 10. Fixtures strategy

Fixtures live in `tests/fixtures/` and make the data and fallback tests deterministic and offline, satisfying DR010 that no build fetches the catalog at runtime.

1. `catalog-valid.json`. A small well formed catalog with a stable set of slugs, sectors, statuses, and relationships. Drives the merge, graph integrity, deterministic layout, filter, and deep link tests, and provides a known slug set for count comparison.
2. `catalog-invalid.json`. A deliberately broken catalog containing duplicate slugs, an unknown sector, an invalid non HTTPS URL, a missing title, a missing description, a self relationship, and a relationship endpoint that does not exist. Each defect must cause the validation scripts to fail, proving the CI data gate actually gates, per DR008 and AC028 through AC030.
3. Minimal graph fixture. The smallest renderable graph, on the order of two nodes and one typed edge, used by the deterministic layout test and by fast e2e scene setup so that motion and focus can be exercised without loading the full catalog. If not carried as a separate file, it is derived as a documented subset of `catalog-valid.json`.

Fixtures never contain private data and are excluded from the production build output, per the artifact integrity rule that build output must not contain test fixtures.

## 11. Production smoke suite

The production smoke suite is a tagged Playwright subset, marked with a smoke tag, run against the live custom domain after deployment through a dedicated Playwright project whose base URL is `https://galaxy.nixfred.com`. It is the boundary between built and actually live, and its failure fails the production job and starts the rollback path, per AC049 and interview decision 75.

The suite confirms:

1. TLS and content. `galaxy.nixfred.com` responds over valid TLS and returns the production build, AC053.
2. Core routes. The home shell, `/atlas/`, a representative `/project/<slug>/`, the custom 404, and `/build.json` all return the expected status and content.
3. Build metadata. `/build.json` reports the deployed commit SHA and catalog revision matching the deployed commit, AC050.
4. Canonical metadata. The rendered canonical link points to the custom domain, AC054.
5. Security headers. The content security policy, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and frame protection are present on the live domain, AC041.
6. Network allowlist. Only approved origins and Cloudflare Web Analytics load, AC042 and AC043.
7. One focus flow. A single complete project focus flow succeeds against the live site.
8. Console cleanliness. No severe browser console errors.
9. Live accessibility. Axe reports zero serious or critical violations on the live home shell and Atlas.

After main site integration, the suite adds the AC056 check that the live nixfred.com card opens the correct production domain.

## 12. What CI blocks versus warns

BLOCK, meaning a failure stops preview promotion and production deployment:

1. Formatting check, lint, strict TypeScript, and Astro check.
2. Catalog and graph validation, `scripts/validate-catalog.ts` and `scripts/validate-graph.ts`.
3. Unit tests in `tests/unit/`.
4. End to end tests in `tests/e2e/` on Chromium, WebKit, and Firefox behavior.
5. Accessibility, zero serious or critical axe violations on the required routes and states.
6. Production build success.
7. Bundle and asset budget hard failures.
8. Internal link integrity, `scripts/check-links.ts`.
9. Security header presence and the network allowlist.
10. Secret scan.
11. Third party Action pin scan.
12. Hard Lighthouse budget failures without a documented exception.
13. Motion evidence assertions, being motion present in full mode and motion absent in reduced motion.
14. Layout determinism, in process and cross build hash equality.
15. Production smoke on the custom domain.

WARN, meaning recorded in the job summary and reviewed but not gating unless a hard threshold is crossed:

1. Visual regression diffs pending first baseline approval, and new or changed baselines.
2. Small performance regressions under the hard budget.
3. Firefox visual fidelity deltas.
4. Scheduled external link status drift and redirected or expired external hosts, which produce an issue only when an actionable threshold is met, per the scheduled checks workflow.
5. Instrumented frame rate dips that are below target but above the failure floor.

## 13. Coverage gap statement

The following criteria cannot be fully closed by automation. Each names the exact manual step that closes it, recorded in `docs/RELEASE_REPORT.md` with a reviewer and evidence link.

1. AC006, cyber cartography judgment. Closed by Fred review of the production preview. The matrix names this as Fred review.
2. AC008, color independence judgment. The state attributes and contrast are automated and blocking, but the human judgment that meaning survives without color is closed by a visual review against the selected state screenshot set.
3. AC001 and AC011 tone and deliberateness. Presence and interaction are automated and blocking. The judgment that the copy communicates purpose and that the mobile interface is deliberate is a review against the captured artifacts.
4. AC037 and PR010 numeric performance. The starting budgets are automated. Final numeric budgets still require Fred approval. The authoritative 60 and 30 frames per second targets are a MANUAL measurement on Fred's reference devices, fixed by F29: Fred's MacBook Pro, Apple M4 Max (Mac16,5) for 60 fps desktop, and Fred's iPhone for 30 fps mobile, exact model recorded at Phase 5 sign off.
5. AC040, AC043, AC044 review halves. The scans are blocking. The manual review of browser source, logs, analytics scope, and Action intent annotations is recorded as a note.
6. AC051 and AC052, rollback readiness. The presence of a healthy prior deployment and the rollback rehearsal are operational steps recorded in `docs/OPERATIONS.md` and the runbook, not CI gates.
7. AC055, main site sequencing. The requirement that nixfred.com is updated only after production verification is enforced by human sequencing through a separate pull request. AC056 becomes an automated smoke check once that integration is live.
8. AC057, documentation accuracy. Closed by a documentation review at release.
9. AC058, final acceptance. Closed by Fred, recording follow up as GitHub issues.
10. Manual screen reader matrix. Axe cannot prove a real screen reader experience. The manual navigation, search, project detail, and Atlas passes on VoiceOver, NVDA, and TalkBack close this, per `docs/ACCESSIBILITY.md`.

Pending Fred decisions that affect this plan:

1. Final numeric performance budgets, discovery question 154. The reference devices for the 60 and 30 frames per second targets are RESOLVED by F29: Fred's MacBook Pro, Apple M4 Max (Mac16,5) for desktop and Fred's iPhone for mobile, with the exact iPhone model recorded at Phase 5 sign off. CI approximates both with the documented matching profiles.
2. Firefox visual fidelity is RESOLVED by F25: Firefox behavioral parity is blocking and visual deltas warn. This confirms the browser matrix (BLOCK on behavior, WARN on visual fidelity); it is no longer pending.
3. Audio is RESOLVED by F12: audio ships in version one, optional and off by default with a visible control, so AC027 and AR005 are live rows. It is no longer conditional on whether an audio subsystem exists.
