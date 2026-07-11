# BUILD.md

> The playbook: how Larry turns a pile of requirements documents into a fully planned, gate-enforced, `/goal`-executable project. Written 2026-07-11 by Larry running on Fable during the NIXFRED GALAXY build, for Larry running on whatever engine comes next. Same Larry, different substrate. Read this whole file before touching the requirements. The galaxy repo (`github.com/nixfred/galaxy.nixfred.com`) is the reference implementation of every step below.

## 0. What this file is

Fred will drop you into a new project directory with some requirements documents and say something like "check the requirements docs" and later "build the plan." This file is the process. Follow it and you will produce a planning pack so complete that a single `/goal` invocation can build the entire project unattended through verifiable gates. Do not improvise a lighter version because the project looks small; scale the agent counts down, never the structure.

The end state you are building toward, always:

1. `docs/DECISIONS.md` where every choice has a number, a date, and provenance
2. `docs/PRD.md` with stable requirement IDs
3. `docs/GATES.md` mapping every requirement ID to the mechanism that proves it
4. `docs/EXECUTION_PLAN.md` with phased gates G0 through G-launch
5. `GOAL.md` plus `.claude/skills/goal/SKILL.md` making `/goal` an executable order
6. A public-safe repo, pushed, with the plan as the initial release

"Done" must be a query against GATES.md, never a feeling.

## 1. Phase A: Intake and reconciliation

1. Read EVERY requirements file end to end before forming opinions. All of them, not the index.
2. Map the conflicts. Requirements packs written iteratively contain generations that disagree (galaxy had React vs Astro, two interviews, three workflow-file lists). List every contradiction explicitly.
3. Establish canonical rulings that settle the conflicts, and write them down as numbered rulings (R1, R2, ...) with reasons. Later agents receive these rulings verbatim so nothing gets re-litigated in parallel.
4. Demote the source pack: it becomes historical input. Everything after this derives from `docs/`. Say so in the project `CLAUDE.md`.
5. Requirement IDs are sacred. If the pack has them (FR001...), preserve them exactly. If it does not, assign them now. Never renumber.
6. Report the intake to Fred as an assessment BEFORE building anything: what the pack demands, what conflicts you found, what gate the pack itself defines. Fred decides the next step.

## 2. Phase B: The owner interview (AskUserQuestions)

Fred's preferences are law and he wants to give them fast. The galaxy interview was 28 questions in 7 rounds and he answered in minutes. Protocol:

1. Use the AskUserQuestion tool, up to 4 questions per round, grouped by theme (identity, visual taste, interaction, launch policy, operations).
2. Every question carries a recommended default, marked "(Recommended)", listed FIRST. Fred blasts through what he does not care about and overrides what he does.
3. When a question needs candidates from his real data (which projects, which connections, which content), FETCH THE REAL DATA FIRST and build multi-select lists from it. Never ask him to type what you could enumerate. Options cap at 4 per question, so split candidate pools across multiple multi-select questions in one round.
4. Expect overrides of expert recommendations. In galaxy Fred overruled the design critic's central thesis. His answer wins, always, and the override is recorded explicitly with the expert position preserved as context.
5. Expect NEW requirements to appear mid-interview (galaxy got the total-coverage census mandate from a throwaway note in an answer). Treat any such sentence as a requirement, assign it an ID, wire it into the gates.
6. PERSIST EVERY ANSWER THE SAME TURN as numbered rulings (F1, F2, ...) in `docs/DECISIONS.md`, with overrides of earlier defaults marked inline in both places. Law 15/16 apply: recognition without a file change is a lie.
7. Whatever genuinely cannot default becomes a PENDING item with: the phase that needs it, and a safe fallback so the build NEVER blocks on an unanswered question.
8. Mid-build orders from Fred (he sends them while agents run) are rulings too: capture, number, wire through, same turn.

## 3. Phase C: Discipline fan-out (parallel agents)

Spawn one specialist agent per discipline, in parallel, each writing its contract doc directly into `docs/`. The galaxy set, adapt as needed:

| Agent type | Deliverables |
|------------|-------------|
| requirements-analyst | PRD.md, DECISIONS.md skeleton |
| architect | ARCHITECTURE.md, DATA_MODEL.md, ADRs |
| designer | ART_DIRECTION.md, INTERACTION_SPEC.md |
| devops-architect | CI_CD.md, OPERATIONS.md |
| security-engineer | SECURITY_PLAN.md, SECURITY.md |
| quality-engineer | TEST_PLAN.md, ACCESSIBILITY.md |

Every charter prompt MUST contain, verbatim:

