# Build 39P — provisional playable Raptor V2

Base: `b4a9d7fc98fb64a476a7a52533d061dcf3ffddb2` on `studio/build39g-sprite-integration-gate`.
Isolated release branch: `studio/build39p-playable-raptor-v2`.

## Recovery and inventory

Read the 39H, 39I, 39K and 39L production reports before implementation. The named Minimal Install Candidates ZIP was not found. Recovered the 39G run package and eight-direction master package; visual inspection rejected the run crops (including a nearly empty background crop) and background-bearing master crops. None of those rejected crops was promoted.

Installed 24 individual 512×512 RGBA PNGs under `public/assets/raptor-v2`: one Idle and two Run poses for each of right, front-right, front, front-left, left, back-left, back and back-right. Reused the intact approved front-right Idle file. Generated the remaining individual replacement sprites from that reference and the matching rear backpack reference using the built-in image tool. No atlas or concept sheet was generated. One incorrect-facing run replacement was rejected and corrected.

`manifest.json` records exact paths through counts/directions, per-frame ground anchors and SHA-256 hashes. Format/alpha/boundary/duplicate validation is separate from visual inspection. All art remains provisional, not a finished 280-frame set.

## Integration

- Same `Game` component and authoritative simulation for Jade and Raptor. `lib/game.ts` is unchanged.
- Corrected the commented-out `artAction` assignment that prevented the original renderer from compiling.
- Reused Jade's existing sprite-facing selection for movement, slide and firing.
- Preloaded the physical 24-file inventory before enabling Raptor selection.
- Combat Lab selection launches the shared game directly; it does not send the user through a second Jade-only character menu.
- Legacy procedural combat/rig entry routes redirect to the shared character selector. Recoverable code remains in the base commit.
- No camera projection, collision, controls, rules, multiplayer transport, or battery changes.

## Visual fallbacks and defects

Walk borrows Run. Slide, airborne movement, landing, firing and damage borrow Idle. Their gameplay remains authoritative, but those action-specific poses are unfinished. Two-frame running is coarse; some side-view strides are not clean alternating contacts. Tail, armor/optic details and weapon angles vary slightly across generated poses. Ground registration is provisional and may require direction-specific adjustment after player video review. The painted shotgun muzzle is not yet registered per frame to the existing ballistic socket. Character choice changes the local fighter presentation; this release does not add networked character-selection replication.

## Verification

- Production build and TypeScript validation.
- `python3 scripts/validate_raptor_39p.py`: exact 24-file inventory, distinct hashes, 512×512 RGBA, transparent corners, nonempty unclipped silhouettes.
- `node tests/raptor39p.cjs`: eight positive/negative directions, action fallbacks, preloading, real file paths, both Run frames, no requests for unfinished families.
- Existing `build37-arsenal`, `build27g` and `build27b-integration` suites: four slots and recall, ownership and cleanup, bullet time and parry, melee commitment, jump/land/elevation and shared combat.
- Browser verification exercises keyboard movement, jumping, double-tap slide, fire, shield, bullet time, construction/placement, grip and melee. Raptor run frames were observed in all eight directions with no ART PENDING draws, page errors or failed requests. Jade also passed the same production-build browser sequence with no page errors or failed requests. Deployed verification is reported in the release handoff after deployment.
- Physical iPad/controller hardware and a two-device multiplayer session require subsequent player testing.

The approved XYZ service and master consolidation branch are not deployment targets. Deploy this branch only to its separate Raptor playtest service.

Next art work: four clean alternating Run contacts; baseball-slide entry/hold/recovery; jump/apex/descent/landing; per-direction shotgun aim/recoil and muzzle registration; damage reactions.
