"""Rebuild 08J from the exact unpacked 08I package into a new folder.
No network, image transformation, original-file mutation or deployment.
Requires asset-residency.js and source-edits.json beside this script.
"""
from pathlib import Path
import argparse, hashlib, json, shutil
HERE=Path(__file__).resolve().parent

def digest(raw):return hashlib.sha256(raw).hexdigest()
def blob(raw):return hashlib.sha1(('blob '+str(len(raw))+'\0').encode()+raw).hexdigest()
def inside(root,name):
 target=(root/name).resolve()
 if not target.is_relative_to(root.resolve()):raise ValueError('Unsafe relative path')
 return target

def build(base,out):
 if out.exists():raise ValueError('Output exists: choose a new directory')
 recipes=(HERE/'source-edits.json').read_bytes()
 if blob(recipes)!='c940d230c28675c448e2efc2e0a132430312011f':raise ValueError('Recipe identity mismatch')
 module=(HERE/'asset-residency.js').read_bytes()
 if blob(module)!='f0ef84ac65205caf252ab9912cb99d5eefb727b8':raise ValueError('Asset module identity mismatch')
 staged={}
 for name,r in json.loads(recipes).items():
  raw=inside(base,name).read_bytes()
  if digest(raw)!=r['baseSha256']:raise ValueError('Wrong baseline: '+name)
  text=raw.decode('utf-8');end=0
  for e in r['edits']:
   if not end<=e['start']<=e['end']<=len(text):raise ValueError('Invalid edit: '+name)
   end=e['end']
  for e in reversed(r['edits']):text=text[:e['start']]+e['text']+text[e['end']:]
  raw=text.encode('utf-8')
  if digest(raw)!=r['outputSha256']:raise ValueError('Reconstruction mismatch: '+name)
  staged[name]=raw
 out.mkdir(parents=True)
 for name in ['assets','references']:shutil.copytree(base/name,out/name)
 for name in ['core.js','action-controller.js','motion-flow.js','cover-router.js','cover-metadata.json','cover-metadata.js','assets.js','asset-manifest.json']:
  shutil.copy2(base/name,out/name)
 for name,raw in staged.items():
  p=inside(out,name);p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(raw)
 (out/'asset-residency.js').write_bytes(module)
 print('Reconstructed exact 08J application. Run tools/build_standalone.py in the output. Tests/evidence are in the delivered 08J package.')

if __name__=='__main__':
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--base',type=Path,required=True);p.add_argument('--out',type=Path,required=True);a=p.parse_args();build(a.base,a.out)
