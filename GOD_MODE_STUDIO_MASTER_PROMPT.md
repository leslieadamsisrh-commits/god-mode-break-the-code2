# GOD MODE: BREAK THE CODE
# COMBAT MASTER STUDIO — SINGLE-SITE MASTER PRODUCTION PROMPT

## ROLE / AUTHORITY

Act as the combined:
- Game Director
- Technical Director
- Lead Gameplay Programmer
- Multiplayer Engineer
- Combat Designer
- Animation Systems Engineer
- Tools / Editor Engineer
- Level / Map Tools Engineer
- Technical Producer
- QA Lead

The creator remains the final creative authority.

Your job is to build and maintain ONE permanent GOD MODE Studio where the creator can:
1. play and tune the Combat Master,
2. inspect and replace sprites,
3. edit maps and assets,
4. save drafts and presets,
5. publish approved combat/map settings to multiplayer,
6. keep multiplayer ready in the background without exposing creator tools to normal players.

Do not fragment the project into new websites for every experiment.

---

# 0. ABSOLUTE RULES

DO NOT START ANOTHER WEBSITE.
DO NOT START ANOTHER GAME.
DO NOT RECREATE WORKING SYSTEMS FROM MEMORY.
DO NOT MIX OLD RENDERERS INTO THE current Combat Master.
DO NOT LET prettier presentation override gameplay authority.

Maintain:
- one codebase,
- one permanent site,
- one combat simulation schema,
- one sprite manifest,
- one map schema,
- one published multiplayer configuration.

The stable baseline for this production room is:

COMBAT AUTHORITY:
- V12 Combat Master / recovered Version 57 movement
- authoritative movement values:
  - move speed 262
  - response 13
  - stop drag .002
  - slide speed 650
  - slide duration .70
  - fixed simulation 1/60

MULTIPLAYER AUTHORITY:
- verified V12-08L private duel architecture
- private room
- host / guest
- authoritative movement / cover / shot / health state
- reconnect
- rematch
- room/session isolation

SPRITE AUTHORITY:
- approved SMALL pink-cape Jade runtime sprite family
- 24-direction ready / run / slide / cover
- approved recovered runtime assets only
- no guide-sheet graphics
- no giant artwork panels
- no silent sprite substitution

EDITOR REFERENCES TO RECOVER:
- Dimension 33 Map Markup editor
- Structure Lab / Place Pieces editor
- runtime scale calibration tools

---

# 1. CURRENT PLAYABLE GOAL

FIRST BUILD ONLY:

- solo Jade
- neutral floor
- small approved pink-cape Jade sprites
- Master Combat movement
- independent aim / move
- shotgun
- slide
- cover behavior required by combat
- shield
- Slow Time
- Grip
- throw
- Orbit
- Pinball
- melee / Power Glove
- health
- hit reactions
- knockback
- matter chunks on the floor
- instant reset
- controller + keyboard/mouse
- Director Mode
- Sprite Workshop
- Map Designer 2 architecture available

DO NOT add production HUD/map/environment art yet.

Multiplayer remains preserved and compatible in the background.

---

# 2. SINGLE-SITE PRODUCT STRUCTURE

Use ONE permanent GOD MODE Studio application.

Suggested creator navigation:

PLAY
DIRECTOR
SPRITES
MAP DESIGNER
ASSETS
PUBLISH
MULTIPLAYER TEST

Normal player navigation:

PLAY
HOST FIGHT
JOIN FIGHT

Creator-only systems must be protected by server-side/admin authorization.
Do not rely on hiding buttons with CSS.

Normal players never see:
- tuning sliders
- sprite filenames
- map editing controls
- hitbox editors
- debug tools
- publish controls
- asset-management tools

---

# 3. SHARED CONFIG ARCHITECTURE

Create shared data-driven configuration.

Use separate but connected versioned objects:

CombatConfig
SpriteConfig
MapConfig
AssetManifest
PublishedBuild

Do not scatter important values across unrelated files.

Solo and multiplayer consume the SAME published CombatConfig.

Map playtest and multiplayer consume the SAME published MapConfig.

---

# 4. COMBAT CONFIG

CombatConfig must expose live-tunable categories.

MOVEMENT
- moveSpeed
- acceleration / response
- braking / drag
- character radius
- turn response
- aim/body split threshold

SLIDE
- speed
- duration
- drag
- cooldown
- cover capture radius
- slide exit force

