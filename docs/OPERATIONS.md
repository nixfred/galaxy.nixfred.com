# Operations Runbook

NIXFRED GALAXY, `galaxy.nixfred.com`. This runbook is written so a future session can execute every procedure without guessing. It covers first time provisioning, production deployment verification, rollback, catalog sync, secret rotation, scheduled check triage, and preview cleanup. Commands are copy ready. Replace `<...>` placeholders with the recorded values. The delivery design these procedures serve is in `docs/CI_CD.md`.

Recorded facts, filled in during provisioning and kept current here:

| Fact | Value |
|------|-------|
| GitHub repository | `nixfred/galaxy.nixfred.com` |
| Repository visibility | public |
| Default and production branch | `main` |
| Cloudflare Pages project | `galaxy-nixfred-com` |
| Production custom domain | `galaxy.nixfred.com` |
| Build output | `dist` |
| Cloudflare account id | `<CLOUDFLARE_ACCOUNT_ID>` |
| Cloudflare zone for nixfred.com | `<ZONE_ID>` |
| Cloudflare zone for nixfred.tech | `<ZONE_ID_TECH>` |
| Deploy token scope | Account, Cloudflare Pages, Edit |
| Census token scope | Zone, DNS, Read (both zones), read only |
| Artifact retention policy (F30) | Build artifacts 30 days, test reports 14 days, release evidence 90 days |

## 0. Tool and authentication verification

Authentication checks are verification, not permission requests. Run these before any change and record the results.

```bash
gh auth status
git remote -v
wrangler whoami
bun --version
cat .bun-version
```

Expected: `gh` logged in as `nixfred`, the `origin` remote pointing at `github.com/nixfred/galaxy.nixfred.com`, `wrangler whoami` showing the correct Cloudflare account and the token permissions including Cloudflare Pages Edit, and the Bun version matching `.bun-version`. If any check fails, resolve it before proceeding. `wrangler login` or a `CLOUDFLARE_API_TOKEN` in the environment authenticates wrangler for local operations.

## 1. First time provisioning, in order

### 1.1 Create the repository

```bash
gh repo create nixfred/galaxy.nixfred.com \
  --public \
  --description "NIXFRED GALAXY, an interactive star map of every project Fred Nix has built." \
  --homepage "https://galaxy.nixfred.com"
```

Confirm the default branch is `main`. Push the complete initial project as one intentional first commit, then confirm the branch exists on the remote:

```bash
git push -u origin main
gh api repos/nixfred/galaxy.nixfred.com/branches/main --jq '.name'
```

Branch protection can only be configured after `main` exists on the remote, which is why this step precedes section 1.2.

### 1.2 Configure branch protection

`main` is the only production branch. Force pushes and deletion are prohibited. All CI checks must pass. Pull requests are required. No outside reviewer is required, matching `Q68`, `Q69`, and `D132`. The required check context is the single aggregate `ci-status` job, so the required list stays stable as the test matrix evolves.

```bash
gh api -X PUT repos/nixfred/galaxy.nixfred.com/branches/main/protection \
  --input - <<'JSON'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["ci-status"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": 0,
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false
  },
  "required_conversation_resolution": true,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "restrictions": null
}
JSON
```

`enforce_admins` is false so Fred retains an emergency administrative path. `required_approving_review_count` is 0, which requires a pull request before merge but no human approval, because the automated gates are the approval (`Q68`). Verify:

```bash
gh api repos/nixfred/galaxy.nixfred.com/branches/main/protection --jq '{checks: .required_status_checks.contexts, force: .allow_force_pushes.enabled, del: .allow_deletions.enabled}'
```

### 1.3 Create the GitHub environments

```bash
gh api -X PUT repos/nixfred/galaxy.nixfred.com/environments/production \
  -f "deployment_branch_policy[protected_branches]=false" \
  -f "deployment_branch_policy[custom_branch_policies]=true"
gh api -X POST "repos/nixfred/galaxy.nixfred.com/environments/production/deployment-branch-policies" \
  -f name='main' -f type='branch'
gh api -X PUT repos/nixfred/galaxy.nixfred.com/environments/preview
```

