"""Verify packaged image bytes and atlas geometry. Does not approve final animation."""
from pathlib import Path
import hashlib, json
from PIL import Image
ROOT = Path(__file__).resolve().parents[1]
def main():
    manifest=json.loads((ROOT/'asset-manifest.json').read_text())
    results=[]
    groups=[('recovered',manifest['recoveredAtlases']),('final',manifest['finalFrames'])]
    for kind,records in groups:
        for key,record in records.items():
            path=(ROOT/record['file']).resolve()
            assert ROOT in path.parents, 'Unexpected path'
            data=path.read_bytes()
            assert hashlib.sha256(data).hexdigest()==record['sha256'], 'Hash mismatch: '+str(path)
            with Image.open(path) as image:
                image.load()
                expected=record['runtimeDimensions'] if kind=='recovered' else record['dimensions']
                assert list(image.size)==expected, 'Dimension mismatch: '+key
                assert image.mode=='RGBA', 'Missing RGBA: '+key
                if kind=='recovered':
                    assert image.width==record['cols']*record['cell']
                    assert image.height==record['rows']*record['cell']
                    assert record['frames']==record['cols']*record['rows']
                alpha=image.getchannel('A').histogram()
                assert alpha[0]>0 and sum(alpha[9:])>0, 'Alpha/visible content: '+key
                results.append({'id':key,'kind':kind,'hashMatches':True,'dimensions':list(image.size),'fullyTransparentPixels':alpha[0]})
    report={'scope':'File integrity and decoding only; no final anatomy/scale/contact approval','imageCount':len(results),'newDrawings':0,'results':results}
    (ROOT/'tests/asset-integrity-results.json').write_text(json.dumps(report,indent=2)+'\n')
    print('Verified',len(results),'image files. No final animation gates are asserted.')
if __name__=='__main__': main()
