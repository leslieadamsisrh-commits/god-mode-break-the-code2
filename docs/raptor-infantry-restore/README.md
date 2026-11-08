# Raptor infantry restoration — active checkpoint, NOT a completed release

Base: a34d9eef86987dddef540e83198d82ae80ef43e1 (39T15 references), runtime foundation 2b64e2d09714ae15899c5399545da29b464f7c56. Working branch: studio/39t15-1-cover-restoration. Current saved commit: commit containing this record (resolve branch HEAD). No restored image is active in the runtime manifest yet.

## Verified external state — 2026-11-08
Remote restoration HEAD was a34d9eef before creating isolated working branch. Railway project 9e9de944-48d2-4144-8109-e27bc853f68f / environment 4db57654-a1b5-44b3-9f0f-bd4575742af4 / service 142b4954-caf3-4c59-900b-bf963cdba0bd. SUCCESS deployment 4d0d8297-f927-4907-84e7-1eef0249eb41 still live 39T12 / 1fdddfe3710036879dac16c2f9da4e19c9d7fa87. Staged patch 2540cdb5-8790-46be-8ef0-5b001d94a39f targets 39T14 and only this service. Inspected, not applied or changed. No new deployment attempted: coherent restoration transitions are unfinished, not an approval blocker.

## Identity and approval
Original: original-approved.jpeg; SHA256 06d09d47d4702923f3511cd4f11275e160265b56a9ef832d50aed44443dbea64, unchanged.
User explicitly APPROVED compact two-cell rear housing in crouch-back-candidate.png and accepted restored crouch direction. This resolves the rear equipment decision. DO NOT request it again.
Original remains authority for muscular adult olive/dark-striped body, angular skull/substantial jaw, worn angular armor/red inset knee plates, substantial original weapon, cable-rich headgear, straps/pouches. Anatomical RIGHT optic; LEFT natural. No mirroring. Design B and narrow-head experiment rejected. Approved slide/front-right/001 remains frozen pose/body reference.

## Reused audit / discrepancy resolved
Reuse inventory.json and eight audit contact sheets: 219 existing runtime frames, prior hashes/registration and repair classification. No full reaudit performed. All existing runtime PNGs and manifest remain untouched in this checkpoint.
lib/raptorSpriteOnly.ts discrepancy resolved before edits: local had exactly one extra trailing newline. Removed it; Git blob hash then matched remote d0119def4e3c00a6a7fad4873d1e7c7682d0ff51. Subsequent intentional change only adds cover-pop count=1.

## Completed local changes saved in this checkpoint
- identity-lock.json: rear-housing approval, accepted direction, current base/branch.
- lib/raptorPose.ts: dedicated cover-pop family; explicit directional coverPopDirections/coverLeanDirections availability; clearance helper and rendered exposure/fire share selection. Existing manifest has no pop directions so active behavior remains unchanged.
- lib/raptorSpriteOnly.ts: supports one-frame cover-pop family when enabled by a future complete asset batch.
- tests/check-raptor-restoration15.cjs: asymmetric directional availability checks, expose/fire parity with clearance probe, retraction, unchanged active inventory.
- batch-a/idle-front-right.png: new original-derived standing reference, exec-ab86d3f0-70fc-4811-9849-c66a3ffbdb0a.
- batch-a/hold-front.png: corrects overly upright old frontal crouch with hip hinge/forward torso, exec-3d8d8510-b2d9-458f-9bac-1c00ac314c53. No nonuniform scaling.
- batch-a/hold-front-left.png: natural-eye-side hold, not mirrored, exec-3a21936c-d2d8-4979-8c46-16040ec23ff2.
- batch-a/pop-front-right.png: raised aiming pose for low cover, exec-12bcad7a-b456-41f7-b921-98024f4c7028.
- batch-a/hold-right.png: targeted correction of flat/thin skull and elongated generic weapon, exec-448c79c2-831a-4ae2-883e-5fe4793a219f. Side identity improved; skull/body matching through turning still provisional.
- batch-a/registration.json: manual anatomical landmarks, foot anchors and candidate muzzle/muzzle-ground pairs. Protected/exposed sockets distinct. Rear muzzle occluded, not invented.
- batch-a/jade-ready-d03.webp: unchanged calibration fixture downloaded from existing Jade URL recorded in registration JSON.
- batch-a/calibrate.cjs + calibration.jpg: repeatable same-ground projection trial, not actual match playback.
- batch-a/compare-original.cjs + original-comparison.jpg: original / existing hold / corrected hold / low-pop comparison. Display-fit only, clearly labeled.

## Calibration and art limits
Raptor front-right standing anatomical crown-to-foot about77.18 projection units vs Jade70.11 (~1.10 ratio), excluding cables, tail and gun. Manual landmarks approximate +/-5 source pixels; not proof of exact anatomical equivalence. Other poses have individually authored uniform trial scales, NOT blanket multipliers. Side crouch mass/head relationship remains provisional. Candidate alpha and complete silhouettes visually inspected. Generated full-resolution originals preserved separately; project copies uniformly scaled/padded to512 RGBA. No runtime socket/scale activated, no hitbox/physics changes.

## Completed checks
Automated PASS: tests/check-raptor-cover-hold.cjs; tests/check-cover-contact13.cjs; tests/check-shared-cover12.cjs (21 Jade/Raptor checks); scripts/check-psychic-cover11.cjs (31 checks including drive/launch/interception/reset/round simulation); tests/check-raptor-restoration15.cjs (16 direction/height cases). npm run build PASS including compilation, type validation and static generation.
Visual: inspected generated candidates at full/512 size, original comparison and static scale trial. This is not normal-speed interactive verification.
NOT performed for new art: actual match, controller hardware, live normal-speed directional turns, low/tall edge projectile paths, multiplayer or new deployment verification. Automated round simulation is not an interactive match.

## Remaining work / exact next action
This is a partial implementation checkpoint, NOT completion of user milestone. No directions/actions yet production-complete as a coherent restored exchange.
1. Finish first front-right adjoining slide/catch, shuffle and tall-edge exposure (both edges) using original identity and preserving successful action poses. Hold/pop candidates are available above. Confirm feet, muzzle and body mass with original and slide.
2. Exercise those frames in actual low/tall cover exchange before enabling manifest; do not insert restored poses between visibly incompatible legacy art.
3. Finish other reachable directions (left, back-left/back-right holds missing; exposure/shuffle gaps remain), then locomotion/jump/special-action outliers. Reuse inventory keys; no blanket219 regeneration.
4. Integrate coherent batch with final registration/sockets, focused tests + interactive Raptor/Jade round/rematch. Recheck hit-volume mismatch with projection; no collider changes without decision.
5. Review current Railway staging again, stage only isolated service coherent commit, wait SUCCESS and verify exact live source and behavior.

Preserved: all219 runtime images, manifest, Jade artwork, approved slide, control mappings, physics, timing, cover authority, energy/ownership/arsenal rules, hit volumes/damage, master/XYZ/unrelated services. No new abilities/characters/arena work.
