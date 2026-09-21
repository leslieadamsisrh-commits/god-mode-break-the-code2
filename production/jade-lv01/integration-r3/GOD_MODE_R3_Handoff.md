# GOD MODE — Crouch Test R3 handoff

Checkpoint saved 2026-09-21 UTC. R2 preserved. This is an isolated offline review build, not an online release.

## What changed

Three actual transparent PNGs are installed as review candidates: right step, passing pose, and left step. Supported station south-face/right-facing cover movement plays PASS → RIGHT → PASS → LEFT according to signed distance traveled. Stopping returns to PASS. No image mirroring. Impact, aiming, firing, recoil, corner travel and unsupported views defer to the inherited renderer.

Optional “Keep inspected Jade in view” follows the selected actor during inspection. Normal Start/rematch restores the fixed duel camera. The recorded R2 video showed switches into standing/older art and the character leaving the close view; R3 targets those presentation problems.

The new sequence is a first three-pose test. Broad steps, missing in-betweens, possible hair-edge fringe, and transitions into older firing art remain review issues. No final motion approval is inferred.

## Exact status

| Stage | Verified status |
| --- | --- |
| Artwork approval | Prior locked design/pose approvals preserved; all three R3 drawings pending user review. |
| Existing current-design exports | Four unique inherited files, unchanged. |
| New exports | Three RGBA cutouts with real alpha; accepted technically for experimental playback, not approved final art. |
| Runtime total | 122 images: original 119 byte-identical plus three candidates. |
| Animation | Three unique poses / four cycle slots, one view, distance driven; full continuity unfinished. |
| Gameplay | Integrated into isolated R3; simulation, damage, movement, controls and muzzle sockets unchanged. |
| Verification | 54 Node tests pass; 3,600-tick equivalence included; six native scenes plus 100 motion steps, zero missing draws/errors. Minimal DOM UI harness covers keyboard/mocked-controller seats and new toggles. |
| Live testing | R3 browser and physical-controller playtest not certified. |

The Batch 17 “204 sprites / 100%” is still not a verified export or integration count.

## Play

Open **GOD_MODE_B11_Crouch_Test_R3.html** in a desktop browser; all 122 runtime images are embedded, no server required.

1. If using a controller, press a face button first.
2. Click **Try crouched movement**. It chooses the assigned controller seat, otherwise P1 keyboard.
3. Aim right and move left/right: mouse + A/D, or right stick + left stick. Stop to inspect the passing/settle pose.
4. Uncheck **New crouched sprites (review)** to compare the R2 temporary walking art without resetting the simulation.
5. Uncheck **Animate cover movement** to inspect the inherited static poses. **Compare original R1 presentation** restores R1 scale/anchor and static routing, then returns to R3 when clicked again.
6. Keep follow enabled to stay in view; disable it for fixed-camera registration review. Corner and slide-to-cover setup buttons remain available.
7. Export the playtest report if needed; it identifies R3 and its active presentation settings.

This local two-player lab keeps P2 idle without a controller. Firing still switches to older registered sprites. Do not interpret that as completed high-detail firing animation.

## Saved source and recovery

Repository: `leslieadamsisrh-commits/god-mode-break-the-code2` (private).
Branch: `god-mode-crouch-test-20260921-r3`.
Parent R2 commit: `976bee10d71f72d5853c17948299c20e5672dbde`.
Verified separate art-export commit: `17cd02a093eeccbdb950d6cab9847379a15466ed`.
Source overlay: `production/jade-lv01/integration-r3/`.
Build SHA-256: `c0e48c629100125f12b30ded146add2a84e68013b69ce93775125c2cf5bffd65`.

Run the R3 `restore_from_b11.py` with the original B11 ZIP and a new output directory. It checks the original ZIP fingerprint, applies the R1, R2 and R3 overlays in order, verifies the original images, and rebuilds the standalone HTML. Original ZIP SHA-256: `38ba7040a5abedb8efe371481304b35195765d4e3de0d3c9fdc390462272c233` (saved B11 archive `libfile_c96641c423a48191a09f3c038910c906`).

Production and registration records: `recovery/R3-PRODUCTION-RECORD.json`, `R3-EXPORT-CHECK.json`, `RECOVERY-AUDIT.json`. Tests and diagnostic render scripts are included. Earlier failed checkerboard candidate stays outside runtime assets.

## Next checkpoint

Playtest the three candidate poses at a fixed camera setting. Review silhouette and asymmetric gear, step width, foot contact, pelvis/hand/muzzle stability, and edge quality. Refine those and add in-between poses before claiming a finished crouched cycle. Then expand transitions and directional coverage while preserving combat tuning. Keep artwork approval, technical export, animation validation and playable implementation separate. Do not restart completed work or infer a new visual approval.
