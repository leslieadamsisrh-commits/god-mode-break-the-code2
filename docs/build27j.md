# Build 27J — sectional psychic cover

Candidate based on 27I f674f73992709069c4c01e304367ff1840bbac99. Local source directory is not a Git checkout; Git data operations preserve the base tree and binary assets. Main playtest remains unchanged.

## Implemented

- Map-layout definition d33-nw-primary is anchored and rip-compatible. Other supported loose objects retain existing manipulation. Essential architecture is unchanged.
- A barrier splits into authored 28% / 44% / 28% sections along its local width. Stable section IDs retain the parent placement ID. Center becomes held; end sections remain anchored. Section hp/maxHp sum to the original. The same trusted material UV interval renders before and after removal; the whole sprite is not shrunk into a fragment.
- Existing approved material definitions supply concrete faces; a geometric material fallback remains available. Binary production artwork was not available in this local source copy, so its live appearance has not been verified.
- Tear takes 0.28 seconds after a fresh Grip press. The target is locked. Server validates reach, vertical difference <=64, line of sight, battery, eligibility, state and clearance. Existing grip cost (4 default) is charged only on successful detachment. Interruption before detachment clears the claim without charge. Releasing Grip does not cancel the started tear or drop the acquired shield. Death, knockback, charge, shield, slide, invalid target or insufficient energy interrupt it. Two claimants cannot receive the same section.
- Fresh Grip remains deliberate drop; RB places and RT throws. Ripped/generated cover survives Grip release, including stale network input cleanup. Older loose-object analog release behavior remains available.
- Remaining sections use physical cover volumes: central opening admits shots, side pieces still block. Existing cover attachment to the original parent is released. Rematches restore intact starting cover; match damage does not change saved layouts.
- Generated forms: WIDE WALL 128x28x48, TALL SLAB 76x28x80, COMPACT BLOCK 60x42x48 world units. Existing shape-cycle input selects a form or requests reshape while holding generated cover. Natural fragments cannot reshape.
- Reshape takes 0.24s, minimum 0.4s between requests, no extra battery charge. Health and identity persist. Throw/place are suppressed during transition. Destination and intermediate physical shapes are checked. An invalid initial request preserves the old form. A new obstruction during transition stops at the last valid intermediate dimensions; this is explicitly not rollback to the initial shape.
- Removed obsolete fixed rectangle in psychic field rendering; field plane uses actor Z, connection uses actor and held-object Z, helmet endpoint raised to 52. Existing structure clipping wraps world projection rather than discarding the effect transform. Bullet-time mechanics are unchanged.
- Sectional faces and occlusion use matching dimensions, elevation, and hover. Tear cue uses existing authoritative event deduplication/audio path. Rip sound has not been listened to in browser.
- Fixed shared-edge numerical overlap in settling/carry validation (0.01 world-unit tolerance), which could trap or damage a freshly detached section.

## Verification

Production compile and type checking passed; production server started and served the new API test. Build 25, 26, 27A, 27B adapter/integration, 27C, 27D, 27E, 27F, 27G, 27H, 27I and 27J scripts pass. The 27H elevated construction fixture moves y180 to y210 so the wider rotated generated wall fits within the arena; assertions retained.

New simulation tests cover detachment, conserved health, persistent hold, release after completed rip, throwing, energy interruption, reshape health/identity, simultaneous claims, central projectile opening/protected sides, height rejection and rematch reset.

New two-client HTTP test runs against production Next server: shared authoritative sections/ownership, persistent hold, intact rematch and unmodified layout pass. These are independent authenticated HTTP clients, NOT two browser clients.

Native canvas image checks sectional fallback geometry only, NOT production gameplay art. Build27C 24-object simulation: p50 0.126ms, p95 0.446ms, max 7.393ms; 90 layout generations/reproduction 3820ms. These are not rendered frame pacing or FPS.

## Outstanding acceptance / limitations

- Actual two-browser and iPad playtests, production-art screenshots, rendered frame pacing and end-to-end feedback latency are unverified.
- Live helmet-field layering, cue/audio feel, every stair/throw/reshape clearance scenario require preview verification.
- One central removable section per supported family; anchored remnants are not recursively ripped.
- Fragment mass response still uses source asset mass, not proportional section mass.
- Rip line of sight against other cover is conservative in XY; not all cross-height visibility cases are supported.
- Mid-reshape interruption can retain a valid intermediate shape as described above.
- Multi-fragment powered-up commands and new Jade leg animation are not implemented. Existing recoverable behaviors are preserved.
- Deployment status must be read live; this document is not proof of deployment.
