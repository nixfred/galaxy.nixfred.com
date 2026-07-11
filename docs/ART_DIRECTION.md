# NIXFRED GALAXY Art Direction

Status: Final. This document merges and supersedes `galaxy_requirements_pack/02_ART_DIRECTION.md` and `galaxy_requirements_pack/03_ART_DIRECTION_DRAFT.md`. Where the two drafts disagreed, the resolution is stated inline and in the Contradictions section at the end. Requirement IDs (FR, VR, AR, PR) reference `galaxy_requirements_pack/02_PRODUCT_AND_FUNCTIONAL_REQUIREMENTS_DRAFT.md`.

## Creative thesis

NIXFRED GALAXY is not a galaxy background behind a portfolio grid. It is Fred Nix's public body of work translated into an explorable cosmology.

The visual language combines four ideas at once:

1. A scientific star atlas.
2. A mission control interface.
3. A private terminal.
4. A personal memory map.

The result must feel precise enough for an infrastructure architect, strange enough to belong only to NIXFRED, and calm enough that the work stays readable. If a screen from this site could be mistaken for a stock space wallpaper, a streaming service loading screen, or a game's star chart, it has failed. See Anti-imitation rule below.

Scene feel (F6 in `docs/DECISIONS.md`): a scientific base, punctuated by cinematic moments, carrying a deliberate cyberpunk streak, and unambiguously dark. This tunes the four ideas above, it does not replace them. The calm is in the readability of the work, never in a muted or timid surface.

## Opening scene

The first frame is nearly black. Motion and text resolve in this order:

1. A small system line resolves first: `NIXFRED GALAXY // CATALOG ONLINE`.
2. The primary statement follows in restrained luminous type: `Every project. One connected system.`
3. Behind the text, the map is already alive. Distant sector clouds drift slowly. A few major nodes pulse. Thin lines briefly trace the structure, then recede, so the visitor sees that a system exists before choosing to enter it.

The title arrival is a cinematic event, a designed moment with real presence (F10 in `docs/DECISIONS.md`), not a quiet fade-in. It still honors the hard envelope stated below: interactive fast, immediately skippable, visitor input never blocked while it plays.

Opening controls, present as soon as the shell renders (FR002):

1. `ENTER THE MAP`
2. `START A TOUR`
3. `OPEN ATLAS`

The startup sequence finishes in about 1.5 seconds and never blocks interaction (accepted default, `01_INTERVIEW.md` Q20). It is skippable immediately. Repeat visits use a shortened entrance unless the visitor explicitly requests the full sequence.

The loading state is part of the art direction, not a placeholder. It reports real, sequential states, never a fake percentage (VR008):

1. Catalog loaded.
2. Renderer ready.
3. Labels ready.
4. Map online.

Each state may render as a short terminal-style line so the boot sequence itself reads as diegetic system output, consistent with the private-terminal half of the creative thesis. If any state fails to resolve, the shell remains usable and the failure routes to the Atlas fallback (see Error handling in `INTERACTION_SPEC.md`, FR052).

## Spatial composition

The map is constrained 2.5D (accepted default, `01_INTERVIEW.md` Q13; FR005).

1. The scene has real depth and parallax.
2. The visitor can pan, zoom, and orbit within safe limits. The camera cannot roll. Pitch is limited so labels remain readable at all times.
3. Project clusters occupy stable, deterministic sector regions (FR006, FR007). The same catalog revision produces the same layout on every load and in every test run.
4. The center holds the NIXFRED core node. It is the navigation hub, not a normal project star (accepted default, `01_INTERVIEW.md` Q10). Clicking it opens the About and identity panel, which links back to nixfred.com, closing the loop (F14 in `docs/DECISIONS.md`). Quiet monospace live totals sit near the core (project count, sector count, status), derived from real data only (F15).
5. The map always has a reliable route back to overview.

This avoids two failure modes. A flat diagram would undersell the concept. A fully free 3D space would become a navigation tax the visitor pays on every visit.

