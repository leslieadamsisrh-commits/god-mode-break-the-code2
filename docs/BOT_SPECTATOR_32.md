# Bot Spectator 32

Parent: Combat Integration31, 14926ac5f72ed65d6d19af73a4a34dff469eeb67; verified Railway SUCCESS bebee03e-e9a5-42cf-98db-428044045f63. Same studio/live-app-three-section-01 branch, repo, Railway service and public URL. No art, controls or human movement balance changed.

## Play

Open the existing URL with ?watch=1 to start two-bot spectating directly, bypassing controller activation and the normal shell. Alternatively choose WATCH TWO BOTS in the combat-mode panel. Touch pause/resume/restart controls remain accessible. No controller required; player inputs cannot pilot either bot. Authenticated spectator owns administration token in slot0; join is rejected, bot fighter input is generated server-side.

Both bots use ordinary authoritative commands and damage/physics, the existing three approved cover objects and six finite starter matter pieces. Deterministic phase policies attempt Grip→throw→advance→shotgun/melee, Orbit, material construction, projectile-time volley/release, shield/counter and recharge. Action captions describe attempted intent, not proof a combo connected. Previous opponent input snapshots prevent same-step decision-order advantage. Fixed local collision probes help flanking; this is not a navmesh or advanced tactical AI. Bots can still choose ineffective paths or throws.

Automatic countdown, aftermath and next round after a two-second result display. Scores continue as an observation session, not a completed first-to-three competitive match. Pause freezes simulation; restart rebuilds clean cover/material/health and two bot flags. Authenticated API tests reject invalid pause tokens and joining. Existing real-player private rooms remain intact.

Spectator-only camera centers both fighters and fits their separation; real-player CameraB/1.85 is unchanged. Existing approved sprites/assets/render pipeline are reused. Synthetic bots use metallic cyber-fluid. Same Sprite d00 reused in native audits is an inspection proxy, not certification of every directional action sprite. The observer has cyan bot's field/resource HUD plus both health and action captions.

## Validation

Automated 18,000-frame / 300-second simulation: 18 rounds, real lethal damage, peak41 live shots, finite bounded materials/FX/positions/battery; observed throw follow-ups, projectile volleys, melee, shield, cover brace/exposure. Targeted ordinary-input scenarios independently exercise Orbit, construction and recharge. Test pause, resume, reset, no spectator input takeover and join rejection.

Production build/typecheck passed. Actual production HTTP32/31/28 passed for autonomous bot room, pause/resume/reset, wrong-token rejection, safe snapshots, private invite/countdown/SSE, existing selectors/time toggle. Combat26/economy30/restoration27/fight23/24/spatial21/integration31 passed. Frozen Stage28/psychic29 movement comparisons passed after recovering their exact historical reference files (temporary files had expired; no baseline rewrite).

Actual native renderer:128 scene rotations/camera cases,80 object review cells, loading fallback, and four chronological two-bot frames. First visual audit exposed flanking stalls; short-path probes and closer follow-up movement added, then simulations/render checks repeated. No iPad/controller or actual two-device validation this pass. Watching bots helps diagnose authority and rendering; it cannot validate controller comfort, real-player latency or fun by itself.

Remaining: deeper bot strategy and combo connection validation, smooth spectator zoom during abrupt separation changes, full directional carry/Orbit sprites, additional weapons/Unmake/parry/reflect, first-to-three match closure, existing car deformation/road composition debt. New mode does not claim these solved.
