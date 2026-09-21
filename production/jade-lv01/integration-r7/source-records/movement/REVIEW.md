# Jade right-facing run candidate

Status: **A later authorized chroma-key candidate is available for root's game-side color-key rendering. Native transparency failed in the first two calls. No design approval, animation validation, or gameplay integration is claimed by this asset lane.**

## Authorized chroma-key follow-up

`run-right-chroma-candidate-v1.png` is the original unmodified RGB output from one targeted built-in imagegen edit replacing the checkerboard with green. Its native size is 1774 × 887. The source retains all eight poses visually. The background has dominant RGB (4,249,4), with slight variation instead of exact uniform #00FF00. `run-right-chroma-metadata.json` contains its hash, source rectangles, measured silhouette bounds and a conservative color classification used only to measure bounds. No alpha image was produced, and Python was used only for read-only pixel inspection and file copying. `chroma-edit-prompt.txt` records the exact edit prompt.

The frame rectangles have intentionally unequal widths because the lower-left shotgun crosses a nominal equal-grid boundary. Runtime code must preserve the segmented battery's green/cyan surfaces and review edge quality. This is chroma-keyed candidate art, not native transparent exports.

## Files

- `run-right-candidate-v1.png` — initial built-in imagegen output, native 1774 × 887, RGB.
- `run-right-alpha-correction-attempt.png` — built-in imagegen background-extraction attempt, native 1774 × 887, RGB.
- `source-inspection.json` — actual file hashes, dimensions, modes and transparency checks.

Each image visually has eight complete right-facing shotgun-ready silhouettes in four columns by two rows. Nominal equal slots would be 443.5 × 443.5 pixels. This is not an aligned integer-cell atlas, and source dimensions do not meet the master's individual native 1024 × 1536 target. No upscaling was performed. Both files contain opaque baked checkerboard pixels and no alpha channel; neither has been sliced or added to the game.

## Visual inspection

The candidate retains the recognizable adult Jade face, cat-ear helmet, clear purple visor, long black hair, white/magenta split coat, cropped black upper layer, multicolor battery, cables, black tactical trousers and armored boots. The shotgun is held across the torso and points right. These observations are not an identity approval.

The run sequence is not a validated full cycle. Frames 2 and 3 have very similar passing-leg positions, and the opposite-contact leg alternation is ambiguous. The character's body angle and apparent center shift across cells; gun lengths/positions and helmet/face scale need continuity review. The original lower-left shotgun extends into the nominal next cell, so equal-grid slicing would clip it. The two airborne poses do not by themselves establish sound contact timing. The coat bears an angular emblem-like mark rather than clearly legible Japanese clothing text.

## Inputs

- `approved-references/GOD MODE/Jade LV01 Lavender Visor/RS24 Run Slide Catalog/JADE-user-approved-master.png`
- `approved-references/GOD MODE/Jade LV01 Lavender Visor/B02 Catalog/B01-approved-locomotion-reference.png`
- `approved-references/GOD MODE/Jade LV01 Lavender Visor/B02 Catalog/B02-approved-motion-sheet.png`

`MASTER-LOCK.md` arrived after the initial imagegen call had started and was read before the extraction retry. It remains authoritative; this output does not override it.

## Final prompt set

Built-in `image_gen` mode was used for both calls.

### Initial generation prompt

Use case: stylized-concept. Asset type: production game sprite sheet, actual eight-frame looping run animation candidate for GOD MODE. Input image 1 is the approved Jade identity/design master; images 2 and 3 are approved locomotion style and proportions references. Generate ONE transparent PNG sheet with precisely FOUR equal columns by TWO equal rows, EIGHT complete full-body sprites only, reading left to right top row then bottom row. Use a wide 2048 by 1024 canvas if possible; each nominal cell 512 by 512. Exact same ADULT Jade design and mature realistic anime proportions from references in every frame: slim athletic adult woman, visible face and eyes through a CLEAR translucent lavender visor, black high ponytail with magenta edge light, white/black cyber cat-ear helmet with black D-pad motif, asymmetric split long off-white coat with hot-pink lining, cropped black top with bare midriff, loose black tactical pants, white armored knees and heavy white black hot-pink boots, exact cylindrical backpack battery with distinct stacked pink/blue/cyan/green/amber bands, connected hot-pink/cyan cables to gauntlets. Match the high-detail polished painted rendering, fabric folds, hardware and black/white/hot-pink palette in approved references. She carries the same sleek black tactical shotgun from master, held with both hands ready across torso, barrel aiming screen-right; shotgun stays a consistent object across all eight frames. All sprites face RIGHT in consistent side / slightly front three-quarter view appropriate to a side-scrolling game. Make a proper continuous 8-frame sprint: 1 right foot forward contact / left back, 2 compression recoil, 3 rear foot passing under torso, 4 flight with left knee forward, 5 left foot forward contact / right back, 6 opposite compression recoil, 7 other passing position, 8 flight with right knee forward ready to loop to frame 1. Alternate both legs clearly; no repeated identical poses. Torso has subtle controlled running bounce and forward lean; hair, coat tails and cables trail naturally to screen-left. Lock identical character height, equipment scale, camera and pelvic horizontal position across all cells. Use the same ground plane / feet baseline near 90 percent cell height, with modest lifted airborne feet during flight. Keep each complete silhouette (ears, hair, gun barrel, cables, coat and both boots) INSIDE its own cell with generous transparent margins; no sprite may touch a cell edge or another sprite. Background is genuinely TRANSPARENT ALPHA, completely empty: no colored backdrop, no checkerboard drawn into pixels, no ground shadow, no cast shadow, no dust, no scenery, no panels, no grid lines, no text, no labels, no logo, no watermark. Preserve Jade's exact approved identity and costume, do not redesign or simplify to pixel art, chibi, cartoon or flat vector. Deliver only the eight isolated sprites in one correctly ordered clean 4x2 sheet.

### Targeted background extraction prompt

Use case: background-extraction. Edit target: the provided eight-frame Jade sprite sheet. Change ONLY the background. The source mistakenly has an opaque gray-white checkerboard drawn into the image. Remove ALL of the checkerboard and return a genuinely TRANSPARENT PNG with a real alpha channel, alpha zero everywhere outside the eight character silhouettes and in gaps around hair, cables, arms, weapons and legs. Do NOT draw or render a checkerboard to represent transparency; the background must be truly empty transparent pixel data, not white, gray, black, colored or patterned. Preserve the eight actual adult Jade drawings, their exact anatomy, face visible through clear lavender visor, black hair, cat helmet, asymmetric white and pink coat panels, multicolor segmented battery, cables, detailed hardware, black tactical trousers, boots, gun and colored edge lights. Preserve layout as four columns by two rows. Preserve original poses, mature proportions, palette, scale and positions. Do not redesign, redraw poses, crop character, add text, shadows, floors or extra content. Only remove the fake checkerboard background to real PNG transparency. Preserve detailed character edge quality and fine hair.
