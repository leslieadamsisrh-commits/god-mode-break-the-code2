# Saved sprite-streaming experiment — 2026-09-16

This records completed work before the Sprite-First instruction. It is not a live deployment or permission to integrate new artwork into the protected combat build.

The experiment now uses a 36 MiB LRU cache for full-resolution shotgun atlases, with two concurrent decodes, active-view pinning, bounded prefetching, retry backoff, and bitmap disposal. A 125px-per-cell version of the exact same frame remains available while its 250px atlas loads. Frame identity, anchors, sockets, simulation, movement, aiming, and damage are unchanged. A newly selected view can temporarily look softer.

108 fallback atlases represent 984 existing frames, not new artwork. They use 58.65 MiB decoded pixels. Together with the full-resolution budget, retained shotgun pixels are bounded at 94.65 MiB, down from 234.6 MiB. This excludes transient decodes, other art, GPU copies, and browser/process memory.

22 automated tests pass, including bounded LRU behavior, pinned actors, load deduplication, failed-load retry, dropped obsolete requests, and preservation of the selected frame/anchor/muzzle under fallback. Source hashes, alpha, grids and frame counts were verified for all 108 generated fallback atlases.

The browser preview measured 66.8–74.4 MiB retained shotgun pixels while selecting two views, with no atlas errors. It still reported about 1 FPS (rAF roughly 915–1,010 ms); low script time does not establish 60 FPS. Smoothness on target hardware remains unverified.

## Restore the saved experiment

Use Node 22+, Python 3 and Pillow. Restore original assets with `python tools/restore-checkpoint-art.py`, then generate disposable runtime caches with `python tools/prepare-streaming-atlases.py`. Run `python tools/verify-streaming-atlases.py`, `npm run verify`, `npm test`, then `npm run dev`.

Backups deliberately exclude generated streaming WebPs. The generator is preserved. Full-resolution approved runtime assets and the selected raw art masters are retained separately. No complete archive is encoded as Base64.

## Current priority

The new `docs/SPRITE-FIRST-MASTER-PROMPT.md` supersedes conflicting production instructions. Preserve combat, perform sprite production separately, and do not publish or change match rules during this phase. The 30-second reference describes intensity; 2/3/5-minute and custom durations are deferred design settings, not a change applied here.
