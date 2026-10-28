const fs=require('fs'),ts=require('typescript'),assert=require('node:assert/strict');require.extensions['.ts']=(m,p)=>m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,p);
const S=require('../lib/arenaStructures27e.ts'),V=require('../lib/verticalCombat27b.ts');
// 27I deliberately replaces the retired bridge fixture with solid end terraces.
const faces=S.structureFaces27e();assert.equal(faces.filter(f=>f.kind==='top').length,6);
for(const side of ['west','east'])for(const y of [343,783]){let p={x:side==='west'?563:1637,y,z:0,vz:0,grounded:true,supportSurfaceId:'ground'};for(let n=0;n<185;n++){const prev={...p};p.x+=side==='west'?-1:1;Object.assign(p,V.integrateVertical(p,prev,false,1/60));}assert.equal(p.z,128);assert.equal(p.supportSurfaceId,side+'-platform');}
assert.equal(S.SUPPORTS27E.length,0,'solid terraces have no misleading open columns');
assert(Number.isFinite(V.surfaceShotTime({x:400,y:563,z:50},{x:200,y:563,z:50})));
assert.equal(V.surfaceShotTime({x:400,y:563,z:150},{x:200,y:563,z:150}),Infinity);
const top=faces.find(f=>f.id==='west-platform-top');assert.equal(S.foregroundFace27e(top,924).length,0);assert(S.foregroundFace27e(top,500).every(p=>p.y>=500));
const p={x:375,y:563,z:0};S.resolveSupports27e(p);assert(p.x>=401,'solid platform side prevents entry');
console.log('PASS27E four connected stairs, solid sides, elevated shot clearance and clipped face occlusion');