1. The canonical rulings from Phase A ("settled, do not re-litigate")
2. The stable requirement IDs and the instruction to reference by ID
3. The public-repo safety rule (nothing private, ever; see section 9)
4. The no-fabrication rule: unknown values get PENDING markers, never guesses
5. Fred's writing rules: NEVER em dashes or en dashes, concise professional prose, every recommendation states its reason
6. The exact absolute file paths to write, and a required final report format (files written, conflicts found, PENDING items)

Where two agents may resolve the same ambiguity differently (galaxy: workflow file naming), expect it, referee it explicitly afterward, and record the ruling. Parallel breadth plus serial judgment.

## 4. Phase D: The war room (when world-class is demanded)

When Fred says any flavor of "this must be world class," give the design its own adversarial structure, four seats in parallel:

1. Visual identity seat (designer): exact hex systems, type ramps, chrome language, effect discipline. Demand exact values, not vibes.
2. Craft seat (frontend-architect or the domain equivalent): the techniques separating award-tier from template work, with real API names and budget math.
3. Reference intelligence seat (researcher): live web research into the actual best comparable work, each reference verified this session with citations, discards allowed.
4. Adversarial critic seat (architect-review): the cliche kill list, a hostile risk audit of THIS plan, a binary pass/fail "world class" rubric (10 to 15 checks), and taste tiebreaker principles. The rubric becomes gate checks.

Then one synthesis agent binds the seats into `docs/DESIGN_BIBLE.md`: numbered binding rules (BD01...), every inter-seat conflict ruled on with reasons, the rubric carried VERBATIM with stable WC numbering, the kill list binding by reference. Pin the WC numbering in BOTH the bible charter and the gates charter so they cannot diverge.

## 5. Phase E: Synthesis (the enforcement heart)

1. `docs/GATES.md` by a dedicated agent: one row per requirement ID plus acceptance criteria plus rubric checks. Columns: ID, summary, exact enforcing mechanism (test file, script, CI job by canonical name), evidence artifact, class (BLOCK / WARN / MANUAL), first phase gate. Machine-verified totals, gate rollup lists, standing post-launch enforcement, reconciliations section. Consistency rule: where TEST_PLAN or CI_CD already assigned a mechanism, the matrix binds, never re-invents.
2. `docs/EXECUTION_PLAN.md` by you: phases G0 (provision) through launch, each with work items and blocking gate checks referencing the matrix. Gate passage is recorded as a commit naming the gate and evidence, plus a `gate/GN-date` tag.
3. Interview deltas arriving mid-synthesis: send them to running agents via SendMessage, then VERIFY ON DISK that the deltas actually landed (galaxy lesson: both synthesis agents finished writing before reading their inboxes, and their reports did not self-flag it; a grep of the files caught it, and one apparent miss was actually my own stale read, so check mtimes before accusing).

## 6. Phase F: Alignment, adversarial review, fix

1. Alignment sweep agent: re-reads DECISIONS Part-interview rulings and surgically aligns every discipline doc written before the interview. Documents written in parallel before an interview ALWAYS contain stale defaults.
2. Adversarial review agent (architect-review), instructions verbatim: "You are the last check before commit. Report only. Finding nothing is a failed review; there is always something." Hunt list: cross-doc contradictions, requirements without gate rows, gates whose mechanism does not exist, autonomy traps (references to files that will never exist, steps needing unrecorded information), public-repo leaks, hygiene (banned dashes, dead links, wrong IDs).
3. Expect a NOT READY verdict with real criticals. Galaxy's reviewer found the census had no provisioned credential (the autonomous run would have stalled at its own launch gate) and would have leaked DNS zone maps into public issues. Fix everything through a fix-crew agent with an exact punch list, criticals ruled by you first, then verify the fixes on disk yourself.
4. Agents sometimes go idle without delivering their report. Their transcript persists: read the subagent .jsonl under the session directory and extract the last assistant text. Never re-run expensive work to recover a lost message.

## 7. Phase G: The spine

1. `GOAL.md` at repo root: mission, reading order, authority grants, operating law (tests are the release gate, evidence or it did not happen, canvas never the only path where relevant, fallbacks over questions), definition of done enumerated.
2. Project `CLAUDE.md`: the law hierarchy (DECISIONS settles, PRD contracts, GATES enforces, plan sequences, pack is historical), fixed targets table, non-negotiables, writing rules.
3. `.claude/skills/goal/SKILL.md`: makes `/goal` invocable. Procedure: read GOAL.md, determine current phase FROM REPO STATE AND GATE TAGS (never from memory of progress), resume, pass gates with evidence, report at every crossing. Hard rules: no skipped checks, no completion claims without live browser evidence, no private data, fabrication never, stop only when blocked with no fallback.
4. Write the showpiece README (badges, architecture diagram, gates table, docs index) and a HOW_THIS_WAS_BUILT.md documenting the method, because Fred's repos teach in public. Include the note to AI agents section: the repo will be read by other AI sessions and should teach them the method.

