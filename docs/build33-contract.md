# Build 33 — Torn matter & readable protection

Status: implementation checkpoint; browser acceptance and user readability review pending.

## Starting state and preservation

Verified branch `studio/build27a-xyz-elevation-lab` at d81149453281d7a43fcd43669e82e07bb989e3b2, parent a02eb9fe2681a089a1aa4bbd4b43293badbb9ce7, tree 7500c56750bd0711bf434711d6ce574b95f2ad7b. Railway preview fedbe0b5-7525-499f-9479-c8c02eb13f13 was SUCCESS at inspection. Local source is a source directory, not a Git checkout. Complete remote base tree is preserved when committing changed blobs. No AGENTS.md in remote tree. npm lockfile/workflow retained. Baseline production build and Build32 suite passed before edits.

Protected: DEFAULT_CONFIG, world footprint, left/right layout, stairs, player physics, camera, damage, battery rules, capacity settings, controls, generated reshape policy, saved layout definitions. No new audio or animation assets. Approved Jade and existing Baron portrait retained. Concrete uses registered procedural faces from authoritative volumes, not a recovered sprite sheet. Video reviewed as samples, not a complete input audit.

## Geometry and selection

Trusted d33-nw-primary concrete uses 24 convex prisms: the existing eight irregular XY cells, each split into three source-local vertical bands. Other objects and legacy eight-cell states remain supported.

For column c, j=FNV1a(sourceId + '/band/' + c). Cuts are [0,H*(.27+(j%10)*.01),H*(.64+((j>>>8)%10)*.01),H]. ID = column + layer*8. Rotation is existing XY angle; no pitch/roll. This is stepped height variation, not sloping 3D fracture. Existing two-row XY lattice supplies partial depth. Volume is exact convex polygon area times band height. Rendering, ray collision, body contacts, cover overlap and occlusion consume these occupied prisms. Broad-phase bounds are not final fracture collision.

Selection uses nearest four starts, distance plus (2-layer)*9 ranking, connected growth, maximum16 cells and48 candidate attempts. Effective capacity <=33 selects upper/middle cells so the base remains; higher capacity may grow down and sideways. Candidate remainders must be connected to ground-rooted material. Unsupported extractions are rejected before payment. Outcomes depend on aim, capacity, clearance and remaining cells; there is no natural-fragment menu or guaranteed shield. Corner bite, broad piece and side break are geometric possibilities, not three hand-authored assets. Full three-family visual acceptance remains pending.

Capacity unchanged: original width*depth*height*(.28+.42*clamp(effectiveBattery,0,100)/100), bounded by available selected material. Fixed nominal rip cost4, charged once at successful detachment; unlimited expenditure0. AUTO/CUSTOM behavior unchanged. Committed cells do not change; capacity/affordability/claim/revision/clearance revalidate. Existing .28s tear retained. Parent claims remain serialized. Volume and proportional current/max health conserved (tests tolerance1e-6). Source-local coordinates, heights and orange marking stay attached to material through rebasing.

Limits:24 source volumes,16 selected volumes,48 candidate searches,128 immutable XY lattices cached, existing96 world-object bound. Maximum144 raw prism faces before internal-face removal; actual exposed faces fewer. Existing acquisition2u and hold3u sweep steps retained. No new snapshot byte cap; finite snapshots and bounded object/cell counts provide current bound. Exposed source-local face meshes use a separate128-entry cache keyed by definition/occupancy/registration. Sustained browser stress acceptance remains incomplete.

## Corrections and exact behavior

- Full-height collision replaced by per-prism height intervals for fractured cover. Upper openings do not erase lower material.
- Acquisition rebasing retains the extracted minimum Z and its actual height, not whole-source height.
- Reproduced partial-height hold defect: ordinary hold previously snapped acquired elevated chunks immediately to support height, colliding with the remaining base. Layered fragments now descend at at most180u/s; a blocked downward step retains current Z while testing horizontal/rotation movement normally. No collision bypass. Nonlayered hold elevation behavior preserved.
- Hover lift previously followed collision checks unchecked. The proposed hover pose now passes clearance before commit; obstruction retains the last valid pose.
- Projectile cover feedback Z now interpolates to the actual contact time rather than the end-of-step Z.
- Simulation diagnostics expose aim, intended/actual pose, errors, acquisition and obstruction via existing Combat Audit. Renderer uses authoritative pose; separate measured rendered-pose/screen-HUD telemetry is not complete.
- Held concrete gets a short owner-color surface accent, amber BLOCKED cue; neutral cover has no active-control accent. No defensive bonus.
- Bottom loadout cards collapse while holding; action strip moves to bottom. Touch controls unchanged. Camera unchanged.
- Manipulation reach alpha .28 during selection/tear/grip, .04 otherwise; second ring only during tear at .14. Bullet-time presentation unchanged. Slide lettering lifetime .78→.42s and opacity .94→.72. Cosmetic only.

