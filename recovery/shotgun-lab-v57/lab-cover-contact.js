// Movement Lab only. World coordinates: +x right, +y down; cover angles clockwise.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const APPROVED_MOVEMENT=Object.freeze({speed:262,response:13,stopDrag:.002,slideSpeed:650,slideDuration:.70,slideDrag:.12,radius:17,artCell:250,groundAnchor:219,fixedStep:1/60});
export function localPoint(c,x,y){const ca=Math.cos(c.a),sa=Math.sin(c.a),dx=x-(c.px??c.x),dy=y-(c.py??c.y);return{x:dx*ca+dy*sa,y:-dx*sa+dy*ca}}
export function worldPoint(c,x,y){const ca=Math.cos(c.a),sa=Math.sin(c.a);return{x:(c.px??c.x)+x*ca-y*sa,y:(c.py??c.y)+x*sa+y*ca}}
export function coverFace(c,p){
 const q=localPoint(c,p.x,p.y),hw=c.w/2,hh=c.h/2,px=clamp(q.x,-hw,hw),py=clamp(q.y,-hh,hh);
 let face;if(Math.abs(q.x)>hw&&Math.abs(q.y)>hh){face=Math.abs(q.x)-hw>Math.abs(q.y)-hh?(q.x<0?'left':'right'):(q.y<0?'top':'bottom')}
 else if(Math.abs(q.x)>hw)face=q.x<0?'left':'right';else if(Math.abs(q.y)>hh)face=q.y<0?'top':'bottom';
 else{const ds=[q.x+hw,hw-q.x,q.y+hh,hh-q.y];face=['left','right','top','bottom'][ds.indexOf(Math.min(...ds))]}
 const vertical=face==='left'||face==='right',sign=face==='left'||face==='top'?-1:1,ca=Math.cos(c.a),sa=Math.sin(c.a);
 return{face,offset:clamp(vertical?q.y:q.x,-(vertical?hh:hw),vertical?hh:hw),half:vertical?hh:hw,
  nx:vertical?sign*ca:-sign*sa,ny:vertical?sign*sa:sign*ca,tx:vertical?-sa:ca,ty:vertical?ca:sa,
  gap:Math.hypot(q.x-px,q.y-py)-p.r};
}
export function placeOnCover(p){
 const c=p.attached,a=p.coverAnchor;if(!c||!a)return;
 const vertical=a.face==='left'||a.face==='right',sign=a.face==='left'||a.face==='top'?-1:1,half=vertical?c.h/2:c.w/2;
 a.offset=clamp(a.offset,-half,half);a.half=half;
 const ca=Math.cos(c.a),sa=Math.sin(c.a);a.nx=vertical?sign*ca:-sign*sa;a.ny=vertical?sign*sa:sign*ca;a.tx=vertical?-sa:ca;a.ty=vertical?ca:sa;
 const q=worldPoint(c,vertical?sign*(c.w/2+p.r+.5):a.offset,vertical?a.offset:sign*(c.h/2+p.r+.5));p.x=q.x;p.y=q.y;
}
export function attachCover(p,c,now){
 if(!c||c.hp<=0||now<(p.coverLockUntil||0))return false;
 p.coverAnchor=coverFace(c,p);p.attached=c;p.slideUntil=0;p.vx=p.vy=0;p.coverSpeed=0;p.contactAt=now;p.contactUntil=now+.22;p.side=p.coverAnchor.offset<0?-1:1;p.peek=false;
 placeOnCover(p);return true;
}
export function releaseCover(p,now,reason='destroyed'){
 p.attached=null;p.coverAnchor=null;p.coverSpeed=0;p.contactUntil=0;p.peek=false;p.vx=p.vy=0;p.recoveryUntil=now+.22;p.releaseReason=reason;
}
export function kickOffCover(p,now,ix=0,iy=0){
 if(!p.attached||!p.coverAnchor)return false;
 const a=p.coverAnchor,tangent=clamp(ix*a.tx+iy*a.ty,-1,1)*.45,dx=a.nx+a.tx*tangent,dy=a.ny+a.ty*tangent,len=Math.hypot(dx,dy);
 releaseCover(p,now,'kick');p.vx=dx/len*APPROVED_MOVEMENT.slideSpeed;p.vy=dy/len*APPROVED_MOVEMENT.slideSpeed;
 p.slideUntil=now+APPROVED_MOVEMENT.slideDuration;p.kickUntil=p.slideUntil;p.coverLockUntil=now+APPROVED_MOVEMENT.slideDuration;
 return true;
}
export function moveOnCover(p,ix,iy,dt,aim){
 const a=p.coverAnchor;if(!a||!p.attached)return;
 const along=ix*a.tx+iy*a.ty;
 p.coverSpeed+=(along*APPROVED_MOVEMENT.speed-p.coverSpeed)*Math.min(1,dt*APPROVED_MOVEMENT.response);
 if(Math.abs(along)<.001)p.coverSpeed*=Math.pow(APPROVED_MOVEMENT.stopDrag,dt);
 const before=a.offset;a.offset=clamp(a.offset+p.coverSpeed*dt,-a.half,a.half);if(a.offset===before)p.coverSpeed=0;
 p.vx=a.tx*p.coverSpeed;p.vy=a.ty*p.coverSpeed;placeOnCover(p);
 const forward=Math.cos(aim)*a.nx+Math.sin(aim)*a.ny;
 p.peek=forward<.2;p.peekEdge=Math.abs(a.offset)>a.half-p.r;p.side=a.offset<0?-1:1;
}
export function slideContact(p,c,now){
 if(p.attached||p.slideUntil<=now||now<(p.coverLockUntil||0))return false;
 const a=coverFace(c,p);return a.gap<=1.5&&p.vx*a.nx+p.vy*a.ny<-1&&attachCover(p,c,now);
}
export function insideCover(c,x,y,pad=0){const q=localPoint(c,x,y);return Math.abs(q.x)<=c.w/2+pad&&Math.abs(q.y)<=c.h/2+pad}
// A raised muzzle clears this low lab barrier only. Other barriers still intercept the shot.
export function peekMuzzle(p,x,y,dx,dy){
 const c=p.attached;if(!c||!p.peek)return{x,y};
 const from=localPoint(c,p.x,p.y),d={x:dx*Math.cos(c.a)+dy*Math.sin(c.a),y:-dx*Math.sin(c.a)+dy*Math.cos(c.a)};
 let lo=0,hi=Infinity;
 for(const [v,s,h] of [[from.x,d.x,c.w/2+6],[from.y,d.y,c.h/2+6]]){
  if(Math.abs(s)<1e-8){if(Math.abs(v)>h)return{x,y};continue}
  const a=(-h-v)/s,b=(h-v)/s;lo=Math.max(lo,Math.min(a,b));hi=Math.min(hi,Math.max(a,b));
 }
 if(hi<lo||hi<0||!Number.isFinite(hi))return{x,y};
 return{x:p.x+dx*(hi+1),y:p.y+dy*(hi+1)};
}
