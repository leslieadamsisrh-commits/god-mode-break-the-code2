# R7 native Canvas QA — final

**25 checks passed; 0 failed.** Test harness: `native-qa.cjs`. Evidence: `native-qa.json`. Exact verified production files: `verified-source-hashes.json`.

This pass executed actual R7 source modules, actual PNG/WebP image decoding, real Canvas 2D drawing through @napi-rs/canvas, and the actual local duel simulation. No browser was launched. Browser DOM events, physical controllers, end-user file navigation, and host performance are not certified by this pass.

## Verified behavior

- All 24 candidate frames decode and render; all 24 inspection choices select the intended source frame.
- Rightward motion selects all eight run poses. Unsupported headings, strafing, backpedaling, wraps, and hit reactions retain fallback art.
- The actual rightward slide and braking trajectory reaches all eight slide phases with no unintended run frame inserted during recovery.
- Cover idle reaches the three ready/weight-shift variants (1, 7, 8).
- A real successful shot at the supported right corner triggers recoil and recovery. A real blocked-muzzle attempt does not trigger them. Player 1 shots do not animate Player 2 recoil.
- Candidate observation/selection does not mutate the actor. Rendering does not mutate the authoritative simulation snapshot.
- Disabling candidates restores original art. Free-space aiming retains baseline fallback art and avoids the extreme candidate shrinking found in the first pass.
- Candidate aimed and hip-fire recoil muzzle landmarks align with the actual authoritative stance socket at the supported right corner, within the two-pixel check (observed error zero).
- Static inspection confirms Play new sprite test enables candidates; Play approved cover art disables them; enabling the optional R3 comparison disables R7 candidates. Native renderer toggle behavior is tested; browser button events are not.

## Visual review

Reviewed final `contact-dark.png` and `contact-magenta.png`: all 24 full silhouettes are visible. The earlier diagonal slide cutoffs and large enclosed green background patches are resolved. No obvious neighboring-character bleed appears in the contact sheets.

All 24 frames contain zero strong low-blue green matte pixels under the quantitative check. A broader green-dominance count still finds 3–43 high-blue colored pixels per frame. These are intentionally preserved colored art rather than near-pure green backdrop. The thin warm-colored hair/edge fringe remains a visual limitation; native transparent masters and final art approval are pending. Do not call this final alpha production art.

Rendered scene evidence:

- `scene-free-ready.png`
- `scene-run.png`
- `scene-slide.png`
- `scene-cover-aim.png`
- `scene-hip-fire.png`

## Scope

The 24 new frames remain review candidates for one authored right-facing view. Aim/fire/recover candidates are restricted to the existing supported station right corner. Other views and unsupported weapon states retain existing art. Horizontal stance registration and cross-family scale continuity remain provisional; exact muzzle alignment is not a full-body rig or foot-contact certification.

The underlying inherited mechanics limitations documented in `../SPRITE_INTEGRATION_QA.md` remain outside this presentation pass, including the unenforced requested forward-fire cone and the absence of the broader psychic combat systems in this recovered local shotgun duel.

No production source was modified by the QA agent. Root applied the defects reported during this audit; this final pass verifies those changes.
