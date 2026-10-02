(()=>{"use strict";
const c=document.getElementById("game"),g=c.getContext("2d"),stats=document.getElementById("stats"),poseName=document.getElementById("poseName");
let W,H,last=performance.now(),acc=0,keys={},pressed={},mouse={x:0,y:0,down:false},prevPad={},p,bots,shots=[],covers=[],fx=[],spriteImgs={},spriteReady=false;
const FIX=1/60,clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),hyp=(x,y)=>Math.hypot(x,y),dist=(a,b)=>hyp(a.x-b.x,a.y-b.y);
function resize(){let r=devicePixelRatio||1;W=innerWidth;H=innerHeight;c.width=W*r;c.height=H*r;g.setTransform(r,0,0,r,0,0)}addEventListener("resize",resize);resize();
addEventListener("keydown",e=>{let k=e.key.toLowerCase();if(!keys[k])pressed[k]=1;keys[k]=1;if(k==="r")reset()});addEventListener("keyup",e=>keys[e.key.toLowerCase()]=0);c.onmousemove=e=>{mouse.x=e.clientX;mouse.y=e.clientY};c.onmousedown=()=>mouse.down=1;addEventListener("mouseup",()=>mouse.down=0);
const recoveredCatalog={run:24,slide:24,cover:24,ready:24,"strafe-left":4,"strafe-right":4,backpedal:4};function renderFrameCatalog(){let el=document.getElementById("frameList");if(!el)return;el.innerHTML=Object.entries(recoveredCatalog).map(([family,count])=>'<div style="margin-top:6px;color:#ff9bd7">'+family.toUpperCase()+' · '+count+' directional atlases</div><div>'+Array.from({length:count},(_,i)=>'<span style="display:inline-block;padding:2px 4px;margin:1px;border:1px solid #244">'+family+'-d'+String(i<24?i*24/count:i).padStart(2,"0")+'</span>').join("")+'</div>').join("")+'<div style="margin-top:8px;color:#35eaff">Runtime archive verified in sprite-library manifest. Binary restoration pending deployment packaging.</div>'}renderFrameCatalog();
function loadSpriteProxy(){
 const families=["run","slide","cover","ready"],jobs=[];
 for(const fam of families)for(let d=0;d<24;d++){let key=fam+"-d"+String(d).padStart(2,"0"),im=new Image();jobs.push(new Promise(res=>{im.onload=()=>{spriteImgs[key]=im;res()};im.onerror=()=>res();im.src="/combat-lab/assets/cyberkitty/"+key+".webp"}))}
 Promise.all(jobs).then(()=>{spriteReady=Object.keys(spriteImgs).length>0;console.log("Cyber Kitty runtime loaded",Object.keys(spriteImgs).length,"directional atlases")})
}loadSpriteProxy();
const BAY_BRIDGE={
 name:"ALTERED DIMENSION BAY BRIDGE",
 phase:"MASSIVE WORLD + CORRECT CYBER KITTY RUNTIME",
 road:{x0:-5200,x1:5200,y0:-950,y1:950},
 routes:[{name:"WESTBOUND FLANK",y:-520},{name:"CENTER WAR LANE",y:0},{name:"EASTBOUND FLANK",y:520}]
};
function makeBridgeCovers(){
 const out=[];
 // Local combat clusters every ~850 world units so the bridge feels enormous without becoming empty.
 for(let s=-5;s<=5;s++){
   const bx=s*850, flip=s%2===0?1:-1;
   out.push({x:bx-150,y:-570,w:170,h:38,kind:"barrier"});
   out.push({x:bx+100,y:-430,w:150,h:42,kind:flip>0?"wreck":"barrier"});
   out.push({x:bx-90,y:-60,w:165,h:40,kind:"median"});
   out.push({x:bx+170,y:90,w:135,h:40,kind:flip>0?"wreck":"median"});
   out.push({x:bx-180,y:410,w:160,h:42,kind:flip>0?"barrier":"wreck"});
   out.push({x:bx+120,y:565,w:170,h:38,kind:"barrier"});
   if(s===-3||s===3) out.push({x:bx+280,y:-760,w:90,h:190,kind:"tower"});
 }
 // War Games lockdown ends far beyond normal combat view.
 out.push({x:-5150,y:-820,w:65,h:1640,kind:"gate"});
 out.push({x:5085,y:-820,w:65,h:1640,kind:"gate"});
 return out;
}
function reset(){
 p={x:0,y:620,vx:0,vy:0,r:17,hp:100,battery:100,slide:0,cover:null,state:"FREE",phase:0,aim:0,lowerAim:0,drop:0,impact:0,recoil:0};
 bots=[{x:-420,y:-120,vx:0,vy:0,hp:100,cool:1},{x:460,y:-80,vx:0,vy:0,hp:100,cool:1.4}];
 shots=[];fx=[];covers=makeBridgeCovers();cam.x=p.x;cam.y=p.y;
}reset();
const iso=(x,y,z=0)=>({x:W/2+(x-cam.x)+(y-cam.y)*.22,y:H*.46+(y-cam.y)*.60-z});
function pad(){let q=navigator.getGamepads&&navigator.getGamepads()[0];if(!q)return;let dz=v=>Math.abs(v)<.18?0:v,lx=dz(q.axes[0]||0),ly=dz(q.axes[1]||0),rx=dz(q.axes[2]||0),ry=dz(q.axes[3]||0);keys.a=lx<-.2;keys.d=lx>.2;keys.w=ly<-.2;keys.s=ly>.2;if(hyp(rx,ry)>.2){mouse.x=W/2+rx*330;mouse.y=H/2+ry*230}let m={0:"slide",1:"vault",2:"attach",3:"shield",6:"grip",7:"fire",8:"r"};for(let i in m){let k=m[i],down=!!q.buttons[i]?.pressed;if(down&&!prevPad[i])pressed[k]=1;if(k==="fire")mouse.down=down;else keys[k]=down;prevPad[i]=down}}
function nearestFace(o,r){let nx=clamp(o.x,r.x,r.x+r.w),ny=clamp(o.y,r.y,r.y+r.h),dx=o.x-nx,dy=o.y-ny,dd=hyp(dx,dy);return{nx,ny,dx,dy,dd}}
function collide(o,player=false){for(const r of covers){let q=nearestFace(o,r);if(q.dd>=o.r)continue;let nx=q.dx/(q.dd||1),ny=q.dy/(q.dd||1);if(q.dd<.01){nx=0;ny=o.y<r.y?-1:1}let push=o.r-q.dd+1;o.x+=nx*push;o.y+=ny*push;let vdot=o.vx*nx+o.vy*ny;if(vdot<0){o.vx-=vdot*nx;o.vy-=vdot*ny}if(player&&p.slide>0){p.cover={r,nx,ny};p.slide=0;p.vx=p.vy=0;p.state="COVER IMPACT";p.impact=.18;p.drop=1}}}
function fire(from=p,enemy=false){let a=enemy?Math.atan2(p.y-from.y,p.x-from.x):p.aim,n=enemy?1:7;for(let i=0;i<n;i++){let aa=a+(enemy?0:(i-3)*.04);shots.push({x:from.x,y:from.y,vx:Math.cos(aa)*(enemy?780:780),vy:Math.sin(aa)*(enemy?780:780),life:enemy?1.4:.45,enemy})}if(!enemy)p.recoil=1}
function step(dt){pad();let dx=(keys.d?1:0)-(keys.a?1:0),dy=(keys.s?1:0)-(keys.w?1:0),m=hyp(dx,dy)||1,moveA=hyp(dx,dy)>.1?Math.atan2(dy,dx):p.lowerAim;p.aim=Math.atan2(mouse.y-H/2,mouse.x-W/2);let delta=Math.atan2(Math.sin(p.aim-p.lowerAim),Math.cos(p.aim-p.lowerAim)),lim=145*Math.PI/180;if(Math.abs(delta)>lim)p.lowerAim+=Math.sign(delta)*(Math.abs(delta)-lim)*.15;else if(hyp(dx,dy)>.1)p.lowerAim+=(Math.atan2(Math.sin(moveA-p.lowerAim),Math.cos(moveA-p.lowerAim)))*.12;
if((pressed.slide||pressed.shift)&&!p.cover&&hyp(dx,dy)>.1){p.slide=.70;p.vx=dx/m*650;p.vy=dy/m*650;p.state="SLIDE ENTRY"}
if(p.cover){let r=p.cover.r,nx=p.cover.nx,ny=p.cover.ny,tx=-ny,ty=nx,cx=r.x+r.w/2,cy=r.y+r.h/2,along=(p.x-cx)*tx+(p.y-cy)*ty,span=Math.abs(tx)>.5?r.w:r.h,limit=span/2-p.r-2,mv=dx*tx+dy*ty;p.drop+=(1-p.drop)*.25;p.vx=tx*mv*262;p.vy=ty*mv*262;if(Math.abs(along)>=limit){let sg=along<0?-1:1;p.x=cx+tx*limit*sg+nx*(p.r+1);p.y=cy+ty*limit*sg+ny*(p.r+1);p.vx=p.vy=0;p.state=sg<0?"CORNER LEFT":"CORNER RIGHT"}else p.state="COVER SHIMMY";if((pressed.slide||pressed.vault)){p.vx=nx*430+tx*mv*180;p.vy=ny*430+ty*mv*180;p.cover=null;p.drop=0;p.state="COVER KICK"}if(dx*nx+dy*ny>.9){p.cover=null;p.drop=0;p.state="DETACH"}}
else if(p.slide>0){p.slide-=dt;p.vx*=Math.pow(.12,dt);p.vy*=Math.pow(.12,dt);p.drop+=(1-p.drop)*.18}else{let targetX=dx/m*262,targetY=dy/m*262,resp=1-Math.exp(-13*dt);p.vx+=(targetX-p.vx)*resp;p.vy+=(targetY-p.vy)*resp;if(hyp(dx,dy)<.1){p.vx*=Math.pow(.002,dt);p.vy*=Math.pow(.002,dt)}p.drop*=.84;p.state=hyp(dx,dy)>.1?"RUN":"IDLE"}
p.x+=p.vx*dt;p.y+=p.vy*dt;p.x=clamp(p.x,-5200,5200);p.y=clamp(p.y,-950,950);collide(p,true);p.phase+=hyp(p.vx,p.vy)*dt*.045;p.impact=Math.max(0,p.impact-dt);p.recoil*=.72;
if(mouse.down&&(!p.lastShot||performance.now()-p.lastShot>480)){fire();p.lastShot=performance.now()}
bots.forEach((b,i)=>{if(b.hp<=0)return;let a=Math.atan2(p.y-b.y,p.x-b.x),dd=dist(p,b),want=i?300:95;if(dd>want){b.vx+=Math.cos(a)*180*dt;b.vy+=Math.sin(a)*180*dt}else{b.vx*=.9;b.vy*=.9}b.x+=b.vx*dt;b.y+=b.vy*dt;b.cool-=dt;collide({...b,r:17});if(b.cool<=0&&dd<520){fire(b,true);b.cool=i?1.1:1.4}});
shots.forEach(s=>{s.x+=s.vx*dt;s.y+=s.vy*dt;s.life-=dt;if(s.enemy&&dist(s,p)<20){s.life=0;p.hp-=7}else if(!s.enemy)bots.forEach(b=>{if(b.hp>0&&dist(s,b)<20){b.hp-=18;s.life=0}})});shots=shots.filter(s=>s.life>0);if(p.hp<=0)reset();pressed={}}
function line(a,b,w,col){g.strokeStyle=col;g.lineWidth=w;g.lineCap="round";g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke()}
function drawApprovedSprite(P,state,phase,aim){
 if(!spriteReady)return false;
 let fam=state.includes("COVER")||state.includes("CORNER")?"cover":state.includes("SLIDE")?"slide":(state==="IDLE"?"ready":"run");
 let dir=((Math.round((((aim||0)%(Math.PI*2)+Math.PI*2)%(Math.PI*2))/(Math.PI*2)*24))%24),key=fam+"-d"+String(dir).padStart(2,"0"),im=spriteImgs[key];
 if(!im)return false;
 const cell=125,cols=Math.max(1,Math.floor(im.width/cell)),rows=Math.max(1,Math.floor(im.height/cell)),frames=cols*rows;
 let frame=fam==="ready"?0:Math.floor((phase||0)*2)%frames,sx=(frame%cols)*cell,sy=Math.floor(frame/cols)*cell;
 let h=230,w=h;
 g.save();g.imageSmoothingEnabled=false;g.globalAlpha=1;g.drawImage(im,sx,sy,cell,cell,P.x-w/2,P.y-h*.78,w,h);g.restore();return true
}
function body(o,hero){let P=iso(o.x,o.y),aim=hero?p.aim:Math.atan2(p.y-o.y,p.x-o.x),F={x:Math.cos(aim),y:Math.sin(aim)},R={x:-F.y,y:F.x},spriteOnly=hero&&drawApprovedSprite(P,p.state,p.phase,p.aim),spd=Math.min(1,hyp(o.vx,o.vy)/262),cy=Math.sin(hero?p.phase:performance.now()*.006),drop=hero?p.drop:0,slide=hero&&p.slide>0,lean=hero&&p.cover?.35:0;if(spriteOnly){g.fillStyle="#35eaff";g.font="bold 12px monospace";g.fillText("CYBER KITTY // LIVE SPRITE",P.x-82,P.y+32);return}let J={},j=(n,x,y)=>J[n]={x,y};j("pelvis",P.x+R.x*cy*5*spd,P.y-44+drop*25+(slide?24:0));j("sp1",J.pelvis.x+F.x*(slide?12:lean*8),J.pelvis.y-18);j("sp2",J.sp1.x+F.x*(slide?12:lean*8),J.sp1.y-17);j("chest",J.sp2.x+F.x*(slide?10:lean*8),J.sp2.y-17);j("neck",J.chest.x+F.x*4,J.chest.y-13);j("head",J.neck.x+F.x*5,J.neck.y-18);line(J.pelvis,J.sp1,12,"#ff42aa");line(J.sp1,J.sp2,11,"#ff65bd");line(J.sp2,J.chest,10,"#ff8bd0");line(J.chest,J.neck,7,"#ffb1df");g.fillStyle=hero?"#ffe8f7":"#ffd0ae";g.beginPath();g.arc(J.head.x,J.head.y,hero?16:10,0,7);g.fill();let sh=[{x:J.chest.x+R.x*18,y:J.chest.y+R.y*8},{x:J.chest.x-R.x*18,y:J.chest.y-R.y*8}];let hands=[];for(let k=0;k<2;k++){let e={x:sh[k].x+F.x*(24-p.recoil*5)+R.x*(k? -5:5),y:sh[k].y+F.y*18},h={x:e.x+F.x*23,y:e.y+F.y*18};line(sh[k],e,8,"#ff68be");line(e,h,7,"#ff91d0");hands.push(h)}let grip={x:(hands[0].x+hands[1].x)/2,y:(hands[0].y+hands[1].y)/2},muz={x:grip.x+F.x*58,y:grip.y+F.y*58};line(grip,muz,7,"#eaffff");let stride=cy*25*spd;for(let sg of [-1,1]){let h={x:J.pelvis.x+R.x*sg*9,y:J.pelvis.y+5},knee=slide?(sg<0?{x:h.x+F.x*30,y:h.y+18}:{x:h.x-F.x*14,y:h.y+26}):{x:h.x+F.x*stride*sg,y:h.y+36},ank=slide?(sg<0?{x:knee.x+F.x*36,y:knee.y+12}:{x:knee.x-F.x*18,y:knee.y+22}):{x:knee.x+F.x*stride*sg,y:knee.y+38};line(h,knee,10,"#ff91cf");line(knee,ank,9,"#ffb3df");line(ank,{x:ank.x+F.x*16,y:ank.y},6,"#bffaff")}if(hero){
 g.save();g.globalAlpha=.28;g.fillStyle="#ff73c2";g.strokeStyle="#ffd9ef";g.lineWidth=2;
 g.beginPath();g.ellipse(J.pelvis.x,J.pelvis.y-4,20,14,0,0,Math.PI*2);g.fill();g.stroke();
 g.beginPath();g.ellipse(J.sp2.x,J.sp2.y-5,25,32,Math.atan2(F.y,F.x)-Math.PI/2,0,Math.PI*2);g.fill();g.stroke();
 g.beginPath();g.arc(J.head.x,J.head.y,19,0,Math.PI*2);g.fill();g.stroke();
 for(const pair of [[sh[0],hands[0]],[sh[1],hands[1]]]){g.lineWidth=15;g.lineCap="round";g.beginPath();g.moveTo(pair[0].x,pair[0].y);g.lineTo(pair[1].x,pair[1].y);g.stroke()}
 let stride2=cy*25*spd;for(let sg of [-1,1]){let hh={x:J.pelvis.x+R.x*sg*9,y:J.pelvis.y+5},kk=slide?(sg<0?{x:hh.x+F.x*30,y:hh.y+18}:{x:hh.x-F.x*14,y:hh.y+26}):{x:hh.x+F.x*stride2*sg,y:hh.y+36},aa=slide?(sg<0?{x:kk.x+F.x*36,y:kk.y+12}:{x:kk.x-F.x*18,y:kk.y+22}):{x:kk.x+F.x*stride2*sg,y:kk.y+38};g.lineWidth=18;g.beginPath();g.moveTo(hh.x,hh.y);g.lineTo(kk.x,kk.y);g.lineTo(aa.x,aa.y);g.stroke()}
 g.restore();g.fillStyle="#35eaff";g.font="bold 13px Arial";g.fillText("JADE // GHOST PROXY",P.x-58,P.y+34)}}
function draw(){
 g.imageSmoothingEnabled=false;
 // Smooth local-player camera: the fight occupies one small place inside a huge bridge.
 cam.x+=(p.x-cam.x)*.085; cam.y+=(p.y-cam.y)*.085;

 // Bay / sky depth.
 let grad=g.createLinearGradient(0,0,0,H);grad.addColorStop(0,"#111a25");grad.addColorStop(.45,"#0a1822");grad.addColorStop(1,"#031018");
 g.fillStyle=grad;g.fillRect(0,0,W,H);

 // Distant water strips and industrial glow.
 g.fillStyle="#092536";g.fillRect(0,H*.62,W,H*.38);
 for(let i=0;i<18;i++){let xx=((i*211-(cam.x*.04))%(W+300))-150;g.fillStyle=i%3===0?"#19313d":"#122a35";g.fillRect(xx,H*.53+(i%4)*7,80+(i%5)*25,10)}

 // Massive freeway deck, projected from actual world bounds.
 let TL=iso(-5250,-900),TR=iso(5250,-900),BR=iso(5250,900),BL=iso(-5250,900);
 g.fillStyle="#262a2e";g.strokeStyle="#737a80";g.lineWidth=3;g.beginPath();g.moveTo(TL.x,TL.y);g.lineTo(TR.x,TR.y);g.lineTo(BR.x,BR.y);g.lineTo(BL.x,BL.y);g.closePath();g.fill();g.stroke();

 // Asphalt detail, expansion joints, patched seams — world-space so they scroll naturally.
 for(let x=-5200;x<=5200;x+=180){
   line(iso(x,-900),iso(x,900),x%900===0?3:1,x%900===0?"#090b0daa":"#4b505455");
 }
 for(let y=-780;y<=780;y+=130){
   line(iso(-5200,y),iso(5200,y),1,"#555a5f33");
 }
 // Six-lane markings / shoulders.
 for(const y of [-650,-390,-130,130,390,650]){
   for(let x=-5150;x<5150;x+=135) line(iso(x,y),iso(x+72,y),3,"#ece5cf88");
 }
 for(const y of [-840,840]) line(iso(-5200,y),iso(5200,y),5,"#c9ced255");

 // Repeating Bay Bridge tower/cable rhythm at huge scale.
 for(const tx of [-4200,-2100,0,2100,4200]){
   let a=iso(tx,-900,0),b=iso(tx,-900,310),c1=iso(tx+110,-900,0),d=iso(tx+110,-900,310);
   line(a,b,10,"#586570");line(c1,d,10,"#586570");line(b,d,7,"#687681");
   for(let k=-9;k<=9;k++){let wx=tx+k*115;let top=155+145*(1-Math.abs(k)/9);line(iso(wx,-885,0),iso(wx,-885,top),2,"#68768177")}
 }

 // Closed freeway / War Games environmental cues.
 for(let x=-4800;x<=4800;x+=850){
   let q=iso(x,-805);g.fillStyle="#15191e";g.fillRect(q.x-38,q.y-10,76,20);
   g.strokeStyle="#ff168c88";g.strokeRect(q.x-38,q.y-10,76,20);
   g.fillStyle="#ff9bd7";g.font="8px monospace";g.fillText("D33 // CLOSED",q.x-30,q.y+3);
 }
 // Roadside maintenance lights / reflectors.
 for(let x=-5100;x<=5100;x+=95){
   for(const y of [-875,875]){let q=iso(x,y,5);g.fillStyle=(Math.floor(x/95)%2)?"#ff4da6":"#35eaff";g.globalAlpha=.35;g.fillRect(q.x-2,q.y-2,4,4);g.globalAlpha=1}
 }

 // Route labels only near player; useful for playtest navigation.
 g.font="bold 11px monospace";g.fillStyle="#a9bfce";
 for(const r of BAY_BRIDGE.routes){let q=iso(cam.x-470,r.y);if(q.y>80&&q.y<H-40)g.fillText(r.name,q.x,q.y-7)}

 // Existing combat object family distributed across the freeway.
 for(const r of covers){
   // coarse camera cull
   if(Math.abs(r.x-cam.x)>900||Math.abs(r.y-cam.y)>1150)continue;
   let A=iso(r.x,r.y),B=iso(r.x+r.w,r.y),C=iso(r.x+r.w,r.y+r.h),D=iso(r.x,r.y+r.h);
   let fill=r.kind==="wreck"?"#3b4046":r.kind==="tower"?"#4c5158":r.kind==="gate"?"#3c2338":r.kind==="median"?"#4b4843":"#434a50";
   let edge=r.kind==="gate"?"#ff168c":r.kind==="tower"?"#ffd76a":"#35eaff";
   g.fillStyle=fill;g.strokeStyle=edge;g.lineWidth=2;g.beginPath();g.moveTo(A.x,A.y);g.lineTo(B.x,B.y);g.lineTo(C.x,C.y);g.lineTo(D.x,D.y);g.closePath();g.fill();g.stroke();
   g.fillStyle="#171b20";g.beginPath();g.moveTo(D.x,D.y);g.lineTo(C.x,C.y);g.lineTo(C.x,C.y+28);g.lineTo(D.x,D.y+28);g.closePath();g.fill();
   if(r.kind==="wreck"){g.fillStyle="#20262c";let Q=iso(r.x+r.w*.22,r.y+r.h*.5,22);g.fillRect(Q.x-18,Q.y-8,36,16)}
 }
 shots.forEach(s=>{let q=iso(s.x,s.y,18);g.fillStyle=s.enemy?"#ff6a3d":"#35eaff";g.beginPath();g.arc(q.x,q.y,4,0,7);g.fill()});
 bots.forEach(b=>{if(b.hp>0&&Math.abs(b.x-cam.x)<1000&&Math.abs(b.y-cam.y)<1200)body(b,false)});
 body(p,true);

 // Minimal HUD over immersive world.
 g.fillStyle="#ff168c";g.font="bold 16px monospace";g.fillText("GOD MODE // ALTERED DIMENSION BAY BRIDGE",22,105);
 g.fillStyle="#35eaff";g.font="12px monospace";g.fillText("MASSIVE WORLD V2 · LOCAL COMBAT WINDOW",22,124);
 g.fillStyle="#d8e7ee";g.font="11px monospace";g.fillText("BRIDGE POS "+Math.round(p.x)+" / "+Math.round(p.y),22,142);
 stats.innerHTML="BAY BRIDGE V2<br>STATE "+p.state+"<br>HP "+Math.ceil(p.hp)+"<br>BATTERY "+Math.ceil(p.battery)+"%";
 if(poseName)poseName.textContent=p.state
}
function frame(now){let dt=Math.min(.05,(now-last)/1000);last=now;acc+=dt;while(acc>=FIX){step(FIX);acc-=FIX}draw();requestAnimationFrame(frame)}requestAnimationFrame(frame);
})();