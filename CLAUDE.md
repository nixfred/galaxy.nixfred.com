# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> Repo law for NIXFRED GALAXY. Global Larry rules live in `~/.claude/CLAUDE.md`; this file adds the project contract on top. The playbook that produced this project is `BUILD.md`; the self-assignment that drives the build is `GOAL.md`.

## What this project is

NIXFRED GALAXY: an interactive star map of Fred Nix's complete public body of work, deployed at `https://galaxy.nixfred.com`. The mission and completion contract live in `GOAL.md`. Invoking `/goal` means executing `GOAL.md` to completion.

## Canonical document hierarchy

1. `docs/DECISIONS.md` settles every decision. Never re-interview Fred on anything recorded there.
2. `docs/PRD.md` is the requirements contract (stable IDs: FR, DR, VR, AR, PR, SR, AN, IN).
3. `docs/GATES.md` maps every requirement and acceptance criterion to its enforcement mechanism. A requirement without a passing gate is not done.
4. `docs/EXECUTION_PLAN.md` sequences the build into gated phases.
5. Discipline docs: `ARCHITECTURE.md`, `DATA_MODEL.md`, `ART_DIRECTION.md`, `DESIGN_BIBLE.md`, `INTERACTION_SPEC.md`, `CI_CD.md`, `OPERATIONS.md`, `SECURITY_PLAN.md`, `TEST_PLAN.md`, `ACCESSIBILITY.md`.
6. `galaxy_requirements_pack/` is the HISTORICAL INPUT that produced the docs above. It is reference only. Where it conflicts with `docs/`, `docs/` wins. In particular, `03_ARCHITECTURE_AND_FILES.md` (Vite plus React) is superseded: the stack is Astro.

## Fixed targets (never re-litigate)

| Target | Value |
|--------|-------|
| Production domain | `galaxy.nixfred.com` |
| GitHub repository | `nixfred/galaxy.nixfred.com` (public) |
| Cloudflare Pages project | `galaxy-nixfred-com` |
| Production branch | `main` |
| Build output | `dist` |
| Package manager | Bun (pinned via `.bun-version`) |
| Framework | Astro, strict TypeScript |
| Visualization | Three.js, lazy loaded only for the interactive map |
| Deployment | Wrangler Direct Upload via GitHub Actions |
| Upstream catalog | `nixfred/nixfred.github.io/portfolio.json`, committed snapshot, never a runtime fetch |

## Non-negotiable behavior

1. Phase gates in `docs/EXECUTION_PLAN.md` block phase advancement. Evidence per `docs/GATES.md` or the gate has not passed.
2. Tests are the release gate. Green deploys without asking. Red fixes or rolls back without asking.
3. The canvas is never the only path to project content. Atlas mode is a first class equal mode.
4. Never invent dates, project facts, client claims, or metrics. Unknown stays unknown.
5. This repository is PUBLIC. No secrets, no private family or health details, no internal infrastructure facts. Inspect every staged change before committing.
6. Reduced motion is a designed mode, not a broken version.
7. Mobile is a deliberate composition, not a shrunken desktop.
8. Motion claims require ordered frame sequence evidence, never a single screenshot.
9. World class is enforced by the rubric in `docs/DESIGN_BIBLE.md` at the launch gate.

## Writing rules for all content in this repo

1. Never use em dashes or en dashes in prose. Use commas, colons, and periods.
2. Concise professional Markdown. Every recommendation states its reason.
3. Interface copy sounds like NIXFRED, not a generic dashboard.

## Commands

Bun is the runtime and package manager (pinned in `.bun-version`). `bun install --frozen-lockfile` to set up.

| Task | Command |
|------|---------|
| Dev server | `bun run dev` |
| Production build (emits `dist/`) | `bun run build` |
| Preview the built site | `bunx astro preview --port 4741` |
| The full pre-commit gate (mirrors CI) | `bun run check:all` |
| Format / lint / typecheck | `bun run format` · `bun run lint` · `bun run typecheck` · `bun run astro:check` |
| Data pipeline | `bun run data:sync` (refresh snapshot) · `bun run data:validate` (F1 anchors, F2 hero edges, schema) · `bun run data:census` (DR011 coverage) |
| Unit tests (Vitest) | `bun run test:unit` |
| A single unit test | `bunx vitest run tests/unit/pathfind.test.ts` |
| Browser tests (Playwright) | `bunx playwright test --project=e2e` (Chromium) · `--project=e2e-webkit` · `--project=a11y` (axe) |
| A single browser spec | `bunx playwright test --project=e2e tests/e2e/map-select.spec.ts` |
| Visual / performance | `bun run test:visual` · `bun run test:performance` |
| Regenerate the OG card | `bun run og:generate` |

