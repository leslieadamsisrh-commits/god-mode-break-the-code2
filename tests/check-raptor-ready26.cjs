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
const {advanceRaptorPose, RAPTOR_POSE_DIRECTIONS} = require('../lib/raptorPose.ts');
const {barrelSocket27d} = require('../lib/ballistics27d.ts');
const manifest = require('../public/assets/raptor-v2/manifest.json');
const registration = require('../docs/raptor-fluidity/batch26-registration.json');
for (const [index, direction] of RAPTOR_POSE_DIRECTIONS.entries()) {
  const angle = index * Math.PI / 4;
  const game = newGame('Raptor', 'local', 0, 'bot');
  game.phase = 'playing';
  game.covers = [];
  game.matter = [];
  const [actor, opponent] = game.players;
  Object.assign(actor, {character:'raptor', x:795, y:430, aim:angle, gunFacing:angle});
  Object.assign(opponent, {bot:false, x:1350, y:695});
  const tick = (input={}) => {
    setInput(game, 0, actor.lastSeq + 1, {aim:angle, ...input});
    advance(game, game.lastAt + 1000/60);
  };
  for(let i=0;i<20;i++) tick();
  const idleKey = 'idle/' + direction + '/000.png';
  const readyKey = manifest.movementDirections.includes(direction)
    ? 'movement/' + direction + '/000.png' : idleKey;
  assert.equal(actor.raptorFrame.key, readyKey);
  const shells = actor.shells;
  tick({fire:true});
  assert.equal(actor.shells, shells-1);
  assert.equal(actor.raptorFrame.key, readyKey);
  const flash = game.fx.findLast(effect => effect.type==='muzzle' && effect.owner===0);
  const socket = barrelSocket27d(actor, game.config.spriteScale);
  assert.ok(socket.raptorAligned);
  assert.deepEqual([flash.x,flash.y,flash.z], [socket.x,socket.y,socket.z]);
  const interrupted = advanceRaptorPose(undefined, {time:1, angle, speed:0, sliding:false,
    airborne:false, verticalVelocity:0, attached:false, hit:true, firing:false});
  assert.equal(interrupted.frame.key,idleKey);
  for(const key of new Set([idleKey,readyKey])) {
    const record = manifest.frames[key];
    const image = fs.readFileSync('public/assets/raptor-v2/'+key);
    assert.equal(image.readUInt32BE(16),512);
    assert.equal(image.readUInt32BE(20),512);
    assert.equal(image.readUInt8(25),6);
    assert.deepEqual(record,registration[key]);
    assert.equal(createHash('sha256').update(image).digest('hex'),record.sha256);
    const height = (record.anchor[1]-record.crownY)*.82*.26*record.drawScale;
    assert.ok(Math.abs(height/70.11-1.10)<.01, direction+' registered stature');
  }
  console.log('PASS',direction,'ready, stationary shot socket and interruption fallback');
}
