# JADE LV01 B06 — ROUGH PLAYABLE INTEGRATION PASS

Fast-track status: PASS WITH EXPLICIT ART PLACEHOLDER.

Accepted authored key:
- B06-B Shimmy Left
- SHA-256: `02d27fdb483c5b2bbd65b020ac2ff0afe7f6db5b9918bf38adc0f7e7527d5b55`

Temporary mappings:
- B06-A Attached Idle -> reuse accepted CE08
- B06-C Shimmy Right -> temporary reuse of B06-B, explicitly marked PLACEHOLDER
- B06-D Left Stop -> reuse accepted CE08
- B06-E Right Stop -> reuse accepted CE08

Rejected art:
- B06-C attempt 1
- SHA-256: `e24a2a23fb1532ae26a8ea8184de73ef2a998cbec8449ce6f8a16432e1a8d029`
- Reason: pose remained left-loaded and did not read as a distinct rightward shimmy.

Runtime verification:
- B05 selector assertions: 6 passed
- B06 selector assertions: 6 passed
- Browser checks: 7 passed
- Browser: Chromium 144.0.7559.96
- No browser exceptions
- No external requests
- Movement tuning unchanged: slideDuration 0.70, slideSpeed 650
- B05 impact mapping retains priority
- B05-FI source preserved
- 08N baseline not overwritten
- Deployment not performed

Standalone SHA-256:
`2355ce22de9659a3aeada8312d474bf0f94cf34f1d71b542f0eb0abe806b6802`

Package SHA-256:
`38675bf29c0761e0012b30b68a798ef1a3f2425880e7f47f1921507e8bd5a8f9`

Polish queue:
- true B06-C right shimmy key
- dedicated stop keys only if playtest shows CE08 settle reuse is visually insufficient
