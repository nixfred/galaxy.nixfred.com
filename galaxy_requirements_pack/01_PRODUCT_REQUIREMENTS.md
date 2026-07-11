# PRODUCT REQUIREMENTS

## Product name

NIXFRED GALAXY

## Public address

`galaxy.nixfred.com`

## Product statement

NIXFRED GALAXY is a living visual map of Fred Nix's complete body of work. Each project is represented as a star with position, magnitude, color, status, history, and relationships. Visitors can understand not only what Fred built, but how the projects connect across infrastructure, security, artificial intelligence, science, client work, family, memory, humor, and experimentation.

## Primary product goals

1. Replace passive portfolio browsing with active discovery.
2. Make the scale and diversity of Fred's work immediately visible.
3. Reveal connections between projects that a conventional card grid hides.
4. Demonstrate advanced front end engineering and visual systems thinking.
5. Give recruiters, clients, peers, friends, and curious visitors different useful paths through the same body of work.
6. Create an experience memorable enough that visitors describe it to another person.

## Primary audiences

1. Technical leaders evaluating Fred as an architect.
2. Potential clients evaluating Fred as a builder.
3. Engineers and technologists exploring the projects.
4. Friends and general visitors discovering the personal work.
5. Future Fred using the map as a record of growth.

## Core experience

### Arrival

1. The page opens into a dark field with faint distant particles.
2. A concise title sequence identifies NIXFRED GALAXY.
3. The central system ignites first.
4. Sector regions appear next.
5. Project stars light in a controlled sequence.
6. Relationship lines emerge only after the star field is understandable.
7. The visitor may skip the sequence immediately.
8. Repeat visits use a shortened entrance unless the visitor requests the full sequence.

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
7. A command palette provides fast access to projects, tours, modes, and settings.

### Timeline mode

1. Timeline mode animates the body of work in chronological order.
2. Stars appear when their projects were first launched or first recorded.
3. Existing stars may brighten when major revisions occurred if revision dates are available.
4. A scrub control allows direct movement through time.
5. The timeline may be paused, resumed, sped up, slowed down, and reset.
6. Missing dates are displayed honestly and do not receive invented chronology.

### Relationship mode

1. Relationship lines must represent explicit semantics.
2. Supported relation types may include inspired, evolved into, shares technology, shares subject, supports, client work, personal connection, and part of the same series.
3. Relation types are visually distinguishable without depending on color alone.
4. A legend explains every visible relation style.
5. Automatic similarity may assist authoring but must not silently publish unsupported relationships.

### Guided tours

1. The site supports curated tours through selected projects.
2. Each tour contains a title, purpose, ordered project list, narration text, camera targets, and optional timing.
3. Proposed tours include AI Systems, Security Stories, Space and Physics, Client Work, Personal Memory, and Start Here.
4. Visitors can leave a tour at any moment and continue free exploration.
5. Tour progress is visible and keyboard accessible.

### Random discovery

1. A random discovery action selects a project the visitor has not opened during the current session when possible.
2. The camera travels to the project using reduced motion rules when applicable.
3. The feature should feel like exploration, not a slot machine.

### Deep links

1. Every project has a stable URL state.
2. Every sector has a stable URL state.
3. Every tour has a stable URL state.
4. Timeline position may be represented in the URL when sharing is enabled.
5. Loading a deep link must focus the correct state after the scene becomes ready.

### Main site integration

1. The final launch includes a new project entry on nixfred.com.
2. The preferred integration is a visually prominent card or featured treatment rather than burying the project in the ordinary grid.
3. A keyboard shortcut on nixfred.com may open Galaxy if Fred approves.
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

## Error and fallback behavior

1. If WebGL is unavailable, show an accessible two dimensional galaxy view or structured project atlas.
2. If the canonical project data fails validation, the production build must stop.
3. If a thumbnail fails, use a generated sector glyph and gradient rather than a broken image.
4. If an external project link is unavailable, retain the project record with a clear unavailable state.
5. The application must have a styled not found page.
6. Runtime errors must produce a recoverable interface with reload and return home actions.

## Explicitly outside the first release

1. User accounts.
2. User submitted projects.
3. Payments.
4. Public comments.
5. Public editing.
6. A general purpose content management system.
7. Private Larry memory or private conversation data.
8. Live access to home lab infrastructure.
