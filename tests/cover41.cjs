const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),{stripTypeScriptTypes}=require('node:module');
const c={Math,crypto:require('crypto').webcrypto};vm.createContext(c);
for(const f of ['bayBridgeMap','game'])vm.runInContext(stripTypeScriptTypes(fs.readFileSync('lib/'+f+'.ts','utf8')).replace(/^import .*\n/gm,'').replace(/export /g,''),c);
vm.runInContext('globalThis.a={newGame,setInput,advance,empty,attachCover,anchorForEdge,placeOnCover,moveOnCover,damageCover,buildFieldCover,slideCapture,coverDamageStage,startOrRematch,edgeActions};',c);const a=c.a;
function scene(n=0){const s=a.newGame('Les','token',1000,'practice');s.phase='playing';s.covers=[];s.matter=[];s.players.forEach(p=>p.bot=false);Object.assign(s.players[n],{x:300,y:310,aim:0,gunFacing:0});Object.assign(s.players[1-n],{x:880,y:500});return s;}
function kit(s){s.matter=['stone','stone','metal'].map((kind,n)=>({id:'m'+n,kind,x:330,y:330+n*10,vx:0,vy:0,r:11,heldBy:null,orbitBy:null,life:999}));}
function tick(s,n,i){a.setInput(s,n,s.players[n].lastSeq+1,i);a.advance(s,s.lastAt+1000/60);}
for(const n of [0,1])for(const reinforced of [false,true])for(const shape of [0,1]){
 const s=scene(n),p=s.players[n];p.coverShape=shape;if(reinforced)kit(s);a.buildFieldCover(p,s,n);assert.equal(s.covers.length,1);const cv=s.covers[0];assert.equal(cv.maxHp,reinforced?360:280);assert.equal(cv.matterSources.length,reinforced?3:0);assert.equal(p.battery,70);assert.equal(cv.w,112*(shape?.72:1));
 // Seven ordinary 10-damage pellets per volley: two must not destroy fresh cover.
 for(let k=0;k<14;k++)a.damageCover(cv,s,10);assert(cv.hp>0);assert(a.coverDamageStage(cv.hp,cv.maxHp)>0);
 const hp=cv.hp;a.damageCover(cv,s,NaN);a.damageCover(cv,s,-1);assert.equal(cv.hp,hp);
 a.damageCover(cv,s,999);assert.equal(cv.hp,0);assert.equal(s.matter.length,reinforced?3:0,'projection never manufactures collectible matter');a.damageCover(cv,s,999);assert.equal(s.matter.length,reinforced?3:0);assert(s.fx.some(f=>f.type==='cover-break'));
}
// Actual shotgun projectiles hit the constructed barrier before reaching its owner.
for(const reinforced of [false,true]){
 const s=scene(),p=s.players[0],q=s.players[1];if(reinforced)kit(s);a.buildFieldCover(p,s,0);const cv=s.covers[0];Object.assign(q,{x:650,y:310,aim:Math.PI,gunFacing:Math.PI});
 for(let volley=0;volley<2;volley++){tick(s,1,{fire:true,aim:Math.PI});for(let k=0;k<25;k++)tick(s,1,{aim:Math.PI});}
 assert.equal(cv.hp,cv.maxHp-140,'two real volleys, seven pellets each');assert.equal(p.hp,420,'barrier interposes');assert.equal(s.events.filter(e=>e.kind==='cover'&&e.source==='shotgun').length,14);
}
// Partial/ineligible recipe remains untouched; low battery / blocked placement rollback.
for(const fail of ['partial','owned','energy','limit','blocked']){
 const s=scene(),p=s.players[0];kit(s);if(fail==='partial')s.matter.pop();if(fail==='owned')s.matter[2].heldBy=1;if(fail==='energy')p.battery=29;if(fail==='limit')s.covers=[0,1].map(n=>({id:'own'+n,x:600+n*130,y:100,w:112,h:34,a:0,hp:280,maxHp:280,constructOwner:0,generated:true,build:1,variant:0}));if(fail==='blocked')s.covers=[{id:'wall',x:490,y:310,w:330,h:200,a:0,hp:110,maxHp:110,generated:false,build:0,variant:0}];const count=s.matter.length,battery=p.battery,before=s.covers.length;a.buildFieldCover(p,s,0);assert.equal(s.matter.length,count);if(['partial','owned'].includes(fail)){assert.equal(s.covers.length,before+1);assert.equal(s.covers.at(-1).maxHp,280);}else{assert.equal(s.covers.length,before);assert.equal(p.battery,battery);}
}
// All faces, four rotations, both modes: wobble stays; deliberate push escapes even LT.
let checks=0;for(const rotation of [0,.61,Math.PI/2,Math.PI])for(let edge=0;edge<4;edge++)for(const mode of ['soft','braced'])for(const lt of [false,true]){
 const s=scene(),p=s.players[0],cv={id:'wall',x:500,y:310,w:170,h:42,a:rotation,hp:360,maxHp:360,generated:false,build:0,variant:0};s.covers=[cv];p.coverId=cv.id;p.coverMode=mode;p.coverAnchor=a.anchorForEdge(cv,edge,edge%2?21:85);a.placeOnCover(p,s);const rail={...p.coverAnchor};
 a.moveOnCover(p,s,{...a.empty(),x:rail.tx+rail.nx*.19,y:rail.ty+rail.ny*.19,aim:Math.PI,coverAim:lt},1/60);assert.equal(p.coverId,'wall');
 a.moveOnCover(p,s,{...a.empty(),x:rail.nx,y:rail.ny,aim:Math.PI,coverAim:lt},1/60);assert.equal(p.coverId,null);checks++;
}
for(const n of [0,1])for(const mode of ['soft','braced'])for(const aim of [0,Math.PI,Math.PI/2]){
 const s=scene(n),p=s.players[n],cv={id:'wall',x:500,y:310,w:170,h:42,a:.61,hp:360,maxHp:360,generated:false,build:0,variant:0};s.covers=[cv];p.coverId=cv.id;p.coverMode=mode;p.coverAnchor=a.anchorForEdge(cv,2,85);a.placeOnCover(p,s);const rail={...p.coverAnchor};p.battery=0;tick(s,n,{x:rail.nx,y:rail.ny,aim,coverAim:true,slide:true});assert.equal(p.coverId,null);assert(p.dash>0||p.slide>0,'zero battery A escape');assert.equal(p.battery,0);
}
// Modest inward capture respects alive status, movement direction and authored rails.
for(const rotation of [0,.61,Math.PI/2,Math.PI])for(const edge of [0,2])for(const scenario of ['capture','outward','far','dead','held','end']){
 const s=scene(),p=s.players[0],cv={id:'wall',artId:'bay-jersey',x:500,y:310,w:112,h:34,a:rotation,hp:360,maxHp:360,generated:false,build:0,variant:0};s.covers=[cv];p.coverId=cv.id;p.coverAnchor=a.anchorForEdge(cv,edge,scenario==='end'?0:56);a.placeOnCover(p,s);const rail={...p.coverAnchor};p.coverId=null;p.coverAnchor=null;p.coverMode=null;p.coverLock=0;p.dash=.15;p.x+=rail.nx*(scenario==='far'?12:6);p.y+=rail.ny*(scenario==='far'?12:6);p.vx=rail.nx*(scenario==='outward'?120:-120);p.vy=rail.ny*(scenario==='outward'?120:-120);if(scenario==='dead')cv.hp=0;if(scenario==='held')s.players[1].gripCoverId=cv.id;a.slideCapture(p,s);assert.equal(p.coverId,scenario==='capture'?'wall':null,rotation+'/'+edge+'/'+scenario);
}
// Fresh Y cancels attacks and enters charge on attached cover; held RB never repeats.
let s=scene();tick(s,0,{cover:true,aim:0});const id=s.covers[0].id;tick(s,0,{cover:true,aim:0});assert.equal(s.covers.length,1);tick(s,0,{cover:true,powerup:true});assert(s.players[0].charging);tick(s,0,{});assert(!s.players[0].charging);a.startOrRematch(s,0);assert(!s.covers.some(cv=>cv.id===id));assert.equal(s.players[0].coverShape,undefined);
// Controller mapping is exercised as actual input, not only string assertions.
const ui=fs.readFileSync('app/Game.tsx','utf8');vm.runInContext(stripTypeScriptTypes(ui.slice(ui.indexOf('function readController('),ui.indexOf('const INPUT_BUTTONS')))+';globalThis.read=readController;',c);
for(const [button,key] of [[0,'slide'],[1,'melee'],[3,'powerup'],[4,'grip'],[5,'cover'],[6,'shield'],[7,'fire'],[12,'weaponCycle'],[13,'powerCycle'],[14,'fieldCycle'],[15,'coverShapeCycle']]){const pad={buttons:Array.from({length:16},(_,n)=>({pressed:n===button,value:n===button?1:0})),axes:[.8,.4,-1,0]},i=c.read(pad,{...a.empty()});assert(i[key],button+'/'+key);assert.equal(i.x,.8);assert.equal(i.y,.4);assert.equal(Math.abs(i.aim),Math.PI);if(button===5)assert(!i.powerUse);}
s=scene();tick(s,0,{coverShapeCycle:true});assert.equal(s.players[0].coverShape,1);tick(s,0,{coverShapeCycle:true});assert.equal(s.players[0].coverShape,1);assert.equal(s.covers.length,0);tick(s,0,{});tick(s,0,{coverShapeCycle:true});assert.equal(s.players[0].coverShape,0);
assert.deepEqual([360,288,198,108,0].map(hp=>a.coverDamageStage(hp,360)),[0,1,2,3,4]);
console.log('PASS41: projected/reinforced economy, 2-volley survival, shapes/edges, rollback, '+checks+' rotated attachment/escape cases, zero-battery A, charge, collapse/rematch and controller mapping.');
