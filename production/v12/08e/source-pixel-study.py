"""Source-pixel motion study only. No final artwork or gameplay promotion.

Run with the exact K02 native PNG and an output directory. Requires numpy,
Pillow, scipy and opencv-python. Face rows 0..249 and lower rows 500..808
remain pixel-identical. No new anatomical surfaces are invented.
"""
from pathlib import Path
import argparse
import hashlib
import json
import cv2
import numpy as np
from PIL import Image
from scipy.spatial import Delaunay

SOURCE_SHA256 = '44e287124b8d713e7efd5281247f57a869b922249dfeb1edb6e08790fbadb105'
GUN = np.array([(207,303),(231,279),(274,265),(321,292),(501,396),(507,442),(470,462),(429,454),(384,421),(293,386),(246,379),(213,346)], np.float32)
PIVOT = np.array([236.,315.])


def geometry():
    xs = sorted(set(list(range(0,640,32)) + [639]))
    ys = sorted(set(list(range(250,501,20)) + [250,499,500]))
    grid = np.array([(x,y) for y in ys for x in xs], np.float32)
    points = np.unique(np.vstack([grid,GUN,[PIVOT]]), axis=0).astype(np.float32)
    return points, Delaunay(points).simplices


def targets(points, amount):
    theta = np.deg2rad(-6.) * amount
    rotation = np.array([[np.cos(theta),-np.sin(theta)],[np.sin(theta),np.cos(theta)]])
    rigid = (points-PIVOT) @ rotation.T + PIVOT + np.array([0.,-1.5])*amount
    weights = []
    for p in points:
        sd = cv2.pointPolygonTest(GUN, tuple(map(float,p)), True)
        weight = np.clip(1+sd/105.,0.,1.)
        lower = np.clip((500-float(p[1]))/27,0,1)
        upper = np.clip((float(p[1])-250)/15,0,1)
        if sd >= 0:
            lower = upper = 1
        weights.append(weight*lower*upper)
    return (points+(rigid-points)*np.array(weights)[:,None]).astype(np.float32)


def area(v):
    return (v[1,0]-v[0,0])*(v[2,1]-v[0,1])-(v[1,1]-v[0,1])*(v[2,0]-v[0,0])


def render(amount, source, points, triangles):
    if amount == 0:
        return source.copy(), 1.0
    dest = targets(points, amount)
    ratios = [float(area(dest[t])/area(points[t])) for t in triangles]
    if min(ratios) < .5:
        raise ValueError('Excessive mesh compression or inversion: reject this sample')
    h,w = source.shape[:2]
    gx,gy = np.meshgrid(np.arange(w,dtype=np.float32),np.arange(h,dtype=np.float32))
    for ids in triangles:
        a,b = points[ids],dest[ids]
        xmin = max(0,int(np.floor(b[:,0].min())))
        xmax = min(w,int(np.ceil(b[:,0].max()))+1)
        ymin = max(250,int(np.floor(b[:,1].min())))
        ymax = min(500,int(np.ceil(b[:,1].max()))+1)
        if xmin >= xmax or ymin >= ymax:
            continue
        yy,xx = np.mgrid[ymin:ymax,xmin:xmax]
        mask = np.zeros((ymax-ymin,xmax-xmin),np.uint8)
        cv2.fillConvexPoly(mask,np.round((b-[xmin,ymin])*256).astype(np.int32),1,shift=8)
        m = cv2.getAffineTransform(b,a)
        inside = mask > 0
        gx[ymin:ymax,xmin:xmax][inside] = (m[0,0]*xx+m[0,1]*yy+m[0,2])[inside]
        gy[ymin:ymax,xmin:xmax][inside] = (m[1,0]*xx+m[1,1]*yy+m[1,2])[inside]
    f = source.astype(np.float32)/255.
    f[:,:,:3] *= f[:,:,3,None]
    out = cv2.remap(f,gx,gy,cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT,borderValue=0)
    alpha = out[:,:,3:4]
    out[:,:,:3] = np.divide(out[:,:,:3],alpha,out=np.zeros_like(out[:,:,:3]),where=alpha>1e-6)
    out = np.uint8(np.clip(np.round(out*255),0,255))
    out[:250] = source[:250]
    out[500:] = source[500:]
    return out,min(ratios)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source',type=Path)
    parser.add_argument('output',type=Path)
    args = parser.parse_args()
    if hashlib.sha256(args.source.read_bytes()).hexdigest() != SOURCE_SHA256:
        raise SystemExit('Source identity mismatch: use the approved K02 native crop')
    source = np.array(Image.open(args.source).convert('RGBA'))
    if source.shape != (809,640,4):
        raise SystemExit('Wrong source dimensions')
    args.output.mkdir(parents=True,exist_ok=True)
    points,triangles = geometry()
    results = []
    for i,amount in enumerate([0,.25,.5,.75,1.]):
        out,ratio = render(amount,source,points,triangles)
        assert np.array_equal(source[:250],out[:250])
        assert np.array_equal(source[500:],out[500:])
        native = args.output/f'early_lift_study_{i:02d}_native.png'
        Image.fromarray(out).save(native)
        padded = Image.new('RGBA',(768,960),(0,0,0,0))
        padded.paste(Image.fromarray(out),(64,64))
        file = args.output/f'early_lift_study_{i:02d}.png'
        padded.save(file)
        results.append({'sample':i,'angle_degrees':-6*amount,'file':file.name,
                        'sha256':hashlib.sha256(file.read_bytes()).hexdigest(),
                        'min_area_ratio':ratio,'native_size':[640,809],
                        'canvas':[768,960],'padding':[64,64],
                        'kind':'SOURCE_PIXEL_DEFORMATION_STUDY',
                        'newly_drawn_art':False,'runtime_ready':False})
    (args.output/'manifest.json').write_text(json.dumps(results,indent=2)+'\n')
    print('Saved one original and four derived samples; no final animation approval.')


if __name__ == '__main__':
    main()
