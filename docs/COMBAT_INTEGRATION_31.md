# Combat Integration 31

Authority: parent Matter & Impact 30, 3da61a57feae83b5114a447cdb7fe38ef15ec9fa, verified Railway SUCCESS da48c03f-3576-4e7c-aa70-95d715bc5934. Same branch studio/live-app-three-section-01, repo/service/URL/checkpoints preserved. This document does not assert deployment of 31.

## Recovery audit

Read current engine and prior release audit contracts; re-read Brother Build 768e3c3dd18ec801603e711bf87e270decfb72d4 / brother-build-site/lib/game.ts and checkpoint 7e514b8b73ebcca12747dfa909b0fc5e5d7ca667 / combat-lab/game.js. The latter is an earlier presentation proxy, not a complete psychic engine. No verified old D-pad Right mapping recovered. No source here establishes complete Unmake, weapon-switching, projectile storage or parry/reflect systems. Current inspected engine is authoritative; no hypothetical feature is offered as finished.

| System | Source/status | Controls and costs | Dependencies / interruption |
| --- | --- | --- | --- |
| Movement | Stage 28 profile | A boost 2, double tap slide 5 | Existing brake/steering/cover capture; tuning frozen |
| Cover | Current rails/hulls | A hard brace; LT expose; A + stick escape | Soft cover mobile; blocked physical muzzle hits cover; no new hulls |
| Shotgun | Current Combat Feel 26 | RT; .39 base cadence; seven 10-damage pellets | Existing .7 powered cadence factor and 1.35 powered damage preserved; one verified weapon; infinite ammunition remains intentional |
| Shield | Current authoritative block | LT, 18 battery/sec | Plants outside cover; cover LT means exposure; no verified parry/reflect/clash restored |
| Grip/carry/throw | 27 recovered contact and swept carry; 29 selection | LB hold/release, LB + fresh RT throw; 4 grab / 3 per sec / 6 throw | Shared all-mode rotated sweep; held contact is constrained, not damage; launch preserves mass/momentum |
| Orbit | Current 30 / earlier Brother engine | Up select, RB gather/release; 4 per piece, 3/sec hold; LB + fresh RT launch 6 | Three pieces; selection does not drop them; Y/empty battery releases |
| Build | Finite economy 30 | Up select, RB execute; two stone + one metal +30; 1/sec per construct | In-field recipe, valid rotated placement, cap4; ownership/range/empty/death returns components |
| Materials | Current30, 27 recovery | Stone/metal within field; reusable three pieces per prop | Ownership/flying exclusion, capped64; cosmetic chips separate |
| Projectile time | NEW 31, replaces global slow | Tap X on/off | See explicit prototype rules below; Y cancels; stale client/death/round reset clears |
| Charging/God Frame | Current engine | Hold Y recharge26/sec, release power; 2.4 charge, 12 max window, 2/sec powered drain | Existing damage/cadence; fresh Y releases held powers; new attacks interrupt charging; higher 100–333 tiers unfinished |
| Melee | Recovered 27 | B light18; Up Heavy Gauntlet + RB heavy34; .38/.85 cooldown | 120ms one-action buffer; collision/cover/shield rules; expired buffer discarded |
| Pinball | Existing Brother/current engine | Up select + RB; 22 battery, 830 speed/.5 sec | Frozen values, shared movement; not a new wall-bounce combo system |
| Unmake / ground tearing | Not integrated | No offered selector | Needs verified recovery or distinct future implementation |
| Additional weapons | Not verified in inspected authorities | Down selects only shotgun and reports that limitation | No dummy pistol/rifle/sniper entries |
| Hits/rounds | Current26 | Swept low/torso/head, first collision, countdown, 100→92% aftermath, rematch | Human digital / bot metallic effects preserved; deeper match/combos unfinished |
| HUD/network | Current28–30 | Invite link, SSE, HTTP fallback; same selectors/rings/resources in roam | Server memory rooms, no prediction/lag compensation added; real device validation required |

## Control and transition contract

D-pad Left cycles field reach 135/235/335. Up selects Build Cover -> Orbit -> Pinball -> Heavy Gauntlet. Down selects verified shotgun only. Right reserved. Selection does not execute, spend energy, or release ownership. LB remains dedicated Grip; RB dispatches selected action. Existing keyboard direct actions remain; arrows select. X key/controller is edge-triggered toggle, not hold.

