const fs=require('fs'),ts=require('typescript'),assert=require('node:assert/strict');global.crypto??=require('node:crypto').webcrypto;require.extensions['.ts']=(m,p)=>m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,p);
const G=require('../lib/game.ts'),S=require('../lib/arenaStructures27e.ts'),A=require('../lib/arenaLayout27c.ts');
function game(x=1100,y=240){const s=G.newGame('h','h',0,'solo');s.covers=[];Object.assign(s.players[0],{x,y,aim:Math.PI/2,gunFacing:Math.PI/2});return s;}
function step(s,input={},frames=1){G.setInput(s,0,s.players[0].lastSeq+1,{x:0,y:0,aim:Math.PI/2,...input});for(let i=0;i<frames;i++)G.advance(s,s.lastAt+1000/60);}
// 27I layout-specific stair coverage lives in build27i; keep psychic-height rules here.
let s=game(880,550);step(s,{cover:true,aim:-Math.PI/2});assert(s.players[0].gripCoverId);step(s,{y:-1,aim:-Math.PI/2},105);assert.equal(s.players[0].z,128);assert.equal(s.covers[0].z,128);assert(s.players[0].gripCoverId);step(s,{aim:0},45);step(s,{cover:true,aim:0});assert(!s.players[0].gripCoverId,'place on platform');
const layout=A.chaseLayout27c();assert.equal(layout.placements.length,6);assert(A.routesConnected27c(layout.placements));for(let i=0;i<12;i++){const l=A.randomLayout27c('27H-'+i,24);A.validateLayout27c(l);assert.deepEqual(l,A.randomLayout27c('27H-'+i,24));}
assert(A.placementError27c({id:'bad',objectId:'floor-panel46',x:1100,y:150,rotation:0,z:0,surfaceId:'ground'},[]));
console.log('PASS27H carry ascent/place, sparse preset and seeded layouts on 27I geometry');
for(const n of [0,1]){const q=G.newGame('h','h',0,'duel');G.joinGame(q,'g','g');q.phase='playing';q.covers=[];const p=q.players[n],from={x:p.x,y:p.y};S.resolveSupports27e(p,125);assert.deepEqual({x:p.x,y:p.y},from,'spawn needs structural clearance');G.setInput(q,n,1,{cover:true,aim:n?Math.PI:0});G.advance(q,q.lastAt+1000/60);assert(p.gripCoverId,'spawn can construct toward fight');}
// Construction must not materialize cover through the terrace wall.
s=game(700,150);assert(!G.constructionPreview21({...s.players[0],gunFacing:0},s,0).valid);
console.log('PASS27H clear spawns, construction from both spawns, no through-wall construction');
s=game(1100,180);Object.assign(s.players[0],{z:128,supportSurfaceId:'north-platform',gunFacing:0,aim:0});step(s,{cover:true,aim:0});const elevated=s.covers[0];assert(elevated&&elevated.z===128);step(s,{aim:0});step(s,{cover:true,aim:0});assert(!s.players[0].gripCoverId);const hp=elevated.hp;s.shots.push({id:'upper-hit',owner:0,x:elevated.x-80,y:elevated.y,z:156,vx:820,vy:0,life:1,damage:10});step(s,{aim:0},12);assert(elevated.hp<hp,'projectiles hit placed elevated cover at its actual height');
console.log('PASS27H construct and place on terrace; elevated cover projectile registration');
