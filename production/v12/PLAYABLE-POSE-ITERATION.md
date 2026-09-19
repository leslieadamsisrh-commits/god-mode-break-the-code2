# V12 — Playable pose iteration

Status: METHOD DECISION / IMPLEMENTATION NEXT. This commit changes procedure only. It does not integrate sprites, change gameplay, launch workers or verify a deployment.

## Decision and authorities
The user authorized reconsidering sprite-only production and developing combat interactions alongside the new poses. Adopt an isolated, input-driven Training Lab integration loop while retaining the pose viewer for detailed inspection. Do not wait for the entire final-design animation library before testing a limited action.

Unchanged authorities:
- Movement feel reference: v11.1, ba742b1019f80f3e2d71b166b32244c4ed686260. Preserve it as an immutable comparison; never overwrite or retune it to disguise an art problem.
- Appearance: combat-lab/JADE-FINAL-VISUAL-LOCK.md and its fingerprinted approved reference. Identity, costume, equipment, detail and large-character visual target do not change.
- Independent world cover: no wall, scenery or flash baked into character masters.

Protect the baseline, not every defect. Any proposed collision, cover-exit or muzzle correction is a separately identified experimental change. Compare and review it independently from art-only changes before promotion. No new psychic systems in this limited test.

## Evidence inspected for this decision
1. production/v12/08e/SOURCE-PIXEL-STUDY-RESULT.md records one unchanged source plus four small deformations, not a full authored raise/recoil/retract sequence. It explicitly does not establish gameplay readiness.
2. combat-lab/game.js currently selects run/slide/cover/ready in drawApprovedSprite. Its phase advances with player travel. No dedicated time-based raised-aim/recoil/retract sequence is selected there; adding images alone will not create that behavior.
3. The same file currently initializes projectile x/y from the actor in fire(), rather than a measured artwork muzzle. This is a concrete interface to correct and test in the experimental copy, not proof that final-design gunfire already matches the art.
These are source-inspection findings, not new browser playtest results. Recheck exact source revisions before implementation.

## First paired batch: cover raise / fire / retract
Work on an isolated copy/route or integration branch, not the protected runtime. The initial supported final-design action is one view at one right-hand edge. Existing recovered artwork handles run, slide and unsupported views. Missing final-design actions must be labeled; never mirror asymmetric equipment or pass a frozen stand-in off as complete animation.

### A. Integration probe first
- Expose actual simulation state to presentation through a small read-only state adapter: position, velocity, movement direction, aim direction, cover face and edge, slide phase and authoritative shot events.
- Before art changes, compare recorded input trajectories and slide duration against the baseline. Do not claim deterministic replay until input timing and wall-clock shot scheduling are handled and verified.
- Route current character-only candidates into only the supported action. Held keys are acceptable diagnostic placeholders, not authored in-betweens.
- Input starts aim, releases it, interrupts it and causes a shot according to explicit gameplay rules; no automatic pose loop running during ordinary play.
- Running/shimmy phase follows movement/contact intent; gun raise/recoil/retract has its own elapsed action time so it can animate while stationary.
- A single gameplay shot event drives the visual response. Do not spawn an additional damaging shot from an animation callback. Do not add a new firing delay just to accommodate long artwork without separate review.
- Use measured or explicitly provisional muzzle sockets transformed through the same world/camera mapping as the sprite; test obstructed paths. Never teleport a muzzle through cover to get a shot out.

### B. Art responds to evidence
Complete the missing same-view gun-lift, recoil and deliberate retract poses. Begin with the approved K02/K03 references and review weapon identity, support hand, elbow reach, stock/shoulder relationship, head and stable pelvis/foot contacts. Do not keep enlarging a small source-pixel warp to impersonate missing anatomy. Whole-character sprites do not acquire independently rigged upper/lower body layers just by drawing a skeleton beneath them.

Keep file-level acceptance, visual approval, runtime-test availability and final production readiness as separate statuses.

### C. Paired review, one change class at a time
1. No enemies: establish body/camera/cover alignment and readable large-character scale without changing physical collision size to match transparent image padding.
2. Stationary target: test raise, shot timing, muzzle, recoil, retract and whether the cover actually blocks shots.
3. Moving target: test aim arcs, view selection and loss/reacquisition of aim.
4. One attacking bot: test timing under pressure and exit/interrupt behavior.
5. Repeat ordinary run/slide approaches with new rendering enabled and disabled to distinguish movement regression from visual mismatch.

Add screen recording, pause/step and exportable events for input, state changes, asset/frame selection, contacts, shots and interrupts. This capture is proposed work, not an installed feature in this document.

Classify every observed defect before producing another frame: missing drawing; wrong selection/timing; anchor/projection error; gameplay/contact bug. Correct the responsible layer.

## Promotion gates
- Assets load locally; every required file is present and decodes. No silent fallback disguised as new artwork.
- Jade and cover can be independently hidden in review; cover occlusion and projectile blocking are separately tested.
- Ground/foot registration is consistent; no extra scale or root drift during pose switches.
- The established 145-degree control interpretation is not silently changed. Evaluate actual lower-body reposition behavior instead of treating a number in a file as completed anatomy.
- Supported action starts, fires and exits with responsive inputs. Interrupted/repeated inputs do not trap Jade or create duplicate shots.
- Ordinary movement comparison passes; any intended mechanic change is separately documented.
- Browser recording is labeled with the real test type. Physical controller and deployed URL tests remain unverified until performed.
- Identity, biomechanics, continuity, gameplay and render reviews are evidence-backed. These are responsibilities, not evidence of five executing agents.

## Release boundary
First deliver a limited experimental Training Lab test, not a complete HD character replacement. Keep old sprites for unsupported movement states. After one action works, expand the validated action/view matrix. Keep the protected baseline and final-design registry intact. Private deployment/access settings must be verified before sharing a new test URL; this method change does not authorize a new public release.

## External engineering context
Epic's official Paper 2D animation-state-machine documentation describes selecting flipbook animations from gameplay state and conditions. Its Animation Variables documentation derives animation inputs from character movement, and Sync Groups documentation addresses phase/foot-contact continuity when blending locomotion. These support the general design approach; they do not mean this browser game runs Unreal or already implements those systems.
- https://dev.epicgames.com/documentation/unreal-engine/paper-2d-setting-up-an-animation-state-machine-in-unreal-engine
- https://dev.epicgames.com/documentation/unreal-engine/how-to-get-animation-variables-in-animation-blueprints-in-unreal-engine
- https://dev.epicgames.com/documentation/unreal-engine/animation-sync-groups-in-unreal-engine
