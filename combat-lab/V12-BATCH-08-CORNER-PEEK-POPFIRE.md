# V12 BATCH 08 — CORNER STOP / PEEK / POP-FIRE

Status: SPECIFICATION READY / VISUAL REVIEW NEXT. Not an exported or integrated HD animation set.

## Immutable authorities
- Movement: v11.1 / ba742b10; this batch does not change movement code, timings, collision, inputs, or damage.
- Visual: JADE-FINAL-VISUAL-LOCK.md, including the fingerprinted approved large Idle / Ready reference.
- Entry posture: Batch 07's low attached-cover stance. Do not raise Jade to standing merely to make the gun visible.

## First visual pass
One right-hand cover edge, one three-quarter camera view, six large full-body key-pose illustrations. They are a reference review, not six extracted transparent files. Opposite-side and 24-direction coverage remain future work; no mirrored asymmetrical equipment.

K01 CORNER STOP: pelvis and feet remain within the cover face; low braced stance; shotgun close to body.
K02 HEAD CHECK: neck and eyes lead; root does not drift beyond the corner; body remains protected.
K03 SHOULDER CLEAR: thoracic lean and clavicle travel follow the head; elbows articulate; rear hand stays on the weapon grip.
K04 MUZZLE CLEAR / POP-FIRE: support hand stays on the fore-end; both hands remain connected to one shotgun; muzzle visibly clears the barrier before firing.
K05 RECOIL: recoil passes through wrists, elbows and shoulder into upper torso; pelvis and foot contacts remain steady.
K06 RETRACT: weapon and shoulders return behind cover, then head; finish matches K01 for a clean return to attached idle.

## Cover and pose rules
- Preserve the established 145-degree upper/lower-body constraint; do not silently change its controller interpretation in this art-only batch.
- Do not rotate hips through a wall to solve an aim limitation.
- Aiming must not fire through the cover or spawn a muzzle beyond the wall as a shortcut.
- Cover remains a separate environmental layer. Reference boards may show a muted barrier to explain contact; runtime character exports must not bake it into the sprite.
- Hair, coat and backpack may have restrained follow-through; equipment remains attached and consistent.
- Final illustration size, export resolution and in-game camera scale are different measurements. Keep the approved visual-scale target without claiming a mockup proves exact runtime size.

## Five review gates
IDENTITY: compare face, ears, helmet, jacket panels, backpack, Power Glove and boots to the pinned source.
BIOMECHANICS: review the support leg, pelvis position, upper/lower separation, recoil and retraction.
CONTINUITY: check successive frames and the return from K06 to K01; directional continuity remains pending until those views exist.
GAMEPLAY: validate anchors, collider relationship and muzzle paths once actual frame files are exported; pending now.
RENDER: check silhouette, unclipped limbs/ears/coat, character readability and consistent dark manga cel shading.

All gates start pending. A generated reference image cannot certify an exported 360-degree family or a Vercel deployment.

## Next production step
Review Batch 07 shimmy and Batch 08 corner-key visuals together. Then isolate approved character-only source frames, measure anchors against v11.1, preview the sequence and record gaps before any runtime promotion. Batch 09 corner wrap/exit remains queued.
