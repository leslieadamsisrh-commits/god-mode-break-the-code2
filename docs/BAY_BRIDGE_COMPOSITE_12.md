# Bay Bridge — World Art 10 / Actor Art 11 / Composite 12

Branch: studio/live-app-three-section-01. Parent: e45196a0635cfb76096ecbf06c1ba137a3859fbd.
Master, service identity and gameplay authority remain frozen.

## Production changes

- Ten distinct six-face actor atlases: concrete aggregate/fracture/rebar, vehicle top/body/glass/wheels/end faces, steel members/fasteners/wear, infrastructure vents/doors/hinges/warnings.
- Removed production face labels and the rectangular hull-outline overdraw.
- Rib panels now use fixed object-space UV triangles instead of screen-space bounding-box textures. Artwork follows object rotation and existing irregular shells.
- Concealment uses the same rib widths and heights as the illustrated shell. Generated/legacy cover retains its existing presentation path.
- Existing World Art 10 bridge and sparse edge plates gain hardware and joint details.
- Authored roadway renders once under the actor canvas camera transform. Disabled the independently translated/perspective-transformed CSS floor, which exposed background under Jade.
- Added bounded contact shadows, wet muzzle/God light pools and material surface light response. Maximum four light sources; no additional particles.
- Distance grading and edge masks protect Jade's central screen space.

## Verification

- Production Next build and TypeScript validation pass.
- tests/bay-production.cjs: frozen numeric constants, 2,400 real host simulation frames, solo/two-player safe snapshots, 5,120 atlas triangles across ten actors and 32 rotations, 320 rig concealment transforms, tall-cover height and clear-sky checks.
- lib/game.ts, lib/bayBridgeMap.ts, app/api/game/route.ts and lib/gameFramework.ts match parent contents. Input, host authority, combat values, rig metadata and collision hulls were not changed.
- Older tests have stale VM import handling, literal escape syntax, obsolete renderer-string expectations and local asset assumptions. They are not a green full-suite signal; this pass adds a current-engine regression harness. Physical iPad/controller and two-device network feel require the user playtest.

## Genuine art debt

The vector atlases are a clearer authored foundation, not final painterly anime assets. Premium painted material depth, richer wreck silhouettes, detailed distant skyline, more natural wet reflections and cinematographic lighting remain. The existing bridge illustration stays authoritative; this pass does not replace the approved Jade.

Stop after verifying Railway SUCCESS for this commit and inspecting the live screen. Next gate: user playtest; do not start a new map, gameplay retuning or another branch.
