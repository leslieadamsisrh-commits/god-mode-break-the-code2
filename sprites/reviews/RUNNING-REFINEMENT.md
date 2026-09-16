# Running refinement — isolated review checkpoint

## What changed

Audited 360 running frames in 24 nominal directions. Corrected vertical registration in 51 frames across 21 directions. Original source images, anatomy, scale, frame count, frame order, playback timing, standing references and gameplay remain unchanged.

The recovered sheets put the lowest visible boot near cell row 221 even during bent-leg airborne poses. The torso therefore dropped when the legs tucked. Backpack/torso landmark analysis identified large placement outliers; visual review added smaller explicit corrections around cycle seams. This is a registration pass, not newly drawn anatomy.

The correction translates the entire existing frame by an integer number of pixels. It does not follow the lowest foot, resize the body, erase parts, mirror drawings, blur pixels or manufacture extra poses. Unaffected frames keep their original placement and small natural bob is retained.

## Measured continuity

Values below measure the largest adjacent-frame vertical change of the cyan backpack landmark, including the loop seam. These are pixel-registration measurements, not hardware FPS or proof of final animation quality.

| Direction | Before | Revised |
|---|---:|---:|
| run-d00 | 20 px | 8 px |
| run-d06 | 30 px | 4 px |
| run-d18 | 39 px | 5 px |
| run-d21 | 24 px | 8 px |
| run-d23 | 21 px | 8 px |

Across all 24 directions: worst adjacent jump is reduced from 39 to 8.5 pixels. Every translated silhouette retains at least eight pixels of padding, with its original width and height.

## Review and approval

The user approved the shown running art/style. Only the twelve individually displayed side-run frames have individual design approvals; the six shown motion families have a separate style-approval record. No unseen frames or animations were automatically approved.

The gallery offers Original comparison and Revised alignment. Design decisions bind to source-image SHA-256. Animation decisions bind to a separate digest of source image, frame offsets, frame order and unchanged timing. Switching to original comparison disables revised-animation approval. A future registration revision cannot inherit old animation approval.

## Integration contract

This remains an isolated review. Future integration must apply the same registration offset to every visible socket (muzzle, hand, effect) along with the artwork, while leaving the actor ground position and collision unchanged. Do not independently move the bullet or collision origin during this review. Anchors and foot-contact phases still need final in-game validation before family integration.

## Remaining limits

This pass resolves frame placement. It does not certify exact 15-degree yaw, all anatomy, fully planted feet under every input, cross-direction transitions, or final production animation. Some secondary hair/costume variation and small residual body bob remain for visual review. No extra frames are generated merely to increase the count. No game publication occurred.

Force-field art direction is recorded in `sprites/manifests/force-field-next.md`: hand-out poses, palm energy, and a separate lavender field with front/rear layering. It remains queued until the running review.

## Reproduce and restore

- `python tools/register-running-frames.py` regenerates the recorded registration measurements (Pillow + numpy).
- `python tools/build-review-catalog.py` embeds the approved design ledger and revised placement.
- `python tools/render-running-review.py` renders individual revised frames and synchronized original/revised GIF comparisons under `test-output/running-refined`.
- `python tools/package-review-gallery.py` produces the normal downloadable ZIP.
- Full-resolution sources are unchanged; compact backups contain canonical images plus registration data, not duplicate proof sheets.
