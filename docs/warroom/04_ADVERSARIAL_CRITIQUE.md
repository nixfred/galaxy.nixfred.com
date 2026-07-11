# NIXFRED GALAXY: Adversarial Critique

Seat: The critic. Job: kill everything that would make this site read as generic, amateur, or dated before a single line of it ships.

This document is hostile by assignment. Nothing here is an attack on the concept, which is strong. Everything here is an attack on the ways a strong concept dies in execution. Every criticism carries its fix, because a criticism without a fix is just noise.

Read order for the room: Section 1 is the shared vocabulary of failure. Section 2 is where this specific plan is most exposed. Section 3 is the acceptance gate that decides AC006. Section 4 is how we settle the fights that will happen during the build.

---

## 1. The Cliche Kill List

Every trope below has shipped on a thousand "space" and "cyber" portfolio sites. Each one is a tell. When a visitor who has seen the internet sees three of these in the first ten seconds, they file the site under "template" and stop believing anything it claims about the person behind it. The discipline that replaces each cliche is the actual craft.

### A. Background and atmosphere

1. **Purple or teal nebula wallpaper.** Why it fails: a stock nebula is a photograph of someone else's telescope data stretched behind your content. It carries zero information about the work and it is the single most common "galaxy site" signature. Discipline: generate atmosphere from the data. Sector clouds are density fields derived from where the work actually clusters, not decoration painted behind it.

2. **The default CSS twinkle starfield.** Why it fails: random dots at random opacity animating on random intervals is the "I added a starfield" default. It says nothing and it competes with the real stars, which are the projects. Discipline: background points must be quiet, few, and clearly subordinate to project stars in brightness and size. If a background particle reads as bright as a project, the hierarchy is already broken.

3. **Spinning skybox or rotating starfield.** Why it fails: constant background rotation is motion with no meaning. It makes the eye chase and it screams screensaver. Discipline: the background holds still. Only the camera moves, and only when the user or a tour moves it.

4. **Dead empty black with a few dots floating in the middle.** Why it fails: emptiness is not composition. Amateur space sites confuse "minimal" with "I did not lay anything out." Discipline: compose the negative space. Every region of the frame should have a reason to be dense or sparse, and the sparse regions should feel intentional, like the margins of a real star chart.

5. **Grid floor receding to a horizon (the synthwave Tron plane).** Why it fails: it is the most exhausted retro-future cliche of the last decade and it forces a ground plane onto a space that should have none. Discipline: if a grid appears, it is a faint coordinate reference tied to the map's actual axes, not a perspective floor for vibes.

### B. Motion and camera

6. **Slow floaty camera the user has to fight.** Why it fails: when idle drift keeps moving the thing the user is trying to click, or when the camera overshoots and drifts back, the user feels like they are wrestling the site. This is the fastest way to feel amateur because it breaks the most basic contract: the view obeys me. Discipline: idle drift stops the instant the user grabs the camera. Camera moves use tight easing that arrives and settles, never rubber-bands.

7. **Hyperspace or warp-jump intro.** Why it fails: streaking star lines toward the viewer is the "enter the site" cliche from every sci-fi trailer. It is a cost the visitor pays before seeing anything real. Discipline: the entrance reveals the actual map assembling. The payoff is comprehension, not a rollercoaster.

8. **Mouse-parallax on the entire scene.** Why it fails: tying the whole background to cursor position induces low-grade nausea and makes text hard to read while the mouse moves. Discipline: parallax lives in depth layers at low amplitude, driven by camera position, not by chasing the pointer around the screen.

9. **Everything pulses at once.** Why it fails: if every star breathes, nothing is signaling. Simultaneous uniform pulsing is aquarium motion, not a status system. Discipline: pulse is rare and reserved. Only active or attention-worthy nodes pulse, and the rest hold steady so the pulse means something.

