/* V12 08G isolated experimental simulation. Original game.js is not modified. */
(function(root){
'use strict';
const Action=root.JadeAction||(typeof require==='function'?require('./action-controller.js'):null);
if(!Action)throw new Error('Action controller missing');
const DT=1/60, clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
const TUNING=Object.freeze({speed:262,response:13,stopDrag:.002,slideSpeed:650,slideDuration:.70,slideDrag:.12,radius:17,shotCycle:.48,pelletSpeed:780,pellets:7,pelletDamage:18,twistLimit:145*Math.PI/180});
const FINAL=[
 {id:'K01',file:'assets/final/K01.png',width:620,height:809,ground:[125,790],muzzle:[466,397],breech:[240,303]},
 {id:'K02',file:'assets/final/K02.png',width:640,height:809,ground:[145,790],muzzle:[495,403],breech:[270,305]},
 {id:'K03',file:'assets/final/K03.png',width:684,height:809,ground:[163,790],muzzle:[640,213],breech:[290,225]}
];
// Sprite registration is provisional. A source pixel is .205 world units.
const ART_SCALE=.205;
function actor(x=0,y=210){return{x,y,vx:0,vy:0,r:17,hp:100,slide:0,slideFacing:0,cover:null,state:'IDLE',phase:0,aim:0,lowerAim:0,drop:0,impact:0,kick:0,reattach:0,action:'LOW_READY',actionTime:0,raise:0,pose:0,recoil:0,lastShot:-1e9,aimHeld:false,hitReact:0,hitDx:0,hitDy:0};}
function freeMotion(p,input,dt){
 const dx=input.x||0,dy=input.y||0,m=Math.hypot(dx,dy)||1;
 if(input.slide&&!p.cover&&Math.hypot(dx,dy)>.1){p.slide=.70;p.vx=dx/m*650;p.vy=dy/m*650;p.slideFacing=Math.atan2(dy,dx);p.state='SLIDE ENTRY';}
 if(p.slide>0){p.slide-=dt;p.vx*=Math.pow(.12,dt);p.vy*=Math.pow(.12,dt);p.drop+=(1-p.drop)*.18;}
 else{const tx=dx/m*262,ty=dy/m*262,resp=1-Math.exp(-13*dt);p.vx+=(tx-p.vx)*resp;p.vy+=(ty-p.vy)*resp;if(Math.hypot(dx,dy)<.1){p.vx*=Math.pow(.002,dt);p.vy*=Math.pow(.002,dt);}p.drop*=.84;p.state=Math.hypot(dx,dy)>.1?'RUN':'IDLE';}
}
function rectHit(p,r){const qx=clamp(p.x,r.x,r.x+r.w),qy=clamp(p.y,r.y,r.y+r.h);return{dx:p.x-qx,dy:p.y-qy,d:Math.hypot(p.x-qx,p.y-qy)};}
function segmentBox(a,b,r,pad=0){let lo=0,hi=1;for(const [key,mn,mx] of [['x',r.x-pad,r.x+r.w+pad],['y',r.y-pad,r.y+r.h+pad],['z',-pad,(r.height||125)+pad]]){const start=a[key]||0,delta=(b[key]||0)-start;if(Math.abs(delta)<1e-10){if(start<mn||start>mx)return null;continue;}let t0=(mn-start)/delta,t1=(mx-start)/delta;if(t0>t1)[t0,t1]=[t1,t0];lo=Math.max(lo,t0);hi=Math.min(hi,t1);if(lo>hi)return null;}return lo;}
function segmentActor(a,b,p,height=135,radius=18){const dx=b.x-a.x,dy=b.y-a.y,rx=a.x-p.x,ry=a.y-p.y,A=dx*dx+dy*dy,B=2*(rx*dx+ry*dy),C=rx*rx+ry*ry-radius*radius,D=B*B-4*A*C;if(A<1e-10||D<0)return null;const t=clamp((-B-Math.sqrt(D))/(2*A),0,1);if((a.x+dx*t-p.x)**2+(a.y+dy*t-p.y)**2>radius*radius+.001)return null;const z=(a.z||0)+((b.z||0)-(a.z||0))*t;return z>=0&&z<=height?t:null;}
function supported(p){return !!p.cover&&p.cover.id==='station'&&p.cover.face==='south'&&p.cover.edge==='right'&&Math.abs(wrap(p.aim))<=.34;}
function sampleSocket(p,which='muzzle'){if(supported(p)){const f=FINAL[p.pose];return{x:p.x+(f[which][0]-f.ground[0])*ART_SCALE,y:p.y,z:(f.ground[1]-f[which][1])*ART_SCALE,status:'provisional-final-socket'};}const len=which==='breech'?7:30;return{x:p.x+Math.cos(p.aim)*len,y:p.y+Math.sin(p.aim)*len,z:p.slide>0?38:78,status:'provisional-recovered-socket'};}
class World{
 socket(p=this.p,which="muzzle"){return sampleSocket(p,which);}
 constructor(options={}){this.options={...options};this.reset(options.start||'corner');}
 reset(start='corner'){
 this.time=0;this.tick=0;this.p=actor();this.shots=[];this.effects=[];this.events=[];this.inputs=[];this.shotId=0;this.metrics={shots:0,blocked:0,hits:0,contacts:0};this.mode=this.options.mode||'stationary';this.invulnerable=true;
 this.covers=[{id:'station',x:-150,y:-65,w:220,h:42,height:152},{id:'left',x:-430,y:75,w:150,h:38,height:98},{id:'rear',x:-150,y:-245,w:150,h:35,height:112},{id:'right',x:255,y:130,w:145,h:36,height:100}];
 this.target={x:345,y:0,vx:0,vy:0,hp:100,r:18,phase:0,shotAt:.8,deadUntil:0};
 if(start==='corner'){this.attach(this.covers[0],'south');this.p.x=this.covers[0].x+this.covers[0].w-19;this.place();this.p.impact=0;}
 else{this.p.x=-45;this.p.y=205;this.p.aim=-Math.PI/2;}
 this.target.y=this.covers[0].y+this.covers[0].h+18;this.emit('reset',{start});
 }
 emit(type,data={}){this.events.push({tick:this.tick,t:+this.time.toFixed(4),type,...data});if(this.events.length>2400)this.events.shift();}
 attach(r,face){this.p.cover={id:r.id,face,edge:null};this.p.slide=0;this.p.vx=this.p.vy=0;this.p.impact=.18;this.p.state='COVER IMPACT';this.place();this.metrics.contacts++;this.emit('cover_contact',{cover:r.id,face});}
 place(){const p=this.p,c=p.cover;if(!c)return;const r=this.covers.find(r=>r.id===c.id);if(!r){this.detach();return;}const d=p.r+1,limit=p.r+2;
 if(c.face==='south'||c.face==='north'){p.y=c.face==='south'?r.y+r.h+d:r.y-d;p.x=clamp(p.x,r.x+limit,r.x+r.w-limit);c.edge=p.x>=r.x+r.w-limit-.01?'right':p.x<=r.x+limit+.01?'left':null;}
 else{p.x=c.face==='east'?r.x+r.w+d:r.x-d;p.y=clamp(p.y,r.y+limit,r.y+r.h-limit);c.edge=p.y>=r.y+r.h-limit-.01?'bottom':p.y<=r.y+limit+.01?'top':null;}}
 detach(kick=false,input={}){const p=this.p,c=p.cover;if(!c)return;let nx=0,ny=0;if(c.face==='south')ny=1;if(c.face==='north')ny=-1;if(c.face==='east')nx=1;if(c.face==='west')nx=-1;p.cover=null;Action.interrupt(p,'explicit-cover-exit',(type,data)=>this.emit(type,data));p.reattach=.22;
 if(kick){p.vx=nx*430+((input.x||0)-nx*((input.x||0)*nx+(input.y||0)*ny))*180;p.vy=ny*430+((input.y||0)-ny*((input.x||0)*nx+(input.y||0)*ny))*180;p.kick=.13;}this.emit('cover_exit',{kick});}
 collide(p,allowAttach){for(const r of this.covers){let q=rectHit(p,r);if(q.d>=p.r)continue;let nx=0,ny=0;if(q.d>.001){if(Math.abs(q.dx)>=Math.abs(q.dy))nx=Math.sign(q.dx);else ny=Math.sign(q.dy);}else{const f=[{d:p.x-r.x,nx:-1,ny:0},{d:r.x+r.w-p.x,nx:1,ny:0},{d:p.y-r.y,nx:0,ny:-1},{d:r.y+r.h-p.y,nx:0,ny:1}].sort((a,b)=>a.d-b.d)[0];nx=f.nx;ny=f.ny;}
 if(nx<0)p.x=r.x-p.r-1;if(nx>0)p.x=r.x+r.w+p.r+1;if(ny<0)p.y=r.y-p.r-1;if(ny>0)p.y=r.y+r.h+p.r+1;
 const dot=p.vx*nx+p.vy*ny;if(dot<0){p.vx-=dot*nx;p.vy-=dot*ny;}
 if(allowAttach&&p.slide>0&&p.reattach<=0){this.attach(r,nx<0?'west':nx>0?'east':ny<0?'north':'south');break;}}}
 movement(i,dt){const p=this.p;const dx=i.x||0,dy=i.y||0;p.reattach=Math.max(0,p.reattach-dt);p.impact=Math.max(0,p.impact-dt);
 const moveA=Math.hypot(dx,dy)>.1?Math.atan2(dy,dx):p.lowerAim,delta=wrap(p.aim-p.lowerAim),lim=TUNING.twistLimit;if(Math.abs(delta)>lim)p.lowerAim+=Math.sign(delta)*(Math.abs(delta)-lim)*.15;else if(Math.hypot(dx,dy)>.1)p.lowerAim+=wrap(moveA-p.lowerAim)*.12;
 if(i.attach&&p.cover)this.detach(false);
 else if(i.attach&&!p.cover){let hit=this.covers.map(r=>({r,q:rectHit(p,r)})).filter(v=>v.q.d<42).sort((a,b)=>a.q.d-b.q.d)[0];if(hit){const {r,q}=hit;this.attach(r,Math.abs(q.dx)>Math.abs(q.dy)?q.dx>0?'east':'west':q.dy>0?'south':'north');}}
 if(p.cover){const c=p.cover,horizontal=c.face==='south'||c.face==='north';p.vx=horizontal?dx*262:0;p.vy=horizontal?0:dy*262;p.x+=p.vx*dt;p.y+=p.vy*dt;const before={x:p.x,y:p.y};this.place();if(before.x!==p.x)p.vx=0;if(before.y!==p.y)p.vy=0;p.drop+=(1-p.drop)*.25;p.state=p.impact>0?'COVER IMPACT':c.edge?'CORNER '+c.edge.toUpperCase():'COVER SHIMMY';if(i.slide)this.detach(true,i);}
 else{if(p.kick>0){p.kick-=dt;p.vx*=Math.pow(.12,dt);p.vy*=Math.pow(.12,dt);p.state='COVER KICK';}else freeMotion(p,i,dt);
 // Substeps make collision crossing reliable, but preserve the free-ground total delta.
 const n=Math.max(1,Math.ceil(Math.hypot(p.vx,p.vy)*dt/6));for(let k=0;k<n;k++){p.x+=p.vx*dt/n;p.y+=p.vy*dt/n;this.collide(p,true);if(p.cover)break;}
 p.x=clamp(p.x,-520,520);p.y=clamp(p.y,-300,330);}
 p.phase+=Math.hypot(p.vx,p.vy)*dt*.045;
 }
 action(i,dt){Action.update(this.p,i,dt,supported(this.p),(type,data)=>this.emit(type,data));}

 fire(enemy=false){const p=enemy?this.target:this.p;if(!enemy&&this.time-p.lastShot<TUNING.shotCycle-1e-8)return false;
 if(!enemy&&supported(p)){p.pose=2;p.raise=1;} // No new firing delay to wait for a missing animation.
 const a=enemy?Math.atan2(this.p.y-p.y,this.p.x-p.x):p.aim;
 const start=enemy?{x:p.x+Math.cos(a)*26,y:p.y+Math.sin(a)*26,z:90}:this.socket(p),breech=enemy?{x:p.x,y:p.y,z:90}:this.socket(p,'breech');
 if(!enemy)p.lastShot=this.time;
 if(this.covers.some(r=>segmentBox(breech,start,r,1)!==null)){if(!enemy)this.metrics.blocked++;this.emit('blocked_muzzle',{enemy,x:start.x,y:start.y});return false;}
 const id=++this.shotId,n=enemy?1:7;for(let j=0;j<n;j++){const angle=a+(enemy?0:(j-3)*.04);this.shots.push({id,enemy,x:start.x,y:start.y,z:start.z,vx:Math.cos(angle)*780,vy:Math.sin(angle)*780,life:enemy?1.4:.45});}
 this.effects.push({...start,type:'muzzle',life:.1});if(!enemy){Action.shot(p,supported(p),(type,data)=>this.emit(type,data));this.metrics.shots++;}this.emit('shot',{id,enemy,origin:start,pose:!enemy?FINAL[p.pose].id:null,pellets:n});return true;}
 targets(dt){const b=this.target;if(this.mode==='none')return;if(b.hp<=0){if(this.time>=b.deadUntil)b.hp=100;else return;}b.phase+=dt;
 if(this.mode==='moving'||this.mode==='attack'){b.y=this.covers[0].y+this.covers[0].h+18+Math.sin(b.phase*1.2)*115;b.x=345+Math.sin(b.phase*.6)*20;}
 if(this.mode==='attack'&&this.time>=b.shotAt){this.fire(true);b.shotAt=this.time+1.1;}}
 projectiles(dt){for(const s of this.shots){const a={x:s.x,y:s.y,z:s.z},end={x:s.x+s.vx*dt,y:s.y+s.vy*dt,z:s.z};let first=Infinity,hit=null;
 for(const r of this.covers){const t=segmentBox(a,end,r,1.5);if(t!==null&&t<first){first=t;hit={type:'cover',r};}}
 const target=s.enemy?this.p:this.target;if((s.enemy||this.mode!=='none')&&target.hp>0){const t=segmentActor(a,end,target,s.enemy?(target.cover?165:185):170,20);if(t!==null&&t<first){first=t;hit={type:'actor',target};}}
 if(hit){s.x=a.x+(end.x-a.x)*first;s.y=a.y+(end.y-a.y)*first;s.life=0;this.effects.push({x:s.x,y:s.y,z:s.z,type:'impact',life:.12});if(hit.type==='actor'){if(!(s.enemy&&this.invulnerable))hit.target.hp=Math.max(0,hit.target.hp-(s.enemy?7:18));const hm=Math.hypot(s.vx,s.vy)||1;hit.target.hitReact=.16;hit.target.hitDx=s.vx/hm;hit.target.hitDy=s.vy/hm;if(!s.enemy){this.metrics.hits++;if(hit.target.hp<=0)hit.target.deadUntil=this.time+1.5;}this.emit('hit',{shot:s.id,enemy:s.enemy,damage:s.enemy?7:18});}else this.emit('cover_blocks_shot',{shot:s.id,cover:hit.r.id});}
 else{s.x=end.x;s.y=end.y;s.life-=dt;}}
 this.shots=this.shots.filter(s=>s.life>0);this.effects.forEach(e=>e.life-=dt);this.effects=this.effects.filter(e=>e.life>0);}
 step(input={},dt=DT){this.tick++;this.time+=dt;const i={x:clamp(input.x||0,-1,1),y:clamp(input.y||0,-1,1),aim:Number.isFinite(input.aim)?input.aim:this.p.aim,slide:!!input.slide,attach:!!input.attach,aimHeld:!!input.aimHeld,fire:!!input.fire};this.inputs.push({tick:this.tick,...i});if(this.inputs.length>3600)this.inputs.shift();this.p.aim=i.aim;const old=this.p.state;this.movement(i,dt);this.action(i,dt);if(old!==this.p.state)this.emit('movement',{from:old,to:this.p.state});if(i.fire)this.fire();this.targets(dt);this.projectiles(dt);this.p.hitReact=Math.max(0,(this.p.hitReact||0)-dt);this.target.hitReact=Math.max(0,(this.target.hitReact||0)-dt);if(this.p.hp<=0){this.reset('approach');this.emit('respawn');}}
 snapshot(){return JSON.parse(JSON.stringify({time:this.time,tick:this.tick,player:this.p,target:this.target,metrics:this.metrics,shotCount:this.shots.length,supported:supported(this.p),socket:this.socket(this.p)}));}
}
const api={World,DT,TUNING,FINAL,ART_SCALE,actor,freeMotion,segmentBox,segmentActor,supported,sampleSocket,wrap};root.JadeCore=api;if(typeof module==='object')module.exports=api;
})(typeof globalThis==='object'?globalThis:this);
