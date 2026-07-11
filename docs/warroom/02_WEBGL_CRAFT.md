# WebGL Rendering Craft: Position Paper

War room seat: WebGL rendering craft. Product: galaxy.nixfred.com, a constrained 2.5D star map of roughly 30 to 100 project stars plus ambient particles, six colored sector regions, relationship lines with traveling signals, camera focus transitions, and guided tours. Three.js is lazy loaded inside an Astro static shell. Budgets that govern every decision below: shell JavaScript under 150 KB compressed, visualization chunk under 300 KB compressed, 60 fps desktop, stable 30 fps mobile, capped device pixel ratio, renderer pauses when hidden, and a reduced motion mode that stops decorative animation.

This paper takes firm positions. Where a technique is fashionable but wrong for this scene, it is named and rejected with a reason.

The thesis underneath every position: award tier work on a near black field is not made by adding effects. It is made by rendering a small number of luminous elements with resolution independent precision, spending the entire frame budget on the few things the eye actually tracks (the stars, the lines, the focus move), and refusing the expensive general purpose machinery (post processing stacks, SDF text engines, orbit controllers) that stock demos reach for by reflex.

---

## 1. Star rendering

### Two populations, two techniques

There are two distinct star populations and they must not share a code path.

1. Ambient particle field: thousands of tiny non interactive background points that sell depth and drift.
2. Project stars: 30 to 100 large, interactive, per star attributed anchors that pulse, carry halos, and must be precisely pickable.

**Ambient field: `THREE.Points` with a custom `ShaderMaterial`.** Points are the correct primitive for the cheap background. One draw call, one buffer, `gl_PointSize` set per vertex in the vertex shader. The known limitations of points do not matter here because these particles are small, never picked, and disappearing at a screen edge is invisible on a background swarm.

**Project stars: `InstancedMesh` of a single camera facing quad.** This is the more important and less obvious call. Do not render the interactive stars as points. `THREE.Points` has three defects that bite exactly the elements the visitor stares at:

1. `gl_PointSize` has a hardware maximum, commonly 64 on mobile GPUs and 1024 on desktop. Focal stars with large halos at close zoom will hit that ceiling and stop growing.
2. A point sprite is culled the instant its center leaves the frustum, so a large near star pops out of existence when its center scrolls off screen while half its halo was still visible.
3. Perspective size scaling requires manual `gl_PointSize = base * (scale / -mvPosition.z)` math and is brittle across drivers.

`InstancedMesh` with one shared `PlaneGeometry` and per instance attributes removes all three. Billboard in the vertex shader by taking the instance world position and adding the quad corner offset scaled and oriented in view space (add `position.xy * size` after transforming the instance center to view space, before projection). Per instance data rides `InstancedBufferAttribute`s: `aColor` (sector hue), `aSize` (editorial importance), `aPulsePhase` and `aPulseAmp` (activity), `aEnergy` (archive dimming), `aStatus` (ring or corona selection). One draw call covers all 30 to 100 stars. `setMatrixAt` is not even needed for position if position rides an instanced attribute and the base matrix stays identity, which keeps updates (the Larry anomaly repositioning, ignition stagger) to a single buffer write with `needsUpdate = true`.

### Anti aliased circular stars and soft halos, procedurally

Do not use a texture for the star sprite. Render the disc and halo procedurally in the fragment shader:

- Radial distance `float r = length(vUv - 0.5) * 2.0;` on the quad.
- Core disc: `float core = 1.0 - smoothstep(coreR - aa, coreR + aa, r);` where `aa = fwidth(r)`. Using `fwidth` for the edge width makes the anti aliasing resolution independent, so the star is crisp at any zoom and any DPR without a mip chain.
- Soft halo: a separate falloff term, `float halo = pow(clamp(1.0 - r, 0.0, 1.0), haloFalloff);` with `haloFalloff` around 2.0 to 4.0. The halo is what reads as glow (see section 2).
- Compose: `vec3 c = aColor * (core * coreGain + halo * haloGain);`

This beats a textured billboard for four concrete reasons: it is resolution independent (a 256 px star texture is soft mush at 4x zoom, the SDF never is), it costs zero texture memory and zero texture fetch, pulse and halo parameters are live uniforms and attributes rather than baked pixels, and it removes an asset from the bundle and the load path. A texture only wins when the sprite art is irregular and hand painted, which is explicitly against the art direction (no stock nebula photography, generate atmosphere procedurally). Procedural is both cheaper and more on brief.

