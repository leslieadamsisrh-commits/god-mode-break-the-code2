'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const F=require('../public/fixture-setup.js'),{Duel}=require('../source/duel.cjs');
test('controller inspection picks P2 in keyboard-pad mode',()=>assert.equal(F.seat('controller','keyboard-pad'),1));
test('explicit seats remain explicit; two pads default to P1',()=>{assert.equal(F.seat('0','keyboard-pad'),0);assert.equal(F.seat('1','two-pads'),1);assert.equal(F.seat('controller','two-pads'),0);});
test('reject invalid settings before resetting match',()=>{const w=new Duel(),before=w.snapshot();assert.throws(()=>F.setup(w,2));assert.deepEqual(w.snapshot(),before);assert.throws(()=>F.seat('bad','keyboard-pad'));});
for (const slot of [0,1]) {
 test(`P${slot+1} corner fixture selects the requested actor and restores simulation pointer`,()=>{const w=new Duel();const result=F.setup(w,slot);assert.equal(result.slot,slot);assert.equal(w.players[slot].cover.id,'station');assert.equal(w.players[slot].cover.edge,'right');assert.equal(w.players[1-slot].cover,null);assert.equal(w.p,w.players[0]);assert.equal(w.currentSlot,null);assert.equal(w.players[slot].x,51);});
 test(`P${slot+1} clear-shot fixture damages the actual opponent`,()=>{const w=new Duel();F.setup(w,slot,'clear-shot');const i=[{aim:Math.PI},{aim:Math.PI}];i[slot]={aim:0,fire:true};w.advance(i);for(let k=0;k<22;k++)w.advance([{aim:slot===0?0:Math.PI},{aim:slot===1?0:Math.PI}]);assert.ok(w.players[1-slot].hp<100);assert.equal(w.players[slot].hp,100);assert.equal(w.metrics.shots,1);});
}
