(()=>{
const c=document.getElementById('game'),g=c.getContext('2d'),stats=document.getElementById('stats');
let W,H,t=0,keys={},pressed={},mouse={x:0,y:0,down:false},p,bots,shots,blocks,fx;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),dist=(a,b,c,d)=>Math.hypot(a-c,b-d);
function resize(){W=c.width=innerWidth*devicePixelRatio;H=c.height=innerHeight*devicePixelRatio;g.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);W=innerWidth;H=innerHeight}
addEventListener('resize',resize);resize();
onkeydown=e=>{const k=e.key.toLowerCase();if(!keys[k])pressed[k]=1;keys[k]=1;if(k==='r')reset()};
onkeyup=e=>keys[e.key.toLowerCase()]=0;
c.onmousemove=e=>{mouse.x=e.clientX;mouse.y=e.clientY};c.onmousedown=()=>mouse.down=true;c.onmouseup=()=>mouse.down=false;
function worldBlocks(){return blocks.map(b=>({x:W/2+b[0],y:H/2+b[1],w:b[2],h:b[3]}))}
function reset(){
 p={x:W*.5,y:H*.72,vx:0,vy:0,r:16,hp:100,b:100,slide:0,slideCd:0,pin:0,pinCd:0,shield:false,parry:0,cover:null,coverState:'FREE',coverEdge:false,combo:0,melee:0,shotCd:0,grip:null};
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
  if(allowCover&&p.slide>0){p.cover={r,nx,ny};p.coverState='ATTACHED';p.slide=0;p.vx=0;p.vy=0;fx.push({x:p.x,y:p.y,r:12,life:18,type:'cover'})}
  if(o===p&&p.pin>0){const vd=o.vx*nx+o.vy*ny;o.vx-=2*vd*nx;o.vy-=2*vd*ny;o.vx*=1.04;o.vy*=1.04;fx.push({x:q.nx,y:q.ny,r:10,life:16,type:'pin'})}
 }
}
function magnetCover(){if(!p.slide||p.cover)return;let best=null,bd=999;for(const r of worldBlocks()){const nx=clamp(p.x,r.x,r.x+r.w),ny=clamp(p.y,r.y,r.y+r.h),d=dist(p.x,p.y,nx,ny);if(d<p.r+30&&d<bd){let dx=p.x-nx,dy=p.y-ny,dm=Math.hypot(dx,dy)||1,nxv=dx/dm,nyv=dy/dm;const toward=-(p.vx*nxv+p.vy*nyv);if(toward>2.2){best={r,nx:nxv,ny:nyv,px:nx,py:ny};bd=d}}}if(best){p.x=best.px+best.nx*(p.r+1);p.y=best.py+best.ny*(p.r+1);p.cover={r:best.r,nx:best.nx,ny:best.ny};p.coverState='ACQUIRED';p.slide=0;p.vx=0;p.vy=0;fx.push({x:p.x,y:p.y,r:16,life:22,type:'cover'})}}
function fireShotgun(){if(p.shotCd||p.cover&&keys.s)return;p.shotCd=18;const a=Math.atan2(mouse.y-p.y,mouse.x-p.x);for(let i=0;i<7;i++){const aa=a+(i-3)*.035+(Math.random()-.5)*.025;shots.push({x:p.x,y:p.y,vx:Math.cos(aa)*13,vy:Math.sin(aa)*13,life:20,enemy:false,dmg:8})}p.vx-=Math.cos(a)*.7;p.vy-=Math.sin(a)*.7;fx.push({x:p.x+Math.cos(a)*25,y:p.y+Math.sin(a)*25,r:7,life:8,type:'shot'})}
function enemyFire(b,a){shots.push({x:b.x,y:b.y,vx:Math.cos(a)*7,vy:Math.sin(a)*7,life:90,enemy:true,dmg:7})}
function aimedBot(max=260){let best=null,score=1e9;const a=Math.atan2(mouse.y-p.y,mouse.x-p.x);for(const b of bots){if(b.hp<=0)continue;const d=dist(p.x,p.y,b.x,b.y);if(d>max)continue;const da=Math.abs(Math.atan2(Math.sin(Math.atan2(b.y-p.y,b.x-p.x)-a),Math.cos(Math.atan2(b.y-p.y,b.x-p.x)-a)));const s=da*180+d*.15;if(da<.65&&s<score){score=s;best=b}}return best}
function tick(){
 t++;p.shotCd=Math.max(0,p.shotCd-1);p.slideCd=Math.max(0,p.slideCd-1);p.pinCd=Math.max(0,p.pinCd-1);p.parry=Math.max(0,p.parry-1);p.melee=Math.max(0,p.melee-1);
 let dx=(keys.d?1:0)-(keys.a?1:0),dy=(keys.s?1:0)-(keys.w?1:0),mag=Math.hypot(dx,dy)||1;
 if(pressed.shift&&Math.hypot(dx,dy)&&!p.slideCd&&!p.cover){p.slide=18;p.slideCd=28;const q=Math.max(7,Math.hypot(p.vx,p.vy));p.vx=dx/mag*q*1.35;p.vy=dy/mag*q*1.35;fx.push({x:p.x,y:p.y,r:8,life:12,type:'slide'})}
 if(pressed.e&&p.b>3){p.parry=8;fx.push({x:p.x,y:p.y,r:22,life:10,type:'parry'})}
 p.shield=keys.e&&p.b>0;if(p.shield)p.b-=.10;
 if(pressed[' ']&&p.cover){const r=p.cover.r,nx=p.cover.nx,ny=p.cover.ny;p.x+=-nx*46;p.y+=-ny*46;p.vx=-nx*8;p.vy=-ny*8;p.cover=null;p.coverState='VAULT EXIT';p.b=Math.max(0,p.b-3);fx.push({x:p.x,y:p.y,r:18,life:16,type:'vault'});}else if(pressed[' ']&&p.b>=10&&!p.pinCd){const a=Math.atan2(mouse.y-p.y,mouse.x-p.x);p.cover=null;p.coverState='PINBALL EXIT';p.pin=24;p.pinCd=30;p.vx=Math.cos(a)*15;p.vy=Math.sin(a)*15;p.b-=10;fx.push({x:p.x,y:p.y,r:14,life:18,type:'pin'})}
 if(p.cover){
  const away=dx*p.cover.nx+dy*p.cover.ny;
  const tx=-p.cover.ny,ty=p.cover.nx,mv=dx*tx+dy*ty;
  const rr=p.cover.r,along=(p.x-rr.x)*tx+(p.y-rr.y)*ty;
  const span=Math.abs(tx)>Math.abs(ty)?rr.w:rr.h;
  p.coverEdge=Math.abs(along)>span*.42;
  p.coverState=p.coverEdge?(mv<0?'EDGE LEFT':'EDGE RIGHT'):'ATTACHED';
  if(away>.48){p.cover=null;p.coverEdge=false;p.coverState='DETACH';}
  else{p.vx=tx*mv*(p.coverEdge?2.5:4.2);p.vy=ty*mv*(p.coverEdge?2.5:4.2)}
 } else if(!p.slide&&!p.pin){p.vx+=(dx/mag)*.82;p.vy+=(dy/mag)*.82;p.vx*=.80;p.vy*=.80}
 if(p.slide){p.slide--;p.vx*=.975;p.vy*=.975}
 if(p.pin)p.pin--;
 let vmax=p.pin?16:p.slide?11:6.2,q=Math.hypot(p.vx,p.vy);if(q>vmax){p.vx*=vmax/q;p.vy*=vmax/q}
 p.x=clamp(p.x+p.vx,22,W-22);p.y=clamp(p.y+p.vy,110,H-28);magnetCover();resolve(p,true);
 if(mouse.down&&p.shotCd===0){if(p.cover&&p.coverEdge)p.coverState='PEEK / POP-FIRE';fireShotgun();}
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
 g.clearRect(0,0,W,H);g.fillStyle='#080c14';g.fillRect(0,0,W,H);g.strokeStyle='#15293a';g.lineWidth=1;for(let i=0;i<W;i+=50){g.beginPath();g.moveTo(i,105);g.lineTo(i,H);g.stroke()}for(let i=105;i<H;i+=50){g.beginPath();g.moveTo(0,i);g.lineTo(W,i);g.stroke()}
 for(const r of worldBlocks()){g.fillStyle='#122633';g.strokeStyle='#21dff0';g.lineWidth=3;g.fillRect(r.x,r.y,r.w,r.h);g.strokeRect(r.x,r.y,r.w,r.h)}
 g.beginPath();g.arc(W/2,H/2,72,0,Math.PI*2);g.strokeStyle='#ff168c';g.lineWidth=3;g.stroke();
 for(const b of bots){if(b.hp<=0)continue;g.fillStyle=b.kind?'#ff4a4a':'#ff9b32';g.beginPath();g.arc(b.x,b.y,18,0,Math.PI*2);g.fill();g.fillStyle='#111';g.fillRect(b.x-20,b.y-29,40,4);g.fillStyle='#ff168c';g.fillRect(b.x-20,b.y-29,40*clamp(b.hp,0,100)/100,4)}
 for(const s of shots){g.fillStyle=s.enemy?'#ff6438':'#35eaff';g.beginPath();g.arc(s.x,s.y,s.enemy?4:3,0,Math.PI*2);g.fill()}
 for(const f of fx){g.strokeStyle=f.type==='parry'?'#66f7ff':f.type==='hurt'?'#ff4b3e':'#ff27aa';g.lineWidth=3;g.beginPath();g.arc(f.x,f.y,f.r,0,Math.PI*2);g.stroke()}
 if(p.cover){g.strokeStyle=p.coverEdge?'#ff9df0':'#fff36a';g.lineWidth=4;g.beginPath();g.arc(p.x,p.y,23,0,Math.PI*2);g.stroke();const tx=-p.cover.ny,ty=p.cover.nx;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x+tx*32,p.y+ty*32);g.stroke()}
 g.fillStyle=p.shield?'#66eaff':'#ff1d9c';g.beginPath();g.arc(p.x,p.y,p.r,0,Math.PI*2);g.fill();
 if(p.shield){g.strokeStyle=p.parry?'#fff':'#55eaff';g.lineWidth=p.parry?6:3;g.beginPath();g.arc(p.x,p.y,28,0,Math.PI*2);g.stroke()}
 g.strokeStyle='#ff69c5';g.lineWidth=2;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(mouse.x,mouse.y);g.stroke();
 stats.innerHTML='HP '+Math.ceil(p.hp)+'<br>BATTERY '+Math.ceil(p.b)+'%<br>COMBO '+p.combo+'<br>'+p.coverState+(p.cover?'<br>COVER: STRAFE · AIM · FIRE · SPACE VAULT':'');
 requestAnimationFrame(loop);
}
function loop(){tick();draw()}loop();
})();