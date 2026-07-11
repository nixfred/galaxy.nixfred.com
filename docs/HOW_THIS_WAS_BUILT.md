# How This Was Built

> The planning pack in this repository was produced in a single overnight session (2026-07-10 to 2026-07-11) by a structured multi-agent process orchestrated by Larry, Fred Nix's persistent AI engineering collaborator, running on Claude. This document records the method, because the method is half the point of making the repository public.

## The problem

Fred supplied a 15 file requirements pack for an ambitious product: an interactive star map of his complete body of work. The pack was thorough but had two overlapping generations of documents, a stack conflict (React versus Astro), two competing interviews, and no enforcement mechanism connecting requirements to proof. Handing that to a single AI session and saying "build it" is how projects end up 80 percent done and 100 percent unverified.

The order was different: first build the structure that makes the build provable, then let the build run inside that structure.

## The method

### Stage 1: Reconciliation

One session read all fifteen source files, identified the generational conflicts, and established canonical rulings: Astro wins, requirement IDs are stable, the professional file manifest is the canonical tree, the repository will be public so nothing private may enter it. The source pack was demoted to historical input; everything after this derives from `docs/`.

### Stage 2: Discipline fan-out (six agents in parallel)

Six specialist agents each owned a domain and wrote its contract simultaneously:

| Agent | Deliverables |
|-------|-------------|
| Requirements analyst | `PRD.md`, `DECISIONS.md` |
| Architect | `ARCHITECTURE.md`, `DATA_MODEL.md`, five ADRs |
| Designer | `ART_DIRECTION.md`, `INTERACTION_SPEC.md` |
| DevOps architect | `CI_CD.md`, `OPERATIONS.md` |
| Security engineer | `SECURITY_PLAN.md`, `SECURITY.md` |
| Quality engineer | `TEST_PLAN.md`, `ACCESSIBILITY.md` |

Each agent read the full source pack, received the canonical rulings so nothing got re-litigated, and wrote directly to the repository. Where two agents resolved the same conflict differently (the workflow file naming), the conflict was refereed explicitly and recorded as a ruling rather than left as silent drift.

### Stage 3: The design war room (four seats in parallel)

The owner demanded world class interface and graphics, so design got its own adversarial structure:

1. **Visual identity seat**: exact hex systems, typography ramps, chrome language, bloom discipline
2. **WebGL craft seat**: the rendering techniques that separate award tier Three.js work from stock demos, with bundle math
3. **Reference intelligence seat**: live web research into the actual best spatial web experiences (Google's 100,000 Stars, GitHub's globe, Active Theory, Bruno Simon), extracting transferable techniques with citations
4. **Adversarial critic seat**: a 34 item cliche kill list, a hostile risk audit of this very plan, and a 15 check binary rubric defining "world class" as something testable

### Stage 4: The owner's interview

Fred answered 28 preference questions covering content anchors, visual taste, motion, interaction, launch policy, and operations. Every answer became a numbered ruling (F1 onward) in `DECISIONS.md`, including four places where Fred overruled the experts. Two answers created new requirements on the spot: the total coverage mandate (every live nixfred web property appears on the map, census enforced) and rulings that reshaped interaction defaults. The rulings are supreme: where any document disagrees with an F ruling, the F ruling governs.

### Stage 5: Synthesis

Two agents bound the parallel work into law:

- `DESIGN_BIBLE.md`: 57 binding design rules synthesized from the four war room papers, with every inter-seat conflict ruled on and the reasoning recorded, carrying the critic's rubric verbatim as gate checks
- `GATES.md`: the enforcement matrix, one row per requirement, each row naming the exact test file, script, or workflow that proves it, the evidence artifact it produces, its enforcement class, and the phase gate where it must first pass

A consistency sweep then re-aligned every discipline doc with the interview rulings, because documents written in parallel before an interview inevitably contain pre-interview defaults.

### Stage 6: Adversarial review

A hostile reviewer read the entire assembled pack with one instruction: find what breaks the autonomous build. Its verdict was NOT READY, on two critical findings:

1. The domain census was a blocking launch gate with no provisioned credential: the unattended build would have stalled at its own finish line
2. The census would have enumerated full DNS zones into public GitHub issues: a private infrastructure leak into a public repository

Both were fixed (credentials provisioned end to end; the census privacy scoped by ruling so only public web properties are ever named), along with four major gate holes and nine hygiene defects. Only then was the pack committed.

### Stage 7: The self-assignment

`GOAL.md` plus a project skill make `/goal` an executable order: read the contract, find the current phase from gate evidence in the git history, work the phase, pass the gate with evidence, advance. The build that follows this document exists because that command was invoked.

## Why it works

1. **Decisions as law.** Every choice has one home (`DECISIONS.md`), a number, a date, and provenance. Nothing is re-decided by accident, and overrides are explicit.
2. **Requirements without gates are wishes.** The 203 row matrix means "done" is a query, not a feeling: which rows passed, where is the evidence.
3. **Parallel specialists, serial judgment.** Fan-out produces breadth fast; the conflicts it inevitably creates get refereed explicitly, on the record.
4. **Adversarial verification before commitment.** The reviewer is instructed that finding nothing is a failed review. It found real, build-breaking defects in a plan every other agent had signed off on.
5. **Evidence or it did not happen.** Motion is proven by ordered frame sequences, deployments by live domain checks, and a wedged verifier is a deferral, never a license to lower the bar.
6. **The repository is the showcase.** Trunk based pushes to `main`, an exact artifact deployment chain, rehearsed rollback, and a visible version number on the site at all times: the delivery discipline is itself a deliverable.

## Timeline

| When (Eastern) | What |
|----------------|------|
| 2026-07-10 late evening | Requirements pack read, conflicts mapped |
| 2026-07-11 ~00:00 | Discipline fan-out and war room launched, 10 agents in parallel |
| 2026-07-11 ~00:30 | Fred's 28 question interview, rulings recorded |
| 2026-07-11 ~01:00 | Synthesis: design bible and gates matrix |
| 2026-07-11 ~01:45 | Adversarial review: NOT READY, two criticals |
| 2026-07-11 ~02:00 | Fix pass, verification, first commits, this repository goes public |

Fifteen agents total: six discipline, four war room, two synthesis, one alignment sweep, one adversarial reviewer, one fix crew, orchestrated by one Larry.
