# GOD MODE — MASTER COMBAT COHESION CONTINUATION PROMPT

Continue the existing app from its saved state. This is the next production pass, not a new project. Gameplay and artwork work within this scope is authorized. Follow the gates below; keep reports short and plain.

## 1. Recover the exact current build first

Repository: leslieadamsisrh-commits/god-mode-break-the-code2
Branch: integration/combat-master-multiplayer-core
App: https://god-mode-playable-core-production.up.railway.app/
Last verified gameplay commit: b10c86ad730c867a62de69cea68a76713175d7f4 — Railway SUCCESS.
Saved live-verification checkpoint: 4affd063303fb829d307a0d66d029459e9f0d9e9.
Saved cohesion plan: 971ea30b07cb55308a2430334b5cc336ad7dc515.
These are reference anchors, not instructions to reset HEAD.

FIRST ACTION: read GOD_MODE_HOVER_CONTINUATION.md, GOD_MODE_COMBAT_COHESION_PLAN.md, this prompt, and applicable AGENTS.md. Inspect current HEAD, working changes and exact deployed commit/status before editing. Preserve newer approved work. Verify actual installed assets and current controls rather than assuming the saved counts are still current.

## 2. One cohesive combat system

Build running, sliding, soft/braced cover, shooting, psychic cover creation, gripping/carrying/repositioning/dropping/throwing, and charging together. The goal is immediate control, readable action, stable grounded collision and continuous character presentation.

Use this encounter as the acceptance loop:
Run -> slide into cover -> traverse -> aim/fire -> create cover -> grip/reposition -> drop or throw -> exploit the changed firing lane -> reach protection -> recharge from retained battery -> release -> resume combat.

Test individual links before the whole encounter. Include movement while carrying, interrupted cover creation, contact with moving cover, changed direction, neutral stick, early/full charge release, hits, depletion, expiry and repeated use. Audit which combinations currently work, conflict, or are unsupported. Record explicit start/hold/cancel/resume rules before patching; do not silently add new simultaneous abilities.

Use the existing lab, static cover, created/movable cover and sparring tools. Do not redesign the arena or app. Correct reproduced blockers in small patches, with connecting art built alongside the corrected handoffs.

## 3. Reference DNA — apply principles to this engine

GEARS OF WAR: grounded commitment, cover approaches and readable action transitions remain the foundation. Its developer research on inertialization is a reference for preserving continuity efficiently; do not transplant skeletal algorithms into sprite code or fake continuity with doubled translucent characters. Controls respond immediately; short authored connectors and stable anchors explain the action.

VANQUISH: study offensive mobility and precision during maneuvers. Movement should create firing opportunities, not merely increase travel speed. Preserve existing slide and slow-time controls. Future powered arcs must have deliberate steering, braking and exits; do not copy its overheating lockouts or impose a forced recharge wait.

CONTROL: treat environmental matter as both protection and offense. A created cover object should have a coherent life through creation, collision, grip, movement, drop, throw and its existing expiry/reversion rules. Its visible placement, firing obstruction and authoritative multiplayer state must agree. Improve the existing powers rather than adding Control's ability inventory.

GUILTY GEAR XRD: study preservation of drawn character and deliberate visual choices. Use readable silhouettes, authored key poses and expressive timing while input, movement and collision remain responsive. This is an animation principle, not authorization to replace our engine or imitate its character designs.

Research starting points:
- Gears animation transitions: https://www.gdcvault.com/play/1025165/Inertialization
- Vanquish developer combat overview: https://www.platinumgames.com/official-blog/article/9334
- Control publisher combat overview: https://blog.playstation.com/archive/2019/08/27/5-spoiler-free-gameplay-tips-to-help-you-be-a-telekinetic-badass-in-control-out-today-on-ps4/
- Guilty Gear developer art overview: https://www.arcsystemworks.com/guilty-gear-xrds-art-style-the-x-factor-between-2d-and-3d-talk-from-gdc-2015-is-now-available-online/

