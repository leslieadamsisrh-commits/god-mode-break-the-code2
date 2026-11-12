const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),ts=require('typescript');
require.extensions['.ts']=(m,p)=>m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:1,target:9,esModuleInterop:true}}).outputText,p);
const {advanceRaptorPose}=require('../lib/raptorPose.ts'),inventory=require('../public/assets/raptor-v2/manifest.json');
const {newGame,setInput,advance}=require('../lib/game.ts');
for(const [direction,angle] of [['right',0]]){
 const base={time:1,x:600,y:500,angle,travelAngle:angle,speed:0,sliding:false,airborne:false,verticalVelocity:0,hit:false,attached:false,firing:false};
 const key=i=>`movement/${direction}/${String(i).padStart(3,'0')}.png`;
 let pose=advanceRaptorPose(undefined,base);assert.equal(pose.frame.key,key(0));
 pose=advanceRaptorPose(pose.memory,{...base,time:1.016,speed:48,x:601});assert.equal(pose.frame.key,key(1));
 const seen=new Set();
 for(let i=1;i<110;i++){pose=advanceRaptorPose(pose.memory,{...base,time:1.016+i/60,speed:48,x:601+i*.8});seen.add(pose.frame.frame);}
 for(const i of [2,3,4,5])assert.ok(seen.has(i),'alternating contacts and passes');
 let time=pose.memory.gait.time;
 pose=advanceRaptorPose(pose.memory,{...base,time:time+.016});assert.equal(pose.frame.key,key(6));
 pose=advanceRaptorPose(pose.memory,{...base,time:time+.076});assert.equal(pose.frame.key,key(7));
 pose=advanceRaptorPose(pose.memory,{...base,time:time+.13});assert.equal(pose.frame.key,key(0));
 const stationary=advanceRaptorPose(pose.memory,{...base,time:time+.15});assert.equal(stationary.memory.gait.phase,pose.memory.gait.phase);
 const held=advanceRaptorPose(undefined,{...base,attached:true,coverState11:'brace'});
 const exit=advanceRaptorPose(held.memory,{...base,time:1.016,speed:48});assert.equal(exit.frame.key,key(1));
 const first=advanceRaptorPose(exit.memory,{...base,time:1.13,speed:48,x:602});assert.equal(first.frame.key,key(2));
 for(const interruption of [{airborne:true,verticalVelocity:50},{hit:true},{sliding:true},{attached:true,coverState11:'brace'}])assert.notEqual(advanceRaptorPose(pose.memory,{...base,time:time+.14,...interruption}).frame.family,'movement');
 const firing=advanceRaptorPose(undefined,{...base,speed:48,firing:true});assert.ok(firing.frame.frame>=2,'immediate fire skips cosmetic start');
 for(let i=0;i<8;i++){
  const rec=inventory.frames[key(i)],buf=fs.readFileSync('public/assets/raptor-v2/'+key(i));
  assert.equal(buf.readUInt32BE(16),512);assert.equal(buf.readUInt32BE(20),512);assert.equal(crypto.createHash('sha256').update(buf).digest('hex'),rec.sha256);if(i!==0)assert.deepEqual(rec,require('../docs/raptor-fluidity/batch29-registration.json')[key(i)]);assert.equal(rec.anchor[1],450);assert.ok(rec.muzzle[1]<450);
 }
 const s=newGame('Raptor','local',0,'bot');s.phase='playing';s.covers=[];s.matter=[];s.players[1].bot=false;s.players[1].x=1200;s.players[1].y=500;
 const p=s.players[0];Object.assign(p,{character:'raptor',x:600,y:500,aim:angle,gunFacing:angle,coverId:null,grounded:true,z:0});
 const tick=input=>{setInput(s,0,p.lastSeq+1,{aim:angle,...input});advance(s,s.lastAt+1000/60);};
 const actual=new Set();for(let i=0;i<120;i++){tick({x:Math.cos(angle)*.24});actual.add(p.raptorFrame.key);}
 for(let i=2;i<=5;i++)assert.ok(actual.has(key(i)),`authority selects ${key(i)}`);
 const ammo=p.shells;tick({x:Math.cos(angle)*.24,fire:true});assert.equal(p.shells,ammo-1,'moving RT fires immediately');
 console.log('PASS',direction,'8 exports, start/stop, travel gait, exit/first contact, interruption and actual moving shot');
}
for(const angle of [Math.PI/4,Math.PI/2]){
 const sample={time:1,angle,speed:0,sliding:false,airborne:false,verticalVelocity:0,hit:false,attached:false,firing:false};
 assert.equal(advanceRaptorPose(undefined,sample).frame.family,'idle');
}
for(const speed of [120,220]){
 const sample={time:1,angle:0,travelAngle:0,speed,sliding:false,airborne:false,verticalVelocity:0,hit:false,attached:false,firing:false};
 assert.equal(advanceRaptorPose(undefined,sample).frame.family,speed===120?'jog':'sprint');
}
assert.ok(inventory.movementDirections.includes('right'));
console.log('PASS right movement remains active; other directions and faster gaits retain existing routing');
