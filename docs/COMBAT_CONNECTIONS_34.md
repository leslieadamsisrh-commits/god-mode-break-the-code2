# Combat Connections 34

Parent HEAD and verified Railway SUCCESS: 6d0fc007b113c78be44691a29e1a028c748c4cac / deployment ee8e0106-aa00-473e-a844-0cbdd94d57a9. Same studio/live-app-three-section-01 branch, repo, service, URL and checkpoint history. Master untouched. No regenerated art, new weapon, new evolution tier, damage/cadence change, controller remap, movement retune, projection/camera change or hull/rail edit.

## Audit and shared changes

Compared current action flow with the existing earlier28/31 source copies and verified existing recovery tests. Kept the recovered throw edge/trigger consumption,120ms melee buffer, nearest swept hits, charge cancellation, cover transitions and defender reaction limit. Found the empty/failed Grip + RT path could become a shotgun blast. No verified earlier fix was available to port for that conflict.

LB+RT remains a psychic command even when acquisition fails or held matter vanishes. Direct keyboard throw/Orbit launch also consumes a simultaneous gun trigger. Release RT before the next fresh shotgun input. Added a single120ms shotgun tap buffer; normal readiness and unchanged cadence still gate execution. Charge, Grip, held/orbit matter, consumed trigger, expiry, death, stale client and round reset clear it. A tap made too early expires without firing; no damage modifier or extra automatic shot. Existing held-fire behavior remains.

Bounded128 authoritative action records: attempted, activated, rejected, buffered, cancelled, recovered and confirmed contact. Round/sequence/server wall time, reasons, object references and contact amounts. Per-round counts and observed battery loss, reset on rematch. Damage events now identify shotgun, cover throw, matter throw or melee source. This is instrumentation, not a new scoring or combo multiplier. Normal snapshots exclude the action ring/counts/energy totals; authenticated audit=1 GET returns them on demand. Closed-by-default COMBAT AUDIT panel provides last12 outcomes, measured input-request round-trip time and snapshot gap. These timings are not controller-to-screen latency. Successful deactivation is cancellation, not rejection.

Confirmed-hit HUD separates throw/melee labels from shotgun body regions, and aggregates only matching sources. Existing digital human dematerialization and bot metallic effects retained. Corrected obsolete director help to the actual frozen selectors.

## Bot behavior and observed failures

Bot follow-up windows begin after actual throw activation. Rejected construction triggers recovery; both AI and human construction use one shared placement check. Bots test legal open angles, then reposition if none fit, without spending resources or bypassing collision. Confirmed shield blocks enable counters; incoming projectiles can trigger a short normal-cost shield window. Exposed charging opponents invite pressure when energy and sightline permit. Recharge timeout caption no longer falsely claims full charge.

Initial spawn-swapped audit produced0–18. Fixed role scheduling to alternate by round and derive flank direction from physical relative position. Final five-minute sessions:

| Spawn setup | Completed rounds | Slot wins | Confirmed launch→movement→shotgun-hit chains | Throw hit events | Shield contact events | Recovery followed by movement |
| --- | --- | --- | --- | --- | --- | --- |
| Normal |14|8–6|19|27|42|120|
| Swapped |11|3–8|17|50|4|120|

Chain definition: successful throw activation, movement activation, then confirmed shotgun player contact within2simulation seconds; one count per tracked launch. Does not require the thrown object itself to hit, nor certify that the defender lacked an escape. Hit counts include individual authoritative contacts, not volleys. Final audits observed no rejected blocked-placement builds. Other rejection counts remain: no eligible target19/20, reaction76/75, other incompatible state1/0. The uneven shield counts and remaining side advantage are genuine AI/map debt; balance is not solved. Heavy/Pinball validated in targeted cases, not broadly used in these natural sessions.

## Validation

Both-slot actual Grip→throw player contact→boost→shotgun player contact, shield block→release→shotgun counter→boost capture of approved cabinet→A brace→Y recharge. Failed LB+RT cannot shoot even after LB release while RT remains held. Cadence buffer activation exactly once, too-early expiration and charge/Grip cancellation. Reaction escape, material ownership/caps and bounded effects. Combat26/economy30/integration31/restoration27/three-cover25/fight23/fight24/spatial21 and frozen Stage28/psychic29 checks passed. Restoration27 bot fixture phase adjusted for the new alternating strategy; grab/throw/melee assertions preserved.

Production build/typecheck passed. Two independent authenticated HTTP/SSE clients,0/80/160ms imposed upstream delay, both slots accepted once; final measured command-to-authoritative-activation9–23/86–93/166–173ms respectively. Pair request RTT8–11ms;151 snapshots each. Actual browser interpolation function, fed captured snapshots, shifted at most.003world units at the same render time when a new snapshot arrived. This is an interpolation correction measurement under localhost walk inputs, not prediction reconciliation, WAN performance, iPad latency or GPU frame rate. No network transport or prediction overhaul in this release. Authenticated diagnostic privacy, clean reset, stale input/time cancellation, private invite/countdown/stream and watch pause/reset/no takeover tests passed (HTTP34/32/31/30/28).

Actual renderer inspected:128 rotation/camera scenes,80 object cells and missing-art fallback; focused final field overlap/release, observed charge/formed/Grip/thrown bot states, throw-hit label, shield block, muzzle and recharge scenes. Approved ready d00 used as audit sprite proxy; not a full directional animation certification. No real-device/controller/two-device human validation this release.

## Remaining art and mechanics

Gripping actors still lack complete dedicated arm/carry poses. Shield is the existing ellipse rather than finished arm hardware. Vehicle surfaces can deform at some angles; salvage looks like atlas chunks. Camera framing and crowded cover can still obscure fights. No terrain tearing, new weapons, Unmake, higher tiers, first-to-three closure or reconnect persistence added. In-memory rooms and deployment/restart session loss remain. Defender control/cancellation regressions pass, but human feel and competitive balance require Les/James playtests. A staged SHA is not deployed until exact Railway SUCCESS is verified.
