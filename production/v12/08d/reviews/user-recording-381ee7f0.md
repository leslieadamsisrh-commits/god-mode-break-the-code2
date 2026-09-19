# Jade V12 — user pose-review recording, 2026-09-19

## Source and method
User-supplied video: 381ee7f0-df38-4e7b-b030-3ff44e8fe85d.mp4.
SHA-256: b2f4fbf24c56d856d8adcc068084bc470d64f93f7361400d324f049c48065b8d.
Duration: 141.166633 seconds; 1902 x 972; 30 fps.
Inspected 24 samples across the recording at six-second intervals and 20 half-second samples of the opening transitions. This is sampled visual review, not a claim of frame-by-frame inspection of the entire recording.
The audio measured mean/max -91 dB; no usable spoken commentary was identified. No subjective complaint or approval is inferred from the silent footage.

## Observed in the recording
- The browser opens downloaded JADE_V12_Cover_Motion_Proof.html. This is local pose-review evidence, not a verified Vercel game deployment.
- Jade renders and repeated pose changes are visible near the start, middle and end. No black-screen failure is evident in the inspected samples.
- K01 CORNER STOP, K02 HEAD CHECK and K03 SHOULDER CLEAR / AIM appear repeatedly. Representative comparison frames: 00:18 K01, 00:24 K02, 00:12 K03.
- Low weapon hold to shouldered aim occurs as a discrete pose switch in the sampled opening. Intermediate body and weapon motion is not shown.
- The large semi-transparent cover fixture obscures pelvis, knees and support-foot detail, limiting weight-transfer review.
- The candidate support marker stays fixed; this does not establish that both feet and the pelvis have anatomically correct contacts.
- The recording does not show running, standing-to-crouch drop, baseball slide into cover, true shimmy, enemies or projectile collision.

## Corroboration from the delivered package
JADE_V12_B08D_Motion_Proof.zip contains three reused character-only PNGs and one view, with zero new drawings. review.js holds poses in the sequence [0,1,2,2,1,0]. Missing between-pose motion is therefore expected from this viewer; it is not evidence that more processing power would produce the missing drawings.
Anchors are provisional. Cover and the test muzzle effect are separate layers. The fixture clearance check does not validate world-space collision.
The repository README for 08D also distinguishes this review from gameplay integration.

## Next production priorities — not marked complete
1. Preserve approved Jade identity and v11.1 movement. No skeleton rebuild or identity redesign.
2. Produce character-only intermediate gun-lift drawings between K02 and K03. Keep the support leg and pelvis consistent while head, shoulders, elbows, wrists and weapon articulate.
3. Produce real recoil and intentional retraction drawings. Reversing the existing poses is a review placeholder, not authored recoil.
4. Inspect an unobscured body view beside a synchronized separate-cover view; validate contacts before relying on a full-opacity cover composite.
5. Test the completed limited action on an isolated copy of the working game, retaining recovered art for unsupported motions/views.

## Storage/change boundary
Only this report is committed by this update. The uploaded recording and local comparison image JADE_V12_User_Video_Review.png are not claimed committed here. Comparison-image SHA-256: 7353148c3ca36a8ef02bb62995632981a70fee0668c1f1bd2b47588634729947.
No artwork, gameplay code, movement settings or deployment configuration was changed. No final animation gate or new production batch is marked complete. No autonomous agents were launched.
