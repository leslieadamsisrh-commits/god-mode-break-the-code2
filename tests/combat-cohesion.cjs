// Exercise real input handoffs through the shared authoritative engine.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),{stripTypeScriptTypes}=require('node:module');
const ctx={crypto:require('node:crypto').webcrypto};vm.createContext(ctx);vm.runInContext(stripTypeScriptTypes(fs.readFileSync('lib/game.ts','utf8')).replace(/export /g,'')+';globalThis.api={newGame,setInput,advance,joinGame,safeState,circleBox};',ctx);const m=ctx.api;let checks=0;
for(const multiplayer of [false,true]){
 const s=m.newGame('cohesion','host',1000,multiplayer?'bot':'solo');if(multiplayer){m.joinGame(s,'guest','guest');s.phase='playing'}s.matter=[];const p=s.players[0];
 const tick=(input,n=1)=>{for(let k=0;k<n;k++){m.setInput(s,0,p.lastSeq+1,input);m.advance(s,s.lastAt+16);const snapshot=JSON.parse(JSON.stringify(m.safeState(s)));assert.equal(snapshot.players[0].token,undefined);assert.equal(snapshot.players[0].gripCoverId,p.gripCoverId);assert.equal(snapshot.covers.length,s.covers.length);assert(Number.isFinite(p.x)&&Number.isFinite(p.y));}};
 tick({x:1,aim:0},2);assert(p.x>230);checks++;
 tick({slide:true,x:1,aim:0});tick({x:1,aim:0},14);assert.equal(p.coverId,'cover-piece-01');assert.equal(p.coverMode,'soft');assert.equal(p.battery,88);checks++;
 const a={...p.coverAnchor},t=p.coverAnchor.t,aim=Math.atan2(a.ny,a.nx);tick({x:a.tx*.4,y:a.ty*.4,aim},6);assert(p.coverAnchor.t>t);checks++;
 tick({coverAim:true,aim},2);assert.equal(p.coverMode,'braced');tick({coverAim:true,fire:true,aim});assert(s.shots.length>0);checks++;
 tick({aim});assert(!p.peek);assert(p.returnToCover>0);tick({cover:true,aim});const created=s.covers.find(c=>c.generated);assert(created);tick({aim},2);assert(s.covers.includes(created));checks++;
 tick({grip:true,aim});assert.equal(p.gripCoverId,'cover-piece-01');assert.equal(p.coverId,null);const cv=s.covers.find(c=>c.id===p.gripCoverId),before={x:cv.x,y:cv.y};tick({grip:true,x:a.tx*.4,y:a.ty*.4,aim},8);assert(Math.hypot(cv.x-before.x,cv.y-before.y)>0);checks++;
 tick({aim});assert.equal(p.gripCoverId,null);assert.equal(cv.build,0);checks++;
 tick({grip:true,aim});assert.equal(p.gripCoverId,cv.id);tick({grip:true,fire:true,aim});assert.equal(p.gripCoverId,null);assert(p.fireBlocked);assert.equal(s.shots.length,0);checks++;
 tick({grip:true,fire:true,aim},20);assert.equal(s.shots.length,0);tick({aim});tick({fire:true,aim});assert.equal(p.lastShot,s.time);checks++;
 const retained=p.battery;tick({powerup:true,fire:true,aim},90);assert(p.charging);assert(p.battery>retained);assert.equal(s.shots.length,0);checks++;
 tick({aim},20);assert(!p.charging);assert(p.godTime>0);tick({fire:true,aim});assert.equal(p.lastShot,s.time);checks++;
 tick({aim});const powered=p.battery;tick({powerup:true,aim},10);assert(p.charging);assert(p.battery>powered);assert.equal(p.godTime,0);checks++;
}
// Created cover can be moved, and fresh Y drops it without firing/throwing.
{
 const s=m.newGame('created','host',1000,'solo'),p=s.players[0];s.covers=[];s.matter=[];
 const tick=(i,n=1)=>{for(let k=0;k<n;k++){m.setInput(s,0,p.lastSeq+1,i);m.advance(s,s.lastAt+16)}};
 tick({cover:true,aim:0});const cv=s.covers[0];tick({grip:true,aim:0});assert.equal(p.gripCoverId,cv.id);const y=cv.y;tick({grip:true,x:0,y:1,aim:0},8);assert(cv.y>y);checks++;
 tick({grip:true,powerup:true,aim:0});assert(p.charging);assert.equal(p.gripCoverId,null);assert.equal(cv.build,0);assert.equal(cv.vx,0);assert.equal(s.shots.length,0);checks++;
}
console.log(`PASS: ${checks} combat-chain stages across solo, joined host/guest snapshots and generated-cover recharge.`);
