# Professional Repository File Manifest

## Recommended repository tree

```text
galaxy.nixfred.com/
  .github/
    CODEOWNERS
    dependabot.yml
    pull_request_template.md
    ISSUE_TEMPLATE/
      bug.yml
      feature.yml
      config.yml
    workflows/
      ci.yml
      preview.yml
      deploy.yml
      sync-catalog.yml
      security.yml
  .vscode/
    extensions.json
    settings.json
  docs/
    PRD.md
    ARCHITECTURE.md
    ART_DIRECTION.md
    INTERACTION_SPEC.md
    DATA_MODEL.md
    ACCESSIBILITY.md
    TEST_PLAN.md
    CI_CD.md
    OPERATIONS.md
    RELEASE_CHECKLIST.md
    DECISIONS.md
    adr/
      0001-astro-and-three.md
      0002-direct-upload.md
      0003-canonical-catalog.md
      0004-deterministic-layout.md
      0005-atlas-fallback.md
  public/
    _headers
    _redirects
    favicon.svg
    icon.svg
    manifest.webmanifest
    robots.txt
    sitemap-index.xml
    build.json
    og/
      default.png
    textures/
      sector-noise.webp
  scripts/
    sync-catalog.ts
    validate-catalog.ts
    validate-graph.ts
    generate-build-info.ts
    check-links.ts
    report-bundle.ts
  src/
    components/
      shell/
        SiteHeader.astro
        SiteFooter.astro
        LoadingStatus.astro
        HelpDialog.astro
      galaxy/
        GalaxyStage.astro
        MapControls.astro
        SectorLegend.astro
        ProjectPanel.astro
        MobileProjectSheet.astro
        ComparePanel.astro
        TourControls.astro
        TimelineControls.astro
      atlas/
        AtlasGrid.astro
        AtlasFilters.astro
        AtlasProjectCard.astro
      search/
        CommandPalette.astro
      seo/
        SeoHead.astro
    content/
      projects/
        <slug>.md
    data/
      portfolio.snapshot.json
      galaxy.enrichment.json
      relationships.json
      sectors.json
      tours.json
    layouts/
      BaseLayout.astro
      ProjectLayout.astro
    lib/
      catalog/
        merge.ts
        schema.ts
        slugs.ts
        types.ts
      graph/
        camera.ts
        controller.ts
        layout.ts
        lines.ts
        nodes.ts
        quality.ts
        renderer.ts
        selection.ts
        types.ts
      state/
        deepLink.ts
        filters.ts
        sessionPins.ts
        store.ts
      accessibility/
        announcements.ts
        focus.ts
        motion.ts
      analytics.ts
      buildInfo.ts
    pages/
      index.astro
      atlas/
        index.astro
      project/
        [slug].astro
      404.astro
    styles/
      tokens.css
      global.css
      shell.css
      galaxy.css
      atlas.css
      print.css
    env.d.ts
    content.config.ts
  tests/
    unit/
      catalog-merge.test.ts
      graph-integrity.test.ts
      layout-determinism.test.ts
      deep-link.test.ts
      filters.test.ts
    e2e/
      shell.spec.ts
      explore.spec.ts
      search.spec.ts
      keyboard.spec.ts
      tours.spec.ts
      compare.spec.ts
      atlas.spec.ts
      mobile.spec.ts
      reduced-motion.spec.ts
      webgl-fallback.spec.ts
      deep-links.spec.ts
      security-headers.spec.ts
    visual/
      desktop.spec.ts
      tablet.spec.ts
      mobile.spec.ts
      atlas.spec.ts
      reduced-motion.spec.ts
    fixtures/
      catalog-valid.json
      catalog-invalid.json
  .bun-version
  .editorconfig
  .gitignore
  .prettierignore
  .prettierrc.mjs
  CLAUDE.md
  CHANGELOG.md
  CONTRIBUTING.md
  LICENSE
  README.md
  SECURITY.md
  astro.config.mjs
  bun.lock
  eslint.config.mjs
  package.json
  playwright.config.ts
  tsconfig.json
  vitest.config.ts
  wrangler.jsonc
```

## File responsibilities

### Root contracts

1. `CLAUDE.md`

The durable design law for Larry. It records accepted interview decisions, nonnegotiable behavior, deployment authority, writing rules, visual rules, and the standing order to merge and deploy when green.

2. `README.md`

Public project overview, local setup, commands, architecture summary, deployment badge, production link, accessibility statement, and source data explanation.

3. `CHANGELOG.md`

Human readable release history. Record meaningful visual, data, behavior, and deployment changes.

4. `SECURITY.md`

Responsible vulnerability reporting, supported version, and privacy expectations.

5. `CONTRIBUTING.md`

Development setup, branch policy, test expectations, data editing instructions, and pull request checklist.

6. `LICENSE`

MIT code license unless Fred decides otherwise.

### Build configuration

1. `package.json`

Pinned package manager, scripts, dependencies, and metadata.

Required scripts:

```text
dev
build
preview
format
format:check
lint
typecheck
astro:check
data:sync
data:validate
test
test:unit
test:e2e
test:a11y
test:visual
test:performance
check:links
check:all
```

2. `.bun-version`

Pins the local and CI Bun version.

