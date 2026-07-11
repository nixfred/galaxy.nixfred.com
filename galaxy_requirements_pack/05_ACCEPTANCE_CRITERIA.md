# ACCEPTANCE CRITERIA

## Product acceptance

1. The site clearly identifies itself as NIXFRED GALAXY.
2. The complete approved project catalog is represented.
3. Every visible star maps to exactly one valid project record.
4. Every project is reachable through search and the accessible text atlas.
5. Every relation connects two valid project identifiers.
6. Every relation has an approved relation type.
7. Selecting a project reveals the required detail content.
8. Opening a project uses the approved same tab or new tab behavior.
9. Sector filtering works in both spatial and text views.
10. Search works by title, host, description, sector, tag, and technology where present.
11. Timeline mode never invents missing dates.
12. Guided tours can be entered, advanced, reversed, and exited.
13. Deep links restore project, sector, and tour states.
14. Browser back and forward behavior is coherent.
15. The entrance sequence is skippable.
16. Repeat visit behavior follows the approved preference.
17. The application includes a clear route back to nixfred.com.
18. The site contains no private Larry data or private infrastructure data.

## Visual acceptance

1. The experience is recognizably part of the NIXFRED family.
2. It does not resemble a generic portfolio template.
3. Project labels remain readable at intended focus levels.
4. Sector identity is visible without relying only on color.
5. The selected project is visually obvious.
6. Relation lines do not overwhelm the star field.
7. Personal and memorial content is treated with appropriate visual restraint.
8. The design works at approved desktop, tablet, and mobile sizes.
9. No text clips, overlaps, or exits the viewport at tested sizes.
10. The accessible text atlas is visually deliberate, not an abandoned fallback.

## Interaction acceptance

1. Mouse controls work.
2. Trackpad controls work.
3. Touch controls work.
4. Keyboard navigation works.
5. Visible focus treatment exists for interactive controls.
6. Reduced motion changes camera and entrance behavior.
7. Motion verification includes an ordered frame sequence rather than one still image.
8. The scene recovers from a lost graphics context or presents the fallback.
9. No interaction traps the visitor.
10. Escape closes temporary panels and exits transient modes where expected.

## Accessibility acceptance

1. Core controls meet WCAG 2.2 AA intent.
2. The application supports keyboard only use.
3. The text atlas exposes all project content without WebGL.
4. Project labels and controls have meaningful accessible names.
5. Color contrast meets the approved threshold.
6. Essential meaning does not depend only on color, sound, depth, or motion.
7. Reduced motion is honored from system preference and site settings.
8. Audio, if present, is off by default and fully controllable.
9. Automated accessibility testing has no serious or critical violations on the required routes.
10. Manual screen reader checks cover navigation, search, project detail, and text atlas.

## Performance acceptance

Final numeric budgets require Fred's approval. Recommended starting budgets:

1. Usable interface appears before the full scene completes loading.
2. The renderer is loaded only when needed.
3. Initial compressed JavaScript stays within the approved budget.
4. Large textures and thumbnails are lazy loaded.
5. Desktop interaction targets a stable 60 frames per second on an approved reference device.
6. Mobile interaction targets a stable 30 frames per second on an approved reference device.
7. Device profiling reduces particles, effects, and pixel ratio when required.
8. No unbounded object creation occurs during animation.
9. Browser memory remains stable during a ten minute exploration session.
10. CI blocks releases that exceed approved bundle budgets.

## Security acceptance

1. No credentials exist in source or built assets.
2. Workflow permissions follow least privilege.
3. Production secrets are unavailable to untrusted pull request code.
4. Security headers are present on the custom domain.
5. External links use safe opener behavior when they open a new tab.
6. Data rendered into the interface is escaped or safely handled.
7. Dependencies have no unresolved approved severity findings at release.
8. Source maps follow the approved public or private policy.

## CI/CD acceptance

1. A pull request triggers CI.
2. CI blocks a deliberately broken type check.
3. CI blocks invalid project data.
4. CI blocks a broken unit test.
5. CI blocks a failed production build.
6. An eligible pull request receives a preview deployment.
7. The pull request receives or exposes the preview URL.
8. Preview verification runs against the deployed URL.
9. Main deployment cannot run before blocking checks pass.
10. Production deployment uses the approved GitHub environment.
11. Production verification confirms the expected commit metadata.
12. The custom domain serves the production deployment with a valid certificate.
13. The rollback procedure is documented and tested with a safe release rehearsal.
14. Release evidence is recorded.

## Launch acceptance

1. The final project entry is added to nixfred.com.
2. The main site link resolves correctly.
3. Social metadata produces the approved title, description, and image.
4. The sitemap and robots behavior are correct.
5. The production page has no severe console errors.
6. All essential internal links pass.
7. All approved external links are checked and their current status recorded.
