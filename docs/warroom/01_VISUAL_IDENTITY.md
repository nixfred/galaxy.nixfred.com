# Visual Identity Position Paper

Seat: Visual Identity
War room: NIXFRED GALAXY (galaxy.nixfred.com)

This document is executable. Every number is a decision, not an example. Where I say "recommend," treat it as the default unless another seat presents a conflicting technical constraint the synthesis must resolve.

---

## 0. The one sentence this whole paper defends

NIXFRED GALAXY is an instrument, not a wallpaper: every visual decision should read as if it is reporting something true about the system, and the moment any element exists purely to look cool with nothing to report, cut it.

---

## 1. The ten second opening, storyboarded

Total budget to interactive: under 1.5 seconds per VR003/VR008 and interview item 20. "Ten seconds" is the comprehension window, not the load window. The map is already interactive well before the visitor has finished reading.

**Frame 0 (0ms, before any paint the visitor consciously registers):** Background resolves to `#05070A` (see palette below). No flash of white, no loading spinner, no percentage bar. The HTML shell and critical CSS paint this color immediately, per PR001.

**Frame 1 (0 to 150ms):** A single system line resolves at the top left, monospace, low intensity:

```
NIXFRED GALAXY // CATALOG ONLINE
```

Treatment: `JetBrains Mono`, 13px, tracking +0.04em, color `#5A6B7A` (metadata gray, not full white). It does not fade in with a tween. It appears the way a terminal line appears: present, then present. A cursor block may sit after it for one blink cycle only, then vanish permanently. This is the single most important restraint in the whole opening: one blink, never a looping cursor. A looping cursor reads as "still loading" forever, which is a lie the moment the map is already live underneath it.

Below it, real state lines resolve in sequence, each replacing "PENDING" with a completed state, left aligned, monospace, same gray:

```
CATALOG    ... LOADED
RENDERER   ... READY
LABELS     ... READY
MAP        ... ONLINE
```

These must be genuine states per VR008, not a fake counter. If a state resolves in 8ms because it was already cached, it still gets its line, it just doesn't linger. Never insert artificial delay to make the boot sequence "feel" more substantial. Speed itself is the brand statement here, not the choreography.

**Frame 2 (150 to 500ms):** While that resolves, the map is already rendering behind it, not after it. Distant sector clouds are visible at low opacity (recommend 8 to 14 percent), a handful of major nodes hold a slow idle pulse, and two or three relationship lines briefly trace and recede once. This is the interview's own stage direction: "the visitor sees that a system exists before choosing to enter it." The boot text and the live map are simultaneous, not sequential. Never gate the map behind the text finishing.

**Frame 3 (500 to 900ms):** The title arrives. Treatment below in the typography system, but the core call: it does not fly in, scale up, or type itself out letter by letter. It resolves with a single opacity and 8px translate-Y ease (200ms, ease-out), the way a HUD element locks on, not the way a splash screen performs. Directly beneath it, the supporting line:

`Move through the work as a living map.`

Same restrained arrival, 60ms stagger behind the title, never simultaneous with it (simultaneity reads as one blob of text; stagger reads as hierarchy).

**Frame 4 (900ms to 1.5s):** The three opening actions resolve as a row (desktop) or stack (mobile), bottom third of viewport, clear of the live map:

`ENTER THE MAP` — primary, filled/high contrast
`START A TOUR` — secondary, outlined
`OPEN ATLAS` — tertiary, text-only with an underline rule

By 1.5 seconds the visitor can click any of the three. No animation gates the click. If the visitor clicks `ENTER THE MAP` at 400ms because they are impatient, the site must honor it immediately and let the remaining boot lines simply stop being visible, not fight the input.

**Where the actions sit:** bottom third, never centered dead-middle over the core node. The NIXFRED core node owns the vertical center of the frame at all times, at overview scale. The actions live in a fixed HUD band that never occludes it.

Why this ordering: the interview's own priority is wonder first, technical range second, contact third (interview item 1). A visitor who sees the live map breathing behind resolving system text gets wonder in under a second, without a single tween that exists only for spectacle.

---

## 2. Color system

### 2.1 Base surfaces (near black, three elevation steps)

Three steps, not two. Two steps forces every panel to compete with the background at the same depth; three lets chrome, panels, and modals each claim a distinct plane without any of them needing a heavy border to prove it.

