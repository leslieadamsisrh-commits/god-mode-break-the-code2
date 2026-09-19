# V12 08H — user playtest review: af776e2d

## Source and review boundary
Uploaded recording: af776e2d-3dfe-4a41-81f8-8e09fd6f3646.mp4.
SHA-256: 160f34b79172b8186602b9b7746a3df44c7be06bf0fa3094cb0202297ae55e1f.
Duration: 234.566633 seconds; 1912 x 940; 30 fps.
Reviewed 25 overview frames across the clip, one-second samples from 00:00 through 00:24, and additional cover-interaction samples between 02:35 and 03:50. This is sampled visual/UI inspection, not exhaustive per-frame inspection. The recording has an audio track; no reliable transcript was obtained, and no spoken feedback or subjective approval is inferred.

Checked the delivered JADE_V12_08H_Movement_Flow.zip and fetched the archived approved/shotgun-lab-v57 selector and manifest. Branch head observed before this report: cfe0ec437cb381e621a9fdeab3350e5fe16cdf8b.

## Observed playback
- The header identifies V12 08H. Movement, aiming, firing effects and target-health changes are visible in inspected samples. No black-screen failure is evident in those samples. This does not certify performance or all mechanics.
- At 00:12 the UI reads CORNER RIGHT / RECOIL (AIM KEY) / FINAL JADE K03. At 00:13 it reads CORNER RIGHT / RECOVERED MOTION / RECOVERED MOTION ART. Similar switches occur repeatedly during the opening. This is a visible artwork-source change without leaving the named corner state, not evidence that the approved character was deleted.
- At 02:45 the X-ray checkbox is on; by 02:48 it is off and the independent barriers render opaquely. This confirms a presentation toggle in the recording, not a world-collision certification.
- From 02:52 to 03:10 the UI shows COVER SHIMMY and CORNER RIGHT/LEFT near the smaller barrier. At 03:20 it shows SLIDE ENTRY. Around 03:30 the supported corner shows final Jade again.
- The final-design poses and recovered poses differ visibly in detail, silhouette and apparent body position relative to the root marker. Ground/contact registration across source families needs inspection. Do not adjust collision size or identity to conceal this difference.
- No continuous, drawn shoulder-raise/recoil/retract sequence is established by the footage. The small-lift toggle is enabled, but those samples remain existing deformations, not new authored frames.

## Confirmed source issue: cover metadata was lost in the reduced runtime catalog
The delivered app.js treats any attached actor as family 'cover' and calls Flow.frameAt(totalDistance, frameCount, 'cover'). motion-flow.js cycles the entire sheet by distance. It does not use per-family coverPoses metadata to distinguish brace, lateral movement, peek, fire, return or kick.

The archived selector at recovery/shotgun-lab-v57/lab-pose.js explicitly chooses those roles using item.coverPoses and contact/shot/peek timing; only poses.lateral is cycled for lateral travel. Git blob: 9115105949813bb0424640c9ee68ce0760c062a3.

The archived assets/shotgun-complete/manifest.json (Git blob d17ded5aa7edff0f2184c8c91fa92d3666511c96) provides an inspected example, cover-d07: contact [0,1], brace 1, lateral [], peek 2, fire 3, return 4, kick 5, recovery 1. Other inspected cover views d16/d17 have that same map; do not assume all 24 maps are identical without reading them.

A local Node reproduction executed the exact delivered 08H frameAt function. For a six-frame cover sheet, total distances 0,15,25,35,45,60 select indices 0,1,2,3,4,5 respectively. Thus a stopped actor whose accumulated travel is 60 can retain the original kick slot, despite no kick event. The selector cannot know that the actor is stopped, aiming or firing because those states are absent from its inputs. This is a code/metadata defect, not evidence that new drawings or faster processing are needed to select the existing brace correctly.

## Separate coverage limitation
core.js supports final-design artwork only at the station's south face, right edge, with absolute wrapped aim <= 0.34 radians. Leaving that supported heading uses recovered art. That boundary explains the possible source switching; the exact inputs for each video instant were not supplied. Do not widen the range and falsely claim the one drawing is valid at arbitrary headings. Do not mirror asymmetric equipment.

## Next fix priorities
1. Restore per-family cover role metadata and state-aware selection before expanding artwork. Stationary cover must select brace; fire/kick/return require their corresponding events. Lateral arrays may be empty and must not be replaced by cycling unrelated poses.
2. Restore and inspect original per-frame anchors/muzzle metadata where available. Current final-source support-foot anchors and recovered cell anchors must be reconciled against a common world root without retuning physics to hide a registration problem.
3. Keep the final-design coverage limitation visible, then produce the missing same-view shoulder/recoil/retract and adjacent supported views. No redesign or fake 360 coverage.
4. Recheck same inputs with the old selector and corrected selector while keeping movement/projectile outputs unchanged. Verify corner stops, reversals, firing, return and kick independently; do not claim hand-authored shimmy where the source has no lateral frames.

## What changed in this pass
Saved this review and reproduced the selection issue locally. The comparison image JADE_V12_08H_User_Playtest_Review.png consists of same-area video crops at 00:12 and 00:13 plus factual labels, enlarged only for inspection. It is not new character artwork.
No gameplay, sprite, movement, deployment setting or protected baseline was modified. No new build or deployment is claimed. No autonomous agents were launched. This commit contains the report only, not the uploaded video or image binaries.
