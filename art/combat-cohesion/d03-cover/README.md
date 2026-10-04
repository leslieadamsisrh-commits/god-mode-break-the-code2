# d03 cover connectors — visual review pending

Recovered HEAD a03c5520d12b4c3c1cf1cd6349662d53d918f30e; Railway deployment 228de7ab-4400-4211-9ecd-a8baf5e05d9c SUCCESS for that exact commit. Extracted source has no .git; no applicable AGENTS.md found. No runtime code or approved movement changed in this batch.

## Source audit and reuse

Audited actual runtime URLs under https://god-helmet-arcade.leslieadams-isrh.chatgpt.site/assets/shotgun-complete/runtime/ and app/Game.tsx coverPoseFrame/spriteRegistration, plus approved d03 charging source. Downloaded cover-d03.webp (1500x250, six cells), ready-d03.webp and slide.webp. The cover atlas already contains contact, compact brace (cell 1), exposed aim (cell 2), a near-identical firing pose (cell 3), gun-up return (cell 4) and exit pose (cell 5). Use valid existing brace/exposed aim; do not generate replacements. Existing slide and approved d03 charge supply downstream escape/charge presentation. Existing cell 3 does not distinguish recoil from held aim; cell 4 needs a connector returning toward compact brace.

Original cover source SHA256: 7621fa823de70d5d1e862698410e3435e665f1797112e20a86053a11dcce41d9. Existing 250-pixel cells use ground registration (.5,.86). Transparent RGB artifacts visible in some inspection backgrounds are not new artwork; alpha isolation must be respected.

## Concrete missing connector batch

connectors-review-v1.png is a built-in image-generation candidate, NOT APPROVED and NOT INSTALLED. Left: compact crouched firing recoil; right: gun-up retract toward brace. Generated using original d03 cover and approved d03 charge identity references. No cover, muzzle flash, ground shadow or energy baked into the candidate. Complete silhouettes and separate transparent regions inspected; actual game-scale adjacency is still pending.

1774x887 RGBA; SHA256 df70d2838814a95846c2424cf29b32ea99a719118a7f9f9a5b56dc7cd75d2e9c. Source halves [0,0,887,887] and [887,0,887,887]. Alpha>24 silhouette bounds in whole sheet: left [146,217,850,855], right [962,217,1650,858]. Bounds are extraction evidence, not approved registration anchors. Do not independently resize poses. Final anatomical scale, grounded anchors and muzzle alignment must be measured against original brace/expose and tested in the lab after approval.

## Existing input rules — preserve

| Link | Start / hold | Cancel / resume | Presentation and ownership |
|---|---|---|---|
| Traverse -> brace | Soft cover A or held LT; LT plants feet | Successful immediate brace retains edge priority | Existing attached cover anchor; no art gate |
| Brace -> expose aim | Braced LT/coverAim held, aim controls gunFacing | LT release sets returnToCover at least .16s | Existing cell 2; center/corner rules unchanged |
| Aim -> fire/recoil | RT and existing cadence; requires exposed aim while braced | Fire/recoil timers .11/.12; continued LT resumes aim | Existing muzzle clearance and host shots; candidate recoil is visual only |
| Expose/fire -> retract | LT release; return timer after shot may reach .28s | Fresh action overrides presentation immediately | Candidate retract -> reused brace; do not delay input |
| Brace -> escape | Fresh A; existing neutral/outward/tangent rules | Existing kick/slide timers, collision, .25s recapture lock | Free .55 base + bounded battery boost; existing slide art |
| Escape -> charge | Fresh Y cancels voluntary actions immediately | Release activates; new actions/hits interrupt; expiry requires fresh Y | Retained battery; held input suppression; approved d03 charge, movement .67145 |

No new simultaneous abilities, object ownership changes, movement tuning or input remaps. Carried objects still drop safely on fresh Y using existing rules. Runtime has priority fire/recoil -> return when LT released -> held exposed aim -> contact/traverse/brace within coverPoseFrame; overall charge/knock/escape overrides must remain immediate.

## Stop gate and exact next step

Saved prompt requires: "Stop for required visual approval of that concrete batch before installation." Show the two-pose candidate and obtain visual approval. Then register uniformly, route only d03 recoil/retract, reuse brace/expose/slide/charge, test supported faces and interruption boundaries, run relevant cover/cohesion/psychic tests and build, deploy and confirm exact-commit Railway SUCCESS, verify live chain. Physical-controller and two-client network checks remain separate and pending. Do not claim this review-only batch completes the playable chain.

## Approval and installation — 2026-10-03 22:53 PDT
User approved both poses. Byte-identical source installed as public/assets/god-frame/cover-d03-connectors-v1.png. This supersedes historical candidate status above. Only braced d03 gun-facing recoil/retract use this source. Charge, escape, knock, carrying and asset failure override immediately. Existing original brace/expose/slide and charge remain. Retract retains gun-facing during its timer to avoid switching orientation to the cover normal halfway through. Shared crouch scale derives from original exposed silhouette height143 and new height638; source anchors account for original six-pixel sole below ground line. Director COVER ART PREVIEW is render-only, two poses then off; it never changes host gameplay. 1,963 regression checks, 26 chain stages, psychic and focused cover-art checks, production build pass. Live verification pending deployment.

## Deployed verification
Gameplay/art commit 8c88297bece95c698a8382dd4ddfd206ce16b0c9; Railway cc7634cc-10ee-4c9e-b815-0cb6f7cc9e2c SUCCESS. Live browser verified both connector crops at combat crouch size, complete silhouettes and stable footline; then preview off. Proof live-recoil-8c88297.jpg and live-retract-8c88297.jpg. Director inspector remains authoritative READY during render-only preview, deliberately not a simulated gameplay claim. tests/live-cover-presentation.py used ordinary public inputs without state injection: contact -> brace -> d03 exposed fire -> LT release with attachment -> outward A escape -> fresh Y -> full release -> combat PASSED. It verifies host state/action handoffs, not full rendered temporal continuity. Existing regression matrix covers all faces, rotated/moving cover, neutral/opposite aim, zero/low/full escape, early/full charge and hits; focused cover-art test covers immediate interruptions and d03 routing. Full physical-controller and two-browser checks still pending.

Controller check: brace by cover, aim front-right with LT, fire, release LT, escape using A, then hold/release Y. Watch for a size pop or foot/muzzle jump through recoil/retract; try fresh Y during retract and compare zero/full-battery escape. Inputs should respond immediately. Next scoped art milestone is gun -> create/grip -> carry -> drop/throw -> gun/charge; audit approved psychic/ready first and generate only its missing connectors after this controller feedback.
