"""Make ordinary, reproducible gzip tar backups, without encoding binary data.

Code and selected art are separate. Generated caches, previous archives,
duplicate proofs, and rejected studies stay out. Old commits retain history.
"""
from pathlib import Path
import argparse
import gzip
import hashlib
import io
import json
import os
import subprocess
import tarfile
import tempfile

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'backups/current'
EXTRA_ART = [
    'art-production/charge/charge-d03-6frames-blue-key-source.png',
    'art-production/dash/upright-dash-front-right-v3-blue-key-source.png',
    'experiments/shotgun-powered-duel/art-next/charge-d03-6frames.png',
    'experiments/shotgun-powered-duel/art-next/dash-d03-6frames.png',
]

def digest(data):
    return hashlib.sha256(data).hexdigest()

def tracked():
    data = subprocess.check_output(['git', 'ls-files', '-z'], cwd=ROOT)
    return [p.decode() for p in data.split(b'\0') if p]

def excluded(path):
    parts = Path(path).parts
    return (any(p in {'.git', 'node_modules', '.sites-runtime', '__pycache__', 'test-output'} for p in parts)
            or path.startswith(('backups/current/', 'backups/shotgun-next-assets/', 'backups/shotgun-streaming-assets/'))
            or path.endswith(('.log', '.pyc', '.tar.gz', '.zip'))
            or '/art-streaming/' in path and path.endswith('.webp'))

def art_paths():
    # CHECKSUMS is the recovered component's immutable dependency inventory.
    lines = (ROOT/'recovery/shotgun-lab-v57/CHECKSUMS.sha256').read_text().splitlines()
    result = set(EXTRA_ART)
    for line in lines:
        if not line.strip():
            continue
        expected, relative = line.split(maxsplit=1)
        relative = relative.lstrip('*').removeprefix('recovered-shotgun-v57/')
        path = ROOT/'recovery/shotgun-lab-v57'/relative
        if relative.startswith('assets/') and path.suffix.lower() in {'.png', '.webp'}:
            if not path.is_file() or digest(path.read_bytes()) != expected:
                raise SystemExit('Missing or changed approved asset: '+str(path))
            result.add(path.relative_to(ROOT).as_posix())
    if len(result) != 123:
        raise SystemExit('Expected 119 recovered images plus four retained art sources/runtime studies')
    cover_manifest=ROOT/'sprites/manifests/batch-03-cover-contact.json'
    if cover_manifest.exists():
        for family in json.loads(cover_manifest.read_text())['families']:
            for key,revision in [('sourcePath','sourceRevision'),('path','revision')]:
                relative=family[key]
                if not relative.startswith('sprites/') or '..' in Path(relative).parts:
                    raise SystemExit('Invalid review asset path')
                if digest((ROOT/relative).read_bytes())!=family[revision]:
                    raise SystemExit('Cover image changed: '+relative)
                result.add(relative)
    return sorted(result)

def record(path):
    source = ROOT/path
    if source.is_symlink():
        link = os.readlink(source)
        if not source.resolve().is_relative_to(ROOT):
            raise SystemExit('External symlink refused: '+path)
        return {'path': path, 'type': 'symlink', 'target': link}
    data = source.read_bytes()
    return {'path': path, 'type': 'file', 'bytes': len(data), 'sha256': digest(data)}

def write_archive(name, paths):
    target = OUT/name
    entries = [record(p) for p in paths]
    with target.open('wb') as raw:
        with gzip.GzipFile(filename='', mode='wb', fileobj=raw, mtime=0, compresslevel=6) as gz:
            with tarfile.open(fileobj=gz, mode='w', format=tarfile.PAX_FORMAT) as tar:
                for entry in entries:
                    member = tarfile.TarInfo(entry['path'])
                    member.uid = member.gid = member.mtime = 0
                    member.uname = member.gname = ''
                    if entry['type'] == 'symlink':
                        member.type = tarfile.SYMTYPE
                        member.linkname = entry['target']
                        member.mode = 0o777
                        tar.addfile(member)
                    else:
                        data = (ROOT/entry['path']).read_bytes()
                        member.size = len(data)
                        member.mode = 0o755 if os.access(ROOT/entry['path'], os.X_OK) else 0o644
                        tar.addfile(member, io.BytesIO(data))
    return {'path': str(target.relative_to(ROOT)), 'bytes': target.stat().st_size,
            'sha256': digest(target.read_bytes()), 'entries': entries}

