import {APPROVED_MOVEMENT as M,coverFace,attachCover,releaseCover,kickOffCover,moveOnCover,slideContact,insideCover,localPoint} from './lab-cover-contact.js';
import {createBarrier,extendSlideToCover,updateBarrierGrip} from './lab-psychic-cover.js';
import {LAB_WORLD as W} from './combat-lab-space.js';
import {selectLabPose} from './lab-pose.js';
import {PISTOL_SOCKETS} from './lab-pistol-sockets.js';
import {beginCoverExit,stepCoverExit} from './lab-cover-exits.js';
import {BURST_RULES,startShotgunBurst,advanceShotgunBurst,cancelShotgunBurst} from './lab-shotgun-burst.js';
export const LAB_PROTOCOL='shotgun-next-1';
export {M as LAB_MOVEMENT};
export const SHOT_RULES=Object.freeze({shotgun:{cooldown:.48,speed:780,damage:18,coverDamage:24,radius:4},pistol:{cooldown:.16,speed:780,damage:7,coverDamage:7,radius:2}});
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),num=(v,d=0)=>Number.isFinite(v)?v:d;
export function labInput(a={}){let x=clamp(num(a.x),-1,1),y=clamp(num(a.y),-1,1),len=Math.hypot(x,y);if(len>1){x/=len;y/=len}return {seq:clamp(Math.floor(num(a.seq)),0,2147483647),x,y,aim:Math.atan2(Math.sin(num(a.aim)),Math.cos(num(a.aim))),targetZ:clamp(num(a.targetZ,70),5,180),targetX:clamp(num(a.targetX,1200),-500,2900),targetY:clamp(num(a.targetY,900),-500,2300),trigger:clamp(Math.floor(num(a.trigger)),0,2147483647),fire:a.fire===true,grip:a.grip===true,slide:clamp(Math.floor(num(a.slide)),0,2147483647),attach:clamp(Math.floor(num(a.attach)),0,2147483647),compile:clamp(Math.floor(num(a.compile)),0,2147483647),weapon:a.weapon==='pistol'?'pistol':'shotgun'};}
export function createLabPlayer(id,x,y,aim=0){return {id,x,y,vx:0,vy:0,r:17,aim,hp:100,weapon:'shotgun',state:'idle',stateAt:0,fireAt:0,lastShotAt:-100,slideUntil:0,travel:0,attached:null,grip:false,gripState:{previous:false,blocked:false},edges:{slide:0,attach:0,compile:0},poseDirections:{}};}
export function legacyPose(p,now){const rear=Math.sin(p.aim)<-.08;let action='fire',frame=Math.floor(now*4)%5;if(p.state==='run'){action='run';frame=Math.floor(p.travel/13)%24}else if(now<p.slideUntil){action='slide';frame=clamp(Math.floor((now-p.slideStartedAt)/M.slideDuration*24),0,23)}else if(now-p.lastShotAt<.42){frame=clamp(Math.floor((now-p.lastShotAt)/.026),0,23)}const names={run:['hero-run-pistol-24-front-right-v1.png','hero-run-pistol-24-rear-right-v1.png'],slide:['hero-slide-cover-pistol-24-front-right-v1.png','hero-slide-cover-pistol-24-rear-right-v1.png'],fire:['hero-weapons-pistol-24-front-right-v1.png','hero-weapons-pistol-24-rear-right-v1.png']};return{name:names[action][rear?1:0],frame,rear,key:action};}
export function muzzleSocket(p,now){
 const spec=p.weapon==='shotgun'?selectLabPose(p,now):legacyPose(p,now);let dx,dy,review;
 if(p.weapon==='shotgun'&&spec?.muzzle){dx=spec.muzzle.x-spec.anchor[0];dy=spec.muzzle.y-spec.anchor[1];review=spec.muzzle.review}
 else if(p.weapon==='pistol'&&PISTOL_SOCKETS[spec.name]?.[spec.frame]){const s=PISTOL_SOCKETS[spec.name][spec.frame];dx=s.x;dy=s.y;review=s.review}
 else {dx=Math.cos(p.aim)*44;dy=(now<p.slideUntil?-45:-115)+Math.sin(p.aim)*25;review='unregistered-fallback'}
 const x=p.x+dx,y=p.y+Math.sin(p.aim)*40,z=y-(p.y+dy);
 return {x,y,z,screenX:x,screenY:y-z,review,family:spec?.family||spec?.name,frame:spec?.frame||0};
}
export function resolveLabActor(p,covers,now,onContact=()=>{}){
 for(const c of covers){if(c.hp<=0)continue;if(!c.held&&slideContact(p,c,now)){onContact(c);break}if(p.attached)break;
 const q=localPoint(c,p.x,p.y),qx=clamp(q.x,-c.w/2,c.w/2),qy=clamp(q.y,-c.h/2,c.h/2),ca=Math.cos(c.a),sa=Math.sin(c.a),wx=c.x+qx*ca-qy*sa,wy=c.y+qx*sa+qy*ca,dx=p.x-wx,dy=p.y-wy,d=Math.hypot(dx,dy);
 if(d<p.r){const f=coverFace(c,p),deep=d<.001,nx=deep?f.nx:dx/d,ny=deep?f.ny:dy/d,push=deep?(f.face==='left'||f.face==='right'?c.w/2-Math.abs(q.x):c.h/2-Math.abs(q.y))+p.r:p.r-d;p.x+=nx*push;p.y+=ny*push;p.vx*=.35;p.vy*=.35;}
 }
}
function setState(p,state,now){if(p.state!==state){p.state=state;p.stateAt=now}}
export function stepLabMovement(p,input,dt,now,covers,onEvent=()=>{}){
 const a=labInput(input),ox=p.x,oy=p.y;p.aim=a.aim;p.weapon=a.weapon;p.moveInput=Math.hypot(a.x,a.y)>.001;
 if(p.attached&&(!covers.includes(p.attached)||p.attached.hp<=0)){releaseCover(p,now);onEvent('release',p)}
 const edge=a.slide>p.edges.slide;p.edges.slide=Math.max(p.edges.slide,a.slide);
 if(edge){if(p.attached){const exit=beginCoverExit(p,now,a.x,a.y,covers,W);if(exit.kind==='dash'){setState(p,'dash',now);onEvent('edge-dash',p,{end:exit.end})}else if(exit.kind==='kick'){setState(p,'slide',now);onEvent('kick',p)}else onEvent('exit-blocked',p,{reason:exit.reason});}
 else if(!p.exit&&now>=p.slideUntil&&p.moveInput){p.slideUntil=now+M.slideDuration;p.slideStartedAt=now;p.slideBaseUntil=p.slideUntil;p.slideExtensionUsed=false;p.slideCapture=null;p.kickUntil=0;p.vx=a.x*M.slideSpeed;p.vy=a.y*M.slideSpeed;p.slideFacing=Math.atan2(a.y,a.x);setState(p,'slide',now);onEvent('slide',p)}}
 if(a.attach>p.edges.attach&&!p.attached){const c=covers.filter(c=>!c.held&&c.hp>0&&coverFace(c,p).gap<28).sort((a,b)=>coverFace(a,p).gap-coverFace(b,p).gap)[0];if(c&&attachCover(p,c,now))onEvent('contact',p)}p.edges.attach=Math.max(p.edges.attach,a.attach);
 if(p.exit){stepCoverExit(p,a,dt,now,covers,W);p.frameMoved=Math.hypot(p.x-ox,p.y-oy);p.travel+=p.frameMoved;if(p.frameMoved>.04)p.moveFacing=Math.atan2(p.y-oy,p.x-ox);if(!p.exit)setState(p,p.moveInput?'run':'idle',now);selectLabPose(p,now);return;}
 const capture=extendSlideToCover(p,covers,now,W);if(capture)onEvent('capture',p,{distance:capture.distance,duration:capture.duration});
 if(p.attached){const peek=p.peek;moveOnCover(p,a.x,a.y,dt,p.aim);if(peek&&!p.peek)p.peekEndedAt=now;setState(p,'cover',now)}
 else{
 if(now<p.slideUntil){p.vx*=Math.pow(M.slideDrag,dt);p.vy*=Math.pow(M.slideDrag,dt)}
 else{p.vx+=(a.x*M.speed-p.vx)*Math.min(1,dt*M.response);p.vy+=(a.y*M.speed-p.vy)*Math.min(1,dt*M.response);if(!p.moveInput){p.vx*=Math.pow(M.stopDrag,dt);p.vy*=Math.pow(M.stopDrag,dt)}if(p.state==='slide')p.recoveryUntil=now+.18;setState(p,p.moveInput?'run':'idle',now)}
 p.x=clamp(p.x+p.vx*dt,W.minX,W.maxX);p.y=clamp(p.y+p.vy*dt,W.minY,W.maxY);resolveLabActor(p,covers,now,()=>{setState(p,'cover',now);onEvent('contact',p)});
 }
 p.frameMoved=Math.hypot(p.x-ox,p.y-oy);p.travel+=p.frameMoved;if(p.frameMoved>.04)p.moveFacing=Math.atan2(p.y-oy,p.x-ox);selectLabPose(p,now);
}
export function coverHeight(c){return 76+(c.hover||0)}
export function targetHeight(p,now){return p.attached&&!p.peek?58:now<p.slideUntil?55:155}
// Swept 3D segment against a rotated cover box or upright character cylinder.
export function rayCover(b,dx,dy,dz,c){const q=localPoint(c,b.x,b.y),ca=Math.cos(c.a),sa=Math.sin(c.a),v=[dx*ca+dy*sa,-dx*sa+dy*ca,dz];let lo=0,hi=1;for(const [i,min,max] of [[0,-c.w/2,c.w/2],[1,-c.h/2,c.h/2],[2,0,coverHeight(c)]]){const x=[q.x,q.y,b.z][i],d=v[i];if(Math.abs(d)<1e-9){if(x<min||x>max)return null}else{const a=(min-x)/d,z=(max-x)/d;lo=Math.max(lo,Math.min(a,z));hi=Math.min(hi,Math.max(a,z));if(lo>hi)return null}}return lo;}
export function rayActor(b,dx,dy,dz,p,now){let lo=0,hi=1;const x=b.x-p.x,y=b.y-p.y,r=p.r+b.r,A=dx*dx+dy*dy,B=2*(x*dx+y*dy),C=x*x+y*y-r*r;if(A<1e-12){if(C>0)return null}else{const D=B*B-4*A*C;if(D<0)return null;lo=Math.max(lo,(-B-Math.sqrt(D))/(2*A));hi=Math.min(hi,(-B+Math.sqrt(D))/(2*A))}const height=targetHeight(p,now);if(Math.abs(dz)<1e-9){if(b.z<0||b.z>height)return null}else{const a=-b.z/dz,z=(height-b.z)/dz;lo=Math.max(lo,Math.min(a,z));hi=Math.min(hi,Math.max(a,z))}return lo<=hi?lo:null;}
export class LabDuel{
 constructor({practice=false}={}){this.s={time:0,phase:practice?'practice':'countdown',countdown:3,remaining:30,roundId:Array.from(crypto.getRandomValues(new Uint8Array(16)),v=>v.toString(16).padStart(2,'0')).join(''),winner:null,players:[createLabPlayer(0,900,960,0),createLabPlayer(1,1430,970,Math.PI)],covers:[{id:'fixed-0',x:800,y:720,w:250,h:64,a:0,hp:180,max:180,kind:'fixed'},{id:'fixed-1',x:1510,y:690,w:260,h:64,a:0,hp:180,max:180,kind:'fixed'},{id:'fixed-2',x:1160,y:1210,w:280,h:68,a:.05,hp:220,max:220,kind:'fixed'}],bullets:[],events:[],eventId:0,shotId:0,burstId:0,protocol:LAB_PROTOCOL};this.s.players.forEach(p=>p.input=labInput({aim:p.aim}));}
 emit(kind,p,extra={}){this.s.events.push({id:++this.s.eventId,kind,player:p?.id,x:p?.x,y:p?.y,time:this.s.time,...extra});if(this.s.events.length>40)this.s.events.shift()}
 pack(){return JSON.stringify(this.s,(k,v)=>['attached','slideCapture'].includes(k)?v?.id||null:v)}
 static unpack(text){const g=Object.create(LabDuel.prototype);g.s=JSON.parse(text);for(const p of g.s.players){p.attached=g.s.covers.find(c=>c.id===p.attached)||null;p.slideCapture=g.s.covers.find(c=>c.id===p.slideCapture)||null}return g}
 snapshot(){return JSON.parse(this.pack())}
 update(dt,inputs){const s=this.s;s.time+=dt;inputs=s.players.map((p,i)=>labInput(inputs[i]||{}));
 if(s.phase==='finished'){for(const p of s.players)cancelShotgunBurst(p,'round-finished');return;}
 if(s.phase==='countdown'){s.countdown=Math.max(0,s.countdown-dt);s.players.forEach((p,i)=>{p.input=inputs[i];p.edges={slide:inputs[i].slide,attach:inputs[i].attach,compile:inputs[i].compile,trigger:inputs[i].trigger};p.aim=inputs[i].aim;p.fireHeld=inputs[i].fire});if(s.countdown<=0)s.phase='fight';return;}
 for(const p of s.players){const a=inputs[p.id];p.input=a;const covers=s.covers.filter(c=>c.hp>0);stepLabMovement(p,a,dt,s.time,covers,(kind,actor,extra)=>this.emit(kind,actor,extra));
 if(a.compile>p.edges.compile&&!p.attached){const c=createBarrier(p,s.time,covers,s.players,W);if(c){const old=s.covers.find(c=>c.owner===p.id);if(old)old.hp=0;Object.assign(c,{id:'built-'+p.id,owner:p.id});s.covers=s.covers.filter(c=>c.owner!==p.id);s.covers.push(c);p.gripState={previous:false,blocked:false};this.emit('compile',p,{cover:c.id})}else this.emit('placement-blocked',p)}p.edges.compile=Math.max(p.edges.compile,a.compile);
 const own=s.covers.find(c=>c.owner===p.id&&c.hp>0);const result=updateBarrierGrip(own,p,a.grip,Math.hypot(a.targetX-p.x,a.targetY-p.y),dt,s.time,s.covers.filter(c=>c.hp>0),s.players,W,p.gripState);if(result?.damage)this.emit('cover-impact',p,{damage:result.damage});if(own)own.dir=((Math.round(own.a/Math.PI*12)%24)+24)%24;
 const fresh=a.trigger>(p.edges.trigger||0)||(a.fire&&!p.fireHeld);
 if(p.weapon==='shotgun'){if(fresh&&startShotgunBurst(p,s.time,s.burstId+1))s.burstId++;advanceShotgunBurst(p,s.time,shot=>this.discharge(p,a,shot));}
 else{cancelShotgunBurst(p,'weapon-change');if(a.fire||fresh)this.fire(p,a);}
 p.fireHeld=a.fire;p.edges.trigger=Math.max(p.edges.trigger||0,a.trigger);
 }
 this.projectiles(dt);
 if(s.phase==='practice'){for(const p of s.players)if(p.hp<=0){p.hp=100;p.x=p.id?1430:900;p.y=p.id?970:960;p.vx=p.vy=0;p.exit=null;p.slideUntil=p.kickUntil=0;cancelShotgunBurst(p,'defeat');releaseCover(p,s.time);this.emit('respawn',p)}}
 else{s.remaining=Math.max(0,s.remaining-dt);if(s.players.some(p=>p.hp<=0)||s.remaining<=0){s.phase='finished';for(const p of s.players){cancelShotgunBurst(p,'round-finished');p.exit=null;}s.winner=s.players[0].hp===s.players[1].hp?null:s.players[0].hp>s.players[1].hp?0:1;this.emit('finished',null,{winner:s.winner})}}
 }
 fire(p,a){const r=SHOT_RULES[p.weapon];if(this.s.time<p.fireAt)return;p.fireAt=this.s.time+r.cooldown;this.discharge(p,a);}
 discharge(p,a,burstShot=null){const s=this.s,r={...SHOT_RULES[p.weapon],...(burstShot||{})};p.lastShotAt=s.time;const m=muzzleSocket(p,s.time);let dx=a.targetX-m.x,dy=a.targetY-m.y,len=Math.hypot(dx,dy);if(len<5){dx=Math.cos(p.aim)*600;dy=Math.sin(p.aim)*600;len=600}const zTarget=a.targetZ,dz=(zTarget-m.z)/Math.max(len,100)*r.speed;
 const b={id:++s.shotId,x:m.x,y:m.y,z:m.z,vx:dx/len*r.speed,vy:dy/len*r.speed,vz:dz,life:1.8,owner:p.id,r:r.radius,weapon:p.weapon,damage:r.damage,coverDamage:r.coverDamage,...(burstShot||{})};
 // Test the short bore segment as well: a muzzle extending through nearby
 // solid cover cannot teleport a round to the far side of that cover.
 const start={x:p.x,y:p.y,z:m.z,r:b.r},hit=s.covers.filter(c=>c.hp>0).map(c=>({c,t:rayCover(start,m.x-p.x,m.y-p.y,0,c)})).filter(h=>h.t!==null).sort((a,b)=>a.t-b.t)[0];
 if(hit){hit.c.hp=Math.max(0,hit.c.hp-r.coverDamage);this.emit('impact',p,{x:p.x+(m.x-p.x)*hit.t,y:p.y+(m.y-p.y)*hit.t-m.z,cover:hit.c.id});return}
 s.bullets.push(b);if(s.bullets.length>100)s.bullets.shift();this.emit('shot',p,{x:m.x,y:m.y-m.z,weapon:p.weapon,family:m.family,frame:m.frame,socket:m.review,burstId:burstShot?.burstId,subShot:burstShot?.subShot});
 }
 projectiles(dt){const s=this.s;for(const b of s.bullets){const dx=b.vx*dt,dy=b.vy*dt,dz=b.vz*dt,hits=[];for(const c of s.covers){if(c.hp<=0)continue;const t=rayCover(b,dx,dy,dz,c);if(t!==null)hits.push({t,c})}const p=s.players[1-b.owner],t=rayActor(b,dx,dy,dz,p,s.time);if(t!==null)hits.push({t,p});hits.sort((a,b)=>a.t-b.t);const hit=hits[0];if(hit){b.x+=dx*hit.t;b.y+=dy*hit.t;b.z+=dz*hit.t;b.life=0;const r={...SHOT_RULES[b.weapon],damage:b.damage??SHOT_RULES[b.weapon].damage,coverDamage:b.coverDamage??SHOT_RULES[b.weapon].coverDamage};if(hit.c)hit.c.hp=Math.max(0,hit.c.hp-r.coverDamage);else hit.p.hp=Math.max(0,hit.p.hp-r.damage);this.emit('impact',s.players[b.owner],{x:b.x,y:b.y-b.z,target:hit.p?.id,cover:hit.c?.id})}else{b.x+=dx;b.y+=dy;b.z+=dz;b.life-=dt;if(b.z<0)b.life=0}}
 s.bullets=s.bullets.filter(b=>b.life>0);
 }
}
