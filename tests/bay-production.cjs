const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),{stripTypeScriptTypes}=require('node:module');
const ctx={crypto:require('node:crypto').webcrypto,Math,performance};vm.createContext(ctx);
const map=stripTypeScriptTypes(fs.readFileSync('lib/bayBridgeMap.ts','utf8')).replace(/export /g,'');
const engine=stripTypeScriptTypes(fs.readFileSync('lib/game.ts','utf8')).replace(/^import .*\n/gm,'').replace(/export /g,'');
vm.runInContext(map+'\n'+engine+'\nglobalThis.api={BAY_OBJECTS,newGame,setInput,advance,joinGame,safeState,DEFAULT_CONFIG};',ctx);
const m=ctx.api;
for(const [key,value] of Object.entries({moveSpeed:222.7,dashSpeed:620,dashDuration:.19,doubleTapWindow:.28,slideSpeed:689.15949375,slideSustain:360,slideSteer:7.5,slideSteerResponse:7,slideBrake:9.5,shotCadence:.39,shotSpread:.04,shotDamage:10,cameraZoom:1.85}))assert.equal(m.DEFAULT_CONFIG[key],value,key);
let frames=0;
for(const mode of ['solo','bot']){
 const s=m.newGame('host','host-token',1000,mode);if(mode==='bot')m.joinGame(s,'guest','guest-token');s.phase='playing';
 for(let n=0;n<1200;n++){
  for(let slot=0;slot<s.players.length;slot++){
   const p=s.players[slot],phase=(n+slot*67)%240;
   m.setInput(s,slot,p.lastSeq+1,{x:Math.cos(n*.029+slot),y:Math.sin(n*.037),aim:n*.065,slide:phase===0,fire:phase%29===0,dash:phase===40,shield:phase>65&&phase<82,grip:phase>110&&phase<140,cover:phase===170,coverAim:phase>180&&phase<210,powerup:phase>215});
  }
  m.advance(s,s.lastAt+16);frames++;
  for(const p of s.players){assert(Number.isFinite(p.x)&&Number.isFinite(p.y)&&Number.isFinite(p.battery));assert(p.battery>=0)}
  const safe=m.safeState(s);assert(!JSON.stringify(safe).includes('host-token'));assert(!JSON.stringify(safe).includes('guest-token'));
 }
}
const source=fs.readFileSync('app/Game.tsx','utf8'),fn=source.slice(source.indexOf('function environmentActorAtlas('),source.indexOf('function environmentActorInk('));
ctx.environmentAssets=new Map(m.BAY_OBJECTS.map(o=>[o.renderedShell,{complete:true,naturalWidth:2172,naturalHeight:724}]));vm.runInContext(stripTypeScriptTypes(fn)+'\nglobalThis.renderAtlas=environmentActorAtlas',ctx);
let triangles=0;
for(const o of m.BAY_OBJECTS)for(let k=0;k<32;k++){
 const angle=k*Math.PI/16,co=Math.cos(angle),si=Math.sin(angle),project=(x,y,z)=>({x:x*co-y*si,y:x*si+y*co-z});let points=[],matrix,saves=0;
 const g={save(){saves++},restore(){saves--},beginPath(){points=[]},moveTo(x,y){points.push({x,y})},lineTo(x,y){points.push({x,y})},closePath(){},clip(){assert.equal(points.length,3)},transform(...args){matrix=args},drawImage(){assert(matrix.every(Number.isFinite));triangles++},stroke(){}};
 const before=JSON.stringify(o);ctx.renderAtlas(g,{a:angle},o,o.dimensions.z,o.dimensions.w,o.dimensions.h,project);assert.equal(saves,0);assert.equal(JSON.stringify(o),before);
}
console.log(`PASS: frozen combat constants; ${frames} host frames with two input slots, safe snapshots and finite state; ${triangles} rig texture triangles across 10 actors × 32 rotations.`);
const occ=stripTypeScriptTypes(fs.readFileSync('lib/cover-occlusion.ts','utf8')).replace(/^import .*\n/gm,'').replace(/export /g,'');vm.runInContext(occ+';globalThis.occlude=coverOccluders;',ctx);
const inside=(poly,x,y)=>{let hit=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a.y>y)!=(b.y>y)&&x<(b.x-a.x)*(y-a.y)/(b.y-a.y)+a.x)hit=!hit}return hit};
let clips=0;
for(const o of m.BAY_OBJECTS)for(let k=0;k<32;k++){
 const c={id:o.id,x:500,y:310,w:o.dimensions.w,h:o.dimensions.h,a:k*Math.PI/16},original=JSON.stringify(c);
 const polygons=ctx.occlude(c,200);assert(polygons.length>0);for(const p of polygons)for(const v of p){assert(Number.isFinite(v.x)&&Number.isFinite(v.y));assert(v.y>=310-Math.hypot(c.w,c.h)/2-o.dimensions.z-.01)}
 assert.equal(JSON.stringify(c),original);assert.equal(ctx.occlude(c,500).length,0);clips++;
}
const cabinet=m.BAY_OBJECTS.find(o=>o.shellProfile==='CABINET'),c={id:cabinet.id,x:500,y:310,w:48,h:58,a:0};assert(ctx.occlude(c,200).some(poly=>inside(poly,500,250)),'tall cabinet must conceal within its authored height');assert(!ctx.occlude(c,200).some(poly=>inside(poly,500,195)),'sky above shell must remain visible');
console.log(`PASS: ${clips} rig concealment transforms; tall cover height, clear sky, finite geometry and immutable hulls.`);
