# Recovery additions

All 120 saved runtime assets and the 17 checksummed source dependencies match the recovery checksum list. The original GitHub textual source was restored at its recorded Git blob hashes.

Two missing dependencies were reconstructed to make the isolated comparison run:

- `lab-pose-data.js` is generated from the original asset manifest plus **new** reviewed muzzle measurements. It is not the missing original module. Unknown sockets remain null.
- `movement-lab.css` restores the shared layout missing from the save; it is newly authored CSS.

The complete original Site, energy/shield rules and production multiplayer backend have not been recovered. Do not treat this folder as a complete production checkout. See `docs/SHOTGUN-NEXT-CHECKPOINT.md` at the repository root.
