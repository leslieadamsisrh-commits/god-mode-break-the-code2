"""Restore the verified 08M complete package into a new directory.
No downloads, deployment or source overwrite. Use the ZIP saved in Library.
"""
from pathlib import Path
import argparse,hashlib,json,zipfile
PACKAGE_SHA='859c8af3c17837bf2069a3aefedcad9158e1a985a76b6acef15fc8f157f76068'
PREFIX='JADE_V12_08M_Couch_Art_Lab/'
def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('package',type=Path);p.add_argument('destination',type=Path);a=p.parse_args()
 if hashlib.sha256(a.package.read_bytes()).hexdigest()!=PACKAGE_SHA:raise SystemExit('Package fingerprint mismatch')
 out=a.destination.resolve()
 if out.exists():raise SystemExit('Choose a new destination; existing work is never overwritten')
 with zipfile.ZipFile(a.package) as z:
  if z.testzip() is not None:raise SystemExit('ZIP integrity failed')
  pending=[]
  for item in z.infolist():
   if not item.filename.startswith(PREFIX):raise SystemExit('Unexpected package root')
   target=(out/item.filename[len(PREFIX):]).resolve()
   if not target.is_relative_to(out):raise SystemExit('Unsafe path')
   if not item.is_dir():pending.append((target,z.read(item)))
  manifest=json.loads(z.read(PREFIX+'PACKAGE-FILES.json'))['files']
  for target,raw in pending:
   name=str(target.relative_to(out))
   if name in manifest and hashlib.sha256(raw).hexdigest()!=manifest[name]['sha256']:raise SystemExit('File fingerprint mismatch: '+name)
 out.mkdir(parents=True)
 for target,raw in pending:target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(raw)
 print('Restored complete offline local duel. Open JADE_V12_08M_Couch_Art_Lab.html. No server is required.')
if __name__=='__main__':main()
