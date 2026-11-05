# Raptor 39T5 integration checkpoint

Status: playable preview; NOT acceptance-complete.

Base: b513dac8dea33219132c81ae464c8c166188c491 (studio/39r4-39s-cover).
Recoverable checkpoint: checkpoint/39t-before-cartoon-run-slide.
Working branch: studio/39t-cartoon-run-slide. Target: existing Raptor character lab only.

## Installed inventory

| Direction | Sprint | Baseball slide |
|---|---:|---:|
| Right | 4 | 3 |
| Front-right | 4 | 3 |
| Front | 4 | 3 |
| Front-left | 4 | 3 |
| Left | 4 | 3 |
| Back-left | 4 | 3 |
| Back | 4 | 3 |
| Back-right | 4 | 3 |

32 sprint + 24 slide unique images. Run shares sprint images; idle shares slide recovery. 96 runtime paths. Every image is a 512x512 transparent PNG with per-frame anchor and SHA256. Installed counts are NOT accepted animation counts.

39T3 corrected rear-diagonal back equipment and opposing-leg pairs. 39T4 added optional Animation trace showing frames actually painted through normal gameplay. 39T5 corrects left low sprint and alternating legs using right cycle as pose reference while retaining organic left eye. No game physics or input mappings changed.

## Validation

PASS local frame selection: eight directions, four sprint phases, slide entry/hold/recovery, recovery-to-run, moving fire, stop, strafe.
PASS file checks: 96 runtime paths, SHA256, 512x512, alpha, anchors (39T3; left replacement uses same extraction pipeline).
PASS deployed 39T4 normal menu boot and asset preload; keyboard and touch movement respond. Painted-frame trace recorded sprint family in every direction.
PASS deployed 39T2 review loaded 96 paths with no missing Raptor image; later releases require fresh live recheck.

## Remaining acceptance work

- Front-left/front-right stride still favors the same leading thigh. Multiple correction sheets repeated the error; a single-pose attempt changed head/torso proportions and was rejected. Original provisional frames remain installed.
- Inter-direction scale, rear pair registration and all transitions still need sustained playback acceptance.
- Rear slide feet/contact orientation needs full gameplay assessment.
- Slow movement/strafe and idle borrow poses, not dedicated approved animation.
- Browser keyboard/touch attempts did not capture a successful full slide sequence in the painted-frame trace. This is unresolved, not a pass or proof the slide mechanics are broken.
- All eight slide/fire/cancellation scenarios and physical-controller testing remain unverified.

Do not describe this checkpoint as the completed requested release. Cover work has not begun.
