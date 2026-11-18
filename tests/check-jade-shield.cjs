const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");
require.extensions[".ts"] = (module, file) => module._compile(
  ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: 1, target: 9, esModuleInterop: true },
  }).outputText, file);
const { newGame, advance, setInput } = require("../lib/game.ts");
const { JADE_PLATE_HP, jadeShieldContact } = require("../lib/jadeShield.ts");

for (const mode of ["practice", "bot"]) {
  const s = newGame("Jade", "shield-test", 0, mode);
  s.phase = "playing";
  s.covers = [];
  s.matter = [];
  const p = s.players[0], q = s.players[1];
  q.bot = false;
  Object.assign(p, {x: 930, y: 520, battery: 100});
  Object.assign(q, {x: 1040, y: 520, battery: 100});
  let seq = 0;
  const guard = {shield:true, coverAim:true, aim:0, coverAimActive:true};
  const tick = (count, input={}) => {
    for (let i=0;i<count;i++) {
      setInput(s,0,++seq,input);
      advance(s,s.lastAt + 1000/60);
    }
  };
  const shot = (id,damage,y=p.y-8,input=guard,height=30) => {
    s.events = [];
    s.shots.push({id,attackId:id,source:"shotgun",owner:1,x:p.x+105,y,z:p.z+height,vx:-2200,vy:0,vz:0,life:.22,damage});
    tick(4,input);
    return s.events.find(e=>e.attackId===id);
  };

  tick(13,guard);
  const hp = p.hp;
  const first = shot("light",10);
  assert.equal(first.kind,"shield");
  assert.equal(first.contactId,"jade-shield");
  assert.ok(Math.abs(first.x-(p.x+(34-.012*8*Math.abs(3-8/s.config.spriteScale))*s.config.spriteScale))<.2,"contact is on the projected plate, ahead of body");
  assert.equal(p.jadeShield.plates[1],JADE_PLATE_HP-10);
  assert.equal(p.hp,hp);
  tick(2);
  tick(13,guard);
  assert.deepEqual(p.jadeShield.plates,[44,34,44],"release and redeploy preserve damage");
  assert.equal(shot("center-break",36).kind,"shield");
  assert.deepEqual(p.jadeShield.plates,[44,0,44]);
  assert.equal(shot("open-gap",3).kind,"hit");
  assert.ok(p.hp<hp,"missing middle plate opens a shooting lane");
  tick(25,{...guard,aim:.48});
  assert.equal(shot("rotate-and-block",60,p.y-8,{...guard,aim:.48}).kind,"shield");
  assert.equal(p.jadeShield.plates.filter(x=>x>0).length,1);
  const last = 0;
  tick(20,{...guard,aim:last});
  const beforeBreak=p.hp;
  assert.equal(shot("final-block",45,p.y,{...guard,aim:last},50).kind,"shield");
  assert.equal(p.hp,beforeBreak,"final contact was absorbed");
  assert.equal(p.shield,false);
  assert.equal(shot("after-break",4).kind,"hit");

  tick(40);
  tick(30,{powerup:true});
  assert.ok(p.jadeShield.chargeProgress>0&&p.jadeShield.chargeProgress<1);
  tick(4,{fire:true});
  assert.deepEqual(p.jadeShield.plates,[0,0,0],"interrupted charge cannot repair");
  tick(140,guard);
  assert.equal(p.shield,false,"waiting with LT cannot recharge a broken guard");
  tick(1);
  tick(190,{powerup:true,shield:true,coverAim:true});
  assert.deepEqual(p.jadeShield.plates,[44,44,44]);
  assert.equal(p.shield,false);
  tick(10,guard);
  assert.equal(p.shield,false,"LT held through full charge does not redeploy");
  tick(1);
  tick(13,guard);
  assert.equal(p.shield,true);
  const angle=p.jadeShield.angle;
  tick(12,{...guard,aim:1.8,coverAimActive:false});
  assert.equal(p.jadeShield.angle,angle,"neutral stick preserves last direction");
  assert.equal(jadeShieldContact({x:p.x-90,y:p.y,z:38},{x:p.x,y:p.y,z:38},p,s.config.spriteScale,s.time),null,"rear shot bypasses the plate");
  tick(2,{aim:0});
  const shells=p.shells;
  tick(4,{aim:0,fire:true});
  assert.equal(p.shells,shells-1,"shield release returns to existing RT");
  console.log(mode+" passed: chip, gap, turn, final block, hold-Y lockout, fresh LT, RT");
}
