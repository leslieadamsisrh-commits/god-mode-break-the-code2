# Raptor Humanoid Motion Lab — Build 37

Status: isolated development specification. NOT merged or deployed.

## Locked movement design
- Upright humanoid stance for idle, walk, strafe, aiming and low-speed locomotion.
- Forward movement blends into a lowered velociraptor sprint based on directional velocity and sustained speed; do not alter the shared physics or introduce an extra sprint button.
- Existing A slide input remains a distinct baseball-style slide, with its own entry, travel, and recovery animations. Do not replace slide with running.
- Preserve responsive aim and firing, foot anchors, muzzle origin, collision, hitboxes, psychic hold and throw, and all existing combat controls.
- Keep the approved Raptor head, jaw, red eyes, markings, cybernetic armor, backpack, claws, tail and rifle. Refit to upright Jade-compatible humanoid proportions.
- Tail secondary animation is visual only unless explicitly designed otherwise.
- Test transitions idle->walk->run->slide->exit, strafing, backwards, jump, aiming, firing, melee and psychic carry.
- Use a shared-compatible rig adapter; do not modify or merge into the Jade/main combat implementation.
- Establish baseline metrics and test parity before any future integration.
- Require explicit user approval before merging to main or changing the production preview.

## First implementation pass
1. Audit existing Raptor lab and Jade rig interfaces.
2. Implement posture blend state from movement direction and velocity.
3. Retarget upright and low-run visual assets with stable pivots.
4. Implement baseball slide pose and transition while retaining existing slide physics.
5. Expose debug state, movement vector and animation transition diagnostics.
6. Test with controller and keyboard; document actual results.
7. Deploy only an isolated lab preview after verification.

Art reference: user-provided Velociraptor Soldier rig concept image (2026-10-29). This file is a specification, not a claim of completed runtime implementation.
