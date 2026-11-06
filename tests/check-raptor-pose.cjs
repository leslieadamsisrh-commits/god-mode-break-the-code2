const fs=require('fs'),ts=require('typescript'),assert=require('node:assert/strict');
require.extensions['.ts']=(m,p)=>m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,p);
const {advanceRaptorPose,RAPTOR_POSE_DIRECTIONS}=require('../lib/raptorPose.ts');
const available={postureDirections:RAPTOR_POSE_DIRECTIONS,jumpDirections:RAPTOR_POSE_DIRECTIONS};
const base={time:0,x:0,y:0,angle:0,speed:0,sliding:false,airborne:false,verticalVelocity:0,hit:false,attached:false,firing:false};
for(let d=0;d<8;d++)for(const hz of [30,60,120]){
 let memory,seen=new Set();const angle=d*Math.PI/4;
 const step=s=>{const before=JSON.stringify(memory),out=advanceRaptorPose(memory,s,available);assert.equal(JSON.stringify(memory),before,'prior memory is immutable');memory=out.memory;return out.frame;};
 step({...base,angle});
 for(let i=1;i<=Math.ceil(hz*.95);i++){
  const time=i/hz,flight=time-1/hz,airborne=flight<.8;
  const frame=step({...base,time,x:time*120*Math.cos(angle),y:time*120*Math.sin(angle),angle,travelAngle:angle,speed:120,airborne,verticalVelocity:airborne?400-1000*flight:0,firing:true});
  if(frame.family==='jump')seen.add(frame.frame);
  assert(frame.key.includes('/'+RAPTOR_POSE_DIRECTIONS[d]+'/'),'authored direction retained while firing');
 }
 assert.deepEqual([...seen],[0,1,2,3,4,5],`${RAPTOR_POSE_DIRECTIONS[d]} at ${hz}Hz`);
}
for(const [speed,family] of [[40,'stalk'],[120,'jog'],[220,'sprint']]){
 let memory,seen=new Set();
 for(let i=0;i<180;i++){
  const out=advanceRaptorPose(memory,{...base,time:i/60,x:i/60*speed,speed,travelAngle:0,firing:true},available);memory=out.memory;
  assert.equal(out.frame.family,family);seen.add(out.frame.frame);
 }
 assert.equal(seen.size,4,family+' keeps alternate contact and passing phases');
}
let first=advanceRaptorPose(undefined,base,available);
let flying=advanceRaptorPose(first.memory,{...base,time:.016,airborne:true,verticalVelocity:400},available);
assert.equal(flying.frame.frame,0);
assert.equal(advanceRaptorPose(first.memory,{...base,time:.016},available).frame.family,'idle','separate actor does not inherit flight');
assert.equal(advanceRaptorPose(flying.memory,{...base,time:1},available).frame.family,'idle','gap cannot invent landing');
assert.equal(advanceRaptorPose(flying.memory,{...base,time:0},available).frame.family,'idle','reset cannot inherit landing');
assert.equal(advanceRaptorPose(first.memory,{...base,time:.016,airborne:true,verticalVelocity:-1},available).frame.frame,3,'ledge fall skips takeoff');
const landing=advanceRaptorPose(flying.memory,{...base,time:.1},available);
assert.equal(landing.frame.frame,4);
assert.equal(advanceRaptorPose(landing.memory,{...base,time:.116,airborne:true,verticalVelocity:400},available).frame.frame,0,'repeat jump replaces landing');
assert.equal(advanceRaptorPose(flying.memory,{...base,time:.1,sliding:true,slideRemaining:.5},available).frame.family,'slide','slide replaces landing immediately');
assert.equal(advanceRaptorPose(flying.memory,{...base,time:.1,hit:true},available).frame.family,'idle');
assert.equal(advanceRaptorPose(flying.memory,{...base,time:.1,attached:true},available).frame.family,'idle');
const fallback=advanceRaptorPose(first.memory,{...base,time:.016,airborne:true,verticalVelocity:400},{postureDirections:[]});
assert.equal(fallback.frame.family,'idle','uninstalled jump direction never selects missing artwork');
let gait=advanceRaptorPose(undefined,{...base,speed:100},available);
gait=advanceRaptorPose(gait.memory,{...base,time:.2,x:20,speed:100},available);
const phase=gait.memory.gait.phase;assert(Math.abs(phase-.2)<1e-9);
const duplicate=advanceRaptorPose(gait.memory,{...base,time:.2,x:20,speed:100},available);
assert.equal(duplicate.memory.gait.phase,phase,'duplicate render does not advance gait');
gait=advanceRaptorPose(gait.memory,{...base,time:.3,x:800,speed:100},available);
assert.equal(gait.memory.gait.phase,phase,'teleport is rejected');
gait=advanceRaptorPose(gait.memory,{...base,time:4,x:850,speed:100},available);
assert.equal(gait.memory.gait.phase,phase,'long suspension preserves stride phase without integrating distance');
gait=advanceRaptorPose(undefined,{...base,x:undefined,y:undefined,speed:100},available);
gait=advanceRaptorPose(gait.memory,{...base,time:.2,x:undefined,y:undefined,speed:100},available);
assert(Math.abs(gait.memory.gait.phase-.2)<1e-9,'preview without world samples uses speed/time fallback');
console.log('PASS authoritative pure pose: eight directions at 30/60/120Hz, complete jump, alternating gaits while firing, immutable per-actor memory, repeat jump, fall, interruption, reset/gap and missing-art gating');
