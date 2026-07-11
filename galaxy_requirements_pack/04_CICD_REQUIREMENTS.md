# CI/CD REQUIREMENTS

## Delivery architecture

1. GitHub is the authoritative source repository.
2. GitHub Actions is the authoritative automation system.
3. Wrangler performs Cloudflare Pages deployments.
4. Cloudflare Pages hosts preview and production deployments.
5. `galaxy.nixfred.com` is attached as the production custom domain.
6. The main branch represents production intent.
7. Pull requests represent proposed changes and receive isolated preview deployments.

## Repository provisioning

Larry shall:

1. Confirm the approved GitHub owner and repository name from the interview decisions.
2. Create the repository through `gh` if it does not exist.
3. Set the approved visibility.
4. Set the default branch to main.
5. Add the repository description and homepage URL.
6. Push the complete initial project through an intentional first commit.
7. Configure branch protection or repository rules after the initial branch exists.
8. Record the final repository settings in `docs/OPERATIONS.md`.

## Branch and pull request model

1. Main is the only production branch.
2. Feature work occurs on short lived branches.
3. Direct production deployment from arbitrary branches is prohibited.
4. Pull requests must pass all blocking checks before merge.
5. Force pushes to main are prohibited.
6. Main deletion is prohibited.
7. Required conversation resolution is enabled when supported by the repository plan.
8. The final approval policy follows Fred's interview answer.

## Required workflow separation

### `ci.yml`

Runs for pull requests and for main branch updates.

Required jobs:

1. Checkout with minimal permissions.
2. Install the selected runtime.
3. Install dependencies from the lockfile without mutation.
4. Verify formatting.
5. Run lint rules.
6. Run strict TypeScript checking.
7. Validate project data and relationships.
8. Run unit tests.
9. Build the production artifact.
10. Check bundle and asset budgets.
11. Run browser smoke tests against the built artifact.
12. Run automated accessibility checks.
13. Upload the exact built artifact and test reports for later jobs.

A failure in any blocking job prevents preview promotion and production deployment.

### `preview.yml`

Runs after successful validation for eligible pull requests and approved feature branches.

Required behavior:

1. Download or rebuild the exact validated artifact.
2. Deploy the artifact to the Cloudflare Pages project as a preview associated with the source branch and commit.
3. Capture the immutable preview URL and branch alias when available.
4. Add or update one pull request comment containing the preview URL, commit identifier, and verification result.
5. Run live smoke tests against the preview URL.
6. Verify that preview pages are not indexable.
7. Mark the GitHub deployment successful only after live verification passes.
8. Do not expose production credentials to untrusted fork execution.
9. Optionally protect previews with Cloudflare Access according to Fred's answer.

### `production.yml`

Runs only for an approved main branch update or approved manual production dispatch.

Required behavior:

1. Reference the GitHub production environment.
2. Use environment protection according to Fred's approval policy.
3. Use only the exact artifact that passed validation for the production commit.
4. Deploy with Wrangler to the production branch of the approved Cloudflare Pages project.
5. Record the returned deployment identifier and production Pages URL.
6. Verify the Pages URL first.
7. Verify `https://galaxy.nixfred.com` second.
8. Verify status, title, canonical metadata, core assets, navigation, data loading, and one complete project focus flow.
9. Verify the custom security headers.
10. Verify there are no severe browser console errors.
11. Create or update the GitHub deployment record.
12. Create the approved release tag or release record.
13. Generate `docs/RELEASE_REPORT.md` with evidence.
14. Fail the workflow if live verification fails.
15. Start the documented rollback procedure if the prior production deployment was healthy and the new deployment is not.

### `rollback.yml`

Provides a manual, auditable recovery path.

Required behavior:

1. Accept an approved prior production deployment identifier or approved release identifier.
2. Require the GitHub production environment.
3. Display the selected target before action.
4. Restore the selected prior production deployment using the current supported Cloudflare mechanism.
5. Verify the custom domain after restoration.
6. Record who initiated the rollback, why it occurred, which version was restored, and the verification evidence.
7. Never use a preview deployment as a rollback target.

### `scheduled_checks.yml`

Runs on an approved schedule and by manual dispatch.

Required behavior:

1. Check the custom domain.
2. Check essential assets.
3. Check all published project links.
4. Validate the canonical project data source.
5. Detect broken thumbnails.
6. Detect expired or redirected external hosts.
7. Produce an issue or report only when actionable failure thresholds are met.

## Secrets and variables

Required protected values:

1. `CLOUDFLARE_ACCOUNT_ID`
2. `CLOUDFLARE_API_TOKEN`

Required non secret variables:

1. Cloudflare Pages project name.
2. Production branch name.
3. Production custom domain.
4. Public analytics token only if the selected analytics tool requires one.

Requirements:

1. Store sensitive values in GitHub secrets, preferably the production environment when the plan supports the desired controls.
2. Use a Cloudflare token limited to the permissions required for Pages deployment and domain operations.
3. Grant the GitHub token only the permissions each job needs.
4. Never echo secrets.
5. Never place credentials in repository files.
6. Never run production credential jobs from untrusted code.
7. Rotate any value exposed in logs immediately and record the incident.

## GitHub Actions security

1. Use least privilege workflow permissions.
2. Pin third party Actions to immutable commit identifiers where practical.
3. Do not use the pull request target event for building or executing untrusted proposed code.
4. Keep build and deployment jobs separate.
5. Restrict production secrets to production jobs.
6. Retain logs and artifacts according to the approved retention policy.
7. Enable dependency update automation according to Fred's preference.
8. Add CodeQL or an equivalent static analysis workflow when supported by the stack and repository visibility.
9. Fail on high severity dependency findings unless an explicit temporary exception exists in `docs/DECISIONS.md`.

## Cloudflare Pages provisioning

Larry shall:

1. Inspect current Cloudflare authentication through Wrangler.
2. Create or reuse the approved Pages project.
3. Set the production branch to main.
4. Configure Direct Upload deployment through GitHub Actions.
5. Attach `galaxy.nixfred.com` through the Pages custom domain process.
6. Verify the resulting DNS record and certificate.
7. Decide whether the default Pages host remains publicly accessible.
8. Configure preview access according to Fred's answer.
9. Record project identifiers, domain behavior, and rollback instructions in `docs/OPERATIONS.md`.

## Caching and headers

1. HTML must receive conservative caching so releases appear promptly.
2. Fingerprinted assets may receive long immutable caching.
3. Security headers must include an approved content security policy, frame protection, content type protection, referrer policy, and permissions policy.
4. Preview behavior must prevent search indexing.
5. The canonical production host must be unambiguous.
6. Headers must not break WebGL, fonts, thumbnails, analytics, or approved external navigation.

## Artifact integrity

1. The artifact deployed to production must match the artifact that passed CI.
2. The artifact must include a build metadata file containing commit identifier, build time, application version, and data snapshot checksum.
3. Production verification shall confirm that the live metadata matches the expected commit.
4. Build output must not contain source secrets, local paths, private URLs, or test fixtures.

## Deployment evidence

A release is complete only when the release report contains:

1. Repository URL.
2. Commit identifier.
3. Pull request URL when applicable.
4. Successful Actions run URL.
5. Preview URL and verification result.
6. Cloudflare deployment identifier.
7. Production Pages URL.
8. Custom domain URL.
9. Browser verification evidence.
10. Test summary.
11. Accessibility summary.
12. Performance summary.
13. Known limitations.
14. Rollback target.
