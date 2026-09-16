# GOD MODE: BREAK THE CODE — RESUME THE RECOVERED SHOTGUN DUEL

*Reality has rules. Break them.*

Continue from the recovered, approved Version 57 Shotgun Combat Lab. Build the next playable test around the movement, weight, scale, darker manga artwork, rapid cover assembly, and movable psychic cover that I approved.

The next priorities are **directional cover exits, a distinct upright corner dash, and a three-shot shotgun burst**, followed by the complete powered 30-second duel. Preserve the foundation and work in small, playable increments.

## 1. Start from the recovered source and protect it

Use the private repository:
https://github.com/leslieadamsisrh-commits/god-mode-break-the-code2

Verified recovery reference:

- Branch: `approved/shotgun-lab-v57`
- Commit inspected for this prompt: `00621f7446ddd0e42c2e9503ebfb391a6833bb31`
- Component folder: `recovery/shotgun-lab-v57/`
- Original Site: `god-helmet-arcade`
- Original Sites Version 57 source commit: `26856cfce08fc778dd44d2a0a5648d0aae22c621`

Check for newer approved work before choosing the starting commit. Preserve the approved branch and create a separate development branch. Keep a playable baseline for comparison.

Read the recovery README, VERSION.json, PORTING_CONTRACT.md, checksum inventory, and actual source. This recovery contains readable runtime combat modules; do not assume it contains the entire original game, authoring masters, installed runtime artwork, or online server implementation.

Verify the full dependency graph and artwork locally before claiming the recovered lab runs. The snapshot inspected for this prompt imports `lab-pose-data.js`, which was absent from its committed file tree. Recover and verify that dependency and any others. The included asset-recovery script downloads paths beginning with `assets/`; it must not be assumed to restore missing JavaScript modules.

The public matchmaking client is present, but the authoritative matchmaking server is not present in this snapshot. Check the available original source and backend before modifying online combat. Recover missing files through supported, authorized routes and preserve provenance and checksums. Do not replace missing approved code with an invented equivalent while calling it an exact recovery.

If complete original source remains unavailable, proceed with useful, isolated work on the recovered combat module. State any specific remaining dependency or online limitation; do not repeatedly restart the entire recovery process or overwrite the live Site with a partial reconstruction.

Preserve the existing Site identity. Keep the separate 3D repository, world/map work, HUD/cinematic work, and unrelated game modes outside this combat change.

## 2. Lock the approved feel and controls

Confirm these recovered values against the selected source:

| Setting | Version 57 reference |
| --- | --- |
| Movement speed | 262 world units/second |
| Acceleration response | 13 |
| Stop drag | 0.002 |
| Slide speed | 650 world units/second |
| Slide duration | 0.70 seconds |
| Slide drag | 0.12 |
| Collision radius | 17 |
| Simulation step | 1/60 second |
| Runtime character cell / ground anchor | 250 × 250 / 219 |
| Shotgun cooldown / projectile speed | 0.48 seconds / 780 |
| Shotgun actor damage / cover damage | 18 / 24 |

Keep normal movement, open-ground slides, character size, and camera framing unchanged. Record cover-capture, kick, Grip, collision, and camera settings from source as well. New exits and the burst are the intentional behavior changes; document their tuning separately.

Preserve independent movement and aiming, registered barrel-origin shots, persistent cover contact, cover durability, and immediate input response. Keep animation interruptible.

Retain current keyboard/mouse and Xbox bindings. A fresh Xbox A or Shift press selects an exit while attached and retains the existing slide behavior in open ground. Holding the original slide button must not immediately detach her.

## 3. Make cover exits follow movement input

Use the actual contacted cover face, its outward normal, tangent, thickness, and reachable ends. Support rotated, generated, and moved cover.

- Away from cover: keep the satisfying retreat kick, directed outward or diagonally according to movement input.
- Along cover toward a nearby clear end: exit around that end into the requested direction.
- Toward the opposite side: when a usable end is within a short exit zone, follow a clear route around it and advance.
- No movement input: retain the existing outward kick.
- Requested route blocked or too distant: stay attached with brief feedback instead of launching backward against the player's intention.

For forward pursuit, create a distinct upright move:

**Foot plant → release contact → cut around the corner → upright dash → walk/run → optional fresh baseball slide.**

Use collision checks along the whole route. Preserve body clearance and aim. Do not teleport through cover, vault over it, travel automatically along a distant wall, or substitute a grounded slide for the upright dash.

Choose bounded exit distance, speed, turn curvature, and reattachment suppression using the approved kick as the reference for weight. Document the values. Add no automatic damage, targeting, invulnerability, or resource bonus.

