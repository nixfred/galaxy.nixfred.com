# 0005. Atlas as a first class mode, not a degraded fallback

## Status

Accepted.

## Context

The execution directive states as a non negotiable principle that the WebGL canvas is never the only way to reach the project content. FR049 to FR053 specify Atlas as a complete HTML representation of the catalog, reachable at `/atlas/` and from a persistent control, and required to become the automatic destination when WebGL cannot initialize. AR008 requires an HTML list representation for screen readers rather than an attempt to narrate raw canvas geometry. AC021 to AC023 require Atlas to work with JavaScript disabled before hydration, to be reached automatically on a forced WebGL failure, and for the canvas to never be the only accessibility tree representation of the projects.

## Decision

Atlas is an ordinary static Astro route, built from the same generated graph artifact and the same `merge.ts` and `filters.ts` logic the Map uses, so it cannot drift out of sync with the spatial experience. It is linked from a persistent, always visible control regardless of whether WebGL is supported on the current device, not only surfaced after something fails. It is also the automatic destination when WebGL initialization fails or the graphics context is lost, described in `docs/ARCHITECTURE.md` section 6.

## Consequences

Every new interactive capability, filters, search, tours, must either ship a working Atlas equivalent or explicitly document in `docs/DECISIONS.md` why it is Map only; there is no implicit assumption that Atlas will eventually catch up. Atlas becomes a first tier test surface, covered by its own Playwright spec and its own axe accessibility pass, rather than something exercised only incidentally through the failure path. The non negotiable principle that the canvas is never the only content path is enforced by routing and by sharing one data and filtering code path between Map and Atlas, rather than relying on developer discipline to keep two independent implementations aligned. The cost is that Atlas cannot be treated as a lightweight afterthought: it carries real ongoing implementation and test weight equal to the Map for every shared capability.