### HDR feel additive blending discipline on near black

The luminous on black look comes from additive blending, not from HDR buffers or tone mapping, which we cannot afford on mobile.

- Star material: `blending: THREE.AdditiveBlending`, `depthWrite: false`, `depthTest: true` (test so stars occlude correctly against nothing but remain draw order independent, which additive is by nature).
- Keep authored base colors at or below 1.0 per channel. Let overlap do the work: where two halos or a core and a halo stack, the additive sum climbs toward white, which is exactly how real bright light behaves and gives the "hot core, colored corona" read for free.
- The background must be genuinely near black (values around 0.02 to 0.04) so additive accumulation has headroom before it clips. On a lighter background additive blending turns to gray wash.
- Discipline rule: no single element should exceed roughly 0.7 in any channel at rest, so that pulse peaks and halo overlaps have somewhere to go. Reserve full white for the selected local sun peak only.

This gives the HDR feel with an ordinary 8 bit `LDR` buffer, no `WebGLRenderTarget` with float textures, no tone mapping pass. That is a deliberate budget decision, not a compromise: on this content it is visually indistinguishable from a float pipeline.

---

## 2. Glow and bloom

### The default position: fake the bloom, ship no post processing

**Primary recommendation: no post processing bloom at all on any tier by default. The additive halo geometry from section 1 is the bloom.**

The reasoning is specific to this scene, not general. Bloom exists to make bright things bleed light into neighboring pixels. Our bright things are discrete point sources on a near black field, and the additive halo billboard already bleeds a soft falloff around each core. For point sources on black, a sized additive halo is visually equivalent to a post bloom of those same points, because there is nothing else in frame to bloom and no complex geometry whose silhouette needs the glow to wrap it. We get the entire visual payoff for the cost of a slightly larger quad and a `pow` in the fragment shader.

What this buys against the budget:

- Zero extra full screen render passes. `UnrealBloomPass` is a luminosity high pass plus a five level mip pyramid, each level a separable (horizontal then vertical) Gaussian blur, plus a composite. That is on the order of eleven texture passes per frame at or near full resolution. On a mobile GPU at even DPR 1.5 that is the single most likely cause of dropping below 30 fps.
- Zero addon bundle cost. `EffectComposer` plus `RenderPass` plus `UnrealBloomPass` plus `OutputPass` plus `CopyShader` plus `LuminosityHighPassShader` is roughly 15 to 25 KB gzipped that we simply do not spend.
- No `CVE` surface of tone mapping mismatch, no `sRGB` double encode bugs that plague composer setups, no resize plumbing for render targets.

### If a post pass is ever added, this is the only correct way

Should Fred insist on true bloom for the desktop high tier signature moment (the project focus "local sun"), the rule is selective bloom, never scene wide bloom, and only on that tier.

Correct selective bloom is the layers technique: assign glowing objects to a dedicated bloom `Layer`, render a first pass with all non bloom materials swapped to black, run `UnrealBloomPass` on that darkened render, then additively composite the bloom result over a normal beauty render via a final `ShaderPass`. Scene wide bloom is wrong here because it would smear the labels, the grid, and the terminal chrome into unreadable halos, violating the requirement that labels stay legible and copy stays sharp.

Threshold and parameters if used: `threshold` 0.85 (only the hot cores and the selected sun cross it, sector halos and ambient particles stay under and do not bloom), `strength` 0.4 to 0.6 (restrained, the art direction explicitly forbids excessive bloom), `radius` 0.3 to 0.4. Bind these to the tier system so mobile and desktop low never allocate the composer at all.

**Firm recommendation for this product: ship with no post processing. Treat `UnrealBloomPass` selective bloom as a desktop high only, off by default enhancement to be evaluated after the halo approach is on screen, and expect it to lose that evaluation.** This is the highest leverage single decision in the paper for both frame rate and bundle size.

---

## 3. Sector atmosphere

Six sectors each need a subtle field of colored haze that reads as a region, not a box, without stock textures and without killing fill rate.

### Rejected options

- Full screen fbm nebula: too much overdraw, and it competes with the stars for attention, violating "movement shall never block reading."
- Large photographic nebula planes: forbidden by the art direction (no stock space photography).

