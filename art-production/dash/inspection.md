# Upright dash provisional batch inspection

Status: PROVISIONAL BLUE-KEY SOURCE AVAILABLE; NO RUNTIME ALPHA ATLAS YET. The first two built-in imagegen outputs are rejected RGB PNG files with an opaque simulated checkerboard. Neither output has an alpha channel. The targeted alpha correction failed. After the owner's follow-up authorization, a third built-in edit replaced the checkerboard with a blue background for the owner's established extraction workflow. No pixel deletion, alpha erasure, resampling, sprite slicing, or other raster edits were performed locally; all three files are exact copies of the tool outputs.

## Files

- `upright-dash-front-right-v1-rejected.png`: first generated 1536 x 1024 sheet.
- `upright-dash-front-right-v2-alpha-attempt-rejected.png`: targeted transparency correction, also 1536 x 1024 RGB.
- `upright-dash-front-right-v3-blue-key-source.png`: third output, 1536 x 1024 RGB, blue-key source for conservative extraction by the owner. This file is not yet transparent.
- `generation-prompt.txt`: full original built-in generation prompt.
- `transparency-correction-prompt.txt`: full targeted correction prompt.
- `blue-key-correction-prompt.txt`: full blue-background-only correction prompt.

## Grid and frame order

3 columns x 2 rows. Equal nominal cells: 512 x 512 pixels. Zero-based cell origins:

| Frame | Origin x,y | Intended action | Visual reading |
|---|---|---|---|
| 1 | 0,0 | Foot plant and aim | Upright two-foot plant and rightward aim. |
| 2 | 512,0 | Hip shift | Upright weight transfer with rear foot lifting; reads close to a running preparation. |
| 3 | 1024,0 | Push-off | Upright forward stride, trailing leg extended behind. |
| 4 | 0,512 | Upright skating-like dash | Extended upright stride; no seated or ground-contact slide. |
| 5 | 512,512 | Second step | Compressed leg exchange, torso upright, shotgun steady. |
| 6 | 1024,512 | Transition to run | Upright compact running step. |

## Visual findings

- Same right-facing front-right three-quarter viewpoint is maintained throughout. This is one provisional direction, not an approved directional family.
- Six distinct leg/hip poses are visibly drawn. They are not visibly rotated or flipped copies. Upper body aim remains largely stable.
- Recognizable dark ponytail, cat-eared helmet, silver/charcoal armor, magenta cloth tails/boot soles, cyan segmented backpack/cables, and raised shotgun are present in all six frames.
- Full head, equipment, hands, feet, and weapon remain inside the canvas. No ground, cover, text, labels, shadows, dust, aura, or speed trails appear.
- Character proportions and equipment are broadly consistent, but production identity approval and animation timing review remain with the main agent/user.
- Sprites occupy more of each cell than requested. Lower-row muzzles approach their right cell boundaries, so the requested generous gutters are not fully achieved.
- Feet and whole-body placement are not registered to identical local cell anchors. These require measured registration after a valid alpha source exists; this output is not an anchor-stable runtime atlas.
- The hip-shift/corner-cut beat is subtle. The sequence reads as a steady rightward dash/run and should not be claimed as a strongly articulated directional corner cut.

## Alpha attempt hard rejection

Pillow inspection of both files reports mode RGB, bands R/G/B, dimensions 1536 x 1024. The checkerboard is image content, not a viewer transparency indicator. Do not integrate these as runtime transparent sprites or claim the alpha requirement is complete. Both are retained as rejected art references for review.

Built-in imagegen used; no CLI/API fallback invoked. Source images and Site checkout were not edited.

## Blue-key source inspection

The third output preserves the six upright poses, full anatomy and equipment, and the same 3x2 composition visually. It replaces the checkerboard with a visually uniform saturated blue field. No clipping, erased limbs, or new text is visible. A generative edit cannot be claimed pixel-identical to the first artwork, and its edges require visual QA after extraction.

The blue is not numerically exact #0000FF. Pillow reports RGB, 1536 x 1024. The most common background color is RGB(0,10,253), followed by (0,9,253), (0,11,253), (0,10,254), and (0,8,253). Corner samples are (1,9,246), (1,10,245), (2,24,245), and (3,25,244). Empty top-30-row values range from (0,5,245) to (1,14,255). Therefore exact-color-only extraction will leave background residue. Use conservative key tolerance with edge treatment and inspect all six silhouettes, protecting cyan backpack segments/cables, dark outlines, hair, tails, and every limb. Do not apply largest-component filtering or arbitrary silhouette deletion.

Owner should register foot anchors and inspect frame timing and margins after conservative extraction. No further directions were generated after the failed alpha gate.
