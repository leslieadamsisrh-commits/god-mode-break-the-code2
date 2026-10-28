# Build 30 release contract — Weight, Ownership & Consequence

Verified starting commit bccceaae19b0a39ad98e3774928d3ca8f784d638; parent 8bc0eea01e42a190cfffc6385143ce1765893a07; tree 26eb28661e3031026af9f1f7186f6e80c3cef825. Preview deployment 3ccf9929-ee83-45c9-8850-9622306e8841 SUCCESS; no staged changes at start. Local source is not a Git checkout. GitHub base-tree operations preserve remote binary assets and all unrelated files.

## Protected foundation
World2200×1100; bounds103..2097/118..1008. West/east terraces280×720×128; four180×200 stair footprints; Jade standing reference63.96. Spawns700,563 and1500,563. Floor panels160×104. No layout, jump, gravity, camera, damage, battery-cost, cooldown or movement tuning changes.
Controller A mobility; B physical; LT shield; RT shoot/throw; LB manipulate; RB construct/place; Y charge; X bullet time; L3 jump; right D-pad shape. Existing keyboard/touch bindings retained.
Trusted generated shapes: wide128×28×48; tall76×28×80; compact60×42×48. Natural barrier center44% detaches; side28% sections remain anchored. Source UV/material/health identity preserved. Protected stairs/supports cannot rip.

## Baseline
Production build PASS after npm ci. Fifteen focused Build25–29 regression scripts PASS. Initial broad glob accidentally invoked an HTTP suite without a server; connection refused is a harness setup failure, not a gameplay result. Independent HTTP checks must use a running production server.

## Corrections and implementation
HOLD-01: previous held-cover clearance assumed78-unit height for fighter and cover overlap. Now uses actual trusted height and z+hover interval. Short objects no longer block a nonoverlapping elevated fighter; tall volumes are no longer ignored because their bases differ by more than78. This is a collision correction, not a damage/energy change.
RIP-01: eligibility reused for local section cue; selected source stays locked during tear. Cue follows exact central44% section, with bounded boundary fracture during existing .28s tear. Interrupted tear reports its authoritative rejection reason. Existing charge-on-detach and server claims retained.
OWNERSHIP-01: cyan local ring versus magenta opponent diamond, corresponding shield accents; active held sections show local brackets versus opponent diamond. Blocked hold uses amber slash. Neutral placement drops ownership mark. No opponent reveal pass added.
READABILITY-01: anchored section cue replaces redundant whole-object floor outline. Loose target/field-change/construction indicators include elevation. Drawings remain presentation only.
UI-01: diagnostics opt-in from existing GOD MODE menu. Audit, guide, redundant minimal HUD and optional controller prompt leave default fight. Studio Labs link moved into menu; builder/recording/session access retained. Header reduced, no camera retune.
BARON-01: existing768×512 portrait contained within monitor without stretching; static art retained. Normal-camera monitor composition still requires browser review.
ART-01: stair-center chevrons follow actual ramp height; no physical microsteps. Existing cel walls/floor and approved sprites retained.

## Acceptance
|ID|Expected|Method|Result|
|GEOMETRY-01|Protected layout and gameplay constants|hash/regressions|Pending candidate check|
|HOLD-01|Exact vertical clearance|focused simulation|Pending|
|RIP-01|One claim/detach,matching geometry|simulation and browser|Pending|
|OWNERSHIP-01|Distinct local/opponent/neutral|actual renderer/browser|Pending|
|DEPTH-01|Correct concealment and fields|browser|Pending|
|UI-01|Clean play,tools recoverable|build/browser|Pending|
|MULTIPLAYER-01|Two browsers full round/rematch|browser|Pending|
|PERFORMANCE-01|Comparable rendered samples|browser|Pending|
|READABILITY-01|Ten-second exchange understandable|gameplay clip/human review|Pending|

## Assets and limitations
Reuses verified Baron WebP, Dimension33 concrete/floor materials, existing Jade frames and synthesized combat audio. No new production character animation or recorded sound assets. No claim of articulated jump legs, Baron reactions, continuous mesh reshaping, or finished10x art. Existing .24s atomic reshape preparation/.4s request cooldown preserved. Rip cross-height rejection remains conservative at64 units. Full browser depth, touch, ownership and complete-round acceptance must be recorded separately from simulation/API checks. No60FPS claim.

## Candidate verification checkpoint
Production build PASS. Fifteen existing focused regressions PASS, plus build30-contract PASS. Independent HTTP clients PASS: authenticated join, matching section IDs and ownership, one rip, persistent hold, intact rematch and saved layout preservation; guest layout mutation and invalid token rejected. These are API checks, not browser acceptance.
Protected elevation, vertical adapter, camera, foundation, structures, layout and roomStore files unchanged byte-for-byte from starting checkpoint. No balance constants changed.
Native actual Game renderer diagnostic at6 views,30 warm samples, fixed ready-d00 pose and concrete/floor/Baron assets: median41.65ms,p9556.90ms,max57.20ms CPU. This is not browser frame pacing or a controlled baseline comparison. No60FPS claim. Markers visible in inspected diagnostic; architecture still needs further visual refinement. Monitor aspect fixed but normal-camera composition remains unresolved.
React review applied: added state is unconditional; touch buttons have labels, pointer capture and cancel/lost-capture cleanup; transient inputs use existing refs; no new fetch waterfall or dependency. Added touch Grip, build/place, shield, melee, shape, charge and fire/throw; existing bindings retained. Touch device acceptance still pending.
Original recording was reviewed in prior critique; frame samples at35–44s and60–69s remain the basis of the visual work. No new character art or animation assets created this checkpoint. Existing synthesized sound path unchanged; a full differentiated audio pass remains unfinished.
All four gates remain incomplete pending full browser exchange, rendered performance, final materials, audio and animation. Do not label this checkpoint the completed Build30 release.
