# Jade V12 — Batch 08E gun-raise bridge: QUALITY HOLD

## Result
Four image-generation attempts were made for the missing intermediate gun raise. All four returned presentation boards rather than the requested single, large, full-body character-only frame. All four are REJECTED for production. Zero new accepted character frames. No animation family is completed or promoted by this pass.

The checkmarks, frame counts, timelines and completion claims printed inside the generated boards are not verified and must NOT be used as production evidence. They were not added to the production queue as completed work.

## Immutable sources verified
- Approved Idle/Ready reference: 1536 x 1024 composite, SHA-256 fff8eeb8fcc3ef1ff3a830684c1ac5aac5f8f142cb3ed92283e8b6ec59d49e89.
- Three-pose source: 1944 x 809 RGBA, SHA-256 9d4668f5bf91cf23a4f6a3cf6878ae1347d84cd37ec56dd16ae8f6f234713a1c.
- K02 (640 x 809) and K03 (684 x 809) were extracted again without rescaling as unchanged reference frames, not new drawings.
- Movement authority remains v11.1 ba742b1019f80f3e2d71b166b32244c4ed686260.
- Branch head observed before this pass: 7a8ec1ac69929b7cd49b47c08fc1e161c826bf33.

## Verified rejection evidence
Every attempted output is actually 1536 x 1024 RGBA and contains ZERO fully transparent pixels. Their alpha ranges are below. RGBA mode alone does not establish a transparent sprite background.

| Attempt | SHA-256 | Alpha min/max | Decision |
|---|---|---|---|
| 01 | 8cc01b8a04a1c660618e7308c1ef9d3ae887fd7630c79e224ae36f75a7e2ee9b | 1 / 254 | Rejected |
| 02 | bc23c90d9c7634f1981e3a8a386aa18c40fa031bb6e8751e88728f5296120c03 | 4 / 252 | Rejected |
| 03 | f11e893dd0811b2f52e6adcc00ff477e8d9096d61d22bfb6a488d888494b0420 | 23 / 252 | Rejected |
| 04 | fb075d7898983654678b9847ada0d8257e8138dcd810f15da106e7edf51e1d6e | 7 / 253 | Rejected |

They fail the requested single-frame 1024 x 1536 target, useful transparent background, clear outside margin, and manual one-figure/no-layout checks. No crop, upscale or synthetic fade was presented as newly authored high-resolution animation.

## Engineering work completed
Added validate_sprite.py and test_validate_sprite.py. Six local assertions passed using synthetic file fixtures to check the validator, not the character's animation quality. File acceptance never sets runtime_ready true; manual identity, biomechanics, continuity, gameplay registration and render-content approval remain necessary.
Prepared an exact-source comparison review and an audit package with reference images, rejected attempts, validation measurements, hashes, script and tests. The visual review is made from actual reference crops, not generated completion graphics.

## Next remaining art task
One early-lift frame from exact K02: identical low pelvis and planted feet, face, costume, equipment and shotgun; only the required head/neck/shoulder/elbow/hand movement changes. The stock rises partway before shouldering. True transparent background, all anatomy visible, generous margins, no cover/floor/text/flash or additional figures. Validate that single frame before attempting stock approach, recoil or retraction.

## Storage and deployment boundary
This repository update contains the validator, tests and this report only. Image binaries and the complete audit package are to be saved to ChatGPT Library with separate confirmed receipts; they are NOT claimed committed to GitHub. No gameplay file, root HTML, approved sprite asset, movement setting or Vercel configuration is edited. No Vercel deployment or new playable build is requested or verified. No autonomous agents were launched.
