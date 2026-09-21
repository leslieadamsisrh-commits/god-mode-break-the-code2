# Brother Build defect ledger

## Blocker

- None found in the recovered local two-client room/start/sync test.

## Network

- D1 polling is tuned for a two-player vertical slice, not ranked-scale matchmaking.
- Internet latency and two different physical home networks require final hosted play confirmation.

## Gameplay

- Slow time uses a synchronized global simulation scale; it is intentionally simpler than the final design.
- Cover destruction is staged rather than physically simulated.
- No lag compensation or client prediction yet.

## Visual

- Arcade fighters are gameplay-complete placeholders; the approved high-detail atlases are preserved but not embedded in this lightweight hosted pass.
- Peek, recoil, melee, Grip, Orbit, shield, hit, and defeat rely partly on VFX/readable pose changes rather than complete bespoke frame families.

## Future polish

- Audio, screen shake controls, richer impact freeze, authored arena props, and final animation swaps.
