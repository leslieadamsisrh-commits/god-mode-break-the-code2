const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, file) => module._compile(
  ts.transpileModule(fs.readFileSync(file,'utf8'),{
    compilerOptions:{module:1,target:9,esModuleInterop:true}
  }).outputText,file);

const {newGame,advance,setInput,startOrRematch,updateConfig,DEFAULT_CONFIG}=require('../lib/game.ts');
const {kineticPose}=require('../lib/kineticPose.ts');
const {movementProfile,activeMovementProfile}=require('../lib/movementPresets.ts');
const profiles=['39T35 DEFAULT','GOD MODE WEAVE','WEAVE STEERING + BRAKE'];

function run(character, profile, input){
 const s=newGame(character,'local',0,'practice');
 s.phase='playing';s.covers=[];s.matter=[];
 updateConfig(s,movementProfile(profile));
 const [p,opponent]=s.players;
 Object.assign(p,{character,x:780,y:440,aim:0,gunFacing:0});
 Object.assign(opponent,{bot:false,x:1250,y:680});
 const samples=[],poses=[];
 function tick(values){
  setInput(s,0,p.lastSeq+1,values);
  advance(s,s.lastAt+1000/60);
  const pose=kineticPose(p,s.config.dashDuration);
  samples.push([p.x,p.y,p.vx,p.vy,p.battery,p.dash,p.slide,p.brakeState]);
  poses.push(pose);
  return pose;
 }
 tick({x:1,slide:true});
 assert.equal(p.dash>0,true);
 assert.equal(poses.at(-1)?.kind,'dash');
 const origin=[780,440];
 while(p.dash>0)tick({x:1});
 const dash=+(p.x-origin[0]).toFixed(1);
 assert.ok(poses.some(pose=>pose?.kind==='dash'&&pose.frame===2));
 tick({x:1,slide:true});
 assert.ok(p.slide>0);
 assert.equal(poses.at(-1),undefined);
 const start=[p.x,p.y];
 let brake=null;
 for(let i=1;i<=15;i++){
  const pose=tick(input);
  if(p.brakeState&&!brake){
   brake={milliseconds:Math.round(i*1000/60),distance:+Math.hypot(p.x-start[0],p.y-start[1]).toFixed(1)};
   assert.equal(pose?.kind,'brake');
  }
 }
 const turn=Math.round(Math.atan2(p.vy,p.vx)*180/Math.PI);
 if(brake){
  for(let i=0;i<12;i++)tick(input);
  assert.deepEqual([...new Set(poses.filter(pose=>pose?.kind==='brake').map(pose=>pose.frame))],[0,1,2]);
 }
 assert.equal(activeMovementProfile(s.config),profile);
 startOrRematch(s,0);
 assert.equal(activeMovementProfile(s.config),profile);
 return {samples,dash,turn,brake};
}
assert.deepEqual({...DEFAULT_CONFIG,...movementProfile('39T35 DEFAULT')},DEFAULT_CONFIG);
for(const profile of profiles){
 for(const [name,input] of [['curve',{x:.707,y:.707}],['brake',{x:-1}]]){
  const jade=run('jade',profile,input);
  const raptor=run('raptor',profile,input);
  assert.deepEqual(jade,raptor,profile+' '+name+' shares exact motion');
  if(name==='brake')assert.ok(jade.brake);
  else assert.ok(jade.turn>0);
  const {dash,turn,brake}=jade;
  console.log(profile,name,{dash,turn,brake});
 }
}
const brake={brakeState:.24,brakeTurn:{from:0,to:Math.PI}};
assert.equal(kineticPose({...brake,input:{fire:true}},.16),undefined);
assert.equal(kineticPose({...brake,grounded:false},.16),undefined);
assert.equal(kineticPose({...brake,coverId:'wall'},.16),undefined);
console.log('PASS shared movement, presentation phases and profile persistence');

