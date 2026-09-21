'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const publicRoot=path.join(__dirname,'../public');
function load(){
 const ctx=vm.createContext({console,setTimeout,clearTimeout,devicePixelRatio:1,ResizeObserver:class{observe(){}}});ctx.window=ctx;
 for(const name of ['vendor/assets.js','vendor/asset-residency.js','vendor/cover-presentation.js','vendor/b05-fast.js','vendor/b06-fast.js','vendor/b11-fast.js','vendor/action-controller.js','vendor/core.js','vendor/motion-flow.js','vendor/stance-registration.js','vendor/cover-metadata.js','vendor/cover-router.js','slide-gate.js','duel-browser.js','fixture-setup.js','render.js']){
  vm.runInContext(fs.readFileSync(path.join(publicRoot,name),'utf8'),ctx,{filename:name});
 }
 return ctx;
}
const actor=(c,overrides={})=>Object.assign(c.JadeCore.actor(-45,-5),{cover:{id:'station',face:'south',edge:null},aim:0},overrides);
test('one-view cover keys defer to correct-facing art on north, side and other barriers',()=>{
 const c=load(),B=c.JadeB06Fast;
 for(const patch of [{aim:Math.PI},{cover:{id:'station',face:'north',edge:null}},{cover:{id:'left',face:'south',edge:null}},{cover:{id:'station',face:'east',edge:null}}])assert.equal(B.select(actor(c,patch),4),null);
 assert.equal(B.select(actor(c,{vx:-100}),4).record.id,'B06B');
 assert.equal(B.select(actor(c,{vx:100}),4).placeholder,true);
});
test('aim, fire and retract do not get covered by a low-ready shimmy key',()=>{
 const c=load(),B=c.JadeB06Fast;
 for(const patch of [{aimHeld:true},{raise:.4},{recoil:.1},{lastShot:4},{lastShot:3.9}])assert.equal(B.select(actor(c,patch),4),null);
 assert.equal(B.select(actor(c,{lastShot:3.7}),4).record.id,'B06A');
});
test('slide-to-cover setup drives original collision through compression, contact and settle',()=>{
 const c=load(),w=new c.JadeLocalDuel.Duel();c.JadeFixture.setup(w,0,'cover-entry');
 const seen=new Set();
 for(let k=0;k<60;k++){
  w.advance([{x:0,y:-1,aim:0,slide:k===0},{aim:Math.PI}]);
  const q=c.JadeB05Fast.select(w.players[0],w.covers);if(q)seen.add(q.record.id);
 }
 assert.deepEqual([...seen],['CE05','CE03','CE08']);assert.equal(w.players[0].cover.id,'station');assert.equal(w.players[0].cover.face,'south');
 assert.equal(w.players[0].hp,100);assert.equal(w.metrics.shots,0);
});
test('cover-entry fixture works for either seat and retains the authoritative player pointer',()=>{
 const c=load();for(const slot of [0,1]){const w=new c.JadeLocalDuel.Duel();const info=c.JadeFixture.setup(w,slot,'cover-entry');assert.equal(info.slot,slot);assert.equal(w.players[slot].x,-45);assert.equal(w.players[slot].y,125);assert.equal(w.players[slot].cover,null);assert.equal(w.p,w.players[0]);}
});
test('renderer routes actual files through supported keys, fallbacks and corner shots without missing draws',async()=>{
 const c=load(),records=[...Object.values(c.JADE_ASSETS.recoveredAtlases),...Object.values(c.JADE_ASSETS.finalFrames),...Object.values(c.JADE_ASSETS.studyFrames),...Object.values(c.JadeB05Fast.records),...Object.values(c.JadeB06Fast.records)];
 const byFile=new Map(records.map(r=>[r.file,r]));
 // File dimensions and pixels are audited separately by audit_recovery.py.
 // This test exercises real routing/residency/draw calls with an in-memory
 // decoder substitute; it does not claim browser or visual validation.
 c.JadeResidency.browserLoader=()=>async file=>{assert.ok(fs.existsSync(path.join(publicRoot,file)));const r=byFile.get(file),d=r.runtimeDimensions||r.dimensions;return{naturalWidth:d[0],naturalHeight:d[1]};};
 const draws=[],g=new Proxy({drawImage(...args){draws.push(args);}},{get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
 const canvas={getContext:()=>g,getBoundingClientRect:()=>({width:1000,height:700,left:0,top:0})};
 const renderer=new c.DuelRenderer(canvas,e=>{throw e;});await renderer.load();renderer.setCoverMotion(false);const w=new c.JadeLocalDuel.Duel();w.begin();
 const show=patch=>{w.players[0]=actor(c,patch);renderer.accept({state:w.snapshot(),slot:0});renderer.draw();return renderer.inspect().frames[0];};
 assert.equal(show({}).id,'B06-B06A');
 assert.equal(show({vx:-120}).id,'B06-B06B');
 assert.equal(show({vx:120}).availability,'placeholder');
 assert.ok(show({aim:Math.PI,cover:{id:'station',face:'north',edge:null}}).id.startsWith('cover-d12-'));
 assert.ok(show({aimHeld:true}).id.startsWith('cover-'));
 assert.ok(show({lastShot:0}).id.startsWith('cover-'));
 assert.equal(show({cover:{id:'station',face:'south',edge:'right'},pose:2,raise:1,aimHeld:true,recoil:.1}).id,'K03');
 assert.equal(show({impact:.15}).id,'B05-CE03');
 assert.equal(show({impact:.05}).id,'B05-CE08');
 assert.equal(renderer.inspect().counts.missing,0);assert.ok(draws.length>=18);
});

async function harness(){
 const c=load(),records=[...Object.values(c.JADE_ASSETS.recoveredAtlases),...Object.values(c.JADE_ASSETS.finalFrames),...Object.values(c.JADE_ASSETS.studyFrames),...Object.values(c.JadeB05Fast.records),...Object.values(c.JadeB06Fast.records)];
 const byFile=new Map(records.map(r=>[r.file,r]));
 c.JadeResidency.browserLoader=()=>async file=>{const r=byFile.get(file),d=r.runtimeDimensions||r.dimensions;return{naturalWidth:d[0],naturalHeight:d[1]};};
 const g=new Proxy({},{get:()=>()=>{},set:()=>true});
 const renderer=new c.DuelRenderer({getContext:()=>g,getBoundingClientRect:()=>({width:1000,height:700,left:0,top:0})},e=>{throw e;});
 await renderer.load();const w=new c.JadeLocalDuel.Duel();c.JadeFixture.setup(w,0,'cover-movement');
 const show=()=>{const before=JSON.stringify(w.snapshot());renderer.accept({state:w.snapshot(),slot:0});renderer.draw();assert.equal(JSON.stringify(w.snapshot()),before,'render cannot mutate gameplay');return renderer.inspect().frames[0];};
 return {c,renderer,w,show};
}
test('R2 temporary cover walk advances real frames with travel and returns to approved idle',async()=>{
 const {w,show}=await harness();assert.equal(show().id,'B06-B06A');
 const seenLeft=new Set();for(let i=0;i<12;i++){w.advance([{x:-1,aim:0},{}]);const f=show();if(f.label.startsWith('TEMP COVER WALK'))seenLeft.add(f.id);}
 assert.ok(seenLeft.size>=3);assert.ok([...seenLeft].every(id=>id.startsWith('backpedal-d0-')));
 for(let i=0;i<30;i++)w.advance([{aim:0},{}]);assert.equal(show().id,'B06-B06A');
 const seenRight=new Set();for(let i=0;i<12;i++){w.advance([{x:1,aim:0},{}]);const f=show();if(f.label.startsWith('TEMP COVER WALK'))seenRight.add(f.id);}
 assert.ok(seenRight.size>=3);assert.ok([...seenRight].every(id=>id.startsWith('run-d0-')));
});
test('R2 cover movement yields to firing, other views and blocked edges',async()=>{
 const {w,show,c}=await harness();
 for(const patch of [{aimHeld:true},{lastShot:0},{aim:Math.PI},{cover:{id:'station',face:'north',edge:null}},{cover:{id:'station',face:'south',edge:'right'},x:51,pose:2,raise:1,aimHeld:true}]){
  w.players[0]=actor(c,{vx:120,...patch});assert.ok(!show().label.startsWith('TEMP COVER WALK'));
 }
 c.JadeFixture.setup(w,0,'cover-movement');for(let i=0;i<90;i++)w.advance([{x:1,aim:0},{}]);
 assert.equal(w.players[0].vx,0);assert.ok(!show().label.startsWith('TEMP COVER WALK'));
});
test('R2 comparison restores R1 pose and registration without resetting simulation',async()=>{
 const {w,show,renderer}=await harness();w.players[0].vx=120;assert.ok(show().id.startsWith('run-'));
 renderer.setCoverMotion(false);renderer.setCalibration(false);const old=show();assert.equal(old.id,'B06-B06C_PLACEHOLDER');assert.equal(old.scale,.162);
 renderer.setCalibration(true);const revised=show();assert.equal(revised.id,old.id);assert.ok(revised.scale<old.scale);assert.ok(revised.anchor[1]>old.anchor[1]);
});
test('cover movement fixture works on both seats through normal attachment',()=>{
 const c=load();for(const slot of [0,1]){const w=new c.JadeLocalDuel.Duel();c.JadeFixture.setup(w,slot,'cover-movement');const p=w.players[slot];assert.equal(p.x,-45);assert.equal(p.cover.face,'south');assert.equal(p.cover.edge,null);assert.equal(p.impact,0);assert.equal(w.p,w.players[0]);}
});

test('R2 quick-start and comparison buttons execute for keyboard and controller seats',async()=>{
 for(const controller of [false,true]){
  const {c,renderer}=await harness();
  const html=fs.readFileSync(path.join(publicRoot,'index.html'),'utf8');
  const elements=new Map([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>[m[1],{value:'',checked:false,disabled:false,textContent:'',hidden:false,addEventListener(){},focus(){}}]));
  for(const [id,value] of Object.entries({mode:'keyboard-pad',duration:'180',inspectSeat:'controller',name0:'Player 1',name1:'Player 2',zoom:'.92'}))elements.get(id).value=value;
  for(const id of ['calibrated','coverMotion','cover','finalArt'])elements.get(id).checked=true;
  elements.get('stage').getBoundingClientRect=()=>({width:1000,height:700,left:0,top:0});
  c.document={getElementById:id=>{assert.ok(elements.has(id),'missing HTML control '+id);return elements.get(id);},addEventListener(){},hidden:false};
  c.addEventListener=()=>{};c.requestAnimationFrame=()=>{};c.performance={now:()=>0};
  c.navigator={getGamepads:()=>controller?[{index:3,mapping:'standard',connected:true,buttons:Array.from({length:17},()=>({pressed:false,value:0})),axes:[0,0,0,0]}]:[]};
  c.DuelRenderer=function(){return renderer;};
  vm.runInContext(fs.readFileSync(path.join(publicRoot,'local-input.js'),'utf8'),c);
  vm.runInContext(fs.readFileSync(path.join(publicRoot,'couch.js'),'utf8'),c);
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(c.__JADE_COUCH__.inspect().loaded,true);
  elements.get('quickCover').onclick();const first=c.__JADE_COUCH__.inspect();
  assert.equal(first.paused,false);assert.equal(first.fixtureInfo.slot,controller?1:0);assert.equal(first.fixtureInfo.kind,'cover-movement');
  const before=JSON.stringify(first.state);elements.get('compareR1').onclick();
  assert.equal(JSON.stringify(c.__JADE_COUCH__.inspect().state),before);
  assert.equal(renderer.inspect().presentation.calibrated,false);assert.equal(renderer.inspect().presentation.coverMotion,false);
  elements.get('compareR1').onclick();assert.equal(renderer.inspect().presentation.coverMotion,true);
 }
});
