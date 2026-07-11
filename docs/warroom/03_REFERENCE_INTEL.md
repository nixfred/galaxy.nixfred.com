# Reference Intel: World-Class Spatial and Data-Map Web Experiences

Prepared for the NIXFRED GALAXY design war room. This document catalogs verified, concrete techniques pulled from actual sites and their engineering writeups, not from memory or general impressions. Every claim below is sourced to a specific URL fetched or searched this session. Where a claim could not be verified against a primary source, that is stated explicitly.

## Methodology note

Ten seed targets were investigated plus discovery searches for Awwwards winners, Japanese studios, and knowledge graph visualizations. Eleven references were kept as strong and concrete. A few leads were investigated and discarded for being too generic, too thin on technical detail, or off topic; those are listed at the end so the team does not re-research them.

---

## Kept references

### 1. GitHub homepage globe

What it is: the rotating 3D globe on github.com showing pull requests being opened and merged worldwide, documented in GitHub's own engineering blog post. URL: https://github.blog/engineering/engineering-principles/how-we-built-the-github-globe/

Premium in the first ten seconds: five visual layers (halo, globe, Earth regions, blue spikes for open pull requests, pink arcs for merged ones) built entirely from procedural geometry and shaders, with zero texture maps. About 12,000 five-sided circles compose the landmasses, lit by four directional lights. The effect reads as a live, breathing dataset rather than a static 3D model.

Interaction pattern worth stealing: hover on any arc or spike reveals the underlying data point (repo, timestamp, language, location), and the camera easing toward a target moves by stepping 6 percent closer to it each frame, an exponential decay that decelerates naturally instead of using a fixed-duration tween.

Rendering technique worth stealing: the whole scene is built with FPS-driven quality tiers. The renderer monitors frames continuously, and if it fails to hold 55.5 FPS over the last 50 frames it degrades quality in steps: pixel density drops from 2.0 to 1.5, circle count drops from about 12,000 to about 8,000, raycasting is throttled with frame delays, and the number of visible pull request events onscreen is reduced. This is a live, self-correcting LOD system, not a static "mobile mode."

One thing to avoid: they disabled antialiasing for performance and had to solve the resulting sharp pixelated edge with a separate halo effect rather than re-enabling AA. That is a real cost of the no-texture, no-AA approach worth planning for up front instead of discovering late.

### 2. Stripe interactive globe

What it is: the rotating dot-sphere globe on Stripe's marketing pages, documented in Stripe's own blog post. URL: https://stripe.com/blog/globe

Premium in the first ten seconds: a three-layer composition (translucent ocean sphere, roughly 60,000 twinkling dots, animated arc connectors) using a "sunflower" spiral distribution algorithm so dots never bunch visibly at the poles, plus a custom shader for subtle per-dot twinkle and aurora-like light animation.

Interaction pattern worth stealing: the globe's rotation is driven by page scroll, debounced so the simultaneous scroll handling and render loop both hold 60fps, with drag-to-spin momentum layered on top.

Rendering technique worth stealing: countries where Stripe operates are encoded as a single unique color per country inside a PNG, read back at build time with canvas getImageData to decide which of the roughly 60,000 candidate dots actually render (about 20,000 survive the filter). This turns a geographic membership test into a cheap image lookup instead of per-dot geometry math.

One thing to avoid: disabling antialiasing (a deliberate tradeoff, same as GitHub) introduces visible pixelation on the animated arcs. Stripe judged this an acceptable cost for performance; worth deciding explicitly rather than by accident.

### 3. Google Chrome Experiment: 100,000 Stars

What it is: Google's Chrome/Data Arts Team visualization of roughly 119,617 real nearby stars built with Three.js and CSS3D, with a web.dev case study on how it was made. URLs: https://experiments.withgoogle.com/100000-stars and the build writeup at https://web.dev/case-studies/100000stars

Premium in the first ten seconds: one GL unit equals one light year, so the whole galaxy, solar system, and sun surface share a single consistent spatial scale, with a Sam Hulick (Mass Effect) ambient score tying the zoom levels together emotionally.

Interaction pattern worth stealing: dragging rotates the star field itself rather than moving the camera around it, and zoom only changes camera.position.z. This is the simplest possible turntable interaction and it is exactly the pattern a guided constellation tour would want: the camera has one axis of freedom during free exploration, and tours can hijack it cleanly.

