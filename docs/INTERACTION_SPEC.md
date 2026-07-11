# NIXFRED GALAXY Interaction Specification

Status: Final. This is the exact behavioral contract for engineering and test implementation. It complements `docs/ART_DIRECTION.md`, which governs how things look and feel; this document governs what happens when a visitor does something. Requirement IDs (FR, VR, AR) reference `galaxy_requirements_pack/02_PRODUCT_AND_FUNCTIONAL_REQUIREMENTS_DRAFT.md`. Component names reference `galaxy_requirements_pack/05_PROFESSIONAL_FILE_MANIFEST.md`.

## Terms

1. **Focus** (camera sense): the camera composes a star into the visible frame, at rest, without opening its panel. Used during hover, keyboard traversal before selection, and tour steps.
2. **Focus** (DOM sense): standard browser focus for keyboard and assistive technology. Context below makes clear which sense applies.
3. **Select**: the visitor commits to a project. The camera focuses on it, its direct relationships illuminate, its detail panel or sheet opens, and the URL updates.
4. **Open**: the visitor leaves the map for the project itself, in a new tab, via `OPEN PROJECT`.

## Pointer input (mouse and trackpad)

1. **Pan.** Left button drag starting on empty space, or a two-finger trackpad drag, translates the camera across the map plane. Panning has a soft edge: it decelerates and stops near the practical bounds of the populated sky rather than allowing indefinite empty drift.
2. **Wheel and pinch zoom.** Mouse wheel or trackpad pinch zooms toward the pointer position, not the screen center, clamped between a minimum distance (no closer than a comfortable single-star framing) and a maximum distance (no farther than the full overview). Zoom is smoothed, not stepped.
3. **Constrained orbit.** Right-button drag, or a designated secondary gesture (two-finger trackpad rotate where the platform exposes it), orbits the camera. Azimuth is unconstrained (full rotation around the vertical axis). Pitch is clamped so the horizon never inverts and labels stay legible at all times. Roll is never possible under any input combination (Q31, `ART_DIRECTION.md` Spatial composition).
4. **Click to select.** A left-button press and release on a star's hit target, with pointer movement below a small drag threshold between press and release, selects that star (FR015, FR016).
5. **Click on empty space.** A left-button click and release on empty space, when a panel is currently open, closes the panel and restores the previous map context (equivalent to Escape). When no panel is open, it is a no-op.
6. **Double-click policy.** Double-click on a star selects it and immediately performs `OPEN PROJECT` in a new tab, in one motion. This mirrors the mobile convention (first tap focuses, second tap opens) so desktop and touch behave the same way conceptually. This is a settled ruling (F19 in `docs/DECISIONS.md`), which overrides the earlier default that avoided double-click.
7. **Hover labels.** Hovering a star's hit target with no button pressed reveals its compact label after a short dwell delay, to avoid label flicker while the pointer passes over dense clusters. The label hides on pointer leave or on the start of any drag gesture.
8. **Cursor affordance.** The pointer shows a pointer/hand cursor over any hit target and a grab/grabbing cursor while panning.

Reduced motion: pan, zoom, and orbit remain fully available and unchanged, since they are visitor-driven, not decorative. Only the automatic camera flight that follows a click-to-select becomes an instant reframe or short crossfade instead of an eased flight (see Reduced motion contract).

## Keyboard input

Every action is reachable by keyboard alone (AR003, accepted default `01_INTERVIEW.md` Q30).

| Key | Context | Action |
|---|---|---|
| `Tab` / `Shift+Tab` | Anywhere | Move focus between focusable UI controls; when the map surface itself holds focus, move between stars in DOM order |
| `Arrow Up / Down / Left / Right` | Map has focus, no tour running | Move selection focus to the nearest star in that spatial direction |
| `Arrow Left` / `Arrow Right` | A tour is running | Previous / next tour step (arrow keys are reassigned to tour transport for the duration of the tour) |
| `Enter` / `Space` | A star has keyboard focus | Select the focused star |
| `Enter` / `Space` | A command palette or search result has focus | Activate the result |
| `Escape` | Panel or sheet open | Close it, restore the previous map context and camera |
| `Escape` | Command palette open | Close the palette |
| `Escape` | Compare mode active | Exit compare mode |
| `Escape` | Tour running | Exit the tour |
| `Escape` | Nothing transient open | Return to overview (reset camera) |
| `Cmd+K` / `Ctrl+K` / `/` | Focus is not inside an editable control | Open the command palette (FR023) |
| `?` | Focus is not inside an editable control | Open the Help dialog listing this shortcut table |
| `Space` | A tour is running and no control has keyboard focus | Pause or resume tour auto-advance |

