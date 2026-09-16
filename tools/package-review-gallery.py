"""Package the existing review gallery and unique runtime images as a normal ZIP.

No image re-encoding, Base64 transfer, raw masters, or generated cache atlases.
"""
from pathlib import Path
import copy,hashlib,json,re,zipfile
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'sprites/previews'
OUT=ROOT/'backups/current'
data=json.loads((SOURCE/'review-catalog.js').read_text().removeprefix('window.GM_REVIEW_DATA=').strip().removesuffix(';'))
pack=copy.deepcopy(data);files={}
for f in pack['families']:
    image=(ROOT/f['path']).read_bytes()
    if hashlib.sha256(image).hexdigest()!=f['revision']:raise SystemExit('Changed image: '+f['id'])
    f['url']='assets/'+f['revision']+'.'+Path(f['path']).suffix.lstrip('.')
    files[f['url']]=image
html=(SOURCE/'identity-review.html').read_text()
html=html.replace('<link rel="stylesheet" href="review-gallery.css">','<style>'+(SOURCE/'review-gallery.css').read_text()+'</style>')
scripts=[]
for path in [ROOT/'experiments/shotgun-powered-duel/asset-hash.js',SOURCE/'review-model.js',SOURCE/'review-gallery.js']:
    code=path.read_text();code=re.sub(r'^import .*?;\n','',code,flags=re.M);code=re.sub(r'\bexport (?=(?:const|function)\b)','',code);scripts.append(code)
inline='window.GM_REVIEW_DATA='+json.dumps(pack,separators=(',',':'))+';\n(()=>{\n'+'\n'.join(scripts)+'\n})();'
html=html.replace('<script src="review-catalog.js"></script><script type="module" src="review-gallery.js"></script>','<script>'+inline.replace('</script','<\\/script')+'</script>')
files['OPEN-GALLERY.html']=html.encode()
files['READ-ME.txt']=('GOD MODE — isolated sprite approval gallery\n\n1. Extract this ZIP completely.\n2. Open OPEN-GALLERY.html in your browser.\n3. Use Choose unpacked assets folder and select the assets folder beside it. This verifies actual image bytes before enabling approval.\n4. Batch 3 opens on cover contact C001–C006; select attached idle for C007–C012. Watch each family or the complete approach/contact/idle flow. Reviewed movement is approved.\n5. Export your review file and send it in the conversation so the decisions can be committed to GitHub.\n\nNo account, server installation, or game deployment is required. Keep the HTML and assets folder together.\nOnly selected images are decoded. All original artwork is unchanged.\nFrame numbers are zero-based. Nominal angles are not certified exact directions. Design and animation approvals remain separate.\n').encode()
files['design-decisions.json']=(ROOT/'sprites/reviews/design-decisions.json').read_bytes()
metadata={'schemaVersion':1,'referencePoses':24,'families':len(pack['families']),'inspectableFrames':sum(f['frames'] for f in pack['families']),
          'files':[{'path':name,'bytes':len(blob),'sha256':hashlib.sha256(blob).hexdigest()} for name,blob in sorted(files.items())]}
files['PACKAGE-MANIFEST.json']=(json.dumps(metadata,indent=2)+'\n').encode()
OUT.mkdir(exist_ok=True)
target=OUT/'GOD-MODE-Sprite-Review.zip'
with zipfile.ZipFile(target,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
    for name,blob in sorted(files.items()):
        info=zipfile.ZipInfo(name,(2026,9,16,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o100644<<16;z.writestr(info,blob)
with zipfile.ZipFile(target) as z:
    if z.testzip():raise SystemExit('ZIP integrity failure')
    for file in metadata['files']:
        if hashlib.sha256(z.read(file['path'])).hexdigest()!=file['sha256']:raise SystemExit('ZIP file mismatch')
result={'path':str(target.relative_to(ROOT)),'bytes':target.stat().st_size,'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'referencePoses':24,'families':len(pack['families']),'files':len(files),'decodedAtStartup':'one cover sheet shared by six frame cards; only three sheets for the selected contact flow','instructions':'Extract and open OPEN-GALLERY.html; choose assets folder to verify artwork and enable approvals.'}
(OUT/'REVIEW-PACKAGE.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result))
