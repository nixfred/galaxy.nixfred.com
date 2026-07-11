# 0003. Upstream portfolio.json as the single canonical catalog

## Status

Accepted.

## Context

Interview question 49 asks whether `nixfred/nixfred.github.io/portfolio.json` should remain the upstream project catalog, with the recommended answer that Galaxy must never become a competing master list. AC003 requires that no duplicate project master list is maintained manually. DR001, DR002, and DR010 require the catalog to be imported from upstream, stored as a committed snapshot, and never fetched live during a production build.

## Decision

`portfolio.snapshot.json` is a committed, read only mirror of the upstream catalog, refreshed only by a scheduled sync workflow that opens a pull request (interview question 51). Every Galaxy specific fact, status, launch date, weight, technologies, repository URL, manual coordinates, tour membership, relationships, lives only in Galaxy owned files keyed by a stable slug, described in `docs/DATA_MODEL.md`. Galaxy never edits, forks, or maintains a second copy of project identity data, and production builds never make a network call to fetch the catalog.

## Consequences

Adding a brand new project to the body of work always starts on nixfred.com, or requires a coordinated same day update to both repositories; Galaxy alone cannot introduce a project that does not exist upstream. Galaxy is permanently a read only consumer of upstream identity data, which keeps the two sites from ever presenting contradictory facts about the same project. Upstream schema drift or an unreachable sync is caught by the DR008 validation gate rather than allowed to silently corrupt the snapshot. The cost is an extra coordination step whenever a new project needs to appear quickly in Galaxy: it must exist upstream first.
