# Raptor Movement Batch 01 — Registration Gate

Status: BLOCKED for runtime. Six reference panels R001–R006 inspected. They are composited artwork, not clean transparent sprites.

- R001: Ground shadow baked in; source alpha required.
- R002: Inspect tail tip and shadow; source alpha required.
- R003: SMG muzzle visibly crosses the panel boundary; missing artwork cannot be recovered by padding.
- R004: Muzzle near panel boundary; full silhouette verification required.
- R005: Tail tip, toes and shadow require full silhouette inspection.
- R006: Sprint entry appears airborne; world-root and ground-contact transition require correction.

Mandatory acceptance: complete uncropped silhouette, true alpha, clean edge against white/black/checkerboard, fixed frame scale, registered foot/world anchor and muzzle socket, separated VFX/shadows, correct visual authority, preview at gameplay scale. Do not copy poster pixels directly into runtime or modify shared Jade combat rules to compensate.

Next: obtain or author complete uncropped alpha-source movement poses; verify 6/6 before registering in raptorPresentation.ts. Existing main game and Railway production remain untouched.
