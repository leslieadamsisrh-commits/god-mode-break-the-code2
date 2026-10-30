# Raptor Lab 37 — Sprite production gate
This branch is isolated. Main game and XYZ preview are protected.

## Art status
The eight-direction atlas is a **concept reference**, not a production spritesheet. The checkerboard is baked into the image, poses per cell vary, and frame counts are not complete. Do not pretend a cropped concept panel is a transparent registered sprite.

## Production sequence
1. Lock one full-resolution master turnaround: front, back, left, right and four diagonals. Keep exact armor, red eyes, yellow-black markings, tail, shotgun, proportions.
2. For each facing, draw *individual* 8-frame idle and walk cycles, 12-frame Predator Run, 10-frame baseball slide, transitions and shotgun firing.
3. Export actual transparent PNG frames, same canvas size and world-space foot anchor, with an explicit JSON manifest and independent shotgun/muzzle FX where appropriate.
4. In isolated /raptor-lab only, load manifest, render directional animation, verify weapon origin and parity with Jade's movement and collision. Preserve slide as separate action.
5. Run controller and keyboard tests, verify asset loading and all eight direction changes, deploy an isolated preview. Merge only on explicit approval.

## Immediate constraints
Shotgun only. No new powers or story. Do not alter Jade, main, or production deployment. Keep visual effects separate.
