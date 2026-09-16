"""Measure isolated vertical registration outliers without redrawing sprites.

Requires Pillow and numpy locally. Committed JSON is sufficient for the gallery
and backup workflow. Unchanged pixels, pose order, scale and timing are retained.
"""
from pathlib import Path
import hashlib,json
import numpy as np
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
catalog=json.loads((ROOT/'sprites/previews/review-catalog.js').read_text().removeprefix('window.GM_REVIEW_DATA=').strip().removesuffix(';'))
# Additional small discontinuities found in the visual/loop review. These are
# explicit frame-specific torso targets, not an all-frame leveling filter.
MANUAL_TARGETS={
    'run-d00':{6:100},'run-d02':{3:93},'run-d05':{7:90},'run-d10':{3:90},
    'run-d15':{8:104,11:100,14:101,15:101},
    'run-d21':{8:94,9:98,10:96,12:96,20:100},
    'run-d23':{4:98,11:94},
}
families=[]
for f in sorted((f for f in catalog['families'] if f['action']=='run'),key=lambda f:f['direction']):
    raw=(ROOT/f['path']).read_bytes()
    assert hashlib.sha256(raw).hexdigest()==f['revision']
    im=Image.open(ROOT/f['path']).convert('RGBA');w,h=f['cell'];cols=f['grid'][0]
    positions=[];bounds=[];counts=[]
    for frame in range(f['frames']):
        x=frame%cols*w;y=frame//cols*h
        cell=im.crop((x,y,x+w,y+h));a=np.array(cell)
        mask=(a[:,:,0]<95)&(a[:,:,1]>140)&(a[:,:,2]>140)&(a[:,:,3]>200)
        yy,xx=np.where(mask)
        if len(yy)<30:raise ValueError('Backpack landmark not reliably visible: '+f['id'])
        positions.append(float(np.median(yy)));counts.append(len(yy));bounds.append(cell.getchannel('A').getbbox())
    median=float(np.median(positions));mad=float(np.median(np.abs(np.array(positions)-median)))
    tolerance=max(8.0,2.5*mad)
    bad={i for i,y in enumerate(positions) if y>median+tolerance}
    manual=MANUAL_TARGETS.get(f['id'],{})
    bad.update(manual)
    offsets=[[0,0] for _ in positions];corrections=[];n=len(positions)
    for i in sorted(bad):
        left=1
        while (i-left)%n in bad:left+=1
        right=1
        while (i+right)%n in bad:right+=1
        target=(positions[(i-left)%n]*right+positions[(i+right)%n]*left)/(left+right)
        if i in manual:target=manual[i]
        dy=round(target-positions[i]);offsets[i]=[0,dy]
        b=bounds[i]
        assert b[1]+dy>=8 and b[3]+dy<=h-8, 'Correction would clip or remove padding'
        corrections.append({'frame':i,'offset':[0,dy],'originalBackpackY':positions[i],'registeredBackpackY':positions[i]+dy,'sourceAlphaBounds':b,'registeredAlphaBounds':[b[0],b[1]+dy,b[2],b[3]+dy],'visibleCyanPixels':counts[i],'reason':'visual-loop-review target' if i in manual else 'isolated low-torso registration outlier'})
    registered=[y+offsets[i][1] for i,y in enumerate(positions)]
    def jump(values):return max(abs(values[i]-values[(i+1)%n]) for i in range(n))
    descriptor={'sourceRevision':f['revision'],'cell':f['cell'],'offsets':offsets,'frameOrder':list(range(n)),'timing':'unchanged'}
    animationRevision=hashlib.sha256(json.dumps(descriptor,sort_keys=True,separators=(',',':')).encode()).hexdigest()
    families.append({'familyId':f['id'],'sourceRevision':f['revision'],'animationRevision':animationRevision,'offsets':offsets,'corrections':corrections,'measurements':{'backpackY':positions,'registeredBackpackY':registered,'outlierThreshold':median+tolerance,'maxAdjacentBackpackJumpBefore':jump(positions),'maxAdjacentBackpackJumpAfter':jump(registered)},'reviewStatus':'registration-candidate-awaiting-animation-review'})
out={'schemaVersion':1,'method':'Targeted integer Y translation of whole frames. Backpack/torso landmark outliers are registered between adjacent valid phases. Small existing bob is retained. No foot-bound normalization, scaling, stretching, pixel interpolation, reordering or new artwork.','scope':'isolated Sprite Library only','sourceFrames':sum(len(f['offsets']) for f in families),'correctedFrames':sum(len(f['corrections']) for f in families),'families':families}
(ROOT/'sprites/manifests/running-registration-v1.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps({'framesAudited':out['sourceFrames'],'correctedFrames':out['correctedFrames'],'changedDirections':sum(bool(f['corrections']) for f in families),'keyFamilies':[{k:f[k] for k in ['familyId','corrections','measurements']} for f in families if f['familyId'] in ['run-d00','run-d06','run-d18']]}))
