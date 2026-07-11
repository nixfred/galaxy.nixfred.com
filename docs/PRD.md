# NIXFRED GALAXY Product Requirements Document

Status: APPROVED. Interview defaults accepted 2026-07-10 (Fred directive: the requirements pack is the starting point and its accepted defaults mechanic applies). This document is the single canonical product requirements record. It merges the source product requirements and the ID numbered functional requirements draft. Where wording conflicted, the ID numbered draft won.

Product name: NIXFRED GALAXY
Public address: `galaxy.nixfred.com`

Related records: see `docs/DECISIONS.md` for the approved decision log, the full table of interview answers, and the PENDING-FRED items that still require Fred's personal input.

## Product statement

NIXFRED GALAXY is a living visual map of Fred Nix's complete public body of work. Each project is represented as a star with position, magnitude, color, status, history, and relationships. Visitors can understand not only what Fred built, but how the projects connect across infrastructure, security, artificial intelligence, science, client work, family, memory, humor, and experimentation.

The site must feel like a cyber observatory built inside a terminal. It must not feel like a generic galaxy background with cards floating over it. Visitors can explore freely, search directly, follow guided tours, compare projects, use a chronological view, or switch to a complete accessible Atlas.

## Primary product goals

1. Replace passive portfolio browsing with active discovery.
2. Make the scale and diversity of Fred's work immediately visible.
3. Reveal connections between projects that a conventional card grid hides.
4. Demonstrate advanced front end engineering and visual systems thinking.
5. Give recruiters, clients, peers, friends, and curious visitors different useful paths through the same body of work.
6. Create an experience memorable enough that visitors describe it to another person.

## Primary outcomes

1. A visitor understands the scale and range of Fred's work within ten seconds.
2. A technical visitor can discover relationships between AI, infrastructure, security, space, client work, and personal archives.
3. A hiring or business visitor can reach the resume, source, and individual projects without learning unusual controls.
4. Every project remains accessible without WebGL.
5. The project catalog remains maintainable as new sites are added.

## Primary audiences

Ordered by priority for version one:

1. Technical leaders evaluating Fred as an architect.
2. Potential clients evaluating Fred as a builder.
3. Engineers and technologists exploring the projects.
4. Friends and general visitors discovering the personal work.
5. Future Fred using the map as a record of growth.

## Core experience narrative

### Arrival

1. The page opens into a dark field with faint distant particles.
2. A concise title sequence identifies NIXFRED GALAXY. The first system line resolves as `NIXFRED GALAXY // CATALOG ONLINE`, then the primary line `Every project. One connected system.`
3. The central NIXFRED system ignites first.
4. Sector regions appear next.
5. Project stars light in a controlled sequence.
6. Relationship lines emerge only after the star field is understandable, drawing themselves like a navigation computer solving a route.
7. The visitor may skip the sequence immediately. The startup sequence finishes within about 1.5 seconds and never blocks interaction.
8. Repeat visits use a shortened entrance unless the visitor requests the full sequence. The startup reports real states such as catalog loaded, renderer ready, labels ready, and map online, never a fake percentage.

The opening controls are simple: `ENTER THE MAP`, `START A TOUR`, and `OPEN ATLAS`.

### Exploration

1. Visitors can pan, orbit, zoom, and focus the map using mouse, trackpad, touch, and keyboard controls.
2. Hovering or focusing a star reveals a compact identity label.
3. Selecting a star opens a detail panel without destroying map context.
4. The detail panel includes title, sector, summary, status, launch date when available, technologies or themes, related projects, and an action to open the project.
5. The selected star becomes visually dominant while unrelated stars become quieter rather than disappearing.
6. Selecting a related project moves focus along the visible relationship line.
7. The browser back action returns to the prior selected state.

### Search and filters

1. A search control finds projects by title, host, description, sector, theme, technology, and relationship.
2. Search results remain visible in the map rather than replacing it with a list only.
3. Visitors can filter by sector.
4. Visitors can filter by status such as active, evolving, archived, client, experiment, or memorial.
5. Visitors can filter by year or time period.
6. Visitors can reset the map with one clear action.
7. A command palette provides fast access to projects, tours, modes, and settings. It opens with `Command K`, `Control K`, and `/`.

