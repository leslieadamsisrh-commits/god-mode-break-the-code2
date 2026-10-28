const fs=require('fs'),ts=require('typescript'),assert=require('node:assert/strict');global.crypto??=require('node:crypto').webcrypto;require.extensions['.ts']=(m,p)=>m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,p);
const G=require('../lib/game.ts'),S=require('../lib/arenaStructures27e.ts'),A=require('../lib/arenaLayout27c.ts'),P=require('../lib/bayBridgePresentation.ts');
function step(s,input,frames){G.setInput(s,0,s.players[0].lastSeq+1,{x:0,y:0,...input});for(let i=0;i<frames;i++)G.advance(s,s.lastAt+1000/60);}
// Build 28 intentionally rotates the two terraces; exercise all four new approaches.
for(const y of [343,783])for(const west of [true,false]){const s=G.newGame('i','i',0,'solo');s.covers=[];const aim=west?Math.PI:0;Object.assign(s.players[0],{x:west?593:1607,y,aim,gunFacing:aim});step(s,{x:west?-1:1,aim},85);assert.equal(s.players[0].z,128);step(s,{x:west?1:-1,aim},85);assert.equal(s.players[0].z,0);}
assert.equal(S.COMBAT_SURFACES.filter(s=>s.id.includes('platform')).length,2);
assert.equal(S.slabShotTime27e({x:700,y:550,z:30},{x:1500,y:550,z:30}),Infinity);
assert(Number.isFinite(S.slabShotTime27e({x:600,y:563,z:30},{x:200,y:563,z:30})));
for(const x of [100,1100,2100])for(const y of [120,550,1000]){const p=P.arenaPoint46(x,y),q=P.arenaInverse46(p.x,p.y);assert(Math.abs(q.x-x)<1e-8&&Math.abs(q.y-y)<1e-8);assert.deepEqual(P.arenaJacobian46(x,y),P.arenaJacobian46(1100,550));}
A.validateLayout27c(A.chaseLayout27c());for(let i=0;i<12;i++){const l=A.randomLayout27c('27I-'+i,24);assert.deepEqual(l,A.randomLayout27c('27I-'+i,24));}
console.log('PASS27I four stair ascents/descents, flat middle, solid walls, uniform projection/inverse, preset and seeded layouts');