AIM
- sensitivity
- twist limit
- body turn threshold
- reticle response
- aim smoothing

SHOTGUN
- pellets
- spread
- cadence
- projectile speed
- damage
- recoil
- knockback
- muzzle offset

HEALTH / HIT
- maxHealth
- head multiplier
- torso multiplier
- leg multiplier
- hit stun
- knockback
- recovery

SHIELD
- battery drain
- absorption
- reflect force
- pushback

SLOW TIME
- time scale
- battery drain

GRIP
- acquisition radius
- hold distance
- battery drain
- throw force

ORBIT
- max pieces
- radius
- speed
- launch force

PINBALL
- speed
- duration
- battery cost
- bounce response

MELEE
- range
- damage
- knockback
- cooldown

MATTER
- mass
- friction
- restitution
- impact damage
- ricochet damage

CAMERA
- zoom
- follow response
- look-ahead
- shake
- damage zoom

VISUAL
- Jade scale
- ground anchor
- effect density
- trail duration

All appropriate values must update live without rebuilding the site.

---

# 5. DIRECTOR MODE

Build a creator-only in-game Director Panel.

It opens over the running Combat Lab.

Allow instant changes to:
- movement
- slide
- weapons
- powers
- health
- hitboxes
- camera
- sprite scale / anchors
- effects
- matter

Required actions:

SAVE DRAFT
SAVE PRESET
LOAD PRESET
RESET
UNDO
REDO
COPY SETTINGS
IMPORT SETTINGS
PUBLISH TO MULTIPLAYER
ROLL BACK PUBLISHED VERSION

Director changes should be data changes, not code rewrites.

---

# 6. DRAFT VS PUBLISHED

DRAFT:
- creator-only
- live editable
- safe for experimentation
- does not mutate active multiplayer rooms

PUBLISHED:
- immutable version snapshot
- used by new multiplayer rooms
- versioned

Example:
Combat Config 001
Combat Config 002
Combat Config 003

Existing multiplayer rooms stay on their starting published version until explicit restart/rematch.

Never silently change competitive rules mid-round.

---

# 7. SPRITE WORKSHOP

Sprite Workshop is creator-only and exists inside the same site.

Families:
- Ready
- Run
- Strafe
- Backpedal
- Slide
- Cover
- Aim
- Fire
- Recoil
- Hit
- Melee
- Power
- future families

For every active state show:

ACTION
DIRECTION INDEX
ANGLE
CURRENT FRAME
FRAME COUNT
SPRITE FILE
SPRITE STATUS
GROUND ANCHOR
X OFFSET
Y OFFSET
SCALE
PLAYBACK SPEED

Direction display must use both naming systems.

Example:
d07
105 degrees

---

# 8. TRAINING DIRECTOR

Create guided animation testing.

Examples:

MOVE NORTH
MOVE NORTHEAST
RUN EAST
AIM 105°
SLIDE 105°
FIRE
BACKPEDAL WHILE AIMING FORWARD
ENTER COVER
EXIT COVER
ACTIVATE SHIELD
GRIP MATTER
THROW MATTER
ACTIVATE ORBIT
LAUNCH ORBIT
PINBALL

When the action occurs, identify:

ACTION: SLIDE
DIRECTION: d07
ANGLE: 105°
FRAME: 06 / 12
SPRITE: slide-d07.webp

Make sprite bugs reproducible.

---

# 9. SPRITE APPROVAL PIPELINE

Each sprite slot has status:

APPROVED
CANDIDATE
REJECTED
MISSING

Never overwrite APPROVED automatically.

New art enters as CANDIDATE.

Support side-by-side or toggle comparison:

APPROVED
vs
CANDIDATE

Actions:

PREVIEW CANDIDATE
USE APPROVED
PROMOTE TO APPROVED
REJECT
RESTORE PREVIOUS

Record approval history.

---

# 10. HITBOX EDITOR

Show live hitboxes over the character.

Start with:

HEAD
TORSO
LEGS

Allow:
- width
- height
- offsets
- damage multiplier
- enable / disable

Later extend to:
- melee volumes
- shotgun muzzle
- shield volume
- Grip radius
- cover capture region

Hitbox changes update immediately.

---

# 11. MATTER TEST FLOOR

Neutral floor only.

Place simple matter pieces:

STONE
STONE
METAL
METAL
STONE
METAL

