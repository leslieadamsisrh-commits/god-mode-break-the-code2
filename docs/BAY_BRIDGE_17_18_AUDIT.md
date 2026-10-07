# Bay Bridge 17–18

Continues e974904 on the existing studio branch. Gameplay, hulls, rails, camera tuning and authoritative engine unchanged.

Pass 17: SVG fallback can run after boot timeout. Missing art retains rig-shaped material surfaces while loading. Audit reproduced both late success and late failure, with single boot-progress completion; combat and geometry harness passed.

Pass 18: Each texture triangle draws only its source region instead of submitting the full atlas. Subtle warm top/cool side shading follows the actual rig faces. Audit checked source bounds and finite transforms for 5120 triangles, ten actor families, 32 rotations, 320 concealment cases and 2400 host frames. Missing-art path also checked.

Production build/type check required before release. These are code/geometry audits, not an on-device visual signoff or multiplayer network performance certification. Retained debt: end-face anatomical accuracy, painted near/foreground layers, real iPad motion readability and frame pacing. Previous legacy fixture failures remain outside this focused harness.
