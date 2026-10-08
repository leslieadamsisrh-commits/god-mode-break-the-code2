# Matter & Impact 30

Continue from Psychic Control 29, `d619c69f266a54b98969b2196408fc5c42dd4ea0`, verified Railway SUCCESS deployment `b809d123-1484-4275-acaf-8567b7f0c010`. Same repository, branch, service and URL; master/checkpoints untouched.

## Connected loop

- Practice and private duel start with two physical salvage kits, each two stone and one metal. Fragments use the existing approved Jersey/cabinet textures. World-cover destruction still returns three reusable fragments of its material. Pieces remain on the ground after throwing rather than expiring after three seconds. Overall matter cap remains 64.
- Field inventory includes eligible loose matter and your own held/orbiting pieces within the selected 135/235/335 reach. Another player's held matter and fast thrown projectiles are excluded from building/gathering. The side HUD reports reachable stone/metal units and build readiness.
- D-pad up gathers up to three nearby pieces into the recovered Orbit system; press again to release. Cost is existing Grip cost per piece (4), hold cost is existing 3/second for the group, and launch costs existing 6. Hold LB and fresh-press RT to launch the fan; weapon fire is suppressed for that launch. Existing keyboard O/P and other controller actions remain.
- LB + right-stick aim continues rotating a whole cover around the holder through the swept 29 carry path. LB release drops; RT fresh press throws. Charge and battery exhaustion release Orbit cleanly.
- RB fabricates the approved Jersey using a new starter recipe of two stone, one metal, and 30 battery. Recipe values are new integration choices, not claimed recovered legacy tuning. Components are consumed atomically only after energy, placement and the shared four-construct limit pass. Placement uses the existing rotated footprint/player constraints and searches open road within the field.
- Construct ownership records the three consumed components. Each construct costs 1 battery/second upkeep. Breaking it, leaving the owner's field, exhausting battery or losing its owner returns exactly those three components. Returning matter clears cover/Grip references; dying during the lethal frame also dissolves owned constructs. Repeated cleanup cannot duplicate resources. Rematch restores six starter pieces and clears constructs/orbits.
- Practice bot now invokes the same gather/build/throw rules, with no separate bot economy or damage model.

## Impact/rendering

- Confirmed hits on the synthetic practice bot produce directional metallic cyber-fluid droplets, inked streaks and bounded oil/chrome floor stains (max 12, four-second life). Human impacts remain digital cyan/magenta fragments; human death remains digital dematerialization. Nonhuman bot aftermath uses metallic droplets.
- Same-burst hit visuals coalesce while individual authoritative damage events are retained. Shield blocks produce no impact spray or stains. Existing health, damage modifiers, shotgun cadence/spread, knockback and finisher timing are unchanged.
- Tightened pellet rendering adds inked short trails and bright projectile heads in the existing swept shot/occlusion path. Resource and construction particles reuse approved object atlases; the approved d03 psychic pose is also selected for Orbit when available and not firing.
- No dedicated blood/bullet sprite atlas was located in the current tree and inspected V57 recovery sources. Spray/tracers are procedural, not claimed imported sprite sheets. Existing pose/sprite-loader paths remain; no art generated.

## Verification

Automated: economy30 exact resource boundaries/ownership, gathering, release, launch, charge/empty battery, build rollback, two-slot resource contention, break/battery/range/death conservation, shield/digital/cyber classification, visual coalescing, rematch cleanup, and 4,800 practice frames with finite material totals and no orphan ownership. Psychic29 retains 1,500 identical frozen movement frames. Combat26, three-cover25, restoration27, fight23/24, stage28, presentation28 and spatial21 passed. Existing reset assertions changed intentionally from empty/eight pieces to the six-unit starter economy. Production build/type checks passed. HTTP30/29/28/26 exercise actual API ownership/economy, time field, private invites, stream and countdown.

Visual: actual Canvas renderer, four economy/impact panels, field views, 128 camera/rotation scenes, 80 actor cells, missing-art fallback. Approved ready d00 is the audit pose; full directional animation/device certification is not claimed.

Real-device: 30 still needs controller feel and two-device latency playtesting. Unfinished: dedicated fluid/projectile atlases, full directional psychic carry/Orbit animations, vehicle face registration at all rotations, more bay exposure, deeper combo/escape rules, parry reflection, Unmake/ground tearing, additional weapons and higher Weave progression. Weave 28 values, Camera B 1.85, collision hulls/rails, approved art and private multiplayer transport remain.
