# V12 BATCH 08 — CORNER STOP / PEEK / POP-FIRE

Status: SPECIFICATION READY / CHARACTER-ONLY SOURCE CANDIDATES NEXT. Not an exported or integrated HD animation set.

## Immutable authorities
- Movement: v11.1 / ba742b10; this batch does not change movement code, timings, collision, inputs, or damage.
- Visual: JADE-FINAL-VISUAL-LOCK.md, including the fingerprinted approved large Idle / Ready reference.
- Entry posture: Batch 07's low attached-cover stance. Do not raise Jade to standing merely to make the gun visible.

## First visual pass
One right-hand cover edge, one three-quarter camera view, six large full-body key-pose illustrations. Split the pass into 08A (K01–K03) and 08B (K04–K06) to keep each character large and inspectable. These are source-art candidates until isolated files, transparency, registration and continuity have been checked. Opposite-side and 24-direction coverage remain future work; no mirrored asymmetrical equipment.

K01 CORNER STOP: pelvis and feet remain within the cover face; low braced stance; shotgun close to body.
K02 HEAD CHECK: neck and eyes lead; root does not drift beyond the corner; body remains protected.
K03 SHOULDER CLEAR: thoracic lean and clavicle travel follow the head; elbows articulate; rear hand stays on the weapon grip.
K04 MUZZLE CLEAR / POP-FIRE: support hand stays on the fore-end; both hands remain connected to one shotgun; muzzle clears the separately rendered barrier before firing.
K05 RECOIL: recoil passes through wrists, elbows and shoulder into upper torso; pelvis and foot contacts remain steady.
K06 RETRACT: weapon and shoulders return behind cover, then head; finish matches K01 for a clean return to attached idle.

## Character-only asset separation — mandatory
- The delivered Jade source candidates contain Jade and her held shotgun only. Do not draw a barrier, wall, floor, scenery, attached contact shadow, HUD, caption, or progress panel into these character images.
- Transparent background is the export target; actual alpha must be checked before claiming a usable transparent runtime export.
- Draw the whole body, including limbs that would be hidden by cover during gameplay. A flattened reference with a wall obscuring anatomy cannot simply be cut out and treated as a complete sprite.
- Cover remains a separate environmental image/mesh with independent collision, orientation and damage state. The runtime composes cover, Jade, occlusion and effects separately.
- Ground/root, pelvis, feet, hands, muzzle and cover-contact anchors must be measured after source inspection, not invented as validated coordinates.
- Muzzle flash, dust, debris and other transient effects are separate assets. Do not bake them into the three K01–K03 candidates.

## Cover and pose rules
- Preserve the established 145-degree upper/lower-body constraint; do not silently change its controller interpretation in this art-only batch.
- Do not rotate hips through a wall to solve an aim limitation.
- Aiming must not fire through the cover or spawn a muzzle beyond the wall as a shortcut.
- Reference composites may show a muted, separately composited barrier to explain contact. Character masters and runtime character exports must not contain it.
- Hair, coat and backpack may have restrained follow-through; equipment remains attached and consistent.
- Keep facial identity, luminous pink kitty-ear helmet, black hair, asymmetric black/white coat, Power Glove, battery backpack, knee armor, boots, and approved detail unchanged.

## Resolution and scale
- Target each individual source candidate at 1024 x 1536 pixels with generous uncropped margins. This is a requested output target, not evidence of a completed export.
- The approved reference itself is a 1536 x 1024 composite sheet; those dimensions are not per-sprite measurements.
- Source illustration size, exported frame dimensions and on-screen camera scale are separate measurements. Preserve the approved large-character visual target; verify actual in-game size in a runtime capture before claiming it is measured and final.

## Five review gates
IDENTITY: compare face, ears, helmet, jacket panels, backpack, Power Glove and boots to the pinned source.
BIOMECHANICS: review the support leg, pelvis position, upper/lower separation, recoil and retraction.
CONTINUITY: check successive frames and the return from K06 to K01; directional continuity remains pending until those views exist.
GAMEPLAY: validate anchors, collider relationship and muzzle paths once actual frame files are exported; pending now.
RENDER: check silhouette, unclipped limbs/ears/coat, character readability, alpha and consistent dark manga cel shading.

All gates start pending. These are five review responsibilities, not a claim that independent parallel agents were launched. A generated reference image cannot certify an exported 360-degree family or a Vercel deployment.

## Next production step
Generate and inspect the three character-only 08A candidates at large individual scale. Then make 08B, register the six frames, preview the sequence with a separately rendered cover asset, and record gaps before any runtime promotion. Batch 07 shimmy remains under visual review; Batch 09 corner wrap/exit remains queued. No current gameplay build is replaced by this specification update.
