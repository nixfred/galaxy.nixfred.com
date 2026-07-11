# CI/CD Delivery Contract

NIXFRED GALAXY, `galaxy.nixfred.com`. This document is the authoritative delivery contract for the GitHub Actions automation that validates, previews, ships, verifies, and recovers the production site. It reconciles `galaxy_requirements_pack/04_CICD_REQUIREMENTS.md` (the CI/CD contract), `05_PROFESSIONAL_FILE_MANIFEST.md` (the file manifest), and `03_ARCHITECTURE_AND_FILES.md` (the architecture plan) into one canonical workflow set, then specifies each workflow precisely enough for the implementing session to build the YAML without guessing.

Requirement identifiers are stable and are referenced by ID throughout: `SR001` to `SR010` (security requirements in `02_PRODUCT_AND_FUNCTIONAL_REQUIREMENTS_DRAFT.md`), `AC040` to `AC058` (acceptance matrix in `06_ACCEPTANCE_MATRIX.md`), the 14 item deployment evidence list in `04_CICD_REQUIREMENTS.md`, and the interview answers `Q1` to `Q80` in `01_INTERVIEW.md`.

## 1. Fixed delivery facts

| Property | Value | Source |
|----------|-------|--------|
| Source repository | `nixfred/galaxy.nixfred.com`, public | `Q63`, execution directive |
| Automation system | GitHub Actions | `04` delivery architecture |
| Deploy tool | Wrangler Direct Upload, never Pages git integration | `Q67`, execution directive |
| Cloudflare Pages project | `galaxy-nixfred-com` | execution directive |
| Production branch | `main` | execution directive |
| Build output directory | `dist` | execution directive |
| Production domain | `galaxy.nixfred.com` | `04` delivery architecture |
| CI runtime | Bun, pinned in `.bun-version` | manifest, `Q` stack decision |
| Upstream catalog | `nixfred/nixfred.github.io/portfolio.json` | `Q49`, `Q51` |

## 2. Canonical workflow set

The requirements pack contains two conflicting file lists. This section resolves them.

`04_CICD_REQUIREMENTS.md` mandates five workflows by name and behavior: `ci.yml`, `preview.yml`, `production.yml`, `rollback.yml`, `scheduled_checks.yml`. `03_ARCHITECTURE_AND_FILES.md` lists the same five. `05_PROFESSIONAL_FILE_MANIFEST.md` instead lists `ci.yml`, `preview.yml`, `deploy.yml`, `sync-catalog.yml`, `security.yml`, which renames production, drops rollback and scheduled checks, and adds catalog sync and static analysis.

The reconciliation rule is that `04_CICD_REQUIREMENTS.md` is authoritative for CI/CD because it is the CI/CD contract, and its `production.yml` and `rollback.yml` behaviors are mandatory. The two genuinely additional concerns introduced by the manifest, weekly catalog sync (`Q51`) and static analysis plus dependency scanning (`04` GitHub Actions security items 8 and 9, `SR008`, `SR009`), are real requirements that deserve their own least privilege workflows rather than being folded into a workflow with a different permission profile. The canonical set is therefore the union of the mandatory five plus the two additional concerns, for seven workflows:

| # | Workflow | Responsibility | Reason it is separate |
|---|----------|----------------|-----------------------|
| 1 | `ci.yml` | Validate and build. Produces the single tested artifact. | Runs on untrusted fork code, so it must hold read only permissions and no secrets. |
| 2 | `preview.yml` | Deploy the validated artifact as an isolated preview and verify it live. | Needs deploy secrets and pull request write, a different permission profile than `ci.yml`. |
| 3 | `production.yml` | Deploy the validated artifact to production, verify the custom domain, record evidence, auto rollback on failure. | Highest privilege. Bound to the `production` environment and to `main` only. |
| 4 | `rollback.yml` | Manual, auditable recovery to a prior healthy production deployment. | Human triggered recovery must be separate from the deploy path for a clean audit trail. |
| 5 | `scheduled_checks.yml` | Scheduled health checks of domain, assets, links, catalog, thumbnails, external hosts, and the DR011 coverage census. Opens issues on actionable failure. | Monitoring cadence and `issues: write` only, no deploy rights. |
| 6 | `security.yml` | CodeQL static analysis and dependency review or scan. | Needs `security-events: write`, an elevated scope kept out of `ci.yml`. |
| 7 | `sync-catalog.yml` | Weekly upstream snapshot refresh that opens a change report pull request. | Content update cadence, opens a PR with `contents: write` plus `pull-requests: write`, distinct from monitoring. |

