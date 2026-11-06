# Front ground anatomy review

Review only; no runtime edits.20 corrections,4 reused.

|Family|Direction|Decision|Lead000/001|Lead002/003|Uniform drawScale proposal|
|---|---|---|---|---|---|
|stalk|front|corrected|viewer-left|viewer-right|0.78|
|jog|front|reuse existing4|viewer-left|viewer-right|0.90|
|stalk|front-right|corrected|near/right|far/left|0.85|
|jog|front-right|corrected|near/right|far/left|0.85|
|stalk|front-left|corrected|near/left|far/right|0.82|
|jog|front-left|corrected|near/left|far/right|0.82|
|sprint|front-right-v2|targeted alternation candidate|near/right|far/left|0.78|

Scale values are visual landmark estimates, NOT calibrated gameplay acceptance. Compared skull width and shoulder-cap diameter against corresponding jump005; not total sprite bounding box. Front stalk: shoulder span about142px vs110px recovery, ratio0.775. Diagonal front-right shoulder cap about53px vs44px recovery (0.830), head width about60px vs53px (0.883), midpoint0.85. Front-left shoulder cap about50px vs40px (0.80), head about60px vs50px (0.833), midpoint0.82. Front jog shoulder span about120px vs110px (0.917); provisional0.90. Pose perspective and landmark picking allow roughly5percent uncertainty; primary must check registration and motion before accepting. Keep one uniform scalar per direction/family, not individualframe boundingbox resizing.

Corrected anatomy: enlarged muscular torso and thighs, rounded calves, compact neck and snout, compact three-primary-toed feet. Existing front jog was already compact, had clear opposing planted legs, and is retained. Rear/upward tail arc remains the original locomotion pose; ratio should be checked in gameplay.

Sprint front-right v1 rejected:000 and002 nearleg lead remained ambiguous. V2 lower row explicitly puts nearhip thigh behind to viewerleft, farhip thigh forward vieweright; verify hip/knee overlap at gameplay scale. The four differently posed frames alone do not establish alternation.

All generated sources retained; exports use common whole-sheet resample to1024square then fixed512cells, largestconnected alpha component plus1pixel antialias edge. Source registration retained in records as reference, not guaranteed new muzzle coordinates. New frames need updated barrel origins and contact anchors.