### The position: few large soft additive billboards, fbm from one tiny generated noise texture, gradient fallback on mobile

Per sector, place one or two large soft billboards (quads, not full screen) centered on the sector anchor. The fragment shader builds haze from fractal noise, but do not evaluate expensive analytic simplex noise per fragment across large overdraw. Instead:

1. Generate one small tileable noise texture once at runtime, 256 by 256, into a `DataTexture` (fill a `Float32Array` or `Uint8Array` with value noise in JavaScript at init, roughly 65 k samples, a few milliseconds, no asset download and no `CSP` image source).
2. In the fragment shader sample that texture at three scrolling octaves with different `uv` scales and slow time offsets, sum them into an fbm value. This is three texture fetches and a few multiplies per fragment, cheap even on mobile, versus dozens of ALU ops for analytic noise.
3. Multiply by a radial mask (`1.0 - smoothstep(0.5, 1.0, r)`) so the field fades to nothing at the quad edge and never shows a rectangular seam. This is what makes it read as a region rather than a card.
4. Keep alpha very low, 0.03 to 0.10 peak, sector hued, `depthWrite: false`, rendered before the stars. Soft additive on the darker sectors, or normal blend with low alpha where additive would gray out.

**Mobile and desktop low drop the fbm entirely and use a single radial gradient sprite per sector** (a two or three stop radial alpha, no texture fetch, no time scroll). Visually 80 percent of the effect at 5 percent of the cost.

Global depth cue: add `THREE.FogExp2` with a very low density tuned to the map scale. It is nearly free (a built in shader chunk, no extra pass) and it does more to sell 2.5D depth than any nebula, by desaturating and dimming distant stars and haze. Keep density low enough that overview labels never fog out (tie fog into the label legibility requirement).

---

## 4. Relationship lines

### Reject native lines

`THREE.Line` and `THREE.LineSegments` render `GL_LINES`, which is 1 device pixel wide, aliased, and ignores `linewidth` in every mainstream browser on the ANGLE and most desktop drivers. For a hero feature ("luminous relationships," "the graph must not become spaghetti," "signal moving through a system") that is unacceptable.

### The position: `Line2` for the lines, a shader driven brightness bump for the signal

**Use `Line2` with `LineGeometry` and `LineMaterial`** from the three addons. These build the line as an instanced strip of quads with world or screen space width, real anti aliasing in the fragment shader, and correct joins. Cost is roughly 8 to 12 KB gzipped for the `Line2` plus `LineMaterial` plus `LineGeometry` plus `LineSegmentsGeometry` set, which fits the budget comfortably. Set `LineMaterial.resolution` on every resize (the one piece of plumbing `Line2` requires) or the width goes wrong.

Line width and intensity encode meaning per the requirements: manual curated relationships brighter and slightly wider, automatic similarity edges thin and faint. Curve the paths with `CatmullRomCurve3` sampled to 24 to 48 points so cross sector routes arc rather than cut straight, which reads as "navigation computer solving a route."

### Traveling signal: one moving brightness bump, not a dashed line, not many sprites

Two mechanisms, chosen by moment:

1. Default active signal (selection, tour step, compare path): a shader driven brightness bump. Bake a normalized arc length attribute `aT` (0 at source, 1 at target) into the line geometry. In the fragment shader compute a moving Gaussian around a uniform head position: `float pulse = exp(-pow((vT - uHead) / uWidth, 2.0));` and add `pulse` to the base line brightness. Advance `uHead` with clock delta, wrap 0 to 1. The base line stays faint, a short bright packet travels along it. This exactly matches "information moving through a system, not a racing game," and it is one uniform update per active line, zero geometry churn, zero allocation.

Why not animated dashes: `LineMaterial` supports `dashed` with an animatable `dashOffset`, and traveling dashes are the reflex solution. Rejected because dashing makes the entire line dotted, which reads as tentative or under construction, and because we want a single discrete packet, not a marching ant pattern.

2. Rare hero moment (ignition final route draw, a showcased path): a small additive sprite ridden along the curve via `curve.getPointAt(t)` each frame. Acceptable only because the count of simultaneously animated hero lines is tiny (one to a few). Pool these sprites, never allocate per frame.

