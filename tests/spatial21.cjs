const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),{stripTypeScriptTypes}=require('node:module');
const ctx={Math,crypto:require('crypto').webcrypto};vm.createContext(ctx);
for(const file of ['bayBridgeMap','bayBridgePresentation','game'])vm.runInContext(stripTypeScriptTypes(fs.readFileSync('lib/'+file+'.ts','utf8')).replace(/^import .*\n/gm,'').replace(/export /g,''),ctx);
vm.runInContext('globalThis.api={projectWorld,unprojectWorld,DECK,DECK_PITCH,DECK_SCREEN_Y,newGame,setInput,advance,anchorForEdge,placeOnCover,BAY_OBJECTS};',ctx);const m=ctx.api;
let points=0;for(const x of [70,500,930])for(const y of [90,310,550])for(const cx of [500/1.85,500,1000-500/1.85])for(const cy of [310/1.85,310,620-310/1.85]){
 const c={x:cx,y:cy},p=m.projectWorld(x,y,c,1.85),q=m.unprojectWorld(p.x,p.y,c,1.85);assert(Math.abs(q.x-x)<1e-9&&Math.abs(q.y-y)<1e-9);
 const top=m.projectWorld(x,y,c,1.85,48);assert(Math.abs(p.y-top.y-48*1.85)<1e-9);points++;
}
for(const o of m.BAY_OBJECTS){const {x,y}=o.worldPosition,r=Math.hypot(o.dimensions.w,o.dimensions.h)/2;assert(x-r>m.DECK.left&&x+r<m.DECK.right&&y-r>m.DECK.far&&y+r<m.DECK.near)}
for(const cy of [190,430])assert(m.projectWorld(500,0,{x:500,y:cy},1.85).y-14*1.85>-20,'bay window must remain open at either camera extreme');
console.log(`PASS: ${points} projected/inverse points; unchanged vertical art size; finite deck contains every actor through full rotation; bay window remains open.`);
function fixture(a=0,edge=0){const s=m.newGame('actions','token',1000,'solo');s.matter=[];const cv={id:'wall',x:500,y:310,w:160,h:40,a,hp:100,maxHp:100,generated:false,build:0,variant:0};s.covers=[cv];const p=s.players[0];p.coverId='wall';p.coverMode='soft';p.coverAnchor=m.anchorForEdge(cv,edge,edge%2?20:80);m.placeOnCover(p,s);return{s,p}}
function tick(s,i){m.setInput(s,0,s.players[0].lastSeq+1,i);m.advance(s,s.lastAt+16)}
let cases=0;for(const angle of [0,.4,Math.PI/2,Math.PI])for(let edge=0;edge<4;edge++){
 let {s,p}=fixture(angle,edge),a={...p.coverAnchor},energy=p.battery;tick(s,{slide:true});assert.equal(p.coverMode,'braced','neutral A must commit soft cover');assert.equal(p.coverId,'wall');assert.equal(p.battery,energy);
 tick(s,{});const ground={x:p.x,y:p.y},t=p.coverAnchor.t;for(let n=0;n<30;n++)tick(s,{x:a.tx,y:a.ty,coverAim:true,shield:true,aim:n*.15});assert.equal(p.x,ground.x);assert.equal(p.y,ground.y);assert.equal(p.coverAnchor.t,t);assert.equal(p.vx,0);assert.equal(p.vy,0);assert(p.peek);assert(!p.shield,'attached LT owns cover exposure, not the free shield');
 tick(s,{});assert(!p.peek);assert(p.returnToCover>0);tick(s,{slide:true,x:a.nx,y:a.ny});assert.equal(p.coverId,null);assert(p.dash>0,'existing braced A escape remains intact');cases++;
 ({s,p}=fixture(angle,edge));a={...p.coverAnchor};tick(s,{slide:true,x:a.nx,y:a.ny});assert.equal(p.coverId,null);assert(p.dash>0);cases++;
}
console.log(`PASS: ${cases} action sequences; neutral A brace, planted LT with stick/360 aim, release/retract, outward A and existing braced escape.`);

vm.runInContext(stripTypeScriptTypes(fs.readFileSync('lib/cover-occlusion.ts','utf8')).replace(/^import .*\n/gm,'').replace(/export /g,'')+';globalThis.occlude=coverOccluders;',ctx);
let surfaces=0;for(const o of m.BAY_OBJECTS)for(let k=0;k<32;k++){
 const c={id:o.id,x:500,y:310,w:o.dimensions.w,h:o.dimensions.h,a:k*Math.PI/16};
 const ordinary=ctx.occlude(c,200),pitched=ctx.occlude(c,200,1/m.DECK_PITCH);assert.equal(ordinary.length,pitched.length);
 for(let n=0;n<ordinary.length;n++)for(let j=0;j<ordinary[n].length;j++){assert.equal(ordinary[n][j].x,pitched[n][j].x);assert(Number.isFinite(pitched[n][j].y))}surfaces++;
}
console.log(`PASS: ${surfaces} pitched occlusion transforms across all actor families and full Grip angles.`);
