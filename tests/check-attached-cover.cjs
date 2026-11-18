const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");

require.extensions[".ts"] = (module, file) => module._compile(
  ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: 1, target: 9, esModuleInterop: true },
  }).outputText, file);

const { newGame, setInput, advance } = require("../lib/game.ts");
const { barrelSocket27d } = require("../lib/ballistics27d.ts");

function setup(character, rotation = 0, face = 1, fraction = .5, height = 100) {
  const s = newGame(character, "test", 0, "practice");
  s.phase = "playing";
  s.matter = [];
  s.players[1].bot = false;
  const wall = { id: "test-wall", x: 930, y: 520, a: rotation, z: 0, w: 160, h: 20,
    hp: 280, maxHp: 280, build: 0, variant: 0, generated: true,
    coverClass: height > 48 ? "tall" : "waist", height27j: height };
  s.covers = [wall];
  const x = Math.cos(rotation), y = Math.sin(rotation);
  const tangent = { x: x * face, y: y * face };
  const normal = { x: y * face, y: -x * face };
  const t = wall.w * fraction;
  const p = s.players[0];
  Object.assign(p, {
    character, x: wall.x + tangent.x * (t - wall.w / 2) + normal.x * 28.5,
    y: wall.y + tangent.y * (t - wall.w / 2) + normal.y * 28.5,
    coverId: wall.id, coverMode: "braced", contact: 0,
    coverAnchor: { t, length: wall.w, half: wall.w / 2, offset: (t - wall.w / 2) * face,
      face: face > 0 ? "top" : "bottom", edge: face > 0 ? 0 : 2,
      nx: normal.x, ny: normal.y, tx: tangent.x, ty: tangent.y },
  });
  function tick(input = {}, count = 1, ready) {
    for (let i = 0; i < count; i++) {
      setInput(s, 0, p.lastSeq + 1, { coverAimActive: false, ...input });
      advance(s, s.lastAt + 1000 / 60, ready);
    }
  }
  return { s, p, wall, tangent, normal, tick };
}

function assertMuzzle(s, p) {
  const socket = barrelSocket27d(p, s.config.spriteScale);
  const muzzle = s.fx.findLast(fx => fx.type === "muzzle" && fx.owner === 0);
  assert.ok(muzzle);
  for (const axis of ["x", "y", "z"]) assert.ok(Math.abs(muzzle[axis] - socket[axis]) < 1e-7);
}

