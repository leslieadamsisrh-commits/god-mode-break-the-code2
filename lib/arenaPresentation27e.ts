import frames from './dimension33Frames20.json';
import {triangle20} from './dimension33MapArt20';
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
 for(const f of ordered){g.beginPath();path(g,f.vertices);g.fillStyle=f.kind==='top'?'#35414a':f.kind==='support'?'#253039':'#19242e';g.fill();g.strokeStyle='#0b1119';g.lineWidth=1.8;g.stroke();}
 for(const s of COMBAT_SURFACES){if(s.id==='ground')continue;const xs=s.polygon.map(p=>p.x),ys=s.polygon.map(p=>p.y),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
 const frame=(frames as any)['floor/industrial-plating'],image=images.get('d33-map20-floor');
 if(image?.complete&&image.naturalWidth){const [u,v,w,h]=frame.rect;for(let y=y0;y<y1;y+=27)for(let x=x0;x<x1;x+=40){const xx=Math.min(x+40,x1),yy=Math.min(y+27,y1),world=[{x,y},{x:xx,y},{x:xx,y:yy},{x,y:yy}],dst=world.map(p=>point({...p,z:height(s,p)})),src=[{x:u+4,y:v+4},{x:u+w/3-4,y:v+4},{x:u+w/3-4,y:v+h/3-4},{x:u+4,y:v+h/3-4}];for(const indices of [[0,1,2],[0,2,3]])triangle20(g,image,indices.map(i=>src[i]),indices.map(i=>dst[i]));}}
 const line=(a:{x:number;y:number},b:{x:number;y:number},color:string,width=1)=>{g.beginPath();const A=point({...a,z:height(s,a)+.1}),B=point({...b,z:height(s,b)+.1});g.moveTo(A.x,A.y);g.lineTo(B.x,B.y);g.strokeStyle=color;g.lineWidth=width;g.stroke();};
 if(s.rise){for(let n=0;n<=9;n++){const y=y0+(y1-y0)*n/9;line({x:x0+2,y},{x:x1-2,y},n===0||n===9?'#caa165':'#819098',1.3);}}
 else{for(let x=x0+40;x<x1;x+=40)line({x,y:y0+2},{x,y:y1-2},'#17242e');for(let y=y0+27;y<y1;y+=27)line({x:x0+2,y},{x:x1-2,y},'#17242e');}
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
