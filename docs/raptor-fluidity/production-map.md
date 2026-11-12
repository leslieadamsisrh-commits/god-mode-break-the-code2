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

## 39T20 left and rear movement

Eight newly authored rear movement cels preserve the approved rear anatomy, two-cell housing and connected cables. The shotgun is redrawn to the foreshortened away-facing shoulder aim; the rejected lateral-gun rear atlas stays inactive. Two independently drawn left corrections establish a near-leg cross-contact and far-leg support passing pose. They combine with six reviewed earlier left drawings. The original far-contact cel is reassigned to the correct leg phase. The corrected left and rear sets activate the same eight ready/push/contact/pass/brake/settle phases as the right set. These are low-speed free movement, cover exits and slide recovery; attached cover shuffles, fast gaits and airborne actions retain their established routes.

Count this batch as eight new drawings, two corrected drawings, six reused drafts and sixteen activated cels. The left opposite-contact reassignment is one routing-only art-index correction. Enabling left and back through the existing movement selector is two availability changes, not new art. All eight body directions remain in the coverage inventory; five still need matched free movement sequences. The older left drafts and original rear horizontal-gun atlas are retained through earlier checkpoints rather than promoted.

Source prompts used the built-in image generator. Rear prompt: an eight-cel 4-by-2 transparent rear atlas, same olive anatomy, compact two-cell housing, rear heels and alternating support legs; a targeted edit preserves the leg poses and changes only arms/gun to the approved foreshortened rear aim. Left contact prompt: preserve the existing left body, amber eye, equipment and two-hand grip while the near thigh crosses visibly ahead of the far thigh and the opposite foot trails. Left pass prompt: preserve the low crouch while the far right foot supports weight and the near left foot tucks offground. Sources and sockets are in `batch20-registration.json`; production files are under `public/assets/raptor-v2/movement`.

The interactive checklist is `/raptor-production-map.html`. Every row records a required phase and body direction; existing files remain candidates until audited. The 534 rows include reuse and existing art, so they are not a demand for 534 new drawings. Psychic and special-action art stays a later pass preserving existing mechanics.

## 39T21 left and right jog and sprint

Sixteen new drawings replace the legacy lateral jog and sprint cels at their existing frame keys. Each speed has two contacts and two passing poses with opposite support legs. The sprint lowers the head and chest, lengthens the stride and streams the tail back. The anatomical left shows the natural amber eye. The right shows the red optic. The covered character masters establish the striped olive anatomy, worn armor, long arms, connected cables and two-handed original shotgun.

The original distance-driven selector carries foot phase across pace changes. The batch preserves the existing shot timing and uses the muzzle registered to each replacement drawing. The registration lists source atlases, pelvis, support foot, muzzle and checksum for each export. The source prompts reference the approved cover and Stalk cels and specify jog and sprint in four phases. Targeted sheets repair contacts and passes whose initial versions repeated a support leg.

The Lab preview compares Stalk, Jog and Full Sprint at normal or quarter speed. Other directions, hit, slide and jump art still require the corresponding anatomy pass.

## 39T22 rear jog and sprint

Eight new cels replace the legacy straight-back jog and sprint. Each pace has independently drawn left contact, left pass, right contact and right pass. The sprint foreshortens the upper body and streams the tail between the feet. The jog retains the higher body and the shallower stride. Both use the rear movement references for the two-cell housing, cable routing, ink and over-shoulder twin-barrel silhouette.

The generation prompts specified an isolated 2-by-2 atlas per pace at the fixed elevated rear camera and explicitly described which leg supports weight in each phase. The jog atlas repeated the right support in its second cel. A targeted single-cel edit kept the same rear equipment, tail curve and muzzle direction while changing the support to the left foot. The registrations record the source images, pelvis, planted support, muzzle, ground projection and exported checksum. The pelvis stays in the same cell position while the support claw shifts in projected depth.

The existing pose selector plays the replacement frames without a timing change. The lab movement preview now shows all three paces on the left, right and straight back. Five other directions still use the older fast-gait art.

## 39T23 jump and slide artwork

The 39T22 recording at 13–18 and 20–28 seconds showed the old gold armor during jumps and slides. This batch replaces 66 files at the keys already selected by the game. Jump has six phases in each of the eight directions. Slide has entry, hold and recovery in left, right, front, front-left, front-right and back-left. Straight-back and back-right slide still use their 39T22 art and are listed in the production map. Earlier artwork is recoverable at 39T22.

The approved olive movement and cover artwork supplied the design references. The source atlases were independently drawn by facing and use the original motion as silhouette reference. Each exported cell is registered to a 512-pixel canvas with a consistent drawing scale, a measured pelvis, a visible muzzle and contact points where applicable. The manifest preserves the replaced hashes and identifies the active restored directions. Jump physics and slide timing are unchanged. The movement review includes Jump and Slide and displays the newly registered phases at normal or quarter speed.

