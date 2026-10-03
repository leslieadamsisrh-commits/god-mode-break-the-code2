// Run from the repository root with Node 24+: node tests/cover-movement.cjs
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),{stripTypeScriptTypes}=require('node:module');
const source=stripTypeScriptTypes(fs.readFileSync('lib/game.ts','utf8')).replace(/export /g,'');
const ctx={crypto:require('node:crypto').webcrypto};vm.createContext(ctx);vm.runInContext(source+';globalThis.api={newGame,setInput,advance,attachCover,worldPoint,anchorForEdge,placeOnCover,circleBox,muzzleSocket};',ctx);
const m=ctx.api;let checks=0;
function fixture(angle,edge,mode,weave=0){const s=m.newGame('test','token',1000,'solo');s.matter=[];s.covers=[{id:'test-cover',x:500,y:300,w:170,h:42,a:angle,hp:140,maxHp:140,generated:false,build:0,variant:0}];s.config.weaveEnabled=weave;const p=s.players[0];p.coverId='test-cover';p.coverMode=mode;p.coverAnchor=m.anchorForEdge(s.covers[0],edge,edge%2?21:85);m.placeOnCover(p,s);p.battery=100;p.lastEnergyAt=0;return{s,p,a:{...p.coverAnchor}}}
function tick(s,input,ms=17){m.setInput(s,0,s.players[0].lastSeq+1,input);m.advance(s,s.lastAt+ms)}
for(const weave of [0,1])for(const rotation of [0,.61,Math.PI/2,Math.PI])for(let edge=0;edge<4;edge++)for(const mode of ['soft','braced']){
 for(const aimOffset of [0,Math.PI,Math.PI/2]){
  let {s,p,a}=fixture(rotation,edge,mode,weave);const aim=Math.atan2(a.ny,a.nx)+aimOffset,ox=p.x,oy=p.y;
  tick(s,{x:a.nx*.35,y:a.ny*.35,aim,coverAim:false});if(mode==='soft'){assert.equal(p.coverId,null);assert((p.x-ox)*a.nx+(p.y-oy)*a.ny>0)}else{assert.equal(p.coverId,'test-cover');assert.equal(p.x,ox);assert.equal(p.y,oy)}assert.equal(p.battery,100);checks++;
  ({s,p,a}=fixture(rotation,edge,mode,weave));tick(s,{x:a.nx,y:a.ny,aim,slide:true});if(mode==='soft'){assert.equal(p.coverId,'test-cover');assert.equal(p.coverMode,'braced');assert.equal(p.battery,100);checks++;continue}assert.equal(p.coverId,null);assert(p.slide>0);assert(Math.abs(Math.atan2(Math.sin(p.slideFacing-Math.atan2(a.ny,a.nx)),Math.cos(p.slideFacing-Math.atan2(a.ny,a.nx))))<1e-6);assert.equal(p.battery,88);checks++;
 }
 let {s,p,a}=fixture(rotation,edge,mode,weave);tick(s,{x:-a.nx,y:-a.ny,aim:Math.atan2(a.ny,a.nx),slide:mode==='braced'});assert.equal(p.coverId,'test-cover');assert.equal(p.battery,100);assert(!m.circleBox(p,18,s.covers[0]).hit);checks++;
 ({s,p,a}=fixture(rotation,edge,'braced',weave));tick(s,{x:a.tx,y:a.ty,aim:Math.atan2(-a.ty,-a.tx),slide:true});assert.equal(p.coverId,null);assert.equal(p.kickStage,'burst');assert.equal(p.battery,88);assert(Math.abs(p.vx*a.nx+p.vy*a.ny)<1e-6);checks++;
 ({s,p,a}=fixture(rotation,edge,'braced',weave));p.battery=0;tick(s,{x:a.nx,y:a.ny,aim:0,slide:true});assert.equal(p.coverId,'test-cover');assert.equal(p.slide,0);assert.equal(p.battery,0);checks++;
 ({s,p,a}=fixture(rotation,edge,mode,weave));const before=p.coverAnchor.t;tick(s,{x:a.tx*.5,y:a.ty*.5,aim:0});assert.equal(p.coverId,'test-cover');assert(p.coverAnchor.t>before);checks++;
}
for(const weave of [0,1])for(const rotation of [0,.61,Math.PI/2,Math.PI])for(let edge=0;edge<4;edge++){
 const {s,p,a}=fixture(rotation,edge,'soft',weave);p.coverAnchor.t=p.coverAnchor.length-.1;m.placeOnCover(p,s);const next=m.anchorForEdge(s.covers[0],(edge+1)%4,0);
 tick(s,{x:a.tx*.6+next.tx*.8,y:a.ty*.6+next.ty*.8,aim:0},16);assert.equal(p.coverId,'test-cover');assert.equal(p.coverAnchor.edge,(edge+1)%4);tick(s,{x:next.tx,y:next.ty,aim:0},16);assert.equal(p.coverId,'test-cover');assert(!m.circleBox(p,18,s.covers[0]).hit);checks++;
}
// A burst can catch the next block; a second burst spends another charge.
const {s,p,a}=fixture(0,2,'braced');s.covers.push({...s.covers[0],id:'next',y:440});tick(s,{x:0,y:1,aim:Math.PI,slide:true});for(let n=0;n<30&&p.coverId!=='next';n++)tick(s,{x:0,y:1,aim:Math.PI});assert.equal(p.coverId,'next');assert.equal(p.coverMode,'soft');assert.equal(p.battery,88);tick(s,{x:0,y:0,aim:0,slide:true});assert.equal(p.coverMode,'braced');tick(s,{x:0,y:0,aim:0});tick(s,{x:0,y:-1,aim:Math.PI/2,slide:true});assert.equal(p.coverId,null);assert.equal(p.battery,76);checks++;
// Repeated A edges during an active kick cannot mint another burst.
tick(s,{x:0,y:-1,aim:0});tick(s,{x:0,y:-1,aim:0,slide:true});assert.equal(p.battery,76);checks++;
const ui=fs.readFileSync('app/Game.tsx','utf8'),start=ui.indexOf('function spriteFacing('),end=ui.indexOf('function SpriteInspector(');vm.runInContext(stripTypeScriptTypes(ui.slice(start,end))+';globalThis.pose=spriteFacing;',ctx);
const q={coverId:'cover',coverAnchor:{nx:0,ny:-1},gunFacing:0,input:{coverAim:false}};assert.equal(ctx.pose(q,'cover',0),-Math.PI/2);q.input.coverAim=true;assert.equal(ctx.pose(q,'cover',0),0);checks+=2;
console.log(`PASS: ${checks} checks across all faces, four rotations, Classic/Weave, opposite gun aim, soft release/braced lock, paid kicks, depleted charge, flow, next-cover recapture, repeat bursts and pose selection.`);

