# GOD MODE — Two-Jade Multiplayer Vertical Slice

Target: Jade Cyan vs Jade Magenta, one shotgun, finished cover, core psychic kit, one arena.

## Host authoritative
Player transform/velocity, aim intent, slide/cover attachment, cover topology inputs, shots/hits/damage, knockback, battery, power eligibility/results, destructible gameplay state, death/reset/round score.

## Local presentation
Animation frames, upper/lower compositing, camera, trails, SKEET/SKURT, cosmetic debris, non-gameplay particles, interpolation.

## Network rule
Never synchronize sophisticated animation as gameplay state. Synchronize decisions/results; reconstruct presentation locally.

## Hardening checklist
Prediction/interpolation; reconciliation under latency; aim/shot timestamp handling; cover attachment consistency; power target ownership; destruction consistency; room code/link; first-to-three; rematch; reconnect/error handling.

## Character scope
First prove identical gameplay skeleton with cyan/magenta Jade. Only after stable multiplayer freeze Character Architecture V1 and introduce the reptilian as the first genuinely different fighter.
