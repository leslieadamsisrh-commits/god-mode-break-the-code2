'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const publicRoot=path.join(__dirname,'../public');
function load(){
 const ctx=vm.createContext({console,setTimeout,clearTimeout,devicePixelRatio:1,ResizeObserver:class{observe(){}}});ctx.window=ctx;
 for(const name of ['vendor/assets.js','vendor/asset-residency.js','vendor/b05-fast.js','vendor/b06-fast.js','vendor/b11-fast.js','vendor/action-controller.js','vendor/core.js','vendor/motion-flow.js','vendor/stance-registration.js','vendor/cover-metadata.js','vendor/cover-router.js','slide-gate.js','duel-browser.js','fixture-setup.js','render.js']){
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
 const renderer=new c.DuelRenderer(canvas,e=>{throw e;});await renderer.load();const w=new c.JadeLocalDuel.Duel();w.begin();
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
