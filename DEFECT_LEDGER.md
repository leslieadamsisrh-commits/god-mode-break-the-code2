# Brother Build defect ledger

## Blocker

- None found in the local two-client bot-takeover test or Solo Sandbox test.

## Network

- D1 polling is tuned for a two-player vertical slice, not ranked-scale matchmaking.
- Internet latency and two different physical home networks require final hosted play confirmation.

## Gameplay

- Slow time uses a synchronized global simulation scale; it is intentionally simpler than the final design.
- Cover destruction is staged rather than physically simulated.
- No lag compensation or client prediction yet.
- Grip movement is currently limited to player-generated cover; fixed arena cover stays anchored.

## Visual

- Version 57 ready/run/slide/cover directional atlases are embedded; unsupported actions still fall back to the nearest readable approved family.
- Peek, recoil, melee, Grip, Orbit, shield, hit, and defeat rely partly on VFX/readable pose changes rather than complete bespoke frame families.
- The Dimension 33 arena is a first playable depth pass based on the four supplied concepts, not the final multi-level war-games map.

## Future polish

- Audio, screen shake controls, richer impact freeze, authored arena props, and final animation swaps.
