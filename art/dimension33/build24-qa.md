# Build 24: solid scenery correction batch

Starting remote branch: `studio/raptor-combat-lab-01`, commit `15247cdd0520b813cd7502ed7c3b1b6538b37284`. Starting Railway SUCCESS: `fb3c3d3c-4185-4b78-a1bb-e08a97336539`, same SHA. Local snapshot `3264ca8` is not remote ancestry. Modified baseline blobs were compared with the complete remote tree. Rollback branch: `studio/build24-rollback-15247cd`.

## Confirmed causes and changes

- Architecture was drawn at 0.48 alpha. Solid surfaces now draw at full alpha; cached source-atop color treatment reduces contrast without changing silhouette/opening alpha. Synthetic opaque, transparent and antialiased pixels are checked.
- Scenery ignored authored pivots and used a generic 16-pixel bottom inset. Registered pivots now position existing sprites. No source-resolution changes.
- Stair presentation height 75 did not reach the adjacent platform deck. Both existing stair modules now use 130, preserving aspect ratio. North captures show improved connection; the south remains constrained by its existing off-floor placement and available view.
- Two mirrored existing industrial facades fill rear gaps below bridges, outside the combat inset. Scenery sorts by anchor depth and receives restrained contact shadows. No collision or traversability added.
- Skyline previously travelled with the near arena horizontally. It now uses the existing L1_FAR parallax factor 0.035; floor, projection, zoom and pointer conversion are unchanged.

Runtime files: `lib/dimension33MapArt20.ts`, `lib/dimension33Registration21.ts`, `lib/warGamesPresentation45.ts`. Checks: `tests/build24.cjs`, `tests/render21.cjs` (small headless timing option). No character, movement, damage, networking, HUD or gameplay source changed. Repulse remains disabled by default.

## Assets and evidence

Reused existing map20 atlases and their frame/pivot metadata: industrial facade, north/south platforms, stairs, bridges, tower, watchtowers, lamps and skyline. No newly generated art or falsely certified sprite family.

Available: supplied approved JPEG, extraction/reference packages, map20 atlases, earlier QA, both October gameplay recordings. Exact named approved PNG and approved illustrated HUD source remain unavailable in this checkout/recovered files. Extraction panels are references, not individual production sprites. Existing stair source contains an edge fragment; it still needs faithful source cleanup. No unreviewed candidates were installed.

`build24-evidence/before24-{center,north,west}.jpg` and corresponding `final24-*` are matched 1000x620 headless actual-renderer captures. Additional candidate captures cover south/east, held/thrown/damaged/destroyed cover and missing-asset fallback. They establish presentation, not input or collision correctness. Only one standing Jade image is loaded by this harness; these captures do not certify all character animations.

Motion baseline: `build23-evidence/final23-motion.mp4`. Candidate: `build24-evidence/final24-motion.mp4`. Both are 500x310, 240-frame scripted presentation routes, not browser gameplay recordings or real-time performance evidence.

Live Build 23 was opened in the cloud browser, entered through War Games/Jade/Bay Bridge, and inspected. Keyboard movement visibly changed position. Candidate browser verification depends on successful deployment; no candidate browser verification is asserted here.

## Checks

Production compilation/type checking: PASS. Build24 alpha/cache/fallback/parallax/scenery-placement/hull checks: PASS. Focused Build22, Build23 and floor46 regressions are recorded with the delivery result. They cover input edges and commitment, camera inverse mapping, cover transitions and matter lifecycle; server/API multiplayer tests are not two-browser or real-network tests.

Small headless timing comparison, identical center render, two warm-up frames then eight samples: baseline median 259.37 ms / max 287.45 ms; candidate median 249.90 ms / max 296.85 ms. Background scripted rendering was also running. This noisy CPU-renderer sample does not establish browser FPS, an improvement, or iPad performance. Color treatment is cached rather than rebuilt every frame.

## Remaining work and limits

The opacity correction passes. Full arena immersion is not declared complete: south/perimeter cutouts and remaining incompatible source perspectives need further verified connective artwork/registration. Stairs/platforms remain scenery, not usable traversal. Strong cabinet and shelter material distortion remains visible in close captures; it must be resolved with compatible face materials, not by shrinking their protection.

Reverified physical shelters `war-shelter-a/b`: footprint 34x118, height 78. Industrial nodes `d33-west-north-node`, `d33-east-north-node`, `d33-west-south-node`, `d33-east-south-node`: 48x58, height 78. Unchanged. Any future geometry proposal should compare mirrored shorter/lower shelters separately for sightlines, routes, attachment and shooting. No numerical geometry revision is justified by these presentation captures alone.

Existing face-based moving-cover treatment and fallbacks remain. Headless held/thrown/damage images were inspected; full browser manipulation/destruction route, physical controller, iPad, audio, real-network quality and two-browser synchronization remain unverified. Approved helmet HUD recovery remains blocked on its source.

Deploy only this correction batch after diff/asset review. Deployment outcome and exact final SHA must be checked from Railway; compilation and this report do not claim deployment success.
