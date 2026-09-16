# Reserved sprite integration source

Branch `god-mode-sprite-integration` remains at the frozen completed checkpoint `efecc43dc7880ddf6831a1c40cbb694ab4dbed7e`. No sprite-only changes are integrated into it in this pass.

An import must name exact image revisions and have registered dimensions, cell/grid/frame index, foot pivot, current action, independent aim/travel directions, muzzle and relevant contact sockets. Unknown values remain null and block their dependent integration checks.

Preserve the existing angle convention: right=0°, toward viewer=90°, left=180°, away=270°; direction index times 15 is only a nominal study until visually certified. Never treat mirrored art as a new view.

Import one approved family at a time into a copy of the Combat Core. Retain immediate input, fixed-step movement, distance-driven strides, and the existing collision and resource authority. Sprite bounding boxes are visual diagnostics, not collision replacement geometry.

The saved streaming experiment is prior completed work only. Future integration must avoid loading all families, choose active action/weapon groups, enforce measured memory budgets, and exclude production masters. Existing fallback caches are regenerable and excluded from backups.