These references inspire proposed adaptations; they are not claims that our implementation already matches them.

## 4. Locked visual identity and efficient artwork

Target: Akira-inspired dark 1980s/early-1990s anime and manga, with a strong athletic heroine, detailed mechanical equipment, dark ink contours, controlled cel shading and cyan/magenta energy accents. Preserve approved high-detail Jade as production artwork. Keep the separate future character-design project outside this pass.

Preserve helmet, face, armor, blue battery backpack, pink cape, gloves, boots, proportions, equipment layering, detail and normal combat scale. No mirroring asymmetric equipment, stretching, rotating artwork to invent directions, or redesigning her.

Installed approved charging views at the saved checkpoint: d00, d03, d06. d03 registration and compact dissolve are complete; do not ask to approve them again. Reuse its opening ready pose for final ready; retain recorded source-isolation choices. Audit current coverage first.

Prioritize changes of intention: run/stop -> slide, slide -> cover, cover -> aim/fire, gun -> psychic manipulation, grip -> drop/throw, voluntary action -> charge, charge -> weapon return, and weapon return -> recharge. Audit existing source art and reuse valid poses. Generate only genuinely missing or failed connectors. Prove one approved direction through the complete chain before expanding directions in small audited batches. Show each new sheet or pose batch before installation and obtain visual approval. Do not generate the full 360-degree set at once.

Keep anchors and anatomical scale consistent across adjacent poses. Sustain uses its own loop; entry and peak must not replay inside it. Character art, grounded shadow/collision and energy effects remain separate. Do not delay input while a connector finishes.

Effects explain motion: acceleration streaks, short braking marks, curved wakes for curved travel, concentrated charge energy. Keep Jade, muzzle, cover contact and carried-object path readable. Preserve SKEET/SKURT! and Kinetic Echo. Refine overlapping rings/trails only where the verified encounter shows a readability problem; cap effects and reuse existing systems.

## 5. Protected gameplay

V142 Classic plus already approved adjustments is the base authority; God Mode Weave remains an experiment. Preserve the approved 15% Classic slide-speed increase and presentation changes unless a reproduced regression warrants a targeted correction. Do not remap controls or alter camera/scale as a shortcut.

Charging movement scale stays exactly 0.67145 with existing easing. Hold Y charges; release activates. Fresh Y immediately cancels voluntary actions to recharge from retained battery, including mid powered window. Preserve the held-button suppression at charge entry and the expiry/depletion release-then-fresh-Y requirement. New combat inputs and incoming hits can interrupt; charging remains vulnerable. Preserve corrected weapon return, roughly 12-second current full window, battery behavior and existing psychic/combat abilities.

No invincibility, reload systems, new tiers in this initial pass, broad refactors or unrelated features. Higher-tier progression is the next segment, after the base encounter passes: prototype one profile that increases acceleration, braking and steering with speed. Ordinary 0–100 remains base movement. Settle higher-charge thresholds, retention, costs and duration explicitly before implementing progression.

## 6. Verification and stop gates

Check client/local and host behavior, then multiplayer representation: character motion, facing, cover creation/manipulation, collision, release/throw and energy must agree. Preserve existing multiplayer. Do not infer latency, frame pacing or raw controller input from screen recordings alone.

Run node tests/cover-movement.cjs and npm run build after relevant changes. Add focused regression cases for actual defects and interaction boundaries, not redundant tests. Existing checkpoint passed 1,924 checks; recount rather than claiming this count for a new build.

Deploy each completed approved batch to the same Railway service. Confirm SUCCESS for the exact commit and verify the live action chain before requesting the physical controller playtest. Never report automated tests as physical-controller validation.

Save commits, approval states, verification evidence, pending artwork and the next exact step in the repository handoff. Stop the initial pass when the complete base combat encounter is playable and verified to the available extent; report any remaining physical controller/network checks explicitly. Then present the single higher-tier prototype proposal before implementing its unresolved progression rules.

Work incrementally, conserve credits, use no unnecessary agents, and keep the existing app intact.