The `production` environment is restricted to the `main` branch so no other branch or fork can reach production secrets. It has no required reviewers, because a manual approval would violate `AC048`. The `preview` environment holds the preview deploy token. Verify:

```bash
gh api repos/nixfred/galaxy.nixfred.com/environments --jq '.environments[].name'
```

### 1.4 Set secrets and variables

Secrets go into the environments, never into repository files, and are never echoed. Provide the token value through an environment variable so it never appears in shell history or logs.

```bash
gh secret set CLOUDFLARE_API_TOKEN   --env production --body "$CF_DEPLOY_TOKEN"
gh secret set CLOUDFLARE_ACCOUNT_ID  --env production --body "$CF_ACCOUNT_ID"
gh secret set CLOUDFLARE_API_TOKEN   --env preview    --body "$CF_DEPLOY_TOKEN"
gh secret set CLOUDFLARE_ACCOUNT_ID  --env preview    --body "$CF_ACCOUNT_ID"

gh variable set CF_PAGES_PROJECT  --body "galaxy-nixfred-com"
gh variable set PRODUCTION_BRANCH  --body "main"
gh variable set PRODUCTION_DOMAIN  --body "galaxy.nixfred.com"
# Only if the analytics beacon needs an explicit token, it is public and ships in HTML:
gh variable set CF_WEB_ANALYTICS_TOKEN --body "<public_token>"
```

The Cloudflare token is scoped to Account, Cloudflare Pages, Edit only. Confirm no secret is present in the repository tree:

```bash
gh secret list --env production
gh variable list
git grep -nI -e 'CLOUDFLARE_API_TOKEN=' -e 'api.cloudflare.com/client/v4' -- ':!docs/*' || echo "no inline credentials found"
```

### 1.5 Verify Cloudflare authentication and create or reuse the Pages project

```bash
wrangler whoami
wrangler pages project list --json | jq -r '.[].name'
```

If `galaxy-nixfred-com` is absent, create it as a Direct Upload project with `main` as the production branch. Direct Upload projects have no connected git repository, which is required because deployment goes through GitHub Actions and Wrangler, never Pages git integration (`Q67`).

```bash
wrangler pages project create galaxy-nixfred-com \
  --production-branch main \
  --compatibility-date "$(date +%Y-%m-%d)"
```

If the project already exists, reuse it and confirm the production branch is `main`:

```bash
wrangler pages project list --json | jq '.[] | select(.name=="galaxy-nixfred-com") | {name, production_branch: .production_branch}'
```

### 1.6 Attach the custom domain

Wrangler 4.x has no `pages domain` command, verified against the installed CLI, so the custom domain is attached through the Cloudflare Pages API. When the `nixfred.com` zone is on the same Cloudflare account, this call provisions the `galaxy` CNAME and requests the certificate automatically, so the Cloudflare Pages Edit token is sufficient and no Zone DNS Edit token is needed. Verify this assumption during the first run, and if the record is not auto created, add it once with a temporary Zone DNS Edit token or through the dashboard.

```bash
curl -sS -X POST \
  "https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/pages/projects/galaxy-nixfred-com/domains" \
  -H "Authorization: Bearer ${CF_DEPLOY_TOKEN}" \
  -H "Content-Type: application/json" \
  --data '{"name":"galaxy.nixfred.com"}' | jq '{name: .result.name, status: .result.status}'
```

### 1.7 Verify DNS and certificate

```bash
# Domain status reported by Cloudflare, wait until active
curl -sS "https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/pages/projects/galaxy-nixfred-com/domains" \
  -H "Authorization: Bearer ${CF_DEPLOY_TOKEN}" | jq '.result[] | {name, status, certificate_authority: .validation_data.status}'

# DNS resolves to the Pages target
dig +short galaxy.nixfred.com CNAME
dig +short galaxy.nixfred.com A

# TLS is active and the site answers
curl -sS -I https://galaxy.nixfred.com | head -n 1
```

