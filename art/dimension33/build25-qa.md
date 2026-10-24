# Build 25 — expanded arena candidate

Starting remote/deployed commit: `df88c4a79aaffca3517bcf44398fecbf82880dd5`, branch `studio/raptor-combat-lab-01`. Railway SUCCESS observed: `7b206f2e-f244-4089-b1b3-1a78f4528a37`. No pending changes at start. Rollback: `studio/build25-rollback-df88c4a`. Local snapshot `3cac5b5` is not remote ancestry; modified baseline files were compared against the complete remote tree (bayBridgeMap differs only in trailing whitespace).

## Implemented

- Nominal floor 1000x620 → 1500x840. Actual collision inset 70..930 / 90..550 → 70..1430 / 90..770 (860x460 → 1360x680). Viewport remains 1000x620; projection calibration and close zoom unchanged.
- Shared world metadata and authoritative bounds/spawns. New mirrored spawns at (320,430)/(1180,430), shelters at (400,430)/(1100,430), primary groups at x505/995 and y285/575, central groups x655/845 and y365/495. Nodes/flanks/approaches recompose separately; no hull dimensions, combat tuning or fighter scale changed.
- Floor ledger extends with unchanged 80-unit spacing and three finite units per cell. More initial matter accompanies the larger floor; conservation rules and tests remain unchanged. Join/reset use new shared spawns; spawn-side diagnostics use actual center.
- Floor imagery extends at the previous texture scale. Lifted slabs sample its native size rather than shrinking the larger texture to 1536x1024. Camera bounds and decorative clipping follow the expanded area.
- Broad cover roofs use the existing flat industrial-plating source. Original painted cap/light detail is confined to a 3-world-unit trim band instead of stretching across the roof. Broad concrete material replaces stretched narrow end caps. Cabinet sides use flat plating; fronts keep the existing cabinet source. Small six-by-three-unit amber fixtures retain fixed size. Same face-based treatment applies while moving/rotating/damaged; no new directional billboard path.
- Existing architecture moves to the expanded perimeter; approved railing modules and side facades supplement it. Solid Build24 treatment retained. No scenery gains protection, traversal, Grip or destruction.

Runtime files: `app/Game.tsx`, `lib/bayBridgeMap.ts`, `lib/bayBridgePresentation.ts`, `lib/combatPresentation22.ts`, `lib/dimension33MapArt20.ts`, `lib/dimension33Registration21.ts`, `lib/dimension33World25.ts` (new), `lib/game.ts`.
Test files: `tests/build25.cjs` (new), `tests/build24.cjs`, `tests/floor46.cjs`, `tests/render21.cjs`. Floor test loader now loads shared world metadata; older scenery test checks authoritative bounds.

## Evidence and verification

Latest supplied reference is preserved unchanged as `build25-evidence/approved-reference.jpeg`; original upload name `1254F838-8830-415F-893A-8691A3BE55BA(1).jpeg`. Runtime sources are existing higher-resolution map20 assets, not tiny poster crops. No replacement arena/character art generated.

`reference-comparison.jpg` shows approved sheet crop, existing barrier source, Build24 and candidate actual-renderer output. Stills are 1000x620. Candidate encounter is relocated, so these are equal-viewport comparisons, not identical world-depth comparisons. `final25-contact.jpg` includes central barrier, approaches/flanks, held/thrown, damage/destruction and missing assets. `scripted-motion.mp4` is a 12-second, 500x310 scripted render-state route; it is not browser gameplay, physical input testing or proof of runtime performance. One Jade standing frame is loaded by this harness; full character animation quality is not certified.

PASS: production compilation/type checking; Build22 selector/commitment/transition and server API two-client/rematch checks; Build23 viewport/aim checks; Build24 alpha/fallback/hull checks; floor46 lifecycle/unique matter identity and 3969 targeting inverses. PASS Build25: mirrored object placement, real simulated movement against expanded boundaries, actual cover creation beyond x1000, new floor coverage, reset, full-area aim round trips, roof source selection and bots reaching an encounter within ten simulated seconds (closest separation 114.8 units).

Headless CPU timing: two warm-up frames plus eight samples, 1000x620. Build24 original central fixture median 249.57 ms / max 271.52; final candidate relocated central fixture median 76.46 / max 85.23. Layout density differs intentionally, so this does not isolate renderer speed or establish browser FPS/iPad performance. Expanded floor cache is 2304x1280, about 11.25 MiB RGBA, versus 6 MiB previously; browser memory/frame timing still needs measurement.

## Not complete / unverified

This is an expanded playable candidate, not a claim that the complete approved scene has been faithfully reconstructed. Missing source-compatible structural connectors still limit the south perimeter and bridge landings. Architecture is sparse in central close views; a complete assembled perimeter remains unfinished. Long shelters retain their actual 34x118x78 hulls; node hulls remain 48x58x78. The existing sculpted rig silhouette and some panel-detail scale still differ from the reference. No dimensional reduction is proposed as an automatic fix; any hull revision needs separate sightline/attachment/symmetry review.

Static/moving cover renders improve roof distortion but do not certify every rotation, physical impact or settling case. Source-edge fragments and approved illustrated HUD remain recovery/repair tasks. Source references are not all usable sprites. No approved HUD restoration claimed.

Candidate browser gameplay, physical controller/iPad, audio, two actual browser clients, real-network quality, and live asset delivery remain unverified until an authorized deployment is observed and tested. API two-client checks are not browser tests. Repulse remains disabled by default. Both clients should reload after a map revision; mixed-revision client compatibility is unverified.

Deployment outcome and final commit must be reported from actual GitHub/Railway results, not inferred from these tests. No unrelated staged infrastructure changes may be applied.
