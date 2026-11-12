const fs=require('node:fs'),assert=require('node:assert/strict'),crypto=require('node:crypto'),ts=require('typescript');
require.extensions['.ts']=(module,path)=>module._compile(ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:1,target:9,esModuleInterop:true}}).outputText,path);
const {newGame,setInput,advance,coverMuzzleClearance}=require('../lib/game.ts');
const {advanceRaptorPose,raptorCoverExposureFrame,raptorCoverRecoilFrame,RAPTOR_POSE_DIRECTIONS}=require('../lib/raptorPose.ts');
const {barrelSocket27d}=require('../lib/ballistics27d.ts');
const inventory=require('../public/assets/raptor-v2/manifest.json');
const registration={...require('../docs/raptor-fluidity/batch18-registration.json').frames,...require('../docs/raptor-fluidity/batch30-registration.json')};
for(const direction of inventory.coverSequenceDirections){
 const angle=RAPTOR_POSE_DIRECTIONS.indexOf(direction)*Math.PI/4;
 const frames=Array.from({length:6},(_,index)=>inventory.frames[`cover-sequence/${direction}/${String(index).padStart(3,'0')}.png`]);
 const sample={time:1,x:600,y:500,angle,aimAngle:angle,coverProtectedAngle:angle,coverId:'wall',coverTall11:false,coverState11:'brace',speed:0,sliding:false,airborne:false,verticalVelocity:0,hit:false,attached:true,firing:false};
 let pose=advanceRaptorPose(undefined,sample);
 assert.equal(pose.frame.frame,0);
 pose=advanceRaptorPose(pose.memory,{...sample,time:1.01,coverState11:'expose'});
 assert.equal(pose.frame.frame,1);
 pose=advanceRaptorPose(pose.memory,{...sample,time:1.08,coverState11:'expose'});
 assert.equal(pose.frame.frame,2);
 const shot=raptorCoverRecoilFrame(angle,false);
 pose=advanceRaptorPose(pose.memory,{...sample,time:1.09,coverState11:'fire',firing:true,coverShot:{at:1.09,coverId:'wall',frame:shot}});
 assert.equal(pose.frame.frame,3);
 pose=advanceRaptorPose(pose.memory,{...sample,time:1.16,coverState11:'retract',coverShot:{at:1.09,coverId:'wall',frame:shot}});
 assert.equal(pose.frame.frame,4);
 pose=advanceRaptorPose(pose.memory,{...sample,time:1.22,coverState11:'retract'});
 assert.equal(pose.frame.frame,5);
 pose=advanceRaptorPose(pose.memory,{...sample,time:1.30,coverState11:'retract'});
 assert.equal(pose.frame.frame,0);
 for(let index=0;index<6;index++){
  const key=`cover-sequence/${direction}/${String(index).padStart(3,'0')}.png`,record=frames[index],bytes=fs.readFileSync('public/assets/raptor-v2/'+key);
  assert.equal(bytes.readUInt32BE(16),512);assert.equal(bytes.readUInt32BE(20),512);
  assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),record.sha256);
  assert.deepEqual(record,registration[key]);
  assert.deepEqual(record.anchor,frames[0].anchor);assert.deepEqual(record.supportFoot,frames[0].supportFoot);assert.equal(record.drawScale,frames[0].drawScale);
 }
 assert.equal(advanceRaptorPose(undefined,{...sample,coverState11:'expose',firing:true}).frame.frame,2,'RT skips cosmetic raise');
 assert.equal(raptorCoverExposureFrame(angle,true).family,'cover-sequence');
}
console.log('PASS 18 exported hashes, support heel, root, scale, six connected phases, and immediate RT ready pose');

