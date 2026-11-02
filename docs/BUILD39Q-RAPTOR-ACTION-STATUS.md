# Build 39Q — Raptor action presentation

Checkpoint: 5168bd7791ff2bf80952ae79b1e4761660055d19 (verified remote HEAD).
Work branch: studio/build39q-raptor-action-animation.

## Recovery

Recovered the original 39K slide sheet and review-only ZIP. The existing report rejected all 48 crops. Visual review confirms opaque panel backgrounds, embedded effects, tiny character crops, and inconsistent direction labels. These are references only and are not installed.

Replacement art uses the installed 39P identity and directional references. Individual transparent images are generated with the built-in image tool; no new atlas is produced. Production installation and deployment status must be verified before marking complete.

## Slide presentation

Three authored keys per direction: entry (000), low feet-first hold (001), recovery (002). Timing follows authoritative slide remaining/duration. A short visual recovery after slide exit is interrupted by cover, airborne state, damage, or rematch time reset. No gameplay state, input timing, camera, hit detection, or collision changes.

## Cover mapping inspected for the following increment

| Existing state | Authoritative signal | Required Raptor artwork |
| --- | --- | --- |
| Soft capture | coverId, coverMode=soft, contact > time | compress/contact |
| Soft ready | attached, low coverSpeed | low ready |
| Lateral flow/reversal | coverSpeed and coverAnchor tangent | alternating low travel |
| Hard brace | coverMode=braced, not exposed | planted brace |
| Peek/fire | coverAim, fireState, recoil | exposure and recoil |
| Retract | returnToCover | return to protection |
| Exit | cover release, dash/slide, exit | exit transition |
| Psychic gather/carry | gather34, gripId, gripCoverId, arsenal37 | reach and sustained hold |
| Place/throw/recall | existing release/transit events | release and recall gestures |

These mappings describe existing mechanics. They do not imply that cover or psychic sprites have been produced or installed.

## Prompt specification

Identity-preserving individual 512×512 transparent sprite; exact installed directional reference; original olive/tan striped velociraptor, red optic, white/gunmetal armor, original shotgun, backpack and physically connected headset tubes; complete claws and tail; no dreadlocks, new weapons, panel backgrounds, dust, shadows or muzzle effects. Entry uses a dropping squat; hold uses a low seated feet-first baseball slide; recovery uses a rising half-kneel. Ground registration is checked separately from image generation.

## Checks completed during implementation

- Remote 39P HEAD verified before edits; separate recoverable 39Q branch created.
- Presentation tests pass for eight directions, all slide phases, recovery expiry, interruption and rematch reset.
- An actual shared-engine double-tap slide traverses all three visual phases; presentation leaves the authoritative player unchanged.
- `lib/game.ts` remains byte-identical to the verified 39P local build.

Presentation corrections: elevated standing surfaces use authoritative grounded/vz state rather than treating all positive elevation as airborne. Jade-only body afterimages are suppressed for Raptor; existing ground streaks and effects remain separate.

Input correction found by browser testing: keyboard aliases previously assigned action state repeatedly, so unpressed Right Shift erased Left Shift and keyboard mapping erased touch slide/jump. The aggregator now ORs existing touch edges and keyboard aliases. Both Shift keys and touch slide/jump have regression coverage. This preserves controls and does not modify authoritative movement.

## Installed inventory

- Idle: 1 pose × 8 directions (39P retained).
- Run: 2 poses × 8 directions (39P retained).
- Slide: entry, low hold, recovery × 8 directions (24 new individual RGBA PNGs).
- Total: 48 unique, transparent 512×512 PNGs with manifest hashes and ground anchors.
- Walk still borrows Run; Jump/Landing, Shotgun, Damage and cover/psychic presentation remain provisional fallbacks.

Known visual limitations: three authored slide keys still produce coarse transitions; minor equipment/proportion drift remains between generated poses; shotgun muzzle alignment is unchanged and needs its own presentation pass. Cover states are mapped above but no new cover/psychic images are installed.

Validation: production build, 48-file asset gate, renderer preload/direction checks, real-engine slide phases, keyboard/touch edge aggregation, Build 27B jump/elevation integration, Build 27G bullet time/combat, and Build 37 cover arsenal tests pass. Browser and deployment results are recorded after release verification.

Local production-browser slide test: all 24 exact slide PNG paths were observed in canvas draw calls during real keyboard double-tap movement across eight directions. Zero page errors, failed requests or ART PENDING draws in the final run. Straight-back testing moved sideways away from spawn cover first; approaching the original cover correctly interrupted the slide. Earlier failures exposed and led to the input alias fix; a tainted-canvas export error was confined to the test capture code and removed.

Both fighters passed the local production-browser smoke sequence (movement, jump, slide, firing, shield, bullet time, build/place, grip, melee) without page errors, failed requests or ART PENDING. These browser checks establish input/render continuity; the simulation suites establish action behavior. A paused browser screenshot confirms the actual low feet-first pose with engine effects separate. Physical controller, iPad and live multiplayer were not re-tested.

CI correction: the first GitHub run passed the 48-sprite gate but failed npm ci because the repository lacked package-lock.json. The follow-up adds the lockfile used by the verified local build; npm ci dry-run accepts it.