3. `bun.lock`

Provides deterministic dependency resolution.

4. `astro.config.mjs`

Static output, canonical site URL, sitemap integration, Vite chunk rules, and build configuration.

5. `tsconfig.json`

Strict TypeScript and project aliases.

6. `eslint.config.mjs`

JavaScript, TypeScript, Astro, accessibility, and import rules.

7. `.prettierrc.mjs`

Formatting for Astro, TypeScript, JSON, CSS, Markdown, and YAML.

8. `playwright.config.ts`

Browser matrix, viewport projects, local web server, screenshots, traces, retries, and artifact retention.

9. `vitest.config.ts`

Unit tests, coverage, aliases, and deterministic environment settings.

10. `wrangler.jsonc`

Cloudflare Pages project name, output directory, and future binding configuration. It becomes source controlled Cloudflare configuration.

### Data files

1. `portfolio.snapshot.json`

Committed copy of the canonical nixfred.com catalog. Never hand edit except through the sync script.

2. `galaxy.enrichment.json`

Galaxy-specific fields keyed by stable project slug.

3. `relationships.json`

Typed edges with strength, reason, and provenance.

4. `sectors.json`

Sector labels, color tokens, anchor positions, ordering, and copy.

5. `tours.json`

Guided tour definitions and ordered camera stops.

6. `src/content/projects/<slug>.md`

Optional long description and editorial content for crawlable detail pages. Frontmatter remains schema validated.

### Core app files

1. `GalaxyStage.astro`

Owns the canvas mount, loading boundary, accessible fallback hook, and lazy import of the renderer.

2. `renderer.ts`

Creates the Three.js renderer, scene, post processing limits, resize behavior, animation loop, and cleanup.

3. `layout.ts`

Produces deterministic coordinates from sector anchors, manual overrides, and a seeded placement algorithm.

4. `nodes.ts`

Creates efficient star node geometry, hit targets, labels, state changes, and quality levels.

5. `lines.ts`

Creates relationship paths and active signal animation.

6. `camera.ts`

Constrained camera navigation, focus transitions, tour positions, reduced motion changes, and mobile behavior.

7. `controller.ts`

Connects pointer, keyboard, search, filters, URL state, panels, tours, and renderer state.

8. `quality.ts`

Chooses desktop, mobile, low power, and reduced data rendering budgets.

9. `AtlasGrid.astro`

Complete noncanvas catalog interface.

10. `CommandPalette.astro`

Search and command execution.

11. `ProjectPanel.astro`

Desktop project details and relationship actions.

12. `MobileProjectSheet.astro`

Mobile project details with accessible focus and touch behavior.

13. `[slug].astro`

Generates crawlable detail pages for every public project.

### Public platform files

1. `public/_headers`

Security, caching, and content policy headers for Cloudflare Pages.

2. `public/_redirects`

Canonical and compatibility redirects if needed.

3. `manifest.webmanifest`

Install metadata and theme details. Offline behavior is not required unless approved later.

4. `robots.txt`

Search crawler policy and sitemap location.

5. `build.json`

Generated during CI. Do not hand edit.

6. `og/default.png`

Primary social card.

### Scripts

1. `sync-catalog.ts`

Fetches the upstream catalog, validates it, preserves enrichment mappings, and writes the committed snapshot.

2. `validate-catalog.ts`

Checks upstream and merged project data.

3. `validate-graph.ts`

Checks relationship endpoints, duplicate edges, self edges, unsupported relationship types, missing reasons, disconnected required nodes, and tour references.

4. `generate-build-info.ts`

Writes the public build metadata file.

5. `check-links.ts`

Checks generated internal links and optionally performs a controlled external link report.

6. `report-bundle.ts`

Produces bundle and asset budgets for CI summaries.

### Documentation

1. `docs/PRD.md`

Final product goals, users, scope, journeys, requirements, and acceptance criteria.

2. `docs/ARCHITECTURE.md`

Application boundaries, rendering architecture, data flow, state flow, deployment architecture, and diagrams.

3. `docs/ART_DIRECTION.md`

Palette, typography, spatial rules, motion language, effects budget, label hierarchy, and anti patterns.

4. `docs/INTERACTION_SPEC.md`

Exact pointer, keyboard, touch, panel, tour, timeline, compare, and command palette behavior.

5. `docs/DATA_MODEL.md`

Schemas, examples, relationship definitions, source ownership, sync behavior, and migration rules.

6. `docs/ACCESSIBILITY.md`

Keyboard map, focus rules, reduced motion, screen reader approach, fallback behavior, and test matrix.

7. `docs/TEST_PLAN.md`

Unit, integration, browser, visual, accessibility, motion, performance, and production smoke coverage.

8. `docs/CI_CD.md`

Workflow triggers, jobs, secrets, permissions, environments, artifacts, deployment commands, and release policy.

9. `docs/OPERATIONS.md`

First deployment, custom domain, smoke checks, rollback, incident response, and catalog sync operations.

10. `docs/RELEASE_CHECKLIST.md`

A concise final gate for Larry.

11. `docs/DECISIONS.md`

Fred's interview answers and later explicit decisions.

12. `docs/adr/*.md`

Durable architectural choices and their consequences.
