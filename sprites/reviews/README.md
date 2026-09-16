# Individual sprite approvals

Open `sprites/previews/identity-review.html` through the local preview, or extract the normal `backups/current/GOD-MODE-Sprite-Review.zip` and open `OPEN-GALLERY.html`. For the downloaded copy, choose its `assets` folder once to let the browser read and hash the selected images before enabling approval. No server or account is required for that downloaded review.

The four groups contain references 1–6, 7–12, 13–18 and 19–24. They map to `ready-d00` through `ready-d23`, frame 0. Each card shows its ID, character, weapon, action, nominal direction, current decision and exact image revision. Original transparent art is unchanged.

The library exposes 121 existing image assets with 1,152 inspectable frame cells or whole-sheet views: 984 shotgun frames, 12 provisional charge/dash frames, 144 legacy pistol frames, eight barrier chunks and four whole environment/effect images. Whole sheets without registered frame layouts are labeled, not guessed into individual effects. Legacy pistol sheets contain visible cutoff and mixed-action problems; availability is not production approval.

## Review records

Approve, Revise, Reject, Save note and Reset act on one frame, one review kind and one actual image hash. Design and animation decisions are separate; integration approval is not available. Revise and Reject require notes. Image-byte mismatch disables approval. Changed revisions cannot inherit old approval. Invalid imports are rejected atomically and older exports cannot overwrite newer notes.

Browser choices are device-local. Export `GOD-MODE-design-reviews.json` and attach it in the conversation to persist decisions to this repository. The saved `design-decisions.json` is currently empty: the user has not approved any first-pass designs. Browser testing uses temporary sample decisions, which are reset and never committed as user approvals.

Natural-language responses use the same reference numbers: “Approve 1–6; revise 7: fix the backpack.” Before saving a conversational decision, map its number through `review-catalog.js` and retain the source revision, frame and review kind. Rebuild the catalog after updating the saved ledger; it imports that seed alongside newer device-local records.

## Verification and limits

The source and packaged gallery were checked in the browser: image verification, reference pagination, backgrounds, approval/revision/reset, note persistence through reload, filters, individual cover frames and sequence playback. Unit checks cover revision isolation, design-versus-animation separation, import validation and round trips. The archive verifies every included file's checksum. The native folder picker itself has not been exercised on the user's computer.

The gallery decodes only six reference images or one selected family at a time; obsolete fetches are aborted and old canvas/image references released. No full-library preload, source-master download, runtime gameplay change, or live game publication occurs. Generated image duplicates and streaming caches are excluded from the download. No new drawings were generated.

## Decisions requested

1. Compare references 1–4: their body turns are very similar despite different nominal angle labels. Confirm which designs to retain while exact-angle spacing is refined later.
2. Compare front reference 7 with rear reference 19 and nearby views: check helmet shape, body proportions, battery assembly and cable routing for a single consistent heroine.
3. Mark specific views Approve, Revise or Reject. Existing muzzle uncertainty and missing original high-resolution sheets remain technical gaps; approving the appearance does not certify those measurements.

Stop after this first-pass design review. Do not generate Batch 2 or integrate sprites into combat before the user approves the reference designs.
