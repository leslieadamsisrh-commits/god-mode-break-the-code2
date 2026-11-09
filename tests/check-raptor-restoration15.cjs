const fs=require('fs'),ts=require('typescript'),assert=require('node:assert/strict');
require.extensions['.ts']=(m,p)=>m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText,p);
const {advanceRaptorPose,raptorCoverExposureFrame,RAPTOR_POSE_DIRECTIONS}=require('../lib/raptorPose.ts');
const live=require('../public/assets/raptor-v2/manifest.json');
// Deliberately asymmetric availability catches accidental mirror/direction assumptions.
const staged={postureDirections:RAPTOR_POSE_DIRECTIONS,coverPopDirections:['front-right','left'],coverLeanDirections:['right','back-left']};
for(let i=0;i<8;i++)for(const tall of [false,true]){
 const angle=i*Math.PI/4,dir=RAPTOR_POSE_DIRECTIONS[i];
 const expected=(tall?staged.coverLeanDirections:staged.coverPopDirections).includes(dir)?(tall?'cover-lean':'cover-pop'):'idle';
 const probe=raptorCoverExposureFrame(angle,tall,staged);
 assert.equal(probe.family,expected);
 for(const state of ['expose','fire']){
  const sample={time:1,x:0,y:0,angle,speed:0,attached:true,sliding:false,airborne:false,verticalVelocity:0,hit:false,firing:state==='fire',coverState11:state,coverTall11:tall};
  assert.deepEqual(advanceRaptorPose(undefined,sample,staged).frame,probe,'clearance and visible firing pose must agree');
  assert.equal(advanceRaptorPose(undefined,{...sample,coverState11:'retract'},staged).frame.family,'cover-hold');
 }
 // Reference assets are not silently activated before adjoining frames are ready.
 const current=raptorCoverExposureFrame(angle,tall);
 assert.ok(fs.existsSync('public/assets/raptor-v2/'+current.key));
 assert.equal(current.family,tall&&live.coverLeanDirections.includes(dir)?'cover-lean':'idle');
}
assert.equal(raptorCoverExposureFrame(0,true,{postureDirections:[],coverLeanDirections:[]}).family,'idle');
console.log('PASS 16 directional/height cases: authored availability, identical clearance/render selection, retraction, unchanged active inventory');

const {raptorCoverEdge,raptorActorSample}=require('../lib/raptorPose.ts');
const frontRight=Math.PI/4;
const complete={
 postureDirections:RAPTOR_POSE_DIRECTIONS,
 coverLeanDirections:['front-right'],
 coverLeanAltDirections:['front-right'],
 coverCatchDirections:['front-right'],
 coverShuffleDirections:['front-right']
};
const actor={x:0,y:0,vx:0,vy:0,aim:frontRight,gunFacing:frontRight,slide:0,pinball:0,slideFacing:frontRight,knock:0,
 charging:false,coverId:'wall',coverTall11:true,coverState11:'expose',fireState:0,recoil:0,returnToCover:0};
for(const [side,t,tx,frame] of [['end',64,1,0],['start',0,-1,1]]){
 const coverAnchor={t,length:64,tx,ty:0,nx:0,ny:-1};
 assert.equal(raptorCoverEdge(coverAnchor,frontRight),side);
 assert.equal(raptorCoverEdge(coverAnchor,frontRight+Math.PI),undefined);
 assert.equal(raptorCoverEdge({...coverAnchor,t:32},frontRight),undefined);
 const probe=raptorCoverExposureFrame(frontRight,true,complete,side);
 assert.equal(probe.frame,frame);
 for(const state of ['expose','fire']){
  const sample=raptorActorSample({...actor,coverAnchor,coverState11:state},1,.5);
  assert.deepEqual(advanceRaptorPose(undefined,sample,complete).frame,probe);
 }
}
const sample={time:1,x:0,y:0,angle:frontRight,speed:100,attached:true,sliding:false,airborne:false,
 verticalVelocity:0,hit:false,firing:false,coverSpeed11:100,coverState11:'catch'};
