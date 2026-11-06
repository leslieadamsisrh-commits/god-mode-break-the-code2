const fs=require('fs'),ts=require('typescript'),assert=require('node:assert/strict');
require.extensions['.ts']=(m,p)=>m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,p);
const {raptorBarrelSocket}=require('../lib/raptorSocket.ts');
const {arenaPoint46,arenaJacobian46,projectWorld,ARENA_UPRIGHT_SCALE47}=require('../lib/bayBridgePresentation.ts');
const {barrelSocket27d}=require('../lib/ballistics27d.ts');
const close=(a,b,message)=>assert.ok(Math.abs(a-b)<1e-9,`${message}: ${a} != ${b}`);

// Source coordinates are synthetic test fixtures, not accepted artwork sockets.
// Test all eight directions, including rear feet/depth registrations and slide scale.
const authored=[
 {anchor:[300,450],muzzle:[443,308]},
 {anchor:[256,450],muzzle:[384,330],muzzleGround:[384,466]},
 {anchor:[256,450],muzzle:[288,348]},
 {anchor:[256,450],muzzle:[131,330],muzzleGround:[131,466]},
 {anchor:[270,450],muzzle:[65,307],drawScale:1.076276},
 {anchor:[256,369],muzzle:[139,242],muzzleGround:[139,342]},
 {anchor:[256,356],muzzle:[226,235],drawScale:1.317741},
 {anchor:[256,375],muzzle:[375,242],muzzleGround:[375,342]}
];
let projections=0;
for(let d=0;d<8;d++)for(const spriteScale of [.5,.82,1.4])for(const z of [0,80])for(const visualOffset of [{x:0,y:0},{x:3.7,y:-2.1}]){
 const actor={x:320+d*190,y:120+d*90,z,gunFacing:d*Math.PI/4},record=authored[d];
 const socket=raptorBarrelSocket(actor,record,spriteScale,visualOffset);assert(socket);
 const q=.26*spriteScale*(record.drawScale??1);
 close(socket.scale,q,'uniform source scale');
 close(socket.rendered.x,actor.x+visualOffset.x+(record.muzzle[0]-record.anchor[0])*q,'rendered muzzle X');
 close(socket.rendered.y,actor.y+visualOffset.y+(record.muzzle[1]-record.anchor[1])*q-z,'rendered muzzle Y');
 assert.equal(socket.dir,d*3);
 for(const zoom of [.75,1.85,3.2]){
  const camera={x:1100,y:550},foot=projectWorld(actor.x,actor.y,camera,zoom,0),actual=projectWorld(socket.x,socket.y,camera,zoom,socket.z);
  // withUpright cancels the floor Jacobian and applies equal X/Y body scale.
  close(actual.x,foot.x+(socket.rendered.x-actor.x)*zoom*ARENA_UPRIGHT_SCALE47,'projected muzzle X');
  close(actual.y,foot.y+(socket.rendered.y-actor.y)*zoom*ARENA_UPRIGHT_SCALE47,'projected muzzle Y');
  projections++;
 }
}

const actor={x:750,y:420,z:40,gunFacing:0},record=authored[0];
assert.equal(raptorBarrelSocket(actor,undefined),null);
for(const bad of [NaN,Infinity,0,-1])assert.equal(raptorBarrelSocket(actor,record,bad),null);
for(const bad of [NaN,Infinity,0,-1]){
 const fallback=raptorBarrelSocket(actor,{...record,drawScale:bad});
 assert.deepEqual(fallback,raptorBarrelSocket(actor,record),'invalid drawScale follows renderer fallback');
}
for(const bad of [
 {...record,muzzle:[NaN,310]}, {...record,anchor:[256]},
 {...record,muzzleGround:[442,450]}, {...record,muzzleGround:[443,307]},
 {...record,muzzleGround:[443,Infinity]}
])assert.equal(raptorBarrelSocket(actor,bad),null);
assert.equal(raptorBarrelSocket({...actor,z:NaN},record),null);
assert.equal(raptorBarrelSocket(actor,record,.82,{x:Infinity,y:0}),null);
assert.equal(raptorBarrelSocket(actor,{...record,drawScale:1e308},1e308),null,'finite inputs cannot overflow the socket');
const before=JSON.stringify({actor,record});raptorBarrelSocket(actor,record);assert.equal(JSON.stringify({actor,record}),before,'no mutation');

// Existing Jade barrel function remains on its original path and source formula.
for(let d=0;d<24;d++)for(const slide of [0,.3]){
 const p={...actor,gunFacing:d*Math.PI/12,slide},scale=.82,socket=barrelSocket27d(p,scale);
 const j=arenaJacobian46(p.x,p.y),a=Math.atan2(j.y*Math.sin(p.gunFacing),j.x*Math.cos(p.gunFacing)+j.xy*Math.sin(p.gunFacing));
 const origin=arenaPoint46(p.x,p.y),floor=arenaPoint46(socket.x,socket.y),unit=1.536*.64;
 close(floor.x-origin.x,Math.cos(a)*125*.38*scale*unit,'legacy Jade X');
 close(floor.y-origin.y,Math.sin(a)*14*scale*unit,'legacy Jade Y');
 close(socket.z,p.z+125*(.88-.37)*scale*(slide>0?.58:1),'legacy Jade height');
}
console.log(`PASS: ${projections} Raptor projection round-trips, eight directions, elevation, cover offset, authored floor depth, uniform scaling, invalid inputs and unchanged Jade socket geometry`);