const {LocalCombat}=require('../lib/localCombat.ts');
const {SHAPES27J}=require('../lib/psychicMatter27j.ts');
const {barrelSocket27d}=require('../lib/ballistics27d.ts');
for(const character of ['jade','raptor']){
 for(const side of [-1,1]){
  const engine=new LocalCombat(character,'bot',0,undefined,character);
  const s=engine.state;
  s.phase='playing';s.countdown=0;s.matter=[];
  const [p,opponent]=s.players;
  Object.assign(opponent,{bot:false,x:1250,y:680});
  let time=0;
  function tick(input={},count=1){
   for(let i=0;i<count;i++){engine.frame(time,{aim:-Math.PI/2,...input},[]);time+=1000/60;}
  }
  const wall={id:'test-tall',x:950,y:550,a:0,z:0,hp:180,maxHp:180,build:0,
    variant:0,generated:true,artId:'war-generated-shell45',constructOwner:0,...SHAPES27J[1]};
  s.covers=[wall];
  Object.assign(p,{x:wall.x,y:wall.y+150,aim:-Math.PI/2,gunFacing:-Math.PI/2});
  tick();tick({y:-1,slide:true});tick({y:-1});tick({y:-1,slide:true});
  tick({y:1},10);
  assert.equal(p.coverId,null,'opposite stick brakes before reaching cover');
  assert.ok(p.brakeTurn,'brake records the redirect');
  tick({y:-1},24);
  tick({y:-1,slide:true});tick({y:-1});tick({y:-1,slide:true});
  for(let i=0;i<16&&!p.coverId;i++)tick({y:-1});
  assert.equal(p.coverId,wall.id,'redirect and slide catch');
  tick({},1);if(p.coverMode==='soft')tick({slide:true});tick({},16);
  assert.equal(p.coverMode,'braced');
  const shells=p.shells;
  tick({coverAim:true,fire:true},2);assert.equal(p.shells,shells);
  tick({x:side},22);tick({},2);
  const aim=side<0?Math.PI:0;
  tick({aim,coverAim:true},8);assert.equal(p.coverState11,'expose');
  const root=[p.x,p.y,p.coverAnchor.t];
  tick({aim,coverAim:true,fire:true});assert.equal(p.shells,shells-1);
  assert.deepEqual([p.x,p.y,p.coverAnchor.t],root);
  tick({aim},20);assert.equal(p.coverState11,'brace');
  tick({slide:true});assert.equal(p.coverId,null);
 }
 for(const phase of ['curve','brake','landing']){
  const s=newGame(character,'shot',0,'solo');s.covers=[];s.matter=[];
  const p=s.players[0];Object.assign(p,{character,x:780,y:440,aim:0,gunFacing:0});
  const tick=input=>{setInput(s,0,p.lastSeq+1,input);advance(s,s.lastAt+1000/60)};
  if(phase==='landing'){
   tick({x:1,jump:true});
   assert.equal(p.grounded,false);
   for(let i=0;i<120&&!p.grounded;i++)tick({x:1});
   assert.equal(p.grounded,true);
  }else{
   tick({x:1,slide:true});tick({x:1});tick({x:1,slide:true});
   if(phase==='brake'){
    for(let i=0;i<15&&!p.brakeTurn;i++)tick({x:-1});
    assert.ok(p.brakeTurn);
   }else{
    for(let i=0;i<5;i++)tick({x:.707,y:.707});
    assert.ok(p.slide>0&&p.slideSteerCurrent>0);
   }
  }
  const shells=p.shells;
  tick({x:1,fire:true});assert.equal(p.shells,shells-1);
  const flash=s.fx.find(fx=>fx.type==='muzzle'),pellet=s.shots.find(shot=>shot.owner===0);
  assert.ok(flash&&pellet);
  const socket=barrelSocket27d(p,s.config.spriteScale);
  assert.deepEqual([flash.x,flash.y,flash.z],[socket.x,socket.y,socket.z]);
  assert.ok(Math.hypot(pellet.x-pellet.vx*pellet.realAge-socket.x,pellet.y-pellet.vy*pellet.realAge-socket.y)<1e-6);
 }
 console.log('PASS',character,'brake short, catch, both tall edges, escape and live shot origins during curve/brake/landing');
}
