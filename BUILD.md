# BUILD.md

> Operating playbook for turning a requirements pack into a fully planned, gate enforced, `/goal` executable project. Read this file completely before editing requirements, creating project files, invoking agents, initializing external services, or writing application code.
>
> The NIXFRED GALAXY repository is the reference implementation. It is evidence, not authority. Project specific decisions recorded in the current repository always take precedence.
>
> Revision 3, 2026-07-11. Amended with lessons from the filter.nixfred.com build, per Fred's rulings: shared vocabulary pinning, history aware safety scans, an independent review fallback, charter by reference, a verification mode column, trimmed PRD fields, and a doc tree that scales to project size.

## 0. Mission and operating contract

Fred will place one or more requirements files in a project directory and ask you to assess, improve, plan, or build the project. Your job is to transform those inputs into a deterministic execution system that another capable coding agent can resume and complete from repository state alone.

Do not weaken the controls because a project appears small. Reduce the number of agents, documents, or implementation phases through the scaling rule in Section 2, and only when the same controls remain intact.

The required planning state is:

1. `docs/DECISIONS.md`
2. `docs/PRD.md`
3. `docs/GATES.md`
4. `docs/EXECUTION_PLAN.md`
5. `GOAL.md`
6. `CLAUDE.md`
7. `.claude/skills/goal/SKILL.md`
8. Supporting architecture, design, security, operations, and test documents appropriate to the project
9. A public safe repository with the planning pack committed, pushed, and released

The required implementation state is:

1. Every active requirement has a stable identifier.
2. Every active requirement has an acceptance condition.
3. Every acceptance condition has an enforcing mechanism.
4. Every enforcing mechanism has an evidence artifact.
5. Every blocking gate passes before launch.
6. The deployed system is verified through the real user path.
7. Repository history proves what was built, tested, released, and deployed.

`Done` is a successful query against `docs/GATES.md`. It is never a feeling, a screenshot alone, an agent report, or a green command that did not gate the commit.

## 1. Authority hierarchy

When sources disagree, use this order:

1. Fred's latest explicit instruction
2. `docs/DECISIONS.md`
3. `docs/PRD.md`
4. `docs/GATES.md`
5. `docs/EXECUTION_PLAN.md`
6. Discipline documents in `docs/`
7. `GOAL.md` and project `CLAUDE.md`
8. Original requirements files
9. Reference repositories and prior projects
10. Agent assumptions

Rules:

1. A newer numbered ruling may supersede an older ruling, but the older ruling remains in the record.
2. Superseded requirements remain traceable and are marked `SUPERSEDED`, not deleted or silently rewritten.
3. Original requirements files become historical input after reconciliation.
4. No agent may reopen a settled ruling unless new evidence creates a material conflict.
5. A material conflict must be recorded before implementation continues.

## 2. Required repository layout

Use this structure unless the project already has a compatible structure:

```text
.
├── BUILD.md
├── CLAUDE.md
├── GOAL.md
├── README.md
├── HOW_THIS_WAS_BUILT.md
├── docs/
│   ├── DECISIONS.md
│   ├── PRD.md
│   ├── GATES.md
│   ├── EXECUTION_PLAN.md
│   ├── ARCHITECTURE.md
│   ├── DATA_MODEL.md
│   ├── ART_DIRECTION.md
│   ├── INTERACTION_SPEC.md
│   ├── DESIGN_BIBLE.md
│   ├── CI_CD.md
│   ├── OPERATIONS.md
│   ├── SECURITY.md
│   ├── SECURITY_PLAN.md
│   ├── TEST_PLAN.md
│   ├── ACCESSIBILITY.md
│   ├── RISKS.md
│   ├── PENDING.md
│   └── evidence/
└── .claude/
    └── skills/
        └── goal/
            └── SKILL.md
```

Create only documents that apply, but never omit the seven required planning files listed in Section 0.

Scaling rule (Fred ruling, 2026-07-11): the seven required planning files are mandatory at every project size. Below roughly 40 active requirements, discipline documents may merge to reduce sprawl while keeping every duty covered: `SECURITY.md` duties may fold into `SECURITY_PLAN.md`, `DATA_MODEL.md` into `ARCHITECTURE.md`, `OPERATIONS.md` into `CI_CD.md`. Record any merge as a ruling in `docs/DECISIONS.md` so gates and charters reference the surviving file.