// Restored brace exposes on LT and retracts without releasing its attachment.
for(const rotation of [0,.61,Math.PI/2,Math.PI])for(let edge=0;edge<4;edge++){
 const {s,p,a}=fixture(rotation,edge,'braced');tick(s,{aim:Math.atan2(-a.ny,-a.nx),coverAim:true});assert.equal(p.coverId,'test-cover');assert(p.peek);
 tick(s,{aim:Math.atan2(-a.ny,-a.nx),coverAim:false});assert.equal(p.coverId,'test-cover');assert.equal(p.peek,false);assert(p.returnToCover>0);checks++;
}
// Attached concrete wins over nearby debris; ripping clears both cover anchors.
for(const rotation of [0,.61,Math.PI/2,Math.PI])for(let edge=0;edge<4;edge++)for(const mode of ['soft','braced']){
 const {s,p,a}=fixture(rotation,edge,mode);const cv=s.covers[0];cv.id=p.coverId='cover-piece-01';s.matter=[{id:'debris',x:p.x+1,y:p.y,r:14,kind:'stone',vx:0,vy:0,life:999,heldBy:null,orbitBy:null}];
 tick(s,{grip:true,aim:Math.atan2(a.ny,a.nx)},16);assert.equal(p.gripCoverId,cv.id);assert.equal(p.coverId,null);assert.equal(p.coverAnchor,null);assert.equal(s.matter[0].heldBy,null);assert(Math.abs(p.battery-(100-s.config.gripEnergy-s.config.holdEnergy*.016))<1e-6);
 for(let n=0;n<15;n++)tick(s,{grip:true,x:a.tx*.8,y:a.ty*.8,aim:Math.atan2(a.ny,a.nx)},16);assert(Math.hypot(cv.vx,cv.vy)>0);assert.equal(p.gripCoverId,cv.id);assert(Number.isFinite(cv.a));checks++;
}
// Release retains block position/orientation and inherits carrier plus block velocity.
for(const speed of [0,180,-180]){
 const {s,p}=fixture(0,0,'braced');const cv=s.covers[0];cv.id=p.coverId='cover-piece-01';tick(s,{grip:true,aim:0},16);p.x=400;p.y=300;p.vx=speed;p.vy=0;cv.x=510;cv.y=300;cv.a=.45;cv.vx=speed*.8;cv.vy=30;const aim=speed<0?Math.PI:0;p.gunFacing=p.aim=aim;
 const expectedX=Math.cos(aim)*s.config.throwForce*.62+p.vx*s.config.carryMomentum+cv.vx*(1-s.config.carryMomentum),expectedY=Math.sin(aim)*s.config.throwForce*.62+cv.vy*(1-s.config.carryMomentum),before=p.battery;
 tick(s,{x:speed?Math.sign(speed):0,aim,grip:true,throwMatter:true},16);assert.equal(p.gripCoverId,null);assert(Math.abs(cv.x-(510+expectedX*.016))<1e-6);assert(Math.abs(cv.y-(300+expectedY*.016))<1e-6);assert(Math.abs(cv.vx-expectedX*Math.pow(.09,.016))<1e-6);assert.equal(cv.a,.45);assert(Math.abs(before-p.battery-s.config.coverThrowEnergy)<1e-6);checks++;
}
{
 const {s,p}=fixture(0,0,'braced'),cv=s.covers[0];cv.id=p.coverId='cover-piece-01';tick(s,{grip:true,aim:0},16);p.battery=.01;tick(s,{grip:true,aim:0},16);assert.equal(p.gripCoverId,null);assert.equal(cv.build,0);assert.equal(cv.vx,0);assert.equal(cv.vy,0);checks++;
}
{
 const s=m.newGame('test','token',1000,'solo'),p=s.players[0];s.matter=[];tick(s,{cover:true,aim:0},16);const cv=s.covers.find(c=>c.generated);assert(cv);tick(s,{grip:true,aim:0},16);assert.equal(p.gripCoverId,cv.id);p.battery=1;tick(s,{grip:true,throwMatter:true,aim:0},16);assert.equal(p.gripCoverId,cv.id);assert(cv.build>=0);checks++;
}
// Carry/throw collision uses rotated footprints and bounded substeps.
{
 const {s,p}=fixture(.61,0,'braced'),cv=s.covers[0];cv.id=p.coverId='cover-piece-01';tick(s,{grip:true,aim:0},16);p.gripCoverId=null;cv.x=350;cv.y=300;cv.a=0;cv.vx=700;cv.vy=0;cv.build=-700;s.covers.push({...cv,id:'obstacle',x:570,build:0,vx:0,vy:0});
 for(let n=0;n<40;n++)tick(s,{aim:0},16);assert(cv.x<=400.1);assert.equal(cv.vx,0);checks++;
}
console.log(`PASS: ${checks} total brace, exposure/retract, selection, carry, momentum, charge, recapture and rotated-cover checks.`);

