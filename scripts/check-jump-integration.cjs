const assert=require('assert');
const inventory=require('../public/assets/raptor-v2/manifest.json');
inventory.jumpDirections=['right']; // Test-only fixture; no runtime artwork enabled.
require('./check-postures.cjs');
const {selectRaptorFrame}=require('../lib/raptorSpriteOnly.ts');
const base={x:0,y:0,angle:0,speed:120,sliding:false,airborne:false,hit:false,firing:true,time:0,scale:1,actorId:'jump-integration'};
const check=(time,airborne,verticalVelocity,frame)=>{const r=selectRaptorFrame({...base,time,airborne,verticalVelocity});assert.equal(r.family,'jump');assert.equal(r.frame,frame);};
selectRaptorFrame(base);
check(.016,true,400,0);check(.1,true,200,1);check(.2,true,10,2);check(.3,true,-100,3);check(.4,false,0,4);check(.48,false,0,5);
assert.equal(selectRaptorFrame({...base,time:.56}).family,'jog');
assert.equal(selectRaptorFrame({...base,actorId:'missing-jump',angle:Math.PI,time:0,airborne:true,verticalVelocity:100}).family,'idle','uninstalled direction never requests missing jump files');
assert.equal(selectRaptorFrame({...base,time:.6,hit:true}).family,'idle','hit wins');
console.log('PASS: six jump frames while firing, return to jog, uninstalled-direction fallback, hit priority');
