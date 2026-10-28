# Build 28 candidate — foundation checkpoint

## Geometry
User approved left/right orientation. World remains 2200 × 1100; playable bounds x103–2097/y118–1008. Standing body reference 63.96, platform height128. West terrace x103–383/y203–923; east x1817–2097/y203–923. Each top280×720. Four stairs180×200: west x383–563, east x1637–1817, y243–443 and683–883. Physical ramps retain smooth traversal; visual division lines indicate stairs. Flat center between x563 and1637. Spawn positions700,563 and1500,563. Floor panels160×104. Six starting cover placements, stable IDs retained.

`arenaFoundation28.ts` separates measured layout and cosmetic theme. Existing trusted cover catalog remains authoritative. Existing game state owns damage/fragments; saved layouts remain separate. `build28-layout.json` contains the comparison and active geometry. No automatic randomization.

## Corrections
Shared surface definitions feed support, structure walls, projectile tests, renderer and builder validation. Removed obsolete fallback decorative architecture that could imply nonexistent traversal. Corrected wall ejection at arena boundaries: choose an in-bounds resolution instead of pushing a fighter outside. Updated stair rendering for X-axis ascent. Floor uses one affine projection instead of hundreds of clipped full-floor draws. Projection round-trip and constant Jacobian checks pass; no position-dependent distortion reproduced in those numerical tests. Browser/iPad acceptance remains outstanding.

Section fragments use source mass times remaining section fraction in carry/throw response and impact. This changes fragment physics/damage proportionally; weapon damage and battery constants are unchanged. Rip line-of-sight now checks cover at actual height. Existing conservative cross-height eligibility remains. Section rendering has source-registered joints and fasteners which remain aligned on detached pieces.

## Assets and presentation
Verified existing concrete and floor atlases in native rendering. Retrieved existing architecture, industrial, props, skyline, destruction and concrete-corrections atlases from preview; no replacement binary assets. No production Baron asset or reaction animation was found. Conversation reference sheets provide visual guidance but were not retrieved as individual source files in this run. No claimed recovery of new sprites. New floor is code-rendered, with restrained panels, grates, spawn accents and orange perimeter fixtures. Platform material palette is shared with floor theme.

## Validation
Baseline production build and 27I/27J regressions passed. Final production build passed. Build25,26,27A,27B adapter/integration,27C,27D,27E,27F,27G,27H,27I,27J,28 foundation: 14 scripts passed. Old north/south fixtures were updated to exercise the same stair/wall/shot assertions on approved side terraces. New tests check boundary wall resolution, projection, saved-layout preservation and Chase placement validity.

Two independent authenticated HTTP clients passed rip ownership/section state, persistent hold and intact rematch restoration. These are API tests, not browser playtests. Legacy historical HTTP suites retain their original geometry fixtures; build28-http exercises the candidate.

Native actual Game renderer audit: six positions, one existing approved ready pose reused for direction, concrete/floor atlases only. Warm30 samples p50 46.92ms/p95 76.26ms/max80.22ms. Not browser pacing or FPS. Earlier six-frame run including cache construction peaked2758ms before the affine-floor correction; not a controlled browser baseline. Loading all eight atlases into the native audit process exhausted its memory; reduced-asset audit succeeded. Chromium installation failed (invalid/truncated download). Two-browser, touch/iPad, live effect-heavy pacing and input latency acceptance are unfinished.

## Saved layouts
Original local layout data retained with a before28 backup. Invalid placements are identified; explicit repair produces a draft. Stable IDs preserved. No silent deletion of user layouts.

## Remaining work
This is a recoverable foundation candidate, not the full Build28 acceptance finish. Baron/Crown Gallery production presentation, complete material polish, foreground composition and live helmet-field layering acceptance remain. Interrupted reshapes can retain intermediate dimensions; cross-height ripping remains conservative. Full rendered two-client collision/occlusion/effects testing, all animation states, route combat balance and performance acceptance remain unverified. Native screenshots are diagnostics, not browser gameplay captures. Main service must remain untouched.