Rendering technique worth stealing: field of view widens as the camera pulls outward and narrows as it moves inward, rather than adjusting near/far clip planes. This avoids near-plane clipping artifacts at extreme zoom (galaxy scale down to solar system scale) without the jarring popping that clip-plane adjustments cause.

One thing to avoid, in the creator's own words: text over WebGL was the weak point even in this award-winning, still-referenced experiment. The CSS3D-synced label approach gave DOM interactivity but labels lost camera-facing without extra billboard tricks, and the creator states plainly that "typography paired with WebGL still remains a challenge, it still feels like a hack." This is a direct admission from a shipped, celebrated project, not a hypothetical risk.

### 4. Bruno Simon's portfolio

What it is: the physics-driven, drivable-car 3D portfolio at bruno-simon.com, documented in his own Awwwards case study. URL: https://www.awwwards.com/brunos-portfolio-case-study.html

Premium in the first ten seconds: you are dropped into a coherent, navigable world (not a UI) with a consistent weather and lighting system and a commissioned ambient soundtrack, so the tone is set before any interaction happens.

Interaction pattern worth stealing: every UI element, including things that would normally be HTML (clicks, scroll, gamepad input), was rebuilt inside the 3D scene so the illusion of a single continuous world is never broken by a DOM overlay popping in.

Rendering technique worth stealing: there are no lights or shadows in the conventional sense. The entire look is achieved with matcap materials (baked lighting encoded into the material itself) plus a shared palette texture where every mesh's colors come from UV coordinates into one small texture atlas. This is a genuinely cheap way to get a cohesive, hand-crafted look without a real-time lighting budget.

One thing to avoid: he states plainly that realistic physics-based interaction between multiple players was deemed not viable due to server cost and abuse potential, so multiplayer is reduced to passive hooks (waves, leaderboards). A useful reminder to scope ambition around what the server budget actually supports, not just what looks good in a mockup.

### 5. Active Theory's engineering philosophy and Hydra engine

What it is: Active Theory's own account of building a custom engine (Hydra) to replace Three.js for their highest-end work, and a cross-platform WebGL runtime (Project Aura). URL: https://medium.com/active-theory/the-story-of-technology-built-at-active-theory-5d17ae0e3fb4

Premium in the first ten seconds: not directly demonstrated in this writeup (it is an engineering essay, not a single site), but the stated design philosophy is telling: start with off-the-shelf tools, and only build custom infrastructure once a specific, repeated workflow pain justifies it.

Interaction pattern worth stealing: not applicable, this is an infrastructure reference rather than a UX one.

Rendering technique worth stealing: Hydra's matrix caching only recomputes an object's transform matrix when something has actually changed, and geometry loading, particle generation, and physics are distributed across Web Workers. Both are directly applicable, low-risk wins for a 30 to 100 node star map: most nodes are static most of the time, so dirty-checking transforms is close to free performance.

One thing to avoid: building a custom engine at all, unless the specific pain (they cite hitting Three.js and Electron limits at Google I/O scale) is actually present. For a 300KB-budget, 30-to-100-node site, this is almost certainly over-engineering; the lesson to take is the caching discipline, not the decision to replace the library.

### 6. Equinox, a WebGL space adventure by Little Workshop

What it is: an Awwwards Site of the Day interactive space narrative. URLs: https://www.littleworkshop.fr/projects/equinox/ and the Awwwards page https://www.awwwards.com/sites/equinox-a-webgl-space-adventure

Premium in the first ten seconds: the team leans on atmosphere and pacing rather than spectacle, per Awwwards commentary, and this shows in the jury scoring, animations and transitions scored 9.40 out of 10, the single highest technical category recorded for the site.

Interaction pattern worth stealing: a dedicated touch interaction mode was designed specifically for mobile and tablet, distinct from a resized desktop control scheme, letting the entire narrative be completed with one finger. That is a deliberate mobile-first redesign of the interaction model, not a responsive scaling pass.

Rendering technique worth stealing: built on Three.js with three-mesh-bvh for spatial queries, models authored in Houdini and Blender, and multiplayer presence over WebSocket and Node.js. Total experience weight is disclosed as loading at 5.7MB and topping out at 17.5MB, useful reference numbers for what a full narrative space experience costs in bytes even when disciplined.

