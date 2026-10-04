# GOD MODE — EXACT HOVER CONTINUATION

Continue this existing project. Do not start a new app or redesign Jade.

Repository: leslieadamsisrh-commits/god-mode-break-the-code2
Branch: integration/combat-master-multiplayer-core
App: https://god-mode-playable-core-production.up.railway.app/
Last verified gameplay commit: b10c86ad730c867a62de69cea68a76713175d7f4
Railway deployment: 03082a47-f47d-4ecf-8c16-9a725a98d2d6 — SUCCESS

FIRST: inspect current branch HEAD, live deployment, app/Game.tsx, tests/cover-movement.cjs, and art/god-frame/d06 and d03. Preserve 0827281 plus all newer approved work. d03 is approved, registered and installed; older candidate notes below are historical. Verify the actual current state instead of restarting or assuming the oldest checkpoint is HEAD. Do not force-push or overwrite concurrent work.

APPROVED LOOK
The displayed high-detail Jade appearance is approved for this pass. It is current production artwork, not a low-resolution draft to regenerate later. A separate future design project must not influence this pass. Preserve her helmet, face, restrained expressions, armor, blue battery backpack, pink cape, gloves, boots, anatomy, detail and normal combat scale. Right glove forms guns; left glove handles powers. Equipment is asymmetric: never invent views by mirroring, stretching or rotating sprites.

ALREADY COMPLETE — PRESERVE
- d00 original charge and d06 front-facing charge are installed.
- d06 has approved entry, lift, three hover-loop poses, peak and weapon return. Source images: art/god-frame/d06/approved-hover-loop.png and transitions-review.png. Installed byte-identical copies: public/assets/god-frame/front-d06-loop-v1.png and front-d06-transitions-v1.png.
- Rendering selects d06 using the existing spriteFacing/body-facing rules. Missing directions retain the original d00 fallback and are identified in the inspector. No new aiming or turning mechanic was introduced.
- Explicit source rectangles and anchors retain whole silhouettes. One anatomical scale per source-sheet resolution; no independent resizing of individual poses.
- Held Y during powered expiry or depletion cannot restart charging. Release Y, then press again. Battery recovery remains unchanged.
- Weapon return no longer goes ready → half-formed gun. Partial-charge recovery retains its last charging pose while recovering.
- Build and 1,765 regression checks passed. Live browser preview verified d06 combat scale, hover loop, full release, weapon-ready return, short approximately 25% release without activation, powered countdown, expiry and repeat charging. Physical controller playtest remains pending; do not claim it has passed.

COMPLETED — d03 FRONT-RIGHT REGISTRATION
Read art/god-frame/d03/README.md and registration-review.json before editing.
Source assets: sequence-review.png and dissolve-review.png in that directory.
The d03 appearance was approved by the user on 2026-10-03. Registration is implemented with compact dissolve, opening-ready reuse, explicit source isolation and uniform sheet scales. 1,835 checks and production build passed. Live d03 combat scale, hover, full release/ready return, countdown/expiry, repeat charging and brief release without activation passed. The full physical controller, moving-cover and powered-combat matrix remains pending.

Use the corrected front-right sequence and its isolated compact dissolve replacement. The sheet's original oversized dissolve (source pose 2) is excluded. Its final ready stance (source pose 12) is also excluded: reuse source pose 1 for both opening and final ready states. This guarantees the same stance without generating duplicate artwork. The peak has already been corrected to retain front-right facing.

The JSON records twelve state mappings, source hashes, complete silhouette bounds and remaining extraction work. Source pose 3's upper-left padding contains neighboring discarded weapon particles; isolate it without clipping the genuine cape below. Pose 11's right crop must exclude discarded pose 12. Inspect the actual pixels and follow the recorded source coordinates. These notes are not a claim that d03 runtime registration has passed.

The candidate sheet AND compact dissolve replacement have visual approval. Do not ask to approve them again. Do not ask to reapprove d06. d03 registration and deployment are complete. Resume with the physical controller and remaining moving-cover/combat matrix before the next audited directional batch. Reuse existing source art wherever possible; generate only exact missing or failed poses. Do not regenerate a whole sheet to fix one pose.

