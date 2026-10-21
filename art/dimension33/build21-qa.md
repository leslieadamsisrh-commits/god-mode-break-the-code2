# Build 21 — verified implementation handoff

Starting branch: `studio/raptor-combat-lab-01`.
Starting GitHub/deployed commit: `01b8f6ad465b938cb651e490b571cc928503d537`.
Rollback branch: `studio/build21-baseline-01b8f6a`.
Latest deployment observed before edits: Railway SUCCESS, deployment `1c6e038a-8dbd-460c-90de-93c8141bdb21` (2026-10-19).
This document records pre-deployment verification; it does not assert that this commit has deployed.

## Implemented

- Shared face-material registration samples approved Build 20 concrete and cabinet artwork onto the existing physical rib shells. Stationary, damaged, held and rotated objects now use the same material path, shadows, fractures, occlusion and contact geometry. This is face-based material treatment, not a new directional sprite set or an accurate 3D reconstruction.
- Shared scenery metadata uses upright height units compatible with the fighter presentation, retaining each source aspect ratio. Architecture is larger than combat props; non-colliding stands/lamps sit outside the tactical floor. A projected floor exclusion mask keeps foreground scenery from obscuring routes. Tower, bridges, platforms, stairs, weathered materials and neon colors are retained. Distant architecture opacity is reduced.
- The 1000 × 620 coordinate system, all 22 authored hulls, lower three-quarter camera, movement/weapon/health constants and character assets are unchanged. Anchored shelters remain 78 units tall; shrinking them visually would misrepresent their real protection.
- Selected-cover footprints briefly highlight, then fade. Construction preview and execution share orientation, search, resource/limit validation and specific obstruction reasons. No collision exceptions were added.
- Dense inventory/debug/bot intentions are optional under Combat Audit. Important health/battery/action hints remain. Idle field effects are quieter. The glove HUD now uses actual held-glove charge instead of the obsolete blast-charge-progress field.
- Accepted glove holds log `buffered`, not false rejection. Bots release the current charged glove instead of queuing the obsolete four-tap combo. Bot build direction now matches the orientation it validated.

## Repulse local experiment

Disabled in every new session. Open **LOCAL EXPERIMENT · REPULSE (BUILD 21)** in local solo/practice/bot play, enable it, cycle with D-pad down to REPULSE and press X (keyboard V). No controller remapping. It is unavailable in watch rooms and multiplayer.

Defaults: range 96 world units, 16 battery, cooldown 1.4 seconds; 120-degree cone, 0.12-second wind-up, 0.34-second action commitment. Zero damage and zero hit stun. Movement remains available. Shield blocks, cover obstructs, and taking a hit or shielding cancels the cast without refund. Targets can evade/flank/punish; attached fighters are not detached. Only eligible unowned, unheld, non-orbiting, slow loose matter is redirected, below damaging throw speed. Covers, bullets, ownership and floor ledgers are untouched. Holding X does not auto-repeat. Only range/cost/cooldown are exposed, with bounded values.

Authority is a process-local WeakMap registered only by LocalCombat. Serialized snapshots or multiplayer config/input cannot enable it. No experimental state is added to the network simulation.

## Evidence and verification

Reviewed the supplied `ScreenRecording_10-20-2026 19-21-45_1.mp4` and `god-mode-fight-report38(1).json`. The 10-round right-spawn streak is an investigation signal, not proof of a geometry advantage. Report melee attempts include accepted hold starts and release activations, so rejection/activation counts are not a reliable failure rate.

Tests passed:

