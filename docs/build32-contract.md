# Build 32 release contract

Verified base a02eb9fe2681a089a1aa4bbd4b43293badbb9ce7, tree ba77bf5d316437a6fab6c53a80cc1fc5ac8760a0. Live Build31 deployment 9be05f9f-f625-4025-8d12-7136f4d37d69 SUCCESS; nothing staged. Source directory is not a Git checkout. Baseline npm ci/build and 17 focused suites passed. Local backups preserve the starting source.

Recording sampled across 0–220 seconds and at 95/100/106 seconds; visible held cover remains manufactured rectangular slabs. Samples do not establish specific collision defects. Existing source has fixed 28%/44%/28% splitting and rectangle-only tests across several systems.

Planned physical representation: eight deterministic convex XY cells (four columns, two rows), extruded through the concrete barrier height. This produces connected irregular footprints and full-height openings, not upper-only holes. All cells have ground support; disconnected remainders remain anchored on ground. Reuse the trusted d33-nw-primary concrete family only. Existing sprites cannot represent arbitrary cutouts: use registered procedural concrete faces instead, without claiming new production art.

Protected: layout, movement/jump/camera constants, damage constants, battery rules and fixed grip cost4, generated shapes, ownership and saved layouts. No shield rebalance.

Acceptance IDs: FRACTURE-01 geometry conservation; CAPACITY-01 monotonic prepayment cap; TARGET-01 stable bounded selection; AUTHORITY-01 atomic claims; COLLISION-01 shared occupied cells across bullets/body/hold/throws; RENDER-01 matching faces/holes/occlusion; RESET-01 intact layouts; BROWSER-01 two clients; PERFORMANCE-01 actual rendered timing. All candidate gates pending until recorded tests pass. No completed release claim based on build alone.

## Implemented candidate rules

- Trusted family: `d33-nw-primary`, runtime definition dimensions retained (98×30 footprint; height from `bayObject.dimensions.z`). Other objects retain their previous behavior. Eight deterministic convex cells: 4 columns ×2 rows, with bounded vertex jitter (12% width, 40% depth on eligible grid vertices). Each is a full-height prism. No upper-only holes or arbitrary 3D meshes.
- Source seed is FNV-1a of stable placement ID. Occupancy and revision are authoritative state. Geometry is immutable per source. Seed/revision influence candidate ordering; clients do not reroll. A rematch restores the same intact lattice.
- Capacity in world units cubed: `originalWidth * originalDepth * originalHeight * (0.28 + 0.42 * clamp(effectiveBattery,0,100)/100)`. Continuous cap; discrete cell groups fit below it. Capacity is measured before payment. Actual selected volume may be lower due to remaining material or clearance.
- AUTO: actual battery in current mode, 100 in unlimited. Optional validated `rules31.capacity32` is 0–100 and controls selection only. Host/between-round restrictions reuse existing rules authority. Missing field means AUTO. Affordability still uses actual battery rules.
- Cost: unchanged `config.gripEnergy=4`, once on successful detachment, independent of volume; unlimited spends zero. Existing hold drain `.5/second` remains in limited mode after acquisition. Failed/cancelled tears do not spend the rip cost. No new cost or damage bonus.
- Tear time remains `.28` simulation seconds. Preview recomputes at most 10Hz, aim quantization `.12` rad, target retention within `.12` rad. Existing manipulation cone/range are preserved; proposed boundary now begins near the exposed ray intersection. Hysteresis does not affect gun aiming.
- Candidate search: at most four nearby seed cells, six cells per fragment, 24 unique connected candidates. Minimum two cells, 10-unit minimum bounding thickness, footprint aspect ratio≤6. Invalid candidates try alternatives from the same parent before commitment. No replacement after commitment.
- Whole-parent claims are serialized. Revision, occupancy, capacity, energy, state and path are revalidated before the synchronous detachment/payment transaction. Source identity remains stable. Detached IDs append the source revision. The exact chosen cells, seed, capacity, volume and path are recorded in the rip outcome.
- Direct acquisition path first. If jagged edges interlock, validate a vertical lift above the source, forward movement, then descent. Full volume checked at ≤2-unit samples, at most256 samples. Acquisition uses this path, then resumes existing hold controls; changed obstruction stops it while retaining ownership. Turn sweeps remain bounded. This is bounded sampling, not a formal continuous time-of-impact solver.
- Parent and fragment divide current/max health proportionally by selected remaining volume; their totals are conserved. No healing. Each cell exists exactly once. Tiny single-cell remnants stay anchored/protective and cannot be ripped alone. All cells extend to the supporting floor, so disconnected remainder islands are supported.
- Fragment gameplay mass is deliberately held to the historical 44%-section mass of this definition. Existing throw speed and damage equations/clamps remain. This conservative mapping prevents capacity from increasing the damage envelope; volume-dependent mass response is deferred. Physical coverage does change.
- Bullets use swept convex-prism intervals. Movement, carry, cover/cover contact, thrown-fighter contact, attachment and occlusion consume occupied cell geometry. Broad bounds only reject distant pairs. Throw stepping uses ≤2-unit translation for new fragments. Jagged cover attachment follows actual boundary segments; reaching a soft-cover segment endpoint releases rather than wrapping around a fictional rectangular corner.
- Placement checks every occupied footprint vertex against receiving support height. Generated-cover reshape and unrelated hulls are unchanged. Saved layouts still contain intact trusted definitions; no match occupancy is persisted into them.
- Rendered concrete uses new procedural registered top/side/fracture faces; exterior orange band and interior aggregate are tied to the source faces. No new recovered sprite, audio, rig or animation claims. Adjacent collinear exterior faces merge to avoid a pre-cut-panel appearance. Local/opponent marks remain distinct.
- Limits: 8 cells/source,6/fragment,96 living cover objects including fragments (existing limit),≤24 candidates/preview,≤256 path samples/candidate,128 immutable lattice cache entries. Existing FX limits retained. No new debris bodies. Snapshot contains fixed cell occupancy and trusted source geometry parameters, not executable meshes supplied by clients. No explicit byte-size snapshot cap added.