Support responsive steering and safe interruption. If cover moves or breaks, resolve to a legal position. Author left/right plants, diagonal kicks, corner cuts, upright dash travel/recovery, and transitions into normal movement and new slides.

## 4. Make attached-cover movement physical

Keep contact anchored while allowing lateral travel, independent aim, peeking, recoil, and return to protection.

Create complete alternating step cycles with planted feet, weight transfer, passing poses, opposite-leg steps, stops, and reversals. Advance animation with actual distance traveled; blocked movement must stop the feet.

Add shoulder/hip contact, boot bracing, left/right edge anticipation, lean-out firing, return-to-cover, and suitable low-cover braced firing. Over-cover poses need believable hand placement and shotgun grip.

Correct clearance and occlusion at every cover angle. Cover may legitimately conceal protected body parts, but it must not erase the heroine through incorrect clipping or sorting. Show protection and contact clearly. The barrel and trajectory must physically clear the barrier for a shot to pass.

## 5. Implement the three-shot shotgun burst

One fresh trigger press initiates **three timed discharges**, not three pellets from one shot.

Audit earlier working weapon rules and approved firing artwork. Reuse established burst settings if available. Otherwise choose conservative test settings and document discharge spacing, recovery, per-shot and total damage, and energy costs. Do not silently triple Version 57 damage.

Keep aiming and movement responsive; sample the current muzzle and aim for each discharge. Preserve valid firing restrictions and cover collision. Other weapons remain unchanged.

Schedule shots in simulation time. Use burst and sub-shot identifiers to prevent duplicate network damage or overlapping bursts from held/repeated input. Handle interruption on defeat, round end, switching weapons, insufficient energy, and incompatible powers. Clear pending shots on every reset.

Author compression, three coordinated recoil/cycling beats, recovery, and partial-burst interruption. Support moving, peeking, and braced firing where allowed. Make its power readable through crisp barrel flashes, posture, sound, and impacts.

## 6. Complete the energy-and-cover loop

Integrate the established battery, charging, shield, and perfect-parry rules from verified source:

**Attack and spend energy → reach cover → recharge under pressure → reposition or reshape cover → attack again.**

Preserve original resource costs, charge gains, depletion behavior, vulnerability, and interruption rules when verified. Do not invent unavailable values and describe them as preserved. Identify unsupported rules and any explicitly proposed replacement tuning.

Keep health and battery distinct in a compact HUD. The server must determine resources, shield/parry state, projectile ownership, damage, destruction, and round results.

## 7. Build a living, explosive charge animation

Expand the approved charging art into a Dragon Ball Z-inspired buildup within GOD MODE's original darker cyberpunk manga style.

Keep the recognizable heroine, dark hair, cat-eared helmet, tactical armor, magenta coat tails, cyan segmented battery backpack, and connected cables consistent.

Create entry, buildup, sustained effort, stronger strain, completion/release, interruption, and recovery. Show planted feet, braced shoulders, tightening hands, expressive effort, and coherent hair, clothing, and cable response.

Coordinate three separate layers:

- **Heroine:** authored body effort and facial acting.
- **Energy:** light-neon-purple code ribbons, lattice fragments, broken rings, front/rear arcs, and outward bursts.
- **Ground response:** rising grit, orbiting rocks, dust pressure waves, and an illustrated compression effect spreading beneath her.

Intensity follows real charge state. Cosmetic rocks and ground compression must not create unregistered matter, extra damage, floor holes, or new collision. Keep the shield visibly distinct with a tighter cyan or team-accent defensive surface and clear parry feedback.

## 8. Complete directional artwork honestly

Audit existing frames before generating replacements. Finish shotgun ready/resting idle, aimed running, strafing, backpedaling, turns, braking, slides, recovery, cover contact/traversal, peeks, firing, exits, upright dashes, and charging.

Each major directional action requires **24 independently drawn viewpoints at 15-degree intervals**. Viewing directions and animation frames are separate: a 24-frame sequence from 24 directions requires 576 drawings.

Prioritize rear views, toward/away slides, active-aim poses, cover steps, and the new exits. Select traveling lower-body orientation from actual movement; maintain anatomically plausible independent upper-body aim. Keep the gun raised during active aiming.

Do not count mirrored, rotated, repeated, or interpolated copies as missing viewpoints. Repair gait ordering, alternating steps, timing, ground anchors, and loop seams.

Generate small batches; inspect one direction in motion before expanding. Preserve full-resolution masters, genuine transparency, complete silhouettes, padding, fixed scale, frame timing, ground/hand/muzzle/contact/effect sockets, and valid transitions. Bind approval records to image revisions. Keep unfinished families isolated and state exact coverage gaps.

