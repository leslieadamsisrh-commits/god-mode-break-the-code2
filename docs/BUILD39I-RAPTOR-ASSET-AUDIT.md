# Build 39I — Asset audit and production handoff

## Audited assets
- Run: 32 provisional 512×512 RGBA files, eight directions × four poses, sourced from the previously generated local 39G review package.
- Idle: 32 provisional 512×512 RGBA files, eight directions × four poses, sourced from the previously generated local 39H review package.
- Automated exact-file hash scan: no byte-identical duplicates among these 64 files. **This does not rule out visually repeated poses.**
- All 64 had an alpha channel with both transparent and opaque pixels; this does **not** certify clean silhouette or absence of dark background remnants.
- All remain provisional; zero independently accepted production frames; zero installed in repository.

## Current blocking issues
1. Source crops may omit limbs, tails or equipment and may contain background or red-edge contamination. Do not mistake RGBA encoding for clean alpha.
2. The sprite-only renderer in `lib/raptorSpriteOnly.ts` currently expects run=12 and idle=8 frames/direction; provisional package contains 4 each. **Do not silently repeat frames to fill counts.** Align manifest/renderer counts only after actual validated files are committed.
3. Asset files are not yet in `public/assets/raptor-v2`. No gameplay verification or deployment has occurred.

## Next unfinished animation
**Walk, 6 unique articulated poses × 8 directions = 48 frames.** Produce real individual 512×512 transparent character-only PNGs, starting with right direction. Keep the approved Raptor V2 design and headset-to-backpack tubes, not dreadlocks. Check alternation of planted feet and visual distinctness before accepting each frame.

## Other remaining families
Slide 48, Jump/Fall 32, Landing 24, Shotgun 32, Hit 32. Preserve Jade simulation and camera; integrate only on isolated development branch after artwork quality gates.