// Actual browser mapper: every active button, analog trigger and reserved selector.
const controllerStart=ui.indexOf('function readController('),controllerEnd=ui.indexOf('const keyAction:',controllerStart);
vm.runInContext(stripTypeScriptTypes(ui.slice(controllerStart,controllerEnd))+';globalThis.mapPad=readController;',ctx);
for(let button=0;button<16;button++){
 const pad={axes:[0,0,0,0],buttons:Array.from({length:16},()=>({pressed:false,value:0}))};pad.buttons[button]={pressed:true,value:1};
 const input=ctx.mapPad(pad,{aim:0}),expected={0:['slide'],1:['melee'],2:['slow'],3:['powerup'],4:['grip'],5:['cover'],6:['shield','coverAim'],7:['fire']}[button]||[];
 assert.deepEqual(Object.keys(input).filter(k=>input[k]===true).sort(),expected.sort());checks++;
}
{
 const input=ctx.mapPad({axes:[.6,-.5,0,1],buttons:Array.from({length:8},(_,n)=>({value:n===6?.8:0}))},{aim:0});
 assert.equal(input.coverAim,true);assert.equal(input.shield,true);assert.equal(input.aim,Math.PI/2);assert.equal(input.x,.6);checks++;
}
// LT captures soft cover before walk-away, plants feet, keeps full aim and suppresses shield.
for(const weave of [0,1])for(const rotation of [0,.61,Math.PI/2,Math.PI])for(let edge=0;edge<4;edge++){
 const {s,p,a}=fixture(rotation,edge,'soft',weave),x=p.x,y=p.y;
 tick(s,{x:a.tx,y:a.ty,aim:Math.atan2(a.ny,a.nx)+Math.PI*.75,coverAim:true,shield:true},16);
 assert.equal(p.coverMode,'braced');assert.equal(p.x,x);assert.equal(p.y,y);assert.equal(p.shield,false);assert.equal(p.battery,100);
 assert(Math.abs(Math.atan2(Math.sin(p.gunFacing-p.aim),Math.cos(p.gunFacing-p.aim)))<1e-6);
 tick(s,{aim:0},16);assert.equal(p.coverMode,'braced');assert.equal(p.coverId,'test-cover');assert.equal(p.peek,false);
 tick(s,{x:a.nx,y:a.ny,aim:Math.atan2(-a.ny,-a.nx),slide:true,coverAim:true,shield:true},16);
 assert.equal(p.coverId,null);assert.equal(p.battery,88);assert.equal(p.shield,false);checks++;
}
// Open LT remains shield and drains only its existing charge.
{
 const s=m.newGame('test','token',1000,'solo'),p=s.players[0];tick(s,{shield:true,coverAim:true,aim:0},16);
 assert(p.shield);assert.equal(p.coverId,null);assert(Math.abs(p.battery-99.712)<1e-6);checks++;
}
// Hold LB, release-drop, grip a fresh edge, throw with RT, then require a fresh RT for gunfire.
for(const object of ['cover','debris']){
 const s=m.newGame('test','token',1000,'solo'),p=s.players[0];p.x=230;p.y=330;s.matter=[];s.covers=[];
 if(object==='cover')s.covers=[{id:'cover-piece-01',x:340,y:330,w:130,h:30,a:0,hp:110,maxHp:110,build:0,variant:0,generated:false}];
 else s.matter=[{id:'m',x:290,y:330,r:14,kind:'stone',vx:0,vy:0,life:999,heldBy:null,orbitBy:null}];
 const held=()=>object==='cover'?p.gripCoverId:p.gripId;
 tick(s,{grip:true,aim:0},16);assert(held());const block=s.covers[0],drop=block&&{x:block.x,y:block.y,a:block.a};
 tick(s,{aim:0},16);assert.equal(held(),null);if(block){assert.equal(block.x,drop.x);assert.equal(block.y,drop.y);assert.equal(block.a,drop.a)}
 tick(s,{grip:true,aim:0},16);assert(held());tick(s,{grip:true,fire:true,aim:0},16);assert.equal(held(),null);assert.equal(s.shots.length,0);assert(p.fireBlocked);
 for(let n=0;n<40;n++)tick(s,{grip:true,fire:true,aim:0},16);assert.equal(held(),null);assert.equal(s.shots.length,0);
 tick(s,{aim:0},16);assert(!p.fireBlocked);tick(s,{fire:true,aim:Math.PI},16);assert.equal(s.shots.length,7);checks++;
}
// Failed low-charge throw consumes the trigger and cannot turn into a free bullet.
{
 const {s,p}=fixture(0,0,'soft'),cv=s.covers[0];cv.id=p.coverId='cover-piece-01';tick(s,{grip:true,aim:0},16);p.battery=1;
 tick(s,{grip:true,fire:true,aim:0},16);assert.equal(p.gripCoverId,cv.id);assert.equal(s.shots.length,0);
 tick(s,{fire:true,aim:0},16);assert.equal(p.gripCoverId,null);assert.equal(s.shots.length,0);checks++;
}
// Across all rotations/faces, top exposure clears the attached block; soft fire cannot tunnel through it.
for(const rotation of [0,.61,Math.PI/2,Math.PI])for(let edge=0;edge<4;edge++){
 let {s,p,a}=fixture(rotation,edge,'soft');const aim=Math.atan2(-a.ny,-a.nx);
 tick(s,{aim,coverAim:true,fire:true},16);assert.equal(s.shots.length,7);assert(s.shots.every(sh=>sh.clearanceCoverId==='test-cover'));checks++;
 ({s,p,a}=fixture(rotation,edge,'soft'));p.gunFacing=aim;tick(s,{aim,fire:true},16);assert.equal(s.shots.length,0);assert(s.fx.some(f=>f.type==='cover-block'));checks++;
}
// Swept solid cover blocks bullets before they can reach another player.
{
 const s=m.newGame('test','token',1000,'solo'),p=s.players[0];p.x=200;p.y=300;p.gunFacing=0;s.matter=[];
 s.covers=[{id:'wall',x:310,y:300,w:42,h:170,a:.25,hp:100,maxHp:100,build:0,variant:0,generated:false}];
 tick(s,{fire:true,aim:0},16);assert.equal(s.shots.length,7);for(let n=0;n<10;n++)tick(s,{aim:0},16);assert.equal(s.shots.length,0);assert(s.fx.some(f=>f.type==='cover-block'));checks++;
}
console.log(`PASS: ${checks} total checks including real controller mapping, contextual LT, LB release, RT throw latch and solid-cover fire blocking.`);

