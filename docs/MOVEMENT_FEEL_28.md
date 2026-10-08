# Movement Feel 28 — grounded 0–100 and direct invite lobby

Parent authority: Restoration 27, b88cf1086b7c18398dc70a36507b1e09f03b736e. Continue exclusively on studio/live-app-three-section-01 and the existing Railway service/URL. User explicitly authorized the first movement stage and battery retuning on October 7, 2026. This supersedes the earlier Weave freeze only for this bounded pass. Main/master/checkpoints untouched.

## Implemented

One grounded Stage I profile, 0–100. Higher evolution stages and persistent 0–333 progression are not introduced. Current God charge/window presentation and behavior remain separate; the first-stage label does not claim a new progression engine.

| Setting | 27 | 28 |
| --- | --- | --- |
| Walk speed / response | 222.7 / 13 | unchanged |
| Boost speed / duration | 620 / .19 | 430 / .16 |
| Slide launch / duration | 689.15949375 / .63 | 490 / .50 |
| Sustained thrust | 360 | 160 |
| Steering / angle cap | 7.5 / .62 | 5 / .48 |
| Brake / double-tap window | 9.5 / .28 | unchanged |
| Boost / slide battery | 6 / 12 | 2 / 5 |
| Grab / hold per second / throw | 6 / 6 / 8 | 4 / 3 / 6 |
| Recharge delay / rate | 1.1 / 9 | .8 / 12 |

The same profile applies to host-authoritative bot practice and private fights. Shotgun cadence, spread, damage, region modifiers, health, shields, finisher, controller bindings, Camera B/1.85, actor hulls/rails and Jade scale remain intact. Grip target selection is shared by authority and renderer. Selected-target deck rings, explicit rejected-grab/carry/battery feedback, and LB+fresh-RT throw prompts explain the existing action. New side battery meter shows value, depletion trail and recharge flow, outside the central fighting area. Ordinary run art has a bounded upper-body bank (maximum .035 radians) while the lower sprite and foot root remain anchored. This is a modest procedural presentation change, not new authored directional sway/backpack animation.

## Connection and lobby

Authenticated server-sent snapshots at 33 ms intervals replace repeated snapshot polling while connected; authenticated polling remains the fallback. Server simulation remains authoritative and clock-bounded. Input sampling runs at animation-frame cadence independently of the HTTP sender; a bounded button-transition queue preserves press/release ordering while a request is in flight. Position, velocity and facing interpolate together; discrete cover/death states do not blend across incompatible poses. The render buffer adapts from 65–140 ms to incoming spacing. No speculative hit prediction, client rewind, lag compensation or WebSocket input channel is claimed.

HUD React updates are capped near 10 Hz, separate from Canvas animation. Returning sessions resume their acknowledged input sequence instead of starting at zero. Inputs expire after 400 ms without a valid update so a vanished client cannot keep firing or walking. Connections cancel their update timers when aborted. Rooms remain single-process memory: deployments/restarts invalidate existing invites; multiple replicas are unsupported.

Host a fight, choose Invite Player 2, and share the link using the device share sheet or copied URL. A random UUID capability in the URL fragment authenticates joining without typing room/code; player session tokens never appear in the invite or public snapshots. Guest joins automatically after loading, and two-player joining starts the existing countdown. Host-only invite retrieval, invalid/full lobby rejection and host-only rematch remain enforced. Manual code joining is retained in a secondary fallback. The lobby opens while waiting and collapses at countdown. This is private link joining, not a searchable public lobby or automatic friend-account discovery.

## Audit evidence

Stage28 test measures the same .624-second forward movement sequence against 27: boost travel 177.845 vs 226.311 world units (~21% less), double-tap slide sequence 321.233 vs 480.486 (~33% less). These include subsequent forward walking, not isolated maximum dash/slide distances. Tests verify 2/5 mobility cost, 4 grab / 3 per-second hold / 6 throw, unchanged walk/brake/double-tap, target selection and rejection hints.

Regression checks: fight23 private authority/round flow; fight24 melee/cover/shield; restoration27 fragments/matter/Grip; combat26 swept body hits/countdown/draw/aftermath; three-cover25 rotated actions/breakage/bot battle; spatial21 projection/actions/occlusion. Regression28 compares 1,800 host states against 27 after normalizing the explicitly changed profile and hint metadata; this is not a claim of identical new Weave tuning. Presentation28 checks snapshot order/continuity/discrete cover state, current controller bindings, and ordered two-tap/Grip+RT input buffering.

Production HTTP28 tests actual private invite joining without typed code, automatic countdown, invalid/full invite rejection, host-only invite access, authenticated streaming/monotonic token-free snapshots, server-side input ownership and stale-input shutdown. Production HTTP26 still passes. Production build/type checks pass.

Native Canvas uses the actual renderer and approved world/actor assets for 128 camera/rotation scenes, 80 family/rotation cells, both fighter slots, Grip/break fragments, helmet HUD/side battery/prompts, countdown/finisher and missing-art fallback. Jade uses approved ready d00 as the audit pose in all directions; full animation-set validation is not implied.

## Remaining limitations

Real Safari/controller latency, frame pacing and two-device networking require Les/James playtests; there is no measured device-FPS claim. Streaming still shares full state, HTTP input round trips still constrain control delivery, and high latency can accumulate button transitions. Buffered rendering intentionally adds delay to smooth jitter. Real-world Railway stream behavior must be confirmed after deploy. Private rooms remain ephemeral. Vehicle rotation/deformation, bespoke upper-body/backpack reactions and Bay Bridge distant visibility retain art debt. Heavy melee/Orbit/Pinball controller mappings, ground tearing, shield parry reflection, full combo continuation/escape rules, first-to-three match closure and the higher evolution stages remain unfinished.
