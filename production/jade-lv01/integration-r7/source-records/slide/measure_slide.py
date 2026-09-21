"""Read-only source-image analysis; writes geometry metadata only, never image pixels."""
from pathlib import Path
import hashlib,json
import numpy as np
from PIL import Image
from scipy.ndimage import label,find_objects,distance_transform_edt

base=Path(__file__).parent
source=base/'slide-8key-candidate-v3-chroma.png'
a=np.asarray(Image.open(source)).astype(int)
h,w=a.shape[:2]
# Analysis foreground only; not a proposed production alpha mask.
fg=~((a[:,:,1]>180)&(a[:,:,1]>a[:,:,0]+80)&(a[:,:,1]>a[:,:,2]+80))
components,n=label(fg)
main=[1,2,4,3,28,26,25,24]
main_owner=np.zeros((h,w),np.uint8)
for i,c in enumerate(main):main_owner[components==c]=i+1
# Assign tiny detached antialias/strand components to nearest large silhouette.
_,nearest=distance_transform_edt(main_owner==0,return_indices=True)
owner=main_owner.copy()
minor=fg&(main_owner==0)
owner[minor]=main_owner[nearest[0][minor],nearest[1][minor]]

separators={}
min_gaps=[]
for row_ids,y0,y1 in [(list(range(1,5)),0,444),(list(range(5,9)),444,h)]:
 for left_id,right_id in zip(row_ids,row_ids[1:]):
  leftmax=np.full(y1-y0,np.nan);rightmin=leftmax.copy()
  for y in range(y0,y1):
   left=np.where(owner[y]==left_id)[0];right=np.where(owner[y]==right_id)[0]
   if len(left):leftmax[y-y0]=left.max()
   if len(right):rightmin[y-y0]=right.min()
  both=np.isfinite(leftmax)&np.isfinite(rightmin)
  gaps=rightmin[both]-leftmax[both]-1
  assert np.all(gaps>0),(left_id,right_id,gaps.min())
  valid=np.where(both)[0]
  # Pixel boundary lies in green gap. Interpolation only where a silhouette is absent.
  sep=np.interp(np.arange(y1-y0),valid,(leftmax[both]+rightmin[both]+1)/2)
  sep=np.where(np.isfinite(leftmax),np.maximum(sep,np.nan_to_num(leftmax)+2),sep)
  sep=np.where(np.isfinite(rightmin),np.minimum(sep,np.nan_to_num(rightmin,nan=w)-1),sep)
  sep=np.floor(sep).astype(int)
  separators[(left_id,right_id)]={'y0':y0,'x':sep}
  min_gaps.append({'between':[left_id,right_id],'minimumPixels':int(gaps.min())})

names=['entry-crouch','foot-forward','full-low-slide','braking-slide','compressed-stop','planted-recovery','rising-crouch','ready']
landmarks=[
 {'root':[228,402],'pelvis':[228,270],'helmet':[250,110],'muzzle':[400,197],'feet':[{'point':[189,397],'visibility':'planted visible'},{'point':[282,332],'visibility':'tucked partly obscured; low confidence'}]},
 {'root':[658,402],'pelvis':[658,303],'helmet':[636,145],'muzzle':[819,215],'feet':[{'point':[852,391],'visibility':'extended visible'},{'point':[604,397],'visibility':'planted visible'}]},
 {'root':[1100,402],'pelvis':[1100,354],'helmet':[1084,183],'muzzle':[1289,253],'feet':[{'point':[1329,390],'visibility':'extended visible'},{'point':[1080,391],'visibility':'folded leg obscured; low confidence'}]},
 {'root':[1530,405],'pelvis':[1530,310],'helmet':[1558,165],'muzzle':[1743,237],'feet':[{'point':[1730,390],'visibility':'braking extended visible'},{'point':[1504,397],'visibility':'planted visible'}]},
 {'root':[252,823],'pelvis':[252,732],'helmet':[258,571],'muzzle':[427,657],'feet':[{'point':[206,815],'visibility':'planted visible'},{'point':[295,788],'visibility':'folded partly obscured; low confidence'}]},
 {'root':[655,827],'pelvis':[655,755],'helmet':[724,546],'muzzle':[901,628],'feet':[{'point':[516,806],'visibility':'rear bent visible'},{'point':[780,815],'visibility':'front planted visible'}]},
 {'root':[1135,827],'pelvis':[1135,714],'helmet':[1162,515],'muzzle':[1323,623],'feet':[{'point':[1075,816],'visibility':'front planted visible'},{'point':[1136,786],'visibility':'rear partly obscured; low confidence'}]},
 {'root':[1555,827],'pelvis':[1555,685],'helmet':[1605,514],'muzzle':[1759,586],'feet':[{'point':[1477,818],'visibility':'rear planted visible'},{'point':[1689,814],'visibility':'front planted visible'}]}
]

