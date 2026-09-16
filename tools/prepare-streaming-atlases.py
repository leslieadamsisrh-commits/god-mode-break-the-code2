"""Create registered runtime fallback atlases; original artwork stays untouched."""
from pathlib import Path
from PIL import Image
import hashlib,json
root=Path(__file__).resolve().parents[1]
base=root/'recovery/shotgun-lab-v57'
out=root/'experiments/shotgun-powered-duel/art-streaming'
out.mkdir(exist_ok=True)
manifest=json.loads((base/'assets/shotgun-complete/manifest.json').read_text())
records=[]
for family in manifest['families']:
    if family['status']!='lab-test':continue
    source=base/family['runtimeUrl']
    source_hash=hashlib.sha256(source.read_bytes()).hexdigest()
    if source_hash!=family['runtimeSha256']:raise SystemExit('Changed source: '+family['id'])
    cols,rows=family['grid'];image=Image.open(source).convert('RGBA')
    if image.size!=(cols*250,rows*250):raise SystemExit('Unexpected grid')
    atlas=Image.new('RGBA',(cols*125,rows*125))
    # Resize cells independently so a filter cannot pull pixels from a neighbor.
    for frame in range(family['totalFrames']):
        x,y=frame%cols,frame//cols
        cell=image.crop((x*250,y*250,(x+1)*250,(y+1)*250))
        atlas.paste(cell.resize((125,125),Image.Resampling.LANCZOS),(x*125,y*125))
    target=out/(family['id']+'.webp');atlas.save(target,format='WEBP',lossless=True,method=4)
    records.append({'id':family['id'],'url':'art-streaming/'+target.name,'cell':125,'grid':[cols,rows],'frames':family['totalFrames'],'sourceSha256':source_hash,'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'decodedBytes':atlas.width*atlas.height*4,'bytes':target.stat().st_size})
(out/'manifest.json').write_text(json.dumps({'schemaVersion':1,'purpose':'Same-frame fallback while full-resolution atlas loads; not new viewpoints','families':records},indent=2)+'\n')
print(json.dumps({'atlases':len(records),'decodedMiB':sum(r['decodedBytes'] for r in records)/1048576,'downloadMiB':sum(r['bytes'] for r in records)/1048576}))