### Sector characters

Six sectors orbit or cluster around the NIXFRED core, inheriting the existing nixfred.com sector color logic (accepted default, `01_INTERVIEW.md` Q15). Each sector is a region with its own visual language, not a box with a label on it.

**IT.** Character: sharp, alert, exposed, technical. Color: coral. Visual language: angular routes, tighter node spacing, occasional warning glyphs on exposed or externally reachable work.

**Labs.** Character: curious, experimental, alive. Color: green. Visual language: broader orbits, generative geometry, more spatial play between nodes.

**Work.** Character: credible, architectural, operational. Color: cyan. Visual language: cleaner paths, grid-aligned placement, stronger and more persistent labels.

**Signal.** Character: active intelligence, memory, synthesis. Color: amber. Visual language: moving packets along relationship lines, branching connections, subtle pulse rhythms. (`SIGNAL` is the sector name only. It is never used as a navigation label; see Interface vocabulary and Contradictions below.)

**Clients.** Character: distinct people and real outcomes. Color: violet. Visual language: restrained framing, clear separation between Fred's authorship and the client's identity. Client work reads as polished and grounded, never flashier than the client's own brand would tolerate.

**Personal.** Character: memory, family, reflection, care. Color: soft silver. Visual language: slower motion, more negative space, less interface noise. Personal and memorial work feels protected and quiet, never treated as entertainment (repo-wide rule, see canonical ruling 4: visual restraint on personal and memorial work).

Two themes cut across sectors rather than defining their own regions, and are expressed as star-level modifiers, not separate territories:

1. **Security-flagged work** (typically within IT) may use sharper star geometry and a controlled warning color accent. It must never use constant red flashing.
2. **Space and physics work** (typically within Labs) may receive additional spatial depth and wider orbital spacing than its sector default, reflecting the subject matter without inventing a seventh sector.

## Star anatomy

Every project star is built from layered, independently styleable parts (FR009, FR010, VR005):

1. **Core point.** The star itself.
2. **Soft halo.** Ambient glow scaled to importance.
3. **Status ring.** A thin ring communicating current state (active, evolving, archived, client, memorial).
4. **Selection ring.** Appears only on focus or selection, always distinguishable without relying on color alone (VR005, AR006).
5. **Hit target.** An invisible, generous pointer and touch target, larger than the visible core so small stars remain easy to select (AR009).
6. **Label anchor.** A stable point for the star's name to attach to, used by the label collision system.

### What size and brightness encode

Star size encodes editorial importance or featured weight, and nothing else. Star brightness encodes current status, and nothing else (FR009, FR010). Neither ever encodes traffic, popularity, revenue, or human worth (accepted default, `01_INTERVIEW.md` Q17 to Q18). Archived work remains visible but visually quiet rather than disappearing.

Everything else a star might communicate, sector through hue, client state through a refined halo treatment, personal state through softer diffusion, an external host through a small orbit marker, relationship density through corona complexity, is a secondary, decorative cue. Secondary cues may exist, but no essential meaning may ever depend on a secondary cue alone, on animation alone, or on color alone (VR005, AR006). If a visitor cannot tell a status from the status ring's shape or the panel's text, the cue is decoration, not information.

## Relationship line design

The graph must never become spaghetti (accepted default, `01_INTERVIEW.md` Q22; FR038).

1. Overview shows only sector skeletons and a small number of major cross-sector paths.
2. Hover shows the nearest useful context.
3. Selection shows the selected node's direct relationships (FR017, FR034).
4. Compare mode shows exactly one explained path between two chosen projects (FR035, FR036).
5. A guided tour shows only its current route.
6. Automatic similarity edges render faint and secondary (FR037).
7. Manually curated relationships render brighter and always carry a visible, human-readable reason (FR033).

A relationship line may carry a slow-moving signal that suggests information moving through a system, never a racing effect. Signal movement stops entirely under reduced motion (see Reduced motion below).

## Label hierarchy and collision behavior

In descending priority:

