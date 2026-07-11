# Execution Directive for Claude Code Larry

## Mission

Build, test, publish, and operate NIXFRED GALAXY at `galaxy.nixfred.com`.

This is a production application, not a prototype, screenshot, or isolated visual experiment. It must be useful, navigable, accessible, fast, testable, and maintainable.

## Authority

1. You are authorized to create the GitHub repository `nixfred/galaxy.nixfred.com`.
2. You are authorized to create the Cloudflare Pages project `galaxy-nixfred-com`.
3. You are authorized to configure the production branch as `main`.
4. You are authorized to configure GitHub Actions, repository variables, repository secrets, environments, branch rules, Dependabot, and deployment records.
5. You are authorized to attach and verify `galaxy.nixfred.com` as the production custom domain.
6. You are authorized to use `gh`, `git`, `bun`, `wrangler`, Playwright, and every other installed development and verification tool required by this contract.
7. You are authorized to commit, push, create pull requests, merge passing work, deploy previews, deploy production, and roll back a failed production release.
8. Do not ask whether you can perform an authorized action. You can, and you shall.
9. Authentication checks are required verification, not permission requests. Run `gh auth status`, `wrangler whoami`, `git remote -v`, and the relevant project and secret inventory commands before making changes.
10. Never print, commit, echo, or expose credentials.

## Operating law

1. The tests are the release gate.
2. A green release is deployed without asking Fred for an additional approval.
3. A failed release is fixed or rolled back without asking whether rollback is allowed.
4. Production is not considered complete until the custom domain is browser verified.
5. A single screenshot is not proof of animation, camera movement, hover behavior, loading behavior, or a guided flow. Verify motion with an ordered frame sequence or frame scrub artifact.
6. The WebGL canvas is never the only way to reach the project content.
7. The application must work in Atlas mode when WebGL is unavailable, motion is reduced, JavaScript initialization fails, or the user chooses the accessible view.
8. The repository must remain safe for public visibility. Inspect every staged change for private data before committing.
9. Do not invent project dates, client facts, credentials, traffic numbers, professional claims, or technical relationships that are not supported by the source catalog or Fred's decisions.
10. When a value is unknown, use an explicit pending field or omit the feature. Never fabricate the missing value.

## Required production targets

1. Repository: `nixfred/galaxy.nixfred.com`
2. Cloudflare Pages project: `galaxy-nixfred-com`
3. Production domain: `galaxy.nixfred.com`
4. Production branch: `main`
5. Build output: `dist`
6. CI runtime: Bun pinned in source control
7. Cloudflare deployment: Wrangler Direct Upload
8. Production deployment trigger: successful push to `main`
9. Preview deployment trigger: successful pull request checks
10. Upstream catalog: `nixfred/nixfred.github.io/portfolio.json`

## Definition of done

The project is done only when all acceptance criteria in `05_ACCEPTANCE_MATRIX.md` pass, the production site is live on the custom domain, the build revision is visible, the fallback Atlas works, the visual and interaction evidence has been reviewed, and nixfred.com contains a verified card linking to the new production site.
