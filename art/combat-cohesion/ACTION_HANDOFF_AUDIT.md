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
