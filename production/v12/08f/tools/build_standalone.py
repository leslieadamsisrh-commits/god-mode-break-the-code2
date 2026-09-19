from pathlib import Path
import base64,json
ROOT=Path(__file__).resolve().parents[1]
html=(ROOT/'index.html').read_text()
html=html.replace('<link rel="stylesheet" href="style.css">','<style>'+(ROOT/'style.css').read_text()+'</style>')
embed={}
for p in (ROOT/'assets').rglob('*'):
 if p.is_file():
  mime='image/png' if p.suffix=='.png' else 'image/webp'
  embed[str(p.relative_to(ROOT))]='data:'+mime+';base64,'+base64.b64encode(p.read_bytes()).decode()
html=html.replace('<script src="assets.js"></script>','<script>window.JADE_EMBED='+json.dumps(embed,separators=(',',':'))+';\n'+(ROOT/'assets.js').read_text()+'</script>')
for f in ['core.js','app.js']:html=html.replace('<script src="'+f+'"></script>','<script>'+(ROOT/f).read_text()+'</script>')
path=ROOT.parent/'JADE_V12_08F_Playable_Training_Lab.html';path.write_text(html)
print('Standalone:',path.stat().st_size,'bytes')
