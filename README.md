# GOD MODE: BREAK THE CODE — 2D Production Backups

Current priority: [Sprite-First production specification](docs/SPRITE-FIRST-MASTER-PROMPT.md). Live publication and combat changes are paused. The [Sprite Library](god-mode-sprite-library/README.md), [frozen Combat Core](god-mode-combat-core/BASELINE.md), and [reserved integration source](god-mode-sprite-integration/IMPORT-CONTRACT.md) are separate.

Normal, checksum-verified compressed backups are in `backups/current`: code and selected source/runtime artwork are packaged separately, with no generated caches or duplicate proofs. Extract both into the same directory to restore. They are built and pushed inside the private repository by the backup workflow; no archive is transferred as Base64.

Latest isolated development work: [Shotgun checkpoint](docs/SHOTGUN-NEXT-CHECKPOINT.md) and [sprite-streaming follow-up](docs/SPRITE-STREAMING-CHECKPOINT.md). These experiments have not replaced the published Site.

Private recovery repository for approved builds of the 2D GOD MODE: BREAK THE CODE game.

- Live Site slug: `god-helmet-arcade`
- Current approved baseline: Sites Version 57
- Separate 3D project: `leslieadamsisrh-commits/god-mode-3d-lab`
- Policy: experimental or incomplete sprite families must remain outside the approved production baseline.

## Backup status

Version 57 identity and integrity metadata are recorded in `backups/version-57/BACKUP_MANIFEST.json`. The Sites source transfer is not marked complete until every source file and asset has been recovered, checksummed, and committed. See `backups/version-57/RESTORE.md`.
