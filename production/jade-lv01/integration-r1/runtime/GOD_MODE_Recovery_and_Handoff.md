# GOD MODE — Recovery and Integration R1
Saved work date: 2026-09-20. Continue from **B11 Integration R1**, with the original B11 package preserved.

## What was recovered

- Private repository: `leslieadamsisrh-commits/god-mode-break-the-code2`.
- Art branch `jade-lv01-hd-sprite-production` inspected at `b8c7486b07abddb9974600c3f853b9a1e0bc3e67`.
- Protected `v12-08n-art-first` baseline confirmed at `2b26f46217147c974afbab7326ece7122c311c08`.
- Newest playable package located: `JADE_V12_08N_B11_Fast_Integration.zip`, Library ID `libfile_c96641c423a48191a09f3c038910c906`.
- B11 archive SHA-256 verified: `38ba7040a5abedb8efe371481304b35195765d4e3de0d3c9fdc390462272c233`.
- B11 standalone SHA-256 verified: `a4e374e2451b2f8e0f3c25d9d91861cdefeff41d3b8cb51621bb33a2739fbadc`.
- Jade master SHA-256 verified: `39375b8abfd668b750cc041c5cd78db474f359f43428bd9a585396e62b579854`. Preserve the exact design and the later angular-emblem instruction.

The active package has **119 image files**: 108 legacy atlas files, three legacy action poses, four deformation studies, and **four unique current-design exported keys**. The atlas metadata describes 984 nominal frame slots; these are older runtime/review derivatives, not 984 newly approved high-detail Jade frames.

## Batch 17 reconciliation

The recovered Batch 17 file `b385f7a6-82b3-4b90-9bb5-abcf8b98cc15.png` is a 1672 × 941 opaque board with seven illustrated panels. Its printed “17/17 / 204 sprites” claim is not an export manifest. No individually exported C193–C204 series was located in the recovered package or inspected GitHub art tree.

Its sequence maps to approach/slide, attach, peek, fire, recoil and return. Much of that behavior exists in the rough build, but final artwork is incomplete. The presentation numbering and implementation numbering are different. The hit-reaction board labelled Batch 05 corresponds conceptually to implementation B10, not implementation B05 cover entry.

## Actual stage status

| Family | Export/art status | Playable implementation | Remaining work |
| --- | --- | --- | --- |
| B05 entry | Three accepted keys recovered byte-for-byte: CE05, CE03, CE08 | Existing compression/contact/settle mapping verified | Continuous hand/weapon bridges and directional expansion |
| B06 attached movement | One accepted left-shimmy key recovered; idle/stops reuse CE08 | Supported-view routing repaired in R1; right movement retains explicit left-pose fallback | True transparent right-shimmy key, then continuity |
| B07 corner peek | Current-master final keys missing | Legacy/recovered placeholders | Left/right pre-peek, full peek and return |
| B08 cover firing | Current-master final keys missing | Legacy K01/K02/K03 action sequence preserved | Master-design aim/fire/recoil art and measured sockets |
| B09 exit | Current-master final keys missing | Recovered kick/run/ready placeholders | Push-off and exit-step art |
| B10 hit reactions | No final current-master hit frames installed | Existing 0.16 s visual reaction retained | Export and register hit artwork |
| B11 directions | Rough eight-direction mapping | 32 principal family/view slots; run and slide d03 use d02 fallbacks | True d03 images; later 24-direction high-detail coverage |

“Accepted export” above is inherited production status. It does not mean complete animation approval. Current keys have alpha, but some inherited alpha bounds touch the canvas edge; no new margin or fringe certification is claimed.

## R1 implementation

