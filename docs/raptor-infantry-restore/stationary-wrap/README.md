# Stationary wrap production trial

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

The local Chromium character lab ran the complete tuck, pivot, aim, trigger, pivot, tuck sequence at both ends of the same tall wall, then at 15° and 180°. The physical wall transform and attached actor root stayed constant through every sequence. Tall-center fire consumed no shell. At the normal gameplay camera the latest placement exposes the amber eye on the left and the red optic on the right while the wall conceals most of the body. The steel no longer shows a diagonal triangle seam. The right tuck still shows the lowered barrel tip beyond the straight wall at an inset of 12 world units. The art correction must preserve both feet while pulling that silhouette farther inboard.

A browser run completed a real Raptor-versus-Jade bot round and rematch with all 96 Jade atlas entries loaded. A repeat after the final anchor adjustment also finished, but the external Jade host supplied only 37 entries on that run. Both builds used the existing combat speed, with keyboard input automated for repeatability. The candidate files, eight actual diagonal catches and shots from registered muzzle positions pass the focused tests. Production build and the shared cover, contact, and psychic regressions passed. The standalone art set is still limited to the lateral stationary wrap pair. It is suitable for local review, with the right tuck and the remaining inked directional families still open for release.
