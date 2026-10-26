const fs=require('fs'),ts=require('typescript'),assert=require('node:assert/strict');global.crypto??=require('node:crypto').webcrypto;
require.extensions['.ts']=(m,p)=>m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,p);
const {newGame,setInput,advance,joinGame,safeState,startOrRematch,shotPlayerTime}=require('../lib/game.ts');
const {integrateVertical,COMBAT_SURFACES,surfaceShotTime}=require('../lib/verticalCombat27b.ts');
const {minimumZoom27b,viewport27b,stableEncounter27b}=require('../lib/combatPresentation22.ts');
let s=newGame('host','host',0,'solo'),seq=0;const frame=input=>{setInput(s,0,++seq,input);advance(s,s.lastAt+1000/60);};
frame({jump:true});assert(s.players[0].z>0&&s.players[0].vz>0);const first=s.players[0].vz;frame({jump:true});assert(s.players[0].vz<first,'held jump retriggers');for(let i=0;i<100;i++)frame({});assert.equal(s.players[0].z,0);assert(s.players[0].grounded);
frame({jump:true,fire:true,aim:0});assert(s.shots.length>0);assert(s.shots.every(sh=>sh.z>=s.players[0].z));frame({shield:true});assert(s.players[0].shield);assert(s.players[0].z>0);
const ground={x:600,y:180,z:0,vz:0,grounded:true,supportSurfaceId:'ground'};assert.equal(integrateVertical(ground,ground,false,1/60).z,0,'overhead snap');
let p={x:1100,y:310*1100/840,z:0,vz:0,grounded:true,supportSurfaceId:'ground'};for(let i=0;i<118;i++){const previous={...p};p.y-=1;Object.assign(p,integrateVertical(p,previous,false,1/60));}assert(p.z>70&&p.grounded,'stairs failed');
assert(Number.isFinite(surfaceShotTime({x:1100,y:236,z:100},{x:1100,y:236,z:50})),'platform projectile');
const target={...s.players[0],x:100,y:100,z:72,shield:false};assert.equal(shotPlayerTime({x:50,y:100},{x:150,y:100},36,target,target),null);assert(shotPlayerTime({x:50,y:100},{x:150,y:100},108,target,target));
let maxW=0,maxH=0;for(let y=90;y<=770;y+=20){const c={x:750,y},z=minimumZoom27b(c),v=viewport27b(c,z);assert(v.width<=750.001&&v.height<=420.001);maxW=Math.max(maxW,v.width);maxH=Math.max(maxH,v.height);}
const memory={},a={x:750,y:420,z:0,hp:420,aim:0};let last;for(let i=0;i<300;i++){const c=stableEncounter27b(a,[a,{x:1000+Math.sin(i)*2,y:420,hp:420}],0,memory,1/60);if(last)assert(Math.abs(c.zoom-last.zoom)<.1);last=c;}
s=newGame('host','host',0,'duel');joinGame(s,'guest','guest');s.phase='playing';setInput(s,0,1,{jump:true});advance(s,1000/60);const pub=safeState(s);assert(pub.players[0].z>0);assert(!('token' in pub.players[0]));assert.equal(pub.players[1].z,0);startOrRematch(s,0);assert(s.players.every(p=>p.z===0&&p.grounded));
console.log('PASS27B combat jump/fire/shield, held-edge, landing, stairs, underpass, platform shots, hit volumes, serialized vertical state, rematch; viewport max',maxW,maxH);
