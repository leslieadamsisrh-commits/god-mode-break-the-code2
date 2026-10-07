# GOD MODE — Bay Bridge Fight Night 23

Continue only on studio/live-app-three-section-01 from Ink 22 (1fc1bb5b11cb98ffa62a2e59bc945c18e04cb28f). Same repository, Railway service and URL; master and checkpoints preserved.

Release brief: use approved assets; deepen the shared deck projection; keep fighters upright and ground, contacts, shots and effects registered; preserve ink weights and combat center. Restore private two-player room flow, local slot ownership, both visible fighters, HP/battery/score, host start and rematch. Preserve Kinetic Weave, combat configuration, Jade, zoom 1.85, controls, hulls, rails and multiplayer authority. Audit visually and technically, build, commit, deploy the exact SHA, stop for device playtest.

## Implemented

- Shared ground pitch .35 → .52, slight diagonal .08, inverse pointer conversion updated. Upright compensation cancels both ground pitch and slope. Camera travel adjusted after near-right clipping in first native audit.
- Approved bridge span follows the same ground transform; no asset generation or art style change. Existing ten actor rigs retain screen-consistent ink contours.
- Prototype matter outlines restrained; hit events render a bounded metallic cyan/rose impact spray, without changing damage.
- Explicit duel mode starts in lobby, supports private room ID/code, two human tokens, host start, round winner, retained wins and host rematch. Solo/bot combat behavior preserved.
- Client aims and controls its authenticated slot, renders both fighters with separate pose-cache IDs and cyan/magenta labels, and clips each against its own attached cover. Guest reload restores through authenticated GET instead of host-only config.
- Compact collapsed private-room panel; duel health, battery, score and phase HUD.

## Verified

Native actual Canvas renderer: 128 full-scene actor-rotation/camera cases, 80 actor cells, missing-art fallback, and both local perspectives of a two-fighter scene. The native sprite fixture is approved ready d00 reused for directions; it does NOT certify every animation or controller device.

API handler tests: create/join, wrong/full room rejection, token isolation, guest movement, host config/start/rematch, lethal shotgun completion, health reset and retained score. Action tests: soft A brace, LT exposure planting, retract and outward escapes. Frozen comparison: 1800 exact state comparisons against deployed prior baseline. Loading fallback tests and production build pass.

## Remaining defects / limits

- Not the complete combat suite: baseline melee currently emits FX without damage; free shield drains energy but does not block shotgun hits. These are verified defects, not repaired by inventing new balance in this visual/duel release. Free-shield planting, parry and several unbound powers need restoration against an approved mechanical reference.
- Vehicle faces remain stiff at some angles. Far bridge/bay visibility narrows significantly when traveling to near deck edge; composition still needs authored camera-window treatment. Generated cover still uses legacy artwork.
- Both fighters use approved Jade art with identifying labels; no second character artwork invented. Native audit does not validate real-device latency, all moving cover poses or every approved directional atlas.
- Rooms live in one server process and disappear on restart/deploy. Multi-replica persistence has not been added. No real-device two-player validation performed here.
