// Isolated Shotgun Lab rules. The main game's combat and network code do not import this module.
import {APPROVED_MOVEMENT,coverFace,localPoint} from './lab-cover-contact.js';
export const COVER_TUNING=Object.freeze({captureDistance:32,captureSeconds:.24,gripReachMin:175,gripReachMax:300,acquireDistance:370,hoverHeight:12,gripSpeed:550,gripResponse:10,turnSpeed:3.2,sweepStep:3,impactThreshold:120,impactMin:18,impactMax:75});
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const deltaAngle=(a,b)=>Math.atan2(Math.sin(a-b),Math.cos(a-b));
export const barrierAngle=aim=>aim+Math.PI/2;
export function coverCorners(c){const ca=Math.cos(c.a),sa=Math.sin(c.a);return[[-1,-1],[1,-1],[1,1],[-1,1]].map(([x,y])=>({x:c.x+x*c.w/2*ca-y*c.h/2*sa,y:c.y+x*c.w/2*sa+y*c.h/2*ca}));}
export function coversOverlap(a,b,pad=0){
 const ac=coverCorners(a),bc=coverCorners(b);
 for(const angle of [a.a,a.a+Math.PI/2,b.a,b.a+Math.PI/2]){
  const nx=Math.cos(angle),ny=Math.sin(angle),aa=ac.map(p=>p.x*nx+p.y*ny),bb=bc.map(p=>p.x*nx+p.y*ny);
  if(Math.max(...aa)+pad<=Math.min(...bb)||Math.max(...bb)+pad<=Math.min(...aa))return false;
 }return true;
}
export function coverTouchesActor(c,p,pad=0){const q=localPoint(c,p.x,p.y);return Math.hypot(q.x-clamp(q.x,-c.w/2,c.w/2),q.y-clamp(q.y,-c.h/2,c.h/2))<p.r+pad;}
export function blockedCover(c,covers,actors,bounds){
 if(bounds&&coverCorners(c).some(p=>p.x<bounds.minX||p.x>bounds.maxX||p.y<bounds.minY||p.y>bounds.maxY))return {kind:'boundary'};
 const obstacle=covers.find(o=>o!==c&&o.hp>0&&coversOverlap(c,o,.25));if(obstacle)return {kind:'cover',obstacle};
 const actor=actors.find(p=>coverTouchesActor(c,p,.5));return actor?{kind:'actor',actor}:null;
}
export function createBarrier(p,now,covers,actors,bounds){
 const c={x:p.x+Math.cos(p.aim)*COVER_TUNING.gripReachMin,y:p.y+Math.sin(p.aim)*COVER_TUNING.gripReachMin,w:250,h:64,a:barrierAngle(p.aim),hp:260,max:260,kind:'built',born:now,hover:0,held:false,impactCount:0,groundTravel:0};
 return blockedCover(c,covers,actors,bounds)?null:c;
}
// Only extend an expired, ordinary slide. Search along its existing velocity;
// never change the trajectory or speed to acquire cover.
export function extendSlideToCover(p,covers,now,bounds){
 if(p.attached||p.slideExtensionUsed||p.state!=='slide'||now<p.slideUntil||now<(p.coverLockUntil||0)||p.kickUntil>0)return null;
 p.slideExtensionUsed=true;
 const speed=Math.hypot(p.vx,p.vy);if(speed<1)return null;
 const dx=p.vx/speed,dy=p.vy/speed,k=-Math.log(APPROVED_MOVEMENT.slideDrag);
 const reach=Math.min(COVER_TUNING.captureDistance,speed/k*(1-Math.exp(-k*COVER_TUNING.captureSeconds)));
 for(let d=0;d<=reach;d+=.5){
  const q={x:p.x+dx*d,y:p.y+dy*d,r:p.r};
  if(bounds&&(q.x<bounds.minX||q.x>bounds.maxX||q.y<bounds.minY||q.y>bounds.maxY))return null;
  for(const c of covers){if(c.hp<=0)continue;const face=coverFace(c,q);
   if(face.gap<=1.5){
    if(c.held||dx*face.nx+dy*face.ny>-.35)return null;
    const duration=Math.min(COVER_TUNING.captureSeconds,-Math.log(Math.max(.001,1-k*(d+1)/speed))/k+APPROVED_MOVEMENT.fixedStep);
    p.slideUntil=now+duration;p.slideCapture=c;return {cover:c,distance:d,duration};
   }
  }
 }return null;
}
export function dropBarrier(c,reason='released'){if(!c)return;c.held=false;c.dropReason=reason;}
export function updateBarrierGrip(c,p,input,reach,dt,now,covers,actors,bounds,state){
 const edge=input&&!state.previous;state.previous=input;
 if(!input)state.blocked=false;
 if(!c||c.hp<=0){if(c)dropBarrier(c,'destroyed');p.grip=false;return null;}
 if(!input||p.attached){if(c.held)dropBarrier(c,p.attached?'attached':'released');p.grip=false;}
 else if(edge&&!state.blocked&&Math.hypot(c.x-p.x,c.y-p.y)<=COVER_TUNING.acquireDistance){c.held=true;p.grip=true;}
 c.hover+=( (c.held?COVER_TUNING.hoverHeight:0)-(c.hover||0))*Math.min(1,dt*14);
 if(!c.held){p.grip=false;return null;}
 p.grip=true;
 const distance=clamp(reach,COVER_TUNING.gripReachMin,COVER_TUNING.gripReachMax),currentRadius=Math.hypot(c.x-p.x,c.y-p.y),currentAngle=Math.atan2(c.y-p.y,c.x-p.x);
 // Orbit around the holder instead of taking a straight shortcut through her
 // on a 180-degree aim change. Every intermediate corner still gets swept.
 const angleStep=clamp(deltaAngle(p.aim,currentAngle),-COVER_TUNING.turnSpeed*dt,COVER_TUNING.turnSpeed*dt),orbit=currentAngle+angleStep;
 const nextRadius=currentRadius+(distance-currentRadius)*(1-Math.exp(-COVER_TUNING.gripResponse*dt));
 const tx=p.x+Math.cos(orbit)*nextRadius,ty=p.y+Math.sin(orbit)*nextRadius;
 const dx=tx-c.x,dy=ty-c.y,len=Math.hypot(dx,dy),travel=Math.min(len,COVER_TUNING.gripSpeed*dt);
 const mx=len?dx/len*travel:0,my=len?dy/len*travel:0,nextAngle=Math.atan2(c.y+my-p.y,c.x+mx-p.x),da=clamp(deltaAngle(barrierAngle(nextAngle),c.a),-COVER_TUNING.turnSpeed*dt,COVER_TUNING.turnSpeed*dt);
 const radius=Math.hypot(c.w,c.h)/2,speed=(travel+Math.abs(da)*radius)/dt,steps=Math.max(1,Math.ceil((travel+Math.abs(da)*radius)/COVER_TUNING.sweepStep));
 const start={x:c.x,y:c.y,a:c.a};
 for(let i=1;i<=steps;i++){
  const candidate={...c,x:start.x+mx*i/steps,y:start.y+my*i/steps,a:start.a+da*i/steps};
  // Identity exclusion is explicit: the candidate is a new object during sweep.
  const hit=blockedCover(candidate,covers.filter(o=>o!==c),actors,bounds);
  if(hit){
   dropBarrier(c,'impact');p.grip=false;state.blocked=true;
   // Player contact never spends integrity: it is a constraint, not an attack.
   const damage=hit.actor===p||speed<COVER_TUNING.impactThreshold?0:clamp(Math.round(18+(speed-COVER_TUNING.impactThreshold)*.12),COVER_TUNING.impactMin,COVER_TUNING.impactMax);
   if(damage){c.hp=Math.max(0,c.hp-damage);c.impactCount++;c.lastImpactAt=now;c.impactSide=deltaAngle(p.aim,c.a);}
   return {kind:'impact',hit:hit.kind,damage,speed,x:c.x,y:c.y,destroyed:c.hp<=0};
  }
  c.x=candidate.x;c.y=candidate.y;c.a=candidate.a;
 }
 c.groundTravel+=travel;
 return {kind:'moving',distance:travel,speed};
}
