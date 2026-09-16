# Anchor and identity contract

- Coordinates use the top-left of each cell, in source or runtime pixels as explicitly labeled. Frame index is zero-based, row-major.
- Current runtime cells are 250×250; inherited ground reference is (125,219). That reference is not a measured sole position on every drawing. Current ready-study alpha heights range from 179 to 184 px, with a few pixels below the nominal anchor.
- Source sheets referenced as 384×384 cells are missing; do not fabricate their hand/muzzle measurements by declaring upscaled runtime coordinates original.
- Direction index is 0–23, increasing in 15° nominal steps: right=0°, toward viewer=90°, left=180°, away=270°. Register actual yaw only after visual review. Aim and travel direction are separate metadata.
- Register left/right hand, weapon attach, distal firing barrel, shield, cover contact and ground/effect anchors for actions that use them. Unknowns stay null with a reason. Never put a false muzzle at the feet.
- Keep visual alpha bounds separate from collision. The saved actor radius is 17 world units; perspective image bounds cannot replace world collision.
- Review identity includes the actual image SHA-256 and frame number. Replacement image revisions invalidate prior approval. Source, atlas grid and frame metadata travel together.
- Maintain complete transparency and at least the approved existing padding. An alpha-edge audit cannot repair missing anatomy. Repairs require a newly reviewed source image, not erasing disconnected body parts.
- Exact-direction, visual, temporal-continuity, and integration approvals are separate statuses. Only applicable completed gates permit import.
