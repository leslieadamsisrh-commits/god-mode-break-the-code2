"""Extract review previews from unchanged registered running sheets.

No redraw, interpolation, frame reordering, mirroring or anchor correction.
Proofs are reproducible and excluded from source backups; the original images,
batch manifest and this recipe are retained. Requires Pillow for local proofs.
"""
from pathlib import Path
import hashlib,json
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'test-output/running-review'
OUT.mkdir(parents=True,exist_ok=True)
catalog=json.loads((ROOT/'sprites/previews/review-catalog.js').read_text().removeprefix('window.GM_REVIEW_DATA=').strip().removesuffix(';'))
batch=catalog['runningBatch']
proofs=[]
for family_id in batch['motionComparisons']:
    f=next(f for f in catalog['families'] if f['id']==family_id)
    path=ROOT/f['path']
    assert hashlib.sha256(path.read_bytes()).hexdigest()==f['revision']
    source=Image.open(path).convert('RGBA')
    w,h=f['cell'];cols,rows=f['grid']
    assert source.size==(cols*w,rows*h)
    images=[]
    for frame in range(f['frames']):
        x=(frame%cols)*w;y=(frame//cols)*h
        cell=source.crop((x,y,x+w,y+h))
        canvas=Image.new('RGBA',(w+48,h+48),(64,70,80,255))
        canvas.alpha_composite(cell,(24,24))
        images.append(canvas.convert('RGB'))
        if family_id==batch['defaultFamily']:
            ref=next(r for r in batch['items'] if r['familyId']==family_id and r['frame']==frame)
            target=OUT/(ref['number']+'.png');images[-1].save(target)
            proofs.append({'path':str(target.relative_to(ROOT)),'sourceRevision':f['revision'],'familyId':family_id,'frame':frame})
    target=OUT/(family_id+'-motion.gif')
    images[0].save(target,save_all=True,append_images=images[1:],duration=batch['previewDurationMs'],loop=0,disposal=2,optimize=False)
    proofs.append({'path':str(target.relative_to(ROOT)),'sourceRevision':f['revision'],'familyId':family_id,'frames':f['frames']})
(OUT/'proof-manifest.json').write_text(json.dumps({'timing':batch['previewTiming'],'proofs':proofs},indent=2)+'\n')
print('Rendered',len(proofs),'review previews from unchanged source cells; no new artwork.')
