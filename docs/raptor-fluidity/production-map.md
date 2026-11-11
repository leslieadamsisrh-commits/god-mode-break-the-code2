# Raptor fluidity production coverage

The cover master defines the Raptor throughout the current combat kit. Every phase below is tracked in `coverage.json` for all eight body directions. Existing files still require a design audit before they qualify as matched production art.

The baseline has 260 runtime files. This map has 534 coverage slots, including existing art and deliberate reuse. These totals measure different things. The earlier 90–130-frame target is the first priority pass, and the map also records the later work needed for the complete kit.

## Design lock

- Use the live olive right cover crouch for snout, jaw, arm and leg lengths, lean musculature, stripes and scale. Use approved left and right peeks for ink and cel shading.
- Keep the original twin-barrel shotgun, stock and two-hand grip, worn angular armor, compact two-cell rear housing and connected cables.
- Anatomical left has the amber eye. Anatomical right has the red optic and housing. Front view puts that optic on the viewer’s left. Side views are independently authored.
- Export full-body transparent 512-pixel cells. Record ground/root, support foot, pelvis, scale, muzzle and muzzle ground projection. Both eyes, the grip and the equipment must agree between adjacent frames.

## Complete core coverage

| Family | Required phases per direction | Slots | Existing file candidates | First priority |
| --- | --- | ---: | ---: | --- |
| ready | neutral, breath | 16 | 8 | P2 |
| turn-clockwise | weight-transfer, foot-plant | 16 | 0 | P1 |
| turn-counterclockwise | weight-transfer, foot-plant | 16 | 0 | P1 |
| movement-start | push, first-contact | 16 | 0 | P1 |
| stalk | left-contact, left-pass, right-contact, right-pass | 32 | 32 | P2 |
| jog | left-contact, left-pass, right-contact, right-pass | 32 | 32 | P2 |
| sprint | left-contact, left-pass, right-contact, right-pass | 32 | 32 | P2 |
| movement-stop | brake, settle | 16 | 0 | P1 |
| moving-fire | left-contact, left-pass, right-contact, right-pass | 32 | 0 | P2 |
| slide | entry, hold, recovery | 24 | 24 | P2 |
| slide-recovery | weight-under-hips, first-contact | 16 | 8 | P1 |
| jump | push-off, ascent, apex, descent, landing, recovery | 48 | 48 | P2 |
| cover-catch | impact, compress | 16 | 2 | P1 |
| cover-hold | protected, breath | 16 | 8 | P0 |
| cover-shuffle | left-plant, left-transfer, right-plant, right-transfer | 32 | 6 | P1 |
| cover-corner | hip-pivot, shoulder-turn | 16 | 2 | P1 |
| cover-raise | half-raise | 8 | 2 | P0 |
| cover-aim | aim | 8 | 0 | P0 |
| cover-fire | recoil, settle | 16 | 10 | P0 |
| cover-lower | half-lower | 8 | 2 | P0 |
| cover-exit | release, first-contact | 16 | 8 | P1 |
| free-fire | ready, recoil, settle | 24 | 0 | P2 |
| hit | impact, yield | 16 | 0 | P3 |
| hit-recovery | recover | 8 | 0 | P3 |
| defeat | loss-of-balance, fall, rest | 24 | 0 | P3 |
| tall-wrap | lateral tuck, pivot, retract | 6 | 6 | P0 |
| aim-between | ready, recoil, settle at each of eight midpoint views | 24 | 0 | P1 |

## Connecting the phases

- Cover entry carries the slide direction into contact compression. The support foot lands before the hips and shotgun settle.
- Shuffle advances by real wall travel. Alternating feet carry the weight. A stopped actor holds a planted pose and does not cycle its feet.
- At a corner, the plant leads the hips, shoulders, gun and tail through the turn. Protected barrel tips remain hidden until the authored peek clears the steel.
- Raising keeps the trigger hand on the grip and support hand on the fore-end. Stationary aiming transfers weight through torso and hips while the foot/root stays fixed.
- Aim sweeps use eight main views and eight intermediate aim views where needed. Turn poses lift and plant the appropriate foot. They never stretch or flip the character.
- Clear RT fire uses the displayed authored muzzle immediately. Recoil compresses the shoulder, then settle returns to the same aim line. A blocked center shot preserves the shell.
- Lowering relaxes the elbow into the protected hold. Moving input interrupts cosmetic lowering with the next shuffle or exit pose.
- Cover exit and slide recovery carry momentum, gun and tail into the first matching stride. Start and stop poses connect the same leading leg to the gait.
- Each stalk, jog and sprint cycle has alternating left/right contacts and passing poses. Moving fire keeps the leg cycle while upper-body aim tracks the target.
- Jump preserves takeoff direction and equipment through tuck, apex, extension, contact compression and recovery. Landing does not freeze input.
- Hit impact and recovery retain the weapon and anatomy. Defeat uses the existing non-graphic presentation and reconnects to a clean rematch.

## Priority batches

P0 completes compact cover hold, raise, aim, recoil, settle and lower views, beginning with front-right, front and front-left. It also keeps the verified saved lateral wraps playable while the foreshortened alternatives remain in review.

