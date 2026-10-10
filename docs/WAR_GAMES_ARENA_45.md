# War Games Arena45 — candidate continuation

Parent: Ground Peel44, `982ce58929bf87d68386f35e503cd1895452cdf0`, `studio/ground-peel-44`.
Candidate branch: `studio/war-games-arena-45`. Build identifier: `COMBAT-MASTER-STUDIO-45`.

## Recovery and release boundary

Railway was rechecked: Ground Peel44 deployment `bba75e3b-f318-41a3-96d0-f0bae9bf7b44` is SUCCESS;43 is REMOVED. No pending environment changes existed before staging45. Local44 source matched remote44 before editing. No baseline reset or older release substitution. This report describes a tested candidate, not a live release or iPad acceptance.

Recovered original Library art: Empty neon-lit War Games arena (`libfile_8392493a2ad0819199f6d64fd3506f68`), Neon Cyberpunk War Games Arena (`libfile_a7703a215278819181a8ec5aa0d1eb5c`) and Cyberpunk War Games Arena Blueprint (`libfile_bf3352868e848191b1adb029a24c2b3a`). The latter two are identity/layout references, not production HUD, collision or proof of tunnels, powers or four-player support. Binary access through GitHub was unavailable; original Library sources were recovered instead of recreating the arena from memory.

## Implemented first batch

- Replaces the Bay Bridge presentation with the cleared original stadium foundation: battered cracked concrete, cyan/magenta illumination, crowd tiers, screens, rafters and matching gates. A tightly scoped image edit restores the reptilian Lizard Baron throne identity from the original concept. Screens/crowd are illustrated, not newly animated; Vox Victis is a broadcast label, not voice/audio.
- One raster foundation, floor pixels registered to the combat plane with a cached256-triangle registration; separate existing dimensional cover/actor renderer above it. Removes the six old DOM parallax sheets. This is a 2.5D presentation, not a new 3D engine. The compact stadium broadcast strip remains screen-space scenery, not collision or a traversable background lane.
- Fourteen mirrored authored objects: two permanently anchored spawn shelters, eight low concrete barriers framing an open contest center, four industrial perimeter nodes. Matching north/south routes connect around intact hulls for radius18 players.
- Spawn B is now x770, matching A x230 about x500; all initial salvage mirrors across x500 at equal y. Count24, radius5–6 and recipe mass unchanged. Every play mode now uses the complete arena layout.
- Anchored shelters cannot be damaged, refunded, Gripped or chosen by the bot as movable matter. HUD explicitly labels attached anchored cover. Twelve ordinary structures remain destructible/eligible under existing rules; each yields at most one three-unit salvage refund. Finite ground45+initial salvage24+breakable salvage36=105 units, below128 pool cap.
- Static low cover height32 is an explicit arena role change (fire over it rather than treating everything as tall concealment). Anchored shelters/industrial nodes height78. Ground Peel generated cover uses a separate off-map template retaining44 width112, compact scaling.72, height46, build30 and HP280/360. New map authoring does not silently change player-generated protection.
- A SEALED lower-access hatch is scenery only. No true holes, drop levels or usable lower lane are implemented.

## Preserved

Exact44 config: walk222.7, boost430/.16, slide490/.50, doubletap.28, charge easing.67145, approved steering/sustain/Kinetic Brake. Controller mapping and fresh-Y priority, independent aim and cover escape, camera1.85, local fixed60Hz clock, transport, Jade approved runtime artwork, right-gun/left-power authority, cosmetic chip pool, digital human defeats,44 finite extraction/assembly/stamps and43 feedback remain. No remapping, new guns/powers, panel openings, reshaping, campaign upgrades or4v4 added. Geometry/material opportunities intentionally change routes, occlusion and bot/environment outcomes; those are not claimed identical.

## Validation

