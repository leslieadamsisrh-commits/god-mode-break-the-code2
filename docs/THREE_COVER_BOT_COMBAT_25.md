# Three-cover bot combat 25

Parent: Fight Night 24, 0a09012de195c50a8e43cfcecf74dfe115e9affe. Same branch, repository, Railway service and URL. No source asset regeneration. Master/checkpoints untouched.

## Delivered

- Accessible THREE-COVER BOT BATTLE action inside the existing fight panel. New practice mode uses duel shield, planted stance, melee, health, winner and rematch rules. Private duel still uses all ten existing actors.
- Practice starts with approved sedan, cabinet and Jersey barrier and no loose pickups. RB-generated cover uses the approved Jersey family and its hull/rails/render/occlusion metadata; generated IDs remain unique.
- Grip and throw retain existing controls. Carry translation/rotation and release speed use existing actor mass metadata in fight modes; player Weave settings stay fixed. New throw impacts use speed and mass, capped at 100 damage. These new interaction values need playtest/balance approval.
- Substepped throws check players, held shield, boundaries and cover. One impact per object/player per flight; impact reduces momentum. Object collisions damage both objects; player impacts damage the thrown object as well. Held shield consumes the existing energy drain and absorbs contact.
- Pellets damage intercepted cover in practice/private duel. Breaking cover releases attached/held/exit references, removes its hull and produces stone/metal matter (up to 18 per break, total cap 64, 5-second lifetime) plus 38 visual fragments. Fragments use the existing Grip/matter system.
- Bot sidesteps blocked firing lanes, approaches/backs away and occasionally shields incoming fire. It is a simple sparring bot, not tactical cover AI.
- Vehicle roof longitudinal UV follows its side/rib coordinate; full rotation reviewed. Small integrity strip appears on held or heavily damaged cover. Existing shared ground projection and approved Jade scale remain intact.

## Verification

- Focused test: all three objects at four rotations; brace, LT, retract, Grip, throw, player hit, shield absorption, one hit per flight, object impacts, pellet breakage, reference cleanup, debris cap, reset and active bot.
- Existing private-room ownership/score/rematch, duel shield/melee and cover-action tests pass. 1800 exact comparisons preserve the solo baseline's Weave/Grip/fire/power behavior. Frozen combat values unchanged.
- Production HTTP test: practice creates three covers/no pickups, bot moves after countdown, private duel still creates full arena and accepts guest.
- Native actual renderer: 128 scene cases, 80 actor rotation cells, both local duel perspectives, practice intact/held/damaged/broken scenes and missing-art fallback. Approved ready d00 audit sprite is reused; this is not a certification of every directional animation or moving cover pose.
- Production build passes. Deployment status must be verified separately against exact committed SHA.

## Remaining defects / limits

No real-device controller or network playtest performed. Some end-on vehicle faces are still stiff; moving cover-pose foot registration and near-edge bay framing remain unresolved. The integrity strip and breakup work, but intermediate dents/crack art is not a full damage atlas. Ground-plane carry has no new vertical lift animation. Debris uses bounded polygon material fragments rather than authored atlas fragments. Bot has no strategic cover/Grip behavior. No new combos, unbound controller powers or weapon wheel. Rooms remain in process memory and disappear on deployment/restart.
