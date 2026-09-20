# JADE LV01 B05 — PARTIAL ACCEPT / CE03 QUALITY HOLD

Visual authority: `ChatGPT Image Sep 19, 2026, 11_37_12 PM.png`
SHA-256: `39375b8abfd668b750cc041c5cd78db474f359f43428bd9a585396e62b579854`
Verified branch before work: `2cb0ebc389064d920a1763cf1e3a8833fc117dd5`.

## Accepted
### LV01-B05-CE05 — Compression / Low-Settle
- Exact accepted file SHA-256: `62352e395e2f638c890b0e144ea28df7623d45901a858c4a2cbb9bbf0df67049`
- Actual dimensions: 1024 x 1536 RGBA
- Alpha extrema: 0..254
- Fully transparent pixels: 817,251
- Visible alpha>8 bounds: [48,98,993,1441]
- Character-only content: no cover, floor, shadow, dust, muzzle flash, labels, second character
- Identity: PASS
- Biomechanics: PASS as low compressed key
- Continuity: PASS as key silhouette; timing not animation-validated
- Registration: PASS for file-level pixel anchors; runtime/world integration pending
- Transparency/content separation: PASS
- Promotion: accepted as B05 key export only, NOT as completed animation or runtime integration

Recorded candidate pixel-space anchors:
root [545,1395]; pelvis [560,860]; left foot [190,1398]; right foot [828,1265];
left hand [360,720]; right hand [455,680]; weapon muzzle [48,945]; weapon grip [402,700];
cover-contact socket [820,765].
These do not modify physics or establish world-space gameplay registration.

## Rejected CE03 Contact attempts
1. `0414cf5a7e0dcd0a9a261dae54eee9906790e5b1a65af0d55a7d7fb1d28498bb` — 1187x1325 RGBA
2. `0fcda21b1ee0268600a30b5f957efe5a686d7c6a4686e17cbb321c6190371375` — 1165x1350 RGBA
3. `b43b69cf51d7a6d8f0411fa6ad51d153fdbebdaedfee97257568dd992793804f` — 1024x1536 RGBA
4. `42f3908d5567d880786c6e5d533e09e4aa0f5cd456c5b448baf69791a8cdaf98` — 1400x1123 RGBA

Reason for rejection: none clearly reads as vertical-cover contact. The intended contact hand/palm/forearm falls toward the ground or the pose reads as low aiming/ready, so biomechanics and cover-action continuity fail. No rejected CE03 candidate is installed.

## Batch status
- Reference authority: VERIFIED
- CE05 export: ACCEPTED
- CE03 export: QUALITY HOLD
- CE08 export: BLOCKED until CE03 passes
- B05 animation validation: NOT COMPLETE
- 08N integration: NOT STARTED for this B05 art
- 08L networking integration: NOT STARTED
- Deployment: NOT STARTED
- Agents launched: NO

Preserve all prior sprites, 08N local art/combat baseline and 08L separate network prototype. No movement, collision, camera, controller, damage or deployment changes were made.
