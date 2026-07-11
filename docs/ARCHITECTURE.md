# ARCHITECTURE

Status: Approved architecture for implementation. Supersedes `03_ARCHITECTURE_AND_FILES.md` in the requirements pack, which described a Vite plus React plus React Three Fiber stack and is retained only as historical reference. The canonical repository tree is `05_PROFESSIONAL_FILE_MANIFEST.md`. This document explains why the tree is shaped the way it is and how the pieces connect at runtime.

## 1. Stack summary

Astro with strict TypeScript, static output (`output: "static"` in `astro.config.mjs`), Bun as the package manager and script runner, Three.js loaded only for the interactive map, Playwright for browser and end to end behavior, Vitest for unit and data logic, axe for automated accessibility checks, Wrangler Direct Upload to the Cloudflare Pages project `galaxy-nixfred-com`, configuration in `wrangler.jsonc`.

There is no client side UI framework runtime (no React, Vue, Svelte, or Preact island renderer). Every file in the canonical manifest under `src/components/`, `src/layouts/`, and `src/pages/` is an `.astro` file. Interactive behavior is authored as hand written, dependency light TypeScript modules attached to the page through `<script>` tags and dynamic `import()`, not through a component framework's hydration model. This is a deliberate choice, recorded in `docs/adr/0001-astro-over-react.md`: it is the only way to hit the shell budget in PR004 and the visualization chunk budget in PR005 while still shipping a fully interactive 2.5D scene.

## 2. Application boundaries: the islands strategy

Astro's default behavior is to render every component to static HTML at build time and ship zero JavaScript unless a component explicitly opts into client execution. NIXFRED GALAXY leans on that default deliberately, because FR001 to FR003 require a usable HTML shell that does not depend on the visualization bundle, and AC021 requires the Atlas route to work with JavaScript disabled before hydration.

Static, zero required JS (rendered fully server side, readable by any crawler or screen reader without a script running):

- `src/pages/index.astro`, using `src/components/shell/SiteHeader.astro`, `SiteFooter.astro`, `LoadingStatus.astro`, `HelpDialog.astro` for the shell described in FR002.
- `src/pages/atlas/index.astro`, using `src/components/atlas/AtlasGrid.astro`, `AtlasFilters.astro`, `AtlasProjectCard.astro`. This route is the accessible text representation required by FR049 to FR053 and AR008, and it must render the complete catalog as real HTML list markup, not as a canvas description.
- `src/pages/project/[slug].astro`, one statically generated page per public project (FR054 to FR056), built with `getStaticPaths` against the generated graph artifact described in section 5.
- `src/pages/404.astro`, the styled not found page required by the product requirements' error and fallback section.

Hydrated islands, JavaScript loaded deliberately and only when needed:

- `src/components/galaxy/GalaxyStage.astro`. This is the single mount boundary for the entire Three.js experience. Its server rendered output is an inert container: a `<canvas>` element, a `<noscript>` link into Atlas, and the loading status region FR002 requires. A small inline bootstrap script (counted against the shell budget, not the visualization budget) feature detects WebGL and, only if the device can support it, performs `import("../../lib/graph/controller")` to pull in the graph module graph described in section 3. No Three.js code is ever part of the initial page load.
- `src/components/search/CommandPalette.astro`, hydrated because FR023 requires it to intercept `Command K`, `Control K`, and `/` globally.
- `src/components/galaxy/MapControls.astro`, `SectorLegend.astro`, `ProjectPanel.astro`, `MobileProjectSheet.astro`, `ComparePanel.astro`, `TourControls.astro`, `TimelineControls.astro`. Each hydrates only the interactive parts of its markup and reads and writes the shared store described in section 4. Every one of these has a required non canvas behavior, so none of them may become the only way to reach their information: filters must also operate in Atlas (FR031), tour and search results must be reachable through the accessible tree (AR008).

The rule that governs this boundary: nothing required for FR002, FR049 to FR053, or AC021 to AC023 may live only inside a hydrated island. If a capability exists in the Map, either Atlas offers an equivalent path to the same information, or the capability is explicitly Map only and documented as such in `docs/DECISIONS.md`.