Proceed only when the domain status is `active`, DNS resolves to the Pages target, and the custom domain returns a valid certificate. Record the final settings in the facts table at the top of this file. This completes provisioning (`AC053`).

## 2. Production deployment verification checklist

Production deploys automatically when a pull request merges to `main`, through `ci.yml` then `production.yml`. No manual approval is expected (`AC048`). Use this checklist to confirm a release, either by reading the `production.yml` job summary or by verifying manually.

1. The triggering `ci.yml` on `main` is green and produced `site-dist-<sha>` with a printed digest.
2. `production.yml` recomputed the artifact digest and it matched the CI digest (`AC047`).
3. The Cloudflare deployment id and production `*.pages.dev` URL are recorded in the job summary.
4. The Pages URL passed smoke tests, then the custom domain passed the same tests (`AC049`).
5. Security headers are present on the custom domain:

```bash
curl -sS -I https://galaxy.nixfred.com | grep -iE 'content-security-policy|x-frame-options|x-content-type-options|referrer-policy|permissions-policy'
```

6. `build.json` reports the deployed commit and catalog revision:

```bash
curl -sS https://galaxy.nixfred.com/build.json | jq '{commit, buildTime, version, catalogRevision}'
```

The `commit` must equal the merged `main` commit SHA (`AC050`).

7. Canonical metadata points at the custom domain (`AC054`):

```bash
curl -sS https://galaxy.nixfred.com/ | grep -i '<link rel="canonical"'
```

8. No severe console errors during the project focus flow, evidenced by the Playwright trace attached to the run.
9. The release identifier or release record was created, and the release report carries all 14 evidence items (`docs/CI_CD.md` section 9).
10. A previous successful Cloudflare deployment is still listed as a rollback target (`AC051`):

```bash
wrangler pages deployment list --project-name galaxy-nixfred-com --environment production --json \
  | jq -r '.[] | "\(.id)  \(.created_on)  \(.deployment_trigger.metadata.commit_hash // "n/a")"' | head -n 5
```

If any item fails and the deploy did not auto roll back, follow section 3.

## 3. Rollback runbook

### 3.1 When to roll back

Roll back when production is unhealthy and a prior deployment was healthy: the custom domain smoke test fails after a deploy, `build.json` does not match the deployed commit, security headers regressed, or severe console errors appeared. `production.yml` performs this automatically on a failed smoke check (`Q75`). Perform a manual rollback when the automatic path did not fire, or when an issue is discovered after the deploy job already reported success.

### 3.2 Identify the target

List production deployments, newest first, and select the last known healthy one. Never select a preview deployment (`AC051`).

```bash
wrangler pages deployment list --project-name galaxy-nixfred-com --environment production --json \
  | jq -r '.[] | "\(.id)  \(.created_on)  env=\(.environment)  commit=\(.deployment_trigger.metadata.commit_hash // "n/a")"'
```

Record the chosen `<TARGET_DEPLOYMENT_ID>` and confirm its `env` is `production`.

### 3.3 Restore, primary mechanism

Use the Cloudflare Pages rollback API. It re-promotes the prior production deployment with no rebuild, restoring the exact prior bytes. This is the current supported mechanism, since Wrangler has no `pages rollback` command.

```bash
curl -sS -X POST \
  "https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/pages/projects/galaxy-nixfred-com/deployments/<TARGET_DEPLOYMENT_ID>/rollback" \
  -H "Authorization: Bearer ${CF_DEPLOY_TOKEN}" \
  -H "Content-Type: application/json" | jq '{id: .result.id, url: .result.url, success}'
```

The preferred way to trigger this is the audited `rollback.yml` workflow, which records the operator and reason:

```bash
gh workflow run rollback.yml \
  -f target_deployment_id='<TARGET_DEPLOYMENT_ID>' \
  -f reason='<why>'
gh run watch "$(gh run list --workflow=rollback.yml --limit 1 --json databaseId --jq '.[0].databaseId')"
```

### 3.4 Restore, fallback mechanism