10. **Screen shake, surprise zoom, and auto-wander while reading.** Why it fails: any motion the user did not ask for while they are trying to read a panel is an insult to their attention. Discipline: while a detail panel is open, the map is calm. No drift, no wander, no ambient camera creep.

### C. Typography and text

11. **Thin glowing text on black.** Why it fails: a hairline weight with a glow around it is unreadable at any real size and it is the number one accessibility failure of sci-fi sites. Glow is not contrast. Discipline: names and body copy carry real weight and real luminance contrast. Glow, if used, sits on decoration, never on anything a person has to read.

12. **Monospace for everything.** Why it fails: setting descriptions and headings in a monospace "to look technical" is cosplay, and it destroys reading rhythm. Discipline: monospace is reserved for the things that are actually monospaced in real systems: coordinates, status codes, commands, dates, hashes. Prose uses a real reading typeface.

13. **Character-by-character decode / typewriter reveal on body text.** Why it fails: making the reader wait while text types itself out slower than they read is theater that wastes their time on every visit after the first. Discipline: one brief decode is allowed on the title at first load only. Never on descriptions, never repeated, always skippable.

14. **A recognizable "space font" (Orbitron, Michroma, and their cousins).** Why it fails: these faces are the default free download for "futuristic" and they instantly date and genericize a site. Discipline: choose a display face with actual character that is not the template default, and prove it does not appear on the first page of "sci-fi font" lists.

15. **Letter-spacing and all-caps sprayed on everything.** Why it fails: wide-tracked uppercase on every label is a tic that reads as "trying to look designed." Discipline: tracking and caps are a deliberate signal for system labels and coordinates, not the default treatment for all text.

### D. HUD and interface skin

16. **Corner brackets framing every panel.** Why it fails: the `[ ]` reticle corners are lifted straight from the Aliens / generic-movie-UI kit. They appear on every "cyber dashboard" template and they are pure sticker. Discipline: panel structure comes from real layout, spacing, and a considered border treatment, not from decorative brackets that do nothing.

17. **Radar sweep, targeting reticle following the cursor, spinning loader rings.** Why it fails: these are ambient movie-prop animations that imply function they do not have. A radar that scans nothing is a lie. Discipline: every animated interface element must correspond to a real state. If it does not report something true, it does not exist.

18. **Fake data streams and scrolling hex.** Why it fails: a ticker of random numbers or raining binary is set dressing that says the designer had nothing real to show. Discipline: if numbers appear, they are real: node counts, build revision, coordinates, dates from the actual catalog.

19. **Skeuomorphic sci-fi panels with rivets, screws, and brushed metal.** Why it fails: it is dated to a specific 2010s aesthetic and it fights the clean observatory idea. Discipline: surfaces are flat, precise, and near-black with restrained luminous edges. The instrument feeling comes from precision and typography, not from faux hardware.

### E. Loading and entrance

20. **Fake loading percentage.** Why it fails: a progress bar that is a `setTimeout` counting to 100 is a lie the user can feel, and it delays them for no reason. The pack already forbids this; the kill-list restates it because it creeps back in as "polish." Discipline: report real states only (catalog loaded, renderer ready, labels ready, map online) or show nothing and just be fast.

21. **Enter-splash gate that adds a click for nothing.** Why it fails: a "click to enter" wall in front of the real content is a tax. Note: `ENTER THE MAP` is defensible only because the frame behind it is already alive and informative. If the pre-enter frame is a dead logo on black, it becomes exactly this cliche. Discipline: the first frame must already show a living system, so entering is a choice to go deeper, not a toll to see anything at all.

22. **"Initializing systems..." boot theater.** Why it fails: scrolling startup logs that pretend the browser is booting a spacecraft are the most common cheese in this genre. Discipline: at most one short, real, honest status line. If it cannot be true, it does not ship.

### F. Graph and data visualization

