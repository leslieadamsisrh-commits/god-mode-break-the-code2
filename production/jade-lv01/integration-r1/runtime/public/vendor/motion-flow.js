/* 08H motion/presentation experiment. Base 08G core and art files are unchanged.
 * No sprites are fabricated here. Recovered art covers unsupported motion.
 */
(function(root){
'use strict';
const C=root.JadeCore||(typeof require==='function'?require('./core.js'):null);
const A=root.JadeAction||(typeof require==='function'?require('./action-controller.js'):null);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const FLOW=Object.freeze({deadZone:.18,coverResponse:20,coverStopResponse:27,wrapSpeed:168,directionHysteresis:3*Math.PI/180,runCycleDistance:12/.09,coverCycleDistance:6/.09});
const normals=Object.freeze({south:[0,1],north:[0,-1],east:[1,0],west:[-1,0]});
function radial(x=0,y=0){if(!Number.isFinite(x)||!Number.isFinite(y))return{x:0,y:0};const length=Math.hypot(x,y);if(length<=FLOW.deadZone)return{x:0,y:0};const magnitude=clamp((length-FLOW.deadZone)/(1-FLOW.deadZone),0,1);return{x:x/length*magnitude,y:y/length*magnitude};}
function facing(angle,count=24,previous=null){const step=2*Math.PI/count;const nearest=((Math.round(angle/step)%count)+count)%count;
 if(Number.isInteger(previous)&&previous>=0&&previous<count&&Math.abs(C.wrap(angle-previous*step))<=step/2+Math.min(FLOW.directionHysteresis,step/8))return previous;
 return nearest;}
function frameAt(distance,frames,family,slide=0){if(family==='ready')return 0;if(family==='slide')return clamp(Math.floor((1-clamp(slide,0,.70)/.70)*frames),0,frames-1);
 const cycle=family==='cover'?FLOW.coverCycleDistance:FLOW.runCycleDistance;
 const phase=((distance/cycle)%1+1)%1;return Math.min(frames-1,Math.floor(phase*frames));}
function circleClear(p,rect,radius){const dx=p.x-clamp(p.x,rect.x,rect.x+rect.w),dy=p.y-clamp(p.y,rect.y,rect.y+rect.h);return Math.hypot(dx,dy)>=radius-.0001;}
function wrapPlan(p,r){if(!p.cover||!p.cover.edge)return null;
 const face=p.cover.face,edge=p.cover.edge,pad=p.r+1,inset=p.r+2;let toFace,v;
 if(face==='south'||face==='north'){
  if(edge!=='left'&&edge!=='right')return null;
  toFace=edge==='right'?'east':'west';v={x:edge==='right'?r.x+r.w:r.x,y:face==='south'?r.y+r.h:r.y};
 }else{
  if(edge!=='top'&&edge!=='bottom')return null;
  toFace=edge==='bottom'?'south':'north';v={x:face==='east'?r.x+r.w:r.x,y:edge==='bottom'?r.y+r.h:r.y};
 }
 if(r.w<inset*2||r.h<inset*2)return null;
 const [nx,ny]=normals[face],[tx,ty]=normals[toFace];
 const p0={x:p.x,y:p.y},p1={x:v.x+nx*pad,y:v.y+ny*pad},p2={x:v.x+tx*pad,y:v.y+ty*pad};
 const p3=(toFace==='east'||toFace==='west')?{x:p2.x,y:clamp(v.y,r.y+inset,r.y+r.h-inset)}:{x:clamp(v.x,r.x+inset,r.x+r.w-inset),y:p2.y};
 const a0=Math.atan2(ny,nx),sweep=C.wrap(Math.atan2(ty,tx)-a0);
 const lengths=[Math.hypot(p1.x-p0.x,p1.y-p0.y),Math.abs(sweep)*pad,Math.hypot(p3.x-p2.x,p3.y-p2.y)];
 return{id:r.id,fromFace:face,toFace,edge,p0,p1,p2,p3,v,pad,a0,sweep,lengths,length:lengths.reduce((a,b)=>a+b,0),distance:0};
}
function sampleWrap(q,d){d=clamp(d,0,q.length);const [l0,l1,l2]=q.lengths;
 if(d<=l0&&l0>0){const t=d/l0;return{x:q.p0.x+(q.p1.x-q.p0.x)*t,y:q.p0.y+(q.p1.y-q.p0.y)*t,normal:q.a0};}
 if(d<=l0+l1){const t=(d-l0)/l1,a=q.a0+q.sweep*t;return{x:q.v.x+Math.cos(a)*q.pad,y:q.v.y+Math.sin(a)*q.pad,normal:a};}
 const t=l2?clamp((d-l0-l1)/l2,0,1):1;return{x:q.p2.x+(q.p3.x-q.p2.x)*t,y:q.p2.y+(q.p3.y-q.p2.y)*t,normal:q.a0+q.sweep};
}
function pathClear(q,covers,radius){for(let n=0,count=Math.ceil(q.length/2);n<=count;n++){const p=sampleWrap(q,q.length*n/count);if(p.x<-520||p.x>520||p.y<-300||p.y>330)return false;if(covers.some(r=>!circleClear(p,r,radius)))return false;}return true;}
function analogFree(p,i,dt){const magnitude=Math.hypot(i.x,i.y);
 if(magnitude>=1||magnitude===0||p.slide>0||i.slide){C.freeMotion(p,i,dt);return;}
 const response=1-Math.exp(-13*dt);p.vx+=(i.x*262-p.vx)*response;p.vy+=(i.y*262-p.vy)*response;p.drop*=.84;p.state=magnitude>.005?'RUN':'IDLE';
}
class World extends C.World{
 constructor(options={}){super(options);this.flowEnabled=options.flow!==false;this.wrapPressed=false;}
 beginWrap(){const p=this.p;if(!p.cover||p.cornerTravel)return false;const r=this.covers.find(r=>r.id===p.cover.id);const q=r&&wrapPlan(p,r);
  if(!q||!pathClear(q,this.covers,p.r)){this.emit('corner_wrap_blocked',{reason:q?'path-obstructed':'reach-a-valid-edge'});return false;}
  p.cornerTravel=q;p.cover=null;p.vx=p.vy=0;p.state='CORNER WRAP';A.interrupt(p,'corner-wrap',(t,d)=>this.emit(t,d));this.emit('corner_wrap_start',{from:q.fromFace,to:q.toFace,cover:q.id,length:q.length});return true;
 }
 cancelWrap(kick=false){const p=this.p,q=p.cornerTravel;if(!q)return;const pos=sampleWrap(q,q.distance);p.cornerTravel=null;p.cover=null;p.reattach=.22;A.interrupt(p,'corner-wrap-exit',(t,d)=>this.emit(t,d));
  if(kick){p.vx=Math.cos(pos.normal)*430;p.vy=Math.sin(pos.normal)*430;p.kick=.13;}else{p.vx=p.vy=0;}
  this.emit('corner_wrap_cancel',{kick});
 }
 moveWrap(i,dt){const p=this.p,q=p.cornerTravel;if(i.attach||i.slide){this.cancelWrap(i.slide);return;}
  const next=Math.min(q.length,q.distance+FLOW.wrapSpeed*dt),at=sampleWrap(q,next);
  if(this.covers.some(r=>!circleClear(at,r,p.r))){this.cancelWrap(false);this.emit('corner_wrap_blocked',{reason:'path-changed'});return;}
  p.vx=(at.x-p.x)/dt;p.vy=(at.y-p.y)/dt;p.x=at.x;p.y=at.y;p.wrapFacing=at.normal;q.distance=next;p.drop=1;p.state='CORNER WRAP';
  if(next>=q.length-1e-8){p.cornerTravel=null;p.cover={id:q.id,face:q.toFace,edge:null};this.place();p.vx=p.vy=0;p.state='CORNER '+(p.cover.edge||'STOP').toUpperCase();this.emit('corner_wrap_end',{cover:q.id,face:q.toFace});}
 }
 movement(i,dt){if(!this.flowEnabled){super.movement(i,dt);return;}
 const p=this.p,before={x:p.x,y:p.y},prevCover=p.cover?.id;
 p.reattach=Math.max(0,p.reattach-dt);p.impact=Math.max(0,p.impact-dt);
 const moveA=Math.hypot(i.x,i.y)>.1?Math.atan2(i.y,i.x):p.lowerAim,delta=C.wrap(p.aim-p.lowerAim),lim=C.TUNING.twistLimit;
 if(Math.abs(delta)>lim)p.lowerAim+=Math.sign(delta)*(Math.abs(delta)-lim)*.15;else if(Math.hypot(i.x,i.y)>.1)p.lowerAim+=C.wrap(moveA-p.lowerAim)*.12;
 if(this.wrapPressed&&!p.cornerTravel)this.beginWrap();
 if(p.cornerTravel){this.moveWrap(i,dt);}
 else{
  if(i.attach&&p.cover)this.detach(false);
  else if(i.attach&&!p.cover){const h=this.covers.map(r=>({r,dx:p.x-clamp(p.x,r.x,r.x+r.w),dy:p.y-clamp(p.y,r.y,r.y+r.h)})).map(h=>({...h,d:Math.hypot(h.dx,h.dy)})).filter(h=>h.d<42).sort((a,b)=>a.d-b.d)[0];if(h)this.attach(h.r,Math.abs(h.dx)>Math.abs(h.dy)?h.dx>0?'east':'west':h.dy>0?'south':'north');}
  if(p.cover){const c=p.cover,h=c.face==='south'||c.face==='north',input=h?i.x:i.y,v=h?p.vx:p.vy;
   const target=input*262,response=1-Math.exp(-(Math.abs(input)>.005?FLOW.coverResponse:FLOW.coverStopResponse)*dt);
   let next=v+(target-v)*response;if(Math.abs(input)<.005&&Math.abs(next)<.15)next=0;
   p.vx=h?next:0;p.vy=h?0:next;p.x+=p.vx*dt;p.y+=p.vy*dt;const desired={x:p.x,y:p.y};this.place();if(Math.abs(desired.x-p.x)>1e-9)p.vx=0;if(Math.abs(desired.y-p.y)>1e-9)p.vy=0;
   p.drop+=(1-p.drop)*.25;p.state=p.impact>0?'COVER IMPACT':c.edge?'CORNER '+c.edge.toUpperCase():Math.hypot(p.vx,p.vy)>.15?'COVER SHIMMY':'COVER IDLE';
   if(i.slide)this.detach(true,i);
  }else{
   if(p.kick>0){p.kick-=dt;p.vx*=Math.pow(.12,dt);p.vy*=Math.pow(.12,dt);p.state='COVER KICK';}else analogFree(p,i,dt);
   const n=Math.max(1,Math.ceil(Math.hypot(p.vx,p.vy)*dt/6));for(let k=0;k<n;k++){p.x+=p.vx*dt/n;p.y+=p.vy*dt/n;this.collide(p,true);if(p.cover)break;}p.x=clamp(p.x,-520,520);p.y=clamp(p.y,-300,330);
  }
 }
 // Ground travel, not desired speed, drives the art. Do not animate walking into a blocked edge.
 const traveled=i.attach&&prevCover!==p.cover?.id?0:Math.hypot(p.x-before.x,p.y-before.y);
 p.flowDistance=(p.flowDistance||0)+traveled;p.phase+=traveled*.045;
 }
 step(input={},dt=C.DT){if(!Number.isFinite(dt)||dt<=0||dt>.1)throw new Error('Expected a positive simulation step <= 0.1s');
 const clean={...input,x:Number.isFinite(input.x)?input.x:0,y:Number.isFinite(input.y)?input.y:0};this.wrapPressed=!!clean.wrap;
 super.step(clean,dt);const entry=this.inputs[this.inputs.length-1];if(entry)entry.wrap=!!input.wrap;this.wrapPressed=false;
 }
 setFlow(enabled){enabled=!!enabled;if(enabled===this.flowEnabled)return;if(this.p.cornerTravel)this.cancelWrap(false);this.flowEnabled=enabled;this.emit('flow_mode',{enabled});}
}
const api={World,FLOW,radial,facing,frameAt,wrapPlan,sampleWrap,pathClear,analogFree};root.JadeFlow=api;if(typeof module==='object')module.exports=api;
})(typeof globalThis==='object'?globalThis:this);