**Discipline rule from the requirements, enforced in code: never animate signals on the whole graph.** Only the selected node's direct edges, the active tour route, and the active compare path carry a traveling signal. Everything else is a static faint `Line2`. This keeps animated line count in single digits and protects the frame budget.

AA strategy: rely on `LineMaterial`'s built in fragment AA. If the context is created with `antialias: true` (MSAA), optionally enable `alphaToCoverage` on the line material for cleaner edges, but MSAA plus fat line AA is belt and suspenders and MSAA is a fill cost, so on mobile prefer `antialias: false` and lean on the material AA alone.

---

## 5. Camera rig

### Reject raw OrbitControls

`OrbitControls` is roughly 10 KB, allows a full orbit and zoom range we do not want, and would need clamping and event fighting to constrain anyway. Build a purpose made rig in 1 to 2 KB of app code. This also removes a dependency and gives exact control over the composition requirements.

### Rig architecture

Represent the camera state as a target point plus spherical offset: `azimuth`, `polar`, `radius` around a `target` Vector3. Each frame the actual camera lerps toward these.

- No roll by construction: keep `camera.up` locked to world Y and always `camera.lookAt(target)`. Roll is impossible because it is never expressed in the state. This is cleaner than clamping roll after the fact.
- Pitch clamp: constrain `polar` to a narrow band, roughly 60 to 85 degrees from vertical, so the map stays near top down 2.5D and labels stay readable and never edge onto a horizon. This is the mechanical enforcement of "pitch is limited so labels remain readable."
- Damping: framerate independent exponential smoothing. `k = 1.0 - exp(-lambda * dt)` with `lambda` around 6 to 10, then `current += (goal - current) * k` for target, radius, azimuth, polar. Using `exp(-lambda*dt)` rather than a fixed lerp factor keeps the feel identical at 30 and 60 fps, which matters because mobile runs at 30.
- Pan and zoom clamps: `radius` clamped to a min and max so the visitor cannot fly into a star or lose the map, and `target` clamped to a bounded box around the galaxy so overview is always one gesture away ("the map always has a reliable route back to overview").

### Focus transition choreography

- Easing: `easeInOutCubic` or a tuned quintic on a normalized 0 to 1 progress. Duration 650 to 850 ms desktop, 400 to 550 ms mobile. Acceleration and deceleration, never linear, never abrupt, per the motion rules.
- Compose the target off center so the detail panel never covers the star: use `camera.setViewOffset(fullW, fullH, offsetX, 0, viewW, fullH)` to render as if the viewport is the sub rectangle not covered by the right side panel. This biases the composition so the focused star lands in the visible left center without moving a single object in the world. `setViewOffset` is the professional move here and is far cleaner than nudging the `target` sideways, which distorts the parallax. On mobile the bottom sheet takes the lower portion, so bias vertically instead. Clear with `camera.clearViewOffset()` when the panel closes.
- The "bend toward it" and "local sun" signature: on focus, animate the selected instance's `aSize` and `haloGain` up, dim unrelated stars by lerping their `aEnergy` down, and keep related stars bright. All of this is attribute interpolation on the existing `InstancedMesh`, no new objects.

### Tour path interpolation

Waypoints are the tour's camera targets. Interpolate the `target` along a `CatmullRomCurve3` through those points, sampled by arc length so speed is even regardless of waypoint spacing. Ease the along path parameter per segment so each stop has a settle. Interpolate the look direction separately by easing `target` toward each node; do not slerp a quaternion through waypoints because that can induce the forbidden roll and unreadable tilt. Keep each tour hop in the same 650 to 850 ms envelope so the pacing feels authored.

### Reduced motion path

Reduced motion is a first class code path, not a disabled animation. When `prefers-reduced-motion: reduce` is set (or the in app toggle), focus and tour transitions set camera state instantly: no spherical interpolation, no path travel. Optionally mask the cut with a 120 to 150 ms opacity crossfade of a thin color overlay so the jump is not jarring, but the camera itself teleports. Idle drift is off entirely. Every focus, tour, compare, and search action still works, just without travel. This satisfies FR014 and AR006 and the art direction's "reduced motion is a designed mode."

---

## 6. Labels

### The tradeoff, stated honestly

