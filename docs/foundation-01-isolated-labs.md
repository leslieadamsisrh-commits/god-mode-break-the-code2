# GOD MODE — Foundation 01: Isolated Studio Labs

Status: design and baseline verification; NO runtime implementation authorized by this document alone.

## Verified repository baseline
- Source branch: studio/live-app-three-section-01
- Source commit: 2f78895bb2c37a5f8508f2296c8032392a159bbe (Living Matter 42)
- Existing app: Next.js 15.5.9 / React 19.1.1; app/page.tsx mounts app/Game.tsx.
- Game.tsx contains input, rendering, assets, local combat and multiplayer session logic. Do not rewrite it as part of navigation work.
- Deployment SHA, runtime behavior, and controller/multiplayer regression baseline: NOT YET VERIFIED.

## Immutable design contracts
1. One existing app; no second website or independent game deployment.
2. Universal competitive parity: same gameplay movement, health, damage, timings, collision and power availability across playable characters. Character-specific animations, sounds and VFX only.
3. The current playable game remains the default and untouched until baseline tests are recorded.
4. Lab experiments never modify shared runtime state or live match sessions. Entering/exiting labs must not silently discard a multiplayer room.
5. No sprite replacement, combat tuning, controller remap, networking changes or map changes in Foundation 01.

## Planned lab registry
Movement, Combat, Psychic, Character, Animation, World, Multiplayer, Integration. A lab is a route/configuration and isolated state boundary, NOT a copy of the engine.

## Migration gates
G0: Verify deployed commit, record playable smoke test on iPad/controller and two-player networking; capture baseline movement values and known bugs.
G1: Add navigation shell without changing Game.tsx simulation, preserving existing root route and deep links.
G2: Add an isolated lab registry and a placeholder sandbox; no production mechanics are imported into a lab until dependency and side-effect audit.
G3: Run build, navigation, controller, gameplay and multiplayer regression tests; compare with G0; no promotion if regressions.
G4: Merge only after explicit review of test results and recovery point. Deployment is a separate decision.

## Technical constraints
- Preserve app/page.tsx root Game entry until verified compatibility.
- Keep Game.tsx and lib/game.ts, lib/localCombat.ts, camera, sprite loading and network API untouched in first navigation commit.
- Do not derive competitive collision from character artwork, tails, or cosmetic armor.
- Record rule-version compatibility for multiplayer before future character adapters.

## Stop conditions
Missing live deployment SHA; missing baseline playtest; broken controller; changes to current root game; regressions in multiplayer/session restoration; accidental deployment. Stop and report instead of improvising.