for (const character of ["jade", "raptor"]) {
  for (const sign of [-1, 1]) {
    const { s, p, wall, tick } = setup(character);
    const aim = sign < 0 ? Math.PI : 0;
    tick({ x: -sign }, 4);
    assert.equal(p.coverState11, "shuffle");
    const before = p.x;
    tick({ x: -sign, aim, coverAimActive: true, fire: true }, 1, () => false);
    assert.equal(p.shells, 8, "unloaded firing cel cannot spend a shell");
    tick({ x: -sign, aim, coverAimActive: true, fire: true });
    assert.equal(p.shells, 7);
    assert.equal(p.coverId, wall.id);
    assert.equal(p.attachedCoverPose, character + (sign < 0 ? "-left" : "-right"));
    assert.ok((p.x - before) * sign < 0);
    assertMuzzle(s, p);
    tick({ x: sign, aim, coverAimActive: true });
    assert.equal(p.peek, true);
    assert.equal(p.coverId, wall.id);
    assert.ok(Math.sign(p.coverSpeed) === sign);
    assert.equal(p.gunFacing, aim);
    tick({ x: sign });
    assert.equal(p.coverState11, "shuffle");
    assert.equal(p.attachedCoverPose, undefined);
  }

  for (const [mode, input] of [
    ["neutral", {}], ["diagonal", { x: .6, y: -.8 }], ["along wall", { x: 1 }],
    ["corner", { y: 1 }], ["blocked corner", { y: 1 }],
  ]) {
    const { s, p, wall, tick } = setup(character, 0, 1, mode.includes("corner") ? 1 : .5);
    if (mode === "blocked corner") s.covers.push({ ...wall, id: "blocker", x: 1050, w: 20, h: 140 });
    const old = { x: p.x, y: p.y };
    p.returnToCover = .17;
    p.recoil = .12;
    tick({ ...input, slide: true, coverAim: true });
    assert.equal(p.coverId, null);
    assert.equal(!!p.exit, mode === "corner");
    tick({ ...input, slide: true, coverAim: true }, 13);
    assert.equal(p.coverId, null, "holding A does not reattach");
    assert.equal(s.actions.filter(a => a.action === "cover-exit").length, 1);
    if (mode === "neutral" || mode === "blocked corner") assert.ok(p.y < old.y);
    if (mode === "diagonal") assert.ok(p.y < old.y && p.x > old.x);
    if (mode === "along wall") assert.ok(Math.abs(p.y - old.y) < .01 && p.x > old.x);
    if (mode === "corner") assert.ok(p.y > old.y && p.x > old.x);
  }

  for (const rotation of [0, Math.PI / 12]) for (const face of [-1, 1]) for (const end of [0, 1]) {
    const { p, tick, normal, tangent } = setup(character, rotation, face, end);
    const side = end === 0 ? -1 : 1;
    const aim = Math.atan2(tangent.y * side, tangent.x * side);
    const original = [p.x, p.y];
    tick({ aim, coverAim: true, coverAimActive: true, fire: true });
    assert.equal(p.shells, 7, [character, rotation, face, end].join(" "));
    assert.deepEqual([p.x, p.y], original);
    tick({ aim: Math.atan2(-normal.y, -normal.x), coverAimActive: true });
    assert.equal(p.peek, false);
  }
  // The controller's explicit aim state uses the planted wrap socket.
  for (const rotation of [0, Math.PI / 12, Math.PI / 2]) for (const face of [-1, 1]) for (const end of [0, 1]) {
    const aimAt = ({ normal, tangent }, degrees) => {
      const a = degrees * Math.PI / 180, side = end === 0 ? -1 : 1;
      return Math.atan2(tangent.y * side * Math.cos(a) + normal.y * Math.sin(a),
        tangent.x * side * Math.cos(a) + normal.x * Math.sin(a));
    };
    for (const degrees of [-55, -35, 0, 35, 90]) {
      const env = setup(character, rotation, face, end);
      const { s, p, tick, wall } = env, origin = [p.x, p.y];
      const aim = aimAt(env, degrees);
      wall.constructOwner = 0; // An already solid generated panel uses the same sweep.
      tick({ aim, coverAim: true, coverAimActive: true, fire: true });
      assert.equal(p.shells, 7, `${character} ${rotation} ${face} ${end} ${degrees}`);
      assert.deepEqual([p.x, p.y], origin);
      assert.equal(p.coverId, wall.id);
      assertMuzzle(s, p);
      const error = Math.atan2(Math.sin(p.gunFacing - aim), Math.cos(p.gunFacing - aim));
      assert.ok(Math.abs(error) < 1e-7);
    }
    const env = setup(character, rotation, face, end);
    const { s, p, tick } = env;
    const wrap = { coverAim: true, coverAimActive: true, fire: true };
    tick({ ...wrap, aim: aimAt(env, -56) });
    assert.equal(p.shells, 8);
    assert.equal(s.events.findLast(e => e.kind === "muzzle")?.reason, "wrap-limit");
    tick({ ...wrap, aim: aimAt(env, -54) }, 14);
    assert.equal(p.shells, 8, "a held refused input cannot discharge when aim returns to the arc");
    tick({ ...wrap, fire: false, aim: aimAt(env, -54) });
    tick({ ...wrap, aim: aimAt(env, -54) });
    assertMuzzle(s, p);
    assert.equal(p.shells, 7);
  }
  const { p, tick } = setup(character, 0, 1, .5, 48);
  tick({ aim: 0, coverAim: true, fire: true });
  assert.equal(p.shells, 7);
  console.log("PASS", character, "opposite-direction attached fire, barrel match, exits, both tall faces, and waist fire");
}

{
 const {s,p,tick}=setup("raptor",0,1,1);
 tick({aim:0,coverAim:true,fire:true},1,key=>!key.startsWith("cover-recoil/"));
 assert.equal(p.shells,7,"a cold recoil cel must not block a loaded aim frame");
 assertMuzzle(s,p);
}
for (const fighter of ["jade", "raptor"]) {
 const {s,p,wall,tick}=setup(fighter);
 s.covers.push({...wall,id:"next-wall",y:392});
 tick({y:-1,slide:true},14);
 assert.equal(p.coverId,null);
 tick({y:-1});
 tick({y:-1,slide:true},12);
 assert.equal(p.coverId,"next-wall");
}

