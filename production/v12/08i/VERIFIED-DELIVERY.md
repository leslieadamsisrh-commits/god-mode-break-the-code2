# Jade V12 08I — State-aware cover pose routing

## Delivered scope
Local single-player Training Lab update built on the exact 08H package. Fixes recovered cover sprite selection. Zero new drawings, no character redesign, no changes to original movement, no new Vercel release.

## Implemented correction
08H cycled the whole cover sheet by travel distance, despite contact, brace, peek, fire, return and kick being distinct actions. The new cover-router observes actual simulation events and displacement outside the World. Stationary cover uses brace; successful shots select fire; held edge aim selects peek; release selects return; actual kick state selects kick. Blocked muzzle input does not count as a successful shot.

Dedicated lateral slots are used only where present: recovered d06/d18 have [5,6]. Other views hold brace and disclose that lateral drawings are missing. Wrapping uses an explicitly labeled brace proxy; no new wrap animation is claimed.

The 24 cover mappings come from the archived Shotgun Lab manifest, blob d17ded5aa7edff0f2184c8c91fa92d3666511c96. Four legacy views (d03/d09/d15/d21) have no explicit coverPoses and use the recorded fallback in lab-pose.js, blob 9115105949813bb0424640c9ee68ce0760c062a3. Connector line ranges were inspected; no complete raw-manifest download is claimed. The runtime validates role indices, atlas association, source/runtime fingerprints, grids and anchors.

Archived per-frame/family cover anchors are restored, including d11 kick [216,336] and d12 kick [194,336]. These values replace the generic anchor for those frames. This is NOT proof that recovered and final-design bodies align perfectly; physical root, source padding and visual scale remain separate. Existing muzzle simulation sockets remain provisional and unchanged.

## Protected files and art limitations
core.js, action-controller.js, motion-flow.js and all 115 images are byte-identical to 08H. The protected v11.1/combat-lab-system08 code is not overwritten. Running, sliding, weighted shimmy, corner wrapping, input, shots, collision, cadence and damage are unchanged by this routing batch.

Image inventory remains 108 recovered atlases, three unchanged final-design PNG poses and four previous optional small-lift studies. Final-design coverage remains one right-hand cover view. Leaving that heading can still switch to recovered art; this batch does not solve that coverage gap. Full shoulder raise, drawn recoil/retraction, HD locomotion and 360-degree animation remain unfinished. No new anatomy or independently rigged body layers are claimed. K03 fringe and final/recovered registration still need review.

Final Jade PNGs contain no environmental cover. The world barrier is independently drawn. The plain training map is not final environment artwork.

## Controls and A/B comparison
Keyboard: WASD movement, Shift slide/kick, Space round a valid corner, E attach/detach, RMB aim, LMB fire, R reset, P pause/resume. Standard controller mapping: LS movement, RS aim, A slide/kick, B wrap, X attach/detach, LT aim, RT fire, View reset. Physical hardware remains untested.

The new checkbox is '08I action-aware cover poses (off = old 08H loop)'. At the supported corner, temporarily disable 'New Jade at supported corner' to inspect recovered pose routing; restore it afterward. Keep the separate 08H-flow checkbox unchanged while comparing routing. The inspector/frame trace records selected role, slot, source anchors and missing lateral coverage. Resume/P after focus loss.

## Verification
101 Node assertions passed: 67 inherited baseline/action/movement checks, 30 new router checks and four observer-isolation scenarios. The four scenarios cover 8,800 paired simulation ticks in none/stationary/moving/attacking-target modes and compare snapshots, shots, effects, input records and event logs. This is measured regression coverage, not all-case gameplay parity.
Five identity assertions and integrity/decoding checks for 115 images passed. Five automated test lanes executed concurrently; no autonomous AI agents were launched. Code checks do not certify final anatomy, aesthetics, foot contacts or missing animation.
28 browser-content/input checks passed in Chromium 144.0.7559.96. File-URL navigation was blocked by environment policy; exact standalone HTML was executed with Playwright set_content. DOM controls and synthetic standard-gamepad inputs were exercised. No observed page errors or external HTTP dependency. Physical Xbox, user-PC performance, hosted URL and actual file-navigation tests remain unverified.

Router Git blob 8bb53e7470afcc16de1a07d77e9e7797a50f8d82 and assembler Git blob 189226d3afe6b327f514e46f2ffc1fc6b93cf9da match their local tested files. The assembler was executed against the exact unpacked 08H package and reconstructed the changed application and metadata without editing the source package.

## Demonstration
The 08I MP4 is 7.2 seconds, 108 actual browser screenshots at 15fps, 1440x1000 H.264. Opening frames deliberately set total travel to 60 to reproduce the old stopped/kick-slot error, then enable corrected routing on the same fixture. Later scripted inputs advance four fixed ticks per video frame and show action roles and unchanged final Jade. This is a controlled test, not a hand-played or real-time performance benchmark. PNG evidence consists of actual prototype renders.

## Storage and release
Branch v12-08i-cover-pose-routing is based on 164049bdfd48c3421c316ccb09a28fbceb1d80d6. GitHub stores cover-router.js, metadata-source.json, assemble_08i.py and this report with subsequent receipts. The assembler reconstructs the application/UI, full catalog and packager from exact 08H assets in a new directory.
The complete modular code, images, tests, captures and self-contained HTML are delivered in JADE_V12_08I_Cover_Pose_Routing.zip and saved to Library when receipts confirm success. These text commits do NOT claim image binaries have been installed in the repository runtime directory. Auto-deploy remains disabled; no new Vercel URL or public release is claimed.

## Next task
Use the corrected routing in play to separate remaining art gaps from selection/anchor problems. Reconcile recovered/final pose placement and author missing same-view shoulder raise, recoil/retract and adjacent final-design views, without redesigning Jade or changing physics to conceal art mismatches.
