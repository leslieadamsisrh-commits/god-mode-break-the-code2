# Guided cover review — RPReplay_Final1791097496.mp4

92.87 seconds, 732x510, 30fps with audio. Entire timeline inspected at one-second intervals. 32–38 seconds inspected at eight frames/second; 40–46 at four frames/second; full-resolution frames41.5,42,43,59,92 resolve pose changes and guide states. This is sampled temporal inspection, not uninterrupted playback. No raw input, latency, frame pacing or exact recorded deployment identity inferred.

Current HEAD27d54ac2086053040de00d13b7e2af61a2085048 and exact Railway deployment verified SUCCESS before review. No runtime/assets/controls changed in this review.

## Feedback and evidence

| Time / task | Visible evidence | User approval | Investigation / smallest next step |
|---|---|---|---|
| 00:00–00:23, Cover fire | Movement around first horizontal and narrow/tall blocks, repeated departures/returns, front/side/end overlap | No approval inferred from motion | Broader angle evidence than previous clip. Do not claim all cover angles fixed from sampled images |
| 00:24–00:46, Cover fire | Repeated crouched and raised gun/body poses beside right side of tall block.41.5/42 retain roughly the same ground ellipse while body/weapon presentation changes;43 shows raised pose | At43 guide explicitly says Issue reported,0/3 | Cover fire remains unresolved. Audit pose source/direction and return-to-brace alongside geometric depth; do not keep treating every silhouette change as a clipping defect |
| 00:47–00:58, Cover escape | Repeated departures, slides, reapproaches, side/corner contacts | Task2 remains Untested;0/3 | Preserve prior v1 user-approved escape mechanics. New footage is motion evidence, not new approval or full zero/full battery certification |
| ~00:59–01:32.87, Recharge | Charge-looking poses/aura, weapon return, powered movement, shield and repeated wake trails | At59 still task2 Untested; final92 task3 Untested,0/3 | Preserve approved charging/movement; do not tune from inferred button timing. Repetitive magenta rings remain secondary readability work |

The clip shows cover-occlusion-v2. The earlier cover-charge-v1 escape/recharge approvals remain historical; current untested checkboxes do not revoke them or certify this version.

## Source and routing reproduction

Read actual installed routing plus original cover-d00/d12/d03 assets. All are six250px cells in1500x250 sheets. The current shared .86 ground anchor and anatomical scale remain unchanged. Alpha bounds at threshold30 (source coordinates):

| View | Aim frame2 height | Fire frame3 height | Return frame4 height |
|---|---:|---:|---:|
| d00 |142|176|133|
| d12 |136|170|142|
| d03 |139|133|148|

Visual source inspection confirms d00/d12 frame3 raises the weapon steeply upward relative to horizontal aim and lifts the body. That is a pose change, not something a wall mask can correct. It is a presentation mismatch to investigate against intended recoil; bounding heights alone do not prove anatomical stretching or a changed collision anchor.

Executed actual spriteFacing(), coverPoseFrame(), coverConnectorFrame() in a Node VM: d00/d12 aim/fire/return choose original2/3/4; neither uses the approved connector. d03 fire/retract choose approved0/1. On right-side wall (normal+X), settled brace chooses d00 while active d03/d12 aim and return retain gun facing. Thus direction/atlas changes at the end of return are a second code-confirmed boundary. Exact routing on each video frame remains unknown without host/inspector evidence; do not assign this reproduction as the proven cause of every recorded issue.

## Speech limitation

Adobe upload succeeded and media_summarize started task aee85309-cabe-43f9-8959-3a51623c6427. Its advertised summarizePoll tool is unavailable in this session. The available general image status tool rejects this returned task ID format. No completed speech result/transcription obtained; no spoken words invented. Do not restart processing or claim summary completion. The visual review is complete independently.

## Decision and exact next step

Cover fire is still Issue; do not advance gun/psychic/carry artwork or alter approved movement. Keep38cfb31 geometric correction and solid opacity while reproducing the right-side aim/fire/retract/settled-brace boundary with actual host direction/state and original d00/d12 pose sources. First prove one horizontal view (d00); reuse valid brace/aim/return art. Correct source registration/routing only when reproduced. If the raised recoil source is unsuitable, prepare only a crouched horizontal d00 recoil connector, show it for required visual approval before installation, then verify one whole chain. d12 follows separately; no mirroring or bulk directions. Keep the gun direction, pelvis/ground anchor, body height and wall edge visible in the comparison.

No new tests/build needed for documentation/source audit only. Controller view is recorded evidence but does not establish every input/resource boundary; two-client networking remains pending. Five references, approved Jade, mechanics and visual approval gates stay unchanged.
