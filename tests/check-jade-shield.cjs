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
  assert.ok(Math.abs(first.x-(p.x+34*s.config.spriteScale))<.2,"contact is on the projected plate, ahead of body");
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
  assert.equal(shot("final-block",45,p.y,{...guard,aim:last},20).kind,"shield");
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

// Sweep incoming rays over the rendered atlas, including interior holes and
// partially deployed plates. Keep the expected pixel lookup independent.
const rims=require("../public/assets/jade-floating32/contact.json");
const {jadePlateFrame,newJadeShield,jadePlatePivot}=require("../lib/jadeShield.ts");
const {arenaJacobian46,ARENA_UPRIGHT_SCALE47}=require("../lib/bayBridgePresentation.ts");
const actor={x:930,y:520,z:24,jadeShield:newJadeShield(0)};
const shield=actor.jadeShield;
shield.active=true;
shield.openedAt=0;
const j=arenaJacobian46(actor.x,actor.y),unit=1.536*ARENA_UPRIGHT_SCALE47;
let samples=0;
for(let heading=0;heading<32;heading++){
 shield.angle=Math.PI/2-heading*Math.PI/16;
 const c=Math.cos(shield.angle),s=Math.sin(shield.angle);
 for(const time of [.075,1]){
  for(const mask of [7,5]){
   shield.plates=[0,1,2].map(i=>(mask>>i)&1?44:0);
   for(const lateral of [-10.17,.23,10.19])for(let height=12.23;height<76;height+=.47){
    const point=d=>({x:actor.x+c*d-s*lateral,y:actor.y+s*d+c*lateral,z:actor.z+height});
    let best=null;
    for(let index=0;index<3;index++){
     if(!shield.plates[index])continue;
     const f=jadePlateFrame(actor,1,time,index);
     const distance=(f.center.x-actor.x)*c+(f.center.y-actor.y)*s;
     const ray=point(distance),x=ray.x-f.center.x,y=ray.y-f.center.y;
     const col=Math.floor(40+(x*j.x+y*j.xy)/(unit*f.size));
     const row=Math.floor(64+(y*j.y/unit-ray.z+f.center.z)/f.size);
     const spans=rims[index][heading][row]||"";
     for(let k=0;k<spans.length;k+=2)if(col>=spans.charCodeAt(k)-33&&col<spans.charCodeAt(k+1)-33&&(!best||distance>=best.distance))best={index,distance};
    }
    const contact=jadeShieldContact(point(100),point(0),actor,1,time);
    assert.equal(contact?.index,best?.index,"rendered rim at heading "+heading);
    samples++;
   }
  }
 }
 for(let i=0;i<3;i++){
  const pivot=jadePlatePivot(i,heading),runs=rims[i][heading][Math.floor(pivot.y+64)];
  assert.ok(Array.from({length:runs.length/2},(_,k)=>pivot.x+40>=runs.charCodeAt(2*k)-33&&pivot.x+40<runs.charCodeAt(2*k+1)-33).some(Boolean));
 }
}
console.log("PASS",samples,"shield probes across 32 headings, intact and middle missing");
