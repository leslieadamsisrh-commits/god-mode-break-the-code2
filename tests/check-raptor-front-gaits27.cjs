const fs = require('node:fs');
const assert = require('node:assert/strict');
const {createHash} = require('node:crypto');
const ts = require('typescript');

require.extensions['.ts'] = (module, path) => {
  const source = fs.readFileSync(path, 'utf8');
  module._compile(ts.transpileModule(source, {
    compilerOptions: {module: 1, target: 9, esModuleInterop: true},
  }).outputText, path);
};
const {newGame, setInput, advance} = require('../lib/game.ts');
const {barrelSocket27d} = require('../lib/ballistics27d.ts');
const {advanceRaptorPose, RAPTOR_POSE_DIRECTIONS} = require('../lib/raptorPose.ts');
const inventory = require('../public/assets/raptor-v2/manifest.json');
const registration = {
  ...require('../docs/raptor-fluidity/batch27-registration.json'),
  ...require('../docs/raptor-fluidity/batch31-registration.json'),
  ...require('../docs/raptor-fluidity/batch32-registration.json'),
};
const phases = inventory.gaitPhases;

for (const direction of ['front', 'front-left', 'front-right']) {
  const angle = RAPTOR_POSE_DIRECTIONS.indexOf(direction) * Math.PI / 4;
  const dx = Math.cos(angle), dy = Math.sin(angle);
  const sample = {
    time: 1, x: 600, y: 500, speed: 45, angle, travelAngle: angle,
    attached: false, airborne: false, hit: false, sliding: false, firing: false,
  };
  const stalk = advanceRaptorPose(undefined, sample);
  stalk.memory.gait.phase = .58;
  const jog = advanceRaptorPose(stalk.memory, {...sample, speed: 120});
  const sprint = advanceRaptorPose(jog.memory, {...sample, speed: 185});
  assert.deepEqual([jog.frame.family, jog.frame.frame], ['jog', 2]);
  assert.deepEqual([sprint.frame.family, sprint.frame.frame], ['sprint', 2]);
  assert.equal(sprint.memory.gait.phase, .58, 'pace changes preserve foot phase');

  for (const [family, pressure] of [['stalk', .24], ['jog', .55], ['sprint', 1]]) {
    const game = newGame('Raptor', 'local', 0, 'bot');
    game.phase = 'playing';
    game.covers = [];
    game.matter = [];
    const [actor, opponent] = game.players;
    Object.assign(actor, {character: 'raptor', x: 680, y: 500, aim: angle, gunFacing: angle});
    Object.assign(opponent, {bot: false, x: 1300, y: 660});
    const tick = (fire = false) => {
      setInput(game, 0, actor.lastSeq + 1, {aim: angle, x: dx * pressure, y: dy * pressure, fire});
      advance(game, game.lastAt + 1000 / 60);
    };
    Object.assign(actor, {vx:0,vy:0});
    setInput(game, 0, actor.lastSeq + 1, {aim:angle});
    advance(game, game.lastAt + 1000/60);
    assert.equal(actor.raptorFrame.key, 'idle/' + direction + '/000.png');
    const painted = new Set();
    for (let i = 0; i < 100; i++) {
      tick();
      painted.add(actor.raptorFrame.key);
    }
    for (let frame = 0; frame < 4; frame++) {
      const key = family + '/' + direction + '/' + String(frame).padStart(3, '0') + '.png';
      assert.ok(painted.has(key), 'authority reaches ' + key);
      const bytes = fs.readFileSync('public/assets/raptor-v2/' + key);
      const record = inventory.frames[key];
      assert.equal(bytes.readUInt32BE(16), 512);
      assert.equal(bytes.readUInt32BE(20), 512);
      assert.equal(createHash('sha256').update(bytes).digest('hex'), record.sha256);
      assert.deepEqual(record, registration[key]);
      assert.equal(record.phase, phases[frame]);
      assert.equal(record.anchor[1], 449);
      if (direction === 'front') {
        assert.equal(record.supportFoot[0] > record.pelvis[0], frame < 2, 'front support alternates by anatomical side');
      }
      assert.ok(record.muzzle[1] < record.muzzleGround[1]);
    }
    // Center the shot so a pellet cannot leave the arena during its first tick.
    Object.assign(actor, {x: 800, y: 420});
    const shells = actor.shells;
    tick(true);
    assert.equal(actor.shells, shells - 1, 'moving fire is immediate');
    assert.equal(actor.raptorFrame.family, family, 'fire keeps the moving gait');
    const socket = barrelSocket27d(actor, game.config.spriteScale);
    const flash = game.fx.findLast(effect => effect.type === 'muzzle' && effect.owner === 0);
    assert.ok(socket.raptorAligned);
    assert.deepEqual([flash.x, flash.y, flash.z], [socket.x, socket.y, socket.z]);
    const pellet = game.shots.findLast(shot => shot.owner === 0);
    assert.ok(pellet, 'moving shot spawns pellets');
    assert.ok(Math.hypot(pellet.x - pellet.vx * pellet.realAge - socket.x,
      pellet.y - pellet.vy * pellet.realAge - socket.y) < 1e-6, 'pellets originate at the painted muzzle');
    console.log('PASS', direction, family, 'all four phases and immediate registered moving fire');
  }
}