def verify_archive(archive, destination=None):
    path = ROOT/archive['path']
    if digest(path.read_bytes()) != archive['sha256']:
        raise SystemExit('Archive checksum mismatch: '+str(path))
    expected = {e['path']: e for e in archive['entries']}
    seen = set()
    with tarfile.open(path, 'r:gz') as tar:
        for member in tar:
            if member.name not in expected or member.name in seen or excluded(member.name):
                raise SystemExit('Unexpected or duplicate entry: '+member.name)
            seen.add(member.name)
            e = expected[member.name]
            relative = Path(member.name)
            if relative.is_absolute() or '..' in relative.parts:
                raise SystemExit('Unsafe archive path')
            if e['type'] == 'symlink':
                if not member.issym() or member.linkname != e['target']:
                    raise SystemExit('Symlink differs')
                if destination is not None:
                    target = destination/member.name
                    if not (target.parent/member.linkname).resolve().is_relative_to(destination.resolve()):
                        raise SystemExit('Unsafe symlink')
                    target.parent.mkdir(parents=True, exist_ok=True)
                    target.symlink_to(member.linkname)
            else:
                if not member.isfile():
                    raise SystemExit('Expected regular file')
                data = tar.extractfile(member).read()
                if len(data) != e['bytes'] or digest(data) != e['sha256']:
                    raise SystemExit('Entry checksum mismatch: '+member.name)
                if destination is not None:
                    target = destination/member.name
                    if not target.resolve().is_relative_to(destination.resolve()):
                        raise SystemExit('Unsafe extraction path')
                    target.parent.mkdir(parents=True, exist_ok=True)
                    target.write_bytes(data)
                    target.chmod(member.mode)
    if seen != set(expected):
        raise SystemExit('Missing archive entries')

def build():
    OUT.mkdir(parents=True, exist_ok=True)
    images = art_paths()
    # Repeated proof sheets / extracted intermediates are reproducible from
    # the two retained blue-key masters and prepare-provisional-art.py.
    code = sorted(p for p in tracked() if not excluded(p) and p not in images
                  and not p.lower().endswith(('.png', '.webp', '.jpg', '.jpeg')))
    archives = [write_archive('completed-code.tar.gz', code),
                write_archive('sprite-source-assets.tar.gz', images)]
    result = {'schemaVersion': 1, 'format': 'ordinary gzip-compressed tar; no Base64',
              'sourceCommit': subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip(),
              'archives': archives,
              'excluded': ['generated 125px streaming caches', 'dependencies', 'previous backup archives',
                           'rejected source attempts', 'duplicate proof sheets', 'reproducible extracted masters'],
              'restore': 'Extract both tar.gz files into the same directory. Run npm run verify and npm test. Generate streaming caches only for the saved experiment.'}
    (OUT/'MANIFEST.json').write_text(json.dumps(result, indent=2)+'\n')
    verify(result)
    print(json.dumps({'sourceCommit': result['sourceCommit'], 'archives': [
        {k: a[k] for k in ('path','bytes','sha256')} | {'entries':len(a['entries'])} for a in archives]}))

def verify(result):
    with tempfile.TemporaryDirectory(prefix='god-mode-backup-check-') as directory:
        dest = Path(directory)
        for archive in result['archives']:
            verify_archive(archive, dest)
        subprocess.run(['node', 'tools/verify-recovery.mjs'], cwd=dest, check=True)
        subprocess.run(['npm', 'test'], cwd=dest, check=True)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('action', choices=['build','verify','restore-art'])
    args = parser.parse_args()
    if args.action == 'build':
        build()
    else:
        result = json.loads((OUT/'MANIFEST.json').read_text())
        if args.action == 'verify':
            verify(result)
        else:
            archive = next(a for a in result['archives'] if a['path'].endswith('/sprite-source-assets.tar.gz'))
            verify_archive(archive, ROOT)
            print('Restored and verified', len(archive['entries']), 'selected source/runtime art files')
