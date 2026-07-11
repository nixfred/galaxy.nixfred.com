# Visual regression baselines

These `*-darwin.png` baselines are the reference-device baselines per decision
F29: Fred's MacBook Pro (Apple M4 Max) is the canonical desktop. Playwright
suffixes snapshots by platform, so these match only on darwin.

## Running

```bash
bun run test:visual              # compare against committed darwin baselines
bunx playwright test --project=visual --update-snapshots   # regenerate
```

## Why this is not in ci.yml

`ci.yml` runs on ubuntu, where WebGL raster and font hinting differ from
darwin, so darwin baselines cannot pass there. Visual regression is therefore
a reference-device gate, executed at the G5 hardening gate on the reference
Mac and its evidence recorded in the gate commit, consistent with the
GATES.md PR010 pattern (reference-device confirmation is a G5 check, not a CI
blocker). If a Linux baseline set is ever wanted for CI, generate it once in
the official `mcr.microsoft.com/playwright` container and commit the
`*-linux.png` companions alongside these.

## What is masked

The map's WebGL canvas is masked in the shell snapshot: its raster is
machine-dependent even on the same platform (GPU, driver). The deterministic
layout guarantees star positions, but pixel raster is not asserted here; the
motion-evidence and pixel-truth suites cover the canvas behaviorally.
