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
  tick(s,{x:a.nx*.35,y:a.ny*.35,aim,coverAim:true});assert.equal(p.coverId,null);assert((p.x-ox)*a.nx+(p.y-oy)*a.ny>0);assert.equal(p.battery,100);checks++;
  ({s,p,a}=fixture(rotation,edge,mode,weave));tick(s,{x:a.nx,y:a.ny,aim,slide:true});assert.equal(p.coverId,null);assert(p.slide>0);assert(Math.abs(Math.atan2(Math.sin(p.slideFacing-Math.atan2(a.ny,a.nx)),Math.cos(p.slideFacing-Math.atan2(a.ny,a.nx))))<1e-6);assert.equal(p.battery,88);checks++;
 }
 let {s,p,a}=fixture(rotation,edge,mode,weave);tick(s,{x:-a.nx,y:-a.ny,aim:Math.atan2(a.ny,a.nx),slide:mode==='braced'});assert.equal(p.coverId,'test-cover');assert.equal(p.battery,100);assert(!m.circleBox(p,18,s.covers[0]).hit);checks++;
 ({s,p,a}=fixture(rotation,edge,'braced',weave));tick(s,{x:a.tx,y:a.ty,aim:Math.atan2(-a.ty,-a.tx),slide:true});assert.equal(p.coverId,null);assert.equal(p.kickStage,'burst');assert.equal(p.battery,88);assert(Math.abs(p.vx*a.nx+p.vy*a.ny)<1e-6);checks++;
 ({s,p,a}=fixture(rotation,edge,'braced',weave));p.battery=0;tick(s,{x:a.nx,y:a.ny,aim:0,slide:true});assert.equal(p.coverId,null);assert.equal(p.slide,0);assert.equal(p.battery,0);checks++;
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
console.log(`PASS: ${checks} checks across all faces, four rotations, Classic/Weave, opposite gun aim, soft/braced release, paid kicks, depleted charge, flow, next-cover recapture, repeat bursts and pose selection.`);
