# GOD MODE — Low Cover Test R4 handoff

User correction: cover sprites were too small; increase size moderately. Wide left/right steps were wrong. Desired posture is very low, one boot planted and the opposite knee down, with small push-and-drag travel while attached to cover. Preserve ability to leave cover into existing running/sliding/actions. Cover destruction and powers were described as context, not implemented in this pass.

## Delivered correction

- Reuses inherited CE08 knee-down artwork for supported cover idle and travel. No new image generation, no altered image bytes.
- Default cover size multiplier 1.35 over R2/R3 calibration. CE08 drawing scale is 0.1269 (previous calibrated value 0.094). This is a moderate increase, not an exact return to R1's much larger 0.162 scale.
- Cover character size slider: 100–170%, live update without resetting simulation. Multiplier affects calibrated B05/B06 cover art and optional R3 candidates. It does not rescale older K01/K02/K03 firing art or alter muzzle sockets.
- Low knee-down cover stance is enabled by default. It uses a held pose for travel, so wide step cycling is absent. This is NOT completed foot-locked animation; dedicated short push/drag/recovery drawings remain required.
- Disable Low knee-down cover stance to compare the R3 cycle. Set size to 100% for original R3 calibration. R1 comparison disables low stance, motion and calibration; returning restores the R4 stance and selected multiplier.
- Inspection follow and normal control assignments preserved. Impact, aim, fire, recoil, corner travel and unsupported views defer to inherited rendering. Unsupported directions and older firing poses retain visible style/size differences.

## Play

Open GOD_MODE_B11_Low_Cover_Test_R4.html in a desktop browser. Press a controller face button if using a pad, then click Try low cover movement. Aim right and move left/right with the sticks or mouse + A/D. Adjust Cover character size while playing. Exported reports identify B11-LOW-COVER-TEST-R4 and include lowCover and coverSize settings.

## Exact status

Artwork approval: inherited approvals preserved; no new drawings or new approval inferred. R3 candidate artwork remains pending and retained for comparison.
Exports: original 119 image files plus the 3 existing R3 candidates; all 122 byte-identical to R3. Zero new exports in R4.
Animation: held CE08 stance during one supported view; push-drag animation not finished.
Integration: isolated offline two-player R4. No online release or public deployment.
Validation: 55 Node tests pass including size/stance routing, simulation nonmutation and UI handlers. Existing 3,600-tick equivalence included. Six actual-renderer native scenes and 100 motion steps show zero missing draws/errors. Protected simulation/input/socket files match baseline. R4 live browser and physical controller not certified.
Batch 17 printed 204/100% remains unverified as exported assets or completion percentage.

## Recovery

Private repo: leslieadamsisrh-commits/god-mode-break-the-code2.
Branch: god-mode-low-cover-20260921-r4.
Parent R3 commit: ccd76187dc2870d70248e7c7126deebffc6301f5.
Source overlay: production/jade-lv01/integration-r4/runtime.
Use restore_from_b11.py ARCHIVE --output NEW_DIRECTORY. Applies original B11 archive then R1, R2, R3 and R4 overlays. Earlier branches remain untouched.
Original ZIP SHA-256: 38ba7040a5abedb8efe371481304b35195765d4e3de0d3c9fdc390462272c233.
Delivered HTML SHA-256: 4547eb9ab664454d31c906078ef547ba98bfb2acb61f40374beb4d32d92fdf7c.

## Next production work

Use CE08 knee-down silhouette as the stance reference. Author short planted-boot push, knee drag and recovery poses without wide leg extensions, unnecessary vertical bob or mirrored gear. Validate boot/knee contact and hand/pelvis/head registration at fixed scale/camera. Integrate only as clearly marked candidates until visual review. Do not claim the held-pose travel is grounded foot-locking. Keep current movement and combat unchanged while refining presentation.
