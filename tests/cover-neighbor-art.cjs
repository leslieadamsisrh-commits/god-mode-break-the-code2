const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),{stripTypeScriptTypes}=require('node:module');
const source=fs.readFileSync('app/Game.tsx','utf8'),start=source.indexOf('const COVER_CONNECTOR_RECTS='),end=source.indexOf('function fighter(',start),image={};
const ctx={powerAssets:new Map([['cover-d02-d04-exposure-v1',image]])};vm.createContext(ctx);vm.runInContext(stripTypeScriptTypes(source.slice(start,end))+';globalThis.api={coverNeighborFrame,drawCoverNeighbor,COVER_NEIGHBOR_POSES};',ctx);
const {coverNeighborFrame:frame,drawCoverNeighbor:draw,COVER_NEIGHBOR_POSES:poses}=ctx.api,scale=.82,unit=125*143/250/445*scale;
const p={x:500,y:280.5,coverId:'wall',coverMode:'braced',peek:true,input:{coverAim:true},kickStage:'none'};
for(const [dir,index] of [[2,0],[4,2]]){
 const q={...p,gunFacing:dir*Math.PI/12};assert.equal(frame(q),index);assert.equal(frame({...q,fireState:.1}),index+1);
 for(const patch of [{peek:false},{coverMode:'soft'},{input:{coverAim:false}},{charging:true},{powerReturn:.1},{knock:.1},{slide:.1},{exit:{}},{gripId:'held'},{kickStage:'strike'}])assert.equal(frame({...q,...patch}),null);
}
for(const dir of [0,1,3,5,6,12,18])assert.equal(frame({...p,gunFacing:dir*Math.PI/12}),null);
for(let k=0;k<4;k++){
 assert.equal(frame({...p,coverPreview:k}),null);assert.equal(frame({...p,coverPreview:k+4}),k);
 let args,clips=0;draw({save(){},beginPath(){},rect(){clips++},clip(){},restore(){},drawImage(...a){args=a}}, {...p,coverPreview:k+4},{spriteScale:scale});
 assert.equal(args[0],image);assert.equal(clips,poses[k].bands.length);assert.equal(args[7]/args[3],args[8]/args[4]);
 const sole=[543,544,1011,1012][k];assert(Math.abs(args[6]+(sole-args[2])*unit-(p.y+27*125*143/250/638*scale))<1e-9);
}
ctx.powerAssets.clear();assert.equal(frame({...p,coverPreview:4}),null);
assert(fs.readFileSync('public/assets/god-frame/cover-d02-d04-exposure-v1.png').equals(fs.readFileSync('art/combat-cohesion/d02-d04-over-cover/appearance-approved-review-v1.png')));
const game={crypto:require('node:crypto').webcrypto};vm.createContext(game);vm.runInContext(stripTypeScriptTypes(fs.readFileSync('lib/game.ts','utf8')).replace(/export /g,'')+';globalThis.api={newGame,attachCover,setInput,advance,safeState};',game);
const m=game.api,wall={id:'wall',x:500,y:320,w:160,h:42,a:0,hp:140,maxHp:140,generated:false,build:0};
for(const [dir,index] of [[2,1],[4,3]]){
 const setup=()=>{const s=m.newGame('neighbor','host',1000,'solo'),q=s.players[0];s.covers=[{...wall}];s.matter=[];q.x=p.x;q.y=p.y;m.attachCover(q,s.covers[0],s,'braced');return [s,q]};
 const [s,q]=setup(),aim=dir*Math.PI/12,tick=i=>{m.setInput(s,0,q.lastSeq+1,i);m.advance(s,s.lastAt+16)};
 tick({coverAim:true,fire:true,aim});assert.equal(s.shots.length,7);const flash=s.fx.find(f=>f.type==='muzzle'),sh=s.shots[0],pose=poses[index];
 const expectedX=q.x+(pose.muzzle[0]-pose.anchor[0])*unit,expectedY=q.y+(pose.muzzle[1]-pose.anchor[1])*unit;
 assert(Math.abs(flash.x-expectedX)<1e-9);assert(Math.abs(flash.y-flash.z-expectedY)<1e-9);assert.equal(flash.renderOffsetX,0);
 assert(Math.abs(sh.x-flash.x-sh.vx*.016)<1e-9);assert(Math.abs(sh.y-flash.y-sh.vy*.016)<1e-9);assert(sh.z>15616/332);
 const snap=JSON.parse(JSON.stringify(m.safeState(s)));assert.equal(snap.shots[0].z,sh.z);assert.equal(snap.shots[0].x,sh.x);
 tick({aim});assert(!q.peek&&q.returnToCover>0);tick({powerup:true,aim});assert(q.charging&&!q.peek);
 const [blocked,b]=setup(),barrelY=b.y+Math.sin(aim)*33+Math.cos(aim)*-2;
 blocked.covers.push({...wall,id:'barrel-obstacle',x:expectedX,y:barrelY,w:2,h:2});m.setInput(blocked,0,1,{coverAim:true,fire:true,aim});m.advance(blocked,1016);assert.equal(blocked.shots.length,0);assert(blocked.fx.some(f=>f.type==='cover-block'));
}
console.log('PASS: four approved neighbor poses; shared sole/scale, immediate overrides/fallback, byte-identical art, d02/d04 authoritative barrel/travel/snapshot parity and second-cover collision.');
