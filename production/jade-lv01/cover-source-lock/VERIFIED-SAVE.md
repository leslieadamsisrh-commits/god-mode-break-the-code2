# Jade LV01 — final-design reaffirmation and reference preservation

The user reaffirmed that all final sprites must retain the exact approved design. The canonical attachment was verified again by SHA-256: 39375b8abfd668b750cc041c5cd78db474f359f43428bd9a585396e62b579854. It is unchanged. The master lock update is commit 3bf3bcef92039e37ea92d48a0544f747bdc48441. A repeatable continuation instruction is committed at production/jade-lv01/CONTINUE-LOCKED-JADE.md (fb0a2f8e0951768fed103aa5a29ba2d4341c0fdc).

## Actual work this pass
Preserved three exact source images: the canonical master, the latest cover-entry reference and the latest cover-mechanics reference. Unique filenames distinguish the newer cover-mechanics board from an older idle/ready board that reused its filename. The source verifier ran successfully against all three originals and copied files. No image was repainted, scaled or deleted.

The two cover sheets are RGB images with zero transparent pixels. The cover-mechanics poses omit walls in their main rows, but the sheet still contains backgrounds, text and firing effects. The cover-entry sheet composites character and cover. Neither demonstrates separately exported runtime character/cover assets. The generated text ASSET SEPARATION VERIFIED or GAME IMPLEMENTATION READY is not a technical approval. These files are reference sources only.

SOURCE-INTAKE.json and verify_sources.py record and check file identities. They are not animation or gameplay code. The next unfinished asset is LV01-B05-C01, a large character-only compression/low-settle key, followed by contact and attached-ready poses. No new drawing or transparent export is claimed completed in this pass.

## Confirmed Library backups
Directory: /GOD MODE/Jade LV01 Lavender Visor/Cover Source Lock/
- JADE_MASTER_39375b8a.png: upload succeeded; libfile_5b867eb0d6fc8191bc148493f57c91e3.
- COVER_ENTRY_REFERENCE_63905956.png: upload succeeded; libfile_408c85badfc08191b00bd4eae9af3880.
- COVER_MECHANICS_REFERENCE_a7705f72.png: upload succeeded; libfile_f9584b44935c8191a822acd5a0064538.
- JADE_LV01_Cover_Source_Lock.zip: upload succeeded; libfile_022cb4ef08988191a73874501fa59415. 9 files; 8,888,262 bytes; SHA-256 6a0a8ee7fc733f4f0cfb77c057de085f9f19e6002ade7da98d7806ea8cd9b0e0; ZIP integrity passed.
- CONTINUE-LOCKED-JADE.md: upload succeeded; libfile_1aaa9f75fd6c81919d90de0b620ef4c4.
- SOURCE-INTAKE.json: upload succeeded; libfile_deba0847fb14819183887252ae528f07.

GitHub contains the master update, prompt, intake metadata, verification code and this receipt. The exact PNG bytes are in the verified package and Library; this is not a claim that new image binaries were installed into the GitHub runtime. 08N remains the local art/combat baseline and 08L the separate network prototype. No gameplay, previous sprite asset or deployment configuration was changed. No Vercel release, autonomous agent execution or ongoing background production was started. Future reviews must compare actual candidates with this reference rather than assuming a written prompt guarantees identity.
