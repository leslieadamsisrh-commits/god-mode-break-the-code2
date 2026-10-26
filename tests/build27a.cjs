const assert=require('node:assert/strict'),fs=require('fs'),ts=require('typescript');require.extensions['.ts']=(m,p)=>m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,p);const {advanceElevation,SPAWN,SURFACES,STEP}=require('../lib/elevation27a.ts');
let p={...SPAWN};for(let i=0;i<60;i++)p=advanceElevation(p,{x:0,y:0});assert(p.grounded&&p.z===0);
p=advanceElevation(p,{x:0,y:0,jump:true});assert(p.z>0&&p.vz>0);for(let i=0;i<120;i++)p=advanceElevation(p,{x:0,y:0});assert(p.grounded&&p.z===0);
let under={x:550,y:290,z:0,vz:0,grounded:true,supportSurfaceId:'ground'};for(let i=0;i<30;i++)under=advanceElevation(under,{x:1,y:0});assert(under.z===0&&under.supportSurfaceId==='ground','bridge snapped ground player upward');
let top={x:550,y:290,z:90,vz:0,grounded:true,supportSurfaceId:'bridge'};top=advanceElevation(top,{x:0,y:0});assert(top.z===90&&top.supportSurfaceId==='bridge');
let stair={x:200,y:280,z:30*90/190,vz:0,grounded:true,supportSurfaceId:'stairs'};stair=advanceElevation(stair,{x:1,y:0});assert(stair.z>30*90/190,'ramp did not rise');
console.log('PASS27A ground, jump, landing, underpass, bridge support, ramp ascent');
