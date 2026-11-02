const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),ts=require('typescript');
const manifest=JSON.parse(fs.readFileSync('public/assets/raptor-v2/manifest.json'));
const context={exports:{},Map,Set,Math,Promise,require:()=>({default:manifest})};vm.createContext(context);
vm.runInContext(ts.transpileModule(fs.readFileSync('lib/raptorSpriteOnly.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,context);
const select=context.exports.selectRaptorFrame;
const base={x:0,y:0,angle:0,speed:200,sliding:false,airborne:false,hit:false,firing:false,time:0,scale:1,slideDuration:.5};
for(let dir=0;dir<8;dir++){
 const s={...base,actorId:'direction'+dir,angle:dir*Math.PI/4};
 for(const [time,remaining,frame] of [[1,.5,0],[1.1,.4,1],[1.46,.04,2]]){
  const input=Object.freeze({...s,time,sliding:true,slideRemaining:remaining});
  const result=select(input);assert.equal(result.family,'slide');assert.equal(result.frame,frame);assert.equal(result.angle,s.angle);
 }
 assert.equal(select({...s,time:1.51}).frame,2,'recovery follows exit');
 assert.equal(select({...s,time:1.7}).family,'run','recovery does not loop');
 select({...s,time:2,sliding:true,slideRemaining:.3});
 assert.equal(select({...s,time:2.1,attached:true,speed:0}).family,'idle','cover interrupts recovery');
 select({...s,time:3,sliding:true,slideRemaining:.3});
 assert.equal(select({...s,time:3.1,airborne:true}).family,'idle','jump interrupts recovery');
 select({...s,time:4,sliding:true,slideRemaining:.3});
 assert.equal(select({...s,time:4.1,hit:true}).family,'idle','damage interrupts slide');
 select({...s,time:5,sliding:true,slideRemaining:.3});
 assert.equal(select({...s,time:0,speed:0}).family,'idle','rematch time reset clears transition');
}
console.log('PASS39Q eight-direction entry/hold/recovery, finite recovery, cover/jump/hit interruption, rematch reset, immutable inputs');
global.crypto??=require('node:crypto').webcrypto;
require.extensions['.ts']=(m,p)=>m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,p);
const {newGame,setInput,advance}=require('../lib/game.ts');
const game=newGame('host','host',0,'solo');let seq=0;
const step=input=>{setInput(game,0,++seq,input);advance(game,game.lastAt+1000/60);};
step({x:1,slide:true});step({x:1,slide:false});step({x:1,slide:true});
assert(game.players[0].slide>0,'double tap must start authoritative baseball slide');
const phases=new Set();
for(let i=0;i<50;i++){
 const p=game.players[0],before=JSON.stringify(p);
 const result=select({...base,actorId:'engine',time:game.time,angle:p.slideFacing,sliding:p.slide>0,slideRemaining:p.slide,slideDuration:game.config.slideDuration,attached:!!p.coverId,airborne:p.grounded===false||Math.abs(p.vz||0)>.1,hit:p.knock>0,speed:Math.hypot(p.vx,p.vy)});
 if(result.family==='slide')phases.add(result.frame);
 assert.equal(JSON.stringify(p),before,'renderer must not mutate simulation');step({x:1});
}
assert(phases.has(0)&&phases.has(1)&&phases.has(2),'real slide must traverse all three authored phases');
console.log('PASS39Q actual shared-engine double tap traverses all three visual phases without simulation writes');

// Verify the real input aggregation preserves aliases and touch action edges.
const gameSource=fs.readFileSync('app/Game.tsx','utf8');
const mapping=gameSource.match(/const keyAction:Record<string,string>=(\{[^;]+\});/)[1];
const aggregation=gameSource.match(/for\(const\[k,a\]of Object.entries\(keyAction\)\)i\[a\]=[^;]+;/)[0];
for(const key of ['ShiftLeft','ShiftRight','KeyJ']){
 const sandbox={i:{},edges:{current:{[key]:true}}};vm.createContext(sandbox);
 vm.runInContext('const keyAction='+mapping+';'+aggregation,sandbox);
 assert.equal(sandbox.i[key==='KeyJ'?'jump':'slide'],true,key+' must survive aliases');
}
const touch={i:{slide:true,jump:true},edges:{current:{}}};vm.createContext(touch);vm.runInContext('const keyAction='+mapping+';'+aggregation,touch);assert(touch.i.slide&&touch.i.jump,'touch edges survive keyboard mapping');
console.log('PASS39Q both Shift aliases, keyboard jump and touch slide/jump aggregation');
