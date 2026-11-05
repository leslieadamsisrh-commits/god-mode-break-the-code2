# Raptor 39T3 integration checkpoint

Status: playable art preview, NOT acceptance-complete.

Base: b513dac8dea33219132c81ae464c8c166188c491 (studio/39r4-39s-cover).
Recoverable checkpoint: checkpoint/39t-before-cartoon-run-slide.
Target: existing Raptor character lab only.

Each of right, front-right, front, front-left, left, back-left, back, back-right has four sprint images and three slide images. Total 32 sprint + 24 slide unique images. Run reuses sprint images; idle reuses slide recovery. 96 runtime paths. Every image is 512x512 transparent PNG with per-frame anchor and SHA256.

39T3 replaces eight rear-diagonal sprint images with back-facing equipment, occluded optic, and opposing extended-leg pairs. No game physics or input changes.

Validation completed:
- Eight direction mappings and four-phase selection.
- Slide entry/hold/recovery, recovery-to-run, moving fire, stop, strafe selection.
- 39T2 Railway build successful and browser loaded all 96 asset paths.
- Normal Raptor menu boot, keyboard/touch movement, moving-fire input exercised.

Outstanding acceptance defects:
- Front-diagonal run poses still favor the same leading thigh. A targeted four-frame correction was rejected because it repeated the error.
- Left/right lean and inter-direction body scale need full playback acceptance.
- Rear-diagonal replacement pairs have potential size/anchor drift; require playback review.
- Slide rear heels/contact points and recovery transitions need full gameplay validation.
- Slow/strafe and idle currently borrow frames, not dedicated animation.
- Physical controller inputs, all eight slide/fire/cancellation scenarios, and sustained captured gameplay matrix are NOT verified.

Do not mark this checkpoint as the requested completed animation release. Do not begin cover-system changes based on this checkpoint.