```
                         request for /
                              |
                    Astro static render (build time)
                              |
        +---------------------------------------------+
        |  SiteHeader / SiteFooter / LoadingStatus     |  <- always present, 0 required JS
        |  GalaxyStage (inert canvas + noscript Atlas) |
        +---------------------------------------------+
                              |
                     shell JS (small, PR004)
                              |
                 WebGL feature test in GalaxyStage
                    /                        \
      supported, JS enabled           unsupported / failed / lost context
                |                                     |
   dynamic import() of controller.ts          navigate or swap to /atlas/
   -> renderer/layout/nodes/lines/camera        (fully static, already
      /quality/selection (PR002, PR005)          crawlable, FR052)
                |
      hydrated islands (palette, panels,
      tour/timeline controls) subscribe to
      the shared store (section 4)
```

## 3. Rendering architecture: the lazy Three.js module graph

`GalaxyStage.astro` never imports Three.js directly. Its inline bootstrap script only performs the dynamic import once WebGL support is confirmed, which is what makes the visualization chunk in PR005 a genuinely separate, lazily fetched bundle rather than something Vite could inline into the shell by accident.

Everything below `src/lib/graph/` is vanilla TypeScript, framework free, and organized so each file has one job:

| Module | Responsibility |
|---|---|
| `renderer.ts` | Creates the Three.js renderer, scene, and camera; owns resize handling, the animation loop, and disposal on teardown. |
| `layout.ts` | Produces the deterministic node coordinates: sector anchors from `sectors.json`, manual overrides from `galaxy.enrichment.json`, seeded placement for everything else. Pure function of its inputs, no randomness that is not seeded. See `docs/adr/0004-deterministic-layout.md`. |
| `nodes.ts` | Builds star geometry, hit targets, label anchors, and the size and brightness encoding required by FR009 and FR010. |
| `lines.ts` | Builds relationship paths and the slow signal travel animation required by the art direction, and mutes automatic similarity edges relative to curated ones per FR037. |
| `camera.ts` | Constrained navigation: pan, zoom, limited orbit, focus transitions, tour camera targets, and the reduced motion variant of every transition (VR007). |
| `selection.ts` | Tracks hovered and selected node state inside the scene graph and raises the events the controller and store consume. |
| `quality.ts` | Chooses a rendering tier (desktop, tablet, mobile, low power, reduced data) and feeds particle count, glow, line density, and pixel ratio caps to `renderer.ts` and `nodes.ts` (FR012, PR011). |
| `controller.ts` | The only module that talks to the DOM outside the canvas. It wires pointer, keyboard, search, filters, the shared store, and the URL state module to the renderer, and it is what `GalaxyStage.astro` actually imports. |
| `types.ts` | Shared TypeScript types for the graph module, matching the generated graph artifact shape in `docs/DATA_MODEL.md`. |

`controller.ts` is the seam: everything above it in the import graph (renderer, layout, nodes, lines, camera, selection, quality) is scene implementation and has no knowledge of DOM panels or URL state. Everything below it (the hydrated islands in section 2) talks to the shared store, never to the renderer directly. This keeps the panels testable without a WebGL context and keeps the scene testable without a DOM.

## 4. State architecture

There is one shared, framework agnostic store, `src/lib/state/store.ts`, holding the state that both the Map and the hydrated panels need to agree on: selected slug, hovered slug, active sector filter, active status filter, active year range, active tour and step index, timeline position and playback state, the current compare pair, the session pin set, reduced motion preference, and audio preference. It is a small typed publish and subscribe object, not a dependency, so it does not add to the shell or visualization budgets.

Four supporting modules keep specific responsibilities out of the store itself:

- `src/lib/state/deepLink.ts` serializes the parts of the store that must be shareable (selected project, sector filter, tour and step, compare pair, timeline position when timeline sharing is enabled) into URL search parameters, and pushes history state on change (FR020, AC015). On load, and on `popstate`, it parses the URL and applies it to the store. Because the graph module loads asynchronously, `deepLink.ts` queues the resulting focus action until `controller.ts` dispatches a `galaxy:ready` event, satisfying the interview's requirement that a deep link resolves once the scene is ready.
- `src/lib/state/filters.ts` holds the pure predicate functions that decide whether a node is visible under the current sector, status, and year filters. `controller.ts` calls it to update the scene, and `AtlasFilters.astro`'s client script calls the same function to filter the list markup. One predicate, two consumers, which is what makes FR031 (filters operable in both Map and Atlas) safe to guarantee rather than something that can silently drift.
- `src/lib/state/sessionPins.ts` wraps `sessionStorage` for the pin list required by FR057 and FR058. Session storage clears when the tab closes, satisfies "no account, does not leave the browser," and survives an in tab reload, which is a reasonable reading of the requirement; if Fred wants pins to not survive a reload either, this module is the only place that needs to change.
- `src/lib/state/store.ts` itself never touches `window.location` or storage directly. Every side effect on the outside world goes through `deepLink.ts` or `sessionPins.ts`, which keeps the store unit testable in Vitest with no DOM.

## 5. Data flow: snapshot and enrichment merge to a generated graph artifact

Five files are committed under `src/data/`: `portfolio.snapshot.json` (the upstream catalog snapshot, DR002), `galaxy.enrichment.json`, `relationships.json`, `sectors.json`, and `tours.json`. None of these is consumed directly by a page or by the scene. They are combined at build time by `src/lib/catalog/merge.ts` (join and validation logic shared by every consumer) and `src/lib/graph/layout.ts` (deterministic coordinates) into one generated graph artifact. Full field level detail is in `docs/DATA_MODEL.md`; this section only describes where the artifact comes from and who reads it.

```
portfolio.snapshot.json  --+
galaxy.enrichment.json   --+
relationships.json       --+--> src/lib/catalog/merge.ts --> merged, validated graph
sectors.json              -+                                        |
tours.json                -+                                        v
                                                     src/lib/graph/layout.ts
                                                  (deterministic coordinates,
                                                   same catalog revision =
                                                   same layout, FR006)
                                                            |
                                              generated graph artifact
                                           (build time only, never committed)
                                          /                              \
                          Astro SSG pages                    static JSON asset
                     (index, atlas, project/[slug]           fetched once by
                      call merge.ts directly at              GalaxyStage on
                      build time via getStaticPaths)          hydration
```

The generated artifact is intentionally absent from the committed file manifest. It is a build product, produced fresh on every build the same way `build.json` is, and it is what makes `scripts/validate-graph.ts` meaningful as a CI gate: the validator runs the exact same `merge.ts` and `layout.ts` code the production build runs, so a passing validation step is a guarantee about the artifact that will actually ship, not a parallel check that can drift from it.

The Astro static pages import the merged graph directly at build time because Astro's build runs in Bun and can call TypeScript modules synchronously while generating HTML. The client side scene cannot do that (it runs in the visitor's browser after the page has already shipped), so the same artifact is also written to a same origin static JSON asset that `GalaxyStage`'s controller fetches once during hydration. That fetch is not a violation of DR010: DR010 forbids fetching the upstream catalog over the network at runtime, and this is a same origin, build time generated, already deployed static file, not a live call to `nixfred/nixfred.github.io`. The only process allowed to talk to the upstream catalog is the scheduled sync workflow described in `docs/DATA_MODEL.md` section 8, and it runs entirely outside the production request path.

`catalogRevision`, a checksum of the five source files, travels with the generated artifact into `build.json` (FR004, AC050) so a production visitor's build metadata and the data snapshot it was built from can be verified against each other, and so `scripts/report-bundle.ts` and the CI job summary can prove the deployed artifact and the CI validated artifact are the same one (AC047).

## 6. Atlas fallback and the WebGL failure path

Atlas is not a degraded view rendered only after something breaks. It is an ordinary static route, built from the identical generated graph artifact the Map uses, reachable at all times from a persistent control (interview question 48, FR051). The non negotiable principle in the execution directive, "the canvas is never the only content path," is enforced structurally by this routing choice rather than by a convention someone could forget. See `docs/adr/0005-atlas-fallback.md`.

Three distinct triggers lead to Atlas, and they are handled differently:

1. Visitor chooses Atlas deliberately. A visible `ATLAS` control is always present in the shell (FR051); this is a normal navigation, no detection involved.
2. WebGL cannot initialize at all. `GalaxyStage`'s bootstrap script feature detects a WebGL context before attempting the dynamic import. If detection fails, the import never happens, and the shell replaces the inert canvas region with the Atlas content inline, or navigates to `/atlas/` with the quiet message the interview specifies (FR052).
3. WebGL initializes but later loses its context, or `renderer.ts` throws during setup. `controller.ts` catches both cases (a `webglcontextlost` listener and a try or catch around initialization) and performs the same fallback as case 2, which is what AC008's "recovers from a lost graphics context or presents the fallback" requires.

Interview question 157 asks whether the text atlas should become the default on weak devices, or remain optional, and the interview pack does not supply a recommended default for that specific question. This document treats only outright WebGL failure (case 2 and case 3) as an automatic redirect. A proactive "this device is weak, defaulting you to Atlas even though WebGL technically works" behavior is not implemented until Fred decides; that is a PENDING-FRED item, tracked in section 11.

## 7. Device capability profiling

`src/hooks/useDeviceProfile.ts` (read by both the shell bootstrap and `quality.ts`) and `src/lib/graph/quality.ts` (applied inside the scene) together decide the rendering tier. Inputs: WebGL2 versus WebGL1 support, an approximate GPU tier heuristic from renderer capability strings and `navigator.hardwareConcurrency`, `navigator.deviceMemory` when available, `navigator.connection?.saveData`, `prefers-reduced-motion`, and `prefers-contrast`. Output: a small enum (desktop, tablet, mobile, low power, reduced data) that scales device pixel ratio cap, particle count, glow, and relationship line density (FR012, PR011). Reduced motion is not a rendering tier, it is an orthogonal switch that disables continuous decorative motion regardless of tier (FR014, VR007), handled by `src/hooks/useReducedMotion.ts` and consumed by `camera.ts`, `lines.ts`, and the entrance sequence.

The renderer also pauses continuous work when the document is hidden (`document.visibilitychange`) and reduces work when the map is idle with no recent input, satisfying FR013 and the AC038 evidence requirement.

## 8. Browser support strategy

The interview pack raises specific version questions (oldest Safari, oldest Chrome or Edge, Firefox fidelity parity, reference devices, installable web app, offline support, landscape phone importance) without supplying recommended defaults for any of them. Those are PENDING-FRED, listed in section 11. In the absence of a stated floor, the architecture targets evergreen browsers with feature detection rather than user agent sniffing: WebGL2 is preferred, WebGL1 is accepted if `renderer.ts` can degrade to it, and anything that cannot create a WebGL context at all receives Atlas automatically per section 6. This means the support strategy is self enforcing rather than version pinned: a browser is supported if it passes feature detection and unsupported if it does not, which keeps the product usable on old and unusual browsers without requiring a maintained compatibility table.

## 9. Performance strategy

| Requirement | Architectural mechanism |
|---|---|
| PR001, shell and critical CSS before the Three.js bundle | Astro static render plus the islands boundary in section 2 guarantee the shell never waits on the graph module. |
| PR002, lazy loaded visualization bundle | `GalaxyStage`'s bootstrap script performs the dynamic `import()` only after WebGL feature detection succeeds. |
| PR003, no screenshots until a relevant panel opens | Thumbnails and social images live only in `ProjectPanel.astro`, `MobileProjectSheet.astro`, and the generated Open Graph card; they are not part of the base scene textures. |
| PR004, shell JS under 150 KB compressed | No framework runtime is shipped in the shell (section 1); the shell's only required script is the bootstrap and feature detector. |
| PR005, visualization chunk under 300 KB compressed | The graph module graph in section 3 is a single dynamically imported chunk; `scripts/report-bundle.ts` fails CI on regression. |
| PR006, initial transfer under 1.5 MB desktop and 1 MB mobile | Enforced by `quality.ts` tier selection plus PR003's lazy asset policy. |
| PR007, PR008, PR009, Core Web Vitals budgets | Verified in CI through the Lighthouse job referenced in `docs/CI_CD.md`; architecturally supported by the static shell and deferred hydration. |
| PR010, 60 fps desktop and stable 30 fps mobile | `quality.ts` tiers reduce particle count and line density before frame rate degrades on constrained devices. |
| PR011, capped pixel ratio and reduced effects on low capability devices | `useDeviceProfile.ts` plus `quality.ts`, section 7. |
| PR012, CI reports asset, bundle, and Lighthouse results | `scripts/report-bundle.ts` and the CI job summary, detailed in `docs/CI_CD.md`. |

