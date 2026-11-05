const fs=require('fs'),Module=require('module'),assert=require('assert');
require.extensions['.ts']=(mod,file)=>{
 let s=Module.stripTypeScriptTypes(fs.readFileSync(file,'utf8'));const names=[...s.matchAll(/export\s+(?:async\s+)?(?:function|const|let|class)\s+(\w+)/g)].map(m=>m[1]);
 s=s.replace(/import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"];?/g,(_,n,p)=>'const {'+n.replace(/\bas\b/g,':')+'}=require('+JSON.stringify(p)+');');
 s=s.replace(/import\s+(\w+)\s*from\s*['"]([^'"]+)['"];?/g,(_,n,p)=>'const '+n+'=require('+JSON.stringify(p)+');');
 s=s.replace(/export\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"];?/g,(_,n,p)=>'Object.assign(exports,require('+JSON.stringify(p)+'));');
 s=s.replace(/\bexport\s+/g,'');s+='\nObject.assign(exports,{'+names.join(',')+'});';mod._compile(s,file);
};
const {selectRaptorFrame}=require('../lib/raptorSpriteOnly.ts');
let time=0; const state={x:0,y:0,angle:0,travelAngle:0,speed:0,sliding:false,airborne:false,hit:false,firing:false,time:0,scale:1,actorId:'posture-test'};
const frame=(speed,extra={})=>selectRaptorFrame({...state,speed,time:time+=1/60,...extra});
assert.equal(frame(0).family,'idle');
assert.equal(frame(40).family,'stalk');
assert.equal(frame(96).family,'jog');
assert.equal(frame(85).family,'jog');
assert.equal(frame(74).family,'stalk');
assert.equal(frame(180).family,'sprint');
assert.equal(frame(150).family,'sprint');
assert.equal(frame(140).family,'jog');
assert.equal(frame(70).family,'stalk');
assert.equal(frame(0).family,'idle');
for(const speed of [40,120,220]){let phases=new Set();for(let i=0;i<400;i++)phases.add(frame(speed,{firing:true}).frame);assert.equal(phases.size,4)}
assert.equal(frame(40,{angle:-Math.PI/2,travelAngle:-Math.PI/2}).family,'run','unbuilt directions retain existing assets');
assert.equal(frame(40,{sliding:true,slideRemaining:.5}).family,'slide');
for(let i=0;i<20;i++)frame(0);
assert.equal(frame(0).family,'idle','slide recovers into standing');
console.log('PASS: idle/stalk/jog/sprint progression, threshold hysteresis, all4 phases while firing, unbuilt-direction fallback, slide recovery');
const {raptorSpritePlacement}=require('../lib/raptorSpriteOnly.ts');
const world={x:400,y:300,scale:.5};
assert.deepEqual(raptorSpritePlacement(world,{anchor:[256,450]}),{x:272,y:75,size:256},'legacy registration unchanged');
for(const drawScale of [1,1.3,.8]){
 const anchor=[270,450],p=raptorSpritePlacement(world,{anchor,drawScale});
 const scale=p.size/512;
 assert.equal(p.x+anchor[0]*scale,world.x,'horizontal anchor pinned');
 assert.equal(p.y+anchor[1]*scale,world.y,'ground anchor pinned');
 assert.equal(scale,.5*drawScale,'uniform scale preserves body proportions');
}
for(const drawScale of [0,-1,NaN,Infinity])assert.deepEqual(raptorSpritePlacement(world,{anchor:[256,450],drawScale}),{x:272,y:75,size:256});
console.log('PASS: authored scale retains world anchors and legacy placement');
for(const [angle,label] of [[0,'right'],[Math.PI/2,'front'],[Math.PI/4,'front-right'],[Math.PI,'left'],[3*Math.PI/4,'front-left']]){
 for(const [speed,family] of [[40,'stalk'],[120,'jog']]){
  const phases=new Set();
  for(let i=0;i<400;i++){
   const selected=frame(speed,{actorId:label+'-'+family,angle,travelAngle:angle,firing:true});
   assert.equal(selected.family,family,label+' uses its dedicated gait');phases.add(selected.frame);
  }
  assert.equal(phases.size,4,label+' '+family+' retains every phase during fire');
 }
}
console.log('PASS: five installed directional posture sets retain all phases');
const {raptorLabMovement}=require('../lib/raptorSpriteOnly.ts');
for(const pace of [.25,.55,1])for(const[x,y]of [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]]){
 const v=raptorLabMovement(x,y,pace);
 assert.ok(Math.abs(Math.hypot(v.x,v.y)-pace)<1e-12,'same pressure in every direction');
 assert.ok(Math.abs(Math.atan2(v.y,v.x)-Math.atan2(y,x))<1e-12,'direction preserved');
}
assert.deepEqual(raptorLabMovement(0,0,.55),{x:0,y:0});
assert.deepEqual(raptorLabMovement(.2,0,.55),{x:.11000000000000001,y:0});
console.log('PASS: digital diagonal pace normalized without amplifying subunit input');