One thing to avoid: despite the Site of the Day win, Responsive Design scored only 6.80 out of 10 in the same Awwwards breakdown, the weakest category on the card. Even top-tier WebGL narrative work visibly struggles with mobile parity; budget real design time for it rather than assuming polish elsewhere will cover it.

### 7. Obsidian's graph view

What it is: the force-directed node graph inside the Obsidian note-taking app, documented on Obsidian's own forum and third-party analysis. URLs: https://forum.obsidian.md/t/design-talk-about-the-graph-view/22594 and https://codeculture.store/blogs/developer-culture/obsidian-graph-view-useful

Premium in the first ten seconds: node size proportional to reference count and force-directed clustering give an immediate, legible sense of which notes matter and which topics cluster together, with zero manual layout work.

Interaction pattern worth stealing: real-time layout updates as content changes keep the graph feeling alive rather than like a static export.

Rendering technique worth stealing: not applicable in the positive sense here; this is primarily a cautionary reference (see below), though the node-size-by-connection-count convention is a cheap, reusable encoding worth adopting for a constellation map (busier projects render as brighter or larger stars).

One thing to avoid, and this is the most important lesson from this reference: below roughly 50 notes the graph reads cleanly, but past roughly 200 notes the physics simulation collapses into what the community calls "the hairball," a visually impressive but navigationally useless dense tangle. A 30-to-100-node star map sits comfortably under that threshold, which is reassuring, but it also means the product must never be pitched or extended toward "thousands of nodes" without a fundamentally different layout strategy (fixed sectors, not free physics) than pure force-direction. NIXFRED GALAXY's six fixed colored sectors are already the correct structural answer to this failure mode; that choice should be defended in review, not "improved" toward free-form physics later.

### 8. Hubtown by Unseen Studio

What it is: a real-estate brand site built around a single glowing 3D monolith. URL: https://hubtown.co.in/, discussed in https://www.utsubo.com/blog/best-threejs-websites-2026

Premium in the first ten seconds: authority is established with one well-lit hero object on a dark, reflective ground plane rather than a complex scene, cinematic lighting and contrast doing the work that geometric complexity would otherwise have to do.

Interaction pattern worth stealing: a signature mouse-reveal interaction where the cursor uncovers detail in the geometry and lighting as it passes over the object, rewarding hover exploration with progressive disclosure.

Rendering technique worth stealing: Three.js plus GSAP, deliberately kept to a single hero object rather than a populated scene. This is direct evidence that restraint, not density, reads as premium, relevant to resisting the temptation to cram all 30 to 100 stars into a dense, busy opening shot.

One thing to avoid: no mobile-specific handling is documented in the source, which is itself the warning; a site built around one dramatic object still needs an explicit mobile plan, it does not fall out for free.

### 9. The Monolith Project

What it is: a 13-scene, scroll-driven WebGL narrative built with Three.js, React Three Fiber, and GSAP by Ethan Chiu, with a detailed engineering case study on Codrops. URL: https://tympanus.net/codrops/2025/11/29/building-the-monolith-composable-rendering-systems-for-a-13-scene-webgl-epic/

Premium in the first ten seconds: colored, depth-and-normal-based outline rendering on all geometry (a deferred rendering pipeline with edge detection) gives every scene a consistent stylized, illustrated look rather than default PBR realism, and scene transitions use dedicated transition materials (wipe, zoom blur, mask, raymarched effects) instead of simple cross-fades, which reads as authored production design rather than default engine behavior.

Interaction pattern worth stealing: scenes are stitched together as an authored sequence with a specific transition material chosen per cut, exactly the kind of system a guided tour through constellations needs, arriving at a sector should not always dissolve the same way.

Rendering technique worth stealing: a composable materials system where shader features (color, gradients, flow maps, wind) are modular components assembled per material rather than one monolithic shader file per object, explicitly built so "features can be added and tested in isolation." This is a strong architectural pattern for a star map where star, connector, and sector-boundary materials likely share a shading language but vary in details.

One thing to avoid: the case study does not disclose bundle size or performance numbers at all, an omission worth noting; a 13-scene cinematic experience of this ambition is very unlikely to fit a 300KB budget, and the team should not assume its techniques are free just because they are elegant.

### 10. NASA Eyes on the Solar System

