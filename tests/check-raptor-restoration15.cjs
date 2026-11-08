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