### 2.1 Manifest deviation, stated explicitly

The implementation deviates from `05_PROFESSIONAL_FILE_MANIFEST.md` in three intentional ways, each recorded here and in `docs/DECISIONS.md`:

1. The manifest file `deploy.yml` is delivered under the mandatory name `production.yml`, because `04` requires that name and its 15 numbered production behaviors.
2. `rollback.yml` and `scheduled_checks.yml`, absent from the manifest, are added because `04` makes them mandatory and the acceptance matrix depends on them (`AC051`, `AC052`).
3. `security.yml` and `sync-catalog.yml` from the manifest are retained as dedicated workflows rather than merged into `ci.yml` or `scheduled_checks.yml`, because their permission scopes and outputs (a code scanning alert, a pull request) differ from those workflows and least privilege forbids widening an existing job to cover them.

## 3. Shared conventions

These conventions apply to every workflow. They exist once here so the per workflow sections stay short.

### 3.1 Least privilege permissions

Every workflow declares `permissions: {}` at the top level to remove all default grants, then each job re-grants only the scopes it uses (`04` GitHub Actions security item 1, `SR002`, `AC040`). No job receives `write` on a scope it does not exercise. The exact per job grants are listed in each workflow section and summarized in section 11.

### 3.2 Third party action pinning

Every third party action is pinned to a full length immutable commit SHA, annotated with the human readable release, for example `oven-sh/setup-bun@<40charSHA> # v2.0.2` (`Q78`, `04` security item 2, `SR009`, `AC044`). Actions published by GitHub itself (`actions/*`, `github/codeql-action`) are pinned the same way for uniformity. The pinned SHAs are resolved at wiring time by the implementing session and are recorded in `docs/DECISIONS.md`. Dependabot keeps them current (section 3.8). The action inventory to pin is: `actions/checkout`, `oven-sh/setup-bun`, `actions/upload-artifact`, `actions/download-artifact`, `actions/github-script`, `cloudflare/wrangler-action`, `github/codeql-action` (init, analyze), and `actions/dependency-review-action`.

### 3.3 Concurrency

| Workflow | Group | Cancel in progress | Reason |
|----------|-------|--------------------|--------|
| `ci.yml` | `ci-${{ github.ref }}` | true for pull requests, false for `main` | Cancel superseded PR runs to save minutes. Never cancel a `main` validation that a production deploy depends on. |
| `preview.yml` | `preview-${{ pr number }}` | true | Only the latest commit on a PR needs a live preview. |
| `production.yml` | `production-deploy` | false | A production deploy must finish or roll back. It is never cancelled mid flight. |
| `rollback.yml` | `production-deploy` | false | Shares the production serialization group so a manual rollback and a deploy cannot race the live environment. |
| `scheduled_checks.yml` | `scheduled-checks` | true | Only the newest health snapshot matters. |
| `sync-catalog.yml` | `catalog-sync` | true | Only the newest upstream snapshot matters. |
| `security.yml` | `security-${{ github.ref }}` | true | Latest scan per ref is sufficient. |

### 3.4 GitHub environments

Two environments gate secret access by deployment stage (`04` production item 1 and 2, secrets item 1):

- `production`. Holds the production Cloudflare secrets. Deployment branch policy restricts it to `main` only, so no branch or fork can reach production secrets. Required reviewers are intentionally empty, because `Q68` rules that the automated quality gates are the approval and `AC048` requires that merging to `main` deploys without a permission prompt. Referenced by `production.yml` and `rollback.yml`.
- `preview`. Holds the same or a preview scoped Cloudflare token used to publish preview deployments. Referenced by `preview.yml`. Fork triggered runs never receive these secrets (section 4.2), which satisfies "do not expose production credentials to untrusted fork execution" (`04` preview item 8, secrets item 6, `SR003`).

