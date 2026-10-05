# GOD MODE — Psychic Authority Audit V1

Status: dependency plan only; no power timing or balance changes.

## Core rule
Gameplay decisions are authoritative; spectacle is local presentation.

## Power families already represented in current game architecture
- Shield / cover-aim input path
- Grip / carried matter and carried cover
- God Frame charge/activation/battery
- Generated/destructible cover concepts
- Pinball mobility
- Orbit / launch orbit
- Slow-time input/state hooks
- Melee hooks

## Required split per power
Authoritative: activation eligibility, energy cost, target id, transforms that affect collision, damage, impulses, durations that affect gameplay.
Presentation: pose selection, psychic trails, glow, particles, lettering, cosmetic debris, camera accents.

## Integration order after shotgun
Shield/parry -> Grip/throw -> generated/destructible cover -> Pinball -> slow time -> God Frame integration -> Orbit/rocket interactions -> portals after network traversal rules are defined.

Animation entry/hold/release/recovery never blocks input.
