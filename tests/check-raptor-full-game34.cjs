const fs = require('node:fs');
const assert = require('node:assert/strict');
const ts = require('typescript');
require.extensions['.ts'] = (module, path) => module._compile(
  ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: {module: 1, target: 9, esModuleInterop: true}
  }).outputText, path);

const {LocalCombat} = require('../lib/localCombat.ts');
const {raptorCoverLane} = require('../lib/game.ts');
const {barrelSocket27d} = require('../lib/ballistics27d.ts');
const {SHAPES27J} = require('../lib/psychicMatter27j.ts');

function match(angle, side, shape, shotReady) {
  const engine = new LocalCombat('Raptor', 'bot', 0, undefined, 'raptor', shotReady);
  const s = engine.state;
  const [p, bot] = s.players;
  const wall = {id:'test-wall', x:950, y:550, a:angle, z:0, hp:180, maxHp:180, build:0,
    variant:0, generated:true, artId:'war-generated-shell45', constructOwner:0, ...shape};
  s.covers = [wall];
  s.phase = 'playing';
  s.countdown = 0;
  Object.assign(bot, {bot:false, x:1260, y:680});
  const tx = Math.cos(angle), ty = Math.sin(angle), nx = -ty*side, ny = tx*side;
  const into = Math.atan2(-ny, -nx);
  Object.assign(p, {x:wall.x+nx*72, y:wall.y+ny*72, aim:into, gunFacing:into});
  let now = 0;
  const trace = new Set();
  function tick(input = {}, count = 1) {
    for (let i = 0; i < count; i++) {
      engine.frame(now, {aim:into, ...input}, []);
      now += 1000/60;
      trace.add(p.raptorFrame.key);
    }
  }
  tick();
  tick({x:-nx,y:-ny,slide:true});
  tick({x:-nx,y:-ny},2);
  tick({x:-nx,y:-ny,slide:true},2);
  tick({},15);
  assert.equal(p.coverId,wall.id);
  assert.equal(p.coverMode,'soft');
  assert.ok([...trace].some(key => key.startsWith('slide/')));
  tick({slide:true});
  tick({},16);
  assert.equal(p.coverMode,'braced');
  return {s,p,bot,wall,trace,tick,tx,ty,nx,ny,into};
}

