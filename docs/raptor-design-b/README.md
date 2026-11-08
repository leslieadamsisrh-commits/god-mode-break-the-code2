# Raptor Design B — reference candidates, approval pending

Base verified remote HEAD: `studio/39t14-cover-pose-batch` / `2b64e2d09714ae15899c5399545da29b464f7c56`. Save on isolated `studio/raptor-design-b-reference` branch. Current saved commit is branch HEAD containing this record. No deployment status inferred. This folder is documentation-only: no runtime asset, manifest, selector, socket, physics, collider, damage, input or deployment changes.

## Deliverables
- `front-candidate.png`: corrected front protected crouch.
- `side-candidate.png`: right-side view; anatomical right optic visible, far module occluded.
- `rear-candidate.png`: rear view; twin low modules, mounting harness, knee straps and nearer heels.
- `registered-comparison.jpg`: approved standing front/side and baseball slide alongside candidates. Each cell has enlarged and nominal default-scale views. Static reference rendering, NOT game capture or interactive validation.
- `review-registration.json`: review-only uniform scale and ground-anchor settings.
- `landmarks.json`: approximate manually estimated projected anatomical landmarks; not 3D measurements. No tail/weapon bounding-box normalization.
- `asset-checks.json`: dimensions, alpha ranges, SHA256 hashes.
- `render-comparison.cjs`: reproducible comparison using @napi-rs/canvas and existing runtime registrations. Dependency already available in review workspace; not added to runtime package.

## Changes and visual checks
B's chest cells moved behind the shoulder blades. Slim twin modules sit below the neck with a clear spine channel; no shell/dome surrounding head. Front straps remain visible. Red optic stays on anatomical RIGHT; natural left eye retained; crown gear remains. Jaw is tightened, rear hand index extended along receiver outside trigger guard; support hand remains under fore-end. Glowing rectangular knee panels replaced by painted segmented red armor markings. Muscle, yellow/black palette, tail and broad shoulders retained.

Rear draft corrections: removed erroneous beige ventral scutes from the back, replaced rear-facing kneepad faces with securing straps, deepened crouch and staggered feet. Final rear remains a candidate, not certified turnaround geometry. Side shows shallow pack projection; no extra shell. Alpha inspection found the side preview's apparent colored background in transparent RGB regions; saved PNG and composited comparison preserve transparency. No background recoloring or anatomy distortion performed in code.

## Proportion review — do not lock yet
A uniform scale cannot resolve every old/new shape difference. Manual front measurements at the chosen review scale give projected skull width approximately86 units versus107 in existing frontal standing, and shoulder-center span approximately161 versus126. Closed jaw, armor, perspective and crouch affect these estimates (roughly +/-5 source pixels), but the opposing differences are a real reason NOT to certify the body proportions from this reference alone. This is not a claim of a measured runtime scale bug or true 3D anatomical dimensions.

Side/rear shoulder, pelvis, knee, ankle, foot, skull/pack/tail estimates are in landmarks.json. Joint positions obscured by armor are estimates. The rear is now lower and staggered, but exact cross-view pelvis height, skull volume and cable routing still need final reconciliation before animation production. Weapon receiver/profile is closer to the slide but not a mechanical blueprint; require final visual signoff. Do not silently carry these differences into all sprites.

Size-change causes:
1. Equipment silhouette: confirmed removal of upper pack mass changes outline independently of body size.
2. Artwork proportions: projected skull/shoulder relationships still differ from older standing; uniform scaling alone cannot equalize them.
3. Runtime scaling: existing drawScale varies by frame, intentionally; review used those values, no runtime defect established or changed.
4. Registration: candidate anchors are manually estimated for still comparison; no planted-foot continuity or airborne test claimed.

Recommendation: review/approve the compact equipment concept separately; keep all three images provisional. Do not lock the full animation reference until skull/shoulder/pelvis proportions and cross-view stance agree. No new runtime sprite batch is authorized by this save.

## Prioritized future equipment continuity list
Paths below are relative to public/assets/raptor-v2/. Read actual selector in lib/raptorPose.ts before integration.
1. Protected hold -> exposed: `cover-hold/front/000.png`, `cover-hold/front-right/000.png`, `idle/front/000.png`, `idle/front-right/000.png`, `cover-lean/front-right/000.png`.
2. Slide -> catch/recovery -> hold: `slide/front-right/000.png`, `slide/front-right/001.png`, `slide/front-right/002.png`. Preserve approved001 pose/body; any later change is equipment-only.
3. Along-cover movement/drive -> hold: `stalk/front-right/000.png` through003, `cover-drive/front-right/000.png` and001.
4. Free movement entering slide: `jog/front-right/000.png` through003, `sprint/front-right/000.png` through003, `run/front-right/000.png` through003.
5. Repeat verified equipment mapping in existing right/back families; examples `idle/right/000.png`, `idle/back/000.png`, `cover-hold/right/000.png`, `cover-hold/back/000.png`. Do not mirror asymmetric equipment.
6. Jump/landing boundary later: `jump/front-right/004.png` and005; preserve functional timing and approved anatomy.

## Source and prompt record
Built-in image editing only; reference-only originals are also retained as generated images. Project candidates uniformly downsampled/padded to512px with alpha; no nonuniform stretch.
- Front: exec-bf6b4c70-5fcf-4299-98ed-ab4328f73688.png. Sources Design B exec-f709a947-25a8-4fc6-85d4-1bc4a5894c32 and approved slide/front-right/001. Prompt: move cells behind ribs, preserve headgear/identity, tight jaw, painted knee marks, clear rear/support grip, compact athletic crouch; second narrow edit removes lingering armpit cells.
- Side: exec-69e48c87-f608-4c65-9a7c-10ddc02ad810.png. Sources corrected front, idle/right/000 and approved slide. Prompt: same crouch/design viewed from right, two flat back modules below neck, far one occluded, visible right optic, same low-ready grip, full digitigrade feet/tail. Later background-only candidate not selected after alpha check showed original background transparency.
- Rear: exec-28f260d6-edfe-46a4-83ba-b0d8ca4b7fa6.png. Sources corrected front and idle/back/000 for orientation only. Prompt: same crouch from rear, twin slim modules with spine gap, right headgear, heels nearest camera; targeted follow-ups correct dorsal scales, hidden front knee armor and deepen/stagger crouch.

Completed: source recovery, remote base verification, targeted image review/corrections, alpha/dimension/hash checks, registered visual comparison and continuity inventory. Not performed: runtime integration, build, match testing, hardware controller testing or deployment (outside this milestone).
Next action: user review of equipment and reference candidates; reconcile recorded proportion differences before producing animation.
