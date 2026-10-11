# Raptor Run — Source Extraction 01
Visual authority: user-reuploaded original olive tiger-striped Velociraptor Soldier, white/gunmetal carapace, red targeting monocle, tactical SMG, elevated striped tail. Corrected Animation V2 is a reference infographic, not a sprite atlas.

## Produced for visual QA
- Six RUN row RGB reference crops (RUN_01–RUN_06), with crop coordinates and a local manifest.
- A contact sheet to inspect design continuity.
- All six are flagged reference-only, alpha=false, registered=false, runtime_approved=false.

## Integration gate
- No cropped tail, muzzle, toes, claws, armor, or jaw.
- No checkerboard or poster elements baked into art.
- Isolated true-alpha per pose; uniform source anatomy and resolution.
- Stable ground/world root, foot contacts, head and muzzle sockets.
- Actual directional coverage must match Jade's existing ready/run/slide/cover 24-sector renderer; six side-oriented poses alone do not establish this.
- QA at in-game size, dark/light/checkerboard backgrounds, then gait continuity.
- Preserve app/Game.tsx and lib/game.ts behavior; install via presentation-only character asset selection after source validation.

## Current decision
HOLD gameplay sprite installation. The infographic cannot supply complete source art where neighboring poses overlap or the silhouette is cut by a panel. Author clean uncropped originals before runtime registration.
