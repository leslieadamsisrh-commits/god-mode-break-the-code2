# 39T34.1 Raptor scale continuity

In the November 12 22:23 recording, compare the side and diagonal ready poses around 1:49–1:55, the low and rear poses around 1:58–2:07, and the direction changes around the wall and ramp at 2:34–2:49. The recording shows the silhouette changes. The runtime inventory and fixed-camera sprite comparison identify the source frames and remove camera zoom and arena elevation from the scale comparison.

## Registration

- Left and right slide entry, hold, and recovery use a measured snout-to-rear-cable span compared with the matching side sprint.
- Straight-back jog, sprint, and slide use the width across the two-cell housing, with the rear stalk as the size reference.
- The new uniform scale pivots around the registered support foot, preserving the foot's projected offset from the actor. Shot origins use the same registration as the painted sprite. The frame pixels and authored socket points stay intact.

The values in [the registration measurements](batch34-1-scale-registration.json) are approximate landmarks traced on the 512px production cels. Use the correct facing before comparing spans. Measure head, shoulder-to-pelvis length, pack, and weapon independently when a seam is still visible. Lower poses should read through knee flexion, torso lean, and weight transfer.

## Open artwork

The diagonal turn around 1:52 still needs a ready-to-ready proportion and stance pass. Rear slide changes the pack silhouette and cable drawing even after scaling. The rear jog/sprint boundary still has a posture jump. Jump and landing, diagonal locomotion, and movement into the planted cover sequence need a matched landmark pass. Review them as adjacent poses at fixed gameplay zoom, then in motion at full and quarter speed.
