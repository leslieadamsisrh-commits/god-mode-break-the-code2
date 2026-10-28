# Build 31 — Unlimited battery and controlled sparring

Starting commit: d7d4e2f9ac5f1a1a77d3225cd8587dbcbc6fad13
Parent: bccceaae19b0a39ad98e3774928d3ca8f784d638
Starting tree: 6428d9ade09305a913c54c1f5b11e38584d9914c
Starting live deployment: db063ff5-9058-4803-8f4d-81212072b5e8 (SUCCESS verified).

## Scope and preservation

No arena, camera, jump, gravity, weapon damage, health, animation, cover shape, ripping-size or battery tuning constants changed. Source directory is not a Git checkout. Commit uses Git data objects based on the verified existing tree; unrelated files and binaries remain intact. npm ci and production build run locally. Original 16 focused Build 25–30 suites pass before modification.

## Rules and controls

`rules31` is a version-1, validated match-level value, separate from numeric tuning and layout. Missing rules retain current battery/full-pressure behavior. Only new local practice defaults to unlimited/sparring. Browser-local practice preferences have a separate versioned key and never overwrite layouts or tuning presets. Creating practice from the menu preserves the currently selected starting layout through existing validation. Saved layouts are not modified.

GOD MODE menu → battery and opponent selectors → START / RESET PRACTICE. Changes do not mutate an active session. Host new fight explicitly uses displayed battery selection. Host can apply rules in lobby or finished phase; server rejects guests and active/countdown-round changes. Rematch keeps rules and clears transient state. TARGET has a reset through the same practice button. Existing keyboard, touch and controller action bindings unchanged. Native select controls support mouse/touch/keyboard; gamepad-only dropdown navigation is not newly implemented or claimed.

Unlimited uses finite battery 100. Shared affordability/debit helpers cover discrete costs, partial movement expenditure, powered-up drain, shield upkeep, field upkeep, holding and thrown-cover shield absorption. Normalize at the start of `advance`, before bot/action eligibility; spending itself also bypasses depletion, rather than refilling after failures. Existing collision, ownership, action conflicts, timers and object counts remain authoritative.

Actual action expenditure is zero under unlimited. Cost-bearing action records also expose `nominalEnergy`; contact damage amounts are unchanged. `energySpent` remains observed actual loss. Existing diagnostic rejection strings remain available, including clearance, ownership, energy, reach and action conflicts. Range/height are still grouped as OUT OF REACH in rip targeting; a fully standardized rejection-code taxonomy is unfinished.

Current-balance costs remain: build 20, grip/rip 4, hold .5/sec, throw 6, dash 2, slide 5; shield upkeep 3/sec; recharge 18/sec after .5 sec; field activation 8 and existing drain. All DEFAULT_CONFIG values unchanged.

## Edge rules

- Bullet time: 2 seconds, .5-second cooldown, existing 42-pellet capacity, 8-second projectile age bound. Holding activation does not retrigger. Legacy bullet-time selection uses the same bounded toggle only under unlimited; limited legacy behavior remains unchanged.
- God Frame: existing charge preparation and maximum 12-second duration; unlimited does not make it permanent.
- Shield exhaustion/battery-break cannot be evaluated in unlimited mode. No new health protection flag is added. **Pre-existing issue:** `duelContact` accepts active shield without a facing-angle predicate; unlimited exposes an indefinite defense loop. Shield directionality/counterplay needs a separate deliberate correction, not an undocumented battery-pass balance change.
- Death/disconnect cleanup unchanged. Energy freedom does not retain claims after normal interruption.
- Future extraction capacity must use a separate policy; do not reuse `availableEnergy31` as physical capacity. Current chunk sizes unchanged.

## Opponent parameters

TARGET: neutral locomotion/action input; ordinary damage, collision and external knockback remain. No attacks or manipulation.
SPARRING: existing practice bot decisions sampled every .3 simulation seconds; 2-second action window followed by 4-second neutral recovery window in a 6-second cycle; locomotion axes multiplied by .5 during action windows. Existing committed attacks/projectiles can finish during a pause. No damage, projectile speed, invulnerability or aiming accuracy cheats added.
FULL PRESSURE: original bot algorithm unchanged. Existing sessions without a preset use it.

## Load bounds

Existing four living constructs per owner retained. Added a 96-living-cover admission bound for construction/floor extraction/section splitting (split reserves two additional entries). Reject new actions with OBJECT LIMIT; never delete held or strategically placed protection. Original layouts remain intact. Existing loose matter cap 128 (64 without ground sources), short-lived effects, 12 cyber stains, 64 combat events and 128 action records retained. Projectiles retain cadence/lifetime/time-field caps. The 96-cover safety bound is not a claim of measured device capacity.

## Acceptance matrix

| ID | Expected behavior | Evidence / result |
|---|---|---|
| ENERGY-01 | Unlimited construction, rip, hold, throw without depletion | tests/build31-rules.cjs PASS, including zero starting battery |
| ENERGY-02 | Shield, mobility, timed powers retain non-energy rules | simulation PASS: shield upkeep, field expiry/cooldown, charge duration, dash; original suites cover hit rules |
| ENERGY-03 | Original economy recoverable | simulation PASS: insufficient build, exact cost, hold exhaustion, recharge, shield drain; 16 original regressions PASS |
| RULES-01 | Trusted host-only rules, round lock and shared snapshots | tests/build31-http.cjs PASS with two independently authenticated HTTP clients |
| RULES-02 | Rematch preserves rules, restores layout, clears ownership | Build29 HTTP + Build31 HTTP PASS |
| BOT-01 | Target nonattacking, damageable | Build31 simulation PASS |
| BOT-02 | Sparring measurable pauses, full-pressure preservation | 12-second simulation checks 4/6-second pauses; deterministic full-input comparison PASS |
| LIMIT-01 | Admission bounds preserve existing objects | 96-cover and four-owned-construct rejection tests PASS |
| UI-01 | Menu selections, persistence, unlimited HUD | Compiles; actual candidate browser verification pending deployment |
| BROWSER-01 | Two independent browser gameplay clients | NOT PASSED; HTTP tests are not browser acceptance |
| PERFORMANCE-01 | Sustained unlimited rendered frame pacing | NOT MEASURED; no 60 FPS claim |

## Verification and findings

Production build passes locally. Build25,26,27A,27B adapter/integration,27C,D,E,F,G,H,I,J,28,29,30 and new31 focused simulations pass. Build29 and31 HTTP tests pass against the production server. Initial HTTP31 test failed because the request-driven server countdown was not being ticked while the harness slept; fixed the harness to poll the room, preserving the gameplay assertion.

React review: versioned localStorage validated on load; selectors are labeled native controls with 44px minimum height; rules are passed as a ReactNode slot, no component type created inside render; host mutation remains server validated. Existing CSS autoprefixer warning about `end` predates this work.

Release remains a checkpoint until candidate browser, iPad/controller-menu usability, sustained unlimited performance and live deployment acceptance pass. No new animation/audio/art, irregular destruction or variable extraction sizes claimed. Main service untouched.
