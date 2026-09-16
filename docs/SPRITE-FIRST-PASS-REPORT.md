# Sprite-first pass — 2026-09-16

## Saved combat and backup

All completed code and normal compressed backups were verified on the private repository's development branch at `efecc43dc7880ddf6831a1c40cbb694ab4dbed7e`, with source parent `96e757566d983f33f824111ebfda1573c82168a5`. GitHub workflow run `35048022238` completed successfully, including a clean restore, 22 tests, commit, push, and remote-head verification.

Both ordinary tar.gz archives matched local SHA-256 and Git blob hashes. The initial code archive was 212,202 bytes; the selected art archive is 55,591,030 bytes. New sprite-only documents are saved in a subsequent independent checkpoint and refreshed code archive. No complete archive was encoded as Base64. Generated streaming caches, duplicate proofs, rejected attempts and previous archives are excluded; older commits preserve the historical attempts.

`god-mode-combat-core` and `god-mode-sprite-integration` remain at that frozen checkpoint. `god-mode-sprite-library` is the separate active work branch. The earlier approved v57 source branch remains `00621f7446ddd0e42c2e9503ebfb391a6833bb31`. These source identities are intentionally distinct; completed experiments are not retroactively labeled approved.

## Inventory and first reference batch

| Item | Result |
|---|---:|
| Source/asset image files inventoried | 135 |
| Exact duplicate image files | 0 |
| Existing shotgun runtime atlases | 108 |
| Existing shotgun runtime frames | 984 |
| Identical runtime RGBA frame groups | 0 |
| Unreadable image files | 0 |
| Empty/opaque/outer-edge-contact runtime frames flagged | 0 |
| Larger original shotgun source sheets absent | 108 |
| Batch 1 reference poses reused | 24 |
| Batch 1 new drawings / repairs | 0 / 0 |
| Exact-angle production families certified | 0 |

The 984 existing frames are structurally reusable candidates, not newly visually approved production frames. The alpha-edge check cannot rule out internal cutoffs, anatomy drift or baked-in cover. Six legacy pistol sheets and existing effect/barrier artwork are inventoried separately but not certified as complete weapon/effect families.

The character reference packet reuses all 24 existing ready-view studies, with source hashes, direction labels, visible bounds, inherited ground reference and existing muzzle measurements. Eight cardinal/intercardinal views were compared visually. The approved identity is retained; exact yaw and equipment geometry still need review. This is a Batch 1 reference selection, not a claim that missing high-resolution model sheets were reconstructed.

The local browser preview loaded all 24 reference cards without an asset error; dark/light/checkerboard switching worked. Ready-view alpha heights range 179–184 pixels inside 250px cells. The reference preview retains only the 24 selected images (about 5.72 MiB raw RGBA), not the 108 full atlases; this is calculated image payload, not measured process/GPU memory.

## Files and sizes

- `sprites/manifests/existing-asset-inventory.json`: file hashes, categories, missing original sources, and per-frame alpha checks.
- `sprites/manifests/batch-01-identity.json`: 24 reference records and explicit unknown anchors.
- `sprites/manifests/production-queue.json`: remaining required groups, separate from completed coverage.
- `sprites/manifests/ANCHOR-STANDARD.md`: units, angle convention, review identity, and import gates.
- `sprites/previews/identity-review.html`: local standalone review page, referencing canonical files without duplicating them.
- Existing shotgun runtime atlas files: 34,298,692 bytes. Two selected new source masters: 3,514,676 bytes. Their provisional runtime studies: 502,553 bytes.

## Review gate and next work

No combat, pose selection, networking, timing, damage, or camera files changed during this pass. The requested 2/3/5-minute and custom match settings are recorded only. The current timer was not edited.

The latest uploaded Sprite-First specification explicitly says not to publish and to stop for approval after Batch 1. The live Site remains unchanged; no deployed-build test is claimed. Earlier preview measurements were about 1 FPS despite low script times, so 60 FPS remains unverified.

Before Batch 2, finalize the character turnaround: resolve nominal yaw spacing, consistent helmet/face and backpack/cable geometry, missing original masters, and unregistered hand/contact anchors. Keep the existing 43 unresolved and three estimated muzzle frames explicit. The next production work is the remaining Batch 1 identity corrections; do not start idle/turn animation until that reference gate passes.
