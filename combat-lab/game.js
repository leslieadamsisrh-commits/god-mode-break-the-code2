(()=>{
const c=document.getElementById('game'),g=c.getContext('2d'),stats=document.getElementById('stats');
let W,H,t=0,keys={},pressed={},mouse={x:0,y:0,down:false},padPrev={},p,bots,shots,blocks,fx;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),dist=(a,b,c,d)=>Math.hypot(a-c,b-d);
function resize(){W=c.width=innerWidth*devicePixelRatio;H=c.height=innerHeight*devicePixelRatio;g.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);W=innerWidth;H=innerHeight}
addEventListener('resize',resize);resize();
onkeydown=e=>{const k=e.key.toLowerCase();if(!keys[k])pressed[k]=1;keys[k]=1;if(k==='r')reset()};
onkeyup=e=>keys[e.key.toLowerCase()]=0;
c.onmousemove=e=>{mouse.x=e.clientX;mouse.y=e.clientY};c.onmousedown=()=>mouse.down=true;c.onmouseup=()=>mouse.down=false;
const ISO_Y=.62,ISO_SKEW=.22;function toScreen(wx,wy,z=0){return{x:wx+(wy-H/2)*ISO_SKEW,y:105+(wy-105)*ISO_Y-z}}function worldBlocks(){return blocks.map(b=>({x:W/2+b[0],y:H/2+b[1],w:b[2],h:b[3]}))}
function reset(){
 p={x:W*.5,y:H*.72,vx:0,vy:0,r:16,hp:100,b:100,slide:0,slideCd:0,pin:0,pinCd:0,shield:false,parry:0,cover:null,coverState:'FREE',coverEdge:false,coverSpeed:0,settle:0,peek:0,peekSide:0,combo:0,melee:0,shotCd:0,grip:null};
 bots=[{x:W*.25,y:H*.3,hp:100,kind:0,cool:20,vx:0,vy:0},{x:W*.75,y:H*.32,hp:100,kind:1,cool:40,vx:0,vy:0}];
 shots=[];fx=[];blocks=[[-170,-85,120,34],[55,-90,130,34],[-300,70,135,34],[165,80,135,34],[-70,135,140,30],[-410,-20,55,180],[355,-20,55,180]];
}
reset();
function circleRect(o,r){const nx=clamp(o.x,r.x,r.x+r.w),ny=clamp(o.y,r.y,r.y+r.h);return {hit:dist(o.x,o.y,nx,ny)<o.r,nx,ny}}
function resolve(o,allowCover=false){
 for(const r of worldBlocks()){const q=circleRect(o,r);if(!q.hit)continue;
  let dx=o.x-q.nx,dy=o.y-q.ny,d=Math.hypot(dx,dy);
  if(d<.01){const L=Math.abs(o.x-r.x),R=Math.abs(o.x-(r.x+r.w)),T=Math.abs(o.y-r.y),B=Math.abs(o.y-(r.y+r.h)),m=Math.min(L,R,T,B);if(m===L){dx=-1;dy=0}else if(m===R){dx=1;dy=0}else if(m===T){dx=0;dy=-1}else{dx=0;dy=1}d=1}
  const nx=dx/d,ny=dy/d,push=o.r-d+1;o.x+=nx*push;o.y+=ny*push;
  const dot=o.vx*nx+o.vy*ny;if(dot<0){o.vx-=dot*nx;o.vy-=dot*ny}
  if(allowCover&&p.slide>0){p.cover={r,nx,ny};p.coverState='ATTACHED';p.slide=0;p.vx=0;p.vy=0;p.coverSpeed=0;p.settle=7;fx.push({x:p.x,y:p.y,r:12,life:18,type:'cover'})}
  if(o===p&&p.pin>0){const vd=o.vx*nx+o.vy*ny;o.vx-=2*vd*nx;o.vy-=2*vd*ny;o.vx*=1.04;o.vy*=1.04;fx.push({x:q.nx,y:q.ny,r:10,life:16,type:'pin'})}
 }
}
function magnetCover(){if(!p.slide||p.cover)return;let best=null,bd=999;for(const r of worldBlocks()){const nx=clamp(p.x,r.x,r.x+r.w),ny=clamp(p.y,r.y,r.y+r.h),d=dist(p.x,p.y,nx,ny);if(d<p.r+30&&d<bd){let dx=p.x-nx,dy=p.y-ny,dm=Math.hypot(dx,dy)||1,nxv=dx/dm,nyv=dy/dm;const toward=-(p.vx*nxv+p.vy*nyv);if(toward>2.2){best={r,nx:nxv,ny:nyv,px:nx,py:ny};bd=d}}}if(best){p.x=best.px+best.nx*(p.r+1);p.y=best.py+best.ny*(p.r+1);p.cover={r:best.r,nx:best.nx,ny:best.ny};p.coverState='ACQUIRED';p.slide=0;p.vx=0;p.vy=0;p.coverSpeed=0;p.settle=7;fx.push({x:p.x,y:p.y,r:16,life:22,type:'cover'})}}
function fireShotgun(){if(p.shotCd||p.cover&&keys.s)return;p.shotCd=18;const a=Math.atan2(mouse.y-p.y,mouse.x-p.x);for(let i=0;i<7;i++){const aa=a+(i-3)*.035+(Math.random()-.5)*.025;shots.push({x:p.x,y:p.y,vx:Math.cos(aa)*13,vy:Math.sin(aa)*13,life:20,enemy:false,dmg:8})}p.vx-=Math.cos(a)*.7;p.vy-=Math.sin(a)*.7;fx.push({x:p.x+Math.cos(a)*25,y:p.y+Math.sin(a)*25,r:7,life:8,type:'shot'})}
function enemyFire(b,a){shots.push({x:b.x,y:b.y,vx:Math.cos(a)*7,vy:Math.sin(a)*7,life:90,enemy:true,dmg:7})}
function aimedBot(max=260){let best=null,score=1e9;const a=Math.atan2(mouse.y-p.y,mouse.x-p.x);for(const b of bots){if(b.hp<=0)continue;const d=dist(p.x,p.y,b.x,b.y);if(d>max)continue;const da=Math.abs(Math.atan2(Math.sin(Math.atan2(b.y-p.y,b.x-p.x)-a),Math.cos(Math.atan2(b.y-p.y,b.x-p.x)-a)));const s=da*180+d*.15;if(da<.65&&s<score){score=s;best=b}}return best}
function pollPad(){const gp=navigator.getGamepads&&navigator.getGamepads()[0];if(!gp)return;const dz=v=>Math.abs(v)<.18?0:v,lx=dz(gp.axes[0]||0),ly=dz(gp.axes[1]||0),rx=dz(gp.axes[2]||0),ry=dz(gp.axes[3]||0);keys.a=lx<-.2;keys.d=lx>.2;keys.w=ly<-.2;keys.s=ly>.2;if(Math.hypot(rx,ry)>.25){mouse.x=p.x+rx*260;mouse.y=p.y+ry*260}const map={0:'f',1:' ',2:'q',3:'e',4:'q',5:'e',6:'shift',7:'mouse',8:'r'};for(const [i,k] of Object.entries(map)){const down=!!gp.buttons[+i]?.pressed;if(down&&!padPrev[i])pressed[k]=1;if(k==='mouse')mouse.down=down;else keys[k]=down;padPrev[i]=down}}
function tick(){
 pollPad();t++;p.shotCd=Math.max(0,p.shotCd-1);p.peek=Math.max(0,p.peek-.12);p.slideCd=Math.max(0,p.slideCd-1);p.pinCd=Math.max(0,p.pinCd-1);p.parry=Math.max(0,p.parry-1);p.melee=Math.max(0,p.melee-1);
 let dx=(keys.d?1:0)-(keys.a?1:0),dy=(keys.s?1:0)-(keys.w?1:0),mag=Math.hypot(dx,dy)||1;
 if((pressed.shift||keys.shift)&&Math.hypot(dx,dy)&&!p.slideCd&&!p.cover){p.slide=18;p.slideCd=28;const q=Math.max(7,Math.hypot(p.vx,p.vy));p.vx=dx/mag*q*1.35;p.vy=dy/mag*q*1.35;fx.push({x:p.x,y:p.y,r:8,life:12,type:'slide'})}
 if(pressed.e&&p.b>3){p.parry=8;fx.push({x:p.x,y:p.y,r:22,life:10,type:'parry'})}
 p.shield=keys.e&&p.b>0;if(p.shield)p.b-=.10;
 if(pressed[' ']&&p.cover){const r=p.cover.r,nx=p.cover.nx,ny=p.cover.ny;p.x+=-nx*46;p.y+=-ny*46;p.vx=-nx*8;p.vy=-ny*8;p.cover=null;p.coverState='VAULT EXIT';p.coverSpeed=0;p.b=Math.max(0,p.b-3);fx.push({x:p.x,y:p.y,r:18,life:16,type:'vault'});}else if(pressed[' ']&&p.b>=10&&!p.pinCd){const a=Math.atan2(mouse.y-p.y,mouse.x-p.x);p.cover=null;p.coverState='PINBALL EXIT';p.pin=24;p.pinCd=30;p.vx=Math.cos(a)*15;p.vy=Math.sin(a)*15;p.b-=10;fx.push({x:p.x,y:p.y,r:14,life:18,type:'pin'})}
 if(p.cover){
  const away=dx*p.cover.nx+dy*p.cover.ny,tx=-p.cover.ny,ty=p.cover.nx,mv=dx*tx+dy*ty,rr=p.cover.r;
  const cx=rr.x+rr.w/2,cy=rr.y+rr.h/2,along=(p.x-cx)*tx+(p.y-cy)*ty,span=Math.abs(tx)>Math.abs(ty)?rr.w:rr.h;
  const edgeLimit=Math.max(0,span/2-p.r-3);p.coverEdge=Math.abs(along)>edgeLimit-18;
  p.settle=Math.max(0,p.settle-1);
  const target=mv*(p.coverEdge?2.7:4.4);p.coverSpeed+=(target-p.coverSpeed)*(p.settle?.16:.28);
  p.coverState=p.settle?'PLANT / SETTLE':p.coverEdge?(along<0?'EDGE LEFT':'EDGE RIGHT'):'ATTACHED';
  if(away>.48){p.vx=p.cover.nx*5+tx*p.coverSpeed;p.vy=p.cover.ny*5+ty*p.coverSpeed;p.cover=null;p.coverEdge=false;p.coverSpeed=0;p.coverState='PUSH-OFF';}
  else{p.vx=tx*p.coverSpeed;p.vy=ty*p.coverSpeed;
    const projected=along+p.coverSpeed;if(Math.abs(projected)>=edgeLimit){const sign=projected<0?-1:1;p.x=cx+tx*edgeLimit*sign+p.cover.nx*(p.r+1);p.y=cy+ty*edgeLimit*sign+p.cover.ny*(p.r+1);p.vx=0;p.vy=0;p.coverSpeed=0;p.coverEdge=true;p.coverState=sign<0?'CORNER STOP LEFT':'CORNER STOP RIGHT';}else if(p.coverEdge&&Math.abs(p.coverSpeed)>1.1){p.coverState=along<0?'EDGE LEFT':'EDGE RIGHT';}
  }
 } else if(!p.slide&&!p.pin){p.vx+=(dx/mag)*.82;p.vy+=(dy/mag)*.82;p.vx*=.80;p.vy*=.80}
 if(p.slide){p.slide--;p.vx*=.975;p.vy*=.975}
 if(p.pin)p.pin--;
 let vmax=p.pin?16:p.slide?11:6.2,q=Math.hypot(p.vx,p.vy);if(q>vmax){p.vx*=vmax/q;p.vy*=vmax/q}
 p.x=clamp(p.x+p.vx,22,W-22);p.y=clamp(p.y+p.vy,110,H-28);magnetCover();resolve(p,true);
 if(p.cover&&p.coverEdge){const tx=-p.cover.ny,ty=p.cover.nx,aimDot=Math.cos(Math.atan2(mouse.y-p.y,mouse.x-p.x))*tx+Math.sin(Math.atan2(mouse.y-p.y,mouse.x-p.x))*ty;p.peekSide=aimDot<0?-1:1;if(Math.abs(aimDot)>.18){p.peek=Math.min(1,p.peek+.18);p.coverState=p.peekSide<0?'CORNER PEEK LEFT':'CORNER PEEK RIGHT';}}
 if(mouse.down&&p.shotCd===0){if(p.cover&&p.coverEdge){p.peek=1;p.coverState='POP-FIRE';}fireShotgun();}
 if(pressed.f){p.melee=10;const a=Math.atan2(mouse.y-p.y,mouse.x-p.x);for(const b of bots){if(b.hp>0&&dist(p.x,p.y,b.x,b.y)<78){const toward=Math.cos(Math.atan2(b.y-p.y,b.x-p.x)-a);if(toward>.2){b.hp-=24;b.vx+=Math.cos(a)*7;b.vy+=Math.sin(a)*7;p.combo++;fx.push({x:b.x,y:b.y,r:15,life:14,type:'melee'})}}}}
 if(keys.q&&p.b>0){if(!p.grip||p.grip.hp<=0)p.grip=aimedBot();if(p.grip){const a=Math.atan2(mouse.y-p.y,mouse.x-p.x),tx=p.x+Math.cos(a)*125,ty=p.y+Math.sin(a)*125;p.grip.x+=(tx-p.grip.x)*.13;p.grip.y+=(ty-p.grip.y)*.13;p.grip.vx*=.5;p.grip.vy*=.5;p.b-=.12;fx.push({x:p.grip.x,y:p.grip.y,r:20,life:2,type:'grip'})}}else if(p.grip){const a=Math.atan2(mouse.y-p.y,mouse.x-p.x);p.grip.vx=Math.cos(a)*11;p.grip.vy=Math.sin(a)*11;p.grip=null}
 for(const b of bots){if(b.hp<=0)continue;b.cool--;b.x+=b.vx;b.y+=b.vy;b.vx*=.88;b.vy*=.88;resolve(b,false);const a=Math.atan2(p.y-b.y,p.x-b.x),d=dist(p.x,p.y,b.x,b.y);
  if(b!==p.grip){if(b.kind===0&&d>70){b.vx+=Math.cos(a)*.16;b.vy+=Math.sin(a)*.16}if(b.kind===1){if(d<230){b.vx-=Math.cos(a)*.10;b.vy-=Math.sin(a)*.10}else if(d>360){b.vx+=Math.cos(a)*.08;b.vy+=Math.sin(a)*.08}}}
  if(b.cool<=0&&d<520){enemyFire(b,a);b.cool=b.kind?46:64}
 }
 for(const s of shots){s.x+=s.vx;s.y+=s.vy;s.life--;for(const r of worldBlocks()){if(s.x>r.x&&s.x<r.x+r.w&&s.y>r.y&&s.y<r.y+r.h){s.life=0;break}}
  if(s.enemy&&s.life>0&&dist(s.x,s.y,p.x,p.y)<p.r+5){s.life=0;if(p.parry>0){s.enemy=false;s.life=45;const a=Math.atan2(mouse.y-p.y,mouse.x-p.x);s.vx=Math.cos(a)*12;s.vy=Math.sin(a)*12;p.combo++;fx.push({x:p.x,y:p.y,r:28,life:18,type:'parry'})}else if(p.shield){fx.push({x:p.x,y:p.y,r:18,life:10,type:'shield'})}else{p.hp-=s.dmg;fx.push({x:p.x,y:p.y,r:9,life:10,type:'hurt'})}}
  if(!s.enemy&&s.life>0)for(const b of bots){if(b.hp>0&&dist(s.x,s.y,b.x,b.y)<20){b.hp-=s.dmg;s.life=0;p.combo++;fx.push({x:b.x,y:b.y,r:8,life:8,type:'hit'});break}}
 }
 shots=shots.filter(s=>s.life>0);fx.forEach(f=>{f.r+=2.5;f.life--});fx=fx.filter(f=>f.life>0);p.b=clamp(p.b+.055,0,100);if(p.hp<=0)reset();pressed={};
}
function draw(){
 g.clearRect(0,0,W,H);g.fillStyle='#080c14';g.fillRect(0,0,W,H);g.strokeStyle='#15293a';g.lineWidth=1;for(let wy=105;wy<H;wy+=50){const a=toScreen(0,wy),b=toScreen(W,wy);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke()}for(let wx=-200;wx<W+200;wx+=50){const a=toScreen(wx,105),b=toScreen(wx,H);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke()}
 for(const r of worldBlocks()){const a=toScreen(r.x,r.y),b=toScreen(r.x+r.w,r.y),d=toScreen(r.x,r.y+r.h),e=toScreen(r.x+r.w,r.y+r.h),h=18;g.fillStyle='#122633';g.strokeStyle='#21dff0';g.lineWidth=2;g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.lineTo(e.x,e.y);g.lineTo(d.x,d.y);g.closePath();g.fill();g.stroke();g.fillStyle='#0a151f';g.beginPath();g.moveTo(d.x,d.y);g.lineTo(e.x,e.y);g.lineTo(e.x,e.y+h);g.lineTo(d.x,d.y+h);g.closePath();g.fill();g.stroke()}
 {const cc=toScreen(W/2,H/2);g.save();g.translate(cc.x,cc.y);g.scale(1,ISO_Y);g.beginPath();g.arc(0,0,72,0,Math.PI*2);g.strokeStyle='#ff168c';g.lineWidth=3;g.stroke();g.restore()}
 for(const b of bots){if(b.hp<=0)continue;const bs=toScreen(b.x,b.y);g.fillStyle=b.kind?'#ff4a4a':'#ff9b32';g.beginPath();g.ellipse(bs.x,bs.y,18,11,0,0,Math.PI*2);g.fill();g.strokeStyle='#ffc';g.beginPath();g.moveTo(bs.x,bs.y);g.lineTo(bs.x,bs.y-30);g.stroke();g.fillStyle='#111';g.fillRect(bs.x-20,bs.y-39,40,4);g.fillStyle='#ff168c';g.fillRect(bs.x-20,bs.y-39,40*clamp(b.hp,0,100)/100,4)}
 for(const s of shots){const ss=toScreen(s.x,s.y,10);g.fillStyle=s.enemy?'#ff6438':'#35eaff';g.beginPath();g.arc(ss.x,ss.y,s.enemy?4:3,0,Math.PI*2);g.fill()}
 for(const f of fx){const fs=toScreen(f.x,f.y);g.strokeStyle=f.type==='parry'?'#66f7ff':f.type==='hurt'?'#ff4b3e':'#ff27aa';g.lineWidth=3;g.save();g.translate(fs.x,fs.y);g.scale(1,ISO_Y);g.beginPath();g.arc(0,0,f.r,0,Math.PI*2);g.stroke();g.restore()}
 const ps=toScreen(p.x,p.y);g.save();g.translate(ps.x-p.x,ps.y-p.y);
 if(p.cover){g.strokeStyle=p.coverEdge?'#ff9df0':'#fff36a';g.lineWidth=4;g.beginPath();g.arc(p.x,p.y,23,0,Math.PI*2);g.stroke();const tx=-p.cover.ny,ty=p.cover.nx;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x+tx*32,p.y+ty*32);g.stroke()}
 const aim=Math.atan2(mouse.y-p.y,mouse.x-p.x),bodyAim=p.cover?Math.atan2(-p.cover.ny,-p.cover.nx):aim;
 const bx=p.x,by=p.y,fxa=Math.cos(bodyAim),fya=Math.sin(bodyAim),sxa=-fya,sya=fxa;
 const hipX=bx-fxa*8,hipY=by-fya*8,neckX=bx+fxa*7,neckY=by+fya*7,headX=bx+fxa*15,headY=by+fya*15;
 const lShouldX=neckX+sxa*7,lShouldY=neckY+sya*7,rShouldX=neckX-sxa*7,rShouldY=neckY-sya*7;
 const ax=Math.cos(aim),ay=Math.sin(aim),perpX=-ay,perpY=ax;
 const lElbowX=lShouldX+ax*11+perpX*3,lElbowY=lShouldY+ay*11+perpY*3,rElbowX=rShouldX+ax*10-perpX*2,rElbowY=rShouldY+ay*10-perpY*2;
 const lHandX=lElbowX+ax*11,lHandY=lElbowY+ay*11,rHandX=rElbowX+ax*13,rHandY=rElbowY+ay*13;
 const peekShift=p.cover&&p.coverEdge?p.peek*12*p.peekSide:0;
 const psx=p.cover?-p.cover.ny:0,psy=p.cover?p.cover.nx:0;
 const muzzleX=(lHandX+rHandX)/2+ax*23+psx*peekShift,muzzleY=(lHandY+rHandY)/2+ay*23+psy*peekShift;
 g.lineCap='round';g.strokeStyle='#ff8bd0';g.lineWidth=7;g.beginPath();g.moveTo(hipX,hipY);g.lineTo(neckX,neckY);g.stroke();
 g.strokeStyle='#ff4eb1';g.lineWidth=5;for(const pts of [[lShouldX,lShouldY,lElbowX,lElbowY,lHandX,lHandY],[rShouldX,rShouldY,rElbowX,rElbowY,rHandX,rHandY]]){g.beginPath();g.moveTo(pts[0],pts[1]);g.lineTo(pts[2],pts[3]);g.lineTo(pts[4],pts[5]);g.stroke()}
 g.fillStyle='#ffc4e7';g.beginPath();g.arc(headX,headY,7,0,Math.PI*2);g.fill();g.strokeStyle='#35eaff';g.lineWidth=2;g.beginPath();g.moveTo(headX,headY);g.lineTo(headX+ax*10,headY+ay*10);g.stroke();
 g.fillStyle='#35eaff';for(const h of [[lHandX,lHandY],[rHandX,rHandY]]){g.beginPath();g.arc(h[0],h[1],4,0,Math.PI*2);g.fill()}
 g.strokeStyle='#d9fbff';g.lineWidth=4;g.beginPath();g.moveTo((lHandX+rHandX)/2+psx*peekShift,(lHandY+rHandY)/2+psy*peekShift);g.lineTo(muzzleX,muzzleY);g.stroke();
 if(p.cover&&p.coverEdge){g.strokeStyle='#ffef72';g.lineWidth=2;g.beginPath();g.moveTo(headX,headY);g.lineTo(headX+psx*peekShift,headY+psy*peekShift);g.stroke();g.fillStyle='#fff';g.beginPath();g.arc(headX+psx*peekShift,headY+psy*peekShift,3,0,Math.PI*2);g.fill();}
 g.fillStyle=p.shield?'#66eaff':'#ff1d9c';g.globalAlpha=.45;g.beginPath();g.arc(p.x,p.y,p.r,0,Math.PI*2);g.fill();g.globalAlpha=1;
 if(p.shield){g.strokeStyle=p.parry?'#fff':'#55eaff';g.lineWidth=p.parry?6:3;g.beginPath();g.arc(p.x,p.y,28,0,Math.PI*2);g.stroke()}
 g.strokeStyle='#ff69c5';g.lineWidth=2;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(mouse.x,mouse.y);g.stroke();g.restore();
 stats.innerHTML='HP '+Math.ceil(p.hp)+'<br>BATTERY '+Math.ceil(p.b)+'%<br>COMBO '+p.combo+'<br>BODY '+(p.cover?'BRACED':'FREE')+'<br>'+p.coverState+(p.cover?'<br>COVER: STRAFE · AIM · FIRE · SPACE VAULT':'');
 requestAnimationFrame(loop);
}
function loop(){tick();draw()}loop();
})();