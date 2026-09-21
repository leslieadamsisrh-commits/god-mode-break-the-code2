"""Build an offline single HTML from the exact public directory; no network I/O."""
from pathlib import Path
import base64,json,re,hashlib
ROOT=Path(__file__).resolve().parents[1];P=ROOT/'public'
def build():
 text=(P/'index.html').read_text()
 text=text.replace('<link rel="stylesheet" href="style.css">','<style>'+(P/'style.css').read_text()+'</style>')
 embedded={str(f.relative_to(P)):'data:image/'+('webp' if f.suffix=='.webp' else 'png')+';base64,'+base64.b64encode(f.read_bytes()).decode() for f in sorted((P/'assets').rglob('*')) if f.is_file()}
 text=text.replace('<script src="vendor/assets.js">','<script>window.JADE_EMBED='+json.dumps(embedded,separators=(',',':'))+';</script><script src="vendor/assets.js">')
 text=re.sub(r'<script src="([^"]+)"></script>',lambda m:'<script>\n'+(P/m[1]).read_text().replace('</script','<\\/script')+'\n</script>',text)
 output=ROOT/'GOD_MODE_B11_Crouch_Test_R3.html';output.write_text(text)
 print(json.dumps({'file':str(output),'bytes':output.stat().st_size,'sha256':hashlib.sha256(output.read_bytes()).hexdigest(),'images':len(embedded)}))
if __name__=='__main__':build()
