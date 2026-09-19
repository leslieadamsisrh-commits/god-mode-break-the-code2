"""Assemble 08H from the exact unpacked 08G package, into a NEW directory.
The original baseline and artwork are never overwritten. Requires Python only.
Place this script beside motion-flow.js. Asset binaries come from the 08G ZIP.
"""
from pathlib import Path
import argparse,hashlib,json,shutil

def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def change(text,old,new):
    if old not in text:raise ValueError('Expected source fragment missing: '+old[:90])
    return text.replace(old,new)
def build(base,r,module):
    expected={'core.js':'19c912d6c377bdf66047e03f3a263522b6e0f9deb8c3b6caaa7f2d2ac23ea73f','app.js':'f8f91f2408e4d5537a8fbe8d1e899af50133092a9ba5bbe47c354f539eb74874','index.html':'e20cdd83bd93dce060bccb29d79a2dcc461e6d6c5687c870d947ee8d558dd660','style.css':'9e3f60e689b85dab2061420215445d69d3b0aef2ba4583b448b51b2a5f5cceed','action-controller.js':'1ee3cb5820a24384d57f4c50140c0ce3b2c8478f17bccbd61917a395daa1359d','tools/build_standalone.py':'309bb1ff08f80bd19bad89673ff7b595148f3a5d5ed09870a92ae2737b8459f4'}
    for name,digest in expected.items():
        if sha(base/name)!=digest:raise ValueError('Baseline fingerprint mismatch: '+name)
    if sha(module)!='fd1eccc05157ee339cf7b3dbfd05a31be2b2918f0b447bd93f4a9726880e74aa':raise ValueError('Motion module mismatch')
    if r.exists():raise ValueError('Select a new output directory')
    r.mkdir(parents=True)
    for name in ['core.js','action-controller.js','app.js','index.html','style.css','assets.js','asset-manifest.json']:shutil.copy2(base/name,r/name)
    for name in ['assets','tools','references']:shutil.copytree(base/name,r/name)
    for name in ['tests','evidence']:(r/name).mkdir()
    for p in (base/'tests').glob('*.cjs'):shutil.copy2(p,r/'tests'/p.name)
    shutil.copy2(module,r/'motion-flow.js')
    s=(r/'app.js').read_text()
    replacements=[
      ('A=window.JADE_ASSETS,','A=window.JADE_ASSETS,Flow=window.JadeFlow,'),
      ('world=new C.World()','world=new Flow.World()'),
      ('liftStudy:false};','liftStudy:false,flowMode:true};const directions=new WeakMap();let frameTrace=[],traceKey="";'),
      ('slide=!!edges.ShiftLeft||!!edges.ShiftRight,attach=','slide=!!edges.ShiftLeft||!!edges.ShiftRight,wrap=!!edges.Space,attach='),
      ('if(lx||ly){x=lx>.2?1:lx<-.2?-1:0;y=ly>.2?1:ly<-.2?-1:0;}',"if(settings.flowMode?Math.hypot(pad.axes[0]||0,pad.axes[1]||0)>.18:(lx||ly)){if(settings.flowMode){const v=Flow.radial(pad.axes[0]||0,pad.axes[1]||0);x=v.x;y=v.y;}else{x=lx>.2?1:lx<-.2?-1:0;y=ly>.2?1:ly<-.2?-1:0;}}"),
      ('slide=slide||edge(0);attach=','slide=slide||edge(0);wrap=wrap||edge(1);attach='),
      ('Controller connected · A slide/kick · X attach · LT aim · RT fire','Controller connected · A slide/kick · B wrap corner · X attach · LT/RT aim/fire'),
      ('return{x,y,slide,attach,fire,aimHeld,aim};','return{x,y,slide,wrap,attach,fire,aimHeld,aim};'),
      ('function reset(start){world.reset(start);','function reset(start){world.reset(start);world.setFlow(settings.flowMode);directions.delete(world.p);frameTrace=[];traceKey="";'),
      ("for(const id of ['finalArt'","$('flowMode').onchange=e=>{settings.flowMode=e.target.checked;world.setFlow(settings.flowMode);directions.delete(world.p);draw();};\nfor(const id of ['finalArt'"),
      ('events:world.events,inputs:world.inputs','events:world.events,inputs:world.inputs,frameTrace'),
      ("let family=actor.cover?'cover'","let family=actor.cover||actor.cornerTravel?'cover'"),
      ('let angle=actor.aim;if(actor.slide>0)','let angle=actor.cornerTravel?actor.wrapFacing??actor.aim:actor.aim;if(actor.slide>0)'),
      ("Math.hypot(actor.vx,actor.vy)>8?'run'","Math.hypot(actor.vx,actor.vy)>(settings.flowMode?1:8)?'run'"),
      ("let direction=((Math.round(angle/(Math.PI/12))%24)+24)%24;if(family==='backpedal'||family.startsWith('strafe'))direction=(Math.round(direction/6)*6)%24;","""const coarse=family==='backpedal'||family.startsWith('strafe');let direction;
 if(settings.flowMode){let states=directions.get(actor);if(!states){states={};directions.set(actor,states);}const count=coarse?4:24;const selected=Flow.facing(angle,count,states[family]);states[family]=selected;direction=selected*(coarse?6:1);}
 else{direction=((Math.round(angle/(Math.PI/12))%24)+24)%24;if(coarse)direction=(Math.round(direction/6)*6)%24;}"""),
      ("if(!im){record=A.recoveredAtlases['ready:'+direction];im=requestAtlas(record);if(!im)return null;}","if(!im){record=A.recoveredAtlases['ready:'+direction];im=requestAtlas(record);if(!im)return null;family='ready';}"),
      ('const cs=record.cell;return{final:false',"if(settings.flowMode)frame=Flow.frameAt(actor.flowDistance||0,record.frames,family,actor.slide);\n const cs=record.cell;return{final:false"),
      ('g.restore();lastFrame=frame;}',"g.restore();lastFrame=frame;const key=frame.id+'|'+frame.file;if(key!==traceKey){frameTrace.push({tick:world.tick,id:frame.id,file:frame.file,flow:settings.flowMode,distance:world.p.flowDistance||0});if(frameTrace.length>1200)frameTrace.shift();traceKey=key;}}"),
      ("const wanted=new Set(['action'","$('flowDetails').textContent=(settings.flowMode?'08H FLOW':'08G COMPARISON')+' · SPEED '+Math.hypot(p.vx,p.vy).toFixed(1)+' · TRAVEL '+(p.flowDistance||0).toFixed(1)+(p.cornerTravel?' · WRAP '+Math.round(p.cornerTravel.distance/p.cornerTravel.length*100)+'%':'');\n const wanted=new Set(['corner_wrap_start','corner_wrap_end','corner_wrap_blocked','corner_wrap_cancel','flow_mode','action'"),
      ('V12 · 08G / LIVE ACTION VALIDATION','V12 · 08H / MOVEMENT + ART FLOW'),
      ('One view · 3 source poses · optional 4 small-lift studies · authored recoil missing','Analog movement · weighted shimmy · B / Space corner wrap · final art is one-view / three keys'),
      ('Shift / A exits.','B / Space rounds corner · Shift / A exits.'),
      ('frameKind:lastFrame?.kind,settings','frameKind:lastFrame?.kind,flowEnabled:world.flowEnabled,frameTrace:frameTrace.slice(-5),settings'),
      ('Object.assign(settings,s);for(const id',"Object.assign(settings,s);if('flowMode' in s)world.setFlow(!!s.flowMode);for(const id"),
      ('V12-08G','V12-08H'),('08G-gameplay.webm','08H-gameplay.webm')
    ]
    for old,new in replacements:s=change(s,old,new)
    (r/'app.js').write_text(s)
    h=(r/'index.html').read_text().replace('08G','08H').replace('LIVE ACTION VALIDATION','MOVEMENT + ART FLOW')
    h=change(h,'<section class="action-panel"><b>','<section class="action-panel"><div id="flowDetails"></div><b>')
    h=change(h,'<label><input id="finalArt"','<label><input id="flowMode" type="checkbox" checked> 08H flow: analog / weighted shimmy / wrap (off = 08G comparison)</label><label><input id="finalArt"')
    h=change(h,'<script src="app.js">','<script src="motion-flow.js"></script><script src="app.js">')
    h=change(h,'<b>E / X</b> attach or detach','<b>Space / B</b> round corner &nbsp; <b>E / X</b> attach or detach')
    h=change(h,'Experimental geometry fixes • Original v11.1 unchanged • No multiplayer','Experimental movement flow • Exact source artwork • Original v11.1 unchanged')
    h=change(h,'3 source poses. Optional','3 source poses, no new drawings. B / Space follows a checked path around a corner; uses recovered art. Optional')
    (r/'index.html').write_text(h)
    (r/'style.css').write_text((r/'style.css').read_text()+'\n#flowDetails{color:#ffd278;line-height:1.5;margin-bottom:10px}#flowMode{accent-color:#ffd278}\n')
    p=r/'tools/build_standalone.py';p.write_text(change(p.read_text(),"'core.js','app.js'","'core.js','motion-flow.js','app.js'").replace('08G','08H'))
    m=json.loads((r/'asset-manifest.json').read_text());m['version']='V12-08H'
    (r/'asset-manifest.json').write_text(json.dumps(m,indent=2)+'\n');(r/'assets.js').write_text('window.JADE_ASSETS='+json.dumps(m,separators=(',',':'))+';\n')
    print('Assembled 08H; all artwork reused without changes. Run tests before delivery.')
if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--base',type=Path,required=True);p.add_argument('--out',type=Path,required=True);p.add_argument('--module',type=Path,default=Path(__file__).with_name('motion-flow.js'));a=p.parse_args();build(a.base,a.out,a.module)
