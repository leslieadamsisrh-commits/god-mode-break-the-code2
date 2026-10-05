# GOD MODE — Shotgun Pipeline Audit V1

Status: audit only; no balance/timing changes.

Current authoritative chain:
controller/RT -> InputState.fire -> cadence/fire eligibility -> muzzleSocket -> attached-cover clearance -> seven pellet shots (-3..+3 spread) -> projectile simulation -> cover segment collision -> player collision -> damage -> knockback -> hit FX -> recoil/return presentation.

Protected current tuning remains in DEFAULT_CONFIG until playtested: cadence, spread, damage, speed, slide/movement values.

## Existing strengths
- Muzzle is an explicit gameplay origin.
- Attached cover can grant clearance only when exposure rules allow it.
- Pellets are authoritative simulation objects, not visual-only rays.
- Recoil/return are presentation-compatible state.

## Next technical work after cover acceptance
1. Three-zone body hit volumes: legs / torso / head.
2. Damage multipliers must be data, not animation-dependent.
3. Validate muzzle clearance for waist top exposure vs tall edge exposure.
4. Network shot intent/result through host authority; animation remains local.
5. Add deterministic/traceable hit diagnostics for multiplayer reconciliation.
6. Tune health/spread/cadence only from playtests, not this audit.
