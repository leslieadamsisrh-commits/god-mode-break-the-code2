# Raptor 39T7.1 — standing and gait pilot
Date: 2026-11-05. This is a partial checkpoint, not completion of the eight-direction movement pass.

## Recovery
- Working branch: studio/39t7-standing-stalk
- Live code commit: f198fc0fc9d5f94508f1ec702436d4f040940877
- Railway deployment: a07e59dd-c42d-47cc-9521-1a77c41a797a (SUCCESS)
- Checkpoint: checkpoint/39t6-2-before-standing-stalk at 1e0d7716a1b682c682ae2ca15cb8cfe02da9d704.
- Only the Raptor playtest service was changed. Other releases preserved.
- User reconsidered headgear removal and explicitly chose to retain it. Keep crown gear/cable, anatomical right red optic and left amber eye.

## Installed inventory
| Direction | Standing | Stalk | Jog | Sprint | Slide |
|---|---:|---:|---:|---:|---:|
| Right | 1 | 4 | 4 | 4 | 3 |
| Front-right | 1 | 0 | 0 | 4 | 3 |
| Front | 1 | 0 | 0 | 4 | 3 |
| Front-left | 1 | 0 | 0 | 4 | 3 |
| Left | 1 | 0 | 0 | 4 | 3 |
| Back-left | 1 | 0 | 0 | 4 | 3 |
| Back | 1 | 0 | 0 | 4 | 3 |
| Back-right | 1 | 0 | 0 | 4 | 3 |

104 runtime paths, 72 unique SHA256 images. Legacy run paths remain 32 aliases of sprint. New standing artwork replaces all eight idle/recovery aliases. 16 new images in this pass: eight standing, four right stalk and four right jog. Existing sprint/slide art unchanged.

## Runtime
- Right-facing stalk uses a 60-world-unit stride; jog100; sprint120.
- Jog hysteresis95 entry/75 exit; existing sprint170/145 and alignment thresholds retained.
- Distance-based phase continuity retained through gait changes.
- Preloader and review enumerate actual manifest paths; absent stalk/jog directions explicitly display artwork pending on review.
- Raptor moving-facing threshold reduced to2 so light movement faces travel. Firing and slide orientation take precedence. Jade's55 threshold unchanged.
- Lab keyboard/touch pace selector provides25%,55%,100% input. Controller analog readings override these keyboard/touch values and are unchanged. Default remainsFull.
- Original slide timing, effects and39T6.2 input-edge preservation remain intact.

## Verification
- Production compile, lint/type validation and14 static pages succeeded.
- All16 new PNGs checked512x512, transparent border and SHA256 consistency.
- Actual LocalCombat tests: all8 sprint phase sets0/1/2/3, all8 slides0/1/2, moving-fire preservation and final idle passed.
- Actual LocalCombat pressure tests25/55/100% reach stalk/jog/sprint respectively and all4 phases.
- Selector regression: hysteresis, slide recovery, firing gait continuity, missing-direction fallback passed.
- Facing test: low-speed travel direction, firing aim, slide direction, unchangedJade passed.
- Fresh live lab displayed39T7.1. Review loaded104 paths and displayed all8 standing views.
- Normal keyboard/touch gameplay trace captured right stalk0,1,2,3; jog0,1,2,3; sprint0,1,2,3; slide0,1,2; stalk+fire0,1,2,3.
- Right slide effects remained visible and recovery selected new locomotion/standing.
- Physical controller unavailable. Frame trace proves painted frames, not complete visual quality. Full adjacent-turn, every-direction gameplay stop/recovery, and jog/fire matrix remain unverified.
- Browser hold timing was inconsistent; sustained touch input produced complete phase traces. Do not claim physical-controller verification.

## Artwork sources and acceptance
Right standing: exec-0217a61b-3a2b-448e-b898-5513ea00d2cb.png.
Right stalk: exec-38b7575c-f13d-4cc0-ae61-a6c93fc5cc93.png, cell order2,1,0,3.
Right jog: exec-6ff7a0f8-3df9-4cba-97e0-dd4d217a589e.png.
Left/front standing: exec-291b07b7-ba4d-4817-bb89-7d417467a360.png; front weapon corrected to face camera.
Front diagonals standing: exec-00c03da2-ca2f-4721-86b4-19bf1a94672f.png.
Rear standing: bottom-row rear3 only from exec-5bf23e86-580e-4633-9240-73528cf3089c.png. Top edge/camera failures elsewhere in that sheet excluded.
Rear alternative exec-35b9cfae-9756-447c-8cac-51b16d10bf27.png excluded due sole/foot presentation.
Left8-frame sheet exec-9c16cb09-48e5-4ab2-9f7b-61d6bcaddc28.png rejected.
Left4-frame sheet exec-caa35330-47d8-4f77-8dc1-850f0a2b8e87.png and targeted correction exec-5cb052ae-712f-4cd4-b2cb-073cb10c57d4.png rejected: contact phases retain same leading thigh; upper-body proportion consistency also requires review. Do not install them.

## Remaining work
1. Seven directions need4 accepted stalk +4 accepted jog frames each (56 minimum images). Left contact alternation remains the specific repeated generation failure. Other new slow cycles are not completed.
2. Dedicated acceleration/braking/slide-to-standing connectors, where playback needs them; current speed-family switching and old slide recovery are provisional.
3. Recheck scale/landmark continuity on all adjacent direction turns, especially standing into rear sprint. The standing sheet was inspected; this does not establish full gameplay visual acceptance.
4. Complete slide cancellation/fire/turn matrices through normal controls and physical-controller test when hardware is available.
5. Preserve approved identity and headgear. Do not pass repeated thighs or proportion drift merely to fill inventory.
6. Complete locomotion before cover expansion.

Build directive: docs/raptor-39t7-build-prompt.md.
