# V12 08E resumed — exact-source early-lift study

## Completed scope
Executed and verified `source-pixel-study.py` from commit a461438238fe3dc5b40011d9da38d208f741c726. The local generator's Git blob SHA is c5063a009a0e4ad8e3ff85e05f90ded8c0b5c364, matching the fetched repository file.

Delivered one unchanged K02 sample plus four derived samples at 1.5, 3, 4.5 and 6 degrees of local gun-region lift. These are SOURCE-PIXEL DEFORMATION STUDIES, not newly authored frames or final anatomy. Zero newly drawn HD sprites are claimed.

## Preserved identity / measured file checks
- Exact K02 reference SHA-256: 44e287124b8d713e7efd5281247f57a869b922249dfeb1edb6e08790fbadb105.
- Exact K03 target SHA-256: c69459b6a36b52bedbb88bf3cf5a6e794adc99c06dd31cd04d9befca28e76e7b. K03 remains a separate comparison, not an implied completed transition.
- Native K02 samples: 640 x 809 RGBA. Padded review canvases: 768 x 960 with (64,64) offset. Padding creates margins, not HD detail.
- Top/face rows 0..249 and lower rows 500..808 remain identical pixel-for-pixel. The local upper-body band changes; knees and boots do not slide.
- No cover, environment, HUD or muzzle effect baked into the PNG samples.
- 53 asset/region/mesh assertions passed. Positive triangle checks are not proof of correct anatomy. Minimum triangle area ratio at the largest test: 0.5587201714515686.
- Original edge fringe remains; final matte and anatomy review are pending. Source resampling in the changed region is disclosed, not represented as hand-drawn in-betweens.

## Executable review and evidence
An isolated comparison viewer shows original K02 on the left and derived samples on the right. It supports stepping, small-lift playback, speed choice and a separately labeled K03 target comparison. The reverse playback is just an inspection loop, not authored recoil/retraction.

14 local browser checks passed in headless Chromium 144.0.7559.96, including embedded PNG decoding, keyboard/slider controls, pause, playback, speed selection, target comparison and loop survival. No JavaScript errors observed. The self-contained HTML was inserted using Playwright set_content. File URL and localhost navigation were blocked by environment browser policy; no hosted URL or file navigation is claimed verified. No physical Xbox test or gameplay test was performed.

The MP4 is a 5.75-second deterministic sequence of screenshots from the review canvas, H.264 1472 x 1024. It is not live combat footage or evidence of runtime performance.

## Persistent deliverables confirmed
ChatGPT Library destination: /GOD MODE/V12/08E/Source Pixel Study/
- JADE_V12_08E_Study_Package.zip — 28 files; 15,969,967 bytes; SHA-256 9e6b4b4dd4dcd593d7ce53fbf65d5c99c401a74420a6293b437e71c20cc9de73; library_file_id libfile_18c49ab00f748191b15b58fe1693c74a.
- JADE_V12_08E_Early_Lift_Study.mp4 — SHA-256 0325a7a76ebe1c18c6f049846622f1b456b562d7f9ae89e58e662d26ad8db707; library_file_id libfile_7ffc36b015008191addd6d1e7615e513.
- JADE_V12_08E_Motion_Study.html — SHA-256 58390814a6d6940b386e9462cf636fdbb35a6d6cec86b290ca5ffed31204b2e1; library_file_id libfile_15fbf73581e08191b4e1030297fd4e71.

Package includes native and padded PNGs, both approved references, hashes, generator, checks, viewer source and standalone HTML, actual review screenshots and MP4. Intermediate screenshot capture caches are excluded. ZIP integrity check passed.

## Promotion gate and next task
The study is usable for reviewing a small lift only. It does not complete the K02-to-K03 shoulder raise, reveal missing anatomy, produce recoil, finish retraction or establish correct 360-degree movement. Full transition still needs authored or properly layered shoulder/elbow/hand/stock motion; do not keep stretching this mesh to impersonate new drawings.

Final art gate stays pending. The approved design and v11.1 movement authority remain unchanged. No gameplay file, approved runtime sprite, root HTML or Vercel configuration was edited. No new playable build or deployment is claimed. The image/video binaries are saved in Library/package, not claimed uploaded to the GitHub runtime directory by this report. No autonomous agents were launched.
