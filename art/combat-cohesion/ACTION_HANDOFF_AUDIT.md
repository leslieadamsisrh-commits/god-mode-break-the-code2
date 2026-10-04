# Combat cohesion handoff audit — batch 1

Actual source audit plus engine checks; not a physical-controller completion claim. Approved d00/d03/d06 charge art remains installed.

| Handoff | Existing rule / verified behavior | Artwork status |
|---|---|---|
| Run -> A slide -> soft cover | Paid Classic slide captures grounded cover; feather input traverses | Existing run/slide/cover sources |
| Soft cover -> LT brace -> RT -> LT release | Brace keeps anchor; exposed fire uses muzzle clearance; release retracts | Exposed/fire/recoil/return routes still flag fallbacks |
| RB create -> LB grip | Creation spends existing cost; grip favors attached manipulable cover, otherwise directional candidate | Approved d03 reach/hold/retract installed; other views pending |
| LB carry + move -> LB release | Existing carry response/rotation and collision; release drops without throwing | d03 approved planted hold; other directions and carry locomotion pending |
| LB + fresh RT throw -> shoot | Throw consumes trigger; release then fresh RT restores gunfire | Throw/retract connectors pending |
| Any voluntary action -> fresh Y | Cancels voluntary action, safely drops held matter, seeds retained battery; existing held actions consumed until release | Approved charge entry; action-specific connectors incomplete |
| Y release -> weapon return -> recharge | Existing early/full release and fresh-Y behavior retained | Approved d00/d03/d06 charge/return |
| Rejected slide + RB/LB release | Previously whole action handler returned, swallowing independent edge. Fixed and reproduced with tests | No new art needed |
| Successful immediate brace + another edge | Original brace priority preserved | Existing cover source |

26 real-input engine stages run through run/capture/traverse/fire/build/carry/drop/throw/shoot/recharge in solo and joined host/guest snapshots. Created-cover carrying and Y drop also exercised. Existing regression matrix covers rotated cover, moving capture, depletion, incoming knock, early/full charge, fresh press and asset registration. Snapshot serialization is not a two-browser network playtest.

Next: d03 psychic approved and registered. Validate deployed lab transitions and physical carry/drop/throw/Y loop. Audit gun-to-power entry and throw recovery alongside this family before claiming the full direction complete. No tiers or bulk directions generated.

## Cover-angle presentation boundary
User-reported cover fire issue is occlusion, not authorization to replace approved recoil/retract. lib/cover-occlusion.ts clips only foreground solid material against the actor ground anchor; rotated/moving covers use current transforms and existing height. All start/hold/cancel/release/held-object/input rules above remain unchanged. See COVER_OCCLUSION_REVIEW.md. Validate task1 angles before advancing gun/psychic/carry art.


## Deeper cover-exposure review — 2026-10-04
Latest user clarification: caught on cover/failing to reach over, not merely pose change. Read art/combat-cohesion/VIDEO_REVIEW_1791097496_DEEP.md; this supersedes a pose-only diagnosis. Recovered a5434aa with Railway SUCCESS. Full clip sampled2Hz plus36–44s12Hz; Adobe completion had empty summary, no transcription. Reproduced exposed muzzle z36.08 below wall height47.036 despite attached-only floor clearance. Raised only exposed muzzle/projectile height to max(existing, wall+4); no damage/cadence/controls/resources/movement changes. Existing depth mask retained: additional above-height mask exception was tested, found redundant and discarded. Ground anchors, artwork and approved escape/recharge preserved. All1,963 movement,26 chain, psychic/cover-art,90,132 geometry and96 focused exposure checks pass; production build passes. Guide cover-exposure-v3 isolates changed behavior. Prepared d00 aim/recoil candidate in art/combat-cohesion/d00-over-cover: NOT APPROVED/REGISTERED/INSTALLED. Obtain visual approval, then register against existing anatomical scale/foot baseline and verify actual muzzle clearance before installation. d12 remains separate and never mirrored. Cover fire remains unresolved pending pose/physical rendered chain; two-client/controller checks pending. Deployment verification follows in next handoff.
