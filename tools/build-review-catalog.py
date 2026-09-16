"""Reference existing images without generating or replacing artwork."""
from pathlib import Path
import hashlib,json
ROOT=Path(__file__).resolve().parents[1]
base=ROOT/'recovery/shotgun-lab-v57'
manifest=json.loads((base/'assets/shotgun-complete/manifest.json').read_text())
batch=json.loads((ROOT/'sprites/manifests/batch-01-identity.json').read_text())
inventory=json.loads((ROOT/'sprites/manifests/existing-asset-inventory.json').read_text())
items=[]
def add(id,path,character,weapon,action,direction,cell,grid,frames,status):
    data=(ROOT/path).read_bytes()
    items.append(dict(id=id,path=path,url='../../'+path,character=character,weapon=weapon,action=action,direction=direction,cell=cell,grid=grid,frames=frames,revision=hashlib.sha256(data).hexdigest(),bytes=len(data),status=status))
for f in manifest['families']:
    if f['status']=='lab-test':add(f['id'],str((base/f['runtimeUrl']).relative_to(ROOT)),'heroine','shotgun',f['action'],f['nominalDirection'],f['runtimeCell'],f['grid'],f['totalFrames'],'Existing nominal-direction study')
for action in ['dash','charge']:
    add(action+'-study-d03',f'experiments/shotgun-powered-duel/art-next/{action}-d03-6frames.png','heroine','shotgun' if action=='dash' else 'psychic',action,3,[250,250],[3,2],6,'Provisional study; 23 directions missing')
for f in inventory['files']:
    p=f['path'];name=Path(p).stem
    if '/movement-lab/' in p:
        assert f['size']==[2304,864]
        action='legacy-run' if 'hero-run' in name else 'legacy-slide-cover' if 'hero-slide' in name else 'legacy-weapon-sequence'
        add(name,p,'heroine','handgun',action,3 if 'front-right' in name else 21,[288,288],[8,3],24,'Legacy sheet; cutoffs and mixed actions require review')
    elif '/assets/' in p and '/shotgun-complete/runtime/' not in p:
        chunks=name=='barrier-chunks-natural-4x2-128'
        add(name,p,'environment' if name in ['lab','barrier-surfaces-natural'] or chunks else 'effects','none',name,None,[128,128] if chunks else f['size'],[4,2] if chunks else [1,1],8 if chunks else 1,'Existing sheet; frame layout unregistered' if not chunks else 'Eight registered barrier chunks')
refs=[]
for number,f in enumerate(batch['frames'],1):
    item=next(i for i in items if i['id']==f'ready-d{f["directionIndex"]:02d}')
    assert item['revision']==f['sourceVersion']
    refs.append({'number':number,'familyId':item['id'],'assetId':f['assetId'],'frame':f['frameNumber'],'revision':item['revision']})
running=json.loads((ROOT/'sprites/manifests/batch-02-running.json').read_text())
registrationPath=ROOT/'sprites/manifests/running-registration-v1.json'
registration=json.loads(registrationPath.read_text()) if registrationPath.exists() else None
if registration:
    for reg in registration['families']:
        item=next(i for i in items if i['id']==reg['familyId'])
        assert reg['sourceRevision']==item['revision'] and len(reg['offsets'])==item['frames']
        item['registration']=reg
        item['animationRevision']=reg['animationRevision']
for ref in running['items']:
    item=next(i for i in items if i['id']==ref['familyId'])
    assert ref['revision']==item['revision'] and 0<=ref['frame']<item['frames']
data={'schemaVersion':1,'catalogId':'god-mode-individual-review-20260916','references':refs,'families':items,'runningBatch':running,'runningRegistration':{'correctedFrames':registration['correctedFrames'],'sourceFrames':registration['sourceFrames']} if registration else None}
target=ROOT/'sprites/previews/review-catalog.js';target.write_text('window.GM_REVIEW_DATA='+json.dumps(data,separators=(',',':'))+';\n')
ledger=ROOT/'sprites/reviews/design-decisions.json'
if not ledger.exists():
    ledger.parent.mkdir(parents=True,exist_ok=True)
    ledger.write_text(json.dumps({'schemaVersion':1,'catalogId':data['catalogId'],'records':[],'note':'Awaiting user decisions. Exported browser reviews can be imported and committed here. No automatic GitHub credential is exposed to this gallery.'},indent=2)+'\n')
data['savedReviews']=json.loads(ledger.read_text())
target.write_text('window.GM_REVIEW_DATA='+json.dumps(data,separators=(',',':'))+';\n')
print(json.dumps({'referencePoses':len(refs),'families':len(items),'inspectableFrames':sum(i['frames'] for i in items),'catalogBytes':target.stat().st_size}))
