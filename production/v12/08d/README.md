# JADE V12 — Batch 08D: registered cover motion proof

## Delivery status
Completed as an isolated local input-controlled POSE REVIEW. NOT a new game build, finished animation family, or verified Vercel deployment. Zero new drawings. Three reused source poses. One view. No game movement or existing runtime file was edited.

Visual authority: approved large Idle/Ready sheet, SHA-256 fff8eeb8fcc3ef1ff3a830684c1ac5aac5f8f142cb3ed92283e8b6ec59d49e89.
Movement authority: v11.1 ba742b1019f80f3e2d71b166b32244c4ed686260.

Source: wide_clean_png_transparent_background_concept_art.png, 1944 x 809 RGBA, SHA-256 9d4668f5bf91cf23a4f6a3cf6878ae1347d84cd37ec56dd16ae8f6f234713a1c.
K01/K02/K03 native crops are 620x809, 640x809, 684x809. Pixels are unchanged from the source. They are not independent 1024x1536 HD masters. data.js records source rectangles, SHA-256 hashes and provisional foot/muzzle registration.

## What the review does
Loads the three actual PNGs, holds a candidate support-foot anchor across pose changes, independently shows/hides a cover fixture, offers previous/next, pause, slow playback, onion-skin comparison, and a separate muzzle-effect test. The timeline switches existing still poses; it does not create new in-betweens. Hold times are illustrative review timing, not v11.1 animation timing.
Keyboard: arrows step, Space play/pause, C cover, F effect. Synthetic standard-gamepad tests cover LB/RB stepping, A playback, LT aim and RT effect. These are review controls only; game controls are unchanged.

## Verification performed
16 automated checks passed in local headless Chromium 144.0.7559.96, including PNG decoding, canvas rendering, anchor consistency, independent cover layer, effect gating, keyboard stepping, timeline advance, pause, quarter-speed selection, synthetic standard-gamepad edges, and render-loop survival. No browser JavaScript errors were observed in the test.
The self-contained HTML was inserted into the browser document with Playwright set_content. This tested no hosted URL or file-URL navigation. Physical Xbox hardware was not tested.
An actual browser recording was exported as JADE_V12_Cover_Motion_Proof.mp4 (1440x1000 H.264, 15.64 seconds). This is pose-review footage, not gameplay footage.

## Five review responsibilities
IDENTITY: original artwork pixels retained; no redraw or outfit redesign.
BIOMECHANICS: final movement quality pending. Three held poses are insufficient.
CONTINUITY: gun-lift intermediate frames and authored recoil/retraction still required.
GAMEPLAY: anchor coordinates remain manually estimated candidates; no world-space collision/muzzle or v11.1 integration verified.
RENDER: alpha and decoding checked; K03 has alpha touching the outer crop boundary and is flagged for edge/margin inspection before promotion.
No separate autonomous agents were launched. Code checks do not establish five passed art gates.

## Honest batch accounting
08A: three extracted character-only review candidates.
08B: fire/recoil/retract concept illustration exists, clean runtime exports unverified.
08C: cover-shimmy/corner concept illustration exists, clean runtime exports unverified. Painted cover must not be baked into a character export.
08D: executable local registration/review tool and evidence, no new drawings or gameplay deployment.

## Saved-file boundary
This repository contains review.js, index.html, review.css, data.js and this report. The PNG binaries, approved reference copy, recording, asset verifier, test script, screenshots and self-contained HTML are delivered in JADE_V12_B08D_Motion_Proof.zip. This report does not claim those binary files have been committed here. index.html requires the package's assets folder to display Jade.

## Next smallest playable milestone
Complete and clean the same-view raise/recoil/retract frame set, measure its anchors, then bind ONLY that action to an isolated copy of the protected runtime. Keep the recovered character art for unsupported states. Verify inputs, loading, occlusion, muzzle path, restart and unchanged movement, then verify deployment. The remaining 360-degree library is not required to start this limited test. No calendar ETA is established yet.
