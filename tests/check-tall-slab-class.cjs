const fs=require('node:fs'),assert=require('node:assert/strict'),ts=require('typescript');
require.extensions['.ts']=(module,path)=>module._compile(ts.transpileModule(fs.readFileSync(path,'utf8'),{compilerOptions:{module:1,target:9,esModuleInterop:true}}).outputText,path);
const {newGame,setInput,advance}=require('../lib/game.ts');

function construct(shape){
 const s=newGame('Cover tester','local',0,'bot'),[p,opponent]=s.players;
 s.rules31={version:1,battery:'unlimited',opponent:'target'};
 s.phase='playing';s.covers=[];
 Object.assign(p,{x:850,y:550,aim:0,gunFacing:0,coverShape:shape});
 Object.assign(opponent,{x:1400,y:700,bot:false});
 function tick(input={},count=1){
  setInput(s,0,p.lastSeq+1,{aim:0,...input});
  for(let i=0;i<count;i++)advance(s,s.lastAt+1000/60);
 }
 tick({cover:true});tick({},16);
 const c=s.covers.find(cover=>cover.id===p.gripCoverId);
 assert.ok(c);
 assert.equal(c.coverClass,shape===1?'tall':'waist');
 return {s,p,c,opponent,tick};
}
for(const [shape,side] of [[0,0],[1,0],[1,-1],[1,1],[2,0]]){
 const {s,p,c,opponent,tick}=construct(shape);
 tick({cover:true});tick({},25);
 assert.equal(p.gripCoverId,null);
 assert.equal(c.hover??0,0);
 Object.assign(p,{x:c.x-62,y:c.y+side*(c.w/2-9)});
 tick({x:1,slide:true});tick({x:1},14);
 assert.equal(p.coverMode,'soft');
 tick({slide:true});tick({},14);
 assert.equal(p.coverMode,'braced');
 const root=[p.x,p.y],blocked=shape===1&&!side,aim=side*Math.PI/2;
 if(side){
  tick({aim:-aim,coverAim:true,fire:true},3);
  assert.equal(p.shells,8,'inward aim at the end must be rejected');
  tick();
 }
 if(blocked)Object.assign(opponent,{x:c.x+95,y:p.y});
 else if(side)Object.assign(opponent,{x:p.x,y:p.y+side*100});
 tick({aim,coverAim:true},8);
 assert.equal(p.peek,!blocked);
 tick({aim,coverAim:true,fire:true});
 tick({aim,coverAim:true},12);
 assert.equal(p.shells,blocked?8:7);
 assert.deepEqual([p.x,p.y],root);
 if(blocked){
  assert.equal(s.shots.length,0);
  assert.equal(opponent.hp,s.config.maxHealth);
  assert.match(p.gripHint,/MOVE TO AN EDGE/);
 }
 if(side)assert.ok(opponent.hp<s.config.maxHealth,'a clear outward shot can hit');
 tick({aim},16);
 assert.equal(p.peek,false);
}
{
 const {p,c,tick}=construct(0);
 tick({coverShapeCycle:true});tick({},20);
 assert.equal(c.coverClass,'tall');
 assert.equal(c.height27j,80);
 assert.equal(p.gripCoverId,c.id);
}
console.log('PASS Tall Slab classification across construct, carry, place and reshape; blocked center, both outward ends, inward rejection and planted retract');
