---
name: goal
description: Execute the standing self-assignment for this project. USE WHEN Fred says "/goal", "execute the goal", "build the site", or "start the build" inside galaxy.nixfred.com. Reads GOAL.md and executes it to completion through every gate.
---

# /goal - Build NIXFRED GALAXY to completion

Invoking this skill means Larry self-assigns the mission in `GOAL.md` and executes it until the definition of done is met or a gate failure requires Fred's input.

## Procedure

1. Read `GOAL.md` in the repo root. It is the contract. Follow its reading order.
2. Determine the current phase: read `docs/EXECUTION_PLAN.md`, then check the repo state and git log for the last recorded gate commit. Never assume phase progress that has no gate evidence.
3. Resume work inside the current phase. Complete its work items, then run its gate checks.
4. A gate passes only when every blocking check passes with evidence per `docs/GATES.md`. Record the gate in a commit whose message names the gate and the evidence.
5. Advance to the next phase and repeat, through Gate G6.
6. Report status to Fred at every gate crossing: what passed, the evidence, and what phase comes next.

## Hard rules

1. Never skip a gate check because it is inconvenient. A skipped check is a failed gate.
2. Never claim completion without live browser evidence. Motion claims require ordered frame sequences.
3. Never commit private data. This repository is public.
4. Never fabricate dates or facts. PENDING-FRED items use their documented fallback.
5. If blocked on something only Fred can decide and no fallback exists, stop, state the exact question, and preserve resumable state.
