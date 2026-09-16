"""User-authorized sprite extraction/registration. Preserves all non-key pixels.

No connected-component deletion, dilation, limb cleanup, or inpainting. Pure-blue
production backgrounds are keyed by hue separation from cyan/magenta equipment.
Results remain provisional; they are not approved 24-direction families.
"""
from pathlib import Path
import json, hashlib
import numpy as np
from PIL import Image
root=Path(__file__).resolve().parents[1]
dest=root/'experiments/shotgun-powered-duel/art-next';dest.mkdir(exist_ok=True)
specs=[('dash','upright-dash-front-right-v3-blue-key-source.png',[(258,492),(266,496),(289,496),(285,470),(268,463),(278,478)]),('charge','charge-d03-6frames-blue-key-source.png',[(298,497),(292,497),(287,497),(308,477),(302,477),(292,477)])]
reports=[]
for family,name,anchors in specs:
 source=root/'art-production'/family/name
 image=Image.open(source).convert('RGB');rgb=np.array(image,dtype=np.float32)
 r,g,b=rgb[:,:,0],rgb[:,:,1],rgb[:,:,2]
 # Background has B>240, R<3,G<26. Soft transition only in strongly blue edge pixels.
 excess=b-np.maximum(r,g)
 confidence=np.minimum(np.clip((excess-70)/105,0,1),np.clip((b-100)/100,0,1))
 confidence*=np.clip((100-np.maximum(r,g))/55,0,1)
 alpha=np.rint((1-confidence)*255).astype(np.uint8)
 rgba=np.dstack((rgb.astype(np.uint8),alpha));masked=Image.fromarray(rgba)
 masked.save(dest/(family+'-d03-extracted-master.png'))
 atlas=Image.new('RGBA',(750,500));frame_records=[]
 for index,(ax,ay) in enumerate(anchors):
  cell=masked.crop(((index%3)*512,(index//3)*512,(index%3+1)*512,(index//3+1)*512))
  tile=Image.new('RGBA',(250,250));small=cell.resize((205,205),Image.Resampling.LANCZOS)
  offset=(round(125-ax*205/512),round(219-ay*205/512));tile.alpha_composite(small,offset)
  atlas.alpha_composite(tile,((index%3)*250,(index//3)*250))
  frame_records.append({'index':index,'sourceAnchor':[ax,ay],'runtimeAnchor':[125,219],'bbox':tile.getbbox()})
 atlas.save(dest/(family+'-d03-6frames.png'))
 for background,color in [('light',(238,238,238)),('dark',(20,23,30)),('checker',None)]:
  preview=Image.new('RGB',atlas.size,color or (160,160,160))
  if color is None:
   from PIL import ImageDraw
   draw=ImageDraw.Draw(preview)
   for y in range(0,500,16):
    for x in range(0,750,16):
     if (x//16+y//16)%2: draw.rectangle((x,y,x+15,y+15),fill=(210,210,210))
  preview.paste(atlas,mask=atlas.getchannel('A'));preview.save(dest/(family+'-review-'+background+'.png'))
 reports.append({'family':family,'direction':3,'frames':frame_records,'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'runtimeSha256':hashlib.sha256((dest/(family+'-d03-6frames.png')).read_bytes()).hexdigest(),'status':'provisional-extracted-needs-motion-review','method':'conservative-blue-chroma-key-no-component-removal','missingDirections':23})
(dest/'art-review.json').write_text(json.dumps(reports,indent=2)+'\n')
print(json.dumps([{'family':r['family'],'frames':len(r['frames']),'status':r['status']} for r in reports]))
