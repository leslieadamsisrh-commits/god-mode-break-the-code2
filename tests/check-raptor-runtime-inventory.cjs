const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {createHash} = require('node:crypto');
const root = path.resolve(__dirname, '..');
const ts = require(path.join(root, 'node_modules/typescript'));
require.extensions['.ts'] = (module, filename) => module._compile(
  ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: {module: 1, target: 9, esModuleInterop: true},
  }).outputText, filename);
const manifest = require(path.join(root, 'public/assets/raptor-v2/manifest.json'));
const {advanceRaptorPose, raptorCoverExposureFrame, raptorCoverRecoilFrame} = require(path.join(root, 'lib/raptorPose.ts'));
const inventory = require('../docs/raptor-fluidity/runtime-inventory.json');
const reached = new Set();

function record(frame) {
  if (frame) {
    assert.ok(manifest.frames[frame.key], 'Missing ' + frame.key);
    reached.add(frame.key);
  }
  return frame;
}
function sample(previous, input) {
  const result = advanceRaptorPose(previous, input);
  record(result.frame);
  return result.memory;
}
const headings = manifest.directions.map((_, i) => i * Math.PI / 4);
for (const angle of headings) {
  const base = {time: 0, x: 0, y: 0, angle, travelAngle: angle, speed: 0, sliding: false,
    airborne: false, verticalVelocity: 0, hit: false, attached: false, firing: false};
  for (const speed of [0, 45, 135, 220]) for (const firing of [false, true]) {
    let memory;
    for (let i=0; i<76; i++) {
      const time=i/60;
      memory=sample(memory,{...base,time,speed,firing,x:Math.cos(angle)*speed*time,y:Math.sin(angle)*speed*time});
    }
    for (const dt of [.01, .06, .12]) memory=sample(memory,{...base,time:1.25+dt,firing});
  }
  for (const key of ['sliding','airborne','hit']) {
    let memory = sample(undefined,{...base,time:-1/60});
    for(let i=0;i<90;i++) {
      memory=sample(memory,{...base,time:i/60,[key]:i<30,slideRemaining:.5-i/60,slideDuration:.5,
        verticalVelocity:key==='airborne'&&i<30?400-28*i:0});
    }
  }
  for (const tall of [false,true]) {
    const attached={...base,attached:true,coverId:'fixture',coverTall11:tall,coverProtectedAngle:angle};
    for (const edge of ['start','end']) {
      record(raptorCoverExposureFrame(angle,tall,manifest,edge));
      const shot=record(raptorCoverRecoilFrame(angle,tall,manifest));
      if (shot) {
        for(const time of [.02,.07]) sample(undefined,{...attached,angle,aimAngle:angle,time,coverState11:'fire',
          coverShot:{at:0,coverId:attached.coverId,frame:shot}});
      }
    }
    for(const endpoint of [undefined,...headings]) {
      const anchor={...attached,coverEndpointAngle:endpoint,coverEdge:endpoint===undefined?undefined:'end'};
      for(const state of ['hold','brace','catch','shuffle','drive','expose','fire','retract']) {
        let memory;
        for(let i=0;i<76;i++) {
          const time=i/60, speed=state==='shuffle'||state==='drive'?80:0;
          memory=sample(memory,{...anchor,coverState11:state,time,speed,x:speed*time,coverSpeed11:speed});
        }
      }
      let memory;
      for(const [time,state] of [[0,'hold'],[.02,'expose'],[.04,'expose'],[.11,'expose'],[.13,'retract'],[.17,'retract'],[.22,'hold']]) {
        memory=sample(memory,{...anchor,time,coverState11:state});
      }
    }
  }
}

// Turns in both directions at each pace should keep the same leading leg.
// The selector computes the intended facing independently of travel while firing.
for (const [family,speed] of [['stalk',45],['jog',135],['sprint',220]]) {
  for (const [index,angle] of headings.entries()) {
    for (const offset of [-1,1]) {
      const neighbor = headings[(index+offset+headings.length)%headings.length];
      const base = {time:1,x:0,y:0,angle,travelAngle:angle,speed,sliding:false,
        airborne:false,verticalVelocity:0,hit:false,attached:false,firing:true};
      for (const [frame,phase] of [.14,.37,.64,.87].entries()) {
        const initial = advanceRaptorPose(undefined,base);
        initial.memory.gait.phase = phase;
        const result = advanceRaptorPose(initial.memory,{...base,angle:neighbor,travelAngle:neighbor});
        record(result.frame);
        const expectedFamily = family==='stalk' && manifest.movementDirections.includes(manifest.directions[(index+offset+headings.length)%headings.length]) ? 'movement' : family;
        assert.equal(result.frame.family,expectedFamily);
        assert.equal(result.frame.frame,frame+(expectedFamily==='movement'?2:0));
        assert.equal(result.memory.gait.phase,phase);
      }
    }
  }
}

const registered = Object.keys(manifest.frames).sort();
const catalog = new Map(inventory.slots.map(slot => [slot.key,slot]));
assert.deepEqual([...catalog.keys()].sort(),registered,'Inventory keys must match the runtime manifest');
const reachable = [...catalog.values()].filter(slot => slot.status!=='unselected-with-current-availability');
assert.deepEqual([...reached].sort(),reachable.map(slot=>slot.key).sort(),'Update the inventory if selector reachability changes');
const open = reachable.filter(slot => !['replaced-in-design-pass','reused-approved'].includes(slot.status));
for (const slot of reachable) {
  const entry = manifest.frames[slot.key];
  assert.ok(entry.anchor?.length===2 && entry.anchor.every(Number.isFinite) && entry.drawScale>0,slot.key+' invalid anchor');
  const file = fs.readFileSync(path.join(root,'public/assets/raptor-v2',slot.key));
  assert.equal(file.readUInt32BE(16),512,slot.key);
  assert.equal(file.readUInt32BE(20),512,slot.key);
  if (slot.status==='reused-approved') {
    assert.deepEqual(file,fs.readFileSync(path.join(root,slot.reference)),slot.key+' approved master bytes');
  }
  if (slot.status!=='open-for-replacement') {
    assert.equal(entry.sha256,createHash('sha256').update(file).digest('hex'),slot.key+' approved asset digest');
  }
}

if (process.argv.includes('--release')) {
  for (const {family,direction,phase} of open) console.error(family+' / '+direction+' / '+phase);
  assert.equal(open.length,0,'Reachable Raptor slots still require replacement');
}
console.log('Raptor inventory: '+reachable.length+' reachable, '+(reachable.length-open.length)+' approved, '+open.length+' open');
