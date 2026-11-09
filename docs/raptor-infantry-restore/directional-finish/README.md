# Raptor 39T15 directional cover pass

The isolated release includes the approved left and right stationary wraps from the [stationary wrap pass](../stationary-wrap/README.md) and the back-right hold and shuffle. No new catch, low pop, low retract, or additional tall exposure family is enabled. Existing gameplay uses its established fallbacks for those cases.

## Art inventory

| Item | Count | Status |
|---|---:|---|
| Saved lateral wrap drawings | 6 | Live. Three per side, with the pivot reused on retract. |
| Directional drafts reused | 2 | Back-right hold and shuffle A from the preceding 48-frame set. |
| Corrected drawings | 3 | Back-right shuffle B is live. Front and straight-back aim stay in review. |
| New connector drawings retained for review | 17 | Tucks, pivots and low retracts. |
| Rejected connector exports | 3 | Front pivot and rear pivot and retract turn the gun the wrong way. |

The rear revision points the original shotgun away from camera at shoulder height and leaves a foreshortened muzzle tip visible. The front revision keeps the head-on barrel direction and restores the grip and tail curve from the front hold. The back-right shuffle changes the grounded foot while preserving the protected camera facing.

Registration records the ground anchor, planted foot, pelvis, uniform scale, and visible muzzle. The back-right shuffle B WebP is a review copy of the same drawing installed as a 512 px RGBA PNG in the runtime atlas.

## Visual release gates

The back-right hold and shuffle were checked together against a common ground line and on a rotated rail in the browser. Both directions cycle through the opposite foot plants and return to the same hold when movement stops. The wall remains fixed.

The wider wraps still need matching ground contacts and concealment. The projected-face sweep used two wall windings, three rotations per facing and four distances from the endpoint. It sampled the camera-far face of the wall. The lateral wraps kept the tucked muzzle behind steel and the aiming muzzle visible on all 24 sampled cases per facing. Several wider tucks exposed the barrel. The rear aim can also be hidden by the wall at some angles. Those failures require pose corrections before adding those directions to the active atlas.

## Reachable transitions

The 13,728-tick sweep on the active inventory found 40 catch transitions, including 32 that change facing, 40 tall-aim pairs at each local endpoint, and 64 low-cover aim pairs. The counts match the prior baseline. They measure gameplay combinations, separately from the art count. The active atlas uses the authored sockets for both lateral wrap aim frames. Front and rear review sockets stay outside that sweep.
