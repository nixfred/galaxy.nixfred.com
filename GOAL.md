# THE GOAL

> This file is the standing self-assignment for Larry. Invoking `/goal` in this project means: execute this file to completion. There is no other interpretation.

## Mission

Build, test, deploy, and verify NIXFRED GALAXY, the complete production application at `https://galaxy.nixfred.com`. Every public project Fred has built becomes a star. Related projects form visible constellations. The result must be world class: an experience a visitor describes to another person.

This is not a prototype, a demo, or a local experiment. The goal is complete only when the production site is live on the custom domain, every gate in `docs/GATES.md` has passed with recorded evidence, and Fred has reviewed the live experience.

## Reading order at invocation

1. `CLAUDE.md` (this repo's law)
2. `docs/DECISIONS.md` (settled decisions, never re-litigate)
3. `docs/PRD.md` (what to build, requirement IDs)
4. `docs/EXECUTION_PLAN.md` (phases and their gates)
5. `docs/GATES.md` (the enforcement matrix, every requirement mapped to proof)
6. The discipline docs as each phase needs them: `ARCHITECTURE.md`, `DATA_MODEL.md`, `ART_DIRECTION.md`, `DESIGN_BIBLE.md`, `INTERACTION_SPEC.md`, `CI_CD.md`, `OPERATIONS.md`, `SECURITY_PLAN.md`, `TEST_PLAN.md`, `ACCESSIBILITY.md`
7. `docs/warroom/` (the design war room papers behind the design bible)

## Authority

The authority grants in `galaxy_requirements_pack/00_LARRY_EXECUTION_DIRECTIVE.md` and `00_LARRY_DIRECTIVE.md` are in force. Larry creates the GitHub repository, configures Actions and branch protection, creates the Cloudflare Pages project, attaches the domain, deploys previews and production, and rolls back failures without asking permission for any authorized action. Authentication checks are verification, not permission requests.

## Operating law

1. Work phase by phase per `docs/EXECUTION_PLAN.md`. A phase gate that has not passed blocks the next phase. No exceptions, no partial credit.
2. Tests are the release gate. Green means deploy. Red means fix or roll back.
3. Evidence or it did not happen. Every gate check produces an artifact recorded per `docs/GATES.md`.
4. A single screenshot never proves motion. Motion evidence is an ordered frame sequence.
5. The canvas is never the only path to content. Atlas mode is a first class equal.
6. Never fabricate dates, facts, or metrics. Unknown values stay explicitly unknown.
7. The repository is public. Inspect every staged change for private data before committing.
8. When a PENDING-FRED item in `docs/DECISIONS.md` blocks work, use its documented safe fallback and continue; ask Fred only if no fallback exists.
9. World class is a gate, not a vibe: the rubric in `docs/DESIGN_BIBLE.md` is applied before launch and its failures are fixed like any other failing test.

## Definition of done

1. All phase gates G0 through G6 in `docs/EXECUTION_PLAN.md` passed.
2. All acceptance criteria AC001 through AC058 pass with evidence per `docs/GATES.md`.
3. `https://galaxy.nixfred.com` serves the verified production build with valid TLS, correct headers, and `/build.json` matching the deployed commit.
4. `docs/RELEASE_REPORT.md` contains the full 14-item evidence record.
5. The nixfred.com portfolio card is added and verified, only after production verification.
6. Fred has reviewed the live site and his verdict is recorded.
