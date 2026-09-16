# GOD MODE provisional charge direction handoff

Status: art study and blue-key handoff generated; real transparency requirement FAILED in both initial built-in outputs. Blue-key source is ready for the main owner's conservative extraction and visual review, but is not yet a runtime sprite. One provisional direction only, not the full 24-direction family.

## Source and generation

- Approved design reference inspected visually: `/workspace/projects/god-mode-break-the-code2/recovery/shotgun-lab-v57/assets/shotgun-complete/runtime/ready-d03.webp`.
- Built-in imagegen used; no CLI/API fallback.
- Selected pose source: `charge-d03-6frames-source-rgb.png`.
- Targeted transparency edit: `charge-d03-6frames-alpha-attempt-rgb.png`.
- Generation prompt: `generation-prompt.txt`.
- Transparency correction prompt: `transparency-edit-prompt.txt`.
- Preferred extraction handoff: `charge-d03-6frames-blue-key-source.png`.
- Blue replacement prompt: `blue-key-edit-prompt.txt`.
- Blue numerical inspection: `blue-key-inspection.json`.
- No Site files, GitHub files, or project configuration edited.
- No limb removal, component deletion, or largest-component cleanup performed.

## Grid

Canvas 1536 x 1024 pixels. Three columns by two rows; nominal cells 512 x 512 pixels. Row-major frame order.

| Frame | Pose | Column | Row | Crop x | Crop y | Width | Height |
|---|---|---:|---:|---:|---:|---:|---:|
| 0 | Entry | 0 | 0 | 0 | 0 | 512 | 512 |
| 1 | Clench | 1 | 0 | 512 | 0 | 512 | 512 |
| 2 | Brace | 2 | 0 | 1024 | 0 | 512 | 512 |
| 3 | Rising effort | 0 | 1 | 0 | 512 | 512 | 512 |
| 4 | Sustained effort | 1 | 1 | 512 | 512 | 512 | 512 |
| 5 | Recovery | 2 | 1 | 1024 | 512 | 512 | 512 |

## Visual inspection

- Six full-body authored poses visibly present; entry/clench are subtle, brace/rise/sustain visibly distinct, recovery eases the shoulders.
- Both arms, both hands and both legs/boots are visible in every frame. No weapon held.
- Dark hair, console/cat-ear helmet, cyan segmented backpack, cables, magenta coat tails and dark armored suit retained at concept level.
- Hair and cables rise/back-sweep across effort frames, then settle in recovery.
- No aura, ground disk, external particles, or lightning embedded.
- Viewpoint is consistently front-right; exact matching to ready-d03 still requires the main owner's review.
- The generated heroine is larger, cleaner and more curvy than the tiny approved source and has a more open chest plate. Exact design fidelity is not yet approved.
- Feet stay close to each row's baseline, but the second row is roughly 20 px higher within its cells and stance widens during effort. Runtime registration has not been normalized.
- Full anatomy stays inside nominal cells, but top/bottom cell padding is tighter than requested (roughly 16–35 px at extremes). Main owner should inspect at runtime scale before acceptance.

## Machine inspection

Both output files are PNG, 1536 x 1024, PIL mode RGB, bands R/G/B only. Neither contains an alpha channel. The checkerboard is baked into RGB values. The second image merely changed the checker pattern despite a prompt to extract the background.

No claim of transparent delivery or runtime readiness is made. Preserve these RGB sources if a separately authorized matte workflow is used; do not discard disconnected body details or equipment.

## Blue-key handoff inspection

The main owner authorized the existing sprite workflow's conservative transparency extraction/registration/atlas assembly and requested one targeted imagegen edit to replace the checkerboard with #0000FF. That edit was performed. The result visually preserves the six poses and all limbs and equipment against a blue field. No deterministic extraction was performed by this authoring task.

The generated background is near-blue, not pixel-exact #0000FF: only 1 pixel is exactly (0,0,255). In the outer 10-pixel rails, RGB ranges from (0,4,242) to (2,23,255), and the most frequent color is (0,7,253). This is a usable key-color source for a carefully reviewed tolerant extraction, but an exact equality key would fail. Protect cyan batteries/cables and magenta tails; do not erase character pixels or use largest-component cleanup.

Approximate local content bounds from an inspection-only background heuristic (B > 180, R < 60, G < 60), not a saved matte:

| Frame | Left | Top | Right exclusive | Bottom exclusive |
|---|---:|---:|---:|---:|
| 0 | 111 | 22 | 440 | 497 |
| 1 | 85 | 24 | 442 | 497 |
| 2 | 58 | 89 | 418 | 496 |
| 3 | 91 | 20 | 488 | 477 |
| 4 | 77 | 13 | 489 | 477 |
| 5 | 91 | 19 | 436 | 477 |

This confirms 15–35 px minimum vertical padding in several frames, a 20 px row baseline offset, and tight 23 px right padding on the strongest sustained pose. Keep the full cells initially so that no part is lost; registration remains main-owner work.