assert.equal(advanceRaptorPose(undefined,sample,complete).frame.family,'cover-catch');
assert.equal(advanceRaptorPose(undefined,{...sample,angle:0},complete).frame.family,'slide');
for(const sign of [-1,1]){
 let state=advanceRaptorPose(undefined,sample,complete);
 const seen=[];
 for(let i=1;i<=8;i++){
  state=advanceRaptorPose(state.memory,{...sample,coverState11:'shuffle',coverSpeed11:sign*100,x:i*7*sign,time:1+i*.07},complete);
  if(state.frame.family==='cover-shuffle')seen.push(state.frame.frame);
 }
 assert.deepEqual([...new Set(seen)],sign===1?[0,1]:[1,0]);
 const retract=advanceRaptorPose(state.memory,{...sample,coverState11:'retract'},complete);
 assert.equal(retract.frame.family,'cover-hold');
}
console.log('PASS isolated availability: each tall endpoint resolves one shared firing pose; dedicated catch and reversible shuffle stay gated');

// Install trial metadata in this test process only. Exercise the same authority
// tick and sockets used by the browser without activating the shipping atlas.
const {frames:ambush}=require('../docs/raptor-infantry-restore/ambush-pass/registration.json');
const {frames:batchA}=require('../docs/raptor-infantry-restore/batch-a/registration.json');
const game=require('../lib/game.ts'),{barrelSocket27d}=require('../lib/ballistics27d.ts');
Object.assign(live.frames,ambush,{'cover-pop/front-right/000.png':batchA['cover-pop/front-right/000.png']});
Object.assign(live,{coverPopDirections:['front-right'],coverLeanAltDirections:['front-right']});
for(const [kind,t,angle,expected] of [
 ['waist',40,-frontRight,'cover-pop/front-right/000.png'],
 ['tall',80,-frontRight+.26,'cover-lean/front-right/000.png'],
 ['tall',0,-frontRight-.26,'cover-lean/front-right/001.png'],
 ['tall',40,-frontRight,undefined]
]){
 const s=game.newGame('Raptor','test',0,'solo');s.time=2;s.phase='playing';s.matter=[];
 const tx=Math.cos(angle),ty=Math.sin(angle),nx=ty,ny=-tx;
 const wall={id:'ambush-test',x:600,y:500,z:0,w:80,h:20,a:angle,hp:200,maxHp:200,build:0,vx:0,vy:0,coverClass:kind,height27j:kind==='tall'?100:48};
 s.covers=[wall];
 const p=s.players[0];
 Object.assign(p,{character:'raptor',x:600+tx*(t-40)+nx*28.5,y:500+ty*(t-40)+ny*28.5,aim:frontRight,gunFacing:frontRight,
  coverId:wall.id,coverMode:'braced',coverAnchor:{edge:0,t,length:80,half:40,offset:0,nx,ny,tx,ty,face:'top'}});
 const tick=input=>{game.setInput(s,0,p.lastSeq+1,{aim:frontRight,...input});game.advance(s,s.lastAt+1000/60)};
 tick({coverAim:true});
 assert.equal(p.peek,!!expected);
 assert.equal(p.raptorFrame.key,expected??'cover-hold/front-right/000.png');
 tick({coverAim:true,fire:true});
 assert.equal(s.shots.length,expected?7:0);
 if(expected){
  const muzzle=barrelSocket27d(p,s.config.spriteScale);
  assert.equal(muzzle.raptorAligned,true);
  const flash=s.fx.find(fx=>fx.type==='muzzle');
  assert.deepEqual([flash.x,flash.y,flash.z],[muzzle.x,muzzle.y,muzzle.z]);
  tick({});
  assert.equal(p.coverState11,'retract');
  assert.equal(p.raptorFrame.key,'cover-hold/front-right/000.png');
 }
}
console.log('PASS trial muzzle registration through real cover tick: low pop, two tall endpoints, blocked tall center and retraction');

