"""Inspect recovered bytes and frame records without modifying artwork."""
from pathlib import Path
from PIL import Image
import hashlib,json,subprocess,re
R=Path(__file__).resolve().parents[1]
def digest(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def pixels(p):
    with Image.open(p) as im:
        im.load(); alpha=im.convert('RGBA').getchannel('A'); h=alpha.histogram()
        return dict(dimensions=list(im.size),mode=im.mode,alphaExtrema=list(alpha.getextrema()),transparentPixels=h[0],alphaBounds=alpha.getbbox(),sha256=digest(p))
code="""global.window=global;require('./public/vendor/assets.js');require('./public/vendor/b05-fast.js');require('./public/vendor/b06-fast.js');console.log(JSON.stringify({assets:JADE_ASSETS,b05:JadeB05Fast.records,b06:JadeB06Fast.records}));"""
data=json.loads(subprocess.check_output(['node','-e',code],cwd=R))
rows=[];errors=[]
for family,records in [('legacy-atlas',data['assets']['recoveredAtlases']),('legacy-pose',data['assets']['finalFrames']),('deformation-study',data['assets']['studyFrames']),('current-design-key',data['b05']),('current-design-key',data['b06'])]:
    for key,record in records.items():
        p=R/'public'/record['file'];actual=pixels(p);expected=record.get('runtimeDimensions',record.get('dimensions'))
        if actual['dimensions']!=expected: errors.append(f'dimensions: {key}')
        if actual['sha256']!=record['sha256']: errors.append(f'fingerprint: {key}')
        row=dict(key=key,classification=family,record=record,actual=actual)
        if family=='legacy-atlas':
            row['cells']=[{'frame':n,'rect':[(n%record['cols'])*record['cell'],(n//record['cols'])*record['cell'],record['cell'],record['cell']]} for n in range(record['frames'])]
            row['directionStatus']='nominal catalog direction; precise yaw and current-design identity not certified'
        else: row['cells']=[{'frame':0,'rect':[0,0,*actual['dimensions']]}]
        rows.append(row)
baseline=json.loads((R/'recovery/B11-SOURCE-HASHES.json').read_text())
image_changes=[f for f,d in baseline.items() if f.startswith('public/assets/') and digest(R/f)!=d]
protected=['public/vendor/core.js','public/duel-browser.js','source/duel.cjs','public/local-input.js','public/slide-gate.js','public/vendor/action-controller.js','public/vendor/motion-flow.js','public/vendor/stance-registration.js','public/vendor/cover-router.js']
protected_changes=[f for f in protected if digest(R/f)!=baseline[f]]
previous=json.loads((R/'recovery/RECOVERY-AUDIT.json').read_text()) if (R/'recovery/RECOVERY-AUDIT.json').exists() else {}
candidates=[]
for p in sorted((R/'art-review').glob('*.png')):
    candidates.append(dict(file=str(p.relative_to(R)),**pixels(p),referenceApproval='not requested for failed export',runtimeStatus='REJECTED_OPAQUE_CHECKERBOARD',installed=False,poseReview='right-step extraction attempt still contains an opaque checkerboard'))
board_path=R/'recovery/Batch17-reference.png'
if board_path.exists(): board=pixels(board_path)
else: board={'byteRecheck':'not performed; recover the original board using the handoff source ID'}
if not candidates and previous.get('newCandidates'):
    candidates=[dict(c,byteRecheck='not performed; generated review originals are outside the source overlay') for c in previous['newCandidates']]
unique_current={v['file'] for v in list(data['b05'].values())+list(data['b06'].values())}
inventory=dict(project='GOD MODE: BREAK THE CODE',checkpoint='B11 Cover Test R2',runtimeImageFiles=len(list((R/'public/assets').rglob('*.png')))+len(list((R/'public/assets').rglob('*.webp'))),registeredRecords=len(rows),currentDesignUniqueExports=len(unique_current),currentDesignFiles=sorted(unique_current),records=rows)
(R/'recovery/SPRITE-INVENTORY.json').write_text(json.dumps(inventory,indent=2))
result=dict(runtimeFiles=inventory['runtimeImageFiles'],currentDesignUniqueExports=len(unique_current),recordErrors=errors,changedExistingImages=image_changes,changedProtectedSimulationFiles=protected_changes,protectedFiles={f:digest(R/f) for f in protected},batch17=dict(**board,presentationPanels=7,printedClaim=204,verifiedCurrentDesignSpriteCount=4,status='OPAQUE_REFERENCE_ONLY; no individual C193-C204 exports located in recovered package or inspected GitHub art tree'),newCandidates=candidates,newAcceptedExports=0,artworkApproval='LV01 authority preserved; current exports inherited as accepted keys',animationValidation='rough poses only; full continuity and 24-direction high-detail coverage pending',integration='R2 render-only cover size/anchor calibration; recovered run/backpedal cycles used as explicit temporary cover-travel art; original simulation unchanged',deployment=False)
(R/'recovery/RECOVERY-AUDIT.json').write_text(json.dumps(result,indent=2))
assert not errors and not image_changes and not protected_changes,result
print(json.dumps({k:result[k] for k in ['runtimeFiles','currentDesignUniqueExports','recordErrors','changedExistingImages','changedProtectedSimulationFiles','newAcceptedExports']}))
