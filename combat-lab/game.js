(()=>{"use strict";
const canvas=document.getElementById("game"),ctx=canvas.getContext("2d"),stats=document.getElementById("stats");
let W=0,H=0,t=0,keys={},pressed={},mouse={x:0,y:0,down:false},prevPad={},player,bots,shots,fx,cover;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),len=(x,y)=>Math.hypot(x,y),d=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function resize(){const r=devicePixelRatio||1;W=innerWidth;H=innerHeight;canvas.width=W*r;canvas.height=H*r;ctx.setTransform(r,0,0,r,0,0)}addEventListener("resize",resize);resize();
addEventListener("keydown",e=>{let k=e.key.toLowerCase();if(!keys[k])pressed[k]=1;keys[k]=1;if(k==="r")reset()});addEventListener("keyup",e=>keys[e.key.toLowerCase()]=0);
canvas.addEventListener("mousemove",e=>{mouse.x=e.clientX;mouse.y=e.clientY});canvas.addEventListener("mousedown",()=>mouse.down=true);addEventListener("mouseup",()=>mouse.down=false);
function reset(){player={x:0,y:220,vx:0,vy:0,hp:100,battery:100,slide:0,slideCd:0,cover:null,coverState:"FREE",coverLean:0,coverAction:"",moveState:"IDLE",roadie:false,evade:0,mantle:0,shield:false,parry:0,pin:0,combo:0,phase:0};bots=[{x:-250,y:-80,vx:0,vy:0,hp:100,type:0,cool:40},{x:260,y:-100,vx:0,vy:0,hp:100,type:1,cool:65}];shots=[];fx=[];cover=[{x:-180,y:-30,w:150,h:34},{x:70,y:-50,w:150,h:34},{x:-330,y:110,w:145,h:34},{x:185,y:115,w:145,h:34},{x:-75,y:165,w:150,h:30},{x:-430,y:-120,w:55,h:230},{x:375,y:-120,w:55,h:230}]}reset();
const iso=(x,y,z=0)=>({x:W/2+x+y*.22,y:H*.47+y*.58-z});
function pollPad(){const p=navigator.getGamepads&&navigator.getGamepads()[0];if(!p)return;const dz=v=>Math.abs(v)<.18?0:v,lx=dz(p.axes[0]||0),ly=dz(p.axes[1]||0),rx=dz(p.axes[2]||0),ry=dz(p.axes[3]||0);keys.a=lx<-.2;keys.d=lx>.2;keys.w=ly<-.2;keys.s=ly>.2;if(len(rx,ry)>.25){mouse.x=W/2+rx*300;mouse.y=H/2+ry*220}const map={0:"f",1:" ",2:"q",3:"e",6:"shift",7:"fire",8:"r"};Object.keys(map).forEach(i=>{const k=map[i],down=!!p.buttons[+i]?.pressed;if(down&&!prevPad[i])pressed[k]=1;if(k==="fire")mouse.down=down;else keys[k]=down;prevPad[i]=down})}
function circleRect(o,r){let nx=clamp(o.x,r.x,r.x+r.w),ny=clamp(o.y,r.y,r.y+r.h),dx=o.x-nx,dy=o.y-ny,dd=len(dx,dy);return{hit:dd<17,nx,ny,dx,dy,dd}}
function collide(o,isPlayer=false){for(const r of cover){let q=circleRect(o,r);if(!q.hit)continue;let nx=q.dx/(q.dd||1),ny=q.dy/(q.dd||1);if(q.dd<.01){nx=0;ny=o.y<r.y?-1:1}let push=18-q.dd;o.x+=nx*push;o.y+=ny*push;let dot=o.vx*nx+o.vy*ny;if(dot<0){o.vx-=dot*nx;o.vy-=dot*ny}if(isPlayer&&player.slide>0){player.cover={r,nx,ny};player.coverState="SMACK / SETTLE";player.slide=0;player.vx=player.vy=0;fx.push({x:o.x,y:o.y,r:12,life:18})}}}
function shoot(enemy=false,origin=player){let a=enemy?Math.atan2(player.y-origin.y,player.x-origin.x):Math.atan2(mouse.y-H/2,mouse.x-W/2);let n=enemy?1:7;for(let i=0;i<n;i++){let aa=a+(enemy?0:(i-3)*.04);shots.push({x:origin.x,y:origin.y,vx:Math.cos(aa)*(enemy?7:12),vy:Math.sin(aa)*(enemy?7:12),enemy,life:enemy?100:24})}}
function tick(){pollPad();t++;player.phase+=len(player.vx,player.vy)*.08;player.slideCd=Math.max(0,player.slideCd-1);player.parry=Math.max(0,player.parry-1);
let dx=(keys.d?1:0)-(keys.a?1:0),dy=(keys.s?1:0)-(keys.w?1:0),m=len(dx,dy)||1;
player.roadie=!!keys.shift&&len(dx,dy)>0&&!player.cover&&!player.slide; if(player.roadie){player.moveState="ROADIE RUN";player.vx+=dx/m*.42;player.vy+=dy/m*.42}
if(pressed.shift&&len(dx,dy)&&!player.slideCd&&!player.cover){player.slide=20;player.slideCd=34;player.moveState="BASEBALL SLIDE";player.vx=dx/m*10;player.vy=dy/m*10;fx.push({x:player.x,y:player.y,r:8,life:10})}
if(pressed.e){player.parry=8}player.shield=!!keys.e&&player.battery>0;if(player.shield)player.battery-=.08;
if(pressed[" "]&&player.cover){let nx=player.cover.nx,ny=player.cover.ny;player.x-=nx*44;player.y-=ny*44;player.vx=-nx*7;player.vy=-ny*7;player.cover=null;player.mantle=16;player.moveState="MANTLE / VAULT";player.coverState="VAULT EXIT";}else if(pressed[" "]&&player.battery>=10){player.cover=null;player.coverState="PINBALL";let a=Math.atan2(mouse.y-H/2,mouse.x-W/2);player.vx=Math.cos(a)*14;player.vy=Math.sin(a)*14;player.pin=22;player.battery-=10}
if(player.cover){player.moveState="COVER ATTACHED";let r=player.cover.r,nx=player.cover.nx,ny=player.cover.ny,tx=-ny,ty=nx,along=(player.x-(r.x+r.w/2))*tx+(player.y-(r.y+r.h/2))*ty,span=Math.abs(tx)>.5?r.w:r.h,limit=span/2-18,mv=dx*tx+dy*ty;player.vx=tx*mv*4;player.vy=ty*mv*4;let atEdge=Math.abs(along)>=limit-3;if(atEdge){player.vx=player.vy=0;player.coverState=along<0?"CORNER STOP LEFT":"CORNER STOP RIGHT";let aim=Math.atan2(mouse.y-H/2,mouse.x-W/2),edgeDir=along<0?-1:1,aimAlong=Math.cos(aim)*tx+Math.sin(aim)*ty;player.coverLean+=(Math.sign(aimAlong)===edgeDir?1-player.coverLean:-player.coverLean)*.22;if(player.coverLean>.2){player.coverState=along<0?"LEAN LEFT":"LEAN RIGHT";player.moveState="COVER LEAN"}}else{player.coverLean*=.75;player.coverState="ATTACHED"}if(dx*nx+dy*ny>.55){player.cover=null;player.coverLean=0;player.coverState="PUSH OFF"}if(pressed[" "]&&atEdge){player.x+=tx*(along<0?-38:38);player.y+=ty*(along<0?-38:38);player.cover=null;player.coverLean=0;player.coverState="COVER SLIP";player.moveState="COVER SLIP"}}
else if(!player.slide&&!player.pin&&!player.evade){player.vx+=dx/m*.75;player.vy+=dy/m*.75;player.vx*=.82;player.vy*=.82}
if(player.slide){player.slide--;player.vx*=.98;player.vy*=.98;if(!player.slide)player.moveState="SLIDE RECOVERY"}if(player.pin)player.pin--;if(player.mantle)player.mantle--;if(pressed.x&&!player.cover){player.evade=15;player.moveState="EVADE";let a=Math.atan2(dy,dx);if(!len(dx,dy))a=Math.atan2(mouse.y-H/2,mouse.x-W/2);player.vx=Math.cos(a)*9;player.vy=Math.sin(a)*9}if(player.evade){player.evade--;player.vx*=.96;player.vy*=.96}
player.x+=player.vx;player.y+=player.vy;player.x=clamp(player.x,-500,500);player.y=clamp(player.y,-260,310);collide(player,true);
if(mouse.down&&t%14===0)shoot(false);
if(pressed.f)bots.forEach(b=>{if(b.hp>0&&d(player,b)<85){b.hp-=25;player.combo++;b.vx+=(b.x-player.x)*.04;b.vy+=(b.y-player.y)*.04}});
if(keys.q&&player.battery>0){let b=bots.filter(b=>b.hp>0).sort((a,b)=>d(player,a)-d(player,b))[0];if(b&&d(player,b)<250){b.x+=(player.x-b.x)*.07;b.y+=(player.y-b.y)*.07;player.battery-=.08}}
bots.forEach(b=>{if(b.hp<=0)return;b.cool--;let a=Math.atan2(player.y-b.y,player.x-b.x),dd=d(player,b);if(b.type===0&&dd>85){b.vx+=Math.cos(a)*.12;b.vy+=Math.sin(a)*.12}else if(b.type===1&&dd<260){b.vx-=Math.cos(a)*.08;b.vy-=Math.sin(a)*.08}b.vx*=.9;b.vy*=.9;b.x+=b.vx;b.y+=b.vy;collide(b);if(b.cool<=0&&dd<520){shoot(true,b);b.cool=b.type?55:70}});
shots.forEach(s=>{s.x+=s.vx;s.y+=s.vy;s.life--;if(s.enemy&&d(s,player)<20){s.life=0;if(player.parry){s.enemy=false;s.life=45;s.vx*=-1.4;s.vy*=-1.4;player.combo++}else if(!player.shield)player.hp-=7}else if(!s.enemy)bots.forEach(b=>{if(b.hp>0&&d(s,b)<20){b.hp-=8;s.life=0;player.combo++}})});shots=shots.filter(s=>s.life>0);fx.forEach(f=>{f.r+=3;f.life--});fx=fx.filter(f=>f.life>0);player.battery=clamp(player.battery+.05,0,100);if(player.hp<=0)reset();pressed={}}
function line(a,b,w=5,col="#ff58b7"){ctx.strokeStyle=col;ctx.lineWidth=w;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}
function drawSkeleton(o,isPlayer=true){
 const P=iso(o.x,o.y),aim=isPlayer?Math.atan2(mouse.y-H/2,mouse.x-W/2):Math.atan2(player.y-o.y,player.x-o.x);
 const slide=isPlayer&&o.slide>0,roadie=isPlayer&&o.roadie,lean=isPlayer?(o.coverLean||0):0,spd=Math.min(1,len(o.vx,o.vy)/5),ph=o.phase||t*.08,stride=Math.sin(ph)*20*spd,S=isPlayer?1.45:1;
 const fx=Math.cos(aim),fy=Math.sin(aim),sx=-fy,sy=fx;
 let pelvis={x:P.x-fx*(slide?16:0),y:P.y-(slide?8:30)*S};
 let lumbar={x:pelvis.x+fx*(slide?12:lean*7),y:pelvis.y-(slide?8:17)*S};
 let rib={x:lumbar.x+fx*(slide?15:lean*10),y:lumbar.y-(slide?7:(roadie?15:20))*S};
 let neck={x:rib.x+fx*(slide?7:lean*5),y:rib.y-(slide?5:10)*S};
 let head={x:neck.x+fx*(slide?10:lean*7),y:neck.y-(slide?8:13)*S};
 line(pelvis,lumbar,12,isPlayer?"#ff3ca8":"#ff9348");line(lumbar,rib,11,isPlayer?"#ff67bd":"#ff9348");line(rib,neck,8,isPlayer?"#ff9bd5":"#ffb06b");
 ctx.fillStyle=isPlayer?"#ffe6f5":"#ffd1ad";ctx.beginPath();ctx.arc(head.x,head.y,isPlayer?16:10,0,7);ctx.fill();
 if(isPlayer){line({x:head.x-7,y:head.y-9},{x:head.x-11,y:head.y-23},3,"#35eaff");line({x:head.x+7,y:head.y-9},{x:head.x+11,y:head.y-23},3,"#35eaff")}
 const shoulderTw=lean*13+(roadie?4:0),LS={x:rib.x+sx*14*S+fx*shoulderTw,y:rib.y+sy*7},RS={x:rib.x-sx*14*S+fx*shoulderTw*.65,y:rib.y-sy*7};
 for(const [sh,side] of [[LS,1],[RS,-1]]){let elbow={x:sh.x+fx*(22+lean*9)+sx*side*5,y:sh.y+fy*(17+lean*7)+sy*side*3},hand={x:elbow.x+fx*22,y:elbow.y+fy*18};line(sh,elbow,8,isPlayer?"#ff55b5":"#ff9b55");line(elbow,hand,7,isPlayer?"#ff83ca":"#ffb071");ctx.fillStyle="#35eaff";ctx.beginPath();ctx.arc(hand.x,hand.y,5,0,7);ctx.fill()}
 let gun0={x:rib.x+fx*32,y:rib.y+fy*24},gun1={x:gun0.x+fx*55,y:gun0.y+fy*55};line(gun0,gun1,7,"#eaffff");
 let legPhase=roadie?stride*1.15:stride, crouch=roadie?8:0;
 let LH={x:pelvis.x+sx*8,y:pelvis.y+crouch},RH={x:pelvis.x-sx*8,y:pelvis.y+crouch},LK,LF,RK,RF;
 if(slide){LK={x:LH.x+fx*24,y:LH.y+15};LF={x:LK.x+fx*34,y:LK.y+10};RK={x:RH.x-fx*10,y:RH.y+19};RF={x:RK.x-fx*17+sx*6,y:RK.y+18}}
 else{LK={x:LH.x+fx*legPhase*.28,y:LH.y+25*S};LF={x:LK.x+fx*legPhase,y:LK.y+29*S};RK={x:RH.x-fx*legPhase*.28,y:RH.y+25*S};RF={x:RK.x-fx*legPhase,y:RK.y+29*S}}
 for(const [h,k,f] of [[LH,LK,LF],[RH,RK,RF]]){line(h,k,10,isPlayer?"#ff8bce":"#ffad69");line(k,f,9,isPlayer?"#ffb2df":"#ffc08c");line({x:f.x-6,y:f.y},{x:f.x+10,y:f.y},5,"#bffaff")}
 if(isPlayer){ctx.fillStyle="#35eaff";ctx.font="bold 13px Arial";ctx.fillText("JADE",P.x-20,P.y+36)}
}
function draw(){ctx.fillStyle="#050912";ctx.fillRect(0,0,W,H);ctx.fillStyle="#0b1722";ctx.fillRect(0,80,W,H-80);ctx.strokeStyle="#173346";for(let y=-260;y<330;y+=50){let a=iso(-600,y),b=iso(600,y);line(a,b,1,"#173346")}for(let x=-600;x<650;x+=50){let a=iso(x,-300),b=iso(x,350);line(a,b,1,"#173346")}
ctx.fillStyle="#101827";for(let i=0;i<12;i++){let x=i*W/11,h=30+(i%4)*18;ctx.fillRect(x,80-h,65,h)}ctx.fillStyle="#ff168c";ctx.font="bold 16px Arial";ctx.fillText("DIMENSION 33 // WAR GAMES",24,112);
for(const r of cover){let a=iso(r.x,r.y),b=iso(r.x+r.w,r.y),c=iso(r.x+r.w,r.y+r.h),dd=iso(r.x,r.y+r.h);ctx.fillStyle="#17313d";ctx.strokeStyle="#35eaff";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.lineTo(dd.x,dd.y);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle="#0b202a";ctx.beginPath();ctx.moveTo(dd.x,dd.y);ctx.lineTo(c.x,c.y);ctx.lineTo(c.x,c.y+26);ctx.lineTo(dd.x,dd.y+26);ctx.closePath();ctx.fill();ctx.stroke()}
let center=iso(0,0);ctx.strokeStyle="#ff168c";ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(center.x,center.y,85,48,0,0,7);ctx.stroke();
shots.forEach(s=>{let q=iso(s.x,s.y,18);ctx.fillStyle=s.enemy?"#ff6a3d":"#35eaff";ctx.beginPath();ctx.arc(q.x,q.y,4,0,7);ctx.fill()});fx.forEach(f=>{let q=iso(f.x,f.y);ctx.strokeStyle="#ff28a8";ctx.beginPath();ctx.arc(q.x,q.y,f.r,0,7);ctx.stroke()});
bots.forEach(b=>{if(b.hp>0)drawSkeleton(b,false)});drawSkeleton(player,true);stats.innerHTML="v2.3 RE-ENGINEERED 14-JOINT RIG<br>STATE "+player.moveState+"<br>RIG pelvis · lumbar · ribcage · neck · head · shoulders · elbows · hands · knees · feet<br>"+"<br>HP "+Math.ceil(player.hp)+"<br>BATTERY "+Math.ceil(player.battery)+"%<br>COMBO "+player.combo+"<br>"+player.coverState;requestAnimationFrame(loop)}
function loop(){tick();draw()}loop();
})();