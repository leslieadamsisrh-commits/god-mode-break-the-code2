from pathlib import Path
from PIL import Image
import json,hashlib
root=Path(__file__).resolve().parents[1];lab=root/'experiments/shotgun-powered-duel'
manifest=json.loads((lab/'art-streaming/manifest.json').read_text())
source=json.loads((root/'recovery/shotgun-lab-v57/assets/shotgun-complete/manifest.json').read_text())
families={f['id']:f for f in source['families'] if f['status']=='lab-test'}
assert set(families)=={f['id'] for f in manifest['families']}
for f in manifest['families']:
    p=lab/f['url'];original=families[f['id']]
    assert hashlib.sha256(p.read_bytes()).hexdigest()==f['sha256']
    assert f['sourceSha256']==original['runtimeSha256']
    assert f['frames']==original['totalFrames'] and f['grid']==original['grid']
    with Image.open(p) as im:
        assert im.size==(f['grid'][0]*125,f['grid'][1]*125)
        assert 'A' in im.getbands()
print('Verified',len(families),'registered fallback atlases; source frames and alpha preserved.')
