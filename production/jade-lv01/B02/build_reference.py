"""Reproduce native reference crops and self-contained review from an exact source.
Requires Pillow. Never creates transparency, HD detail or production approval.
"""
from pathlib import Path
import base64,hashlib,json,re
from PIL import Image
ROOT=Path(__file__).resolve().parent

def local(name):
    p=(ROOT/name).resolve()
    if not p.is_relative_to(ROOT):raise ValueError('Path outside package')
    return p

def main():
    c=json.loads((ROOT/'catalog.json').read_text())
    for r in (c['source'],c['visualAuthority'],c['previousReference']):
        if hashlib.sha256(local(r['file']).read_bytes()).hexdigest()!=r['sha256']:raise ValueError('Reference fingerprint mismatch: '+r['file'])
    image=Image.open(local(c['source']['file']))
    if list(image.size)!=c['source']['size']:raise ValueError('Dimensions mismatch')
    for f in c['frames']:
        x,y,w,h=f['rect'];crop=image.crop((x,y,x+w,y+h));dest=local(f['file']);dest.parent.mkdir(parents=True,exist_ok=True)
        if dest.exists():
            if Image.open(dest).tobytes()!=crop.tobytes():raise ValueError('Existing crop differs; refusing overwrite')
        else:crop.save(dest)
    (ROOT/'catalog.js').write_text('window.JADE_B02='+json.dumps(c,separators=(',',':'))+';\n')
    html=(ROOT/'index.html').read_text()
    embedded={r['file']:'data:image/png;base64,'+base64.b64encode(local(r['file']).read_bytes()).decode() for r in (c['source'],c['visualAuthority'])}
    html=html.replace('<script src="catalog.js"></script>','<script>window.JADE_B02_EMBED='+json.dumps(embedded)+';</script><script>'+ (ROOT/'catalog.js').read_text().replace('</script','<\\/script') +'</script>')
    for name in ('sprite-catalog.js','preview.js'):
        html=html.replace('<script src="'+name+'"></script>','<script>'+local(name).read_text().replace('</script','<\\/script')+'</script>')
    out=ROOT.parent/'JADE_LV01_B02_Reference_Player.html';out.write_text(html)
    print(out)
if __name__=='__main__':main()
