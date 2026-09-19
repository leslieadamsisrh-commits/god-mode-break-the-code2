# JADE V12 08F — PLAYABLE POSE INTEGRATION

## Delivered scope
A locally executable, single-player Training Lab integration prototype. Actual movement, slide-to-cover, tangent motion, corner stop/reversal, aim, shots, target damage, cover exit and restart are implemented. This is not an automatic pose slideshow. It uses recovered Cyber Kitty locomotion and three unchanged final-design Jade PNG poses for one supported right-hand cover edge/view. Other states/headings remain explicitly labeled recovered artwork.

ZERO new drawings. The final-design action uses three held keys, not a finished smooth gun-raise/recoil/retract animation. Recoil holds the aim key while a separate effect plays. New in-between and recoil drawings are still required. Skin transitions can pop. The plain Training Lab geometry is a test environment, not completed final environment art. No multiplayer or new psychic systems.

## Playable delivery
JADE_V12_08F_Playable_Training_Lab.html is the offline single-file build. It embeds only the test's needed runtime images and code, with no network dependency. Download and open in a desktop browser. The full source package contains modular index.html/assets.js/core.js/app.js/style.css and the assets folder. Keep them together. Build the standalone file with python tools/build_standalone.py.

Start at Corner station to see final Jade immediately. Aim right, hold right mouse or LT to raise, left mouse or RT to fire, release to lower, then Shift/A to kick out. Run / slide approach resets below the barrier: hold W/left-stick up and tap Shift/A; move right along the barrier to its right end; aim right for the final-art action.
Keyboard: WASD move, Shift slide/kick, E attach/detach, RMB aim, LMB fire, R reset, P pause. Standard controller: LS move, RS aim, A slide/kick, X attach/detach, LT aim, RT fire, View reset. Physical controller hardware remains untested.
The panel offers no target / stationary / moving / attacking target modes, invulnerable training, separate cover visibility, x-ray, anchors, camera magnification, pause/step, slowed simulation, event export and optional browser canvas recording.

## Authorities and preserved work
Movement reference: ba742b1019f80f3e2d71b166b32244c4ed686260; combat-lab/game.js blob edca9aa0e0f368954dce2da355adc2fe1ba021ef.
Visual reference: approved large Idle/Ready composite, SHA-256 fff8eeb8fcc3ef1ff3a830684c1ac5aac5f8f142cb3ed92283e8b6ec59d49e89.

This is the separate v12-08f-playable-pose-integration branch, based on 14f59620f2776485eb25f44bfdcfec05d401962b. Its initial safety commit 71fdcd930bbb0e0ac5a4840b95875b0ea08553ba sets git.deploymentEnabled:false in vercel.json. Existing combat-lab/game.js and approved source sprites are not edited. The original combat-lab-system08 branch remains the comparison, not the experiment's destination.

## Mechanical changes and verification boundaries
Open-ground speed 262, response 13, stop drag .002, slide speed 650, .70 duration, slide drag .12 and radius 17 are preserved in the transcribed movement update. A 2,000-update reference-excerpt comparison matches velocity, slide countdown, drop and free-movement state. This is NOT proof of entire-game parity, every collision trajectory or physical-controller feel.

Experimental changes are separately identifiable: corrected cover-face placement; corner inward reversal; explicit attach/detach; brief kick follow-through; collision substeps; independent stationary aim clock; simulation-time firing; provisional artwork muzzle/breech sockets; swept cover/projectile collision; camera/input projection and target rules. Mouse aiming uses a fixed height plane to avoid feedback as the selected pose's muzzle height changes. The 145-degree lower-body variable is retained; flattened sprites are not a fully articulated torso rig.

One shot event creates the seven pellets and visual effect. Firing is immediate rather than delayed until the unfinished artwork sequence ends. New final-art sockets and actor height approximations remain provisional. Hiding cover artwork does not disable its collision. Character, cover and muzzle-flash art are separate.

## Actual files and art limits
108 recovered atlas derivatives (125px cells derived from recovered 250px cells), plus three unchanged native final-design PNGs. Total image bytes in the package: 12,509,845. Atlas addressing uses actual rows and columns; the nominal d03 run/slide files map from run.webp and slide.webp. Directions remain nominal studies, not exact yaw-certified drawings.

K01: 620x809; SHA-256 2ff35d3c8f6663f3c51ef11a8f5f4e7dcc4a5eaa085d4a94c719a6bd73cc19bc.
K02: 640x809; SHA-256 435a882af1a4fd906a4857592176860c6a67eb235cfcc5cb8ec7ea56437e110b.
K03: 684x809; SHA-256 8370e561b7b9b4f5495e6793b1a32821b03ed0cf7f8f8ec617c67a4f12c4a77a.
These are the original native PNG bytes from 08D, not new 1024x1536 masters. K03's edge fringe remains flagged. The source image size, game sprite scale and inspection zoom are separate quantities; final on-screen size and contacts remain subject to gameplay review. No design, face, outfit or equipment repainting occurred.

## Tests and footage
17 simulation tests and 18 browser-content/input checks passed; no observed browser JavaScript errors. 111 image files passed hash/dimension/RGBA checks. Those checks do not approve final anatomy, frame continuity, sockets or final art.
Browser: headless Chromium 144.0.7559.96. File URL navigation was blocked by the environment browser policy, so the exact standalone HTML was executed using Playwright set_content. Actual DOM keyboard and mouse events and synthetic standard-gamepad edges were tested. No physical Xbox, hosted URL, Vercel deployment or target-PC FPS test is claimed.
JADE_V12_08F_Playable_Demo.mp4 is 13 seconds, 1440x1000 H.264 at15fps, assembled from actual browser screenshots of the simulation advanced four fixed 1/60 ticks per video frame with scripted inputs. It is not human hand-played footage or a real-time performance benchmark. Screenshots are actual prototype renders, not generated concepts.

## Storage and release boundary
This GitHub branch contains core.js, app.js, index.html, style.css, the simulation test, asset verifier, standalone packager and this report. The new PNG/image derivatives, generated assets.js/asset-manifest.json, complete browser-test evidence, standalone file, approved reference and video are in the complete source-and-assets package delivered in chat and saved separately to Library with confirmed receipts. They are NOT claimed copied into the repository's runtime asset directory by these text commits. Repository index.html alone is not a complete playable artifact without that package's assets and manifest.
No new Vercel deployment was performed. Vercel list_teams returned no teams, so hosting/protection could not be verified. Automatic Git deployment is intentionally disabled on this isolated branch. Do not share a dashboard link as a playable build.
Five review responsibilities remain identity, biomechanics, continuity, gameplay and rendering. No parallel autonomous agents were launched. The first deliverable is a playable integration test, not a completed animation library.

## Next paired batch
Use the supported corner action to distinguish missing art from timing, anchors, projection and control bugs. Author the missing same-view gun raise, recoil and retract drawings from the locked Jade; test them in the same interaction. Keep recovered motion for unsupported states and keep the approved movement source recoverable. Do not redesign Jade or produce another completion poster in place of working files.