- HTML overlay labels: project each label's world position with `vector.project(camera)`, convert NDC to pixels, position an absolutely placed DOM element with `transform: translate3d(...)`. Pros: real text that is crisp at any zoom and DPR, selectable, honors the user's font size and `prefers-contrast`, lives natively in the accessibility tree, trivial collision and fade logic in plain JavaScript, zero WebGL text cost, near zero bundle cost. Cons: DOM update cost if there were hundreds of simultaneous labels, manual occlusion, elements live in a layer above the canvas.
- SDF in scene text via `troika-three-text`: GPU signed distance field glyphs, crisp at any scale, depth sorted in 3D. Cons: `troika-three-text` is a heavy dependency, roughly 40 to 70 KB gzipped including its font parsing and its SDF generation worker, and canvas rendered text is not in the accessibility tree at all.

### Firm recommendation: HTML overlay labels

Use HTML overlay labels. This is not a close call for this product, for three reasons that stack:

1. The requirements mandate it anyway. FR053 forbids the canvas from being the only source of project names in the accessibility tree, AR008 requires an HTML representation rather than narrating canvas geometry, and VR004 requires major labels legible at overview scale. SDF in scene text would still force us to maintain a parallel HTML label layer for accessibility, so we would pay for `troika` and then build the HTML labels too. HTML labels do it once.
2. The count is tiny. Major project labels are always on, minor labels appear only on focus, sector names are six. At any moment a handful to a few dozen DOM labels exist. DOM label performance problems begin in the hundreds, so we are an order of magnitude under the danger zone.
3. Accessibility and internationalization come free. Crisp text at user chosen zoom, real focus outlines, `prefers-contrast` support, and the Japanese accent typography the art direction wants, all handled by the browser text stack rather than an SDF atlas that would need CJK glyph coverage baked in.

Implementation discipline: one label layer (a `CSS2DRenderer` from three addons at roughly 2 to 3 KB, or a hand rolled projector which is even smaller). Update with transform only writes, never touch `top`, `left`, `width`, or anything that triggers layout, so there is no reflow thrash. Drive visibility and opacity from camera distance (fade minor labels out at overview scale, in on approach) and a simple screen space collision grid: bucket projected label rects into a coarse grid, and when two claim the same cell the lower priority one fades. Priority order follows the label hierarchy in the art direction (site title, selected title, major labels, sector names, minor on focus). Labels never rotate in 3D and never billboard as textured planes, per the art direction.

---

## 7. Picking and hit targets

### The position: raycast one InstancedMesh of generous invisible proxies, throttled to rAF

Raycasting the tiny visual cores is hostile UX, the stars are small and the halos are soft. Instead maintain a second `InstancedMesh` of invisible hit proxies, one generous quad or sphere per project star, radius roughly 2 to 3 times the visual core or a screen space minimum so small satellites are still tappable. Set the proxy material `visible: false` is wrong (invisible objects are skipped by the raycaster in recent three versions); instead use a fully transparent material with `colorWrite: false` and `depthWrite: false` so it renders nothing but is still raycast. The raycaster tests one object and returns `instanceId`, which maps directly to the project slug.

GPU picking (render an id color buffer, `readPixels` under the cursor) is the right tool at thousands of pickables, but it adds a render target, a `readPixels` pipeline stall, and complexity we do not need at 30 to 100 stars. Reject it here. Reconsider only if the ambient field ever becomes interactive, which the requirements say it will not.

Hover throttling: do not raycast on every `mousemove`. Store the latest pointer position on `mousemove` and raycast at most once per animation frame, and only when the pointer actually moved since last frame. That caps raycasts at the frame rate and usually well below it. On mobile skip hover raycasting entirely: first tap focuses, second tap opens, per the art direction, so touch does a single raycast on `tap`, not on move. Set a sensible `raycaster.near` and `raycaster.far` to the map bounds so tests short circuit early.

---

## 8. Adaptive quality

A tier system, chosen at load from device signals and adjusted at runtime by an FPS watchdog. Detection inputs: device pixel ratio, `navigator.hardwareConcurrency`, `navigator.deviceMemory` where present, coarse mobile detection, `navigator.connection.saveData`, `prefers-reduced-motion`, and a first second FPS probe.

### Tiers and what each drops

