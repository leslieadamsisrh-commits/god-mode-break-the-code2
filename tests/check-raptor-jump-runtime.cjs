const fs=require('fs'),ts=require('typescript'),assert=require('node:assert/strict');
global.crypto??=require('node:crypto').webcrypto;
require.extensions['.ts']=(m,p)=>m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,p);
const {LocalCombat}=require('../lib/localCombat.ts');
const inventory=require('../public/assets/raptor-v2/manifest.json');
const directions=['right','front-right','front','front-left','left','back-left','back','back-right'];
let verified=0;
for(let d=0;d<8;d++){
 if(!(inventory.jumpDirections||[]).includes(directions[d]))continue;
 for(const hz of [60,30,15]){
  const engine=new LocalCombat('jump-runtime','solo',0,undefined,'raptor');
  engine.state.covers=[];engine.state.matter=[];
  const p=engine.state.players[0],angle=d*Math.PI/4;p.x=1100;p.y=560;p.gunFacing=p.aim=angle;
  engine.frame(0,{},[]);let wall=0;const phases=new Set();
  for(let i=0;i<Math.ceil(hz*1.5);i++){
   wall+=1000/hz;
   engine.frame(wall,{x:Math.cos(angle)*.55,y:Math.sin(angle)*.55,aim:angle,jump:i===Math.ceil(hz*.2)},[]);
   const f=p.raptorFrame;if(f.family==='jump'){
    phases.add(f.frame);assert.equal(f.key.split('/')[1],directions[d]);
    if(f.frame===0){assert(p.vz>0);assert(engine.state.time-p.raptorPose.jump.takeoffAt<.065,'push-off uses actual witnessed takeoff time');}
    if(f.frame===4||f.frame===5)assert(p.grounded,'contact phases require actual ground contact');
   }
  }
  assert.deepEqual([...phases],[0,1,2,3,4,5],`${directions[d]} actual combat jump sampled at ${hz}Hz`);
  assert(p.grounded&&p.z===0);verified++;
 }
}
assert(verified>0,'at least one complete jump direction must be enabled for runtime test');
console.log(`PASS: ${verified} actual LocalCombat directional jumps at 60/30/15Hz expose takeoff through recovery, correct direction and actual ground contact`);
