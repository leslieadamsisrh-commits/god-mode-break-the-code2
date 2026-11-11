const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),ts=require('typescript');
require.extensions['.ts']=(m,p)=>m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:1,target:9,esModuleInterop:true}}).outputText,p);
const {advanceRaptorPose,RAPTOR_POSE_DIRECTIONS}=require('../lib/raptorPose.ts');
const {newGame,setInput,advance}=require('../lib/game.ts');
const {barrelSocket27d}=require('../lib/ballistics27d.ts');
const inventory=require('../public/assets/raptor-v2/manifest.json'),registration=require('../docs/raptor-fluidity/batch20-registration.json');
for(const direction of inventory.movementDirections){
 const angle=RAPTOR_POSE_DIRECTIONS.indexOf(direction)*Math.PI/4,dx=Math.cos(angle),dy=Math.sin(angle),key=i=>`movement/${direction}/${String(i).padStart(3,'0')}.png`;
 const base={time:1,x:600,y:500,angle,travelAngle:angle,speed:0,sliding:false,airborne:false,verticalVelocity:0,hit:false,attached:false,firing:false};
 let pose=advanceRaptorPose(undefined,base);assert.equal(pose.frame.key,key(0));
 pose=advanceRaptorPose(pose.memory,{...base,time:1.016,speed:48,x:600+dx*.8,y:500+dy*.8});assert.equal(pose.frame.key,key(1));
 const seen=new Set();for(let i=1;i<110;i++){pose=advanceRaptorPose(pose.memory,{...base,time:1.016+i/60,speed:48,x:600+dx*(i+1)*.8,y:500+dy*(i+1)*.8});seen.add(pose.frame.frame)}
 for(const i of [2,3,4,5])assert.ok(seen.has(i));
 const time=pose.memory.gait.time;
 pose=advanceRaptorPose(pose.memory,{...base,time:time+.016});assert.equal(pose.frame.key,key(6));
 pose=advanceRaptorPose(pose.memory,{...base,time:time+.076});assert.equal(pose.frame.key,key(7));
 pose=advanceRaptorPose(pose.memory,{...base,time:time+.13});assert.equal(pose.frame.key,key(0));
 const phase=pose.memory.gait.phase;pose=advanceRaptorPose(pose.memory,{...base,time:time+.23});assert.equal(pose.memory.gait.phase,phase,'stationary actor does not cycle feet');
 const held=advanceRaptorPose(undefined,{...base,attached:true,coverState11:'brace'});
 const exit=advanceRaptorPose(held.memory,{...base,time:1.016,speed:48});assert.equal(exit.frame.key,key(1));
 assert.equal(advanceRaptorPose(exit.memory,{...base,time:1.13,speed:48,x:600+dx*2,y:500+dy*2}).frame.key,key(2));
 for(const interruption of [{airborne:true,verticalVelocity:50},{hit:true},{sliding:true},{attached:true,coverState11:'brace'}])assert.notEqual(advanceRaptorPose(pose.memory,{...base,time:time+.24,...interruption}).frame.family,'movement');
 for(let i=0;i<8;i++){
  const rec=inventory.frames[key(i)],bytes=fs.readFileSync('public/assets/raptor-v2/'+key(i));
  assert.equal(bytes.readUInt32BE(16),512);assert.equal(bytes.readUInt32BE(20),512);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),rec.sha256);assert.deepEqual(rec,registration.frames[key(i)]);assert.equal(rec.anchor[1],450);assert.ok(rec.muzzleGround[1]>rec.muzzle[1]);
 }
 const s=newGame('Raptor','local',0,'bot');s.phase='playing';s.covers=[];s.matter=[];s.players[1].bot=false;s.players[1].x=1200;s.players[1].y=660;
 const p=s.players[0];Object.assign(p,{character:'raptor',x:600,y:500,aim:angle,gunFacing:angle,coverId:null,grounded:true,z:0});
 const tick=(input={})=>{setInput(s,0,p.lastSeq+1,{aim:angle,...input});advance(s,s.lastAt+1000/60)};
 const actual=new Set();for(let i=0;i<120;i++){tick({x:dx*.24,y:dy*.24});actual.add(p.raptorFrame.key)}
 for(let i=2;i<=5;i++)assert.ok(actual.has(key(i)),`authority ${direction} phase${i}`);
 const ammo=p.shells;tick({x:dx*.24,y:dy*.24,fire:true});assert.equal(p.shells,ammo-1,'moving RT immediate');assert.equal(p.raptorFrame.family,'movement');
 const socket=barrelSocket27d(p,s.config.spriteScale),flash=s.fx.findLast(f=>f.type==='muzzle'&&f.owner===0),pellet=s.shots.findLast(shot=>shot.owner===0);
 assert.ok(socket.raptorAligned);assert.deepEqual([flash.x,flash.y,flash.z],[socket.x,socket.y,socket.z]);assert.ok(pellet);assert.ok(Math.hypot(pellet.x-pellet.vx*pellet.realAge-socket.x,pellet.y-pellet.vy*pellet.realAge-socket.y)<1e-6);
 console.log('PASS',direction,'eight phases, travel gait, planted idle, start/stop, exit, interruption, immediate moving shot and displayed muzzle');
}
assert.deepEqual(inventory.movementDirections,['right','left','back']);assert.deepEqual(inventory.movementReviewDirections,[]);
const coverage=require('../docs/raptor-fluidity/coverage.json');assert.equal(coverage.slots.length,534);assert.equal(new Set(coverage.slots.map(s=>s.id)).size,534);
console.log('PASS 24 active movement cels and 534 unique production slots; five directions and faster gaits remain pending');
