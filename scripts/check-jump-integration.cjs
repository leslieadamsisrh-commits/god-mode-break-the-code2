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

const actor=(id,time,airborne,verticalVelocity,extra={})=>selectRaptorFrame({...base,actorId:id,time,airborne,verticalVelocity,...extra});
actor('jumper-a',1,false,0);actor('jumper-b',1,false,0);
assert.equal(actor('jumper-a',1.016,true,400).frame,0);
assert.equal(actor('jumper-b',1.016,false,0).family,'jog','another actor does not inherit takeoff');
assert.equal(actor('jumper-a',1.1,true,200).frame,1);
assert.equal(actor('jumper-b',1.1,true,-10).frame,3,'independent ledge fall skips push-off');
assert.equal(actor('jumper-a',1.2,true,0).frame,2);
assert.equal(actor('jumper-b',1.2,false,0).frame,4);
assert.equal(actor('jumper-a',1.3,true,-100).frame,3,'another actor landing does not reset flight');
assert.equal(actor('jumper-b',1.216,true,400).frame,0,'repeat jump immediately replaces landing');
assert.equal(actor('jumper-a',1.4,false,0,{sliding:true}).family,'slide','landing into slide wins immediately');
assert.equal(actor('jumper-b',1.3,true,200,{attached:true}).family,'idle','cover attachment interrupts jump art');
assert.equal(actor('jumper-b',1.4,true,80).frame,1);
assert.equal(actor('jumper-b',1.5,true,0).frame,2,'resumed ascent reaches apex through renderer');
console.log('PASS: independent actors, ledge fall, repeat jump, landing into slide and cover interruption');

