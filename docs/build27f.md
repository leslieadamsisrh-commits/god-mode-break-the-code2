# Build 27F — open arena and persistent floating cover

Based on c6917ca9190ca19879e6b676e39acdb911998dcc. Preview only; main unchanged.

## Changes
- World 2200 × 1100; playable bounds 103..2097 × 118..1008 (~1.92 times previous playable area). Spawns 600/1600, y563, outside overhead decks.
- Existing north/south stairs and platforms scaled in XY, height remains72. Connected side routes and southern links. Jade, cover hulls, jump355/gravity900 unchanged.
- Large clean floor zones, subdued33 center marking, cyan/magenta flank strips. Removed repeating pristine floor-ledger grid and small textured deck repeats. Floor triangle overlap reduces raster seams.
- Grounded stair-to-deck transition no longer pushed away by slab collision. Ordinary contact no longer auto-attaches; intentional slide capture remains.
- RB creates into persistent hold; RB again places on clear ground; RT throws without shotgun leakage. LB Grip retained. Energy-only formation consumes available floor matter first, then energy-formed components. Four active constructs per player.
- Build20 battery, hold0.5/sec, idle shield3/sec, regeneration18/sec after0.5s. No placed-cover upkeep or distance expiration. Damage and shield impact costs unchanged.
- Carried/thrown cover checks structural clearance, retains hold when blocked. Elevated placement unsupported. Hover remains the existing presentation offset rather than a new full cover-Z simulation.
- Layout schema2 migrates version1 coordinates once, keeps IDs. Original storage backup/export, invalid layouts available as repair drafts with red placements; server and playtest still demand full validation. Temporary match state remains separate.

## Verification
Production Next build passed. Build25/26/27A/27B adapter/integration/27C/27D/27E and focused27F tests passed (historical geometry fixtures updated to larger arena). North/south stairs tested through full combat advance, not only elevation helper. Seed reproduction/90 layout generations, rematch/reset, trusted definitions verified.
Two independent HTTP clients passed shared layout/objects, host restrictions, airborne fire/shield, rematch reset. This is not two-browser acceptance.
24-object simulation measured p50~0.19ms/p95~0.65ms in one run. Isolated structure renderer p50~0.96ms/p95~1.72ms. Neither establishes rendered60FPS or iPad frame pacing.
Camera code unchanged, preserving pullback. Sampled actual27C camera footprint ~895×693; this is wider than original27B750×420 target. Historical minimumZoom helper still tests750×420. Do not conflate these.

## Remaining acceptance
Dedicated jump/landing leg frames not integrated; no retuning or sprite stretching used. Production reference-matching architecture, unique flank art, authored team graffiti, full cover vertical physics and foreground visibility need further work. Current existing stamp/cyclone/damage art reused. No claim of final visual parity with the reference sheets. Local source build lacks most binary assets; remote base tree preserves all assets. Browser touch/editing and two-browser combat, live visual acceptance and rendered frame pacing must still be checked after deployment. No main promotion.
