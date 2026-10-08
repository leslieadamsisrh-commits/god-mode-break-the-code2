# Grip Strength 36 — 20% experiment

Continue from5de713dc3221e8ba7065958cf8440ebd066ef34e on studio/live-app-three-section-01; exact RailwaySUCCESS verified7c8adb7b-19c7-43ab-8fde-7a23f53db4ef. Same repo/service/URL/master/checkpoints.

Reviewed uploaded321.87-second footage ScreenRecording_10-07-2026 23-29-25_1.mp4 from scratch:15-second overview samples and dense0.5-second samples at15–19sec, full60sec frame. At approximately17.5sec the bot caption explicitly says PLACE→RELEASE LB; near18sec it reacquires crowded cover near the cabinet. The60sec view shows both retreat/recharge. These are sampled observations, not exhaustive event counts, and video alone cannot distinguish every canceled release or energy rejection.

User-authorized GRIP_STRENGTH1.2 multiplies swept carry response, angular response/limit, travel cap550→660, and physical Grip release velocity/caps. Gesture fling cap720→864 and slide cap240→288. Explicit LB+RT cover/fragment throws also gain20%. Free-roam legacy carry receives the same response increase. Orbit launches are unchanged. Field reach135/235/335, costs4/3-per-sec/6, mobility, camera, weapons, controls, collision hulls/rails and approved assets remain unchanged. Higher impact speed naturally changes calculated cover-impact damage and shield burden under the existing caps; no extra damage multiplier. Friction unchanged; actual travel depends on obstacles, breakage and impact.

Fixed a35 bug: releaseGripGesture correctly assigned rubble velocity/owner, then cleared both on detaching the held fragment. Now only clears heldBy on a voluntary physical release. Cancellation cleanup still zeros velocity and clears ownership. Added tests for drop/slide/fling rubble ownership and subsequent actual travel.

Controlled A/B using identical positions, held velocities, energy and friction, factor1.0 versus1.2:

| Release | Before speed | After speed | Before travel | After travel | Cost |
|---|---:|---:|---:|---:|---:|
| Slide |195|234|67.91|84.70|6|
| Fling |674.47|809.37|271.10|328.52|6|

World units and world units/sec. Clear-floor travel rises about24.7%/21.2%, rather than a universal20%, because the unchanged stopping threshold matters. Explicit cover/fragment impulses test exactly1.2×; DEFAULT_CONFIG is unchanged. Carry target position after8 identical frames350→423.33 before,350→438 after. This is an actual movement comparison, not a promise about human perceived lag.

Two ordinary-input300-second bot audits with swapped spawns retained all three release kinds and bounded resources/effects. Normal:47drops/20slides/19flings,19throw→movement→shotgun-hit chains,10throw player contacts,72total shield contacts,4–4wins. Swapped:38/22/13,18chains,10throw contacts,76total shield contacts,11–0wins. Chains need not include a throw hit. Bot choices are unchanged; stronger Grip does not imply more frequent throws or competitive balance. Side/strategy bias remains severe in the swapped sample.

Verification: grip36 controlled A/B and fragment regression; grip35 all-mode/two-slot release, simultaneousRT, cancellation, shielding, break-through; connections34/restoration27/integration31/economy30/combat26/three-cover25/fight24/spatial21/stage28/psychic29/matter33 pass. Psychic29 includes1500 frozen movement-frame comparisons. Production build/typecheck pass. Actual native renderer inspected bot arc/push/drop/slide/fling/shield events plus both-slot held-sedan views; uses approved ready-d00 proxy for native poses, not full directional animation certification. Existing cramped cover, vehicle deformation, missing authored carry poses and human controller feel remain.

Production HTTP35/32/28 checks verify two authenticated slots, analog transport/release, stale safe drop, spectator commands/isolation, private invite, input ownership, stream and reset. Localhost verification does not prove iPad controller latency or real WAN performance.

Commit/deploy on the same service; only exact RailwaySUCCESS verifies publication. Reload the existing watch URL and start a fresh session after publication. No new art/AI decision policy/tier/weapon in this pass.
