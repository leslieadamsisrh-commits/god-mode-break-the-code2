# Browser evidence

All local browser requests were restricted to loopback; 99 unrelated legacy image requests were blocked before dispatch. All 208 Raptor assets returned HTTP 200.

The all-eight directional jump checks use normal keyboard input and Playwright controlled time in 16 ms increments. They record actual canvas drawImage calls, not injected actor or phase state. Every direction painted phases 0–5. This establishes sequencing under controlled time; it is not real-time frame-rate or physical-controller verification. Their exact manifest SHA and timestamps are recorded individually.

After the final registration-only changes, the production build passed again. The bounded right jump-to-slide check rendered jump 0–5 and slide 0–2 using a timed normal double-tap of ShiftLeft. The all-family review rendered every registered frame in all eight directions, with zero pending frames or browser errors. Jump review passed normal and quarter speed. A one-cycle quarter-speed sample initially missed a phase under load; observing two complete cycles passed all phases.

Real-time heavy gameplay in the software headless browser ran approximately 4–16 FPS and skipped short phases. Reducing the CSS viewport did not change the fixed 1400×868 canvas backing resolution. One multi-direction controlled-clock attempt stalled after its first reset; it was interrupted, then replaced with bounded fresh-browser single-direction checks, all of which completed.

Review-player arc is illustrative (400 launch speed, gravity 1000), not the authoritative game physics. Contact-sheet screenshots support visual registration review but do not replace gameplay checks.

Moving-fire repeated jumps were exercised; automatic aim legitimately changed facing. This run predates only the final small ground-scale/recovery-anchor adjustments. Live deployment checks are separate and were not performed when this evidence was saved.
