const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

require.extensions['.ts'] = (module, file) => {
  module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: {module: 1, target: 9, esModuleInterop: true},
  }).outputText, file);
};

const {frames} = require('../public/assets/raptor-v2/manifest.json');
const calibration = require('../docs/raptor-fluidity/batch34-1-scale-registration.json');
const {raptorSpritePlacement} = require('../lib/raptorSpriteOnly.ts');
const {raptorBarrelSocket} = require('../lib/raptorSocket.ts');

function close(actual, expected, tolerance, label) {
  assert.ok(Math.abs(actual - expected) < tolerance, label);
}

const actor = {x: 850, y: 500, z: 0, gunFacing: 0};
const scale = .82 * .26;
for (const [key, measurement] of Object.entries(calibration)) {
  const frame = frames[key];
  const prior = {...frame, anchor: measurement.previousAnchor, drawScale: measurement.previousDrawScale};
  assert.deepEqual(frame.anchor, measurement.anchor, key);
  assert.equal(frame.drawScale, measurement.drawScale, key);
  const oldError = Math.abs(prior.drawScale * measurement.sourceSpan - measurement.targetSpan);
  const newError = Math.abs(frame.drawScale * measurement.sourceSpan - measurement.targetSpan);
  assert.ok(newError < .05 && newError < oldError, key + ' improves the measured scale');

  const before = raptorSpritePlacement({...actor, scale}, prior);
  const after = raptorSpritePlacement({...actor, scale}, frame);
  const [footX, footY] = frame.supportFoot;
  close(after.x + footX * after.size / 512, before.x + footX * before.size / 512, .001, key + ' foot X');
  close(after.y + footY * after.size / 512, before.y + footY * before.size / 512, .001, key + ' foot Y');
  const socket = raptorBarrelSocket(actor, frame);
  close(socket.rendered.x, after.x + frame.muzzle[0] * after.size / 512, .001, key + ' muzzle X');
  close(socket.rendered.y, after.y + frame.muzzle[1] * after.size / 512, .001, key + ' muzzle Y');
}
console.log('PASS ' + Object.keys(calibration).length + ' measured registrations preserve support contact and visible muzzle');
