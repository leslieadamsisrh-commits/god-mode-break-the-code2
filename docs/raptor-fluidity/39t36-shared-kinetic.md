# 39T36 shared kinetic movement

Rollback commit is 39T35, b6c6150c40d94e9ebbb0c1beebd179d3e33da851.

The shared 60 Hz engine retains the same dash, slide and brake rules and default profile for Jade and Raptor. Training provides live calibration, reset, fighter switching and quarter-speed replay. The provisional hybrid copies Weave steering, steering response, brake strength and slide exit threshold while retaining default dash, slide launch and sustain. With equal inputs, both fighters produced identical motion samples.

| Profile | Dash distance | Curve after 250 ms | Brake to redirect | Distance before redirect |
|---|---:|---:|---:|---:|
| 39T35 Default | 68.2 | 19° | 117 ms | 27.3 |
| God Mode Weave | 60.3 | 49° | 83 ms | 23.4 |
| Weave Steering + Brake | 68.2 | 49° | 67 ms | 13.7 |

Distances are world units from the deterministic open-lane test. The tested curve applies a 45° stick input. The brake applies an opposite stick input. A physical controller test is required to confirm which profile feels best.

Both renderers read the same dash and brake phases. Jade reuses directional slide/run cels with the legacy brake-atlas route when the atlas and facing are usable. Raptor reuses the registered slide recovery, brake, push, sprint and gait poses. Raptor's standing pivot reuses a planted settle only where the intermediate facing has a compatible cel. Weapon and cover routes keep precedence. The new straight-back brace shares the compression frame's anchor and left-foot registration and keeps both cells and crown cables visible. The shotgun is concealed in the brace, and the existing exposure selector supplies the firing sprite and socket.

Dedicated dash/brake and diagonal receiving-foot art remains open. The legacy Jade brake atlas available at the older repository path did not decode as WebP, so the candidate relies on Jade's directional sprite fallback. Landing, pivot and first-stride registration across all eight directions still need visual review.