`Escape` always resolves the topmost open transient state first (palette, then compare, then tour, then panel, then overview), so repeated presses walk the visitor back out one layer at a time rather than jumping straight to overview.

Tours never trap keyboard focus: `Tab` continues to cycle through the tour's own controls (`TourControls`) and back out to the rest of the page, and `Escape` always exits regardless of where focus currently sits (FR042).

Reduced motion: all keyboard behavior is identical. Only the resulting camera motion changes (see Reduced motion contract).

## Touch input

1. **Single-finger pan.** One-finger drag on empty space translates the camera, same bounds behavior as pointer pan.
2. **Pinch zoom.** Two-finger pinch zooms toward the pinch midpoint, same clamped range as pointer zoom.
3. **First tap focuses, second tap opens.** A tap on a star's hit target focuses the camera on it and opens `MobileProjectSheet` at its collapsed height (equivalent to select). A second tap on the same, already-selected star triggers `OPEN PROJECT`. Tapping a different star while one is selected simply reselects to the new star; it does not count as a "second tap."
4. **Tap on empty space.** Closes the open sheet, if any, and returns to the previous map context.
5. **No hover.** Touch has no hover state. Labels for minor stars appear only once a star is selected, or when zoomed in close enough that the label collision system shows them unconditionally.
6. **Bottom sheet gestures** (`MobileProjectSheet`):
   - Drag the grab handle down to collapse the sheet to a peek height, or up to expand it to full detail.
   - A fast downward flick from any height dismisses the sheet entirely (equivalent to Escape).
   - Tapping the scrim area above the sheet dismisses it.
   - The sheet never requires a horizontal swipe to reveal a hidden action; all actions are visible controls within the sheet.
7. **No precision dragging required to open a project.** The two-tap model above is the only path to opening a project from the map on touch; there is no drag-to-open gesture (accepted default, `03_ART_DIRECTION_DRAFT.md` Mobile art direction).

Reduced motion: identical touch gestures. Only automatic camera flight following a tap-select changes (see Reduced motion contract).

## Selection lifecycle

1. Pointer, keyboard, touch, search, tour, and deep link entry points all resolve to the same underlying select action (FR015).
2. Selecting a project:
   - Moves the camera to focus on it without disorienting rotation (FR016).
   - Illuminates its direct relationships and the relevant sector path (FR017).
   - Opens `ProjectPanel` on desktop or `MobileProjectSheet` on mobile (FR018), showing title, sector, status, one-sentence description, tags, relationship summary, confirmed repository link when public, source site link, and `OPEN PROJECT` (FR019).
   - Updates the URL with a stable, shareable representation of the selection (FR020).
3. **URL contract.** The interactive map lives at `/`. Live state is carried in query parameters so the map stays a single route:
   - `?focus=<slug>` for the selected project.
   - `?sector=<slug>[,<slug>...]` for active sector filters.
   - `?tour=<tour-slug>&step=<n>` for an active guided tour.
   - `?compare=<slugA>,<slugB>` for an active comparison.
   - `?t=<value>` for timeline position, once timeline mode is enabled.
   These parameter names are this document's canonical proposal; `docs/DATA_MODEL.md` or `docs/ARCHITECTURE.md` may refine the exact serialization, but the behavioral guarantees below hold regardless of final param names. `/atlas/` and `/project/<slug>/` remain their own static routes per FR051 and FR054 and are not affected by this query parameter scheme.
