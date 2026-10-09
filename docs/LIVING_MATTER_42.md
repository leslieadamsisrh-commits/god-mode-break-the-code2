# Living Matter + Controller Closure 42
Continuation of Cover41, parent dffb23e8075ee95ca03629618336871407b2e8fe, branch studio/live-app-three-section-01. No reset or baseline replacement.

## Implemented
- Six new raster matter families: concrete, aggregate stone, slate, bent steel plate, twisted strip and magenta machine casing. Eight registered tumble views each; 48 alpha frames in a 768x576 lossless WebP atlas, 96px cells. Clean silhouettes, centered full bounds, transparent gutters. Built-in image generation; prompt recorded below.
- Initial collectible pieces reduced from radius 11 to radius 5–6; their count remains 24 and collectible recipe mass is unchanged.
- Authoritative walking/slide and active driving/turning-kick impulses, spin and short airborne bounce. Held, orbiting and explicitly thrown ownership remains protected. Boot scattering does not inflict throw damage; explicitly thrown objects retain 22 fighter / 28 cover damage.
- A client-only cosmetic pool starts with 144 small chips and is capped at 192, including cover breakup and bot-only cyberfluid droplets. Distinct metal/stone damping and rebound; settled pieces sleep. Cosmetics never grant resources or enter networked game state.
- Controller X executes the selected power. Bullet Time added as fifth D-pad Down choice. RB remains direct cover. Keyboard V executes the selected power; keyboard X still toggles time.
- Fresh Y priority and interruption tested: simultaneous fresh Y consumes held X until released; a newly pressed X can interrupt an ongoing charge.

## Preserved
Current source movement authority: 222.7 walk, 430/.16 boost, 490/.50 slide, .28 double tap, approved steering/sustain and Kinetic Brake, .67145 charge easing. No camera, networking transport, local fixed60Hz clock, cover costs/durability or human dematerialization changes. Jade runtime artwork untouched.

Material displacement is intentionally new. An unisolated historical freeze comparison differs in a Grip trajectory because moved rubble changes target availability. The 1,800-frame comparison in an identical empty-material environment passes. Do not claim all environmental outcomes are identical.

## Validation
PASS: living42, cover41, local40, melee38, connections34, grip35, grip36, integration31, combat26, TypeScript and production build.
Native production rendering validates the 48-frame atlas, 144/192 pool budgets, one-time event reconstruction, round reset, non-graphic human exclusion, actual cosmetic foot scattering and settling/sleep.
Node simulation measured approximately 0.067ms median / 0.226ms p95 in a controlled run. Native CPU cosmetic update and draw measured 3.86ms median / 5.84ms p95 / 7.36ms max for its fixture. These are container measurements, not browser FPS, GPU performance, iPad measurements or proof of a multiplayer latency improvement.
Run from repository root:
- node tests/living42.cjs
- node tests/living42.cjs PATH_TO_EXACT_COVER41_GAME_TS (optional isolated freeze)
- CANVAS_MODULE=PATH_TO_NATIVE_CANVAS node tests/native-living42.cjs OUTPUT_DIR
The native room screenshot uses approved ready artwork as a static fixture; it is not a controller playtest or proof of directional run animation.

Historical matter33 completes the five-minute construction/Grip/throw/resource checks, then fails its old forced heavy-selection scenario on both Cover41 and42. This is a verified pre-existing stale scenario, not a green full suite.

## Remaining roadmap
1. Controller action closure: first execution path implemented; full remapping/accessibility and real-device review remain.
2. Living matter: first six-family batch implemented; dense earlier reference recovery, device profiling and broader material/impact art remain.
3. Feedback: bot cyberfluid motion extended; directional visor cue, sound and haptics pass remains.
4. Cover: Cover41 staged fractures preserved; separately failing panels and accurate structural openings remain.
5. Jade: full directional combos and turns remain; do not integrate rejected reference sheets.
6. Guns: shotgun is still the only verified gun; sidearm/rifle/precision roles remain.
7. Powers: existing behaviors preserved and now executable from pad; new combinations remain.
8. Level: current arena art preserved; coherent layout/art pass remains.
9. Bots: current shared-rule behavior preserved; telegraph and fairness pass remains.
10. Vertical slice: connected objectives/checkpoints and device/two-player acceptance remain.

## Art prompt
Use case: stylized-concept. Production game animation ATLAS: one transparent sprite sheet, exact 8 columns by 6 rows, uniform equal cells. Forty-eight fully isolated small debris sprites, centered inside their own cell with ample transparent gutters, no lines, no text, no ground, no shadows baked in. Rows 1-3 stone: chipped grey concrete wedge, broken tan aggregate rock, dark cracked slate shard. Rows 4-6 metal: bent cyan steel plate shard, twisted dark steel strip, small angular magenta-trimmed machine casing fragment. Each row is the SAME recognizable fragment shown in eight successive 45-degree tumbling orientations around a horizontal axis, exposing different faces, not eight unrelated rocks. Full silhouettes within cells, equal scale across all orientations. High-detail 80s/90s anime game art, heavy fine black ink, cel-shaded facets, muted industrial base colors, restrained cyan/magenta edge highlights; equipment aesthetic SNES sci-fi, matching cracked concrete industrial barrier. No characters, explosions, glow background, particles, labels or scenery. Genuine transparent alpha background. Make a clean precisely spaced atlas suitable for cutting into 48 frames.

## Manual acceptance
Play local practice: walk and double-tap-slide through salvage, execute all five selections with X, create direct cover with RB, hold/release Y, throw with LB/RT, shield with LT, escape cover with A/left stick regardless of aim/battery. Repeat with James in a private duel. Check frame pacing on iPad, visibility of small pieces, accidental X execution and cover survival. Two-client HTTP tests validate protocol behavior but cannot replace that device test.

