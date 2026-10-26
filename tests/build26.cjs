const fs=require('fs'),ts=require('typescript'),assert=require('assert/strict');
global.crypto??=require('crypto').webcrypto;
require.extensions['.ts']=(m,p)=>m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,p);
const {kineticCamera26,encounterCamera22}=require('../lib/combatPresentation22.ts');
const {projectWorld,unprojectWorld}=require('../lib/bayBridgePresentation.ts');
const player={x:750,y:420,aim:0,vx:0,vy:0};
const right=kineticCamera26(player,null),left=kineticCamera26({...player,aim:Math.PI},null);
assert(right.x>player.x&&left.x<player.x,'aim look-ahead direction');
assert(kineticCamera26({...player,aim:Math.PI/2},null).y>player.y,'vertical look-ahead');
const far=kineticCamera26(player,{x:1250,y:420}),near=kineticCamera26(player,{x:830,y:420});
assert(near.zoom>far.zoom,'enemy-aware zoom');
assert(Math.abs(far.zoom-2.55)<1e-8&&Math.abs(near.zoom-3.25)<1e-8,'zoom endpoints');
for(let x=80;x<1450;x+=137)for(let y=95;y<760;y+=91){const cam=kineticCamera26({...player,x,y},null);assert(Number.isFinite(cam.x)&&Number.isFinite(cam.y)&&cam.x>=0&&cam.x<=1500&&cam.y>=0&&cam.y<=840);const screen=projectWorld(x,y,cam,cam.zoom),world=unprojectWorld(screen.x,screen.y,cam,cam.zoom);assert(Math.hypot(world.x-x,world.y-y)<1e-6,'projection round trip');}
assert.equal(encounterCamera22(player,null,false).zoom,1.95,'legacy wide preset changed');
console.log('PASS26 look-ahead, zoom, bounds, projection and legacy wide camera');

for(let d=100;d<=340;d+=2){const a=kineticCamera26(player,{x:750+d,y:420}),b=kineticCamera26(player,{x:752+d,y:420});assert(Math.abs(a.zoom-b.zoom)<.035,'zoom discontinuity near opponent threshold');}