Process provenance artifacts (the intake report, specialist charters, adversarial review records, and a build narrative if one is written) live under `docs/evidence/planning/`, not in top level `docs/`. `HOW_THIS_WAS_BUILT.md` is optional. `DESIGN_BIBLE.md` exists only when Phase D runs.

## 3. Phase A: Repository safety and intake

### 3.1 Establish repository isolation

Before any agent writes files:

1. Confirm the current project directory.
2. Initialize Git inside that directory if needed.
3. Confirm the repository root is the project directory.
4. Confirm no inherited or unintended remote exists.
5. Confirm no parent or home repository tracks files in this project.
6. Record the result in the intake report.

Minimum commands:

```bash
pwd
git init
git rev-parse --show-toplevel
git remote -v
git status --short
```

Do not commit or push until the remote destination has been explicitly verified.

### 3.2 Build a source inventory

Read every requirements file completely before forming conclusions. Do not rely on an index, summary, filename, prior conversation, or agent report.

Create a source inventory containing:

1. Absolute or repository relative path
2. File type
3. Apparent purpose
4. Requirement identifiers found
5. Decisions found
6. Conflicts found
7. Unknowns found
8. Privacy or secret exposure risk
9. Whether the source is current, superseded, duplicated, or unclear

### 3.3 Reconcile contradictions

Create a conflict ledger before producing the PRD. For every contradiction, record:

1. Conflict identifier
2. Sources involved
3. Exact competing positions
4. Impact if unresolved
5. Recommended ruling
6. Final ruling
7. Reason
8. Requirement IDs affected

Write final intake rulings as `R001`, `R002`, and so on in `docs/DECISIONS.md`.

### 3.4 Preserve requirement identity

If requirement IDs already exist, preserve them exactly.

If they do not exist, assign stable IDs using these classes where applicable:

| Prefix | Class |
|---|---|
| `BR` | Business requirement |
| `FR` | Functional requirement |
| `NFR` | Nonfunctional requirement |
| `UX` | User experience requirement |
| `SEC` | Security requirement |
| `OPS` | Operations requirement |
| `DATA` | Data requirement |
| `INT` | Integration requirement |
| `ACC` | Accessibility requirement |
| `REL` | Release requirement |

Use fixed width numbering such as `FR001`. Never renumber an assigned requirement. New requirements receive new IDs.

### 3.5 Produce the intake assessment

Before planning or implementation, report:

1. What the requirements pack asks the project to accomplish
2. The major user journeys
3. The canonical technology and deployment assumptions
4. Contradictions and recommended rulings
5. Missing decisions
6. Security and privacy risks
7. Existing acceptance criteria
8. The proposed gate model
9. Whether the pack is ready for owner interview

Do not begin application construction during intake.

## 4. Phase B: Owner interview

Fred's explicit choices are binding. The interview exists to resolve decisions that materially affect scope, design, operation, cost, launch, or long term maintenance.

### 4.1 Interview protocol

1. Ask no more than four questions per round.
2. Group questions by theme.
3. Put the recommended option first and label it `(Recommended)`.
4. State the reason for the recommendation in one sentence.
5. Use concrete choices, not open ended prompts, when the candidate set can be discovered.
6. Fetch real project data before asking Fred to select from projects, files, domains, integrations, content, or existing assets.
7. Do not ask Fred to repeat information already provided.
8. Do not block the build on a preference that has a safe, reversible default.

Suggested interview themes:

1. Identity and audience
2. Scope and user journeys
3. Visual direction
4. Interaction behavior
5. Content and data sources
6. Security and privacy
7. Hosting and deployment
8. Analytics and operations
9. Launch policy
10. Post launch ownership

### 4.2 Persist answers immediately

Write every answer to `docs/DECISIONS.md` in the same work cycle using `F001`, `F002`, and so on.

Each ruling must contain:

1. Date
2. Source or provenance
3. Decision
4. Reason
5. Requirements affected
6. Documents affected
7. Whether it overrides an earlier ruling

Recognition without a file change is not persistence.

### 4.3 New requirements discovered during discussion

Any statement that changes expected behavior, scope, constraints, launch criteria, or operations is a requirement candidate.

For each candidate:

1. Assign a new requirement ID.
2. Add it to the PRD.
3. Add or update its gate row.
4. Update affected discipline documents.
5. Record the originating ruling.
6. Add implementation work to the execution plan.

### 4.4 Pending decisions

Use `PENDING` only when a decision cannot be safely inferred or deferred.

Every pending item must include:

1. Pending identifier
2. Decision needed
3. Owner
4. Deadline gate
5. Safe fallback
6. Impact of the fallback
7. Requirement IDs affected
8. Resolution status

Store the full list in `docs/PENDING.md`. Duplicate only the necessary summary in other documents.

A pending decision may not silently block `/goal`. The fallback must be executable unless Fred explicitly requires a hard stop.

## 5. Phase C: Specialist planning

Use parallel specialists when the project benefits from independent discipline depth. Use fewer agents for small projects, but preserve independent review of requirements, architecture, delivery, security, and quality.

### 5.1 Standard specialist set

| Specialist | Required deliverables |
|---|---|
| Requirements analyst | `docs/PRD.md`, initial `docs/DECISIONS.md` structure |
| Architect | `docs/ARCHITECTURE.md`, `docs/DATA_MODEL.md`, ADRs when needed |
| Product designer | `docs/ART_DIRECTION.md`, `docs/INTERACTION_SPEC.md` |
| DevOps architect | `docs/CI_CD.md`, `docs/OPERATIONS.md` |
| Security engineer | `docs/SECURITY_PLAN.md`, `docs/SECURITY.md` |
| Quality engineer | `docs/TEST_PLAN.md`, `docs/ACCESSIBILITY.md` |
| Risk reviewer | `docs/RISKS.md` or a review report |

### 5.2 Mandatory agent charter contents

Every specialist charter must include:

1. Mission and exact deliverables
2. Exact absolute output paths
3. Canonical rulings, binding on the specialist
4. Stable requirement IDs
5. Authority hierarchy
6. Public repository safety rule
7. No fabrication rule
8. Pending item format
9. Writing rules
10. Required cross document references
11. Required final report format
12. Instruction not to modify files outside assigned scope

Charter by reference (proven on the filter build): when specialists share a filesystem, write one common charter file the whole fan out must read first, and have specialists read canonical rulings directly from `docs/DECISIONS.md` instead of duplicating them into every charter. The no drift intent is preserved because every agent reads the same canonical text. Per agent prompts then carry only mission, deliverables, and discipline specific guidance.

Required report format:

```text
FILES WRITTEN
CONFLICTS FOUND
PENDING ITEMS
REQUIREMENTS COVERED
REQUIREMENTS NOT COVERED
ASSUMPTIONS MADE
VALIDATION PERFORMED
```

### 5.3 Parallel work rules

1. Parallel agents may propose, but they do not settle cross discipline conflicts.
2. Shared numbering systems AND shared vocabulary must be assigned before fan out: requirement IDs, CI job names, npm script names, test tree paths, and evidence naming. Any name two documents must share by Section 8.3 gets pinned in the common charter first, or parallel specialists will invent divergent names and gate reconciliation will fail.
3. Every reported change must be verified on disk.
4. Check modification times before concluding that a running agent ignored an update.
5. Send new owner rulings to active agents immediately. Relay only facts that already exist on disk; if you must reference a name or file another agent has not yet finalized, mark it provisional and send a correction once the real name lands.
6. Recheck affected files after agents finish.
7. Never accept a specialist report as evidence that the file is correct.

## 6. Phase D: World class design war room

Run this phase when Fred asks for world class, award quality, flagship, showpiece, unforgettable, category leading, or equivalent quality.

Create four independent seats:

### 6.1 Visual identity seat

Define exact values and rules for:

1. Color system
2. Typography scale
3. Spacing rhythm
4. Surface and chrome language
5. Illustration or visualization language
6. Motion character
7. Effect limits
8. Responsive behavior
9. Accessibility constraints

Demand exact values, not mood language alone.

### 6.2 Craft seat

Define the implementation techniques that separate exceptional work from template output. Include:

1. Concrete APIs and libraries
2. Rendering strategy
3. Performance budgets
4. Animation budgets
5. Progressive enhancement
6. Browser constraints
7. Mobile behavior
8. Failure modes and fallbacks

### 6.3 Reference intelligence seat

Research real comparable work during the current session.

For each reference:

