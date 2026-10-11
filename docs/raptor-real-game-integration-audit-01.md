# GOD MODE — Raptor Real-Game Integration Audit 01
Date: 2026-10-11
Status: READ-ONLY AUDIT / NO COMBAT ENGINE CHANGES

## Verified source
- app/Game.tsx (1141 lines at inspection) contains the actual gameplay renderer and controller input.
- lib/game.ts owns combat rules and shared configuration.
- lib/localCombat.ts provides local simulation.
- app/studio/combat/raptor/page.tsx is an independent diagnostic renderer; it is NOT the actual game renderer.
- app/Game.tsx preload() lines 116–145 loads 24-direction ready/run/slide/cover sprite families from the established Jade runtime source. Jade sprites are keyed by family-direction in a Map.
- app/Game.tsx lines 564–582 select exact or fallback directional sprites; spriteCell() computes frame source rectangles.
- app/Game.tsx lines 668–704 contains registered anchors and power animation drawing, with explicit notes protecting full silhouettes.
- Existing app root app/page.tsx mounts Game; preserve it.

## Decision
Stop feature expansion of the standalone vector diagnostic. Use the existing Game renderer as the source for an isolated real-game character presentation test. Do not clone or retune combat simulation.

## Smallest safe implementation sequence
1. Audit exact actor draw call and state->animation family selection, including all overlays and special poses.
2. Introduce a presentation-only actor skin selector, default JADE. No player state or network protocol changes.
3. Add a Raptor sprite registry that matches Jade's runtime family/direction/frame contract, with documented ground anchor and muzzle socket.
4. Only route Raptor art through the selector if frame passes true-alpha, complete silhouette and scale/anchor QA; otherwise show an explicit 'Raptor art pending' indicator. Do not silently display a cropped poster.
5. Use existing Game component, camera, arena, controls and physics for the isolated character test. No second combat engine.
6. Verify switching appearance does not change player coordinates, acceleration, slide duration, damage, collision, shield or multiplayer state.
7. Deploy only to Railway playtest, report build and iPad controller results. Production untouched.

## User interface (plain language)
- PLAY GAME: the existing GOD MODE build.
- STUDIO LABS: open development tools.
- RAPTOR TEST (future): select RAPTOR to change appearance, JADE to compare, with the same gameplay.
- QA / INFO: optional developer information; not required for normal play.
- Existing vector debug lab is a temporary diagnostic, not the intended final experience.

## Hard stop
No approved, transparent, uncropped, fully registered Raptor animation frames are yet verified in repository. Do not label concept infographics or extracted drafts as engine-ready. The first real visual swap requires validated source images.

## What was not done in this audit
No runtime skin selector added; no game physics, sprite atlas, network code or production deployment modified.
