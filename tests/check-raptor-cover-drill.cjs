const fs=require('node:fs'),assert=require('node:assert/strict'),ts=require('typescript');
require.extensions['.ts']=(module,path)=>module._compile(ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:1,target:9,esModuleInterop:true}}).outputText,path);
const {newGame,placeRaptorCoverDrill,setInput,advance,startOrRematch}=require('../lib/game.ts');

function drill(mode){
 const s=newGame('Drill','local',0,'bot');
 s.players[0].character='raptor';
 placeRaptorCoverDrill(s,mode);
 const wall=s.covers[0],p=s.players[0],seen=new Set();
 const spawn=[p.x,p.y,p.gunFacing],wallPose=[wall.x,wall.y,wall.a];
 const tx=Math.cos(wall.a),ty=Math.sin(wall.a),aim=spawn[2];
 const tick=(input={},count=1)=>{
  for(let i=0;i<count;i++){
   setInput(s,0,p.lastSeq+1,{aim,...input});
   advance(s,s.lastAt+1000/60);
   seen.add(p.raptorFrame.key);
  }
 };
 assert.equal(s.phase,'playing');
 assert.equal(s.players[1].bot,false);
 tick({x:Math.cos(aim),y:Math.sin(aim),slide:true});
 tick({},18);
 assert.equal(p.coverId,wall.id);
 assert.equal(p.coverMode,'soft');
 tick({slide:true});
 tick({},12);
 assert.equal(p.coverMode,'braced');
 return {s,p,wall,wallPose,spawn,seen,tx,ty,aim,tick};
}
{
 const {s,p,wall,wallPose,spawn,seen,tx,ty,tick}=drill('shuffle');
 assert.ok(seen.has('cover-catch/right/000.png'));
 const hold='cover-hold/right/000.png';
 assert.equal(p.raptorFrame.key,hold);
 for(const sign of [-1,1]){
  const before=[p.x,p.y],t=p.coverAnchor.t;
  seen.clear();
  tick({x:tx*sign,y:ty*sign},16);
  assert.ok(Math.hypot(p.x-before[0],p.y-before[1])>20);
  assert.notEqual(p.coverAnchor.t,t);
  assert.ok(seen.has('cover-shuffle/right/000.png')&&seen.has('cover-shuffle/right/001.png'));
  assert.ok([...seen].every(key=>key===hold||key.startsWith('cover-shuffle/right/')));
  tick({},1);
  const stopped=[p.x,p.y,p.coverAnchor.t];
  tick({},20);
  assert.equal(Math.abs(p.coverSpeed),0);
  assert.deepEqual([p.x,p.y,p.coverAnchor.t],stopped);
  assert.equal(p.raptorFrame.key,hold);
  assert.deepEqual([wall.x,wall.y,wall.a],wallPose);
 }
 startOrRematch(s,0);
 placeRaptorCoverDrill(s,'shuffle');
 const r=s.players[0];
 assert.deepEqual([r.x,r.y,r.gunFacing],spawn);
 assert.deepEqual(s.covers.map(c=>[c.x,c.y,c.a]),[wallPose]);
}
for(const mode of ['wrap','rotated-wrap'])for(const side of [-1,1]){
 const {p,wall,wallPose,seen,tx,ty,aim,tick}=drill(mode);
 const startAmmo=p.shells;
 tick({aim,coverAim:true,fire:true},10);
 assert.equal(p.shells,startAmmo,'tall center blocks fire');
 tick();
 tick({x:tx*side,y:ty*side},24);
 tick({},8);
 const root=[p.x,p.y,p.coverAnchor.t],direction=side<0?'left':'right';
 const tuck='cover-wrap/'+direction+'/000.png';
 assert.equal(p.raptorFrame.key,tuck);
 seen.clear();
 const aimOut=Math.atan2(ty*side,tx*side);
 tick({aim:aimOut,coverAim:true},10);
 assert.equal(p.raptorFrame.key,'cover-lean/'+direction+'/000.png');
 assert.ok(seen.has('cover-wrap/'+direction+'/001.png'));
 tick({aim:aimOut,coverAim:true,fire:true},2);
 assert.equal(p.shells,startAmmo-1);
 seen.clear();
 tick({aim:aimOut},32);
 assert.ok(seen.has('cover-wrap/'+direction+'/001.png'));
 assert.equal(p.raptorFrame.key,tuck);
 assert.deepEqual([p.x,p.y,p.coverAnchor.t],root);
 assert.deepEqual([wall.x,wall.y,wall.a],wallPose);
}
console.log('PASS Raptor drill catch, two shuffle directions and foot poses, stop, repeatable reset, both tall ends at 0° and 15°, blocked center, fire and planted retract');
