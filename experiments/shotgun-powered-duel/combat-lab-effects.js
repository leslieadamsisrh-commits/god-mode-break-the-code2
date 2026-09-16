const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
async function sheet(url,cell=384,size=192){
 const im=new Image();await new Promise((ok,no)=>{im.onload=ok;im.onerror=()=>no(Error(url));im.src=url});
 const frames=[];for(let i=0;i<im.width/cell*im.height/cell;i++){const tile=document.createElement('canvas');tile.width=tile.height=size;tile.getContext('2d').drawImage(im,i%6*cell,Math.floor(i/6)*cell,cell,cell,0,0,size,size);frames.push(tile)}return frames;
}
export async function loadLabEffects(){
 const [ground,expressions,surfaces]=await Promise.all([sheet('assets/shotgun-refinement/ground-effects.png'),sheet('assets/shotgun-refinement/manga-expression.png'),sheet('assets/shotgun-v57/barrier-surfaces-natural.png',512,384)]);
 const chunks=new Image();await new Promise((ok,no)=>{chunks.onload=ok;chunks.onerror=no;chunks.src='assets/shotgun-v57/barrier-chunks-natural-4x2-128.png'});
 function face(ctx,points,texture){
  ctx.save();ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.clip();
  // Orthographic extrusion: these faces are parallelograms and need one affine
  // texture mapping. Their base corners are exactly the collision rectangle.
  const [a,b,,d]=points;ctx.transform((b[0]-a[0])/texture.width,(b[1]-a[1])/texture.width,(d[0]-a[0])/texture.height,(d[1]-a[1])/texture.height,a[0],a[1]);ctx.drawImage(texture,0,0);ctx.restore();
  ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.strokeStyle='#110f18';ctx.lineWidth=3;ctx.stroke();
 }
 const decals=[],air=[];
 return{
  clear(){decals.length=air.length=0},counts:()=>({decals:decals.length,air:air.length}),
  stamp(x,y,angle,now,kind){
   if(decals.length>=96)decals.shift();decals.push({x,y,angle,born:now,life:kind==='impact'?9:6,index:kind==='impact'?2:3,size:kind==='impact'?115:kind==='drag'?65:85});
   if(air.length>=40)air.shift();air.push({x,y,angle,born:now,life:.55,index:kind==='impact'?4:5,size:kind==='impact'?100:105});
   if(kind==='impact'||decals.length%3===0){if(air.length>=40)air.shift();air.push({x,y,angle:0,born:now,life:.45,index:0,size:55})}
  },
  update(dt,now){for(let i=decals.length-1;i>=0;i--)if(now-decals[i].born>decals[i].life)decals.splice(i,1);for(let i=air.length-1;i>=0;i--)if(now-air[i].born>air[i].life)air.splice(i,1)},
  drawGround(ctx,now){for(const d of decals){ctx.save();ctx.translate(d.x,d.y);ctx.rotate(d.angle+Math.PI/4);ctx.globalAlpha=.65*clamp((d.life-(now-d.born))/1.2,0,1);ctx.drawImage(ground[d.index],-d.size/2,-d.size/2,d.size,d.size);ctx.restore()}},
  drawAir(ctx,now){for(const p of air){const t=(now-p.born)/p.life;ctx.save();ctx.translate(p.x,p.y-(p.index===0?Math.sin(t*Math.PI)*18:0));if(p.index===5)ctx.rotate(p.angle+Math.PI/4);ctx.globalAlpha=1-t;ctx.drawImage(ground[p.index],-p.size/2,-p.size/2,p.size,p.size);ctx.restore()}},
  drawExpression(ctx,index,x,y,opacity=1){ctx.save();ctx.globalAlpha=clamp(opacity*2,0,1);ctx.drawImage(expressions[index],x-24,y-24,48,48);ctx.restore()},
  drawCover(ctx,c,now){
   const ratio=c.hp/c.max,build=c.kind==='built'?clamp((now-c.born)/.65,0,1):1,ca=Math.cos(c.a),sa=Math.sin(c.a),height=76;
   const base=[[-c.w/2,-c.h/2],[c.w/2,-c.h/2],[c.w/2,c.h/2],[-c.w/2,c.h/2]].map(([x,y])=>[c.x+x*ca-y*sa,c.y+x*sa+y*ca]);
   const hover=c.hover||0,bottom=base.map(([x,y])=>[x,y-hover]),top=base.map(([x,y])=>[x,y-height-hover]);ctx.save();
   // Ground boundary remains legible during assembly and corresponds to contact.
   ctx.beginPath();base.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fillStyle='#06081066';ctx.fill();
   // A chipped convex silhouette stays within the original collision footprint.
   const points=[...top,...bottom].sort((a,b)=>a[0]-b[0]||a[1]-b[1]),cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
   const lo=[],hi=[];for(const q of points){while(lo.length>1&&cross(lo.at(-2),lo.at(-1),q)<=0)lo.pop();lo.push(q)}for(const q of [...points].reverse()){while(hi.length>1&&cross(hi.at(-2),hi.at(-1),q)<=0)hi.pop();hi.push(q)}const hull=[...lo.slice(0,-1),...hi.slice(0,-1)],outline=[];
   for(let i=0;i<hull.length;i++){const a=hull[i],b=hull[(i+1)%hull.length],n=Math.max(2,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/22));for(let j=0;j<n;j++){const t=j/n,x=a[0]+(b[0]-a[0])*t,y=a[1]+(b[1]-a[1])*t,dx=c.x-x,dy=c.y-height*.5-y,d=Math.hypot(dx,dy)||1,chop=[7,2,5,0,3][(i*3+j)%5];outline.push([x+dx/d*chop,y+dy/d*chop])}}
   function silhouette(){ctx.beginPath();outline.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath()}
   ctx.save();if(build>=1){silhouette();ctx.clip()}
   // The complete collider is visible as a faint blueprint immediately. Solid
   // illustrated panels converge from separated positions over 650ms.
   const solid=build*build*(3-2*build);
   function assembled(points,texture,topFace=false){
    if(build>=1){if(topFace){face(ctx,points,texture);return}
     ctx.save();ctx.beginPath();const a=points[0],b=points[1],d=points[3],e=points[2];ctx.moveTo(...a);
     for(let j=1;j<=12;j++){const t=j/12;ctx.lineTo(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t+(j===12?0:[0,3,1,5,2][j%5]))}ctx.lineTo(...e);ctx.lineTo(...d);ctx.closePath();ctx.clip();face(ctx,points,texture);ctx.restore();return}
    const [a,b,e,d]=points;
    for(let k=0;k<4;k++){const u=k/4,v=(k+1)/4,lerp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t],p=[lerp(a,b,u),lerp(a,b,v),lerp(d,e,v),lerp(d,e,u)];ctx.save();ctx.translate((k-1.5)*42*(1-solid),Math.sin(k*2.1)*(1-solid)*38);ctx.globalAlpha=.22+.78*solid;ctx.beginPath();p.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.clip();face(ctx,points,texture);ctx.restore()}
   }
   for(let i=0;i<4;i++){const j=(i+1)%4;if(base[j][0]-base[i][0]<0)assembled([top[j],top[i],bottom[i],bottom[j]],i%2?surfaces[2]:ratio<=.65?surfaces[ratio>.3?4:5]:surfaces[i===2?3:0])}
   assembled([top[0],top[1],top[2],top[3]],surfaces[1],true);
   ctx.restore();if(build>=1){silhouette();ctx.strokeStyle='#13111b';ctx.lineWidth=2;ctx.stroke()}
   if(ratio<.7){ctx.globalAlpha=(1-ratio)*.8;ctx.drawImage(ground[2],c.x-65,c.y-height-hover-30,130,70)}
   if(c.held){ctx.globalAlpha=.32;ctx.drawImage(ground[5],c.x-95,c.y-12,190,26);ctx.globalAlpha=1;}
   if(build<1){ctx.globalAlpha=1-build;ctx.strokeStyle='#c197ff';ctx.lineWidth=2;for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(...base[i]);ctx.lineTo(base[i][0],base[i][1]-76);ctx.stroke()}ctx.drawImage(ground[5],c.x-70,c.y-height-25,140,50);for(let i=0;i<8;i++){const a=i*Math.PI/4+build*.7,r=25+(1-solid)*130,x=c.x+Math.cos(a)*r,y=c.y-height*.5+Math.sin(a)*r*.45-(1-solid)*20;ctx.globalAlpha=1-solid;ctx.drawImage(chunks,(i%4)*128,Math.floor(i/4)*128,128,128,x-23,y-23,46,46)}}
   ctx.restore();return true;
  }
 };
}
