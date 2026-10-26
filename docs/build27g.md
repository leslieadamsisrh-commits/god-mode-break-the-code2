# Build 27G candidate — psychic arena fighter

Base: 9df1e5208f8f61cbdeb2c3378fb7704800e5bfe0 (27F). This is a preview candidate, not a declaration that all 27G acceptance criteria passed.

## Preserved
2200 × 1100 arena, authoritative surfaces, jump impulse/gravity, camera tuning, cover build/hold/place/throw, generous 27F battery economy, layout schema and stable IDs, approved Jade assets, damage values. No new artwork or jump frames are claimed.

## Controls
Default controller: A mobility, B hold/release glove strike, LT shield, RT shoot/held-object throw, LB Grip, RB construct into hold/place, Y charge, X bullet time, L3 jump. Keyboard X bullet time, F hold/release melee, J jump; existing other bindings retained. Dedicated touch time/jump buttons. Director's EXPERIMENTAL POWERS toggle restores legacy selected powers; default D-pad down no longer changes X.

## Combat rules
Melee accepts one new B press within the last 120 ms of recovery, then starts one quick strike after recovery. Held B cannot repeat this buffer. Interruption clears the buffer. A hit permits shield/slide/Grip cancellation after the active interval; a block or miss retains recovery. Manual aim remains authoritative; no automatic target switching or melee trigger. Close shotgun hits (within 120 units and 48 height difference) display a 300 ms opportunity cue, not a guaranteed combo or damage bonus. The stored target is informational; it does not steer the player.

Repeated damage opens a maximum 350 ms stagger window followed by immunity until 700 ms from the first hit. Individual knock timers remain capped at 180 ms; damage is unchanged and push during immunity is 15%. This is an explicit reaction/knockback balance change. The 60 Hz pressure test measured 22 consecutive affected frames, approximately 367 ms including timestep quantization.

Fresh shield activation has a 120 ms parry window and 650 ms rearm period. Valid projectile parries reverse trajectory and ownership. Ordinary blocks stop shots. Confirmed parries use a gold-white star and distinct sound; existing authoritative hit/block effects remain. No global hit-stop or new camera shake.

## Bullet field
Fresh X: 8 battery activation, at most 2 seconds, fresh X can cancel; 500 ms reactivation cooldown. Existing upkeep retained: 8 battery/sec plus 0.2 per affected pellet/sec. Maximum 42 pellets per field. The field follows its owner; radius uses existing Close/Standard/Wide (135/235/335), Standard default. Vertical interval owner Z minus 20 to Z plus 90. Eligible projectiles from either player travel at 8% speed within the union of fields; overlaps do not multiply slowdown. Boundary crossing is segmented. Maximum projectile real age remains 8 seconds. Thrown cover and loose matter are not slowed. Battery exhaustion/death/round reset stop fields. No invulnerability or damage amplification added.

## Presentation
A translucent tinted local-player pass remains visible through foreground architecture, while the regular pass retains structure clipping. Opponents retain existing structure occlusion. Cover occlusion is retained for both passes, and physics is unchanged. This needs live visual acceptance for visibility, flicker and contrast. Decks use blue-gray tops, cel-shaded sides, heavier contours, cyan/magenta route edges and existing orange edge lights. Slide echoes are shortened to 200 ms and limited to two. Generated cover's existing face stamp receives team tint; no new graffiti art is claimed. The 27F floor is unchanged.

## Verification
Local production build passed. Existing Build 25, 26, 27A, 27B adapter/integration, 27C, 27D, 27E, 27F simulation regressions passed. New 27G tests cover dedicated input, held-button expiry, cost, legacy gating, symmetric overlapping Z-aware fields, close-shot cue, timed reflection, melee commitment, bounded repeated stagger and rematch cleanup. Two independent HTTP clients passed shared layout/objects, host restrictions, airborne fire/shield, matching bullet-time expiry and rematch restoration. These are API tests, not two-browser acceptance.

## Unfinished acceptance
No verified compatible Jade jump-leg frames were available; existing pose and physics remain. Full graphic-novel art and new damage-stage graffiti are not complete. No before/after live screenshot comparison, actual two-browser combat acceptance, controller/iPad hardware verification or frame/input/feedback latency measurements yet. The visibility treatment and short exchange need live playtesting. CPU simulation timing is not FPS. Existing camera framing is preserved, not re-certified against the older half-arena specification. Main playtest must remain unchanged until acceptance passes.