// The runtime gate remains off. Trial options model both physical ends of the
// same wall, then rotate that wall by half a turn to reverse its tangent.
const wraps={postureDirections:RAPTOR_POSE_DIRECTIONS,coverLeanDirections:['left','right'],coverWrapDirections:['left','right'],
 coverCatchDirections:RAPTOR_POSE_DIRECTIONS};
for(const [angle,dir] of [[0,'right'],[Math.PI,'left']]){
 for(const [edge,tx] of [['start',dir==='right'?-1:1],['end',dir==='right'?1:-1]]){
  const p={...actor,coverState11:'brace',aim:angle,gunFacing:angle,coverAnchor:{tx,ty:0,nx:0,ny:-1,t:edge==='start'?0:80,length:80}};
  const at=(m,state,time,input={})=>advanceRaptorPose(m,raptorActorSample({...p,coverState11:state,input},time,.5),wraps);
  const tuck=at(undefined,'brace',1);
  assert.equal(tuck.frame.key,'cover-wrap/'+dir+'/000.png');
  const pivot=at(tuck.memory,'expose',1.01);
  assert.equal(pivot.frame.key,'cover-wrap/'+dir+'/001.png');
  assert.deepEqual(at(tuck.memory,'expose',1.01,{fire:true}).frame,raptorCoverExposureFrame(angle,true,wraps,edge));
  const aim=at(pivot.memory,'expose',1.1);
  assert.deepEqual(aim.frame,raptorCoverExposureFrame(angle,true,wraps,edge));
  const retract=at(aim.memory,'retract',1.12);
  assert.equal(retract.frame.key,pivot.frame.key);
  assert.equal(at(retract.memory,'brace',1.21).frame.key,tuck.frame.key);
  assert.equal(at(aim.memory,'drive',1.12).memory.wrap,undefined);
  const replacement=advanceRaptorPose(aim.memory,raptorActorSample({...p,coverId:'replacement'},1.12,.5),wraps);
  assert.equal(replacement.frame.key,tuck.frame.key);
 }
}
for(let i=0;i<8;i++){
 const angle=i*Math.PI/4,p={...actor,coverEntryAngle:angle,coverState11:'catch',coverAnchor:{tx:1,ty:0,nx:0,ny:-1,t:40,length:80}};
 const selected=advanceRaptorPose(undefined,raptorActorSample(p,1,.5),wraps);
 assert.equal(selected.frame.key,'cover-catch/'+RAPTOR_POSE_DIRECTIONS[i]+'/000.png');
}
console.log('PASS stationary tuck/pivot/aim/retract, immediate trigger socket, opposite cover winding, eight incoming directions and drive isolation');