LOCKED GAMEPLAY
Keep charging speed exactly 0.67145 of normal with existing easing. Preserve Classic movement, camera, controller mappings, cover handling, psychic abilities, battery costs/recovery, combat benefits, combat animations, SKEET/SKURT!, Kinetic Echo and studio tools. Hold Y charges; release Y activates. Charging remains vulnerable. Full-charge powered time stays roughly 12 seconds. No new tiers, invincibility, abilities, reload systems or unrelated features.

LOCKED SEQUENCE
Shotgun ready → gun dissolves into right arm within opening three frames → grounded strain → heels lift → low float → sustained hover loop → full-charge peak → smooth weapon-ready combat return → energy fade.
Entry and peak must not replay inside the sustained loop. Keep early release, interruption, landing, turning and repeat charging responsive. Keep collision and cover position grounded, with stable ground shadow and intentional body hover offset. Character artwork stays separate from controllable energy effects; glow follows remaining powered energy. Preserve immediate combat input responsiveness and existing powered shooting, sliding, carrying and throwing.

DIRECTIONAL EXPANSION
After d03 continuity passes, continue missing views in small audited batches. Installed coverage is d00, d03 and d06. d03 is approved and registered; controller validation remains pending. Other source views still missing: d01-d02, d04-d05 and d07-d23 (21 views). Audit actual installed coverage before each batch; do not assume these counts remain unchanged. Use the existing combat sprite for each direction as its facing and equipment-layering reference. Do not generate the whole 360-degree set at once. Show every new sheet as produced; obtain visual approval before installation.

AUDIT AND VERIFY
Compare every selected frame with approved references and its neighbors. Prioritize the same character, anatomical size, helmet/face/armor/backpack/cape/boots/gun, correct direction and layering, stable pelvis/ground anchors, full limbs/barrels and continuous poses. Correct or exclude failed frames before continuing. Verify normal rendering and Kinetic Echo registration remain consistent.

Test entry, moving hold, turning, nearby soft-cover capture/traversal, early/full release, interruption, immediate combat, weapon return, powered shooting/sliding/carrying/throwing, depletion, expiry and fresh-press charging. Reproduce sticking, frame-rate or zoom reports before changing them. Fix only reproduced defects caused by this sequence; report unrelated findings separately. Adobe/video summaries are investigation evidence, not verified causes or authorization. Do not repeat old media processing just to regain context.

Run node tests/cover-movement.cjs and npm run build after relevant implementation changes. Deploy approved changes to the same Railway service; verify SUCCESS for the exact commit and live behavior before requesting a controller playtest. Record checkpoints and approval states in the repository so the next chat can continue accurately.

NEXT CONTROLLER LOOP
Move → hold Y → lift → turn toward front → reach cover → release → shoot → expire → release Y → press Y to charge again.

Work incrementally, conserve credits, use no unnecessary agents, and keep explanations short and plain. Report what changed, what actually passed, the exact artwork still pending, and the next playtest. No broad refactors or unrelated work. Resume this checkpoint; do not restart the project.

## Controller feedback pass — 2026-10-03 19:30 PDT
User authorized quicker slide, left-stick hover turning, ground energy wake and recharge from retained battery. This supersedes the old prohibition on mid-window recharge. Fresh Y refills a partly used battery even during powered time; expiry/depletion still require release then fresh Y. Free hover follows left-stick intent and retains facing when neutral. Classic slide speed increased 15% (599.269125 -> 689.15949375), duration/drag/cost unchanged. Presentation buffer reduced 100 -> 50 ms for response; physical network-feel validation pending. Ground-energy wake is capped at 24 marks and fades in 0.65 seconds. No tiers added. Build and 1,846 checks pass. Gameplay commit 794b9d8e091fddb7464735dfbf46f934419f4eda, Railway deployment 0755b806-6f04-4c7d-abd5-a51caedc2f25: SUCCESS. Live director confirmed slide speed 689 and mid-window recharge at about 86% battery / 4.6s remaining, returning to full charge without expiry. Physical controller feel and ground-wake/moving-turn visual validation remain pending. Remaining missing artwork still uses d00 fallback; no directions fabricated.

