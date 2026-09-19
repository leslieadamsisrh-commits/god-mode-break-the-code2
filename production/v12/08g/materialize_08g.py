"""Rebuild the tested 08G files from exact unpacked 08F and 08E packages.

Writes a NEW directory. It never edits the supplied baseline or deploys anything.
Character-offset edits are generated source deltas, protected by input/output
SHA-256 checks; inspect the reconstructed JS files before integration.
"""
from pathlib import Path
import argparse,hashlib,json,shutil
HERE=Path(__file__).resolve().parent

def sha(data):return hashlib.sha256(data).hexdigest()
def inside(root,name):
    p=(root/name).resolve()
    if not p.is_relative_to(root.resolve()):raise ValueError('Unsafe relative path')
    return p

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--base',required=True,type=Path)
    p.add_argument('--study',required=True,type=Path)
    p.add_argument('--out',required=True,type=Path)
    a=p.parse_args();output=a.out.resolve()
    if output.exists():raise SystemExit('Output already exists; select a new directory')
    edits=json.loads((HERE/'source-edits.json').read_text())
    staged={}
    for name,record in edits.items():
        raw=inside(a.base,name).read_bytes()
        if sha(raw)!=record['baseSha256']:raise SystemExit('Baseline mismatch: '+name)
        text=raw.decode('utf-8');end=0
        for item in record['edits']:
            if not end<=item['start']<=item['end']<=len(text):raise SystemExit('Invalid source edit')
            end=item['end']
        for item in reversed(record['edits']):text=text[:item['start']]+item['text']+text[item['end']:]
        encoded=text.encode('utf-8')
        if sha(encoded)!=record['outputSha256']:raise SystemExit('Rebuild mismatch: '+name)
        staged[name]=encoded
    controller=HERE/'action-controller.js'
    if not controller.exists():controller=HERE.parent/'action-controller.js'
    raw=controller.read_bytes()
    if sha(raw)!='1ee3cb5820a24384d57f4c50140c0ce3b2c8478f17bccbd61917a395daa1359d':raise SystemExit('Controller mismatch')
    staged['action-controller.js']=raw
    expected=['bcfa94b75be2c24f737877d48193bd825abc381258de7295c88aa0bf4915ca04','5d97a346562675224613d8a77183e39717c3d6e3beb83566b07e6cd489b17b12','ebcd48a0b2d06c2593d725a6928f91083ce03a28093d67016fdd6c1be32a77ba','80b4c37ec7812f29c2f23d6db249099fd578ac2669972683183a4ca054022304']
    manifest=json.loads((a.base/'asset-manifest.json').read_text())
    manifest['version']='V12-08G';manifest['studyFrames']={}
    for i,digest in enumerate(expected,1):
        raw=(a.study/f'derived/early_lift_study_{i:02d}_native.png').read_bytes()
        if sha(raw)!=digest:raise SystemExit('Study source mismatch')
        name=f'assets/study/K02-lift-{i}.png';staged[name]=raw
        manifest['studyFrames'][f'K02-lift-{i}']={'file':name,'dimensions':[640,809],'sha256':digest,'type':'SOURCE_PIXEL_DEFORMATION_STUDY','newDrawing':False,'runtimeReady':False,'fromBatch':'08E','degrees':-i*1.5}
    output.mkdir(parents=True)
    shutil.copytree(a.base/'assets',output/'assets')
    for name,raw in staged.items():
        target=inside(output,name);target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(raw)
    (output/'asset-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
    (output/'assets.js').write_text('window.JADE_ASSETS='+json.dumps(manifest,separators=(',',':'))+';\n')
    (output/'tests').mkdir()
    print('Rebuilt source and copied unchanged assets. Next: python tools/verify_assets.py and python tools/build_standalone.py inside output.')

if __name__=='__main__':main()
