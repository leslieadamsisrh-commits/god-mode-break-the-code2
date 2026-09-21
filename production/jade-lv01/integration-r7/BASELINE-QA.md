# Sprite integration QA — B11 and R5

Read-only audit performed 2026-09-21. This is an intermediate engineering report, not an art approval or a browser certification.

## Inspected sources

- Original B11: `/workspace/scratch/213405134e9a/sprite-work/b11/JADE_V12_08N_B11_FAST_INTEGRATION`
- R5 standalone: `/workspace/scratch/213405134e9a/recovered/GOD_MODE_B11_Approved_Art_Test_R5.html`
- Extracted non-asset scripts for inspection: `r5_scripts_readonly.js`

## Verified

- `node --test tests/*.test.cjs` passed 40 Node subtests. This includes the inherited 3,600 mixed-input tick comparison between the browser duel wrapper and source duel, projectile damage, slide restrictions, cover attachment/kick, and local device routing.
- R5 embeds 20 scripts and 37,268,522 bytes total. The first script is the embedded image dictionary; it must not be dumped to logs.
- R5 simulation modules (core, action controller, motion flow, stance registration, slide gate, duel browser, local input) match original B11 after trimming script wrappers. R5 changes presentation, fixtures, and UI.
- Build tool `tools/build_standalone.py` embeds all files under `public/assets` as image data URLs, inlines stylesheet and all script sources referenced by `public/index.html`, and writes a standalone HTML file. It uses no network.
- Node Playwright package is installed. No installed Chromium, Firefox, or WebKit executable was found via Playwright; no `/usr/bin/chromium` and no Python Playwright package. No browser was started by this QA agent.

## Minimal integration hook

Use a new render-only module with records and a pure selector. Include it before `render.js` in `public/index.html`. Append its records to the renderer's AssetStore `records` and `pinned` arrays.

Within `render.js` `choose(actor)`, retain paused artwork inspection and B05's authored slide-contact selection at the top. Place candidate selection after those and before low-cover CE08 / B06 / K01–K03 selection. This allows new aim/fire candidates to appear instead of being shadowed by existing held poses. A generated slide sequence may give way to the original B05 contact art during the last 72 world units of an upward approach to the station, so report that as an intentional transition when judging all eight new slide frames.

- Run: `!cover && !cornerTravel && slide <= 0`, moving, use movement heading when aim is not held. Restrict to the authored right-facing sector. Avoid selecting forward run for strafe/backpedal intent. Distance-based playback via `flowDistance` preserves speed-independent foot rhythm.
- Slide: use `slideFacing`, with frame derived from `1 - clamp(slide, 0, .70)/.70`. Never wrap the slide sequence into a loop. Contact art may override late slide.
- Cover aim/fire/recover: select only the authored stance/view. For the current data, distinguish a right-corner pose from a middle-of-cover pose and free-space crouch. A low-held cover pose must not override aim/fire playback.
- New art should be labeled generated review candidates until user approves its exact appearance. Maintain the four verified R5 exports separately: CE05, CE03, CE08, B06B.
- Track frame selection and source files in renderer inspection for evidence. Selector must not mutate actors, collision, input, timer, projectile creation, or damage.
- Keep unsupported directions on recovered atlases; no mirroring, rotation, or invented direction completion.

## Existing limitations verified by pure runtime probes

See `mechanics-probes.json`.

1. **Forward fire cone is not enforced.** With aim 180° and lower body facing 0°, one tick rotates lowerAim to 5.25° and fires while the difference remains 174.75°. `TUNING.twistLimit = 145°` is used for gradual lower-body rotation; `firePlayer()` does not clamp or reject aim. This is inherited behavior; adding art does not fix it.
2. **Blocked shot attempts update `lastShot`.** A gun segment intersecting cover produces `blocked_muzzle`, updates cooldown timestamp, and produces no `shot` event. Do not animate successful recoil based solely on the timestamp.
3. **Free-space recoil does not persist.** Shot tick sets recoil to .16, then next action update clears it outside `Core.supported()`. Successful shot events are the reliable trigger for renderer-owned fire/recover timing.
4. **Action controller support is narrow.** K01–K03 raise/recoil states are supported only at station south face, right edge, aim within ±.34 radians. Other states interrupt that controller.
5. **Firing sockets do not follow new art automatically.** Existing sockets use manually registered K01–K03 pixels at the supported corner, or generic 7/30-world-unit breech/muzzle offsets with z78 (z38 sliding). A candidate image's barrel can therefore differ from actual projectile origin. Per-frame muzzle and breech registration must be calibrated before claiming muzzle-accurate firing for new candidates.
6. **Body articulation is whole-sprite selection.** Existing `lowerAim` is not an independent lower-body render layer. New full-body sheets do not implement separate hips/torso/arms.
7. **This recovered runtime is a local couch shotgun duel.** Keyboard + pad or two pads, 2/3/5-minute rounds, cover/slide/wrap/shotgun. It does not contain the broader battery-powered psychic mechanics, online lobby, or active bots.

## Baseline coverage

Recovered lower-detail art has ready/cover/run/slide records for all 24 nominal directions. Run and slide d03 point to legacy `run.webp` and `slide.webp`. Backpedal and each strafe family have only four directional records. Metadata lists 156 recovered cover frames, 24 ready frames, 360 run frames, 300 slide frames, and 48 frames per backpedal/strafe family. These counts are metadata slots, not claims that every drawing has passed anatomical or directional QA.

R5 verified high-detail coverage is four individual exports in one authored viewing angle, not four complete animations. Existing K01–K03 and recovered art maintain playability in other actions. Optional R3 candidates are explicitly unapproved. New right-facing sheets should expand the truthful coverage ledger by actual unique frame count and supported action/view only.

## Focused verification for the integration owner

1. All candidate files decode and dimensions match their records; no off-canvas clipping at frame rectangles.
2. All eight run frames appear over one actual rightward movement cycle; stopping resolves to the intended ready frame; left/up/down movement keeps their own fallback art.
3. All applicable slide frames appear monotonically once, then return to ready/run or transition through CE05 → CE03 → CE08 on cover contact.
4. Candidate aim/fire/recover is reached while real shots still create seven pellets and preserve .48-second cooldown and damage. A blocked muzzle attempt must not count as a successful shot animation.
5. Both players have independent animation phase/event tracking. A shot or movement by P1 must not trigger P2's candidate frame.
6. Turning beyond the authored sector restores recovered art without an empty frame. Candidate records must be resident before toggling them on.
7. Cover draw sorting still fully occludes characters behind it; foreground characters remain visible. X-ray remains an optional inspection toggle only.
8. Compare same deterministic input sequence before/after integration: simulation snapshots (positions, velocity, cover, shots, damage, scores) should match for a render-only update.
9. Inspect candidate edges and foot registration over black, white, gray, magenta, cyan, and game-floor backgrounds. Real visual review is required; selector tests cannot certify alpha edges or anatomy.

No original checkout files were modified by this QA agent. No browser, physical controller, deployed-site, or art-approval claim is made.
