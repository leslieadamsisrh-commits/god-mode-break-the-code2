# Build 27H — central high ground preview candidate

Base commit: df75b89545cc74c2647f558ac5b9debbc0818c55. Arena remains 2200 × 1100. Jump (355 impulse / 900 gravity), camera, damage, battery costs and 27G controls are unchanged. Main playtest is not part of this deployment.

## Arena and collision
The previous perimeter deck network is replaced, not overlaid, by a central 400 × 240 terrace at Z72 (X900–1300, Y430–670). North and south stairs are 240 wide and 160 long. A 130 × 120 east bridge connects to a solid landing and third stair approach. Terrace and landing walls extend to ground; only the explicitly designated bridge has a thin deck and open underside. Four bridge columns remain physical. Shared definitions drive support, render faces, structure shots, held/throw clearance and builder exclusion.

A reproduced stair-top snag was corrected: the player’s prior stair support allows the final transition across the terrace’s expanded collision edge. Side walls remain solid. Spawn positions move from X600/1600 to X450/1750 at Y563, retaining the world footprint and providing 125-unit structural clearance. Both spawns can construct toward the fight.

High ground offers actual elevation and protected side walls, not a damage bonus. Multiple stairs and ground flanks provide approaches. The six-object curated Chase setup replaces the former 16-object random preset; it uses verified concrete barriers and movable floor slabs, leaving room for psychic construction. Existing other object definitions remain available.

## Visibility and presentation
The 27G full-textured translucent fighter redraw is removed. The local-player cue now consists of 26 small pulsing anatomical contour points, clipped to foreground structure faces. No equipment, face, weapon textures or fighter effects are replayed. Opponents never receive this cue. Actual sprite occlusion and physics remain unchanged. This is a simplified location contour, not an animation-frame-exact sprite mask; live motion and boundary-fade acceptance remain outstanding.

Broad blue-gray deck tops, ink contours, cel-shaded walls, inset seams, warm wall lights and terrace inset markings use the existing projection. Existing quiet 27F floor and approved backdrop assets remain. The reference sheets were inspected; no new production sprites or exact reference reconstruction are claimed.

## Cover
Authoritative cover now has Z and vertical velocity. Carrying follows support elevation and the holder’s height; released cover falls onto actual support. Rendering, cover occlusion, player height checks, projectile intersections and thrown-cover player checks include cover elevation. Melee checks cover height. Construction cannot reach through a solid structure. Cover can be placed on flat elevated support, while slope placement is rejected.

Default hold follows gun facing without the previous sideways angle offset, at a consistent radius of at least 100 units (larger objects retain safe clearance). Existing deliberate Grip manipulation remains available. Swept translation/rotation and clear blocked hints remain. No cost, impulse or damage retuning. Complex corner-supported placements, thrown-cover interactions and all directional art cases still need browser acceptance.

## Builder preservation
Version 2 layouts and IDs remain intact. All new structural footprints are excluded from ground placement, including stair access and the short bridge passage. Route generation includes reserved structures. Random generation remains seeded, bounded to 800 attempts/24 objects and validated. Empty/reduced output is its safe fallback.

A separate device-local pre-27H layout backup is retained. Old incompatible layouts and imports can be loaded as repair drafts; red objects must be moved before play/save. EXPORT ORIGINALS downloads the untouched pre-27H backup. No old backup is deleted and unrelated settings remain untouched.

## Verification
Baseline 27G production build and 27F/27G tests passed before changes. Candidate production build passed. Build 25, 26, 27A, 27B adapter/integration, 27C, 27D, 27E, 27F and 27G regressions pass after updating the tests' old geometry coordinates and preset counts. Combat expectations remain. The 27G combat fixture moved to unobstructed ground rather than spawning inside the new solid terrace.

New 27H simulation tests pass: all three stair landings, solid wall and tangential movement, underpass without snapping, wall/projectile obstruction, oversized bridge clearance rejection, carried-cover stair ascent, elevated placement and projectile hits, clear spawns, through-wall construction rejection, sparse preset and seeded layout reproduction. Native canvas cue test: 147 nontransparent pixels, maximum alpha 63/255 beneath bridge; zero pixels in clear space. This proves clipping/sparsity in that fixture, not full live visibility acceptance.

Two-client HTTP tests cover selected layout, host-only editing, airborne fire/shield, dedicated time fields, matching held object ID and height within snapshot-time tolerance, and rematch restoration. These are API clients, not independent browser playtests.

Measured 24-object simulation CPU: median 0.134 ms, p95 0.403 ms, worst 7.330 ms in the recorded run. Ninety seeded generation/regeneration cases took 3517 ms. Structure-only native canvas sampling before the final decorative pass measured median 0.38 ms / p95 1.43 ms. None is rendered browser FPS or input latency.

## Remaining acceptance
Actual two-browser combat, iPad/controller hardware feel, full gameplay screenshots, effect-heavy frame pacing, and input/feedback latency remain unverified. The sparkle is a simplified contour and requires visual acceptance. Art remains a procedural material pass using existing assets; new jump-leg animation is not added. Loose-matter elevation behavior is still inherited and is not claimed equivalent to the newly elevated whole-cover path. No promotion to main is permitted until preview acceptance passes.
