# 39T7 anatomy correction audit — 2026-11-05

## Current status — 39T7.6 live
- Working branch: studio/39t7-anatomy-corrections.
- Deployed code: 12f0f72244ebaeb4aeaa2211fbee240af9923988.
- Railway deployment 1a4dd219-5a14-4799-965f-7debf2f49c60: SUCCESS; fresh lab39T7.6 and review128 paths confirmed.
- Installed96 unique images plus32 run aliases. All8 directions have idle1/sprint4/slide3; right,left,front-right,front-left additionally have stalk4/jog4. Four other directions lack32 slow-gait images.
-39 anatomy pilot replacements installed: right12 including slides, left9, front-right9, front-left9. Static pilot acceptance is not full gameplay acceptance.
- Live39T7.6 normalized digital diagonal test: front-right and front-left each painted jog0,1,2,3 at medium pace without entering sprint. Both painted stalk0,1,2,3 at light pace.
- Evidence screenshot: raptor-39t7-6-diagonal-proof.jpg. Trace establishes painted phases, not anatomical quality or sustained-video verification. No physical controller available.
- Open: old sprint continuity/proportions, remaining slides/idle, all-direction transition matrix, and muzzle/projectile origin above new gun barrel. See historical findings.
- New direct-front standing7d3807eb and stalk candidates are UNINSTALLED. Visual phase mapping requires reordering: contactRIGHT8cc037bc; passingRIGHT-support8a02d09c; contactLEFT2db7b5b9; passingLEFT-support150b4b87. Original generation order was not safe playback order.
- Direct-front jog3342c5c2 rejected as finished jog: insufficient posture distinction from stalk. Targeted chest/neck/hip correction underway.
- Rear standing404acbf1 rejected for camera-facing claws. Correctedeb7267a1 provisional, uninstalled.
- Completion NOT reached. Preserve all accepted existing work; do not claim every generated frame is accepted.

## Prior checkpoint record (historical; superseded by current status)

## Current status — 39T7.4 live (supersedes historical sections below)

- Working branch: studio/39t7-anatomy-corrections
- Deployed code: d30ee9d3c6d1b088e0359efff3c072e5683b7bed
- Railway deployment da4a53a7-b251-4bb7-b2e5-0dca09520ac8: SUCCESS.
- Fresh lab shows39T7.4; review loads all112 asset paths.
-21 replacement images installed across39T7.3/4: right idle1/stalk4/jog4/slide3; left idle1/stalk4/jog4.
- Normal touch controls painted all4 stalk and jog phases in both side directions. Normal moving-fire input painted all4 jog phases in both directions. Supported doubletap+right movement painted all3 right slide phases, followed by two-foot standing.
- This establishes asset loading and phase/input coverage, NOT full anatomy/playback acceptance.
- Live evidence: raptor-39t7-4-live-proof.jpg. Firing screenshot exposes muzzle flash/projectile presentation above the new barrel. Existing barrelSocket27d uses Jade registration (125px cell,.88ground,.37muzzle), while Raptor uses512px anchored art. Do not call firing visually verified. Needs per-frame barrel registration and coherent shot/effect origin; merely moving the flash would hide the projectile mismatch.
- No physical-controller hardware available. Sustained animation video not captured; static screenshots and painted-frame traces are limited evidence.
- Front-diagonal candidates remain UNINSTALLED. Initial camera-correction candidates rejected for oversized head/shortened snout/squat ribcage and red organic eye. New front-right standing candidate exec-9bf8eb2e-f5a8-4fcf-b0b9-6c3971219aa6.png corrects those issues provisionally; must compare against side masters before acceptance.
- New front-right stalk candidates in phase order: exec-a095e3d7-600f-4224-ad20-2ca6e646478e.png, exec-bc559d70-3153-4e5f-af16-cd75d707f343.png, exec-8fff6396-2cc4-4927-a077-bbe080b2159f.png, exec-e1a5bee9-0a39-4e26-a16c-2f8f58ac579a.png. Actual thighs alternate in static review; scale/landmark/playback review still pending.
- Front-right jog contact candidate exec-0563d972-9148-4632-970f-1ced9967e138.png; remaining phases being generated. No new diagonal runtime images installed.
- Remaining inventory: six directions lack dedicated stalk4+jog4 (48 images). Confirmed frontdiagonal sprint8 need correction; rear sprint scale/camera review and other idle/slide transition audits remain open. Side sprint continuity with corrected gaits also unresolved. All-eight-direction completion is NOT reached.

## Historical work log

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

## 39T7.3 right-direction pilot update
Single-frame leg edits resolved the paired-sheet neck/chest drift for the right jog. Selected jog sources: right-jog-contact-master.png (top crop of exec-a437392e-7b7c-4a08-9881-1599185640d1.png), exec-30f9581b-fb85-4aa3-92d2-39fec01b83ea.png, exec-06cea895-3830-4e22-8c9c-8b60122d2d6b.png, exec-2c41006b-49f1-4275-a381-a25c08b0852f.png.
Nine right assets (idle1/stalk4/jog4) passed static visual review for the isolated pilot and local file validation. All512x512, SHA256 matches, alpha borders clear. Gait/hysteresis/moving-fire/slide-recovery selection tests passed. No movement/input code changed. Manifest build39T7.3. This supersedes the earlier zero-accepted status for those9 only. Live gameplay acceptance remains pending; all other unresolved inventory above remains open. Do not call the overall anatomy correction complete.