### Timeline mode

1. Timeline mode animates the body of work in chronological order.
2. Stars appear when their projects were first launched or first recorded.
3. Existing stars may brighten when major revisions occurred if revision dates are available.
4. A scrub control allows direct movement through time.
5. The timeline may be paused, resumed, sped up, slowed down, and reset.
6. Missing dates are displayed honestly and do not receive invented chronology. Unknown dates may group into a `DATE NOT RECORDED` bucket rather than being guessed.
7. Timeline mode changes visibility, not geography. Projects remain in their stable locations while the time control reveals when they entered the system.

### Relationship mode

1. Relationship lines must represent explicit semantics.
2. Relation types are visually distinguishable without depending on color alone.
3. A legend explains every visible relation style.
4. Automatic similarity may assist authoring but must not silently publish unsupported relationships.
5. The overview shows only sector skeletons and a few major cross sector paths. Hover shows the nearest useful context. Selection shows direct relationships. Compare mode shows one explained path between two projects. Guided tours show only the current route.
6. Manual relationships are brighter and carry a visible reason. Automatic similarity edges are faint and secondary.

### Guided tours

1. The site supports curated tours through selected projects.
2. Each tour contains a title, purpose, ordered project list, narration text, camera targets, and optional timing.
3. A tour step performs three coordinated actions: move the camera, illuminate the active route, and reveal short narration. Narration remains concise because the map is the evidence.
4. Visitors can leave a tour at any moment and continue free exploration.
5. Tour progress is visible and keyboard accessible.
6. Launch tours are Start Here, AI and Infrastructure, and Space and Physics (see Decisions Q39 and FR044). Additional tours such as Security Stories, Client Work, and Personal Memory are future work.

### Compare mode

The visitor selects two nodes. The map darkens unrelated work, the shortest meaningful path illuminates, and a compact explanation states why each step connects. The path must be based on typed relationships. It must never invent a poetic connection merely because two nodes are nearby.

### Random discovery

1. A random discovery action, labeled `SURPRISE ME`, selects a project the visitor has not opened during the current session when possible.
2. The camera travels to the project using reduced motion rules when applicable.
3. The feature should feel like exploration, not a slot machine.

### Deep links

1. Every project has a stable URL state.
2. Every sector has a stable URL state.
3. Every tour has a stable URL state.
4. Timeline position may be represented in the URL when sharing is enabled.
5. Loading a deep link must focus the correct state after the scene becomes ready.

### Main site integration

1. The final launch includes a new project entry on nixfred.com, added only after the production custom domain passes verification.
2. The preferred integration is a visually prominent card or featured treatment rather than burying the project in the ordinary grid.
3. A keyboard shortcut on nixfred.com may open Galaxy if Fred approves (see PENDING-FRED in the decision log).
4. The new entry must use the same canonical project metadata source chosen for Galaxy.

## Content model

Each project record shall support these fields:

1. Stable identifier.
2. Public title.
3. Short label for the map.
4. Canonical URL.
5. Display host or path.
6. Sector.
7. Short description.
8. Long description when approved.
9. Status.
10. Launch date when known.
11. Major revision dates when known.
12. Tags.
13. Technologies or themes.
14. Visual magnitude.
15. Visual color role.
16. Optional manual position or anchor.
17. Optional thumbnail.
18. Optional social image.
19. Optional repository URL.
20. Accessibility label.
21. Relation list.
22. Featured state.
23. Visibility state.
24. Data provenance note.

## Functional requirements

### Application shell

FR001. The root page shall render a usable HTML shell before the visualization bundle loads.

FR002. The shell shall contain the site name, primary statement, Enter the Map action, Atlas action, search action, return link to nixfred.com, resume link, and a loading status.

FR003. The shell shall remain usable if the visualization bundle fails.

FR004. The site shall include a visible build revision in the footer or system panel.

### Galaxy map

FR005. The main experience shall use a constrained 2.5D map rendered with Three.js.

