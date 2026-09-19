# V12 08H — Movement + Art Flow

## Delivered scope
Locally executable single-player Training Lab experiment. New movement/presentation behavior; zero new drawings. Original v11.1 and prior 08G remain recoverable. This is not a complete HD animation library or a new Vercel release.

## Playable changes
Radial analog input retains partial stick magnitude rather than forcing every nonzero movement to full speed. Weighted cover shimmy accelerates/brakes instead of assigning full speed immediately. New response 20 / stop response 27 are experimental tunings. Maximum movement speed 262 and the original full-stick/free-ground and slide calculations remain preserved.

B/Space deliberately rounds a valid cover corner along a checked outside path, at experimental speed 168, then attaches to the next face. Other barriers and arena limits can block it. Ordinary movement still stops at the edge. X/E detaches and A/Shift kicks out, including during wrapping. Wrapping uses recovered artwork, not nonexistent final-design wrap sprites.

Animation progression uses actual displacement, so blocked walking does not advance its travel clock. Numeric cycle phase is normalized across different atlas frame counts; heading selection gains hysteresis. These are code improvements, not proof of hand-authored foot-contact matching or exact 15-degree views.

The flow checkbox compares new 08H behavior against 08G. Reset between comparisons. The panel and event export expose movement, action, wrap input and frame selection. Existing gun action, muzzle collision and target damage remain connected; presentation does not create extra shots.

## Authorities unchanged
Design reference SHA-256: fff8eeb8fcc3ef1ff3a830684c1ac5aac5f8f142cb3ed92283e8b6ec59d49e89.
Movement authority: ba742b1019f80f3e2d71b166b32244c4ed686260. Original combat-lab/game.js blob observed: edca9aa0e0f368954dce2da355adc2fe1ba021ef.
New branch v12-08h-movement-art-flow is based on 08G receipt checkpoint 0e04eb541ef91ea843885971822c6a124188f3ba. The added module extends unchanged core.js and action-controller.js from 08G. No original runtime file was overwritten.

## Art boundaries
115 images are byte-identical to 08G: 108 recovered atlases, 3 final-design source poses, 4 old optional lift-deformation studies. No redesign, repainting, generation or additional resampling. The final-design art covers only the supported right-hand corner view. All other motion uses recovered art and is labeled. Skin transitions can pop.
Full shoulder raise, authored recoil/retract, HD locomotion and 360 coverage remain incomplete. No independent upper/lower torso rig is claimed from flattened images. Existing K03 fringe and provisional foot/muzzle sockets remain. Cover/effects are separate assets. Source resolution, game height and camera zoom remain different quantities.

## Verified results
67 Node checks passed: 34 prior baseline/action assertions and 33 new movement/transition/combat assertions. Tests include 3,000 full-stick/free-ground comparison ticks, 700 comparison-mode ticks, bounded speed, eight face/edge wrap paths, obstruction, cancellation, firing cadence and numeric atlas selection. This is not entire-game equivalence.
23 browser-content/input checks passed in headless Chromium 144.0.7559.96, executing the exact standalone HTML through Playwright set_content. File URL navigation was blocked by administrator policy. DOM keyboard/pointer events and synthetic standard-gamepad values were tested, not a physical Xbox or hosted URL. No page JavaScript errors or external HTTP dependency were observed in that checked session.
Six asset/core identity assertions passed; 115 image files passed integrity/decoding checks. Five automated verification lanes were launched concurrently; browser tests were rerun separately after capture/cleanup timeouts. Final per-suite results are in the package. No autonomous AI agents were launched. These checks do not certify final art/anatomy, contacts or target-PC performance.

## Capture
The demonstration MP4 is 7.2 seconds, 108 actual browser screenshots at 15fps, 1440x1000 H.264. It uses scripted four-fixed-tick advances, not human hand-play or real-time performance. It is the completed prefix of an interrupted extended capture, showing the corner action, wrap/return and start of shimmy, not the whole run-up loop. Final browser assertions were completed separately. The PNG is an actual prototype render, not a concept poster.

## Storage boundary
GitHub saves motion-flow.js (commit caf8a53ea92e6f2f7fd9036dde20cde38aa84afe), the fingerprint-checked assemble_08h.py (commit 2283a68b2c5d1d9d1b2482372d00e26f4b3cbdef), this report and subsequent receipts. The assembler reconstructs the changed UI/presentation from the exact 08G package into a new folder.
The complete playable HTML, modular code, all image binaries, tests, evidence and captures are in the delivered ZIP and separately saved to Library only when an upload receipt confirms it. These text commits do not assert that those image binaries have been installed into GitHub or Vercel. Automatic Git deployment remains disabled on the isolated experiment. No new public release or Vercel deployment was performed.

## Next work
Play-test the new analog/shimmy/wrap behavior in A/B mode. Use evidence to distinguish missing drawings from control, selection, anchor and timing issues. Author the missing same-view shoulder/stock transition and recoil/retract within this interaction, without redesigning Jade or declaring the 360 library complete.
