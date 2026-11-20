const assert=require("node:assert/strict");
const fs=require("node:fs"),ts=require("typescript");
require.extensions[".ts"]=(module,file)=>module._compile(ts.transpileModule(fs.readFileSync(file,"utf8"),{compilerOptions:{module:1,target:9,esModuleInterop:true}}).outputText,file);
const {LocalCombat}=require("../lib/localCombat.ts");
const match=new LocalCombat("Jade","bot",0),s=match.state,[jade,hunter]=s.players;
s.phase="playing";
const wall={id:"recovery-wall",x:950,y:550,w:144,h:20,a:0,z:0,hp:280,maxHp:280,build:0,variant:0,generated:true,anchored27j:true,coverClass:"tall",height27j:100};
s.covers=[wall];
Object.assign(jade,{x:950,y:492});
Object.assign(hunter,{x:950,y:583,battery:20,shells:0});
let frame=0;
match.frame(0,{},[]);
function tick(count){while(count--)match.frame(++frame*1000/60,{},[]);}
tick(35);
assert.ok(hunter.charging);
assert.ok(hunter.battery>20);
assert.equal(hunter.shells,1);
const previous=hunter.battery;
jade.x=hunter.x+115;jade.y=hunter.y;
tick(1);
assert.equal(hunter.charging,false);
assert.equal(hunter.shells,0);
assert.ok(hunter.battery<previous+4);
jade.x=950;jade.y=492;hunter.x=950;hunter.y=583;
tick(280);
assert.ok(hunter.shells>1);
assert.ok(hunter.battery>34);
assert.ok(!hunter.charging);
assert.ok(hunter.botIntent);
console.log("PASS War full opponent uses active charge, fires its first seated shell on a flank, loads shells and resumes decisions",hunter.botIntent);
const {newGame,advance}=require("../lib/game.ts");
for(const mode of ["bot","watch","practice"]){
 for(const [battery,shells] of [[10,8],[100,0],[10,0]]){
  const game=newGame("Jade","test",0,mode);game.rules31={version:1,battery:"current",opponent:"full"};
  const [opponent,bot]=game.players;game.phase="playing";game.covers=[];
  Object.assign(opponent,{bot:false,x:915,y:500});
  Object.assign(bot,{bot:true,x:950,y:500,battery,shells});

  let reached=false;
  for(let frame=1;frame<=330;frame++){
   advance(game,game.lastAt+1000/60);
   if(frame===1)assert.ok(bot.charging,mode+" should start charging immediately in sight");
   if(bot.battery>=80&&bot.shells===8){reached=true;break;}
  }
  assert.ok(reached,mode+" should finish recovering in open space");
 }
}
console.log("PASS low power alone, empty gun alone and both depleted at close range in War, full Training and bot playback.");

// Seed a finite Training corner. The bot makes its own trigger and charge
// decisions; only Jade's exposure and flank timing change between runs.
for(const branch of ['early','late','hold']){
 const drill=new LocalCombat('Jade','practice',0,{version:1,battery:'current',opponent:'full'});
 const state=drill.state,[player,enemy]=state.players;state.phase='playing';state.covers=[{...wall}];
 Object.assign(player,{x:1013,y:492});enemy.bot=false;
 let clock=0;drill.frame(0,{},[]);
 const step=(n,input={})=>{while(n--)drill.frame(++clock*1000/60,{aim:Math.PI/2,...input},[])};
 step(1,{y:1,slide:true});step(18);step(1,{slide:true});step(22);
 Object.assign(enemy,{bot:true,x:1020,y:595,shells:0,battery:15,aim:-Math.PI/2,gunFacing:-Math.PI/2});
 const peek={aim:.36,coverAim:true,coverAimActive:true};
 step(30);assert.equal(enemy.shells,1);
 step(2,peek);assert.equal(enemy.shells,0);
 step(2);assert.ok(state.events.some(e=>e.owner===1&&e.kind==='cover'&&e.contactId===wall.id));
 if(branch==='hold'){
  let last=0,clicks=0;
  for(let i=0;i<245;i++){step(1);if(enemy.shells>last){assert.ok(state.fx.some(f=>f.type==='shell-insert'&&f.owner===1&&f.confirmedAt===state.time));clicks++;}last=enemy.shells;}
  assert.equal(clicks,8);assert.equal(enemy.shells,8);
 }else{
  step(branch==='early'?10:29);assert.equal(enemy.shells,branch==='early'?0:1);
  const before=enemy.lastShot;
  player.coverId=null;player.coverMode='free';player.x=enemy.x+100;player.y=enemy.y;
  step(1);assert.equal(enemy.charging,false);assert.equal(enemy.shells,0);
  assert.equal(enemy.lastShot>before,branch==='late');assert.equal(enemy.shellLoad,0);
 }
 console.log('PASS Training last shot into wall:',branch);
}

{
 const battle=new LocalCombat('Jade','bot',0),round=battle.state;
 battle.command({action:'start',room:battle.room,token:battle.token});
 const bot=round.players[1];
 let clock=0;
 const frame=()=>battle.frame(clock++*1000/60,{aim:0},[]);
 while(!bot.botRecoveryGoal&&clock<1800)frame();
 assert.ok(bot.botRecoveryGoal,'ordinary arena produces a reachable recovery goal');
 const goal=bot.botRecoveryGoal,dx=goal.x-bot.x,dy=goal.y-bot.y,shells=bot.shells;
 round.covers.push({...wall,id:'route-panel',x:bot.x+dx*.45,y:bot.y+dy*.45,w:100,h:16,a:Math.atan2(dy,dx)+Math.PI/2});
 frame();
 assert.notDeepEqual(bot.botRecoveryGoal,goal,'panel obstructs the chosen approach');
 assert.equal(bot.shells,shells);
 let protectedCharge=false;
 for(let i=0;i<190&&bot.shells===shells;i++){
  frame();protectedCharge||=bot.charging&&bot.botChargeConcealed;
 }
 assert.ok(protectedCharge);
 assert.equal(bot.shells,shells+1);
 console.log('PASS reroute around constructed panel into protected hold-Y');
}
