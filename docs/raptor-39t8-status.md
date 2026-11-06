# Raptor 39T8 — jump foundation checkpoint

Status: INCOMPLETE. No 39T8 runtime artwork enabled and no deployment.

## Recovery
Verified remote c5cccf51fdefc841013201bf2a51165fc4c588c7. Verified Railway SUCCESS deployment 11d94795-e13f-4249-92db-686a50047cc8 pinned to 5d158eec5f0e9664ecee0272da52668d8a693fc7 (39T7.8).
Checkpoint: checkpoint/39t8-before-locked-anatomy-jump.
Working branch: studio/39t8-locked-anatomy-jump.

## Approved anatomy
User explicitly approved exec-e30e1c6b-1fa9-4285-b261-28d785ba3c01.png. It supersedes prior assistant reservations about its snout. Keep this face, compact neck and body proportions. Right optic/left amber asymmetry remains locked.

## Implemented foundation
lib/raptorJump.ts reads actual airborne/vertical velocity transitions. Handles push-off, ascent, apex, descent, observed contact/landing and recovery. Falls skip push-off; interruptions/reset/long gaps avoid invented events. Renderer passes vertical velocity and uses a stable actor identity. Sprite selection enables jump only for manifest jumpDirections; currently none enabled. No physics or input changes.
Tests passed: scripts/check-jump.mjs, scripts/check-jump-integration.cjs, existing check-postures.cjs. Integration test fixture checks six selected phases while firing, return to jog and fallback for directions without art. This is not gameplay verification or a production build check.

## Artwork
Six right-facing phase candidates exported as 512x512 review-only PNGs under art-review/jump-right. records.json preserves source IDs, hashes and provisional registration. White-background extraction preserves enclosed highlights by removing only border-connected near-white backdrop. Contact sheet reviewed. No generated backdrop retained in these review exports.
Apex cleanup source042082f1 retains approved anatomy. Ascent10da6ef0, descent48573454, landing7d6667a4 and recovery885ce298 remain provisional for registration/playback acceptance.
Push-off6ec920d0 rejected: calves too long/thin. Targeted correction b88f0ddb-a9ad-499e-9a10-ff67e5ae5ebb restored calf volume but elongated feet; NOT accepted or installed. Existing review000 preserves rejected first candidate for audit, not runtime use.
No complete accepted jump cycle yet. No runtime jump frames installed. Do not activate jumpDirections until a complete coherent set passes review.

## Remaining inventory
- Right jump: finish anatomical push-off and review/register all six phases against standing/locomotion before enabling.
- Seven other jump directions: not generated or installed (six phases each planned, frame count may adapt to playback).
- Ground families: reassess all directions against new master; rear-diagonal stalk/jog16 images still missing. Previous installed counts remain112 unique plus32run aliases=144 paths.
- All32 sprint images still need final acceptance/correction;21 non-right slide images await final correction or acceptance; all slide transitions need current-master audit.
- Directional scale and neck continuity, muzzle/projectile origin, full normal-input gameplay and fresh live loading remain unfinished.
- No physical controller hardware verification. No39T8 deployment or gameplay pass claimed.
