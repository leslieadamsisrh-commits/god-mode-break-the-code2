const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),{stripTypeScriptTypes}=require('node:module');
const ctx={crypto:require('node:crypto').webcrypto};vm.createContext(ctx);
vm.runInContext(stripTypeScriptTypes(fs.readFileSync('lib/game.ts','utf8')).replace(/export /g,'')+';globalThis.api={newGame,setInput,advance,attachCover,safeState};',ctx);
const m=ctx.api;let checks=0;
for(const rotation of [0,.4,Math.PI/2,-.7])for(const side of [[0,-1],[1,0],[0,1],[-1,0]]){
 const s=m.newGame('exposure','host',1000,'solo'),p=s.players[0];s.matter=[];
 const cv={id:'wall',x:500,y:320,w:160,h:42,a:rotation,hp:140,maxHp:140,generated:false,build:0,variant:0};s.covers=[cv];
 const nx=side[0]*Math.cos(rotation)-side[1]*Math.sin(rotation),ny=side[0]*Math.sin(rotation)+side[1]*Math.cos(rotation),radius=side[0]?98.5:39.5;
 p.x=cv.x+nx*radius;p.y=cv.y+ny*radius;m.attachCover(p,cv,s,'braced');const ground={x:p.x,y:p.y};
 const aim=Math.atan2(-ny,-nx),tick=(i,n=1)=>{for(let k=0;k<n;k++){m.setInput(s,0,p.lastSeq+1,i);m.advance(s,s.lastAt+16)}};
 tick({coverAim:true,aim});assert(p.peek);assert.equal(p.x,ground.x);assert.equal(p.y,ground.y);checks++;
 tick({coverAim:true,fire:true,aim});assert.equal(s.shots.length,7);assert(s.shots.every(sh=>sh.z>15616/332&&sh.clearanceCoverId==='wall'));assert.equal(s.fx.find(f=>f.type==='muzzle').z,s.shots[0].z);checks++;
 const snapshot=JSON.parse(JSON.stringify(m.safeState(s)));assert(snapshot.players[0].peek);assert.equal(snapshot.shots[0].z,s.shots[0].z);checks++;
 tick({aim});assert(!p.peek);assert(p.returnToCover>0);assert.equal(p.x,ground.x);assert.equal(p.y,ground.y);checks++;
 tick({powerup:true,aim});assert(p.charging);assert(!p.peek);checks++;
 // No immunity to separate cover, even while exposing across the attached wall.
 const t=m.newGame('blocked','host',1000,'solo'),q=t.players[0];t.matter=[];t.covers=[cv];q.x=ground.x;q.y=ground.y;m.attachCover(q,cv,t,'braced');
 t.covers.push({...cv,id:'second',x:q.x-nx*25,y:q.y-ny*25,w:12,h:12,a:0});
 m.setInput(t,0,0,{coverAim:true,fire:true,aim});m.advance(t,1016);assert.equal(t.shots.length,0);assert(t.fx.some(f=>f.type==='cover-block'));checks++;
}
console.log(`PASS: ${checks} exposure checks: four faces/four rotations, planted anchors, height parity, attached-only clearance, release/recharge and serialized host state.`);
