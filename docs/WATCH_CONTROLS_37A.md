# Watch controls37A

Release37's interactive spectator/Fight Memory controls inherited .fightScore, which is intentionally clipped to1px for the accessible duplicate of the canvas score. This hid the controls from sighted users.

Move only the interactive Watch controls to a dedicated .watchControls footer below the canvas. Watch mode uses an automatic footer grid row; the opened Fight Memory drawer is bounded and scrollable. Private1v1 and practice keep their existing controller footer and gameplay. Label the action RECORD 10 ROUNDS. No engine, controller mapping, memory/report, asset or network changes.

Production build and type validation pass. Actual React markup rendering confirms the separate visible class, Fight Memory summary and Record 10 Rounds button. Browser viewport verification could not run: Chromium is unavailable and its download failed. Real-device layout remains a playtest check.
