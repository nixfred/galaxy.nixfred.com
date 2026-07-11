# NIXFRED GALAXY Design Bible

Status: Binding law. Synthesized 2026-07-10 from four war room position papers and `docs/ART_DIRECTION.md`. This document governs the build. The Phase 5 launch gate and acceptance criterion AC006 enforce it directly.

Source papers, cited throughout by filename:

- `01_VISUAL_IDENTITY.md` (visual identity seat)
- `02_WEBGL_CRAFT.md` (WebGL rendering craft seat)
- `03_REFERENCE_INTEL.md` (reference intelligence seat)
- `04_ADVERSARIAL_CRITIQUE.md` (adversarial critic seat)

`docs/ART_DIRECTION.md` remains valid wherever this document does not explicitly override it. Where the two conflict, this document wins, and every such delta is listed in Section 3. This revision also incorporates Fred's direct rulings from a 28 question preference interview, recorded in `docs/DECISIONS.md` Part 5 (F1 through F30). A Fred ruling always outranks a seat position paper; where F9 overrides the critic's tiebreaker recommendation, Section 1 states the override explicitly.

## 1. The Ruling Thesis

Fred ruled directly on the four creative metaphors in `ART_DIRECTION.md` (scientific star atlas, mission control, private terminal, personal memory map): they blend evenly (`DECISIONS.md` F9). This overrides `04_ADVERSARIAL_CRITIQUE.md`'s Risk 1 guardrail, which had proposed naming one primary metaphor as a tiebreaker (star atlas rules the geometry, terminal rules the voice) specifically to prevent the four-metaphor mush the critic warned about. Fred's ruling is binding: no metaphor outranks another, and no element may be justified by reaching for whichever of the four happens to be convenient in the moment.

The critic's underlying warning still stands as a real risk: an uncommitted blend of four references is indistinguishable from a template, because every hard decision can be resolved by "add a bit of all four." Fred's ruling answers that risk with enforcement rather than a hierarchy. Two mechanisms carry the entire weight of preventing genericness under an even blend, and both remain fully blocking with no softening: WC02, the template test (Section 4), and the 34-item cliche kill list (Section 5). If the even blend produces a screen that would be indistinguishable from a generic dark sci-fi template with the NIXFRED name and colors removed, or if it contains any kill-list cliche, it fails, regardless of which metaphor was invoked to justify it.

Three taste tiebreakers, carried in spirit from `04_ADVERSARIAL_CRITIQUE.md` Section 4, remain in force unchanged. None of the three concerns metaphor selection, so none conflict with the even blend ruling:

1. Meaning outranks spectacle. Every effect shall earn its place by communicating structure, state, or relationship. An effect with no answer to "what does this tell the visitor about the work" is cut.
2. The work is the star, the interface is the telescope. When a choice would make the visitor notice the interface instead of the work, the quieter option wins. Chrome, animation, and personality serve the projects and step back.
3. When in doubt, cut it and see if you miss it. Restraint is the reversible choice. The default answer to "should we add one more effect" is no, and the burden of proof sits on the addition.

These three are law, not guidance. Any reviewer, at any phase gate, may invoke them to kill a feature. No seat's position paper outranks them, and where a seat's position conflicts with one of Fred's direct rulings in `DECISIONS.md` Part 5, Fred's ruling always wins. F9 is the clearest example.

Tone (`DECISIONS.md` F5, F6): the emotional target is formidable but human, the scale lands first and the warmth lives in the details. The scene feel is a scientific base with cinematic moments and a deliberate cyberpunk streak, unambiguously dark. This tunes the cyber cartography direction, it does not replace it: BD01's near-black surfaces, BD19 through BD21's restrained bloom discipline, and BD11's flat instrument chrome all stay exactly as specified. Section 2.9 makes the tone rules concrete.

## 2. Binding Decisions

Numbered BD01 through BD57. Each cites its source seat or, for Fred's direct rulings, `DECISIONS.md` Part 5.

### 2.1 Color system

BD01. Base surfaces use three near-black elevation steps, never two, never pure black: `surface-0` #05070A (root canvas), `surface-1` #0B0F14 (chrome: header, footer, filter rail, palette backdrop), `surface-2` #12171F (highest elevation: detail panel, modals, mobile sheet). (`01_VISUAL_IDENTITY.md`)

BD02. Every sector shall carry a distinct core hex (points, active state text) and halo hex (glow, field, sector cloud), and the two shall never share a value.

| Sector | Core | Halo | Character |
|---|---|---|---|
| IT | #FF6B4A | #3A1F16 base / #FF6B4A 12% | sharp, alert, exposed |
| Labs | #4ADE80 | #153322 base / #4ADE80 12% | curious, generative |
| Work | #38BDF8 | #122A38 base / #38BDF8 12% | credible, architectural |
| Signal | #FBBF24 | #332611 base / #FBBF24 12% | active intelligence |
| Clients | #B794F6 | #241B33 base / #B794F6 12% | restrained, distinct |
| Personal | #C9D3DC | #1B1F24 base / #C9D3DC 8% | quiet, protected |

