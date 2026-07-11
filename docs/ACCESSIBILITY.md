# NIXFRED GALAXY Accessibility Contract

Target standard: WCAG 2.2 AA behavior for all essential content and controls, per AR001. Automated axe testing must report zero serious or critical violations on the required routes and states, per AR010 and AC025.

Governing design decision: the WebGL canvas is decorative and is never the only representation of the projects. The real interactive layer is HTML. The canvas is marked aria hidden and mirrors an accessible star list. This single decision is what makes keyboard operation, screen reader support, and the WebGL fallback all coherent rather than three separate retrofits. It satisfies FR053, AR008, AC023, and the operating law that the canvas is never the only way to reach the content.

## 1. Accessibility requirements AR001 to AR010

### AR001. WCAG 2.2 AA for essential content and controls

Every essential control, being navigate, select, open, close, search, filter, tour, compare, Atlas, reduced motion, pause motion, and return home, is a real HTML control with an accessible name, a visible focus state, and keyboard operation. Conformance is enforced by the axe automation in section 12 and confirmed by the manual screen reader matrix in section 11.

### AR002. Skip link, visible focus, semantic headings, labeled controls, correct panel semantics

The page provides a skip link to the main content as the first focusable element. All interactive elements have a visible focus indicator that meets the WCAG 2.2 focus appearance intent, being a clearly contrasting outline that is not obscured. Headings follow a correct outline, with one page level heading and section headings for the shell, the map region, and the Atlas. The command palette uses dialog semantics. The desktop project panel uses complementary region semantics. The mobile project sheet uses dialog semantics. See sections 3 and 4.

### AR003. Every action possible with keyboard only

There is no pointer only action. Star navigation, selection, panel open and close, search, filters, tours, compare, pin, share, reduced motion, and return home are all reachable and operable from the keyboard. The full map is in section 2 and is proven by `tests/e2e/keyboard.spec.ts`, satisfying AC013.

### AR004. Focus moves into the panel on open and returns to the initiator on close

Opening a project moves focus into the project panel, to its heading or its close control. Closing the panel, by the close control or Escape, returns focus to the control that opened it, being the star in the accessible list or the search result. This is a strict contract, tested in `tests/e2e/keyboard.spec.ts`, satisfying AC024. The desktop panel is not a focus trap. The full focus contract is in section 4.

### AR005. Do not autoplay sound

No audio plays without a user gesture. No audio context resumes on load. Audio ships in version one per F12, off by default, with a visible control and a locally stored preference. See section 10. Enforced by `tests/e2e/shell.spec.ts`, satisfying AC027.

### AR006. Always visible pause motion control while continuous motion is active

Whenever continuous decorative motion is running, a labeled PAUSE MOTION control is visible and keyboard reachable. Activating it stops drift, pulses, signal travel, and parallax immediately, and the choice persists for the session. In reduced motion mode the control reflects that motion is already stopped. See sections 5 and 9. Enforced by `tests/e2e/explore.spec.ts`, satisfying AC026.

### AR007. Respect prefers-reduced-motion, prefers-contrast, and save-data

The application reads `prefers-reduced-motion` and enters reduced motion mode, reads `prefers-contrast` and raises label contrast and weight, and reads `save-data` to reduce texture and effect load where practical. The in site reduced motion setting can also force the mode independent of the system preference. See sections 5 and 7.

### AR008. HTML list representation for screen readers, not narrated canvas geometry

Screen readers navigate an HTML list of project stars, not raw canvas coordinates. Each list item carries the project name, sector, status, and a concise description, and acts as the selection control for that star. The renderer mirrors the list selection visually. This is the accessible star list described in section 6.

### AR009. Touch targets large enough for practical phone use

Interactive targets on phone meet a minimum of 44 by 44 CSS pixels, which exceeds the WCAG 2.2 minimum target size and matches practical thumb use. Stars carry a generous invisible hit target so opening a project never requires precision dragging. See section 8.

### AR010. Zero serious or critical axe violations on required routes and states

