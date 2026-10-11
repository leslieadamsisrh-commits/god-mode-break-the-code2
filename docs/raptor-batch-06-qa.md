# Raptor Batch 06 — Sprite Cutout QA (R031–R036)
Status: VISUAL REFERENCE / DRAFT CUTOUTS ONLY. Not runtime-ready.

## Visual authority
User-approved Velociraptor Art V3.0: olive tiger stripes, red monocle, white/gunmetal armor with magenta accents, digitigrade legs, long tail, expressive jaws. Preserve character appearance.

## Inspection
- R031 light hit: clear pose; magenta hit FX and ground shadow baked into cutout.
- R032 heavy stagger: clear compressed stance; debris and floor shadow baked into cutout.
- R033 shield break: readable recoil; psychic FX, floating shards and shadow baked in.
- R034 airborne knockback: pose legible; debris and shadow need separate layers; anchor is airborne and must be tied to world root, not bottommost pixel.
- R035 knockdown: pose legible; floor contact differs from standing; shadow and debris need separation.
- R036 get-up: clear crouched recovery; floor debris and shadow baked in.

## Hard failures
1. Source is a composited presentation poster, not an alpha-authored sprite source.
2. Background-removal algorithm can erase dark armor and preserve checkerboard or text remnants; transparency is not validated.
3. No verified consistent weapon, head, tail or ground registration across frames.
4. These are six key poses, NOT 48 individual animation frames despite generated poster text.
5. No animation timing or hitbox parity testing.
6. No verified integration with the shared Jade combat simulation.

## Acceptance procedure
Produce clean isolated per-pose art on true alpha, with FX separate. Lock canvas/scale and documented foot/world root, weapon socket and head socket. Render over white, black and checkerboard to inspect halos. Verify R031–R036 silhouette at in-game scale. Register as cosmetic presentation only after parity tests. Do not claim game-ready until runtime screenshot and gameplay test.

## Development gate
Do not modify lib/game.ts, lib/localCombat.ts, network, controller mappings or Jade's sprite registry to force these draft images into the game. Next engineering step: inspect existing sprite loader/registration schema and design an optional raptor presentation adapter with safe fallback.
