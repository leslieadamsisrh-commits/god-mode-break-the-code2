# War Games Arena Correction + Physical Floor 46

Continuation of commit 11777de351dd58c12003cc3b5596b829733383b5 on studio/war-games-arena-45, whose parent is Ground Peel44, 982ce58929bf87d68386f35e503cd1895452cdf0. The recovered local snapshot had no Git metadata; authoritative source files were compared with GitHub blobs before editing. No reset or baseline replacement. Railway45 was SUCCESS at recovery (deployment d09682a1-6d81-46c5-b26f-ea82a46138e3); this work prepares a separate46 candidate for user deployment.

## A: One stadium and registered geometry

The approved cleared War Games foundation is drawn once, intact. Removed runtime split-strip composition, separately stretched floor and bridge boundary drawing. A projective floor mapping registers the playable plane to the original artwork. Objects render directly at their mapped anchors; upright sprite artwork retains its scale. Cover thickness, side faces, shadows, depth order and actor occlusion use the same mapping. The first visual fixture checks only the two matching permanent spawn shelters, then the existing map at spawn, center and both flanks. Reused approved foundation, Jade artwork and existing dimensional cover assets; no new asset generation or claim of a wholly redesigned asset family.

Pointer aim uses the exact inverse mapping. Right-stick screen intent is converted through the local floor Jacobian; left-stick movement remains independent and unchanged. Incoming-damage bearings and field outlines use the same perspective. Camera follow behavior and configured zoom1.85 remain. Pristine static cover drawings are cached in a bounded32-entry cache; dynamic, damaged, held and generated objects bypass it. No full-frame image warp is used.

## B: One physical floor panel

Only the center source at world500/330 is a removable80x54 panel. The other14 Ground Peel44 sources remain finite extraction/scar ledgers, not physical removable geometry. Intact panel seams sit over the original floor. Lifting reveals a shallow closed underlayer and exposed edge/rebar. The slab top samples its original floor markings; existing concrete artwork and inked side/rebar details supply thickness and underside treatment.

Aim at the eligible center panel and hold LB to lift. RT throws it through the existing contextual throw flow. RB while holding this raw slab forms the selected cover through the existing construction system. Emergency RB otherwise remains direct cover. A direct panel ray takes priority over incidental loose-material/cone fallback, while a directly targeted existing cover keeps priority.

Extraction atomically consumes the source's three unique material units and creates one authoritative mass7 slab with creator stamp, ownership, collision and throw attribution. It spends the existing Grip energy4 after placement validation. Formation spends the existing cover cost30, transfers the same three units and preserves the slab's damage ratio. Breaking returns those units once through existing matter accounting. The source never refunds or becomes peelable again until round reset. Captured raw slabs retain original creator/stamp while throw credit follows the attacker.

Floor removal and slab collision begin together on successful activation; hover animation then rises through the existing Grip motion. The raw slab is low protection (height14, HP280), not a full-body wall. Formed cover uses existing template geometry and timing. Cosmetic fragments remain bounded, client-only and resource-free. The recess stays traversable; no real elevation, playable drops, lower lanes, falling floors or deeper access are implemented. The three-depth terrain idea remains future work.

## Preserved authority

Walk222.7, boost430/.16, slide490/.50, double tap.28, charge easing.67145; steering/sustain and Kinetic Brake; independent movement/aim, fresh-Y charge priority/interruption, cover attachment/escape, feedback, local fixed60Hz clock and network transport. Controls retain LT shield, RT shoot/contextual throw, LB Grip, RB cover, Y charge, B melee, A slide/attach/detach/escape, X selected power and existing D-pad selections. No new powers, weapons, remapping, balance pass, campaign or4v4. Human defeats remain digital dematerialization. Jade runtime art and equipment roles are unchanged.

## Validation and limits

PASS floor46: actual LB/RT/RB input flow, damaged-slab formation, capture attribution, unique mass/conservation, break refund once, denied placement/energy and fresh-Y rollback, round reset,24 screen-stick rays,3,969 projection/inverse points.

PASS arena45 compatibility check with expected build46; Ground Peel44, Cover41, Defense43, Living42, Local40, Melee38, Connections34, Grip35/36, Integration31 and Combat26. Isolated1,800-frame player/config freeze comparison against exact45 source passes. Environmental outcomes involving the newly extracted panel intentionally differ.

PASS TypeScript and production build. Native actual-renderer fixtures check the foundation, two shelters and full map at four camera positions, panel extraction/hold/throw/break/recess and inverse cover anchors. Native Living42 cosmetic budgets/settling also pass. Ready artwork in these screenshots is a static fixture, not evidence of directional animation or a controller playtest.

Native complete-draw fixture: median73.081ms, p9598.136ms, max100.363ms in software container rendering. Separate cosmetic-only fixture: median2.131ms, p953.752ms, max9.157ms. These are different workloads, not browser FPS, GPU or iPad measurements and not evidence of a smoothness improvement. Real-device frame pacing and input-to-display acceptance remain necessary.

PASS production-server two-client HTTP46: actual waypoint movement, authenticated LB panel extraction, shared depletion/creator/mass, RB formation and Y/reset. Existing HTTP42/38 controller-action and melee protocol checks also pass. These are localhost tests, not Internet latency or physical controller acceptance. The historical Matter33 forced heavy-selection scenario was already stale on earlier baselines; no full-suite green claim is made.

## Review and device acceptance

Run `node tests/floor46.cjs`, `node tests/run-http46.cjs`; native fixture: `CANVAS_MODULE=PATH_TO_NATIVE_CANVAS node tests/native-arena46.cjs OUTPUT_DIR`.

On iPad, verify aim/facing at both flanks, static shelter occlusion, emergency RB, LB center-panel lift, RT throw, damaged RB formation, source depletion, escape regardless of aim/battery and frame pacing. Repeat with James: agree on panel removal, slab ownership, collision/hit timing, cover creation and rematch cleanup. HTTP tests do not replace that match.

Review images: [two matching shelters](verification/arena46/two-shelters-center.webp) and [held floor panel](verification/arena46/panel-held.webp). Candidate must be staged only; never treat staging as a live deployment.