Playwright starts its own `astro preview` on port 4741; do not run a dev server on that port during tests. The visual suite uses committed darwin baselines (the F29 reference device) and is not in CI; regenerate with `bunx playwright test --project=visual --update-snapshots`.

Deploy (Fred authorized wrangler locally): env Cloudflare tokens must be UNSET for wrangler Pages operations, which use the OAuth session. Build with real identity, then Direct Upload:

```bash
GITHUB_SHA=$(git rev-parse HEAD) GITHUB_REF_NAME=main bun run build
GITHUB_SHA=$(git rev-parse HEAD) GITHUB_REF_NAME=main bun run scripts/generate-build-info.ts
env -u CLOUDFLARE_API_TOKEN -u CF_API_TOKEN wrangler pages deploy dist --project-name=galaxy-nixfred-com --branch=main --commit-hash=$(git rev-parse HEAD)
```

## Code architecture

Astro static site with a single hydration island. The big picture spans several files:

1. **Data flows one direction at build time.** `src/data/portfolio.snapshot.json` (synced from the public `nixfred.com/portfolio.json` by `scripts/sync-catalog.ts`; the source GitHub repo is private, so the live site is the canonical published artifact) is joined with the enrichment layers (`galaxy.enrichment.json`, `relationships.json`, `sectors.json`, `tours.json`) by `src/lib/catalog/merge.ts`, then positioned by `src/lib/graph/layout.ts`. The merged graph is exposed two ways: Astro SSG pages import it directly, and `src/pages/graph.json.ts` prerenders it to `/graph.json` for the client scene to fetch once. No runtime fetch of the upstream catalog (DR010).

2. **The layout is deterministic.** `layout.ts` uses a mulberry32 PRNG seeded from each project slug, so the same catalog revision produces an identical map on every machine and build (proven by hash equality, AC031). Never introduce `Math.random`, `Date.now`, or `new Date()` into the scene or data path.

3. **Atlas is the accessibility surface, the canvas is decoration.** `/atlas/` (`src/pages/atlas/index.astro`) and the per-project pages (`src/pages/project/[slug].astro`, one static page per catalog entry) are the real, crawlable, keyboard-navigable, zero-JS representation. The WebGL canvas is `aria-hidden`. Every feature must remain reachable without WebGL; `src/components/galaxy/GalaxyStage.astro` feature-detects WebGL and falls back to an Atlas link with zero Three.js bytes loaded.

4. **The scene lives in `src/lib/graph/` and Three.js loads lazily.** `GalaxyStage.astro` is the ONLY hydration boundary and dynamically imports the controller only after WebGL detection (the lazy chunk stays under 300 KB gz). Module roles: `renderer.ts` (loop, DPR caps, pause-when-hidden, context-loss), `nodes.ts` (instanced shader stars with additive halos, no post-processing bloom), `sectors.ts` (atmosphere), `lines.ts` (relationship edges with signal pulses), `camera.ts` (the BD33 custom rig: spherical offset, no OrbitControls, no roll, exp damping), `labels.ts` (HTML overlay labels with a hero keep-out), `selection.ts` (raycast picking against invisible hit proxies), `quality.ts` (tiers + FPS watchdog), `pathfind.ts` (BFS shortest path for compare mode), and `controller.ts`.

5. **`controller.ts` is the seam.** It is the only scene module that touches the DOM outside the canvas. Everything above it is pure scene code with no DOM/URL knowledge; `GalaxyStage.astro`'s inline script wires the controller's public API (`select`, `setSectorFilter`, `surpriseMe`, `startTour`, `compareWith`, `getKeyboardOrder`) to the detail panel, command palette, tours, filters, deep links (`src/lib/state/deepLink.ts`, `?p=<slug>` and `?tour=<id>`), and keyboard handling. When adding a map feature, extend the controller API and wire the DOM in the stage script; do not reach into scene modules from the DOM.

6. **Build identity is single-sourced.** `src/lib/buildInfo.ts` reads `process.env.GITHUB_SHA` at SSG time and `scripts/generate-build-info.ts` writes `dist/build.json` with the same derivation (F27: `v<date>-<shortsha>`), so the always-visible footer version (F32) and `/build.json` can never disagree. Local builds without `GITHUB_SHA` render `dev-local`, never a fabricated release.

7. **Delivery is trunk based to `main`.** Seven GitHub Actions workflows (`ci`, `preview`, `production`, `rollback`, `scheduled_checks`, `security`, `sync-catalog`). `ci.yml` builds and sha256-digests `dist` once; `production.yml` deploys that exact artifact only after CI passes on a `main` push (a red push never reaches production). Commit and push directly to `main` at every meaningful step (F31); the pipeline is the quality gate, not a merge button.

Requirement IDs (FR/DR/VR/AR/PR/SR/AN/IN and AC/WC) are stable and referenced throughout code comments and tests. When touching behavior, cite the ID it satisfies.