### 3.5 Secrets and variables

Secrets, stored in the environments above, never in files, never echoed (`04` secrets items 4 and 5, `AC040`):

| Secret | Scope | Used by |
|--------|-------|---------|
| `CLOUDFLARE_API_TOKEN` | Account, Cloudflare Pages, Edit. Nothing more. This covers Direct Upload, deployment listing, the rollback API, and Pages custom domain management. | `preview`, `production`, `rollback` |
| `CLOUDFLARE_ACCOUNT_ID` | Account identifier. Not truly secret, but `04` lists it under protected values, so it is stored as a secret. | `preview`, `production`, `rollback` |

Non secret repository or environment variables (`04` variables section):

| Variable | Value |
|----------|-------|
| `CF_PAGES_PROJECT` | `galaxy-nixfred-com` |
| `PRODUCTION_BRANCH` | `main` |
| `PRODUCTION_DOMAIN` | `galaxy.nixfred.com` |
| `CF_WEB_ANALYTICS_TOKEN` | Public Cloudflare Web Analytics token, only if the beacon requires an explicit token. It ships in client HTML, so it is a variable, not a secret (`Q73`, `AC043`). |

The Cloudflare token is deliberately not granted Zone DNS Edit. Custom domain attachment through the Pages API manages the DNS record automatically when the zone is on the same account. A broader Zone DNS Edit token, if ever needed, is used only during interactive provisioning and is never stored in CI. See `docs/OPERATIONS.md`.

### 3.6 The single tested artifact

`ci.yml` builds `dist` exactly once, generates `public/build.json` into it, computes a SHA256 digest over the artifact, and uploads both the artifact and its digest. Every downstream deploy, preview and production, consumes that exact uploaded artifact rather than rebuilding, and re-verifies the digest before deploying (`04` artifact integrity items 1 and 3, `AC047`). This guarantees that the bytes tested are the bytes served. The mechanism is detailed in section 5.

### 3.7 Blocking versus warning

A blocking outcome fails the workflow and prevents promotion. A warning outcome annotates the job summary but does not fail. Formatting, lint, strict type check, Astro check, data validation, graph validation, unit tests, end to end tests, accessibility tests, the production build, internal link check, visual regression on committed baselines, and hard bundle budget violations are blocking (`Q70`, `AC045`). Small performance regressions and soft budget drift are warnings (`Q71`). High or critical dependency findings are blocking unless a dated exception exists in `docs/DECISIONS.md` (`04` security item 9, `SR008`).

### 3.8 Dependency automation

`.github/dependabot.yml` opens grouped weekly pull requests for Bun packages and for GitHub Actions (`Q77`, `04` security item 7). Action bumps flow through `ci.yml` and `security.yml` like any other change.

## 4. Workflow contracts

### 4.1 `ci.yml`, validate and build

Trigger: `pull_request` (opened, synchronize, reopened) and `push` to `main`.

Permissions: `contents: read` only. No secrets. This is the only workflow that executes proposed pull request code, so it is intentionally powerless (`04` security items 1 and 3, `SR003`).

Jobs, in order within a single job for artifact locality, or as a fan out that shares a build step, the sequence being:

1. Checkout at the exact ref.
2. Install Bun from `.bun-version`.
3. Install dependencies from `bun.lock` with no mutation, using the frozen lockfile flag.
4. `format:check`.
5. `lint`.
6. `typecheck`, strict.
7. `astro:check`.
8. `data:validate`, which runs `validate-catalog.ts` and `validate-graph.ts` (`AC028` to `AC031`).
9. `test:unit`.
10. `build`, producing `dist`, including `generate-build-info.ts` writing `dist/build.json` with commit SHA, build time, version, and catalog revision checksum (`04` artifact integrity item 2, `AC050`).
11. `report-bundle.ts` to check bundle and asset budgets (`AC036`).
12. `test:e2e` and `test:a11y` (Playwright plus axe) against the built `dist` served locally (`AC025`, `AC045`).
13. `test:visual` against committed baselines (`Q72`).
14. Compute `sha256sum` over a deterministic archive of `dist`, write `dist.sha256`, print it to the job summary.
15. Upload two artifacts: `site-dist-${{ github.sha }}` containing `dist`, and `ci-reports-${{ github.sha }}` containing test, coverage, accessibility, visual, and bundle reports. Retention per the settled policy: build artifacts (`site-dist`) 30 days, test reports (`ci-reports`) 14 days, release evidence 90 days.

A final aggregate gate job named `ci-status` declares `needs` on every check job and succeeds only if all pass. Branch protection requires the single context `ci-status`, so the required check list stays stable even when the matrix changes.

Blocking versus warning per section 3.7. Failure of any blocking job prevents preview promotion and production deployment (`04` ci final clause).

Enforces: `AC028` to `AC039`, `AC045`, `AC047` (digest origin), `SR001`, `SR002`, `SR007`.

### 4.2 `preview.yml`, isolated preview and live verification

Trigger: `workflow_run` on `ci.yml` with `types: [completed]`, filtered to `conclusion == 'success'` and the originating event being a pull request. The `workflow_run` pattern is chosen so the deploy step runs in the trusted base repository context with secrets available, while the untrusted pull request code was only ever built by `ci.yml`, which had no secrets. This satisfies "do not use the pull request target event for building untrusted code" (`04` security item 3) and "do not expose production credentials to untrusted fork execution" (`04` preview item 8) at the same time.

Environment: `preview`.

Permissions: `deployments: write` (create the GitHub deployment record), `pull-requests: write` (the preview comment), `contents: read`, `actions: read` (download the artifact from the triggering run).

Jobs, in order:

1. Download the exact `site-dist-${{ sha }}` and `dist.sha256` from the triggering `ci.yml` run. Recompute the digest and assert equality, or fail (`AC047`).
2. Confirm the preview build carries its noindex protection (section 7). Fork built artifacts are still served on a unique isolated `*.pages.dev` subdomain and are noindexed, which is the accepted residual for a public repository with no outside reviewer (`Q69`). If outside contributions ever begin, gate this job behind a maintainer applied label.
3. Deploy with `cloudflare/wrangler-action` running `wrangler pages deploy dist --project-name "$CF_PAGES_PROJECT" --branch "<source-branch>" --commit-hash "<sha>"`. Capture the returned deployment id and the immutable preview URL, plus the branch alias when present (`04` preview items 2 and 3).
4. Create or update a single pull request comment containing the preview URL, the commit identifier, and the verification result. Update the same comment on later commits rather than posting new ones (`04` preview item 4, `AC046`).
5. Run live smoke tests against the preview URL: status 200, correct title and canonical, core assets, Atlas reachable, one project focus flow (`04` preview item 5).
6. Verify the preview is not indexable, by checking both the `X-Robots-Tag: noindex` response header and the `robots` meta tag (`04` preview item 6, section 7).
7. Mark the GitHub deployment successful only after steps 5 and 6 pass (`04` preview item 7, `AC046`).

Enforces: `AC046`, `AC047`, `SR003`.

### 4.3 `production.yml`, deploy, verify, record, auto rollback

Trigger: `workflow_run` on `ci.yml`, filtered to `conclusion == 'success'` and `head_branch == 'main'`, plus `workflow_dispatch` for an approved manual production run (`04` production preamble). Using `workflow_run` after a green `ci.yml` on `main` guarantees the deploy consumes the exact artifact that passed validation for that commit (`04` production item 3, `AC047`, `AC048`).

Environment: `production`. No required reviewers, so merging to `main` deploys with no prompt (`Q68`, `AC048`).

Permissions: `deployments: write`, `contents: write` (create the release tag and release, attach the release report), `issues: write` (open the rollback incident issue on failure), `actions: read` (download the artifact).

