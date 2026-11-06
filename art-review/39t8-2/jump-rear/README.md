# Rear jump candidates — 39T8.2

18 review-only frames: six phases each for back, back-left, back-right. No runtime or manifest changes made by this workstream.

References inspected: exact approved master `reference/approved-master-e30e1c6b.png`, supporting cleaned runtime right apex `jump/right/002.png`, and existing idle/back, idle/back-left, idle/back-right frames.

Built-in image generation used. Straight-back generation c264a357 was followed by background-only extraction a365536f; final actual alpha is clean. The tool preview displays RGB haze, but a gray-background alpha composite verifies no retained haze. Back-left source63bd432a and back-right sourced00214c8 also have clean alpha.

Prompts request six equal512-square cells on1536x1024 sheet in order push-off/ascent/apex/descent/landing/recovery. Fixed camera toward upper-left, straight away, or upper-right; backpack dominant, muscular compact limbs/neck, identical bone lengths and equipment; correctly placed red character-right optic and amber character-left eye; feet point away, no foreground-facing claws; transparent with no effects/text/floor. Straight back explicitly excludes face/eyes/chest and hides shotgun mostly behind body.

Export uses literal512-square crops, one uniform scale per whole directional set, and transparent padding to512. No per-pose bounding-box normalization or anatomy warping. Scales: back0.5, back-left297/512, back-right348/512. Different directional scales compensate differing authored skull/body sizes; they remain provisional pending runtime comparison with other directions.

records.json in each directory stores phase, source, exact scale, candidate anchors, and SHA256. Anchors use fixed torso/support reasoning to remove sheet-drawn vertical lift from airborne phases rather than double-animate jump height. Landing/recovery anchors use actual support line. Primary must verify these in motion.

Visual review: all views face away; back-left visible eye remains natural amber, back-right visible optic remains red; no front face on straight-back. Straight-back apex lower legs are fully occluded by forward tuck behind torso. This is physically plausible but must be checked for readability against adjacent phases. Back-left/back-right tail silhouettes differ with rotation and may need shared scale refinement. All candidates remain review-only until motion and directional scale acceptance.

Validation: 18 PNGs512x512 RGBA, all four corner pixels alpha0, no visible clipped body parts. Gray-background contact sheet /tmp/rear-jump-contact.png inspected. No gameplay or final acceptance claimed.
