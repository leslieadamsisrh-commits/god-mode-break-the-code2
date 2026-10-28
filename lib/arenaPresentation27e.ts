import {THEME28} from './arenaFoundation28';
import {COMBAT_SURFACES,structureFaces27e,foregroundFace27e,type Vertex27e} from './arenaStructures27e';
import {height} from './elevation27a';
import {withWorld46,relativeWorld46,vertical46} from './bayBridgePresentation';
const faces=structureFaces27e();
const anchor={x:750,y:420};
function point(v:Vertex27e){const r=relativeWorld46(anchor.x,anchor.y,v.x-anchor.x,v.y-anchor.y),z=vertical46(anchor.x,anchor.y,v.z);return{x:anchor.x+r.x+z.x,y:anchor.y+r.y+z.y};}
function path(g:CanvasRenderingContext2D,vertices:Vertex27e[]){vertices.map(point).forEach((p,n)=>n?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.closePath();}
export function drawStructures27e(g:CanvasRenderingContext2D,images:Map<string,HTMLImageElement>){withWorld46(g,anchor.x,anchor.y,()=>{
 g.save();
 // Contact shadows are on ground, before any raised structure is drawn.
 for(const s of COMBAT_SURFACES){if(s.id==='ground')continue;g.beginPath();path(g,s.polygon.map(p=>({...p,z:0})));g.fillStyle='#05091166';g.fill();}
 const ordered=[...faces].sort((a,b)=>a.vertices.reduce((n,p)=>n+p.y,0)/a.vertices.length-b.vertices.reduce((n,p)=>n+p.y,0)/b.vertices.length || Number(a.kind==='top')-Number(b.kind==='top'));
 for(const f of ordered){g.beginPath();path(g,f.vertices);g.fillStyle=f.kind==='top'?THEME28.top:f.kind==='support'?THEME28.wall:f.id.endsWith('0')?THEME28.wall:THEME28.wallLight;g.fill();g.strokeStyle='#0b1119';g.lineWidth=2.6;g.stroke();
  if(f.kind==='side'&&f.vertices.length===4){
   const [a,b,c,d]=f.vertices;
   const mix=(u:Vertex27e,v:Vertex27e,t:number)=>({x:u.x+(v.x-u.x)*t,y:u.y+(v.y-u.y)*t,z:u.z+(v.z-u.z)*t});
   const at=(u:number,v:number)=>mix(mix(a,b,u),mix(d,c,u),v);
   const stroke=(p:Vertex27e,q:Vertex27e,color:string,width:number)=>{const A=point(p),B=point(q);g.beginPath();g.moveTo(A.x,A.y);g.lineTo(B.x,B.y);g.strokeStyle=color;g.lineWidth=width;g.stroke();};
   // Flush armored fascia and recessed wall panels, all inside the real face.
   g.save();g.beginPath();path(g,f.vertices);g.clip();
   stroke(at(0,.04),at(1,.04),'#91a4b0',2);
   stroke(at(0,.12),at(1,.12),'#162737',3);
   stroke(at(0,.94),at(1,.94),'#152230',5);
   const count=Math.max(1,Math.floor(Math.hypot(b.x-a.x,b.y-a.y)/100));
   for(let n=0;n<count;n++){
    const u0=(n+.08)/count,u1=(n+.92)/count;
    g.beginPath();path(g,[at(u0,.2),at(u1,.2),at(u1,.86),at(u0,.86)]);g.fillStyle=n%2?'#31485a':'#2c4254';g.fill();g.strokeStyle='#192e40';g.lineWidth=1;g.stroke();
    stroke(at(u0,.2),at(u1,.2),'#627584',.8);
    for(const u of [u0,u1])for(const v of [.24,.82]){const P=point(at(u,v));g.fillStyle='#87949d';g.fillRect(P.x-.7,P.y-.7,1.4,1.4);}
   }
   g.restore();
  }
  if(f.kind==='side'&&f.vertices.length===4){const [a,b,c,d]=f.vertices;if(Math.hypot(b.x-a.x,b.y-a.y)>90&&Math.abs(a.z-d.z)>20){
   for(const t of [.25,.75]){const mix=(u:Vertex27e,v:Vertex27e,k:number)=>({x:u.x+(v.x-u.x)*k,y:u.y+(v.y-u.y)*k,z:u.z+(v.z-u.z)*k});const u=mix(a,b,t),v=mix(d,c,t);g.beginPath();const U=point(mix(u,v,.15)),V=point(mix(u,v,.85));g.moveTo(U.x,U.y);g.lineTo(V.x,V.y);g.strokeStyle='#102337';g.lineWidth=2;g.stroke();const lamp=point(mix(u,v,.28));g.fillStyle='#efb265';g.fillRect(lamp.x-2,lamp.y-2,4,5);}
  }}
 }
 for(const s of COMBAT_SURFACES){if(s.id==='ground')continue;const xs=s.polygon.map(p=>p.x),ys=s.polygon.map(p=>p.y),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
 const line=(a:{x:number;y:number},b:{x:number;y:number},color:string,width=1)=>{g.beginPath();const A=point({...a,z:height(s,a)+.1}),B=point({...b,z:height(s,b)+.1});g.moveTo(A.x,A.y);g.lineTo(B.x,B.y);g.strokeStyle=color;g.lineWidth=width;g.stroke();};
 if(s.rise){const cx=(x0+x1)/2,cy=(y0+y1)/2,up=height(s,{x:x1,y:cy})>height(s,{x:x0,y:cy})?1:-1;for(const offset of [-40,20]){const x=cx+offset;line({x:x-up*9,y:cy-9},{x,y:cy},'#c6ad7d',2);line({x,y:cy},{x:x-up*9,y:cy+9},'#c6ad7d',2);}for(let n=0;n<=12;n++){const color=n===0||n===12?THEME28.lamp:'#9ba8ae';if(s.rise.axis==='x'){const x=x0+(x1-x0)*n/12;line({x:x+1.8,y:y0+3},{x:x+1.8,y:y1-3},'#1b3041',3);line({x,y:y0+2},{x,y:y1-2},color,1.1);}else{const y=y0+(y1-y0)*n/12;line({x:x0+2,y},{x:x1-2,y},color,1.3);}}}
 else{for(let x=x0+140;x<x1;x+=140)line({x,y:y0+2},{x,y:y1-2},'#17242e');for(let y=y0+110;y<y1;y+=110)line({x:x0+2,y},{x:x1-2,y},'#17242e');}
 if(s.id.endsWith('-platform')){for(const y of [y0+18,y1-18])line({x:x0+18,y},{x:x1-18,y},'#7891a0',1);for(const x of [x0+18,x1-18])line({x,y:y0+18},{x,y:y1-18},'#7891a0',1);}
 if(!s.rise){line({x:x0+3,y:y0+4},{x:x1-3,y:y0+4},s.id.includes('west')?'#66dce4':s.id.includes('east')?'#df72b7':'#7695ad',1.6);}
 // Flush edge lights; no decorative railing implying an invisible barrier.
 for(let x=x0+8;x<x1-8;x+=40)line({x,y:y1-2},{x:Math.min(x+12,x1-4),y:y1-2},'#e8ac60',2);
 }
 g.restore();
});}
export function withStructureOcclusion27e(g:CanvasRenderingContext2D,actor:{x:number;y:number;z?:number;supportSurfaceId?:string|null},draw:()=>void){
 g.save();withWorld46(g,anchor.x,anchor.y,()=>{
 for(const f of faces){if(actor.supportSurfaceId===f.surfaceId||Math.max(...f.vertices.map(p=>p.z))<=(actor.z||0)+.1)continue;const polygon=foregroundFace27e(f,actor.y);if(polygon.length<3)continue;g.beginPath();g.rect(-10000,-10000,20000,20000);path(g,polygon);g.clip('evenodd');}
 // withWorld46 restores its save, including clipping; draw while it is active.
 draw();
 });g.restore();
}

// Only local, concealed contour points are drawn. No sprite textures or combat effects
// are replayed. The combined face path clips the cue to architecture, not clear air.
export function drawConcealedSpark27h(g:CanvasRenderingContext2D,actor:{x:number;y:number;z:number;aim:number;supportSurfaceId?:string|null},time:number){
 const hidden=faces.filter(f=>actor.supportSurfaceId!==f.surfaceId&&Math.max(...f.vertices.map(p=>p.z))>actor.z+.1).map(f=>foregroundFace27e(f,actor.y)).filter(p=>p.length>=3);
 if(!hidden.length)return;
 withWorld46(g,anchor.x,anchor.y,()=>{g.save();g.beginPath();for(const p of hidden)path(g,p);g.clip();
 // A sparse anatomical outline, never a transparent duplicate of Jade's artwork.
 const outline=[[-9,60],[-10,67],[-5,63],[0,65],[5,63],[10,67],[9,60],[12,52],[18,46],[20,34],[12,32],[10,24],[12,13],[16,2],[7,1],[2,19],[-2,19],[-7,1],[-16,2],[-12,13],[-10,24],[-12,32],[-20,34],[-18,46],[-12,52]];
 for(let n=0;n<outline.length;n++){const [x,z]=outline[n],v=point({x:actor.x+x,y:actor.y,z:actor.z+z}),pulse=.5+.5*Math.sin(time*2.8+n*2.399);g.globalAlpha=.09+.16*pulse;g.fillStyle=n%3?'#9edce8':'#f2eaff';const r=.55+pulse*.5;g.fillRect(v.x-r,v.y-r,r*2,r*2);}
 g.restore();});
}
