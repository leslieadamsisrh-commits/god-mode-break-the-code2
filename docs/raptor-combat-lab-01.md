# RAPTOR COMBAT LAB 01 — IMPLEMENTATION AUTHORITY
Status: pre-integration, no gameplay modifications.
Source: Foundation 01 commit 7576e9b535b6cc8ba8c9ba7ced93a961678d7e5b.
Visual authority: user-approved Raptor Art V3.0 (magenta-accented 80s/90s manga sheet). The generated concept sheets are NOT transparent registered sprite atlases.
## Gameplay invariants
- Reuse lib/game.ts simulation and lib/localCombat.ts fixed 60Hz advance. Do not duplicate or fork Jade's physics.
- Same competitive health, movement, aim, slide, cover, shot damage, recovery, powers, battery, collision and input handling for Jade and Raptor.
- Character selection only changes renderer, audio and animation maps. Preserve host-authoritative multiplayer.
- Do not assign exclusive powers or stats to the raptor.
## Character identity
Olive-green tiger-striped reptilian humanoid; approximately Jade's height or slightly taller visually; elongated Jurassic Park-inspired head; red targeting monocle; white/gunmetal angular carapace with magenta accents; short SMG; powerful digitigrade legs; long tail raised in a bipedal forward-leaning sprint; expressive jaws and cyber-claws. No redesign.
## Animation pipeline
First six independent registered transparent poses, not a poster: READY, RUN_CONTACT_L, RUN_PASS_L, RUN_CONTACT_R, RUN_PASS_R, SPRINT_ENTRY. Each pose requires constant anatomy, helmet/monocle side, SMG, armor plates, tail stripe pattern, fixed ground anchor and documented muzzle/socket offsets. These six are a foundation, not a complete gait cycle.
Then 8-way run/sprint, 16-way turning, 24-way aim, slide/cover, firing, melee and psychic states, each gated on QA.
## Integration gates
1. Inspect current game sprite registry, directional keying, registration and fallback before creating a character renderer.
2. Create isolated local sparring session with Jade and Raptor presentation on the same shared simulation; verify both player slots, AI/bot support and session cleanup.
3. Prove equivalent input sequences yield equivalent simulation states independent of skin.
4. Validate image dimensions, transparency, anchor consistency and missing-frame fallback.
5. Test iPad controller and two-player multiplayer without changing production.
## Current limitations
No game-ready individual raptor sprite frames have been verified. No playable raptor or Jade-versus-Raptor lab has been implemented or deployed. Never label concept sheets as ready atlases.
