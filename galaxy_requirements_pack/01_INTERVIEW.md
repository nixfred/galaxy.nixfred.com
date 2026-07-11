# Fred Interview for NIXFRED GALAXY

## How to answer

Each question includes a recommended default. Reply with only the numbers you want to change. Any number not mentioned becomes an accepted decision.

Example response:

`4: Use "Follow the lines between everything I build." 19: Moderate motion. 52: Link to resume and LinkedIn.`

## Product identity

1. What is the primary purpose?

Recommended: Create wonder first, prove technical range second, and drive professional contact third.

2. Who is the first audience?

Recommended: Technical leaders, hiring managers, architects, builders, curious peers, and general visitors, in that order.

3. What should a visitor understand within ten seconds?

Recommended: Fred has built a large, connected body of technical, creative, professional, and personal work.

4. Which main line should lead the page?

Recommended: `Every project. One connected system.`

5. Which supporting line should follow it?

Recommended: `Move through the work as a living map. Follow the lines between AI, infrastructure, security, space, clients, and memory.`

6. What is the main opening action?

Recommended: `ENTER THE MAP`

7. Should the site show every public project or only a curated selection?

Recommended: Show every public project. Let tours and filters create the curated views.

8. Should archived or retired work appear?

Recommended: Yes. Show it as a dim archived star with an explicit status.

9. Should unreleased or private work appear?

Recommended: No, unless Fred explicitly creates a public teaser record with no private details.

10. Should NIXFRED GALAXY itself appear as a central node?

Recommended: Yes. It is the navigation hub, not a normal project star.

11. How much personal biography should appear?

Recommended: One short identity line, a link to nixfred.com, and a resume link. The projects carry the story.

12. What should the final professional call to action be?

Recommended: `See the resume` and `Explore the source`.

## Art direction

13. Should the map be 2D, 2.5D, or fully free 3D?

Recommended: Constrained 2.5D. It has depth, parallax, and camera movement without disorientation or hidden labels.

14. Should the visual language be realistic astronomy or cyber cartography?

Recommended: Cyber cartography. It should feel like an observatory built inside a terminal, not a stock galaxy wallpaper.

15. Should the site inherit the current nixfred.com sector colors?

Recommended: Yes. IT coral, Labs green, Work cyan, Signal amber, Clients violet, Personal soft silver, with careful contrast adjustments.

16. Should the background contain nebulae or remain almost empty?

Recommended: Very subtle sector clouds that disappear behind selected content. No loud space wallpaper.

17. What determines star size?

Recommended: Editorial importance and featured status, not traffic or popularity.

18. What determines star brightness?

Recommended: Live status and current relevance. Archived work remains visible but dim.

19. How intense should continuous motion be?

Recommended: Calm and cinematic. Slow drift, gentle depth, restrained pulses, and no visual carnival.

20. Should there be a startup sequence?

Recommended: Yes, but it must finish within about 1.5 seconds and never block interaction.

21. Should labels always be visible?

Recommended: Major stars always show labels. Minor stars reveal labels on focus, hover, keyboard selection, or proximity.

22. Should relationship lines always be visible?

Recommended: No. Show the active node's relationships, sector skeletons, and selected tour path. Avoid permanent spaghetti.

23. Should relationship lines animate?

Recommended: Yes, with a slow signal travel effect that stops in reduced motion mode.

24. Should Japanese text accents continue from nixfred.com?

Recommended: Yes, but only in small labels and interface metadata. Do not compete with the project names.

25. Should Fred's astronaut image appear?

Recommended: No on the main map. It may appear in the About panel or final tour stop.

26. Should the site use audio?

Recommended: Optional ambient audio with a visible control, off by default, never autoplaying.

27. Should Sky Walrus appear as an Easter egg?

Recommended: Yes. A tiny moving satellite can cross the outer map after a period of exploration.

28. Should the map include galaxy drawings or icons?

Recommended: Use abstract sector glyphs and line geometry. Do not turn the map into a collection of logo stickers.

## Interaction

29. What should the initial camera show?

Recommended: The full system with the central NIXFRED node visible and one quiet prompt to begin a guided tour.

30. What controls should desktop users have?

Recommended: Pan, zoom, constrained orbit, click to focus, wheel to zoom, Escape to return, and keyboard access to every command.

31. Should free rotation be unlimited?

Recommended: No. Limit pitch and prevent roll so the interface remains legible.

32. What happens when a project star is selected?

Recommended: The camera focuses, related lines illuminate, and a right side detail panel opens without leaving the map.

33. What happens when the visitor chooses `Open project`?

Recommended: Open the project in a new tab and preserve the current galaxy state.

34. Should selected projects have shareable URLs?

Recommended: Yes. Every project selection must update a stable deep link.

35. Should every project also have a crawlable detail page?

Recommended: Yes. Generate `/project/<slug>/` pages for search, accessibility, and direct sharing.

36. Should there be a command palette?

Recommended: Yes. `Command K`, `Control K`, and `/` open search and commands.

37. Should search move the camera to the result?

Recommended: Yes. The chosen result receives focus, its panel opens, and the URL updates.

38. Should visitors filter by sector?

Recommended: Yes. Filters can isolate one or several sectors without destroying the camera position.

39. Should there be guided tours?

Recommended: Yes. Launch with three tours: `Start Here`, `AI and Infrastructure`, and `Space and Physics`.

40. Should there be a timeline mode?

Recommended: Yes, once trustworthy launch dates exist for every included project.

41. Should there be a random jump control?

Recommended: Yes. Call it `SURPRISE ME`.

