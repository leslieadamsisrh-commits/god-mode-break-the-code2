# Build 36 — Flick, Gather & Consequence

Starting authority: branch studio/build27a-xyz-elevation-lab at 83710f0a5c243f26e4ecaf37f98553e8e7cfd4f0, parent 8cb7cd33534ee06b9f78b94107658cd004790db6, tree 17000537e12d3552224a3a0b23ab9a75d199e06e. Railway read confirms deployment 8115b944-3bef-4f2f-b042-314c31714c3b SUCCESS serving this commit, no staged changes. Source directory is available; unauthenticated Git clone failed. Remote base tree must preserve all unrelated files.

## Inventory and protected behavior
Existing 2200x1100 arena, left/right platforms, DEFAULT_CONFIG, movement, damage, camera, carry solver, layouts and rematches remain protected. Source runtime app/lib/scripts files match remote blobs; historical non-runtime files differ or are missing locally and must not be committed. Supported package workflow: npm install then npm run build. Baseline 22 Build25–35 suites and production build passed.

Existing LB gathers on press and releases to tear/hold; second press throws. Tear duration .28s, fixed rip cost4, separate throw cost6, holding drain .5/s. Unlimited usage costs0. 24 layered convex cells per supported concrete source; bounded 128 lattice cache. Capacity uses original source volume*(.28+.42*effective battery/100). Natural fragments retain source registration. Generated shapes remain separate.

## Planned corrections
200ms latched protective-gather threshold. Short release commits one quick launch; hold release retains. Use existing swept acquisition without settling; inspect compact path only if full volume fits. Preserve exact committed cells and source region during growth. Clear quick intent on invalidation, cancellation and interruption. Existing throw cost remains6; quick action must validate total rip+throw affordability and must not create a failed-launch surprise. Input edges are ordered by server receipt sequence and consumed per simulation tick; no client duration authority.

Preview: tint selected occupied faces as one region and emphasize external boundary, suppress internal edges; stepped physical geometry remains accurately described. Existing procedural sound and approved sprite families are available. New compatible directional reaction assets are not yet verified. No new damage or control locks authorized.

## Acceptance matrix
| ID | Expected / method | Result and evidence |
|---|---|---|
| INPUT-01 | Tap/hold threshold, cancellation, ordered edges; simulation and browser | Pending |
| SELECTION-01 | Stable source and region, no hidden source swap | Pending |
| QUICK-THROW-01 | One tap, one validated extraction/launch; no extra queue | Pending |
| GATHER-01 | Nested candidate and truthful growing cue | Pending |
| GEOMETRY-01 | Shared remaining/fragment volume, conservation | Existing regressions; rerun pending |
| CARRY-01 | Existing swept carry and protection retained | Pending |
| CONTACT-01 | Authoritative hit/block/miss; no duplicate feedback | Existing35 regressions; pending |
| REACTION-01 | Registered compatible directional reactions | Missing assets/acceptance unresolved |
| COUNTERPLAY-01 | Pressure without new control locks | Pending |
| MULTIPLAYER-01 | Two browser clients agree and rematch | Pending |
| PERSISTENCE-01 | Stable original layouts and reset | Pending |
| PERFORMANCE-01 | Comparable rendered frame sample | Pending; prior cloud browser was ~1Hz scheduled |

Recording 15-23-43 was previously sampled at3s intervals across4:04; no precise input/audio conclusions. All unverified gates stay explicitly unfinished. Report checkpoint until actual browser and feel acceptance pass.

## Candidate implementation and measured corrections

Control: empty LB press locks source; release before 0.200 simulation seconds requests one flick. At 0.200s protective state latches; release retains the fragment. Growth continues for 1.000s after latching, so maximum requested capacity is reached at 1.200s. Fresh LB while held throws; RT fires; RB constructs/places/cancels gathering. H/R3 deliberate drop remains. Keyboard/touch labels updated; blur/gamepad disconnect cancel gathering. Server sequence ordering is authoritative; arbitrary client durations are not used. Edge queues are consumed on simulation ticks, so receipt jitter remains a browser/latency acceptance concern.

Quick tear now takes 0.120s versus the unchanged protective tear of 0.280s. For the validated three-leg lift-out route, quick extraction launches from the elevated second waypoint instead of descending into protective settlement. Entire retained route is revalidated. Quick acquisition uses the existing maximum 550 world units/s; normal protective acquisition response remains unchanged. In the fixed concrete fixture at 60 simulation steps/s, short-release-to-launch measured 267ms for 1,5,10,11-frame presses. The first candidate implementation measured 983ms; this is an implementation iteration, NOT a controlled Build35/browser baseline.

