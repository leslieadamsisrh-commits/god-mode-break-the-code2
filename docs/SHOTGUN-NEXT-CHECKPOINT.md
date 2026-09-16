# Directional Shotgun Test — 2026-09-16

Development branch: `development/shotgun-powered-duel-20260916`.
Approved source parent: `00621f7446ddd0e42c2e9503ebfb391a6833bb31`.
The published GOD MODE Site remains at the previously verified version 57. This checkpoint is an isolated integration test, not a deployment or a completed powered duel.

## Run the saved test

Use Node 22+ and Python 3. From this repository:

```sh
python tools/restore-checkpoint-art.py
npm run verify
npm test
npm run dev
```

Open the local address printed by the server. Two tabs can independently press Play Now. The frame inspector is linked from Controls / Lab. The recovered v57 comparison is linked in the header.

The 135 artwork files are preserved losslessly in 34 ordered archive parts, with per-part, archive and individual-file SHA-256 checks. This includes all 120 recovered dependencies, new art studies and rejected source attempts. Restoring does not depend on the live website. The experiment assets symlink points to the recovered asset directory. On a system that does not restore Git symlinks, replace `experiments/shotgun-powered-duel/assets` with a directory copy of `recovery/shotgun-lab-v57/assets`.

## Implemented and checked

- Movement-directed cover exits: retreat, diagonal retreat and a reachable-edge upright dash. Collision sweeps refuse blocked corners and keep attachment; direction changes preserve aim. Moving/destroyed source cover interrupts a dash safely.
- Fresh A/Shift press required; held slide input cannot immediately detach. Normal running and open-ground slides match the approved source trajectory exactly in the automated encounter.
- Three discharges per trigger at 0, 0.10 and 0.20 seconds; 0.48-second cycle. Each discharge samples current aim and muzzle. Held/retransmitted inputs cannot duplicate a burst. Weapon switching, death and round completion cancel pending shots.
- Conservative burst tuning: 6 actor damage and 8 cover damage per discharge, totaling the old 18/24 per trigger. This is documented test tuning, not a claim that three full-strength hits were retained. Battery cost is explicitly unknown because the original energy implementation is absent.
- Separate in-memory authoritative test server, protocol `shotgun-next-1`, isolated API route. Two-player pairing, warm-up, countdown, 30-second round, mutual rematch and disconnect recovery. This server is new code; it is not the recovered production backend.
- Reconstructed muzzle registry: 984 reviewed frames, 108 families; 938 visible coordinates, 3 estimated coordinates, 43 unresolved nulls. Every entry is tied to its actual runtime image hash. Original missing `lab-pose-data.js` was not recovered; this replacement uses new visual measurements.
- Working frame inspector: animation/frame selection, light/dark/checkerboard backgrounds, ground/muzzle markers, revision-bound approval/rejection notes and JSON export. Reviews stay in the inspecting browser until exported.
- Two new six-pose, nominal 45° studies: upright dash and charge. Both remain provisional and inspector-only; each is missing 23 views. Dash gameplay currently uses existing upright running artwork. The optional purple charge layer is a cosmetic inspector study, not integrated charging gameplay.

## Tuning preserved

Movement 262; response 13; stop drag 0.002; slide speed 650; slide duration 0.70; slide drag 0.12; actor radius 17; art cell 250; ground anchor 219; simulation step 1/60. World 2400 × 1800; camera 1:1.

New upright exit: edge reach 56; clearance 3; speed 600; follow-through 70; maximum travel 270; maximum duration 0.60; sweep step 2; reattach delay 0.18; input deadzone 0.18. See `lab-cover-exits.js` for exact checks.

## Verification evidence

17 automated checks pass: burst timing/cancellation, retransmission, fresh slide input, cover corners at both ends across 24 geometric angles, source-cover interruption, approved motion parity, refresh-schedule parity, independent sessions, authoritative state, rematch/reset, disconnect cleanup, and image-revision hashing.

The fixed-step comparison produced identical ordinary movement trajectories at simulated 30, 60, 120 and 144 Hz. This is a simulation check, not a browser FPS claim.

Browser automation on the local integration preview verified: art loading; Play Now bot warm-up; pairing between two independently keyed browser tabs; both tabs in the same round; round completion as a draw; both players requesting a rematch; a fresh round; one trigger causing the remote health to decrease from 100 to 82 in both views; leaving the match returning the survivor to bot practice and searching. This was not an actual two-person internet playtest or a deployed-site test.

The remote preview reported approximately 1 FPS, raw rAF average 1003.8 ms / p95 1016.5 ms, script average 2.4 ms, and 234.6 MiB decoded atlas cache. These measurements do not establish 60 FPS. Frame pacing and eager atlas memory remain unresolved. No runtime atlas/effect errors were reported in the tested lab; browser-extension messages were separate from game errors.

## Exact remaining work and blockers

1. Recover the original battery, charging, shield/parry and material rules and the complete Site/backend checkout. The saved component does not include them. Do not invent values or replace the existing published Site with this partial reconstruction.
2. Finish motion review of the two new studies and produce their missing views/transition families. Resolve 43 occluded muzzle frames and replace the three estimates where a usable view becomes available. Nominal 15° studies are not certified exact angles.
3. Fix preview frame pacing on an active target browser and reduce the eagerly decoded atlas set; measure under simultaneous combat effects.
4. Integrate energy/shield/parry using verified original rules. Complete charge intensity, interruption/recovery and all directional art. No energy mechanic is enabled by the current inspector preview.
5. Add authoritative destruction-to-matter for the concrete barrier, metal fixture and vehicle panel. Build the manga victory splash from confirmed results. The existing text result is not that finished presentation.
6. Restore/integrate the production public backend, persist/clean public sessions appropriately for its hosting model, and run deployed two-session plus real two-person tests before publishing the complete powered-duel milestone.

No new Site was created and the existing Site identity was not changed. All unapproved or unfinished families remain isolated.