function fixture(angle,rotation,tall,t,face){
 const s=newGame('Raptor','local',0,'bot'),p=s.players[0];
 s.phase='playing';s.matter=[];s.shots=[];s.players[1].bot=false;s.players[1].x=1200;s.players[1].y=660;
 const tx=Math.cos(rotation)*face,ty=Math.sin(rotation)*face,nx=ty,ny=-tx;
 const wall={id:'front18',x:950,y:550,w:144,h:20,a:rotation,z:0,hp:280,maxHp:280,generated:true,build:0,variant:0,coverClass:tall?'tall':'waist',height27j:tall?100:48};
 s.covers=[wall];Object.assign(p,{character:'raptor',x:wall.x+tx*(t-72)+nx*28.5,y:wall.y+ty*(t-72)+ny*28.5,aim:angle,gunFacing:angle,grounded:true,z:0,coverId:wall.id,coverMode:'braced',coverAnchor:{edge:face===1?0:2,t,length:144,half:72,offset:0,nx,ny,tx,ty,face:face===1?'top':'bottom'},lastShot:-9});
 const seen=new Set();
 const tick=(input={},count=1)=>{for(let i=0;i<count;i++){setInput(s,0,p.lastSeq+1,{aim:angle,...input});advance(s,s.lastAt+1000/60);seen.add(p.raptorFrame.key);}};
 return{s,p,wall,tick,seen};
}
for(const direction of inventory.coverSequenceDirections){
 const angle=RAPTOR_POSE_DIRECTIONS.indexOf(direction)*Math.PI/4;
 let clearLow=0,clearTall=0;
 for(const tall of [false,true])for(const face of [1,-1])for(const offset of [-Math.PI/3,-Math.PI/6,0,Math.PI/6,Math.PI/3,Math.PI/2])for(const t of [4,12,72,132,140]){
  const {s,p,wall,tick}=fixture(angle,angle+offset,tall,t,face),root=[p.x,p.y,p.coverAnchor.t],shells=p.shells;
  tick({coverAim:true},12);
  assert.deepEqual([p.x,p.y,p.coverAnchor.t],root);
  tick({fire:true});
  if(p.shells===shells-1){
   if(tall)clearTall++;else clearLow++;
   assert.equal(p.raptorFrame.family,'cover-sequence');
   assert.ok([2,3].includes(p.raptorFrame.frame));
   const socket=barrelSocket27d(p,s.config.spriteScale),flash=s.fx.findLast(f=>f.owner===0&&f.type==='muzzle');
   assert.deepEqual([flash.x,flash.y,flash.z],[socket.x,socket.y,socket.z]);
   assert.equal(coverMuzzleClearance(p,wall,socket,angle).allowed,true);
   if(!tall)assert.ok(socket.z>48);
   if(tall)assert.ok(t<18||144-t<18);
  }else assert.equal(p.shells,shells);
  tick({},20);
  assert.deepEqual([p.x,p.y,p.coverAnchor.t],root);
  assert.equal(wall.x,950);assert.equal(wall.y,550);assert.equal(wall.a,angle+offset);
  if(tall&&t===72)assert.equal(p.shells,shells,'blocked center preserves the shell');
 }
 console.log(direction,{clearLow,clearTall});
 assert.ok(clearLow>0,`${direction} has a clear waist shot`);
 assert.ok(clearTall>0,`${direction} has a clear tall-corner shot`);
}
console.log('PASS both faces across six wall angles and five rail positions, visible firing muzzle, clear lip, protected tall center and planted root');

for(const direction of inventory.coverSequenceDirections){
 const angle=RAPTOR_POSE_DIRECTIONS.indexOf(direction)*Math.PI/4;
 const {p,s,tick,seen}=fixture(angle,angle-Math.PI/2,false,72,1);
 tick({},16);
 const root=[p.x,p.y,p.coverAnchor.t],ammo=p.shells;
 assert.equal(p.raptorFrame.key,`cover-sequence/${direction}/000.png`);
 tick({coverAim:true},12);
 for(const offset of [-.15,.15]){
  tick({aim:angle+offset,coverAim:true},2);
  assert.deepEqual([p.x,p.y,p.coverAnchor.t],root);
 }
 tick({fire:true});
 assert.equal(p.shells,ammo-1);
 assert.equal(p.raptorFrame.key,`cover-sequence/${direction}/003.png`);
 tick({},22);
 assert.deepEqual([p.x,p.y,p.coverAnchor.t],root);
 for(let frame=0;frame<6;frame++)assert.ok(seen.has(`cover-sequence/${direction}/${String(frame).padStart(3,'0')}.png`),`${direction} missing phase ${frame}`);
 assert.ok([...seen].every(key=>key.startsWith('cover-sequence/')), 'the connected sequence never selects the older upright art');
}
console.log('PASS all six phases painted through real authority ticks, two aim sweeps, immediate recoil, settle/lower/hold, and no older upright selection');

for(let direction=0;direction<8;direction++)for(const tall of [false,true]){
 assert.notEqual(raptorCoverExposureFrame(direction*Math.PI/4,tall).family,'idle','cover exposure always selects authored cover art');
}
const brAngle=-Math.PI/4;
let clearBackRight=0;
for(const face of [1,-1])for(const offset of [-Math.PI/3,-Math.PI/6,0,Math.PI/6,Math.PI/3,Math.PI/2])for(const t of [4,12,72,132,140]){
 const {s,p,wall,tick}=fixture(brAngle,brAngle+offset,false,t,face),ammo=p.shells,root=[p.x,p.y,p.coverAnchor.t];
 tick({coverAim:true},12);tick({fire:true});
 if(p.shells===ammo-1){
  clearBackRight++;assert.equal(p.raptorFrame.family,'cover-recoil');
  const muzzle=barrelSocket27d(p,s.config.spriteScale),flash=s.fx.findLast(f=>f.type==='muzzle'&&f.owner===0);
  assert.deepEqual([flash.x,flash.y,flash.z],[muzzle.x,muzzle.y,muzzle.z]);
 }
 tick({},22);assert.deepEqual([p.x,p.y,p.coverAnchor.t],root);
}
assert.ok(clearBackRight>0);
console.log('PASS all eight cover exposure directions avoid idle and existing back-right cels clear waist cover in',clearBackRight,'fixtures');
