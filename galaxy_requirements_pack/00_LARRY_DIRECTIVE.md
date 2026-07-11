# EXECUTION DIRECTIVE FOR LARRY

## Authority

You have the tools, authorization, and permissions required to build and ship this project.

Use `gh` for GitHub work and `wrangler` for Cloudflare work. Do not ask whether you can create the repository, configure Actions, create the Cloudflare Pages project, attach the domain, deploy previews, deploy production, or verify the live site. You can and shall perform those tasks.

Do not stop at a local prototype. The deliverable is a professional, version controlled, tested, documented, deployed application at `galaxy.nixfred.com`.

## Mission

Create NIXFRED GALAXY, an interactive visual atlas of Fred Nix's work. Every project becomes a star. Related projects form visible star systems. Existing portfolio sectors become regions of space. Visitors can explore the complete body of work through spatial movement, search, filters, chronology, guided tours, and project detail views.

The experience must feel alive, personal, technically credible, and unlike a generic portfolio grid with stars pasted behind it.

## Required execution behavior

1. Read every file in this requirements pack before choosing the implementation.
2. Convert Fred's interview answers into explicit decisions in `docs/DECISIONS.md`.
3. Create the complete professional repository structure defined in the architecture file.
4. Build the application with strict TypeScript and a reproducible locked dependency graph.
5. Implement automated tests before production deployment.
6. Create the GitHub repository under the approved owner.
7. Configure protected production behavior for the main branch.
8. Configure GitHub Actions for validation, preview deployment, production deployment, and rollback procedure.
9. Create or reuse the Cloudflare Pages project with the approved project name.
10. Attach `galaxy.nixfred.com` through the Cloudflare Pages custom domain process.
11. Deploy a preview and verify it in a real browser before production.
12. Deploy production only after all blocking checks pass.
13. Verify the custom domain, page rendering, interactions, responsive behavior, headers, metadata, links, keyboard controls, reduced motion behavior, and error handling.
14. Record exact evidence in `docs/RELEASE_REPORT.md`.
15. Return the repository URL, Actions run URL, preview URL, production URL, commit identifier, release identifier, and verification summary.

## Non negotiable principles

1. One canonical project identity per project.
2. No duplicated hard coded project lists across UI components.
3. Every project relation must have a documented meaning.
4. Every visual effect must degrade gracefully.
5. The experience must remain usable without audio.
6. Reduced motion must be a first class mode.
7. Mobile is not a shrunken desktop scene. It receives a deliberate interaction model.
8. Production credentials must never appear in source, logs, screenshots, or generated artifacts.
9. A failed production verification must fail the deployment job and trigger the documented rollback path.
10. No claim of completion without live browser evidence.
