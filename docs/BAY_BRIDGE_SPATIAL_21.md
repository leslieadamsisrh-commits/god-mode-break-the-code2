# Bay Bridge Spatial Reconstruction 21

Parent: `5f56cbaf5b27210d24a0ff0fb475b8b74106cf9f`. Same branch, service and approved assets.

## Changes

- Shared ground projection compresses map depth to .35 at unchanged zoom 1.85. Foot contacts, cover footprints, shadows, projectile/FX elevation and inverse pointer mapping use it. Upright Jade art retains its existing dimensions.
- Fixed 0–1000 / 0–620 deck contains the existing playable inset and tactical actors. Texture-only road shear and unbounded road extension are removed.
- Approved bridge span meets the far edge; world boundaries define walls. Approved skyline/water render once behind the deck, with restrained contrast and spectacle.
- Near architecture renders behind actors. Foreground masks and bounded parallax protect the fighter's screen envelope. Camera diagnostics use the renderer's projection.
- Neutral/inward/tangential A commits soft cover before mobility can release its anchor. Outward A and existing braced escape remain intact. Duplicate A handling is removed.

## Action investigation

The existing authoritative `moveOnCover` branch explicitly plants braced cover while LT/coverAim is held. It zeroes velocity and preserves the anchor despite stick input; aim and release/retract remain independent. The brace conflict prevented reaching this state. Free-standing shield still follows deployed behavior; no verified authority was found for adding a new free-standing planted mode.

## Verification

- Native Canvas invoked the actual `Game.tsx` renderer with approved road, bridge, bay, all ten actor atlases and approved ready d00 Jade. Inspected four camera extremes and 80 rotation review cells; exercised 128 complete scene rotation/camera cases and missing-art fallback. Jade audit uses d00, not a complete directional animation/device test. CSS composition is not a browser screenshot.
- `bay-production.cjs`: 2,400 host frames, two input slots, frozen constants, 5,120 atlas triangles, 320 cover transforms and texture fallback.
- `spatial21.cjs`: 81 inverse/projection points, finite deck containment through all rotations, 32 brace/LT/escape sequences and 320 pitched occlusion transforms.
- `compare-frozen.cjs`: 1,800 exact host-state matches against deployed parent for weave, shield, Grip, shooting, power and outward escape. The authorized neutral soft-cover brace fix is tested separately.
- `late-art.cjs`: timeout, late decode and SVG fallback recover without double-counting.
- Production `npm run build` passed; existing CSS flex alignment warnings remain.

## Limits / next playtest

End-on vehicle silhouettes remain stiff and rib-simplified. Far-edge walls remain simple rendered structural surfaces. Full directional animation/muzzle registration, Safari CSS masks, touchscreen aiming and physical-controller latency need real-device validation. No iPad validation has been performed for this commit.

Native audit: `CANVAS_MODULE=/path/to/@napi-rs/canvas node tests/native-spatial-audit.cjs /path/to/approved-ready-d00.webp /tmp/bay-audit`.
Baseline comparison: `node tests/compare-frozen.cjs /path/to/deployed-lib-game.ts`.
