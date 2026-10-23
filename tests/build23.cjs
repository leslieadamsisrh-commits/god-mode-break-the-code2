const fs=require('fs'),ts=require('typescript'),assert=require('assert/strict');
require.extensions['.ts']=(m,p)=>m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,p);
const {encounterCamera22}=require('../lib/combatPresentation22.ts');
const {projectWorld,unprojectWorld}=require('../lib/bayBridgePresentation.ts');
const {coverMaterial21}=require('../lib/dimension33Registration21.ts');
const frames=require('../lib/dimension33Frames20.json');
const {fitCombatViewport23}=require('../lib/combatViewport23.ts');
for(const [w,h] of [[732,510],[1366,1024],[1194,834],[834,1194],[1920,1080]]){const fit=fitCombatViewport23(w,h);assert(fit.width<=w+1e-8&&fit.height<=h+1e-8);assert(Math.abs(fit.width/fit.height-1000/620)<1e-8);}
// Close encounters keep both fighters inside the HUD-free horizontal bounds;
// aiming round-trips using the exact moving-camera transform.
for(const x of [190,500,810])for(const y of [145,330,485])for(const d of [-130,130]){
 const p={x,y,aim:d>0?0:Math.PI},e={x:x+d,y},cam=encounterCamera22(p,e,true);
 for(const actor of [p,e]){const screen=projectWorld(actor.x,actor.y,cam,cam.zoom),world=unprojectWorld(screen.x,screen.y,cam,cam.zoom);assert(Math.abs(world.x-actor.x)<1e-8);assert(Math.abs(world.y-actor.y)<1e-8);assert(screen.x>60&&screen.x<940,'near opponent clipped');assert(screen.y>130&&screen.y<520,'feet hidden by HUD');}
 assert(cam.zoom/2.77>1.25,'close framing not substantial');
}
const far=encounterCamera22({x:500,y:330,aim:0},null,false);assert.equal(far.zoom,1.95);assert.equal(far.y,330);
const images=new Map([['d33-map20-concrete',{complete:true,naturalWidth:4096}]]);
const shelter={id:'war-shelter-a',w:34,h:118},barrier={id:'d33-nw-primary',w:98,h:30};
const a=coverMaterial21(images,shelter),b=coverMaterial21(images,barrier);
assert.deepEqual(a.point(0,1,.5,.5),b.point(1,0,.5,.5),'long face must use broad material');
assert.deepEqual(a.point(1,0,.5,.5),b.point(0,1,.5,.5),'short face must use end material');
assert.equal(coverMaterial21(new Map(),shelter),null);
assert.equal(coverMaterial21(images,{...shelter,floorPanel46:true}),null);
console.log('PASS23 close encounter visibility, meaningful zoom, screen/world targeting, default camera preserved, shelter face registration and fallback.');