Limited mode preserves fixed rip4 and throw6. Quick detachment reserves the total10 atomically, then launch consumes that reservation without charging again. Cancellation after detachment refunds only the reserved6; the real fragment and paid4 extraction remain. No hold drain during the brief prepaid quick acquisition; ordinary persistent holding still drains .5/s. This timing exception prevents an exactly funded action exhausting before its paid launch. Unlimited mode spends0. Failed detachment spends0. Reservation diagnostics distinguish expenditure and refund. DEFAULT_CONFIG is byte-identical to Build35; damage, movement, camera, shield/parry and knockback constants were not retuned.

One quick action may be active; extra presses show FLICK COMMITTED and are not queued. Existing one pending manual throw during protective acquisition expires after1.25s. Quick intent times out after1.25s. Cancel, death, drop, blocked acquisition and round end clear pending launch. Cancelling a pending tear immediately releases the claim, including cancellation followed by a neutral packet before simulation.

Gathering locks the world source region, preserving nested connected cells while aim changes. Selected visible source faces receive restrained tint with an external boundary. Geometry remains a 24-cell layered representation; visual growth is stepped, not continuously deforming concrete. No new collision geometry or physical approximation was introduced.

## Verification and evidence status

Baseline: npm dependency installation and production build PASS; 22 Build25–35 simulation suites PASS. Candidate: production build and full regression rerun recorded in build36-final-build.log and build36-final-tests.log in the implementation workspace. Focused executable evidence is tests/build36-flick.cjs. Historical hold tests now explicitly hold beyond the threshold; their physical assertions remain intact. The changed input expectation is intentional, not a weakened physical requirement.

| ID | Candidate result | Limitation |
|---|---|---|
| INPUT-01 | Focused simulation PASS: tap/hold boundaries, release, duplicate ordered edges, cancellation | Browser/controller/touch timing pending |
| SELECTION-01 | Simulation PASS: source region locked through aim change | Nearby-source ranking and real-world readability need playtest |
| QUICK-THROW-01 | Simulation PASS: one launch, 267ms fixed-lane timing, affordability/reservation/refund | Not an input-to-visible browser measurement |
| GATHER-01 | Nested selection simulation PASS; selected-face tint integrated | Rendered readability pending; stepped growth |
| GEOMETRY-01 | Build32/33 regressions PASS: conservation, holes, support | No new geometry family |
| CARRY-01 | Build33/34 regressions PASS: carry, placement, clearance | Actual browser routes pending |
| CONTACT-01 | Build35 simulation PASS: contact witnesses/outcomes/identity | Presentation unchanged from35 |
| REACTION-01 | Incomplete | No new directional frames or wall-contact reactions integrated |
| COUNTERPLAY-01 | Existing damage/recovery retained; simultaneous-claim and10s bounded simulation PASS | Repeated competitive rounds and five acceptance scenarios pending |
| MULTIPLAYER-01 | Authoritative simulation tests PASS | Two-browser round/rematch gate NOT passed |
| PERSISTENCE-01 | Existing rematch/layout regressions PASS; layout files unchanged | Browser saved-layout reload pending |
| PERFORMANCE-01 | No browser frame-pacing claim | Candidate cloud browser cannot reach local server (ERR_CONNECTION_REFUSED); live acceptance required |

## Explicit unfinished requirements

- Full live two-browser acceptance, controller/touch hardware, screenshots, gameplay clip, comparable rendered frame median/p95/p99 and human feel approval.
- New registered directional reactions, real second wall-contact presentation, audio audition and completed sound mix. Existing procedural35 sound/poses are retained; no new assets claimed.
- Loose cover/matter use tap/hold release semantics but launch from their current valid pose under existing throw rules; they do not yet use the compact concrete acquisition path. Legacy experimental floor-panel extraction retains its previous control behavior. These are exceptions to uniform-family acceptance.
- No short follow-up quick-attack buffer is added; presses during a committed flick are rejected with feedback. Rapid-tap rhythm needs browser evaluation.
- Broader source-availability audit, full endurance rounds/material exhaustion, impact readability and latency behavior remain open.
- Recording review is sampled visual evidence, not an input or audio audit. No claim of60FPS, completed animation, or completed Build36 release.

Deploy only this checkpoint to existing XYZ after exact candidate verification; preserve main. Record the deployment outcome separately after platform refresh.
