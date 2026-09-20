# JADE LV01 B10 — ROUGH PLAYABLE HIT REACTION PASS

Fast-track status: PASS WITH PRESENTATION PLACEHOLDER.

Authority remains:
`ChatGPT Image Sep 19, 2026, 11_37_12 PM.png`
SHA-256: `39375b8abfd668b750cc041c5cd78db474f359f43428bd9a585396e62b579854`

Implementation:
- Authoritative damage values unchanged.
- On actor hit, store a transient 0.16 s hit-reaction vector.
- Renderer applies a short screen-space nudge/flash labeled as placeholder.
- No final hit-reaction sprite is claimed.
- No physical gameplay knockback is enabled yet; movement feel is preserved.

Replacement slots:
- B10-A Light Hit
- B10-B Heavy Hit
- B10-C Cover Hit
- B10-D Recovery

Verification:
- 29/29 tests passed.
- Existing 08L browser/server duel equivalence still passes across 3600 mixed-input ticks.
- Damage remains 7 for enemy training shot and 18 for duel pellet hit.
- B05–B09 behavior preserved.
- Baseline not overwritten.
- Deployment not performed.

Standalone SHA-256:
`f2983ae876e1e90e5b47b6ed104b0efb7be47dc96b863e23365f2a4c42ab96d8`

Package SHA-256:
`10a9cad145dfb791ea92f375fc0a7a5c93db9c5e3f3a5aa94ff22e32119d7258`

Playable-first rule:
Any later approved hit-reaction frames replace the placeholder presentation by role without changing authoritative damage.
