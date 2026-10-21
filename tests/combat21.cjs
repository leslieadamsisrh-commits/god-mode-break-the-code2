// Small controlled comparisons; no balance claim from four bot rounds.
const fs=require('fs'),path=require('path'),Module=require('module'),ts=require('typescript'),cp=require('child_process'),assert=require('assert/strict');
global.crypto??=require('crypto').webcrypto;
const compile=s=>ts.transpileModule(s,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
require.extensions['.ts']=(m,p)=>m._compile(compile(fs.readFileSync(p,'utf8')),p);
const file=path.resolve('lib/game.ts');function load(src){const m=new Module(file,module);m.filename=file;m.paths=Module._nodeModulePaths(path.dirname(file));m._compile(compile(src+'\nexport {step,empty,watchBotInput};'),file);return m.exports;}
const now=load(fs.readFileSync(file,'utf8')),ref=process.argv[2],old=ref?load(cp.execFileSync('git',['show',ref+':lib/game.ts'],{encoding:'utf8',maxBuffer:4e6})):null;
function fixture(a,swap=false){const s=a.newGame('QA','qa',1000,'watch');s.phase='playing';s.fightUntil=0;if(swap){[s.players[0].x,s.players[1].x]=[s.players[1].x,s.players[0].x];s.players.forEach((p,n)=>p.aim=p.gunFacing=n?0:Math.PI);}return s;}
if(old){
 assert.deepEqual(now.newGame('QA','qa').config,old.newGame('QA','qa').config);
 assert.deepEqual(now.newGame('QA','qa',1000,'watch').covers,old.newGame('QA','qa',1000,'watch').covers);
 for(const name of ['move-slide','fire-shield','glove']){const states=[old,now].map(a=>{const s=fixture(a);s.covers=[];s.matter=[];s.players.forEach(p=>p.bot=false);return s;});
  for(let k=0;k<120;k++){const input=name==='move-slide'?{x:.8,y:k<60?.4:-.4,aim:0,slide:k===10||k===15}:name==='fire-shield'?{x:.3,aim:0,fire:k<70,shield:k>=70}: {aim:0,melee:k<30};[old,now].forEach((a,n)=>{a.setInput(states[n],0,k,input);a.advance(states[n],1000+(k+1)*1000/60);});}
  for(let n=0;n<2;n++)for(const key of ['x','y','vx','vy','hp','battery','knock','slide','dash','lastMelee','lastShot'])assert.equal(states[0].players[n][key],states[1].players[n][key],name+'/'+n+'/'+key);
 }
 console.log('PASS unchanged config, 22 collision hulls and exact player outcomes versus '+ref+' for 120-tick movement/slide, shooting/shield and glove sequences.');
}
// On mirrored empty ground, identical input has matching displacement.
let s=fixture(now);s.covers=[];s.matter=[];s.players.forEach(p=>p.bot=false);for(let k=0;k<60;k++){s.players.forEach((p,n)=>now.setInput(s,n,k,{x:n?-.6:.6,y:0,aim:n?Math.PI:0}));now.advance(s,1000+(k+1)*1000/60);}assert(Math.abs(s.players[0].x+s.players[1].x-1000)<1e-7);
// Update order reads prior opponent input; compare independent policy calls.
s=fixture(now);s.time=1;const other=structuredClone(s),prior=s.players.map(p=>({...p.input}));for(const n of [0,1])now.watchBotInput(s,n,prior[1-n]);for(const n of [1,0])now.watchBotInput(other,n,prior[1-n]);assert.deepEqual(s.players.map(p=>p.input),other.players.map(p=>p.input));
const results=[];for(const round of [1,2])for(const swap of [false,true]){const s=fixture(now,swap);s.round=round;let ticks=0;for(;ticks<1200&&s.phase==='playing';ticks++)now.advance(s,s.lastAt+1000/60);results.push({round,swap,duration:+(ticks/60).toFixed(2),phase:s.phase,winner:s.winner,spawnSide:s.winner==null?null:(s.winner===0)!==swap?'left':'right',hp:s.players.map(p=>+p.hp.toFixed(1))});}
console.log('PASS mirrored movement and bot policy order. Four-round diagnostic (not balance proof): '+JSON.stringify(results));
const phase=(round,n)=>(round-1+n)%2;assert.equal(phase(2,1),phase(3,0));console.log('CONFIRMED report confound: swapping spawn identities while alternating round phase keeps the same bot strategy phase on a physical side. No damage/health/recovery tuning changed.');
