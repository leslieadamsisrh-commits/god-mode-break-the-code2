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