for (const angle of [0,Math.PI/12,Math.PI/2]) for (const side of [-1,1]) for (const end of [-1,1]) {
  let ready = false;
  let requested;
  const {s,p,wall,trace,tick,tx,ty,nx,ny,into} = match(angle,side,SHAPES27J[1],key => {
    requested = key;
    return ready;
  });
  if(angle===0&&side===1){
    assert.ok(trace.has('cover-catch/back/000.png'),'Straight rear Tall Slab reaches impact');
    assert.ok(trace.has('cover-catch/back/001.png'),'Straight rear Tall Slab reaches compression');
    assert.ok(trace.has('cover-hold/back/001.png'),'Compression reaches registered rear brace connector');
  }
  const shells = p.shells;
  tick({aim:into,fire:true,coverAim:true},3);
  assert.equal(p.shells,shells,'Tall center preserves the shell');
  assert.equal(requested,undefined,'Blocked center never requests a firing sprite');
  tick({},2);
  tick({x:tx*end,y:ty*end},20);
  tick({},3);
  const tuck = p.raptorFrame.key;
  if (angle < Math.PI/2) assert.match(tuck,/^cover-wrap\/(left|right)\/000/);
  const planted = [p.x,p.y,p.coverAnchor.t];
  const aim = Math.atan2(ty*end,tx*end);
  tick({aim,coverAim:true},9);
  assert.ok(raptorCoverLane(p,wall,s.config.spriteScale),'Clear edge on actual Tall Slab');
  if (angle < Math.PI/2) assert.ok(trace.has(tuck.replace('000.png','001.png')),'Pivot is selected');
  tick({aim,coverAim:true,fire:true});
  assert.ok(requested);
  assert.equal(p.shells,shells,'Loading a firing pose preserves the shell');
  assert.ok(!s.fx.some(f => f.type==='muzzle' && f.owner===0));
  ready = true;
  tick({aim,coverAim:true,fire:true});
  assert.equal(p.shells,shells-1);
  assert.equal(p.raptorFrame.key,requested);
  const socket = barrelSocket27d(p,s.config.spriteScale);
  const flash = s.fx.findLast(f => f.type==='muzzle' && f.owner===0);
  assert.deepEqual([flash.x,flash.y,flash.z],[socket.x,socket.y,socket.z]);
  assert.equal(flash.raptorFrameKey,requested);
  assert.deepEqual([p.x,p.y,p.coverAnchor.t],planted);
  tick({aim},20);
  assert.equal(p.raptorFrame.key,tuck);
  tick({slide:true});
  tick({x:nx,y:ny},16);
  assert.equal(p.coverId,null,'A escapes the planted edge');
}
const low = match(Math.PI/2,1,SHAPES27J[0]);
const shells = low.p.shells;
low.tick({aim:low.into,coverAim:true},8);
low.tick({aim:low.into,fire:true});
assert.equal(low.p.shells,shells-1,'Wide Wall still permits waist-high fire');
assert.ok(!low.p.raptorFrame.key.startsWith('cover-wrap/'));
console.log('PASS actual Tall Slab and Wide Wall through local combat, 12 tall endpoint cases and exact loaded muzzle gating');
const {advanceRaptorPose}=require('../lib/raptorPose.ts');
let memory;
const left=Math.PI, diagonal=5*Math.PI/4, back=3*Math.PI/2;
const pose=(time,angle,speed,extra={})=>{
 const next=advanceRaptorPose(memory,{time,angle,travelAngle:angle,speed,sliding:false,airborne:false,verticalVelocity:0,hit:false,attached:false,firing:false,...extra});
 memory=next.memory;
 return next.frame.key;
};
assert.equal(pose(1,left,0),'movement/left/000.png');
assert.equal(pose(1.02,left,40),'movement/left/001.png');
assert.equal(pose(1.09,diagonal,45),'stalk/back-left/000.png');
assert.match(pose(1.12,diagonal,110),/^jog\/back-left\//);
assert.match(pose(1.15,diagonal,190),/^sprint\/back-left\//);
const phase=memory.gait.phase;
assert.match(pose(1.15,back,190),/^sprint\/back\//);
assert.equal(memory.gait.phase,phase);
pose(1.17,diagonal,120);
assert.equal(pose(1.19,diagonal,0),'movement/back-left/006.png');
assert.equal(pose(1.25,diagonal,0),'movement/back-left/007.png');
assert.equal(pose(1.27,diagonal,190,{sliding:true}),'slide/back-left/000.png');
assert.equal(pose(1.39,diagonal,160,{sliding:true}),'slide/back-left/001.png');
assert.equal(pose(1.45,diagonal,40,{sliding:true,slideRemaining:.04}),'slide/back-left/002.png');
assert.equal(pose(1.47,diagonal,0,{attached:true,coverState11:'catch'}),'cover-catch/back-left/000.png');
assert.equal(pose(1.70,diagonal,0,{attached:true,coverState11:'brace'}),'cover-hold/back-left/000.png');
assert.equal(pose(1.72,diagonal,40),'movement/back-left/001.png');
assert.match(pose(1.84,diagonal,45),/^stalk\/back-left\//);
memory=undefined;
const frontLeft=3*Math.PI/4;
assert.equal(pose(2,frontLeft,0),'idle/front-left/000.png');
assert.equal(pose(2.02,frontLeft,35),'movement/front-left/001.png');
assert.match(pose(2.04,frontLeft,40,{firing:true}),/^stalk\/front-left\//);
assert.match(pose(2.09,frontLeft,42),/^stalk\/front-left\//);
console.log('PASS registered left, rear-left and back movement-to-cover sequence');
