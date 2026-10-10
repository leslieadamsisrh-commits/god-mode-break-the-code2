# Ground Peel44 — first psychic-defense batch

Continuation of Defense & Feedback43, parent `41df7d9f0e672f4fb6ed48765a72e87caec55b9b`. Candidate branch: `studio/ground-peel-44`. No baseline replacement. The user's MASTER CONTINUATION — PSYCHIC MATTER, EVOLVING COVER & MULTIPLAYER COMBAT is the governing brief; `PSYCHIC_MATTER_ROADMAP.md` records its staged execution.

## Recovered authority

The current local source matched exact Combat43 before editing. Historical continuation branch still points to Combat42. Railway's latest SUCCESS was Combat43 deployment `44bb6ae3-08f7-481d-9f78-54695e1d9f41`, commit43, checked on 2026-10-10. The live service was pinned to that commit; nothing was staged before this batch. Candidate source changes are staged separately for the user's deployment action.

Source defaults remain walk222.7, boost430/.16, slide490/.50, double-tap.28, charge easing.67145; approved Weave steering/sustain, Kinetic Brake, input priorities, independent aim/escape, camera and local fixed60Hz remain. The older 620/.19 and689.15949375 freeze is not silently restored.

Latest available recording `ScreenRecording_10-10-2026 00-26-58_1.mp4` is Combat43. Reviewed around2:08–2:13: the nearby-cover label can imply protection without attachment. Video has no input trace; it cannot establish a controller fault or frame-rate cause. The44 HUD explicitly says NEARBY, ATTACHED or CAPTURED and warns ANGLE MATTERS. It does not claim to calculate an actual protected side yet.

Approved assets found: concrete barrier, stone/metal matter42 atlas, sedan/van, cabinet, girder and railing. No street-lamp asset. Vehicles/industrial objects retain their existing whole-object behavior; extraction of individual sections is not implemented. The current Bay Bridge arena artwork remains, with no new Dimension33 level-art claim. Jade artwork untouched; no rejected melee-reference sheets integrated.

## Implemented

- A bounded surface ledger:15 ground patches, three units each,45 finite units. Surface coordinates are mirrored across the arena's centerline. Only non-depleted sources inside the actual psychic field participate; living cover footprints make underlying sources ineligible. No map boundary destruction, holes or navigation changes.
- Recipe priority: complete2stone+1metal salvage recipe (360HP), then complete3stone recipe (280HP), then nearest eligible ground units (280HP), distance/id tie order. Partial recipes remain untouched. No unlimited-concrete fallback in new44 games. Snapshots without the ledger retain the older projection contract for compatibility.
- RB still directly creates cover with unchanged30battery cost, two-owned-cover limit, aim direction, placement search and wide/compact footprints. Placement, energy and supply rejection happen before consuming matter; an immediate hint names the reason. No new reshaping/dismantling input overload.
- Cover is opaque, solid and protective immediately on successful creation, preserving43 defensive timing. Three existing raster fragments travel from recorded origins toward the base over.24seconds; the final team emblem appears during the last part. The scene shows a shallow persistent scar at peeled sources. This is a brief assembly visualization of immediate protection, not a gradual collision-growth system.
- Each physical cover records exactly its consumed material units. Breakup returns those units as salvage without restoring depleted ground. Rebuilding consumes the same units. Ground provenance and unit identity survive recycling; repeat damage cannot refund twice.
- Original creator remains `constructOwner`; fixed stamped identity is `stamp44`; current grip controller comes from existing player ownership and throw attribution remains existing `throwOwner`/`attackId`. Captured cover retains its original stamp. Rebuilding from rubble creates a new construct/stamp; persistent rubble emblems and achievements are later work.
- Bounded authoritative matter budget raised64→128 to accommodate finite surface stock plus the existing initial24 and map salvage. Current arena has at most99 units under the full finite inventory; no passive spawn. Cosmetic144/192 budgets remain unchanged. Assembly adds only three client-drawn fragments per forming cover, not new network physics pieces.
- Combat43 feedback, optional haptics-off-default, frame diagnostics, hit events, ownership protection and dematerialization preserved.

## Validation

PASS: ground44, updated cover41 contract, living42, defense43, local40, melee38, connections34, grip35, grip36, integration31, combat26, TypeScript and production build.

`node tests/ground44.cjs`:16 rotated/both-slot/shape constructs; mass conservation through capture/break/rebuild; exhausted/out-of-field/anchored/blocked/energy/limit rollback; recipe priority and ownership; held RB/freshY and rematch; full refund beyond old64-piece boundary.

`node tests/frozen38.cjs ../baseline44/lib-game.ts`:1,800 frames against exact43 source, unchanged tested configuration/movement/energy/weapon/shield/Grip/charge/escape. The test's historical log text says exact37B; the supplied comparison source is43. This test does not assert identical outcomes in environments with the intentionally new material supply.

`tests/cover41.cjs` now expects finite three-unit peel/refund instead of free projected cover. Original attachment/escape, real shotgun obstruction and two-volley-survival assertions remain. This explicitly documents the44 economy change rather than concealing it as a baseline pass.

Native six-frame renderer fixtures use actual approved environment/matter atlases and production functions: scar,0/80/160/240ms assembly, other-team compact cover and captured original stamp. These are static rendering checks, not a controller playtest or iPad FPS measurement.

`GOD_MODE_EXPECT_BUILD=COMBAT-MASTER-STUDIO-44 node tests/run-http44.cjs`: production-server two-authenticated-client tests for shared source depletion, physical cover/stamp snapshots, RB hold, freshY and reset; also existing HTTP42/38 tests. The first fixture aimed out of bounds from the north edge and correctly rejected NO BUILD SPACE; it now aims into the open lane. No placement rule was weakened to satisfy the test.

Historical matter33 retains its pre-existing forced heavy-selection failure already found on41/42/43; not counted as a green full suite.

## Remaining acceptance and next batch

After the user deploys, play local practice and a private duel with James: emergencyRB from both sides, aim changes, energy/material denial, freshY, all X choices, Grip/RT, cover capture/throw, zero-batteryA/left-stick escape and rematch. Check small-fragment visibility, field depletion readability, HUD on iPad and sustained frame pacing. No claim of Internet latency or device FPS improvement.

Next small batch: actual failing panels and collision openings, then explicit reshaping of surviving mass/durability. Repulse, FaultLine, new sources, clan-image uploads, campaign progression and the full end-to-end master exchange are not yet implemented. Ground patches are currently a finite prototype ledger, not arbitrary peeling anywhere on the map; depletion can deny emergency cover, so source visibility and field distribution need device acceptance before balance tuning.
