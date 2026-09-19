"""Build V12 08I into a NEW folder from the exact unpacked 08H delivery.
No network access, gameplay changes, asset generation, or deployment.
"""
from pathlib import Path
import argparse, hashlib, json, shutil
HERE=Path(__file__).resolve().parent
hash_of=lambda b:hashlib.sha256(b).hexdigest()
BASE_HASHES={'app.js':'4608ac978fb1f54147763f76e904d4e5f0f2105b012f87943c821bc3e6418138','index.html':'9c15df62f5197153520bca55ec809978c15f67b4b5e4a1cf08674d09aba66e1f','style.css':'b70529df1bd9da11627af346a99a5436e8dc744d453d7adfc74485da9c1c92b4','tools/build_standalone.py':'1b931c49f1a52c3b660da9c6ed1a002ca79b587c63238fe4ee5c9aa42689e0d9'}

def build(base,output):
 if output.exists():raise ValueError('Output exists: choose a new folder')
 for name,sha in BASE_HASHES.items():
  if hash_of((base/name).read_bytes())!=sha:raise ValueError('Wrong 08H baseline: '+name)
 router=(HERE/'cover-router.js').read_bytes()
 if hash_of(router)!='86bcec0a47b8134dcf4b2083c9d1b58a97be17684aa7fd54a2f7e9bfd099c831':raise ValueError('Router fingerprint mismatch')
 source=json.loads((HERE/'metadata-source.json').read_text())
 manifest=json.loads((base/'asset-manifest.json').read_text())
 metadata={'schemaVersion':1,'source':source['source'],'families':{}}
 for d in range(24):
  legacy=d in source['legacyDirections'];extended=d in source['extendedDirections'];r=manifest['recoveredAtlases'][f'cover:{d}'];count=12 if extended else 6
  if r['frames']!=count:raise ValueError('Unexpected cover frame count')
  roles=source['legacy' if legacy else 'extended' if extended else 'basic']
  anchors=None if legacy or extended else [[192,336] for _ in range(count)]
  if str(d) in source['kickAnchorOverrides']:anchors[-1]=source['kickAnchorOverrides'][str(d)]
  metadata['families'][f'cover:{d}']={'id':f'cover-d{d:02d}','direction':d,'totalFrames':count,'sourceCell':[384,384],'grid':[6,count//6],'anchor':[192,336],'frameAnchors':anchors,'roles':roles,'roleSource':'ARCHIVED_SELECTOR_FALLBACK' if legacy else 'ARCHIVED_MANIFEST','sourceRuntimeSha256':r['sourceSha256'],'runtimeFile':r['file'],'runtimeCell':r['cell'],'runtimeSha256':r['sha256'],'muzzleStatus':'NOT_RECOVERED_IN_THIS_PASS; current simulation sockets unchanged'}
 s=(base/'app.js').read_text()
 def sub(a,b):
  nonlocal s
  if s.count(a)!=1:raise ValueError('Patch context mismatch: '+a[:60])
  s=s.replace(a,b)
 sub('Flow=window.JadeFlow,g=','Flow=window.JadeFlow,Route=window.JadeCoverRouter,Catalog=window.JADE_COVER_METADATA,g=')
 sub('flowMode:true};const directions','flowMode:true,poseRouting:true};const routing=new Route.Tracker();Route.validateCatalog(Catalog,A);routing.reset(world);const directions')
 sub('function reset(start){world.reset(start);','function reset(start){world.reset(start);routing.reset(world);')
 sub("['finalArt','coverArt','xray','anchors','liftStudy']","['finalArt','coverArt','xray','anchors','liftStudy','poseRouting']")
 s=s.replace('world.step(poll());','world.step(poll());routing.observe(world);')
 sub('for(let k=0;k<n;k++)world.step(i);draw();','for(let k=0;k<n;k++){world.step(i);routing.observe(world);}draw();')
 sub("let family=actor.cover||actor.cornerTravel?'cover'","let family=actor.cover||actor.cornerTravel||(settings.poseRouting&&actor.kick>0)?'cover'")
 sub('const cs=record.cell;return',"const cs=record.cell;let poseRoute=null;if(family==='cover'&&settings.poseRouting){poseRoute=routing.select(actor,world.time,Catalog.families['cover:'+direction],cs);if(poseRoute)frame=poseRoute.frame;}return")
 sub("anchor:[62.5,109.5],scale:220/125,label:'RECOVERED / '+family.toUpperCase()+' / view '+direction","anchor:poseRoute?.anchor||[62.5,109.5],poseRoute,scale:220/125,label:'RECOVERED / '+family.toUpperCase()+' / view '+direction+(poseRoute?' / '+poseRoute.role.toUpperCase()+' / slot '+frame:'')")
 sub('id:frame.id,file:frame.file,flow:','id:frame.id,file:frame.file,role:frame.poseRoute?.role||null,sourceAnchor:frame.poseRoute?.sourceAnchor||null,anchor:frame.anchor,poseRouting:settings.poseRouting,flow:')
 sub("$('frameLabel').textContent=f.label;","$('frameLabel').textContent=f.label;const pr=f.poseRoute;$('routingDetails').textContent=f.final?'FINAL JADE / original pose anchors; larger transition remains unfinished':pr?('ROLE '+pr.role.toUpperCase()+' / '+pr.roleSource+'\\nANCHOR '+pr.sourceAnchor.join(',')+' (source pixels)'+(pr.missing?'\\n'+pr.missing:'')):(settings.poseRouting?'Non-cover motion / existing playback':'08H LEGACY COVER LOOP / comparison only');")
 sub('if(settings.anchors){g.strokeStyle',"if(settings.anchors){if(lastFrame){line({x:shadow.x-8,y:shadow.y},{x:shadow.x+8,y:shadow.y},'#b5a0ff',2);line({x:shadow.x,y:shadow.y-8},{x:shadow.x,y:shadow.y+8},'#b5a0ff',2);text('ART ROOT / same world origin',shadow.x+12,shadow.y+19,9,'#baa6ff');}g.strokeStyle")
 sub('frameKind:lastFrame?.kind,flowEnabled:','frameKind:lastFrame?.kind,poseRoute:lastFrame?.poseRoute||null,frameAnchor:lastFrame?.anchor||null,routingState:routing.get(world.p),flowEnabled:')
 sub('point:(x,y,z)=>point(x,y,z),poll','point:(x,y,z)=>point(x,y,z),poll,preloadCover:()=>Promise.all(Array.from({length:24},(_,d)=>image(A.recoveredAtlases[\'cover:\'+d].file))),routing')
 s=s.replace('V12-08H','V12-08I').replace('Jade-08H-gameplay','Jade-08I-gameplay').replace('V12 · 08H / MOVEMENT + ART FLOW','V12 · 08I / STATE-AWARE COVER POSES').replace('Analog movement · weighted shimmy · B / Space corner wrap · final art is one-view / three keys','Cover uses action roles, not whole-sheet loops · no new drawings · final Jade remains one view')
 h=(base/'index.html').read_text().replace('lab 08H','lab 08I').replace('V12 · 08H','V12 · 08I').replace('MOVEMENT + ART FLOW','COVER POSE ROUTING')
 h=h.replace('<div id="flowDetails">','<pre id="routingDetails" aria-live="polite"></pre><div id="flowDetails">').replace('<label><input id="finalArt"','<label><input id="poseRouting" type="checkbox" checked> 08I action-aware cover poses (off = old 08H loop)</label><label><input id="finalArt"').replace('<script src="app.js">','<script src="cover-metadata.js"></script><script src="cover-router.js"></script><script src="app.js">')
 css=(base/'style.css').read_text()+'\n#routingDetails{font:10px monospace;white-space:pre-wrap;color:#89e5d7;line-height:1.4;margin:2px 0 9px;border-bottom:1px solid #354455;padding-bottom:8px}\n'
 packager=(base/'tools/build_standalone.py').read_text().replace("'motion-flow.js','app.js'","'motion-flow.js','cover-metadata.js','cover-router.js','app.js'").replace('08H_Playable','08I_Playable')
 shutil.copytree(base,output,ignore=shutil.ignore_patterns('evidence','*results*.json','SHA256SUMS.json','VERIFIED-RESULTS.json','START_HERE.md','README.md','assemble_08h.py'))
 (output/'evidence').mkdir(exist_ok=True)
 for name,data in [('app.js',s),('index.html',h),('style.css',css),('tools/build_standalone.py',packager),('cover-metadata.json',json.dumps(metadata,indent=2)+'\n'),('cover-metadata.js','/* Recovered metadata; see JSON provenance. */\nwindow.JADE_COVER_METADATA='+json.dumps(metadata,separators=(',',':'))+';\n')]:
  p=output/name;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(data)
 (output/'cover-router.js').write_bytes(router)
 manifest.update(version='V12-08I',coverRoleMetadata='cover-metadata.json',newDrawings=0)
 (output/'asset-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n');(output/'assets.js').write_text('window.JADE_ASSETS='+json.dumps(manifest,separators=(',',':'))+';\n')
 print('08I assembled; baseline unchanged. Run tools/verify_assets.py and tools/build_standalone.py in output.')
if __name__=='__main__':
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--base',type=Path,required=True);p.add_argument('--out',type=Path,required=True);args=p.parse_args();build(args.base,args.out)
