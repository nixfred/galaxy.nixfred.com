# ARCHITECTURE AND PROFESSIONAL FILE PLAN

## Recommended application stack

The default recommendation is:

1. Vite for the build system.
2. React with strict TypeScript for application structure.
3. Three.js through React Three Fiber for the spatial scene.
4. A small explicit state store for selected project, filters, camera mode, timeline state, preferences, and URL state.
5. Zod or an equivalent runtime schema validator for project and relation data.
6. Vitest for unit and data tests.
7. Playwright for browser behavior, keyboard, responsive, and smoke tests.
8. Axe integration for automated accessibility checks.
9. Bun for package management, scripts, and the lockfile unless Fred selects npm.
10. Wrangler for Cloudflare Pages preview and production deployment.

The final rendering engine choice remains an interview decision. If broad mobile compatibility matters more than full spatial depth, PixiJS or a custom Canvas renderer may be a better choice. Larry shall document the decision before implementation.

## Data architecture

Use one canonical portfolio identity source and one galaxy enrichment source.

Recommended model:

1. `src/data/portfolio.snapshot.json` contains the validated canonical project records imported from the approved source.
2. `src/data/galaxy.json` contains Galaxy-specific information keyed by stable project identifier.
3. `scripts/syncPortfolio.ts` updates the snapshot from the canonical source.
4. `scripts/buildGraph.ts` joins the records, validates every reference, calculates derived values, and writes a generated graph artifact.
5. The application imports only the generated validated graph artifact.
6. CI fails on missing identifiers, duplicate URLs, unknown relations, self relations, invalid dates, inaccessible required assets, or orphaned enrichment records.
7. A synchronization report describes additions, removals, and changed records.

## Proposed repository structure

```text
galaxy.nixfred.com/
  .github/
    workflows/
      ci.yml
      preview.yml
      production.yml
      rollback.yml
      scheduled_checks.yml
    CODEOWNERS
    dependabot.yml
    PULL_REQUEST_TEMPLATE.md
  docs/
    PRD.md
    ARCHITECTURE.md
    ART_DIRECTION.md
    DATA_MODEL.md
    CICD.md
    ACCESSIBILITY.md
    SECURITY.md
    OPERATIONS.md
    CONTENT_GUIDE.md
    DECISIONS.md
    RELEASE_REPORT.md
    adr/
      0001_renderer.md
      0002_data_source.md
      0003_deployment_model.md
  public/
    favicon.svg
    icon.svg
    manifest.webmanifest
    robots.txt
    sitemap.xml
    _headers
    _redirects
    assets/
      audio/
      fonts/
      icons/
      images/
      textures/
  scripts/
    syncPortfolio.ts
    validateData.ts
    buildGraph.ts
    generateSitemap.ts
    checkLinks.ts
    checkBudget.ts
    releaseReport.ts
  src/
    app/
      App.tsx
      routes.tsx
      store.ts
      urlState.ts
    components/
      AppShell.tsx
      CommandPalette.tsx
      DetailPanel.tsx
      ErrorBoundary.tsx
      LoadingSequence.tsx
      MapControls.tsx
      SearchPanel.tsx
      SectorLegend.tsx
      SettingsPanel.tsx
      TimelineControls.tsx
      TourControls.tsx
    scene/
      GalaxyScene.tsx
      CameraController.tsx
      CoreNode.tsx
      ProjectStar.tsx
      RelationLine.tsx
      SectorField.tsx
      SelectionHalo.tsx
      SessionPath.tsx
      ParticleField.tsx
      effects.ts
      performance.ts
    data/
      portfolio.snapshot.json
      galaxy.json
      tours.json
      schema.ts
      generatedGraph.json
    hooks/
      useDeviceProfile.ts
      useKeyboard.ts
      useReducedMotion.ts
      useSceneReady.ts
      useUrlState.ts
    lib/
      analytics.ts
      graph.ts
      math.ts
      metadata.ts
      random.ts
      storage.ts
    pages/
      HomePage.tsx
      NotFoundPage.tsx
      TextAtlasPage.tsx
    styles/
      designTokens.css
      global.css
      panels.css
    tests/
      fixtures/
      graph.test.ts
      schema.test.ts
      urlState.test.ts
      accessibility.spec.ts
      navigation.spec.ts
      responsive.spec.ts
      smoke.spec.ts
    main.tsx
    viteEnv.d.ts
  .editorconfig
  .gitignore
  CLAUDE.md
  LICENSE
  README.md
  bun.lock
  eslint.config.js
  index.html
  package.json
  playwright.config.ts
  tsconfig.json
  vite.config.ts
  vitest.config.ts
  wrangler.toml
```

## Purpose of the major files

### `CLAUDE.md`

Contains repository specific instructions for Larry, required commands, architectural boundaries, acceptance gates, deployment rules, and forbidden shortcuts.

### `README.md`

Explains the product, local setup, command inventory, data update process, test process, deployment process, and project links.

### `docs/PRD.md`

The approved product requirements with no unanswered discovery questions.

### `docs/ARCHITECTURE.md`

Documents renderer choice, state boundaries, data flow, browser support, fallback design, performance strategy, and deployment topology.

### `docs/DECISIONS.md`

Contains every approved interview answer and any implementation decision that changes scope or behavior.

### `docs/adr/`

Contains one short architecture decision record for each major choice that future Fred should not have to rediscover.

### `public/_headers`

Defines production security, caching, and content handling headers supported by Cloudflare Pages.

### `public/_redirects`

Defines canonical host behavior and any safe route redirects.

### `src/data/galaxy.json`

The human maintained visual and relationship metadata for every star.

### `scripts/validateData.ts`

Provides a deterministic CI gate for content integrity.

### `scripts/checkBudget.ts`

Fails CI when approved JavaScript, asset, or loading budgets are exceeded.

### `src/pages/TextAtlasPage.tsx`

Provides the accessible structured alternative to the spatial map and the fallback for unsupported graphics environments.

### GitHub workflow files

The workflows separate validation, preview, production, rollback, and scheduled maintenance so that permissions and failure behavior remain easy to understand.
