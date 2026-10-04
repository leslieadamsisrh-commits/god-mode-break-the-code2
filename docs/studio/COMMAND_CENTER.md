# COMMAND CENTER

## Current mission

Perfect the primary 2D combat foundation without regressing the playable game.

## Current blocker

Shotgun firing must originate from the actual weapon barrel, not Jade's body/center transform. Pose and shot alignment must agree visually and mechanically.

## Active gate

1. Preserve current movement/slide/cover feel.
2. Correct weapon pose alignment.
3. Enforce true barrel-origin firing.
4. Temporarily keep right-stick aim changes out of the calibration pass when they interfere with sprite/pose verification.
5. Validate aim → fire → recoil across required directions.
6. Only after this gate passes, unlock the next combat/animation task.

## Do not touch during this gate

- Approved slide weight/timing/effects unless a regression is proven.
- Multiplayer architecture except to preserve compatibility.
- Large map/content expansion.
- New weapons/powers that do not directly support the current test.
- Historical branches or approved recovery checkpoints.
- Production deployment unless explicitly authorized.

## Current source-of-truth repository

`leslieadamsisrh-commits/god-mode-break-the-code2`

## Studio branch

`studio/command-center`

This branch is documentation/control only. It must not be used as a shortcut to alter the playable build.

## Session start checklist

Every working session must answer:

- What build/branch are we touching?
- What is the single current objective?
- What systems are locked?
- What is the definition of done?
- What regression tests must pass?
- What new ideas should be parked instead of implemented?

## Definition of done for current gate

The gate passes only when:
- projectile origin visually and mathematically matches the shotgun barrel;
- muzzle direction matches the intended aim direction;
- pose does not visibly contradict the projectile;
- recoil begins from the same registered weapon/socket state;
- movement, slide, and cover remain unchanged unless intentionally tested;
- no new controller regression is introduced.