Jobs, in strict order, the workflow failing at the first hard failure:

1. Record the current live production deployment id as `PREVIOUS_DEPLOYMENT` by calling `wrangler pages deployment list --project-name "$CF_PAGES_PROJECT" --environment production --json` and selecting the active production deployment. This value is the rollback target if the new release fails, and it proves a prior deployment remains available (`04` production item 15, `AC051`).
2. Download `site-dist-${{ sha }}` and `dist.sha256`, recompute the digest, assert equality (`AC047`).
3. Deploy with `wrangler pages deploy dist --project-name "$CF_PAGES_PROJECT" --branch "$PRODUCTION_BRANCH" --commit-hash "$GITHUB_SHA" --commit-message "<subject>"`. Capture the returned Cloudflare deployment id and the production `*.pages.dev` URL (`04` production items 4 and 5).
4. Verify the Pages URL first: status, title, canonical, core assets, navigation, data load, one full project focus flow (`04` production items 6 and 8).
5. Verify `https://galaxy.nixfred.com` second, the same checks against the custom domain (`04` production item 7, `AC049`, `AC053`).
6. Verify the custom security headers on the custom domain: content security policy, frame protection, content type protection, referrer policy, permissions policy (`04` production item 9, `AC041`).
7. Fetch `https://galaxy.nixfred.com/build.json` and assert `commit` equals `GITHUB_SHA` and `catalogRevision` matches the built snapshot checksum (`04` production item 8 metadata, `AC050`).
8. Assert no severe browser console errors during the focus flow, captured through Playwright (`04` production item 10, launch acceptance item 5).
9. On full success: update the GitHub deployment record to success, create the release identifier per the approved policy, and generate the filled release report (section 9). The report is attached to the GitHub Release and uploaded as a workflow artifact, and `docs/RELEASE_REPORT.md` in the repository is the template. The workflow does not push to protected `main` (`04` production items 11 to 13).
10. On any failure in steps 3 through 8, if `PREVIOUS_DEPLOYMENT` was a healthy production deployment, immediately run the auto rollback (section 8), mark the GitHub deployment failed, and open an evidence bearing issue (`Q75`, `04` production items 14 and 15, `AC052` behavior in production).

Enforces: `AC047` to `AC050`, `AC053`, `AC054`, `AC041`, `SR004`, `SR005`, and the deployment evidence contract in section 9.

### 4.4 `rollback.yml`, manual auditable recovery

Trigger: `workflow_dispatch` only, with inputs `target_deployment_id` (an approved prior production deployment id or the release identifier it maps to) and `reason` (`04` rollback items 1 and 6).

Environment: `production`. Concurrency group `production-deploy`, so a manual rollback serializes against any deploy.

Permissions: `deployments: write`, `issues: write`, `contents: read`.

Jobs, in order:

1. Resolve the target to a concrete Cloudflare production deployment id. Assert it is a production environment deployment, never a preview, or fail (`04` rollback item 7, `AC051`).
2. Display the selected target, its commit, and its creation time in the job summary before acting (`04` rollback item 3).
3. Restore it through the current supported Cloudflare mechanism (section 8).
4. Verify the custom domain after restoration: status, `build.json` commit now matches the restored commit, headers intact (`04` rollback item 5).
5. Record who initiated the rollback (`github.actor`), the reason input, the version restored, and the verification evidence, into the job summary and into a rollback incident issue or the existing open incident (`04` rollback item 6).

Enforces: `AC051`, `AC052`.

### 4.5 `scheduled_checks.yml`, health monitoring

Trigger: `schedule` on the approved cron, default daily, plus `workflow_dispatch` (`04` scheduled preamble, `Q80` keeps notifications inside GitHub).

Permissions: `issues: write`, `contents: read`. No deploy rights.

Jobs, in order:

