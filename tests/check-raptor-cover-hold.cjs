const fs=require('fs'),ts=require('typescript'),assert=require('node:assert/strict');
require.extensions['.ts']=(m,p)=>m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText,p);
const {advanceRaptorPose}=require('../lib/raptorPose.ts');
const sample={time:1,x:0,y:0,angle:Math.PI/4,speed:0,attached:true,sliding:false,airborne:false,verticalVelocity:0,hit:false,firing:false};
let memory;
for(const [state,family]of [['hold','cover-hold'],['brace','cover-hold'],['expose','idle'],['fire','idle'],['retract','cover-hold']]){const r=advanceRaptorPose(memory,{...sample,time:sample.time+=.1,coverState11:state});memory=r.memory;assert.equal(r.frame.family,family,state);assert.ok(fs.existsSync('public/assets/raptor-v2/'+r.frame.key));}
assert.equal(advanceRaptorPose(undefined,{...sample,attached:false}).frame.family,'idle');
assert.equal(advanceRaptorPose(undefined,{...sample,angle:Math.PI,coverState11:'hold'}).frame.family,'cover-hold');
console.log('PASS dedicated front-right hold/brace/retract, existing exposure/fire preserved; left hold now grounded');
const {raptorCoverExposureFrame}=require('../lib/raptorPose.ts');
const {barrelSocket27d}=require('../lib/ballistics27d.ts');
for(const state of ['expose','fire']){
 const frame=advanceRaptorPose(undefined,{...sample,coverTall11:true,coverState11:state}).frame;
 assert.equal(frame.family,'cover-lean');
 assert.deepEqual(frame,raptorCoverExposureFrame(sample.angle,true));
 assert.ok(fs.existsSync('public/assets/raptor-v2/'+frame.key));
 const actor={x:600,y:500,z:0,character:'raptor',gunFacing:sample.angle,aim:sample.angle,raptorFrame:frame};
 const muzzle=barrelSocket27d(actor,.82);
 assert.equal(muzzle.raptorAligned,true);
 assert.ok(Number.isFinite(muzzle.x)&&Number.isFinite(muzzle.z));
}
for(let d=0;d<8;d++)assert.equal(raptorCoverExposureFrame(d*Math.PI/4,true).family,[0,1,4].includes(d)?'cover-lean':[5,6].includes(d)?'cover-recoil':'idle');
assert.equal(raptorCoverExposureFrame(Math.PI/4,false).family,'idle');
assert.equal(advanceRaptorPose(undefined,{...sample,coverTall11:true,coverState11:'retract'}).frame.family,'cover-hold');
console.log('PASS tall lean shares clearance/render frame and authored barrel; low exposure, other directions and retraction preserved');


const {advance,newGame,placeRaptorLowCoverLab,setInput}=require('../lib/game.ts');
const game=newGame('Les','local',0,'bot'),raptor=game.players[0];
raptor.character='raptor';
placeRaptorLowCoverLab(game);
const lowReadyKey='cover-hold/front-right/001.png';
assert.equal(raptor.raptorFrame.key,lowReadyKey);
assert.equal(game.covers.find(wall=>wall.id===raptor.coverId).coverClass,'waist');
assert.ok(fs.existsSync('public/assets/raptor-v2/'+lowReadyKey));
const root=[raptor.x,raptor.y];
const ammo=raptor.shells;
game.phase='playing';
setInput(game,0,0,{aim:Math.PI/4,fire:true});
advance(game,game.lastAt+1000/60);
assert.equal(raptor.raptorFrame.key,lowReadyKey);
assert.equal(raptor.shells,ammo);
assert.deepEqual([raptor.x,raptor.y],root);
assert.equal(advanceRaptorPose(undefined,{...sample,coverTall11:false,coverState11:'brace'}).frame.key,lowReadyKey);
assert.equal(advanceRaptorPose(undefined,{...sample,coverTall11:true,coverState11:'brace'}).frame.key,'cover-hold/front-right/000.png');
console.log('PASS corrected sprite starts a local low-cover match and remains a protected pose');

