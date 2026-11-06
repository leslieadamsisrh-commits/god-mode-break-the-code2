# Straight-back slide correction candidates

Three review-only phases: entry, low hold, recovery. Built-in imagegen source exec-3ffae6cf-7d2b-4190-9931-f4df27dec7dc.png,2172x724 containing three724-square cells. Each cell uniformly scaled256/724 then padded to512; no per-pose resizing. records.json stores anchors and hashes.

References: cleaned straight-back jump recovery and approved-anatomy cleaned right apex. Prompt: true straight rear view throughout; backpack/back of skull dominant, weapon held in front facing away and mostly hidden; entry leg folds as hips lower, low baseball-slide hold with forward leg occluded, recovery heels plant; tail trails toward viewer, compact muscular anatomy and consistent equipment; alpha background no effects or text.

Visual review: correct straight-back orientation, no side snout or gun aimed screen-right. Entry/hold expose bent trailing sole, which is distinct from incorrectly drawing frontal claws on grounded heels. Recovery has rear heels. Hold leans sideways slightly for balance but facing stays away. Tail tip extends behind the planted contact anchor as expected for a trailing tail. Needs runtime motion/registration acceptance by primary.

Idle/back scale proposal based on outer shoulder armor span: original idle approximately106px versus sprint approximately138px, ratio1.30. A provisional drawScale1.30 for idle/back is more defensible than doubling it; height differs additionally because sprint extends one leg. Compare corrected jump/back shoulder span (about100px at current export) before adopting—the approved compact jump may instead require reducing action scale. No runtime scale changed.

Validation:3 PNGs512-square RGBA with transparent corners, no cropped body parts. Candidate registration remains review-only.
