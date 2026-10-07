# Combat Feel 26

Base: c74cab67d6702087134b1730c1128e0eb35de55a (Three-Cover Bot Combat 25).
Branch: studio/live-app-three-section-01. Same existing Railway playtest service. Master untouched.

## Behavior

- Default health 420. Fully connected seven-pellet torso blast remains 70 damage: six blasts. Existing shotgun cadence .39, spread .04, speed 820, God multiplier 1.35 unchanged.
- Practice/duel shots sweep their path relative to target movement against low, torso, head columns. Heights follow sprite scale, slide/crouch, and raised LT brace exposure. Low .75, torso 1, head 1.25 damage modifiers. Default muzzle height still targets torso; no new elevation control or aim assistance.
- Nearest cover/player/shield impact wins, with cover winning exact ties. Cover uses unchanged rotated gameplay footprints and existing authored height; exposed fire retains own-cover clearance. This is a simple gameplay volume, not per-pixel silhouette collision.
- Shield intercepts on a larger radius ahead of body contact while existing shield/battery rules apply. Damage and block events are server-authored, sequenced, round-tagged, capped at 64. Presentation deduplicates audio events and suppresses stale history.
- Confirmed hit-region/damage HUD feedback, body recoil/brightness reaction, digital impact shards, separate stone/metal sparks, and shield ring. Quiet synthesized feedback cues unlock through a browser gesture; device audio is not certified.
- Centered 3/2/1, FIGHT, FINISH, round outcome. Countdown allows neither simulation attacks nor queued action edges. Held fire may fire after FIGHT, as intended. Host-only next round retained.
- Lethal step resolves all contacts for that step, allowing mutual lethal draw. One score and finisher event. Finisher runs 1.25 wall-clock seconds, eases 100% to 92% over .35 seconds, advances aftermath motion/effects/debris without accepting attacks, then settles. Remaining flight shots are cleared at the lethal step; no post-round damage. Client X slow-time does not alter finisher timing.
- Human death remains digital dematerialization with moving chunks, not graphic gore. No non-human fighters are introduced; approved non-human metallic-fluid concept is not replaced by human blood.
- Adapted current HUD into a restrained helmet brow, magenta/cyan ear ports, player/opponent health/battery/wins, critical edge flash. Original C3 production assets are absent from this checkout; this is an adaptation of its layout, not a claim to have recovered them. Screen-space HUD shares the actual Canvas renderer. Accessible text status retained.
- Shotgun shows infinity rather than a false EMPTY state. Underlying counters are retained, but reload gating remains unimplemented.
- Rematch clears events, transient effects, shots, debris and finisher state; restores both players to configured max health. Existing cover, Grip, shield, bot practice and private multiplayer retained.

## Validation

Automated passed:
- combat26: low/torso/head, raised LT exposure, swept fast and moving-target hits, nearest collision ordering, shield/empty battery, six blasts, countdown gating, simultaneous lethal draw, one finisher/score, continuing aftermath, 92% endpoint, host/guest rematch, event cap, actual seven-pellet blasts at all eight directions.
- fight23 API handlers: two clients, private code/token ownership, guest-only movement, host configuration/start/rematch, lethal finish and retained score.
- fight24, three-cover25: existing action fixtures explicitly use 100 health to preserve their damage assertions; production default separately tested at 420.
- spatial21: 81 projection inverses, 32 cover/brace/LT/escape sequences, 320 occlusion transforms.
- bay-production: frozen constants, 2400 host frames, 5120 actor texture triangles, 320 concealment transforms and missing-texture geometry.
- compare-frozen against engine 25: 1800 exact solo states after normalizing the intentional health change and excluding added event/round presentation metadata. This verifies unchanged movement paths, not every new multiplayer behavior.
- late-art: bounded boot / timeout / late art recovery.
- npm run build: production build and TypeScript validation passed.
- http26 against freshly built local production server: 420 health, three-cover practice, private guest slot, countdown/input, sanitized snapshots, page/local assets.

Visual inspection:
- Actual renderer with approved ready d00 sprite: 128 camera/rotation scenes, 80 actor rotation cells, both local multiplayer slots, practice intact/held/damaged/broken and missing-art fallback.
- Additional six representative round/impact/finisher/winner views and standing body-region overlay inspected. Phase review panels are controlled fixtures; real phase transitions are covered by engine and HTTP tests.
- Native Canvas inspection is not Safari/device testing. Uses ready d00 as sprite donor for other directions; does not certify the full animation atlas or physical controller.

## Remaining defects / balance debt

- At 420 health, unchanged B melee takes 42 successful contacts. Full God torso blasts take five; all-low eight, all-head five. Throws are mass/speed-dependent and capped at 100 damage, so require at least five maximum-damage hits. Cover durability remains 140/180/210, so cover breaks earlier than fighters. These are reported differences, not silently retuned.
- Body volumes approximate pose families. Full authored directional wince/death animations and exact sprite/collision calibration for every pose remain unfinished.
- End-on vehicle stiffness, moving-cover grounding, narrow far-bay window, strategic bot cover/Grip decisions, full C3 asset recovery, reloads, and deeper combo rules remain debt from prior passes.
- Existing in-process private rooms are lost on service restart/deploy; no replicated room persistence added.
- iPad controller, Safari audio, latency, and human multiplayer feel require real-device playtest.

Deployment is recorded separately after exact commit status verification. Never treat local build success as Railway SUCCESS.
