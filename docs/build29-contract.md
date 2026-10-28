# Build 29 release contract

Starting HEAD8bc0eea01e42a190cfffc6385143ce1765893a07; parent43367836d83ed0168f2613bcadfa285e25c57686; treea41df7fee2a12a3d7c927376091b16aca2baf90d. Railway7696f30f-cdce-4ba3-8257-90967c41e197 SUCCESS. No staged changes. Source directory is not a Git checkout; preserve base tree through GitHub Git data operations. Older psychic29/http29 diagnostics predate this release and must not be overwritten.

## Protected foundation
Layout:2200×1100; bounds103..2097/118..1008; Jade63.96; side terraces280×720×128 at x103..383 and1817..2097,y203..923. Four180×200 stairs, x383..563 and1637..1817,y243..443 and683..883. Spawns700,563/1500,563. Panels160×104. No changes to jump/gravity/air control/camera/weapon damage/energy constants. Preserve A mobility,B melee,LT shield,RT shoot/throw,LB manipulation,RB construct/place,Y charge,X bullet time,L3 jump,existing keyboard/touch.

Trusted kit: anchored sectional barrier; movable floor-panel46; generated shapes128×28×48,76×28×80,60×42×48. Existing catalog owns health/material/mass and match state owns damage/sections. Keep layouts separate and IDs stable.

## Acceptance matrix
| ID | Expected | Method | Status |
|---|---|---|---|
| BASE-01 | Baseline build/regressions | npm build,Build25–28 | PASS |
| GEOMETRY-01 | Layout and stair authority preserved | regression,protected-file hashes | PASS |
| RESHAPE-01 | No permanent intermediate hull; damage retained | focused simulation | PASS |
| RIP-01 | One claim,one charge,real opening | simulation/API | NOT YET VERIFIED |
| HOLD-01 | Persistent hold and valid clearance | simulation/browser | NOT YET VERIFIED |
| ART-01 | Coherent walls,treads,cover and floor | actual renderer/browser | NOT YET VERIFIED |
| VISIBILITY-01 | Correct local concealment,no enemy reveal | browser | NOT YET VERIFIED |
| FIELD-01 | Elevated reach,tether,time field | browser | NOT YET VERIFIED |
| BARON-01 | Registered static broadcast art,nonplayable | asset inspection/browser | NOT YET VERIFIED |
| ANIMATION-01 | Compatible articulated Jade frames | asset inventory | NOT YET VERIFIED |
| MULTIPLAYER-01 | Two independent browsers complete round/rematch | browser | NOT YET VERIFIED |
| DATA-01 | Saved layouts and starting state unchanged | regression | PASS |
| PERF-01 | Comparable rendered baseline/candidate | browser audit | NOT YET VERIFIED |

## Known baseline limitations
Interrupted reshape retains intermediate dimensions. Cross-height ripping conservatively rejects >64 height difference. Prior native renderer warm sample46.92ms median/76.26ms p95 is not browser FPS. All-atlas native audit exhausted memory. Two-browser acceptance and full live field layering not completed. No verified Baron animation or articulated Jade jump frames. Do not report those complete without evidence.

## Work order
Transactional shape preparation; authority/ownership tests; physical lane materials and cover cues; extend same construction treatment across unchanged map; compatible Baron setting; browser and performance acceptance; exact preview deployment.

## Implemented candidate rules
RESHAPE-01: atomic preparation/commit. Existing catalog hull remains authoritative for .24s while registered joint accents move inside it. Destination is revalidated each step. Invalid clearance, knock, death, charge or exhausted battery cancel without changing hull/health. .4s request cooldown retained; no new energy cost. Throw/place/drop inputs wait for this bounded preparation. Lost ownership clears pending state. This deliberately replaces intermediate physical morphing; it is not an articulated mesh animation.
HOLD-01: loose cover now persists after analog LB release, matching generated/ripped cover. Fresh LB drops, RB places, RT throws. Existing loose-matter gesture behavior is preserved. No energy/damage changes.
RIP-01: elevated intervening cover is tested with ray endpoints relative to its z+hover base. Focused reproduction at z128 verifies obstruction; prior code tested that occluder at ground zero. Existing range/cost/.28s tear preserved. Cross-height >64 remains conservatively rejected.
NETWORK-01: after400ms missing input, neutralize controls as before; after2000ms relinquish cover/matter/orbit ownership and tear/reshape claims. No teleport or new health. Rejoin can reacquire normally.
ART-01: flush armored wall panels, fascia, fasteners, paired tread shading use real structure faces; unchanged layout/physics. Cover material opacity selectively reduced for cleaner cel-shaded faces. Floating section shadows use underlying supported height. Tether motion reduced and explicit RT/RB hint replaces misleading gesture labels.
BARON-01: new STATIC broadcast portrait generated with built-in imagegen, inspected, resized/encoded to768×512 WebP94122bytes. Source prompt: reptilian street royalty, plum/black armored luxury jacket, gold chains/crest, jeweled claws, diamond grill; mature anime/graphic-novel cel shading, orange key/cyan-magenta rim, dark blue background, no text. Asset public/assets/dimension33/build29/baron-broadcast.webp. Registered north backdrop monitor; larger portrait only at finished-round boundary. No reaction animation claimed. Gallery is outside playable north boundary. Normal follow camera may show only portions of distant architecture.
UI-01: menu now identifies Dimension33 as active arena; BayBridge remains recoverable development entry. Header names the War Games. Controller prompt moved from fighter center to optional corner. Legacy Repulse panel only shown in explicit legacy configuration.

## Evidence and limitations
Baseline npm ci/build and14 regressions passed. Candidate15 regressions including build29-contract passed. Independent HTTP clients passed authoritative section/ownership, persistent hold, rematch restoration; additional candidate HTTP authorization checks pending final run. Existing footprint, surfaces, camera, vertical physics, weapon constants and battery constants unchanged.
Both original reference JPEGs found under upload; second sheet visually inspected. Eight repository atlases inventoried in build29-assets.json. Their RGBA decoded total59.26MiB; native all-atlas process failure is not evidence of browser memory failure. Shader/texture/material processing may add allocations; root cause of prior native OOM not proven.
Native actual renderer with concrete/floor/Baron assets, static approved ready pose:30 warm samples across6 viewpoints,p5045.56ms,p9559.38ms,max67.07ms. Not browser FPS and not a controlled baseline comparison.
Live Build28 cloud Chrome baseline:179 active samples,frame interval median1016.4ms/p951016.5ms/worst1033.2ms,draw CPU median19.2ms/p9525.8ms. This environment exhibits approximately1s scheduling; cause not established. No60FPS claim. Baseline screenshot inspected at spawn. Full two-browser round, candidate browser timing, touch/iPad acceptance, field/occlusion coverage remain pending deployment.
No new Jade directional jump rig/frames or Baron reaction animation completed. Art remains a production checkpoint, not proof of finished anime polish. No campaign/new powers/map expansion. Main service untouched.

Final candidate build PASS. Build29 HTTP authorization and independent-client suite PASS: guest layout mutation rejected, bad token rejected, rip state shared, rematch intact. Fifteen focused simulation/regression scripts PASS.
