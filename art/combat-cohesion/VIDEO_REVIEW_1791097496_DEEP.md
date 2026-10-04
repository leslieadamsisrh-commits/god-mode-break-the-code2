# Deeper review and top-exposure correction

Recovery: current branch a5434aa5849696cfed5738b9574ae8d1b69e0151; Railway deployment 5a9e1c61-504b-48f5-83b5-d7da3414d3a7 SUCCESS. No AGENTS.md in recursive repository tree. Preserve current branch and all approved work.

Latest user clarification supersedes the previous pose-only interpretation: Jade is caught against cover and fails to reach over it. Cover fire remains Issue. Historical escape/recharge approval remains intact. Do not claim it is resolved just from changed artwork.

Review limits: entire 92.87-second timeline sampled at 2Hz, 36–44 seconds at 12Hz; this is denser frame inspection, not uninterrupted video playback. Prior 32–38/40–46 reviews reused. Adobe widget task completed with output.summary empty; no transcript or spoken feedback recovered. Raw controller inputs, frame timing, networking and exact recorded deployment identity remain unknown.

| Time | Visible evidence / user report | Investigation and smallest correction |
|---|---|---|
| 0–12 | Left-side approaches, tucked/raised presentation and departures | Inspect attached-wall exposure separately from grounded collision; no new collision blocker proven from video |
| 12–24 | Crossings around ends, side contacts, slides and firing effects | Preserve working escape and ground anchors; test all faces rather than tune movement |
| 24–36 | Repeated planted crouched aim near narrow wall | Existing LT exposure and ground attachment reproduced in engine |
| 36–44 | Repeated tucked/raised gun poses at the same right-side wall; Issue remains | Source audit shows horizontal aim gun below cover height; source-code muzzle z=44*.82=36.08 while wall height=47.036. Exposed shot clearance already ignores attached block, but visual muzzle is inside its height |
| 44–60 | Repeated escapes/returns and guide navigation | No new approval inferred; preserve earlier approved escape |
| 60–92.87 | Charging, shields, weapon return, slides and dense rings | Preserve approved charge/escape; effects remain secondary |

## Reproduction and correction

Authoritative LT inward aim sets braced/peek and produces seven pellets with clearanceCoverId for only the attached block. Anchors remain planted. Release LT clears peek and starts retract; fresh Y charges immediately. Reproduced all four faces at four rotations, with a separate blocker still preventing shots. Existing state serialization carries peek and shot z.

Corrected only exposed muzzle/projectile elevation: max(existing 44*spriteScale, cover height+4). Free-standing and outward fire retain existing height. Damage, cadence, clearance rules, resources, input priorities, cover movement and approved artwork remain unchanged. Another cover still blocks the shot.

A proposed extra height-aware mask was tested and discarded: the existing solid already begins no higher than groundY-COVER_HEIGHT. The test did not reproduce clipping ABOVE that plane; relaxing opacity would be unsupported. Existing depth correction is retained unchanged. The low authored gun/forearms need a genuine reach-over pose, not transparency, lifted feet, stretched artwork or a whole-person offset.

## Interaction rules

| Start/hold | Cancel/release | Result |
|---|---|---|
| LT while attached -> brace; inward/tangent aim -> existing peek | LT release | Immediate retraction, same grounded anchor |
| LT+RT with peek and cadence ready | Hit/new action/RT release per existing engine | Attached-block clearance only; exposed shot/muzzle height above top |
| Fresh Y during aim/retract/escape | Y release / new combat input / incoming hit | Existing retained-battery charge and immediate interruption rules |

## Art gate and next exact step

Prepared one d00 right-facing exposed aim + horizontal recoil pair with existing source sheet as reference: art/combat-cohesion/d00-over-cover/aim-recoil-review-v1.png. Generated through built-in imagegen; full prompt saved alongside. Candidate is NOT APPROVED, NOT REGISTERED, NOT INSTALLED. Both boot baselines remain visibly planted, barrel level; anatomical registration and in-lab silhouette/muzzle clearance still pending. Reuse existing brace/retract after approval; validate one complete d00 chain. Opposite d12 follows as a separately authored view, never mirrored. This d00 pair does not by itself resolve every recorded angle.

Available verification: 1,963 movement checks, 26 combat-chain stages, psychic-art and cover-art routing/source checks, 90,132 occlusion geometry checks, 96 new exposure checks, production build passed. Physical controller, continuous rendered corner chain and two-client networking remain pending. Guide bumped to cover-exposure-v3; old results do not silently approve this batch.

Deploy muzzle correction and review documents to the same Railway service. Verify exact-commit SUCCESS and available live host behavior. Stop at concrete candidate visual approval; do not install it or label cover fire fixed yet.
