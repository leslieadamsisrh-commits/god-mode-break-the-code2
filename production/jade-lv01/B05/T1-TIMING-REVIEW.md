# JADE LV01 B05-T1 — TIMED TRANSITION REVIEW

Status: ANIMATION VALIDATION HOLD.

Authority: `ChatGPT Image Sep 19, 2026, 11_37_12 PM.png`
SHA-256: `39375b8abfd668b750cc041c5cd78db474f359f43428bd9a585396e62b579854`

Accepted keys remain unchanged:
- CE05 `62352e395e2f638c890b0e144ea28df7623d45901a858c4a2cbb9bbf0df67049`
- CE03 `9f6d02a1b4af1557f711befcf0678837d3a0d9eca3a963accc3f93c5167f2dcb`
- CE08 `c6fbcb046be331d795bbbbb613552435c4cd5639503193646b816f109471e91f`

## Timing source read from exact 08N package
`public/vendor/core.js`
- slideDuration = 0.70 seconds
- cover attach sets slide=0, vx=vy=0, impact=0.18
- state is COVER IMPACT while impact>0

`public/vendor/cover-router.js`
- contact presentation window = 0.18 seconds

08N has no fixed pre-contact timer. Therefore CE05→CE03 cannot be assigned an invented fixed duration without changing presentation behavior.

## Minimum missing bridges
1. IB-PRE — CE05→CE03 reach-start.
   - event/proximity driven later
   - no collision or movement change
2. IB-RET — CE03→CE08 mid-impact retract.
   - belongs inside existing 0.18s COVER IMPACT window
   - exact art frame placement remains pending until an accepted drawing exists

## Validation result
FAIL / INCOMPLETE. The three accepted keys alone do not play continuously:
- CE05→CE03 has a large contact-arm jump
- CE03→CE08 has a large hand/weapon retraction jump

At least the two bridge drawings above are required before another timed continuity pass.

## Rejected generation attempts in this pass
- `a_clean_composite_sprite_animation_reference_sheet.png` — `19ee77e5f0ea2780fe71b79a6dd097a887e11b7125583ab553a2dedf3eea531d`
- `a_clean_black_background_sprite_sheet_style_layout.png` — `5a3e1eba02f51aed4a301959ad5ec4dd5aec680cfe99fd602566d3841076639f`
- `a_wide_high_resolution_game_animation_reference_s.png` — `8db4f78f2d731a06a9193aac0382d7a20fb1ec859ec9a35978e6891f7f8fdfc2`

All three are rejected because they are composite/report sheets with invented frames/status text, not isolated transparent in-between sprites.

Protected:
- 08N baseline untouched
- 08L network prototype untouched
- movement/collision/timing untouched
- no integration
- no deployment
