# GOD MODE — Runtime Asset Localization Plan

Current audit: Studio repo contains local God Frame assets, but core ready/run/slide/cover runtime atlases and classic slide/cover effects are still loaded from external hosted sources.

Do not regenerate these assets.

## Safe migration
1. Obtain exact donor bytes from the authoritative asset source.
2. Store them under public/assets in this Studio repo.
3. Record file size/hash and preserve filenames.
4. Verify every required direction/family decodes locally.
5. Compare representative frames against current hosted donor.
6. Switch preload URLs to same-origin only after verification.
7. Keep timeout-safe fallback until a full cold-load test passes on Safari/iPad.
8. Remove cross-site dependency only after parity is proven.

Goal: GOD HELMET boot should ultimately have zero cross-site dependency for required combat assets.