const path=require('node:path'),crypto=require('node:crypto');
const trialDirectory=path.join(__dirname,'../docs/raptor-infantry-restore/stationary-wrap');
const trial=require(path.join(trialDirectory,'registration.json'));
assert.equal(live.coverWrapDirections,undefined,'local wrap trial stays out of the shipping manifest');
assert.equal(live.tallCoverSteel,undefined,'steel trial stays out of the shipping manifest');
for(const pose of Object.values(trial.frames)){
 const bytes=fs.readFileSync(path.join(trialDirectory,pose.file));
 assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),pose.sha256);
 assert.deepEqual([bytes.readUInt32BE(16),bytes.readUInt32BE(20)],[512,512]);
 assert.ok(pose.muzzleGround[1]>pose.muzzle[1]);
 assert.equal(pose.supportFoot[1],pose.anchor[1]);
}
for(const dir of ['left','right']){
 const poses=Object.entries(trial.frames).filter(([key])=>key.includes('/'+dir+'/')).map(([,pose])=>pose);
 assert.equal(poses.length,3);
 const offsets=poses.map(p=>(p.supportFoot[0]-p.anchor[0])*p.drawScale);
 assert.ok(Math.max(...offsets)-Math.min(...offsets)<=2,'all three frames share a planted support foot');
}
Object.assign(live.frames,trial.frames);
Object.assign(live,trial.availability);
for(const rot of [0,Math.PI/12,Math.PI]){
 for(const sign of [-1,1]){
  const s=game.newGame('Raptor','test',0,'solo');s.time=2;s.phase='playing';s.matter=[];
  const tx=Math.cos(rot),ty=Math.sin(rot),nx=ty,ny=-tx,width=120,t=sign<0?12:width-12;
  const aim=Math.atan2(ty*sign,tx*sign),dir=Math.cos(aim)<0?'left':'right';
  const wall={id:'same-steel-wall',x:645,y:480,z:0,w:width,h:20,a:rot,hp:200,maxHp:200,build:0,vx:0,vy:0,coverClass:'tall',height27j:100};
  s.covers=[wall];
  const p=s.players[0];
  Object.assign(p,{character:'raptor',x:wall.x+tx*(t-width/2)+nx*28.5,y:wall.y+ty*(t-width/2)+ny*28.5,aim,gunFacing:aim,
   coverId:wall.id,coverMode:'braced',coverAnchor:{edge:0,t,length:width,half:width/2,offset:0,nx,ny,tx,ty,face:'top'}});
  const tick=input=>{game.setInput(s,0,p.lastSeq+1,{aim,...input});game.advance(s,s.lastAt+1000/60)};
  tick({});
  const root=[p.x,p.y,p.coverAnchor.t],cover=[wall.x,wall.y,wall.a];
  const tuck='cover-wrap/'+dir+'/000.png',pivot='cover-wrap/'+dir+'/001.png',exposure='cover-lean/'+dir+'/000.png';
  assert.equal(p.raptorFrame.key,tuck);
  tick({coverAim:true});
  assert.equal(p.raptorFrame.key,pivot);
  // Trigger during the presentation pivot. The shot still uses the aim sprite.
  tick({coverAim:true,fire:true});
  assert.equal(p.raptorFrame.key,exposure);
  assert.equal(s.shots.length,7);
  const flash=s.fx.find(fx=>fx.type==='muzzle'),muzzle=barrelSocket27d(p,s.config.spriteScale);
  assert.deepEqual([flash.x,flash.y,flash.z],[muzzle.x,muzzle.y,muzzle.z]);
  tick({});
  assert.equal(p.raptorFrame.key,pivot);
  for(let i=0;i<6;i++)tick({});
  assert.equal(p.raptorFrame.key,tuck);
  assert.deepEqual([p.x,p.y,p.coverAnchor.t],root);
  assert.deepEqual([wall.x,wall.y,wall.a],cover);
 }
}
console.log('PASS exported frame hashes, foot registration, real wrap ticks on the same wall and two rotations, immediate muzzle clearance and fixed attachment');

for(let i=0;i<8;i++){
 const approach=i*Math.PI/4,normal=approach+.54;
 const s=game.newGame('Raptor','test',0,'solo');s.time=2;s.phase='playing';s.matter=[];
 const wall={id:'diagonal-catch',x:645,y:480,z:0,w:120,h:20,a:normal-Math.PI/2,hp:200,maxHp:200,build:0,vx:0,vy:0,coverClass:'tall',height27j:100};
 s.covers=[wall];
 const p=s.players[0];
 Object.assign(p,{character:'raptor',x:wall.x-Math.cos(normal)*33,y:wall.y-Math.sin(normal)*33,
  vx:Math.cos(approach)*260,vy:Math.sin(approach)*260,slide:.42,slideFacing:approach,aim:approach,gunFacing:approach});
 game.setInput(s,0,1,{aim:approach});
 game.advance(s,s.lastAt+1000/60);
 assert.equal(p.coverId,wall.id);
 assert.equal(p.coverState11,'catch');
 const {raptorPoseDirection}=require('../lib/raptorPose.ts');
 assert.equal(raptorPoseDirection(p.coverEntryAngle),RAPTOR_POSE_DIRECTIONS[i]);
 assert.notEqual(raptorPoseDirection(Math.atan2(-p.coverAnchor.ny,-p.coverAnchor.nx)),RAPTOR_POSE_DIRECTIONS[i]);
}
console.log('PASS actual slide catches from all eight approach buckets into a different cover-facing bucket');
