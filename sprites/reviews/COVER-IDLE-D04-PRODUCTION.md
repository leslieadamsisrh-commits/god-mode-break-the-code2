# Cover attached-idle d04 production record

Generated 2026-09-16 after approval to continue routine shotgun sprite batches.
This batch remains isolated from combat code.

## Delivered

- C019-C024: six independently generated attached-idle breathing phases.
- Nominal viewpoint d04 / 60 degrees, awaiting in-engine angle verification.
- C018 was the fixed stance, identity, weapon, scale, and handoff authority.
- All frames preserve the wide planted squat, supported shotgun, serious adult
  heroine, cat-eared helmet, cables, magenta coat tails, and four cyan battery
  segments.

## Rejected attempts

Two sheet-level attempts were rejected because they introduced a visible pose
jump between taller and lower crouch families. They were not saved to the branch.
The accepted method generated each breathing phase separately from C018, then
normalized the family to one scale and ground anchor without pose warping.

## Technical review

The six lossless 512x512 source cells were chroma-extracted into a true-alpha
750x500 runtime atlas. Full silhouettes were checked on light, dark, and
checkerboard backgrounds. Runtime ground is registered to [125,219]. The loop
holds a stable muzzle line and planted stance; animation remains deliberately
subtle. Camera angle, hand, muzzle, and cover-contact sockets remain nominal or
estimated until gameplay validation.

## Status

Generated and technically reviewed. Not gameplay-integrated. No combat timing,
movement, collision, resources, controls, networking, or performance values were
changed. Contact C013-C018 and idle C019-C024 now form the d04 review pair.
