# GOD MODE — cohesive combat plan
Saved 2026-10-03 20:23 PDT. Planning checkpoint, not an implementation claim.

## Saved prior direction
Complete immediate movement-to-charge transitions using approved Jade and V142 Classic as the foundation. Reuse existing poses, prove a full chain in one approved direction, then expand missing directions in small reviewed batches. After the foundation passes, prototype one higher-power movement profile in the lab: acceleration, braking and controlled left-stick arcs together. Ordinary 0–100 movement remains the approved base; exact future tier thresholds, retention and drain remain undecided.

## Latest user steering
Consider running, sliding, cover, shooting, psychic cover creation and psychic manipulation together. Do not prioritize speed in isolation. User has authorized gameplay/artwork evolution, but this turn requests saving and formulating the overall plan before turning it into a build prompt.

## Recommended immediate milestone: one complete combat loop
Run -> slide into cover -> move along cover -> aim/fire -> create cover -> grip/reposition/drop or throw cover -> move to the changed cover -> charge from retained battery -> release -> resume combat.
Test short links independently and then the full chain, including interruption, neutral stick, changing direction, hit/knockback, battery depletion and repeated use. Preserve every existing control and the distinction between soft and braced cover. Test carrying plus movement, cover generation interrupted by another action, and dropping versus throwing. Define any currently unsupported combination before implementing it; do not silently introduce new simultaneous abilities.

1. Audit actual current behavior and input priority across the complete loop. Record what works, what conflicts, and what is unsupported; fix reproduced blockers in small patches rather than rewriting the engine.
2. Use the existing lab to exercise one static cover and one created/movable cover with a sparring opponent. Preserve studio tools, camera, combat scale, collision and cover occlusion.
3. Resolve action handoffs explicitly: when each input starts, continues, cancels, or resumes; what happens to held matter and created cover; how energy and gun return behave. Animations must not delay control response.
4. Build connecting artwork alongside those verified handoffs. Prove one direction first; retain approved d00/d03/d06, helmet, face, equipment asymmetry, cape, proportions and detail. No mirrored or rotated direction substitutes. Show missing-pose candidates before installation.
5. Keep effects subordinate to combat readability: Jade silhouette, muzzle, cover contact and moving-cover path must remain legible. Preserve SKEET/SKURT!, Kinetic Echo and existing powers; refine only effects demonstrated to obscure this chain.
6. Check the completed loop in local/host behavior and multiplayer representation so manipulation, release and collision agree. Do not claim physical controller or network validation from automated checks alone.
7. Run relevant regression checks and production build; deploy to the existing Railway service, confirm exact-commit SUCCESS and live behavior, then request the focused controller playtest.

## Next segment
After the base chain passes: expand directional continuity and prototype a single higher-power movement profile using the same combat loop. Increase control with speed, preserve vulnerability and readable grounded collision, and settle progression/battery rules before additional tiers or bulk artwork.

## Protected scope
V142 Classic plus already approved adjustments remain mechanical authority. Charging movement scale stays 0.67145 with existing easing; hold Y charges, release activates; preserve immediate fresh-Y recharge, retained battery, expiry/depletion fresh-press latch, corrected weapon return and roughly 12-second current full window. Keep existing psychic abilities, combat animations, camera, controllers, studio tools and multiplayer. No new tier implemented by this document; no broad refactor, redesign, invincibility, reload system or unrelated feature.