Support:
- Grip
- hold
- throw
- Orbit
- launch Orbit
- collision
- impact damage

No decorative environment required.

---

# 12. MULTIPLAYER BACKGROUND ARCHITECTURE

Preserve V12-08L architecture.

Current priority is SOLO tuning.

Multiplayer remains available but not visually prioritized.

Maintain:
- private rooms
- join code/link
- P1 / P2
- server authority
- health
- shots
- damage
- rounds
- rematch
- reconnect

Add presentation smoothing:

LOCAL PLAYER:
- immediate local prediction
- reconcile against server authority

REMOTE PLAYER:
- snapshot interpolation

SERVER:
- authoritative fixed 60 Hz simulation

Do not let interpolation affect authoritative combat results.

---

# 13. MAP DESIGNER 2

Map Designer 2 must live inside the SAME GOD MODE Studio.

It evolves the proven:
- Dimension 33 Map Markup tool
- Structure Lab / Place Pieces tool
- runtime scale calibration panel

It is not a separate site.

## CORE WORKFLOW

Creator can switch:

PLAY MODE
↔
MAP DESIGN MODE

without leaving the current map.

Map Designer controls:

SELECT
MOVE
DRAG
ROTATE
SCALE
RESIZE
MIRROR
DUPLICATE
DELETE
LOCK
HIDE
SHOW
SNAP
UNSNAP

Allow direct manipulation of placed objects.

## OBJECT TYPES

Each placed item can have one or more tags:

COVER
BREAKABLE
SCENERY
BLOCKED
ROUTE
SPAWN
PICKUP
MATTER
HIGH GROUND
LOW GROUND
PORTAL
HAZARD
DECORATION
COLLISION ONLY

## COLLISION

Every asset can independently control:

visual enabled
collision enabled
cover-enabled
breakable
matter-yield
blocks shots
blocks player
occludes player

Allow collision visualization.

## TRANSFORM PANEL

Selected asset shows:

asset name
asset ID
X
Y
Z/depth
scale X/Y
rotation
mirror
collision bounds
cover line
health / integrity
material type
destructibility
layer
lock state

## MAP LAYERS

Use explicit layers:

GROUND
LOW STRUCTURES
COVER
GAMEPLAY OBJECTS
CHARACTERS
HIGH STRUCTURES
FOREGROUND
LIGHTING / FX

Allow hide / show / lock per layer.

## MAP MARKUP

Recover the earlier markup categories:

COVER
BREAKABLE
SCENERY
BLOCKED
ROUTE

Add:

SPAWN
MATTER
PICKUP
CAMERA
HAZARD

Markup should be data, not painted onto source artwork.

## ROUTE / COMBAT TEST

From Map Designer:

DONE: PLAY
COMBAT TEST

instantly switches back into Combat Master play using the current Draft MapConfig.

No redeploy.

Test:
- slide routes
- cover attachment
- collision
- projectile clearance
- Gripable matter
- camera readability

## MAP SAVE SYSTEM

Required:

NEW MAP
SAVE DRAFT
SAVE AS
DUPLICATE MAP
LOAD MAP
RESET
UNDO
REDO
COPY MAP JSON
IMPORT MAP JSON
EXPORT MAP
PUBLISH MAP

Maps are versioned.

Example:

MAP: Neutral Combat Lab 001
MAP: Dimension 33 Graybox 004
MAP: Bay Bridge 001

## PUBLISHED MAP

Multiplayer rooms load the current Published MapConfig.

Active matches never mutate when the creator edits a draft.

Publish changes only affect new rooms / explicit restarts.

---

# 14. ASSET LIBRARY

Add creator-only Asset Library.

Every reusable object has:

asset ID
name
category
source file
preview
default scale
pivot / ground anchor
collision preset
cover preset
destructibility preset
material type
approval status
version

Asset categories:

COVER
STRUCTURE
PLATFORM
STAIRS
RAMP
WALL
PROP
MATTER
PICKUP
BACKGROUND
FOREGROUND
FX

Asset statuses:

APPROVED
CANDIDATE
REJECTED

Never silently replace approved assets.

Map Designer places references to Asset IDs rather than duplicating raw source data.

---

# 15. LIVE ASSET TUNING

Allow map assets to be adjusted live:

scale
rotation
position
mirror
pivot
collision size
cover edge
health
break force
matter yield
draw layer
occlusion

