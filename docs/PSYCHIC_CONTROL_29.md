# Psychic Control 29

Parent: Movement Feel 28, `71fe47398a435c15f04267ad39e9c707a2d21de7`. Same branch, repository, Railway service and URL.

The latest 48-second playtest showed a readable shield and side battery, but no psychic reach cue and no clearly verified whole-cover toss. Video has no input telemetry: it cannot prove which buttons were held. Source confirmed fragments could win selection over aimed whole cover, carry contact released the object, and slow time had no authoritative HUD cue.

## Implementation

- Three server-owned Grip reach settings: Close 135, Standard 235 (default), Wide 335 world units. D-pad left / keyboard left arrow cycles once per press. Sizes are new integration values, not claimed recovered legacy tuning. This selector is independent of Kinetic Weave evolution.
- The ground-projected ring uses the exact same center-distance radius for cover and fragments and clips to the finite playable deck. Whole cover crossed by the aim ray takes priority over incidental rubble. Own attached cover remains intentional priority; another player's held/attached cover remains unavailable.
- LB holds Grip; right stick aims; fresh RT press throws. Holding RT before grabbing still requires release and another press, now explained by the HUD. LB release drops. Y recharges. Full-stick psychic aim is separate from shotgun torso twist; carry and toss use psychic aim.
- Swept held-cover contact stops at the last valid transform and retains ownership. It neither attacks nor damages on contact. Reposition, throw, release LB, charge, death or battery exhaustion can resolve the hold. Existing throw momentum, mass, damage and shields remain.
- Existing global slow-time simulation remains 52%, with 28 battery units per real second. X is held on controller and keyboard. The server now publishes the actual timeScale for the HUD/ring. Movement/projectiles slow globally; this is not a radius-limited opponent-only time bubble. Countdown/weapon/energy timing semantics remain as before. Finisher remains separate 100→92% aftermath.
- Held objects retain their artwork: replace the repeated per-triangle magenta shadow wash with a restrained ground outline. Throw direction arrow and range/time hints accompany the existing helmet/side battery.
- Stale inputs clear the new selector too. Private invites and transport are preserved.

## Validation

Automated: exact inside/outside reach for all settings and both target classes; edge-only cycling; whole sedan/cabinet/Jersey grab+toss over nearby rubble; blocked hold, no contact damage, behind-character toss; both slots slow/drain/release/empty battery; 1,500 identical movement frames against 28. Existing combat26, restoration27 (updated intended contact constraint), three-cover25, fight23/24, spatial21, stage28 and presentation28 checks passed. Production build/type checks passed. Production HTTP28/26 checks passed; HTTP29 verifies selector and timeScale through the actual API.

Visual: actual Canvas renderer with approved atlases, six field/held/time combinations, 128 scene/camera/rotation cases, 80 actor cells and missing-art fallback. Corrected glow wash after inspecting renders. Jade review uses approved ready d00 as an audit pose across directions; this does not certify all device animation states.

Real-device: only the supplied 28 playtest has been inspected. 29 controller feel, two-device latency and James's session still need playtesting. Full-angle vehicle face deformation/registration and limited bay exposure remain art debt. No source art regenerated; no Weave profile retuned. No local time bubble, rewind, new combo moves or terrain destruction added.