FR006. The map shall use deterministic positions. The same catalog revision shall produce the same layout on every load and in every test run.

FR007. Sector anchors shall establish stable regions for IT, Labs, Work, Signal, Clients, and Personal.

FR008. Major project positions may be manually authored. Unspecified nodes shall use seeded placement around their sector anchor.

FR009. Node size shall encode editorial importance or featured weight.

FR010. Node brightness shall encode current status. Archived nodes shall remain discoverable but visually quiet.

FR011. The map shall render subtle depth, parallax, star drift, and sector atmosphere without obstructing labels or controls.

FR012. The renderer shall adapt pixel ratio, particle count, glow, and line density to device capability.

FR013. The renderer shall pause when the page is hidden and reduce work when the map is idle.

FR014. The renderer shall stop continuous decorative motion when reduced motion is requested.

### Project selection

FR015. Pointer, keyboard, touch, search, tour, and deep link actions shall all be able to select a project.

FR016. Selecting a project shall focus the camera without disorienting rotation.

FR017. Selecting a project shall illuminate its direct relationships and the relevant sector path.

FR018. Selecting a project shall open a detail panel or mobile detail sheet.

FR019. The detail view shall display title, sector, status, concise description, tags, relationship summary, confirmed repository link when public, source site link, and Open Project action.

FR020. The selected state shall update the browser history with a stable URL.

FR021. Closing the detail view shall restore the previous map context and focus.

FR022. Opening the external project shall use a new tab and safe link attributes.

### Search and command palette

FR023. `Command K`, `Control K`, and `/` shall open the command palette when focus is not inside an editable control.

FR024. Search shall match project title, description, path, sector, tags, technologies, and relationship labels.

FR025. Search results shall support keyboard navigation and clear screen reader announcements.

FR026. Selecting a result shall focus the map, open the project panel, and update the deep link.

FR027. The palette shall also expose commands for Map, Atlas, Tours, Timeline, Help, Reduced Motion preview, and Return Home.

### Sector filters

FR028. Visitors shall be able to isolate one or more sectors.

FR029. Filter state shall not destroy the selected node or camera state unless the selected node is explicitly hidden.

FR030. The interface shall display visible project counts for active filters.

FR031. Filters shall remain operable in Map and Atlas modes.

### Relationships

FR032. Every relationship shall reference two valid project slugs.

FR033. Every relationship shall include a type, strength, and human readable reason.

FR034. Direct relationships shall be shown when a node is selected.

FR035. Compare mode shall calculate and display the shortest meaningful path between two selected nodes.

FR036. Compare mode shall explain each edge in plain language.

FR037. Automatic similarity edges shall be visually weaker than manually curated relationships.

FR038. The interface shall never render the complete relationship graph at full intensity by default.

### Guided tours

FR039. Version one shall include at least three guided tours.

FR040. Each tour shall have a title, short promise, ordered project list, camera targets, narration copy, and completion action.

FR041. Users shall be able to pause, skip, move backward, exit, and resume a tour.

FR042. Tours shall not trap keyboard focus.

FR043. Tour state shall produce a shareable URL.

FR044. The initial tours shall be Start Here, AI and Infrastructure, and Space and Physics unless Fred changes them.

### Timeline

FR045. Timeline mode shall remain disabled until trustworthy dates exist for every included project or an explicit unknown state is designed.

FR046. When enabled, timeline mode shall reveal projects according to launch date without moving their stable spatial positions.

FR047. Timeline controls shall support keyboard operation and textual date announcements.

FR048. Unknown dates shall never be guessed.

### Atlas mode

FR049. Atlas mode shall be a complete HTML representation of the catalog.

FR050. Atlas mode shall provide search, sector filters, tags, status, project links, relationship links, and guided tour access.

FR051. Atlas mode shall be directly reachable at `/atlas/` and from a persistent interface control.

FR052. Atlas mode shall become the automatic fallback when WebGL cannot initialize.

FR053. The canvas shall never be the only source of project names or descriptions in the accessibility tree.

### Crawlable project pages

