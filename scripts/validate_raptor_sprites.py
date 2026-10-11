#!/usr/bin/env python3
"""Validate uncropped transparent Raptor PNGs before installation.

Usage: python scripts/validate_raptor_sprites.py path/to/manifest.json
Requires Pillow. Does not edit images or game code.
"""
import json,sys
from pathlib import Path
from PIL import Image
REQUIRED=("R001","R002","R003","R004","R005","R006")
def validate(path):
    data=json.loads(path.read_text())
    frames=data.get("frames",{})
    problems=[]
    for name in REQUIRED:
        item=frames.get(name)
        if not item:
            problems.append(f"{name}: missing manifest entry");continue
        source=(path.parent/item.get("file","")).resolve()
        if not source.is_file():
            problems.append(f"{name}: missing file");continue
        with Image.open(source) as image:
            if image.mode!="RGBA":
                problems.append(f"{name}: not RGBA");continue
            alpha=image.getchannel("A")
            if alpha.getextrema()[0]==255:problems.append(f"{name}: no transparent pixels")
            w,h=image.size
            if w<64 or h<64:problems.append(f"{name}: resolution too small")
            # Any nontransparent pixel on canvas boundary may indicate clipped silhouette.
            for edge,box in (("top",(0,0,w,1)),("bottom",(0,h-1,w,h)),("left",(0,0,1,h)),("right",(w-1,0,w,h))):
                if alpha.crop(box).getbbox():problems.append(f"{name}: opaque pixels on {edge} boundary")
            anchor=item.get("groundAnchor")
            if not isinstance(anchor,dict) or not all(isinstance(anchor.get(k),(int,float)) for k in ("x","y")):
                problems.append(f"{name}: ground anchor missing")
            elif not (0<=anchor["x"]<w and 0<=anchor["y"]<h):
                problems.append(f"{name}: ground anchor out of bounds")
            if not item.get("fullSilhouetteReviewed"):problems.append(f"{name}: full silhouette not manually approved")
            if not item.get("scaleReviewed"):problems.append(f"{name}: scale not manually approved")
    print(json.dumps({"result":"PASS" if not problems else "HOLD","checked":len(REQUIRED),"problems":problems},indent=2))
    return not problems
if __name__=="__main__":
    if len(sys.argv)!=2:sys.exit("Usage: python scripts/validate_raptor_sprites.py manifest.json")
    sys.exit(0 if validate(Path(sys.argv[1])) else 1)
