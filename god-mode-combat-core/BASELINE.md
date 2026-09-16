# Frozen Combat Core

The branch `god-mode-combat-core` is frozen at `efecc43dc7880ddf6831a1c40cbb694ab4dbed7e`. It preserves all completed code and verified normal backups. This is a workflow freeze, not a claim that GitHub branch-protection settings were installed.

The previously approved recovered v57 component remains at `approved/shotgun-lab-v57`, commit `00621f7446ddd0e42c2e9503ebfb391a6833bb31`. Its original source and runtime assets are in `recovery/shotgun-lab-v57`. Completed later work stays separately labeled in `experiments/shotgun-powered-duel`; it is not retroactively approved or published.

No gameplay files may change during sprite production. This folder records the freeze without duplicating the source or importing the full sprite library. The original browser build, its controls, and its loaded assets are retained exactly; converting it to a placeholder-only harness is deferred because doing so would change the protected build.

| Setting | Saved value |
|---|---:|
| Movement speed | 262 |
| Response | 13 |
| Stop drag | 0.002 |
| Slide speed | 650 |
| Slide duration | 0.70 s |
| Slide drag | 0.12 |
| Actor radius | 17 |
| Art cell | 250 px |
| Ground reference | (125, 219) px |
| Fixed simulation step | 1/60 s |
| World | 2400 × 1800 |
| Camera scale / response | 1:1 / 18 |

Saved development-only additions: directional corner exit speed 600, edge reach 56, maximum distance 270, maximum duration 0.60 s; shotgun three-shot offsets 0/0.10/0.20 s with 0.48 s cycle, 6 actor and 8 cover damage per shot. Energy values remain unknown, not invented. See `docs/SHOTGUN-NEXT-CHECKPOINT.md` for the completed test's exact scope.

The new design correction is recorded for later integration: 30 seconds describes combat intensity, not a required match length. Offer 2/3/5 minutes and optional custom settings later. The current timer has not been changed in this sprite-only pass.
