# NIXFRED GALAXY Requirements Pack

This pack is the working contract for galaxy.nixfred.com.

It contains the authority directive for Claude Code Larry, the design interview, the product requirements, the CI/CD contract, the professional repository file manifest, and the acceptance matrix.

## Use order

1. Fred answers `01_INTERVIEW.md` by listing only decisions that differ from the recommended defaults.
2. Update the draft requirements with those answers.
3. Give the final pack to Larry.
4. Larry creates the repository, app, Cloudflare Pages project, custom domain, workflows, tests, and production deployment.
5. Larry updates nixfred.com only after the custom domain passes production verification.

## Fixed targets

1. Production domain: `galaxy.nixfred.com`
2. GitHub repository: `nixfred/galaxy.nixfred.com`
3. Cloudflare Pages project: `galaxy-nixfred-com`
4. Production branch: `main`
5. Build output: `dist`
6. Package manager: Bun
7. Application framework: Astro with strict TypeScript
8. Visualization engine: Three.js loaded only when interactive mode is used
9. Hosting model: Cloudflare Pages Direct Upload through GitHub Actions and Wrangler
