const fs=require('fs'),ts=require('typescript'),assert=require('node:assert/strict');
require.extensions['.ts']=(m,p)=>m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText,p);
const {advanceRaptorPose}=require('../lib/raptorPose.ts');
const sample={time:1,x:0,y:0,angle:Math.PI/4,speed:0,attached:true,sliding:false,airborne:false,verticalVelocity:0,hit:false,firing:false};
let memory;
for(const [state,family]of [['hold','cover-hold'],['brace','cover-hold'],['expose','idle'],['fire','idle'],['retract','cover-hold']]){const r=advanceRaptorPose(memory,{...sample,time:sample.time+=.1,coverState11:state});memory=r.memory;assert.equal(r.frame.family,family,state);assert.ok(fs.existsSync('public/assets/raptor-v2/'+r.frame.key));}
assert.equal(advanceRaptorPose(undefined,{...sample,attached:false}).frame.family,'idle');
assert.equal(advanceRaptorPose(undefined,{...sample,angle:Math.PI,coverState11:'hold'}).frame.family,'jump');
console.log('PASS dedicated front-right hold/brace/retract, existing exposure/fire and other directions preserved');