| Token | Hex | Use |
|---|---|---|
| `surface-0` | `#05070A` | Root canvas, the void. Where the map lives. |
| `surface-1` | `#0B0F14` | Elevated chrome: header bar, footer bar, filter rail, command palette backdrop. |
| `surface-2` | `#12171F` | Highest elevation: detail panel, modals, mobile bottom sheet. |

These three are close enough in luminance (roughly 2 to 5 percent step) that elevation reads as a subtle depth cue, not a gray staircase. None of them is pure black (`#000000`). Pure black kills the sense of atmosphere the art direction asks for ("procedural particles, gradients, noise") because there is no floor for a gradient to sit on. `#05070A` has a whisper of blue in it, which is what makes the whole system feel like space rather than a disabled UI state.

### 2.2 Sector hues: core and halo

Every sector gets a core (the point light, saturated, used sparingly) and a halo (the glow/atmosphere, desaturated and dimmed, used generously). This is the mechanism that makes additive glow survive on near black without turning into a bloom soup: the core is small and bright, the halo is large and quiet, and they are never the same value.

| Sector | Core (points, active state text) | Halo (glow, field, sector cloud) | Character |
|---|---|---|---|
| IT | `#FF6B4A` (coral) | `#3A1F16` at 18% opacity glow / `#FF6B4A` at 12% for point halos | sharp, alert, exposed |
| Labs | `#4ADE80` (green) | `#153322` base / `#4ADE80` at 12% halo | curious, generative |
| Work | `#38BDF8` (cyan) | `#122A38` base / `#38BDF8` at 12% halo | credible, architectural |
| Signal | `#FBBF24` (amber) | `#332611` base / `#FBBF24` at 12% halo | active intelligence, memory |
| Clients | `#B794F6` (violet) | `#241B33` base / `#B794F6` at 12% halo | restrained, distinct people |
| Personal | `#C9D3DC` (soft silver) | `#1B1F24` base / `#C9D3DC` at 8% halo | quiet, protected, less noise |

Note Personal gets the lowest halo opacity of the six deliberately. Interview item 58 and the art direction both ask for personal work to feel "protected and quiet," and the mechanism for that is literally less light, not a different UI treatment. Do not build a special "quiet mode" component for Personal; just turn its halo down. Consistency of mechanism across sectors is what makes the system feel designed rather than decorated per-section.

All six core hues were chosen to sit close in perceived luminance at full saturation (roughly L 65 to 75 in OKLCH) so that no sector visually outranks another at a glance. IT coral and Signal amber are the two warmest and sit furthest apart on the hue wheel from each other specifically so a colorblind visitor distinguishing warm hues has the best possible separation between them; this is a partial mitigation, not a substitute for VR005 ("selected states shall be obvious without relying only on color") or the "no critical meaning may depend only on animation or color" rule in the art direction. Shape, size, and position must always carry the same information color does.

### 2.3 Text hierarchy grays (WCAG AA on `surface-0` #05070A)

| Token | Hex | Contrast on `#05070A` | Use |
|---|---|---|---|
| `text-primary` | `#F2F4F7` | ~17.8:1 | Project titles, selected title, site title |
| `text-secondary` | `#A9B4C0` | ~9.3:1 | Body copy in panels, descriptions |
| `text-metadata` | `#5A6B7A` | ~4.6:1 | Coordinates, status lines, timestamps, boot sequence |
| `text-disabled` | `#3A4552` | ~2.6:1, decorative only | Archived labels at rest, never load-bearing text |

`text-metadata` clears AA (4.5:1) for normal-size text at 4.6:1, with essentially no margin, so treat 13px JetBrains Mono at that color as a floor, not a target: any metadata below 13px must step up to `text-secondary`. `text-disabled` fails AA on purpose. It is reserved for decorative dimming of already-non-essential marks (e.g., an inactive tick mark), never for text a visitor needs to read; anywhere an archived project's actual label text appears, it uses `text-secondary` at reduced opacity through a real "archived-dim" state, not this token, so the label stays legible even while it reads as dormant.

### 2.4 One accent for interactive chrome

