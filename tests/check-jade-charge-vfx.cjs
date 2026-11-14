const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");

require.extensions[".ts"] = (module,file) => module._compile(ts.transpileModule(
 fs.readFileSync(file,"utf8"),{compilerOptions:{module:1,target:9}}
).outputText,file);

const {jadeChargeFrame,JadeChargeTrails}=require("../lib/jadeChargeVfx.ts");
const duration=2.4;
const jade={character:"jade",hp:100,x:700,y:563,z:0,supportSurfaceId:"ground",charging:true,godCharge:1};
assert.deepEqual([0,.2,.4,.7,.9,1].map(godCharge=>jadeChargeFrame({...jade,godCharge},duration)),[0,1,2,3,4,5]);
assert.equal(jadeChargeFrame({powerFlash:.5},duration),6);
assert.equal(jadeChargeFrame({powerReturn:.08},duration),7);
assert.equal(jadeChargeFrame({powerBlocked:true},duration),null);

const trail=new JadeChargeTrails();
const draws=[];
let origin;
const context={
 beginPath(){},moveTo(){},lineTo(){},closePath(){},clip(){},transform(){},
 translate(x,y){origin=[x,y];},
 drawImage(_,sx,sy){draws.push({cel:sx/256+3*sy/144,origin,alpha:this.globalAlpha});}
};
const capture=(time,elevated=false)=>{draws.length=0;trail.draw(context,{},time,elevated);return draws.slice();};
const step=(time,overrides)=>trail.update([{...jade,...overrides}],time);
step(0);
assert.deepEqual(capture(.05).map(x=>x.cel),[2,0]);
step(.3,{x:744,y:607,vx:50,vy:50});
const drifting=capture(.31);
assert.deepEqual(drifting.filter(x=>x.cel===5).map(x=>x.origin.length),[2,2]);
assert.ok(drifting.some(x=>x.cel===3)&&drifting.some(x=>x.cel===4));
step(.6,{x:744,y:607});
step(.75,{x:744,y:607});
step(.9,{x:744,y:607});
assert.ok(capture(.91).some(x=>x.cel>=3&&x.cel<=4&&x.origin[0]===744&&x.alpha>.9));
step(1.5,{x:700,y:563});
assert.ok(capture(1.51).some(x=>x.cel===1&&x.origin[0]===700));
step(1.6,{charging:false,x:900});
assert.ok(capture(2.6).every(x=>x.cel===2||x.cel===5));
assert.ok(capture(2.6).every(x=>x.origin[0]<750));
step(2.7,{character:"raptor",x:940});
assert.ok(capture(2.71).every(x=>x.origin[0]<750));
step(3,{x:143,y:450,z:128,supportSurfaceId:"west-platform"});
const raised=capture(3.01,true);
assert.ok(raised.length>0&&raised.every(x=>x.origin[1]<450));
step(0,{charging:false});
assert.deepEqual(capture(0),[]);
console.log("PASS Jade charge cels, release and interruption, distance-based stamps, cooling, reheating, elevation, and reset");

const {jadeChargeBeat,JADE_CHARGE_BEATS,JADE_PALETTES}=require("../lib/jadeChargeV2.ts");
assert.equal(JADE_CHARGE_BEATS.length,16);
assert.deepEqual([0,.09,.18,.27].map(chargeAge=>jadeChargeBeat({charging:true,chargeAge},duration)),[1,2,3,4]);
assert.deepEqual([.02,.09,.18,.30,.43,.60,.75,.89,.97,1,1].map((godCharge,i)=>
 jadeChargeBeat({charging:true,godCharge,chargeAge:i===10?3.1:.35+godCharge*duration},duration)),
 [5,6,7,8,9,10,11,12,13,13,14]);
assert.equal(jadeChargeBeat({powerFlash:.4},duration),15);
assert.equal(jadeChargeBeat({},duration),16);
assert.equal(Object.keys(JADE_PALETTES).length,6);
const releaseTrace=new JadeChargeTrails();
let rings=0;
Object.assign(context,{save(){},restore(){},ellipse(){rings++;},stroke(){}});
releaseTrace.update([jade],0);
releaseTrace.update([{...jade,charging:false}],.1);
releaseTrace.draw(context,{},.2,false,{naturalWidth:768,naturalHeight:512});
assert.equal(rings,0);
releaseTrace.update([jade],.3);
releaseTrace.update([{...jade,charging:false,powerFlash:.65}],.4);
releaseTrace.draw(context,{},.5,false,{naturalWidth:768,naturalHeight:512});
assert.equal(rings,1);
console.log("PASS V2 beats, six palettes and shockwave only on confirmed activation");
