#!/usr/bin/env python3
"""Technical gate for the physical Build 39P inventory; visual review is separate."""
import hashlib, json
from pathlib import Path
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]/'public/assets/raptor-v2'
def main():
    manifest=json.loads((ROOT/'manifest.json').read_text())
    expected={f'{family}/{direction}/{frame:03}.png' for family,count in manifest['counts'].items() for direction in manifest['directions'] for frame in range(count)}
    actual={str(p.relative_to(ROOT)) for p in ROOT.rglob('*.png')}
    assert actual==expected, f'Inventory mismatch: missing {expected-actual}; extra {actual-expected}'
    hashes=set()
    for key in sorted(expected):
        raw=(ROOT/key).read_bytes(); digest=hashlib.sha256(raw).hexdigest()
        assert manifest['frames'][key]['sha256']==digest, f'Hash mismatch: {key}'
        assert all(0<=v<=512 for v in manifest['frames'][key]['anchor']), f'Invalid anchor: {key}'
        assert digest not in hashes, f'Duplicate image: {key}'
        hashes.add(digest)
        with Image.open(ROOT/key) as im:
            im.load()
            assert im.format=='PNG' and im.mode=='RGBA' and im.size==(512,512), key
            alpha=im.getchannel('A'); lo,hi=alpha.getextrema()
            assert lo==0 and hi>=240, f'Alpha invalid: {key}'
            assert all(alpha.getpixel(p)==0 for p in [(0,0),(511,0),(0,511),(511,511)]), key
            bbox=alpha.point(lambda a:255 if a>32 else 0).getbbox()
            assert bbox and bbox[0]>0 and bbox[1]>0 and bbox[2]<512 and bbox[3]<512, f'Clipped: {key}'
            assert sum(v>32 for v in alpha.getdata())>12000, f'Empty silhouette: {key}'
    print(f'PASS39Q {len(expected)} unique 512x512 RGBA files; full inventory, alpha and boundary checks')
if __name__=='__main__':main()
