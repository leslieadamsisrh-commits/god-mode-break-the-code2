# JADE FINAL VISUAL LOCK — V12

Status: FINAL / DO NOT DEVIATE

## Authorities
- Movement authority: playable Cyber Kitty checkpoint v11.1, commit ba742b10.
- Visual authority: user-approved high-definition Jade / Cyber Kitty design and large on-screen scale from the final idle/ready concept.
- New art must conform to both authorities. Neither may be silently redesigned.

## Identity lock
Jade is the neon Cyber Kitty psychic warrior: serious late-80s/90s cyberpunk manga language with a slightly cute but mature face; black hair; luminous pink cat-ear helmet/headset; black tactical streetwear; cropped upper layer; white/black asymmetric coat panels; detailed belts/hardware; armored knees; heavy futuristic boots; Power Glove/gauntlet; illuminated battery backpack; restrained pink/cyan technology; gritty high-contrast cel/manga rendering.

## Scale / detail lock
The large character presentation approved in the final Idle / Ready sheet is the on-screen target scale. Preserve readable face, helmet, hands, equipment, battery pack, knees and boots during gameplay. Source production frames target 1024x1536-class detail before runtime optimization. Runtime exports may be optimized but must not visually simplify the approved design.

## Pinned approved visual reference
- Source attachment: a_large_high_detail_concept_animation_reference_s.png
- Actual reference-sheet dimensions: 1536 x 1024 pixels; these are the sheet dimensions, not the dimensions of each individual sprite.
- SHA-256: fff8eeb8fcc3ef1ff3a830684c1ac5aac5f8f142cb3ed92283e8b6ec59d49e89
- This identifies the actual approved Idle / Ready image, not a newly generated reinterpretation.
- The fingerprint records the source attachment identity; it does not claim the image binary has been copied into this repository by this update.

## Production gate
Every batch must pass five review lanes before promotion:
1. IDENTITY — face, hair, helmet, proportions, equipment, palette.
2. BIOMECHANICS — pose follows locked v11.1 movement weight/timing.
3. CONTINUITY — neighboring frames and 24 directions remain coherent.
4. GAMEPLAY — anchors, collision footprint, cover contact, weapon/muzzle sockets.
5. RENDER — silhouette, no crops, readable detail, lighting/material consistency.

Final gatekeeper rule: a frame failing any lane remains experimental and cannot replace approved runtime art. Record each lane as pending, passed, or failed with its evidence. Do not mark all five passed from a concept illustration alone.

## First production family
RUN 360. 24 directions. Preserve the existing movement timing exactly. Build large high-detail source frames first; derive runtime atlases only after visual and mechanical validation.

## GLOBAL GAME ART AUTHORITY
This Jade design and rendering standard is the permanent visual authority for the entire game. All Jade animation families, characters, enemies, environments, props, generated cover, effects and cinematics must inhabit the same high-detail late-80s/90s manga/cyberpunk visual universe. Progress sheets may scale art down for review only. No downstream production lane may redesign Jade or lower the approved detail/scale target.

## MANDATORY BATCH VISUAL REPORT
Every meaningful sprite-production batch must include a visual review/contact sheet in its delivery. The report must show the actual current batch, readable full-body poses, the locked Jade reference, current status, and the next batch. Fewer larger poses are preferred over dense tiny thumbnails. Contact-sheet scale does not redefine source resolution or the approved gameplay presentation target.

A generated concept board is concept artwork, not an automatic collection of individually exported animation frames. Caption images accurately: CONCEPT REVIEW, EXPORTED FRAMES, or RUNTIME CAPTURE, as applicable. Do not put invented commit IDs, completion percentages, frame totals, QA passes, or deployment claims in images, even as decorative text. Clearly separate target counts from verified file counts.

When code/assets are committed, report the returned commit SHA. When a deployment is verified, report the actual deployment result. Otherwise say deployment is unverified. Never substitute a mockup for a runtime screenshot.

## FIVE-LANE REVIEW — PERMANENT
Every batch uses IDENTITY, BIOMECHANICS, CONTINUITY, GAMEPLAY, and RENDER checks. These are review responsibilities, not evidence that five separate autonomous workers are executing. Claim parallel execution only when it is actually supported and invoked. All reviews feed one final promotion decision; no reviewer can reinterpret the design.

## STATUS INTERPRETATION
Visual approval, source-art creation, frame extraction, directional coverage, anchor validation, runtime integration, and deployment verification are separate milestones. Older KEYS_LOCKED labels mean visual-direction approval only unless individually exported frames and animation tests are also recorded. Existing recovered runtime sprites are distinct from the new final-design HD source frames.
