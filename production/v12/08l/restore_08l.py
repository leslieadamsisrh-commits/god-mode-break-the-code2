"""Restore the exact complete 08L application from its verified delivery ZIP.

The repository's selected source files are not a complete running game on their
own. Retrieve JADE_V12_08L_Private_Duel.zip from the recorded Library receipt,
then run this script with the archive and a NEW output directory. No networking,
deployment, dependency installation or program execution occurs here.
"""
from pathlib import Path, PurePosixPath
import argparse
import hashlib
import json
import stat
import zipfile

EXPECTED = "872f2dd976e3fdc96f288dd49139afbb859657c676541eeefc36b736088aeea4"
PREFIX = "JADE_V12_08L_Private_Duel/"


def restore(archive: Path, output: Path) -> int:
    if output.exists():
        raise ValueError("Choose a new output folder; existing work is never overwritten")
    if hashlib.sha256(archive.read_bytes()).hexdigest() != EXPECTED:
        raise ValueError("Wrong or altered package: SHA-256 mismatch")
    staged = {}
    with zipfile.ZipFile(archive) as source:
        entries = source.infolist()
        if sum(item.file_size for item in entries) > 256 * 1024 * 1024:
            raise ValueError("Unexpected expanded size")
        for item in entries:
            if item.is_dir() or not item.filename.startswith(PREFIX):
                raise ValueError("Unexpected archive entry")
            name = item.filename[len(PREFIX):]
            rel = PurePosixPath(name)
            if not name or rel.is_absolute() or ".." in rel.parts or "\\" in name:
                raise ValueError("Unsafe path")
            if stat.S_ISLNK(item.external_attr >> 16) or name in staged:
                raise ValueError("Unexpected link or duplicate entry")
            staged[name] = source.read(item)
        manifest = json.loads(staged["PACKAGE-FILES.json"])
        if manifest["build"] != "V12-08L":
            raise ValueError("Wrong build")
        if set(staged) != set(manifest["files"]) | {"PACKAGE-FILES.json"}:
            raise ValueError("File inventory mismatch")
        for name, record in manifest["files"].items():
            raw = staged[name]
            if len(raw) != record["bytes"] or hashlib.sha256(raw).hexdigest() != record["sha256"]:
                raise ValueError("File integrity mismatch: " + name)
    output.mkdir(parents=True)
    for name, raw in staged.items():
        target = output.joinpath(*PurePosixPath(name).parts)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(raw)
    return len(staged)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("archive", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    count = restore(args.archive, args.output)
    print(f"Verified and restored {count} files. Read README.md for local startup.")
