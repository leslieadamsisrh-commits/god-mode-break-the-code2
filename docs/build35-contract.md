# Build 35 — Solidity & Impact

Starting commit 8cb7cd33534ee06b9f78b94107658cd004790db6; parent b44eb2c608aa9a4dc021918017403c40f0d31818; tree 628fa944c7755026f2238a3356dc960b65269fca. Railway refreshed: deployment 773355b1-a7f8-4cec-b2d1-79ca5a038356 SUCCESS, pinned to that commit, no staged changes. Build/runtime logs confirm startup.

Local source is not a Git checkout. Original retained untouched; working copy restores mismatching runtime files from trusted remote blobs. Only reviewed changed files may be committed atop the remote base tree. No repository AGENTS.md was present in the remote tree.

Baseline supported npm install and production build pass (existing CSS compatibility warning). Build25–34 focused baseline suites pass; logs in build35-baseline-tests.log. Do not commit local config adaptations or the locally generated lockfile.

Protected: layout 2200x1100, left/right platforms, camera, DEFAULT_CONFIG, jump/gravity, all damage/knockback/recovery/battery rules, Build34 controls and carry solver, fracture geometry, presets and saved layouts. Shield's existing omnidirectional behavior is a separate unresolved design/correctness audit.

Recording previously reviewed at 1-second samples and denser selected intervals, not a complete input audit. Captured audio level is not an output-mix diagnosis. Existing audio is procedural; no recovered audio/animation assets claimed.

Confirmed code defects: attached aim/fire bypasses upper-body clipping and ignores neighboring cover; a per-direction synthetic 1.1-unit root dip and soft-cover 3.2–8.5-unit root lowering shift registered sprites; hit cosmetic translation shifts the body independent of collision; shield feedback adds another torso offset after contact Z has already been projected; cover-impact feedback hardcodes Z12; simultaneous rip feedback can override an incoming damage sound.

Acceptance matrix (pending until evidence recorded):
| ID | Expected / verification | Status |
|---|---|---|
| SOLIDITY-01 | Existing wall/slide/jump physical regressions retained | Baseline pass; candidate pending |
| OCCLUSION-01 | Aim state and attachment never bypass solid faces; actual upper exposure remains | Focused geometry/mask tests pending |
| ANIMATION-01 | Registered roots do not receive artificial pose-change dips | Code correction; visual acceptance pending |
| CARRY-01 | Build34 swept avoidance and pose authority retained | Baseline pass; candidate pending |
| CONTACT-01 | Feedback on occupied geometry at actual elevation | Focused tests pending |
| REACTION-01 | Distinct contact flash without changed damage/control locks | Browser pending |
| AUDIO-01 | Confirmed event selects correct sound; bounded synthesis | Audition pending; no completed asset pass |
| CLARITY-01 | Reduced duplicate/oversized contact presentation | Browser pending |
| MULTIPLAYER-01 | Two real clients share outcomes; no duplicate feedback | Pending |
| PERSISTENCE-01 | Saved layouts and rematches unchanged | Regressions pending |
| PERFORMANCE-01 | Comparable actual browser frame pacing | Pending |

Contact witness uses nearest occupied prism surface after the existing <=2-unit throw substep. It is presentation metadata, not a new collision or damage authority. Exact continuous time-of-impact and surface normals remain limited by existing collision representation.

## Candidate verification

Production build passes. All 21 existing Build25–34 focused regression suites pass unchanged; new build35-solidity.cjs passes contact witnesses, aim/attachment-independent masks, hit/block/miss outcomes, unique event sequences, XYZ interpolation, blocked interpolation and discrete shape transitions. Separate build35-native.cjs passes actual Canvas pixel concealment/exposure checks using @napi-rs/canvas supplied by the validation runtime (optional native diagnostic dependency, not a production dependency).

DEFAULT_CONFIG is byte-identical to the baseline. No changes to movement, camera, arena, damage, shield policy, battery, carry solver, fracture selection, saved layouts or room authority. Existing regression tests retain their assertions.

Implemented: remove owning-cover/exposed-pose occlusion bypass; remove synthetic per-direction root dip, soft-cover root sinking and cosmetic hit-root translation; interpolate cover Z with bounded shared swept-clearance checks (up to 256 samples), retaining source pose if unsafe; stable-shape requirement avoids invented intermediate hulls. Static unchanged poses skip checks. Contact witnesses use occupied prism surfaces for fighter/other-cover hits; elevated effects no longer hardcode Z12. Shield contact response no longer applies a second torso offset. Hit contact flash lasts at most .08s and directional spray is reduced from14 to8 sprites. Incoming heavy hits route to a distinct procedural body/transient cue; simultaneous rip no longer overrides the chosen defense/damage cue. Maximum12 synthesized oscillator voices. No new animation or audio files.

Baseline real-browser observation: Chrome cloud browser, one solo client, default arena, idle after a one-second keyboard movement; last300 active frame intervals after asset warm-up: median1016.4ms, p951016.5ms, p991016.6ms, worst1033.1ms; over33ms300, over50ms298. Draw CPU median47.5ms / p9561.4ms. Long-task counter487 /30612ms is session cumulative, not a controlled sample. Approximately1Hz scheduling prevents representative device-performance conclusions. No60FPS claim. Candidate comparison and two-client acceptance pending deployment.

## Remaining release gates

This is a checkpoint until browser acceptance and user feel review pass. Actual browser contact sequences, two-player full round/rematch, hardware controller/iPad testing, comparable effect-heavy performance, and audible mix approval are unfinished. Existing compatible directional hit/landing animations have not been created; removing registration shifts is not new articulated animation. Architecture-contact XY still uses the existing conservative fallback when the collision resolver supplies no contact face; exact wall/slope witnesses and floor landing feedback remain incomplete. Ground-support shadow refinement and legacy loose-object carry unification remain unimplemented. Existing shield coverage ambiguity is unchanged. Full snapshot-interpolation clearance across multiple simultaneously moving blockers is conservative, with source-pose fallback rather than a fabricated route; not a guarantee of continuous collision detection.

Evidence: build35-baseline-build.log, build35-baseline-tests.log, build35-final-build.log, build35-final-tests.log in working parent; focused tests in repository. No diagnostic render is labeled actual gameplay.