23. **The full relationship graph rendered at once (the hairball).** Why it fails: every node connected to every node at full intensity is an unreadable spaghetti ball that communicates "I have a graph library" and nothing else. Discipline: show relationships on demand only: selection reveals direct edges, compare reveals one path, tours reveal one route. The overview shows skeleton, never the full mesh.

24. **Animated signals racing along every line, all the time.** Why it fails: constant particles flowing down every edge is screensaver energy and it turns a map into an aquarium. Discipline: signal travel is slow, sparse, tied to the active context, and off in reduced motion. A line at rest is the default; a moving signal is an event.

25. **Node size or brightness encoding vanity metrics.** Why it fails: sizing stars by traffic, stars, or money turns a body of work into a leaderboard and invites the visitor to rank the person. Discipline: size encodes editorial importance, brightness encodes status, and the legend says so plainly. It never encodes popularity or worth.

26. **Seeded-random placement that looks like scattered noise.** Why it fails: "deterministic seeded positions" often produces an even spray of dots with no constellations, which is the opposite of a star map with meaning. Discipline: major nodes get authored coordinates that form intentional figures. Seeded placement only fills around anchors, and it is tuned until clusters read as designed, not sprinkled.

### G. Audio

27. **Autoplaying ambient audio or blips on every hover.** Why it fails: sound the user did not ask for is a trust violation and a UX failure, and per-interaction blips get maddening in thirty seconds. Discipline: audio is off by default, has a visible mute state, never plays before a user action, and never fires on hover.

### H. Mobile

28. **Mobile as a shrunken broken desktop.** Why it fails: cramming unrestricted 3D orbit, tiny tap targets, and full particle load onto a phone produces the single clearest amateur signal: it does not work in the visitor's hand. Discipline: mobile is a separate composition with a flatter map, thumb-reach controls, generous tap targets, a bottom sheet, and effects that scale down before frame rate drops.

29. **Precision dragging required to hit a node on touch.** Why it fails: if the visitor has to pinch-zoom and stab at a two-pixel star to open a project, they leave. Discipline: generous invisible hit targets, first tap to focus, second tap to open, and clustering so no two targets fight for the same thumb.

### I. Effects and post-processing

30. **Uniform bloom over the whole scene.** Why it fails: cranking bloom globally makes text bleed, kills contrast, and flattens every star into the same glowing blob. It is the "I turned on the glow" default. Discipline: bloom is selective and restrained, applied to specific luminous elements, tuned so no text ever blooms and no two stars merge into a smear.

31. **Chromatic aberration and heavy vignette on everything.** Why it fails: RGB fringing and black corners are Instagram-filter moves that reduce clarity and legibility for a "cinematic" look that reads as a preset. Discipline: keep the frame clean and legible. If a lens effect appears, it is subtle, purposeful, and never over text.

32. **Glitch / RGB-split transitions between states.** Why it fails: datamosh glitch on navigation is a 2016 trope that undercuts the "precise instrument" claim and it makes the site feel unstable. Discipline: transitions are clean fades and camera moves. Precision, not corruption, is the aesthetic.

33. **Depth-of-field blur used to hide the lack of composition.** Why it fails: blurring the background to fake depth just makes the site look out of focus and costs performance. Discipline: depth comes from parallax, scale, and brightness falloff, not from a blur pass that softens everything into mush.

34. **Konami-code full-screen Matrix rain as a reward.** Why it fails: Matrix rain is the single most exhausted "hacker" visual in existence, and shipping it even as an easter egg endorses the cliche. Discipline: if an easter egg alters rendering, it should be a considered alternate palette or projection that still looks like NIXFRED, never a green-code downpour.

---

## 2. Risk Audit Of This Plan

The pack is unusually disciplined. That is exactly why the remaining risks are dangerous: they are the few places where the plan itself, if followed literally by a tired builder at 2am, drifts back into the kill list. Each risk below has a failure mode, an early warning sign you can catch during the build, and a concrete guardrail.