Axe runs across the routes and states in section 12 and fails the build on any serious or critical violation. This is a blocking gate, satisfying AC025.

## 2. Keyboard map

The map matches the interaction model from the accepted interview defaults: pan, zoom, constrained orbit, click to focus, Escape to return, Command K, Control K, and slash for the palette, and full keyboard access to every command. Shortcuts do not fire while focus is inside an editable control, per FR023.

### Global

| Key | Action | Requirement |
|-----|--------|-------------|
| Tab, Shift and Tab | Move between interface controls: skip link, shell actions, map region, accessible star list, panel, legend, tour controls | AR002, AR003 |
| Command K, Control K, Slash | Open the command palette when focus is not in an editable control | FR023, AC014 |
| Escape | Close the palette, close the project panel, exit a transient mode being tour or compare, and clear a temporary overlay. From the overview it does nothing. Returns focus per section 4 | AC024, interaction acceptance 10 |
| Question mark | Open the help dialog that lists this keyboard map | AR002 |
| H, or the Return Home command | Return to nixfred.com through the persistent return control | product acceptance 17 |

### Map region and accessible star list

| Key | Action | Requirement |
|-----|--------|-------------|
| Arrow keys | Move the roving selection between stars within the accessible list, following spatial nearest neighbor order | AR003, AR008 |
| Enter, Space | Select the focused star, focus the camera, illuminate its relationships, and open the project panel | FR015, FR018, AC012 |
| Escape | Deselect and return to the prior map context | FR021, AC024 |
| Plus, Minus | Zoom the map in and out | FR005, AC012 |
| R, or the Reset View command | Return the camera to the intentional overview | FR005 |

### Command palette

| Key | Action | Requirement |
|-----|--------|-------------|
| Type text | Filter across title, description, path, sector, tags, technologies, and relationship labels | FR024, AC014 |
| Arrow Up, Arrow Down | Move through results with a clear screen reader announcement of the active result | FR025 |
| Enter | Select the result, focus the map, open the panel, and update the deep link | FR026, AC014 |
| Escape | Close the palette and return focus to the opener | AR004 |

### Tour controls

| Key | Action | Requirement |
|-----|--------|-------------|
| Space, or the Pause control | Pause and resume the active tour | FR041, AC018 |
| Arrow Right, N | Next tour step | FR041, AC018 |
| Arrow Left, P | Previous tour step | FR041, AC018 |
| Escape, or the Exit control | Exit the tour and return to free exploration without trapping focus | FR041, FR042, AC018 |

Tours never trap keyboard focus, per FR042. The tour controls are ordinary buttons in the tab order, so a keyboard user can leave the tour region at any time.

## 3. Panel and dialog semantics

Three surfaces present project detail and commands, and they use deliberately different semantics so that focus behavior is correct in each.

1. Desktop project panel. A complementary region, not a modal. It opens beside the map without covering the selected star. Focus moves into it on open, and Tab can move out of it back to the map. It is not a focus trap, which keeps the exploration flow open and satisfies the no trap rule in interaction acceptance 9.
2. Command palette. A modal dialog. While open, focus is contained within the dialog by the standard dialog pattern, Escape closes it, and focus returns to the opener. This is the one legitimate focus containment, and it is a dialog the user opened deliberately.
3. Mobile project sheet. A modal bottom sheet dialog with a visible grab handle, large actions, contained focus while open, and focus return to the initiating star on close.

## 4. Focus management contract

This is the exact contract enforced by `tests/e2e/keyboard.spec.ts`, satisfying AR004 and AC024.

1. On open. Selecting a star or a search result moves focus into the project panel, landing on the panel heading or the close control. The opener is recorded as the return target.
2. During. On desktop the panel does not trap focus. Tab leaves the panel and continues into the map and shell. The palette and the mobile sheet do contain focus while open, being modal dialogs.
3. On close. Closing the panel by its close control or by Escape returns focus to the exact control that opened it, being the star in the accessible list or the result in the palette.
4. On mode change. Exiting a tour or compare returns focus to a stable control, being the tour launcher or the compare launcher.
5. No orphaned focus. If a filter hides the currently selected node, focus moves to a defined fallback, being the sector legend or the map region, and an announcement is made. Focus is never left on a removed element.
6. Skip link. The first Tab from the top of the page reaches the skip link, which moves focus to the main content.

