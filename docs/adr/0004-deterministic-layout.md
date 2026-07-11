# 0004. Deterministic seeded layout with manual anchors

## Status

Accepted.

## Context

FR006 requires that the same catalog revision produce the same layout on every load and in every test run. FR008 allows major project positions to be manually authored while unspecified nodes use seeded placement around their sector anchor. Interview question 61 rejected fully algorithmic placement in favor of deterministic category anchors and seeded placement, with manual coordinates reserved for major nodes and tour composition. AC031 requires this to be verifiable by a snapshot hash test across repeated builds.

## Decision

Sector anchors are fixed, hand placed coordinates stored in `sectors.json`. Individually important nodes may receive a manual coordinate override in `galaxy.enrichment.json`. Every other node receives a position from a deterministic pseudo random function seeded by its own stable slug and its sector anchor, computed once at build time inside `src/lib/graph/layout.ts` and written into the generated graph artifact, never recomputed client side and never dependent on insertion order or the current time.

## Consequences

Adding a new project never causes unrelated stars to visually jump, because each node's seed is a function of its own slug, not of the list it happens to be in. Visual regression screenshots and Playwright position assertions become trustworthy across CI runs, satisfying AC031, because two builds of the same catalog revision are byte identical in their computed positions. Fred, or Larry during authoring, can art direct a small number of important nodes by hand without needing to place hundreds of minor ones individually. The seeded algorithm and its inputs become a compatibility contract: changing the seed function, the anchor set, or what counts as a stable slug invalidates every committed visual regression snapshot and must be treated as a deliberate, documented change, not a casual refactor.