### Risk 1: The four-metaphor thesis dissolves into generic sci-fi

The thesis stacks four references: scientific star atlas, mission control, private terminal, personal memory map. Four references means the design can hide behind "it's a blend" and commit to none, and an uncommitted blend of sci-fi references is indistinguishable from a template.

- **Failure mode:** every hard design decision gets resolved by "add a bit of all four," producing mush that reads as stock cyber.
- **Early warning sign:** a design review where someone justifies an element by naming a different metaphor than the last element used. Star atlas justifies the grid, mission control justifies the panel, terminal justifies the font, memory map justifies the softness, and nothing shares a spine.
- **Guardrail:** name one primary metaphor as the tiebreaker. Recommendation: **star atlas is the noun, terminal is the voice, mission control and memory map are moods that modulate specific sectors.** When two metaphors conflict, atlas wins the geometry and terminal wins the text. Write this down so it is not re-litigated per element.

### Risk 2: Six accent colors become a carnival

Coral, green, cyan, amber, violet, silver, all luminous on near-black, all present in one overview frame, is a real risk of looking like a candy dashboard rather than a restrained atlas.

- **Failure mode:** the overview reads as a rainbow scatter with no dominant value structure, and no color means anything because all six shout equally.
- **Early warning sign:** a screenshot of the full map where you cannot squint and see structure, only confetti. Or: you cannot tell which sector you are looking at without reading the label.
- **Guardrail:** enforce a value-first, hue-second rule. At overview scale, sectors are separated primarily by position and brightness, with hue as a quiet identifier at low saturation. Full saturation is earned only on selection and hover, one sector at a time. Set a hard cap: no more than one sector at full chroma on screen at once outside the overview's gentle baseline. Also verify every sector color as a pair (bright accent for stars, muted accent for text) and confirm violet and amber text pass AA on the actual background, because violet especially will fail.

### Risk 3: The terminal aesthetic is itself now a trope

Terminal-styled portfolios are common enough that "observatory inside a terminal" can land as "another dark terminal site" if executed with the default moves (monospace everything, green text, blinking cursor, bracket chrome).

- **Failure mode:** the terminal reads as a costume, not a genuine interaction model, and the site joins the pile of `neofetch`-cosplay dev homepages.
- **Early warning sign:** monospace creeping into descriptions and headings; a blinking block cursor appearing as decoration; corner brackets showing up on panels; the command palette styled to look like a shell prompt rather than a real, fast palette.
- **Guardrail:** the terminal is a voice and an input model, not a skin. It earns its place only through the command palette and the typed commands actually working (`whoami`, `larry`, `home`, search). Ban terminal decoration that has no function: no fake prompts, no blinking cursors as ornament, no bracket frames. Monospace stays in its lane (Kill List item 12).

### Risk 4: Japanese accent text is affectation without a system

Katakana or kanji sprinkled as "signature detail" with no meaning is cosplay, and a technical audience notices immediately when the Japanese is decorative or, worse, wrong.

- **Failure mode:** the accents read as "anime aesthetic" borrowed for cool points, which cheapens everything around them and invites ridicule if the characters are nonsense.
- **Early warning sign:** any Japanese string that is not a correct, meaningful label of the exact thing next to it. Random characters chosen for shape. A native reader would wince.
- **Guardrail:** every Japanese string must be a correct, intentional translation or transliteration of the real label it accompanies (sector name, status word, coordinate), verified by someone who reads Japanese, kept small and secondary per the interview. If a given string cannot be made both correct and meaningful, it does not appear. Decoration masquerading as language is banned.

### Risk 5: The startup sequence tips into cheese

`NIXFRED GALAXY // CATALOG ONLINE` followed by staged status lines is one bad easing curve away from spacecraft-boot theater, which is Kill List item 22.

