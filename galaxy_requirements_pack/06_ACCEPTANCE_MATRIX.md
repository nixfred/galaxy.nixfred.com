# NIXFRED GALAXY Acceptance Matrix

A requirement passes only with captured evidence. Build success alone is not evidence for browser behavior.

## Product acceptance

AC001. The root page communicates the site purpose within the first viewport.

Evidence: Browser screenshot and copy review.

AC002. The map contains every eligible entry from the canonical catalog snapshot.

Evidence: Automated count and slug comparison.

AC003. No duplicate project master list is maintained manually.

Evidence: Data flow review showing upstream snapshot plus enrichment merge.

AC004. Every project can be reached through Map, Atlas, search, and a direct project page.

Evidence: Automated route and interaction test.

AC005. Every external project link is HTTPS and opens safely.

Evidence: Data validation and browser test.

## Visual acceptance

AC006. The desktop experience reads as cyber cartography, not a generic star wallpaper.

Evidence: Fred review of the production preview.

AC007. Major labels remain readable at overview scale.

Evidence: Screenshots at required desktop and laptop viewports.

AC008. The active node, related nodes, and active paths remain distinguishable without color alone.

Evidence: Screenshot review and contrast test.

AC009. The initial experience has motion before interaction but does not block any control.

Evidence: Ordered frame gallery and input timing test.

AC010. Reduced motion stops continuous decorative movement.

Evidence: Ordered frame gallery and automated media query test.

AC011. Mobile uses a deliberate simplified interface rather than a shrunken desktop control scheme.

Evidence: Phone viewport interaction recording.

## Interaction acceptance

AC012. Pan, zoom, constrained orbit, selection, deselection, and return to overview work with pointer input.

Evidence: Playwright flow and frame gallery.

AC013. All essential actions work with keyboard only.

Evidence: Playwright keyboard suite.

AC014. Search opens with all required shortcuts and focuses the chosen project.

Evidence: Automated browser test.

AC015. Project selection updates a stable deep link.

Evidence: URL state unit test and direct reload test.

AC016. Direct project links restore the intended selected state.

Evidence: Browser navigation test.

AC017. Sector filters work in Map and Atlas modes.

Evidence: Cross mode browser test.

AC018. Guided tours support start, pause, next, previous, exit, and resume.

Evidence: Ordered browser flow.

AC019. Compare mode explains the relationship path between two projects.

Evidence: Unit test for path calculation and browser test for copy.

AC020. `SURPRISE ME` avoids immediate repeats.

Evidence: Deterministic unit test.

## Fallback and accessibility acceptance

AC021. Atlas is visible and usable when JavaScript is disabled before hydration.

Evidence: Static HTML inspection and browser test.

AC022. Forced WebGL failure automatically opens Atlas mode.

Evidence: Browser test with mocked failure.

AC023. The canvas is not the only accessibility tree representation of the projects.

Evidence: Accessibility tree inspection.

AC024. Focus enters and exits project panels correctly.

Evidence: Keyboard browser test.

AC025. Automated axe checks report zero serious or critical violations on required routes and states.

Evidence: CI report.

AC026. Continuous motion has an obvious pause control.

Evidence: Browser screenshot and interaction test.

AC027. No audio starts without a user action.

Evidence: Browser test and code review.

## Data acceptance

AC028. The upstream snapshot validates against its schema.

Evidence: CI validation output.

AC029. Enrichment records map to known upstream slugs.

Evidence: CI validation output.

AC030. Every relationship references valid nodes and includes type, strength, reason, and provenance.

Evidence: Graph validation report.

AC031. The layout is deterministic for the same catalog revision.

Evidence: Snapshot hash test across repeated builds.

AC032. Unknown dates remain unknown.

Evidence: Schema and content review.

AC033. Catalog synchronization creates a readable change report and never silently discards enrichment.

Evidence: Sync fixture tests.

## Performance acceptance

AC034. The Three.js visualization is lazy loaded.

Evidence: Network trace.

AC035. Shell controls work before the visualization finishes loading.

Evidence: throttled browser test.

AC036. Required bundle budgets pass.

Evidence: CI bundle report.

AC037. Required Lighthouse budgets pass or have a documented approved exception.

Evidence: CI Lighthouse report.

AC038. The renderer pauses when the document is hidden.

Evidence: browser performance test.

AC039. Low capability mode reduces pixel ratio and effect density.

Evidence: unit and browser configuration test.

## Security and privacy acceptance

AC040. No credentials exist in Git history, build output, browser source, or logs.

Evidence: secret scan and manual review.

AC041. Security headers appear on the custom domain.

Evidence: HTTP header smoke test.

AC042. No unapproved third party scripts load.

Evidence: network allowlist test.

AC043. Cloudflare Web Analytics is the only analytics system.

Evidence: network trace and source review.

AC044. Third party actions are pinned to immutable commits.

Evidence: workflow review.

## CI/CD acceptance

AC045. Pull requests run all blocking quality checks.

Evidence: successful workflow run.

AC046. Pull requests receive a verified Cloudflare preview deployment.

Evidence: GitHub Deployment record and preview smoke test.

AC047. The exact tested artifact is used for deployment whenever practical.

Evidence: artifact digest in job summary.

AC048. Merging to `main` triggers production deployment without a permission prompt.

Evidence: successful main workflow.

AC049. Production is marked successful only after the custom domain passes smoke tests.

Evidence: workflow dependency and job summary.

AC050. `/build.json` reports the deployed commit and catalog revision.

Evidence: production HTTP check.

AC051. A previous successful Cloudflare deployment remains available as a rollback target.

Evidence: deployment inventory.

AC052. A simulated failed smoke check exercises the rollback runbook in a nonproduction or controlled test.

Evidence: runbook test record.

## Launch acceptance

AC053. `galaxy.nixfred.com` has active TLS and returns the production build.

Evidence: browser and command line verification.

AC054. Canonical metadata points to the custom domain.

Evidence: rendered HTML check.

AC055. nixfred.com receives a new catalog entry only after production verification.

Evidence: separate pull request and production card test.

AC056. The nixfred.com card opens the correct production domain.

Evidence: browser test from the live homepage.

AC057. README, architecture, data model, test plan, operations guide, and CI/CD documentation match the final implementation.

Evidence: documentation review.

AC058. Fred reviews the final production experience and records any requested follow up as issues, not as hidden untracked notes.

Evidence: GitHub issue list or explicit acceptance note.
