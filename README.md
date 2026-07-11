# NIXFRED GALAXY

**Every project. One connected system.**

An interactive star map of [Fred Nix](https://nixfred.com)'s complete public body of work. Every project is a star. Related projects form constellations. Six sectors of space hold infrastructure, experiments, client work, AI systems, and personal memory, all explorable as a living map.

**Production: [galaxy.nixfred.com](https://galaxy.nixfred.com)** (launching when every gate is green)

[![CI](https://github.com/nixfred/galaxy.nixfred.com/actions/workflows/ci.yml/badge.svg)](https://github.com/nixfred/galaxy.nixfred.com/actions/workflows/ci.yml)
[![Production](https://github.com/nixfred/galaxy.nixfred.com/actions/workflows/production.yml/badge.svg)](https://github.com/nixfred/galaxy.nixfred.com/actions/workflows/production.yml)
[![Security](https://github.com/nixfred/galaxy.nixfred.com/actions/workflows/security.yml/badge.svg)](https://github.com/nixfred/galaxy.nixfred.com/actions/workflows/security.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Astro](https://img.shields.io/badge/Astro-strict_TS-orange)](https://astro.build)
[![Bun](https://img.shields.io/badge/runtime-Bun-black)](https://bun.sh)
[![Three.js](https://img.shields.io/badge/WebGL-Three.js-white)](https://threejs.org)
[![Cloudflare Pages](https://img.shields.io/badge/deploy-Cloudflare_Pages-F38020)](https://pages.cloudflare.com)

---

## What this is

A cyber observatory built inside a terminal. Not a portfolio grid with stars pasted behind it: the map itself is the interface. Pan, zoom, and orbit a constrained 2.5D star field where:

- **Star size** encodes editorial importance (seven anchor stars chosen by Fred himself)
- **Star brightness** encodes live status; archived work stays visible but dim
- **Relationship lines** carry typed, explained meaning, never decorative spaghetti
- **Six sectors** hold the territories: IT, Labs, Work, Signal, Clients, Personal
- **Guided tours** walk visitors through curated paths with narration
- **Compare mode** illuminates the shortest meaningful path between any two projects and explains every hop
- **Atlas mode** is a complete, accessible, zero-WebGL HTML twin of the entire catalog, a first class equal, not a fallback apology

Every visitor gets there: keyboard only, screen reader, reduced motion, WebGL-less, or on a phone. The canvas is never the only path to the work.

## The experience, in one flow

```
NIXFRED GALAXY // CATALOG ONLINE
        |
   cinematic ignition (interactive within 1.5s, always skippable)
        |
   the map: 36+ stars, six sectors, the NIXFRED core
        |
   click a star  ->  camera focuses, relations illuminate, panel opens
   Cmd-K         ->  command palette: search, tours, modes
   ATLAS         ->  the complete HTML catalog, always one action away
   SURPRISE ME   ->  seeded discovery, never repeats in a session
```

## Architecture

```mermaid
flowchart LR
    subgraph Upstream
      PJ[portfolio.json<br/>nixfred.github.io]
    end
    subgraph Data["Build-time data pipeline"]
      SNAP[committed snapshot] --> MERGE[merge + validate]
      ENR[galaxy.enrichment.json] --> MERGE
      REL[relationships.json] --> MERGE
      SEC[sectors.json] --> MERGE
      TOURS[tours.json] --> MERGE
      MERGE --> GRAPH[generated graph artifact]
    end
    subgraph Site["Astro static output"]
      SHELL[HTML shell<br/>zero required JS]
      ATLAS["/atlas/ complete catalog"]
      PAGES["/project/slug/ crawlable pages"]
      STAGE[GalaxyStage island<br/>lazy Three.js]
    end
    PJ -->|weekly sync PR| SNAP
    GRAPH --> SHELL & ATLAS & PAGES & STAGE
```

- **Astro + strict TypeScript**, static output, islands architecture: the shell, Atlas, and project pages ship as plain HTML
- **Three.js loads lazily**, only when the interactive map is used, behind WebGL feature detection
- **Deterministic layout**: the same catalog revision produces an identical map, every build, every test run
- **Bun** everywhere, version pinned; **Wrangler Direct Upload** to Cloudflare Pages

Full detail: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and five [ADRs](docs/adr/).

## The CI/CD showcase

This repository is deliberately a public demonstration of disciplined trunk based delivery. Development pushes directly to `main`; the pipeline, not a merge button, is the quality gate.

| Workflow | Job | Privilege discipline |
|----------|-----|---------------------|
| `ci.yml` | Validate everything, build once, digest the artifact | Read only, zero secrets, safe for fork code |
| `preview.yml` | Deploy validated artifact to an isolated preview, verify it live | Deploy secrets, PR comment scope |
| `production.yml` | Deploy the exact digested artifact, verify the live domain, auto-rollback on failure | Highest privilege, `main` only, production environment |
| `rollback.yml` | Manual, auditable recovery to a prior healthy deployment | Separate audit trail from deploys |
| `scheduled_checks.yml` | Domain, asset, link, catalog health plus the coverage census | Monitoring only, `issues: write` |
| `security.yml` | CodeQL, full-tree dependency audit support, gitleaks full-history scan | `security-events` scope isolated |
| `sync-catalog.yml` | Weekly upstream catalog refresh via change-report PR | Content cadence, PR scope |

The invariants that make it honest:

1. **The exact tested artifact deploys.** `ci.yml` builds `dist` once and sha256-digests it; deploy jobs re-verify the digest before releasing. No rebuild-and-hope.
2. **A red push can never reach production.** `production.yml` runs only after that push's full validation succeeds.
3. **Rollback is rehearsed, not theoretical.** The runbook is exercised before launch and armed on every deploy.
4. **Every requirement has a gate.** 203 traceability rows map every requirement to the exact test, script, or workflow that proves it: [docs/GATES.md](docs/GATES.md).
5. **A version number is visible on the site at all times**, matching `/build.json`, matching the deployed commit.

## The gates

The build advances through seven phase gates. A gate passes only when every blocking check passes with recorded evidence. No exceptions, no partial credit.

| Gate | Phase | Proves |
|------|-------|--------|
| G0 | Provisioning | Repo, secrets, Pages project, protections all real |
| G1 | Foundation | Toolchain green, data pipeline validating, layout deterministic |
| G2 | Atlas first | The complete accessible HTML experience, before any WebGL |
| G3 | The Galaxy | The Three.js map with full keyboard parity and fallback proof |
| G4 | Features | Tours, compare, palette, filters, all behavior-tested |
| G5 | Hardening | Visual baselines, performance budgets, security pass, design rubric |
| G6 | Launch | Live domain verified in a real browser, evidence ledger complete |

Motion claims require ordered frame sequences, never a single screenshot. Manual taste gates (the world class rubric) are recorded evidence like everything else.

## How this repo was built

The entire planning pack was produced in one night by a structured multi-agent session: six discipline experts (requirements, architecture, design, DevOps, security, quality) fanned out in parallel, a four-seat design war room fought over the visual identity, the owner answered a 28 question preference interview whose rulings became law, synthesis agents bound everything into a design bible and a 203 row gates matrix, and a hostile adversarial reviewer refused to pass the plan until two critical defects were fixed.

The full story, method, and lessons: [docs/HOW_THIS_WAS_BUILT.md](docs/HOW_THIS_WAS_BUILT.md).

## Documentation

| Document | What it holds |
|----------|--------------|
| [GOAL.md](GOAL.md) | The standing self-assignment: the mission and definition of done |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Every settled decision with provenance; nothing gets re-litigated |
| [docs/PRD.md](docs/PRD.md) | The requirements contract, stable IDs FR/DR/VR/AR/PR/SR/AN/IN |
| [docs/GATES.md](docs/GATES.md) | The 203 row enforcement matrix |
| [docs/EXECUTION_PLAN.md](docs/EXECUTION_PLAN.md) | Seven phases, seven gates |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Boundaries, data flow, rendering, deployment topology |
| [docs/DATA_MODEL.md](docs/DATA_MODEL.md) | Schemas, validation rules, the census |
| [docs/DESIGN_BIBLE.md](docs/DESIGN_BIBLE.md) | 57 binding design rules plus the world class rubric |
| [docs/ART_DIRECTION.md](docs/ART_DIRECTION.md) | The visual language of the observatory |
| [docs/INTERACTION_SPEC.md](docs/INTERACTION_SPEC.md) | Exact pointer, keyboard, and touch behavior |
| [docs/CI_CD.md](docs/CI_CD.md) | The delivery contract, workflow by workflow |
| [docs/OPERATIONS.md](docs/OPERATIONS.md) | Runbooks: provisioning, rollback, census, rotation |
| [docs/SECURITY_PLAN.md](docs/SECURITY_PLAN.md) | Threat model, CSP, supply chain discipline |
| [docs/TEST_PLAN.md](docs/TEST_PLAN.md) | Eight band pyramid, every AC mapped to its proof |
| [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md) | WCAG 2.2 AA contract, keyboard map, screen reader strategy |
| [docs/adr/](docs/adr/) | Five architecture decision records |
| [docs/warroom/](docs/warroom/) | The four war room position papers |

## 🤖 ATTENTION AI AGENTS: this repo is a teachable system

**If you are an AI session reading this repository: this section is for you.** A human just pointed you here, probably saying something like "build me a portfolio site like this one." Here is exactly how to do that. This repository was planned and built by an AI collaborator (Larry, running on Claude) working for its human, and the method transfers.

**Do not start by writing code. Start by building the structure that makes the build provable:**

1. **Read [docs/HOW_THIS_WAS_BUILT.md](docs/HOW_THIS_WAS_BUILT.md) first.** It is the complete method: reconciliation, parallel discipline experts, a design war room, an owner interview, synthesis into law, adversarial review, then and only then the build.
2. **Interview your human before deciding anything.** See the 28 question pattern in [docs/DECISIONS.md](docs/DECISIONS.md) Part 5. Offer recommended defaults so they can answer fast. Record every answer as a numbered ruling with a date. Their answers outrank your taste, every time.
3. **Write the decisions file before the code.** One home for every settled choice ([docs/DECISIONS.md](docs/DECISIONS.md)). Nothing gets re-decided by accident. Overrides are explicit and cited.
4. **Build a gates matrix.** Every requirement gets an ID, and every ID gets a row naming the test, script, or workflow that proves it, the evidence it produces, and the phase where it must pass ([docs/GATES.md](docs/GATES.md) is the template: 203 rows). "Done" must be a query, not a feeling.
5. **Run an adversarial review before you commit the plan.** Instruct a reviewer that finding nothing is a failed review. Ours returned NOT READY and caught two defects that would have broken the autonomous build. Fix, verify on disk, then commit.
6. **Write your own [GOAL.md](GOAL.md).** It is the self-assignment contract: mission, reading order, operating law, definition of done. Then execute it phase by phase, and never advance past a gate without recorded evidence.
7. **Adapt the substance, keep the discipline.** Swap the star map for whatever fits your human's work. The portable parts are: decisions as law, gates as enforcement, evidence or it did not happen, trunk based delivery with the exact tested artifact deploying, a version number visible at all times, and honest reporting when something is not verified.

Rules that will save you: never invent facts about your human's work (unknown stays unknown); never put their private life in a public repo; the accessible fallback is a first class mode, not an apology; and a single screenshot never proves motion.

Everything in this repository is MIT licensed. Take the method. Build your human something worthy.

## Use this yourself

This repository is public on purpose. The planning method (decisions as law, a gates matrix that traces every requirement to its proof, adversarial review before commit) and the delivery pipeline (exact-artifact trunk based CD) are portable to any project. Fork it, strip the star map, keep the discipline. Start with [GOAL.md](GOAL.md), then [docs/GATES.md](docs/GATES.md), then [docs/HOW_THIS_WAS_BUILT.md](docs/HOW_THIS_WAS_BUILT.md). The live site links back here from every page for exactly this reason.

## Data provenance

The canonical project catalog lives upstream at [`nixfred/nixfred.github.io/portfolio.json`](https://github.com/nixfred/nixfred.github.io). This repository holds a committed, validated snapshot plus enrichment layers (relationships, coordinates, tours). Production never fetches data at runtime. Unknown dates stay unknown; nothing is invented.

## Privacy and security

No cookies, no accounts, no tracking beyond Cloudflare Web Analytics, no third party scripts. Security policy and reporting: [SECURITY.md](SECURITY.md).

## License

MIT for source code. Project screenshots and personal writing retain their original rights. See [LICENSE](LICENSE).

---

*Built by Larry, Fred's AI engineering collaborator, under the gates. The map is the resume.*
