# GOD MODE — BAY BRIDGE GAMEPLAY LOCK CANDIDATE

Status: CODE-LEVEL REGRESSION PASSED / RUNTIME PLAYTEST PENDING
Branch: dev/bay-bridge-gameplay

## Authority
Frozen baseline:
- branch: checkpoint/combat-master-cyberkitty-v12
- freeze commit: 7e514b8b73ebcca12747dfa909b0fc5e5d7ca667

## Phase 2A changes
- Replaced the generic training-floor presentation with an Altered Dimension Bay Bridge freeway graybox.
- Added three readable routes: left flank, center contested lane, right flank.
- Added two War Games end gates.
- Added controlled cover chains using barrier, wreck, median, gate and tower proxies.
- Added a strategic tower proxy near the outer lane.
- Added freeway lane markers, bridge deck silhouette and suspension/tower background guides.
- Updated HUD labeling to BAY BRIDGE COMBAT LAB.

## Frozen systems verified unchanged
Direct source comparison against the Combat Master confirmed byte-for-byte identity for:
- controller/gamepad routing
- nearest-face/collision and fire routines
- complete fixed-step movement / acceleration / braking loop
- independent aim and 145-degree lower-body logic
- baseball slide timing and decay
- slide-to-cover capture
- attached cover movement and kick/release
- shotgun cadence and pellet logic
- bot/damage/reset logic
- directional sprite router
- player body rendering

## Automated regression result
PASS: mechanics source preservation
PASS: sprite-routing source preservation
PASS: combat-step source preservation
PASS: cover/fire source preservation

## Still required before final GODMODE_BAY_BRIDGE_GAMEPLAY_LOCKED
- Run the branch as an actual browser build.
- Test keyboard/mouse.
- Test Xbox controller.
- Verify no geometry snag during slides.
- Verify every cover chain can detach cleanly.
- Verify shotgun projectiles respect intended cover.
- Verify reset/rematch.
- Capture screenshots.
- Record any map-layout issues discovered during play.

No high-detail Bay Bridge visual production is authorized until those runtime checks pass.
