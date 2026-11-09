const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
 compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true }
}).outputText, file);

const { advance, newGame, setInput } = require('../lib/game.ts');
const { RAPTOR_POSE_DIRECTIONS: facings, raptorPoseDirection: facing, raptorCoverEdge } = require('../lib/raptorPose.ts');
const radians = Math.PI / 180;
const makeMatrix = () => Object.fromEntries(facings.map(direction => [direction, new Set()]));
const catches = makeMatrix(), start = makeMatrix(), end = makeMatrix(), low = makeMatrix();
let ticks = 0;

function fixture(rotation, coverClass) {
 const state = newGame('Raptor', 'cover-audit', 0, 'solo');
 state.time = 2;
 state.phase = 'playing';
 state.matter = [];
 const wall = {id:'cover-audit',x:645,y:480,z:0,w:120,h:20,a:rotation,hp:200,maxHp:200,build:0,vx:0,vy:0,
  coverClass,height27j:coverClass==='tall'?100:48};
 state.covers = [wall];
 const actor = state.players[0];
 actor.character = 'raptor';
 function tick(input) {
  setInput(state, 0, actor.lastSeq + 1, input);
  advance(state, state.lastAt + 1000 / 60);
  ticks++;
 }
 return {wall, actor, tick};
}

for (let degrees = 0; degrees < 360; degrees += 15) {
 const rotation = degrees * radians;
 for (const [edge, face] of ['top','right','bottom','left'].entries()) {
  const tangent = rotation + edge * Math.PI / 2;
  const tx = Math.cos(tangent), ty = Math.sin(tangent), nx = ty, ny = -tx;
  const length = edge % 2 ? 20 : 120, depth = edge % 2 ? 120 : 20;
  const normal = Math.atan2(-ny, -nx);
  for (let delta = -85; delta <= 85; delta += 5) {
   const {wall, actor, tick} = fixture(rotation, 'tall');
   const approach = normal + delta * radians, distance = depth / 2 + 23;
   Object.assign(actor, {
    x:wall.x+nx*distance,y:wall.y+ny*distance,vx:Math.cos(approach)*260,vy:Math.sin(approach)*260,
    slide:.42,slideFacing:approach,aim:approach,gunFacing:approach
   });
   tick({aim:approach});
   if (actor.coverId === wall.id && actor.coverState11 === 'catch') {
    const anchor = actor.coverAnchor;
    catches[facing(actor.coverEntryAngle)].add(facing(Math.atan2(-anchor.ny, -anchor.nx)));
   }
  }

  const inset = Math.min(12, length / 3);
  for (const [t, coverClass] of [[inset,'tall'],[length-inset,'tall'],[length/2,'waist']]) {
   for (let delta = 0; delta < 360; delta += 10) {
    const {wall, actor, tick} = fixture(rotation, coverClass);
    const aim = tangent + delta * radians, along = t - length / 2, distance = depth / 2 + 18.5;
    Object.assign(actor, {
     x:wall.x+tx*along+nx*distance,y:wall.y+ty*along+ny*distance,aim,gunFacing:aim,
     coverId:wall.id,coverMode:'braced',coverAnchor:{edge,t,length,half:length/2,offset:edge<2?along:-along,nx,ny,tx,ty,face}
    });
    tick({aim,coverAim:true});
    if (actor.coverState11 !== 'expose') continue;
    const aimFacing = facing(actor.gunFacing);
    if (coverClass === 'waist') {
     low[facing(normal)].add(aimFacing);
     continue;
    }
    const endpoint = raptorCoverEdge(actor.coverAnchor, actor.gunFacing);
    assert.ok(endpoint, 'tall exposure must select a reachable local endpoint');
    const towardEndpoint = facing(tangent + (endpoint === 'start' ? Math.PI : 0));
    (endpoint === 'start' ? start : end)[towardEndpoint].add(aimFacing);
   }
  }
 }
}

const groups = [catches, start, end, low];
const count = group => Object.values(group).reduce((sum, directions) => sum + directions.size, 0);
for (const direction of facings) assert.ok([...catches[direction]].some(target => target !== direction));
const turnCatches = facings.filter(direction => catches[direction].has(direction)).length;
console.log(ticks, 'authority ticks across 24 rotations and 4 wall faces');
console.log('Unique sampled pairs', {catch:count(catches),changeOfFacing:count(catches)-turnCatches,start:count(start),end:count(end),low:count(low)});
console.log('| Facing | Catch → protected face | Start endpoint → aim | End endpoint → aim | Low hold → aim |');
console.log('|---|---|---|---|---|');
for (const direction of facings) {
 console.log('| ' + [direction, ...groups.map(group => facings.filter(target => group[direction].has(target)).join(', '))].join(' | ') + ' |');
}