## Instant charge entry — 2026-10-03 19:53 PDT
User clarified fresh Y must immediately cancel voluntary action and enter recharge from retained battery, including mid-window. chargeIntent now consumes buttons already held at entry until release; new combat inputs still interrupt. Slide/dash/kick/cover-exit cancel without teleporting; carried matter/cover drops without a throw; cover position remains grounded. Incoming knockback still interrupts. Existing expiry/depletion release-then-fresh-Y behavior preserved. Build and 1,924 regression checks passed. Gameplay commit b10c86ad730c867a62de69cea68a76713175d7f4; Railway deployment 03082a47-f47d-4ecf-8c16-9a725a98d2d6: SUCCESS. Live director preview verified full charge, release/countdown and repeat charging from retained battery (observed 81% / 2.2s before re-entry; 88% charging immediately afterward, then full charge). Live overlapping physical controller action cancellation remains pending; regression checks cover those action combinations. Proof: art/god-frame/instant-charge-b10c86a.jpg. No new sprite artwork generated or approved.

Footage RPReplay_Final1791082004.mp4 (186.07s): moving powered/charge presentation and ground wake seen in 0:00-1:00; cover occlusion and grip/throw activity around 1:20-2:00; slide effects and repeated charge/combat return around 2:00-3:00. Video does not expose raw controller inputs, frame timings or source commit: do not infer exact input failures, clipping causes or network causes from appearance alone.

Next art work: audit existing ready/run/slide/cover and approved d00/d03/d06 charge frames; connect ready->charge, running stop->charge, slide cancel->grounded charge, shield/aim retract->charge, braced cover->charge, weapon return->recharge. Reuse valid poses; generate only missing connecting poses and obtain visual approval. Then expand missing hover directions in small audited batches, with left-stick facing and consistent pelvis/ground registration. Refine ring-like ground wake into a restrained energy scorch after transition validation. Higher tiers remain parked.

## Combat cohesion batch 1 — 2026-10-03
Recovered HEAD c90a500 and deployment 6e573a3f-3fc5-48f1-87f2-c53748d74254 SUCCESS before editing. No applicable AGENTS.md found in scratch source. Source workspace is an extracted checkout without .git; mutations committed through GitHub fast-forward tools.

Reproduced: fresh A during slide cooldown exits edgeActions early and consumes unrelated RB build or LB release/drop in that same input update. Fix: isolate slideAction so its rejection returns only from slide handling. Same behavior for unavailable Weave slides; no movement values or mappings changed. Existing 1,924 checks plus four boundary cases pass: 1,928. New tests/combat-cohesion.cjs passes 26 staged checks exercising real inputs through run, soft capture/traverse, brace/fire/retract, build, carry/drop/regrip/throw, fresh-trigger gunfire, recharge/release/recharge; repeats with joined host/guest serialized snapshots, plus generated-cover movement and Y drop. These are engine/snapshot tests, not browser-network or physical-controller certification. Production build passed. Deployment/live verification pending for this batch.

Art audit: approved charge d00/d03/d06 installed; psychic carry still uses ready/run fallback, exposed cover/fire/recoil and cover-exit routes also have recorded fallbacks. New art/combat-cohesion/d03-psychic/sequence-review.png is a three-pose LEFT power glove reach/hold/retract candidate, NOT APPROVED and NOT INSTALLED. Corrected spacing source and registration-review.json saved; no other sprite set generated. Preserve existing approved art. User must visually approve new candidate under master prompt section 4 before registration/installation. Final anchors and actual lab continuity remain pending.

Resume: verify deployed code and overlapping-input behavior, then obtain candidate visual approval, register against approved d03 scale and grounded anchors, verify carry/drop/charge transitions in lab. Continue remaining connectors and directions only in small batches. Complete physical controller and two-browser network loop before claiming whole encounter verified. No higher tier or new abilities added.
