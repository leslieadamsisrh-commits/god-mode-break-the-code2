# Build 22 candidate — cohesive combat, camera and weight

Starting remote branch: `studio/raptor-combat-lab-01` at `812099d9dc5a659c3e7ac29c11c75459bdac6ea6`.
Candidate branch: `studio/build22-cohesive-combat`.
Local recovery checkpoint: `97da48d` is a partial-checkout snapshot, NOT remote ancestry. Remote commits must use the full Build 21 tree and parent.

## Delivery status

Implemented and locally compiled/tested; NOT deployed. Railway status query returned `UNAUTHORIZED / oauth_token_invalid_grant`: connection requires reauthentication. Historical SUCCESS deployment `60401e13-bd5d-4d8e-a58e-c711885d6c14` is not a current status verification. The development/deployment branch is intentionally unchanged while live authority is unavailable.

## Implemented

- Four persistent selection cards: Up weapon, Down power and cost, Left field radius, Right cover shape. Brief emphasis on changed selection, plus truthful field preview. Held-object RT throw cue takes priority over stale hints.
- Existing authoritative edge detection retained. Controller reconnect/menu return suppresses already-held D-pad selectors until release. All arrow keys prevent page scrolling. Hidden-tab cleanup now neutralizes multiplayer input too; previously the network timer could resend the last sampled held input while sampling was suspended.
- Close camera target 2.65–2.77 with restrained aim/velocity look-ahead and nearby-opponent framing. Default zoom envelope retained. Removed impact-driven zoom pumping. Projection and world coordinates unchanged.
- Decorative architecture opacity reduced from .78 to .68. Existing face materials, contact anchors, collision silhouettes and fallback renderer retained.
- Thrown-cover feedback now uses the contacted face, carries material and incidence strength, and directs bounded cosmetic debris. Glancing/solid effects differ; existing destruction has its own larger breakup. Existing synthesized audio path gains a layered material-specific throw impact. Sound has NOT been auditioned.
- Private first-to-three host rematch resets scores and round numbering; ordinary next round preserves scores and bot/watch behavior. Canvas result distinguishes match from round. Network stale-input cleanup now clears cover-shape selection too.

## Recovered behavior inventory

| Behavior | Evidence/status |
|---|---|
| Slide, attach, brace, outward escape | Present and connected; existing transition functions retained and focused tests pass |
| Soft-cover perimeter traversal | Present in `moveOnCover`; tangential motion and aim-independent outward escape tested |
| Cover surfing | No separately identified surfing implementation/specification recovered; do not claim it restored |
| Grip/throw/floor-panel lifecycle | Existing infrastructure retained; floor46 lifecycle regression passes |
| Cover material continuity | Build 21 face mapping retained across held/thrown/damaged fixtures |
| Weapons | Current authority only implements verified shotgun; Up retains it and reports this limitation. Other weapon execution is blocked on source recovery/specification |
| Powers | Five existing powers retained; Repulse still disabled by default and local-only |
| Cover shapes | Existing wide/compact only; no unverified corner or tall selectable shape added |
| Non-graphic defeat | Existing cyber-fluid/fragments retained; match-result feedback corrected |
| Multiplayer | Actual API handlers tested as two authenticated clients; browser and real-network session remain unverified |

## Verification

- `npm run build`: production compilation, type checking and 12 routes pass.
- `node tests/build22.cjs`: selector hold/release/reconnect; movement and slide/committed glove invariance; soft-cover traversal/escape; impact contact/material/strength; camera bounds; two-client API authentication, identical public snapshots, selection ownership, stale input cleanup and rematch.
- `node tests/build21.cjs`: existing placement, melee accounting, bot glove and local-only Repulse checks pass.
- `node tests/combat21.cjs 97da48d`: default configuration, 22 hulls, movement/shooting/shield/glove outcomes unchanged. Four diagnostic bot rounds do not establish balance.
- `node tests/floor46.cjs`: floor-panel LB/RT/RB lifecycle, matter identities, denied actions/reset, 24 input rays and 3969 inverse-projection points pass.
- `node tests/local40.cjs`: fixed simulation at 30/60/120Hz, edges, pause/reset and mode separation pass.
- `node tests/scale47.cjs`: 15 shared upright/cover registration checks pass.
- `git diff --check`: pass.

## Visual evidence

`build22-evidence/` contains actual Game.tsx headless renders at 732×510, including matching baseline/candidate scale views, held/thrown, solid/glancing, damage/destruction, north/south/east/west, defeat and fallback. These are controlled fixtures, not browser screenshots or live controller play. Jade capture uses the approved ready-d03 sprite only. Screenshot dimensions reproduce the reference viewport but do not establish actual iPad CSS/layout/performance.

Observed: persistent selectors fit the captured viewport; local fighter and nearby opponent remain visible in tested camera positions; held cover retains the same material treatment; fallback renders; match defeat label renders. Existing tall partitions can still conceal opponents at the flanks, consistent with their hulls. Dense central cover and strong skyline remain visual limitations. Impact placement is verified numerically; static snapshots do not prove motion/audio feel.

The October 22 reference was visually reviewed earlier in this conversation; audio was not evaluated. Available October 20 recording and ten-round report are retained as evidence, not replayed as fresh balance proof here.

## Remaining work and blockers

1. Reauthenticate Railway, verify current service/deployed SHA and newer branch work, then promote only after required review and live testing. Never assume this candidate is live.
2. Browser automation could not start because Chromium was absent; download failed with invalid/truncated archives. API tests are not two-browser synchronization tests. A separate localhost request also failed to connect to the started server across tool calls; no HTTP/live success claimed.
3. Physical iPad/controller, sound audition, real-network multiplayer, reconnect feel, clean exit and full match UX remain unverified. Browser visibility cleanup has compilation/source review, not browser-event verification.
4. Character identity is currently selected by client presentation; a verified Jade-versus-Raptor identity flow across both clients is not established. No character art/hitboxes changed.
5. Older weapon roster and a separately defined cover-surf action need verified recovery. Current controls cannot honestly cycle missing weapons.
6. No blanket visual sign-off: tall-cover occlusion, Raptor/Jade body-height mismatch and combat-floor density remain. Do not shrink authoritative hulls or expand the arena to disguise these issues.

## Files

Runtime: `app/Game.tsx`, `lib/combatPresentation22.ts`, `lib/dimension33MapArt20.ts`, `lib/dimension33Readability21.ts`, `lib/game.ts`, `lib/roomStore.ts`.
Verification: `tests/build22.cjs`, `tests/render21.cjs`, this report and `build22-evidence/*.jpg`.

Playtest URL (existing service, not this candidate): https://god-mode-live-baseline-playtest-playtest.up.railway.app/studio/combat/raptor/real