for(const character of ["jade", "raptor"]){
 const {s,p,wall,tick}=setup(character,0,1,1);
 s.covers.push({...wall,id:"near-obstruction",x:p.x+16,y:p.y,w:4,h:12});
 tick({aim:0,coverAim:true,coverAimActive:true,fire:true});
 assert.equal(p.shells,8);
 assert.ok(p.wrapAim.blocked);
 assert.equal(s.events.findLast(e=>e.kind==="muzzle").x,p.wrapAim.blocked.x);
}

// A shoulder-level obstruction and a distant impact have different outcomes.
const { wrapRig } = require("../lib/plantedWrap.ts");
for (const character of ["jade", "raptor"]) {
  const env = setup(character, 0, 1, 1);
  const { s, p, wall, tick } = env;
  tick({ aim: 0, coverAim: true, coverAimActive: true });
  const rig = wrapRig(p, p.wrapAim, s.config.spriteScale);
  const target = { ...wall, id: "downrange", x: rig.socket.x + 48, y: rig.socket.y, w: 8, h: 54 };
  s.covers.push(target);
  tick({ aim: 0, coverAim: true, coverAimActive: true, fire: true });
  assert.equal(p.shells, 7);
  assert.equal(p.wrapShotTrace.result, "FIRED");
  assertMuzzle(s, p);
  tick({ aim: 0, coverAimActive: true });
  assert.equal(p.coverState11, "retract", "LT release retracts even with the stick held");
  tick({}, 20);
  assert.equal(p.coverState11, "brace");
  assert.ok(target.hp < target.maxHp);
  assert.ok(s.events.some(e => e.kind === "cover" && e.contactId === target.id));

  const center = setup(character);
  center.tick({ aim: Math.PI / 2, coverAim: true, coverAimActive: true, fire: true });
  assert.equal(center.p.shells, 8);
  assert.equal(center.p.wrapShotTrace.result, "CENTER TUCK");
  assert.equal(center.s.events.findLast(e => e.kind === "muzzle").reason, "center-tuck");
}

for (const character of ["jade", "raptor"]) {
  const { s, p, wall, tick } = setup(character, 0, 1, 1);
  const wrap = { aim: -.3, coverAim: true, coverAimActive: true };
  tick({ ...wrap, fire: true });
  assert.equal(p.shells, 7);
  assert.ok(p.recoil > 0);
  tick({ ...wrap, x: .6, y: .8, slide: true });
  assert.equal(p.coverId, null);
  assert.equal(p.exit?.coverId, wall.id);

  const retreat = setup(character, 0, 1, .95);
  const { s: round, p: fighter, wall: protection } = retreat;
  const opponent = round.players[1], hp = fighter.hp;
  Object.assign(opponent, { x: fighter.x - 15, y: protection.y + 90, gunFacing: -Math.PI / 2 });
  retreat.tick(wrap);
  setInput(round, 1, opponent.lastSeq + 1, { aim: -Math.PI / 2, fire: true });
  retreat.tick({}, 16);
  assert.equal(fighter.hp, hp);
  assert.ok(round.events.some(e => e.owner === 1 && e.kind === "cover" && e.contactId === protection.id));
}

for (const rotation of [0, Math.PI/12]) for (const face of [-1, 1]) {
  const {s,p,tick,normal,wall}=setup("jade",rotation,face,.5,45);
  const aim=Math.atan2(-normal.y,-normal.x);
  const input={aim,coverAim:true,coverAimActive:true};
  tick({...input,fire:true});
  assert.equal(p.shells,8,"rising barrel cannot fire through the lip");
  assert.equal(p.fireBlocked,true);
  tick({...input,fire:true},12);
  assert.equal(p.shells,8,"refused input does not fire as the barrel clears");
  assert.equal(p.jadeLowAim.rise,1);
  assert.ok(barrelSocket27d(p,s.config.spriteScale).z>wall.height27j);
  tick(input);
  tick({...input,fire:true});
  assert.equal(p.shells,7,"a fresh press fires above the actual lip");
  assertMuzzle(s,p);
  tick({});
  assert.ok(p.jadeLowAim.rise<1,"release starts the authored sink");
  tick({slide:true,x:normal.x,y:normal.y});
  assert.equal(p.coverId,null,"first directional exit wins during sink");
  assert.equal(p.jadeLowAim,undefined);
}
console.log("PASS Jade waist rise, held refusals, actual clearance, registered discharge and exit during sink");
