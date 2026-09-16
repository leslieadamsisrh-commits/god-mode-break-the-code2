"""Prepare the isolated first cover batch. Never modifies recovered artwork.

Authorized chroma-key extraction and registration only. No component removal,
mirroring, interpolation of poses, anatomy edits or per-frame scale changes.
Full-resolution lossless masters retain every original generated RGB pixel.
"""
from pathlib import Path
import hashlib, json
import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT/'test-output/cover-review'
OUT.mkdir(parents=True, exist_ok=True)
SPECS = [
    ('contact', 220, ['slide braking', 'boot plant', 'shoulder contact', 'impact absorption', 'settling', 'attached stance']),
    ('idle', 197, ['ready breath', 'inhale', 'inhale apex', 'ease', 'exhale', 'return']),
]

def sha(path): return hashlib.sha256(path.read_bytes()).hexdigest()

def extract(im):
    rgb = np.array(im.convert('RGB'), dtype=np.float32)
    r,g,b = rgb[:,:,0],rgb[:,:,1],rgb[:,:,2]
    # Source blue is separated from cyan technology by B-G, and from purple
    # clothing by B-R. All areas are keyed, including enclosed limb gaps.
    excess = b-np.maximum(r,g)
    confidence = np.minimum(np.clip((excess-65)/105,0,1),np.clip((b-95)/110,0,1))
    confidence *= np.clip((135-np.maximum(r,g))/45,0,1)
    alpha = np.rint((1-confidence)*255).astype(np.uint8)
    alpha[(b>180)&(r<75)&(g<150)&(excess>80)]=0
    return Image.fromarray(np.dstack((rgb.astype(np.uint8),alpha)))

def preview(tile, color=(77,74,82)):
    im=Image.new('RGB',(298,298),color);im.paste(tile,(24,24),tile);return im

