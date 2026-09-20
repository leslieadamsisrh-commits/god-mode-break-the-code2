# V12 08K — Registration and Multiplayer Gate Plan

## Current objective
Align final-design Jade and recovered movement art to one simulation root using presentation-only registration. Do not alter movement, collision, cover physics or Jade's approved design to hide art mismatches.

## 08K acceptance
1. Root remains identical across source changes.
2. Pelvis and both feet are measured for each supported final-design pose and the corresponding recovered comparison.
3. Pose changes may bend/crouch/lean but may not create unexplained screen-space body jumps.
4. Calibration offsets are presentation-only, reviewable, and never modify collider position.
5. Existing visibility, cover-routing, movement, shot and damage regressions remain green.

## Shortest route to two-player play
### Gate A — single-player final-design combat loop
One complete right-hand cover action: low-ready -> raise -> aim -> fire -> recoil -> recover -> retract -> exit, using final-design Jade. Run/slide may temporarily remain recovered if visibly labeled.

### Gate B — final-design locomotion minimum
Final-design idle, run, slide, cover entry, cover idle/shimmy and corner action for the directions required by the first arena. Unsupported views are not silently mirrored.

### Gate C — deterministic two-player simulation
Two player actors use the same movement/action rules, each with independent input, damage, cover, aim, and shot events. Local two-controller test first.

### Gate D — networked 1v1
Authoritative host/server state, input/state synchronization, interpolation, hit reconciliation, join/rejoin, restart and match reset. Test on two machines before public lobby work.

### Gate E — brother playtest
Private 1v1 link/session with both players using the validated art/movement set. Record latency, state divergence, visual continuity, cover behavior and shot fairness before expanding to 2v2/FFA.

## Honest distance
The engine/mechanics prototype exists, but full final-design coverage does not. Multiplayer networking and final-design animation are separate remaining workstreams. A private 1v1 can be reached before the whole 24-view library only if the first arena deliberately constrains/labels unsupported art; a fully final-design 360-degree 1v1 requires the locomotion and combat families to be completed for both players first.
