"""Restore verified artwork archives after cloning the development checkpoint."""
from pathlib import Path
import hashlib, io, json, tarfile
root=Path(__file__).resolve().parents[1]

def restore(name):
    manifest=json.loads((root/'backups'/name/'manifest.json').read_text())
    parts=[]
    for part in manifest['parts']:
        data=(root/part['path']).read_bytes()
        if hashlib.sha256(data).hexdigest()!=part['sha256']: raise SystemExit('Damaged archive part: '+part['path'])
        parts.append(data)
    data=b''.join(parts)
    if hashlib.sha256(data).hexdigest()!=manifest['archiveSha256']: raise SystemExit('Archive checksum mismatch')
    with tarfile.open(fileobj=io.BytesIO(data),mode='r:gz') as archive:
        expected={f['path'] for f in manifest['files']}
        for member in archive.getmembers():
            target=(root/member.name).resolve()
            if member.name not in expected or not member.isfile() or root not in target.parents: raise SystemExit('Unexpected archive entry')
            target.parent.mkdir(parents=True,exist_ok=True)
            target.write_bytes(archive.extractfile(member).read())
    for f in manifest['files']:
        if hashlib.sha256((root/f['path']).read_bytes()).hexdigest()!=f['sha256']: raise SystemExit('Artwork checksum mismatch: '+f['path'])
    print('Restored and verified',len(manifest['files']),'files from',name)

compact = root / 'backups/current/sprite-source-assets.tar.gz'
if compact.exists():
    import subprocess, sys
    subprocess.run([sys.executable, str(root/'tools/compact-backup.py'), 'restore-art'], check=True)
elif (root/'backups/shotgun-next-assets/manifest.json').exists():
    restore('shotgun-next-assets')
else:
    # A normal archive extraction already contains these assets.
    import subprocess
    subprocess.run(['node', str(root/'tools/verify-recovery.mjs')], cwd=root, check=True)
print('Runtime streaming caches are intentionally excluded from backups.')
print('For the saved streaming experiment: python tools/prepare-streaming-atlases.py (requires Pillow).')
