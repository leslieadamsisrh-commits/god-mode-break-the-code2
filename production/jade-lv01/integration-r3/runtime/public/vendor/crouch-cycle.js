/* R3: three genuine cutouts, four playback slots. New drawings are review
 * candidates, not user-approved final animation. No mirrored equipment.
 * Track actual signed travel; rendering never changes the combat simulation.
 */
(function(root){'use strict';
const B05=root.JadeB05Fast||(typeof require==='function'?require('./b05-fast.js'):null);
const make=(id,file,anchor,sha256)=>Object.freeze({id,file:'assets/b06-r3/'+file,width:1312,height:1199,dimensions:[1312,1199],anchor:Object.freeze(anchor),scale:.100,sha256,artworkApproval:'pending-user-review'});
const records=Object.freeze({
 RIGHT:make('R3-RIGHT','B06C-right-step.png',[620,1075],'0e9097fe209b94737b0ceba6e62dc9934683ce18e5993b31eca4674c03d46f2a'),
 LEFT:make('R3-LEFT','B06L-left-step.png',[888,1096],'5374ed190b4d583787d6003c4ea835bb034affa3b661251b88aaeb4ee682e1eb'),
 PASS:make('R3-PASS','B06P-passing.png',[620,1075],'fb0c13da1dc92e47678817e1494e8c164633c5142e19d4a36b33bb2de7bd33bc')
});
const cycle=Object.freeze(['PASS','RIGHT','PASS','LEFT']),cycleDistance=96;
function supported(p,now){
 const since=now-Number(p.lastShot);
 return B05.supportedAttached(p)&&!(p.impact>0)&&!p.cornerTravel&&!p.aimHeld&&!(p.raise>0)&&!(p.recoil>0)&&!(Number.isFinite(since)&&since>=0&&since<.16);
}
class Tracker{
 constructor(){this.states=new WeakMap();}
 observe(p,tick,time){
  let s=this.states.get(p);const active=supported(p,time);
  if(!s){s={tick:tick-1,x:p.x,distance:0,active:false};this.states.set(p,s);}
  if(s.tick===tick)return;
  const dx=p.x-s.x;
  if(active&&s.active&&Math.abs(dx)<35)s.distance+=dx;
  else if(!active||!s.active)s.distance=0;
  s.x=p.x;s.tick=tick;s.active=active;
 }
 select(p,time){
  if(!supported(p,time))return null;
  const distance=this.states.get(p)?.distance||0;
  const moving=Math.abs(p.vx)>.15;
  const phase=((distance%cycleDistance)+cycleDistance)%cycleDistance;
  const slot=moving?Math.min(3,Math.floor(phase/(cycleDistance/4))):0;
  const key=cycle[slot];
  return {record:records[key],slot,phase,role:moving?'crouched-step':'crouched-settle',candidate:true};
 }
}
const api={records,cycle,cycleDistance,supported,Tracker};root.JadeCrouchCycle=api;
if(typeof module==='object')module.exports=api;
})(globalThis);
