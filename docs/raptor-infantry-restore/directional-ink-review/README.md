# Directional ink candidates

This is the original 48-draft checkpoint. For current activation status and the corrected back-right shuffle, see the [directional cover pass](../directional-finish/README.md).

This folder holds 48 full-body transparent drawing candidates across eight camera facings. Each direction has a slide catch, hold, two shuffle steps, low pop and tall aim. Registration records source crop, provisional pelvis and support-foot landmarks, uniform draw scale per facing, and the visible barrel tip. Each sprite is isolated from the wall. The active manifest and stationary-wrap install script exclude these frames.

## Reachable transitions

Run `node tests/report-raptor-cover-reach.cjs` from the repository root. The 60 Hz authority sweep ran 13,728 fixture ticks across 24 wall rotations and all four faces. The capture pass sends actual slide movement into the wall and measures the protected facing from the resulting anchor. The exposure pass sets both canonical local endpoint anchors for tall cover and the center anchor for waist cover, then sweeps aim in 10° steps. The tall inset is 12 units on the long faces and 6 on the short faces.

| Transition | Unique sampled pairs |
|---|---:|
| Incoming catch → protected facing | 40 |
| Catch transitions that change facing | 32 |
| Local start endpoint → tall aim | 40 |
| Local end endpoint → tall aim | 40 |
| Protected facing → waist aim | 64 |

These are observed combinations with the 39T14 atlas and its existing muzzle sockets. Rerun clearance with each final authored socket and target geometry.

| Facing | Catch → protected face | Start endpoint → aim | End endpoint → aim | Low hold → aim |
|---|---|---|---|---|
| right | right, front-right, front, back, back-right | right, front-right, front, back, back-right | right, front-right, front, back, back-right | right, front-right, front, front-left, left, back-left, back, back-right |
| front-right | right, front-right, front, front-left, back-right | right, front-right, front, front-left, back-right | right, front-right, front, front-left, back-right | right, front-right, front, front-left, left, back-left, back, back-right |
| front | right, front-right, front, front-left, left | right, front-right, front, front-left, left | right, front-right, front, front-left, left | right, front-right, front, front-left, left, back-left, back, back-right |
| front-left | front-right, front, front-left, left, back-left | front-right, front, front-left, left, back-left | front-right, front, front-left, left, back-left | right, front-right, front, front-left, left, back-left, back, back-right |
| left | front, front-left, left, back-left, back | front, front-left, left, back-left, back | front, front-left, left, back-left, back | right, front-right, front, front-left, left, back-left, back, back-right |
| back-left | front-left, left, back-left, back, back-right | front-left, left, back-left, back, back-right | front-left, left, back-left, back, back-right | right, front-right, front, front-left, left, back-left, back, back-right |
| back | right, left, back-left, back, back-right | right, left, back-left, back, back-right | right, left, back-left, back, back-right | right, front-right, front, front-left, left, back-left, back, back-right |
| back-right | right, front-right, back-left, back, back-right | right, front-right, back-left, back, back-right | right, front-right, back-left, back, back-right | right, front-right, front, front-left, left, back-left, back, back-right |

The catch row names the incoming facing. The two tall columns use the direction away along the wall tangent. The low row starts at the protected face. Shuffle remains a distance-driven transition within a protected facing, and moving psychic cover uses its own art. Each approved exposure must be checked again with its authored muzzle.

## Activation status

The lateral stationary-wrap trial contains the only two complete sequences ready for isolated playtest. Each uses three unique drawings and reverses the pivot during retract. The wider set has 48 candidate drawings across eight facings, up from 18 at the previous checkpoint. That adds 30 drawings, including two newly drawn front-facing exposures that replace the earlier side-pointing local drafts. No directional candidate is active.

The front replacements put the muzzle in the head-on aim sector. Their grip and tail still change too much between hold and exposure. The straight-back aim candidates point sideways, and the alternate drawing hides the barrel entirely. The back-right shuffle repeats one foot contact. Several other facings change jaw opening or shotgun shape between adjoining frames. The six other aim facings still need registered tall-edge tucks and pivots, and the eight-facing low retract sequence remains open.
