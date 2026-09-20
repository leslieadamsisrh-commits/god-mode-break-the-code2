# JADE LV01 — Cover Movement Reference Board Receipt

Reference board: `jade_s_cyberpunk_cover_movement_board.png`
SHA-256: `34a6173e5a4e2e1fd2c6a42c1ac76b2936e1a7423fbfd4a2f096c7c98cda2afb`
Dimensions: 1672 x 941 RGB

Status: REFERENCE ONLY — NOT RUNTIME SPRITES.

The board confirms the desired final presentation for cover/corner movement, but individual runtime frames must be exported separately under the Jade character sprite contract.

Mandatory separation:
- Jade sprite = character only, true transparent PNG.
- Cover = independent runtime world asset.
- Slide-to-cover = Jade slides up to separately rendered cover.
- No wall/pillar/barrier pixels may be baked into the Jade sprite.
- No floor, shadow, dust, muzzle flash, UI, or typography may be baked into the Jade sprite.

Playable-first status:
- B05–B11 rough systems remain code-backed and playable-first.
- Final art uploaded later replaces placeholders by animation role/direction without rewriting gameplay.
- This board is a visual target, not evidence that all displayed poses exist as runtime exports.
