# Raptor 39T6.1 integration checkpoint

Status: deployed candidate; NOT acceptance-complete.
Base: 834ce91a0bfe820896e9af7cf6a415a37a444257 (39T5).
Checkpoint: checkpoint/39t5-before-t6.
Working branch: studio/39t6-stride-slide-finish.
Only the existing Raptor Railway playtest service is targeted.

## Installed inventory
All eight directions retain 4 sprint and 3 baseball-slide images: 32 + 24 unique images, 96 runtime paths. Slow run shares sprint; idle shares slide recovery.

## Corrections
- Replaced sprint/front-left/002.png and 003.png, and front-right/002.png and 003.png, plus corresponding run aliases.
- Individual edits preserve approved upper body while exchanging the leading thigh and providing the opposite passing phase. Four replacement images accepted for installation after reference comparison; full gameplay acceptance remains pending.
- Front-right 003 registered by crown, optic, shoulder and weapon; uniform scale 0.890625, offset +28,+44 relative to its generated canvas.
- Rear-diagonal 003 vertical anchors corrected from 392 to 457 (back-left) and 394 to 462 (back-right), including run aliases. Crown and backpack registration removes the large downward body jump; no pixel resizing.
- SHA256 metadata and build cache version updated. No physics, input mapping, collision, slide timing or effects changed.

## Verification
- Railway successfully built/deployed initial correction commit e63bfd0c548f255c3f9a0275ae1133276f4f34b3.
- Fresh live 39T6 review loaded all 96 runtime asset paths and displayed corrected front-diagonal phase 4.
- Node engine integration test (scripts/check-raptor-39t6.cjs): real LocalCombat and frame selector, fixed 60Hz, neutral open-floor fixture at (1100,560) with covers removed ONLY in test. All eight directions reach four sprint phases, all three slide phases, fire during sprint/slide, and settle to idle. Invoke with Node 24.
- Test uses normal engine input fields and the existing double-tap slide sequence. It does not exercise browser input delivery or establish physical-controller support.
- Live keyboard sustained right run painted all four phases on 39T5 during deployment. Short keyboard/touch double-tap attempts did not yield a reliable complete slide trace.
- All 24 slide images inspected as an entry/hold/recovery contact sheet; none replaced in this pass.

## Remaining acceptance
- Live eight-direction start/run/stop, adjacent turning, moving fire and complete slide playback matrix on final build.
- Slide cancellation, slide/fire interaction, contact/effect alignment, rear feet and recovery assessment in gameplay.
- Rear-diagonal lateral pose/angle drift and inter-direction scale remain under review despite corrected vertical registration.
- Slow movement and idle remain borrowed poses; full transition acceptance outstanding.
- No physical controller available in this execution environment. Do not report a controller pass.
- Do not count installed or statically inspected frames as fully gameplay-accepted cycles.
Cover work has not begun.

## 39T6.2 input continuation

Preserves each keyboard/touch slide press and release between rendered frames, including movement direction at the event. Previously two quick taps could coalesce into a single boolean and trigger only boost. The new regression test reproduces that failure and verifies all eight directions start a slide when edges are preserved. Repeated keydown and overlapping Shift/touch sources do not fabricate taps; blur resets pending edges. Existing game double-tap window, physics, timings, controller polling and sprite artwork remain unchanged.

Added scripts/check-raptor-slide-input.cjs (Node 24); all eight original movement tests plus input regression checks pass locally. Build and live verification follow deployment; no physical-controller pass is claimed. Asset pack remains 39T6.1.
