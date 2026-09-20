# JADE LV01 B05-T1 — ANIMATION VALIDATION HOLD

Master authority: `ChatGPT Image Sep 19, 2026, 11_37_12 PM.png`
SHA-256: `39375b8abfd668b750cc041c5cd78db474f359f43428bd9a585396e62b579854`

Verified starting branch head before this B05-T1 continuation: `a1f53dec113698c42a7d9d52e27e72949137b80c`.

## Preserved accepted keys
- CE05 Compression / Low-Settle — `62352e395e2f638c890b0e144ea28df7623d45901a858c4a2cbb9bbf0df67049`
- CE03 Vertical Cover Contact — `9f6d02a1b4af1557f711befcf0678837d3a0d9eca3a963accc3f93c5167f2dcb`
- CE08 Attached-Ready — `c6fbcb046be331d795bbbbb613552435c4cd5639503193646b816f109471e91f`

No accepted key was regenerated or repainted.

## 08N timing source
Read exact 08N package code:
- `core.js`: slide duration `0.70 s`; `attach()` sets `impact = 0.18 s`; emits `cover_contact`.
- `cover-router.js`: contact role uses `TIMES.contact = 0.18 s` and the authoritative `cover_contact` event time.
- `motion-flow.js`: state remains `COVER IMPACT` while `impact > 0`.
No verified fixed pre-contact timer exists in 08N, so no new timer was invented.

## Minimum missing authored frames
1. `IB-PRE` between CE05 and CE03 — event/proximity-driven just before cover attachment. Purpose: bridge body/weapon path and bring contact limb into vertical-plane contact.
2. `IB-RET` between CE03 and CE08 — must fit inside the existing 0.18 s impact window. Purpose: retract contact arm, recenter shotgun and resolve pelvis/shoulder momentum.

## Rejected B05-T1 generation attempts
All three attempts returned multi-frame review/progress boards instead of isolated transparent sprite files. Printed PASS/COMPLETE/integration claims in generated boards are invalid and were not promoted.

- Attempt 1: `a_clean_production_animation_review_sheet_on_a_tra.png`
  SHA-256 `e7bac0bbfd52c83cd705c586d9b97fdd54218e713dbafaf0fd7603782a936df0`, 1536x1024 RGBA.
- Attempt 2: `a_dark_studio_like_sprite_sheet_animation_refere.png`
  SHA-256 `be3646e0eeaddff630cbc0f1441091a36e381ac262cfd5257b7ce265d0081446`, 1536x1024 RGBA.
- Attempt 3: `a_dark_ui_style_compilation_image_sprite_sequen.png`
  SHA-256 `626968c3ba87ce01db03d0c84fab52832e1e41cdc4f3355b2a1da37b363907eb`, 1536x1024 RGBA.

## Non-destructive review
A local review player was created using the three accepted keys unchanged and explicit missing-frame gaps. It does NOT invent in-betweens and does NOT claim animation validation.

## Status
- Key export set: COMPLETE
- Accepted in-betweens: 0
- Required in-betweens still missing: 2
- Animation validation: HOLD
- 08N isolated integration: NOT STARTED
- 08N baseline modified: NO
- 08L modified: NO
- Deployment: NOT STARTED
- Autonomous agents launched: NO

Do not advance to B06. Resume B05-T1 only when an isolated sprite workflow can produce IB-PRE and IB-RET without returning composite boards or redesigning Jade.
