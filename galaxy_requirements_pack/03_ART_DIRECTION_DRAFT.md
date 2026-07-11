# NIXFRED GALAXY Art Direction

Status: Draft pending Fred's interview decisions

## Creative thesis

This is not a portfolio grid placed over a galaxy background. It is Fred's work translated into an explorable cosmology.

The site should combine four visual ideas:

1. A scientific star atlas
2. A mission control interface
3. A private terminal
4. A personal memory map

The result should feel precise enough for an infrastructure architect, strange enough to belong only to NIXFRED, and calm enough that the work remains readable.

## Opening scene

The first frame is nearly black. A small system line resolves first:

`NIXFRED GALAXY // CATALOG ONLINE`

The title appears with restrained luminous type:

`Every project. One connected system.`

Behind it, the map is already alive. Distant sector clouds drift slowly. A few major nodes pulse. Thin lines briefly trace the structure, then recede. The visitor sees that a system exists before choosing to enter it.

The opening controls are simple:

1. `ENTER THE MAP`
2. `START A TOUR`
3. `OPEN ATLAS`

The startup sequence must never make the visitor wait for a fake percentage. It may report real states such as catalog loaded, renderer ready, labels ready, and map online.

## Spatial model

The recommended map is constrained 2.5D.

1. The scene has real depth and parallax.
2. The user can pan, zoom, and orbit within safe limits.
3. The camera cannot roll.
4. Pitch is limited so labels remain readable.
5. Project clusters occupy stable sector regions.
6. The center contains the NIXFRED system node.
7. The map always has a reliable route back to overview.

This avoids two failures. A flat diagram would undersell the concept. A fully free 3D space would become a navigation tax.

## Sector composition

Each sector is a region, not a box.

### IT

Character: sharp, alert, exposed, technical

Visual language: coral red points, angular routes, tighter spacing, occasional warning glyphs

### Labs

Character: curious, experimental, alive

Visual language: green points, broader orbits, generative geometry, more spatial play

### Work

Character: credible, architectural, operational

Visual language: cyan points, cleaner paths, grid alignment, stronger labels

### Signal

Character: active intelligence, memory, synthesis

Visual language: amber points, moving packets, branching relationships, subtle pulse rhythms

### Clients

Character: distinct people and real outcomes

Visual language: violet points, restrained framing, clear separation between Fred's work and the client's identity

### Personal

Character: memory, family, reflection, care

Visual language: soft silver, slower motion, more space, less interface noise

## Star design

Each project star consists of several possible layers:

1. Core point
2. Soft halo
3. Status ring
4. Selection ring
5. Invisible generous hit target
6. Optional label anchor

Star size represents editorial importance. Brightness represents current status. It never represents human worth, traffic, money, or popularity.

Featured projects may have a larger core, a persistent label, and a visible orbital marker. Archived projects remain visible but dim. A dangerous or cinematic project may receive a sharper pulse, not constant red flashing.

## Relationship design

The graph must not become spaghetti.

1. The overview shows only sector skeletons and a few major cross sector paths.
2. Hover shows the nearest useful context.
3. Selection shows direct relationships.
4. Compare mode shows one explained path between two projects.
5. Guided tours show only the current route.
6. Automatic similarity edges are faint and secondary.
7. Manual relationships are brighter and carry a visible reason.

A relationship line may contain a slow moving signal. The signal should feel like information moving through a system, not a racing game.

## Label hierarchy

1. Site title
2. Selected project title
3. Major project labels
4. Sector names
5. Minor project labels on focus
6. Technical metadata

Project names always win over decoration. Labels should use collision avoidance and fade according to camera scale. They should not spin in 3D space or become unreadable billboards.

## Detail panel

Desktop uses a right side panel that feels like an instrument readout.

Recommended order:

1. Sector and status
2. Project title
3. One sentence explanation
4. Relationship summary
5. Tags and technologies
6. Open Project
7. View Source when confirmed
8. Compare
9. Pin
10. Share

The panel should not cover the selected star. The camera composes the selected node into the remaining visible map area.

Mobile uses a bottom sheet with a clear grab handle, stable focus behavior, and large actions.

## Guided tours

Tours should feel like a curator turning on one path through the sky.

A tour step performs three coordinated actions:

1. Move the camera
2. Illuminate the active route
3. Reveal short narration

Narration must remain concise. The map is the evidence. The words provide the reason for the route.

Recommended launch tours:

1. `START HERE`
2. `AI AND INFRASTRUCTURE`
3. `SPACE AND PHYSICS`

Potential future tours:

1. `THE WEIRD STUFF`
2. `BUILT FOR PEOPLE`
3. `LARRY'S LINEAGE`
4. `FROM SECURITY TO TRUST`

## Compare mode

Compare mode is one of the signature features.

The visitor selects two nodes. The map darkens unrelated work. The shortest meaningful path illuminates. A compact explanation states why each step connects.

Example:

`Meet Larry` connects to `Build Your Own Larry` because the guide documents the system behind the companion. That guide connects to `AI Infrastructure Portfolio` because the implementation patterns are part of the larger architecture practice.

The path must be based on typed relationships. It must never invent a poetic connection merely because two nodes are nearby.

## Timeline mode

Timeline mode changes visibility, not geography.

Projects remain in their stable locations while the time control reveals when they entered the system. This lets the visitor watch the galaxy grow without relearning the map.

Unknown dates stay unknown. Timeline mode may group them into `DATE NOT RECORDED` rather than guessing.

## Motion language

Motion should communicate state.

1. Slow drift communicates that the system is alive.
2. Camera movement communicates focus.
3. Signal movement communicates relationship.
4. Build in sequences communicate loading.
5. Pulses communicate status or attention.
6. Fades communicate filtering.

Avoid motion that exists only because WebGL can do it.

No constant camera wandering while the user reads. No screen shake. No surprise zoom. No uncontrolled particle storm. No animation may block a button.

## Reduced motion

Reduced motion is a designed mode, not a broken version.

1. Remove automatic drift.
2. Replace camera travel with a short crossfade or instant reframing.
3. Replace moving signals with static highlighted paths.
4. Remove pulses and parallax.
5. Keep focus, search, filters, panels, tours, compare, and Atlas fully functional.

## Sound

Default recommendation: optional, off by default.

If approved, sound is a quiet observatory bed with small interface confirmations. It must have a visible mute state and remember the preference only on the local device. It must never begin before user action.

## Easter eggs

Easter eggs should reward attention without becoming the main interface.

Recommended ideas:

1. Sky Walrus crosses the far edge of the map after extended exploration.
2. A typed `whoami` command opens the identity panel.
3. A typed `larry` command focuses the Larry lineage.
4. A typed `home` command returns to NIXFRED.
5. The existing Konami tradition may unlock a temporary alternate sector rendering.

Every Easter egg must be harmless, reversible, and ignored by accessibility tooling.

## Typography

Recommended hierarchy:

1. A strong geometric display face for names and major statements
2. A monospaced face for coordinates, status, commands, paths, dates, and system metadata
3. A highly readable sans serif for descriptions and controls

Use system or locally bundled assets. Do not create a render blocking dependency on a third party font CDN.

## Effects budget

Allowed:

1. Restrained bloom
2. Fine atmospheric gradients
3. Sparse particles
4. Soft depth fog
5. Thin luminous paths
6. Small terminal details
7. One brief startup decode

Avoid:

1. Heavy scanlines over body text
2. Constant glitching
3. Huge lens flares
4. Multiple competing animated backgrounds
5. Tiny low contrast copy
6. Excessive blur
7. Full screen Matrix rain as the default experience
8. Large video backgrounds

## Mobile art direction

Mobile is a separate composition.

1. Use a flatter radial map with limited depth.
2. Keep sector controls within thumb reach.
3. Use a bottom sheet for details.
4. Reduce star count on screen through clustering and progressive reveal.
5. Keep search and Atlas one tap away.
6. Disable expensive effects before frame rate becomes unstable.
7. Never require precision dragging to open a project.

## Open Graph art

The social image should show:

1. NIXFRED GALAXY
2. `Every project. One connected system.`
3. A central node with six sector regions
4. A few recognizable project names
5. The production domain

It should remain readable when reduced to a small preview.

## Anti imitation rule

Do not imitate a known game map, streaming service space screen, Apple product animation, or stock cyber dashboard. Borrow only general interaction principles. The final composition must look like it came from Fred's existing universe.