1. Check the custom domain responds with 200 and a valid certificate (`04` scheduled item 1).
2. Check essential assets resolve (`04` scheduled item 2).
3. Check all published project links, internal and the recorded external set (`04` scheduled item 3, `check-links.ts`).
4. Validate the canonical catalog snapshot against schema (`04` scheduled item 4, `AC028`).
5. Detect broken thumbnails (`04` scheduled item 5).
6. Detect expired or redirected external hosts (`04` scheduled item 6).
7. Run the DR011 domain census (`scripts/domain-census.ts`, `docs/DATA_MODEL.md` section 8): enumerate the Cloudflare zone DNS for `nixfred.com` and `nixfred.tech`, probe each hostname for reachability, and diff the reachable set against the merged catalog. Any live property with no corresponding node is a coverage gap.
8. Open or update a single tracking issue only when an actionable threshold is crossed, and never on transient noise (`04` scheduled item 7, `Q140`). Default thresholds: custom domain unreachable, any essential asset missing, any internal link broken, catalog invalid, more than two broken thumbnails, an external host returning a permanent error, or any live property missing from the map (a DR011 coverage gap). Existing open issues are updated in place to avoid spam.

Enforces: `AC005`, `AC028`, `DR011` coverage, the ongoing half of `AC053` and `AC056`.

The same census is also a blocking launch gate (DR011, `docs/GATES.md`): before the initial public launch it must report zero uncovered live properties, run on demand through `workflow_dispatch` for that pre-launch verification in addition to its daily cadence. A gap at launch blocks the launch until the property is added upstream to `portfolio.json` or to `galaxy.enrichment.json`, never waived by a silent exception.

### 4.6 `security.yml`, static analysis and dependency scanning

Trigger: `push` to `main`, `pull_request`, and `schedule` weekly (`04` security item 8, `SR008`, `SR009`).

Permissions: `security-events: write` and `contents: read` for the CodeQL job. `contents: read` and `pull-requests: write` for the dependency review job on pull requests.

Jobs:

1. CodeQL for JavaScript and TypeScript: init, autobuild or the build command, analyze, upload results as code scanning alerts (`04` security item 8, `AC044` context).
2. Dependency review on pull requests, failing on high and critical advisories unless a dated exception exists in `docs/DECISIONS.md` (`04` security item 9, `SR008`).

Enforces: `SR008`, `SR009`, `AC044`.

### 4.7 `sync-catalog.yml`, weekly upstream snapshot pull request

Trigger: `schedule` weekly, plus `workflow_dispatch` (`Q51`).

Permissions: `contents: write` (create a branch and commit the refreshed snapshot) and `pull-requests: write` (open the PR). No deploy rights, no production secrets.

Jobs, in order:

1. Run `sync-catalog.ts`, which fetches `nixfred/nixfred.github.io/portfolio.json`, validates it, preserves every enrichment mapping keyed by stable slug, and writes `src/data/portfolio.snapshot.json`. It never silently discards enrichment (`Q50`, `Q51`, `AC033`, `AC003`).
2. Produce a human readable change report of additions, removals, and changed records (`AC033`, `DR009`).
3. If the snapshot changed, open a pull request on a `catalog-sync/<date>` branch with the change report in the body. If nothing changed, exit cleanly with no PR. Production builds never fetch the catalog at runtime, they consume the committed snapshot, so this PR is the only path for upstream change to reach production (`Q51`, `DR010`). The PR runs the full `ci.yml` and `preview.yml` like any change, and merges when green.

Enforces: `AC002`, `AC003`, `AC033`, `AC055` support.

## 5. Artifact integrity and digest verification

The chain that satisfies `AC047`, the exact tested artifact deploys:

1. `ci.yml` builds `dist` once, injects `build.json`, computes `sha256sum` over a byte stable archive of `dist`, writes `dist.sha256`, and prints the digest to the job summary.
2. `ci.yml` uploads `site-dist-<sha>` and `dist.sha256`.
3. `preview.yml` and `production.yml` download those artifacts, recompute the digest, and assert it equals `dist.sha256`. A mismatch fails the deploy before any upload to Cloudflare.
4. The recomputed digest is printed to each deploy job summary, so the audit trail shows the same digest at build, preview, and production (`AC047` evidence, artifact digest in job summary).

