# V12 CYBER KITTY 360 LOCOMOTION CONTRACT

## Golden movement baseline
Source checkpoint: v11.1 / ba742b10.
Do not alter the feel of acceleration, braking, slide velocity/duration, collision footprint, independent aim/move, fixed-step simulation, or cover contact while producing V12 art.

Cyber Kitty's current runtime motion is the animation framework. New art conforms to movement; movement is not retuned to hide art problems.

## Runtime constants locked for V12
- movement speed: 262 world units/sec
- acceleration response: 13
- stop drag: 0.002
- slide speed: 650 world units/sec
- slide duration: 0.70 sec
- actor radius: 17
- simulation: 1/60 sec
- runtime art cell: 250 x 250
- ground anchor: y=219
- directions: 24, nominal 15-degree spacing
- upper/lower-body relative twist ceiling: 145 degrees

## V12 production batches
A. READY / IDLE 360
B. RUN 360
C. START / ACCELERATE / BRAKE / RECOVER
D. BODY DROP / BASEBALL SLIDE 360
E. STRAFE / BACKPEDAL completion
F. COVER ENTRY / IMPACT / COMPRESSION / SETTLE
G. ATTACHED SHIMMY
H. CORNER STOP / HEAD PEEK / SHOULDER PEEK / MUZZLE CLEAR / POP-FIRE / RETRACT
I. CORNER WRAP / PUSH-OFF / COVER EXIT
J. 90-degree and 180-degree planted pivots

## Frame contract
Every production frame records direction, action, frame index, ground/pivot anchor, pelvis, head, left/right feet, hands, weapon grip, muzzle, cover contact, collision reference, source revision and approval state.

## Promotion gates
REFERENCE -> RIG ALIGNED -> GAMEPLAY VALIDATED -> ART APPROVED -> RUNTIME READY.
No family replaces the golden runtime until it passes neighboring-frame continuity, neighboring-direction continuity, anchor stability, no-crop, identity/equipment, weapon-hand and cover-contact checks.

## Visual lock
Original approved Cyber Kitty/Jade identity only. Dark 1990s manga/anime language, mature proportions, helmet/hair, battery backpack, gauntlets and asymmetric equipment remain consistent. No baked-in environmental cover inside character sprites.

## V12 success test
Controller loop must remain uninterrupted:
RUN -> PIVOT -> DROP -> SLIDE -> COVER IMPACT -> SETTLE -> SHIMMY -> CORNER STOP -> PEEK -> SHOTGUN FIRE -> RETRACT -> CORNER WRAP -> EXIT -> RUN.