4. **History semantics** (FR020, FR021, `01_PRODUCT_REQUIREMENTS.md` Exploration item 7):
   - Each distinct project selection made from a "clean" state (overview, a sector filter with nothing selected, or a tour step) pushes one new history entry.
   - Selecting a different project while one is already selected also pushes a new entry, so the browser back button walks the visitor backward through their own selection history one project at a time, ending at the unselected state they started from.
   - Closing the panel via `Escape`, the close control, or a tap on empty space calls the equivalent of browser back rather than pushing a new forward-only state, so `Escape` and the physical back button produce the same result.
   - If the current history entry has no prior in-app state to return to (for example, the visitor arrived directly on a deep link), closing the panel replaces the current state with the unselected overview instead of navigating away from the site.
5. Opening a project via `OPEN PROJECT` uses a new tab with safe link attributes (`rel="noopener noreferrer"`) and preserves the current galaxy state exactly as it was before the click (FR022).
6. **Session camera memory** (F20 in `docs/DECISIONS.md`). The map remembers the camera position for the duration of the browser session, so returning to this tab after `OPEN PROJECT`, or otherwise navigating back into the map, restores the visitor to where they were. A fresh browser visit still begins at the intentional overview, and a deep link still restores its exact state on load. This overrides the earlier default of a fresh overview on every arrival.

## Command palette (`CommandPalette`)

1. Opens on `Cmd+K`, `Ctrl+K`, or `/`, whenever keyboard focus is not inside an editable control (FR023).
2. Matches against project title, description, path, sector, tags, technologies, and relationship labels (FR024).
3. Results are keyboard navigable with arrow keys and announce their count and current position to screen readers via an `aria-live` region (FR025).
4. Selecting a result focuses the map on that project, opens its panel, and updates the deep link, exactly as any other selection (FR026).
5. Beyond project search, the palette exposes direct commands: `Map`, `Atlas`, `Tours`, `Timeline` (disabled state and reason when gated, see Timeline controls), `Help`, a Reduced Motion preview toggle, and `Return Home` (FR027).
6. Closing: `Escape`, selecting a result, or clicking outside the palette all close it without side effects beyond whatever action, if any, was taken.

## Sector filters (`AtlasFilters` in Atlas, equivalent control in the map shell)

1. Visitors can isolate one or more sectors at a time; filters are additive toggles, not a single-select (FR028).
2. Applying or changing a filter never discards the current selection or camera position, unless the filter change hides the currently selected star. In that case the panel closes, the `focus` URL parameter clears, and the camera settles on the current filtered overview; the `sector` parameter itself is retained (FR029).
3. The interface displays a live visible project count next to the active filter state (FR030).
4. Filters operate identically in Map and Atlas modes and share the same URL parameter, so switching between the two modes preserves the filter (FR031).

## Guided tours (`TourControls`)

A tour step performs three coordinated actions together: move the camera, illuminate the active route, and reveal short narration text (`ART_DIRECTION.md` Guided tours).

1. **Start.** Selected from the command palette, the opening screen's `START A TOUR`, or a tour's own entry point. Starting a tour clears any active filter or comparison and pushes a history entry.
2. **Advance / previous.** `TourControls` exposes explicit Next and Previous buttons; the equivalent keyboard shortcuts are `Arrow Right` / `Arrow Left` while the tour is running (see Keyboard input table). Each step transition re-runs the three coordinated actions above.
3. **Pause / resume.** If a tour auto-advances after a reading interval, a visible pause control (also bound to `Space`) stops the timer; resume restarts it from the same step. Manual Next/Previous always works regardless of pause state.
4. **Exit.** `Escape` or an explicit Exit control leaves the tour at any point and returns to free exploration at the tour's current camera position, without penalty or confirmation dialog.
5. **Resume.** If a visitor leaves a tour and returns to the same tour URL later in the session, the tour resumes at its last step rather than restarting from step one.
6. **No focus traps** (FR042): `Tab` cycles naturally through tour UI and back to the rest of the page at every step.
7. **Shareable URL** (FR043): the `?tour=<slug>&step=<n>` state is always current, so sharing the URL at any point reproduces the exact step for the recipient.
8. Minimum three tours ship at launch: `Start Here`, `AI and Infrastructure`, `Space and Physics`, unless Fred changes them (FR044).

Reduced motion during a tour: camera moves between steps become instant reframes or short crossfades instead of eased flight; narration and step transitions themselves are not shortened or skipped.

