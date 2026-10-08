# Local combat smoothness 40

Continues branch studio/live-app-three-section-01 at a3757d4239d9fabdbdce0f02785d11c592ce3ef2. Live source before this change was pinned to release38, 175147d0181ccc095506838d7b902e6eaa65dbfa. No core combat constants, controls, camera, cover logic or production art changed.

Solo/practice/bot previously posted inputs every33ms and received server snapshots, then used65–140ms presentation buffering. These modes now run the identical lib/game.ts authority on the device at fixed60Hz, independent of30/60/120Hz display sampling. Their input and snapshot requests are bypassed; LOCAL · NO NETWORK identifies this path. This is local simulation after the application/assets load, not an installable offline application. Duel and watch retain their server authority, SSE, interpolation and room restoration.

Hidden local tabs clear held inputs and pause the simulation clock. Long frame stalls have100ms bounded catchup. Local rounds restart on reload; presets and existing watch reports remain browser stored. A filtered skyline is cached once per image, preserving existing art and parallax while removing repeated canvas filtering.

Validation: TypeScript and production build pass. local40 compares the local clock with the unchanged engine at30/60/120Hz and checks queued melee edges, hidden-tab pause, catchup bound, reset, session authentication and mode separation. melee38 passes combat timing/charge/cancellation/attribution. frozen38 passes1800 frames against retrieved exact37 baseline. HTTP38 passes two authenticated clients, SSE visibility of stored charge/B activation and reset on the local production server. These are not real-controller or real-device FPS measurements. The remote browser cannot reach the scratch localhost server; deployed UI verification follows deployment.

Directional art39 remains reference-only as recorded in DIRECTIONAL_COMBAT_39.md. No unregistered sheets were substituted into the playable baseline. Next work remains registered direction poses/turns and measured device render performance; online latency improvements require separate verification.
