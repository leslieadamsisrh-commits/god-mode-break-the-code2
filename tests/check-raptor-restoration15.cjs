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
