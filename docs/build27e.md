# Build 27E — structure candidate

Base: dca4da8cac4da879f4b46eacb443cd2965cf335b. Preview only.

Shared six raised surface definitions preserve XY footprints and 72-unit deck
height. Decks now have six-unit edges, ten-unit support columns, nine stair
markings over the original 90-unit ramps, and forty-by-twenty-seven panel cells.
Jade remains spriteScale .82; gravity, impulse and camera are unchanged.
Support column clearance is 66 units; combat ceiling clearance now uses the standing damage-volume height of 63.96
instead of the prototype’s 38. This changes head clearance beneath structures,
not open-ground jump impulse, gravity or landing response.

The runtime floor atlas was downloaded and visually inspected: 1200x1440,
twelve material regions, including industrial plating and grating. Each region
contains a 3x3 pattern; floor placement changes from 40x27 per region to 120x81,
so individual plates are 40x27. Decks sample one plate from the same atlas.
The architecture, concrete, industrial, props, skyline and destruction files
exist in the Git tree. Their complete directional/alpha integrity was not
verified in this pass. No new production sprite pack is claimed.

Removed duplicate decorative platform/stair/bridge entries. Tower 33 and
perimeter scenery stay in the existing backdrop pipeline. Walkable ramp/deck
faces and supports now use existing world projection. Foreground face clipping
is applied to fighters, loose matter, cover and shots, based on each actor's
world-depth plane. It is a billboard approximation, not a per-pixel 3D depth
buffer. Ramps remain physically smooth to preserve approved traversal.

Authoritative additions: support collision for players; swept deck slab,
column and ramp-volume projectile obstruction; ceiling clearance includes
six-unit deck thickness. Existing saved layouts already exclude these surface
footprints, so layout schema, placement IDs and saved data are unchanged.

Outstanding acceptance work: live two-browser tests, complete visual overlap
matrix, independent cover/held-object structural collision, support-projected
charge/shadow effects, additional south-to-flank elevated connections, and
full-game/iPad frame pacing. Thrown matter now sweeps structure volumes; held matter and thrown/held cover
still require the complete structural collision pass. Do not promote this candidate to main.

Validation: production build, focused Build25/26/27A/27B/27C/27D/27E checks.
Two-client HTTP layout/airborne-state/rematch checks passed; this is not an
independent-browser multiplayer acceptance result. Isolated native canvas
structure drawing: median 2.24ms, p95 3.48ms at 1200x740. Not total game FPS.