FR054. Every public project shall have a generated page at `/project/<slug>/`.

FR055. Each page shall contain canonical metadata, title, description, sector, tags, relationships, external project link, return to map link, and Open Graph metadata.

FR056. A direct project page shall offer an action that opens the map focused on that project.

### Session features

FR057. Visitors may pin projects during the current session.

FR058. Pinned state shall not require an account and shall not leave the browser unless Fred explicitly approves local persistence.

FR059. `SURPRISE ME` shall choose an eligible visible project using a seeded session sequence that avoids immediate repeats.

FR060. Share shall copy a stable link for the active project, comparison, tour step, or filter state.

### Error handling

FR061. The application shall provide a clear fallback when WebGL, data loading, or a noncritical visual asset fails.

FR062. A single failed thumbnail shall not break the catalog.

FR063. Invalid graph data shall fail the build rather than fail at runtime.

FR064. Runtime errors shall be captured to the browser console with actionable context and no private data.

FR065. A custom 404 page shall provide search, Atlas access, and return to nixfred.com.

## Data requirements

DR001. The upstream catalog shall be imported from `nixfred/nixfred.github.io/portfolio.json`.

DR002. The imported catalog shall be stored as a committed snapshot for deterministic builds.

DR003. A local enrichment file shall add stable slug, status, launch date, weight, technologies, repository URL, image, manual coordinates, tour membership, and optional long description.

DR004. A relationship file shall store source slug, target slug, type, strength, reason, and provenance.

DR005. A sector file shall store label, short label, color token, anchor position, order, and description.

DR006. A tour file shall store tour metadata, ordered nodes, narration, and camera targets.

DR007. All data shall validate against strict TypeScript and runtime schemas.

DR008. Duplicate slugs, unknown sectors, unknown relationship endpoints, invalid URLs, unsupported status values, missing titles, or missing descriptions shall fail CI.

DR009. Data synchronization shall produce a human readable change report.

DR010. No production build shall fetch the catalog from the network at runtime.

DR011. Total coverage. Every property reachable from the public internet at `*.nixfred.com`, `nixfred.com/*`, `*.nixfred.tech`, or `nixfred.tech/*` shall appear on the map, regardless of size. A domain census (Cloudflare zone DNS enumeration for both zones plus reachability probing, diffed against the galaxy catalog) shall run before launch and on the maintenance schedule. A live property missing from the map is a blocking launch gap, resolved by adding the entry upstream to `portfolio.json` (which remains the canonical identity source per DR001) or to the enrichment layer, never by a silent exception. Decision F3 in `docs/DECISIONS.md`, recorded 2026-07-11.

## Visual requirements

VR001. The visual system shall use near black surfaces, fine grid and terminal details, restrained sector color, sharp typography, and luminous relationships.

VR002. The visual design shall share DNA with nixfred.com without copying its page layout.

VR003. The map shall feel spatial and alive before interaction, but movement shall never block reading or clicking.

VR004. Major labels shall be legible at the overview scale.

VR005. Selected states shall be obvious without relying only on color.

VR006. The site shall avoid excessive bloom, lens flare, constant glitching, fake scanline noise over text, and low contrast gray copy.

VR007. All decorative animation shall have a reduced motion equivalent.

VR008. The loading state shall be part of the art direction and shall report real progress states rather than a fake percentage.

VR009. The visual system shall support desktop, tablet, and mobile without simply shrinking the desktop canvas.

VR010. The Open Graph image shall communicate the central map, the name, and the primary line clearly at social preview size.

## Accessibility requirements

AR001. Target WCAG 2.2 AA behavior for all essential content and controls.

AR002. Provide a skip link, visible focus, semantic headings, labeled controls, and correct dialog or panel semantics.

AR003. Every action shall be possible with keyboard only.

AR004. Focus shall move into the project panel when opened and return to the initiating control when closed.

AR005. Do not autoplay sound.

AR006. Provide an always visible pause motion control whenever continuous motion is active.

AR007. Respect `prefers-reduced-motion`, `prefers-contrast`, and `save-data` where practical.

AR008. Use an HTML list representation for screen readers rather than attempting to narrate raw canvas geometry.

