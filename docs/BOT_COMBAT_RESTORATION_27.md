# Bot Combat Restoration 27

Parent/live authority: Combat Feel 26, c18b52007f1aa043a2c7e8cb7fb953467c5f824d.
Writable branch: studio/live-app-three-section-01. Main/master and historical checkpoints remain untouched.

## Recording review

ScreenRecording_10-07-2026 16-01-35_1.mp4, 61.538 seconds. At 12 seconds the exchange is underway; at 45 seconds props have broken; at 57 seconds shield and confirmed torso-hit feedback are visible. The fight still reads primarily as shotgun exchanges around props. Footage does not establish successful controller throwing or the complete power kit. The room panel occupies too much of the play view. The bay is still a narrow distant window and vehicle/body reactions remain stiff. Round 4 with three bot wins also exposes missing first-to-three match closure.

The user clarified that ground tearing belongs to an early experimental prototype. This release does not claim to recover terrain deformation.

## Source recovery

| Source and exact revision | Verified implementation | This release |
| --- | --- | --- |
| brother-build, 768e3c3dd18ec801603e711bf87e270decfb72d4, brother-build-site/lib/game.ts | Flying matter 22 fighter / 28 cover damage, 360 impulse, .45 cover rebound; three reusable r11 fragments; light/heavy 18/34 and 280/520 impulse; bots issuing power commands | Ports those contact/fragment/gauntlet values into current authority, adds swept nearest collision and ownership; actually advances knocked fighter roots; practice bot uses Grip, throw, melee and existing movement inputs |
| development/shotgun-powered-duel-20260916, efecc43dc7880ddf6831a1c40cbb694ab4dbed7e, experiments/shotgun-powered-duel/lab-psychic-cover.js | Holder-relative orbital carrying, translation/rotation sweeps, contact release constraints; 3.2 turn, 550 translation, 3-unit sweep | Ports carry geometry and those caps; retains current hulls, mass response, reach and controls |
| integration/anime-combat-master-tonight, ff23fb06d6d9bd09d337ec846ce5f9ff0974658a, lib/game.ts | Similar matter contact and early first-to-three/end logic | Reference only; does not replace the stronger Combat Feel 26 countdown/aftermath |
| checkpoint/combat-master-cyberkitty-v12, 7e514b8b73ebcca12747dfa909b0fc5e5d7ca667, combat-lab/game.js | Earlier standalone ghost proxy | Read only; not treated as a complete modern psychic engine |

The historical Brother Build defect ledger explicitly calls destruction staged, not full physical destruction. Recovery restores useful code, not proof that every earlier idea was finished.

## Changes and limits

Broken combat props leave three capped reusable fragments textured from their own approved atlas, alongside existing cosmetic chips. Grip prefers nearby aimed fragments unless attached-cover intent applies. Existing Grip + fresh RT and Orbit launch now connect to authoritative matter hits, shield blocks and round finishing. Held-cover contact is a safe constraint/drop, not an attack. Throwing remains the attack.

Practice bot holds a route side while its sightline is blocked instead of oscillating, and issues existing grab/throw/light/heavy/Weave inputs. This is sparring logic, not tactical planning or a complete combo opponent. Session entry collapses the accessible room panel. Thrown cover leaves bounded temporary surface scuffs: no terrain holes or altered collision.

Frozen: Kinetic Weave configuration, shotgun cadence/spread, current Jade, Camera B/1.85, controller mappings, shared multiplayer authority, cover hulls/rails and approved assets. Recovered melee damage differs intentionally from the interim shotgun-damage placeholder.

## Validation

Automated: fight23 private authority/API flows; fight24 melee/edge/range/cover/shield/planting; spatial21 projection/inverse, 32 cover actions and 320 occlusion transforms; three-cover25 rotated Grip/brace/throw, shields, breakage/caps/reset and bot firing; combat26 body regions/sweeps/countdown/draw/finisher; restoration27 swept matter ordering, ownership, shields, one-hit protection, actual knock displacement, fragment reuse through Grip+RT and Orbit launch, safe 180-degree carry and contact release, gauntlets, bot command families and lethal matter. Frozen comparison: 1,800 exact normalized solo host states against deployed 26. Production HTTP checks private joining, safe snapshots, countdown, practice and local asset loading. Production build/type checks pass.

Visual: native Canvas executes actual renderer with approved world and actor atlases, 128 rotation/camera scene cases, 80 actor rotation cells, missing-art fallback, both player slots, damage/Grip/break fragments, HUD/finisher, and surface-scuff sample. Jade uses approved ready d00 as the audit pose in every direction; this does not verify all directional animation assets or real-device performance.

Real-device: no Safari/controller or two-device network certification for 27 yet. User playtest required after exact Railway SUCCESS verification.

## Remaining work

Vehicle full-rotation deformation/face registration and physical body reaction art need improvement. Ground tearing/Unmake and shield parry reflection were not recovered as verified implementations in inspected code. Original full C3 HUD assets were not recovered. Orbit/Pinball retain existing keyboard/API hooks but are not newly mapped to controller. Complete multi-weapon controls, first-to-three match closure, latency/prediction work and a fair combo continuation/escape system remain separate work. No full kit or ground destruction completion is claimed.

Next bounded pass: inspect a real restored throw/break/reuse exchange; make hit reactions and recovery readable; define a short authoritative combo continuation window with shield/movement escape, then implement/test it without changing frozen Weave values. Ground spectacle follows verified contact mechanics.
