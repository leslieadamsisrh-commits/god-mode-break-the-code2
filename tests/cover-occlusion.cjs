const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),{stripTypeScriptTypes}=require('node:module');
const source=fs.readFileSync('lib/cover-occlusion.ts','utf8');const ctx={};vm.createContext(ctx);vm.runInContext(stripTypeScriptTypes(source).replaceAll('export ','')+';globalThis.api={coverOccluder,withCoverOcclusion,COVER_HEIGHT};',ctx);
const {coverOccluder,withCoverOcclusion,COVER_HEIGHT:z}=ctx.api;
const footprint=c=>[[-c.w/2,-c.h/2],[c.w/2,-c.h/2],[c.w/2,c.h/2],[-c.w/2,c.h/2]].map(([x,y])=>({x:c.x+x*Math.cos(c.a)-y*Math.sin(c.a),y:c.y+x*Math.sin(c.a)+y*Math.cos(c.a)}));
function inside(poly,x,y){let hit=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const a=poly[i],b=poly[j];if((a.y>y)!=(b.y>y)&&x<(b.x-a.x)*(y-a.y)/(b.y-a.y)+a.x)hit=!hit}return hit}
// Independent vertical-ray oracle: find the footprint interval at x, then its solid height.
function ray(c,x,y,depth){const f=footprint(c),ys=[];for(let n=0;n<4;n++){const a=f[n],b=f[(n+1)%4];if(x>Math.min(a.x,b.x)&&x<Math.max(a.x,b.x))ys.push(a.y+(b.y-a.y)*(x-a.x)/(b.x-a.x))}if(ys.length<2)return false;const lo=Math.max(Math.min(...ys),depth),hi=Math.max(...ys);return hi>lo&&y>lo-z&&y<hi}
let checks=0;
for(const angle of [0,Math.PI/6,Math.PI/4,Math.PI/2,-Math.PI/4,Math.PI*.73])for(const dims of [[160,24],[24,160]])for(const offset of [-110,-50,-12,0,12,50,110]){
 const c={x:310,y:300,w:dims[0],h:dims[1],a:angle},depth=c.y+offset,polygon=coverOccluder(c,depth);
 for(let x=210.371;x<411;x+=7.13)for(let y=140.217;y<411;y+=7.37){assert.equal(inside(polygon,x,y),ray(c,x,y,depth),`angle=${angle} size=${dims} depth=${depth} pixel=${x},${y}`);checks++}
}
// Reproduce the old whole-object ordering defect: the distant tip hides the near part too.
const diagonal={x:310,y:300,w:24,h:160,a:Math.PI/4},depth=300,near={x:350,y:240};
assert(diagonal.y+Math.abs(Math.sin(diagonal.a))*diagonal.w/2+Math.abs(Math.cos(diagonal.a))*diagonal.h/2>depth);
assert(inside([...coverOccluder(diagonal,190)],near.x,near.y));assert(!inside(coverOccluder(diagonal,depth),near.x,near.y));
// Moving covers recompute from their current transform; no cached ID/angle or host mutation.
const original=JSON.stringify(diagonal);assert.notDeepEqual(coverOccluder(diagonal,depth),coverOccluder({...diagonal,x:390,a:-Math.PI/4},depth));assert.equal(JSON.stringify(diagonal),original);
let clips=0,saves=0,restores=0,draws=0;const g={save(){saves++},restore(){restores++},beginPath(){},rect(){},moveTo(){},lineTo(){},closePath(){},clip(rule){assert.equal(rule,'evenodd');clips++}};
withCoverOcclusion(g,[diagonal,{...diagonal,x:320}],depth,1,()=>draws++);assert.equal(clips,2);assert.equal(saves,1);assert.equal(restores,1);assert.equal(draws,1);
clips=0;withCoverOcclusion(g,[{...diagonal,generated:true,born:1}],depth,1.3,()=>{});assert.equal(clips,0);withCoverOcclusion(g,[{...diagonal,generated:true,born:1}],depth,1.8,()=>{});assert.equal(clips,1);
const game=fs.readFileSync('app/Game.tsx','utf8');assert(game.includes('actors.forEach(o=>withCoverOcclusion(g,covers,o.y,s.time,o.fn))'));assert(game.includes('z=COVER_HEIGHT,w=c.w'));
console.log(`PASS: ${checks} independent cover-depth pixel checks; near-tip regression, front/side/corner, six angles, long/wide covers, moving transforms, overlapping clips, formation and renderer height parity.`);