42. Should a visitor be able to compare two projects?

Recommended: Yes. A compare action highlights their shortest meaningful relationship path and explains the connection.

43. Should a visitor be able to pin favorite nodes during a session?

Recommended: Yes, stored only in local session state with no account.

44. Should the site remember the last camera position?

Recommended: No by default. Deep linked state is preserved, but a fresh visit begins at the intentional overview.

45. What should mobile do?

Recommended: Use a simplified 2D map, touch friendly filters, and a bottom detail sheet. Do not attempt unrestricted 3D controls on a phone.

46. What should happen for reduced motion?

Recommended: Stop automatic camera drift, star pulses, signal travel, parallax, and transition choreography. Keep instant focus changes and full functionality.

47. What should happen when WebGL fails?

Recommended: Automatically load Atlas mode and display a quiet message that the full map is unavailable on this device.

48. Should Atlas mode be a first class navigation option even when WebGL works?

Recommended: Yes. A visible `ATLAS` control must always be available.

## Data and storytelling

49. Should `nixfred/nixfred.github.io/portfolio.json` remain the upstream project catalog?

Recommended: Yes. Galaxy must never become a competing master list.

50. How should galaxy add data that the catalog does not contain?

Recommended: Maintain a separate enrichment file keyed by stable slug. It stores dates, weight, technologies, relationships, coordinates, images, and tour membership.

51. How should upstream changes arrive?

Recommended: A scheduled workflow checks weekly, updates a committed snapshot, validates it, and opens an automated pull request. Production builds never depend on a live remote fetch.

52. Should Larry create the first relationship map?

Recommended: Yes. Larry may infer an initial graph from category, subject, shared technology, chronology, and explicit project copy. Every inferred edge must have a visible reason in the data.

53. Should every project receive a launch date?

Recommended: Yes, but only from Git history, published content, or a Fred supplied decision. Unknown dates remain unknown.

54. Should public GitHub repositories appear in project panels?

Recommended: Yes, when the repository mapping is confirmed.

55. Should technology tags appear?

Recommended: Yes, but no more than six visible tags per project.

56. How long should project detail copy be?

Recommended: One sharp sentence in the panel, then an optional detail section of roughly 60 to 120 words.

57. Should client projects appear in the same map?

Recommended: Yes. Keep them in a distinct Clients region and do not imply ownership of the client's business.

58. Should personal projects appear in the same map?

Recommended: Yes. Treat them quietly and respectfully, especially caregiving and memorial work.

59. Should the map show work that contains private or employer material?

Recommended: Only the public landing page and public description. No private feeds, documents, metrics, or internal data.

60. Should every edge have a type?

Recommended: Yes. Use `built_on`, `shared_subject`, `shared_technology`, `client_work`, `personal_history`, and `chronology` as the initial relationship types.

61. Should positions be completely algorithmic?

Recommended: No. Use deterministic category anchors and seeded placement, with manual coordinates for major nodes and tour composition.

62. Should project screenshots appear?

Recommended: Only in the detail panel and generated Open Graph cards. Keep the main sky abstract and fast.

## Operations and governance

63. Should the GitHub repository be public?

Recommended: Yes.

64. Which license should apply?

Recommended: MIT for source code. Project screenshots and personal writing retain their original rights unless explicitly licensed.

65. Should features use pull requests?

Recommended: Yes. Larry creates a branch, opens a pull request, reviews the preview, and merges when all required checks pass. No additional permission question.

66. Should every pull request receive a Cloudflare preview deployment?

Recommended: Yes.

67. Should a successful merge to `main` deploy production automatically?

Recommended: Yes. Pushing `main` means deploying production.

68. Should production require a manual GitHub environment approval?

Recommended: No. The automated quality gates are the approval.

69. Should branch protection require all CI checks?

Recommended: Yes. No outside reviewer is required for this personal repository.

70. Which checks should block deployment?

Recommended: Formatting, lint, strict type check, Astro check, data validation, unit tests, end to end tests, accessibility tests, build, broken internal links, visual regression review, and critical performance budget violations.

71. Should performance regressions block the release?

Recommended: Yes for large regressions and hard budget failures. Small changes become warnings in the job summary.

72. Should visual regression snapshots be committed?

Recommended: Yes for stable desktop, tablet, mobile, Atlas, reduced motion, and selected project states.

73. Should Cloudflare Web Analytics be enabled?

Recommended: Yes. No additional analytics, cookies, advertising, session replay, or fingerprinting.

74. Should a static build information endpoint exist?

Recommended: Yes. `/build.json` exposes the public commit SHA, build time, version, branch, and catalog revision.

75. What happens when production smoke tests fail?

Recommended: Mark the deployment failed, immediately restore the previous successful production deployment, and open a GitHub issue containing the evidence. Do not ask whether rollback is allowed.

76. Should the new site be added to nixfred.com automatically after production passes?

Recommended: Yes. Open and merge a separate change to `nixfred/nixfred.github.io/portfolio.json` only after `galaxy.nixfred.com` is verified.

77. Should dependency updates be automated?

Recommended: Yes. Dependabot opens grouped weekly updates for Bun packages and GitHub Actions.

78. Should GitHub Actions be pinned?

Recommended: Yes. Pin third party actions to immutable commit SHAs and annotate the intended release.

79. Should the app include a contact form?

Recommended: No. Use links to the resume, GitHub, LinkedIn, and nixfred.com.

80. Should production notifications go anywhere beyond GitHub?

Recommended: No for version one. GitHub deployment records, summaries, and issues are sufficient.
