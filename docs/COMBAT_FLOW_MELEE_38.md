# Combat Flow & Melee 38

Parent: bc08097a991e05435d85da13a4f36ace8d2b33a0 (Watch Viewport 37B). Same production branch, repository, service and URL. Master and checkpoints are preserved.

## Shared action contract

B edge starts punch; additional presses in the final 180ms of each strike queue at most one continuation. Alternatively press during the 220ms post-recovery continuation window. Holding B does not request further strikes. Physical attacks cost no battery. Aim is captured at strike startup; no pursuit or snap targeting. Contact resolves once, nearest cover before player. Shield/charge/Grip/slide/cover/incoming knock cancels the chain. Defenders retain ordinary shielding and escapes; existing bounded reactions remain.

| Strike | Startup | Contact | Recovery | Range | Damage | Push |
|---|---:|---:|---:|---:|---:|---:|
| Punch | .08 | .07 | .14 | 62 | 18 | 35 |
| Driving kick | .10 | .08 | .17 | 70 | 20 | 45 |
| Uppercut | .12 | .08 | .18 | 62 | 24 | 50 |
| Turning kick | .14 | .09 | .23 | 76 | 28 | 95 |

Seconds, world units, base damage; existing God Mode scaling and shield handling apply. Contact duration defines the contact pose, with a single swept forward segment evaluated at contact onset. It does not continuously reacquire targets throughout that pose.

Deliberate Y charging manufactures one glove charge after 1.2 seconds of uninterrupted actual charging. Releasing early clears partial manufacture. Stored charge persists through battery exhaustion but resets with the round. A turning kick that actually reduces enemy health opens a .65-second RT opportunity. Fresh RT spends the stored charge once and suppresses shotgun until release. Otherwise RT uses its existing gun behavior. Blast: base damage38, speed650, nominal flight .7 seconds, body-region sweep plus8 radius, expanded cover interception, shield interception, ordinary projectile-time rules and bounded lifetime/round cleanup. No extra weapons or ammunition economy rewrite.

## Evidence and bots

Report schema2 separates player damage/hits, cover damage/hits, blocks and confirmed movement-to-hit follow-ups. Attack IDs tie shots, thrown cover/matter and fragments to originating attacks. Cover contact is no longer counted as throw player damage or a successful player-contact learning trial. Follow-up evidence requires the originating throw to have a confirmed player or cover contact, then movement and a later confirmed shotgun/melee hit within two seconds; it is evidence of a sequence, not proof that a throw caused an opening. Rejected, buffered and activated inputs remain distinct. Grip cancellation clears acquisition timing so later throws cannot inherit stale delays. Orbit launches cannot steal IDs from already moving throws.

Bots use ordinary inputs and costs. They approach close openings with B continuations, use confirmed kick windows for RT, retreat from exposed recharge, stop charging at80 battery or4 seconds, and react to throw blocks/contact. Costs and physics are unchanged. One ten-round sample recorded94 baseline/44 adaptive melee activations and one glove blast in each; combined charging occupied26.9%/26.2% of fighter time. These stochastic sessions are not controlled proof of improvement over the uploaded report. Baseline/adaptive tests remain exploratory: excessive recharge downtime and variable launch follow-ups remain. No claim of learned strategy superiority or overall combat balance.

Schema2 uses a separate browser-storage key; schema1 is left intact rather than misinterpreted as new evidence. Reports remain non-executable JSON and retain privacy/bounded history protections.

## Artwork and renderer

Thirty registered transparent poses cover startup/contact/recovery for four physical strikes and glove release in front-right/rear-left views. Front-left/rear-right use explicit mirroring. Two flawed rear contact poses were replaced. Packed384px cells avoid cutting extended limbs; a shared foot anchor and guard-derived body scale register each pose. Packing separates pose components and removes neighboring-cell fragments. Glove projectile and HUD feedback are separate renderer layers; no baked blast backdrop.

Remaining art debt: only two independently authored views, coarse three-phase animation, approximate turning intermediates, and some boot/hardware line details do not fully match the runtime identity reference. This is an inspected playable animation prototype, not a final identity-locked production sprite library. Full directional animation, hit/wince/shield poses and stronger impact motion remain. Existing environment assets are untouched. New-art loading failure uses existing Jade fallback art and does not block gameplay.

## Validation

- melee38: both slots, zero battery, tap/hold/buffering, four contacts/IDs, RT arbitration, one stored charge, expired/empty windows, shield and cover interception, whiffs, incoming-hit/state cancellation, partial manufacture reset, attribution.
- frozen38:1800 deterministic frames against exact37B source; config, movement, battery, shield, Grip, cover escape and shotgun cadence match. New melee/blast metadata excluded deliberately.
- combat26, integration31, connections34, economy30, grip36, spatial21 and memory37 regressions pass; client persistence/export helpers pass in mocked browser storage.
- Actual renderer inspected in6 scene fixtures and20 directional contact/recovery views. These are renderer fixtures, not live controller footage; opponent ready views use a known reference fallback in the fixture.
- Local production two-client HTTP/SSE tests with0/80/160ms imposed uplink delays: command-to-activation14–195ms including imposed delay; max interpolation correction .023 world units in this run. Not internet/controller-to-screen latency or GPU-frame-rate measurements.
- HTTP38: stored charge manufacture and B activation reached both authenticated clients; rematch cleared both states.
- Production build passes. Real-device/controller validation remains for playtest. Deployment success must be verified separately against exact commit.

Run from repository root: node tests/melee38.cjs; node tests/frozen38.cjs PATH_TO_37B_GAME_TS; node tests/memory37.cjs; node tests/client-memory37.cjs; node tests/http38.cjs LOCAL_SERVER_URL. Renderer: CANVAS_MODULE=PATH_TO_NATIVE_CANVAS node tests/native-melee38.cjs OUTPUT_DIR (requires identity reference sprites in ../reference).
