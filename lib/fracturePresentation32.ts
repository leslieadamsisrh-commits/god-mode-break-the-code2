import {type Shape32,localPolys32,edges32,lattice32} from './fracture32';
import {relativeWorld46,vertical46} from './bayBridgePresentation';
import {coverSupport27h} from './arenaStructures27e';
import {height} from './elevation27a';
// Registered procedural concrete faces. This is not a cropped whole-barrier sprite.
export function drawFracture32(g:CanvasRenderingContext2D,c:Shape32&{z?:number;hover?:number;hp:number;maxHp:number;selectedCells32?:number[];heldRelation30?:string;blocked30?:boolean;anchored27j?:boolean},time:number){
 const f=c.fracture32!,co=Math.cos(c.a||0),si=Math.sin(c.a||0),base=(c.z||0)+(c.hover||0);
 const project=(p:{x:number;y:number},z:number)=>{const q=relativeWorld46(c.x,c.y,p.x*co-p.y*si,p.x*si+p.y*co),v=vertical46(c.x,c.y,z);return{x:c.x+q.x+v.x,y:c.y+q.y+v.y};};
 const polygon=(p:{x:number;y:number}[],fill:string,stroke?:string,width=1.2)=>{g.beginPath();p.forEach((q,i)=>i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y));g.closePath();g.fillStyle=fill;g.fill();if(stroke){g.strokeStyle=stroke;g.lineWidth=width;g.stroke();}};
 g.save();const polys=localPolys32(c),floor=height(coverSupport27h(c),c);
 for(const p of polys)polygon(p.map(q=>project(q,floor)),'#050c1448');
 const boundary=edges32(c);const merged=boundary.map(e=>({a:{...e.a},b:{...e.b}}));for(let pass=0;pass<32;pass++){let did=false;for(let i=0;i<merged.length&&!did;i++)for(let j=0;j<merged.length;j++){if(i===j)continue;const a=merged[i],b=merged[j],dx=a.b.x-a.a.x,dy=a.b.y-a.a.y;if(Math.hypot(a.b.x-b.a.x,a.b.y-b.a.y)<1e-7&&Math.abs(dx*(b.b.y-b.a.y)-dy*(b.b.x-b.a.x))<1e-7){a.b=b.b;merged.splice(j,1);did=true;break;}}if(!did)break;}const faces=merged.map(e=>{const a={x:e.a.x+f.ox,y:e.a.y+f.oy},b={x:e.b.x+f.ox,y:e.b.y+f.oy},outer=Math.abs(a.x-b.x)<1e-6&&Math.abs(Math.abs(a.x)-f.width/2)<1e-6||Math.abs(a.y-b.y)<1e-6&&Math.abs(Math.abs(a.y)-f.depth/2)<1e-6;return{...e,outer,points:[project(e.a,base),project(e.b,base),project(e.b,base+f.height),project(e.a,base+f.height)]};}).sort((a,b)=>(a.points[0].y+a.points[1].y)-(b.points[0].y+b.points[1].y));
 for(const face of faces){polygon(face.points,face.outer?'#526575':'#a3a59a','#142332');
  // Fracture aggregate follows source coordinates and stays with its cell edges.
  for(let k=1;k<5;k++){const t=k/5,p={x:face.a.x+(face.b.x-face.a.x)*t,y:face.a.y+(face.b.y-face.a.y)*t},q=project(p,base+f.height*(.2+((k*7+f.seed)%11)/16));g.fillStyle=face.outer?'#728391':'#646e6c';g.fillRect(q.x-1,q.y-1,2,2);}
  if(face.outer){const a=project(face.a,base+f.height*.3),b=project(face.b,base+f.height*.3);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.strokeStyle='#b98b54';g.lineWidth=2;g.stroke();}
 }
 for(const p of polys)polygon(p.map(q=>project(q,base+f.height)),'#81919c','#81919c',.7);
 for(const e of boundary){const a=project(e.a,base+f.height),b=project(e.b,base+f.height);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.strokeStyle='#152532';g.lineWidth=1.7;g.stroke();}
 if(c.selectedCells32?.length){const selected={...c,fracture32:{...f,cells:c.selectedCells32}},tint='#adf4f4';for(const e of edges32(selected)){const a=project(e.a,base+f.height+.5),b=project(e.b,base+f.height+.5);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.strokeStyle=tint;g.lineWidth=2;g.stroke();}}
 if(c.heldRelation30){const p=project({x:0,y:0},base+f.height+1);g.strokeStyle=c.blocked30?'#efb66d':c.heldRelation30==='local'?'#65efff':'#ff82c2';g.lineWidth=1.8;g.beginPath();if(c.heldRelation30==='local'){g.moveTo(p.x-7,p.y-3);g.lineTo(p.x-7,p.y+3);g.moveTo(p.x+7,p.y-3);g.lineTo(p.x+7,p.y+3);}else{g.moveTo(p.x,p.y-5);g.lineTo(p.x+6,p.y);g.lineTo(p.x,p.y+5);g.lineTo(p.x-6,p.y);g.closePath();}g.stroke();}
 if(c.hp<c.maxHp){const e=boundary[0];if(e){const a=project(e.a,base+f.height*.8),b=project(e.b,base+f.height*.2);g.beginPath();g.moveTo(a.x,a.y);g.lineTo((a.x+b.x)/2+2,(a.y+b.y)/2);g.lineTo(b.x,b.y);g.strokeStyle='#24313a';g.lineWidth=1.5;g.stroke();}}
 g.restore();
}
