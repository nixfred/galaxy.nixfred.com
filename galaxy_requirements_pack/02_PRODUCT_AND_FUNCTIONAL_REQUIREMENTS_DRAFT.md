# NIXFRED GALAXY Product and Functional Requirements

Status: Draft pending Fred's interview decisions

## Product statement

NIXFRED GALAXY is an interactive map of Fred Nix's public body of work. Every project is represented as a star. Sectors organize the work. Relationships form visible paths. Visitors can explore freely, search directly, follow guided tours, compare projects, use a chronological view, or switch to a complete accessible Atlas.

The site must feel like a cyber observatory built inside a terminal. It must not feel like a generic galaxy background with cards floating over it.

## Primary outcomes

1. A visitor understands the scale and range of Fred's work within ten seconds.
2. A technical visitor can discover relationships between AI, infrastructure, security, space, client work, and personal archives.
3. A hiring or business visitor can reach the resume, source, and individual projects without learning unusual controls.
4. Every project remains accessible without WebGL.
5. The project catalog remains maintainable as new sites are added.

## Non goals for version one

1. No user accounts.
2. No comments, social feed, voting, or public editing.
3. No private project data.
4. No real time personal telemetry.
5. No dependence on a database or server runtime.
6. No unrestricted flight simulator controls.
7. No audio autoplay.
8. No stock space photography as the primary visual identity.

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

## Main site integration

IN001. Do not add the homepage card until the production custom domain passes verification.

IN002. Add a new object to `nixfred/nixfred.github.io/portfolio.json` using the existing schema.

IN003. Recommended card title: `NIXFRED GALAXY`.

IN004. Recommended tag: `Map`.

IN005. Recommended section: `Labs`.

IN006. Recommended description: `Every project. One connected system. Fly through the body of work as a living star map and follow the lines between AI, infrastructure, security, space, clients, and memory.`

IN007. Verify that the homepage card, command palette, and terminal navigation all receive the entry from the canonical catalog.