## 5. Reduced motion as a designed mode

Reduced motion is a first class designed mode, not a degraded build, per AR006, AR007, and the art direction. It is entered from the system `prefers-reduced-motion` preference and from an in site setting, and either source is sufficient, satisfying accessibility acceptance 7.

What stops in reduced motion mode:

1. Automatic star drift and parallax.
2. Star pulses and status animation.
3. Signal travel along relationship lines.
4. Camera travel choreography and the cinematic entrance sequence.

What remains fully functional:

1. Focus, selection, search, filters, panels, tours, compare, and Atlas.
2. Camera focus changes, performed as an instant reframing or a short crossfade rather than a travel animation.
3. Relationship highlighting, shown as static highlighted paths rather than moving signals.

Evidence. The reduced motion mode is proven with an ordered frame sequence in `tests/e2e/reduced-motion.spec.ts` where consecutive settled frames must be identical, and with a media query assertion, satisfying AC010. A still image cannot prove that motion stopped, so the frame identity assertion is the actual gate.

## 6. Screen reader strategy

The strategy follows from the governing decision that the canvas is decorative and HTML is the real interface.

1. Canvas is aria hidden. The WebGL canvas carries aria-hidden so screen readers ignore its geometry, per AR008.
2. Accessible star list. A semantically real list of project stars is the screen reader and keyboard interface to the map. It uses a listbox style pattern with roving tabindex. Each option exposes an accessible name of the form project title, then sector, then status, and a description, and selecting an option drives the renderer. This list is present in the accessibility tree in map mode, so project names and descriptions are never canvas only, satisfying FR053 and AC023.
3. Atlas as the complete representation. `/atlas/` is a complete server rendered HTML representation of the catalog with search, sector filters, tags, status, project links, relationship links, and tour access, per FR049 and FR050. It is the fallback when WebGL fails and a first class navigation choice at all times, per FR051 and FR052.
4. Live region announcements. A polite live region announces state changes so a screen reader user is not left guessing what the map did:
   - Selection. For example, Selected Meet Larry, Signal sector, active.
   - Search results. For example, 12 projects match.
   - Tour steps. For example, Tour step 2 of 6, AI and Infrastructure.
   - Filter changes. For example, Showing 3 sectors, 18 projects.
   - Reduced motion and other mode toggles.
   An assertive live region is reserved for errors, being the WebGL unavailable notice when Atlas takes over.
5. Names for everything. Every star option, control, and link has a meaningful accessible name, satisfying accessibility acceptance 4. Icon only controls carry a text label.

## 7. Contrast and non color encoding

The palette is restrained luminous sector color on near black, being IT coral, Labs green, Work cyan, Signal amber, Clients violet, and Personal soft silver, per interview decision 15.

1. Text contrast. Body and label text is rendered in a high contrast near white or pearl foreground, not in the sector hue, so descriptions and labels meet the 4.5 to 1 ratio for normal text and 3 to 1 for large text. Sector hue is used for the star point, the sector chip, and the glyph, not for running text.
2. Non text contrast. Interactive controls, focus indicators, selection rings, and the graphical parts that carry meaning meet the 3 to 1 non text contrast ratio, per WCAG 1.4.11.
3. Meaning never depends on color alone. Sector identity is carried by a distinct glyph shape as well as hue, per accessibility acceptance 6 and visual acceptance 4. Status is carried by a status ring and energy level as well as brightness. The selected node is carried by a selection ring and scale as well as color, per VR005 and AC008. Active relationship paths are carried by stroke weight and a highlighted state as well as color.
4. prefers-contrast. When the user requests more contrast, label weight and contrast increase and decorative low contrast detail is suppressed, per AR007.

## 8. Touch targets and mobile

Per AR009 and the mobile art direction, phone interaction is a deliberate model, not a shrunken desktop scene.

