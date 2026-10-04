# d02/d04 neighboring cover batch — appearance approved

User2026-10-04 08:56PDT approves the displayed new sprites' APPEARANCE and authorizes continued installation work. This supersedes the historical unapproved visual status. The source still needs technical source isolation, per-frame sockets and direction/registration checks before runtime installation; appearance approval is not a claim those checks passed.

## Corrected alpha audit
The earlier halo rejection was mistaken: the preview displayed hidden RGB data. Composite/alpha inspection confirms empty pixels820,300;820,480;100,300;750,400;768,600 all have alpha0. Pixel768,512 was on the first pose's boot, not empty background. There is no visible background halo to remove. Do not regenerate or strip character pixels based on RGB color. The user-approved original appearance-approved-review-v1.png remains the source authority; a later unnecessary background-extraction attempt was discarded rather than installed.

## Actual extraction boundary
Alpha>128 yields four separate large components: d02 aim bounds170,15..793,543; d02 recoil853,26..1452,544; d04 aim139,537..793,1011; d04 recoil851,537..1497,1012. Top/bottom source bounds overlap by7rows, and left aim extends beyond the nominal768cell. Blind quadrant crops clip boots/head or include neighbors. Preserve complete component silhouettes through source-isolation clips; never resize individual poses. All four remain NOT REGISTERED/INSTALLED.

Next: isolate the four approved components, map pelvis/sole anchors at one shared anatomical scale, measure per-frame muzzle sockets, validate facing against original cover-d02/d04 and adjacent d03, then install only routes that pass actual-scale cover/collision tests. The supported-pose aim limiter remains pending a usable audited direction set across each supported cover face. Existing movement remains intact; only d03 authoritative horizontal muzzle correction is live. d00 candidate remains separately unapproved.
