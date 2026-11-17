const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");

require.extensions[".ts"] = (module, file) => module._compile(
  ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: 1, target: 9, esModuleInterop: true },
  }).outputText, file);

const { newGame, advance, setInput, startReadabilityDrill } = require("../lib/game.ts");
const { shotgunKick } = require("../lib/shotgunPresentation.ts");

function tick(state, input = {}, count = 1) {
  for (let i = 0; i < count; i++) {
    setInput(state, 0, state.players[0].lastSeq + 1, input);
    advance(state, state.lastAt + 1000 / 60);
  }
}

for (const character of ["jade", "raptor"]) {
  const state = newGame("Shooter", "test", 0, "practice");
  state.players[0].character = character;
  startReadabilityDrill(state, "open");
  const [shooter, target] = state.players;
  state.phase = "playing";
  const health = target.hp;
  const shells = shooter.shells;
  tick(state, { aim: 0 }, 22);
  tick(state, { aim: 0, fire: true });
  assert.equal(shooter.shells, shells - 1);
  const flash = state.fx.find(f => f.type === "muzzle");
  const smoke = state.fx.find(f => f.type === "shotgun-smoke");
  assert.ok(flash && smoke);
  assert.equal(flash.blastId, smoke.blastId);
  const at = f => [f.x, f.y, f.z];
  const muzzle = at(flash);
  assert.deepEqual(at(smoke), muzzle);
  assert.ok(state.shots.every(shot => shot.volleyId === flash.blastId));
  tick(state, { x: -1, aim: 0, slide: true }, 14);
  assert.equal(shooter.shells, shells - 1);
  assert.ok(!state.fx.some(f => f.type === "muzzle"));
  assert.deepEqual(at(state.fx.find(f => f.type === "shotgun-smoke")), muzzle);
  const hits = state.events.filter(e => e.attackId === flash.blastId && e.target === 1 && e.kind === "hit");
  assert.ok(hits.length > 1);
  const markers = state.fx.filter(f => f.type === "shot-result-hit" && f.blastId === flash.blastId);
  assert.equal(markers.length, 1);
  assert.equal(markers[0].strength, hits.reduce((sum, hit) => sum + hit.damage, 0));
  assert.ok(Math.abs(markers[0].strength - (health - target.hp)) < 1e-8);
  console.log("PASS", character, "confirmed discharge, stationary smoke, and exact grouped damage");
}

{
 const state = newGame("Shooter", "test", 0, "practice");
 const [shooter, target] = state.players;
 state.phase = "playing";
 state.covers = [{ id:"stone", x:895, y:523, w:14, h:16, a:0, hp:500, maxHp:500, build:0, variant:0,
  height27j:100, coverClass:"waist", artId:"d33-center-nw" }];
 Object.assign(shooter, { x:820, y:514, gunFacing:0, aim:0 });
 Object.assign(target, { x:940, y:514, bot:false });
 tick(state, { aim:0, fire:true });
 tick(state, { aim:0 }, 13);
 const blast = state.events.find(e=>e.kind==="hit")?.attackId;
 assert.ok(blast,"the exposed part of the target took damage");
 const results = state.fx.filter(f=>f.blastId===blast);
 assert.equal(results.filter(f=>f.type==="shot-result-hit").length,1);
 const cover=results.find(f=>f.type==="shot-result-cover");
 assert.equal(cover?.surfaceMaterial,"stone");
 assert.equal(state.roundSummary[1].damageTaken.shotgun,results.find(f=>f.type==="shot-result-hit").strength);
 console.log("PASS mixed cover and fighter outcomes remain distinct");
}

assert.equal(shotgunKick(0,false),0);
assert.ok(shotgunKick(.036,false)>.95);
assert.ok(shotgunKick(.21,true)>shotgunKick(.21,false));
assert.equal(shotgunKick(.26,true),0);