AR009. Touch targets shall be large enough for practical phone use.

AR010. Automated axe tests shall report zero serious or critical violations on required routes and states.

## Performance requirements

PR001. The HTML shell and critical CSS shall load before the Three.js bundle.

PR002. The visualization bundle shall be lazy loaded.

PR003. The application shall avoid loading project screenshots until a relevant panel is opened.

PR004. Initial shell JavaScript shall target less than 150 KB compressed.

PR005. The lazy visualization chunk shall target less than 300 KB compressed.

PR006. Initial route transfer shall target less than 1.5 MB on desktop and less than 1 MB on mobile.

PR007. Largest Contentful Paint shall target less than 2.5 seconds in the CI mobile profile.

PR008. Cumulative Layout Shift shall target less than 0.1.

PR009. Interaction to Next Paint shall target less than 200 milliseconds for ordinary controls.

PR010. Desktop animation shall target 60 frames per second. Mobile shall maintain a stable 30 frames per second or switch to lower quality.

PR011. The renderer shall cap device pixel ratio and reduce effects on low capability devices.

PR012. CI shall report asset sizes, bundle sizes, and Lighthouse results in the job summary.

## Security and privacy requirements

SR001. No secrets shall be available to client code.

SR002. No private catalog data shall be committed.

SR003. All external links shall use HTTPS.

SR004. Apply a restrictive Content Security Policy compatible with local assets and Cloudflare Web Analytics.

SR005. Apply `X-Content-Type-Options`, `Referrer-Policy`, and a restrictive `Permissions-Policy` through `public/_headers`.

SR006. Do not include third party ad, session replay, fingerprinting, chat, or marketing scripts.

SR007. Do not use raw untrusted HTML from data files.

SR008. Dependency vulnerability scanning shall block known critical and high severity issues unless a documented exception exists.

SR009. Third party GitHub Actions shall be pinned to immutable commit SHAs.

SR010. The public repository shall include `SECURITY.md` with a responsible reporting path.

## Analytics requirements

AN001. Cloudflare Web Analytics is the only default analytics system.

AN002. No cookie banner is required because no optional cookies shall be set.

AN003. Do not collect project pinning, search history, or camera behavior as personally identifiable session data.

AN004. Analytics shall never block the application.

## Main site integration requirements

IN001. Do not add the homepage card until the production custom domain passes verification.

IN002. Add a new object to `nixfred/nixfred.github.io/portfolio.json` using the existing schema.

IN003. Recommended card title: `NIXFRED GALAXY`.

IN004. Recommended tag: `Map`.

IN005. Recommended section: `Labs`.

IN006. Recommended description: `Every project. One connected system. Fly through the body of work as a living star map and follow the lines between AI, infrastructure, security, space, clients, and memory.`

IN007. Verify that the homepage card, command palette, and terminal navigation all receive the entry from the canonical catalog.

## Error and fallback behavior

1. If WebGL is unavailable, show an accessible two dimensional galaxy view or structured project atlas.
2. If the canonical project data fails validation, the production build must stop.
3. If a thumbnail fails, use a generated sector glyph and gradient rather than a broken image.
4. If an external project link is unavailable, retain the project record with a clear unavailable state.
5. The application must have a styled not found page.
6. Runtime errors must produce a recoverable interface with reload and return home actions.

## Non-goals for version one

1. No user accounts.
2. No user submitted projects.
3. No payments.
4. No public comments.
5. No public editing.
6. No general purpose content management system.
7. No private Larry memory or private conversation data.
8. No live access to home lab infrastructure.
9. No real time personal telemetry.
10. No dependence on a database or server runtime.
11. No unrestricted flight simulator controls.
12. No audio autoplay.
13. No stock space photography as the primary visual identity.

## Acceptance

Acceptance is governed by the acceptance matrix (AC001 through AC058) recorded in the requirements pack and carried forward into `docs/TEST_PLAN.md` and `docs/RELEASE_CHECKLIST.md`. A requirement passes only with captured evidence. Build success alone is not evidence for browser behavior.
