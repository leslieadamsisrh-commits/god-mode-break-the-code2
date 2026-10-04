# JADE 2D RIG CONTRACT — Animation Language Pass 01

Status: active Studio production contract. Master remains untouched.

## Principle
Approved Jade art is source material, not inspiration. Build animation by reusing approved silhouettes/components and authoring only genuinely missing motion. Gameplay root is authoritative; visual parts register to it.

## Canonical attachment graph
root/pelvis
- lower_body -> planted_foot_L / planted_foot_R
- torso -> head_helmet
- torso -> backpack
- torso -> cape
- torso -> shoulder_L -> forearm_L -> power_glove_L
- torso -> shoulder_R -> forearm_R -> weapon_hand_R
- weapon_hand_R -> weapon -> muzzle
- cover_contact is presentation-only and resolves from authoritative coverAnchor normal/tangent

## Registration rules
1. One anatomical scale per source family. Never stretch individual poses.
2. Feet/root define world registration. Never move authoritative collision to repair art.
3. Cover contact may receive presentation-only offset along cover normal/tangent.
4. Weapon hand and muzzle are explicit sockets.
5. Backpack, straps, cape and asymmetric equipment never mirror automatically.
6. Layer overlap is allowed; visible seams are not.
7. Animation may be interrupted at any time. Gameplay never waits for a visual connector.
8. Missing component/pose: exact approved -> compatible approved connector -> last valid Jade. Never debug rectangle.

## Approved source families
- runtime ready/run/slide/cover directional atlases
- cover d02/d03/d04 aim + recoil
- cover d03 recoil + retract
- psychic d03 reach + hold + retract
- God Frame d00/d03/d06 charge/hover/return

## Bridge Pack 01
B01 slide-to-cover pre-impact
B02 cover impact/compression
B03 impact-to-brace settle
B04 brace-to-lateral-left start
B05 lateral-left stride
B06 brace-to-lateral-right start
B07 lateral-right stride
B08 lateral-to-brace stop
B09 brace-to-LT exposure rise
B10 d02-d03 aim intermediate
B11 d03-d04 aim intermediate
B12 brace-to-A push-off
B13 push-off-to-slide/run escape
B14 slide-to-shotgun aim
B15 locomotion-to-shotgun aim
B16 shotgun recoil-to-locomotion recovery

## Production rule
Before authoring a whole new full-body frame, test whether the pose can be assembled from approved lower body + torso/arm/equipment components under this contract. New painting is reserved for anatomy/silhouette that cannot be produced cleanly by component reuse.
