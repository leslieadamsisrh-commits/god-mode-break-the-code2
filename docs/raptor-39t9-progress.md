# Raptor 39T9 proportion checkpoint

Base: 9cfab6a517fea1f1deccb7d55ba9b3921cc130d6 (39T8.2), verified live SUCCESS deployment 3577e4a0-3dfe-4a92-b481-cfbe82505101 before changes. Work branch: studio/39t9-slide-proportions. This file's containing commit is the saved asset checkpoint.

## Locked reference
Runtime assets under public/assets/raptor-v2: slide/right/001.png, slide/front-right/001.png, slide/front-left/001.png; slide/front/001.png supports frontal identity. Approved slide pixels frozen. Evidence: ScreenRecording_11-06-2026 08-43-42_1.mp4, especially 2:40–2:44 for relative size. Other transition defects confirmed by runtime sprite inspection; no invented video timestamps.

## Confirmed defects and corrections
- Idle and locomotion registration displayed Raptor substantially smaller than Jade. Original right idle crown-to-foot was about 61 world display pixels against Jade's 90 at spriteScale 1. Uniform per-family/per-direction drawScale now targets approximately 99, preserving natural crouch/slide/tuck height. No tail/weapon bounding-box normalization or nonuniform sprite distortion.
- Front idle, stalk, jog and jump had narrow skull/neck outliers. Replaced only idle/front/000.png, stalk/front/000–003.png, jog/front/000–003.png and jump/front/000–005.png (15 files, recovery duplicates idle). Broader skull/jaw and thicker neck follow the approved frontal slide. Correct anatomical right optic retained. Frontal sprint and all other artwork frozen.
- Re-registered final front gait ground anchors and barrel centres after image generation/resampling. Jump uses existing airborne root positioning; final recovery exactly matches idle pixels/registration. No animation timing or selection-code changes.
- Per-direction/family scale lives in manifest.json, not a blanket whole-sheet multiplier. Ground/camera comparison uses actual Jade ready-d00 source at the existing 125px runtime cell scale. New /raptor-proportion-review.html provides eight-direction fixed-scale playback alongside Jade.

## Checks completed before deployment
- All 208 PNG dimensions, transparency, SHA256 hashes, frame coverage and uniform registration pass; 32 run aliases and exact jump-recovery/idle continuity pass.
- Jump state tests: phases, falling, recovery, repeat, interruption and frame gaps at 30/60/120 Hz pass.
- Jump integration and pose-selection tests: eight directions, moving fire and transition anchoring pass.
- Socket tests after final registration: 288 projection round trips, eight directions, elevation/cover offsets, invalid inputs and unchanged Jade geometry pass.
- Targeted stills reviewed for all direction families and all jump poses; final edited images checked composited over a colored background. Transparent RGB contains unused glow colors but visible alpha background is clear.
- Production build, normal-speed public browser playback and live asset hashes must be verified after deployment; do not infer them from unit tests.

## Preserved and deferred
No Jade artwork, physics, controls, damage, cover or hitbox changes. Existing 26 rear/occluded muzzle fallbacks remain explicitly recorded in manifest; no new fallback.
Material follow-up: shared bodyRegions still uses upright height 78*scale and existing radii; Raptor art now reads roughly 99 display units at scale 1. Projection and pose affect the exact screen mismatch, but larger head/shoulders can extend outside the unchanged hit volumes. Do not silently rebalance collisions. Validate this in the next combat/readability pass.
Minor gait/head-detail variation and extra jump polish deferred. Next milestone: combat/cover cleanup, then Jade's own jump; no new broad character batch.

Next action: deploy this branch's exact commit only to the isolated Raptor service, verify SUCCESS and live hashes, inspect public playback. Preserve master, XYZ and other services.