1. Restricted B06 current-design idle/shimmy keys to their supported station/south/right-facing view. Previously these same one-view drawings could appear on the north face or at incompatible aim angles.
2. Prevented the B06 low-ready layer from overriding aim-held, raised, recoil, retract, or a just-fired presentation.
3. Added **Set up slide-to-cover** to the existing inspection panel. It creates an ordinary free-ground spawn; the original slide, collision, attachment and movement code perform the action.
4. Corrected the build identity and explanatory status text to B11 Integration R1.
5. Added a reproducible file/frame inventory, hash audit, routing tests, and native Canvas render checks.

All **119 existing image files are unchanged**. Nine protected simulation/control/registration files are unchanged, including movement, collision, shot logic, damage and device mapping. The three-minute default and 2/3/5 minute settings are preserved. No public or private deployment occurred.

## New art attempt

Two B06C candidates were generated. Candidate 02 depicts the requested rightward low step more clearly. Both files are **RGB with zero transparent pixels** and contain a drawn checkerboard. Both fail the runtime export gate and remain outside `public/assets`.

- Candidate 01: `568dbae352c13ef78198c2d51a933e5be7560c316376d1a2f28abccd1d43b167`
- Candidate 02: see `recovery/RECOVERY-AUDIT.json` for its measured SHA-256.

New accepted runtime sprites this pass: **0**. No user approval is implied for these failed exports. Do not promote them simply because the image looks like a cutout.

## Verification performed now

- **45 Node tests passed**, including five new integration tests.
- Original browser/server simulation equivalence passed across **3,600 mixed-input ticks**.
- A real simulation run from the new entry fixture reached **CE05 → CE03 → CE08** in order using the existing collision path.
- **Six native Canvas scenes rendered** with actual decoded source images, no asset errors and zero missing draws. The same game renderer was used; snapshots live under `evidence/`.
- Native render check retained approximately **48.63 MiB** of decoded image pixels in the checked scenes. This excludes browser/JS overhead and is not a memory ceiling for every session.
- Existing-file fingerprints and all registered image dimensions/hashes matched.

Live browser playtesting was unavailable: the cloud browser could not access localhost, and the local runtime had no installed browser binary. Native Canvas checks cover rendering, not browser layout, event handling, performance on the user's PC or a physical Xbox controller. Keep those items unverified.

## Play the saved build

Open `GOD_MODE_B11_Integration_R1.html` in a desktop browser.

For keyboard inspection:
1. Select **Player 1** under Inspection seat.
2. Choose **Set up slide-to-cover**, then **Resume**.
3. Aim right with the mouse, hold W and press Shift to slide toward the barrier.
4. Once attached, use A/D to check left/right movement.
5. Use **Set up selected Jade at corner** for right-mouse aiming and left-mouse firing.
6. Use **Export playtest report** to record an observed issue.

The build is a local two-player art/combat lab. P2 needs a controller for human control; otherwise P2 stays idle. It is not the full multiplayer game.

## Exact next step

Preserve R1 and the accepted keys. Produce a true-alpha, character-only B06C right-shimmy export from the locked master and the approved left-shimmy reference, without mirroring asymmetrical equipment. Candidate 02 may guide the leg placement but is not an installable asset.

Measure feet/root/pelvis/hand/muzzle anchors, compare idle → left → stop → right in motion, then replace only B06C's explicit fallback in an isolated copy. Keep view/action routing guards. Do not duplicate weapon families until this shotgun pass is verified.

Do not alter the inherited aiming or power controls incidentally. The current lab's `twistLimit=145°` is an absolute angular limit, not a demonstrated 145° total firing cone. Its X button attaches/detaches cover; slow-time and generated-cover powers are absent. These are recorded baseline/design gaps, not features implemented in this pass.

## Source recovery

The GitHub checkpoint contains a source overlay and a restore script. The exact B11 archive above supplies the unchanged binary assets; the overlay supplies the R1 code and reports. This is not a claim that the full B11 archive was newly uploaded to GitHub.

Use the included `restore_from_b11.py` with the downloaded B11 ZIP. It verifies the archive fingerprint before restoring into a new directory. The original package and prior branches remain recoverable. The standalone HTML independently contains all 119 runtime image files.

