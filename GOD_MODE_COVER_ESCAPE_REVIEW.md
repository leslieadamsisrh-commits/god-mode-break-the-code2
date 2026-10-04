# Cover escape and deep review — current pass

This supplements the saved master prompt. The latest user instruction supersedes older battery-blocked escape rules. V142 Classic, approved art, camera, controls, multiplayer, .67145 charging and fresh-Y behavior remain protected.

| Input / state | Start / hold | Cancel / resume | Resource / distance |
|---|---|---|---|
| Soft cover, outward LS + fresh A | Immediate grounded escape | Held A does not retrigger | Base .55 speed + .45 * min(battery / slideEnergy, 1); spend min(battery, slideEnergy) |
| Soft cover, neutral/tangent/inward fresh A | Existing brace | LT exposure/retract preserved | Free, no escape cost |
| Braced cover, neutral/outward fresh A | Existing outward slide | Fresh Y cancels into recharge; hits remain effective | Same bounded escape rule |
| Braced cover, tangent fresh A | Burst -> step -> slide | Same existing interruption rules | Same scale across all stages |
| Braced cover, inward fresh A | Blocked into solid cover | Existing cover movement | No cost |
| Repeated A while escaping | No added burst during active stages | Normal movement/collision resumes | Existing durations/cooldown; .25 s attachment lock |

Default cost cap 12. Zero battery gives 55% existing speed, 6 gives 77.5%, 12 or more gives 100%. This avoids increasing approved full-power movement. Distance is proportional in unobstructed Classic travel; collision and subsequent input can shorten it. Global existing attachment lock is retained; different-cover capture works after it. Free roam slide/dash energy rules are outside this patch.

Source: shared lib/game.ts is used by client prediction and host. Regression cases cover all faces/rotations, low/zero/full charge, soft/braced intent, generated cover, held A, tangent stage continuity and escape-to-Y. 1,963 checks; 26 combat-chain stages; build pass. Engine/snapshot coverage is not physical controller or two-browser validation.

Artwork: approved d00/d03/d06 unchanged. Existing d03 psychic reach/hold/retract candidate remains review-only. Exposed cover/fire/recoil/retract and exit fallbacks need authored connectors; inspect approved sources before generating. Do not generate another sheet while existing approval is outstanding.

Future recordings: review full timeline, then motion around action handoffs at finer intervals. Record timestamp, observation, intended behavior, possible cause, reproduction and minimal fix. Separate speech, user-reported buttons, visible evidence and code-confirmed causes. Never infer input/latency/build identity from video. Audio transcription was unavailable; do not invent it. Prior sampled recording needs deeper review before further visual conclusions.

Next controller scenario after exact deployment/live verification: escape at low battery from soft and braced cover; compare travel with full battery; try neutral/tangent/outward/inward stick; then fire/retract/escape/Y/release. Report whether direction and shorter low-charge travel feel intentional. Higher tiers remain parked.
