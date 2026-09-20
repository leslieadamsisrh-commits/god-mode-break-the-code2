# JADE LV01 — B05–B09 FAST-TRACK ROUGH PLAYABLE CHECKPOINT

Design authority SHA-256:
`39375b8abfd668b750cc041c5cd78db474f359f43428bd9a585396e62b579854`

## Status
ROUGH PLAYABLE CHECKPOINT COMPLETE.

### B05-FI — Cover Entry
PASS.
Uses accepted CE05 -> CE03 -> CE08.
No timing changes.

### B06 — Attached Idle / Shimmy
PASS WITH ART PLACEHOLDER.
- B06-B Shimmy Left is newly authored and accepted.
- B06-C Right Shimmy temporarily reuses B06-B.
- Idle / stop settle reuses CE08.

### B07 — Corner Peek
PASS WITH PLACEHOLDERS.
- Left edge uses existing recovered PEEK role.
- Right supported station corner uses existing legacy K01 route.
- Current-master final peek art remains pending.

### B08 — Aim / Fire / Recoil
PASS WITH LEGACY PLACEHOLDERS.
Existing supported-cover K01 -> K02/K03 -> K03 -> K01 sequence is playable.
One authoritative shot per fire input verified.
Muzzle flash remains a separate runtime effect.

### B09 — Cover Exit / Disengage
PASS WITH RECOVERED PLACEHOLDERS.
Authoritative cover detach/kick transitions back into recovered RUN and READY.

## Verification
- B05 selector assertions: 6 passed
- B06 selector assertions: 6 passed
- B07 browser checks: 6 passed
- B08 browser checks: 8 passed
- B09 browser checks: 8 passed
- Browser: Chromium 144.0.7559.96
- External requests: 0
- Browser exceptions: 0 in final stage tests
- Gameplay tuning changed: NO
- Original 08N baseline overwritten: NO
- Deployment: NO

## Latest standalone
SHA-256:
`20c68784ce771e95fc61eccb5632f8a4e9a86afd5269caf716f4f3dbad562db1`

## Latest full package
SHA-256:
`4cc94cee752996cf47a8b639a57bc43990b7fb7277c07939f909234a7b6f697f`

## Deliberate polish queue
- true B06-C right shimmy
- current-master B07 left/right peek keys
- current-master B08 aim/fire/recoil keys
- current-master B09 cover-exit keys
- full direction expansion after rough playtesting validates the state flow

This checkpoint is intentionally playable-first. Placeholder art is explicitly labeled and is not promoted as final master-authority art.