1. Site title.
2. Selected project title.
3. Major project labels (always visible, VR004).
4. Sector names.
5. Minor project labels, revealed on focus, hover, keyboard selection, or camera proximity (accepted default, `01_INTERVIEW.md` Q21).
6. Technical metadata (coordinates, status codes, counts).

Project names always outrank decoration. Labels use collision avoidance and fade by camera scale. Labels never spin in 3D space and never become unreadable billboards at oblique angles.

## Detail panel composition

Selecting a project focuses the camera, illuminates its direct relationships, and opens a detail view without leaving the map (FR016 to FR018). The panel never covers the selected star; the camera composes the selected node into the remaining visible map area.

**Desktop** (`ProjectPanel`): a right-side panel styled as an instrument readout, not a generic modal. Recommended order:

1. Sector and status.
2. Project title.
3. One-sentence explanation.
4. Relationship summary.
5. Tags and technologies (no more than six, accepted default `01_INTERVIEW.md` Q55).
6. Open Project.
7. View Source, when a repository mapping is confirmed.
8. Compare.
9. Pin.
10. Share.

**Mobile** (`MobileProjectSheet`): a bottom sheet with a clear grab handle, stable focus behavior, and large touch actions. Same information order as the desktop panel, condensed for a narrower viewport.

## Signature moments

### The ignition (confirmed)

The NIXFRED core appears as a minimal pulse. Sector names arrive as coordinates. Project stars ignite in chronological sequence. The final relationship lines draw themselves like a navigation computer solving a route, then settle.

### The project focus (confirmed)

Selecting a project bends the surrounding map slightly toward it. The selected star becomes a local sun. Related stars remain bright. Unrelated stars fall back in brightness, never disappear. The detail panel enters as a precise instrument surface.

### The path trace (confirmed)

As a visitor moves between projects, a faint temporary route draws itself through the map and slowly fades. During a session, the visitor can reveal the path they have traveled so far.

### The historical bloom (confirmed, gated)

Timeline mode begins with almost empty space and grows one release at a time until the complete galaxy is visible. This moment stays disabled until trustworthy launch dates exist for every included project (FR045, FR048).

### The Larry anomaly (confirmed, F13)

Larry is not a normal project star. Larry may appear as a moving or self-repositioning object whose relationship lines subtly shift depending on context. This must remain tasteful and must never imply access to private data.

### The Sky Walrus event (confirmed, rare and optional)

A rare, optional visual event lets the Sky Walrus drift across the far background after extended exploration (accepted default, `01_INTERVIEW.md` Q27). It must never block controls, impair performance, or become the entire joke.

### Easter egg scope (resolved by F21)

Sky Walrus is the only easter egg in v1. The previously proposed typed `whoami`, `larry`, and `home` commands and the Konami-code alternate sector rendering are CUT from v1 (F21 in `docs/DECISIONS.md`). The Larry anomaly above is a designed feature (F13), not an easter egg, and stays. Sky Walrus remains harmless, reversible, and invisible to accessibility tooling.

## Motion language

Motion always communicates structure or state, never exists only because WebGL can do it.

1. Slow drift communicates that the system is alive.
2. Camera movement communicates focus.
3. Signal movement communicates relationship.
4. Build-in sequences communicate loading.
5. Pulses communicate status or attention.
6. Fades communicate filtering.

Concrete rules:

1. Idle movement stays slow and low amplitude.
2. Camera movement uses acceleration and deceleration, never abrupt jumps.
3. No essential control moves away from the pointer during animation.
4. Long animations never delay basic navigation.
5. Mobile motion is lighter than desktop motion.
6. No constant camera wandering while the visitor is reading. No screen shake. No surprise zoom. No uncontrolled particle storm. No animation may block a button.

### Reduced motion, a designed mode

Reduced motion is a first-class design target, not a degraded fallback (FR014, VR007, AR007). When active:

1. Remove automatic drift and parallax.
2. Replace camera travel with a short crossfade or instant reframing.
3. Replace moving relationship signals with static, highlighted paths.
4. Remove pulses.
5. Keep focus, search, filters, panels, tours, compare, and Atlas fully functional. Nothing is removed except decorative motion.

An always-visible pause motion control is present whenever continuous decorative motion is active, independent of the system-level reduced motion preference (AR006).

## Typography hierarchy

Three tiers, in order of visual weight:

1. **Display.** A strong geometric face for project names, the site title, and major statements.
2. **Monospace.** For coordinates, status codes, commands, paths, dates, and system metadata, reinforcing the terminal half of the creative thesis.
3. **Sans serif.** A highly readable face for descriptions and interface controls.

Continue the existing NIXFRED display and monospace families from nixfred.com where licensing and performance allow (accepted default, `02_ART_DIRECTION.md` visual foundation 5). The exact family names are not asserted here; `06_DISCOVERY_INTERVIEW.md` D101 to D102 ask Fred to confirm the current nixfred.com palette and type families directly, so treat the specific typeface choice as PENDING-FRED and inherit whatever nixfred.com is actually shipping at implementation time.

Japanese accent typography may continue as a signature detail, confined to small labels and interface metadata, never competing with project names (accepted default, `01_INTERVIEW.md` Q24).

Use system or locally bundled font assets only. Do not create a render-blocking dependency on a third-party font CDN.

## Effects budget

**Allowed:**

1. Restrained bloom.
2. Fine atmospheric gradients.
3. Sparse particles.
4. Soft depth fog.
5. Thin luminous relationship paths.
6. Small terminal details (cursor blinks, status lines, coordinate readouts).
7. One brief startup decode sequence.

**Forbidden:**

1. Heavy scanlines over body text.
2. Constant glitching.
3. Huge lens flares.
4. Multiple competing animated backgrounds.
5. Tiny, low-contrast gray copy.
6. Excessive blur.
7. Full-screen Matrix rain as the default experience.
8. Large video backgrounds.
9. Stock nebula photography anywhere in the primary visual identity.

Atmosphere is generated, not photographed: procedural particles, gradients, noise, line work, and light (`02_ART_DIRECTION.md` visual foundation 7 to 8). The renderer adapts pixel ratio, particle count, glow, and line density to device capability (FR012), pauses when the page is hidden, and reduces work when the map is idle (FR013).

## Mobile art direction

Mobile is a deliberate, separate composition, not a shrunken desktop canvas (accepted default, `01_INTERVIEW.md` Q45; VR009).

1. Use a flatter radial map with limited depth.
2. Prioritize single-finger pan and pinch zoom.
3. Replace hover with first-tap-focus, second-tap-open behavior.
4. Use the bottom sheet (`MobileProjectSheet`) for project details.
5. Keep sector controls within thumb reach.
6. Keep labels readable without requiring extreme zoom.
7. Reduce star count on screen through clustering and progressive reveal, and reduce particles and post-processing based on device capability before frame rate becomes unstable.
8. Keep search and Atlas one tap away.
9. Never require precision dragging to open a project.

## Audio

Audio ships in v1 as an optional feature, off by default in all cases (accepted default, `01_INTERVIEW.md` Q26; AR005; F12 in `docs/DECISIONS.md`). When enabled, it is a quiet observatory bed with small, distinct interface confirmation tones for navigation and focus events. Audio never autoplays under any circumstance. A visible mute state is always present, and the visitor's preference is remembered on the local device only.

## Open Graph art

The social preview image communicates, in order of visual priority:

1. `NIXFRED GALAXY`.
2. `Every project. One connected system.`
3. A central node with six sector regions visible around it.
4. A few recognizable project names.
5. The production domain, `galaxy.nixfred.com`.

The image must remain legible when reduced to a small social preview size (VR010).

## Anti-imitation rule

Do not imitate a known game map, a streaming service space screen, an Apple product animation, or a stock cyber dashboard template. Borrow only general interaction principles that are common across well-built spatial interfaces. The final composition must look like it came from Fred's existing NIXFRED universe and nowhere else.