def simplify_polygon(points):
 p=[]
 for v in points:
  v=list(map(int,v))
  if not p or v!=p[-1]:p.append(v)
 while True:
  out=[]
  for i,b in enumerate(p):
   aa=p[(i-1)%len(p)];c=p[(i+1)%len(p)]
   if (b[0]-aa[0])*(c[1]-b[1])==(b[1]-aa[1])*(c[0]-b[0]):continue
   out.append(b)
  if len(out)==len(p):return p
  p=out

frames=[]
for i,name in enumerate(names):
 frame_id=i+1
 ys,xs=np.where(owner==frame_id)
 bounds=[int(xs.min()),int(ys.min()),int(xs.max()+1),int(ys.max()+1)]
 x0,y0,x1,y1=[max(0,bounds[0]-6),max(0,bounds[1]-6),min(w,bounds[2]+6),min(h,bounds[3]+6)]
 left=np.full(y1-y0,x0,dtype=int);right=np.full(y1-y0,x1,dtype=int)
 if (frame_id-1,frame_id) in separators:
  s=separators[(frame_id-1,frame_id)];left=np.maximum(left,s['x'][y0-s['y0']:y1-s['y0']])
 if (frame_id,frame_id+1) in separators:
  s=separators[(frame_id,frame_id+1)];right=np.minimum(right,s['x'][y0-s['y0']:y1-s['y0']])
 # Exact stepped row partition boundary, compressed only by collinear removal.
 poly=[(left[0],y0),(right[0],y0)]
 for j,y in enumerate(range(y0,y1)):
  poly.append((right[j],y+1))
  if j+1<len(right):poly.append((right[j+1],y+1))
 poly.append((left[-1],y1))
 for j in range(len(left)-1,-1,-1):
  poly.append((left[j],y0+j))
  if j>0:poly.append((left[j-1],y0+j))
 poly=simplify_polygon(poly)
 selected=owner[y0:y1,x0:x1]
 columns=np.arange(x0,x1)[None,:]
 inside=(columns>=left[:,None])&(columns<right[:,None])
 own=selected==frame_id;other=(selected!=0)&(selected!=frame_id)
 missed=int(np.count_nonzero(own&~inside));contamination=int(np.count_nonzero(other&inside))
 assert missed==0 and contamination==0,(frame_id,missed,contamination)
 local={k:([v[0]-x0,v[1]-y0] if isinstance(v,list) and len(v)==2 and isinstance(v[0],int) else v) for k,v in landmarks[i].items() if k!='feet'}
 local['feet']=[dict(f,point=[f['point'][0]-x0,f['point'][1]-y0]) for f in landmarks[i]['feet']]
 frames.append({'id':frame_id,'name':name,'silhouetteBounds':bounds,'cropRect':{'x':x0,'y':y0,'width':x1-x0,'height':y1-y0},'clipPolygon':poly,'clipCoordinateSpace':'original sheet; exact per-row ownership partition','landmarksSheet':landmarks[i],'landmarksCrop':local,'analysisValidation':{'assignedForegroundPixels':int(own.sum()),'missedForegroundPixels':missed,'neighborForegroundPixels':contamination},'pixelEditingPerformed':False})
result={'sourceFile':str(source),'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'sourceDimensions':[w,h],'sourceMode':'RGB','sourceUnmodified':True,'status':'unapproved candidate measured for runtime chroma-key review','coordinateConvention':'Top-left sheet origin; rectangles right/bottom exclusive. clipPolygon uses original sheet pixels; translate by negative crop x/y when drawing per-frame canvas.','rootDefinition':'Approximate pelvis x projected to per-frame lowest contact baseline. This is a registration suggestion, not verified biomechanics.','landmarkAccuracy':'Manual approximations, typically within 10-20px; marked hidden feet are especially uncertain.','transparencyNotes':'Chroma source has no alpha. Mask measurement threshold is not a recommended chroma algorithm. Protect legitimate green battery details.','minimumSilhouetteGaps':min_gaps,'frames':frames}
(base/'slide-runtime-geometry.json').write_text(json.dumps(result,separators=(',',':'))+'\n')
print(json.dumps({'output':str(base/'slide-runtime-geometry.json'),'minimumGaps':min_gaps,'frames':[{'id':f['id'],'name':f['name'],'bounds':f['silhouetteBounds'],'crop':f['cropRect'],'polygonVertices':len(f['clipPolygon']),'validation':f['analysisValidation']} for f in frames]},indent=2))