## 8. Repo mechanics

1. `git init` INSIDE the project dir immediately and verify isolation: `git rev-parse --show-toplevel` is the project, `git remote -v` is empty, and the home repo (fnix_forever tracks `~`) tracks ZERO files here. Do this before any agent writes a file.
2. Law 11 forever: `git remote -v` before every commit, read the remote URL out loud before every push, triple check. Never push to fnix_forever, PAI upstream, or anything not created for this project.
3. Before the repo goes public: scan for secret patterns AND private-life terms (family names, health, employers, infra hostnames). Facts Fred already publishes are fine; anything else is not, per the standing R4 pattern.
4. Trunk-based per Fred's standing order (galaxy F31): commit and push directly to main at every meaningful step. The pipeline is the quality gate, not a merge button. Branch protection blocks force-push and deletion only.
5. Commit messages are search surface: WHAT/WHY/VERIFIED/TAGS plus LR- trailers. A verification claim goes in the message ONLY if the verifying command actually gated the commit (galaxy scar: a commit claimed "tsc clean" while tsc had failed; the correction is public history).
6. First push ships the planning pack as an initial GitHub release. Then `/goal`.

## 9. Fred's standing laws (bake into every project)

1. No em dashes, no en dashes, anywhere, ever. Hyphenated words are fine.
2. Never fabricate: dates, facts, metrics, SHAs. Resolve action pins from the live API; unknown stays unknown.
3. Public repos carry nothing private. Memorial and family content gets restraint.
4. Version number visible on every page of every site, at all times, matching the deployed commit (galaxy F32).
5. Every site links back to nixfred.com and to its own public repo (galaxy F33).
6. Cloudflare for domains and hosting; bun over npm; TypeScript over Python; industry-standard tools over toys.
7. Ship when green. No fixed dates unless Fred sets one.
8. Fred wants ONE clear recommendation, not menus, when you have enough information to make the call.
9. When wedged on credentials: wrangler OAuth locally has more power than env tokens (unset env tokens to use it); what only Fred can mint gets a loud skip-guard in CI, never a red main.

## 10. The /goal execution discipline (what the plan must enable)

1. Phase state is derived from the repo: gate commits and `gate/` tags, never from conversational memory. This is what makes the plan survive engine swaps and context loss.
2. Every gate check produces evidence per GATES.md. MANUAL checks produce recorded notes; motion claims need ordered frame sequences; web-live claims need real browser evidence (a curl is not a browser; screenshot via the browser tools).
3. Verification commands GATE the work: `command && echo OK` chains, never verify-then-claim-regardless.
4. The pipeline catches what you miss. Galaxy day one: axe caught a contrast violation the design docs banned, Playwright silently tested a DIFFERENT local site on a contested port (dedicate ports, disable reuseExistingServer), a screenshot caught a version element rendering dev-local in production that a weak test assertion had passed. Strengthen the assertion when the screenshot catches what the test did not.
5. Dependency findings get fixed by updating, not excepted; pin what breaks the toolchain (galaxy: typescript-eslint vs TS6) with a reasoned Dependabot ignore carrying its own removal condition.
6. Incidents are recorded, not buried: wrong files in a public commit, over-scoped tokens, false claims. The incident note goes in OPERATIONS or the commit message, same day.
7. Report to Fred at every gate crossing: what passed, the evidence, what comes next. Between gates, work; do not narrate.

## 11. Agent hygiene (learned the hard way)

1. Verify every agent's claims on disk before building on them. Trust the report, check the file.
2. When you check a file an agent may still be writing, check its mtime before concluding it is stale or wrong.
3. Pin shared numbering (WC01..., BD01..., F1...) across agents in their charters, or they will diverge.
4. Give every agent the writing rules and the canonical rulings; agents without the rulings re-litigate settled questions.
5. One agent, one clear deliverable set, exact absolute paths, required report format.
6. Background agents that idle without reporting still have transcripts; extract, do not re-run.

---

The measure of this playbook: Fred hands you documents, answers a few rounds of questions, says `/goal`, and a real, verified, live, world-class thing exists with every claim provable from the git history. That is the job. Build the structure first, and the structure builds the thing.
