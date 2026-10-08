# Directional Combat 39 — work in progress

Verified starting HEAD and Railway SUCCESS: 175147d0181ccc095506838d7b902e6eaa65dbfa (Combat Flow & Melee 38), 2026-10-08. Same repository, production branch, service and URL. This document starts the art pass; it does not represent a deployed directional release.

## Frozen behavior

Preserve release 38 movement, input mapping, battery manufacture, physical strike timing/range/damage, defender escapes, stored-blast RT arbitration, collision and multiplayer authority. Preserve Bay Bridge environment, camera and existing checkpoints. No changes to main/master.

## Authored views

Eight distinct views: right, front-right, front, front-left, left, rear-left, rear, rear-right. Screen direction mapping must be verified against the renderer's world-to-screen projection rather than assumed from raw angle. Art view selection may quantize; combat aim and projectile flight remain continuous at 360 degrees. Use independently authored views rather than mirroring equipment and power hands.

Each view needs punch, driving kick, uppercut, turning kick and glove release. Minimum startup/contact/recovery: 8 × 5 × 3 = 120 registered body poses, with extra turning intermediates beyond that minimum. Key-pose studies are not completed runtime atlases.

## Identity and hand contract

The existing runtime ready-d03.webp in the shotgun-complete/runtime family is the front-right identity reference. New art must preserve its helmet, tall proportions, black/silver/magenta armor, cyan backpack, Panther boots and short tattered magenta banner. Earlier preview sheets contain boot/detail drift and cannot override the runtime reference. Right glove is weapons; left glove is psychic powers. Glove-release poses and launch-origin registration use the anatomical left hand in every view.

## Registration and audit

Use consistent cells and actor scale, calibrated planted-foot anchors, explicit hand-origin metadata, full extended-limb margins and actual alpha. Separate projectile, glow, trails and impact effects from body layers. Verify rear equipment occlusion, foreground/background straps and arm ordering. No baked backgrounds or neighboring-cell fragments.

Inspect startup/contact/recovery and turning motion in all eight directions; verify angle-boundary transitions, moving targets, interrupted chains, cover occlusion and left-hand blast launch. Compare visible projectile trajectory with actual collision trajectory. Existing combat tests must remain passing. Report asset inspection, renderer checks and real-device/controller checks separately.

## Current stage

Starting eight-direction punch-contact and glove-release key-pose studies against the runtime reference. No new generated art has been accepted into the renderer. Production remains release 38 until all required registration and verification pass.

## First key-pose audit — 2026-10-08

Generated eight-view punch-contact and left-glove release studies plus a targeted front-facing three-phase punch correction. Front-facing punch now uses readable toward-camera foreshortening. The multi-view sheets still repeat side-facing attacks where front/back attack directions are required, and anatomical hand consistency is not yet accepted. All three files are RGBA and sampled exterior pixels have alpha zero; visual preview colors alone are not proof of an opaque background.

Reject these studies for runtime use: boot laces remain and chest armor/neckline differs from the runtime reference. No new sheets are registered or installed, and no directional release is claimed. Next asset work must correct identity and exact attack direction in small per-direction strips, then validate anchors and animation before accepting a runtime atlas.

## Continuation recovery and six-pose correction — 2026-10-08

Recovered remote HEAD a9bf74b14b681c49a5f8ae7960c928699d7a552d without resetting or rebuilding. Prior local source snapshot has no Git metadata; no claim can be made about the previous session's uncommitted Git state. Main gameplay, renderer, API and room-store content match remote HEAD. Restored differing local verification/config files into a separate working snapshot; prior files remain untouched.

Read god-mode-fight-report37.json: schema 1, Psychic Grip Flow & Bot Memory37, commit bc08097a991e05435d85da13a4f36ace8d2b33a0, ten completed rounds and one abandoned session. Slot charging totals are 95.040 and 102.194 seconds; charge rejection counts are 35 and 43. Schema1 contact totals do not establish confirmed player damage or successful follow-ups. Sampled the 444.19-second ScreenRecording_10-07-2026 23-53-42_1.mp4 at 30/90/150/210/270/330/390/430 seconds: watch-mode bot/Grip scenes, not evidence of release38 controller/melee or Directional39 deployment.

Current defaults retain move222.7, doubleTap.28, brake9.5 and chargeMoveScale.67145. MOVEMENT_FEEL_28.md explicitly supersedes older boost620/.19 and slide689.15949375: current boost430/.16, slide490/.50, sustain160, steer5/.48 remain untouched.

Six-pose identity correction batch: front-right punch startup/contact/recovery plus anatomical-left glove startup/release/recovery. Initial output rejected for laces and exposed chest drift. Targeted correction removes laces and closes chest armor, but exact direction and runtime identity still need acceptance; front-right attack reads too sideward. No crop/registration, atlas replacement, renderer integration or deployment performed. Corrected output is RGBA1536x1024, alpha0..254; sampled exterior probes mostly zero with one alpha1 sample. Transparent pixels alone do not establish clean effect separation or production acceptance. Generated studies remain review references, not approved assets.

Re-run evidence: melee38, connections34, integration31, grip36 and actual client persistence/export tests pass. Frozen38 passes1800 frames against retrieved exact37B game.ts. Older cover-movement and cover-exposure harnesses fail before assertions on current imports (Cannot use import statement outside a module); these are unverified, not passes. No real-device/controller or internet-latency validation. GitHub combined status for recovered HEAD has no statuses; release38 deployment SUCCESS stated earlier in this document was not independently re-established in this continuation.

Next batch must author one exact front-right strip with locked identity and calibrated planted-foot anchors, keeping anatomical-left launch origin explicit and body effects separate. Confirm attack direction against deck projection before expanding to front/back/side views. Do not adopt the mirrored prototype as final direction coverage or change current mechanics to match artwork.