// Side, top and diagonal exposure at center and both corners retain continuous aim.
for(const weave of [0,1])for(const rotation of [0,.61,Math.PI/2,Math.PI])for(let edge=0;edge<4;edge++)for(const contact of [0,.5,1])for(const offset of [0,Math.PI/4,-Math.PI/4,Math.PI/2,-Math.PI/2,Math.PI]){
 const {s,p,a}=fixture(rotation,edge,'soft',weave);p.coverAnchor.t=p.coverAnchor.length*contact;m.placeOnCover(p,s);
 const aim=Math.atan2(a.ny,a.nx)+offset;p.gunFacing=aim;tick(s,{aim,coverAim:true,fire:true},16);
 assert.equal(p.coverId,'test-cover');assert.equal(p.coverMode,'braced');assert.equal(s.shots.length,7);
 assert(Math.abs(Math.atan2(Math.sin(p.gunFacing-p.aim),Math.cos(p.gunFacing-p.aim)))<1e-6);
 assert.equal(p.peekEdge,contact!==.5);checks++;
}
// A trigger held before grabbing cannot throw until it is released and pressed again.
{
 const {s,p}=fixture(0,0,'soft'),cv=s.covers[0];cv.id=p.coverId='cover-piece-01';tick(s,{fire:true,aim:Math.PI/2},16);s.shots=[];
 tick(s,{grip:true,fire:true,aim:0},16);assert.equal(p.gripCoverId,cv.id);assert.equal(s.shots.length,0);
 tick(s,{grip:true,aim:0},16);tick(s,{grip:true,fire:true,aim:0},16);assert.equal(p.gripCoverId,null);assert.equal(s.shots.length,0);checks++;
}
// Depleted hold drops safely and holding LB cannot re-grab after recharge.
{
 const {s,p}=fixture(0,0,'soft'),cv=s.covers[0];cv.id=p.coverId='cover-piece-01';tick(s,{grip:true,aim:0},16);p.battery=.01;
 tick(s,{grip:true,aim:0},16);assert.equal(p.gripCoverId,null);p.battery=100;
 tick(s,{grip:true,aim:0},16);assert.equal(p.gripCoverId,null);assert.equal(cv.build,0);checks++;
}
console.log(`PASS: ${checks} total controller/cover checks, including center/corner side/top/diagonal firing and trigger-edge recovery.`);


