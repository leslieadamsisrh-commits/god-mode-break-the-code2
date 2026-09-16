"""Audit canonical existing art and assemble Batch 1 reference metadata only.

No gameplay edits and no drawing generation. Contact sheets are disposable;
the HTML preview references canonical source files without duplicating them.
"""
from pathlib import Path
from collections import defaultdict, Counter
from PIL import Image
import hashlib
import json

ROOT = Path(__file__).resolve().parents[1]
BASE = ROOT/'recovery/shotgun-lab-v57'
OUT = ROOT/'sprites/manifests'

def sha(data): return hashlib.sha256(data).hexdigest()

def write(name, value):
    options = {'separators':(',',':')} if name=='existing-asset-inventory.json' else {'indent':2}
    (OUT/name).write_text(json.dumps(value, **options)+'\n')

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = json.loads((BASE/'assets/shotgun-complete/manifest.json').read_text())
    measured = json.loads((ROOT/'docs/muzzle-registration.json').read_text())
    sockets = {(m['familyId'],m['frameIndex']):m for m in measured['measurements']}
    paths = sorted(set(p for directory in [BASE/'assets',ROOT/'art-production',ROOT/'experiments/shotgun-powered-duel/art-next']
                       for p in directory.rglob('*') if p.is_file() and p.suffix.lower() in {'.png','.webp','.jpg','.jpeg'}))
    files=[]; hashes=defaultdict(list)
    for path in paths:
        data=path.read_bytes(); relative=path.relative_to(ROOT).as_posix(); h=sha(data)
        hashes[h].append(relative)
        kind = ('approved-runtime-dependency' if '/assets/' in relative else
                'rejected-source-attempt' if any(s in path.name for s in ['rejected','attempt','source-rgb']) else
                'reproducible-proof-or-extraction' if any(s in path.name for s in ['review-','extracted-master']) else
                'selected-source-master' if 'blue-key-source' in path.name else 'provisional-runtime-study')
        try:
            with Image.open(path) as im:
                im.load()
                files.append({'path':relative,'sha256':h,'bytes':len(data),'size':list(im.size),'mode':im.mode,
                              'category':kind,'decode':'ok','visualStatus':'not-reapproved-by-inventory'})
        except Exception as exc:
            files.append({'path':relative,'sha256':h,'bytes':len(data),'category':kind,'decode':'failed','reason':str(exc)})
    families=[]; frame_hashes=defaultdict(list); batch=[]
    for f in manifest['families']:
        if f['status']!='lab-test': continue
        source=BASE/f['url']; runtime=BASE/f['runtimeUrl']; problems=[]; bounds=[]
        if not source.exists(): problems.append('full-resolution-source-not-recovered')
        im=Image.open(runtime).convert('RGBA'); w,h=f['runtimeCell']; cols,rows=f['grid']
        if im.size!=(cols*w,rows*h): problems.append('incorrect-grid')
        if sha(runtime.read_bytes())!=f['runtimeSha256']: problems.append('runtime-hash-mismatch')
        for frame in range(f['totalFrames']):
            cell=im.crop((frame%cols*w,frame//cols*h,frame%cols*w+w,frame//cols*h+h))
            alpha=cell.getchannel('A'); bbox=alpha.getbbox()
            # Very faint antialiasing is retained but does not alone prove cutoff.
            solid=alpha.point(lambda a:255 if a>=16 else 0).getbbox()
            frame_hashes[sha(cell.tobytes())].append({'family':f['id'],'frame':frame})
            issue=[]
            if bbox is None: issue.append('empty-frame')
            if solid and (solid[0]<=1 or solid[1]<=1 or solid[2]>=w-1 or solid[3]>=h-1): issue.append('edge-contact-needs-visual-review')
            if alpha.getextrema()[0]==255: issue.append('opaque-cell-needs-background-review')
            bounds.append({'frame':frame,'alphaBounds':bbox,'solidBounds':solid,'issues':issue})
            if f['action']=='ready' and frame==0:
                socket=sockets.get((f['id'],0)); usable=socket and socket['runtimeAssetSha256']==f['runtimeSha256']
                muzzle=([socket['x'],socket['y']] if usable and socket.get('x') is not None else None)
                batch.append({'assetId':'heroine-shotgun-reference-'+f['id'],'character':'heroine','weapon':'shotgun',
                              'action':'combat-ready-reference','directionIndex':f['nominalDirection'],
                              'nominalYawDegrees':f['nominalDirection']*15,'certifiedYawDegrees':None,
                              'frameNumber':0,'animationStage':'reference-pose','sourceVersion':f['runtimeSha256'],
                              'runtimeAtlasAssignment':runtime.relative_to(ROOT).as_posix(),'cell':[w,h],'alphaBounds':bbox,
                              'footAnchor':[125,219],'anchorStatus':'inherited-runtime-ground-reference-not-anatomical-certification',
                              'handAnchors':None,'weaponAnchor':None,'muzzlePosition':muzzle,
                              'muzzleStatus':socket.get('reviewClassification') if usable else 'unknown',
                              'coverContactAnchor':None,'collisionReference':{'actorRadiusWorldUnits':17,'boundsInImagePixels':None},
                              'reviewStatus':'pending-identity-and-exact-angle-review','automatedIssues':issue})
        families.append({'id':f['id'],'action':f['action'],'direction':f['nominalDirection'],
                         'sourcePath':source.relative_to(ROOT).as_posix(),'sourcePresent':source.exists(),
                         'runtimePath':runtime.relative_to(ROOT).as_posix(),'runtimeSha256':f['runtimeSha256'],
                         'frames':f['totalFrames'],'issues':problems,'frameAudit':bounds,
                         'visualStatus':'existing-lab-study-not-production-certified'})
    duplicates=[{'sha256':h,'paths':p} for h,p in hashes.items() if len(p)>1]
    repeated=[{'rgbaSha256':h,'frames':p} for h,p in frame_hashes.items() if len(p)>1]
    summary={'sourceImageFilesInventoried':len(files),'uniqueImageHashes':len(hashes),'exactDuplicateFileGroups':len(duplicates),
             'duplicateFilesBeyondFirst':sum(len(g['paths'])-1 for g in duplicates),
             'runtimeFamilies':len(families),'runtimeFrames':sum(f['frames'] for f in families),
             'sourceMastersMissing':sum(not f['sourcePresent'] for f in families),
             'unreadableImages':sum(f['decode']!='ok' for f in files),
             'framesWithAutomatedFlags':sum(bool(fr['issues']) for f in families for fr in f['frameAudit']),
             'identicalFrameGroups':len(repeated),'inventoryCategories':dict(Counter(f['category'] for f in files)),
             'batch1ReferenceFramesReused':len(batch),'batch1FramesCreated':0,'batch1FramesRepaired':0,
             'newDirectionalDrawings':0,'visuallyApprovedByThisAudit':0,
             'certifiedComplete24DirectionFamilies':0}
    write('existing-asset-inventory.json',{'schemaVersion':1,'scope':'canonical recovered assets and local art studies; excludes symlink aliases and streaming caches',
          'summary':summary,'files':files,'exactDuplicateFiles':duplicates,'identicalRuntimeFrames':repeated,'families':families})
    write('batch-01-identity.json',{'schemaVersion':1,'batch':1,'status':'reference-selection-ready-for-review-not-final-model-lock',
          'angleConvention':manifest['angleConvention'],'identityBasis':'latest approved recovered Shotgun Lab; art is reused unchanged',
          'sourceManifestSha256':sha((BASE/'assets/shotgun-complete/manifest.json').read_bytes()),
          'frames':sorted(batch,key=lambda b:b['directionIndex']),
          'blockers':['Exact 15-degree yaw is not certified.', 'Original full-resolution masters are missing for most views.',
                      'Backpack segment count, cable layout and limb proportions require a shared turnaround check.',
                      'Hand/weapon and cover-contact anchors remain unregistered; null is intentional.']})
    write('inventory-summary.json',summary)
    print(json.dumps(summary))

if __name__=='__main__': main()
