# Jade V12 08K — Stance origin and multiplayer readiness

## Delivered scope
A local single-player Training Lab update reconstructed from the exact 08J package after the interrupted session. Adds a reversible, manually marked stance-origin candidate for the three existing final-design poses. Zero new drawings; no redesign, resizing, mirroring or authored anatomy is claimed. The final-design animation library and online version are not complete.

## Implemented changes
The final-design sprite previously placed a near-foot pivot at the actor's world origin. This experiment instead places a ground origin below the manually marked pelvis: K01 [300,790], K02 [320,790], K03 [340,790]. Source scale .205 and ground Y are unchanged. The switch is '08K stance center (off = 08J foot-origin)'; candidate pelvis and both-feet marks can be shown separately.

Drawing, muzzle and breech use the same origin transform. The experimental core now routes fire/snapshot sockets through an overridable World.socket method. Enabled final-art shot origins intentionally shift with the artwork; this can change barrel clearance and bullet paths and is not described as complete combat parity. Disabling registration restores the prior final-source origins and socket equations. Recovered views remain unchanged.

The annotated pelvis aligns by construction, not by an automatic anatomy solver. The marked near-foot horizontal offset varies by at most .41 world units across the three source poses. The far foot has a substantial remaining pose difference; it was not force-fitted or redrawn. Recovered/final body proportions and placement are not fully reconciled by this one-view candidate. Additional drawings, real contact checks and playtest review remain necessary.

## Protected sources
All 115 images remain byte-identical to 08J: 108 recovered atlases, three final-design PNGs, four old optional deformation studies. The eight files action-controller.js, motion-flow.js, cover-router.js, asset-residency.js, assets.js, asset-manifest.json, cover-metadata.json and cover-metadata.js are unchanged. Original v11.1/combat-lab-system08 gameplay files are not overwritten. Cover and effects remain separate. No independent torso rig or new recoil sequence exists in this batch.

Visual authority: fff8eeb8fcc3ef1ff3a830684c1ac5aac5f8f142cb3ed92283e8b6ec59d49e89. Movement reference: ba742b1019f80f3e2d71b166b32244c4ed686260. Experimental branch v12-08k-stance-registration starts from 08J review 49b3e984aba59c277963ebceeceaa25021797a68.

## Verified results
132 Node assertions passed: 117 inherited tests and 15 new stance tests. Five concurrent automated test processes were used; no autonomous AI artists or agents were launched. The new checks include draw/socket projection for three poses at four zooms, unchanged ground/scale assumptions, a retained far-foot residual, obstruction, shot cadence, target damage and reset. 3,000 paired ticks with registration OFF match tested snapshots, events, shots and effects; a separate 3,000 no-combat ticks with registration ON preserve actor/movement state. Enabled shot origins are intentionally different.

25 browser checks passed in headless Chromium 144.0.7559.96. The exact standalone HTML executed through Playwright set_content, not hosted or file-URL navigation. The browser checks include UI comparison, key selection, socket agreement, aim release, one-trigger/seven-pellet creation, target damage, wrap, slide contact, synthetic LT/RT and focus pause. 96 repeated heading requests produced zero missing-image draws. No page JavaScript errors or external HTTP requests were observed. Physical Xbox hardware, user-PC performance, every possible interaction and online multiplayer were not tested.

The reconstruction script executed on exact 08J into a separate folder and reproduced six implementation files byte-for-byte. GitHub stores the registration module, manual landmark record, fingerprinted integration edits and assembler; the complete assembled source and actual images are delivered in the ZIP, not asserted installed in a GitHub runtime.

## Playable inspection
Open JADE_V12_08K_Playable_Training_Lab.html in a desktop browser. Start at Corner station, aim right, raise with RMB/LT and fire with LMB/RT. Compare the 08K stance checkbox while stationary at the same camera zoom. Show candidate pelvis/feet and X-ray to inspect placement. Restore the new setting to continue testing. P/Resume returns from focus-loss pause.

Controls remain WASD/LS move; Shift/A slide or kick; Space/B corner wrap; E/X attach/detach; RMB/LT aim; LMB/RT fire; R/View reset. These are local controls; the file does not join an online match.

## Real evidence
The 08K MP4 contains eight seconds from 120 actual browser screenshots at 15fps, with four fixed simulation steps per screenshot. It shows old/new origin comparison and the playable action. It is scripted evidence, not human gameplay or a real-time performance benchmark. PNGs are actual prototype captures. The intermediate screenshot cache is excluded from the delivery ZIP.

## Multiplayer assessment: recovered code versus verified service
The earlier recovery at efecc43dc7880ddf6831a1c40cbb694ab4dbed7e contains recovery/shotgun-lab-v57/lab-public.js (blob 063ce538883e30be9c55fa5f2588fcaad6a74a6b). That client requests /api/duel/shotgun/queue, pulse and leave; it handles status, rematch intent and reconnect/bot fallback. The recovered shotgun-combat-lab.js also references two player slots and LabDuel state unpacking.
This establishes reusable client-side networking work, not a running compatible match service. The current 08K local simulation has no network adapter, two-human mode or verified shared session. The historical protocol cannot be attached without reconciling its state/input schema with this newer experiment. Backend recovery, compatibility, private deployment and a two-device test remain unverified.

## Proposed next multiplayer milestone — NOT implemented here
A private two-player shotgun Training Lab duel: create/join the same room, two controlled players, one authoritative match state for movement/cover/shots/health, clear player identity, round end and rematch, disconnect/rejoin behavior, and latency testing. First verify two independent browser clients, then two actual computers. Preserve invite-only access; do not publish or change account protections by implication.
Network work need not wait for every final-design animation. A first mixed-art duel and the final-art animation work can progress in parallel. A fully final-design duel is a later acceptance level requiring missing run, slide, cover, raise, recoil, retract and directional source frames. Do not call that library complete, mirror asymmetric equipment, or disguise held images as finished motion.
No defensible calendar ETA is established: a compatible service has not been verified and a complete final-design action family has not demonstrated production throughput. Next engineering evidence should be an actual two-client join/movement/shot test, not a multiplayer-ready label.

## Release and backup boundary
No new Vercel deployment or public release was performed. Auto-deployment remains disabled on the inherited experimental configuration. The standalone file is offline and single-player. Source-image/video binaries are backed up in the delivered package and Library when upload receipts confirm it; GitHub text commits alone are not a complete hosted game. Original 08J and the approved movement/design references remain recoverable.