// Real-time power window, charge interruptions and preservation of Classic values.
{
 const s=m.newGame('power','token',1000,'solo'),p=s.players[0];s.covers=[];s.matter=[];p.battery=20;
 const speed=s.config.slideSpeed;for(let n=0;n<170;n++)tick(s,{powerup:true},17);
 assert(p.charging);assert.equal(p.godCharge,1);assert(p.battery>90);tick(s,{});assert(!p.charging);assert(p.godTime>11.98&&p.godTime<=12);checks++;
 for(let n=0;n<60;n++)tick(s,{});tick(s,{fire:true,aim:0});assert(s.shots.length);assert.equal(s.shots[0].damage,s.config.shotDamage*1.35);assert.equal(s.config.slideSpeed,speed);checks++;
 p.battery=.01;tick(s,{});assert.equal(p.godTime,0);assert(p.godFade>0);checks++;
 tick(s,{powerup:true});tick(s,{powerup:false});assert.equal(p.godTime,0);checks++;
 tick(s,{powerup:true});tick(s,{powerup:true,slide:true,x:1});assert(!p.charging);assert.equal(p.godTime,0);checks++;
 const t=m.newGame('clock','token',1000,'solo');t.covers=[];t.players[0].godTime=t.players[0].godDuration=12;for(let n=0;n<720;n++)tick(t,{},17);assert.equal(t.players[0].godTime,0);checks++;
}
console.log(`PASS: ${checks} checks including God Frame charge, damage, depletion, cancellation and expiry.`);


