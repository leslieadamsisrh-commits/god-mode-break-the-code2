# First cover-contact direction

This checkpoint preserves the approved movement build and prepares an isolated
review candidate. It does not change or publish combat code.

## Delivered

- C001–C006: new slide braking, boot plant, shoulder contact, compression,
  settling, and attached stance.
- C007–C012: six new drawings for a subtle attached-idle loop.
- One fixed front-right nominal d03 / 45-degree viewpoint, not 24 directions.
- Original approach/slide frames reused in the combined review player.
- Lossless full-resolution source masters, transparent runtime atlases, source
  hashes, ground registration, muzzle-tip registration and estimated hand/contact
  sockets. Ground/hand/muzzle alignment against actual combat remains pending.
- Individually numbered review cards, light/dark/checker backgrounds, animation
  playback, and revision-bound design/animation decisions.

Your latest approval is recorded for the 24 displayed standing references and
six displayed running sequences, including the current registration revisions.
Unseen directional sequences and gameplay integration are not silently approved.

## Audit and repairs

All 24 existing six-pose cover sheets were visually screened. Their 144 drawings
mix actions; they are not 24 complete cover animations. Source d03 is retained as
the identity/pose reference. Cover d07 frames 0–2 contain duplicate character
fragments and are marked for repair, never hidden by deleting connected anatomy.
Other individual slide directions were inventoried but are not visually certified.

The first generated contact attempt contained a baked checkerboard and a large
foot-position change; it was rejected. A targeted edit stabilized the stance and
used an explicit blue key. A further equipment-only edit restored four cyan pack
segments in both new sheets. Final alpha extraction removes only the distinct
production blue, including enclosed gaps; it performs no component deletion,
mirroring, morphing or silhouette cleanup. Originals remain recoverable.

Each family uses one constant reduction from the 512px source cell to the 250px
runtime cell. Whole-frame ground registration aligns the new families to the
existing actor anchor [125,219]. Per-frame resizing is not used. The two source
sheets were drawn at different scales, so their family-level reduction differs.

## What to inspect next

The contact is more upright and broadly braced than the old crouch reference.
Review its weight, raised shotgun and first-to-last posture before expansion.
The strongest motion change is the slide-to-boot-plant beat. The idle has small
hand, face and cloth variations; it is not certified as final in-game motion.
In the combined player, normal contact uses the saved 0.22-second window. Slow
inspection stretches only playback, never the gameplay rules. Idle does not
restart the approach; the separate GIF loops for demonstration.

Barrier height/occlusion, the exact shoulder contact plane, foot contact under
independent aim, firing clearance, simultaneous movement and multiplayer are
remaining integration checks. Hand and cover-contact sockets are explicitly
estimated; the visible muzzle tip is registered but not yet game-verified.

Remaining production: 23 contact/idle directions, complete alternating cover
traversal, peeking, three-shot recoil, directional exits and recoveries. The
lavender force-field and separate shield brief remains queued. No new energy,
collision, damage, timing or networking rules were introduced.

## Reproduce

Restore the normal art backup, then run:

```sh
python3 tools/prepare-cover-review.py
python3 tools/build-review-catalog.py
python3 tools/package-review-gallery.py
npm test
```

Extraction uses Pillow and NumPy. The saved review ZIP includes runtime images
and ordinary HTML. Extract it fully, open OPEN-GALLERY.html and select its assets
folder to verify bytes and enable approvals. The gallery loads one sheet for a
six-frame group, or three sheets for the selected full contact flow.

Two new runtime atlases decode to 3 MB total. The full flow including the
original slide decodes to 9 MB. These are image-memory calculations, not total
browser/GPU memory measurements or a 60 FPS claim. Actual hardware performance
and in-game integration are unverified.