1. Verify that it exists.
2. Record the source.
3. Identify the specific lesson.
4. Identify what must not be copied.
5. Discard weak or irrelevant references.

### 6.4 Adversarial critic seat

Produce:

1. Project specific cliche kill list
2. Hostile risk audit
3. Binary world class rubric containing 10 to 15 checks
4. Taste tiebreaker principles
5. Reasons the current concept could fail

Assign stable rubric IDs such as `WC01`.

### 6.5 Design synthesis

A synthesis owner writes `docs/DESIGN_BIBLE.md` containing:

1. Binding design rules `BD01` and onward
2. Every inter seat conflict and ruling
3. The world class rubric copied without renumbering
4. The cliche kill list as binding constraints
5. Requirement references
6. Test and evidence expectations

Pin `WC` and `BD` numbering in both the design charter and gate charter.

## 7. Phase E: Requirements contract

`docs/PRD.md` is the contractual description of what must be built. It is not a marketing document or implementation diary.

Every active requirement entry must contain:

1. Stable ID
2. Title
3. Requirement statement
4. Reason or business value
5. Source or ruling
6. Acceptance criteria
7. Dependencies
8. Gate class
9. First required phase
10. Status

Priority and per requirement Risks fields were removed as mandatory by Fred's ruling of 2026-07-11: priority restates gate class, and requirement level risk blurbs duplicate `docs/RISKS.md` as filler. Either may still appear on an entry where it genuinely adds information.

Recommended status values:

1. `ACTIVE`
2. `PENDING`
3. `DEFERRED`
4. `SUPERSEDED`
5. `VERIFIED`

Acceptance criteria must be observable and testable. Avoid words such as intuitive, fast, modern, seamless, robust, secure, or responsive unless a measurable definition follows.

## 8. Phase F: Gate matrix

`docs/GATES.md` is the enforcement heart of the project.

### 8.1 Required row schema

Create one row for every active requirement and every binding rubric check.

| Field | Meaning |
|---|---|
| ID | Requirement or rubric ID |
| Summary | Compact statement |
| Acceptance condition | Exact observable pass condition |
| Mechanism | Test file, script, CI job, query, manual protocol, or browser path |
| Evidence | Artifact proving the result |
| Class | `BLOCK` or `WARN`: the consequence of failure |
| Mode | `AUTO` or `MANUAL`: how the mechanism is exercised |
| First gate | Earliest gate where it must pass |
| Standing enforcement | Whether it continues after launch |
| Owner | Discipline responsible |
| Status | Current state |

### 8.2 Gate class and mode definitions

Class states the consequence, mode states the method. They are orthogonal: a blocking check can be verified by a human, and an advisory check can be automated.

1. `BLOCK`: Failure prevents gate passage, release, or launch.
2. `WARN`: Failure is recorded and visible but does not stop the current gate.
3. `AUTO`: The mechanism is a test, script, or CI job that runs without human judgment.
4. `MANUAL`: Human observation is required using a written protocol and retained evidence.