All six core hues sit at roughly OKLCH L65 to L75 so no sector visually outranks another and so every core hex clears AA contrast as text on `surface-0`. (`01_VISUAL_IDENTITY.md`)

BD03. Personal's halo opacity (8%) shall be the lowest of the six, and that opacity reduction is the entire mechanism for "quiet and protected." No separate Personal-only component may be built to express this, turning the halo down is the whole implementation. Memorial-flagged Personal entries additionally take the memorial-quiet state: no pulse ever, no corona complexity regardless of relationship count, halo opacity capped below any other Personal entry, and the detail panel drops to Open and Share only, with no Compare and no Pin prompt. This state is content-driven and flagged in data, never visitor-triggered. (`01_VISUAL_IDENTITY.md`)

BD04. Text hierarchy uses four gray tokens on `surface-0`: `text-primary` #F2F4F7 (about 17.8:1), `text-secondary` #A9B4C0 (about 9.3:1), `text-metadata` #5A6B7A (about 4.6:1, treat as a floor at 13px, step up to `text-secondary` below that size), `text-disabled` #3A4552 (fails AA on purpose, decorative dimming only, never load-bearing text). Archived project labels use `text-secondary` at reduced opacity through a real archived-dim state, never `text-disabled`, so archived work stays legible. (`01_VISUAL_IDENTITY.md`)

BD05. One system accent, `accent-signal` #38BDF8 (reused from Work's cyan), covers all interactive chrome (buttons, links, focus rings, palette selection) outside sector context. The palette is closed at seven colors total: six sector cores plus this one accent. No seventh accent color shall be introduced. New-color urges are solved with brightness, opacity, or motion instead. (`01_VISUAL_IDENTITY.md`)

BD06. Color may carry sector identity, status brightness delta, and archive desaturation. Color shall never be the sole carrier of selection state, filtered state, warning state, or relationship strength. Each of those shall stack at least one non-color cue (ring, size change, camera composition, line weight). This is the concrete mechanism behind VR005 and AR010. (`01_VISUAL_IDENTITY.md`)

### 2.2 Typography

BD07. The type system uses four families: Space Grotesk (display), JetBrains Mono (monospace), Inter (body sans, self-hosted, chosen because Space Grotesk fatigues at paragraph sizes), and a subsetted Noto Sans JP (Japanese accent glyphs only). All four are self-hosted with no third-party font CDN dependency. (`01_VISUAL_IDENTITY.md`) This resolves a PENDING-FRED gap in `ART_DIRECTION.md`; see Section 3, Conflict C.

BD08. The type ramp is fixed.

| Element | Font | Size | Weight | Tracking | Case |
|---|---|---|---|---|---|
| Site title | Space Grotesk | 28px desktop / 22px mobile | 600 | +0.02em | UPPERCASE |
| Selected project title | Space Grotesk | 24px | 600 | 0 | as given |
| Major project labels | Space Grotesk | 14px | 500 | +0.01em | as given |
| Sector names | Space Grotesk | 12px | 600 | +0.12em | UPPERCASE |
| System metadata | JetBrains Mono | 11 to 13px | 400 to 500 | +0.04em | UPPERCASE labels, sentence values |
| Body copy | Inter | 15px / 1.55 line height | 400 | 0 | sentence case |
| Minor project labels | Space Grotesk | 12px | 500 | +0.01em | as given |
| Command palette input | JetBrains Mono | 15px | 400 | 0 | as typed |

(`01_VISUAL_IDENTITY.md`)

BD09. Sector names are always set in the display face (Space Grotesk), never JetBrains Mono, because they are proper nouns in this universe. Project titles shall never be forced into uppercase or any case other than what Fred wrote. Project names are data, and the site does not art-direct Fred's own content. (`01_VISUAL_IDENTITY.md`)

BD10. Japanese accent text uses subsetted Noto Sans JP only, sized 10 to 11px and always smaller than the smallest active metadata label on screen, placed only adjacent to system metadata or the boot sequence, never adjacent to a project title. One accent per screen state maximum. Every Japanese string shall be a correct, meaningful label of the exact thing beside it, verified by a Japanese reader. If a string cannot be made both correct and meaningful, it does not ship. (`01_VISUAL_IDENTITY.md`, `04_ADVERSARIAL_CRITIQUE.md` Risk 4)

### 2.3 Chrome language

BD11. Panels use `surface-2`, a 1px border at #1E2732, and a 4px border radius, never more. Rounded card panels (8px or greater radius, drop shadows, gradient fills) are banned without exception. They are the fastest way to make an instrument readout look like a SaaS dashboard. (`01_VISUAL_IDENTITY.md`, `04_ADVERSARIAL_CRITIQUE.md` kill list item 6)

