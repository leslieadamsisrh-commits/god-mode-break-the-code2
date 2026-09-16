# GOD MODE: BREAK THE CODE
## Sprite-First Production Separation Master Prompt

Use this prompt in the game-building chat to separate sprite production from combat programming, reduce workload per pass, protect the approved combat feel, and prevent another oversized build or backup operation.

---

## PRIMARY DIRECTIVE

Do not attempt to generate sprites, rewrite combat mechanics, integrate every animation, optimize the entire game, publish the Site, and create a complete backup in the same pass.

The current priority is **Sprite Production only**.

Preserve the latest working GOD MODE combat build exactly as it is. Do not change its movement, aiming, shotgun behavior, acceleration, braking, slide, cover attachment, camera, collision, multiplayer synchronization, damage, or other approved gameplay values during this sprite-production phase.

Complete and organize the sprite system separately. Integration into the game will occur later, one approved animation group at a time.

---

## IMPORTANT DESIGN CORRECTION: THE “30-SECOND” IDEA

Remove any rule stating that a duel or match must last only 30 seconds.

“Thirty-second combat” describes the **feeling and intensity target**, not the match timer. The player should be able to enter a confrontation and create an action-movie sequence within the first 30 seconds: sprint, slide, attach to cover, dodge, slow time, block or reflect attacks, generate weapons, destroy the environment, eliminate an opponent, survive, and immediately pursue the next opponent.

The goal is repeated 30-second bursts of spectacular, readable, high-skill action inside a longer match.

Support selectable match durations as game settings:

- 2 minutes
- 3 minutes
- 5 minutes
- Optional custom duration for testing or private matches
- Optional score-limit, elimination, or last-player-standing victory conditions independent of the timer

Do not rebalance or implement these match settings during the sprite-production phase. Record them in the protected design specification for later combat integration.

---

## CREATE THREE SEPARATE PROJECT SOURCES

Organize the work into three clearly separated sources. Do not combine them into one oversized archive or startup payload.

### 1. Combat Core — Protected Golden Build

Purpose: preserve the approved playable mechanics.

Create or retain a protected branch/folder named:

`god-mode-combat-core`

It must contain:

- The latest working shotgun combat code
- Movement, acceleration, braking, and turning values
- Independent movement and aiming
- Baseball slide and upright dash behavior
- Slide-to-cover, cover attachment, directional exits, pop-fire, and cover aiming
- Camera, collision, hit detection, damage, and multiplayer rules
- A minimal lightweight placeholder character set sufficient to test mechanics
- A human-readable baseline document containing all current approved gameplay values

Rules:

- Do not import the full sprite library here yet.
- Do not alter approved combat values while producing art.
- Do not replace or overwrite this source.
- Treat this as the recoverable golden build.

### 2. Sprite and Animation Library — Current Work Source

Purpose: create, clean, label, validate, and optimize all visual animation assets without touching gameplay.

Create a separate branch/folder named:

`god-mode-sprite-library`

Use this source for the current phase.

Organize assets using this structure:

```text
sprites/
  heroine/
    shared/
    unarmed/
    handgun/
    assault-rifle/
    shotgun/
    sniper-rail/
    rocket-launcher/
    melee-gauntlet/
    shield/
    psychic-powers/
    damage-reactions/
    finishers/
  enemies/
  effects/
  source-art/
  runtime-atlases/
  manifests/
  previews/
```

Every game-ready sprite must have metadata identifying:

- Character
- Weapon or power
- Action
- Facing or aim direction
- Frame number
- Animation stage
- Pivot/foot anchor
- Hand and weapon anchors
- Muzzle position when applicable
- Cover-contact anchor when applicable
- Collision reference bounds
- Source version
- Runtime atlas assignment

Keep full-resolution source artwork separate from optimized runtime atlases. Never load all source atlases at game startup, publish them inside the browser build, or convert the complete art archive to Base64.

### 3. Integration Build — Reserved for the Next Phase

Create or reserve a branch/folder named:

`god-mode-sprite-integration`

During this sprite-only phase, create only the manifests, import contracts, anchor data, and previews needed for future integration. Do not perform full integration yet.

After the sprite library is completed and approved, this source will import one animation group at a time into a copy of the protected Combat Core.

---

## SPRITE PRODUCTION REQUIREMENTS

Maintain the established visual direction:

- Dark 1990s anime and manga aesthetic
- Akira-inspired weight, shadows, linework, and restrained psychic energy
- Mature proportions rather than a cartoon or chibi appearance
- Consistent heroine identity, helmet, hair, coat tails, clothing, gauntlets, and battery backpack
- Solid character silhouettes with no cropped limbs, missing body pieces, accidental cover baked into poses, or transparent cutoffs
- Grounded contact with the battlefield
- Independent aiming and movement must remain visually possible

The slide-to-cover sprites must show only the heroine performing the movement. Do not draw a wall, barrier, or piece of cover into the character sprite. The game environment supplies the actual cover object.

Produce the directional coverage required by the approved design:

- 24-point presentation where required for the strongest pseudo-3D effect
- At minimum, validated movement, pose, and aim transitions across all required gameplay directions
- Consistent proportions and equipment between neighboring directions
- No mirrored text, asymmetrical equipment errors, weapon-hand swaps, or sudden costume changes

Include complete sprite families for:

- Idle and breathing
- Start, run, sprint, turn, brake, and stop/recovery
- Upright dash and dodge
- Baseball slide: entry, travel, impact, recovery, and interrupted states
- Slide into cover from applicable approach angles
- Attached-to-cover idle, locomotion, turn, aim away, aim over, aim around either edge, pop-fire, retreat, diagonal exit, and advance around a reachable edge
- Independent lower-body movement and upper-body aim combinations
- Weapon matter generation: gather, orbit, wireframe, assembly, scan, solidify, ready, and dissolve
- Ready, aim, fire, recoil, muzzle flash, recovery, reload, and weapon transitions for each firearm
- Shield deployment and directional shield poses
- Slow-time, Grip, cover generation, Unmake, Orbit, Pinball, parry, and other psychic actions
- Melee palm strike, backhand, heavy punch, cover-chunk strike, hit reactions, stagger, knockdown, recovery, defeat, and finishers
- Hair, coat tails, backpack, helmet, shield, weapon, muzzle flash, and effects layers when separate layers improve animation quality

---

## WORK IN SMALL, APPROVABLE BATCHES

Do not generate or process every sprite family in one operation.

First inventory all existing assets. Detect exact duplicates, missing directions, cutoff frames, inconsistent poses, incorrect anchors, art-style drift, and unusable files. Do not regenerate a valid approved sprite merely because its filename differs.

Then process one animation group per pass in this order:

1. Character model sheet, proportions, equipment, palette, and directional identity lock
2. Idle, breathing, turn, and transition poses
3. Run, sprint, brake, stop, upright dash, and dodge
4. Baseball slide and slide recovery
5. Slide-to-cover and attached-cover movement/aiming
6. Shotgun generation, ready, aim, fire, recoil, reload, and dissolve
7. Remaining firearms, one weapon at a time
8. Shield, parry, and slow-time
9. Grip, generated cover, Unmake, Orbit, and Pinball
10. Melee gauntlet actions
11. Damage reactions, knockdowns, defeats, and finishers
12. Enemy animation families and effects

For each batch:

1. Reuse approved assets whenever possible.
2. Generate or repair only missing or invalid frames.
3. Remove backgrounds and correct transparent edges.
4. Normalize canvas, scale, palette, and character proportions.
5. Set and validate anchors.
6. Build a lightweight preview sheet or animation preview.
7. Check directional continuity and neighboring-frame continuity.
8. Export optimized runtime assets and update the manifest.
9. Save and commit that batch independently.
10. Report the completed frames, reused frames, repaired frames, missing frames, file sizes, and validation results before starting another batch.

Do not begin the next batch if the current batch has unresolved cutoffs, identity drift, incorrect direction, inconsistent scale, incorrect anchors, or missing required frames.

---

## PERFORMANCE AND FILE RULES

- Do not decode or retain all 108 full-resolution atlases at startup.
- Do not embed the complete sprite collection as Base64.
- Do not include source artwork in the published runtime package.
- Do not create an archive containing caches, dependency folders, temporary renders, duplicate exports, test screenshots, or obsolete generated files.
- Keep small preview images available for browsing the complete library.
- Load full-resolution source art only during art production.
- Export trimmed, optimized, power-of-two runtime atlases only after a batch passes validation.
- Design the future runtime loader to load only the active character, equipped weapon, current action group, and nearby required transitions.
- Set an explicit memory budget and report measured retained image memory instead of assuming performance.

---

## VERSION CONTROL AND BACKUP RULES

Before sprite work begins:

1. Verify the connected repository and active branch.
2. Confirm the latest Combat Core is already committed and recoverable.
3. Create a labeled protected checkpoint without altering the approved mechanics.
4. Create the separate Sprite Library work source.

During production:

- Commit each completed animation batch separately.
- Use descriptive commit messages naming the character, action, weapon, directions, and status.
- Never overwrite the protected Combat Core branch with art-production changes.
- Push normal files through Git/Git LFS as appropriate; do not transfer the repository through the chat as Base64.
- Verify each push succeeded and record the exact commit identifier.
- If a generated file is too large for normal Git storage, use the repository’s supported large-file workflow or exclude regenerable intermediates. Do not silently omit irreplaceable source art.

---

## CURRENT PASS: STOP CONDITION

For the first pass, perform only the following:

1. Preserve and verify the Combat Core checkpoint.
2. Establish the three separated sources.
3. Inventory and classify all existing sprite assets.
4. Produce a missing/invalid/duplicate sprite report.
5. Lock the heroine’s character model, proportions, equipment, palette, and directional identity.
6. Complete only Batch 1: the character model sheet and directional identity lock.
7. Create previews, manifests, and anchor standards for that batch.
8. Save and push the batch independently.
9. Stop and present the results for approval.

Do not integrate the sprites into live combat, alter mechanics, publish the game, or begin Batch 2 during this pass.

---

## REQUIRED COMPLETION REPORT

At the end of the pass, report:

- Combat Core checkpoint status and exact commit identifier
- Sprite Library branch/folder and exact commit identifier
- Integration source status
- Number of source assets inventoried
- Exact duplicates found
- Valid reusable sprites found
- Missing, cropped, inconsistent, or unusable sprites found
- Batch 1 frames created, reused, and repaired
- Preview and manifest locations
- Source-art size versus optimized runtime size
- Measured memory information, if a runtime preview was tested
- Unresolved problems requiring approval
- The single next recommended sprite batch

Do not report that the sprite system is complete unless every required family, direction, frame, anchor, and validation item is actually present and verified.

