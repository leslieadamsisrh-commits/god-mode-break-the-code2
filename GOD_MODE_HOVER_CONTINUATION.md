# GOD MODE — EXACT HOVER CONTINUATION

Continue this existing project. Do not start a new app or redesign Jade.

Repository: leslieadamsisrh-commits/god-mode-break-the-code2
Branch: integration/combat-master-multiplayer-core
App: https://god-mode-playable-core-production.up.railway.app/
Last verified gameplay commit: 0827281d40f141db3e0f7d25c97f537affeda620
Railway deployment: 7853c2ad-b30f-4655-abe7-065bd9abb34b — SUCCESS

FIRST: inspect current branch HEAD, live deployment, app/Game.tsx, tests/cover-movement.cjs, and art/god-frame/d06 and d03. Preserve 0827281 plus all newer approved work. The latest asset checkpoint contains this handoff and the d03 review artwork; those review assets are not installed. Verify the actual current state instead of restarting or assuming the oldest checkpoint is HEAD. Do not force-push or overwrite concurrent work.

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

RESUME HERE — d03 FRONT-RIGHT CANDIDATE
Read art/god-frame/d03/README.md and registration-review.json before editing.
Source assets: sequence-review.png and dissolve-review.png in that directory.
The d03 appearance was approved by the user on 2026-10-03. Registration is implemented with compact dissolve, opening-ready reuse, explicit source isolation and uniform sheet scales. 1,835 checks and production build passed. Live verification remains pending.

Use the corrected front-right sequence and its isolated compact dissolve replacement. The sheet's original oversized dissolve (source pose 2) is excluded. Its final ready stance (source pose 12) is also excluded: reuse source pose 1 for both opening and final ready states. This guarantees the same stance without generating duplicate artwork. The peak has already been corrected to retain front-right facing.

The JSON records twelve state mappings, source hashes, complete silhouette bounds and remaining extraction work. Source pose 3's upper-left padding contains neighboring discarded weapon particles; isolate it without clipping the genuine cape below. Pose 11's right crop must exclude discarded pose 12. Inspect the actual pixels and follow the recorded source coordinates. These notes are not a claim that d03 runtime registration has passed.

The candidate sheet AND compact dissolve replacement have visual approval. Do not ask to approve them again. Do not ask to reapprove d06. Once d03 is approved, align anchors and anatomical scale against the existing ready-d03 combat sprite, verify the complete animated sequence in the actual lab, run regression checks, then install and deploy only this approved direction. Reuse existing source art wherever possible; generate only exact missing or failed poses. Do not regenerate a whole sheet to fix one pose.

LOCKED GAMEPLAY
Keep charging speed exactly 0.67145 of normal with existing easing. Preserve Classic movement, camera, controller mappings, cover handling, psychic abilities, battery costs/recovery, combat benefits, combat animations, SKEET/SKURT!, Kinetic Echo and studio tools. Hold Y charges; release Y activates. Charging remains vulnerable. Full-charge powered time stays roughly 12 seconds. No new tiers, invincibility, abilities, reload systems or unrelated features.

LOCKED SEQUENCE
Shotgun ready → gun dissolves into right arm within opening three frames → grounded strain → heels lift → low float → sustained hover loop → full-charge peak → smooth weapon-ready combat return → energy fade.
Entry and peak must not replay inside the sustained loop. Keep early release, interruption, landing, turning and repeat charging responsive. Keep collision and cover position grounded, with stable ground shadow and intentional body hover offset. Character artwork stays separate from controllable energy effects; glow follows remaining powered energy. Preserve immediate combat input responsiveness and existing powered shooting, sliding, carrying and throwing.

DIRECTIONAL EXPANSION
After d03 continuity passes, continue missing views in small audited batches. Installed coverage is d00 and d06. d03 source work is pending approval/registration. Other source views still missing: d01-d02, d04-d05 and d07-d23 (21 views). Audit actual installed coverage before each batch; do not assume these counts remain unchanged. Use the existing combat sprite for each direction as its facing and equipment-layering reference. Do not generate the whole 360-degree set at once. Show every new sheet as produced; obtain visual approval before installation.

AUDIT AND VERIFY
Compare every selected frame with approved references and its neighbors. Prioritize the same character, anatomical size, helmet/face/armor/backpack/cape/boots/gun, correct direction and layering, stable pelvis/ground anchors, full limbs/barrels and continuous poses. Correct or exclude failed frames before continuing. Verify normal rendering and Kinetic Echo registration remain consistent.

Test entry, moving hold, turning, nearby soft-cover capture/traversal, early/full release, interruption, immediate combat, weapon return, powered shooting/sliding/carrying/throwing, depletion, expiry and fresh-press charging. Reproduce sticking, frame-rate or zoom reports before changing them. Fix only reproduced defects caused by this sequence; report unrelated findings separately. Adobe/video summaries are investigation evidence, not verified causes or authorization. Do not repeat old media processing just to regain context.

Run node tests/cover-movement.cjs and npm run build after relevant implementation changes. Deploy approved changes to the same Railway service; verify SUCCESS for the exact commit and live behavior before requesting a controller playtest. Record checkpoints and approval states in the repository so the next chat can continue accurately.

NEXT CONTROLLER LOOP
Move → hold Y → lift → turn toward front → reach cover → release → shoot → expire → release Y → press Y to charge again.

Work incrementally, conserve credits, use no unnecessary agents, and keep explanations short and plain. Report what changed, what actually passed, the exact artwork still pending, and the next playtest. No broad refactors or unrelated work. Resume this checkpoint; do not restart the project.
