# d02/d04 neighboring cover batch — appearance approved

User2026-10-04 08:56PDT approves the displayed new sprites' APPEARANCE and authorizes continued installation work. This supersedes the historical unapproved visual status. The source still needs technical source isolation, per-frame sockets and direction/registration checks before runtime installation; appearance approval is not a claim those checks passed.

## Corrected alpha audit
The earlier halo rejection was mistaken: the preview displayed hidden RGB data. Composite/alpha inspection confirms empty pixels820,300;820,480;100,300;750,400;768,600 all have alpha0. Pixel768,512 was on the first pose's boot, not empty background. There is no visible background halo to remove. Do not regenerate or strip character pixels based on RGB color. The user-approved original appearance-approved-review-v1.png remains the source authority; a later unnecessary background-extraction attempt was discarded rather than installed.

## Actual extraction boundary
Alpha>128 yields four separate large components: d02 aim bounds170,15..793,543; d02 recoil853,26..1452,544; d04 aim139,537..793,1011; d04 recoil851,537..1497,1012. Top/bottom source bounds overlap by7rows, and left aim extends beyond the nominal768cell. Blind quadrant crops clip boots/head or include neighbors. Preserve complete component silhouettes through source-isolation clips; never resize individual poses. All four remain NOT REGISTERED/INSTALLED.

Next: isolate the four approved components, map pelvis/sole anchors at one shared anatomical scale, measure per-frame muzzle sockets, validate facing against original cover-d02/d04 and adjacent d03, then install only routes that pass actual-scale cover/collision tests. The supported-pose aim limiter remains pending a usable audited direction set across each supported cover face. Existing movement remains intact; only d03 authoritative horizontal muzzle correction is live. d00 candidate remains separately unapproved.

## Approved installation — 2026-10-04
User explicitly requests installation after timeout. Appearance-approved source installed byte-identically as public/assets/god-frame/cover-d02-d04-exposure-v1.png. This supersedes NOT REGISTERED/INSTALLED above.

registration.json records four measured sockets, full silhouette rectangles and clips for thin overlapping source rows. Analysis confirms clips retain every large alpha>128 component and exclude neighboring opaque components. Hidden RGB at alpha0 is preserved. Uniform125*143/250/445*spriteScale and recorded sole anchors match installed d03 ground baseline. Exact-function Canvas fixture inspected at .82 scale/1.85 camera shows complete equipment, anatomy and barrels without neighboring fragments.

Rules: attached braced cover + existing peek + heldLT selects d02(30degrees) or d04(60degrees) aim; existing fireState/recoil selects recoil. Existing d03(45degrees) remains installed. ReleaseLT uses existing retract/brace. Escape/charge/hits/carry/kicks override immediately; no pose delays inputs or collision. Other directions, ineligible states and missing assets retain existing routing. Global aim limiter remains pending.

Host d02/d04 exposed fire now starts horizontal x at measured recoil barrel, with z projecting that source barrel height. renderOffsetX0 keeps flash/trail and physical origin together. Existing floor y, velocity/spread/cadence/damage, cover collision and attached-only clearance retained; second cover at barrel blocks shot. Snapshots carry same x/z. Movement/battery/charge/camera and prior approved art unchanged.

Verification:1,963movement checks,26chain stages,psychic-art,cover-art,96exposure checks,exposure-art,new cover-neighbor-art and npm build PASS. New checks cover overrides, fallback, previews, scale/footline, byte identity, both sockets, travel/snapshots and second-cover blocking. Physical controller and two-client rendered checks remain separately pending.

Deploy same branch/service; confirm exact-commit SUCCESS and live render/ordinary-input chain. Guide cover-neighbors-v6 isolates fresh feedback. Director previews4..7 show four new poses without host changes. Next controller loop: neutralLS, heldLT, sweep30/45/60degrees, RT, releaseLT, A escape, freshY/release/combat. Full145degree coverage and supported-pose limiter remain pending. Wake/power connectors remain parked.
