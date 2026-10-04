# GOD MODE R6 recovery handoff

Recovery checked 2026-10-04. This is an archival sprite-production handoff for the September 21 B11 lab, not a claim about the current multiplayer game or its deployment.

## Verified durable checkpoint

Repository: leslieadamsisrh-commits/god-mode-break-the-code2
Branch: god-mode-team-sprites-20260921-r6
Art-stage commit: 1dbdb662e1d4e5fe771756c613062a2b781e4653
Directory: production/jade-lv01/integration-r6/

The branch was re-read on October 4 at the exact art-stage commit above. Its R6 directory contains ART-STAGE.json and four PNGs under runtime/public/assets/r6/. The recursive Git tree is complete. There are no R6 integration source files, test logs, restore script, or standalone HTML in that directory.

The temporary workspace was cleared by automated maintenance after the user stopped work. The R6 standalone build and final source changes have not been recovered. Exact-title searches did not find the R6 HTML or handoff in saved files. Do not claim the final build is saved or deployable.

## Saved sprite candidates

All four records report 1312 by 1199 pixels, alphaVerified true, and artworkApproval pending-user-review. Technical transparency checks do not constitute visual approval.

| File | Intended use | Anchor | Base scale | SHA256 |
| --- | --- | --- | --- | --- |
| R6-COVER-RECOVERY.png | Grounded cover recovery | 648,1174 | 0.094 | ad282bbe819230f57b5e60dd8a725ac23a58111529fea2391889b08d5b4c2e88 |
| R6-COVER-PUSH.png | Grounded cover push | 654,1178 | 0.094 | b8b33e59459abc8fb7a88a468b437ab2c7a13d808f9ce2a00b3c0ed3fe4213cd |
| CE04-R6-entry-settle.png | Late slide approach, gap 0 to 25 | 695,1140 | 0.108 | e7220824ac486bcfb2ca4603f0f5cd6e98f9435beb6767aaf295961ea1d3f229 |
| AIM01-low-aim-candidate.png | Inspection only; runtimeEligible false | 650,1168 | 0.098 | ee8e6d670422aa4af9f8ae458c358b6413a04926332f4f56864cd1bed98ac925 |

The first three records are marked runtimeEligible true. This describes intended routing; it is not evidence that they are installed in the current game.

## Historical work reported before interruption

The conversation recorded an R6 prototype with 126 embedded images, a Play new sprite batch button, candidate comparison checkbox, four candidate inspections, and 65 passing Node tests. It reported native-renderer checks without missing draws and unchanged original images and protected simulation files. These checks cannot be rerun against the lost R6 source and are historical reports only.

Historical standalone filename: GOD_MODE_B11_Sprite_Batch_Test_R6.html
Historical size: 47636025 bytes
Historical SHA256: 9bebc276a15709202a3c75c25b66f3574714170419f0e3096425cd995a18402e

A recovered file must match that fingerprint before being called the same build. Live browser and physical-controller testing were never certified.

Historical integration intent:
- Preserve the larger R4/R5 cover presentation multiplier of 1.35 within that B11 lab.
- Two cover candidates form a limited two-pose cycle driven by signed actual travel, approximately 48 world units per cycle; stop advancing when motion stops.
- Limit cover routing to the supported south-face/right-facing view. Yield to aiming, firing, recoil, corners, impacts and unsupported views.
- Use the contact candidate only on the matching late slide approach; do not replace a complete slide sequence.
- Keep the aim candidate inspection-only. Existing firing poses and muzzle registrations remain authoritative until new alignment is validated.
- Do not port numeric scale or anchor values blindly into a different renderer.

## Approval and quality limits

The previously accepted B11 current-design exports were CE05, CE03, CE08 and B06B. R6 adds four review candidates, not four newly approved assets. The later Batch 17 claim of 204 sprites / 100 percent remains unverified as an export or integration count.

The conversation noted small hair-edge fringes on movement candidates and pale/checkerboard contamination around the aiming candidate's fine hair. The two cover poses are not a finished smooth or foot-locked animation. The contact pose does not resolve the older slide gun-direction discontinuity. Check silhouette, asymmetric equipment, helmet, body proportions, feet, pelvis, hands, muzzle, alpha edges and continuity before accepting or installing in the current game.

## Earlier recovery source

The R5 source overlay and restore script were verified to exist at commit 99fdeab24c6e6c129282ffbd7a3234d3f68917d3 under production/jade-lv01/integration-r5/.
The saved file GOD_MODE_B11_Approved_Art_Test_R5.html was located, size 37268565 bytes, saved-file ID libfile_1cedd731ed588191b48c425a0169294f. Its bytes were not downloaded or retested in this recovery.

The original B11 archive referenced by the earlier restore procedure is JADE_V12_08N_B11_Fast_Integration.zip, SHA256 38ba7040a5abedb8efe371481304b35195765d4e3de0d3c9fdc390462272c233, saved-file ID libfile_c96641c423a48191a09f3c038910c906. Reverify before use.

A search also surfaced GOD_MODE_Five_Agent_Sprite_Test_R7.html. It was not inspected and is not assumed to continue or supersede this exact R6 work.

## Next developer instructions

1. Inspect the current app, working branch, HEAD and applicable AGENTS.md first. This historical B11 branch must not replace a newer game or deployment.
2. Retrieve the four existing PNGs and ART-STAGE.json from the exact art-stage commit above. Verify hashes and actual alpha. Reuse these assets; do not regenerate them merely because the workspace was cleared.
3. Compare candidates with the current locked master and recorded approvals. Present unresolved artwork for review; do not infer approval from creation authorization.
4. Reconcile against current animation/state routing. Port only compatible presentation work into an isolated test build. Preserve combat, input, collision, damage, multiplayer and firing behavior.
5. If continuing the historical B11 lab, restore the saved R5 baseline first and reconstruct only the missing R6 presentation changes. If continuing the newer app, use its current mechanics and scale authority instead.
6. Test normal cover travel, stop, direction reversal, slide contact, firing interruptions and unsupported views. Keep aim preview-only until muzzle alignment and visual approval are complete.
7. Save the source, assets, test evidence, playable artifact and exact next-step handoff before reporting completion. Do not report historical tests as fresh results.

No deployment or cross-chat delivery occurred in this recovery. This document is the completed handoff.