If the target deployment has aged out of the rollback API window but its CI artifact is still retained, re-deploy the exact tested bytes. Download the retained `site-dist-<good_sha>` artifact from its `ci.yml` run, then:

```bash
wrangler pages deploy dist \
  --project-name galaxy-nixfred-com \
  --branch main \
  --commit-hash <good_sha> \
  --commit-message "rollback to <good_sha>"
```

### 3.5 Verify after restoration

```bash
curl -sS -I https://galaxy.nixfred.com | head -n 1
curl -sS https://galaxy.nixfred.com/build.json | jq '.commit'
curl -sS -I https://galaxy.nixfred.com | grep -iE 'content-security-policy|x-frame-options'
```

The status must be 200, `build.json` `commit` must equal the restored commit, and the security headers must be present.

### 3.6 Record the incident

Record who initiated the rollback, why it happened, which version was restored, and the verification evidence. When `rollback.yml` was used it writes this to the run summary and opens or updates the incident issue. For a manual API rollback, open the issue yourself:

```bash
gh issue create \
  --title "Rollback: production restored to <good_sha> on $(date -u +%FT%TZ)" \
  --label incident \
  --body "Initiated by: $(gh api user --jq .login)
Reason: <why>
Restored deployment: <TARGET_DEPLOYMENT_ID>
Restored commit: <good_sha>
Verification: status 200, build.json commit=<good_sha>, headers present.
Failed release: <bad_sha>, run <run_url>."
```

### 3.7 Rollback rehearsal

`AC052` requires a rehearsed rollback. On a controlled test, simulate a failed smoke check, confirm the rollback path restores the prior deployment, verify the custom domain, and record the rehearsal outcome as a dated note in this file. Rehearse against a nonproduction target or during a maintenance window, never by intentionally breaking live production.

## 4. Catalog sync operations

The upstream catalog is `nixfred/nixfred.github.io/portfolio.json`. Production never fetches it at runtime, it consumes the committed snapshot, so upstream change reaches production only through the sync pull request (`Q49`, `Q51`, `DR010`).

Automatic path: `sync-catalog.yml` runs weekly, refreshes `src/data/portfolio.snapshot.json`, preserves all enrichment keyed by stable slug, writes a change report, and opens a `catalog-sync/<date>` pull request when the snapshot changed. That PR runs full CI and a preview, and merges when green.

Manual path, when an urgent upstream change is needed:

```bash
gh workflow run sync-catalog.yml
gh run watch "$(gh run list --workflow=sync-catalog.yml --limit 1 --json databaseId --jq '.[0].databaseId')"
# Or run the sync locally to inspect the diff before it opens a PR:
bun run data:sync
bun run data:validate
git diff --stat src/data/portfolio.snapshot.json
```

Review the change report in the PR body before merging. Confirm no enrichment mapping was dropped and that additions and removals are expected (`AC033`, `AC003`). Merging the PR triggers a normal production deploy. New nixfred.com catalog entries are added only after the custom domain passes verification (`AC055`), through a separate pull request in the `nixfred/nixfred.github.io` repository.

## 5. Secret rotation

Routine rotation, on a schedule or on staff change:

1. Mint a new Cloudflare API token scoped to Account, Cloudflare Pages, Edit.
2. Update both environments and confirm:

```bash
gh secret set CLOUDFLARE_API_TOKEN --env production --body "$NEW_TOKEN"
gh secret set CLOUDFLARE_API_TOKEN --env preview    --body "$NEW_TOKEN"
```

3. Trigger a no change deploy or the next merge and confirm `production.yml` still authenticates.
4. Revoke the old token in the Cloudflare dashboard.

Exposure incident path, when a credential appears in a log, a PR, build output, or any public surface. Rotate first, investigate second (`04` secrets item 7, `AC040`):

1. Immediately revoke the exposed token in the Cloudflare dashboard, so it is dead before anything else.
2. Mint and install a replacement per the routine steps above.
3. Purge the exposure. If it was in a workflow log, delete the run. If it was committed, remove it and confirm it is not in the current tree:

```bash
git grep -nI '<leaked_fragment>' || echo "not present in working tree"
```

