# 0001. Astro over React and React Three Fiber

## Status

Accepted.

## Context

`03_ARCHITECTURE_AND_FILES.md` in the requirements pack recommended Vite, React with strict TypeScript, and Three.js through React Three Fiber, with the final rendering engine choice left as an interview decision. That document is now superseded and kept only as historical reference. The accepted stack is Astro with strict TypeScript and static output, with Three.js loaded directly and lazily, no React runtime involved.

The product requirements this decision has to satisfy: FR001 to FR003 require a usable HTML shell that renders before the visualization bundle loads and keeps working if that bundle fails. FR049 to FR053 and AC021 to AC023 require Atlas, the accessible text representation of the catalog, to work with JavaScript disabled before hydration. FR054 to FR056 require a statically crawlable page per project. PR004 caps initial shell JavaScript at 150 KB compressed, and PR005 caps the lazy visualization chunk at 300 KB compressed.

## Decision

Build the application shell, Atlas, and per project pages as Astro components rendered to static HTML at build time. Load Three.js only inside a single hydrated island, `GalaxyStage.astro`, through a dynamic import gated on WebGL feature detection. Do not introduce React, React Three Fiber, or any other UI framework runtime.

## Consequences

A React and React Three Fiber component ecosystem is not available; interactive islands are authored as hand written vanilla TypeScript modules attached through script tags and dynamic imports, described in `docs/ARCHITECTURE.md` sections 2 and 3. State management is a small custom publish and subscribe store rather than a framework state library. Atlas, the shell, and every project page are static HTML by construction, which satisfies the crawlability and no JavaScript fallback requirements without a separate rendering mode to maintain. The shell and visualization budgets in PR004 and PR005 are achievable because no framework runtime cost is paid by pages that do not need one. The cost is that testing leans more heavily on Playwright for interactive behavior and Vitest for logic, since there is no component testing library for a framework that is not present.