Save adjustments as:
- instance override
or
- updated asset preset

Do not require source-code edits for ordinary placement/tuning.

---

# 16. DIRECTOR NOTES / CHAT HANDOFF

Every editor panel includes NOTES.

Examples:

"slide d07 frame 6 left booster too high"

"center cover needs 12% smaller collision"

"shotgun recoil needs more backward force"

"sniper tower scale is too big compared with Jade"

COPY DIRECTOR PACKET should include automatically:

build
draft config version
published config version
current mode
current map
selected asset
selected sprite
action
direction
frame
weapon
position
aim
relevant tuning values
creator note

This creates a compact context packet for ChatGPT.

Normal local editing uses ZERO ChatGPT/API usage.

AI-connected Director Chat is optional and added later.

---

# 17. PERSISTENCE

Persist:

Draft CombatConfig
Published CombatConfig
Combat presets

Draft SpriteConfig
Published SpriteConfig
Sprite approval history

Draft MapConfig
Published MapConfig
Map versions

AssetManifest
Asset approval history

Do not rely only on temporary browser state.

---

# 18. SAME-SITE PUBLISH PIPELINE

Creator workflow:

EDIT COMBAT
EDIT SPRITES
EDIT MAP
TEST SOLO

↓
SAVE DRAFT

↓
PLAY AGAIN

↓
PUBLISH BUILD

Publish creates an immutable bundle:

PublishedBuild {
 combatConfigVersion,
 spriteConfigVersion,
 mapConfigVersion,
 assetManifestVersion
}

New multiplayer rooms use this exact PublishedBuild.

Normal players never see editing controls.

---

# 19. PERFORMANCE RULES

Prioritize:

input latency
stable simulation
sprite smoothness
animation registration
combat readability

Use:
- fixed simulation step
- render interpolation
- client prediction where safe
- sprite preloading
- asset caching
- pooled effects
- bounded debris
- bounded particles

No background/map visual is allowed to make Combat Master feel worse.

---

# 20. SINGLE-SITE UPDATE PHILOSOPHY

From this point forward:

DO NOT create a new website for a tuning change.
DO NOT create a new map site.
DO NOT create a separate sprite site.
DO NOT clone the game for minor adjustments.

Use GOD MODE Studio.

Only actual code/system additions require deployment.

Ordinary combat tuning, sprite routing, hitbox editing,
map layout and asset placement happen inside the editor.

---

# 21. PRODUCTION ORDER

PHASE 1
Stripped Solo Combat Master
small Jade
neutral floor
all Combat Master moves
matter

PHASE 2
Director Mode
CombatConfig
hitbox editor
presets

PHASE 3
Sprite Workshop
Training Director
approval workflow

PHASE 4
Map Designer 2
Asset Library
neutral map editing

PHASE 5
Lock Combat Master baseline

PHASE 6
Add approved HUD

PHASE 7
Build / import production background using Map Designer 2

PHASE 8
Place production assets using Asset Library

PHASE 9
Enable multiplayer playtest using SAME PublishedBuild

Do not skip forward because visual assets are exciting.

---

# 22. CURRENT SUCCESS GATE

Stop before production HUD / background / final assets.

The current phase succeeds when the creator can:

1. Open ONE GOD MODE Studio site.
2. Start solo immediately.
3. Move Jade smoothly.
4. Aim independently.
5. Run.
6. Slide.
7. Shoot.
8. Use all recovered Combat Master powers.
9. Manipulate floor matter.
10. Open Director Mode.
11. Tune movement live.
12. Tune weapons/powers live.
13. Edit hitboxes live.
14. Save/load presets.
15. Open Sprite Workshop.
16. See exact action/direction/frame/sprite.
17. Run guided movement tests.
18. Preview candidate sprites.
19. Preserve approved sprite authority.
20. Open Map Designer 2.
21. Place/move/scale/rotate/mirror/duplicate/delete test assets.
22. Mark cover/breakable/scenery/blocked/routes.
23. Toggle collision visualization.
24. Combat-test the edited draft map instantly.
25. Save Draft MapConfig.
26. Publish a versioned Combat/Sprite/Map configuration.
27. Keep multiplayer ready to consume the same published build.

At this gate:
STOP.
REQUEST CREATOR PLAYTEST FEEDBACK.

Do not add production HUD/map art/environment assets until the combat baseline is approved.
