GOD MODE: BREAK THE CODE — PHASE 3
BAY BRIDGE HIGH-DETAIL DIMENSION 33 VISUAL PRODUCTION + COMBAT POLISH

START CONDITION
Do not run this phase until GODMODE_BAY_BRIDGE_GAMEPLAY_LOCKED has passed runtime playtesting.

AUTHORITY
Use the locked Bay Bridge gameplay branch/commit as the sole map topology authority.
Keep the frozen Cyber Kitty combat mechanics and temporary V12 sprite shell unchanged unless a separately documented gameplay bug requires correction.

GOAL
Transform the proven Bay Bridge freeway graybox into a high-detail, hand-drawn anime/manga Dimension 33 battle environment without changing the validated routes, cover relationships, combat timing or camera behavior.

VISUAL TARGET
- recognizable San Francisco–Oakland Bay Bridge freeway
- late-1980s industrial anime energy
- crisp manga inkwork and cel shading
- realistic asphalt, steel, concrete, expansion joints and bridge hardware
- closed freeway / War Games takeover
- Dimension 33 broadcast technology, sealed battle gates and controlled dimensional interference
- Bay water, skyline and industrial depth where the gameplay camera allows
- magenta/cyan accents used selectively rather than flooding the scene
- readable silhouettes and projectiles at all times

PRESERVE
- central, left and right route topology
- spawn regions
- proven cover coordinates and footprints
- slide-to-cover lines
- generated-cover usable space
- shotgun sightlines
- existing combat assets
- controller/movement timing
- current camera unless playtest evidence requires a specific correction

IMPLEMENTATION ORDER
1. Ground/deck art layer.
2. Bridge structure and distant depth.
3. Freeway closure and War Games layer.
4. Dimension 33 atmosphere.
5. Lighting/cel-shading pass.
6. Damage/weathering details.
7. Performance culling and FX caps.
8. Full combat regression.

STOP CONDITION
When the visual layer is complete and combat performance/readability remain intact, create:
GODMODE_BAY_BRIDGE_VISUAL_LOCKED

Report exact branch, commit, screenshots, performance observations, regressions found/fixed, and remaining limitations.
Do not begin later combat-system expansion automatically.
