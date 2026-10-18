/* GOD MODE AutoPlay QA: headless deterministic engine runner.
   This validates simulation only. It does not capture visual frames or iPad controls. */
const {buildSync}=require("esbuild");
const fs=require("node:fs"),os=require("node:os"),path=require("node:path");
const output=path.join(os.tmpdir(),"godmode-autoplay-"+process.pid+".cjs");
buildSync({entryPoints:["lib/game.ts"],bundle:true,platform:"node",format:"cjs",outfile:output,logLevel:"warning"});
const {newGame,advance,combatDiagnostics}=require(output);
const runs=Number(process.env.QA_MATCHES||100),seconds=Number(process.env.QA_SECONDS||90);
let results=[],failures=[];
function assert(ok,message,match){if(!ok)failures.push({match,message});}
for(let i=0;i<runs;i++){
 const seed=i+1;let now=1700000000000+i*1000000;
 const state=newGame("QA BOT","qa-token",now,"watch");
 let initial=state.groundSources44?.reduce((n,x)=>n+x.remaining,0)||0;
 let frames=0,maxStuck=[0,0],stuck=[0,0],last=state.players.map(p=>[p.x,p.y]);
 let minHP=state.players.map(p=>p.hp),coverCreated=0,rounds=0;
 for(let t=0;t<seconds*60;t++){
  now+=1000/60;
  try{advance(state,now)}catch(error){failures.push({match:seed,frame:t,message:String(error)});break;}
  frames++;
  assert(state.players.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)&&Number.isFinite(p.hp)&&Number.isFinite(p.battery)),"Nonfinite player state",seed);
  assert(state.covers.every(c=>Number.isFinite(c.x)&&Number.isFinite(c.y)&&c.hp>0),"Invalid cover state",seed);
  assert((state.groundSources44||[]).every(x=>x.remaining>=0&&x.remaining<=x.initial),"Invalid floor matter",seed);
  for(let j=0;j<state.players.length;j++){
   const p=state.players[j],travel=Math.hypot(p.x-last[j][0],p.y-last[j][1]);
   stuck[j]=travel<.04&&state.phase==="playing"?stuck[j]+1:0;
   maxStuck[j]=Math.max(maxStuck[j],stuck[j]);last[j]=[p.x,p.y];minHP[j]=Math.min(minHP[j],p.hp);
  }
  coverCreated=Math.max(coverCreated,state.covers.filter(c=>c.generated).length);
  if(state.phase==="finished"){rounds++;break;}
 }
 results.push({match:seed,frames,simSeconds:+state.time.toFixed(2),phase:state.phase,winner:state.winner,
  minHP,maxStationarySeconds:maxStuck.map(n=>+(n/60).toFixed(2)),
  coverCount:state.covers.length,generatedCoverPeak:coverCreated,
  matterInitial:initial,matterRemaining:state.groundSources44?.reduce((n,x)=>n+x.remaining,0)||0,
  actionCounts:combatDiagnostics(state).counts});
}
const summary={status:failures.length?"FAIL":"SIMULATION_COMPLETED",runs:results.length,failures:failures.slice(0,30),
 finished:results.filter(x=>x.phase==="finished").length,
 nonFinished:results.filter(x=>x.phase!=="finished").length,
 maxStationarySeconds:Math.max(...results.flatMap(x=>x.maxStationarySeconds)),
 disclaimer:"Headless simulation only. Stationary time is a diagnostic, not proof of collision-stuck behavior. No rendered gameplay was watched."};
fs.mkdirSync("qa-output",{recursive:true});
fs.writeFileSync("qa-output/autoplay-results.json",JSON.stringify({summary,results},null,2));
console.log(JSON.stringify(summary,null,2));
if(failures.length)process.exitCode=1;
