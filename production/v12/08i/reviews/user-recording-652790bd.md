# V12 08I — user playtest review: 652790bd

## Source and scope
Uploaded video: 652790bd-d90d-4820-b5e9-bbede8e693c2.mp4.
SHA-256: 9f8eb87d83d21884f432b0e627a41774b5c921a00c3069094b1fbefa5e2ba260.
Duration 113.066633 seconds; 1902 x 930; 30 fps.
Inspected 23 overview samples across the clip, individual full-resolution frames, one-second samples from 00:28 through 00:39, and selected later movement/cover frames. This is sampled visual review, not inspection of every video frame. Audio is present but was not transcribed; no spoken feedback is inferred.
Checked the exact delivered JADE_V12_08I_Cover_Pose_Routing.zip and standalone HTML. Remote branch head before this report: 0901ab6adc1e3270e1f5b5fc3ff417d9889eb8ec. The existing VERIFIED-DELIVERY.md was read from the connector.

## Visible observations
- Header identifies V12 08I. The action-aware cover checkbox is enabled in inspected frames. No comparison with that checkbox disabled is demonstrated by this review.
- Character rendering, movement, slide/cover states and firing effects are visible. The shot/hit counters advance: 00:30 shows 21 shots / 30 hits, and 00:32 shows 22 / 36. This is not a certification of every collision or damage event.
- 00:30: CORNER RIGHT / RECOIL (AIM KEY) / FINAL JADE K03 with visible muzzle effect.
- 00:31: CORNER RIGHT / RETRACT (KEYS) / FINAL JADE K02.
- 00:32: CORNER RIGHT / LOW READY / FINAL JADE K01.
- 00:33: CORNER RIGHT / RECOVERED MOTION ART; the outfit/detail and visible body position differ while the same corner marker remains in place.
- 00:37: CORNER RIGHT / RECOVERED MOTION ART, but no character is visible at the marker. The shadow, marker, barrier and interface remain. The UI reports 12 cached recovered atlases and zero errors. This is an intermittent missing-character observation, not a whole black-screen crash.
- Later samples show final Jade again, recovered cover/locomotion, shimmy and slide entry. Thus the absent-character sample does not establish permanent deletion or a permanently failed asset.
- Three existing source poses and held-key recoil are visible. No complete newly authored shoulder raise/recoil/retract or final-design locomotion family is established.

## Distinct issues — do not conflate them
1. Coverage: final Jade is deliberately limited by core.js supported() to the station/south/right edge and abs(wrapped aim) <= .34 radians. Other headings use recovered art. This explains a supported mechanism for source switching, not the exact unknown stick input at every recorded instant.
2. Registration: final PNGs use per-pose ground coordinates and ART_SCALE .205; recovered frames use cell anchors and 220/125 scale. Their visible body landmarks are not guaranteed equivalent. Correctness must be assessed against pelvis and both feet, not by changing the physical collider or indiscriminately equalizing alpha bounding-box height.
3. Availability: app.js may return no drawable image when both the requested atlas and its ready fallback are not currently decoded. This is separate from missing authored animation.

## Reproduced availability failure path
Inspected app.js requestAtlas(), choose() and character() from the delivered package. The recovered cache is capped at 12 entries. Eviction deletes the loaded image and its promise. When the requested family is unavailable, choose() requests ready for that heading; when ready is also unavailable it returns null. character() then returns without drawing Jade, while lastFrame is not cleared and can continue labeling an older frame. Asynchronous image decoding can expose this gap even with embedded offline assets and no external network request.

Executed the exact standalone HTML in local headless Chromium via Playwright set_content. Instrumented CanvasRenderingContext2D.drawImage only to count image draws to the stage; no game-source edits or artificial decode delays. Paused ordinary ticking, disabled final art to isolate recovered coverage, and stepped the 24 nominal headings four times, waiting approximately 12ms between requested headings. This was a rapid cache-revisit diagnostic, NOT a replay of the user's input or a frame-rate benchmark.
Result: 36 of 96 explicit diagnostic draws contained zero stage image draw calls. First miss was on the second traversal's direction 0; lastReportedFrame was still cover-d23-f1, with zero reported errors and cache count 12. No page JavaScript errors occurred. This reproduces a concrete no-sprite render path and makes loading/cache residency a strong candidate for the recorded disappearance. Exact attribution of 00:37 still requires the user's event/frame trace or an equivalent replay.

Separately inspected all 180 declared cover/ready cells in the local recovered atlas set. Every inspected cell contains alpha > 8 artwork pixels; no wholly empty cover/ready cell was found. This does not certify anatomy, matte quality or all other animation assets.

## Next repair priority
First: prevent asset availability from making Jade vanish. Keep a small resident ready fallback set, avoid evicting the active drawable, warm neighboring views where appropriate, and retain a clearly identified temporary valid drawable until the requested image decodes. Switch only when an image is usable. Record actual loading/fallback status instead of retaining a misleading stale frame label. Missing files must still surface as explicit failures.

Second: test cold-cache and repeated full-angle revisits, family changes, slide-to-cover, reset and focus transitions; compare gameplay outputs to ensure a presentation/cache fix changes no movement, shots or collision.

Third: reconcile stance and ground registration across the supported source families without redesign, collider retuning or falsely claiming one view is full 360 coverage. Then author the missing same-view shoulder/stock, recoil and retract drawings in this interaction. The corrected action-aware cover selector remains separate from this loader repair.

## Storage and change boundary
This commit saves this review only. No gameplay source, approved image, physics tuning, deployment setting or runtime asset was modified. No new playable build or Vercel deployment is claimed. No autonomous agents were launched.
Local evidence includes loading-reproduction.json, its diagnostic script, alpha-audit.json, sampled video frames and JADE_V12_08I_User_Playtest_Review.png. The comparison image uses actual video crops at 00:32, 00:33 and 00:37, scaled for review, not newly generated character artwork. Image SHA-256: 95f1d7530385d0e75d5d41367eb3dca4d689b5a5912bcd19192d657ef9335eb6. The original recording and image binaries are not claimed copied into GitHub by this report.