## Compare mode (`ComparePanel`)

1. **Entry.** The visitor selects `Compare` from an open project's panel. The interface enters a compare-pending state with a visible prompt (for example, "Choose a project to compare with `<first project>`"). The visitor then selects a second project by any normal selection method: clicking a star, using the command palette, or keyboard navigation.
2. **Resolution.** Once both projects are chosen, `ComparePanel` opens. The map darkens unrelated work, illuminates the shortest meaningful path between the two nodes, and displays a compact explanation for each edge in the path, in plain language, built only from typed relationships in the data (FR035, FR036). It never invents a poetic connection because two nodes happen to be near each other.
3. **Exit.** `Escape` or an explicit close control exits compare mode and restores the prior map context, same as closing a panel.
4. **Cancel during pending state.** `Escape` while waiting for the second selection cancels compare mode entirely and returns to the first project's normal panel.
5. **Shareable.** An active comparison is represented in the `compare` URL parameter and is a valid `Share` target (FR060).

## Timeline controls (`TimelineControls`)

Timeline mode stays visibly present but disabled until trustworthy launch dates exist for every included project (FR045). While disabled, the `Timeline` entry in the command palette and any dedicated control remain visible with a disabled state and a short, honest reason on hover or focus (for example, "Timeline needs verified dates for every project") rather than being silently hidden, so visitors are never left wondering why a labeled feature does nothing.

Once enabled:

1. Moving the time control reveals projects according to launch date without relocating their stable spatial positions (FR046). Positions never change between timeline mode and normal map mode.
2. The control is fully keyboard operable (arrow keys to step, Home/End to jump to range extremes) and announces the current date range to screen readers as it moves (FR047).
3. Projects with unknown dates are grouped under an explicit `DATE NOT RECORDED` state and never assigned a guessed date (FR048).
4. Playback, when offered, can be paused, resumed, sped up, slowed down, and reset, mirroring the transport pattern used by tours.

## SURPRISE ME (FR059)

1. `SURPRISE ME` selects one eligible, currently visible project (respecting active sector filters) and performs a normal select action on it, including the standard camera focus behavior for the current motion mode.
2. Eligibility and ordering use a seeded shuffle-bag algorithm scoped to the current browser session: on first use, the full eligible set is shuffled with the session seed into a queue; each activation pops the next slug from the queue. When the queue empties, it is reshuffled, with the single constraint that the first slug of the new shuffle never equals the last slug of the previous one, which guarantees no immediate repeat even across a reshuffle boundary.
3. Changing the active sector filter mid-session rebuilds the eligible set and reshuffles the queue, since the prior queue may no longer be valid.
4. This algorithm is deterministic given a fixed seed and fixed eligible set, which is what makes it unit testable per AC020.

## Pins and share

1. **Pin** (FR057): the panel's `Pin` control toggles a pinned state for the current project, stored only in `sessionStorage` (not persisted beyond the browser session, and never sent to a server) unless Fred explicitly approves durable local persistence later (FR058). Pinned stars show a small, secondary visual marker on the map, consistent with the rule that no essential meaning depends on a secondary cue alone.
2. **Share** (FR060): the panel's `Share` control copies the current stable URL to the clipboard, covering whichever state is active: a selected project, an active comparison, a specific tour step, or a filter state. A brief, non-blocking confirmation (toast or inline text change) confirms the copy succeeded, with a manual "copy this text" fallback if clipboard access is blocked by the browser.

## Entrance sequence

1. **First visit** (F10, F11 in `docs/DECISIONS.md`). The title arrives as a cinematic event, a designed moment with real presence, described visually in `ART_DIRECTION.md`. The hard envelope still binds: the map is interactive within 1.5 seconds, the sequence is fully skippable, and visitor input is honored immediately and never blocked while it plays (accepted default Q20, identity seat honored-input rule).
2. **Repeat visits.** A returning visitor sees the shortened entrance per the accepted default, with the full cinematic sequence available on request.
3. Any pan, zoom, orbit, selection, or keystroke during the entrance interrupts it cleanly and lands the visitor in the resulting interactive state, with no residual animation lock.

