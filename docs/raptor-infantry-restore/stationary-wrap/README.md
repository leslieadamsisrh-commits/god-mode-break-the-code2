# Stationary wrap production trial

The six stationary frames were promoted to the isolated Character Lab in commit `da1c330`. The notes below describe the original local trial and how it was verified. See the [directional cover pass](../directional-finish/README.md) for the current activation status.

This is the first production sprite batch from the approved left/right wrap storyboard. It starts from restoration commit 14865675eed771d8cadad8be2d4f620489531baa. The isolated service was verified on 39T14 / 2b64e2d09714ae15899c5399545da29b464f7c56. The runtime manifest remains byte-identical to the parent. The code and assets here can be reviewed without enabling an unfinished family.

- Six full-body 512px RGBA frames. The two inked masters provide the aim poses. Each side has an independently authored tuck and pivot. The pivot reverses on retract while the support foot retains its frame-relative placement.
- One isolated steel art source. The existing section renderer projects its front, end and top onto the actual cover prism. Existing geometry still determines occlusion and ballistics. The trial texture applies only to complete, settled tall walls and leaves psychic-held, fractured and reshaping cover on their current paths.
- An incoming travel heading is recorded on contact before velocity is cleared. Catch art keys to that heading, hold/shuffle to the attached face, and aim to the reachable endpoint and aim sector. A trigger during the short visual pivot immediately selects the aim frame. The displayed firing barrel, physical clearance and shot effect share the same registration.

## Reproduce locally

Use a disposable checkout of this checkpoint. From another checkout run:

```sh
node docs/raptor-infantry-restore/stationary-wrap/stage-local.cjs /path/to/disposable-checkout
```

Build that checkout and open `/studio/character-lab`. Z or LT requests a peek at a braced edge. T or RT fires. The install script intentionally refuses to modify its source checkout. Use `node tests/check-raptor-restoration15.cjs` from the unmodified checkpoint to run the fixtures.

## Direction coverage

| Family | What this checkpoint enables locally | Remaining authoring gate |
|---|---|---|
| Catch | Incoming heading verified in real slide capture in all eight buckets, including a different protected facing | Connect each inked incoming pose to the new cover hold |
| Hold and shuffle | Prior 39T14 coverage remains available, with two trial stationary tucks selected near reachable endpoints | Match the protected face, rear crouch depth and stride to the inked model |
| Tall wrap | Independently drawn left and right tuck/pivot/aim, reusing pivot during retract | Approve the in-game peek silhouette and extend to other reachable aim sectors |
| Low pop | Prior restoration registration tested through the same engine tick | Complete the directional inked low-cover family |

Cover face and aim direction are independent. A rotated wall can select the same aim direction from the opposite local endpoint. A wide wall can host both ends on one face. Tall-center aim remains blocked. This checkpoint contains no availability expansion in the shipping atlas.

## Verification and remaining release gate

The corrected left and right tucks draw the lowered barrels farther inboard while keeping the support-foot registrations. The focused regression projects the painted muzzle into the actual cover face masks and checks that the tucks conceal it and the aim frames clear it at three rotations and four distances from the edge. Cover is drawn separately on the projected steel faces.

The local Chromium character lab exercised tuck, pivot, aim, fire and retract at both ends of one tall wall, then repeated the exchange at 15° and 180°. The attached actor and wall stayed fixed during stationary aim. The same run exercised shuffle and stop, low-cover fire and release, and verified that tall-center fire consumed no shell. A normal-speed bot round and rematch used scripted keyboard input with all 96 Jade atlas entries loaded.

The production build and the restoration, cover contact, shared-cover and psychic checks pass. The two lateral stationary sequences are ready for isolated review through the staging script above. The wider directional set remains in authoring and the shipping atlas still uses the existing frames.

## Continuation checkpoint

The continuation starts at verified branch tip `e30ee7c58774fef698285a2a1261459d4c7d62bf`, two commits past the preserved `14865675eed771d8cadad8be2d4f620489531baa`. Railway reported successful deployment `abb5a3b3-5b17-463b-987d-12d67f5a36bb` of 39T14 (`2b64e2d`) on the isolated Character Lab. The playtest route returned HTTP 200.

Local verification on the staged 39T15 lab passed both endpoints at 0°, 15° and 180°, tall-center blocked fire, waist-cover fire and retract, and shuffle and stop. Attached roots and wall transforms were checked through aim and fire. A normal-speed Raptor-versus-Jade round finished and rematch reset with all 96 Jade atlas entries loaded. The six focused cover test scripts and the psychic-cover script also passed.

A short face can make both local endpoints reachable. The connector now follows the endpoint chosen by aim, including the farther end. Shuffle speed reports actual travel after the rail clamp, and a Raptor shot is gated by the selected frame's actual muzzle clearance. The lateral sequences are available via the local staging command. The eight-direction art stays in [directional review](../directional-ink-review/README.md).
