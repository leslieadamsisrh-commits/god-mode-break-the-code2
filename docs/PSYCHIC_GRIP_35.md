# Psychic Grip 35 — shared two-bot experiment

Parent HEAD e1f3247fce3f317c8e0942097e08063c7cfd81d8 verified on studio/live-app-three-section-01. Railway SUCCESS 3c36fe5e-66c3-4cb3-ab1e-c4005f98c9f0 confirmed before edits. Same repo/service/URL; master and checkpoints untouched.

## Implemented contract

Reuse existing grip selection, mass-dependent swept carry, shell rigs, collision hulls, material economy, authoritative throws and confirmed combat events. New gesture-release behavior is an experiment, not a claim that an entire earlier tether implementation was recovered. The recovered carry comment still identifies lab-psychic-cover.js / efecc43; no new source asset generated.

LB holds Grip; right-stick direction and magnitude position held matter within a radial target range. Neutral stick holds the previous target. Rotation follows a bounded, mass-dependent arc around the holder, not a shortcut through Jade. Movement remains available on the left stick. Right-stick aiming returns after release. Pointer + Q supplies analogous position intent. Old clients omitting analog axes retain legacy aim carry/drop; LB+fresh RT explicitly throws as before. RB still executes the selected power (Build must be selected); no button remap.

Stick axes are optional, finite-checked, normalized and clamped at authoritative input entry. Field radii remain135/235/335; desired center radius is bounded by field minus8 and a footprint-dependent holder-clearance minimum. Carry response/turn limits and gameplay hulls are unchanged. Actual carry can lag the target; this is not teleportation.

Release classifications use actual outward velocity relative to Jade, recent drive (<160ms), outward stick alignment, radial separation, and stick strength. Settled near or distant placement drops at zero velocity. Modest outward motion slides; strong outward motion adds a bounded mass-dependent impulse. Turning without pushing outward cannot fling. Slide speed cap240, fling cap720, then existing roadway friction. Propelled releases cost the existing6 battery, grabs4, hold3/sec. Insufficient battery safely drops. A release consumes simultaneous RT so there is no hidden shotgun blast; releaseRT before a fresh gun trigger. Charge, exhaustion, death, stale clients and round cleanup drop safely; carried fragment velocities also clear.

New heavy-cover shield contest: one initial collision per release consumes22% of the calculated cover-impact damage in shield battery (maximum22). Sufficient energy absorbs the hit and slows the object; insufficient energy passes proportional residual damage/momentum. This is a new explicit cover-impact cost, not an unrelated movement/weapon retune. Existing shotgun/matter/melee shield rules remain. No repeated full damage every frame, crush-pressure loop or shield parry added. Body contacts apply bounded knockback and the existing reaction limit. Cover impacts now generate confirmed contact events; a surviving projectile can retain55% velocity through a destroyed hull. Surviving obstacles stop normal motion. Breakage retains bounded reusable material and existing scars/effects.

Tether is magenta electrical ink from Jade's presentation anchor to the actual object, with a restrained PLACE/SLIDE/FLING cue. No new art, camera/projection/zoom change, weapon damage/spread/cadence, Kinetic Weave/movement retune, higher tier, hull or rail changes. Existing shield ellipse and carry poses remain unfinished.

## Bots and data

Bots use ordinary axes/LB release and normal costs. They alternate placement/slide/fling; arc phase can strafe through ordinary movement, then outward push waits for actual object motion/radius. Blocked manipulation recovers through the existing explicitRT throw after1.6 seconds. Successful throw events enable the existing follow-up. Approaching thrown cover can trigger a normal-cost shield window, followed by a confirmed-block counter. Bot strategy remains separate from shared combat.

Initial audits found early releases becoming accidental drops. Repaired bot readiness to require real outward progress; strong flings require greater separation. Final two300-second simulation sessions, swapped spawn positions:

| Setup | Completed rounds | Wins slots0/1 | Gesture drop / slide / fling | Throw→movement→shotgun-hit chains | Throw player contacts | All shield contacts | Recovery followed by movement |
|---|---:|---|---|---:|---:|---:|---:|
| Normal |10|9 /1|39 /25 /16|26|12|30|105|
| Swapped |13|10 /3|40 /18 /11|21|6|118|120|

Chains require activated throw, activated movement, and confirmed shotgun player hit within2sec; the thrown object need not itself hit. Counts are observations, not a fun score or proof of guaranteed combos. Shield totals include shots and other sources. Material conservation/caps and two constructs per fighter held. Rejected intents remain: reaction112/91, no eligible target16/16, cooldown or incompatible9/4. Strong bot-slot bias remains; not competitively balanced. No privileged bot damage/resources, automatic learning or human network performance inferred from footage.

## Verification

Automated: grip35 tests both slots across practice/duel and free roam: drop/slide/fling, settled far placement, normalized malicious/non-finite analog values, simultaneous release+RT arbitration, charge/exhaustion/stale/hit/low-energy cancellation, blocked nondamaging carry, one-hit shielding/residual health damage, break-through and bounded salvage. Native controller-reader fixture checks analog magnitude and unchanged button roles; it is not real hardware validation. Existing connections34, restoration27, integration31, economy30, combat26, three-cover25, fight24, spatial21, stage28, psychic29, spectator32 and matter33 pass. Psychic29 includes1500 identical frozen movement frames. Restoration27's RT fallback fixture now uses the new bounded1.6-second blocked-wait and an explicit fling style; shared contact assertions retained.

Visual: native-grip35 uses actual renderer and approved assets to capture actual ordinary bot arc/push/drop/slide/fling/shield events, plus both local-slot held-sedan views near camera edges. Dedicated directional carry animation is still missing; native ready-d00 proxy cannot certify all directional pose quality. Inspected grounding, tether registration, cover occlusion and held silhouette; existing crowded cover/vehicle deformation remain. No uploaded new footage or real-device inspection in this release.

Production build/typecheck and focused authenticated HTTP/SSE checks passed. HTTP35 verifies both independent slots carry sanitized analog intent and release, stale moving hold safely drops and rematch clears diagnostics. HTTP34 measures ordinary server activation under0/80/160ms imposed upstream delay, with existing privacy/stream/reset checks32/31/30/28. Final measured command→server activation was7–32ms with no imposed delay,87–94ms at80ms imposed upstream delay, and167–181ms at160ms;152/151 stream snapshots,8ms pair request RTT and maximum fixed-render-time interpolation shift.018world units. These are localhost tests, not controller-to-screen latency, WAN or iPad frame-rate measurements.

## Playtest and remaining work

Use the same website with ?watch=1 after exact Railway SUCCESS. Reload existing tabs, start a fresh watch session. Human controller assessment must test stick-pressure positioning versus placement/launch thresholds, neutral return timing, left-stick movement during Grip, and explicit RT fallback. These mappings are a prototype to evaluate, not a settled ergonomic contract.

Not implemented: sustained crushing pressure, manual shield deflection/parry, authored carry/wince/arm hardware, dedicated terrain tearing, higher333 tiers, new weapons, Unmake or transport/prediction redesign. Bot choice/side bias and occlusion need further work. Rooms remain in memory and a deployment restarts them. Never call a staged commit live until exact deploymentSUCCESS is verified.
