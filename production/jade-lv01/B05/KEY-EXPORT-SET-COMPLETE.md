# JADE LV01 B05 — KEY EXPORT SET COMPLETE / ANIMATION VALIDATION PENDING

Authority: `ChatGPT Image Sep 19, 2026, 11_37_12 PM.png`
SHA-256: `39375b8abfd668b750cc041c5cd78db474f359f43428bd9a585396e62b579854`
Branch checkpoint verified before CE08 generation: `84bf6b9864b75e0cf957141146c613915ef81091`.

## Accepted key exports
### CE05 — Compression / Low-Settle
SHA-256: `62352e395e2f638c890b0e144ea28df7623d45901a858c4a2cbb9bbf0df67049`
Dimensions: 1024 x 1536 RGBA
Status: accepted key export; unchanged.

### CE03 — Vertical Cover Contact
SHA-256: `9f6d02a1b4af1557f711befcf0678837d3a0d9eca3a963accc3f93c5167f2dcb`
Dimensions: 1312 x 1199 RGBA
Status: accepted key export.

### CE08 — Attached-Ready
SHA-256: `c6fbcb046be331d795bbbbb613552435c4cd5639503193646b816f109471e91f`
Dimensions: 1312 x 1199 RGBA
Alpha extrema: 0..255
Fully transparent pixels: 594991
Visible alpha>8 bounds: [19,13,1274,1197]

CE08 review:
- Identity: PASS
- Biomechanics: PASS
- Continuity from CE05 -> CE03: PASS
- Registration: PASS for recorded source-pixel review anchors; world/game registration pending
- Transparency/content separation: PASS
- Special CE08 gate: PASS — contact arm fully retracted; Jade stable in low attached-ready with both hands controlling the shotgun.

Approximate CE08 source-pixel review anchors (not world/game sockets):
root [645,1120]; pelvis [670,760]; left foot [180,1110]; right foot [680,1025];
left hand weapon [670,560]; right hand weapon [975,700]; weapon grip [735,590]; weapon muzzle [1148,885].

## B05 status
KEY EXPORT SET COMPLETE: CE05 + CE03 + CE08 accepted.
This does NOT mean B05 animation validation is complete.

Pending:
- timed transition/in-between validation
- root/feet/pelvis/weapon continuity over time
- 08N gameplay registration/integration
- deployment

Protected:
- 08N local art/combat baseline unchanged
- 08L network prototype unchanged
- no movement/collision/camera/controller/gameplay tuning changed
- no deployment made
- rejected B05/CE03/CE08 attempts remain rejected
