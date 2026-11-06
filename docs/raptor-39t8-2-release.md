# Raptor 39T8.2 — eight-direction movement candidate

## Recovery and scope

Starting checkpoint: `bfa6a2df9031f2cba6cfbe5649bcdd0db375cd29`, branch `studio/39t8-1-push-off-review`.
Recovery branch: `checkpoint/39t8-1-before-completion`.
Working branch: `studio/39t8-2-complete-motion`.
Intermediate recoverable commit: `95062974e73c9a6e6abe6f0da42c4755863aed89`.
Verified existing Raptor Railway live/rollback commit: `5d158eec5f0e9664ecee0272da52668d8a693fc7`, deployment `11d94795-e13f-4249-92db-686a50047cc8`.
Master, XYZ, and unrelated services are unchanged. This document records local candidate verification; it does not establish a successful new deployment.

## Locked reference and artwork

Approved master: `exec-e30e1c6b-1fa9-4285-b261-28d785ba3c01.png`, exact copy in `art-review/39t8-2/reference/approved-master-e30e1c6b.png`. SHA256 `b50c72dd1a74d733fb82082c79a706c96bfa6def40b9b9535b0e2a5e9ccf61d2`. Apex cleanup is supporting reference only. Anatomical right eye remains red optic/headgear; left eye amber. No directional mirroring.

Right push-off v2, corrected ascent/descent, retained apex/landing/recovery form the six-phase cycle. Right push-off and landing use uniform1.10 anatomy-based scale to match skull/shoulder dimensions; no limb stretching. Other direction sets preserve compact neck, muscular legs, equipment and tail. Idle reuses each direction's recovery image and registration, eliminating the recovery-to-idle pop. Left jump uses uniform0.72 scale across its six poses.

Added missing16 rear-diagonal stalk/jog frames with alternating support legs and rear-facing heels. Corrected side/forward gait anatomy, front sprint extra claws, front-right sprint leading-leg reversal, side slide anatomy and straight-back slide orientation. Original rejected candidates remain review evidence, not selected runtime artwork. Runtime manifest is authoritative; review folders include superseded candidates.

Registration uses fixed source cells, anatomical size comparisons and authored support anchors. It never normalizes every pose by its silhouette bounding box. Final left stalk/jog scale0.80 and front-left stalk/jog0.96 resolve directional skull-size discontinuity; front-right recovery/idle ground anchorY440 aligns its visible planted feet.

## Completion matrix

Every direction (right, front-right, front, front-left, left, back-left, back, back-right) contains:

| Family | Frames per direction | Runtime entries |
|---|---:|---:|
| Idle |1|8|
| Stalk |4|32|
| Jog |4|32|
| Sprint |4|32|
| Run aliases |4|32|
| Slide entry/hold/recovery |3|24|
| Jump push-off/ascent/apex/descent/landing/recovery |6|48|
| Total ||208|

Machine-readable completion matrix, exact hashes and per-frame registration are saved alongside this release. All eight jump and posture directions are enabled as complete sets.

## Gameplay integration

A shared per-actor pose selector drives rendering and authoritative muzzle selection. Character identity survives resets; private selector history is excluded from safe state. Jump selection follows real takeoff/velocity/contact, handles falls without fabricated push-off, repeated jumps, interruption, reset and time gaps. Moving fire retains locomotion. Existing movement, collision, vertical physics, inputs and combat rules are preserved.

Visible barrel midpoints are authored per source image and projected through the same uniform scale/anchor as rendering. Authoritative projectiles and muzzle effects share the selected frame socket.26 straight-back entries hide the barrel mouth; each explicitly declares the existing legacy socket fallback. These occluded sockets are not falsely described as visually verified barrel alignment.

## Verification and limits

`art-review/39t8-2/evidence/focused-tests.txt` records11 passing commands:208 PNG/hash/transparency/registration/alias checks,288 socket round-trips, all-direction pose/authority/FX tests,24 real-physics jump sequences at15/30/60Hz, posture tests, Build27B/27D regressions and TypeScript. Production build passed.

All eight directions rendered phases0–5 using normal keyboard input under a controlled16ms browser clock, with208 assets loading200 and no page errors. This is automated input verification, not physical-controller testing or a real-time frame-rate claim. Normal-speed and quarter-speed review playback covers all48 jump frames at about60FPS. Real-time headless gameplay is only8–16FPS in this software-rendering environment and can miss a65ms push-off. Physics/phase duration was not changed to conceal that limitation.

An initial browser recheck was rejected by automatic approval review because legacy Jade preloads could contact unverified external hosts. Subsequent local checks materially restrict HTTP/WebSocket traffic to exact loopback origin and block those99 legacy requests before dispatch. No approval rejection was bypassed. Raptor asset failures are tracked separately from intentionally blocked legacy requests.

Physical controller/iPad hardware performance is untested. Final deployment status, exact deployed commit and fresh live normal-input checks must be recorded after Railway reports SUCCESS; submitting a build alone is not completion.