## 9. Connect a small destruction-to-matter loop

Build environment damage and material handling separately from character animation. Start with a concrete barrier, a metal street fixture, and a vehicle panel.

Provide intact, damaged, broken, highlighted, lifted, and consumed states, then connect:

**Shot impact → fracture → recoverable matter → Grip collection → fragments assemble into usable cover.**

The server owns integrity, collision changes, material quantities, ownership, collection, and consumption. Prevent double collection and double spending. Keep decorative debris bounded and separate.

Preserve rapid assembly, the broad protective face, hover, dragging effects, release, re-grabbing, and damage from substantial impacts. Resting contact must not drain integrity every frame. Larger maps and comprehensive scenery destruction come later.

## 10. Finish the public 30-second duel

Preserve Play Now, automatic pairing, immediate bot warm-up, separate bot practice, rematches, and disconnect recovery without room codes.

Restore or integrate an authoritative backend before claiming the new mechanics work online. An updated browser client must not be paired with an incompatible old server. Version the protocol as needed while preserving the existing live game.

Keep both players on the same rules, with prediction/reconciliation for local movement and interpolation for opponents. Support independent two-player rooms and secure resource/result handling.

After both players load, reset warm-up health, batteries, attacks, pending bursts, powers, dash states, ownership, materials, covers, scores, and destruction. Run the synchronized countdown and established 30-second round.

Show selective POW/BANG/BAM/ZIP lettering, neon impacts, and digital fragments at real shot/impact positions. Effects add no unrequested damage. Keep opponents and threats readable; make flashes, shake, and lettering adjustable.

Finish with a brief manga winner/defeat splash driven by the confirmed result. Handle draws correctly and provide quick rematch or new-opponent choices.

## 11. Deliver in this order and save each milestone

1. Verify the recovered dependencies and run the unchanged lab as a comparison.
2. Add directional cover exits and the distinct upright corner dash.
3. Add and verify the three-discharge burst.
4. Complete battery, charge, shield, and parry integration with the first inspected charge sequence.
5. Expand directional charge, shotgun, cover-step, and exit artwork.
6. Connect the three material sources and cover reconstruction.
7. Finish comic impacts, victory presentation, and the repeatable public duel.

Check both ends of rotated cover, blocked corners, narrow gaps, diagonals, fresh/held input, moving/destroyed cover, preserved aim, and dash-to-run-to-slide transitions. Verify burst cadence, muzzle origin, cover occlusion, damage totals, costs, interruptions, input retransmission, and resets.

Test two independent browser sessions through pairing, countdown, combat, destruction, round completion, rematch, and disconnect recovery. Distinguish browser automation from a real two-person/controller playtest.

Target smooth 60 FPS. Measure frame pacing, memory, loading, and network behavior under simultaneous charging and destruction. Keep simulation independent of display refresh. Load only needed atlases, cache reusable work, and reduce optional effects before controls or readability. Report unmeasured performance as unverified.

Commit and push completed source, required runtime assets, and production metadata to the private backup repository at each verified milestone. Keep approved baselines separate from unfinished development. Use retrievable, documented storage for assets that cannot be committed normally; confirm their bytes and checksums are available. A manifest or live download URL alone is not a complete backup.

Publish verified work as the next isolated Shotgun Lab through the existing Site when its required source and hosting configuration are available. Preserve the comparison build and avoid deploying a partial reconstruction over the working game.

Report completed mechanics, changed tuning, exact art coverage, measurements, remaining gaps, and the saved checkpoint. Continue routine authorized work without repeated permission requests. If a specific dependency blocks progress, preserve completed work and identify it accurately.

## Success criterion

Two players can repeatedly enjoy a complete 30-second psychic shotgun duel: slide into substantial cover, traverse it with grounded steps, retreat intentionally or dash upright around an edge, charge with bursting energy, shield/parry, deliver a readable three-shot burst from the barrel, break useful matter, rebuild protection, and finish with a sharp manga victory screen.

The movement, weight, size, aiming, and rapid movable-cover assembly retain the feel I approved.

**Start implementing from the verified recovered shotgun source. Deliver directional cover exits and the three-shot burst first, then complete the powered duel in testable increments. Keep mechanical completion and the full 24-direction art library as separate, honestly reported acceptance gates.**

After this duel succeeds, expand to Slow Time, Unmake, Orbit, Pinball, Matter Storm, and the remaining weapons. Each needs its own directional art, effects, resource behavior, interruptions, and multiplayer verification.
