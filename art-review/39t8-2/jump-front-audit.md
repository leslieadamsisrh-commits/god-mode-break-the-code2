# Front jump artwork candidates

18 review frames: front, front-right, front-left; each six-phase push-off/ascent/apex/descent/landing/recovery. Runtime manifest untouched.

Authority: exact approved master e30e1c6b and its saved transparent right-facing apex cleanup. Existing directional idle supplied camera angle only, not anatomical authority.

Front: first sheet required three-toe correction. Final b8a2cda8 preserves viewer-left red right optic and viewer-right amber left eye. Compact legs and phase differences are visible. Apex hose loop differs from neighboring frames; primary should decide whether that movement is acceptable.

Front-right: first sheet read too side-on; second turned toward viewer with foreshortened gun/barrel ends. Final447af6e3 preserves near right optic and corrected direction. Calves stay compact, but head tilt changes slightly across phases. Primary must compare against exact master and inspect motion.

Front-left: first sheet had long neck/snount drift. Final fdc81d67 shortens neck and snout while keeping natural amber near LEFT eye and far-side right optic occluded. Short bent calves and three claws visible. Primary should scrutinize head continuity against front-right.

All sheets contained RGB dark glow under low opacity despite transparency request. Final exports remove alpha below0.5 and retain higher alpha; gray-background composites were inspected for residual backdrop. Body artwork was not warped or individually bounding-box normalized. Same uniform scalar is used across all six frames in each direction. Source sheets preserved for recovery.

records.json holds suggested anchors, source IDs, SHA256, and manually estimated muzzle coordinates. These are authoring suggestions, not physics/runtime acceptance. All exports are512x512 with alpha. Scale matching to other directions and in-game grounded/airborne transitions remain primary acceptance gates.

Generation used built-in imagegen. Prompt sequence: six-pose 3x2 sheet with locked exact anatomy, phase-specific legs and consistent bone lengths; direction camera reference; correct right red/left amber asymmetry; then target three-toe/angle/neck corrections and background extraction. No runtime changes made.
