# 0002. Wrangler Direct Upload from Actions over Cloudflare Pages git integration

## Status

Accepted.

## Context

Cloudflare Pages supports two deployment models: a git integration where Cloudflare rebuilds the site itself on every push, or Direct Upload, where an already built artifact is pushed to Cloudflare through Wrangler. The requirements pack fixes the deployment mechanism as Wrangler Direct Upload driven by GitHub Actions (`README.md`, `00_LARRY_EXECUTION_DIRECTIVE.md`). AC047 requires that the exact tested artifact is used for deployment whenever practical, and the CI/CD requirements separate validation, preview, production, and rollback into distinct workflow responsibilities with least privilege secret access per job.

## Decision

GitHub Actions builds and validates the artifact once in `ci.yml`, and that same artifact is what `preview.yml` and `deploy.yml` upload to Cloudflare Pages through Wrangler. Cloudflare's own git integration and its independent build step are not used.

## Consequences

Because Cloudflare never rebuilds the site itself, there is no way for a Cloudflare side build to drift from the artifact that passed every CI gate: the artifact identity guarantee in AC047 becomes structural rather than a hope that two independent builds happen to match. Preview deployments can be tied precisely to a pull request's branch and commit. Production Cloudflare credentials, `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN`, are scoped to the jobs that need them and are never exposed to Cloudflare's own build system or to untrusted fork pull request execution. Rollback becomes a matter of redeploying a previously known good artifact identifier through Wrangler rather than depending on Cloudflare's git integration rollback UI. The cost is that the CI workflow itself owns the build step and must upload the artifact correctly; there is no Cloudflare side fallback build if the workflow is misconfigured.
