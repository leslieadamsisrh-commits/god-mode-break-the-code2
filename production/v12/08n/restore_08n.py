"""Restore the exact delivered 08N package into a NEW directory.
Usage: python restore_08n.py JADE_V12_08N_Art_First.zip new_directory
No network calls or installation; does not edit the original project.
"""
from pathlib import Path
import argparse, hashlib, json, zipfile
EXPECTED = '7cf499e151a3bd33d997193c7906e9d3bb3061b2249235be5e1b8acbfe5be0ca'
PREFIX = 'JADE_V12_08N_Art_First/'
def sha(raw):
    return hashlib.sha256(raw).hexdigest()
def restore(archive, output):
    if output.exists():
        raise ValueError('Choose a new output directory; existing files are not overwritten')
    if sha(archive.read_bytes()) != EXPECTED:
        raise ValueError('Package fingerprint mismatch')
    staged = {}
    with zipfile.ZipFile(archive) as z:
        if z.testzip() is not None:
            raise ValueError('ZIP integrity failure')
        for info in z.infolist():
            if info.is_dir():
                continue
            if not info.filename.startswith(PREFIX):
                raise ValueError('Unexpected package root')
            relative = info.filename[len(PREFIX):]
            target = (output / relative).resolve()
            if not target.is_relative_to(output.resolve()):
                raise ValueError('Unsafe archive path')
            staged[relative] = z.read(info)
    manifest = json.loads(staged['PACKAGE-FILES.json'])
    if set(staged) != set(manifest) | {'PACKAGE-FILES.json'}:
        raise ValueError('File inventory mismatch')
    for name, digest in manifest.items():
        if sha(staged[name]) != digest:
            raise ValueError('File fingerprint mismatch: ' + name)
    output.mkdir(parents=True)
    for name, raw in staged.items():
        target = output / name
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(raw)
    print('Restored', len(staged), 'verified files. New animation artwork is on quality hold.')
if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('archive', type=Path)
    parser.add_argument('output', type=Path)
    args = parser.parse_args()
    restore(args.archive, args.output)