## 39T24 full slide replacement

The verified 39T23 checkpoint is `245ca624d6a750b259291bec15f20b846f4153eb`. This batch replaces all 24 slide files, including straight-back and back-right entry, hold and recovery. It uses the original approved side peeks, the stationary wrap pivots, and the approved compact rear housing as the art references. The atlas source and manually measured pelvis, muzzle and support foot for each export are recorded in `batch24-registration.json`.

The live pose selectors share the slide recovery frame with some catch and transition paths. The new exports keep those keys and preserve the selector and input behavior. The preview includes every slide direction and the previously released jump sequences. The 39T24 replacement pass covers slides. The 48 existing jump frames and the other runtime families are still open for that pass.

The baseline manifest registers 302 files. The shared selector can reuse authored idle, gait, jump and cover frames for special actions rather than using a dedicated special-action atlas. Audit reachability through both the server pose selector and the renderer's selection path before declaring the full replacement complete.

## 39T25 full jump replacement

This batch replaces all 48 jump files after 39T24 replaced all 24 slide files. The approved cover and equipment masters guided the new art. Each direction runs through push-off, ascent, apex, descent, landing and recovery. The 512px registration records the visual root, foot landmarks and visible twin-barrel midpoint. Game jump height and frame selection still follow the existing authority. The render and firing paths share the same registered frame.

### Runtime inventory

[Runtime inventory](runtime-inventory.json) records each registered key by action, direction and phase. The selector sweep and the real jump and slide tests account for 262 of the 302 registered keys. The other 40 keys are disabled or shadowed under current availability. The table also includes those registered keys so availability changes can be audited.

All jump directions share a 1.16 draw scale to match the prior jump silhouette at the gameplay camera. The unadjusted exports rendered roughly one fifth smaller. Scale is applied about the registered ground anchor and is shared by rendering and muzzle projection.

| Family | Directions | Frame indexes |
| --- | --- | --- |
| Idle | All eight | 000 |
| Run, stalk, jog, sprint | All eight per family | 000–003 |
| Movement | Right, left, back | 000–007 |
| Recovery | All eight | 000 |
| Cover drive | Front-right | 000–001 |
| Cover hold | All eight | 000, plus 001 for front-right |
| Cover lean | Left, right, front-right | 000 |
| Cover wrap | Left, right | 000–001 |
| Cover catch | Left, right | 000 |
| Cover shuffle | Left, right, back | 000–001 |
| Cover pop | Left, right | 000 |
| Cover corner | Back-left, back-right | 000 |
| Cover bridge | Left, right | 000–001 |
| Cover recoil | Left, right, back-left, back, back-right | 000–001 |
| Cover sequence | Front-left, front, front-right | 000–005 |

## 39T29 locomotion and cover continuity

The left, right, and straight-back locomotion batches use the previously registered 39T19–22 drawings. The runtime draw scale now matches the new ready poses. The 21 movement and 24 jog/sprint registrations retain the authored anchors, support-foot positions and muzzle sockets. The 12 separate stalk keys reuse the corresponding crouched movement cycle in the same directions, closing the old art path that is still reachable through cover shuffle and drive.

The visual review and cover regressions revalidated the existing lateral bridge, catch, hold, pop, recoil and shuffle sequences, straight-back hold, recoil and shuffle, and the front-right and front-left six-frame cover sequences. These 35 cover files retain their exact existing bytes and anchor geometry. The front cover sequence, diagonal rear cover, drive and open recovery poses remain listed individually in the runtime inventory. For a full-game promotion, run the inventory check with `--release` and require zero open poses.

## 39T30 cover and recovery

The six front cover frames now use two barrels and registered muzzle points. The rear-left corner was cleaned without moving its anchor. Both rear diagonal recoil pairs and the rear-right corner passed review. The front, front-right, back-left and back-right exit recoveries now use independently drawn and registered frames.

Run `node tests/check-raptor-runtime-inventory.cjs --release` for every open runtime slot by action, direction and phase.

## 39T31 front-left gait and cover

This batch registers front-left stalk, jog and sprint with four phases each. Two rear tuck poses, two front-right cover-drive contacts and front-left recovery complete the reachable cover and recovery replacements. The remaining 36 open keys are the four phases at all three paces in front-right, back-left and back-right. The selector and combat controls are unchanged.

## 39T32 front-right gait

This batch registers four front-right phases for each pace. The remaining open keys are the four phases of all three paces in back-left and back-right. The main game menu can start an authoritative local Raptor session once all reachable keys clear the inventory check.
