# Cover occlusion correction — 2026-10-03

User clarified the unresolved Cover fire issue: Jade crosses the wrong cover surfaces at different angles, preventing a useful review of pose transitions. Preserve approved escape and recharge feel. This takes priority over new connector art.

Recovered branch HEAD 785c2dfb353380d88fbf6052debc75039305016a, Railway SUCCESS (bc23b267-703a-4835-819e-82e00054e26b). Workspace source available without .git; no AGENTS.md found. Approved d03 recoil/retract, psychic and d00/d03/d06 charging assets remain installed. No artwork generated or replaced.

## Evidence and reproduced cause

Reuse VIDEO_REVIEW_1791095373.md: full timeline sampled at 1 Hz, 48–54 and 99–105 seconds at 4 Hz. Revisited 48–54 and the 48–71 overview after the user's clarification. This is sampled-frame inspection, not continuous playback; audio transcription unavailable. Exact inputs, latency and deployment identity are not inferred from video.

The old renderer sorted an entire cover at its greatest ground Y. Thus a distant corner put the entire solid in front of Jade even when she was beside its nearer surface. An independent vertical-ray geometry test reproduces this; the actual renderer comparison shows the near-corner recoil torso incorrectly hidden by the old ordering. The source picture alone cannot certify every symptom in the recording.

cover-depth-render-comparison.png uses the actual fighter()/cover() functions, approved d03 recoil image and original concrete atlas in a Canvas renderer: front, side, rotated near and far positions, before/after. These are authored presentation fixtures, not input/controller/network gameplay evidence.

## Rule and implementation

| Boundary | Rule |
|---|---|
| Actor presentation | Its existing grounded Y remains the depth anchor. Input, facing, collision and animations are unchanged. |
| Solid cover | Clip the rotated floor footprint to material in front of that anchor; project this solid using the exact existing cover height 15616/332. Only its silhouette can obscure the actor. |
| Multiple covers | Intersect one opaque exclusion clip per cover. Overlapping exclusions must not XOR and reveal hidden pixels. |
| Moving cover | Recompute from current interpolated position/rotation, with no cached cover ID or host mutation. |
| Created cover | Preserve translucent formation; opaque masking begins at the existing .72-second completed formation. |
| Matter | Keep matter/character ground sorting; use the same geometric occlusion so carried matter agrees with solid cover. |
| Effects | Existing floor wakes/Echo remain before cover. Character/shadow/shield/aura remain separate drawing systems, with the actor's existing draw callback masked. Shot/effect logic and collision unchanged. |

lib/cover-occlusion.ts is presentation only. app/Game.tsx paints cover once, then depth-clips matter and Jade, avoiding whole-block actor ordering. Anatomical scale, anchors, approved artwork, controls, battery, charging, escape, camera, multiplayer authority and all five reference principles remain unchanged. No engine edits.

## Verification

- 90,132 independent depth/pixel checks pass across long/wide blocks, six rotations and seven ground depths; near-corner regression, moving transforms, overlapping exclusions, formation and shared-height checks pass.
- cover-movement: 1,963 checks pass.
- combat-cohesion: 26 solo/joined host/guest snapshot stages pass.
- psychic-art and cover-art checks pass; production build/type checks pass.
- Actual-source Canvas comparison inspected: corrected near corner reveals Jade's front-side torso without making solid cover transparent; opposite-side obstruction remains.
- Guided batch bumped to cover-occlusion-v2 and task1 now asks front/side/corner overlap. Old cover-charge-v1 feedback remains stored and historical: escape and recharge Feels good, cover fire Issue. No prior approval is silently assigned to changed behavior.

Deployment and live browser verification are recorded in the final handoff after completion. Physical-controller angle/transition review and two-client networking remain pending. Do not claim sampled frames, Canvas fixtures, host snapshots or guide checkboxes certify those.

Next exact step: controller recording of task1 at front, side and rotated/moving corners, LT expose/RT fire/LT retract. Preserve escape/recharge; investigate any remaining visual boundary before new gun/psychic/carry connectors. Do not regenerate approved art to solve depth ordering.

## Deployed verification

38cfb31a1197a07861f703f52845dfb13b961f5b — Railway SUCCESS (ed5df834-5dc5-4069-866a-87e755f3958c). Live UI confirmed v2 task text, all statuses Untested and intact approved recoil/retract preview rendering; previews restored off and Classic/.67145/scale/camera intact. live-cover-occlusion-38cfb31.jpg is a production preview/UI proof, not a reproduced corner gameplay sequence.

Fresh ordinary-input host chain after SUCCESS passed contact -> brace -> d03 exposed fire -> LT release -> outward escape -> fresh Y -> full release -> combat. An attempt during deployment encountered ROOM_NOT_FOUND/404 when the in-memory room was replaced; rerun from a fresh post-deploy room passed. Available browser keyboard actions did not drive a reliable complete cover traversal, so full live rendered angle/moving-cover/controller and two-client checks remain pending. No controller approval fabricated. The geometric and actual-renderer fixture checks establish the correction independently.
