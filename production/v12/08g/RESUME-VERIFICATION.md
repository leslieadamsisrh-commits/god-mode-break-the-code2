# V12 08G — interrupted batch resumed and locally verified

## Result
Reconstructed the saved 08G action-iteration code from checkpoint 2e9323d3c95a6aa8935e3762eb8cde638d902434 and the exact 08F/08E delivery packages. Completed local tests and prepared a new downloadable playable HTML, complete source-and-assets ZIP, actual prototype screenshot, and 13-second scripted demonstration. This is an isolated single-player action/presentation test, not new artwork or a completed animation library.

## Reconstruction evidence
The local action-controller.js matched Git blob 8a9976a0f27540833d1d976ee09a42b812c94662. source-edits.json matched Git blob 1f6e120646d4f0aa535db1793f47c34e62a7527d. All six reconstructed files matched the recorded output SHA-256 checks against the exact 08F package. Four study PNGs matched the recorded 08E fingerprints. K01, K02 and K03 PNG bytes match the 08F package exactly. No image was repainted or enlarged to claim new detail.

## Playable changes relative to 08F
- Separate input-driven action controller for stationary raise/retract and recoil state.
- Shot and recoil begin on the same simulation tick; presentation spawns no extra projectile and adds no firing delay.
- Early release, re-aim, cover exit, unsupported-view interruption and reset are tested.
- Optional four existing source-pixel lift studies can be compared inside the same interaction. OFF by default and explicitly labeled as derived studies, not newly drawn in-betweens. Full shoulder lift remains missing.
- Live raise/recoil/cooldown and recent action/shot events in the side panel.
- Focus loss/hidden tab clears inputs and pauses. Pointer cancellation clears mouse buttons. Pointerdown updates aim coordinates. Reset clears stale input.
- Loader checks expected image dimensions and reports errors visibly.

## Verification on this resumed pass
34 Node checks passed: 17 baseline simulation checks plus 17 action/regression checks. These include same-tick recoil, no rendering side effects, cancellation, dry obstruction, cadence, reset and 3000 paired 08F/08G input ticks comparing movement/contact variables and metrics. This does not establish all-case or full-game parity.
35 browser checks passed: 18 baseline checks plus 17 08G checks. Headless Chromium 144.0.7559.96. Exact self-contained HTML executed with Playwright set_content because file-URL navigation was blocked by environment policy. DOM keyboard/mouse and synthetic standard-gamepad inputs tested. No physical Xbox, hosted URL, target-PC FPS or Vercel test claimed. No JavaScript errors observed and no external HTTP(S) dependency requested in the checked standalone session.
115 image files passed hash/dimension/RGBA/alpha-presence tests: 108 recovered atlases, 3 unchanged final-design PNGs, 4 reused small-lift study PNGs. Passing file checks does not approve final anatomy or clean edge mattes.

## Boundaries
Zero new drawings. Final-design coverage remains one right-hand corner view with three source poses; locomotion and other directions use recovered artwork. Full gun raise, authored recoil and retract remain incomplete. Recoil still holds the aim drawing while an independent effect/state changes. Original source fringe and provisional foot/muzzle sockets remain. No cover is baked into character images. The plain training geometry is not final environment artwork.
The original combat-lab-system08/combat-lab/game.js still reports blob edca9aa0e0f368954dce2da355adc2fe1ba021ef. This pass edits no approved movement or original runtime file. Vercel Git auto-deployment remains disabled on the experimental branch. No new public release or hosted playable URL claimed.
Five review responsibilities are used; no autonomous parallel workers were launched. Art gates are not marked complete by these tests.

## Delivery
- JADE_V12_08G_Playable_Training_Lab.html — standalone local playable test; images embedded, no GitHub login or remote asset request needed.
- JADE_V12_08G_Action_Iteration.zip — complete assembled source, all required images, manifests, tests/results, recovery recipe, README, screenshot evidence and demonstration.
- JADE_V12_08G_Playable_Demo.mp4 — 13 seconds, 195 actual browser screenshots at 15fps, 1440x1000 H.264; four fixed simulation steps per displayed frame with scripted inputs. Not hand-played or a real-time performance benchmark.
- JADE_V12_08G_Actual_Preview.png — actual prototype render, not a generated concept poster.

Download/open the standalone HTML in a desktop browser. Start at Corner station, aim right, RMB/LT raises, LMB/RT fires, release lowers, Shift/A exits. E/X attaches/detaches; WASD/LS moves; R/View resets. Resume after focus-loss pause. Use the optional small-lift comparison at quarter speed to inspect it. Other art states remain visibly identified as recovered.

GitHub holds the existing controller/reconstruction recipe and this verification record; the image/video binaries and complete assembled delivery are saved separately in the package and Library, with receipts to follow. Do not claim that these binaries are installed in the repository runtime or deployed. The next art task is the missing larger shoulder/stock movement and authored recoil/retract, not another skeleton redesign or exaggerated deformation.
