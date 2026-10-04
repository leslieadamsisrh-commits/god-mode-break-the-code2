# Guided playtest — RPReplay_Final1791095373.mp4

131.1 seconds, 732x510, 30 fps, audio track present. Full timeline inspected as one-second frame sequences; 48–54 and 99–105 seconds inspected at quarter-second intervals. Full-resolution feedback frames at56,80,87,91,95 and131 seconds resolve guide text and final status. This is sampled temporal frame inspection, not uninterrupted playback. Audio transcription unavailable; no speech extracted. Raw input, latency, frame pacing and exact deployed build cannot be inferred.

Current branch checked: 3d9150c52d8cd680d7c68a3d44c1f0fba5d91afb. No runtime edits in this review. Guide batch cover-charge-v1 visible throughout, with user feedback distinct from engine checks and visual-art approval.

| Task / timestamp | User feedback visible | Gameplay evidence | Intended behavior / suspected cause | Next reproduction |
|---|---|---|---|---|
| Cover fire,00:00–00:59; status confirmed00:56 | Issue reported,0/3 approved | Repeated upper-body pose changes beside perpendicular blocks; around00:48–00:54 firing effects/projectiles and crouched/raised stances occur while Jade stays beside cover | Aim/recoil/retract should connect with consistent anchor and clear muzzle. Clip does not tell whether issue is aiming, blocked shot, scale/pose jump or input response. Do not assign cause from lack of motion or inferred LT/RT | Reproduce expose/fire/retract on the same cover configuration and facing with host state plus rendering. Inspect cover normal versus gun facing, peek/clearance, fire/recoil/return timers and source registration. Resolve actual defect before more connector artwork |
| Cover escape,~01:00–01:33; feedback confirmed01:31 | Feels good,1/3 approved | Several visible departures and returns, slides and changed cover arrangements; battery varies | Preserve approved escape behavior. This feedback does not separately certify every low/zero/full-battery or moving-cover boundary | Retain current mechanics; existing boundary tests remain separate evidence |
| Recharge,~01:34–02:11; final frame02:11 | Feels good,2/3 approved; task1 issue remains | Repeated charge/aura-looking stances, weapon-ready returns, firing effects and movement. Dense01:39–01:45 shows stance/action switching | Preserve .67145 charge, fresh-Y interruption/retained battery and weapon return. Input timestamps not known | No speculative tuning; existing charge boundary tests and live host chain separate |

The guide remains visible and usable in the iPad recording; task changes and manual statuses are legible at full resolution. This is user-recorded usability evidence, not a comprehensive device/network certification. Stacked magenta wake rings remain a secondary readability item, not the current blocker.

## Decision and exact next step

Cover fire is an explicit unresolved user issue. Prioritize it over the previously planned gun/create/grip/carry/drop/throw art batch. Preserve the two positively marked behaviors and all protected mechanics/art. Clarify the cover-fire symptom if spoken feedback cannot be recovered; then reproduce the smallest state/render boundary before patching. Do not regenerate approved art or expand directions until cause and genuinely missing pose are established. No automatic or artistic approval inferred from these checkmarks. Five reference principles remain unchanged; no new tiers/abilities/control remaps.

## User clarification and follow-through
User clarified the Issue as Jade overlapping the wrong cover surfaces at different angles, obscuring pose transitions. Revisited dense fire frames and 48–71 overview; code/geometry reproduces whole-block depth ordering at rotated near corners. See COVER_OCCLUSION_REVIEW.md for the targeted correction and limits. This supersedes the earlier need to ask which cover-fire symptom was intended. Escape/recharge remain positively marked; no speculative movement tuning.
