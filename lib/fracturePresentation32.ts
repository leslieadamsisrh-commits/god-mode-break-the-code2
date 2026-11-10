import {type Shape32,localPolys32,faces33,visibleFractureFaces33,hash32} from './fracture32';
import {relativeWorld46,vertical46} from './bayBridgePresentation';
import {coverSupport27h} from './arenaStructures27e';
import {height} from './elevation27a';
// Source-registered concrete. Every visible fracture plane comes from occupied volumes.
export function drawFracture32(g:CanvasRenderingContext2D,c:Shape32&{hp:number;maxHp:number;selectedCells32?:number[];gatherProgress36?:number;protective36?:boolean;heldRelation30?:string;blocked30?:boolean;anchored27j?:boolean},time:number){
 const f=c.fracture32!,co=Math.cos(c.a||0),si=Math.sin(c.a||0),base=(c.z||0)+(c.hover||0);
 const project=(p:{x:number;y:number;z:number})=>{const q=relativeWorld46(c.x,c.y,p.x*co-p.y*si,p.x*si+p.y*co),v=vertical46(c.x,c.y,base+p.z);return{x:c.x+q.x+v.x,y:c.y+q.y+v.y};};
 const polygon=(p:{x:number;y:number}[],fill:string,stroke?:string,width=1)=>{g.beginPath();p.forEach((q,i)=>i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y));g.closePath();g.fillStyle=fill;g.fill();if(stroke){g.strokeStyle=stroke;g.lineWidth=width;g.stroke();}};
 g.save();const floor=height(coverSupport27h(c),c);
 for(const p of localPolys32(c))polygon(p.map(q=>project({...q,z:floor-base})),'#050c1438');
 const faces=visibleFractureFaces33(c).sort((a,b)=>{
  const depth=(f:typeof a)=>f.points.reduce((n,p)=>n+p.x*si+p.y*co,0)/f.points.length;return depth(a)-depth(b)||(a.kind==='top'?1:-1);
 });
 for(const face of faces){const projected=face.points.map(project),fracture=!face.exterior;
  polygon(projected,face.kind==='top'?(fracture?'#a4a49a':'#87918f'):(fracture?'#85877d':'#5e6d73'),face.exterior?undefined:'#35423e',.7);
  // Deterministic aggregate is attached to this source face, not rerolled per frame.
  g.save();g.beginPath();projected.forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.closePath();g.clip();
  const [a,b,,d]=face.points,seed=hash32(f.sourceId+'/'+face.id+'/'+face.kind);
  for(let k=0;k<(fracture?9:3);k++){const u=((seed+k*137)%89+5)/100,v=((seed>>>7)+k*43)%83/100,p={x:a.x+(b.x-a.x)*u+(d.x-a.x)*v,y:a.y+(b.y-a.y)*u+(d.y-a.y)*v,z:a.z+(b.z-a.z)*u+(d.z-a.z)*v},q=project(p);polygon([{x:q.x-1.3,y:q.y},{x:q.x+.8,y:q.y-1},{x:q.x+1.5,y:q.y+1}],fracture?'#626c64':'#738080');}
  // Source-space orange marking remains at its original height after detachment.
  const stripe=f.height*.3-(f.oz||0);if(face.kind==='side'&&face.exterior&&stripe>=a.z&&stripe<=d.z){const x=project({...a,z:stripe}),y=project({...b,z:stripe});g.beginPath();g.moveTo(x.x,x.y);g.lineTo(y.x,y.y);g.strokeStyle='#b68b56';g.lineWidth=1.5;g.stroke();}
  if(c.hp<c.maxHp*.8){const center=project(face.points.reduce((n,p)=>({x:n.x+p.x/4,y:n.y+p.y/4,z:n.z+p.z/4}),{x:0,y:0,z:0}));g.strokeStyle='#35403e';g.beginPath();g.moveTo(center.x-3,center.y-3);g.lineTo(center.x+1,center.y);g.lineTo(center.x-1,center.y+3);g.stroke();}
  g.restore();
 }
 const topEdges=faces.filter(f=>f.kind==='top').flatMap(f=>f.points.map((a,i)=>({a,b:f.points[(i+1)%f.points.length]})));
 const equal=(a:{x:number;y:number;z:number},b:typeof a)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z)<1e-6;
 for(const e of topEdges.filter(e=>!topEdges.some(q=>q!==e&&equal(e.a,q.b)&&equal(e.b,q.a)))){const a=project(e.a),b=project(e.b);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.strokeStyle='#202e35';g.lineWidth=1.3;g.stroke();}
 if(c.selectedCells32?.length){
 // Tint only visible occupied source faces belonging to the committed region.
 // No independent decorative hull, no per-cell strokes, and no hidden-face reveal.
 g.save();g.globalAlpha=c.protective36?.16+.10*(c.gatherProgress36||0):.09;
 for(const face of faces.filter(face=>c.selectedCells32!.includes(face.id)))polygon(face.points.map(project),'#83eef0');
 g.restore();
 const edges=faces33({...c,fracture32:{...f,cells:c.selectedCells32}}).filter(f=>f.kind==='top').flatMap(f=>f.points.map((a,i)=>({a,b:f.points[(i+1)%f.points.length]})));for(const e of edges.filter(e=>!edges.some(q=>q!==e&&equal(e.a,q.b)&&equal(e.b,q.a)))){const a=project(e.a),b=project(e.b);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.strokeStyle='#a9eeed';g.lineWidth=1.5;g.stroke();}}

 if(c.heldRelation30){const tops=faces.filter(f=>f.kind==='top'),face=tops.sort((a,b)=>b.points.reduce((n,p)=>n+p.z,0)-a.points.reduce((n,p)=>n+p.z,0))[0];if(face){const [a,b]=face.points,x=project(a),y=project(b);g.strokeStyle=c.blocked30?'#efb66d':c.heldRelation30==='local'?'#65efff':'#ff82c2';g.lineWidth=2;g.beginPath();g.moveTo(x.x+(y.x-x.x)*.2,x.y+(y.y-x.y)*.2);g.lineTo(x.x+(y.x-x.x)*.8,x.y+(y.y-x.y)*.8);g.stroke();if(c.blocked30){const q=project(face.points[2]);g.fillStyle='#efb66d';g.font='bold 8px monospace';g.fillText('BLOCKED',q.x-15,q.y-4);}}}
 g.restore();
}