1. Minimum target. Interactive targets are at least 44 by 44 CSS pixels.
2. Generous star hit area. Each star has an invisible hit target larger than its visible point so opening a project never requires precision dragging.
3. Tap model. First tap focuses and reveals the label, second tap opens the detail sheet, replacing hover.
4. Bottom sheet. Project detail uses a modal bottom sheet with a visible grab handle, large actions, contained focus, and focus return on close.
5. Reachability. Sector controls, search, and Atlas remain within thumb reach and one tap away.

Evidence. `tests/e2e/mobile.spec.ts` exercises the tap model and records the interaction, satisfying AC011.

## 9. Pause control for continuous motion

Per AR006 and AC026, a labeled PAUSE MOTION control is visible whenever continuous motion is active.

1. Always visible during motion. The control is present and keyboard reachable while any continuous decorative motion runs.
2. Immediate effect. Activating it stops drift, pulses, signal travel, and parallax at once.
3. Persistence. The choice is remembered for the session locally, with no account and no server, per AN003.
4. Reflects reduced motion. When reduced motion mode is active, motion is already stopped and the control reflects that state.

Evidence. `tests/e2e/explore.spec.ts` asserts the control is visible during motion and that toggling it stops motion, confirmed by a frame comparison, satisfying AC026.

## 10. Audio rules

Per AR005, AC027, F12, and interview decision 26, audio ships in version one, optional and off by default.

1. No autoplay. No audible sound begins without a user gesture, and no audio context resumes on load.
2. Visible control. Audio has a visible mute and enable control with a clear state, operable by keyboard.
3. Local preference. The choice is stored only on the local device.
4. Not required. The experience is fully usable with audio muted, per non negotiable principle 5.

F12 in `docs/DECISIONS.md` settles that audio ships in version one, so this section is live, not conditional. The earlier open question of whether audio shipped (discovery question 111) is resolved.

## 11. Manual screen reader test matrix

Axe cannot prove a real assistive technology experience, so the following flows are checked by hand on each platform before release, per accessibility acceptance 10. Results are recorded in `docs/RELEASE_REPORT.md`.

| Platform | Screen reader and browser |
|----------|---------------------------|
| macOS | VoiceOver with Safari |
| Windows | NVDA with Firefox, and NVDA with Chrome |
| iOS | VoiceOver with Safari |
| Android | TalkBack with Chrome |

Flows checked on each combination:

1. Landing and shell. The skip link, the site name, the primary statement, and the shell actions are announced and operable.
2. Map navigation. The accessible star list is reachable, arrow navigation moves the roving selection, selection is announced, and the panel receives focus.
3. Search. The palette opens, results are announced with position, and choosing a result announces the selection and moves focus correctly.
4. Project detail. The panel content is read in a sensible order, the actions are labeled, and closing returns focus to the opener.
5. Atlas. The complete catalog is navigable with search, filters, and links, with no reliance on the canvas.
6. Reduced motion and pause. Entering reduced motion and using the pause control are announced and effective.

## 12. Axe automation configuration

Per AR010 and AC025, axe runs inside Playwright and fails the build on any serious or critical violation.

Rule set. WCAG 2.2 AA rule tags, being the 2.0 A and AA, 2.1 A and AA, and 2.2 AA tags. Severity gate at serious and critical.

Scope. The decorative canvas is excluded because it is aria hidden. Its HTML mirror, being the accessible star list and the Atlas, is included. No other exclusions are permitted without a documented exception in `docs/DECISIONS.md`.

Routes scanned:

1. The home shell, scanned both before hydration, which is the server rendered HTML, and after hydration.
2. `/atlas/`.
3. A representative `/project/<slug>/` page.
4. The custom 404 page.

States scanned on the applicable routes:

1. Default.
2. Project panel open.
3. Command palette open.
4. Sector filters applied.
5. Tour active.
6. Reduced motion mode.
7. Mobile viewport.
8. WebGL fallback, where Atlas has taken over after a forced context failure.

Each scan writes an axe JSON report retained as a CI artifact, and any serious or critical violation blocks the release.