- `npm run build`: optimized Next build, TypeScript and all 12 routes.
- `node tests/build21.cjs`: hold/release accounting, pure preview/build parity, energy/limit denial, Repulse capability and token gates, zero damage/stun, shield/wall/cone checks, simultaneous-fire commitment, cooldown, held-X behavior, interruption, ownership, reset, bot release behavior.
- `node tests/floor46.cjs`: floor LB/RT/RB, preserved damage, capture attribution, no duplicate mass, rejection rollback, reset, 24 input rays and 3,969 projection inverse checks.
- `node tests/local40.cjs`: identical fixed-step movement at 30/60/120 Hz, input edges, hidden-tab pause, hitch bounds, reset and token/mode separation. Updated its obsolete immediate-B-strike expectation to the existing hold/release contract.
- `node tests/scale47.cjs`: 15 foot/height/width registrations at multiple depths/zooms.
- `node tests/combat21.cjs <baseline-ref>`: exact unchanged config/hulls and player outcomes for 120-tick movement/slide, firing/shield and glove sequences against baseline; mirrored movement; bot policy evaluated in reversed order with identical results.
- Four diagnostic bot runs, varying round phase independently of spawn identity: round 1, normal/swapped, slot 0 won in 7.38/7.28 seconds (left/right respectively). Round 2, normal/swapped, neither finished by the 20-second cap. This does not establish balanced combat. The report's alternating round phase plus alternating spawn identities confounds side with strategy phase. No balancing buffs, recovery changes or map changes were made.
- `git diff --check`: clean.

Headless actual `Game.tsx` renders were captured and inspected at center, north/south, east/west, close scale, held/thrown cover, damage, destruction and missing-environment fallback. These are **not browser captures**, controller tests, performance benchmarks or network multiplayer verification. Jade QA uses the repository's approved `combat-lab/assets/cyberkitty/ready-d03.webp` (blob `33bbf01ac0a9008184e1ff295c41feccb1854795`); no new character art. Raptor comparison uses its existing procedural rig. No character animation completeness claim.

Before/after scene: [before](build21-evidence/before21-scale.jpg), [after](build21-evidence/after21-scale.jpg).
Continuity: [held](build21-evidence/after21-held.jpg), [thrown](build21-evidence/after21-thrown.jpg), [damage](build21-evidence/after21-damage.jpg), [destruction](build21-evidence/after21-destruction.jpg).
Zones: [north](build21-evidence/after21-north.jpg), [south](build21-evidence/after21-south.jpg), [west](build21-evidence/after21-west.jpg), [east](build21-evidence/after21-east.jpg).
[Raptor/Jade same-depth comparison](build21-evidence/after21-raptor-scale.jpg); [all environment assets unavailable](build21-evidence/after21-fallback.jpg).

Render reproduction: install `@napi-rs/canvas` without changing the dependency manifest; set `JADE_QA_IMAGE` to the approved ready-d03 file; run `node tests/render21.cjs`. For before, add `--baseline <git-ref>`. `--only` accepts comma-separated fixture names. Local baseline ref during these checks was `e00e3fc`, a recoverable snapshot of the verified GitHub source, not a replacement GitHub history.

## Remaining limitations / next priority

- Raptor's existing procedural body is shorter and its feet sit differently from Jade at the same world root. Low cover is approximately waist-height for Jade but reads taller for Raptor. Character rendering was deliberately frozen; this mismatch needs a separately approved character-registration pass, not altered cover/collision.
- Shelters and cabinets remain physically tall. No unapproved character resizing or invisible overhead collision was introduced.
- Scenery remains decorative, not traversable. Southern scenery is pushed below the tactical floor, so much of it is outside a close-camera frame. No implied new platforms/collision.
- Face sampling may visibly repeat material on very long partitions; this is a coherent rig fallback, not a claim that all source silhouettes/directions have completed production QA.
- Bot phase/spawn confound and short-round recovery remain design/testing follow-ups. No claim of human-vs-human balance or a resolved right-side win rate.
- Full animation, physical Xbox controller, iPad frame rate and live two-client multiplayer remain unverified by these tests. Repulse is experimental, not competitively balanced.

## Exact code/test changes

Runtime: `app/Game.tsx`, `lib/game.ts`, `lib/localCombat.ts`, `lib/dimension33MapArt20.ts`, new `lib/dimension33Registration21.ts`, `lib/dimension33Readability21.ts`, `lib/repulse21.ts`.
Tests: `tests/floor46.cjs`, `tests/local40.cjs`, new `tests/build21.cjs`, `tests/combat21.cjs`, `tests/render21.cjs`.
Documentation/evidence: this file and `art/dimension33/build21-evidence/*.jpg`.
Existing atlases, frame manifest, character images, map geometry, camera modules and dependency manifest were not changed.
