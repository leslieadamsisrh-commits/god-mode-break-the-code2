# V12 Batch 08A — source extraction review

## Authorities unchanged
Movement authority: v11.1 / ba742b10. Visual authority: JADE-FINAL-VISUAL-LOCK.md. This report does not change gameplay or reinterpret the approved character.

## Verified work in this pass
The user endorsed the three-pose character-only source illustration. Its actual source is `wide_clean_png_transparent_background_concept_art.png`, 1944 x 809 RGBA, SHA-256 `9d4668f5bf91cf23a4f6a3cf6878ae1347d84cd37ec56dd16ae8f6f234713a1c`.

Three individual PNG review candidates were extracted at native pixel resolution:
- K01 Corner stop: 620 x 809, source rectangle [0,0,620,809].
- K02 Head check: 640 x 809, source rectangle [620,0,1260,809].
- K03 Shoulder clear / aim: 684 x 809, source rectangle [1260,0,1944,809].

Three padded review canvases were also created at 768 x 896. The original artwork pixels were verified unchanged inside each canvas. Padding does not create higher resolution or additional detail. These are NOT three independent 1024 x 1536 HD masters.

Deliverable: `JADE_V12_B08A_Review_Package.zip`, containing original source, three native crops, three padded review candidates, factual contact sheet, manifest/hashes, extraction script, README and local pose-stepping HTML viewer. ZIP integrity check passed (12 files). The package is delivered in the chat workspace; this commit records the report only and does not claim the image binaries are present in GitHub or Vercel.

## Gate status
- Visual direction: user endorsed source appearance; detailed production identity QA still required.
- File extraction: three PNG candidates verified; no rescaling or repainting.
- Separation: no cover/environment/HUD baked into the character candidates.
- Transparency: RGBA confirmed with transparent pixels; some low-alpha pixels reach source-panel edges and require a final matte review. Do not certify clean runtime alpha solely from RGBA mode.
- Registration: provisional visual placement only; feet, root, pelvis, hands, muzzle and cover-contact sockets are not measured or validated.
- Animation continuity: pending; the K02 to K03 gun lift needs intermediate-frame/timing review.
- Directions: one view represented; 24 directions remain a production target.
- Gameplay integration: not performed in this pass.
- Deployment: not performed or verified in this pass.

## Shortest path to the first final-design in-game sample
1. Complete the same-view source loop: muzzle presentation, recoil and retract (08B), then add only the in-betweens required by preview.
2. Register the frames and test them with a separately drawn barrier, unchanged movement timings, input-triggered animation and no auto-loop affecting gameplay.
3. Package a small runtime subset on an isolated test route; verify asset decoding, frame selection, occlusion, muzzle position, input and restart, then verify deployment before calling it playable.

This is a planning sequence, not a calendar promise. Full 360 library duration cannot be estimated reliably until a complete family has measured production/review throughput. Five named review responsibilities are not evidence of five executing agents.
