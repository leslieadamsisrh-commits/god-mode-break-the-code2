# Jade LV01 RS24 — Run / Slide reference catalog delivered

## Scope
Completed source cataloging and runnable review code for the two latest Run / Full Locomotion and Spacewalk Slide / Baseball Slide reference sheets. These were previously displayed as art boards; their printed COMPLETE or GAME READY labels do not establish production completion.

48 exact native multi-pose panels were extracted: 24 direction-label panels per sheet. Crops are 235–238 pixels wide and 162–182 high. Both original sheets are RGB 1448x1086. Labels, grid, floor, shadows and effects remain. These are not 216 independent sprites, 48 complete animations or native 1024x1536 masters. No new drawings, repainting, recoloring, mirroring, upscaling, transparent sprite export or gameplay installation occurred.

The source labels 0/90/180/270 refer to South/East/North/West; exact drawn yaw and conversion to the engine's heading convention are unverified. Printed four/five position numbers are retained as source labels, not asserted as a complete legible frame inventory. No missing in-betweens or sockets are invented.

## Delivered code
source-index.json preserves source fingerprints, grid rectangles and design authority. tools/build_review.py verifies sources, refuses differing existing panel crops, generates catalog.json/catalog.js, and builds a self-contained HTML. review.js validates the catalog, selects direction panels, draws exact source rectangles, wraps navigation and rejects reference-only material as production sprites. index.html provides the browser UI. This is a source-panel browser, not an animated character loop or a combat build.

All original sprites and build files are preserved. The 08N local art/combat integration and separate 08L network prototype remain the continuation points. No original physics, collision, action selection, controller mapping or deployment configuration changed.

## Verification
14 Node subtests passed. 51 file checks passed: three source fingerprints plus 48 exact native RGB crop comparisons. 15 browser checks passed in installed Chromium 144.0.7559.96 using Playwright set_content: sources load, all panels render, family/direction selection, navigation and wrap, source-sheet mode, zero observed page errors and zero external HTTP requests. The initial browser launch lacked a bundled executable; the successful rerun used /usr/bin/chromium. This is not target-PC, physical-controller, gameplay, end-user file-navigation or hosted-URL verification.
The fetched review.js Git blob 733e844f06e64d0efef07b72b8123e150d152098 matches the local tested module. Source, validation and browser scripts/results are included in the complete package. No autonomous agents or background production is claimed.

## Confirmed backups
Library directory: /GOD MODE/Jade LV01 Lavender Visor/RS24 Run Slide Catalog/
- JADE_LV01_Run_Slide_Catalog_Package.zip: upload succeeded; libfile_7b308e984fb48191939fe9142a9baf27; 68 files, 18,528,575 bytes; integrity verified; SHA-256 f32433286e50ed9f67e716538072f0fd4a0246dea25b10347732d5469af1e6a7.
- JADE_LV01_Run_Slide_Reference_Player.html: upload succeeded; libfile_d5da6ce8bd108191b9e993a732df84ec; 7,161,890 bytes; SHA-256 7391e38dee4eed8ad53d474aaf423a8f023535577c84e453df691a1ebc3f7302.
- Exact run sheet: upload succeeded; libfile_0829c6e1e08c81918032eed4923ddf23; SHA-256 a71ddb854395d170a8bb2fc5f5c56ab87fc3149a4b14e853547c3ed48ea0d8c5.
- Exact slide sheet: upload succeeded; libfile_cc26ba7333388191a8d7f28c8ea4c148; SHA-256 3db5464cdefedc9522da8b3d471a9a0d534bd8158118eae60b1f29dbe8c8be7a.
- Exact uploaded master: upload succeeded; libfile_3fb1ecb218588191bb789f8af70d84c9; SHA-256 39375b8abfd668b750cc041c5cd78db474f359f43428bd9a585396e62b579854.
- Actual browser screenshot: upload succeeded; libfile_a7228b3bf0b081918b2ec0c1f7f21b16.
- Delivery manifest: upload succeeded; libfile_5752d925dd188191a62a73cda4f5fe5f.

GitHub stores the index (2d3a64e4), review module (26636bf6), builder (780827a9), interface (324d33f7), B05 specification (9e64fc68) and updated master (287ecd8a). Image binaries/crops, generated catalogs, complete tests and standalone are in the verified package and Library, not claimed installed in a GitHub runtime directory. GitHub and Library saves are separately verified, not atomic. No Vercel or public deployment occurred.

## Next batch and report format
B05 / Cover Entry / Attach is SPECIFICATION STARTED, not drawing-complete. Planned keys: slide approach, anticipation, contact, impact, compression, equipment follow-through, low settle and attached ready. See production/jade-lv01/B05/NEXT-SET.md. Begin with a single large character-only compression/low-settle key to check readability, then contact and attached endpoints. Preserve the exact approved Jade; barrier, floor shadows and effects stay separate.

The master now requires a concise typed progress report per batch, backed by original/candidate artwork and its matching code/metadata. No automatic generated progress poster. Report reference extraction, transparent export, animation validation, gameplay integration and deployment independently. The approved large detail/scale remains the target; these small reference crops do not satisfy that source-resolution target. Existing B03 quality-hold files and earlier sprites remain untouched.
