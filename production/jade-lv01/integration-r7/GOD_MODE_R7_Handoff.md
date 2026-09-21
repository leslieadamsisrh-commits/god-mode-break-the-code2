# GOD MODE — Five-agent Sprite Test R7

## What you can play
Open GOD_MODE_Five_Agent_Sprite_Test_R7.html in a desktop browser and click **Play new sprite test**. All images and code are embedded; it works offline. This continues the recovered B11/R5 local couch combat lab. It is not an online deployment.

WASD moves, mouse aims, Shift slides, right mouse aims, left mouse fires, E attaches/detaches, Space wraps, P pauses. Existing controllers still use LS move, RS aim, A slide/kick, B wrap, X attach, LT aim, RT fire. Round choices remain 2/3/5 minutes. Hardware controller behavior has not been certified in this session.

The new sprite test follows the controller seat when one is bound, otherwise Player 1, and starts that Jade facing right. Move right to see the new run cycle. Move right + Shift for the eight-phase slide. For new cover/aim/recoil art, choose **Set up selected Jade at corner**, use Player 1 with keyboard, Resume, aim right and fire. The candidate firing keys use the supported right corner only. Free firing keeps its existing registered artwork because the candidate gun height does not match the generic socket without shrinking the character.

**Inspect every new pose** exposes all 24 candidate frames on the actual renderer. Resume clears the override. **Play approved cover art** switches candidates off. Turning the candidate checkbox back on restores the test set. All accepted artwork and original physics are preserved.

## Verified inventory
| Group | Actual result |
|---|---|
| Accepted current-design exports | 4 unchanged: CE05, CE03, CE08, B06B |
| New run candidates | 8 right-facing keys, distance-driven playback |
| New slide candidates | 8 right-facing entry/slide/brake/recovery keys |
| New cover candidates | 8 low/raise/aim/recoil/recover/return/weight-shift keys |
| Source format | Three original RGB chroma sheets, 1774 × 887 each |
| Native transparent masters newly produced | 0; failed transparency attempts are recorded |
| Runtime compositing | Chroma removal/despill in memory, polygon crops, provisional landmarks |
| Inherited R3 | 3 optional candidate cutouts preserved; comparison control now takes precedence correctly |
| R6 candidates | Four retained in parent Git checkpoint; binary recovery failed, so not claimed integrated |

The 24 runtime keys are candidate artwork, not new visual approvals or complete 24-direction animation. They are smaller than the desired native individual HD masters. Source pixels and full silhouettes are retained; display scaling does not create source detail. Some neighboring poses are similar, stride alternation and equipment continuity remain imperfect, and manual anchors are provisional. Source keying is a practical test route; final transparent exports and finished animation still need work.

## Validation performed this session
- Reconstructed R5 byte-for-byte: SHA-256 e526d2e88addf4fc4fea91f8740d319485e63ff023ce9004d2d45371d5c4e6ef.
- 56 inherited Node tests passed, including 3,600 mixed-input parity ticks.
- 25 native Canvas checks passed using the actual image bytes and renderer; all 24 keys decode, expose complete silhouettes, and render without missing draws.
- Real slide reaches all eight phases without a run frame interrupt. Supported actual shots trigger candidate recoil/recovery; blocked muzzle attempts do not. P1 shots do not animate P2.
- Aimed and hipfire candidate barrels match the unchanged authoritative corner sockets. Horizontal body stance remains provisional.
- Zero low-blue chroma matte pixels remain under the final key diagnostic. Small high-blue color highlights are preserved; this is not a guarantee of perfect final alpha edges.
- Eight protected simulation/input/socket files match B11; all 119 B11 image files are unchanged. R3 images also remain byte-identical to recovered R5.
- Cloud browser could not access localhost. Verification used native Canvas and Node, not live browser or physical-controller play.

## Open gaps / next production work
Finish a true alternating run cycle and smooth slide recovery at this view; resolve equipment/weapon consistency and production-resolution transparent masters. Then extend neighboring views without mirroring asymmetric gear. Cover aiming outside the supported right corner, full corner wraps, other weapons, powers, enemy/finisher families and remaining viewing angles are unfinished. The existing lab also has a documented 145-degree cone mismatch; its mechanics were not silently retuned in an art pass.

## Recovery
Private repository: leslieadamsisrh-commits/god-mode-break-the-code2.
New branch target: god-mode-team-sprites-20260921-r7.
Parent checkpoint: 1dbdb662e1d4e5fe771756c613062a2b781e4653 (R6).
Original B11 archive SHA-256: 38ba7040a5abedb8efe371481304b35195765d4e3de0d3c9fdc390462272c233.
Apply R1–R5 recovery first, then this R7 runtime overlay, then tools/build_standalone.py. R6 remains an art-only parent, not a runtime overlay.
Delivered HTML SHA-256: f62f49de8b10db50308249222e382a5491e1b467d2bbc5e70d1e59230fab9e05.
Delivered HTML bytes: 45898773.
Source and asset save receipts are separate from the delivered HTML. Check R7-CHECKPOINT-RECEIPT.json for a confirmed commit; a planned branch name alone is not a save receipt.
