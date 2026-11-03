# Build 39R recovery checkpoint — NOT RELEASED

Base verified from GitHub and Railway: 9d7f6a840fc5542f9d8a44098731d8652d736ed8.
Both studio/build39q-raptor-action-animation and pre-existing studio/build39r-stride-correction pointed to that commit. No newer work was committed there.
Checkpoint: checkpoint/build39q-before-39r-recovery.
Working branch: studio/build39r-recovery-01.

## Code implemented, artwork gate still open

- Moving fire preserves locomotion selection; stationary firing retains its provisional Idle fallback.
- Gait accumulates authoritative world-space distance rather than reading global time.
- Phase survives turns, speed changes and stops. Reverse travel reverses the cycle relative to visual facing.
- Camera/cover render offsets do not drive gait. Duplicate draws, large corrections and long suspension do not advance phase. A backwards simulation clock resets it.
- Hit, airborne and slide priorities remain authoritative. Shared simulation and Jade renderer are unchanged.
- Runtime still has TWO run keys per direction. This checkpoint does NOT claim a four-key run installation or credible dedicated Walk, strafe or moving-fire artwork.
- Weapon recoil, projectile origin, fire cadence, hit detection and movement physics are unchanged.

## Evidence and inventory

Recovered and visually compared all 48 installed PNGs: 8 Idle, 16 Run, 24 Slide. Current inventory remains untouched.
The supplied 199.53-second recording was recovered; a frame at 40 seconds was inspected. A complete temporal video audit was not performed.
Generated 27 individual candidate PNGs, preserved in the separate God_Mode_39R_Uninstalled_Candidates.zip handoff archive, NOT public runtime assets or committed game assets. Files were reduced to 512x512 RGBA with alpha preserved. They have NOT passed final registration, anatomy or motion validation. Names describe requested poses, not acceptance or proven anatomy.

| Candidate group | Review |
| --- | --- |
| rear-original-correction, rear-opposite | Improved heel/sole presentation and alternating trailing legs; toe/claw consistency and ground registration still require review. |
| rear-pass-left, rear-pass-corrected | Different support legs visible; registration and sequence order unverified. |
| rear-pass-right | Rejected: repeats rear-pass-left support leg. |
| right-opposite | Rejected: does not clearly exchange leading leg. |
| right-pass-near, right-pass-far, right-contact-near | Potentially useful; thigh overlap changes, but sequence and exact equipment/ground alignment not validated. |
| front-pass-a/b, front-left-pass-a/b, front-right-pass-a/b | Different support legs visible. Pair with retained contact keys only after scale and gait-order review. |
| left-pass-a/b | Pose changes visible; leg-depth continuity needs motion review. |
| left-contact-opposite | Rejected: extra thigh armor and incorrect anatomy/equipment continuity. |
| back-left-pass-a/b | Opposite support legs visible; foot perspective, camera consistency and registration need review. |
| back-right-pass-a/b | B rejected: repeats A's support leg. |
| front-right-contact-opposite | Candidate only; compare actual leg identity against retained contact frame. |
| back-left-contact-a/b | Candidate only; B loses clear claw anatomy. Do not install as approved. |
| back-right-contact-a/b | Candidate only; leading-leg exchange and ankle/toe anatomy not accepted. |

## Verification

Passed locally: production Next build (existing CSS autoprefixer warnings), TypeScript, tests/raptor39p.cjs (updated to sample distance progression), tests/raptor39q.cjs, tests/raptor39r.cjs, tests/build27b-integration.cjs, tests/build27g.cjs, tests/build37-arsenal.cjs.
The first build failed because the partial local recovery omitted app/globals.css; retrieving the unchanged file fixed that recovery error.
39R tests cover all eight moving-fire directions, aim, render-rate independence, slow motion selection, turns, backpedal phase, stops, repeated draws, teleports, suspension, rematch and authoritative action priorities.
Not performed: new-art motion/registration acceptance, actual browser gameplay for this checkpoint, live asset hash inventory, physical controller/iPad, multiplayer, complete Jade browser regression.

## Release gate and next work

No deployment. Railway service god-mode-raptor-v2-39p remains on 39Q commit 9d7f6a8 (deployment e776a80e-ef9a-4273-9339-279feadbbe26). XYZ and master were not modified.
Remaining: correct all rejected/missing contact keys, rear Idle and Slide anatomy, rear-right opposite passing key, unify anatomical phase across eight directions, register and install four genuine gait keys, determine minimum Walk/strafe artwork, correct straight-back Slide entry/hold/recovery, then exercise all requested actions in an actual browser before deployment. Only after that release may cover/psychic, jump/landing, shotgun and damage families expand.
