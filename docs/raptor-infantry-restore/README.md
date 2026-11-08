# Raptor infantry restoration — checkpoint, not a completed release

Base: 2b64e2d09714ae15899c5399545da29b464f7c56 (39T14). Working branch: studio/39t15-infantry-restore. Saved commit: the commit containing this record.

## Verified external state, 2026-11-08
Remote 39T14 HEAD unchanged. Reference branch remains 003ccf16f6b0efd9ec6f5105cddbf1be8aac4f8c. Railway isolated service 142b4954-caf3-4c59-900b-bf963cdba0bd, project 9e9de944-48d2-4144-8109-e27bc853f68f, environment 4db57654-a1b5-44b3-9f0f-bd4575742af4: latest SUCCESS deployment 4d0d8297-f927-4907-84e7-1eef0249eb41, live source 39T12 /1fdddfe3710036879dac16c2f9da4e19c9d7fa87. Pending source-only patch 2540cdb5-8790-46be-8ef0-5b001d94a39f targets 39T14; no other services in patch. Staging was inspected, not changed or applied.

## Locked reference
original-approved.jpeg is byte-identical to user attachment 00152E57-0B7B-45FC-8B4C-2AABBB81848F.jpeg.
SHA256 06d09d47d4702923f3511cd4f11275e160265b56a9ef832d50aed44443dbea64.
Original identity outranks Design B, later narrow-head candidate, and legacy runtime appearance. Anatomical RIGHT optic, natural LEFT eye. Muted olive/dark stripes; organic muscular adult body; original angular worn armor; rectangular red knee insets; substantial original weapon; original cable-rich headgear. Approved slide/front-right/001 remains pose/body reference, not authority to repeat equipment drift.

## Inventory and visual review
219 manifest frames exist and their SHA256 values match the local manifest. All eight directional contact sheets inspected. Inventory records exact keys, source hashes/registration, per-frame repair classification and pose preservation policy. Contact sheets are static rendered reviews, not playback or proof of collision. All 219 require at least equipment/palette reconciliation with the newly reasserted original; this does not authorize blanket regeneration or imply every pose/anatomy is wrong. Existing action silhouettes are preserved pending targeted corrections.

Remote tree comparison confirms all 219 image blobs, manifest and lib/raptorPose.ts match base. lib/raptorSpriteOnly.ts blob differs locally; fetched text has no diff against local, so byte-level discrepancy is unresolved. Do not upload this local renderer as part of a future runtime patch without resolving it. This checkpoint changes only this documentation/reference directory.

Confirmed visible patterns: rounded/illuminated knee pads instead of original angular red inset plates; simplified gun and headgear in frontal/side families; brighter palette; rear rectangular pack differs from the original's cable-heavy silhouette. Cover holds also need posture review (low squat/hip support), separately from scale. Do not treat projected crouch height as standing stature.

## Runtime selector findings
lib/raptorPose.ts: catch uses slide/002; hold/brace/retract use cover-hold/000 in eight directions; shuffle uses stalk; drive uses two front-right dedicated frames and stalk elsewhere. Tall exposure uses cover-lean only front-right, otherwise idle. Low exposure uses idle. Hit interruption uses idle; moving fire retains gait. These are explicit existing reuse paths, not newly added missing-file fallbacks. No mirroring call found in lib/raptor* search. Dedicated opposite-edge/other-direction exposure and action artwork remain outstanding. Review barrel paths together with replacement poses; do not change gameplay merely to hide imagery.

## Restored candidate art, not integrated
- crouch-front-right-candidate.png: exec-93128166-4059-4b64-8723-bb5c3f48721f.png. Original-derived low protected crouch.
- crouch-front-candidate.png: exec-681bd86d-21cc-4c7c-a293-00e2fd96b5e8.png. Front version; targeted correction restores clipped top cable and straight outside-guard trigger index. Earlier exec-35517938-ae2e-4c38-8ce7-c611530559b0 rejected.
- crouch-right-candidate.png: exec-5899a6b6-ec8c-455a-873b-5c3bf24b6625.png. Corrected toward strict right-side view. Earlier exec-1be12329-1da6-452a-8242-048bdb4185ad too frontal; not used.
- crouch-back-candidate.png: exec-4829391b-dac0-45c6-aa5d-2afa88f6ae32.png. Rear construction PROVISIONAL: two legacy red power-cell banks around central housing, original-style cable routing and worn angular materials. Original does not reveal central rear housing clearly. This material equipment choice needs a user decision before propagation.

Built-in image editing used original every time as design authority, matching generated crouch as pose evidence, legacy rear only as mounting-location evidence. Prompts require original olive palette, organic mass, asymmetric optic, original weapon/armor, grounded digitigrade crouch, clear separated hand roles, no redesign and transparent complete silhouettes. Only uniform ffmpeg scale/padding to512 RGBA for saved candidates; no nonuniform stretching or runtime replacement. High-resolution generated originals remain separately available in conversation.

Remaining art checks: side leg articulation and rear heels/tail occlusion need gameplay-size comparison; wrist/trigger clarity must be checked on final firing poses. Four candidates do not constitute eight-direction completion. Rear equipment is not approved by inference.

## Checks and limits
PASS existing tests/check-cover-batch14.cjs on unchanged runtime: eight hold/brace/retract selectors, file hashes/dimensions, registration math, catch/free movement, local Jade atlas checks. This is a baseline automated result, NOT a visual/match test of new candidates.
Static eight-direction contact-sheet inspection completed. Candidate transparency/dimensions inspected separately. Source white JPEG retained unchanged. before-after.jpg intentionally uses display-fit only; it is not calibrated runtime scale. No landmark-based final scale/socket authoring, Jade stature comparison, normal-speed live match, controller hardware, multiplayer, production build or new deployed-behavior verification completed for this restoration.

## Next action / completion gate
Resolve rear housing choice on saved rear candidate. Recommendation: retain compact legacy two-cell location with original worn housing/cable identity; avoid a new shell. Then calibrate front/side/rear anatomical landmarks and grounded posture against original/slide, finish needed orientations and coherent Batch A transitions, integrate only completed transitions with sockets, test and deploy isolated service. Batches B/C remain unimplemented. Do not deploy this reference-only checkpoint or claim restoration complete.

Runtime files, Jade, hitboxes, physics, damage, controls, timing and Railway staging unchanged.
