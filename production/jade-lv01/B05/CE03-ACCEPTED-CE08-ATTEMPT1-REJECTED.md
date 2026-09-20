# JADE LV01 B05 — CE03 Accepted / CE08 Attempt 1 Rejected

Authority: `ChatGPT Image Sep 19, 2026, 11_37_12 PM.png`
SHA-256: `39375b8abfd668b750cc041c5cd78db474f359f43428bd9a585396e62b579854`
Branch checkpoint verified before generation: `1c7c391179b4f29d358339b8b7df182474dba1c6`.

## CE03 — ACCEPTED
File: `LV01-B05-CE03_Vertical-Cover-Contact.png`
SHA-256: `9f6d02a1b4af1557f711befcf0678837d3a0d9eca3a963accc3f93c5167f2dcb`
Dimensions: 1312 x 1199 RGBA
Alpha extrema: 0..255
Fully transparent pixels: 727878
Visible alpha>8 bounds: [6,8,1312,1199]

Review:
- Identity: PASS
- Biomechanics: PASS
- Continuity from CE05: PASS as key pose
- Registration: PASS for recorded source-pixel review anchors; world/game registration pending
- Transparency/content separation: PASS
- Special contact gate: PASS. Open palm is forward at chest/shoulder height toward the invisible vertical cover plane.

Approximate source-pixel review anchors (not gameplay/world sockets):
root [650,1128]; pelvis [690,760]; left foot [130,1135]; right foot [612,1018];
contact palm [1255,330]; contact wrist [1192,350]; weapon grip [695,585];
weapon muzzle [1048,845]; cover-contact socket [1282,330].

## CE08 — ATTEMPT 1 REJECTED
File alias: `CE08_attempt_1.png`
SHA-256: `858fcc2d918f2cb9d31b73cc9e9241230dad475dbbd82a275278fb5f26377e1d`
Dimensions: 1199 x 1312 RGBA
Alpha extrema: 0..255
Fully transparent pixels: 746470

Reason: the contact palm remains extended toward the invisible wall, so the silhouette still reads as CE03 contact rather than the attached-ready endpoint. CE08 must settle the contact arm back into stable two-hand weapon control while Jade stays low and attached.

Review:
- Identity: PASS
- Biomechanics: FAIL for attached-ready endpoint
- Continuity: FAIL for settle/recovery transition
- Registration: NOT PROMOTED
- Transparency/content separation: PASS

## Protected status
- CE05 remains accepted and unchanged, SHA-256 `62352e395e2f638c890b0e144ea28df7623d45901a858c4a2cbb9bbf0df67049`.
- CE03 is accepted as a key export.
- CE08 remains QUALITY HOLD.
- B05 is NOT export-complete.
- Animation validation: NOT COMPLETE.
- 08N runtime integration: NOT STARTED.
- 08L network integration: NOT STARTED.
- Deployment: NOT STARTED.
- No movement/collision/camera/controller/gameplay changes.
