# JADE LV01 B05-FI — PLAYABLE FAST INTEGRATION PASS

Authority: `ChatGPT Image Sep 19, 2026, 11_37_12 PM.png`
SHA-256: `39375b8abfd668b750cc041c5cd78db474f359f43428bd9a585396e62b579854`

Baseline: exact recovered 08N package; baseline was not overwritten.

Accepted keys used unchanged:
- CE05 `62352e395e2f638c890b0e144ea28df7623d45901a858c4a2cbb9bbf0df67049`
- CE03 `9f6d02a1b4af1557f711befcf0678837d3a0d9eca3a963accc3f93c5167f2dcb`
- CE08 `c6fbcb046be331d795bbbbb613552435c4cd5639503193646b816f109471e91f`

Playable-first presentation mapping:
- Late slide near station -> CE05
- Existing COVER IMPACT > 0.09 s remaining -> CE03
- Existing COVER IMPACT 0 < impact <= 0.09 s -> CE08

No timing values were changed. 08N still uses slideDuration 0.70 s and cover impact 0.18 s.
Core movement, motion-flow, action-controller and cover-router bytes remained unchanged.

Verification:
- 6 selector assertions passed.
- 8 browser checks passed in Chromium 144.0.7559.96.
- Accepted B05 images decoded in the self-contained build.
- CE05/CE03/CE08 selected in the intended rough-play states.
- Cover-art visibility remained independent of character art and cover geometry.
- No browser exception or external HTTP request observed.

Status:
- B05 playable integration: PASS
- Full animation polish/validation: PENDING
- Baseline overwritten: NO
- Deployment: NO
- B06 may proceed in fast-track mode.
