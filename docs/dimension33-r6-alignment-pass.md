# Dimension 33 R6 — Alignment and Free-Roam Pass

## Corrected gameplay plane

- Authoritative combat bounds: `x 92–908`, `y 208–528`.
- Player movement, generated cover, Grip-held cover, and loose matter now use the same visible platform bounds.
- Matter bounces from the platform edge instead of drifting into the skyline.
- The board artwork is cropped and repositioned so its top plane begins where gameplay begins.

## Cover presentation

- Fixed and generated cover now draw from the existing four-stage cover-destruction atlas.
- Generated concrete cover assembles in three rising chunks with orbiting cyan/magenta matter.
- Default cover scale is reduced to match the player and collision footprint.
- Damage rows progress from healthy to damaged, heavily damaged, and broken debris.

## Arena framing

- Crowd towers now frame both edges of the board as independent middle-ground layers.
- The Lizard Baron balcony is larger and anchored above the arena center.
- The playable platform remains in front of the skyline and behind gameplay sprites.

## Modes and reset behavior

- Solo Sandbox remains the no-bot free-roam mode.
- `RESET NO-BOT SANDBOX` rebuilds fixed cover, matter, health, battery, damage, and debris.
- Bot and multiplayer rematches rebuild the same complete arena state.

## Bot balance

- Bot shotgun and melee damage reduced to 68%.
- Lower strafe pressure and increased preferred distance.
- Less frequent shotgun windows, slides, melee, heavy attacks, shields, Grip, cover, Orbit, Pinball, and slow field.
- Small aim drift added so the bot no longer behaves like a perfect turret.

Version 57 movement constants remain unchanged: speed 262, acceleration 13, braking drag 0.002, slide launch 650, slide duration 0.70 seconds.
