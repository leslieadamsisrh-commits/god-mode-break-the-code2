# Build 27I candidate

Continues 27H (24f2488b99abc6941d3c311b5c0e657d7dfac49f). Local source directory is not a Git checkout; changes are committed through Git data API over the verified base tree, preserving binary assets and unrelated files.

## Geometry
Two solid platforms at x740..1460, north y0..280 and south y820..1100. Each is 720 by 280, height128 (~two 63.96 combat bodies). Four stairs are 200 wide by180 long: x780..980 and1220..1420, north y280..460, south y640..820. The full-width center y460..640 and surrounding ground flanks are flat. Platform tops beyond playable bounds remain background continuation of the same solid volume. No central deck or underpass remains. Shared surfaces govern simulation, obstruction, rendering and editor validation. Ground footprint remains2200x1100; spawns450/1750 at y563 unchanged.

[Dimensioned layout](build27i-layout.svg). `tests/render27i.cjs` produces a geometry perspective preview; this is not a screenshot of actual gameplay or finished environment art. No new production art claimed.

## Projection diagnosis
The old rational projection used depth y/620 across an1100-deep arena. Its horizontal differential scale changed from0.6311 at y120 to1.1099 at y1000 (76% increase), while upright characters kept constant scale. Off-center shear also grew with X. Replaced it with one affine three-quarter projection calibrated at y550: horizontal differential0.7996, constant across positions. Projection/inverse/Jacobian share the mapping, including aim and world surfaces. Floor cache origin remains within its4096x2048 buffer. Skyline parallax uses the same arena-center origin. Existing canvas CSS fills its container nonuniformly; device-specific aspect distortion has not been ruled out by browser measurement. Do not claim every reported visual defect resolved.

## Gameplay and preservation
Jump355, gravity900, damage, battery costs, input mapping, camera tuning and player physics unchanged. Build27H carry height and collision retained. A distant watch bot now approaches before optional salvage/power demonstrations, fixing the reproduced ten-second no-encounter regression; it does not affect human controls. No broad collision disabling.

Six-piece Chase preset moved to flanks; keeps existing placement IDs. Les/custom originals remain device-local and preserved. New pre27I backup is separate from the existing pre27H backup. Invalid layouts load as repair drafts with red placements; no silent relocation. Ground-only editor placements remain explicitly restricted.

## Validation
Production Next15.5.9 build and focused tests are run locally. Geometry-specific legacy fixtures updated for the intentional replacement of 27H bridge/center geometry, preserving assertions for actual traversal, obstruction and combat. New27I test covers all four ascents/descents, flat center, solid walls, projection round trips and constant Jacobian, preset validation and deterministic randomization. 27H carry/placement and elevated-cover hit tests retained on new platform coordinates. Two HTTP clients verify shared layout, authority, jump/fire/shield, held ID/Z, bullet time and rematch resets; this is not two-browser acceptance.

Native concealment fixture:182 pixels, maximum alpha63/255 behind terrace; zero pixels in open air. Structure-only native draw p50~0.52ms/p95~0.79ms; simulation24objects p50~0.129ms/p95~0.364ms from regression run. These are CPU fixture timings, not FPS or input latency.

## Outstanding acceptance
Two-browser combat, iPad/controller feel, full-art floor/skyline registration, actual canvas frame pacing, south foreground concealment, camera coverage at live HUD dimensions, and visual comparison screenshots remain pending preview deployment. Sparse cue remains a simplified contour rather than exact directional animation-mask silhouette. No new jump-leg animation. Platform dimensions should be evaluated in live combat before promoting to main.
