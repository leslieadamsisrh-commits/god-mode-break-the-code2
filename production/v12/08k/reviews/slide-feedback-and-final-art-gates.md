# V12 — slide feedback and bounded final-art handoff

Status: USER FEEDBACK + PROPOSED NEXT WORK. This record is not a new game build or completed art batch.

## Latest user feedback
The user reports that the slide feels good and asks to stop slide spam. They ask how many further playtests are needed and what remains before final-design artwork can be produced and applied. Preserve the approved Jade appearance and large-character presentation target. This is positive feedback on slide feel, not approval of every mechanic, anatomical landmark, timing experiment or final animation.

## Source check performed
Inspected the actual delivered JADE_V12_08K_Stance_Registration.zip.
- core.js SHA-256: 8be1b47d9515cbf9418c063bc2caf3879e11d1a8177ba08c360ee64bde65da48.
- app.js SHA-256: b2b0e2f191d44a838426239f885adbafaa557a0a559a62205c0f17a22071808a.
In freeMotion, input.slide with movement and no cover sets slide to .70 and velocity to direction * 650. This condition does not exclude an already active slide. app.js normally generates slide on Shift/button-A press edges, not continuously from a held button. Repeated presses can therefore restart the active slide in this path. This is a source-inspection finding, not a new replay of the user's inputs or a deployed correction.

## Next engineering scope: trigger eligibility, not a slide redesign
Proposed implementation:
- Keep the currently liked initial velocity, decay, travel feel and low-slide presentation as the reference; do not slow the whole action as the first anti-spam fix.
- Reject a new slide start while a slide is active; rejected presses must not reset duration or velocity.
- Require a fresh release/press to rearm; do not queue an arbitrary backlog of taps or resume into a held-button auto-slide after focus changes.
- Give recovery/re-entry an explicit rule. Begin with action-state gating; only add a short separately tuned recovery lockout if rapid chaining after slide completion remains excessive.
- Keep slide-to-cover, cover kick and deliberate wrap as separate contextual decisions. Do not apply a broad lockout that traps the player against cover or suppresses an intentional exit.
- Continue accepting legal aim, fire and movement interrupts according to the action's defined rules; do not invent a new firing delay to fit drawings.
- Test noisy presses, held input, alternating inputs, slide contact, kick, focus pause, reset and immediate re-aim. Future authoritative multiplayer simulation must enforce the same eligibility rules; a client-only guard is not sufficient.
No guard or lockout is installed by this document.

## Three planned user review passes for this limited slice
These are proposed review goals, not a guarantee of shipping after three recordings. Each should take roughly 5–10 minutes of user playtime; that does not estimate implementation or artwork-production time. Repeat only a failed focused case rather than restarting the entire review process.
1. Slide eligibility and exit flow: cannot extend the slide by mashing; a normal single slide still feels right; cover entry and deliberate exit remain responsive.
2. Stance/contact and action interruption: compare the registration candidate at fixed camera scale; no unexplained root/foot teleport; gun clearance and input response are legible. Missing drawings remain distinguishable from placement errors. This is sufficient to lock a provisional animation-production contract, not complete all anatomy.
3. One genuinely authored final-design cover-fire loop: play low ready -> raise -> aim -> fire/recoil -> recover -> retract, including early release and immediate exit. This pass happens once the needed character-only art exists and is integrated.
Art preparation and first missing-pose production should overlap passes 1–2; do not make the complete sprite library wait for all gameplay systems to be perfect. Automated technical regressions remain separate from the user's feel/art reviews. Multiplayer testing is a separate later set of checks.

## Final-art production handoff
Preserve combat-lab/JADE-FINAL-VISUAL-LOCK.md and its pinned approved image. Appearance, equipment side, proportions, rendering style and approved large-character target remain unchanged. Source dimensions, review-sheet scale, camera zoom and collision size are not interchangeable.
Record an action manifest containing state transitions, event/cancel rules, source-view convention, anchor contract, pose roles, foot/pelvis/hand/grip/muzzle/contact sockets, and timing taken from the chosen playable reference. Do not silently resolve the established 145-degree interpretation differently while producing art.
First deliver one missing single-view character-only transition drawing from the approved reference, then a small adjacent-pose batch. Target the shoulder/stock bridge between existing K02 and K03, followed by actual recoil/recovery/retraction. Keep the lower-body contacts consistent where the action calls for planted feet; author deliberate weight transfer where necessary.
Produce separate usable images or properly prepared animation layers, not another decorated progress poster. Reject identity drift, absent feet, scenery baked into the character, invalid alpha, wrong equipment side, registration errors and impossible hand/weapon continuity. Small deformation studies do not count as newly authored anatomy. An increased pixel canvas alone does not add detail.
Package accepted candidates with transparent image files, actual source dimensions, hashes, metadata, code-side animation definitions and a factual contact sheet derived from the delivered files. Test those same exports in the Training Lab. Five review responsibilities remain identity, biomechanics, continuity, gameplay and rendering; do not label them five autonomous workers unless actually invoked.
Once the one-view loop passes, expand to the opposite cover side and neighboring views, then final-design run/start/stop, slide/contact, shimmy/wrap/exit families and the remaining 24-view matrix. Existing source poses are references and candidates; only already-qualified frames can be reused without correction. Do not assign an invented percentage complete or a fixed final frame total before timing/coverage is settled.

## Parallel multiplayer milestone
A private mixed-art two-player duel does not have to wait for the entire final-design library. The 08K assessment identifies recovered networking client code, but no compatible verified match service or two-human version of this local simulation. Proposed next networking proof remains two independent clients joining, moving, firing, agreeing on damage, ending a round and rematching; then an actual two-computer test with private access. This plan does not imply a server is running or authorize public release.

## Change boundary
Only this feedback/plan file is saved. No artwork, game source, source-frame approval, collision, cooldown, controls, or deployment configuration is changed. No new drawings, automated tests, autonomous agents, game build or Vercel deployment are claimed in this pass.