What it is: NASA/JPL's real-time, time-scrubbable 3D solar system explorer. URL: https://eyes.nasa.gov/apps/solar-system/

Correction to the seed brief: this is not built on Three.js. Search results confirm it runs on CesiumJS, the open-source geospatial WebGL engine also used for NASA's Eyes on the Earth. This matters because Cesium is purpose-built for real-world-scale, real-time-data 3D globes and orbital mechanics, a different tool for a different problem than an authored, fixed-layout star map.

Premium in the first ten seconds: an immersive, time-based simulation where the entire solar system can be scrubbed from 1950 to 2050 and spacecraft trajectories are shown against real ephemeris data, establishing scientific credibility instantly through data fidelity rather than art direction.

Interaction pattern worth stealing: time as a first-class navigation axis alongside space. A star map of a body of work has a natural timeline (when each project happened) that could borrow this pattern as an optional axis without adopting Cesium itself.

Rendering technique worth stealing: not independently verified beyond the choice of engine; no primary engineering writeup with implementation specifics was found this session, unlike GitHub, Stripe, and 100,000 Stars, which do have such writeups.

One thing to avoid: do not assume this reference is a Three.js implementation pattern; it is included for its interaction and data-fidelity lessons only, not as rendering-technique source material.

### 11. Think Machine's 3D knowledge graph

What it is: a commercial personal knowledge graph tool that renders notes and connections as a navigable 3D graph. URL: https://thinkmachine.com/docs/knowledge-graph

Why it is included despite thin documentation: it is the closest conceptual analog found to "your own body of work as a navigable 3D map of connected nodes," which is precisely the NIXFRED GALAXY brief.

What could not be verified: the public documentation page contains no camera control specification, no node or edge rendering technique, no text label handling approach, and no disclosed performance or scale limitations. Product marketing language only ("Global Positioning Symbols," "Trail Links," "Hyperedges").

Verdict: keep as a conceptual pointer that this product category exists and is being sold commercially, but do not cite it for any technique. It should not be treated as a validated reference.

---

## Investigated and discarded

