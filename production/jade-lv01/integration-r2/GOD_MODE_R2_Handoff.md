# GOD MODE — Cover Test R2 handoff

Work completed 2026-09-21 UTC. New playable checkpoint: **B11 Cover Test R2**. R1 remains preserved for comparison and recovery.

## What changed in the game

1. The four current-design cover keys now have smaller drawing scales and adjusted vertical foot anchors. This is a manual first-pass visual calibration; it does not complete animation continuity.
2. Supported south-face/right-facing cover travel can now display existing run/backpedal frame sequences. They are **temporary older walking art**, not new approved crouched animations. Actual distance traveled advances the frames. They stop when motion stops and yield to firing, recoil, corners and unsupported views.
3. **Try cover movement** sets up the character at cover, brings the camera closer, and starts the test. In keyboard/controller mode it selects P2 if a standard controller is assigned, otherwise P1. Device controls retain their existing assignments.
4. **Compare original R1 presentation** toggles the two presentation changes without resetting the simulation. Uncheck **Animated cover test** to inspect the approved static cover poses at the adjusted size.
5. Exported playtest reports now identify R2 and include the active scale, anchor and presentation settings.

All 119 existing image files are byte-for-byte unchanged. The protected movement, collision, damage, input, firing, and socket files are unchanged. K01/K02/K03 retain their old registrations to preserve their existing muzzle sockets. Those older firing poses can still have visible size/style discontinuities.

## Exact status — keep these separate

| Stage | Status |
| --- | --- |
| Artwork approval | Existing locked-master/pose approvals preserved. No new approval inferred. |
| Current-design exports | Four unique exported keys in the runtime, unchanged. |
| New sprite production | One right-step background-extraction attempt this pass; rejected because its checkerboard is opaque RGB. Zero new accepted exports. |
| Animation validation | Reused walking sequences advance under real simulation travel. Final crouched stepping, transitions and directional continuity remain unfinished. |
| Playable integration | R2 is built and checked with code, native rendering and a simulated UI harness. Live browser and physical-controller testing of R2 are not certified. |

The later Batch 17 presentation's “204 sprites / 100%” remains unverified as a count of exported or installed assets. Do not use it as a production completion percentage.

## Verification

- 50 Node tests pass, including movement-driven frame selection, stopping, firing/view/edge guards, both fixture seats, and quick-start/comparison event handlers for keyboard and mocked standard-controller input.
- Existing browser/server simulation equivalence passes for 3,600 mixed-input ticks in Node.
- Six scenes and a 100-step cover-motion sequence rendered through the actual game renderer with decoded source images: zero missing draws or asset errors.
- The UI harness executes `couch.js` against a minimal DOM substitute; it is not a real browser or a physical controller test.
- Image fingerprints and protected simulation files match the baseline.

## Play

Open **GOD_MODE_B11_Cover_Test_R2.html** in a desktop browser. All runtime images are embedded; no server is required.

1. If using a controller, press a face button so the browser can see it.
2. Click **Try cover movement**.
3. Keyboard: point the mouse to Jade's right, then use A/D. Controller: aim right with the right stick and move left/right with the left stick.
4. Click **Compare original R1 presentation** to compare the same scene; click again to return to R2.
5. Use **Set up selected Jade at corner**, then **Resume**, to check inherited aiming/firing. Use **Set up slide-to-cover**, then **Resume**, for the entry sequence.
6. Export the playtest report if something behaves incorrectly.

This is an offline local two-player lab. It is not the online multiplayer release. P2 remains idle without a controller.

## Next production checkpoint

Finish genuine transparent right/left crouched step and passing poses from the locked master. The failed candidate must remain outside runtime assets. Check actual alpha pixels before accepting an export. Validate silhouette, asymmetric gear, size, foot/pelvis/hand/muzzle placement, and motion continuity at fixed camera settings. Replace the temporary walking cycles only after the crouched sequence passes that review. Preserve the combat tuning while doing this presentation work.

The new art attempt used built-in image generation. Its exact prompt, output fingerprint and rejection reason are recorded in `recovery/R2-ART-ATTEMPT.json`.

## Recovery and saves

Previous verified source commit: `c5eaf7252f7575358c9d57c1c8c1d6fdabad209d`.

R2 source overlay: `production/jade-lv01/integration-r2/`. It includes a restore script plus runtime source, tests and records. Unchanged binary assets are supplied by the original saved B11 archive, SHA-256 `38ba7040a5abedb8efe371481304b35195765d4e3de0d3c9fdc390462272c233`. The standalone HTML embeds all 119 runtime images independently.

Delivered HTML SHA-256: `cd739d9f0b4ca057aae2c214be05392141b76499d9715b68ac213a75a28032de`.

The generated failed candidate remains a review image. It is not an approved sprite, and no gameplay deployment is claimed.
