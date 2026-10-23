# Build 23 — close framing and scale correction

Starting remote authority: `studio/raptor-combat-lab-01`, `c2d7415c80559da325bef471d9631141e514ff2b`.
Starting Railway SUCCESS: `aba455f9-9ee9-44ef-8244-205728880215`, same SHA.
Remote rollback: `studio/build23-rollback-c2d7415`. Local checkpoint `6337bee` is a partial source snapshot, NOT remote ancestry. All four edited pre-existing runtime files matched the remote blob hashes before editing. Publish against the complete remote tree.

## Implemented

- Close camera 3.40–3.60, formerly 2.65–2.77; default camera envelope retained. Existing smoothing, projection, aiming, movement and combat rules unchanged. Close target looks 22 world units farther along depth to raise feet above bottom HUD.
- Corrected horizontal camera clamp using the projective floor Jacobian. The old `500/zoom` assumed one screen unit per world unit and exposed large flank margins.
- Canvas fits its parent at 1000:620 instead of CSS stretching. ResizeObserver updates actual element dimensions; existing bounding-client-rect pointer conversion therefore remains correct. Letterboxing is intentional. No device verification claim.
- Concrete face mapping follows each object's long axis. The 118-unit shelter side previously stretched the narrow end-face material. Existing hulls, rib silhouettes and rotation behavior preserved.
- Floor material modules 40×27, previously 80×54. Narrower flank casing and center grating strips, finer joints, restrained cyan/magenta spill. Same generated floor image feeds existing floor sampling; no physical floor cells or matter changed.
- Decorative architecture alpha .48, formerly .68. Existing positions, anchors and silhouettes retained. No new traversal or protection implied by added geometry.

## Measurement and comparison

Matched renderer fixtures use 1000×620, the same fighter poses and world locations. Videos use uniform 500×310 output. These are not stretched iPad captures.

| Quantity | Build 22 | Build 23 |
|---|---:|---:|
| Zoom with fighters 200 world units apart | 2.71 | 3.50 |
| Body screen height, approximate helmet-to-feet landmarks in the ready-d03 fixture | 118 px | 152 px |
| 32-unit low cover vertical rise, excluding footprint depth | 55.5 px | 71.7 px |
| 78-unit full cover vertical rise | 135.3 px | 174.7 px |
| Floor material module | 80×54 world units | 40×27 world units |

Body height is a visual estimate excluding effects, labels and weapon extension. Cover rise is calculated from unchanged vertical projection. Ratios to the fighter are preserved; zoom does not repair a bad hull. Local visible floor area is approximately 60% of the former area at the same depth (projective area varies across the viewport).

Tall anchored shelters remain 34×118×78. Industrial node hulls remain 48×58×78. These are legitimate full-height obstacles, not waist cover. Changing their dimensions/topology needs a separate gameplay decision. Their current narrow silhouettes remain a visual limitation.

## Recovered evidence and asset limits

Reviewed the October 22 recording's frame contact sheet and recovered both October gameplay recordings and the fight JSON. The JPEG approved environment sheet and six historical source/reference packages are present. The exact filename `a_wide_detailed_sci_fi_game_asset_atlas_poster_in.png` is not available locally. Existing eight map20 runtime atlases and frame/registration manifests were reused; no new sprites were generated or promoted. Reference regions and candidate directions remain unvalidated where not already in runtime.

The illustrated helmet HUD seen in the recording was not found in the current remote asset tree or recovered files. HUD artwork restoration is BLOCKED, not completed. Existing truthful shotgun/power/field/shape cards and throw prompt remain. No replacement portrait or fictional weapon added.

## Verification scope

- Production build and type checking: PASS, 12 routes.
- build23: PASS close encounter visibility at center/flanks/north/south, >25% zoom increase, inverse aiming, preserved default target, correct long-side material selection, missing-material/floor-panel fallback, viewport aspect ratios including 732×510 and tablet-shaped viewports.
- build22: PASS held-selector/reconnect behavior, slide/action invariance, attach/traverse/escape, impact contact, API two-client auth/public snapshots/selection/stale input/rematch.
- floor46: PASS matter lifecycle and reset, 24 screen-stick rays, 3969 projection inverse points.
- scale47: PASS shared upright/cover height and anchor registration.
- Actual renderer still captures: center, north, south, east, west, matching-depth scale, held/thrown, damaged/destroyed and missing-assets fixtures. Jade ready-d03 only; this does not verify every animation or Raptor asset.
- Motion harness: identical scripted render-state route, spawn → north approach → center → east flank → holding → release. Actual Game.tsx drawing and camera follow. It does NOT simulate player input/collision and does NOT prove controller feel, attachment, impact timing or iPad performance. Headless frames, not browser video.
- Both 12-second sequences captured at 20 fps; candidate sampled frames inspected as a contact sheet. No real-time motion audition claim. Existing protective cover still legitimately occludes fighters; eastmost edge retains some perimeter background. This is an incremental framing improvement, not a completed immersion sign-off.
- Live Build 22 browser inspected: menu through arena, rendered scene and canvas bounds. Observed canvas 1400×868 presented at 1363×834. No physical controller available. Browser motion/gameplay verification of the candidate remains outstanding until deployed.
- No two-browser multiplayer session, real network quality, sound or physical-device test claimed. Existing API tests are narrower than these checks.

## Remaining work

Restore the approved helmet artwork when its source is recovered. Validate the closer camera on the user's iPad/controller in active combat. Review shelter geometry separately if it still dominates routes. Decorative perimeter scenery still has cutout-like transitions at some angles; this pass improves framing rather than claiming a complete environment reconstruction. The live menu still labels the arena Bay Bridge and lists Dimension 33 as development; retained as an existing product-flow issue. Multiplayer character identity/animation and full match-flow/device testing remain outstanding.

Deployment status and final commit must be reported from observed Railway/GitHub results; this file does not assert deployment success.

## Exact source files changed

`app/Game.tsx`, `lib/combatPresentation22.ts`, `lib/combatViewport23.ts`, `lib/dimension33MapArt20.ts`, `lib/dimension33Registration21.ts`, `tests/build22.cjs`, `tests/build23.cjs`, `tests/render21.cjs`; plus this report and the 13 evidence files in `art/dimension33/build23-evidence/`.