- star-history.com: a 2D line chart of GitHub star counts over time. Despite the name, it is not a spatial or 3D reference and offers no transferable rendering or camera technique for this product. Discarded.
- Rhizomatiks (Tokyo collective): confirmed real and award-winning (Ars Electronica honorable mentions, ADC Annual Awards data visualization work), but no specific project writeup with concrete web rendering technique surfaced this session, results were institutional/exhibition pages rather than engineering case studies. Worth a dedicated follow-up pass if time allows, not included as a scored reference here.
- Orpetron's "10 Award-Winning Projects Showcasing Three.js Innovation" roundup: fetched directly; the ten listed sites (Cosmos Studio, Emotion Agency, Britive, Marvium Collection, Gleec, Repeat, Non-Linear Studio, ToyFight, STR8FIRE, SPAACE) are real but the article itself gave only generic category tags ("interactive animation," "scroll animation") with no technique-level detail, and none were space or map themed. Discarded as a batch; individual sites were not deep-dived given time budget.
- General Japanese web design commentary (Utsubo's style guide): confirmed real, named studios worth a future look (SHIFTBRAIN, mount, Garden Eight, monopo) and surfaced one genuinely transferable typography idea (CSS `writing-mode` vertical text and deliberate glyph-set discipline), folded into the synthesis below rather than kept as a standalone scored reference since no specific site was inspected.

---

## Synthesis

### a. The five patterns that separate world-class spatial sites from template work

First, restraint reads as premium and clutter reads as cheap. Equinox won Site of the Day by leaning on atmosphere and pacing over spectacle, Hubtown built its entire authority around one well-lit hero object, and GitHub's globe uses only five deliberate layers, not an unbounded particle count. Second, performance is designed and measured live, not hoped for: GitHub's globe runs a continuous FPS monitor that degrades pixel density, geometry count, and raycast frequency in real time rather than shipping one static quality tier. Third, the visuals are generated from the underlying data rather than hand-authored on top of it, which is also what keeps them light: GitHub's arcs come from real pull request coordinates and Stripe's dot field comes from a color-coded country mask, so the rendering logic and the information logic are the same code. Fourth, camera and transition motion is an authored system with explicit rules, not a library default: 100,000 Stars widens field of view on zoom-out instead of moving clip planes, GitHub eases position by a fixed percentage per frame, and The Monolith Project assigns a specific transition material to every scene cut. Fifth, the WebGL-to-text seam is treated as a real, still-unsolved engineering problem that must be budgeted for deliberately, not an afterthought; the creator of 100,000 Stars says so directly about his own award-winning work, and Equinox's weakest scored category, even after winning Site of the Day, was Responsive Design.

### b. Techniques most transferable to a 30 to 100 node star map with a 300KB bundle budget

Skip textures entirely and lean on procedural, shader-driven materials the way GitHub's globe does (12,000 shapes, zero texture maps) and Bruno Simon's matcap-plus-palette-atlas approach does; this is simultaneously a look and a bundle-size decision. Render stars as points or instanced geometry generated from a small data file at runtime rather than as individually authored meshes, and generate constellation connectors as bezier or tube curves computed from that same data, mirroring how GitHub draws its arcs. Build the FPS-adaptive degradation loop early, it is cheap insurance against the widest possible range of devices and is a proven, documented pattern rather than a novel risk. Adopt Active Theory's dirty-matrix-caching discipline: with only 30 to 100 mostly static nodes, only recomputing transforms when something actually changes is close to free. Be realistic about the 300KB number itself: Three.js's core alone consumes a meaningful share of a 300KB gzipped budget, so the team should decide up front whether to tree-shake aggressively and import only the needed modules, or hand-roll the star field's point rendering in raw WebGL the way Active Theory chose to bypass Three.js entirely for their highest-constraint work, reserving any heavier library usage for the smaller number of more complex objects (sector boundaries, tour camera rig).

### c. Camera and motion choreography lessons

Give free exploration exactly one or two axes of camera freedom, not six: 100,000 Stars rotates the model and only moves the camera in Z, which is both simpler to implement and easier for a guided tour system to hijack cleanly when it needs to take over. Ease with a percentage-of-remaining-distance step (GitHub's 6 percent per frame) rather than a fixed-duration tween, since it decelerates naturally and composes well with interruption (a user clicking a new star mid-transition). Treat scene-to-scene or sector-to-sector transitions as their own authored material or effect, per The Monolith Project's approach, rather than a single reused fade, so arriving at each of the six sectors can have its own signature moment without extra camera logic. Scale field of view with zoom level rather than adjusting near and far clip planes when moving between galaxy-scale and single-star-scale views, which avoids the popping and clipping artifacts that plague naive implementations of large dynamic-range zoom.

### d. How the best ones handle mobile

The strongest pattern is live, measured degradation rather than a static breakpoint: GitHub's globe does not have a "mobile mode," it has a continuous quality controller that responds to actual measured frame rate on the actual device. The second strongest pattern is redesigning the interaction model for touch specifically, not just scaling desktop controls down, as Equinox did with its dedicated single-finger touch mode covering an entire narrative experience. The honest finding, though, is that mobile remains the industry's weak point even at the top: Equinox's Awwwards Responsive Design score (6.80 of 10) was its lowest category despite winning Site of the Day, and Hubtown's writeup discloses no mobile handling at all. The team should read this as permission to budget real, dedicated design and engineering time for mobile rather than treating it as a QA pass at the end.

### e. How the best ones handle text legibility over WebGL

There is no clean solved answer, and the most credible reference (100,000 Stars) says so about its own shipped, celebrated work: "typography paired with WebGL still remains a challenge, it still feels like a hack." The practical, well-trodden path for a node count in the 30 to 100 range is an HTML/CSS absolute-positioned overlay whose elements are repositioned each frame (throttled, not on every single frame) using the projected 3D coordinates of each node; general WebGL-plus-DOM guidance places the comfortable ceiling for this approach around 50 labels before DOM manipulation overhead and occlusion problems start to bite, which sits right at the top of this product's own node budget and should be watched as the roster grows. Because HTML overlays do not participate in the WebGL depth buffer, occluded or behind-camera labels must be hidden manually rather than assumed to be handled automatically, a gap 100,000 Stars hit directly with its CSS3D approach. Canvas-baked or in-world billboarded text should be reserved for secondary, decorative labeling only, not the primary node names a user needs to read and click.

---

File written to: /Users/pi/Projects/galaxy.nixfred.com/docs/warroom/03_REFERENCE_INTEL.md