P1 connects cover catches, rear shuffle, corners, exits, starts, stops and turns. Add intermediate aim views only where replay exposes a discontinuity.

P2 audits and corrects all movement cycles, free-standing fire and jump against the same master. P3 finishes hit, recovery and defeat. Verify each complete directional sequence before activation.

## Existing powers and special actions

The later special-action pass needs matching shield raise/hold/parry/lower, melee wind-up/contact/follow-through/recovery, psychic reach/grip/hold/throw/release/return, construction gather/assemble/place/recall, charge/hold/release/return and bullet-time activation/return. Audit the existing runtime phases before assigning cel counts. These are a separate art pass for the existing mechanics.

## Release gate

Review neighboring frames at gameplay scale on the same ground line, then run the waist and tall-wall drills, both faces and endpoints, normal speed and quarter speed. Verify muzzle flash/projectile origin and blocked ammunition behavior, an exit under pressure, a missed shot Jade can punish and a rematch. Keep art with anatomy, grip, registration or concealment failures in review. Count new drawings, corrected drawings, reused drawings and routing changes separately.

## First new connected batch

39T18 authors six cels each for front-right, front and front-left. Each view has protected hold, halfway raise, fully shouldered aim, recoil, settle and halfway lower. Each side is drawn independently and all six poses share one registered support heel, root and uniform scale. The direct art preview is `/raptor-fluidity-review.html`.

The new family is activated only for these three directions. Existing matched lateral peeks and rear firing sets keep their current routing. Clear RT requests select a validated firing cel immediately. The raise and lower art fit within the existing cosmetic transition windows. Both clearance and projectile/flash origins use the same displayed cel’s muzzle.

The straight-front atlas came from `exec-360ab1df-2844-4d22-a28f-cfd17b5f94ef.png`. The first two candidate diagonal atlases were too close to lateral profiles. Their corrected replacements use three-quarter front views. A subsequent art gate checks both physical clearance and the actual painted steel lip before accepting the diagonal raised poses.

The production prompt asks for six full-body transparent cels in a 3-by-2 atlas at the gameplay camera, with the live olive right cover crouch as anatomy master, the approved left peek as ink/weapon master and the compact two-cell rear housing as equipment master. The grip remains attached from hold through raise, aim, recoil, settle and lower. Front-right exposes the red anatomical-right optic. Front-left exposes the amber anatomical-left eye with the right optic on the far side. Direct front places the red optic on the viewer’s left. Every cel retains the same heels, proportions, original twin-barrel shotgun, stripes, cables and worn armor. The lip-correction prompt raises the diagonal aim/recoil/settle gun to the optic line while preserving the registered feet and body design.

Local verification of the final batch passes all six phases for each new direction through real authority ticks. Each six-cel set keeps the same support heel, root and scale. Clear RT selects recoil immediately, the next phase settles, and release selects the lowered connector before hold. The new test also sweeps two planted aim offsets and checks both faces across six wall rotations and five rail positions. Tall center retains its shell. Flash and pellet origins match the displayed firing muzzle. Existing cover, projected masks, shared Jade behavior and psychic regressions pass alongside the production build.

The existing back-right recoil and settle cels also pass the waist-cover clearance gate in 54 fixture positions. Reusing those two already authored cels closes the remaining low-cover idle exposure fallback. This is one routing change and two reused cels in an additional context, with no additional new drawings. All eight body directions now select authored cover exposure art at both wall heights. Full design consistency across movement and all neighboring turns still belongs to the later priority batches.

## 39T19 lateral movement batch

Sixteen new independently authored drawings cover right and left: ready, push, left contact, left pass, right contact, right pass, brake and settle. These are exported to `movement/{right,left}/000–007.png` with transparent alpha, a shared ground line and uniform scale. Sources are `exec-93bf70ea-06d4-446b-be4f-4bc37ca01ab1.png` and `exec-9721ec11-8b28-4125-a683-1842c8baefaa.png`. `batch19-registration.json` records sockets and hashes. The built-in image generator used both approved cover masters and requested the same anatomy, olive palette, worn armor, compact two-cell housing, original shotgun, connected cables and independently correct eyes. Each atlas prompt specifies eight row-major phases, four columns, two rows, full-body transparent cels, continuous ready grip and deliberate alternating feet.

Only right-facing neutral, low-speed gait and start/stop are replaced. The left atlas stays review-only: its opposite-foot contact still reads too similarly to the preceding contact. A two-cel correction trial (`exec-de181c08-c4b0-43d4-ae1a-c5ef9537aeb0.png`) remains a draft and does not count toward this production batch. Cover exit and slide recovery reuse the new push cel within existing recovery timing, then enter the first contact. Actual travel still advances gait; start/stop drawing never delays physics or clear RT fire. Jog, sprint, other six body directions, aim turns, moving-fire recoil and airborne/reaction sequences remain separate audit and production work. This batch is 16 new drawings, zero corrected existing drawings and zero reused drafts; exit/recovery are two reuse contexts of the new art, not extra drawings. Routing changes: right-facing ready, start, stride, stop, cover-exit and slide-recovery, six categories. Direct inspection is `/raptor-movement-review.html` with normal/quarter speed, gameplay size, ground guides and all eight poses.
