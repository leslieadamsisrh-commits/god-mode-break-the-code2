# Raptor 39T10 — continuity and cover

Base/live verified: 64ea988824bbef2ebee8a2ef941147155f6adca6, branch studio/39t9-slide-proportions; Railway SUCCESS cb49ce88-81e6-4743-94d2-1f97d73dfca4. No staged changes at start. Work branch studio/39t10-continuity-cover preserves that base. This document's containing commit is the new checkpoint.

Evidence: ScreenRecording_11-06-2026 17-01-37_1.mp4; prior sampled review reused. 0:33–0:36 direction/mass; 0:56 and 1:04 trailing feet; 0:58–1:01 rapid cover-side transitions. Footage does not identify input edges or prove a collision defect.

Confirmed fixes:
- lib/raptorPose.ts: cosmetic hitUntil incorrectly interrupted slide, gait and jump clocks even when physical knock was zero. Only physical knockback now interrupts. Damage feedback, damage, knock timing, physics and input edges unchanged.
- lib/cover-occlusion.ts and app/Game.tsx: existing sparse local-only concealed-player cue covered architecture but omitted ordinary cover. Added the same quiet point-cue treatment using the actual projected cover-face mask, including rotated/fragment geometry. No sprite replay, opponent reveal, cover transparency, collision changes or muzzle effects through walls. Cue follows slide height. Existing structure cue unchanged.
- Lab label advances to 39T10; all 208 sprite pixels and all registration/scale records are frozen at 39T9.

Art disposition: inspected slide/right/001.png, slide/front-right/001.png, slide/front-left/001.png, slide/front/001.png against the already reviewed idle/front/000.png, idle/back/000.png and rear diagonal movement. Sampled front/rear views and rear trailing feet differ in angle and posture. No additional anatomy repair is justified by those comparisons alone; preserve the approved slide and defer residual mass/foreshortening polish. No generation in this pass.

Checks completed locally:
- check-raptor-continuity-cover.cjs: 8-direction hit-flash slide/recovery/moving-fire and all 6 jump phases; actual knock still interrupts. Actual slideAction dispatcher isolated from unrelated simulation: single edge dispatches dash; held input does not retrigger; second/repeated edges intentionally dispatch classic slide. This is a unit test, not an end-to-end collision reproduction.
- check-raptor-pose.cjs: existing 8-direction tests at 30/60/120 Hz pass.
- check-raptor-socket.cjs: 288 projection round trips pass; existing Jade socket geometry unchanged.
- check-cover-cue.cjs: real Canvas raster pixels remain inside the same cover concealment mask; rotated walls, standing/sliding, empty space, opponent, dead player and assembling cover cases pass. Optional test harness dependency: @napi-rs/canvas (not a runtime dependency). Run with TypeScript and this package resolvable through NODE_PATH or a temporary test install.

Measured unresolved combat decision:
Actual bodyRegions/shotPlayerTime with cylinderTime27d: standing height 78*scale; centerline z=10/40/70 shots hit and z=90 misses at scale 1. Slide height is 45.24 at scale 1. Upright Raptor art reaches about 99 display-height units before the shared projection. Thus portions of the upper silhouette extend outside the hit volume. No hitbox or damage/balance changes made. Recommendation: separately calibrate Raptor-specific head/torso/low volumes against anatomical landmarks, excluding tail and weapon, then playtest fairness rather than enlarging every collider.

Pending: production build and live normal-speed verification after isolated deployment. Do not infer deployed behavior from local tests. Next gameplay milestone: decide body-volume calibration, then Jade's own jump and a playable level/story encounter. Minor directional mass/foot polish deferred.
