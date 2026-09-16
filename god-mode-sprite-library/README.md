# Sprite Library — isolated work source

Active branch: `god-mode-sprite-library`. Governing instructions: `docs/SPRITE-FIRST-MASTER-PROMPT.md`.

Canonical artwork stays at its existing checksummed paths so valid assets are not duplicated or regenerated. `sprites/manifests` catalogs them; `sprites/previews/identity-review.html` presents Batch 1. `sprites/source-art` and `sprites/runtime-atlases` describe those source references instead of copying the entire library.

This pass inventories existing art and reuses the 24 ready-view studies for the character identity review. It creates no new drawings, changes no combat code, and makes no claim of exact 15-degree certification. A complete model lock requires resolving the recorded visual gaps. Stop before Batch 2.

Recreate reports with `python tools/inventory-sprites.py` after restoring artwork. Pillow is needed for inspection. Lightweight previews load only referenced assets; they do not load all 108 atlases.
