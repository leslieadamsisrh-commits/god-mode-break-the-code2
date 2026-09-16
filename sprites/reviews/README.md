# Individual sprite approvals

Open `sprites/previews/identity-review.html` through the local preview, or extract the normal `backups/current/GOD-MODE-Sprite-Review.zip` and open `OPEN-GALLERY.html`. For the downloaded copy, choose its `assets` folder once to let the browser read and hash the selected images before enabling approval. No server or account is required for that downloaded review.

The four groups contain references 1–6, 7–12, 13–18 and 19–24. They map to `ready-d00` through `ready-d23`, frame 0. Each card shows its ID, character, weapon, action, nominal direction, current decision and exact image revision. Original transparent art is unchanged.

The library exposes 121 existing image assets with 1,152 inspectable frame cells or whole-sheet views: 984 shotgun frames, 12 provisional charge/dash frames, 144 legacy pistol frames, eight barrier chunks and four whole environment/effect images. Whole sheets without registered frame layouts are labeled, not guessed into individual effects. Legacy pistol sheets contain visible cutoff and mixed-action problems; availability is not production approval.

## Review records

Approve, Revise, Reject, Save note and Reset act on one frame, one review kind and one actual image hash. Design and animation decisions are separate; integration approval is not available. Revise and Reject require notes. Image-byte mismatch disables approval. Changed revisions cannot inherit old approval. Invalid imports are rejected atomically and older exports cannot overwrite newer notes.

Browser choices are device-local. Export `GOD-MODE-design-reviews.json` and attach it in the conversation to persist decisions to this repository. The saved `design-decisions.json` contains the user's 24 standing-design approvals and twelve individually reviewed running-design approvals, bound to their actual image revisions. The exact conversational approval is recorded in `standing-approval.json`. Browser testing uses temporary sample decisions, which are reset and never committed as user approvals.

Natural-language responses use the same reference numbers: “Approve 1–6; revise 7: fix the backpack.” Before saving a conversational decision, map its number through `review-catalog.js` and retain the source revision, frame and review kind. Rebuild the catalog after updating the saved ledger; it imports that seed alongside newer device-local records.

## Verification and limits

The source and packaged gallery were checked in the browser: image verification, reference pagination, backgrounds, approval/revision/reset, note persistence through reload, filters, individual cover frames and sequence playback. Unit checks cover revision isolation, design-versus-animation separation, import validation and round trips. The archive verifies every included file's checksum. The native folder picker itself has not been exercised on the user's computer.

The gallery decodes only six reference images or one selected family at a time; obsolete fetches are aborted and old canvas/image references released. No full-library preload, source-master download, runtime gameplay change, or live game publication occurs. Generated image duplicates and streaming caches are excluded from the download. No new drawings were generated.

## Batch 2 — running review

The user approved all 24 standing designs and authorized the next batch. This does not certify the turning animation, exact yaw, running frames, muzzle registration or integration.

The updated gallery opens on `run-d00`, frames 0–5 (R001–R006); Next frames shows frames 6–11 (R007–R012). Running direction selects among the 24 existing nominal directions. The batch contains 360 original frames: six 24-frame sheets and eighteen 12-frame sheets. `Watch this direction` opens the single-family sequence player. Each six-card group shares one decoded sheet; nothing else is preloaded.

`batch-02-running.json` binds every R-number to a family, original frame and SHA-256. Both approval types remain separate. The running cards record design decisions; the sequence viewer also supports animation decisions.

### Review priorities

- Side `run-d00` frame 3 dips below surrounding poses; review body registration and pose continuity.
- Rear `run-d18` frames 3, 5 and 17 dip or vary in scale. Do not approve the whole animation just because its design matches.
- Inspect alternating foot contacts, the raised shotgun and last-to-first loop transition. Some neighboring poses are similar.
- All direction labels remain nominal; image availability is not certification of 24 exact camera angles.

`python tools/render-running-review.py` reproduces twelve individually padded frame proofs and six motion GIFs under `test-output/running-refined`. These display the source cells in their original order at uniform 80 ms inspection timing. The refined version applies the saved vertical registration offsets; no proportions, original image content or gameplay timing are changed. The source images, manifests and script are saved; reproducible proofs are excluded from compact backups to avoid image duplication.

Stop for the user's running review before generating replacements or integrating artwork. Preserve the approved standing designs and combat build.

## Running refinement update

See `RUNNING-REFINEMENT.md` for the 51 frame-placement corrections, measurements and limits. Use the gallery's Frame placement control to compare original and revised registration. Design approval remains bound to the original image; animation approval also includes the registration revision.
