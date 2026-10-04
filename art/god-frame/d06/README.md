# Jade d06 front-facing power-up batch

This is the approved current high-detail look for the first God Frame. It is
not a replacement for future character-design work.

The user approved the three front-facing hover poses on 2026-10-03. They are
preserved byte-for-byte in `approved-hover-loop.png`. `transitions-review.png`
contains nine new complementary poses, pending visual approval. Reading order
is left to right, top to bottom: ready, dissolve, gun absent, grounded strain,
heels lift, lift, peak, weapon return, ready return. Insert the approved three
loop poses between lift and peak for the complete twelve-pose sequence.

Both sheets retain real RGBA transparency. Source inspection found complete
helmet, cape, boots and weapon silhouettes; the loop body heights differ by
two source pixels (595, 595, 593). Transition silhouette heights vary with
knee flexion. Do not normalize each pose independently.

These are source assets only. They are not loaded or selected by the app.
The deployed gameplay baseline is ed2e88e, Railway SUCCESS. Charging speed
0.67145, existing easing, vulnerable charging, battery behavior, 12-second
powered window, camera, normal movement, combat and Echo remain unchanged.

`registration-review.json` records source identity and opaque-body bounds.
Those bounds are not final crop rectangles or verified runtime anchors:
weapon particles can be disconnected. Use explicit padded source rectangles;
the generator did not place all figures at equal cell centers.

Before installation: approve the new transitions, align pelvis and ground
anchors, use one anatomical scale per source-sheet resolution, and compare
the entire animated sequence with normal ready-d06 in the actual lab. Keep
energy effects separate. Verify early release, interruption, weapon return,
turning, soft-cover movement and the registration used by normal rendering
and Kinetic Echo. Expand the next small facing batch only after that pass.

Installed directional charge coverage remains d00 only. d06 source art is
complete pending approval and runtime validation. The other missing charge
views are d01-d05 and d07-d23; existing combat views must guide each one.

Generation used the built-in image tool. Prompt: preserve the approved front
hover identity and existing ready-d06 gun perspective; create only the nine
missing front-facing entry, lift, peak and return poses; keep full-body
silhouettes, anatomical scale, asymmetric equipment and transparent source
artwork, with no separate aura baked into the character.
