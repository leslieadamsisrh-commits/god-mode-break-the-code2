const assert = require('node:assert/strict');
const fs = require('node:fs');
const {createHash} = require('node:crypto');
const ts = require('typescript');

require.extensions['.ts'] = (module, path) => {
  module._compile(ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: {module: 1, target: 9, esModuleInterop: true},
  }).outputText, path);
};

const {newGame, setInput, advance} = require('../lib/game.ts');
const {RAPTOR_POSE_DIRECTIONS} = require('../lib/raptorPose.ts');
const {barrelSocket27d} = require('../lib/ballistics27d.ts');
const inventory = require('../public/assets/raptor-v2/manifest.json');
const registration = require('../docs/raptor-fluidity/batch23-registration.json');
const phases = {
  jump: ['push-off', 'ascent', 'apex', 'descent', 'landing', 'recovery'],
  slide: ['entry', 'hold', 'recovery'],
};

function scenario(direction) {
  const angle = RAPTOR_POSE_DIRECTIONS.indexOf(direction) * Math.PI / 4;
  const game = newGame('Raptor', 'local', 0, 'bot');
  game.phase = 'playing';
  game.covers = [];
  game.matter = [];
  const [actor, opponent] = game.players;
  Object.assign(actor, {character: 'raptor', x: 795, y: 430, aim: angle, gunFacing: angle});
  Object.assign(opponent, {bot: false, x: 1350, y: 695});
  const tick = input => {
    setInput(game, 0, actor.lastSeq + 1, {
      aim: angle, x: Math.cos(angle) * .35, y: Math.sin(angle) * .35, ...input,
    });
    advance(game, game.lastAt + 1000 / 60);
  };
  return {game, actor, tick};
}

for (const [action, directions] of Object.entries(inventory.restoredActionDirections)) {
  for (const direction of directions) {
    const {game, actor, tick} = scenario(direction);
    for (let i = 0; i < 9; i++) tick({});
    if (action === 'slide') {
      tick({slide: true});
      tick({});
    }
    const seen = new Set();
    let fired = false;
    for (let i = 0; i < 90; i++) {
      const fire = !fired && actor.raptorFrame.family === action && actor.raptorFrame.frame === 1;
      const shells = actor.shells;
      tick({[action]: i === 0, fire});
      if (actor.raptorFrame.family === action) seen.add(actor.raptorFrame.key);
      if (fire && actor.shells < shells) {
        const socket = barrelSocket27d(actor, game.config.spriteScale);
        const flash = game.fx.findLast(effect => effect.type === 'muzzle' && effect.owner === 0);
        assert.ok(socket.raptorAligned);
        assert.deepEqual([flash.x, flash.y, flash.z], [socket.x, socket.y, socket.z]);
        fired = true;
      }
    }
    for (const [index, phase] of phases[action].entries()) {
      const key = action + '/' + direction + '/' + String(index).padStart(3, '0') + '.png';
      assert.ok(seen.has(key), 'gameplay reached ' + key);
      const record = inventory.frames[key];
      const bytes = fs.readFileSync('public/assets/raptor-v2/' + key);
      assert.equal(bytes.readUInt32BE(16), 512);
      assert.equal(bytes.readUInt32BE(20), 512);
      assert.equal(bytes.readUInt8(25), 6, 'alpha-enabled PNG');
      assert.deepEqual(record, registration[key]);
      assert.equal(record.sha256, createHash('sha256').update(bytes).digest('hex'));
      assert.notEqual(record.sha256, record.replacedSha256);
      assert.equal(record.phase, phase);
      assert.equal(record.anchor[1], 450);
      assert.equal(record.drawScale, .96);
    }
    assert.notEqual(actor.raptorFrame.family, action, 'action hands back to locomotion');
    if (action === 'jump') assert.ok(fired, 'jump permits registered fire');
    console.log('PASS', action, direction, seen.size, 'new frames reached through gameplay');
  }
}
assert.equal(Object.keys(registration).length, inventory.restoredActionCount);
