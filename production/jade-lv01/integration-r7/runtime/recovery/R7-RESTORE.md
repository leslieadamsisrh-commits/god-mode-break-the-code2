# R7 recovery

Baseline: original B11 archive SHA-256 `38ba7040a5abedb8efe371481304b35195765d4e3de0d3c9fdc390462272c233`.
Latest recovered playable source: R5 `99fdeab24c6e6c129282ffbd7a3234d3f68917d3`.
Parent repository checkpoint: R6 `1dbdb662e1d4e5fe771756c613062a2b781e4653`.
R6 is artwork-only: its four candidate cutouts remain preserved in the parent branch, not claimed recovered or integrated here.

Run the R5 restore script in the cloned repository with the original B11 ZIP and a new output directory; copy `integration-r7/runtime/` over that output, then run its `tools/build_standalone.py`.
R1–R5 source overlays and R3 assets are required. R6 files are not an applied runtime overlay in this pass.

All candidate source PNGs remain byte-for-byte RGB imagegen outputs. `r7-manifest.js` supplies source rectangles, polygon ownership and provisional landmarks. `r7-sprites.js` applies color-key compositing in the game renderer; it does not rewrite the source images or establish native transparent sprite masters.
