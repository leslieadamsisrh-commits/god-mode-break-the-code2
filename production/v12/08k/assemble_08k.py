"""Rebuild 08K from the exact unpacked 08J package into a new directory.

Requires integration-edits.json, stance-registration.js, stance-landmarks.json.
Never overwrites a baseline or deploys anything. Old test evidence is discarded.
"""
from pathlib import Path
import argparse,hashlib,json,shutil
HERE=Path(__file__).resolve().parent
sha=lambda raw:hashlib.sha256(raw).hexdigest()
def safe(root,name):
 p=(root/name).resolve()
 if not p.is_relative_to(root.resolve()):raise ValueError('Unsafe relative path')
 return p

def build(base,out):
 base=base.resolve();out=out.resolve()
 if out.exists() or out.is_relative_to(base):raise ValueError('Choose new output outside baseline')
 edits=json.loads((HERE/'integration-edits.json').read_text());staged={}
 for name,rule in edits.items():
  raw=safe(base,name).read_bytes()
  if sha(raw)!=rule['beforeSha256']:raise ValueError('Baseline mismatch: '+name)
  text=raw.decode('utf-8')
  for replace in rule['replacements']:
   if text.count(replace['before'])!=1:raise ValueError('Ambiguous replacement: '+name)
   text=text.replace(replace['before'],replace['after'],1)
  if sha(text.encode())!=rule['afterSha256']:raise ValueError('Reconstruction mismatch: '+name)
  staged[name]=text.encode()
 marks=json.loads((HERE/'stance-landmarks.json').read_text())
 for record in marks['poses'].values():
  if sha(safe(base,record['file']).read_bytes())!=record['sha256']:raise ValueError('Source art mismatch')
 shutil.copytree(base,out)
 for name,raw in staged.items():safe(out,name).write_bytes(raw)
 for name in ['stance-registration.js','stance-landmarks.json','integration-edits.json','assemble_08k.py']:
  shutil.copyfile(HERE/name,out/name)
 for name in ['README.md','VERIFIED-DELIVERY.md','SHA256SUMS.json']:
  path=out/name
  if path.exists():path.unlink()
 for path in (out/'tests').glob('*results.json'):path.unlink()
 shutil.rmtree(out/'evidence',ignore_errors=True);(out/'evidence').mkdir()
 print('Rebuilt 08K code and unchanged images. Run tools/build_standalone.py. Re-run tests.')
if __name__=='__main__':
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--base',type=Path,required=True);p.add_argument('--out',type=Path,required=True);a=p.parse_args();build(a.base,a.out)
