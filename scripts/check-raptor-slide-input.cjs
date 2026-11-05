require('./check-raptor-39t6.cjs');
const assert=require('node:assert/strict');
const {SlideInputEdges}=require('../lib/slideInputEdges.ts');
const {LocalCombat}=require('../lib/localCombat.ts');
const q=new SlideInputEdges();
q.set('ShiftLeft',true,{x:1,y:0});q.set('ShiftLeft',true,{x:1,y:0});q.set('ShiftRight',true,{x:1,y:0});q.set('ShiftLeft',false,{x:1,y:0});q.set('ShiftRight',false,{x:1,y:0});
assert.deepEqual(q.drain().map(e=>e.slide),[true,false]);
q.set('touch',true,{x:1,y:0});q.reset();assert.equal(q.pressed,false);assert.deepEqual(q.drain(),[]);
for(let d=0;d<8;d++){
 const x=Math.cos(d*Math.PI/4),y=Math.sin(d*Math.PI/4),aim=d*Math.PI/4;
 function trial(preserve){
  const e=new LocalCombat('Input QA','solo',0);e.state.covers=[];Object.assign(e.state.players[0],{x:1100,y:560});
  let now=0;for(let i=0;i<50;i++){now+=1000/60;e.frame(now,{x,y,aim},[]);}
  const edges=new SlideInputEdges();for(const pressed of [true,false,true,false])edges.set('touch',pressed,{x,y});
  const events=preserve?edges.drain():[{slide:true,x,y},{slide:false,x,y}];
  // Both taps arrive before a 100ms render interval. Preserve each physical edge.
  e.frame(now+100,{x:0,y:0,aim},events.map(t=>({...t,aim})));
  return e.state.players[0];
 }
 assert.equal(trial(false).slide,0,'legacy coalescing reproduces missed slide');
 const p=trial(true);assert(p.slide>0,'buffered double-tap starts slide');
 assert(Math.cos(p.slideFacing-aim)>.999,'direction at tap survives key release');
}
console.log('PASS: repeated keys, overlapping sources, blur reset, and eight-direction between-frame double taps.');
