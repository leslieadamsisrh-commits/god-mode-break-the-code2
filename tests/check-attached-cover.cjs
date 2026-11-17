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
  const { p, tick } = setup(character, 0, 1, .5, 48);
  tick({ aim: 0, coverAim: true, fire: true });
  assert.equal(p.shells, 7);
  console.log("PASS", character, "opposite-direction attached fire, barrel match, exits, both tall faces, and waist fire");
}