4. Open a dated incident issue recording what leaked, where, when, the revocation time, and the replacement time. Do not include the secret value in the issue.
5. Confirm the value never lived in a repository file, only in GitHub secrets, which is the standing rule (`04` secrets item 5).

## 6. Scheduled check failure triage

`scheduled_checks.yml` opens or updates a single tracking issue only when an actionable threshold is crossed (`docs/CI_CD.md` section 4.5). When an issue appears:

1. Read the issue body for which check failed: custom domain, essential asset, internal link, catalog schema, thumbnail, or external host.
2. Reproduce the specific failure:

```bash
curl -sS -I https://galaxy.nixfred.com | head -n 1          # domain
bun run check:links                                          # links and assets
bun run data:validate                                        # catalog schema
```

3. Classify. A domain or certificate failure is an incident, go to section 3 if a bad deploy caused it, or to Cloudflare status if the platform is degraded. A broken internal link or invalid catalog is a code or data defect, fix it through a normal pull request. A broken external host is expected drift, update the project record status and note it, it does not block anything.
4. Do not restart or redeploy on a scheduled check alarm without confirming the alarm maps to a deploy caused fault. A red external host is not a reason to redeploy.
5. Close the issue when the underlying condition clears. The workflow updates the same issue rather than opening duplicates.

## 7. Preview cleanup policy

Preview deployments are isolated, noindexed `*.pages.dev` deployments created per pull request commit. Cloudflare retains them automatically. Policy for version one (`D135` left this open, this is the working default recorded in `docs/DECISIONS.md`):

1. Previews are not deleted on every PR close, because they are cheap, noindexed, and useful for post merge reference.
2. A periodic cleanup removes preview deployments older than 30 days, keeping the production history intact. Never delete a production deployment, it may be a rollback target (`AC051`).

```bash
# List preview deployments, oldest last
wrangler pages deployment list --project-name galaxy-nixfred-com --environment preview --json \
  | jq -r '.[] | "\(.id)  \(.created_on)"'
# Delete a specific aged preview deployment
wrangler pages deployment delete <PREVIEW_DEPLOYMENT_ID> --project-name galaxy-nixfred-com
```

Confirm the target's environment is `preview` before deleting. The rollback inventory in section 2 item 10 must always show at least one healthy production deployment after any cleanup.

## 8. Domain coverage census (DR011)

Total coverage (DR011, decision F3): every property reachable at `*.nixfred.com`, `nixfred.com/*`, `*.nixfred.tech`, or `nixfred.tech/*` must appear on the map. The census enforces this.

How it runs. `scripts/domain-census.ts` enumerates the Cloudflare zone DNS records for both zones, `nixfred.com` and `nixfred.tech`, through the Cloudflare API, probes each resulting hostname for reachability, and diffs the reachable set against the merged galaxy catalog. The census reads DNS only, so it uses a read only Zone DNS Read token for both zones, never the Pages Edit deploy token.

Privacy scoping (ruling R9 in `docs/DECISIONS.md`). Raw zone enumeration output never leaves the workflow run: it is never committed, never uploaded as an artifact, never printed to logs, and never included in an issue body. A hostname or path is census-eligible only if it serves public HTML over HTTPS with an HTTP 200 response. DNS records that are not public websites (mail, TXT, service CNAMEs, API endpoints, tooling, anything failing the eligibility check) appear in outputs only as aggregate counts, never by name. Every census-eligible live property with no corresponding node is reported as a coverage gap; the public census report and any tracking issue may name only census-eligible gaps. An editorial exclusion file `src/data/census-exclusions.json` may exclude a census-eligible public website from the map requirement, each entry carrying a reason, limited to already-public websites, and auditable rather than silent.

```bash
# Enumerate DNS records for both zones, read only
curl -sS "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_NIXFRED_COM}/dns_records?per_page=100" \
  -H "Authorization: Bearer ${CF_DNS_READ_TOKEN}" | jq -r '.result[] | "\(.type)\t\(.name)"'
curl -sS "https://api.cloudflare.com/client/v4/zones/${CF_ZONE_NIXFRED_TECH}/dns_records?per_page=100" \
  -H "Authorization: Bearer ${CF_DNS_READ_TOKEN}" | jq -r '.result[] | "\(.type)\t\(.name)"'
# Or run the packaged census, which also probes reachability and diffs against the catalog:
bun run data:census
```

