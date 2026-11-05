# 39T7 anatomy correction audit — 2026-11-05

Status: INCOMPLETE. User rejected disproportionate artwork. No correction from this pass is production accepted or deployed.

## Preserved state
- Verified remote starting HEAD: 752684311d47fec3229cd5cf1ab49be3b8d498f6
- Existing live release last verified in preceding work: 39T7.2 at that commit.
- Checkpoint: checkpoint/39t7-2-before-anatomy-audit
- Working branch: studio/39t7-anatomy-corrections
- Runtime manifests, selection, physics, input edge queue and deployed service unchanged during this pass.

## Audit
Inspected contact sheets of all 80 unique installed images: idle 8; right/left stalk 8; right/left jog 8; sprint 32; slide 24. The 32 run paths alias sprint and are not additional images. This is static visual inspection, not new gameplay verification.

Confirmed problems:
- Recent uninstalled front/front-diagonal candidates lost elongated torso volume, inflated thighs, shortened tail and shifted camera between phases. Withdraw earlier provisional acceptance.
- Installed front-diagonal sprint phases have inconsistent torso presentation and repeat leading-thigh arrangements. Both front-left and front-right 000–003 need correction.
- Rear-diagonal sprint phase pairs change apparent scale and camera pitch. Back-left and back-right 000–003 require comparison of shoulders/pelvis/neck before registration versus redraw decisions.
- Existing side stalk/jog differs from original master in torso/neck proportions. Reassess all 16 side slow-gait images, not just leg alternation.
- Standing views must be checked against replacement locomotion scale. Do not assume all eight need full redraw merely because some do.
- Slide images were inspected; a knee near ground during actual recovery is not itself an idle defect. Do not replace functioning slide anatomy indiscriminately. Recheck all 24 against consistent scale and contact points during playback.

## Replacement experiments
Right standing plus stalk4/jog4 candidate exports are in art-review/anatomy-correction. These are REVIEW ONLY and are not referenced by runtime.
- right standing: exec-42cea266-a480-4079-be65-4f87bbf8ca11.png
- right stalk contacts: exec-b0f38d8c-2d83-4c62-957f-1db4b5fea32c.png
- right stalk passing: exec-6fc389e6-ef8f-48af-b15f-167b0e8ae38a.png
- right jog contacts: exec-a437392e-7b7c-4a08-9881-1599185640d1.png
- right jog passing: exec-e4b08139-106f-479c-bcf0-6201d0592d37.png

Left candidates remain original generated artwork, not runtime exports:
- standing: exec-437c5589-6762-4591-851a-699d6d2f437f.png
- stalk contacts: exec-74a0e369-94ac-45b7-a5a4-b5ad0d2dea1d.png
- stalk passing: exec-7bd350b0-1a75-4c06-bd30-8eee1fd8b342.png
- jog contacts: exec-e78420f7-0912-41ae-ba2d-95e0c68907dd.png (posture still too low; reject as finished jog)
- jog passing: NOT generated in this correction pass.

Repeated failure: fixing thigh alternation can alter chest angle/neck length; asking for moderate left jog repeatedly produces excessive lean. Right jog passing also changes neck presentation relative to contact. Do not propagate these as an approved new master.

## Method
Built-in image generation, original approved full-body reference exec-279c9274-ca4f-4cea-8751-d9924014bc93.png as anatomical authority; individual or two-pose targeted edits. No mirrored asymmetric frames and no synthetic body stretching/rotation.
Prompt constraints: preserve original head/snout-to-shoulder ratio, elongated ribcage, pelvis, limb segment lengths, muscular volume, long balancing tail, all gear and right optic/left amber asymmetry. Change joint articulation only. Standing two-foot support; stalk slight lean and short steps; jog intermediate lean. Reject drift before extraction/integration.

Candidate export uses uniform scale per source family (not per-pose bounding-box fitting). These exports still need anatomical landmark and contact registration validation. No hashes or anchors have been substituted into production manifest.

## Exact remaining work
- Accept a coherent right standing/stalk4/jog4 progression after resolving neck/chest drift and measuring landmarks.
- Finish and match left standing/stalk4/jog4; left jog passing4-cycle remains incomplete.
- Six remaining directions still have NO installed dedicated stalk or jog (48 frames at current4-frame cycles).
- Audit/replace affected idle8 and sprint32 selectively; confirmed front-diagonal8 require correction, rear-diagonal8 require scale/camera correction decision.
- Validate all slide24 proportions, contacts and standing/moving recovery transitions; replace only failed frames.
- Register accepted frames, export clean transparency, update SHA256/anchors and compatible manifest/cache.
- Full normal-input gameplay verification, slide/fire/cancel/stop/turn, fresh load and isolated deployment remain pending.
- No physical-controller hardware test was performed.

Counts for this correction pass: 0 production-accepted, 0 runtime-installed, 0 gameplay-verified replacements. Nine right review exports are candidates, not completion.
