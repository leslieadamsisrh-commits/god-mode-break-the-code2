# Dimension 33 shield art checkpoint

Approved material anchor: `public/assets/dimension33-map/crystal-shield-right-v1.png` (d00). Four directions in the first review group use separate transparent RGBA images:

| Direction | Aim | Crystal sprite | Jade shield hold |
|---|---:|---|---|
| d00 | 0° | `crystal-shield-right-v1.png` | cardinal first view |
| d01 | 15° | `crystal-shield-d01-v1.png` | `jade-shield-d01-d02-v1.png` first view |
| d02 | 30° | `crystal-shield-d02-v1.png` | `jade-shield-d01-d02-v1.png` second view |
| d03 | 45° | `crystal-shield-d03-v1.png` | diagonal first view |

`crystal-shards-v1.png` contains four matching break fragments. Character art and crystal art remain independent layers. The shield collision follows the continuous aim angle; the drawing chooses the direction-specific view. The intact crystal faces use low alpha, leaving the arena and Jade visible. The hit-centered crack overlay adds four successive damage states as durability drops; the final hit creates the matching shard sprites, which use the existing debris pickup loop. A review page at `/shield-review` compares this group to the current shotgun poses on dark and light backgrounds.

The remaining d04–d23 crystal viewpoints and shield-hold poses are still pending. Draw their near and far faces for the actual camera view while preserving d00 material, rim lights, shape, and registration. Avoid rotating or mirroring the d00 bitmap. Validate each new group before integrating the next.