When it runs. Before the initial public launch the census is a blocking gate: it must report zero uncovered live properties before launch (`docs/GATES.md`, `docs/CI_CD.md`). After launch it runs on the maintenance schedule inside `scheduled_checks.yml` (`docs/CI_CD.md` section 4.5), which opens a tracking issue on any gap.

What to do with a gap. A census-eligible live property missing from the map is resolved by adding the entry upstream to `portfolio.json` in `nixfred/nixfred.github.io` (the canonical identity source per `DR001`), or, when the property is Galaxy specific, to the enrichment layer `src/data/galaxy.enrichment.json`. Never wave a gap through with a silent exception; an editorial exclusion for an already-public, census-eligible property goes through `src/data/census-exclusions.json` with a recorded reason instead, per R9. An upstream addition flows back into Galaxy through the normal catalog sync (section 4); an enrichment or exclusion addition ships through a normal pull request. Re-run the census after the change and confirm the gap is cleared before closing the tracking issue.

## Section 9. Phase 0 provisioning record, 2026-07-11

Executed by Larry during Gate G0. Every value verified at execution time; credentials never echoed.

| Item | Result |
|------|--------|
| `gh auth status` | Verified: logged in as `nixfred`, active account |
| GitHub repository | Created `nixfred/galaxy.nixfred.com`, PUBLIC, default branch `main`, description and homepage set |
| Branch protection on `main` | Force pushes blocked, deletion blocked, `enforce_admins` on, conversation resolution required, no pre-push status checks (trunk based per decision F31; `production.yml` gating on green `ci.yml` is the quality gate) |
| Initial push | Planning pack pushed to `main` with tag `milestone/galaxy-planning-pack-2026-07-11` |
| Initial release | `v2026.07.11-d798e3e`, the planning pack as release notes |
| GitHub environments | `production` (deployment branch policy: `main` only) and `preview` created |
| `wrangler whoami` | Verified: OAuth login as frednix@gmail.com works for Pages operations. NOTE: local shells export a `CLOUDFLARE_API_TOKEN` env value that CANNOT access Pages; unset env tokens for interactive wrangler Pages work (known from prior projects) |
| Cloudflare Pages project | Created `galaxy-nixfred-com`, production branch `main`, will serve at `galaxy-nixfred-com.pages.dev` after the first deployment |
| Secret `CLOUDFLARE_ACCOUNT_ID` | Set in both `production` and `preview` environments |
| Secret `CF_DNS_READ_TOKEN` | Set at repository level. Uses an existing token verified to hold zone list plus DNS read on both zones and verified UNABLE to deploy Pages or mint tokens. Functionally census scoped. Replace with a freshly minted dedicated token at any time; rotation procedure in section 6 |
| Variables | `CF_PAGES_PROJECT=galaxy-nixfred-com`, `PRODUCTION_BRANCH=main`, `PRODUCTION_DOMAIN=galaxy.nixfred.com`, `CF_ZONE_NIXFRED_COM`, `CF_ZONE_NIXFRED_TECH` set at repository level |
| Dependabot | `.github/dependabot.yml` committed: grouped weekly, bun plus github-actions |
| Secret `CLOUDFLARE_API_TOKEN` | OPEN ITEM. Requires Fred to mint a token in the Cloudflare dashboard scoped to Account, Cloudflare Pages, Edit, and nothing more (section 3.5 of `docs/CI_CD.md`). Neither existing local token holds Pages access, and neither can mint tokens by API. Gate G0 remains open on this single item |

Zone identifiers recorded: `nixfred.com` `0f553c816de4c7f59d6dfbfe1712aafd`, `nixfred.tech` `c288a29ecab13b9b7f97b77c801c9cad` (public zone metadata, stored as variables per the contract).
