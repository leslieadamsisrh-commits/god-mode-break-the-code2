# Build 39R2 Raptor playtest

Forward sprint selects four muscular poses per direction. The eight reviewed right/front-right poses were recovered at cfcd9aa. The other 24 were authored for this release. The full runtime paths, source files, ground anchors and SHA-256 values are in art/raptor39r2/muscular/installed.json. The prior eight Idle, 32 upright locomotion and 24 Slide poses remain in service.

The renderer uses authoritative travel distance, a 120-world-unit forward sprint cycle, and holds contacts for 28% of the cycle. Sprint enters above 170 world units/second when travel and facing align, and exits below 145 or on wider aim changes. Slow travel and moving crossfire/backpedaling use the upright gait. Slide, cover attachment, airborne, hit and a short grounded landing transition interrupt the sprint visually. No simulation input or combat rules were changed.

Tests passed locally: production build, sprite loading and rendering, moving fire, distance/phase continuity, hysteresis, strafe/backpedal, landing and cover interruption, real shared-engine Slide, elevation/combat interaction, bullet time and generated-cover arsenal. The 39Q test's former expectation of upright Run after Slide was updated for forward sprint. Browser observations and deployment status are reported separately from these automated checks.

The eight-direction GIF uses runtime registration and preview timing. Four discrete keys can still show small changes of equipment registration and foot position, especially on turns. Dedicated cover, psychic, airborne, damage and stationary-fire pose families remain provisional.