families=[]
for name,side,beats in SPECS:
    source=ROOT/f'sprites/source-art/cover/{name}-d03-v1.webp'
    original=Image.open(source);assert original.size==(1536,1024)
    masked=extract(original)
    atlas=Image.new('RGBA',(750,500));frames=[];proof=[]
    for i,beat in enumerate(beats):
        cell=masked.crop((i%3*512,i//3*512,i%3*512+512,i//3*512+512))
        a=np.array(cell);r,g,b,alpha=[a[:,:,j].astype(float) for j in range(4)]
        yy,xx=np.where((alpha>220)&(r>110)&(r>g*1.8)&(b>g*1.5)&(np.indices(alpha.shape)[0]>370))
        assert len(xx)>100
        # Boot soles only, not trailing cloth. Registration uses grounded
        # contact, not lowest-foot normalization of an airborne run.
        ground=int(np.percentile(yy,99))
        sole=(yy>=ground-10)
        boot_center=([300,293,289,304,290,290] if name=='contact' else [278,278,278,278,278,278])[i]
        scale=side/512
        offset=[round(125-boot_center*scale),round(219-ground*scale)]
        tile=Image.new('RGBA',(250,250));tile.alpha_composite(cell.resize((side,side),Image.Resampling.LANCZOS),offset)
        bbox=tile.getbbox();assert bbox and min(bbox[0],bbox[1],250-bbox[2],250-bbox[3])>=8,(name,i,bbox)
        number=f'C{i+1:03d}' if name=='contact' else f'C{i+7:03d}'
        atlas.alpha_composite(tile,(i%3*250,i//3*250))
        proof.append(preview(tile));proof[-1].save(OUT/f'{number}.png')
        pixels=np.array(tile);gy,gx=np.indices((250,250));visible=pixels[:,:,3]>220
        gun=visible&(gy>95)&(gy<170)&(gx>160)
        tip=int(gx[gun].max());tip_y=float(np.mean(gy[gun&(gx>=tip-1)]))
        frames.append({'number':number,'index':i,'beat':beat,'sourceAnchor':[boot_center,ground],
                       'runtimeAnchor':[125,219],'sourceToRuntimeScale':scale,'offset':offset,'alphaBounds':list(bbox),
                       'sockets':{'ground':{'xy':[125,219],'status':'registered'},
                                  'muzzle':{'xy':[tip,round(tip_y,1)],'status':'visible-tip-registration-awaiting-in-game-validation'},
                                  'triggerHand':{'xy':[tip-60,round(tip_y+10,1)],'status':'estimated-not-certified'},
                                  'supportHand':{'xy':[tip-31,round(tip_y+9,1)],'status':'estimated-not-certified'},
                                  'coverContact':{'xy':[tip-85,round(tip_y+8,1)],'status':'estimated-shoulder-plane-not-game-verified'}}})
    runtime=ROOT/f'sprites/heroine/shotgun/cover/{name}-d03-v1.webp'
    atlas.save(runtime,lossless=True,method=6)
    for bg,color in [('light',(239,239,239)),('dark',(20,23,30)),('checker',(170,170,170))]:
        sheet=Image.new('RGB',atlas.size,color)
        if bg=='checker':
            d=ImageDraw.Draw(sheet)
            for y in range(0,500,16):
                for x in range(0,750,16):
                    if (x//16+y//16)%2:d.rectangle((x,y,x+15,y+15),fill=(220,220,220))
        sheet.paste(atlas,(0,0),atlas);sheet.save(OUT/f'{name}-{bg}.png')
    duration=90 if name=='contact' else 160
    proof[0].save(OUT/f'{name}-d03.gif',save_all=True,append_images=proof[1:],duration=duration,loop=0,disposal=2)
    families.append({'id':f'cover-{name}-d03-v1','action':f'cover-{name}','direction':3,'registeredYawDegrees':None,
                     'sourcePath':str(source.relative_to(ROOT)),'sourceRevision':sha(source),'path':str(runtime.relative_to(ROOT)),
                     'revision':sha(runtime),'cell':[250,250],'grid':[3,2],'frames':6,'frameRecords':frames,
                     'previewDurationMs':duration,'status':'generated-registered-awaiting-user-review',
                     'integration':'not-integrated','reviewTiming':'Inspection only. Existing contact window remains 0.22 seconds.'})
    families[-1]['animationRevision']=hashlib.sha256(json.dumps(families[-1],sort_keys=True).encode()).hexdigest()
batch={'schemaVersion':1,'batch':3,'id':'shotgun-cover-contact-review','nominalDirection':3,
       'title':'First front-right contact and attached idle','status':'awaiting-design-and-animation-review',
       'uniqueDrawings':12,'requiredDirections':24,'candidateDirections':1,'approvedDirections':0,
       'families':families,'nextGate':'Approve this direction before traversal, peeking, firing, exits or 23 other directions.',
       'sourceMethod':'Built-in image generation; RGB blue-key output; authorized deterministic alpha extraction.',
       'originalArtworkChanged':False,'gameplayChanged':False}
(ROOT/'sprites/manifests/batch-03-cover-contact.json').write_text(json.dumps(batch,indent=2)+'\n')
print(json.dumps([{ 'id':f['id'],'bytes':(ROOT/f['path']).stat().st_size,'bounds':[r['alphaBounds'] for r in f['frameRecords']]} for f in families]))

# Reproducible single-frame proofs and a demonstration loop. Only masters and
# runtime atlases are retained in backups; this output can be regenerated.
sequence=[]
for f in families:
    atlas=Image.open(ROOT/f['path'])
    for r in f['frameRecords']:
        i=r['index'];tile=atlas.crop((i%3*250,i//3*250,i%3*250+250,i//3*250+250))
        im=preview(tile);ImageDraw.Draw(im).text((10,8),r['number']+' / '+r['beat'],fill='white');sequence.append(im)
sequence[0].save(OUT/'contact-to-idle.gif',save_all=True,append_images=sequence[1:]+sequence[6:]+sequence[6:],duration=[100]*6+[160]*18,loop=0,disposal=2)
metrics={'runtimeDecodedBytesEach':1500000,'flowDecodedBytes':9000000,
         'runtimeBytes':sum((ROOT/f['path']).stat().st_size for f in families),
         'minimumAlphaPaddingPixels':min(min(r['alphaBounds'][0],r['alphaBounds'][1],250-r['alphaBounds'][2],250-r['alphaBounds'][3]) for f in families for r in f['frameRecords']),
         'uniqueDrawings':12,'hardwareFPS':None,'inGameIntegration':'pending'}
(ROOT/'sprites/reviews/cover-metrics.json').write_text(json.dumps(metrics,indent=2)+'\n')
