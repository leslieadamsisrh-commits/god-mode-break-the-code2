# Raptor 39T8.1 — push-off anatomy review checkpoint

Base: 144907c5dfe5aa72a42fe2edf21dd1870260f383, studio/39t8-locked-anatomy-jump.
Work branch: studio/39t8-1-push-off-review. No runtime changes or deployment.

## New work

Generated a non-destructive push-off correction using saved 000.png as edit target and 002.png as the approved-anatomy cleanup reference. Source: exec-76a8777a-ad46-43a2-8db0-f9e5533bf535.png. Preserved original rejected 000.png. New push-off-v2.png is a uniform 1280-to-512 export with alpha preserved; no anisotropic scaling or leg warping.

Prompt: Correct only both legs in the push-off target. Shorten long thin lower limbs, restore compact muscular calves/thighs from apex. Preserve compact feet and claw lengths. Moderate knee extension down/back and bent digitigrade ankles. Preserve head, neck, torso, arms, gun, armor, right optic, backpack, tail, palette, camera and style. One sprite on transparent background.

## Frame audit

| Phase | Observed concern | State |
| --- | --- | --- |
| Original push-off | Long thin calves and narrow elongated feet | Rejected; preserved |
| Push-off v2 | Fuller shorter calves, compact feet; pose is more flexed and feet end higher than original | Candidate; motion acceptance outstanding |
| Ascent | Calves appear slimmer than corrected push-off; assess transition for volume pop | Provisional |
| Apex | Saved cleanup reference for compact anatomy | Reference; registration still to verify in motion |
| Descent | Straighter lower legs and spreading feet; check perceived limb length against apex | Provisional |
| Landing | Compression changes body silhouette and equipment position | Provisional; contact timing must be reviewed |
| Recovery | Torso rises from landing; check neck/head and gun continuity at idle handoff | Provisional |

These are visual audit observations, not measured bone lengths. No complete cycle is accepted. Seven other directions remain unbuilt; do not copy unresolved defects into them.

## Review player

Open art-review/jump-right/review.html with its sibling PNG files. It offers original/corrected push-off comparison, six phase stepping, quarter speed, fixed registration and optional illustrative arc. Hold durations illustrate the existing phase windows; arc and timing are not authoritative gameplay simulation.

## Validation

- Re-ran scripts/check-jump.mjs: PASS.
- Re-ran scripts/check-jump-integration.cjs including posture, anchor, directional gait, movement normalization and firing tests: PASS.
- Inspected all six saved PNGs and the new normalized candidate.
- Browser playback verification BLOCKED: Playwright browser absent; browser download returned invalid/truncated archive. Review player is not claimed browser-tested.
- No production build, controller test, live loading verification or deployment performed.

## Resume

Verify fixed-registration and in-game motion before acceptance. Resolve push-off-to-ascent volume/registration, then descent-to-contact and recovery-to-idle continuity. Keep jumpDirections disabled until a complete directional set passes. Continue other directions only after right-facing anatomy is stable.
