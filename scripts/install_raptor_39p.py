#!/usr/bin/env python3
"""Install the Build 39P Raptor review ZIP into the existing game.
Only run with a local ZIP explicitly supplied. Reject corrupt or unsafe paths.
Never modifies gameplay, camera, or the XYZ baseline.
"""
import argparse, io, json, pathlib, zipfile
from PIL import Image

DIRECTIONS=("right","front-right","front","front-left","left","back-left","back","back-right")
COUNTS={"run":4,"idle":4}
def main():
    p=argparse.ArgumentParser()
    p.add_argument("archive", type=pathlib.Path)
    p.add_argument("--destination",type=pathlib.Path,default=pathlib.Path("public/assets/raptor-v2"))
    p.add_argument("--install",action="store_true",help="Write validated assets (default: audit only)")
    a=p.parse_args()
    required={f"{family}/{direction}/{i:03}.png" for family,n in COUNTS.items() for direction in DIRECTIONS for i in range(n)}
    validated={}; defects=[]
    with zipfile.ZipFile(a.archive) as z:
        for member in z.infolist():
            name=member.filename.replace("\\","/")
            if member.is_dir(): continue
            if ".." in pathlib.PurePosixPath(name).parts or name.startswith("/"):
                raise ValueError(f"Unsafe archive path: {name}")
            matching=[key for key in required if name==key or name.endswith("/"+key)]
            if not matching: continue
            key=matching[0]
            if key in validated:
                defects.append(f"duplicate {key}");continue
            raw=z.read(member)
            try:
                with Image.open(io.BytesIO(raw)) as im:
                    if im.format!="PNG" or im.size!=(512,512) or im.mode!="RGBA":
                        defects.append(f"invalid format/dimensions: {key}");continue
                    extrema=im.getchannel("A").getextrema()
                    if extrema[0]==extrema[1]:
                        defects.append(f"no alpha variation: {key}");continue
                validated[key]=raw
            except Exception as e: defects.append(f"unreadable {key}: {e}")
    missing=sorted(required-set(validated))
    report={"validated_format":len(validated),"required":len(required),"missing":missing,"defects":defects,
            "visual_quality":"NOT VERIFIED — source crops remain provisional",
            "installed":False}
    if a.install and not missing and not defects:
        for key,raw in validated.items():
            target=a.destination/key
            target.parent.mkdir(parents=True,exist_ok=True)
            target.write_bytes(raw)
        report["installed"]=True
    print(json.dumps(report,indent=2))
    if missing or defects: raise SystemExit(2)
if __name__=="__main__":main()
