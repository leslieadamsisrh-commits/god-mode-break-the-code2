# V12 08J — extended user playtest review: 967e4e03

## Source and inspection boundary
User upload: 967e4e03-2aab-4f0f-966b-fd9bb067d872.mp4.
SHA-256: bdbcfbceb7f489f7c071d7184a2a36c63476aeca1977e266d31d4360f36219f7.
Duration: 381.3333 seconds (6:21); 1902 x 938; 30 fps.
Inspected 33 overview samples from 00:00 to 06:20, detailed one-second samples from 00:50 to 01:06, selected cover samples from 04:55 to 05:24, and 100ms samples from 01:01.0 to 01:02.0. This is sampled visual inspection, not exhaustive frame-by-frame review. Audio is present but not transcribed; no spoken approval, complaint, or subjective control rating is inferred.
Read the repository VERIFIED-DELIVERY.md and checked the exact delivered 08J package's app.js, core.js, motion-flow.js and loader. Remote branch head before this review: aed0cdb3aed3b54c0a97fa4a00d6121d10894309. Local app.js SHA-256 a6ae3248d8cdf0001fd2b5b8c1533bcbb8fe9960c4afa1bef30b980919b5f855.

## What the recording supports
- Header identifies V12 08J. At 00:00 the UI reports 94 shots, 78 hits, 37 cover contacts, tick 27868; at 06:20 it reports 144 shots, 111 hits, 76 contacts, tick 50305. These are displayed counters, not independent validation of every event or proof of performance.
- The inspected start/end and detailed samples show 31 resident images and zero reported errors. No unexplained unoccluded missing-character event like the previous 08I example was found in the inspected samples. This is encouraging user-machine evidence for display continuity, not a guarantee that every frame of the recording is free of a transient dropout.
- Running, changes of heading, slide poses, corner states and cover movement recur. At 05:00 the UI reads CORNER WRAP. At 05:12 it reads COVER IDLE; the body is mostly hidden behind opaque barriers, but head/weapon pixels remain visible. That example is occlusion/readability, not evidence of an unloaded image.
- Target is Stationary and invulnerable training is checked in inspected samples. The 08H flow and 08I pose-routing toggles are enabled. No controlled baseline A/B comparison, combat-pressure rating, physical-button latency measurement or analog-input trace is established.
- The interface reports a connected controller, but the recording does not show hand inputs or provide a raw input log. Intent, unnecessary button presses, precision of stick movement and perceived responsiveness cannot be inferred with certainty.

## Main remaining visual issue: same marker, different stance
The fine transition samples show final Jade in low ready at 01:01.0-01:01.1, raised aiming art at 01:01.2-01:01.4, lower ready at 01:01.5-01:01.7, and recovered cover artwork at 01:01.8-01:02.0.
The corner marker and nearby barrier remain in the same screen location in the 01:01.7/01:01.8 comparison. The two drawings have visibly different pelvis/foot distribution and silhouette relative to that marker, in addition to the known design/detail difference. This supports cross-family stance-registration work. It does not demonstrate an actual physics-root teleport, and the drawing/view difference should not be mislabeled as a newly proven collision bug.

Source inspection corroborates the distinction: final-art selection uses C.FINAL[actor.pose].ground and ART_SCALE .205, while recovered art uses archived cover anchors (or a generic non-cover cell anchor) and scale 220/125. supported() is restricted to the station south/right corner and abs(wrapped aim) <= .34 radians. Leaving that coverage can change art without leaving the named corner. Exact user input at the switch is not supplied.

The original source dimensions, on-screen body scale, anatomical landmarks and collision radius are separate measurements. Do not match transparent bounding rectangles, shrink/repaint Jade, or move the physical collider just to hide the visual difference.

## Priorities after this review
1. Preserve the loader and action-aware routing fixes; keep visibility stress tests in regression coverage. This clip does not justify another wholesale skeleton/movement rewrite.
2. Use the supported corner as a registration fixture. Mark root, pelvis and both feet for each existing pose. Distinguish a pivot-foot anchor from the body's collision/stance origin. Compare repeated swaps at identical simulation position and camera settings. Preserve approved appearance and recoverable movement.
3. Complete the final-design same-view shoulder/stock raise, authored recoil and retract in the playable interaction. The sampled low/aim pose exchange is not a finished smooth animation. Small deformation studies do not create missing anatomy.
4. Treat heavy barrier occlusion as a separate readability/inspection issue. Existing X-ray mode can reveal contacts during review. Any future silhouette/cutaway is a separately evaluated presentation option, not permission to disable physical cover or bake scenery into Jade.
5. Expand validated final-design movement/directional coverage after a complete action is registered. Do not widen one drawing's aiming sector merely to advertise nonexistent 360-degree art.

## Evidence and change boundary
JADE_V12_08J_User_Playtest_Review.png contains native-resolution video crops at 01:01.7 and 01:01.8 with documentary labels; SHA-256 c30e5ae84459a02e8d60b92448cdc009c128e45be81f4ee0337265f6f34362e1. It is not new artwork, a runtime update or a generated concept.
This commit saves this review only. No game source, artwork, movement setting, collider, production approval or deployment configuration is changed. No new build or Vercel release is claimed. The uploaded video and comparison image binaries are not claimed committed to GitHub by this report. No autonomous agents were launched.
