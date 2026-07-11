# CLAUDE.md - galaxy.nixfred.com

> Repo law for NIXFRED GALAXY. Global Larry rules live in `~/.claude/CLAUDE.md`; this file adds the project contract on top.

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

The toolchain is scaffolded in Phase 1. Once `package.json` exists, the required scripts are: `dev`, `build`, `preview`, `format`, `format:check`, `lint`, `typecheck`, `astro:check`, `data:sync`, `data:validate`, `test`, `test:unit`, `test:e2e`, `test:a11y`, `test:visual`, `test:performance`, `check:links`, `check:all`. Update this section with exact usage when they land.
