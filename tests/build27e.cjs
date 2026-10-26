const fs=require('fs'),ts=require('typescript'),assert=require('node:assert/strict');require.extensions['.ts']=(m,p)=>m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,p);
const S=require('../lib/arenaStructures27e.ts'),V=require('../lib/verticalCombat27b.ts');
const faces=S.structureFaces27e();assert.equal(faces.filter(f=>f.kind==='top').length,6);
for(const side of ['north','south']){const ramp=S.COMBAT_SURFACES.find(s=>s.id===side+'-stairs');let p={x:750,y:side==='north'?312:528,z:0,vz:0,grounded:true,supportSurfaceId:'ground'};for(let n=0;n<100;n++){const previous={...p};p.y+=side==='north'?-1:1;Object.assign(p,V.integrateVertical(p,previous,false,1/60));}assert.equal(p.z,72);assert.equal(p.supportSurfaceId,side+'-platform');}
const column=S.SUPPORTS27E[0];let p={x:column.x,y:column.y,z:0};S.resolveSupports27e(p);assert(Math.hypot(p.x-column.x,p.y-column.y)>=23);p={x:column.x,y:column.y,z:72};S.resolveSupports27e(p);assert.equal(p.x,column.x);
assert(Number.isFinite(V.surfaceShotTime({x:300,y:140,z:69},{x:300,y:220,z:69})),'slab side must block');
assert.equal(V.surfaceShotTime({x:350,y:140,z:30},{x:350,y:220,z:30}),Infinity,'underpass must be open');
assert(Number.isFinite(V.surfaceShotTime({x:column.x-40,y:column.y,z:30},{x:column.x+40,y:column.y,z:30})),'column blocks bullets');
assert.equal(V.surfaceShotTime({x:350,y:140,z:80},{x:350,y:220,z:80}),Infinity,'above deck clear');
const top=faces.find(f=>f.id==='north-platform-top');assert.equal(S.foregroundFace27e(top,225).length,0);assert(S.foregroundFace27e(top,180).every(p=>p.y>=180));
console.log('PASS27E connected stairs, supported top faces, column movement collision, slab-side shots, open underpass, above-deck clearance, partial face occlusion');

let under={x:350,y:180,z:0,vz:0,grounded:true,supportSurfaceId:'ground'};for(let i=0;i<12;i++)Object.assign(under,V.integrateVertical(under,under,i===0,1/60));assert(under.z<=2.041,'helmet must not enter deck');
const sideBody={x:350,y:180,z:68};S.resolveSupports27e(sideBody);assert(Math.abs(sideBody.y-180)>0,'body cannot enter slab side');