## 10. Deployment topology

```
git push (feature branch)        merge to main
        |                              |
        v                              v
  ci.yml (format, lint,          ci.yml (same gates,
  typecheck, astro check,        required before deploy)
  data validate, unit tests,           |
  build, bundle budget,                v
  browser smoke, axe)          production.yml
        |                        - reuse the exact
        v                          CI validated artifact
  preview.yml                     - wrangler pages deploy
   - wrangler pages deploy          (Direct Upload) to
     (Direct Upload) to             production branch of
     the PR's preview alias         galaxy-nixfred-com
   - PR comment with URL           - verify the Pages URL
   - live smoke test               - verify galaxy.nixfred.com
   - noindex verification          - verify headers, console,
                                      one project focus flow
                                    - write docs/RELEASE_REPORT.md
                                    - on failed verification,
                                      redeploy the last known
                                      good Cloudflare deployment
                                      and open a GitHub issue
```

GitHub is the source of truth and the automation authority; Wrangler performs every Cloudflare Pages operation; Cloudflare Pages hosts both preview and production deployments of the project `galaxy-nixfred-com`; `galaxy.nixfred.com` is attached through the Pages custom domain flow. Direct Upload, not Cloudflare's git integration, is the deployment mechanism, which is what makes "the exact tested artifact is used for deployment" (AC047) a guarantee instead of a hope; the reasoning is recorded in `docs/adr/0002-direct-upload-deployment.md`.

Workflow decomposition is owned by `docs/CI_CD.md`, which rules the canonical set of seven workflows: `ci.yml`, `preview.yml`, `production.yml`, `rollback.yml`, `scheduled_checks.yml`, `security.yml`, and `sync-catalog.yml`. The professional file manifest's five file list (`deploy.yml` in place of `production.yml`, no rollback or scheduled checks files) is superseded on this one point, recorded as ruling R8 in `docs/DECISIONS.md`. The reasoning is least privilege: production deployment, manual rollback, scheduled monitoring, static analysis, and catalog sync each carry a different permission profile and audit trail, and merging them would widen the blast radius of the most privileged job. Rollback remains a redeploy of a prior successful Cloudflare Pages deployment identifier mechanically, but it lives in its own `workflow_dispatch` file so recovery actions are separately auditable (AC051, AC052).

## 11. Open questions, PENDING-FRED

These are raised in `06_DISCOVERY_INTERVIEW.md` without a recommended default in `01_INTERVIEW.md`. `docs/DECISIONS.md` Part 4 records the standing PENDING-FRED list with safe fallbacks; item P4 there already resolves the reference device question below. The remaining items are still open and this architecture does not resolve them on Fred's behalf:

1. Whether a "weak but WebGL capable" device should default to Atlas proactively, beyond the outright failure path in section 6 (question 157).
2. Oldest supported Safari, Chrome, and Edge versions, and whether Firefox requires identical visual fidelity (questions 151 to 153).
3. Desktop and mobile reference devices for performance sign off (questions 154, 155). Resolved with a safe fallback in `docs/DECISIONS.md` P4: a standard mid tier Android class device for mobile and a 1440 by 900 desktop viewport, used to enforce PR007 and PR010 until Fred names real devices.
4. Whether the site should be installable as a web app and whether any content should work offline (questions 158, 159).
5. Whether landscape phone use is an explicit target (question 160).

None of these block implementation. The feature detection based support strategy in section 8 and the tiered quality system in section 7 behave reasonably in the absence of an answer, and each can be tightened later without an architectural change.