Reduced motion: the entrance presents the same content as a fast crossfade sequence rather than an animated build (see Reduced motion contract, Opening sequence row).

## Deep link restoration timing

1. The HTML shell, loading status, and opening controls render immediately, independent of the visualization bundle (FR001 to FR003, PR001).
2. URL state (`focus`, `sector`, `tour`, `step`, `compare`, `t`) is parsed immediately but not applied to the camera or panels until the scene reaches its "Map online" ready state described in `ART_DIRECTION.md`.
3. Once ready, the controller applies the parsed state in one pass: filters first, then tour or compare mode if present, then the focused project, so the final camera position and open panel match exactly what the URL described.
4. If a URL references a slug, tour, or step that does not exist in the current catalog, the application falls back silently to the closest valid state (typically the unfiltered overview) without throwing a visible error, and without corrupting the URL further.
5. Under reduced motion, the initial camera move to a deep-linked target is an instant reframe rather than an animated flight, consistent with a fresh page load not being an appropriate moment for a long cinematic entrance.
6. If WebGL is unavailable and Atlas mode loads instead (see Error and fallback interactions), the same URL parameters resolve within Atlas: `focus` scrolls to and expands the matching project card, `sector` applies the matching filter, so a shared link remains meaningful even without the spatial map.

## Reduced motion contract

This section consolidates the reduced-motion delta for every interaction above; the authoritative visual description lives in `ART_DIRECTION.md`.

| Interaction | Standard motion | Reduced motion |
|---|---|---|
| Pan / zoom / orbit | Smoothed, inertial | Unchanged, fully user-driven |
| Select a project | Eased camera flight to focus | Instant reframe or short crossfade |
| Deselect / close panel | Eased return | Instant reframe |
| Tour step transition | Eased camera flight, animated route illumination | Instant reframe; route shown as a static highlighted path, not an animated draw-in |
| Relationship signal movement | Slow moving pulse along the line | Static highlighted line, no movement |
| Idle drift / parallax | Present at low amplitude | Removed entirely |
| Star pulses (status, attention) | Present | Removed; status communicated by the static status ring only |
| Opening sequence | Full cinematic build-in, skippable | Same content, presented as a fast crossfade sequence rather than an animated build |
| Search, filters, palette, panels, tours, compare, Atlas | Fully functional | Fully functional, unchanged in scope, only the transition animation changes |

The reduced motion state is honored automatically from `prefers-reduced-motion` and can also be toggled manually from the command palette's Reduced Motion preview command, so a visitor can preview or override it without changing their operating system setting (FR014, AR007).

## Error and fallback interactions

1. **WebGL failure to Atlas** (FR052). If WebGL context creation fails at startup, the application automatically loads Atlas mode (`AtlasGrid`) instead of the spatial map, with a quiet, non-alarming message that the full map is unavailable on this device. A manual "Try the map again" control remains available in case the failure was transient (for example, a temporary driver issue), but Atlas is fully functional on its own and is never presented as a punishment or a dead end.
2. **Lost WebGL context.** If a live session's WebGL context is lost (`webglcontextlost`), the render loop pauses immediately and an inline notice appears offering to switch to Atlas mode. If the browser fires `webglcontextrestored`, the renderer reinitializes from current state automatically and the notice clears without the visitor needing to do anything. If the context does not restore within a short, bounded window, the application falls back to Atlas mode the same way it would for an initial WebGL failure.
3. **Failed thumbnail or image.** A single failed project thumbnail never breaks the catalog; it is replaced by a generated sector glyph and gradient in that project's panel or card (`01_PRODUCT_REQUIREMENTS.md` Error and fallback behavior 3).
4. **Unavailable external project link.** The project record remains visible and selectable; its `OPEN PROJECT` action reflects a clear unavailable state instead of silently failing or disappearing.
5. **404 page.** A styled not-found page offers three actions: search (opens the command palette), a link to Atlas, and a link back to nixfred.com (FR065).
6. **Runtime errors.** Unhandled runtime errors are caught by an error boundary that presents a recoverable interface with a reload action and a return-home action, and are logged to the browser console with actionable context and no private data (FR064).