// Animation phases must not replay dissolution while sustaining or returning to combat.
{
 const start=ui.indexOf('function chargeFrame('),end=ui.indexOf('function drawPowerFrame(',start);
 const source=fs.readFileSync('app/Game.tsx','utf8');
 vm.runInContext(stripTypeScriptTypes(source.slice(source.indexOf('function chargeFrame('),source.indexOf('function drawPowerFrame(')))+';globalThis.powerVisual={chargeFrame,powerFrame,powerPoseAlpha,powerAura};',ctx);
 const v=ctx.powerVisual;
 for(const age of [.01,.14,.27]){assert.equal(v.chargeFrame(age,0),Math.floor(age/.35*3));checks++}
 const frames=new Set();for(let n=0;n<100;n++){const f=v.chargeFrame(3+n*.05,1);assert(f>=6&&f<=8);frames.add(f)}assert(frames.size>1);checks++;
 assert.equal(v.powerFrame({powerReturn:.24,godTime:12},{}),11);checks++;
 assert.equal(v.powerFrame({powerReturn:.24,powerReleaseAge:1.5,powerReleaseCharge:.48},{}),6);checks++;
 assert.equal(v.powerPoseAlpha({powerReturn:.12}),.5);assert.equal(v.powerPoseAlpha({}),0);checks++;
 assert(v.powerAura({godTime:9,godDuration:12})>v.powerAura({godTime:3,godDuration:12}));checks++;
 const s=m.newGame('transition','token',1000,'solo'),p=s.players[0];s.covers=[];s.matter=[];
 for(let n=0;n<85;n++)tick(s,{powerup:true});const age=p.chargeAge,charge=p.godCharge;tick(s,{});
 assert.equal(p.powerReleaseAge,age);assert.equal(p.powerReleaseCharge,charge);assert(p.godTime>0&&p.godTime<12);checks++;
 tick(s,{slide:true,x:1});assert.equal(p.powerFlash,0);assert.equal(p.powerReturn,0);assert(p.slide>0);checks++;
 const t=m.newGame('cancel','token',1000,'solo'),q=t.players[0];t.covers=[];t.matter=[];for(let n=0;n<12;n++)tick(t,{powerup:true});tick(t,{});assert.equal(q.godTime,0);assert(q.powerReturn>0);checks++;
 tick(t,{fire:true});assert.equal(q.powerReturn,0);assert(t.shots.length);checks++;
 tick(t,{powerup:true});assert(q.charging);checks++;
 tick(t,{powerup:true,shield:true});assert(!q.charging);assert.equal(q.powerReturn,0);assert.equal(q.godTime,0);checks++;
 for(let n=0;n<5;n++)tick(t,{powerup:true});assert(!q.charging);checks++;tick(t,{});tick(t,{powerup:true});assert(q.charging);checks++;
}
console.log(`PASS: ${checks} checks including sustained charge loop, partial release, immediate combat interruption, proportional glow and repeat charging.`);
