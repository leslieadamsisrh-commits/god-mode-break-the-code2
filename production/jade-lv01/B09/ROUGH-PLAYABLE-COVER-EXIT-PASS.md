# JADE LV01 B09 — ROUGH PLAYABLE COVER EXIT PASS

Fast-track status: PASS WITH RECOVERED PLACEHOLDERS.

Rough mapping:
- B09-A Attached Exit Prep -> B06A / accepted CE08
- B09-B Push-Off / Release -> existing recovered cover KICK role
- B09-C Exit Step -> existing recovered KICK transition
- B09-D Reopen to Run -> existing recovered RUN family
- B09-E Open Locomotion Recovery -> existing recovered READY family

Verification:
- Browser checks: 8 passed
- Attached exit prep confirmed
- Authoritative slide-from-cover detach triggers kick
- Cover-kick presentation confirmed
- Open run resumes after kick
- Neutral input settles to ready
- Movement tuning unchanged: speed 262, slideDuration .70
- No browser exceptions
- No external requests
- No baseline overwrite
- No deployment

Standalone SHA-256:
`20c68784ce771e95fc61eccb5632f8a4e9a86afd5269caf716f4f3dbad562db1`

Polish queue:
- current-master cover-exit keys
- dedicated push-off key
- dedicated exit-step key
- directional exit variants