The build output is scanned to confirm it contains no source secrets, local paths, private URLs, or test fixtures before upload (`04` artifact integrity item 4, `AC040`).

## 6. Caching and header strategy

Headers are declared in `public/_headers`, served by Cloudflare Pages (`04` caching and headers section, `SR004`, `SR005`).

| Asset class | Cache-Control | Reason |
|-------------|---------------|--------|
| HTML documents | `public, max-age=0, must-revalidate` | Conservative, so a release appears promptly (`04` caching item 1). |
| Fingerprinted assets under `/_astro/` and hashed textures | `public, max-age=31536000, immutable` | Content hashed names make long immutable caching safe (`04` caching item 2). |
| `/build.json` | `no-store` | Production verification and the footer must read the live deployed value, never a cached one (`AC050`). |

Security headers, all present on the custom domain and verified by `production.yml` step 6 (`AC041`):

- A content security policy that allows local assets and the Cloudflare Web Analytics beacon, and nothing else, so no unapproved third party script can load (`SR004`, `SR006`, `AC042`, `AC043`).
- Frame protection through `frame-ancestors 'none'` in the policy and `X-Frame-Options: DENY`.
- `X-Content-Type-Options: nosniff`.
- `Referrer-Policy: strict-origin-when-cross-origin`.
- A restrictive `Permissions-Policy` disabling sensors, geolocation, camera, microphone, and payment.

The policy is validated to not break WebGL, bundled fonts, thumbnails, the analytics beacon, or approved external navigation (`04` caching item 6). The canonical production host is unambiguous: canonical metadata and `_redirects` point every request at `https://galaxy.nixfred.com` (`04` caching item 5, `AC054`).

## 7. Preview noindex enforcement

Previews must never be indexed (`04` preview item 6, caching item 4). Because preview and production are separate builds from separate branches, noindex is baked into the preview artifact rather than toggled at the edge:

1. A prebuild step writes an extra `X-Robots-Tag: noindex, nofollow` rule into `_headers` and sets `robots.txt` to disallow all when the build branch is not `main`.
2. The application renders `<meta name="robots" content="noindex">` for the same non production condition.
3. `preview.yml` step 6 verifies both the response header and the meta tag on the live preview URL. Production builds omit both, so the custom domain stays fully indexable.

## 8. Rollback mechanism

Wrangler 4.x has no `pages rollback` command, verified against the installed CLI. The current supported Cloudflare mechanisms, in preference order, are:

1. Primary, the Cloudflare Pages rollback API. `POST https://api.cloudflare.com/client/v4/accounts/{account_id}/pages/projects/{project_name}/deployments/{deployment_id}/rollback`. This re-promotes a prior production deployment to live with no rebuild, restoring the exact prior bytes. The target must be a production deployment, which is why both `production.yml` and `rollback.yml` assert the target is not a preview (`AC051`). This is the fastest and most faithful recovery and is used for auto rollback.
2. Fallback, re-deploy the retained known good artifact. `wrangler pages deploy dist --project-name "$CF_PAGES_PROJECT" --branch main --commit-hash "<good_sha>"` using the retained `site-dist-<good_sha>` artifact. This creates a new production deployment from the exact previously tested bytes. Used when the target deployment has aged out of the rollback API window but its CI artifact is still retained.

Auto rollback inside `production.yml` uses mechanism 1 against `PREVIOUS_DEPLOYMENT` captured in step 1, then re-verifies the custom domain, then opens the incident issue (`Q75`). Manual `rollback.yml` uses the same mechanism against an operator supplied target. `AC052` is satisfied by rehearsing a simulated failed smoke check against the rollback runbook in a controlled test, recorded in `docs/OPERATIONS.md`.

## 9. Deployment evidence contract

A release is complete only when the generated release report contains all 14 items from `04_CICD_REQUIREMENTS.md`, deployment evidence section. `production.yml` step 9 assembles them:

1. Repository URL.
2. Commit identifier.
3. Pull request URL when applicable.
4. Successful Actions run URL.
5. Preview URL and verification result.
6. Cloudflare deployment identifier.
7. Production Pages URL.
8. Custom domain URL.
9. Browser verification evidence, the ordered frame or trace artifact, never a single screenshot (execution law 5).
10. Test summary.
11. Accessibility summary.
12. Performance summary.
13. Known limitations.
14. Rollback target, the `PREVIOUS_DEPLOYMENT` id.

## 10. Job to requirement mapping

| Workflow, job | Enforces |
|---------------|----------|
| `ci.yml` format, lint, typecheck, astro check | `AC045`, `SR001` |
| `ci.yml` data validate, graph validate | `AC028`, `AC029`, `AC030`, `AC031`, `AC003` |
| `ci.yml` unit, e2e, a11y, visual | `AC012` to `AC027` coverage, `AC025`, `AC045` |
| `ci.yml` build, bundle budgets | `AC034`, `AC036`, `AC050` origin |
| `ci.yml` digest, upload | `AC047` |
| `ci.yml` build output scan | `AC040`, `SR002` |
| `preview.yml` deploy, comment | `AC046` |
| `preview.yml` live smoke, noindex | `AC046`, preview item 6 |
| `preview.yml` fork isolation | `SR003`, `04` security item 3 |
| `production.yml` artifact reuse, digest | `AC047`, `AC048` |
| `production.yml` custom domain smoke | `AC049`, `AC053` |
| `production.yml` header verify | `AC041`, `SR004`, `SR005` |
| `production.yml` build.json match | `AC050`, `AC054` |
| `production.yml` capture previous, auto rollback | `AC051`, `AC052`, production item 15 |
| `production.yml` release report | deployment evidence 1 to 14, `AC057` |
| `rollback.yml` | `AC051`, `AC052` |
| `scheduled_checks.yml` | `AC005`, `AC028`, `AC053` ongoing |
| `security.yml` CodeQL, dep review | `SR008`, `SR009`, `AC044` |
| `sync-catalog.yml` | `AC002`, `AC003`, `AC033`, `AC055` support |
| all workflows, top level `permissions: {}` | `SR002`, `AC040` |
| all workflows, SHA pinned actions | `SR009`, `AC044`, `Q78` |
| `dependabot.yml` | `Q77`, `04` security item 7 |

## 11. Permissions summary

| Workflow | Top level | Job grants |
|----------|-----------|-----------|
| `ci.yml` | `{}` | `contents: read` |
| `preview.yml` | `{}` | `contents: read`, `deployments: write`, `pull-requests: write`, `actions: read` |
| `production.yml` | `{}` | `contents: write`, `deployments: write`, `issues: write`, `actions: read` |
| `rollback.yml` | `{}` | `contents: read`, `deployments: write`, `issues: write` |
| `scheduled_checks.yml` | `{}` | `contents: read`, `issues: write` |
| `security.yml` | `{}` | `security-events: write`, `contents: read`; dep review adds `pull-requests: write` |
| `sync-catalog.yml` | `{}` | `contents: write`, `pull-requests: write` |

## 12. Pending Fred decisions

These do not block the automation, and each has a working default that ships if Fred does not change it:

1. Release identifier policy. RESOLVED by F27 in `docs/DECISIONS.md`: date plus short commit SHA, for example `v2026.07.10-<shortsha>` (`07_DECISIONS_TEMPLATE.md` release identifier policy). Semantic versioning is not used.
2. Artifact and log retention duration. RESOLVED by F30 in `docs/DECISIONS.md`, recorded 2026-07-11: build artifacts (`site-dist`) 30 days, test reports (`ci-reports`) 14 days, release evidence 90 days. `04` security item 6 defers to this policy.
3. Preview access. RESOLVED by F26 in `docs/DECISIONS.md`: preview URLs are public with noindex (sections 4.2 and 7). Cloudflare Access on previews remains a one line addition if Fred later wants protected previews, but is not the default.
4. Scheduled check cadence. Default daily. `Q80` keeps output inside GitHub.
