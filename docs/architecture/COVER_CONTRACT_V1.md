# GOD MODE — Cover Contract V1

Status: Studio architecture contract. Does not change gameplay tuning.

## Authoritative state
Network/simulation owns: cover id, transform/footprint, class, hp/destruction state, generated state, attachment player, face/edge anchor, cover mode, collision and gameplay-affecting openings.
Presentation owns: FACE/EDGE/CORNER label/hysteresis, sprite choice, visual contact offsets, cosmetic chips/debris, masking and camera treatment.

## Classes
- waist: full crouched concealment; may expose/fire over top; edge/corner exposure allowed.
- tall: full concealment; no over-top shotgun clearance; must use edge/corner exposure.
- generated/destructible cover must declare one of the same gameplay classes rather than inventing separate exposure rules.

## Attachment grammar
FREE -> APPROACH -> IMPACT -> SETTLE -> FACE -> EDGE -> CORNER -> EXPOSE/FIRE/RETRACT -> ESCAPE.
Animation describes these states and never delays authoritative movement.

## Registration
Root/collision never moves to repair artwork. Presentation uses root/pelvis, feet, cover-contact socket, shoulders, weapon hands and muzzle.

## Destruction
Authoritative: hp and any collision/opening changes.
Cosmetic: debris, particles, cracks, fragments. Cosmetic debris never becomes network state unless promoted into gameplay matter.

## Multiplayer
Synchronize attachment/topology inputs and authoritative cover state. Do not network animation frame numbers or cosmetic debris.