`accent-signal`: `#38BDF8` (reuse Work's cyan). Do not invent a seventh color for buttons, links, and focus rings. Reusing Work's cyan as the neutral system accent (search highlight, primary button in non-sector contexts, command palette selection) keeps the palette closed at seven colors total (six sectors plus one system accent) instead of eight, and cyan reads as "instrument," not "a sector," when it appears outside a sector context, because IT's coral and Signal's amber are the two hues visitors will learn to associate with sector identity fastest (they're the warm outliers). Cyan is the coolest, most neutral-reading of the six, which is exactly why it is safe to reuse as chrome.

### 2.5 When color may and may not carry meaning

Color MAY carry: sector identity (hue), current status via brightness delta (not hue shift), archive state via desaturation and dimming (not a new color).

Color MUST NOT carry alone: selection state (must pair with a ring, a size change, and a camera composition change), filtered-out state (must pair with opacity drop AND a positional/scale cue), error or warning state in Security-flavored IT work (must pair with the "sharper geometry" the art direction specifies, not a red flash), relationship strength (must pair with line weight, not just saturation).

This is not a nice-to-have. It is VR005 and AR010 (zero serious axe violations) made concrete: if the only signal an interaction fired is a hue shift, a colorblind visitor and an automated test both fail to detect it.

---

## 3. Typography system

Confirmed brand fonts from the existing NIXFRED identity: **Space Grotesk** (display) and **JetBrains Mono** (monospace). Both are self-hostable as static assets, which satisfies the art direction's "do not create a render blocking dependency on a third party font CDN" and PR004's JS budget (fonts are not JS, but a CDN round trip is still a blocking network hop the boot sequence cannot afford). Add one readable sans for body copy: **Inter**, self-hosted, because Space Grotesk at paragraph sizes and line lengths gets fatiguing fast, it is a display face, not a body face, and the art direction explicitly separates "a strong geometric display face for names" from "a highly readable sans serif for descriptions."

| Element | Font | Size | Weight | Tracking | Case |
|---|---|---|---|---|---|
| Site title (`NIXFRED GALAXY`) | Space Grotesk | 28px / 1.75rem (desktop), 22px mobile | 600 | +0.02em | UPPERCASE |
| Selected project title (panel) | Space Grotesk | 24px / 1.5rem | 600 | 0 | Sentence case, as given |
| Major project labels (overview) | Space Grotesk | 14px | 500 | +0.01em | As given, no forced case |
| Sector names | Space Grotesk | 12px | 600 | +0.12em | UPPERCASE |
| System metadata (coordinates, status, boot lines, timestamps) | JetBrains Mono | 11 to 13px | 400 to 500 | +0.04em | UPPERCASE for labels ("STATUS:"), sentence for values |
| Body copy in panels | Inter | 15px / 1.55 line height | 400 | 0 | Sentence case |
| Minor project labels (on focus only) | Space Grotesk | 12px | 500 | +0.01em | As given |
| Command palette input | JetBrains Mono | 15px | 400 | 0 | As typed |

Rules that matter more than the numbers: sector names are always uppercase monospace-adjacent tracking on the display face, never on JetBrains Mono itself, because sector names are proper nouns in this universe (IT, LABS, WORK, SIGNAL, CLIENTS, PERSONAL), and proper nouns get the display face even when they're rendered small and tight, exactly the way a star atlas prints constellation names in a distinct face from the coordinate grid beneath them. Project names never get forced uppercase; a visitor's actual project title is data, and data does not get art-directed into a different case than Fred wrote it.

**Japanese accent usage:** JetBrains Mono does not carry Japanese glyphs well; pair Japanese accent text with **Noto Sans JP**, loaded only for the specific small set of glyphs used (subset the font file, do not ship the full CJK weight, this is a real payload risk against PR004/PR005). Size: 10 to 11px, always smaller than the smallest active metadata label on screen at that moment. Placement: adjacent to system metadata or the boot sequence only, e.g., a small vertical gloss beside a sector name or in the loading line. Never adjacent to a project title, never at a size or weight that could be mistaken for a second language label competing for the visitor's primary read. One furigana-style accent per screen state maximum. If in doubt, cut it; it is a signature, not a content channel.

---

## 4. Interface chrome language

The instrument readout aesthetic, made concrete:

**Panels:** `surface-2` background, 1px border at `#1E2732` (a step above surface-2, not black, so the border reads as a seam, not a hole), border radius **4px**, never more. A rounded-rect that reads as "app card" (12px+ radius) breaks the instrument illusion instantly; readouts have machined corners, not bubble corners.

**Corner ticks:** every panel and every focused star's selection ring gets four small L-shaped corner ticks (6px arm length, 1px stroke, `accent-signal` or the active sector's core hue) instead of a full outline box. This is the single most identifiable "observatory HUD" signature move available and it is cheap to render. A full box reads as a modal. Corner ticks read as a targeting reticle. Use them on: the selected star's bounding highlight, the detail panel's four corners (subtle, at 40% opacity, decorative), and the command palette's frame.

**Scan register / status lines:** a thin 1px horizontal rule (`#1E2732`) under every panel header, with a monospace status line beneath it in `text-metadata`, e.g. `SECTOR: LABS // STATUS: ACTIVE // REL: 4`. This is where system metadata typography does its real work.

**Terminal prompts:** the command palette input is prefixed with a static `>` glyph in `accent-signal`, monospace, never blinking while idle (blinking cursors are reserved for the one-time boot sequence, per section 1; reusing that motif for a persistent UI element cheapens the boot moment by making it look like "just how text inputs look here").

**Buttons:** three tiers.
- Primary: filled, `surface-2` text on `accent-signal` background (or the active sector core color when the button is sector-scoped, e.g. "Open Project" inside a Labs panel may use Labs green), radius 4px, no shadow, no gradient fill.
- Secondary: 1px stroke at `#1E2732`, transparent fill, text at `text-primary`, hover raises stroke to `accent-signal`.
- Tertiary: text-only with underline rule, `text-secondary`, hover to `text-primary`.

**Border radii, system-wide:** 4px for panels and buttons, 2px for tags/pills (technology tags in the detail panel), 999px (full pill) reserved exclusively for status indicator dots and the mute toggle, nowhere else. Do not let two different radius scales bleed into each other; a 4px panel with an 8px button inside it looks like two different design systems collided.

**Stroke weights:** 1px for all resting borders and rules. 1.5px for a focused/active border. 2px maximum for a selection ring, never thicker; a thick ring reads as a game UI, not an instrument.

**Backdrop treatment:** when the detail panel or command palette opens over the map, the map behind it does not blur (blur is expensive and it is also the wrong metaphor, instruments don't gaussian-blur the world, they just draw a panel over part of it). Instead darken the non-covered map by dropping unrelated stars' opacity per the existing "selection darkens unrelated work" mechanic already specified in Compare mode; reuse that exact mechanic for panel-open state so the system has one darkening behavior, not two.

**Glow discipline:** bloom is a resource-limited effect (see effects budget in the art direction, "restrained bloom" is allowed, "excessive bloom" is explicitly banned by VR006). Apply bloom only to: active/selected star cores, the NIXFRED center node, and relationship-line signal packets in motion. Never apply bloom to text, panels, buttons, or UI chrome. If it can be read, it does not glow. If it can be looked at, it may glow.

---

## 5. Star field composition at overview scale

**Density:** target roughly 150 to 400 visible stars at overview across all sectors combined once the catalog is fully populated (36 known entries today per portfolio.json, but the system must not look sparse at 36 and must not look like spaghetti at ten times that). The mechanism for this is dimmer/smaller "satellite" stars representing minor or experimental work sitting well below the visible threshold for labels (per the art direction's "small experiments appear as dimmer satellites"), so density scales without label clutter scaling with it.

**Six sectors reading as distinct territories without borders:** this is achieved through three compounding cues, never a border or a bounding shape:
1. Positional clustering: each sector occupies a stable angular wedge and radius band around the NIXFRED core (deterministic anchors per interview item 61, not force-directed chaos that reshuffles on reload).
2. Hue: the core/halo pairing from section 2.2, visible even at a glance from across the map because halos overlap into soft colored fields.
3. Field shape per sector, exactly as the art direction specifies: IT reads tighter and more angular (smaller radius band, straighter implied lines between points), Labs reads broader and more organic (wider radius band, looser scatter), Work reads grid-aligned (points sit closer to an implied lattice), Signal shows branching structure (more visible secondary connections at rest, subtle), Clients reads restrained and evenly spaced (deliberately less clustering variance, professional evenness), Personal reads sparse with the most negative space per star of any sector.

**Negative space strategy:** the space BETWEEN sectors is not empty by accident, it is empty by design, and it must stay that way. Do not fill inter-sector space with ambient particles "for atmosphere." Ambient particle noise between sectors is exactly the kind of low-value motion the art direction's effects budget bans ("multiple competing animated backgrounds"). The silence between sectors is what makes each sector read as a place instead of the whole map reading as a single dust cloud with colored highlights.

**Depth without disorientation:** the constrained 2.5D model (interview item 13) gives depth through three cheap, legible cues rather than true free-camera parallax: (1) a subtle scale/opacity falloff for stars further from the current focal plane, standing in for depth of field without an actual blur pass, (2) faint procedural depth fog at `surface-0` tint on the furthest background elements (art direction's "soft depth fog," explicitly allowed), (3) parallax drift on sector clouds at a rate roughly 20 to 30 percent of foreground star drift, so the background clearly reads as further away without requiring the visitor to reorient the camera to perceive it. Do this instead of unlimited orbit or pitch. Pitch stays limited per interview item 31 specifically because unlimited pitch is how depth cues stop making sense to a human vestibular system watching a flat screen.

---

## 6. Grid, spacing, and layout tokens

Base unit: **4px**. All spacing is a multiple of it.

| Token | Value | Use |
|---|---|---|
| `space-1` | 4px | Icon-to-label gaps, tag internal padding |
| `space-2` | 8px | Tight stacks inside a panel row |
| `space-3` | 12px | Default gap between related controls |
| `space-4` | 16px | Panel internal padding (mobile), gap between panel sections |
| `space-6` | 24px | Panel internal padding (desktop), header horizontal padding |
| `space-8` | 32px | Section breaks inside the detail panel |
| `space-12` | 48px | Header height (desktop) |

**Header:** fixed, 48px tall, `surface-1`, site title left, primary nav labels (MAP / TIMELINE / TOURS / SIGNALS) center-left, SEARCH and ATLAS controls right. 1px bottom rule at `#1E2732`.

**Footer:** not a traditional footer; a slim 32px status bar, `surface-1`, showing current coordinates/sector/zoom state in JetBrains Mono at `text-metadata`, left, and the mute toggle plus a link cluster (resume, source, nixfred.com) right, per interview item 12's minimal-bio rule. This is where "system metadata" typography earns its keep as a permanent fixture, not just a boot moment.

**Panel widths:** desktop detail panel fixed at **380px**, docked right, `surface-2`, full viewport height minus header and footer. Never full-bleed; the art direction is explicit that "the panel should not cover the selected star," and 380px leaves the majority of a 1440px+ viewport for the composed map. Command palette: centered overlay, 560px wide, capped, never full width even on large desktops (a full-width command palette reads as a search engine, not an instrument).

**Mobile bottom sheet:** default peek height 96px (title, sector, one-line description, grab handle) with a drag or tap to full-height expand capped at 75vh, never 100vh, so a sliver of the live map stays visible above it at all times per the "the map is always the evidence" principle running through the whole art direction. Grab handle: 32px wide, 4px tall, `#1E2732`, centered, `space-2` from the top edge.

**Breakpoints:** mobile under 640px, tablet 640 to 1024px, desktop above 1024px. Tablet gets the mobile bottom sheet and touch controls but keeps the shallow-depth 2.5D map rather than the fully flat mobile composition, since VR009 explicitly forbids "simply shrinking the desktop canvas" and tablet has room for a real map that a phone does not.

---

## 7. States

| State | How it reads |
|---|---|
| **Hover** (desktop only) | Star core scales 1.15x, halo opacity +6 percentage points, label fades in if not already persistent, cursor becomes a crosshair. No color change. Duration 120ms ease-out. |
| **Focus-visible** (keyboard) | Corner-tick ring appears at the star's bounding box, `accent-signal` regardless of sector (focus is a system-level state, not a sector-level one, so it must never be confused with sector color), 2px stroke. Must be visible against every sector's halo color, which is exactly why focus uses the one reserved system accent instead of the sector's own hue. |
| **Selected** | Camera composes the star into the visible map area (per art direction), corner ticks appear in the sector's core color (selection IS sector-scoped, unlike focus), star core scales 1.4x, relationship lines to direct connections illuminate at full opacity with slow signal travel, detail panel opens. This state must remain legible with sound off, motion off, and color blindness, which is why it is the one state that stacks four independent cues: camera composition, ring, scale, and panel. |
| **Filtered-out** | Opacity drops to roughly 15 percent, no interaction affordance (not clickable, cursor reverts to default over it), scale drops slightly (0.9x) so it also recedes spatially, not just visually. Never fully hidden or removed from the DOM list representation (AR008 requires the list stay complete for screen readers even when the visual map filters). |
| **Archived-dim** | Uses `text-secondary` opacity-reduced (not `text-disabled`, per section 2.3), core desaturated toward the sector's halo tone rather than full core saturation, no pulse, a small static "ARCHIVED" tag in the panel. It stays fully clickable and fully legible; dim is a status, not a punishment. |
| **Memorial-quiet** | Reserved for Personal-sector entries the art direction flags as caregiving or memorial work (interview item 58). No pulse ever, even when otherwise "active." No corona complexity regardless of relationship count. Halo opacity capped lower than any other Personal entry. The detail panel for these entries drops the standard action row down to just Open and Share, no Compare, no Pin prompt nudging the visitor to treat it as a collectible. This is a content-driven state, flagged in data, not something the visitor can trigger; it exists so the system has an actual mechanism for "quiet and respectful" instead of leaving that as an unenforced aspiration in a document. |

---

## 8. Banned, and why

1. **Any looping or persistent blinking cursor outside the one-time boot sequence.** It is the single strongest "still loading" signal in computing history; reusing it anywhere else either lies about system state or cheapens the one place it should mean something.
2. **Full box outlines on selection.** Reads as a modal or a form validation error, not a targeting reticle. Corner ticks only.
3. **Bloom on anything readable.** Text under bloom is the single fastest way to violate VR006's "excessive bloom" ban and AR010's contrast requirements simultaneously.
4. **A seventh accent color.** Every new hue introduced outside the six sectors plus one system accent dilutes the moment where hue alone tells a visitor which sector they're in. Solve new-color urges with brightness, opacity, or motion instead.
5. **Ambient particles filling inter-sector negative space.** The empty space between sectors is doing real work (see section 5). Filling it for "atmosphere" turns six distinct territories back into one indistinct dust cloud, which is the exact failure mode the interview is trying to avoid with "cyber cartography, not stock galaxy wallpaper."
6. **Rounded, card-style panels (8px+ radius, drop shadows, gradient fills).** This is the fastest way to make an instrument readout look like a SaaS dashboard. 4px radius, flat fill, corner ticks, hairline rules. No exceptions for "just this one modal."
7. **Forced uppercase on project titles.** Project names are Fred's actual data. Art-directing them into a different case than he wrote them is the site overriding the content it exists to serve.
8. **A logo-sticker map.** Interview item 28 already bans this ("abstract sector glyphs and line geometry," not "a collection of logo stickers"), and it is worth repeating here because it is the single most tempting shortcut for making individual stars feel "branded": don't. A star is a point of light with a core and a halo, not an icon.
9. **Full-screen Matrix rain, heavy scanlines over body copy, huge lens flares, constant glitching.** All explicitly banned in the effects budget. Repeating them here because they are also the four most common "make it feel cyberpunk" reflexes a less disciplined pass would reach for, and every one of them actively fights legibility, which is the one thing this whole system cannot sacrifice.
10. **A second darkening/blur mechanic for panels distinct from the Compare-mode darkening.** One system for "focus this, recede everything else" used everywhere it's needed (selection, compare, panel-open, tour-active) is what makes the interface feel like one coherent instrument instead of five different modals wearing a dark theme.

---

## Summary for synthesis

My five strongest positions: first, the opening sequence must never gate interactivity behind its own choreography, real boot states resolve simultaneously with a live, breathing map underneath them, and a click at 400ms must be honored immediately, because speed itself is the wonder here, not the animation. Second, every sector color needs a distinct core and halo value (never the same hex doing both jobs) so glow survives on near-black without turning additive bloom into soup, and Personal's halo must be measurably dimmer than the other five as the actual mechanism for "quiet and protected," not a separate component. Third, the interface chrome commits fully to an instrument-readout language: 4px radii, hairline strokes, corner-tick selection rings instead of boxes, bloom reserved exclusively for things that are not meant to be read. Fourth, color is never the sole carrier of meaning anywhere in the system, every state that matters (selected, filtered, archived, focused) stacks at least one non-color cue, which is both an accessibility requirement (AR010, VR005) and the reason the system will still read correctly to a colorblind engineer skimming it at 2am. Fifth, the negative space between the six sectors is deliberate and must stay empty; positional clustering, hue, and per-sector field shape are the only things allowed to make six distinct territories legible, never a border and never ambient filler particles.

The one decision I most want the synthesis to defend against pushback: reserve bloom exclusively for active/selected star cores, the NIXFRED center node, and moving relationship signals, and ban it everywhere else without exception, including "just a little" on panel edges or button hovers. Every other position in this paper is negotiable at the margins. This one is not, because it is the single rule standing between "restrained bloom" (explicitly allowed) and "excessive bloom" (explicitly banned by VR006), and the moment one exception gets made for a panel glow because it "looks nice," there is no principled place left to stop the next exception.

File written to: `/Users/pi/Projects/galaxy.nixfred.com/docs/warroom/01_VISUAL_IDENTITY.md`