## 39T7.3 live verification
Railway deployment1487a919-fa76-4706-8a06-b2b0eb975fed SUCCESS at3e2b6425d336943839860f27cc8007101eaf819d. Fresh lab shows39T7.3; review loaded112 runtime paths. Normal touch produced right stalk0,1,2,3 and jog0,1,2,3; moving fire produced right jog+fire0,1,2,3. Supported doubletap produced right slide0,1,2 and returned to two-foot standing. Screenshot proof /workspace/scratch/raptor-39t7-3-right-live-proof.jpg. Static/trace evidence is not a full visual transition pass: older slide silhouette and shorter tail disagree with corrected locomotion. No physical controller tested.

## 39T7.4 staged correction
12 additional replacement PNGs: left idle1/stalk4/jog4; right slide3. All512x512, SHA256 validated, clear alpha borders. Right new idle/stalk/jog anchors adjusted by pelvis/ground landmark inspection. Renderer and review now honor optional uniform drawScale, preserving legacy frames when absent. Wide slide poses retain torso size despite fitting complete tail/extended leg in512texture. Tests cover legacy placement, pinned world anchors with authored scale, invalid scale fallback, and existing gait/hysteresis/fire/slide selection. Movement/collision/input/slide timing untouched.
Left stalk sources in phase order: exec-7b70966f-7fc6-4d91-a7a3-d80ed84defbf.png; exec-ab550d17-c5bc-49e8-9379-079534743077.png; exec-7f873bc4-854c-4876-84ff-1e0796eb0134.png; exec-720616f7-6996-4d7a-9e7f-b121c03a34c1.png.
Left jog sources: exec-77b7066c-80dc-40ef-a593-6c769624bcab.png; exec-98640525-c515-4ceb-9f55-0b1de6b05252.png; exec-f765587b-11ad-4387-917b-d81df6b47dd6.png; exec-7ef906e1-d7bc-4e78-ad23-46169d38c8af.png.
Right slide sources: exec-84f8e288-449d-4ca4-aced-1a72e68a46b8.png; exec-4f336645-0516-4e94-8d97-f965dd55e038.png; exec-fbb19a17-2e1c-49a6-b8c1-8d3d6906447a.png.
Right corrected inventory now idle1/stalk4/jog4/slide3; left corrected idle1/stalk4/jog4. Total21 corrected PNGs across39T7.3/4; overall unique runtime image count remains80 plus32 aliases=112paths. These are pilot corrections, not complete acceptance of all directions. New39T7.4 gameplay verification pending. Other6stalk/jog directions remain48missing images; frontdiagonal sprint8 still requires thigh/proportion correction, rear scale/camera consistency and all other slide transitions remain open. Preserve checkpoint/39t7-3-before-registration.

## 39T7.5 front-right pilot
Nine front-right replacements/new assets passed static cycle review and local file checks: idle1/stalk4/jog4. Both contact phases exchange leading thighs; passing phases exchange support legs. Uniform .2 source-canvas scale, pelvis projection x650 and ground reference y1270; no individual bounding-box normalization. Source9 images all1199x1312.512PNG export, alpha edges and SHA256 validated. Added front-right to postureDirections only after both4-frame cycles were present. All three installed posture directions retain all4 phases in selection tests including moving fire. Runtime inventory becomes88unique images plus32run aliases=120paths. Total30 anatomy pilot images across39T7.3–5. Five directions still lack stalk/jog (40images). This does not accept old front-right sprint or complete transition/firing alignment.39T7.5 live verification pending. Front-left new master exec-54854b55-7105-4d44-98a8-96348d1e5a73.png and its newly generated gaits remain uninstalled.

## 39T7.5 live result / 39T7.6 staged changes
39T7.5 code81c8c2aa17f334a9daac38163634ef59e7d8a5d2 deployed SUCCESS (0459fa1b-46e9-4d75-a659-3749808bcc08). Fresh lab/review show39T7.5 and120loadedpaths. Front-right stalk painted0,1,2,3 using touch-right plus keyboardS. Jog pace unexpectedly reached sprint0,1,2,3 because digital diagonal axes were scaled before normalizing magnitude. Therefore diagonal jog gameplay was NOT passed.
39T7.6 adds raptorLabMovement: normalize vector only when magnitude>1, then apply labpace. Applied only in Raptor combatLab keyboard/touch branch; native controller read remains afterward and unchanged. All8direction magnitude/angle tests pass at.25/.55/1, zero/subunit input preserved.39T6.2 edge queues untouched. Local four-direction gait/hysteresis/fire/registration tests pass.
Front-left idle1/stalk4/jog4 pilot exported at fixed.2source scale with pelvisx500/groundy1270 registration, all1199x1312sourcecanvas.9transparent512PNGs validated SHA256/clearborders. StalkcontactA original56caaea9 rejected for repeated leading thigh; c6d97913 corrects it. Initial jog7dc08889 rejected for enlargedhead;14b9a3f2 corrects head/tail. Passing65bfb2e2 rejected for shortenedsnout;bab67c2b corrects it. Final phase sourceIDs stored inmanifest.39T7.6inventory96uniqueimages+32runaliases=128paths.39pilot anatomy images installed across four slow-gait directions and rightslide. Fourdirections(front/back/back-left/back-right)stilllackstalk4+jog4=32images. Allsprintcontinuity, remainingidle/slides, muzzle/shot alignment and fullgameplaymatrix remain open. Front/back standing replacements currentlygenerating, notaccepted/installed.39T7.6deployment/gameplay pending.
