from pathlib import Path
import hashlib,json
from PIL import Image
R=Path(__file__).resolve().parents[1]
def sha(b):return hashlib.sha256(b).hexdigest()
manifest=json.loads((R/'BASELINE.json').read_text())
for name,digest in manifest['unchangedFiles'].items():assert sha((R/name).read_bytes())==digest,name
count=0
for name,digest in manifest['unchangedImages'].items():
 p=R/name
 assert sha(p.read_bytes())==digest,name
 with Image.open(p) as im:im.load();assert im.width>0 and im.height>0
 count+=1
assert count==115
print(json.dumps({'unchangedImages':count,'unchangedFiles':len(manifest['unchangedFiles']),'newDrawings':0}))
