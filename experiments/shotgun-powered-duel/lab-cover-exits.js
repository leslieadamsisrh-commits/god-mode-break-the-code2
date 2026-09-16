// New experiment rules; approved Version 57 source is kept under recovery/.
import {APPROVED_MOVEMENT as M,localPoint,placeOnCover,releaseCover} from './lab-cover-contact.js';
export const EXIT_TUNING=Object.freeze({edgeReach:56,clearance:3,speed:600,followThrough:70,maxDistance:270,maxSeconds:.60,sweepStep:2,reattachSeconds:.18,inputDeadzone:.18});
const length=(x,y)=>Math.hypot(x,y);
export function clearActorPoint(p,x,y,covers,bounds){
 if(bounds&&(x<bounds.minX||x>bounds.maxX||y<bounds.minY||y>bounds.maxY))return false;
 for(const c of covers){if(c.hp<=0)continue;const q=localPoint(c,x,y),dx=Math.max(0,Math.abs(q.x)-c.w/2),dy=Math.max(0,Math.abs(q.y)-c.h/2);if(length(dx,dy)<p.r-.001)return false;}
 return true;
}
export function clearActorSegment(p,a,b,covers,bounds){
 const n=Math.max(1,Math.ceil(length(b.x-a.x,b.y-a.y)/EXIT_TUNING.sweepStep));
 for(let i=1;i<=n;i++)if(!clearActorPoint(p,a.x+(b.x-a.x)*i/n,a.y+(b.y-a.y)*i/n,covers,bounds))return false;
 return true;
}
export function planCoverExit(p,ix,iy,covers,bounds){
 if(!p.attached||!p.coverAnchor)return {kind:'blocked',reason:'not-attached'};
 placeOnCover(p);const c=p.attached,a=p.coverAnchor,len=length(ix,iy),dead=EXIT_TUNING.inputDeadzone;
 const x=len>dead?ix/len:a.nx,y=len>dead?iy/len:a.ny,out=x*a.nx+y*a.ny,tan=x*a.tx+y*a.ty;
 if(len<=dead||out>.18){
  const to={x:p.x+x*8,y:p.y+y*8};
  return clearActorSegment(p,p,to,covers,bounds)?{kind:'kick',dx:x,dy:y}:{kind:'blocked',reason:'retreat-blocked'};
 }
 const preferred=Math.abs(tan)>dead?[Math.sign(tan)]:a.offset===0?[-1,1]:[Math.sign(a.offset),-Math.sign(a.offset)];
 for(const end of preferred){
  const toEnd=a.half-end*a.offset;if(toEnd>EXIT_TUNING.edgeReach)continue;
  const reach=toEnd+p.r+EXIT_TUNING.clearance;
  const first={x:p.x+a.tx*end*reach,y:p.y+a.ty*end*reach};
  const points=[first];
  if(out<-.18){
   const depth=a.face==='left'||a.face==='right'?c.w:c.h;
   points.push({x:first.x-a.nx*(depth+2*p.r+EXIT_TUNING.clearance+1),y:first.y-a.ny*(depth+2*p.r+EXIT_TUNING.clearance+1)});
  }
  const last=points.at(-1);points.push({x:last.x+x*EXIT_TUNING.followThrough,y:last.y+y*EXIT_TUNING.followThrough});
  let start=p,total=0,valid=true;
  for(const next of points){total+=length(next.x-start.x,next.y-start.y);if(!clearActorSegment(p,start,next,covers,bounds)){valid=false;break;}start=next;}
  if(valid&&total<=EXIT_TUNING.maxDistance)return {kind:'dash',points,dx:x,dy:y,end,total,coverId:c.id,coverX:c.x,coverY:c.y,coverA:c.a};
 }
 return {kind:'blocked',reason:'edge-unreachable-or-obstructed'};
}
export function beginCoverExit(p,now,ix,iy,covers,bounds){
 const plan=planCoverExit(p,ix,iy,covers,bounds);
 if(plan.kind==='blocked'){p.exitBlockedUntil=now+.65;return plan;}
 releaseCover(p,now,plan.kind==='dash'?'edge-dash':'kick');p.recoveryUntil=0;p.slideCapture=null;p.slideExtensionUsed=true;
 if(plan.kind==='kick'){
  p.vx=plan.dx*M.slideSpeed;p.vy=plan.dy*M.slideSpeed;p.slideUntil=now+M.slideDuration;p.kickUntil=p.slideUntil;p.slideStartedAt=now;p.slideBaseUntil=p.slideUntil;p.slideFacing=Math.atan2(plan.dy,plan.dx);p.coverLockUntil=p.slideUntil;
 }else{
  p.slideUntil=p.kickUntil=0;p.exit={...plan,index:0,startedAt:now,until:now+EXIT_TUNING.maxSeconds,travel:0};p.coverLockUntil=p.exit.until+EXIT_TUNING.reattachSeconds;p.dashStartedAt=now;p.vx=p.vy=0;
 }
 return plan;
}
function finish(p,now,reason){p.exit=null;p.exitEndReason=reason;p.coverLockUntil=now+EXIT_TUNING.reattachSeconds;if(reason!=='complete')p.vx=p.vy=0;}
export function stepCoverExit(p,input,dt,now,covers,bounds){
 const e=p.exit;if(!e)return false;
 const c=covers.find(c=>c.id===e.coverId&&c.hp>0);
 if(!c||c.held||length(c.x-e.coverX,c.y-e.coverY)>.01||Math.abs(c.a-e.coverA)>.001){finish(p,now,'cover-changed');return true;}
 if(now>=e.until){finish(p,now,'timeout');return true;}
 const inputLength=length(input.x,input.y);
 if(inputLength>EXIT_TUNING.inputDeadzone&&(input.x*e.dx+input.y*e.dy)/inputLength<-.65){finish(p,now,'reversed-input');return true;}
 let remaining=EXIT_TUNING.speed*dt,ox=p.x,oy=p.y;
 // The corner route stays constrained to the checked edge. Once around it,
 // the final leg follows live stick input with another sweep every tick.
 if(e.index===e.points.length-1&&inputLength>EXIT_TUNING.inputDeadzone){
  const left=Math.min(EXIT_TUNING.followThrough,EXIT_TUNING.maxDistance-e.travel);
  e.points[e.index]={x:p.x+input.x/inputLength*left,y:p.y+input.y/inputLength*left};
 }
 while(remaining>.001&&e.index<e.points.length){
  const target=e.points[e.index],dx=target.x-p.x,dy=target.y-p.y,d=length(dx,dy),travel=Math.min(d,remaining,EXIT_TUNING.maxDistance-e.travel);
  if(d<.01){e.index++;continue;}
  const count=Math.max(1,Math.ceil(travel/EXIT_TUNING.sweepStep));
  for(let i=0;i<count;i++){
   const x=p.x+dx/d*travel/count,y=p.y+dy/d*travel/count;
   if(!clearActorPoint(p,x,y,covers,bounds)){finish(p,now,'blocked');return true;}
   p.x=x;p.y=y;e.travel+=travel/count;
  }
  remaining-=travel;
  if(travel>=d-.01)e.index++;
  if(e.travel>=e.total-.01||e.travel>=EXIT_TUNING.maxDistance){finish(p,now,'complete');break;}
 }
 p.vx=(p.x-ox)/dt;p.vy=(p.y-oy)/dt;
 if(p.exit&&e.index>=e.points.length)finish(p,now,'complete');
 return true;
}
