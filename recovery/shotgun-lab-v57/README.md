# GOD MODE — Approved Shotgun Combat Lab (Recovered Version 57)

This folder is a standalone recovery of the approved Shotgun Combat Lab from the live `god-helmet-arcade` Version 57 deployment. It preserves the combat mechanic and only the runtime artwork required by that lab.

## Run locally

Serve this directory with any static HTTP server, then open `shotgun-combat-lab.html`. Practice-versus-bot works without the online matchmaking endpoint.

## Recovered controls

- Keyboard: WASD move, mouse aim, click fire, right-click grip/move constructed cover, Shift slide or kick away from attached cover, E attach/detach, F construct cover, Q switch pistol/shotgun, T cycle bot behavior, R reset.
- Xbox: left stick move, right stick aim, RT fire, A slide/kick, X attach/detach, LB grip/move constructed cover, RB construct cover, Y switch weapon, D-pad Up cycle bot, View reset.

## Exact recovered movement tuning

- Speed: 262 world units/second
- Acceleration response: 13
- Stop drag: 0.002
- Slide speed: 650 world units/second
- Slide duration: 0.70 seconds
- Slide drag: 0.12
- Collision radius: 17
- Fixed simulation step: 1/60 second
- Runtime art cell: 250 × 250; ground anchor: 219

## Exact recovered weapon tuning

- Shotgun: 0.48-second cooldown, 780 projectile speed, 18 actor damage, 24 cover damage, radius 4.
- Pistol: 0.16-second cooldown, 780 projectile speed, 7 actor damage, 7 cover damage, radius 2.

This snapshot records what Version 57 actually executes. Later design requirements such as a scheduled three-discharge shotgun burst are not silently claimed as implemented here.

## Recovery boundary

The live Site was not modified. The separate `god-mode-3d-lab` repository and unrelated game modes are excluded. Future ports should treat these recovered mechanics as an isolated module and preserve this checkpoint before modifying them.
