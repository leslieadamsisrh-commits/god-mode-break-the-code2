# V12 08J — Continuous Character Display

## Delivered scope
Local playable Training Lab update on exact 08I. Repairs the decoded-image residency/fallback gap found during the user's playtest. Zero new drawings. No redesign, collider change or physics tuning. The final-design 360 library remains unfinished.

## Implemented
All 24 recovered ready views, three final-design source poses and four old optional lift studies are pinned and decoded before gameplay begins. Dynamic atlases retain a 12-image LRU budget; the active drawable is protected. Loading is limited to four concurrent jobs, with bounded neighbor prefetch below actual demand priority.
A pending atlas uses the resident same-direction ready pose. A defensive retained-drawable fallback is also available. The interface and frame trace distinguish requested and displayed files; temporary art is not labeled as the requested action. Replacement occurs only after usable decoding and dimension validation. Broken images and timeouts are explicit errors and pause the test; stale frame labels are cleared instead of silently reporting an older asset. There is no automatic infinite retry for failed files.

## Protected work and art limits
core.js, action-controller.js, motion-flow.js, cover-router.js, both cover metadata files, assets.js and asset-manifest.json remain byte-identical to 08I. All 115 images are byte-identical: 108 recovered atlases, three final-design poses and four existing deformation studies. Original combat-lab-system08 and v11.1 are untouched. Cover and effects are not baked into Jade.
Ready fallback can visibly differ from the requested action while decoding; this repair does not eliminate every visual pop. Final-design coverage is still one supported right-hand corner view. Full shoulder raise, authored recoil/retraction, HD locomotion, 24-view coverage, matte cleanup and cross-family body registration are pending. No new anatomy or independently rigged body layers are claimed.

## Final reconstructed-package tests
117 Node assertions passed: 101 inherited simulation/action/flow/router checks plus 16 controlled asset-store tests. Five automated verification lanes ran concurrently; no autonomous AI agents were launched. Five inherited identity checks and integrity/decoding checks for 115 images passed. Extra byte comparisons verified unchanged routing and metadata.
31 browser checks passed in headless Chromium 144.0.7559.96. Exact standalone HTML ran through Playwright set_content because file-URL navigation was blocked by environment policy. DOM and synthetic-controller inputs were tested. No physical Xbox, hosted URL, user-PC performance or successful file-navigation test is claimed.

In this rerun, old 08I produced 25 no-image draws across 96 rapid cover-heading revisits. New 08J produced zero across the same 96-request diagnostic, plus zero across 96 run/slide/ready/strafe changes. Asynchronous diagnostic counts vary by run; these are not percentages of user gameplay or a replay of their exact inputs.
Four scenarios totaling 2,400 input ticks produced identical simulation snapshots, gameplay events, shots, effects and input records between 08I and 08J. No page JavaScript errors or external HTTP dependency were observed in the normal standalone session. An intentionally corrupted dynamic image in browser memory generated one explicit error while retaining a resident ready pose. Delivered image bytes were not corrupted. These checks are measured coverage, not all-case or final-art certification.

## Actual visual evidence
JADE_V12_08J_Playable_Demo.mp4: eight seconds, 120 browser screenshots at 15 fps, 1440x1000 H.264. Scripted inputs advance four fixed simulation ticks per displayed frame. Shows held-key final Jade, headings, corner wrap/return and slide approach. Not hand-played footage, newly drawn animation or a real-time performance benchmark.
JADE_V12_08J_Actual_Preview.png: actual screenshot of unchanged Jade and the asset-status panel.

## Recovery and storage boundary
Branch v12-08j-continuous-character is based on 08I review checkpoint 03b2639e1fb1a1943358718c2211284f9b153b67.
GitHub stores asset-residency.js (475b748270e1ca0bd0b16f91f954d17e96051020), source-edits.json (6be76767ebad62a827bf07c1d1afcea25ec799d9), assemble_08j.py (3388364e45c9f495bc0a7fd90c1fc1cfa001088f), this report and subsequent receipts. The module and recipe Git blobs match the local tested bytes. The assembler was executed against exact 08I and reproduced the tested files byte-for-byte in a new folder.
Complete assembled application, images, tests, evidence and capture script are in the delivered ZIP. The standalone HTML embeds the images. Library backup is confirmed separately by upload receipts. These text commits do not assert image/video binaries are installed in the GitHub runtime. Vercel Git auto-deploy remains disabled; no new public release or hosted URL is claimed.

## Endpoint gates
1. Validate uninterrupted display on the user's machine. This is a loader repair, not finished animation.
2. Reconcile pelvis, both feet, world root and screen scale across sources without retuning collision to conceal mismatches.
3. Author one complete final-design shotgun cover action: low ready, shoulder/stock raise, aim, recoil, recovery and retract. Use genuine character-only frames or properly prepared layers, tested in this same input-driven interaction. A small image warp cannot produce missing anatomy.
4. Expand validated final-design idle/run/slide/cover/shimmy/wrap across the 24-view action matrix and replace recovered artwork deliberately. Limited tests do not have to wait for every direction.
5. Finish the playable Training Lab slice with combat pressure, weapon and psychic interactions. Package actual binaries into a deployable repository and verify private access before sharing a hosted link. Story/maps/multiplayer remain later scope, not completed work.
No reliable calendar ETA is established for the full art library: a complete final-design action family has not yet demonstrated production throughput.