| Tier | DPR cap | Ambient particles | Nebula | Bloom | Line signals | Labels |
| --- | --- | --- | --- | --- | --- | --- |
| desktop high | 2.0 | 3000 to 6000 | fbm from noise texture | none by default, optional selective on focus | full, Line2 AA | full |
| desktop low | 1.25 to 1.5 | ~1500 | radial gradient sprite | none | active only, Line2 AA | full |
| mobile | 1.0 to 1.5 | 500 to 800 | radial gradient sprite | none | selected node only | fewer, focus driven |
| reduced data or reduced motion | 1.0 to 1.25 | 200 to 400 | static gradient | none | static highlight, no travel | essential only |

The DPR cap is the single most important lever. Fill rate scales with the square of DPR, so capping a retina phone at 1.5 instead of 3.0 is a 4x fill reduction before any other change. Cap DPR first, always, on every tier.

Note that reduced motion and low capability are orthogonal: a powerful desktop with `prefers-reduced-motion` runs desktop high visuals with all continuous motion removed (no drift, no signal travel, no idle pulse, instant reframes), not the stripped mobile geometry. Keep the two axes separate in the tier logic.

### Runtime FPS watchdog with hysteresis

Maintain a rolling average of frame delta over the last 60 frames. If the average sustains above roughly 22 ms (under about 45 fps) for two to three seconds, step down one level in a fixed order:

1. Lower DPR one notch.
2. Disable traveling line signals (static lines only).
3. Reduce ambient particle count (shrink the draw range on the existing buffer, no reallocation).
4. Downgrade nebula from fbm to gradient sprite.
5. Disable selective bloom if it was on.

Step down one item at a time and re measure, so we drop the minimum needed. Hysteresis prevents oscillation: only step back up after a longer stable window (say 8 to 10 seconds averaging comfortably under 14 ms, about 70 fps), step up one item at a time, and never step up past the ceiling detected at load on mobile. The watchdog degrades gracefully and silently; it must never flash or restart the scene.

---

## 9. Frame and memory discipline

### Zero per frame allocations

Every object allocated inside the render loop is future garbage collector jank, which on a 60 fps budget of 16.7 ms per frame is a visible hitch. Rules enforced in review:

- Preallocate scratch math objects at module scope: a handful of `Vector3`, one `Matrix4`, one `Quaternion`, one `Color`, reused via `.set`, `.copy`, `.lerp`. Never `new` anything in the loop.
- No array literals, no `.map`, `.filter`, `.forEach` closures, no template strings inside the loop. Iterate with indexed `for`.
- Reuse typed array views when writing instance attributes; write in place and set `needsUpdate = true`, do not rebuild the `BufferAttribute`.

### Object pooling

Pool the traveling signal sprites and any transient hero effect objects. The Sky Walrus and the ignition route sprites are borrowed from a small pool and returned, never created on demand.

### Single clock, framerate independent motion

One `THREE.Clock`. Read `delta` once per frame and thread it through everything. All damping uses `1 - exp(-lambda * dt)` so the feel is identical at 30 and 60 fps. Clamp `delta` to a ceiling (for example 0.1 s) so a background tab or a stalled main thread does not produce one giant catch up step that flings the camera.

### Pause on hidden and idle

- FR013: on `document.visibilitychange` to hidden, stop the `requestAnimationFrame` loop entirely, no rendering, no updates. Resume on visible and reset the clock to avoid a huge delta.
- An `IntersectionObserver` on the canvas pauses the loop when the map scrolls out of view.
- Idle reduction: when there is no pointer input and no active transition and reduced motion is off, the only motion is slow drift and pulse, so render on demand at a reduced cadence (for example every other frame, an effective 30 fps) to halve GPU work while idle. Any input or transition immediately restores full rate.

### WebGL context loss recovery

Real devices lose the GL context (GPU reset, tab backgrounding on mobile, driver hiccup). Handle it or the map dies to a black rectangle:

- Listen for `webglcontextlost`, call `event.preventDefault()` (required, or the context never restores), and stop the loop.
- Listen for `webglcontextrestored`, rebuild GPU side resources (geometries, materials, textures, render targets, the generated noise `DataTexture`) and resume. Keep all scene state (positions, colors, relationships) in plain JavaScript so it can be rebuilt deterministically, which the deterministic layout requirement (FR006) already guarantees.
- On unrecoverable failure, fall through to the Atlas HTML fallback (FR052, FR061). WebGL failure must degrade to the accessible catalog, never to a broken canvas.

