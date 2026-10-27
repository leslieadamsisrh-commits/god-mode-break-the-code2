const fs=require('fs'),ts=require('typescript'),assert=require('node:assert/strict');global.crypto??=require('node:crypto').webcrypto;require.extensions['.ts']=(m,p)=>m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,p);
const G=require('../lib/game.ts'),B=require('../lib/ballistics27d.ts'),P=require('../lib/bayBridgePresentation.ts');
const s=G.newGame('h','h',0,'duel');G.joinGame(s,'g','g');const p=s.players[1];p.x=750;p.y=420;p.z=0;
for(const region of G.bodyRegions(p)){const z=(region.min+region.max)/2;assert.equal(G.shotPlayerTime({x:650,y:420,z},{x:850,y:420},z,p,{x:750,y:420,z:0}).region,region.region);}
assert.equal(G.shotPlayerTime({x:650,y:420,z:90},{x:850,y:420},90,p,p),null);
// Cross the entire body vertically while already inside its XY hull.
assert(G.shotPlayerTime({x:750,y:420,z:100},{x:750,y:420},-10,p,p));
p.z=80;assert.equal(G.shotPlayerTime({x:650,y:420,z:30},{x:850,y:420},30,p,p),null);assert(G.shotPlayerTime({x:650,y:420,z:110},{x:850,y:420},110,p,p));
for(let d=0;d<24;d++){const actor={x:750,y:420,z:40,gunFacing:d*Math.PI/12},m=B.barrelSocket27d(actor),foot=P.projectWorld(actor.x,actor.y,{x:750,y:420},3.2,actor.z),barrel=P.projectWorld(m.x,m.y,{x:750,y:420},3.2,m.z);assert(Math.hypot(barrel.x-foot.x,barrel.y-foot.y)>75);assert(m.z>actor.z+45);}
// All compass directions register against an unobstructed opponent using controller assistance.
for(let direction=0;direction<8;direction++){const q=G.newGame('h','h',0,'duel');G.joinGame(q,'g','g');q.covers=[];q.phase='playing';const a=direction*Math.PI/4;q.players[0].x=500;q.players[0].y=550;q.players[0].aim=q.players[0].gunFacing=a;q.players[1].x=500+Math.cos(a)*110;q.players[1].y=550+Math.sin(a)*110;const hp=q.players[1].hp;G.setInput(q,0,1,{fire:true,aim:a});for(let n=0;n<20;n++)G.advance(q,(n+1)*1000/60);assert(q.players[1].hp<hp,'direction '+direction+' missed');}
console.log('PASS27D low/torso/head, above-body misses, vertical crossing, airborne separation, 24 projected barrel sockets, 8-direction live shotgun damage');

const cv={x:0,y:0,w:40,h:40,a:0};assert.equal(B.coverTime27d({x:-50,y:0,z:80},{x:50,y:0,z:80},cv,40),null);assert(B.coverTime27d({x:-50,y:0,z:80},{x:50,y:0,z:0},cv,40)!==null);console.log('PASS sloped bullet cover occlusion and over-cover clearance');
