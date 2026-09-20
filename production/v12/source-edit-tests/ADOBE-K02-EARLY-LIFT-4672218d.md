# Adobe source-edit qualification — K02 early shotgun lift

Status: REJECTED / NOT FOR RUNTIME. This is a tool qualification result, not a completed sprite family or a new playable release.

## Authorization and immutable authority
The user connected Adobe to test a controlled edit of the already-approved Jade artwork. The permitted objective is a missing neighboring arm/shotgun-lift pose, not a new character design. combat-lab/JADE-FINAL-VISUAL-LOCK.md remains authoritative. Its pinned reference SHA-256 is fff8eeb8fcc3ef1ff3a830684c1ac5aac5f8f142cb3ed92283e8b6ec59d49e89.
Observed branch head before this report: 49b3e984aba59c277963ebceeceaa25021797a68.

## Exact input and actual operation
Input: assets/final/K02.png from the delivered JADE_V12_08J_Continuous_Character.zip. Native dimensions 640 x 809, RGBA, 755361 bytes, SHA-256 435a882af1a4fd906a4857592176860c6a67eb235cfcc5cb8ec7ea56437e110b. The original was extracted/read, not resized or repainted.
Upload succeeded through Adobe.asset_openai_file_upload. Adobe asset: urn:aaid:sc:VA6C2:7c599398-42b3-4eb7-95be-7cc83721f8cf.
One Adobe.image_instruct_edit call was made; PNG requested, n=1, seed=80201, promptReasoner=quality. Response reported success, requestId 4672218d-fd4b-4ba4-9fba-4b89ce4b70dd, output identifier urn:aaid:ps:US:968c8308-13b2-4c59-b948-6d42be0e4623. An Adobe inline preview of that output was inspected against the original.
Successful generation means an output exists; it does not mean art acceptance.

## Submitted instruction
Create one missing intermediate animation pose from this exact approved Jade character image. Keep the same serious detailed 80s/90s cyberpunk manga rendering and do not redesign her. Preserve her face, expression, black hair, neon pink cat-ear helmet, outfit, asymmetric coat markings, armor, boots, equipment, colors and proportions. Keep the original canvas framing and individual character scale, with her full body visible. Preserve the low crouched pelvis, knees and both planted feet at the same positions. Change only the arm-and-shotgun lifting action needed for the next neighboring frame: both hands still hold the same shotgun, the support forearm begins lifting the fore-end, the muzzle is partway higher toward a level firing position, and the stock moves a little closer to her shoulder but is not fully shouldered yet. The wrists and elbows articulate naturally; do not bend or redesign the weapon. This is an early-lift in-between, not the final aiming pose. Preserve a transparent background. Output only one full-body character: no cover, scenery, floor, contact shadow, muzzle flash, labels, text, borders, layout, extra figures or production poster.

## Gate results
- Identity: FAILED. Preview changes face/expression and head presentation; character surfaces and ink/shading are reinterpreted rather than limited to the requested arm-and-weapon motion.
- Biomechanics: NOT VALIDATED. The preview does not establish a correctly registered neighboring pose between original K02 and K03.
- Continuity: FAILED for promotion. Weapon geometry and overall rendering differ visibly from the input. No animation continuity test performed.
- Gameplay registration: NOT TESTED. No replacement of feet/root/hand/muzzle sockets or gameplay frame selection.
- Render-content: FAILED. A substantial ground shadow is present despite the character-only requirement. The preview has a white surround; transparency cannot be concluded from that surround alone.
- File properties: output PNG format is reported by Adobe, but native output dimensions, alpha-channel values and checksum were not verified. Direct download failed due to hostname resolution; a second download route was blocked by its URL-view prerequisite. The preview was still obtained through Adobe. Do not invent binary verification results.

## Outcome and storage boundary
One generated candidate; zero accepted new frames. Original K02/K03, visual lock, 08J gameplay, movement, loader and deployment configuration remain unchanged. No multiplayer implementation, Vercel deployment, subscription purchase or autonomous-agent launch was performed by this pass. Tool usage/credit cost was not reported in the generation result and is not asserted to be zero.
This commit saves only this factual report and the prompt/identifiers. It does not save the generated output binary into GitHub, and a provider output identifier is not a permanent source backup.

## Decision
Do not mass-produce using this demonstrated whole-image edit method or weaken the visual lock to accept the result. One rejected trial does not prove all Adobe editing is unsuitable; it does show that this call did not preserve the character. A tighter source-preserving/layered workflow must be demonstrated before claiming an animation production pipeline. Body-registration work can proceed on exact source pixels without waiting for a subscription or a new drawing.
The user's two-player goal must be scoped separately from completion of the full art library: a private 1v1 test could use existing honest art coverage first, but networking, shared state, hits/respawns, access protection and a two-device test are still implementation/verification work. Do not label the current single-player 08J file multiplayer.