## Interface vocabulary

Interface labels sound like NIXFRED, not a generic software dashboard. This is the canonical word list; it supersedes the shorter, earlier list in `02_ART_DIRECTION.md` (see Contradictions below).

Primary navigation and modes:

1. `MAP`
2. `ATLAS`
3. `TIMELINE`
4. `TOURS`

Core actions:

5. `RESET VIEW`
6. `OPEN PROJECT`
7. `SURPRISE ME`
8. `COMPARE`
9. `PIN`
10. `SHARE`

Supporting labels:

11. `SEARCH`
12. `RELATED NODES`
13. `CURRENT COORDINATES`
14. `SESSION PATH`

Opening screen only:

15. `ENTER THE MAP`
16. `START A TOUR`
17. `OPEN ATLAS`

## Contradictions resolved

1. **Interface word list.** `02_ART_DIRECTION.md` proposed `SIGNALS` as a top-level navigation label alongside `MAP`, `TIMELINE`, `TOURS`, and `SEARCH`. This collides with `Signal`, which is a sector name (per ruling F16 in `docs/DECISIONS.md`, the SIGNAL label ruling, plus discovery `D27`, kept as `SIGNAL`), and the functional requirements never define a `SIGNALS` mode. The finalized product requirements instead define `ATLAS` as a first-class mode (FR048 to FR056, AC021 to AC023) and `SURPRISE ME` as a named random-discovery action (FR059, accepted default Q41), neither of which appear in the `02_ART_DIRECTION.md` list. Resolution: the Interface vocabulary section above is built from the FR-confirmed feature set. `SIGNAL` is used only as a sector name and never as a navigation command.
2. **Star encoding scope.** `02_ART_DIRECTION.md` lists eight things a star may communicate (hue, size, pulse, archive energy, client halo, personal diffusion, host marker, relationship corona). `03_ART_DIRECTION_DRAFT.md` and FR009 to FR010 are stricter: size means importance, brightness means status, and nothing else. Resolution: the disciplined FR009/FR010 reading governs primary encoding. The extra ideas from `02_ART_DIRECTION.md` survive as optional secondary, decorative cues under Star anatomy above, explicitly barred from carrying essential meaning alone, which is consistent with `02_ART_DIRECTION.md`'s own closing rule on that point.
3. **Sector detail depth.** `02_ART_DIRECTION.md`'s sector section is generic (field shapes, anchor stars, satellites) and does not name colors. `03_ART_DIRECTION_DRAFT.md` names exact colors matching the accepted interview default. These are not in tension; `03_ART_DIRECTION_DRAFT.md` is simply more finished. Resolution: sector colors and per-sector visual language follow `03_ART_DIRECTION_DRAFT.md`. `02_ART_DIRECTION.md`'s character language for Personal (protected, quiet) and Clients (polished, grounded) is preserved as flavor text. Its ideas about security work and space and physics work are reclassified as cross-sector star modifiers rather than sector definitions, since Security and Space and Physics are themes that cut across IT and Labs, not sectors in their own right.
4. **Easter egg scope.** `03_ART_DIRECTION_DRAFT.md` recommended four additional command easter eggs beyond Sky Walrus, tracing back to `06_DISCOVERY_INTERVIEW.md` D93 to D100. Resolution: CUT by F21. Only Sky Walrus ships in v1; the typed `whoami`, `larry`, and `home` commands and the Konami-code rendering are removed from scope.
5. **Typography specifics.** `02_ART_DIRECTION.md` says to reuse the existing nixfred.com type families conditionally. `03_ART_DIRECTION_DRAFT.md` gives a clean three-tier hierarchy without naming families. `06_DISCOVERY_INTERVIEW.md` D101 to D103 ask Fred to confirm the exact palette and type family names, unanswered as of this document. Resolution: the three-tier hierarchy is locked; the specific family names are PENDING-FRED and must be pulled from nixfred.com's actual production type stack at implementation time rather than guessed.