| Transition | Rule |
| --- | --- |
| Grip -> throw | Hold LB, fresh RT; suppress shotgun; release RT before shooting |
| Orbit -> launch | Hold LB + fresh RT; suppress shotgun |
| Orbit -> build | Selected Build/RB atomically consumes eligible components and clears references |
| Attack -> charge | Fresh Y drops held powers/Orbit and cancels time; suppress already-held actions until release |
| Charge -> attack | Fresh eligible combat input interrupts charge; preserve existing return timing |
| A brace + another edge | Bracing no longer discards unrelated power/melee/field selector edges |
| Melee cooldown -> follow-up | Buffer one light/heavy intent for 120ms; execute once when cooldown and knock/charge permit; expires without action |
| Repeated impacts -> defense | Movement lock cannot be renewed beyond .60 sec during uninterrupted pressure; a >.35 sec contact gap starts a new reaction window. Existing shield/fire eligibility retained; no invulnerability or damage scaling added |
| Round end | Clear inputs, buffered strike, fields, held ownership and shots before aftermath |

## Projectile field rules — new prototype balance

Strong slowdown .08, not a full stop. Base drain8 battery/sec + .2 per affected pellet, in real time. Capacity42 pellets = six complete seven-pellet shotgun volleys; mixed/incoming pellets consume the same pool and may leave less than six complete volleys. Overflow bullets pass normally, never disappear. Display pellet count, volley count, drain, capacity warning and oldest shot's remaining real age.

All players/cover/rubble/melee/action clocks remain normal. Apply exact circular entry/exit intervals to bullet travel; test a high-speed bullet crossing an entire field within a tick. Overlap forms a union, no compounded slowdown. Each field has its own bounded admission; one field turning off does not remove the other's effect. Bullet positions stay in world space. Original normal velocity, ownership, damage, aim and collision ordering retained. On exit/deactivation/exhaustion, travel resumes normally; no aim assistance or damage/speed multiplier.

Bullet range/life consumes scaled projectile travel time while affected; an 8-second real-age cap prevents indefinite storage. This explicit maximum can dissipate an overheld bullet before manual release; the HUD warns through oldest-age countdown. Storage is not immunity: bullets continue moving and can collide inside the field. New admission uses deterministic array order, favoring older live shots; incoming shots are not prioritized over outgoing. Field centers are sampled at each fixed simulation substep. 30Hz snapshots/SSE preserved; no new prediction or lag compensation.

## Measurements and validation

Automated integration test: identical 90-frame movement paths with field on/off; all four modes; selector hold edges; carrying selection preservation; Orbit dispatch; exact high-speed enter/exit; overlap; original velocity; world positioning; 42-pellet/six-volley cap/overflow; body/shield/cover hit consumption; exhaustion/charging/stale/rematch/max-age cleanup; bounded melee and reaction window. Real shotgun four-volley setup spends 13.77 battery, target takes 100 damage after release in that moving/knockback scenario: not an assumed four-full-blast hit or certified balance result.

Existing combat26, economy30, restoration27, stage28, psychic29 frozen movement, presentation28/30, three-cover25, fight23/24 and spatial21 pass. Old slow-time assertions updated explicitly to the requested new behavior; no changed movement authority. Native actual-renderer audit covers128 rotation/camera scenes,80 object review cells, missing-art fallback and field/overlap/release/solo panels using approved assets. Ready d00 is reused as audit pose: this does not certify every directional animation. Production build/typecheck pass. Actual production HTTP31/30/29/28/26 checks pass: selected power dispatch, toggle persistence, stale cleanup, recipes, private invite/two-slot/countdown, authenticated SSE and safe snapshots. Final HUD changes show selected-power cost/eligibility and both players' active-field state; opponent field uses magenta.

Not real-device verified: iPad/controller ergonomics, James two-device latency, defensive fairness, capacity/drain pacing and subjective combo feel. Not finished: full directional psychic poses, complete weapon family, Unmake/terrain destruction, parry/reflect, wall-bounce combos, higher evolution tiers, complete first-to-three match closure. Existing vehicle registration distortion and road/bay composition remain art debt; no art regeneration in31.
