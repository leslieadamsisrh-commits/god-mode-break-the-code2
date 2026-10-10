# War Games Scale47

Continuation of46, commit69e8dbc821dad8c5546cce573b157214c83f57ff. Verified46 branch HEAD and Railway SUCCESS deployment3ab0ba5e-38e1-4b32-a1e5-7c34741b47b2 before editing; no pending Railway changes. No rebuild/reset or asset regeneration.

User correction: stadium composition is coherent but characters dwarf the arena. The prior rendering preserved the older close-combat upright unit while compressing the world plane into the original painted stadium.47 sets a single upright/elevation presentation multiplier to0.64: bodies are36% smaller in each dimension, so the arena reads1.5625 times larger relative to them. Jade proportions, equipment, artwork, foot anchors and configured spriteScale remain unchanged. This changes presentation scale rather than enlarging gameplay distances or changing camera follow/zoom.

Physical cover elevation, hover offsets, shot height, impact/muzzle effect elevation and actor sprites share the multiplier. Floor positions, cover footprints, inverse pointer mapping and screen-stick world mapping remain46. Slide echo artwork now uses the same registered upright transform as Jade instead of the old deck-pitch transform. Existing map shelters and floor-panel/finite-matter cycle remain intact. Gameplay movement/collision dimensions, controls, charge, camera configuration1.85, local clock and transport are unchanged. Build identifier advances to47. Source game.ts changes only that identifier.

PASS scale47:15 positions/zoom combinations verify actual canvas upright foot/head/width transforms against projectWorld and cover/effect vertical displacement. PASS floor46: LB/RT/RB, damage conservation, material conservation/capture/reset,24 screen-stick rays and3,969 inverse points. PASS Defense43, Melee38, Cover41, isolated1,800-frame freeze against exact45 source, TypeScript and production build.

Native actual renderer produced spawn, center and both flank fixtures with two shelters then full map, plus the physical-panel cycle. Screenshot uses static approved ready artwork for both players, not directional animation or device-controller evidence. Last native complete-draw fixture median69.189ms/p9588.150ms/max91.707ms; an earlier47 run measured100.550/135.578/139.055ms. Software container timing varies and is not browser/iPad FPS or an optimization claim.

PASS two-client production HTTP46 on build47 (floor extraction/formation/shared ownership/reset), HTTP42 (controller priority/action closure) and HTTP38 (melee authority/rematch). These are localhost protocol tests. Device acceptance remains: compare body/cover scale and visibility on iPad, fire/aim while moving, slide echoes, cover concealment/escape, panel lift/throw/form and James private match. No new terrain depth, power, balance, remapping or multiplayer topology work.

[Corrected full-map center fixture](verification/arena47/full-center.webp). Run `node tests/scale47.cjs`, `node tests/floor46.cjs`, `GOD_MODE_EXPECT_BUILD=COMBAT-MASTER-STUDIO-47 node tests/run-http46.cjs`.

Candidate47 is intended for staging for the user's Deploy action;46 remains the verified live build until Railway confirms a later SUCCESS.
