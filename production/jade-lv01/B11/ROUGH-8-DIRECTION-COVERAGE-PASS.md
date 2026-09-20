# JADE LV01 B11 — ROUGH 8-DIRECTION COVERAGE PASS

Fast-track status: PASS WITH EXPLICIT DIRECTION PLACEHOLDERS.

Verified families:
- ready
- run
- slide
- cover

Principal directions:
0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°

Coverage:
- 32 principal family+direction slots verified.
- ready: all 8 exact
- cover: all 8 exact
- run: 7 exact + d03 nearest-direction placeholder
- slide: 7 exact + d03 nearest-direction placeholder

Placeholder policy:
Missing recovered directions resolve to the nearest available directional atlas and are labeled as placeholders.
Approved uploaded final frames override the matching family+direction slot later without changing gameplay.

Regression:
- 31/31 tests passed.
- 08L browser/server duel equivalence still passes across 3600 mixed-input ticks.
- B10 hit-reaction placeholder preserved.
- B05–B09 behavior preserved.
- No baseline overwrite.
- No deployment.

Standalone SHA-256:
`a4e374e2451b2f8e0f3c25d9d91861cdefeff41d3b8cb51621bb33a2739fbadc`

Package SHA-256:
`38ba7040a5abedb8efe371481304b35195765d4e3de0d3c9fdc390462272c233`