BD12. Corner ticks (four L-shaped marks, 6px arm, 1px stroke) are reserved exclusively for one functional purpose: the selected star's bounding highlight and the keyboard focus ring. See Conflict A in Section 3 before implementing any other corner-tick usage; decorative panel and palette framing is cut.

BD13. Every panel header carries a 1px horizontal rule (#1E2732) followed by a monospace status line in `text-metadata`, for example `SECTOR: LABS // STATUS: ACTIVE // REL: 4`. (`01_VISUAL_IDENTITY.md`)

BD14. The command palette input is prefixed with a static `>` glyph in `accent-signal`. It shall never blink while idle. Blinking is reserved for the one-time boot sequence only, exactly one blink cycle, then permanently gone. No other UI element may reuse the blinking-cursor motif. (`01_VISUAL_IDENTITY.md`, `04_ADVERSARIAL_CRITIQUE.md` kill list item 20, Risk 3)

BD15. Buttons use three tiers only: primary (filled, `accent-signal` or the active sector core when sector-scoped, radius 4px, no shadow, no gradient), secondary (1px stroke #1E2732, hover raises to `accent-signal`), tertiary (text-only underline, `text-secondary` to `text-primary` on hover). (`01_VISUAL_IDENTITY.md`)

BD16. Radii are system-wide and closed: 4px for panels and buttons, 2px for tags and pills, 999px (full pill) reserved exclusively for status indicator dots and the mute toggle. No other element may use a full pill radius. (`01_VISUAL_IDENTITY.md`)

BD17. Stroke weights are closed: 1px resting borders and rules, 1.5px focused or active borders, 2px maximum for a selection ring. Nothing exceeds 2px. A thicker ring reads as game UI. (`01_VISUAL_IDENTITY.md`)

BD18. Exactly one darkening mechanic exists for "focus this, recede everything else," reused for selection, compare mode, panel-open state, and tour-active state. Panels and the command palette never blur the map behind them. Blur is expensive, and instruments do not gaussian-blur the world, they draw a panel over part of it. (`01_VISUAL_IDENTITY.md`)

### 2.4 Bloom discipline

BD19. Bloom, as a visual effect, is reserved exclusively for three targets: active or selected star cores, the NIXFRED center node, and relationship-line signal packets in motion. It is banned everywhere else without exception, including panel edges, button hovers, and any text. If it can be read, it does not glow. If it can be looked at, it may glow. This rule is non-negotiable; no seat may carve an exception for something that "looks nice." (`01_VISUAL_IDENTITY.md`, reinforced by `04_ADVERSARIAL_CRITIQUE.md` kill list items 11 and 30, Risk 11)

BD20. The default technical implementation of BD19 is a procedural additive halo in the star and signal shaders, not a post-processing bloom pass. Ship with zero post-processing composer by default on every tier. A true selective-layer post-process bloom (`UnrealBloomPass` on a dedicated bloom layer, never scene-wide) may only be trialed as a desktop-high-tier, off-by-default enhancement on the local-sun focus moment, threshold 0.85, strength 0.4 to 0.6, radius 0.3 to 0.4, and shall be evaluated against the shader-halo baseline with the expectation that it loses that evaluation and is cut. (`02_WEBGL_CRAFT.md`; see Conflict B in Section 3)

BD21. No authored element exceeds roughly 0.7 in any channel at rest, so pulse peaks and halo overlaps have headroom before clipping to white. `surface-0` stays genuinely near black (0.02 to 0.04 range) for the same reason. Full white is reserved for the selected local sun's peak only. (`02_WEBGL_CRAFT.md`)

### 2.5 Motion law

BD22. The entrance sequence resolves to interactive in under 1.5 seconds on every visit, full stop. Real boot states (catalog loaded, renderer ready, labels ready, map online) render simultaneously with a live, already-rendering map behind them, never gated in sequence. A state that resolves in milliseconds is allowed to simply not linger; artificial delay for dramatic pacing is banned. Within that envelope, the title arrival is a designed cinematic moment with real presence, not a bare HUD lock-on; it may carry more visual weight than a minimal system readout would, provided it never pushes interactivity past 1.5 seconds and never blocks a click. First-time visits in a browser session receive this full cinematic entrance; repeat visits within the same session use the shortened entrance, with the full sequence available again only on explicit request. (`01_VISUAL_IDENTITY.md`, `ART_DIRECTION.md`, `04_ADVERSARIAL_CRITIQUE.md` Risk 5, `DECISIONS.md` F10, F11)

BD23. Input during the entrance sequence is honored immediately. A click on `ENTER THE MAP` at 400ms shall be honored at once; the remaining boot lines simply stop being visible rather than fighting the input. No animation may gate a click. (`01_VISUAL_IDENTITY.md`)

BD24. Idle camera drift stops the instant the user grabs the camera. The camera shall never rubber-band, overshoot, or drift back after a user-initiated move. No ambient camera wander, scene rotation, or signal racing while a detail panel is open and being read. (`04_ADVERSARIAL_CRITIQUE.md` kill list items 6 and 10, Risk 6)

BD25. Motion communicates structure or state only, never spectacle for its own sake. Signals travel only on the selected node's direct edges, the active compare path, or the active tour route; every other edge is a static faint line at rest. (`ART_DIRECTION.md`, `02_WEBGL_CRAFT.md`, `04_ADVERSARIAL_CRITIQUE.md` Risk 6)

BD26. Reduced motion is a first-class designed mode, not a stripped fallback. It removes drift, parallax, pulses, and signal travel, replaces camera travel with instant reframing (optionally masked by a 120 to 150ms crossfade), and preserves every function: focus, search, filters, panels, tours, compare, and Atlas all keep working. A powerful desktop with `prefers-reduced-motion` set runs full desktop-high visuals with continuous motion removed, not the stripped mobile geometry; the two axes, capability and motion preference, stay independent in the tier logic. (`ART_DIRECTION.md`, `02_WEBGL_CRAFT.md`)

BD27. Camera focus transitions ease with acceleration and deceleration, never linear, over 650 to 850ms desktop and 400 to 550ms mobile. Tour hops use the same envelope so pacing feels authored. (`02_WEBGL_CRAFT.md`)

### 2.6 Rendering technique commitments

BD28. Two star populations use two distinct techniques: the ambient background field renders as `THREE.Points` with a custom shader (cheap, never picked), and the 30 to 100 interactive project stars render as one `InstancedMesh` of camera-facing billboarded quads with per-instance attributes. Points are rejected for interactive stars because `gl_PointSize` hits a hardware ceiling on mobile, point sprites cull the instant their center leaves frustum, and perspective size scaling via points is driver-brittle. (`02_WEBGL_CRAFT.md`)

BD29. Star discs and halos render procedurally in the fragment shader (radial distance, `smoothstep` core with `fwidth` anti-aliasing, `pow` falloff halo), never from a texture. This keeps stars crisp at any zoom and DPR, costs zero texture memory, and keeps pulse and halo parameters as live uniforms. No stock nebula photography or star sprite textures anywhere in the primary visual identity. (`02_WEBGL_CRAFT.md`, `ART_DIRECTION.md` effects budget)

BD30. Additive blending on near-black is the HDR-feel mechanism: `AdditiveBlending`, `depthWrite: false`, `depthTest: true`, authored base colors at or below 1.0 per channel (see BD21). No `WebGLRenderTarget` float pipeline, no tone mapping pass. This is a deliberate budget decision, not a compromise. (`02_WEBGL_CRAFT.md`)

BD31. Relationship lines use `Line2` with `LineMaterial`, never native `THREE.Line` or `LineSegments`, which render one aliased device pixel wide and ignore `linewidth` on most drivers. The traveling signal is a shader-driven moving Gaussian brightness bump along a baked arc-length attribute, not an animated dash pattern and not a swarm of sprites; dashing is rejected because it makes the whole line read as tentative rather than showing one discrete packet. Signal animation is restricted to selected, tour, and compare edges per BD25. (`02_WEBGL_CRAFT.md`, `04_ADVERSARIAL_CRITIQUE.md` kill list item 24)

BD32. Sector atmosphere renders as one or two large soft additive billboards per sector, fed by fbm sampled from a single small runtime-generated noise `DataTexture` (never analytic per-fragment noise at scale), masked radially so it fades to nothing at the quad edge, alpha capped 0.03 to 0.10. Mobile and desktop-low tiers drop fbm entirely for a single radial gradient sprite. Full-screen fbm nebula and photographic nebula planes are both rejected: the first overdraws and competes with the stars, the second is banned outright by the effects budget. (`02_WEBGL_CRAFT.md`, `ART_DIRECTION.md`)

BD33. The camera rig is custom app code (1 to 2KB), never `OrbitControls`. State is a target point plus spherical offset (azimuth, polar, radius). Roll is impossible by construction (`camera.up` locked to world Y, always `lookAt(target)`). Polar angle is clamped to roughly 60 to 85 degrees from vertical. Damping uses `1 - exp(-lambda * dt)` for framerate-independent feel across 30 and 60fps. Off-center composition, so the detail panel never covers the focused star, uses `camera.setViewOffset`, never a nudge to `target`, which would distort parallax. (`02_WEBGL_CRAFT.md`)

BD34. Project labels are HTML overlay elements (a `CSS2DRenderer` or an equivalent hand-rolled projector), never SDF in-scene text such as `troika-three-text`. This is not a close call: the accessibility requirements already mandate an HTML representation of every project name, so paying for an SDF text engine on top would mean building the HTML layer twice. Updates are transform-only writes, never triggering layout reflow. Visibility and fade are driven by camera distance and a screen-space collision grid, priority ordered per `ART_DIRECTION.md`'s label hierarchy. (`02_WEBGL_CRAFT.md`)

BD35. Picking uses one raycast against a dedicated `InstancedMesh` of invisible, generous hit proxies (`colorWrite: false`, `depthWrite: false`, radius 2 to 3 times the visual core), never a raycast against the small visible cores directly and never GPU id-buffer picking at this node count. Hover raycasting is throttled to at most once per animation frame and is skipped entirely on mobile, where a single tap focuses and a second tap opens. (`02_WEBGL_CRAFT.md`)

BD36. Adaptive quality is a four-tier system, DPR cap as the first and strongest lever, because fill rate scales with DPR squared.

| Tier | DPR cap | Ambient particles | Nebula | Bloom | Line signals |
|---|---|---|---|---|---|
| Desktop high | 2.0 | 3000 to 6000 | fbm noise texture | none by default | full |
| Desktop low | 1.25 to 1.5 | about 1500 | gradient sprite | none | active only |
| Mobile | 1.0 to 1.5 | 500 to 800 | gradient sprite | none | selected node only |
| Reduced data / reduced motion | 1.0 to 1.25 | 200 to 400 | static gradient | none | static highlight, no travel |

(`02_WEBGL_CRAFT.md`)

BD37. A runtime FPS watchdog holds a rolling 60-frame average. If the average sustains above roughly 22ms (under about 45fps) for 2 to 3 seconds, it steps down one item at a time in fixed order: DPR, then traveling signals, then ambient particle count, then nebula fidelity, then selective bloom if present, re-measuring after each step. It steps back up only after 8 to 10 seconds comfortably under 14ms, one item at a time, never past the ceiling detected at load. The watchdog degrades silently and never flashes or restarts the scene. This pattern is validated precedent, not novel risk: GitHub's homepage globe runs the same continuous, self-correcting degradation loop, monitoring FPS and stepping down pixel density, geometry count, and raycast frequency in real time rather than shipping one static quality tier. (`02_WEBGL_CRAFT.md`, `03_REFERENCE_INTEL.md` reference 1)

BD38. The render loop allocates nothing per frame (preallocated scratch math objects, indexed `for` loops, in-place typed array writes). One `THREE.Clock` drives all motion. The loop pauses entirely on `visibilitychange` to hidden and via an `IntersectionObserver` when the canvas scrolls out of view, and idle rendering drops to half cadence when there is no input and no active transition. WebGL context loss is handled explicitly (`preventDefault` on loss, full GPU resource rebuild on restore) and unrecoverable failure falls through to the Atlas HTML fallback, never a broken canvas. (`02_WEBGL_CRAFT.md`)

BD39. Three.js is never imported in shell code; it lives only in the lazy-loaded visualization chunk. Imports are named and path-exact so the bundler tree-shakes. If the viz chunk exceeds its 300KB gzipped budget, the cut order is fixed: any post-processing composer first, then the fbm nebula shader and its texture (fall back to gradient sprites), then any addon that crept in, then dead app-code paths. The core renderer, the `InstancedMesh` stars, `Line2` relationship lines, the custom camera rig, and the HTML label layer are never cut. They are the product. (`02_WEBGL_CRAFT.md`)

### 2.7 Spatial composition

BD40. The negative space between the six sectors is deliberate and shall stay empty. No ambient particles may fill inter-sector space "for atmosphere"; doing so collapses six distinct territories back into one indistinct dust cloud. (`01_VISUAL_IDENTITY.md`, `04_ADVERSARIAL_CRITIQUE.md` kill list item 4)

BD41. At overview scale, value and position carry the structure; hue is a quiet identifier at low saturation (small bright cores, large quiet halos per BD02). Full saturation is earned only on selection and hover, one sector at a time. A squint test at overview shall reveal structure, never confetti. (`01_VISUAL_IDENTITY.md`, `04_ADVERSARIAL_CRITIQUE.md` Risk 2)

BD42. Depth reads through three cheap, legible cues rather than true free-camera parallax: scale and opacity falloff for stars off the focal plane, low-density `FogExp2` depth fog tuned so overview labels never fog out, and parallax drift on sector clouds at roughly 20 to 30 percent of foreground star drift. Pitch stays clamped (BD33) specifically because unlimited pitch breaks depth perception on a flat screen. (`01_VISUAL_IDENTITY.md`, `02_WEBGL_CRAFT.md`)

### 2.8 Six-sector fixed layout

BD43. The six sectors occupy stable, deterministic angular wedges and radius bands around the NIXFRED core, seeded and authored, never force-directed physics. This is a structural constraint, not a style preference: `03_REFERENCE_INTEL.md`'s review of Obsidian's graph view documents that free physics layouts read cleanly under roughly 50 nodes but collapse into an unreadable "hairball" past roughly 200, and while this product's 30-to-100-star catalog sits comfortably under that threshold today, the six fixed sectors are the correct structural answer regardless of count and shall never be "improved" toward free-form physics as the catalog grows. Each sector additionally carries its own field shape as a legibility cue, never a border: IT tight and angular, Labs broad and organic, Work grid-aligned, Signal branching, Clients restrained and evenly spaced, Personal sparse with the most negative space per star. (`01_VISUAL_IDENTITY.md`, `03_REFERENCE_INTEL.md` reference 7, `DECISIONS.md` Q61)

### 2.9 Tone execution

BD44. Tone execution: formidable but human, scale lands first, warmth lives in the details; a scientific base with cinematic moments and a deliberate cyberpunk streak, unambiguously dark. This tunes, not replaces, the cyber cartography direction: BD01's near-black surfaces, BD19 through BD21's restrained bloom discipline, and BD11's flat instrument chrome stay exactly as specified. (`DECISIONS.md` F5, F6)

BD45. Digital scanline and noise texture, where used, stays at whisper level, confined to chrome details such as panel edges, HUD readouts, and the boot sequence, never over body text, and never animated. This is the sanctioned expression of the cyberpunk streak beyond BD44's general tone; it shall not intensify into the heavy scanlines that `ART_DIRECTION.md`'s effects budget and `04_ADVERSARIAL_CRITIQUE.md`'s kill list both already ban outright. (`DECISIONS.md` F7)

### 2.10 Center and sectors

BD46. Star anatomy is confirmed as core point, soft halo, and thin technical status ring (`DECISIONS.md` F8), matching `ART_DIRECTION.md`'s star anatomy list and BD02's core and halo pairing. No additional layered ornamentation is authorized beyond what `ART_DIRECTION.md` already specifies: core, halo, status ring, selection ring, hit target, and label anchor.

BD47. The NIXFRED core node is a luminous, clickable navigation hub, not a normal project star. Clicking it opens the About and identity panel, which links back to nixfred.com, completing the loop from the galaxy back to the source site. The panel identifies Fred as `Fred Nix`, with the NIXFRED wordmark carrying the brand. (`DECISIONS.md` F14, F4)

BD48. The core carries quiet monospace live instrumentation nearby, drawing on BD08's system metadata typography: project count, sector count, and status, all derived from real catalog data. Placeholder or invented numbers are never shown. (`DECISIONS.md` F15)

BD49. There are six sectors: IT, Labs, Work, Signal, Clients, Personal. The map-facing label for the intelligence and memory sector is `SIGNAL`, shortened from the catalog's "Signal and Noise" section name; the mapping is recorded in `sectors.json`. (`DECISIONS.md` F16, F17)

### 2.11 Interaction model

BD50. A single click on a star selects it and opens its detail panel in one action. There is no separate select-then-click-again step. (`DECISIONS.md` F18)

BD51. A double click on a star opens the external project in a new tab. Touch input is unaffected: first tap focuses, second tap opens, per the existing mobile default. (`DECISIONS.md` F19)

BD52. The map remembers camera position for the duration of the browser session, so a visitor returning from an opened project tab lands back where they left the map. A fresh browser visit still begins at the intentional overview, and deep-linked state still restores exactly as linked; only same-session camera position carries forward. This overrides the earlier accepted default that every arrival starts fresh. (`DECISIONS.md` F20)

### 2.12 Audio

BD53. Optional ambient audio with quiet interface confirmation tones ships in v1, off by default, with a visible mute control, never autoplaying under any circumstance, and the visitor's on or off preference remembered on the local device only. (`DECISIONS.md` F12, `ART_DIRECTION.md`)

### 2.13 Signature features and easter eggs

BD54. The Larry anomaly ships as a designed feature, not an easter egg: a small moving or self-repositioning object whose relationship lines subtly shift with context, tasteful and slow, and it shall never imply access to private data. (`DECISIONS.md` F13, `04_ADVERSARIAL_CRITIQUE.md` Risk 7)

BD55. The Sky Walrus is the only easter egg in v1. The typed `whoami`, `larry`, and `home` commands and any Konami-code alternate rendering are cut entirely and shall not be built. Any earlier reference to those commands in `ART_DIRECTION.md` or elsewhere as pending is withdrawn. (`DECISIONS.md` F21)

### 2.14 Content anchors and composition targets

BD56. Seven named anchor stars carry the brightest editorial weight on the map, chosen directly by Fred, not inferred: Meet Larry, Build Your Own Larry, The Universe As I See It, YouTube Library, Sky Walrus, Where Physics Starts Sweating, and The Code Audit. AI Signal (aiwatch.nixfred.com) is additionally elevated. Any composition rule elsewhere in this Bible or in `ART_DIRECTION.md` that references a handful of bright anchors per sector means these seven plus AI Signal specifically, eight bright anchors around the core, not an arbitrary editorial guess and not five. (`DECISIONS.md` F1)

BD57. Four relationships are guaranteed discoverable regardless of what the inferred graph produces, each carrying its own human-readable reason per BD31 and `ART_DIRECTION.md`'s relationship design rules: Meet Larry to Build Your Own Larry (the story to the guide), Build Your Own Larry to AI Infrastructure Portfolio (the patterns are the practice), Artemis Tracker to Where Physics Starts Sweating (the space and physics constellation), and The Nix Times to INTEL to AI Signal (the intelligence pipeline). (`DECISIONS.md` F2)

## 3. Conflict Resolutions

Three real conflicts surfaced across the four seats and `ART_DIRECTION.md`, resolved by synthesis judgment. All three are ruled here and are binding. A separate category, Fred's direct rulings in `DECISIONS.md` Part 5 overriding a seat position outright, is not a synthesis call; F9's override of the critic's metaphor tiebreaker is documented in Section 1, not here.

Conflict A, corner-tick chrome versus the kill list's ban on decorative bracket framing. `01_VISUAL_IDENTITY.md` proposed corner ticks on three surfaces: the selected star's bounding highlight, the detail panel's four corners at 40% opacity as pure decoration, and the command palette's frame. `04_ADVERSARIAL_CRITIQUE.md` kill list item 16 bans exactly the second and third usage by name, calling corner brackets "lifted straight from the Aliens / generic-movie-UI kit... pure sticker," with the discipline that panel structure comes from real layout and a considered border treatment, not decorative brackets that do nothing. Ruling: corner ticks survive only as the selection and keyboard-focus indicator (BD12), where they replace a full box outline and correspond to a real, load-bearing state, exactly as the critic's own rule that every animated interface element must correspond to a real state requires. Decorative corner ticks on panel corners and the command palette frame are cut. The panel and palette get their structure from BD11's layout, spacing, and hairline border alone. This overrides `01_VISUAL_IDENTITY.md` section 4.

Conflict B, bloom as a required effect versus bloom as a rejected technique. `01_VISUAL_IDENTITY.md` mandates bloom on cores, the center node, and moving signals as non-negotiable. `02_WEBGL_CRAFT.md`'s firm recommendation is to ship zero post-processing bloom by default on any tier. These are not actually opposed once technique is separated from effect: the identity seat is specifying where the glow effect is allowed to exist, the WebGL seat is specifying how to build it cheaply. Ruling: BD19's effect scope stands as written, and BD20 makes the WebGL seat's shader-halo technique the required default implementation, with true post-process bloom demoted to an off-by-default, likely-to-be-cut, desktop-high experiment. Nothing in `ART_DIRECTION.md`'s "restrained bloom" allowance is lost; it is pinned to a specific, cheap technique.

Conflict C, named display and monospace fonts versus `ART_DIRECTION.md`'s PENDING-FRED marker. `ART_DIRECTION.md` Contradictions item 5 leaves the exact type family names unresolved, instructing the team to pull from nixfred.com's actual production type stack at implementation time rather than guess. `01_VISUAL_IDENTITY.md` asserts specific families, Space Grotesk and JetBrains Mono, as confirmed brand fonts from the existing NIXFRED identity. Ruling: BD07 and BD08 are adopted as the working default, on the premise that the identity seat's claim is accurate. The builder shall verify Space Grotesk and JetBrains Mono against nixfred.com's live production font stack before shipping. If verification shows a different pair is actually in production, the family names in BD07 and BD08 update to match, but the three-tier hierarchy, the role assignments (display for names, monospace for system data, sans for prose), and every size, weight, and tracking value in BD08 stay locked regardless of which specific families are confirmed. This closes the PENDING-FRED item without waiting on Fred, per `DECISIONS.md` R2's defaults mechanic.

One additional delta, not a seat conflict but a narrowing of `ART_DIRECTION.md`. Its effects budget lists cursor blinks among generally allowed small terminal details without restricting where. BD14 narrows this to the one-time boot sequence exclusively, per `01_VISUAL_IDENTITY.md`'s reasoning that a persistent blinking cursor is the strongest "still loading" signal in computing and cheapens the one place it should mean something, and `04_ADVERSARIAL_CRITIQUE.md` Risk 3's warning that a decorative blinking cursor is exactly how a terminal aesthetic curdles into costume. `ART_DIRECTION.md` remains authoritative on every other item in its effects budget.

## 4. The World Class Rubric

Fifteen binary pass/fail checks, carried verbatim from `04_ADVERSARIAL_CRITIQUE.md` Section 3, in document order. These feed acceptance criterion AC006 and gate Phase 5. None may be softened. A "mostly" is a fail.

WC01. First-viewport truth: Within ten seconds of first load, with no interaction, does a new visitor understand that this is a connected system of real work, and not a decorative space background? Yes / No.

WC02 (the apex check). The template test: If you removed the NIXFRED name and colors, would the interface still be identifiably this site and not interchangeable with any dark sci-fi template? Yes / No. This is the critic's own framing, unaltered, and it is the single check the rest of this Bible exists to help pass.

WC03. Text legibility: Is every piece of text a visitor must read (names, descriptions, labels, controls) free of glow halo, of hairline weight, and passing AA contrast against its actual background? Yes / No.

WC04. Monospace discipline: Is monospace confined to coordinates, status, commands, dates, and hashes, with prose and headings set in a real reading face? Yes / No.

WC05. Camera obedience: When the user grabs, pans, or zooms the camera, does the view respond immediately, arrive where aimed, and settle without rubber-banding, overshoot, or idle drift fighting the input? Yes / No.

WC06. Input latency: Does hover feedback appear within one frame and does clicking or tapping a node begin its response in under 200ms, with no perceptible lag on hover states? Yes / No.

WC07. Motion restraint at rest: With a detail panel open and the user reading, is the map calm, with no ambient camera wander, no scene rotation, and no signals racing on unselected edges? Yes / No.

WC08. Graph is never a hairball: At overview, does the map show sector structure and a few major paths rather than the full relationship mesh, and are dense relationships revealed only on selection, compare, or tour? Yes / No.

WC09. Color hierarchy: Squinting at the overview, does a clear value and position structure emerge rather than an even confetti of six equal-shouting hues, with full saturation reserved for focus? Yes / No.

WC10. Composition, not scatter: Do the major stars form intentional, readable figures within their sectors, rather than looking like randomly sprinkled dots, at the real catalog size? Yes / No.

WC11. Metadata credibility: Does the information in a detail panel (dates, tags, relationships, repository links, the one-sentence description) read as real, specific, and true, with no filler, no fake numbers, and no invented connections? Yes / No.

WC12. Loading honesty: Is the loading experience either genuinely fast or reporting only true states, with zero fake percentage and zero boot-theater padding, and is it skippable? Yes / No.

WC13. Mobile intentionality: On a real phone, is this a purpose-built composition with thumb-reach controls, generous tap targets, and a bottom sheet, such that opening any project takes no precision dragging? Yes / No.

WC14. Reduced motion is designed: With `prefers-reduced-motion` on, is the site fully functional and still composed and intentional, a designed mode rather than a stripped or broken one? Yes / No.

WC15. Kill list is absent: Can you scan the running site and confirm the total absence of every kill-list cliche: no stock nebula, no twinkle field, no warp intro, no corner-bracket chrome, no fake data stream, no glitch transitions, no uniform bloom, no Matrix rain, no autoplay audio, no glowing hairline text? Yes / No.

## 5. The Kill List Pointer

`04_ADVERSARIAL_CRITIQUE.md` Section 1 contains the full 34-item cliche kill list, categories A through H: background and atmosphere, motion and camera, typography and text, HUD and interface skin, loading and entrance, graph and data visualization, audio, mobile, and effects and post-processing. It is not duplicated here; it is binding by reference. Any kill-list violation found during review is a blocking defect, not a style note, and shall be filed and fixed before the phase gate closes, exactly as WC15 requires.

## 6. Early Warning Protocol

Carried forward from `04_ADVERSARIAL_CRITIQUE.md` Section 2. The builder self-applies this checklist at every phase gate, before the phase is called done.

1. Four-metaphor mush: has any element been justified by naming a different metaphor than the last element used, with no coherence across the choices? Under the even-blend ruling (Section 1) this is not automatically disqualifying, but it is the leading indicator of drift toward genericness. Run the element past WC02, the template test, and the kill list in Section 5 before it ships.
2. Rainbow overview: does a screenshot of the full map read as confetti rather than structure when squinted at? (See BD41, WC09.)
3. Terminal costume: has monospace crept into descriptions or headings, has a blinking cursor appeared as decoration, or has the command palette been styled as a fake shell prompt?
4. Japanese affectation: does any Japanese string exist that a native reader has not verified as correct and meaningful for the exact label beside it?
5. Boot theater creep: is any boot state being held on screen for drama, typed character by character, or replayed in full on a return visit within the same session?
6. Screensaver signals: are signals visible on unselected edges, running while a panel is open, or still moving under reduced motion?
7. Larry the mascot: is Larry's motion faster or louder than any real node, is its repositioning logic illegible, or is it the first thing a first-time visitor mentions?
8. Easter egg pileup: is more than one easter egg discoverable without deliberate effort, or does any egg slow or block normal use?
9. Data-dictated composition: does adding the real catalog to a hand-tuned demo make it look cluttered or sparse, with labels colliding or sectors bleeding together?
10. Meaningless compare paths: would a skeptical engineer shrug at any compare-mode explanation, or does a path route through a hub node via a generic edge type?
11. Global glow: does any text carry a visible glow halo, do two adjacent stars merge into one blob at overview, or does the high-contrast mode look clearer than the default?
12. Deferred accessibility: are reduced motion or mobile appearing for the first time in the last third of the schedule, or has either lacked its own design review?
13. Frame-rate jank: does frame time spike on a mid-tier phone or integrated-GPU laptop during a camera move with a panel open, and do effects fail to scale down before FPS actually drops?

If any answer above is a real yes, the phase is not done, regardless of what the feature checklist says.

---

This document binds BD01 through BD57, WC01 through WC15 carried verbatim, the 34-item kill list by reference, and 13 early-warning checks. `docs/ART_DIRECTION.md` governs everything this document does not explicitly override, and `DECISIONS.md` Part 5 governs everything this document states as a Fred ruling.
