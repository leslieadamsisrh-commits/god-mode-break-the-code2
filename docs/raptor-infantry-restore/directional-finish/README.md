# Raptor 39T15 directional cover pass

## Art review after the rollout was paused

The isolated Character Lab is back on the lateral-only release at `da1c3306b30f790ad0511a9359bd868fa2b90a02`. The back-right rollout and wider trials remain recoverable in history. The activation notes below record the earlier test passes.

The wider tuck drafts widened the torso and belt, made the posture more upright, and bunched the legs into a round crouch. Rotating the muzzle inward produced a gun held backward in several frames. Passing the projected mask did not validate either the silhouette or the weapon handling.

The [single front-right retry](front-right-low-ready-review.png) starts from the lean aiming stance. The stock sits near the shoulder, the trigger hand stays behind the support hand, and the twin barrels point forward and down. The provisional authored muzzle still appears outside the steel mask in all 24 sampled camera-far placements. This remains a low-ready art candidate. The next tuck needs to shorten its projection while preserving the correct grip and forward barrel order.

## Earlier directional verification

The isolated release includes the approved left and right stationary wraps from the [stationary wrap pass](../stationary-wrap/README.md) and the back-right hold, shuffle and stationary tall wrap. The other five facings, new catches and low-cover pop and retract remain in review. Existing gameplay uses its established fallbacks for those cases.

## Art inventory

| Item | Count | Status |
|---|---:|---|
| Saved lateral wrap drawings | 6 | Live. Three per side, with the pivot reused on retract. |
| Directional drafts reused | 3 | Back-right hold, shuffle A and tall aim from the preceding 48-frame set. |
| Corrected drawings | 3 | Back-right shuffle B is live. Front and straight-back aim stay in review. |
| New connector drawings saved | 17 | Back-right tuck and pivot are live. Fifteen other tucks, pivots and low retracts stay in review. |
| Rejected connector exports | 3 | Front pivot and rear pivot and retract turn the gun the wrong way. |

The rear revision points the original shotgun away from camera at shoulder height and leaves a foreshortened muzzle tip visible. The front revision keeps the head-on barrel direction and restores the grip and tail curve from the front hold. The back-right shuffle changes the grounded foot while preserving the protected camera facing.

Registration records the ground anchor, planted foot, pelvis, uniform scale, and visible muzzle. The back-right shuffle B WebP is a review copy of the same drawing installed as a 512 px RGBA PNG in the runtime atlas.

## Visual release gates

The back-right hold and shuffle were checked together against a common ground line and on a rotated rail in the browser. Both directions cycle through the opposite foot plants and return to the same hold when movement stops. The wall remains fixed.

The back-right tuck, pivot and tall aim share one registered planted foot. The full exchange passed at both wall-local endpoints on three rotations. The remaining wraps still need matching ground contacts and concealment. The projected-face sweep used two wall windings, three rotations per facing and four distances from the endpoint. It sampled the camera-far face of the wall. The lateral and back-right wraps kept the tucked muzzle behind steel and the aiming muzzle visible on all 24 sampled cases per facing. Several wider tucks exposed the barrel. The rear aim can also be hidden by the wall at some angles. Those failures require pose corrections before adding those directions to the active atlas.

## Reachable transitions

The 13,728-tick sweep on the active inventory found 40 catch transitions, including 32 that change facing, 40 tall-aim pairs at each local endpoint, and 64 low-cover aim pairs. The counts match the prior baseline. They measure gameplay combinations, separately from the art count. The active atlas uses the authored sockets for the three verified stationary aim frames. Front and rear review sockets stay outside that sweep.