Existing conservative fragment mass mapping preserved: any natural fractured piece uses source catalog mass*0.44, independent of selected volume. Throw damage remains min(100,speed*mass/90); launch behavior unchanged. Larger coverage gives no automatic mass/damage escalation. Full variable-shape throw-envelope characterization remains a limitation.

## Sparring and shield audit

SPARRING retains6s cycle, first2s offense,4s recovery, .3s decisions, .5 movement scale. When an opponent carries protection within450u and a head-height60u line is visible through authoritative structures/cover: first.65s is a stationary probe burst, remainder of offense is lateral movement at .5 input without fire. Decision quantization can extend the transition to the next.3s decision. No future input, guaranteed dodge, damage change, or new power. TARGET/FULL preserved; regression compares FULL inputs with legacy.

Shield audit is separate: six horizontal direction/height shot cases all block with active shield. Source has no angular predicate in duelContact. This characterizes existing omnidirectional coverage; no unapproved cone or parry/battery rebalance applied. Above/below angled boundary intent remains unresolved. A shield-facing correction is not claimed.

Baron round-end overlay already gated to finished phase. No new backdrop/animation work.

## Acceptance matrix

| ID | Expected / method | Result / evidence | Limitation |
|---|---|---|---|
| FRACTURE-01 | Deterministic connected volumes, supported remainder;100 seeds | PASS tests/build33-fracture.cjs | Stepped bands only |
| MATERIAL-01 | Parent+fragment volume/health conservation, locked cells, fixed cost at3 capacities | PASS same suite | Damage markings are procedural |
| PROTECTION-01 | Upper ray passes, lower blocks; body and overlap use bands | PASS same suite | Full live cross-elevation exchange pending |
| HOLD-01 | Persistent acquisition, no base overlap, reposition, RB placement | PASS tests/build33-interaction.cjs | Stair/crowded two-player visual acceptance pending |
| SPARRING-01 | Probe, flank, recovery observed in simulation | PASS interaction suite | Human teaching/readability review pending |
| SHIELD-01 | Characterize six direction/height impacts | PASS unchanged omnidirectional behavior | Intended cone undefined, angled tests incomplete |
| VISUAL-01 | Exposed faces match volumes; quieter held HUD/effects | Native renderer inspected | Native diagnostic is not browser gameplay |
| MULTIPLAYER-01 | Matching cells/ownership, claims/reset and rules | Existing regression + HTTP planned | Two-browser physical exchange pending |
| PERSISTENCE-01 | Intact definitions and rematch | Existing regression + HTTP planned | User layouts not silently changed |
| PERFORMANCE-01 | Comparable browser frame intervals | Pending | Native CPU samples not FPS |

## Evidence and fixture changes

Build32 tests retain legacy8-cell collision fixtures explicitly. Build27J remaining-protection ray now crosses the center of an actual retained prism, rather than a fixed point that the new valid extraction removes; new Build33 tests separately require upper opening/lower blocking. Build27J/31 new-source/rematch counts expect24. No weakened collision assertions.

Native render scripts are diagnostic only; fixed approved ready pose is reused at all directions to limit decoded-asset memory. Screenshot cannot certify directional animations. Native20 warm samples initially median30.79ms/p95 95.53ms, later30.15/48.64 on differing candidate revisions; not controlled before/after, not browser FPS.

Unfinished: complete two-client browser exchange; all three families at normal play camera; rotated/depth face-order edge cases; complete throw/contact and shield-angle audit; fully measured hold blocking-object/render/HUD telemetry; sustained browser performance; articulated animation/audio assets; user readability approval. Release must remain a checkpoint until evidence closes these gates.

## Candidate validation before deployment

Production build passed including TypeScript. All20 Build25–33 regression suites passed (including two new33 suites); Build23/24 also passed. Historical21/22 fail on unchanged baseline too (construction preview fixture and legacy powerCycle expectation). HTTP two independent tokens passed matching authoritative cells/ownership, persistent hold, rematch restoration and unchanged saved layout. The HTTP test now waits for an actual valid preview instead of assuming a wall-clock countdown duration. This is not two-browser gameplay acceptance.

Catalog concrete source is98×30×32 world units,160HP; test fixtures additionally exercise48-height sources. No enlargement of source or fighter. Partial-height fragments protect only their actual height; they do not promise head coverage.

Baseline actual cloud browser:1363×936 screenshot,300 active frame samples, interval median1016.4/p951016.5/worst1016.6ms, drawCPU median38.6/p9548.3ms,285 frames over50ms,314 observed long tasks. Cloud scheduling appears dominant; this is not representative device FPS. P99 was absent in baseline diagnostics; candidate adds it.
