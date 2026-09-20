"""Reproduce exact source-panel review assets. No drawing, segmentation or gameplay edits.
Run from any location: python tools/build_review.py. Requires Pillow.
The original images stay byte-identical. The standalone HTML embeds the two sheets.
"""
from pathlib import Path
import base64, hashlib, json
from PIL import Image
ROOT = Path(__file__).resolve().parents[1]

def digest(data):
    return hashlib.sha256(data).hexdigest()

def safe_path(relative):
    target=(ROOT / relative).resolve()
    if not target.is_relative_to(ROOT.resolve()):
        raise ValueError('Path outside package: '+relative)
    return target

def main():
    index=json.loads((ROOT/'source-index.json').read_text())
    frames=[]
    sources=[]
    embeds={}
    for src in index['sources']:
        p=safe_path(src['file']);raw=p.read_bytes()
        if digest(raw)!=src['sha256']:raise ValueError('Source fingerprint differs: '+src['id'])
        im=Image.open(p)
        if list(im.size)!=src['dimensions'] or im.mode!=src['mode']:
            raise ValueError('Source dimensions/mode differ: '+src['id'])
        sources.append(src)
        embeds[src['id']]='data:image/png;base64,'+base64.b64encode(raw).decode('ascii')
        for d in range(24):
            r,c=divmod(d,6);left,right=src['columns'][c];top,bottom=src['rows'][r]
            if not 0<=left<right<=im.width or not 0<=top<bottom<=im.height:raise ValueError('Bad rectangle')
            crop=im.crop((left,top,right,bottom));file=f'panels/{src["id"]}-D{d:02d}.png'
            target=safe_path(file);target.parent.mkdir(exist_ok=True)
            # Refuse to silently replace a pre-existing crop with different image pixels.
            if target.exists():
                old=Image.open(target)
                if old.mode!=crop.mode or old.size!=crop.size or old.tobytes()!=crop.tobytes():
                    raise ValueError('Existing crop mismatch: '+file)
            else:crop.save(target)
            frames.append({'id':f'{src["id"]}-D{d:02d}','source':src['id'],'direction':d,
                'labelAngleDegrees':15*d,'sourceRect':[left,top,right-left,bottom-top],
                'file':file,'dimensions':list(crop.size),'sha256':digest(target.read_bytes()),
                'kind':'OPAQUE_MULTI_POSE_REFERENCE_PANEL','containsLabelsAndBackground':True,
                'runtimeReady':False,'yawVerified':False,'root':None,'sockets':None,
                'individualAnimationFrames':None})
    master=index['authority'];p=safe_path(master['file'])
    if digest(p.read_bytes())!=master['sha256']:raise ValueError('Master fingerprint differs')
    cat={'schemaVersion':1,'id':'JADE-LV01-RS24','kind':'REFERENCE_REVIEW_ONLY',
         'sources':sources,'panels':frames,'master':master,
         'sourceAngleConvention':index['sourceAngleConvention'],
         'engineMappingVerified':False,'transparentProductionSprites':0,
         'runtimeIntegrated':False,'newDrawings':0,
         'nextMovement':'B05 / Cover Entry / Attach'}
    (ROOT/'catalog.json').write_text(json.dumps(cat,indent=2)+'\n')
    cat_js='window.JADE_REFERENCE_CATALOG='+json.dumps(cat,separators=(',',':'))+';'
    (ROOT/'catalog.js').write_text(cat_js+'\n')
    page=(ROOT/'index.html').read_text()
    page=page.replace('<script src="catalog.js"></script>', '<script>'+cat_js+'</script>')
    page=page.replace('<script src="review.js"></script>', '<script>'+ (ROOT/'review.js').read_text().replace('</script','<\\/script')+'</script>')
    page=page.replace('<script src="catalog.js"></script>', '')
    page=page.replace('<!-- EMBED -->','<script>window.JADE_REFERENCE_IMAGES='+json.dumps(embeds,separators=(',',':'))+';</script>')
    (ROOT.parent/'JADE_LV01_Run_Slide_Reference_Player.html').write_text(page)
    print(json.dumps({'panels':len(frames),'newDrawings':0,'runtimeReady':False,
                      'standalone':'JADE_LV01_Run_Slide_Reference_Player.html'}))
if __name__=='__main__':main()
