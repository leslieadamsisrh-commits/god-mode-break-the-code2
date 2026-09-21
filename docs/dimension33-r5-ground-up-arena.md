# Dimension 33 R5 — Ground-Up Arena

## Runtime layer stack

1. `dimension33-sf-ruins.webp` — distant fractured San Francisco, Golden Gate ruins, dimensional sky, and hovering craft.
2. `dimension33-crowd-baron.webp` — bridge-deck spectator towers, grouped crowd tiers, floating platforms, and the Lizard Baron throne balcony.
3. `dimension33-war-board.webp` — the actual wet concrete/steel playable platform, side ramps, lane lighting, and thick structural edges.
4. Authoritative gameplay — Version 57 players, fixed/generated cover, psychic matter, projectiles, and combat effects.
5. Foreground occlusion — the war-board front lip is redrawn after actors to anchor them inside the platform.

The previous all-in-one `dimension33-reference.webp` remains archived as a visual reference but is no longer loaded or drawn at runtime.

## Protected gameplay constants

- Move speed: 262
- Acceleration: 13
- Hard-braking drag: 0.002
- Slide launch: 650
- Slide duration: 0.70 seconds
- Multiplayer coordinates, collision, combat authority, bot drop-in, and Solo Sandbox unchanged

## QA completed

- Production build passes.
- Solo Sandbox starts on the new board.
- Player sprites render between the board and foreground lip.
- Fixed cover and generated chunky cover render on the board.
- Three environment plates load independently.
- Crowd/Baron layer animates independently of the ruined-city parallax.

## Known visual follow-up

- Crowd movement is grouped plate motion plus event light pulses, not individual spectator animation.
- The lobby stamp still identifies the protected R4/Version 57 gameplay foundation; the live match build ID reports R5.
- The next pass should tune saved calibration values after hands-on play rather than changing movement constants.
