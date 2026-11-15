const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, file) => module._compile(
  ts.transpileModule(fs.readFileSync(file,'utf8'),{
    compilerOptions:{module:1,target:9,esModuleInterop:true}
  }).outputText,file);

const {newGame,advance,setInput,startReadabilityDrill,updateConfig,joinGame,safeState,requestRematch}=require('../lib/game.ts');
function frame(s,slot,input={},count=1){
 for(let i=0;i<count;i++){
  setInput(s,slot,s.players[slot].lastSeq+1,input);
  advance(s,s.lastAt+1000/60);
 }
}
for(const character of ['jade','raptor']){
 for(const [drill,expected] of [['cover','cover'],['shield','shield'],['open','hit']]){
  const s=newGame('Player','token',0,'practice');
  s.players[0].character=character;
  startReadabilityDrill(s,drill);
  s.phase='playing';
  const target=s.players[1],hp=target.hp;
  frame(s,0,{aim:0},22);
  frame(s,0,{aim:0,fire:true});
  frame(s,0,{aim:0},13);
  assert.ok(s.events.some(e=>e.kind===expected&&e.owner===0),character+' '+drill+JSON.stringify(s.events));
  assert.equal(target.hp<hp,expected==='hit');
  assert.equal(s.fx.filter(f=>f.type==='shot-result-'+expected&&f.owner===0).length,1);
 }
 console.log('PASS',character,'same-lane cover, shield and clean hit');
}
const arsenal=newGame("Jade","token",0,"practice");
arsenal.phase="playing";
arsenal.covers=[];
arsenal.matter=[];
arsenal.rules31={battery:"unlimited",opponent:"target"};
const [builder,defender]=arsenal.players;
Object.assign(builder,{x:820,y:540,aim:0,gunFacing:0});
Object.assign(defender,{x:1450,y:760,bot:false});
for(let slot=1;slot<=4;slot++){
 Object.assign(builder,{y:400+slot*95});
 frame(arsenal,0,{aim:0,cover:true});
 assert.equal(builder.arsenal37?.kind,"assemble");
 assert.equal(arsenal.covers.length,slot-1);
 frame(arsenal,0,{aim:0},22);
 const item=arsenal.covers.find(c=>c.id===builder.gripCoverId);
 assert.equal(item?.arsenalSlot37,slot);
 frame(arsenal,0,{aim:0,cover:true});
 frame(arsenal,0,{aim:0},18);
 assert.equal(builder.gripCoverId,null);
}
Object.assign(builder,{x:720,y:450});
frame(arsenal,0,{aim:0},16);
const selected=arsenal.covers.find(c=>c.arsenalSlot37===builder.recallNext37);
assert.ok(selected&&builder.recallGoal37);
frame(arsenal,0,{aim:0,cover:true});
assert.equal(builder.arsenal37?.object.id,selected.id);
let inTransit=false;
for(let i=0;i<120&&!builder.gripCoverId;i++){
 frame(arsenal,0,{aim:0});
 if(builder.arsenal37?.phase==="transit"){
  inTransit=true;
  assert.equal(arsenal.covers.some(c=>c.id===selected.id),false);
 }
}
assert.ok(inTransit);
assert.equal(builder.gripCoverId,selected.id);
assert.equal(arsenal.covers.find(c=>c.id===selected.id)?.arsenalSlot37,selected.arsenalSlot37);
assert.equal(arsenal.covers.filter(c=>c.constructOwner===0).length,4);
console.log("PASS four real assemblies, placement, recall destination, non-solid transit and same-piece reconstitution");
const {COMBAT_SURFACES}=require('../lib/arenaStructures27e.ts');
const {surfaceShotTime}=require('../lib/verticalCombat27b.ts');
const ramp=COMBAT_SURFACES.find(s=>s.rise);
assert.ok(ramp);
const cx=ramp.polygon.reduce((sum,p)=>sum+p.x,0)/4,cy=ramp.polygon.reduce((sum,p)=>sum+p.y,0)/4;
assert.ok(Number.isFinite(surfaceShotTime({x:cx,y:cy,z:140},{x:cx,y:cy,z:5})));
assert.equal(surfaceShotTime({x:cx,y:cy-30,z:170},{x:cx,y:cy+30,z:170}),Infinity);
console.log("PASS elevated surface blocks a ray through the ramp and clears a ray above it");

for(const mode of ['bot','duel']){
 const s=newGame("Jade","one",0,mode);
 if(mode==="duel")joinGame(s,"Raptor","two");
 s.phase="playing";s.covers=[];
 const [p,q]=s.players;
 Object.assign(p,{x:830,y:430,aim:0,gunFacing:0,character:"jade"});
 Object.assign(q,{x:930,y:430,hp:1,bot:false,character:"raptor"});
 frame(s,0,{aim:0,fire:true});
 frame(s,0,{aim:0},140);
 assert.equal(s.phase,"finished");
 assert.equal(safeState(s).roundSummary[1].damageTaken.shotgun,1);
 assert.equal(s.winner,0);
 const round=s.round;
 requestRematch(s,0,round-1);
 assert.equal(s.players[0].rematch,false);
 requestRematch(s,0,round);
 if(mode==="duel"){
  assert.equal(s.phase,"finished");
  assert.equal(safeState(s).players[0].rematch,true);
  requestRematch(s,1,round);
 }
 assert.equal(s.phase,"countdown");
 assert.equal(s.round,round+1);
 assert.equal(s.players[1].character,"raptor");
 assert.equal(s.players[1].hp,s.config.maxHealth);
 assert.equal(s.roundSummary.length,0);
 assert.ok(s.players.every(p=>!p.rematch));
}
console.log("PASS confirmed round result, stale-request rejection, bot and two-player rematch");
