# V12 08N — local inspection update; new-art quality hold

## Scope and actual result
Continued from exact 08M ZIP SHA-256 859c8af3c17837bf2069a3aefedcad9158e1a985a76b6acef15fc8f157f76068 and branch review b9f4016ef6c59f7b3a084db84dc7560d9147a140. Added explicit P1/P2 inspection setup and a controlled line-of-fire fixture. Attempted the requested new reference-bound shoulder-lift drawing twice; both image outputs failed and were rejected. ZERO accepted new animation drawings. No new art is installed or certified by this batch.

## Installed in the local downloadable build
The open Art inspection panel selects Controller seat, Player 1 or Player 2. Controller seat means P2 in keyboard-plus-pad mode and P1 in two-pad mode. Existing device assignments are not silently changed. Setup moves the selected actor to the supported corner, resets the current round, and pauses. Resume keeps the fixture; Start returns to normal round spawns.
The clear-shot button sets two full-health stationary actors on an unobstructed horizontal firing line. In the browser test P2's single synthetic RT input generated one shot and damaged P1. This verifies a controlled case; it neither replays nor explains every zero-hit shot in the user's earlier video.
No movement tuning, damage, collision, slide restrictions, networking, character pixels, stance scale or cover-selector changes. All 115 runtime image files and 12 baseline support files retain exact 08M hashes. The render.js edit changes only the version footer. Source image size, game scale and camera magnification remain distinct.

## Tests actually run
27 inherited Node subtests and 7 new fixture subtests passed. The 22 inherited browser checks and 13 targeted fixture/browser checks passed against the final standalone build, in Chromium 144.0.7559.96 via Playwright set_content. Tests use actual local duel logic, native DOM events and synthetic Gamepad values. No mocked network transport or external HTTP request was needed. No page JavaScript errors were observed.
Targeted cases include P2 default, explicit P1, preserved device index assignment, P2 LT aim selecting existing K03, clear-shot damage, one shot event from one trigger, fixture pause and normal-spawn reset. Physical controllers, user-PC performance and end-user file navigation remain unverified. Five automated technical processes were launched concurrently; no autonomous AI agents/artists were launched.

## Art quality hold — do not trust text printed in generated images
Both attempts were requested as ONE complete transparent character-only K02-to-K03 intermediate lift preserving the exact approved face, cat-ear helmet, tactical trousers, asymmetric white coat, equipment and low stance. Both returned multi-panel presentation layouts with incorrect character design and false completion/installation claims. Neither was accepted, sliced into runtime art, embedded, or deployed.
Attempt 1: 1536x1024 RGBA; SHA-256 b4521295df0b7ef737ba6c1f8dacc72aa6182771d80785a15d621b372dee89c4; alpha 0..253, only 10 fully transparent pixels.
Attempt 2: 1536x1024 RGBA; SHA-256 baa31235c0355d09118e7e0084afecb56b48fb7dacc742875f237d9324eaf07a; alpha 13..251, zero fully transparent pixels.
The package isolates them in art-review/REJECTED_attempt_*.png with QA-RESULTS.json. They are evidence of failed attempts, not the new visual authority. The existing final-design reference remains unchanged. Full shoulder raise, drawn recoil/retract and HD locomotion/360 coverage remain unfinished. No extra skeleton or networking work is needed to start solving that single drawing.

## Confirmed delivery and backups
Library directory: /GOD MODE/V12/08N/Art First Quality Hold/
- JADE_V12_08N_Couch_Art_Lab.html: 20,801,071 bytes; SHA-256 17a8f6c095e84d2a313b1e4947f45775440ef83892bb6fef905ea8ab4f168905; library_file_id libfile_9d8b684c2c448191b75557af6c7a4391; upload succeeded.
- JADE_V12_08N_Art_First.zip: 37,598,085 bytes; SHA-256 7cf499e151a3bd33d997193c7906e9d3bb3061b2249235be5e1b8acbfe5be0ca; 164 files, ZIP integrity checked; library_file_id libfile_b792d184632881918660b7b884519ed8; upload succeeded.
- JADE_V12_08N_Actual_Preview.png: 160,400 bytes; SHA-256 ed8201ec49cbb1f62e49b013a75431a7128a518f9b3b9e778977f9657f999c1d; library_file_id libfile_4def8a4a68bc819193080f1173fd8f8a; upload succeeded.
- JADE_V12_08N_DELIVERY_MANIFEST.json: library_file_id libfile_dbd493ff20208191907a11a1ad484ab7; upload succeeded.
The preview is an actual local renderer capture of the P2 inspection fixture using unchanged K03. It is not a new drawing or two-human/network-play proof. No new video was produced.

GitHub stores fixture-setup.js (55a06a9f39d9e422d46ca178b87493fb38948a69), the exact-package restore script (45b65daaffa28b5ff7ecfcc28e564bee7c07f05b), and this report on v12-08n-art-first. The complete modified application, source/vendor files, images, tests and art audit are in the verified ZIP/Library. Those binaries are not asserted installed into a GitHub runtime directory. The previous build is untouched; no Vercel or public deployment was made. No work is claimed to be running automatically after this response.
