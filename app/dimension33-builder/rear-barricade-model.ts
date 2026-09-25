import {drawContactShadow} from './contact-shadow';
type Point={x:number;y:number};
export const REAR_BARRICADE_SEGMENTS=[{x:-87,y:7,angle:-.12,w:102,d:38},{x:0,y:-3,angle:0,w:100,d:38},{x:87,y:7,angle:.12,w:102,d:38}] as const;
const atlas={side:[325,30,185,326],top:[21,37,470,70]} as const;
const sourceFaces=[{wall:[1395,545,88,44],cap:[1395,518,88,24],end:[1395,545,19,44]},{wall:[1485,539,100,42],cap:[1485,514,100,20],end:[1485,539,19,42]},{wall:[1585,545,85,44],cap:[1585,518,85,24],end:[1650,545,20,44]}] as const;
function polygon(c:CanvasRenderingContext2D,p:Point[]){c.beginPath();p.forEach((q,i)=>i?c.lineTo(q.x,q.y):c.moveTo(q.x,q.y));c.closePath();}
function textured(c:CanvasRenderingContext2D,p:Point[],img:HTMLImageElement|undefined,rect:readonly [number,number,number,number],fill:string,opacity=.89){polygon(c,p);c.fillStyle=fill;c.fill();if(img?.complete&&img.naturalWidth){const [sx,sy,sw,sh]=rect,[a,b,,d]=p;c.save();polygon(c,p);c.clip();c.transform((b.x-a.x)/sw,(b.y-a.y)/sw,(d.x-a.x)/sh,(d.y-a.y)/sh,a.x,a.y);c.globalAlpha=opacity;c.drawImage(img,sx,sy,sw,sh,0,0,sw,sh);c.restore();}polygon(c,p);c.strokeStyle='#070c15';c.lineWidth=2.6;c.stroke();}
export function drawRearBarricade(c:CanvasRenderingContext2D,container:HTMLImageElement|undefined,hp:number,angle:number,part:'all'|0|1|2='all',sourceImage?:HTMLImageElement){
 if(hp<=0)return;const co=Math.cos(angle),sn=Math.sin(angle),project=(x:number,y:number,z:number):Point=>({x:x*co-y*sn,y:x*sn+y*co-z});
 for(const [i,s] of REAR_BARRICADE_SEGMENTS.entries()){if(part!=='all'&&part!==i)continue;
  const local=(x:number,y:number,z:number)=>{const cs=Math.cos(s.angle),ss=Math.sin(s.angle);return project(s.x+x*cs-y*ss,s.y+x*ss+y*cs,z)};
  const w=s.w/2,d=s.d/2,h=40;
  const b=[local(-w,-d,0),local(w,-d,0),local(w,d,0),local(-w,d,0)];
  const t=[local(-w,-d,h),local(w,-d,h),local(w,d,h),local(-w,d,h)];
  drawContactShadow(c,(b[0].x+b[2].x)/2,(b[0].y+b[2].y)/2,w*2,d*2,angle+s.angle);
  // Only the camera-facing long wall and end wall are visible. At 180° the
  // textured rear wall becomes the near face, so its artwork stays intact.
  const theta=angle+s.angle;
  const nearLong=Math.cos(theta)>=0?2:0;
  const nearEnd=Math.sin(theta)>=0?1:3;
  const walls=[
   {p:[t[0],t[1],b[1],b[0]],image:sourceImage,crop:sourceFaces[i].wall,fill:'#263648'},
   {p:[t[1],t[2],b[2],b[1]],image:sourceImage,crop:sourceFaces[i].end,fill:'#5a6875'},
   {p:[t[3],t[2],b[2],b[3]],image:sourceImage,crop:sourceFaces[i].wall,fill:'#2c3e51'},
   {p:[t[0],t[3],b[3],b[0]],image:sourceImage,crop:sourceFaces[i].end,fill:'#536475'}] as const;
  for(const index of [nearLong,nearEnd]){const wall=walls[index];textured(c,[...wall.p],wall.image,wall.crop,wall.fill,index===nearEnd?.58:.89);}
  textured(c,t,sourceImage,sourceFaces[i].cap,'#b7bdba');
  const endX=nearEnd===1?w+1:-w-1,endA=local(endX,0,8),endB=local(endX,0,30);c.save();c.strokeStyle='#ffc46c';c.shadowColor='#ff9a3c';c.shadowBlur=9;c.lineWidth=3;c.beginPath();c.moveTo(endA.x,endA.y);c.lineTo(endB.x,endB.y);c.stroke();c.restore();
  // Faceted top cap and inset amber lamps follow this section's actual geometry.
  const rimA=local(-w,-d,42),rimB=local(w,-d,42),rimC=local(w,d,42),rimD=local(-w,d,42);
  c.save();c.strokeStyle='#e4dcbd';c.lineWidth=3;c.beginPath();c.moveTo(rimA.x,rimA.y);c.lineTo(rimB.x,rimB.y);c.lineTo(rimC.x,rimC.y);c.stroke();c.strokeStyle='#0c121a';c.lineWidth=2;c.beginPath();c.moveTo(rimD.x,rimD.y);c.lineTo(rimC.x,rimC.y);c.stroke();
  for(const x of [-w+8,w-8]){const a=local(x,d+1,24),b=local(x,d+1,35);c.strokeStyle='#ffb653';c.shadowColor='#ff8a26';c.shadowBlur=7;c.lineWidth=3;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();}c.restore();
  if(hp<7){const a=local(-12,d+2,25);c.strokeStyle='#fb6fa8';c.lineWidth=2.5;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(a.x+9,a.y+9);c.lineTo(a.x+4,a.y+17);c.stroke();}
  // The two dark heel brackets are attached to the outer ends, never free-floating.
  if(i!==1){const x=i===0?-w+15:w-15,y=d+5,foot=[local(x-10,y-7,12),local(x+10,y-7,12),local(x+10,y+9,12),local(x-10,y+9,12)],base=[local(x-10,y-7,0),local(x+10,y-7,0),local(x+10,y+9,0),local(x-10,y+9,0)];textured(c,[foot[3],foot[2],base[2],base[3]],container,atlas.side,'#172332');textured(c,foot,sourceImage,sourceFaces[i].cap,'#5f6b70');}
 }
}
