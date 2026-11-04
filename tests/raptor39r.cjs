const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),ts=require('typescript');
const manifest=JSON.parse(fs.readFileSync('public/assets/raptor-v2/manifest.json'));
function load(){const c={exports:{},Map,Set,Math,Promise,require:()=>({default:manifest})};vm.createContext(c);vm.runInContext(ts.transpileModule(fs.readFileSync('lib/raptorSpriteOnly.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,c);return c.exports;}
const a=load(),base={actorId:'test',x:0,y:0,worldX:0,worldY:0,angle:0,travelAngle:0,speed:100,sliding:false,airborne:false,hit:false,firing:false,time:0,scale:1};
for(let dir=0;dir<8;dir++){
 const angle=dir*Math.PI/4,id='dir'+dir;
 a.selectRaptorFrame({...base,actorId:id,angle,time:100});
 for(let step=1;step<=8;step++){
  const state=Object.freeze({...base,actorId:id,angle,travelAngle:angle,time:100+step*.125,worldX:Math.cos(angle)*step*12.5,worldY:Math.sin(angle)*step*12.5,firing:true});
  const frame=a.selectRaptorFrame(state);assert.equal(frame.family,'run','moving fire preserves gait');assert.equal(frame.angle,angle,'aim preserved');
 }
}
function distance(fps){const b=load();for(let i=0;i<=fps;i++)b.raptorGaitPhase({...base,time:i/fps,worldX:75*i/fps,speed:75});return b.raptorGaitPhase({...base,time:1,worldX:75,speed:75});}
assert(Math.abs(distance(30)-distance(144))<1e-9,'render rate independence');
const b=load();b.raptorGaitPhase(base);let phase=b.raptorGaitPhase({...base,time:.2,worldX:20});assert(Math.abs(phase-.2)<1e-9);
assert.equal(b.raptorGaitPhase({...base,time:.2,worldX:20}),phase,'duplicate draw does not advance');
assert.equal(b.raptorGaitPhase({...base,time:.3,worldX:20,x:900,y:-500,speed:0}),phase,'camera movement and stop preserve phase');
phase=b.raptorGaitPhase({...base,time:.4,worldX:20,worldY:10,angle:Math.PI/2,travelAngle:Math.PI/2});assert(Math.abs(phase-.3)<1e-9,'turn preserves phase');
phase=b.raptorGaitPhase({...base,time:.5,worldX:20,worldY:5,angle:Math.PI/2,travelAngle:-Math.PI/2,speed:50});assert(Math.abs(phase-.25)<1e-9,'backpedal reverses cycle');
assert.equal(b.raptorGaitPhase({...base,time:.6,worldX:800,worldY:5}),phase,'teleport ignored');
assert.equal(b.raptorGaitPhase({...base,time:4,worldX:850,worldY:5}),phase,'long suspension ignored');
assert.equal(b.raptorGaitPhase({...base,time:0}),0,'rematch reset');
assert.equal(b.selectRaptorAction({...base,speed:8,firing:true}),'walk','slow movement remains stepping');
assert.equal(b.selectRaptorAction({...base,speed:0,firing:true}),'shoot');
for(const state of [{hit:true},{airborne:true},{sliding:true}])assert.notEqual(b.selectRaptorAction({...base,...state,firing:true}),'walk','authoritative action priority');
console.log('PASS39R eight-direction moving fire, frame-rate-independent distance gait, aim, slow movement, turns, backpedal, stops, duplicate renders, teleports, suspension, rematch and action priority');

const forward=load();
function family(t,speed,travelAngle,extra={}){
 return forward.selectRaptorFrame({...base,time:t,speed,travelAngle,firing:true,...extra}).family;
}
assert.equal(family(0,165,0),'run');
assert.equal(family(.1,180,0),'sprint');
assert.equal(family(.2,155,0),'sprint');
assert.equal(family(.3,140,0),'run');
assert.equal(family(.4,210,Math.PI/2),'run');
assert.equal(family(.5,210,Math.PI),'run');
assert.equal(family(.6,210,0,{airborne:true}),'idle');
assert.equal(family(.7,210,0),'idle');
assert.equal(family(.8,210,0),'sprint');
assert.equal(family(.9,210,0,{attached:true}),'idle');
console.log('PASS39R2 forward firing sprint, speed hysteresis, upright strafe/backpedal, cover and landing interruption');
