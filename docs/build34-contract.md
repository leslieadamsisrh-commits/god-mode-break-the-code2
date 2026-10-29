# Build 34 — GUNHAND / GODHAND

Starting branch HEAD b44eb2c608aa9a4dc021918017403c40f0d31818, parent d81149453281d7a43fcd43669e82e07bb989e3b2, tree debd0745a8ba5643eb55f6803b300b616b73f88a.
Railway refreshed: Build33 SUCCESS a8027838-9602-4b77-96b9-320ab626d4d0; no staged changes.
Local source directory is not a Git checkout. Runtime files being edited match remote blobs. Other local stubs/adaptations exist and must not be committed; preserve remote base tree.
Baseline npm ci and production build pass. Build33 fracture and interaction suites pass.

Protected: DEFAULT_CONFIG, movement/jump/camera, world layout, battery rules/capacity, 4 fixed rip cost, damage envelope, trusted fracture cells and saved layouts.
Confirmed code behavior: LB pressed while holding drops; RT throws and suppresses shots; carry returns at first obstructed substep, with no lateral/lift alternatives. This is code evidence, not a reproduced video-specific cause.

Acceptance matrix (pending unless evidenced below):
- INPUT34: fresh LB gather/release/throw, RT weapon, RB cancel/place; simulation and browser.
- GATHER34: one-second nested growth, stable source, no failed payment.
- CARRY34: swept low-cover lift/side avoidance and valid walls; physical simulation + browser.
- PLACE34: supported settling and stacks, support removal.
- THROW34: bounded launch assistance, downward release, no homing.
- NET34: exactly-once edges/ownership/rematch, two independent browser clients.
- FEEL34: distinct contacts, audio audition and human review.
- PERF34: comparable rendered frame measurements.

No new animation/audio assets presumed available. No completed browser acceptance or performance claim yet. Prior video review is sampled evidence only.

## Implemented checkpoint rules

- RT fires; LB press empty begins gather; release commits; fresh LB held throws. RB during gather cancels without building. RB held validates supported placement. H / R3 / touch DROP deliberately releases; Q maps LB, B maps RB, mouse/T maps RT, R remains an explicit throw shortcut. The shortcut cannot skip acquisition.
- Grip input edges are queued (maximum four) on the authority; sequence numbers must be safe integers and monotonically increasing. Server time owns growth. Touch cancellation and Studio opening cancel rather than commit.
- Gather volume grows over 1.0 simulation second from the smallest useful connected candidate toward existing capacity; growth is discrete cells. New selection must contain prior cells and stay in the same source revision. Existing 4-battery detachment cost, zero unlimited expenditure, transactional health/material transfer remain. Legacy non-fracture anchored sections retain fixed geometry.
- One pending throw, maximum 1.25 seconds. Initial .65-second trial expired before a valid acquisition completed; focused test exposed this. It never launches before acquisition. Death, disconnect, failed acquisition, cancellation or timeout clears it. No attack queue.
- Normal cover carry targets 100 world units ahead (or larger footprint clearance radius when needed), bottom at player Z+12; look-ahead 0.10 seconds, clamped to 24 units per axis. Validated lift can add up to 96 units; lateral alternatives are 24/48 units on a persistent preferred side. No timed side lock. Translation maximum550 units/s; rotation3.2rad/s; exponential response12/s. Sweeps sample combined translation/rotation arc at <=2 units, maximum256 samples per candidate. This is a conservative discrete sweep, not mathematically continuous collision detection.
- A lift targets obstacle top+3 units. The 3-unit margin is not a bullet hull. Lateral alternatives currently guarantee physical clearance, not a uniform three-unit separation from every irregular face. Axis/rotation fallback is bounded locally, but a tall wall can leave the object away from the preferred distance as Jade moves. No player tether or hidden protection added.
- Stacking is deliberately conservative: the entire footprint must fit within one convex receiving top face; stacking tops limited to Z192. Ground/platform support retains established support logic. Recomputed every frame; removing support allows gravity. Complex bridging, partial support, tipping and moving-stack support graphs are not implemented.
- Launch assist: one visible opponent within450 units, within0.18rad of aim, structure/cover line of sight; correction only at launch, no homing. Cue is authoritative. Vertical launch speed [-350,200] based on actual launch height and intended target; controller default target height uses current player torso unless opponent is selected. Throw force/mass response and damage clamp100 remain existing rules. Existing carry momentum affects final trajectory. This is bounded assistance, not guaranteed accuracy.
- Natural/generated cover uses the new carry controller; legacy loose Matter uses its established separate movement path. Full common-controller conversion remains unfinished.

## Verification and evidence

21 focused/regression suites passed against a separate runtime validation directory containing the exact repository app/lib dependencies, not the local stubs: Build25,26,27A,27B-adapter/integration,27C,D,E,F,G,H,I,J,28,29,30,31,32,33-fracture/interaction,34. Production Next build passed. Build generated a pre-existing CSS flex-end compatibility warning. Candidate last changes rerun before commit.

Focused Build34 tests cover tap versus hold (fixture volumes5945.785 and64197.437 cubic world units), RT retaining hold, exactly-once LB throw, cancellation without material loss, input edges between simulation frames, buffered acquisition throw, deliberate drop, bounded assist/manual break, downward velocity, actual simulation low-cover lift, corner route completion, solid-wall rejection, support choice/removal.

Fixture migration: Build27F/G/J and31 use LB throw instead of RT; Build27H checks physical held elevation then settled platform elevation; Build32/33 explicitly release a gathered extraction and compare the committed grown preview. Build32 lift-out clearance now includes Z because cover can remain above its source XY position. Collision, health, conservation, cost and rematch assertions retained.

Protected DEFAULT_CONFIG verified unchanged against baseline. No saved-layout files or definitions changed. Main playtest untouched. Existing audio and animation retained; no new assets claimed.

Evidence files in development workspace: build34-exact-build.log, build34-exact-tests.log, build34-final-regressions.log. Referenced 23-46-54 recording unavailable in supplied upload directory; earlier recordings exist. No new frame-by-frame recording review claimed.

## Outstanding release gates

- Real two-browser complete signature exchange, controller/touch hardware acceptance, screenshots and rendered performance baseline/candidate measurement.
- Audio audition/new physical sound pass and compatible new Jade frames.
- Full loose-Matter avoidance integration, advanced forward-envelope recovery under impossible spaces, arbitrary partial stack support and contact-accurate downward floor impact feedback.
- Aim-assist acquisition hysteresis beyond retained source/preview and one-opponent context; safe conservative source selection may still reject some crowded acquisitions.
- Broad counterplay/competitive testing and user feel/readability approval.
- Do not label these pending requirements passed based on unit/simulation results.
