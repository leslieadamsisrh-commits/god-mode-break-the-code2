# V12 08M — Same-computer Couch Art Lab

## User direction and decision
The user wants to play beside another person on the same computer, judge combat and appearance, and prioritize missing sprites instead of expanding Internet networking. Same-computer play is not the same as two-computer LAN play. This build uses one browser, one local simulation and two independent input seats. No network transport, match service, Node installation, login, invitation, hosting or Internet connection is required by the standalone HTML. Preserve 08L networking for later; do not keep expanding it before the first final-design action is authored.

## Implemented
The existing 08L Duel methods execute in the browser via a dependency/export wrapper. The underlying K movement, stance, cover, shot/damage and slide-retrigger guard are reused. Added a local controller with P1 keyboard/mouse + P2 controller, or two controllers; explicit controller swapping; shared fixed-arena camera; P1/P2 labels; pause/resume, focus-loss/disconnect pause and neutral rearm; round lengths 2/3/5 minutes; score and rematch; and exportable local playtest inputs.

Devices bind by actual Gamepad indices. A new device does not silently steal a disconnected seat. Missing assigned hardware pauses; an initially unassigned seat remains idle and is identified in the UI, not controlled by an AI bot. Keyboard motion is ignored in two-controller mode. Names, ground rings and health UI identify players without recoloring or redesigning Jade.

Art inspection can set up final Jade at the supported corner, hide separate cover artwork, use diagnostic X-ray and change inspection zoom. These visibility controls do not disable collision. The fit-arena shared-camera zoom is not a new approval of final on-screen character size. Source scale and pixels are unchanged.

## Art and scope boundary
All 115 images are byte-identical to 08L: 108 recovered atlases, three existing final-design corner poses and four prior optional source-pixel studies. Twelve recorded source/vendor files are unchanged, including the original 08L Duel source. ZERO new drawings, rigged body parts, authored recoil or 360 final-design coverage. Other movement/views remain recovered art. The plain test arena is not final environment art. No multiplayer hosting, source skin alteration or original protected-runtime overwrite occurred.

The local simulation wrapper was reconstructed and tested again before delivery; the standalone file matched the prior local build SHA-256 exactly. This is not a claim that it has been hand-played on the user's computer.

## Verification
27 Node subtests passed: 18 inherited slide/match tests plus nine input/wrapper checks. Local browser Duel and original 08L CommonJS Duel snapshots agreed through 3,600 paired input ticks. This is regression coverage, not proof of all interactions.

22 browser checks passed in headless Chromium with the exact offline HTML executed via Playwright set_content. Actual local simulation and DOM keyboard/mouse controls were exercised; two controllers were simulated through Gamepad API values. No network transport was used or mocked. Checks included independent/simultaneous movement, seat binding, keyboard exclusion in two-pad mode, disconnect/focus pause, actual local shots and opponent damage, round/winner/score/rematch, final-Jade art fixture, separate cover visibility and 96 two-actor heading changes with zero missing-image draws. No observed page errors or external HTTP requests. Physical Xbox devices, user-PC performance and end-user file navigation remain unverified.

115 image integrity/dimension checks and twelve baseline-file checks passed. Automated local tests were used, not autonomous AI artists. Screenshots are actual renders; the final-Jade screenshot is a controlled art fixture, not a human match or network session. No video was produced for 08M.

## Play instructions
Download/open JADE_V12_08M_Couch_Art_Lab.html in a desktop browser. Connect controllers, press a face button on each, release action buttons, select the control mode and click Start / rematch. No .cmd launcher or server setup for this version.
Controller: LS move, RS aim, LT aim hold, RT fire, A slide/kick, B wrap, X attach/detach, Menu pause. Keyboard: WASD, mouse, RMB aim, LMB fire, Shift slide/kick, Space wrap, E attach/detach; P pause/resume; Enter rematch. Resume rebinds devices after releasing actions. The previous slide-spam guard remains.

## Art-first handoff
Freeze local feature scope except blocking defects. Next deliver one genuinely authored character-only shoulder/stock-lift transition between the exact approved K02 and K03 references, with full body, transparent margins and no cover, floor, labels or presentation layout. Maintain the pinned final design SHA-256 fff8eeb8fcc3ef1ff3a830684c1ac5aac5f8f142cb3ed92283e8b6ec59d49e89. Check face/helmet/equipment identity, two-hand grip, elbow reach, head/stock alignment and deliberate lower-body contacts.

After one usable candidate passes, produce a small adjacent group, then actual recoil, recovery and deliberate retraction. Export real files/layers, measured anchors/sockets, timing definitions, dimensions/hashes and a factual contact sheet. Test the exported sequence inside this same local interaction. Image warps, upscales and decorated posters are not new authored anatomy. Five quality responsibilities remain identity, biomechanics, continuity, gameplay and rendering.

Then expand opposite cover side, neighboring views and connected run/slide/contact/shimmy/wrap/exit families. Local feel/art checks do not replace future online latency/security testing. Do not claim the final-design duel or game is complete before supported action/view coverage is replaced consistently. Final-art production is the next priority, not a completed deliverable in this pass.

## Persistence confirmed
Library folder: /GOD MODE/V12/08M/Couch Art Lab/
- JADE_V12_08M_Couch_Art_Lab.html — 20,798,521 bytes; SHA-256 b64a71bf3cd51a7635d5359416b10c1952557f924dc331705fc09b784debe562; library_file_id libfile_c3f4c40535308191bf0e5fef7e8c91c5; upload succeeded.
- JADE_V12_08M_Couch_Art_Lab.zip — 31,609,340 bytes; 150 files; SHA-256 859c8af3c17837bf2069a3aefedcad9158e1a985a76b6acef15fc8f157f76068; library_file_id libfile_8008a5565500819186a0b794211fc642; upload succeeded; ZIP integrity passed.
- JADE_V12_08M_Actual_Preview.png — 151,696 bytes; SHA-256 d1c1a326052c2405b34a958cd98e64aaba9ebb0e57ccf5f5e20c684028f9d82e; library_file_id libfile_64ce0a804c4c819183de302804b82c17; upload succeeded.

The ZIP contains the actual standalone HTML, modular application, unchanged images/vendor modules, source Duel, tests/results, README, art-first handoff, screenshots, packager and per-file fingerprints. The GitHub branch v12-08m-couch-art-lab stores local-input.js (c83c42e629d8526a0b0069971f867b1e21c36206), couch.js (79691921f6c2f6527513eef9ca5a388c2cee45a6), restore_08m.py (4db72827633f90372219965bea7660b02082833f) and this report. The repository subset alone is not the complete executable game; use the verified full package. Binary assets are saved in Library/package, not claimed installed into a GitHub runtime or Vercel. No new public deployment or automatic background production is claimed.