## Evidence and gates

| ID | Expected / method | Candidate result |
|---|---|---|
| FRACTURE-01 | Convex deterministic cells, connected groups, volume conservation; 100 source seeds | PASS `tests/build32-fracture.cjs` |
| CAPACITY-01 | Different small/mid/full volumes, fixed cost, prepayment cap, cancellation | PASS simulation |
| TARGET-01 | Stable preview under small aim noise, locked cells | PASS focused simulation; device feel pending |
| AUTHORITY-01 | One claimant, unchanged source on cancellation/death/disconnect, validated rules | PASS Build27J/30/32 simulations; API checks separately |
| COLLISION-01 | Real shots through holes; retained cells block; body needs larger opening; completed lift-out | PASS focused simulation; full arena/browser traversal pending |
| RENDER-01 | Matching occupied geometry rendered and inspected | Native actual-renderer diagnostic inspected; browser candidate pending |
| RESET-01 | Intact rematch and saved starting layout unchanged | PASS simulation and API checks |
| BROWSER-01 | Two independent browsers complete signature exchange | NOT PASSED; candidate not yet live at contract creation |
| PERFORMANCE-01 | Rendered pacing under sustained unlimited manipulation | NOT PASSED; baseline measured, candidate sustained measurement pending |

The historical Build27J/31 fixtures expecting three rectangular objects were intentionally updated: one stable parent occupancy object and one fragment now replace the old three-slice representation. Exact hole/body/projectile assertions are in Build32 tests; no collision assertion replaced by imagery alone. The legacy split helper remains for unsupported historical runtime objects.

Baseline: `npm ci`, production build and 17 focused Build25–31 suites passed. Candidate final test/build results are recorded with the deployment report; do not infer final status from this contract alone.

`evidence/build32/native-sequence.png` is the actual renderer driven by simulated states with a fixed approved ready pose and a subset of assets. It is NOT browser gameplay. Native CPU diagnostics varied around24–34ms median across runs with other work active; these are not controlled before/after measurements or FPS claims. The downward composition still places some source material near the bottom HUD; camera tuning is unchanged.

`evidence/build32/baseline-browser.jpg`: live Build31, Chrome cloud browser, viewport1363×936, DPR1, one active tab, target opponent, unlimited battery, six starting objects, stationary fighter,125 active frame samples. Median1016.4ms, p95=1016.5ms, worst1033ms;125 frames>50ms. Draw CPU median22.1ms, p95=32.6ms. p99 unavailable from existing diagnostics. Large frame gaps relative to CPU draw time prevent treating this as representative device performance. No60FPS claim.

## Explicit unfinished acceptance

Full two-browser combat, touch/controller feel, sustained rendered performance, candidate live inspection, exact boundary visual polish, partial-height fractures, continuous swept-polyhedron collision, material-specific audio, and richer fracture animation remain unverified or deferred as identified above. Do not label this the fully accepted Build32 release. Shield-facing issue is unchanged and remains separate. Protected movement, camera, weapon damage, current-balance costs, generated shapes and arena layout constants were not retuned.

Final local verification: production build PASS; all18 focused suites PASS after two fixture corrections: the throw fixture waits for lift-out and aims into clear space (throwing back into remaining material correctly contacts it), and the rule-lock fixture now explicitly enters playing phase. Three independent-client HTTP suites PASS (Build29,31,32). These are API clients, not browser acceptance. The final source build is rerun after the finite-radius matter collision integration. Finite-radius ray padding uses conservative offset polygon planes; corner padding is not a rounded Minkowski sum. Point projectiles and visible cell boundaries use identical geometry.
