# Bay Bridge Manga production 13–15

Continues Composite 12 on studio/live-app-three-section-01. No gameplay retuning.

13: Ten independently generated, hand-inked manga face atlases replace vector surface stand-ins. Concrete has aggregate, fractures and rebar; vehicles have individual glass, wheel and crushed-panel treatments; infrastructure has hinges, vents, cable hardware and restrained indicators. Built-in image generation used existing authored atlases as registration references, requesting flat orthographic 3-column, 2-row UV sheets, fine 80s/90s industrial manga ink, cyan/violet steel shadows and sunset-orange wear highlights.

14: A detailed transparent bridge megastructure and distant bay skyline replace background vector plates. The roadway is a quiet wet asphalt illustration registered to the combat canvas camera. No extra collision objects.

15: Resolution-independent UV projection, SVG load fallback, removal of redundant procedural surface drawings, atmospheric background separation, existing contact shadows and bounded local light response. The skeleton, cover rails, hulls and authoritative engine are preserved.

Validation: production build, frozen engine constants, 2400 host frames with two input slots, 5120 atlas triangles across ten actors and 32 rotations, 320 rig concealment transforms. The older regression scripts retain baseline fixture issues; these results do not claim they all pass. Real-device visual/performance playtest remains necessary.

Art debt: generated end faces are still interpretations rather than engineering-perfect orthographic projections; sparse near/foreground architecture remains authored vector art; baked surface highlights are not full relighting. Grip rotation seams and small-device readability require playtest review.

Assets: public/assets/bay-bridge/manga-v13/*.webp. Existing vector files are retained as fallbacks. Master and gameplay files remain frozen.
