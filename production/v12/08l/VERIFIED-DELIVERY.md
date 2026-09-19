# V12 08L — Private mixed-art duel: implementation and evidence

## Delivered scope

Built a two-player authoritative match prototype around the exact 08K movement/stance modules. This is a new client/server application with private rooms, not another offline pose slideshow and not a verified Internet-hosted duel. No original approved runtime file was overwritten.

Implemented: host access key, private room creation, one guest invite/seat, separate player inputs, authoritative movement/cover/shot/health state, server-side slide retrigger guard, round lengths 120/180/300 seconds, round end/winner/score, two-party rematch, authenticated state stream, membership-protected images, disconnect pause and same-session rejoin. Invalid inputs cannot set position or health. Broken asset loads remain visible errors.

## Slide and protected design

One legal slide retains K's start velocity 650, duration .70 and decay .12. Ground slide requests while sliding or in kick follow-through are rejected without resetting duration/velocity. Server input edges require release/press; no replay backlog. Cover kicks and wrap cancellation remain contextual actions. No extra long cooldown added. This is an authoritative eligibility correction, not a redesign of the slide's local motion equations.

All 115 images match their recorded 08K hashes/dimensions. Ten vendor files match the exact baseline package. Zero new drawings, no recoloring or mirroring, and no added anatomy. The three final-design poses support only the existing right-hand cover view. Recovered art covers locomotion/other headings. All original art limitations remain: missing authored shoulder/recoil/retract and 360 final-design frames, provisional contact/muzzle alignment, source fringe and abrupt coverage changes. Cover/effects are independent.

Player identity is communicated through names, health UI and ground rings; Jade's skins were not redesigned. Camera framing is adapted for two players but source scale is unchanged. The K code is reusable within compatible browser/Node contexts; it is not an automatically portable binary for every game engine.

## Verification completed

Five automated processes were launched concurrently: slide, match, network, asset identity, syntax. They are test lanes, not five autonomous AI agents.

- Nine slide/input unit tests passed.
- Nine match/input unit tests passed.
- One real local HTTP/SSE network scenario passed 25 explicit checks. Two independent Node clients used separate sessions, joined the same room, moved separately, exchanged authoritative fire/damage, agreed on a winner, voted into round two, and rejoined after disconnect. Membership, bad invites, a third seat, malformed authority fields, off-origin mutation, and cross-room stream access were tested. In the completed run 54 matching round/tick snapshots agreed; 64 host and 54 guest snapshots were collected. Counts are evidence of this run, not a network performance benchmark.
- 115 image integrity/dimension/RGBA checks and ten exact vendor-file checks passed.
- Sixteen browser-content/input checks passed in Chromium 144.0.7559.96: two renderer contexts/slots, two visible actors, actual keyboard/mouse controls, synthetic controller input, focus-neutral handling, fallback after Gamepad API denial, final Jade K03 fixture, server-recorded health display, and 96 heading requests with no missing image draw observed. No browser JavaScript errors were observed.

### Crucial verification boundary

Browser file/localhost navigation was blocked by the environment's administrator policy. It was not bypassed. The exact browser source ran through Playwright set_content with MOCKED fetch/EventSource/sessionStorage. The real network tests used Node HTTP/SSE clients instead. Therefore native browser-to-server joining, actual Xbox hardware, two physical computers, LAN/WAN latency, TLS deployment, mobile compatibility and Internet performance remain UNVERIFIED. No complete end-to-end human duel is claimed.

The UI/server compatibility should be exercised on real browsers next. No prediction, interpolation or lag compensation is implemented; remote responsiveness is not established by loopback state agreement. Existing movement/weapon equations were reused, but new two-player orchestration, health and session rules are experimental and not declared full-game parity.

## Screenshot and video interpretation

Preview PNG: actual browser renderer capture of a controlled final-Jade/second-player fixture. Transport was mocked. Explicit documentary labels distinguish it from live online play.

Replay MP4: four seconds at 15 fps, 60 actual browser screenshots displaying states recorded from the real Node-client network scenario. It is a server-state replay, not native browser networking, new animation, a human controller playthrough or a real-time benchmark. A title strip labels this boundary throughout. Test labels such as Les/Brother identify test seats and are not evidence the real user or brother participated.

## Architecture and privacy

Standard Node server only; no npm dependencies. 60 Hz fixed authoritative updates and approximately 30 Hz authenticated SSE snapshots with JSON input POST. Host access key, HttpOnly SameSite cookies, invite-protected second seat, room membership, bounded input rate/body size, anti-CSRF headers/origin checks, leased active connections, protected assets, TTLs and backpressure limits are implemented. This is not a formal security audit or ranked anti-cheat guarantee.

Default bind is loopback. A separate explicitly named launcher enables trusted-home-network binding. No public port forwarding, tunnel or cloud deployment was started. Hosted use needs HTTPS, exact configured origin, Secure cookies, a fresh secret and one persistent instance. Room/session state is in memory and disappears on restart. Match pauses on an observed stream disconnect, then resumes after the same sessions reconnect; stale input is neutralized after 500 ms.

## Storage and next gate

Base: v12-08k-stance-registration / 08ee11ad0132b9c25d469d08beb83fc209836df1. New experimental branch: v12-08l-private-mixed-art-duel. The original K package remains recoverable. GitHub contains selected core/server source plus the package recovery contract and this report; full application/images/tests are delivered together in the ZIP and backed up to Library on confirmed upload. Do not describe source-only commits as a complete deployed runtime.

Next gate: run native browsers against the server, then two actual computers through a private HTTPS service or a trusted-network test. Check movement feel, shots and health agreement, slide spam rejection, round/rematch and reconnect. A connected hosting service is still needed for different-home access. The available Vercel connector returned no teams; no deployment access or live URL was established. Railway was discovered as an available but not installed hosting connector, not a running service.

Final art production can continue against these same simulation events without waiting for all networking polish. No completed HD library or calendar completion estimate is claimed. The next art work is still genuinely authored shoulder/stock lift, recoil/retraction, then neighboring views and locomotion replacement.