Manual does not mean informal. A manual check needs steps, expected results, reviewer, date, and stored evidence. Legacy matrices that used `MANUAL` as a class value (the filter build's GATES.md among them) are read as class `BLOCK` with mode `MANUAL`; do not renumber or rewrite them retroactively.

### 8.3 Gate quality rules

1. Every active PRD requirement has exactly one canonical gate row.
2. Supporting checks may reference the canonical row.
3. Every mechanism must exist or be provisioned in an earlier phase.
4. Every evidence path must be writable and retained.
5. CI job names must match `docs/CI_CD.md` exactly.
6. Test file names must match `docs/TEST_PLAN.md` exactly.
7. No gate may depend on undocumented credentials, private knowledge, unavailable services, or uncreated files.
8. The matrix must include totals and reconciliation checks.
9. Standing post launch checks must be identified.
10. A machine readable companion file is encouraged when practical, such as `docs/gates.json`.

### 8.4 Required reconciliation checks

At minimum, verify:

1. Active PRD requirement count equals canonical requirement gate count.
2. Every `BLOCK` row belongs to at least one phase gate.
3. Every phase gate references only existing IDs.
4. Every mechanism references an existing or explicitly provisioned file, job, service, or procedure.
5. Every evidence artifact has a retention location.
6. Every pending credential or decision has a fallback or hard stop ruling.

## 9. Phase G: Execution plan

`docs/EXECUTION_PLAN.md` sequences the work. It must not duplicate the PRD or gate matrix.

Use phases beginning with `G0` and ending with `G-LAUNCH`. Adapt the middle phases to the project.

Recommended sequence:

1. `G0` Repository, accounts, credentials, and safety
2. `G1` Project skeleton and toolchain
3. `G2` Core architecture and data contracts
4. `G3` Primary user journey
5. `G4` Remaining features and content
6. `G5` Design refinement and accessibility
7. `G6` Security, privacy, operations, and observability
8. `G7` Full validation and release candidate
9. `G-LAUNCH` Production deployment and live verification
10. `G-POST` Standing checks and maintenance handoff

Every phase must include:

1. Objective
2. Entry conditions
3. Work items
4. Requirements implemented
5. Required commands
6. Required evidence
7. Blocking gate IDs
8. Rollback or recovery plan
9. Exit conditions
10. Commit and tag convention

State the cumulative count of blocking and manual gate rows that must be passing by each phase exit, consistent with every row's first gate. This gives a resuming `/goal` session a one line sanity check per phase.

Gate passage is recorded through:

1. A commit that identifies the gate
2. Evidence paths in the commit message or repository
3. A tag using `gate/GN-YYYYMMDD`
4. A pushed tag
5. A short gate report to Fred

Do not create a gate tag until every blocking check has passed in the current repository state.

## 10. Phase H: Alignment and adversarial review

### 10.1 Alignment sweep

After interview and specialist planning, re read all owner rulings and align every discipline document.

Look for:

1. Stale defaults
2. Superseded technology choices
3. Conflicting terminology
4. Missing requirement references
5. Inconsistent file or CI job names
6. Unresolved pending items
7. Launch criteria that do not match the PRD

### 10.2 Adversarial review

Use this instruction:

> You are the last check before the planning pack is committed. Report only. Finding nothing is a failed review. Search for material defects, contradictions, missing enforcement, autonomy traps, privacy risks, and false claims.

Required hunt list:

1. Cross document contradictions
2. Requirements without canonical gate rows
3. Gates without real mechanisms
4. Mechanisms without evidence
5. Missing credentials or service provisioning
6. Steps requiring unrecorded human knowledge
7. Public repository leaks
8. Secret exposure
9. Dead links
10. Wrong identifiers
11. Stale filenames
12. Banned punctuation
13. Unbounded scope
14. Weak or subjective acceptance criteria
15. False verification claims
16. Launch paths that cannot be exercised from a clean environment

Fallback when independence is impossible (proven necessary on the filter build when subagent spawning failed on a spend limit): the orchestrator may execute the full hunt list inline, with scripted verification wherever a check can be scripted. The review artifact must then record the independence limitation explicitly, and the review is flagged rerunnable by a fresh independent agent on Fred's order. Never fake independence and never hard stop the project solely because a separate reviewer cannot be spawned.

The review verdict must be one of:

1. `READY`
2. `NOT READY`

`NOT READY` findings must include severity, affected files, affected IDs, exact remediation, and verification method.

### 10.3 Fix and verify

1. Rule on critical findings before delegating fixes.
2. Give a fix agent an exact punch list.
3. Verify every fix on disk.
4. Re run reconciliation checks.
5. Re run the adversarial review or a targeted closure review.
6. Do not accept `READY` until critical and high findings are closed or explicitly accepted by Fred.

## 11. Phase I: Execution spine

### 11.1 `GOAL.md`

`GOAL.md` must define:

1. Mission
2. Reading order
3. Authority hierarchy
4. Fixed project targets
5. Operating laws
6. Phase model
7. Gate crossing protocol
8. Evidence rules
9. Reporting rules
10. Recovery behavior
11. Definition of done
12. Conditions that permit stopping

### 11.2 Project `CLAUDE.md`

Project `CLAUDE.md` must state:

1. The source pack is historical input
2. `DECISIONS` settles choices
3. `PRD` defines obligations
4. `GATES` defines proof
5. `EXECUTION_PLAN` defines order
6. `GOAL` defines autonomous operation
7. Fixed technologies and services
8. Repository safety rules
9. Writing rules
10. Test and evidence expectations
11. Prohibited behavior

### 11.3 `.claude/skills/goal/SKILL.md`

The skill must instruct `/goal` to:

1. Read `GOAL.md` and the authority documents.
2. Determine current phase from repository state, commits, tags, and evidence.
3. Never rely on conversational memory for progress.
4. Resume the first incomplete phase.
5. Execute work in requirement and gate order.
6. Run checks as blocking command chains.
7. Store required evidence.
8. Commit only verified work.
9. Tag only passed gates.
10. Report at every gate crossing.
11. Continue until the definition of done is satisfied.
12. Stop only for a true hard block with no documented fallback.

Hard rules:

1. No skipped checks
2. No fabricated facts, dates, metrics, SHAs, or evidence
3. No private data in public artifacts
4. No completion claim without real user path verification
5. No silent exception of failed dependencies or tests
6. No reliance on files or credentials that have not been provisioned
7. No destructive external action without explicit authority

## 12. Repository and release mechanics

### 12.1 Remote verification

Before every commit that may be pushed:

```bash
git rev-parse --show-toplevel
git remote -v
git status --short
```

Before every push, state and verify the exact remote URL and branch.

Never push to:

1. A home directory repository
2. `fnix_forever`
3. A framework upstream
4. A reference implementation repository
5. Any repository not created or explicitly selected for the current project

### 12.2 Public safety scan

Before the first public push and every release, scan for:

1. API keys
2. Tokens
3. Passwords
4. Private keys
5. Internal hostnames
6. Private IP addresses when sensitive
7. Customer confidential information
8. Family information
9. Health information
10. Personal addresses or phone numbers
11. Private email addresses not intended for publication
12. Local filesystem paths containing usernames
13. Debug dumps
14. Environment files
15. DNS zone exports

Public facts Fred already publishes may remain when relevant. Everything else requires explicit justification.

The scan covers the FULL git history, not only the working tree. Before the first public push, scan every commit (`git log -p | grep` for the sensitive patterns, or scan each commit's tree); a file sanitized in a later commit still leaks through history. This rule exists because the filter build shipped a local path inside its root commit while the working tree scan passed, and the history had to be rewritten. Intake artifacts destined for the public repository follow the public writing rules from their first line: describe local paths generically, never literally.

### 12.3 Commit discipline

Commit directly to `main` when that is the recorded project policy.

Commit messages should make history searchable and auditable. Include:

1. `WHAT`
2. `WHY`
3. `VERIFIED`
4. `EVIDENCE`
5. `TAGS`
6. Requirement or ruling trailers when applicable

A verification claim may appear only when the exact command succeeded and gated the commit.

### 12.4 Initial release

The first push should contain the reconciled planning pack, not unfinished application code.

Create an initial release that identifies:

1. Planning version
2. Canonical requirements count
3. Blocking gate count
4. Pending decision count
5. Current execution phase
6. How to invoke `/goal`

Then begin implementation through `/goal`.

## 13. Standing project laws

Bake these rules into every project unless Fred explicitly changes them:

1. No em dash or en dash characters anywhere.
2. Hyphenated technical terms, filenames, command flags, and identifiers are allowed.
3. Never fabricate dates, facts, metrics, citations, SHAs, test results, screenshots, or deployment state.
4. Unknown values remain unknown until resolved.
5. Public repositories contain no private material.
6. Every deployed page displays a version identifier tied to the deployed commit.
7. Every public site links to `nixfred.com` and its own public repository.
8. Cloudflare is the default domain and hosting platform.
9. Bun is preferred over npm.
10. TypeScript is preferred over Python for application code.
11. Industry standard tools are preferred over novelty tools.
12. Ship when green. Do not invent fixed dates.
13. Give Fred one clear recommendation when the evidence supports one.
14. Use a documented fallback instead of blocking on a reversible preference.
15. When local Wrangler OAuth is required, avoid masking it with a weaker environment token.
16. Credentials Fred alone can create receive an explicit CI skip guard and a visible pending item unless Fred orders a hard block.
17. Destructive actions, production data deletion, domain transfer, billing changes, and credential rotation require explicit authority.

## 14. `/goal` execution discipline

1. Derive phase state from repository evidence, never conversation memory.
2. Run verification as a blocking command chain.
3. Store evidence under documented paths.
4. Use dedicated test ports.
5. Disable server reuse when reuse could target the wrong application.
6. Test production behavior separately from development behavior.
7. Validate visible commit versioning in the deployed build.
8. Use real browser verification for web claims.
9. Use ordered frames or video evidence for motion claims.
10. Use written review records for manual checks.
11. Fix dependency findings through upgrades or documented temporary pins.
12. Every temporary pin or ignore needs a reason and removal condition.
13. Record incidents the same day in `docs/OPERATIONS.md` or the correcting commit.
14. Strengthen automated assertions when manual evidence reveals a defect that tests missed.
15. Report only at gate crossings unless Fred asks for more frequent updates.

A `curl` response proves network reachability. It does not prove browser behavior, visual correctness, interaction, accessibility, or production rendering.

## 15. Evidence standards

Evidence must be reproducible, attributable, and tied to the tested commit.

Recommended evidence forms:

| Claim | Minimum evidence |
|---|---|
| Unit behavior | Test output and test file |
| Build success | Build log tied to commit |
| Type safety | Type checker output |
| Lint compliance | Lint output |
| Accessibility | Automated report plus manual protocol where needed |
| Responsive layout | Browser screenshots at defined viewport sizes |
| Motion behavior | Ordered frames or captured video |
| Live deployment | Production URL, deployed commit, browser screenshot |
| Security control | Test, configuration proof, or documented review |
| Data migration | Counts, checksums, reconciliation report |
| Performance | Repeatable measurement, environment, thresholds |
| Manual approval | Reviewer, date, procedure, result, artifact |

Evidence filenames should include the gate, check ID, and commit when practical.

## 16. Recovery and autonomy rules

### 16.1 Lost or idle agent output

If a background agent stops without returning its report:

1. Check whether its files were written.
2. Inspect modification times.
3. Read its persisted transcript if available.
4. Recover the last useful report.
5. Do not rerun expensive work unless the output is genuinely missing or unusable.

### 16.2 Failed verification

When a check fails:

1. Record the failure.
2. Identify whether the defect is implementation, test, environment, dependency, or requirement ambiguity.
3. Fix the root cause.
4. Rerun the failed check.
5. Rerun dependent checks.
6. Update evidence.
7. Do not commit a false success claim.

### 16.3 True hard blocks

A true hard block exists only when:

1. A required external credential, legal approval, payment, domain action, or owner decision is unavailable.
2. No safe fallback exists.
3. The affected gate is blocking.
4. The block is recorded with exact resolution steps.

When blocked, report:

1. What is blocked
2. Why it is blocked
3. Requirement and gate IDs
4. What has already been completed
5. Exact owner action required
6. Safe state of the repository
7. The first command or phase to resume afterward

## 17. Definition of planning complete

Planning is complete only when:

1. Every source file has been inventoried.
2. Every contradiction has a ruling or pending item.
3. Every active requirement has a stable ID.
4. Every active requirement has measurable acceptance criteria.
5. Every active requirement has one canonical gate row.
6. Every blocking mechanism exists or is provisioned earlier.
7. Every gate has an evidence definition.
8. Every pending item has an owner, deadline gate, and fallback.
9. Discipline documents agree with owner rulings.
10. Adversarial review returns `READY`.
11. Public safety scan passes.
12. `GOAL.md`, `CLAUDE.md`, and the `/goal` skill agree.
13. The planning pack is committed, pushed, and released.

## 18. Definition of project complete

The project is complete only when:

1. Every blocking requirement is verified.
2. Every required warning is recorded and accepted.
3. Every manual check has retained evidence.
4. Every gate through `G-LAUNCH` has a passing commit and tag.
5. The production system is reachable through its real public path.
6. Primary user journeys pass in a real browser.
7. Security, accessibility, performance, and operational checks meet their thresholds.
8. The visible version matches the deployed commit.
9. Public repository scans pass.
10. Documentation reflects the shipped system.
11. Rollback and recovery instructions are tested or explicitly verified.
12. The final release identifies the deployed commit and evidence set.
13. `docs/GATES.md` contains no unresolved blocking row.

## 19. Final measure

The playbook succeeds when Fred can provide requirements, answer a compact set of material questions, invoke `/goal`, and receive a real, live, verified project whose claims can be proven from repository state, test evidence, release history, and production behavior.

Build the enforcement structure first. The structure must make correct execution easier than improvisation.
