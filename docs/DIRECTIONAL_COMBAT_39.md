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
