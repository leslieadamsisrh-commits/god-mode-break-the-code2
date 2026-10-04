# Jade d03 front-right charge candidate

Status: visually approved by the user on 2026-10-03. Runtime registration implemented; 1,835 checks and production build passed. Live verification pending.

This batch follows the approved current Jade design and the existing ready-d03
combat facing. It covers grounded entry, lift, three hover poses, peak and
weapon return. `sequence-review.png` is the corrected directional sheet.
`dissolve-review.png` replaces its oversized dissolve pose. Use the opening
ready pose for the final ready state too: this avoids a different ending stance
without generating duplicate artwork. Source poses 2 and 12 are excluded.

The peak was corrected to retain front-right torso facing. Inspection confirms
whole-character silhouettes and the asymmetric blue backpack on the correct
rear side. The isolated dissolve contains a genuinely reduced receiver and a
few close fragments rather than a large weapon cloud.

`registration-review.json` records complete source silhouettes, the twelve
runtime state mappings, source hashes and remaining crop/anchor work. Clip
discarded neighboring weapon particles from the upper-left padding of source
pose 3 without clipping its genuine cape below. Source isolation, anatomical
scale and anchors must be validated with normal combat sprites before use.
Do not assume an equal grid, mirror equipment or independently resize poses.

Generation used the built-in image tool. Prompt: preserve approved high-detail
Jade identity and d03 combat perspective, create only the first God Frame's
grounded-to-low-hover sequence; correct peak facing; replace only the missing
compact halfway dissolve. Preserve transparent character artwork and separate
controllable energy effects. Reuse the opening ready pose for return.

Verified live build: 0827281, d00 and d06 charge coverage, Railway SUCCESS.
Other source views still missing: d01-d02, d04-d05 and d07-d23 (21 views).
