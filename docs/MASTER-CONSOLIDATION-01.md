# GOD MODE — MASTER CONSOLIDATION 01
Status: in-progress integration branch, NOT approved production, NOT deployed.

## Authority
Base: studio/build27a-xyz-elevation-lab (verified source of XYZ preview).
Raptor experimental source: studio/raptor-humanoid-motion-lab-37.
Never replace the newer app/Game.tsx with the Raptor branch's older Game.tsx.
Preserve jump, camera, combat, psychic cover, bullet-time, controller and multiplayer systems from the authoritative foundation.

## Branch audit
GitHub compare XYZ...Raptor: diverged, Raptor 15 commits ahead, 28 behind.
War-games-scale-47 and ground-peel-44 are ancestors of the XYZ branch, not substitutes for it.
Raptor art: approved eight-direction V2 visual reference; provisional frame pack exists outside GitHub. No validated game-ready transparent directional sprites committed yet.

## One engine / one menu
Story, Arcade, Multiplayer, Combat Lab use the same authoritative gameplay engine.
Combat Lab selects Jade or Raptor and must not swap to a separate old physics implementation.
Keep Jade default. Raptor experimental until art validated. Character selection is a presentation configuration, not a separate game.
Old skeletal Raptor tools are developer-only and not the default player-facing experience.

## Integration gates
1. Preserve XYZ branch snapshot and record baseline tests.
2. Add shared-engine character selection and minimal lab entry, without altering movement/combat.
3. Bring in only Raptor-specific animation adapters and approved assets. Do not cherry-pick old Game.tsx.
4. Install individually registered RGBA frames with 512x512 canvas, foot anchor (256,450), correct muzzle positions; verify asset presence and no blank frames.
5. Automated build, keyboard/gamepad tests, jump, slide, grip, construct, throw, camera and multiplayer regression checks.
6. Isolated preview deployment; user gameplay approval before any production merge.

## Unfinished work
Sprite artwork QA, animation cycles, combat lab integration verification, and deployed master preview. No claim of full consolidation until those gates pass.