- **Failure mode:** the honest status states get dressed up with delays, typewriter reveals, and dramatic pacing until they become the exact fake-boot cliche the pack claims to avoid.
- **Early warning sign:** the startup takes longer than it needs to because a state is being held on screen for drama; a status line types out character by character; the sequence is not skippable; the same sequence plays on every visit with no fast path.
- **Guardrail:** startup finishes within roughly 1.5 seconds, reports only true states, never blocks interaction, and is instantly skippable. Return visitors within a session should not sit through the full ceremony. If a state resolves in 20ms, it is allowed to just be gone; do not pad it to be seen.

### Risk 6: Signal pulses on lines become a screensaver

Animated signal travel on relationship lines is explicitly desired, and it is exactly the feature that becomes ambient aquarium motion if left running on every edge.

- **Failure mode:** the map is covered in little dots endlessly flowing along lines while the user reads, which is Kill List item 24 and pure screensaver energy.
- **Early warning sign:** signals visible on edges the user did not select; signals running while a detail panel is open; signal density that makes the eye twitch; signals still moving in reduced-motion mode.
- **Guardrail:** signals appear only on the active context (selected node's direct edges, the compare path, or the current tour route), are sparse and slow, pause while a panel is being read, and are fully static in reduced motion. A line at rest is the default state of the map.

### Risk 7: The Larry anomaly becomes cute

A "self-repositioning object whose relation lines change with context" is one hair away from a gimmick mascot that undercuts the precise-observatory tone, and it risks implying access to private data.

- **Failure mode:** Larry becomes a jokey wandering blob that draws attention away from the work and reads as "quirky," which cheapens the whole map. Or its shifting lines imply live surveillance of private context, which is both untrue and unsettling.
- **Early warning sign:** Larry's motion is faster or louder than any real node; its repositioning has no legible logic; it becomes the thing people mention first; its lines connect to things that look like private data.
- **Guardrail:** Larry's distinctiveness is quiet and rule-based, not random. Its repositioning follows a legible, tasteful logic tied only to public relationships, moves slower than anything else, and never implies access to anything private. If a first-time visitor's takeaway is "cute mascot" rather than "the system has a distinct intelligence node," it has failed and must be dialed down.

### Risk 8: Cumulative easter-egg cuteness erodes the serious tone

Individually, Sky Walrus, Konami, `whoami`, and typed commands are fine. Together, encountered in one session, they can turn a precise observatory into a gag reel.

- **Failure mode:** the site's personality tips from "precise and strange" to "quirky and jokey," which is a different, lesser product.
- **Early warning sign:** more than one easter egg is discoverable without deliberate effort; an egg blocks or slows normal use; the Sky Walrus becomes the headline feature people share instead of the work.
- **Guardrail:** easter eggs are rare, harmless, reversible, effortful to find, and never on the critical path. Hard rule from the pack, restated: the Sky Walrus must never block controls, hurt performance, or become the entire joke. Budget: at most one egg is stumbled upon by accident; the rest require intent.

### Risk 9: "Show every public project" lets data quantity dictate composition

Committing to render every public project means the sky's density is set by how many projects exist, not by design. Forty-plus stars can either crowd the frame or force awkward spacing.

- **Failure mode:** the overview is either a crowded scatter (no composition) or so spread out that it feels empty and requires constant panning. Either way, the layout is dictated by count, not intent.
- **Early warning sign:** adding the real catalog to the prototype makes the beautiful hand-tuned demo look cluttered or sparse; labels start colliding; sectors bleed into each other.
- **Guardrail:** design the composition at true catalog scale from day one, never with a toy set of eight nodes. Use editorial weight to establish a clear read at overview (a few bright anchors per sector, the rest dim and revealed on approach) so the eye is never asked to parse all stars at once. Test the layout at the real N plus a projected N for two years of growth.

### Risk 10: Compare-mode paths produce meaningless connections

Shortest-path over typed edges is only as convincing as the edges. Weak edge types (`chronology`, loose `shared_technology`) can generate a "path" that connects two projects through coincidence and explains nothing.

- **Failure mode:** compare says "A connects to B because both happened in 2024" or "both use TypeScript," which is a non-insight that makes the whole relationship system look fake.
- **Early warning sign:** any compare result whose plain-language explanation would make a skeptical engineer shrug. Paths that route through a hub node via generic edges.
- **Guardrail:** weight edges so weak types (chronology, generic shared tech) are near-inert in pathfinding and strong types (built_on, shared_subject, explicit client/personal history) carry the path. If the only path between two nodes is weak, compare should say "no strong connection" honestly rather than manufacture a poetic one. The pack already forbids inventing connections; enforce it in the pathfinding weights, not just in prose.

### Risk 11: Bloom and "luminous" as a default setting

Multiple requirements ask for luminous relationships, glow, and atmosphere. The default failure of every such brief is that everything ends up glowing, which is Kill List items 11 and 30.

- **Failure mode:** global bloom bleeds text, merges stars, and flattens contrast, converting a precise atlas into a soft neon smear.
- **Early warning sign:** any text with a visible glow halo; two adjacent stars merging into one blob at overview; the reduced-motion or high-contrast mode looking dramatically clearer than the default (a sign the default is over-glowed).
- **Guardrail:** set a bloom budget and hold it: bloom applies only to designated luminous marks, never to text, tuned so no two stars merge and no glyph blooms. Review every screen at 100% and confirm text has zero halo. Treat the high-contrast mode's clarity as the target the default should approach, not a fallback that looks better than the real thing.

### Risk 12: Reduced motion and mobile get built last and become second-class

The pack specifies both well, which paradoxically makes them easy to defer, and deferred accessibility work is where "world class" quietly dies.

- **Failure mode:** reduced motion becomes a stripped, broken version instead of a designed mode; mobile becomes the shrunken desktop the pack explicitly forbids (Kill List item 28).
- **Early warning sign:** reduced-motion or mobile appearing for the first time in the last third of the schedule; either one lacking its own design review; a demo that only ever runs on a desktop with motion on.
- **Guardrail:** build the reduced-motion path and the mobile composition alongside the primary, not after. Every feature demo must be shown in three states: desktop full motion, reduced motion, and mobile. If a feature only works in one of the three, it is not done.

### Risk 13: Frame-rate jank quietly makes the whole thing feel amateur

None of the above matters if the map stutters. Jank is the most universal amateur tell, and this plan stacks bloom, particles, many nodes, and animated line signals, which is a jank recipe on mid and low devices.

- **Failure mode:** the camera hitches on pan, signals stutter, the fans spin up, and the "precise instrument" feels like a cheap toy.
- **Early warning sign:** frame time spikes on a mid-tier phone or an integrated-GPU laptop during a camera move with a panel open; effects not scaling down before FPS drops.
- **Guardrail:** enforce the pack's own budgets as blocking CI gates, not aspirations: 60fps desktop, stable 30fps mobile with automatic quality reduction, capped device pixel ratio, and effect degradation that triggers before frame rate does. Profile on real mid and low hardware every milestone, not just on the build machine.

---

## 3. The World Class Rubric

These are the binary checks Fred applies at final acceptance. Each is answerable yes or no by a person looking at the running site on real hardware. This is the gate for AC006 ("reads as cyber cartography, not generic star wallpaper"). If any check fails, the site is not done. A "mostly" is a fail.

1. **First-viewport truth:** Within ten seconds of first load, with no interaction, does a new visitor understand that this is a connected system of real work, and not a decorative space background? Yes / No.

2. **The template test:** If you removed the NIXFRED name and colors, would the interface still be identifiably this site and not interchangeable with any dark sci-fi template? Yes / No.

3. **Text legibility:** Is every piece of text a visitor must read (names, descriptions, labels, controls) free of glow halo, of hairline weight, and passing AA contrast against its actual background? Yes / No.

4. **Monospace discipline:** Is monospace confined to coordinates, status, commands, dates, and hashes, with prose and headings set in a real reading face? Yes / No.

5. **Camera obedience:** When the user grabs, pans, or zooms the camera, does the view respond immediately, arrive where aimed, and settle without rubber-banding, overshoot, or idle drift fighting the input? Yes / No.

6. **Input latency:** Does hover feedback appear within one frame and does clicking or tapping a node begin its response in under 200ms, with no perceptible lag on hover states? Yes / No.

7. **Motion restraint at rest:** With a detail panel open and the user reading, is the map calm, with no ambient camera wander, no scene rotation, and no signals racing on unselected edges? Yes / No.

8. **Graph is never a hairball:** At overview, does the map show sector structure and a few major paths rather than the full relationship mesh, and are dense relationships revealed only on selection, compare, or tour? Yes / No.

9. **Color hierarchy:** Squinting at the overview, does a clear value and position structure emerge rather than an even confetti of six equal-shouting hues, with full saturation reserved for focus? Yes / No.

10. **Composition, not scatter:** Do the major stars form intentional, readable figures within their sectors, rather than looking like randomly sprinkled dots, at the real catalog size? Yes / No.

11. **Metadata credibility:** Does the information in a detail panel (dates, tags, relationships, repository links, the one-sentence description) read as real, specific, and true, with no filler, no fake numbers, and no invented connections? Yes / No.

12. **Loading honesty:** Is the loading experience either genuinely fast or reporting only true states, with zero fake percentage and zero boot-theater padding, and is it skippable? Yes / No.

13. **Mobile intentionality:** On a real phone, is this a purpose-built composition with thumb-reach controls, generous tap targets, and a bottom sheet, such that opening any project takes no precision dragging? Yes / No.

14. **Reduced motion is designed:** With `prefers-reduced-motion` on, is the site fully functional and still composed and intentional, a designed mode rather than a stripped or broken one? Yes / No.

15. **Kill list is absent:** Can you scan the running site and confirm the total absence of every Section 1 cliche: no stock nebula, no twinkle field, no warp intro, no corner-bracket chrome, no fake data stream, no glitch transitions, no uniform bloom, no Matrix rain, no autoplay audio, no glowing hairline text? Yes / No.

---

## 4. The Taste Tiebreaker

These three principles resolve the fight that will recur through the build: more spectacle versus more restraint. The product is a precise observatory, not a theme park. When spectacle and restraint collide, apply these in order.

1. **Meaning outranks spectacle.** Every effect must earn its place by communicating structure, state, or relationship. If an effect is beautiful but says nothing about the work, it loses to the restrained option that says something true. The question is never "does this look cool," it is "what does this tell the visitor about Fred's work." An effect with no answer is cut. This is the primary tiebreaker; the other two only apply when this one does not settle it.

2. **The work is the star; the interface is the telescope.** A telescope that draws attention to its own lens is a bad telescope. When a choice would make the visitor notice the interface instead of the work, choose the quieter option. Chrome, animation, and personality serve the projects and step back. The measure of the interface is how clearly the visitor sees the thing behind it, not how much they admire the glass. Larry, the easter eggs, and the signature moments all live under this rule: they are allowed to be distinctive, never allowed to upstage the catalog.

3. **When in doubt, cut it and see if you miss it.** Restraint is the reversible choice; spectacle is the one that accrues and never gets removed once shipped. If the room cannot agree, build the restrained version first and add spectacle only when its absence is a felt loss, not a hypothetical gain. A precise instrument is defined by what it refuses to do. The default answer to "should we add one more effect" is no, and the burden of proof is on the addition, because ten defensible additions sum to the carnival this site exists to avoid.

---

*End of adversarial critique. The concept is strong. It will be killed, if it is killed, by accumulation: a dozen individually reasonable indulgences that together drag it back into the template pile. Hold the line on each one.*
