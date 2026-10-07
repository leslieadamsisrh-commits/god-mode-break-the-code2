# Spatial Finish 19

Parent decfeb4; existing branch and service only. Engine, camera tuning, controls, hulls, rigs, rails and approved images preserved.

Roadway covers the entire world rectangle rather than clipping against a camera-relative horizon. Haze is fixed to world Y. The bridge image is registered at the far roadway in the combat canvas and its duplicate CSS layer is hidden. This deliberately prioritizes continuous ground; distant sky/portal visibility reduces when looking deep into the roadway.

Side UVs crop according to each rib's authored height rather than squeezing the full side image into each height. Vehicle top UVs reverse longitudinal orientation to align with side artwork. Native canvas visual audit rendered the actual renderer and approved WebPs at four angles per vehicle; the corrected top alignment was inspected. Generated side/end artwork is still imperfectly orthographic and cannot be claimed engineering-exact.

Guide starts collapsed, including on devices that previously stored an open panel. Portal background brightness restrained. Loading fallback retained.

Audits: production build/type check, 2400 host frames, frozen constants, 5120 actor triangles at 32 rotations, 320 occlusion cases, missing textures, late success and late failure. Native canvas audit is not Safari/on-device verification. Full integrated iPad motion test remains required; no claim of multiplayer network validation. Legacy fixture issues remain as documented previously.

Remaining debt: perspective baked into generated end faces; background spectacle composition after world-ground correction; sparse foreground still vector-authored. No gameplay retuning.