PASS: arena45, ground44, cover41, defense43, living42, local40, melee38, connections34, grip35, grip36, integration31, combat26, TypeScript and optimized production build. Build retains existing CSS autoprefixer warnings about `end`.

`node tests/frozen45.cjs PATH_TO_EXACT44_GAME_TS`:1,800 exact full-player/config comparisons in identical empty environments, plus identical attachment fixture, covering Weave, shield, Grip, firing, charging and outward escape. Both engines use the candidate map adapter but all environment opportunities and second players are removed; this is movement/control isolation, not an identical-world test.

`CANVAS_MODULE=PATH_TO_NATIVE_CANVAS node tests/native-arena45.cjs OUTPUT_DIR`: actual production renderer reviewed at spawn, center, north and south and an overview; cached floor identity verified. Static approved ready-d03 is an art fixture, not directional animation or physical-controller proof. Updated native-living42 harness passes48-frame atlas,144/192 pool budgets, one-time events, reset, non-human cyberfluid exclusion, foot scatter and settling. Native CPU fixture measurements are not browser FPS, iPad performance or network latency.

`npm run build` then `node tests/run-http45.cjs`: PASS HTTP45 shared fourteen-object arena/protected shelters, both authenticated RB assembly/stamp slots, held-RB edge, fresh-Y and source/reset cleanup; HTTP42 power selector/X/Y priority/reset; HTTP38 shared B activation and rematch. Localhost protocol tests cannot replace an Internet match with James.

Historical matter33 remains a known stale heavy-selection scenario failing on41/42; no claim that every historical test is green. Historical HTTP44 expects build44 and its old map fixture; use the45 runner for this release.

## Required manual acceptance and next batches

Play practice, then private1v1: survive behind anchored shelter; slide both flank routes; shoot over low cover; create RB cover from salvage and finite ground; attach/peek/escape with A and left stick at zero battery; charge/release/interruption with Y; select/execute all existing powers with X; Grip/throw ordinary and enemy stamped cover; damage stages/refunds/reset. Check arena visibility, actor/cover registration and phone/iPad frame pacing, especially dense matter and repeated cover collapse. Verify shots never obstructed by invisible map hulls, cover placement remains comprehensible, and bots do not stall on the anchored structures.

Next separate batch: authored lower lane/three-layer terrain with honest falling/nav/network geometry; structural panel openings and surviving-mass reshaping; followed by coherent psychic Repulse/Fault Line counterplay and real-device1v1 acceptance.4v4 requires an explicitly designed roster, rules and tighter acceptance rather than changing the room limit here.

## Asset provenance and prompt

`public/assets/war-games45/foundation.webp`: generated targeted edit,1536×1024, quality91 WebP,713362 bytes. `approved-empty.webp`: recovered original cleared arena fallback,1536×1024,757528 bytes. Opaque scenic foundation by design; separate runtime equipment/actor sprites retain their existing alpha.

Prompt: Use case: precise-object-edit. Production game arena foundation asset. Image1 is the EDIT TARGET: the approved empty War Games arena. Image2 is supporting identity reference for the LIZARD BARON ONLY. Preserve Image1's entire high-angle arena composition, huge EMPTY cracked concrete fighting floor, floor markings, spectator tiers, matching gates/stairs both sides, rafters, lights, screens, cyan/magenta/orange lighting, ink detail and frame boundaries. Change ONLY the small central throne occupant at the top of Image1: replace the masked horned humanoid judge with the reptilian Lizard Baron from Image2, recognizable scaled reptilian face, heavy fur collar, gold chains, seated imperious posture, at the same small size and throne location. No gore, blood, fighters, weapons or HUD. Do not import Image2's interface or title. No new foreground platforms or obstacles. Floor stays totally clear for separately rendered game objects. This is one coherent illustration with high-detail80s/90s anime inkwork and cel-shaded sci-fi stadium architecture, not a photorealistic render. Maintain landscape3:2 composition. Do not redesign or simplify any other part.
