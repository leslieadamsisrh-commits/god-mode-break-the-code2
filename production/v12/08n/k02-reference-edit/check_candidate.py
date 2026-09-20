"""Check a local edit candidate; a technical pass never grants art approval.
Usage: python tools/check_candidate.py /path/to/candidate.png
Requires Pillow and numpy. Run from the complete Reference Edit Kit.
No network access or game changes.
"""
from pathlib import Path
import argparse,json
from PIL import Image
import numpy as np
ROOT=Path(__file__).resolve().parent.parent

def check(path:Path)->dict:
    with Image.open(path) as im:
        mode=im.mode
        size=im.size
        if mode!='RGBA' or size!=(768,960):
            return {'structuralPass':False,'reason':'Expected native-pixel RGBA edit on 768x960 canvas','actualMode':mode,'actualSize':list(size),'runtimeReady':False}
        a=np.array(im)
    source=np.array(Image.open(ROOT/'edit/K02_edit_canvas.png').convert('RGBA'))
    editable=np.array(Image.open(ROOT/'edit/K02_edit_mask_white_editable.png').convert('L'))==255
    changed=np.any(a!=source,axis=2)
    protected_changes=int(np.sum(changed&~editable))
    editable_changes=int(np.sum(changed&editable))
    alpha=a[:,:,3]
    border=np.zeros(alpha.shape,dtype=bool);border[:24]=True;border[-24:]=True;border[:,:24]=True;border[:,-24:]=True
    checks={'protectedPixelsUnchanged':protected_changes==0,'editablePixelsActuallyChanged':editable_changes>0,
            'transparentMargin24px':bool(np.all(alpha[border]==0)),
            'realTransparency':bool(np.any(alpha==0)),'visibleCharacter':bool(np.any(alpha>200))}
    return {'structuralPass':all(checks.values()),'checks':checks,'changedProtectedPixels':protected_changes,
            'changedEditablePixels':editable_changes,'runtimeReady':False,
            'manualReviewRequired':['identity','biomechanics','continuity','gameplay','render'],
            'warning':'Passing this check does not establish a plausible new pose or an accepted sprite.'}

if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('candidate',type=Path);args=p.parse_args()
    try:
        result=check(args.candidate)
    except (OSError,ValueError) as exc:
        result={'structuralPass':False,'reason':str(exc),'runtimeReady':False}
    print(json.dumps(result,indent=2));raise SystemExit(0 if result['structuralPass'] else 1)
