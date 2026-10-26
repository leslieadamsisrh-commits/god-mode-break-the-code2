const fs=require('fs'),ts=require('typescript'),assert=require('assert/strict');
global.crypto??=require('crypto').webcrypto;
require.extensions['.ts']=(m,p)=>m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,p);
const {newGame,setInput,advance,startOrRematch,constructionPreview21}=require('../lib/game.ts');
const {BAY_OBJECTS,BAY_BOUNDS:A,BAY_SPAWNS}=require('../lib/bayBridgeMap.ts');
const {projectWorld,unprojectWorld}=require('../lib/bayBridgePresentation.ts');
const {encounterCamera22}=require('../lib/combatPresentation22.ts');
const {coverMaterial21}=require('../lib/dimension33Registration21.ts');
for(const o of BAY_OBJECTS){const {x,y}=o.worldPosition,{w,h}=o.dimensions;assert(x-w/2>A.left&&x+w/2<A.right&&y-h/2>A.top&&y+h/2<A.bottom);assert(BAY_OBJECTS.some(p=>Math.abs(p.worldPosition.x-(1500-x))<1e-8&&p.worldPosition.y===y),'unmirrored object '+o.id);}
const s=newGame('QA','qa',1000,'solo');assert.equal(s.players[0].x,BAY_SPAWNS[0].x);assert(s.groundSources44.some(q=>q.x>1300&&q.y>650));
// Exercise real movement and collision at all expanded boundaries.
for(const [x,y,dx,dy] of [[1400,430,1,0],[100,430,-1,0],[750,120,0,-1],[750,740,0,1]]){
 Object.assign(s.players[0],{x,y,vx:0,vy:0});for(let n=0;n<90;n++){setInput(s,0,s.players[0].lastSeq+1,{x:dx,y:dy});advance(s,s.lastAt+1000/60);}
 const p=s.players[0];assert(p.x>=A.left&&p.x<=A.right&&p.y>=A.top&&p.y<=A.bottom);
 if(dx>0)assert(p.x>1000,'old right wall remains');if(dy>0)assert(p.y>620,'old bottom wall remains');
}
s.covers=[];Object.assign(s.players[0],{x:1300,y:563,z:0,grounded:true,coverId:null,aim:0,battery:100});assert(constructionPreview21(s.players[0],s,0).valid,'expanded placement is rejected');
setInput(s,0,s.players[0].lastSeq+1,{cover:true,aim:0});advance(s,s.lastAt+1000/60);assert(s.covers.some(c=>c.x>1000),'cover creation still uses old bounds');
startOrRematch(s,0);assert.equal(s.players[0].x,BAY_SPAWNS[0].x);assert.equal(s.players[0].y,BAY_SPAWNS[0].y);
for(let x=90;x<1430;x+=110)for(let y=110;y<770;y+=80){const cam=encounterCamera22({x,y,aim:0},null,true),p=projectWorld(x,y,cam,cam.zoom),q=unprojectWorld(p.x,p.y,cam,cam.zoom);assert(Math.hypot(q.x-x,q.y-y)<1e-7);assert(p.x>=0&&p.x<=1000&&p.y>=0&&p.y<=620);}
const concrete={complete:true,naturalWidth:4096},floor={complete:true,naturalWidth:4096};
const material=coverMaterial21(new Map([['d33-map20-concrete',concrete],['d33-map20-floor',floor]]),{id:'d33-nw-primary',w:98,h:30});
assert.equal(material.imageFor(0,0),floor,'roof still uses stretched painted bevel');assert.equal(material.imageFor(1,0),concrete);
const bots=newGame('QA','qa',1000,'watch');bots.phase='playing';let closest=Infinity;
for(let n=0;n<600;n++){advance(bots,bots.lastAt+1000/60);closest=Math.min(closest,Math.hypot(bots.players[0].x-bots.players[1].x,bots.players[0].y-bots.players[1].y));}
assert(closest<450,'bots did not find an encounter in ten seconds');
console.log('PASS25 mirrored hulls, expanded boundary movement, floor coverage, reset, targeting round trips, roof source and bot encounter; minimum bot separation',closest.toFixed(1));

