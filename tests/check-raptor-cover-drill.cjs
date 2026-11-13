const fs=require('node:fs'),assert=require('node:assert/strict'),ts=require('typescript');
require.extensions['.ts']=(module,path)=>module._compile(ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:1,target:9,esModuleInterop:true}}).outputText,path);
const {newGame,placeRaptorCoverDrill,setInput,advance,startOrRematch}=require('../lib/game.ts');

function drill(mode,position){
 const s=newGame('Drill','local',0,'bot');
 s.players[0].character='raptor';
 placeRaptorCoverDrill(s,mode,position);
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


for(const mode of ['shuffle','shuffle-left']){
 const {s,p,wall,wallPose,aim,tx,ty,tick,seen}=drill(mode);
 const direction=mode==='shuffle'?'right':'left';
 const hold='cover-hold/'+direction+'/000.png',pop='cover-pop/'+direction+'/000.png';
 assert.ok(seen.has('cover-catch/'+direction+'/000.png'));
 for(const sign of [-1,1]){
  seen.clear();
  tick({x:tx*sign,y:ty*sign},16);
  assert.ok(seen.has('cover-shuffle/'+direction+'/000.png'));
  assert.ok(seen.has('cover-shuffle/'+direction+'/001.png'));
  tick();
  assert.equal(p.raptorFrame.key,hold);
 }
 const root=[p.x,p.y,p.coverAnchor.t];
 const shell=p.shells;
 seen.clear();
 tick({aim:aim+.2,coverAim:true},4);
 assert.ok(seen.has('cover-bridge/'+direction+'/000.png'));
 assert.equal(p.raptorFrame.key,pop);
 tick({aim:aim-.2,coverAim:true},4);
 assert.equal(p.raptorFrame.key,pop);
 assert.deepEqual([p.x,p.y,p.coverAnchor.t],root);
 tick({fire:true});
 assert.equal(p.shells,shell-1,'RT alone fires a clear, braced waist shot');
 assert.equal(p.raptorFrame.key,'cover-recoil/'+direction+'/000.png');
 const socket=require('../lib/ballistics27d.ts').barrelSocket27d(p,s.config.spriteScale);
 assert.equal(socket.raptorAligned,true);
 assert.ok(socket.z>wall.height27j+(wall.z||0));
 const flash=s.fx.findLast(f=>f.type==='muzzle'&&f.owner===0);
 assert.deepEqual([flash.x,flash.y,flash.z],[socket.x,socket.y,socket.z]);
 tick({},20);
 assert.ok(seen.has('cover-recoil/'+direction+'/001.png'));
 assert.ok(seen.has('cover-bridge/'+direction+'/001.png'));
 assert.equal(p.raptorFrame.key,hold);
 assert.deepEqual([p.x,p.y,p.coverAnchor.t],root);
 assert.deepEqual([wall.x,wall.y,wall.a],wallPose);
}
console.log('PASS both waist facings keep planted root and fire on RT with the displayed muzzle');

for(const mode of ['wrap','rotated-wrap'])for(const face of ['far','near'])for(const endpoint of ['start','end']){
 const {p,wall,wallPose,tx,ty,seen,tick}=drill(mode,{face,endpoint});
 const sign=endpoint==='start'?-1:1,aim=Math.atan2(ty*sign,tx*sign);
 const dir=sign<0?'left':'right',start=[p.x,p.y,p.coverAnchor.t],shells=p.shells;
 assert.equal(p.coverAnchor.face,face==='far'?'top':'bottom');
 tick({},6);
 assert.equal(p.raptorFrame.key,'cover-wrap/'+dir+'/000.png');
 tick({aim,coverAim:true},8);
 assert.ok(seen.has('cover-wrap/'+dir+'/001.png'));
 assert.equal(p.raptorFrame.key,'cover-lean/'+dir+'/000.png');
 tick({aim,fire:true});
 assert.equal(p.shells,shells-1);
 assert.equal(p.raptorFrame.key,'cover-lean/'+dir+'/000.png');
 tick({},20);
 assert.equal(p.raptorFrame.key,'cover-wrap/'+dir+'/000.png');
 assert.deepEqual([p.x,p.y,p.coverAnchor.t],start);
 assert.deepEqual([wall.x,wall.y,wall.a],wallPose);
}
console.log('PASS tall end starts on both faces of both drill rotations with visible pivot, RT and planted return');


for(const mode of ['wrap','rotated-wrap'])for(const sign of [-1,1]){
 const {p,wall,s,tick,seen}=drill(mode,{face:'near'});
 assert.equal(p.raptorFrame.key,'cover-hold/back/000.png');
 const aim=Math.atan2(-p.coverAnchor.ny,-p.coverAnchor.nx),shells=p.shells;
 tick({aim,coverAim:true,fire:true},2);
 assert.equal(p.shells,shells);
 const direction=sign<0?'left':'right',diagonal='back-'+direction;
 const movement={x:sign*Math.cos(wall.a),y:sign*Math.sin(wall.a)};
 tick(); seen.clear();
 tick(movement,20);
 tick({},10);
 assert.ok(seen.has('cover-shuffle/back/000.png')&&seen.has('cover-shuffle/back/001.png'));
 assert.ok(seen.has('cover-corner/'+diagonal+'/000.png'));
 assert.equal(p.raptorFrame.key,'cover-wrap/'+direction+'/000.png');
 const root=[p.x,p.y,p.coverAnchor.t];
 const out=sign<0?-3*Math.PI/4:-Math.PI/4;
 tick({aim:out,coverAim:true},10);
 assert.equal(p.raptorFrame.key,'cover-recoil/'+diagonal+'/001.png');
 assert.deepEqual([p.x,p.y,p.coverAnchor.t],root);
 tick({aim:out,fire:true});
 assert.equal(p.shells,shells-1);
 assert.equal(p.raptorFrame.key,'cover-recoil/'+diagonal+'/000.png');
 const socket=require('../lib/ballistics27d.ts').barrelSocket27d(p,s.config.spriteScale);
 const flash=s.fx.findLast(f=>f.type==='muzzle'&&f.owner===0);
 assert.deepEqual([flash.x,flash.y,flash.z],[socket.x,socket.y,socket.z]);
 assert.equal(flash.raptorFrameKey,p.raptorFrame.key);
 const pellet=s.shots.find(shot=>shot.owner===0);
 assert.ok(pellet);
 assert.ok(Math.hypot(pellet.x-pellet.vx*pellet.realAge-socket.x,pellet.y-pellet.vy*pellet.realAge-socket.y)<1e-6);
 tick({aim:out},20);
 assert.equal(p.raptorFrame.key,'cover-wrap/'+direction+'/000.png');
 assert.deepEqual([p.x,p.y,p.coverAnchor.t],root);
 tick({aim:out,slide:true});
 assert.equal(p.coverId,null);
 assert.ok(p.raptorFrame.key.startsWith('recovery/')||p.raptorFrame.key.startsWith('movement/'));
}
console.log('PASS rear brace, distance-driven shuffle, both corner pivots, both authored diagonal shots and cover exit');

{
 const {advanceRaptorPose,RAPTOR_POSE_DIRECTIONS}=require('../lib/raptorPose.ts');
 for(const [index,direction] of RAPTOR_POSE_DIRECTIONS.entries()){
  const angle=index*Math.PI/4;
  const planted={time:1,x:0,y:0,angle,speed:0,attached:true,sliding:false,airborne:false,verticalVelocity:0,hit:false,firing:false,coverState11:'brace'};
  const hold=advanceRaptorPose(undefined,planted);
  const traveling={...planted,time:1.016,x:2,y:2,attached:false,coverState11:undefined,speed:48,travelAngle:angle};
  const exit=advanceRaptorPose(hold.memory,traveling);
  assert.equal(exit.frame.key,['right','left','back','back-left'].includes(direction)?'movement/'+direction+'/001.png':'recovery/'+direction+'/000.png');
  assert.equal(advanceRaptorPose(exit.memory,{...traveling,time:1.13,x:5,y:5}).frame.key,['right','left','back'].includes(direction)?'movement/'+direction+'/002.png':'stalk/'+direction+'/000.png');
  assert.notEqual(advanceRaptorPose(hold.memory,{...traveling,airborne:true,verticalVelocity:25}).frame.family,'recovery');
 }
 console.log('PASS eight exit connectors lead to first planted stride and never replace airborne art');
}

{
 const {s,p,wall,tick}=drill('wrap',{face:'near',endpoint:'end'});
 const jade=s.players[1];
 jade.character='jade';
 Object.assign(jade,{x:p.x+106,y:p.y+18,aim:Math.PI,gunFacing:Math.PI,bot:false});
 const aim=Math.atan2(p.y-jade.y,p.x-jade.x);
 setInput(s,1,jade.lastSeq+1,{aim});
 const before=p.shells, pHP=p.hp, jadeHP=jade.hp;
 tick({aim:-Math.PI/4,fire:true});
 assert.equal(p.shells,before-1);
 assert.equal(p.raptorFrame.key,'cover-recoil/back-right/000.png');
 tick({},20);
 assert.equal(jade.hp,jadeHP);
 setInput(s,1,jade.lastSeq+1,{aim,fire:true});
 tick({slide:true,y:1});
 assert.equal(p.coverId,null);
 assert.ok(['recovery','movement'].includes(p.raptorFrame.family));
 setInput(s,1,jade.lastSeq+1,{aim,fire:false});
 tick({y:1},12);
 assert.ok(p.hp<pHP);
 assert.equal(s.covers[0],wall);
 const round=s.round;
 startOrRematch(s,0);
 assert.equal(s.round,round+1);
 assert.equal(s.phase,'countdown');
 assert.equal(s.players[0].character,'raptor');
 assert.equal(s.players[1].character,'jade');
 assert.equal(s.players[0].coverId,null);
 assert.equal(s.shots.length,0);
 console.log('PASS missed cover shot, Jade punish, exit under pressure, and clean rematch');
}
