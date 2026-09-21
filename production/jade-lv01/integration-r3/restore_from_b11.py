"""Restore R3 into a NEW directory from the exact saved B11 package.

python restore_from_b11.py /path/to/JADE_V12_08N_B11_Fast_Integration.zip --output god-mode-r3
"""
from pathlib import Path
import argparse,hashlib,shutil,zipfile,subprocess,sys
EXPECTED='38ba7040a5abedb8efe371481304b35195765d4e3de0d3c9fdc390462272c233'
ap=argparse.ArgumentParser();ap.add_argument('archive',type=Path);ap.add_argument('--output',type=Path,required=True);a=ap.parse_args()
if hashlib.sha256(a.archive.read_bytes()).hexdigest()!=EXPECTED:sys.exit('Wrong archive fingerprint; no files restored.')
dest=a.output.resolve()
if dest.exists() and any(dest.iterdir()):sys.exit('Output must be new or empty; existing work was not touched.')
dest.mkdir(parents=True,exist_ok=True)
prefix='JADE_V12_08N_B11_FAST_INTEGRATION/'
with zipfile.ZipFile(a.archive) as z:
    for item in z.infolist():
        if item.is_dir() or not item.filename.startswith(prefix):continue
        relative=Path(item.filename[len(prefix):])
        if relative.parts[0] not in ['public','source','tests','tools'] and str(relative) not in ['package.json','BASELINE.json']:continue
        target=(dest/relative).resolve()
        if not target.is_relative_to(dest):sys.exit('Unsafe archive path.')
        target.parent.mkdir(parents=True,exist_ok=True)
        with z.open(item) as src,target.open('wb') as out:shutil.copyfileobj(src,out)
stage=Path(__file__).resolve().parent
for overlay in [stage.parent/'integration-r1'/'runtime',stage.parent/'integration-r2'/'runtime',stage/'runtime']:
    shutil.copytree(overlay,dest,dirs_exist_ok=True)
before=__import__('json').loads((dest/'recovery/B11-SOURCE-HASHES.json').read_text())
for name,sha in before.items():
    if name.startswith('public/assets/') and hashlib.sha256((dest/name).read_bytes()).hexdigest()!=sha:sys.exit('Asset verification failed: '+name)
subprocess.run([sys.executable,str(dest/'tools/build_standalone.py')],cwd=dest,check=True)
print('Restored and verified R3:',dest)
print('Run node --test tests/*.test.cjs from the output folder. Open GOD_MODE_B11_Crouch_Test_R3.html in your browser.')
