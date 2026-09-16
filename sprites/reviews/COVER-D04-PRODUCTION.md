# Cover contact d04 production record

Generated 2026-09-16 as the first missing directional contact batch after the
visual-design approval of C001-C012. This remains isolated from combat code.

## Scope

- Frames C013-C018: six independently drawn cover-contact frames.
- Nominal viewpoint: d04 / 60 degrees, awaiting in-engine angle verification.
- Action beats: slide braking, boot plant, shoulder contact, impact absorption,
  settling, and attached stance.
- The approved d03 C001-C012 artwork was the identity, equipment, pose-quality,
  and animation-beat authority. The recovered legacy d04 sheet was used only as
  a rough viewing-angle cue because it contains contamination and mixed actions.
- No mirroring, flipping, rotation, stretching, or transformed directional reuse.

## Repairs and validation

The first generated candidate was rejected because frames touched cell edges and
the planted-foot relationship drifted. A targeted correction preserved the d04
drawings while restoring padding and a consistent wide stance for frames 3-6.

The generated master uses a blue production background. Deterministic chroma
extraction creates a true-alpha runtime atlas. The runtime was inspected against
light, dark, and checkerboard backgrounds. Full silhouettes, shotgun, hair,
cables, coat tails, boots, and four illuminated cyan backpack segments remain
present. Runtime ground is registered to [125,219]. Camera angle, muzzle, hands,
and cover-contact sockets remain nominal or estimated until gameplay validation.

Because the repository binary interface limits individual transfers, the
lossless 1536x1024 source atlas is stored as six ordinary 512x512 PNG source
cells. Reassemble C013-C018 left-to-right in a 3x2 grid to reproduce the atlas.
This is lossless source preservation, not a Base64 archive or lossy conversion.

## Status

Generated and technically reviewed. Not gameplay-integrated. No movement,
collision, timing, resource, control, networking, or performance values changed.
The next small batch is the corresponding six-frame attached-idle d04 loop.
