import assert from 'node:assert/strict';
import {advanceRaptorJump} from '../lib/raptorJump.ts';
let memory;
function sample(time,airborne,verticalVelocity,interrupted=false){const r=advanceRaptorJump(memory,{time,airborne,verticalVelocity,interrupted});memory=r.memory;return r.phase;}
assert.equal(sample(0,false,0),null);
assert.equal(sample(.016,true,400),'push-off');
assert.equal(sample(.05,true,350),'push-off');
assert.equal(sample(.1,true,250),'ascent');
assert.equal(sample(.2,true,20),'apex');
assert.equal(sample(.22,true,-20),'apex');
assert.equal(sample(.3,true,-120),'descent');
assert.equal(sample(.4,false,0),'landing');
assert.equal(sample(.48,false,0),'recovery');
assert.equal(sample(.56,false,0),null);
assert.equal(sample(.6,true,-10),'descent','ledge fall must not push off or invent apex');
assert.equal(sample(.7,false,0),'landing');
assert.equal(sample(.72,true,400),'push-off','immediate repeat jump interrupts recovery');
assert.equal(sample(.74,true,350,true),null,'hit/cover interruption wins');
assert.equal(sample(.8,true,-100),'descent');
assert.equal(sample(.9,false,0,true),null,'interrupted contact does not trigger landing');
assert.equal(sample(.95,false,0),null);
assert.equal(sample(0,false,0),null,'time reset clears prior flight');
assert.equal(sample(1,true,-100),'descent','resuming midflight does not invent takeoff');
assert.equal(sample(2,false,0),null,'long sample gap does not invent a witnessed contact');
console.log('PASS: flight phases, ledge fall, contact/recovery, repeat jump, interruption, reset and gaps');

memory=undefined;
assert.equal(sample(10,true,150),'ascent','joining mid-ascent must not invent push-off');
assert.equal(sample(10.1,true,10),'apex','observed ascent reaches apex without a witnessed takeoff');
assert.equal(sample(10.2,true,-100),'descent');
assert.equal(sample(10.3,false,0),'landing');
assert.equal(sample(10.32,true,20),'push-off','a short upward jump still has a witnessed takeoff');
assert.equal(sample(10.4,true,5),'apex');
assert.equal(sample(10.5,true,100,true),null);
assert.equal(sample(10.6,true,60),'ascent','recovered hit can resume ascent');
assert.equal(sample(10.7,true,0),'apex','recovered ascent retains its apex');
assert.equal(sample(11.5,true,0),'descent','long gap clears prior ascent evidence');
assert.equal(sample(11.6,false,0),'landing');
assert.equal(sample(11.7,true,-1),'descent','a later ledge fall cannot inherit prior ascent');
console.log('PASS: mid-ascent resume, short takeoff, hit recovery and ascent evidence reset');

for(const hz of [30,60,120]){
 memory=undefined;sample(0,false,0);
 const phases=new Set();
 for(let i=1;i<=Math.ceil(hz*.95);i++){
  const time=i/hz,flightTime=time-1/hz,airborne=flightTime<.8;
  const phase=sample(time,airborne,airborne?400-1000*flightTime:0);
  if(phase)phases.add(phase);
 }
 assert.deepEqual([...phases],['push-off','ascent','apex','descent','landing','recovery'],`${hz} Hz must expose every phase in order`);
}
console.log('PASS: complete ballistic sequence at 30, 60 and 120 Hz');

