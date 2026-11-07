const fs=require('fs'),ts=require('typescript'),assert=require('node:assert/strict'),vm=require('node:vm');
require.extensions['.ts']=(m,p)=>m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,p);
const {advanceRaptorPose,raptorActorSample}=require('../lib/raptorPose.ts');
const actor={x:0,y:0,vx:220,vy:0,aim:0,gunFacing:0,slide:.4,pinball:0,slideFacing:0,grounded:true,vz:0,jumpHeight:0,knock:0,hitUntil:99,charging:false,coverId:null,fireState:0,recoil:0,returnToCover:0,input:{fire:true}};
for(let d=0;d<8;d++){
 let memory;const a={...actor,slideFacing:d*Math.PI/4,gunFacing:d*Math.PI/4};
 for(let i=0;i<20;i++){const r=advanceRaptorPose(memory,raptorActorSample({...a,slide:.5-i/60},i/60,.5));memory=r.memory;assert.equal(r.frame.family,'slide','cosmetic damage must not replace moving slide with idle');}
 const recovery=advanceRaptorPose(memory,raptorActorSample({...a,slide:0},.34,.5));assert.equal(recovery.frame.family,'slide');assert.equal(recovery.frame.frame,2);
 const moving=advanceRaptorPose(recovery.memory,raptorActorSample({...a,slide:0},.5,.5));assert.notEqual(moving.frame.family,'idle');
 assert.equal(advanceRaptorPose(memory,raptorActorSample({...a,knock:.1},.34,.5)).frame.family,'idle','physical knockback remains an interruption');
 let jump=advanceRaptorPose(undefined,raptorActorSample({...a,slide:0},-1/60,.5)).memory;const phases=new Set();for(let i=0;i<60;i++){const t=i/60,airborne=t<.7,r=advanceRaptorPose(jump,raptorActorSample({...a,slide:0,grounded:!airborne,vz:airborne?350-t*1000:0},t,.5));jump=r.memory;if(r.frame.family==='jump')phases.add(r.frame.frame)}assert.deepEqual([...phases],[0,1,2,3,4,5]);
}
// Run actual dispatcher and shot-volume functions, isolated from unrelated simulation.
const source=fs.readFileSync(require.resolve('../lib/game.ts'),'utf8'),ast=ts.createSourceFile('game.ts',source,ts.ScriptTarget.Latest,true);
const names=['slideAction','bodyRegions','shotPlayerTime'],pieces=ast.statements.filter(n=>ts.isFunctionDeclaration(n)&&names.includes(n.name?.text)).map(n=>n.getText(ast).replace(/^export /,''));
const calls=[],ctx={Math,startDash:()=>calls.push('dash'),startClassicSlide:()=>calls.push('slide'),releaseCover:()=>{},cylinderTime27d:require('../lib/ballistics27d.ts').cylinderTime27d};vm.createContext(ctx);vm.runInContext(ts.transpileModule(pieces.join('\n'),{compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText,ctx);
const p={input:{slide:true,x:1,y:0},knock:0,lastSlideTap:-9,gunFacing:0,coverId:null},s={players:[p],time:1,config:{doubleTapWindow:.25}};
ctx.slideAction(s,0,{slide:false});assert.deepEqual(calls,['dash']);s.time=1.1;ctx.slideAction(s,0,{slide:true});assert.equal(calls.length,1,'held input cannot restart slide');ctx.slideAction(s,0,{slide:false});assert.deepEqual(calls,['dash','slide']);s.time=1.2;p.input.y=1;ctx.slideAction(s,0,{slide:false});assert.equal(calls.length,3);
const target={x:0,y:0,z:0,slide:0,coverId:null,shield:false,input:{shield:false},battery:100};
for(const [z,hit] of [[10,true],[40,true],[70,true],[90,false]])assert.equal(!!ctx.shotPlayerTime({x:-100,y:0,z},{x:100,y:0},z,target,target,1),hit);
assert.equal(ctx.bodyRegions({...target,slide:1},1).at(-1).max,78*.58);
console.log('PASS: eight-direction flash/slide/jump continuity, knockback, slide input edges and unchanged shot volumes (70 hits, 90 misses at scale 1).');
