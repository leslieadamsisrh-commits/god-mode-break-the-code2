# Defense & Feedback 43

Continuation of Living Matter42, parent `2f78895bb2c37a5f8508f2296c8032392a159bbe`. Candidate branch `studio/defense-feedback-43`. No reset, baseline replacement or deployment. The existing live branch is not advanced by this batch.

## Implemented

- Confirmed fighter impacts carry an optional incoming bearing derived from the impact vector, including thrown-cover shield contacts. This is event metadata, not new damage or targeting logic.
- Separate received-damage, successful-hit, own-shield-block, target-shield-block and active-cover-impact feedback. Received damage takes priority when exchanges arrive together. Incoming damage/shield arrows project the bearing onto the existing deck orientation; short text cues distinguish receiving damage from dealing it.
- Attached cover, or the nearest living owned cover within the player's actual psychic field, gets an intact/chipped/fractured/critical HP meter and escape reminder. Cover-impact audio attribution checks its rotated footprint. This meter is a nearby/attached-cover status display, not a guarantee that it blocks every incoming angle.
- Distinct synthesized sound cues with incoming left/right stereo placement where available. Sound can be disabled. Optional controller dual-rumble is off by default, throttled, and safely ignored when unsupported. Preferences are client-only.
- Combat Audit records a bounded window of 300 active frame intervals and CPU draw durations, with median/p95/worst intervals and counts above 33.34/50ms. Session/round changes reset it; inactive and hidden-tab intervals are excluded. Supported browsers also report active-session long tasks. Refresh Audit to take a current snapshot.
- Corrected controller help to match Combat42: Up gun, Right cover shape, Down power selection, Left field size; X executes the selected power; RB remains direct cover. No controller remapping in this batch.
- Runtime build identifier is `COMBAT-MASTER-STUDIO-43`; this identifies running code, not proof of deployment.

## Preserved

No cover durability/cost, staged fracture geometry, attachment/escape, controller action, camera, local fixed60Hz clock, transport, Jade artwork, matter ownership, resource or human dematerialization changes. Source42 movement authority remains walk 222.7, boost 430/.16, slide 490/.50, double tap .28, approved Weave steering/sustain and Kinetic Brake, charge easing .67145. Fresh Y priority, freely interruptible charge and aim/battery-independent escape remain intact.

The new batch makes defense readable; it does not make cover stronger, stickier, introduce separately failing panels or implement remapping/accessibility menus.

## Validation

PASS: defense43, living42, cover41, local40, melee38, connections34, grip35, grip36, integration31, combat26, TypeScript and production build. An 1,800-frame frozen simulation comparison against exact Combat42 passes, with matter present; the old test prints its historical 37B label even when the supplied reference is42.

Native rendering checks six actual production HUD fixtures: damage left/right/above/below, shield block, critical cover. The sheet was visually inspected. This is not a real-controller or full-arena playtest.

HTTP38/42 run against the production candidate locally with an explicit43 build expectation. These check authenticated two-client protocol/action behavior, not Internet latency. Historical matter33 retains its previously verified stale forced-heavy-selection failure and is not represented as a green full suite.

Commands from repository root:

```sh
node tests/defense43.cjs
node tests/frozen38.cjs PATH_TO_EXACT_COMBAT42_GAME_TS
CANVAS_MODULE=PATH_TO_NATIVE_CANVAS node tests/native-defense43.cjs OUTPUT_DIR
npm run build
GOD_MODE_EXPECT_BUILD=COMBAT-MASTER-STUDIO-43 node tests/run-http42.cjs
```

Native rendering requires the same native canvas module available to the other native tests, or `CANVAS_MODULE` pointing to it.

## Device acceptance still required

On iPad/controller: verify bearing readability in the full arena; distinguish received damage from outgoing hits; shield against shots and thrown cover; build/attach/escape with RB/A/left stick, including empty battery and aim away from cover; check simultaneous Y/X; review sound and opt-in vibration availability. Record Combat Audit after representative sustained combat, then repeat a private duel with James.

Frame interval measurements are browser scheduling observations. CPU draw timing excludes GPU completion and is not input-to-display latency. Long-task support is browser-dependent. No iPad FPS, physical vibration/audio quality or multiplayer latency improvement is claimed.

Deployment is left to the user. Do not treat this candidate as live without verifying the served build identifier.