### Disposal

On any mode teardown or hot data swap, `dispose()` geometries, materials, textures, and render targets, and remove event listeners. GPU memory does not get garbage collected; leaked render targets and textures accumulate until the context dies. Dispose is not optional.

---

## 10. Bundle strategy

### Import discipline

The shell (under 150 KB) must not import `three` at all. Three lives only in the lazy visualization chunk, loaded via dynamic `import()` from the Astro island after the shell is interactive (PR001, PR002). This is a hard boundary: a stray top level `three` import in shell code blows the 150 KB shell budget instantly.

Inside the viz chunk, import named symbols from `three` (`import { WebGLRenderer, Scene, PerspectiveCamera, InstancedMesh, ShaderMaterial, ... } from 'three'`) so the bundler tree shakes. Be honest about the limit of tree shaking: the `WebGLRenderer` is effectively monolithic and pulls most of the core shader library and math regardless, so the practical floor for a real scene is around 130 to 150 KB gzipped for three core no matter how disciplined the imports. Import addons from `three/examples/jsm/...` by exact path so unused addons never enter the graph.

### Gzipped size math against the 300 KB viz budget

Realistic gzipped estimates for the recommended feature set:

| Item | Gzipped |
| --- | --- |
| three core (renderer, math, geometries, materials actually used) | 130 to 150 KB |
| `Line2` + `LineMaterial` + `LineGeometry` + `LineSegmentsGeometry` | 8 to 12 KB |
| `CSS2DRenderer` (or a hand rolled projector) | 2 to 3 KB |
| App code: custom camera rig, star and nebula and line shaders, tour and compare logic, tier system, watchdog, picking, label layer | 30 to 50 KB |
| **Total recommended set** | **170 to 215 KB gzipped** |

That lands comfortably under 300 KB with roughly 85 to 130 KB of headroom. The generated noise texture is created at runtime and adds zero to the bundle. Custom shaders are strings and are tiny.

### What is deliberately not in that total

- `troika-three-text`: 40 to 70 KB, rejected in section 6 on accessibility grounds and cost.
- `OrbitControls`: about 10 KB, replaced by the 1 to 2 KB custom rig in section 5.
- `EffectComposer` plus `UnrealBloomPass` stack: 15 to 25 KB, not shipped by default per section 2. Even if added for desktop high, it fits (total climbs to about 195 to 240 KB, still under budget), but it is the first thing cut under pressure.

### What to cut first if the chunk goes over 300 KB

In order: (1) any post processing composer and bloom (the halos already fake it), (2) fbm nebula shader and its noise texture, falling back to gradient sprites everywhere, (3) any addon that crept in during development, (4) audited app code for dead paths. Never cut: the core renderer, the `InstancedMesh` stars, `Line2` relationship lines, the custom camera rig, and the HTML label layer. Those five are the product.

---

## Summary of firm positions

1. Two star populations, two techniques: `THREE.Points` for the cheap ambient swarm, `InstancedMesh` of billboarded quads with per instance attributes for the 30 to 100 interactive project stars, to escape the `gl_PointSize` cap and edge culling.
2. Procedural SDF discs and halos in the fragment shader with `fwidth` anti aliasing and additive blending on near black, no star textures, no HDR buffer.
3. No post processing bloom by default: sized additive halos are the bloom for point sources on black, saving roughly eleven texture passes per frame and 15 to 25 KB. Selective layer bloom is a desktop high only maybe.
4. `Line2` relationship lines with a shader driven moving Gaussian brightness bump for the traveling signal, animated only on selected, tour, and compare edges, never the whole graph.
5. A custom 1 to 2 KB constrained rig (no roll by construction, clamped pitch, `exp` damping, `setViewOffset` for off center composition) over `OrbitControls`, with a designed instant reframe reduced motion path.
6. HTML overlay labels over SDF in scene text, because the accessibility requirements mandate an HTML representation anyway and the label count is tiny.
7. A four tier adaptive system with DPR cap as the first and strongest lever, plus an FPS watchdog that steps quality down in a fixed order with hysteresis.
8. Zero per frame allocations, single clock, pause on hidden and idle, and real WebGL context loss recovery that falls through to the Atlas.

---

*Written for the galaxy.nixfred.com design war room, WebGL rendering craft seat.*
