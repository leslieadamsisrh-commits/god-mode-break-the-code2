# Rear diagonal gait candidates — not accepted

Sixteen 512×512 RGBA candidate exports: four each for back-left/back-right stalk/jog. Built-in imagegen generated four 2×2 source sheets. Sources are preserved alongside exports. Each equal quadrant is padded to square, then uniformly resized; no per-pose bounding-box normalization. Proposed anchor (256,450) requires contact/motion calibration, not automatic acceptance.

References: approved `exec-e30e1c6b-1fa9-4285-b261-28d785ba3c01.png`, existing `idle/back-left/000.png`, `idle/back-right/000.png`, `sprint/back-left/000.png`, `sprint/back-right/000.png`. Idle refs inspected but their lateral toes were not used as desired direction. Sprint refs provided rear camera; master supplied anatomy. No source was mirrored.

Prompt set: four equal transparent cells, same compact muscular Raptor and equipment, back diagonal facing away, contact/pass/opposite-contact/opposite-pass, true alternating thigh overlap, short full calves, compact feet, locked torso/neck and right-side red optic. Targeted correction explicitly moved the previously near trailing leg forward into depth and the other leg toward viewer, then used this opposite-contact reference in the sheets. Back-right jog requested a corrected opposite contact and reduced shins.

## Findings requiring correction before runtime

- Back-left stalk: contact silhouettes differ; passing poses do not yet establish unequivocal planted/support-foot timing. Some soles/claws read toward viewer rather than away because trailing feet are elevated. Need motion review and registration.
- Back-left jog: contact 0/2 alternate; passing 1/3 still resemble each other and risk same supporting leg. Reject as a complete runtime set until this is resolved.
- Back-right stalk: contact 0/2 move trailing foot but retain similar forward thigh. This is not sufficient proof of true alternating strides. Reject for runtime.
- Back-right jog: contact 2 changes thigh overlap; passing 1/3 repeat the same leg state. Camera has drifted more lateral than stalk and foot orientation needs correction. Reject as complete set.
- All sets: source sheet cell body height is larger than existing rear idle. Uniform registration and shared family scale need master comparison; proposed anchors are not measured foot contacts. Top/bottom row torso size and bob need playback audit. Some elongated ankle/metatarsal shapes persist.

These files are generated and exported, not visually accepted, integrated, gameplay-tested or deployed. No manifest or runtime files were changed.

## Individual correction pass

Five versioned corrections are now available, with source files and `individual-retries.json`: `003-v2.png` in all four families, plus `stalk/back-right/002-v2.png`. These use individual edit targets, keeping upper body and equipment identity while explicitly exchanging screen-left/screen-right support. After text-only edits repeated one pose, a successful opposite-support individual was used as a leg-pose reference. The five selected edits now visibly change supporting leg; the back-right stalk contact also changes thigh overlap. Two unsuccessful retries (crossed stalk back-left legs and unchanged jog back-right support) were excluded.

The v2 set supersedes the earlier support-leg defect findings for those specific files, pending primary acceptance. Original files are retained. No claim of full acceptance: source framing/registration, calf/foot size consistency and visible contact timing still require the complete four-frame motion gate. The back-right jog camera is still more lateral than stalk; individual edits deliberately preserved its existing camera. Whole-image square padding and uniform resize only were used, never individual bounding-box normalization.

## Consolidated sixteen-frame selection

`selection.json` is now the canonical candidate order, with deliberate per-frame pelvis-ground anchors and visible support contact points. `revised16-contact-sheet.png` presents that order. Back-left passing order is corrected to original 000, revised 003-v2, original 002, original 001 so each support contact leads into its corresponding passing support. Back-right stalk uses 000, 001, 002-v2, 003-v2.

All four back-right jog frames have now been individually corrected again as `000-v3.png` through `003-v3.png` to the rear-diagonal camera: dominant backpack, rear skull, sliver of optic, foreshortened gun, tail toward lower left. This supersedes the known lateral-camera defect above. Original alternating contact/pass leg arrangement is retained in each correction. The consolidated contact sheet visibly alternates all four cycles.

Anchors use manually inspected planted foot heights with a common projected pelvis horizontal origin (260 for back-left, 280 for back-right), not alpha bounds. Support-point coordinates are recorded independently. These are authored registration candidates for motion inspection, not proof of gameplay contact. No per-frame scale correction was introduced. Remaining primary visual gate: compare distal ankle/foot volume and armor-detail continuity across revisions, calibrate common character scale against runtime idle, and inspect at normal/slow/gameplay size before integration.
