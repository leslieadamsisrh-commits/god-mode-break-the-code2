// Presentation only: exact projected cover-face occlusion. Gameplay collision is untouched.
import {bayObject} from "./bayBridgeMap";
import {vertical46,relativeWorld46,setWorld46} from "./bayBridgePresentation";
export const COVER_HEIGHT=15616/332;
type Point={x:number;y:number};
type Cover={id?:string;x:number;y:number;w:number;h:number;a?:number;generated?:boolean;born?:number};
const EPS=1.25;
function floorCorners(c:Cover):Point[]{
 const co=Math.cos(c.a||0),si=Math.sin(c.a||0);
 return [[-c.w/2,-c.h/2],[c.w/2,-c.h/2],[c.w/2,c.h/2],[-c.w/2,c.h/2]].map(([x,y])=>({x:c.x+x*co-y*si,y:c.y+x*si+y*co}));
}
function clipFar(poly:Point[],groundY:number){
 const out:Point[]=[];for(let n=0;n<poly.length;n++){const a=poly[n],b=poly[(n+1)%poly.length],ain=a.y>groundY+EPS,bin=b.y>groundY+EPS;
  if(ain)out.push(a);
  if(ain!==bin){const t=(groundY+EPS-a.y)/(b.y-a.y);out.push({x:a.x+(b.x-a.x)*t,y:groundY+EPS})}
 }return out;
}
// Return the exact visible front-side quads plus the far top polygon. Avoid a convex hull:
// at rotated corners the hull fills empty screen-space and visually cuts through Jade.
export function coverOccluders(c:Cover,groundY:number,elevationScale=1):Point[][]{
 const meta=c.id?bayObject((c as any).artId||c.id):null;
 if(meta){
  const co=Math.cos(c.a||0),si=Math.sin(c.a||0),ribs=meta.rig.ribs,out:Point[][]=[];
  const vertex=(r:typeof ribs[number],side:number)=>{const x=-c.w/2+c.w*r.t,y=side*Math.min(c.h/2,r.width/2);return{x:c.x+x*co-y*si,y:c.y+x*si+y*co,z:Math.min(meta.dimensions.z,r.height)}};
  // Clip in ground depth first, then extrude the retained rib surface vertically.
  // Height/width interpolation makes concealment follow the same shell as the atlas.
  for(let n=0;n<ribs.length-1;n++){
   const poly=[vertex(ribs[n],-1),vertex(ribs[n+1],-1),vertex(ribs[n+1],1),vertex(ribs[n],1)],clipped:typeof poly=[];
   for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],ain=a.y>groundY+EPS,bin=b.y>groundY+EPS;if(ain)clipped.push(a);if(ain!==bin){const t=(groundY+EPS-a.y)/(b.y-a.y);clipped.push({x:a.x+(b.x-a.x)*t,y:groundY+EPS,z:a.z+(b.z-a.z)*t})}}
   if(clipped.length<3)continue;
   const point=(p:typeof clipped[number],height:number)=>{const r=relativeWorld46(c.x,c.y,p.x-c.x,p.y-c.y),v=vertical46(c.x,c.y,height+Math.max(0,Math.min(12,(c as any).hover||0)));return{x:c.x+r.x+v.x,y:c.y+r.y+v.y};};
   out.push(clipped.map(p=>point(p,p.z)));
   for(let i=0;i<clipped.length;i++){const a=clipped[i],b=clipped[(i+1)%clipped.length];out.push([point(a,0),point(b,0),point(b,b.z),point(a,a.z)])}
  }
  return out;
 }
 const floor=floorCorners(c),polys:Point[][]=[],height=COVER_HEIGHT*elevationScale;
 for(let n=0;n<4;n++){const a=floor[n],b=floor[(n+1)%4];if(Math.max(a.y,b.y)<=groundY+EPS)continue;
  const clipped=clipFar([a,b,{x:b.x,y:b.y-height},{x:a.x,y:a.y-height}],groundY);
  if(clipped.length>=3)polys.push(clipped);
 }
 const farTop=clipFar(floor.map(p=>({x:p.x,y:p.y-height})),groundY-height);
 if(farTop.length>=3)polys.push(farTop);
 return polys;
}
export function withCoverOcclusion(g:CanvasRenderingContext2D,covers:Cover[],groundY:number,time:number,draw:()=>void,ownerId?:string|null,exposed=false,elevationScale=1){

 g.save();const base=g.getTransform();
 for(const c of covers){
  // When an actor is attached, its owning cover defines full-body concealment.
  // Nearby stacked covers still render as scenery but do not compound actor clipping.
  if(ownerId&&c.id!==ownerId)continue;
  if(c.generated&&typeof c.born==="number"&&!(c as any).assembly44?.length&&time-c.born<.72)continue;
  setWorld46(g,c.x,c.y);
  for(const polygon of coverOccluders(c,groundY,elevationScale)){
   // Attached exposed poses need the upper silhouette to remain readable above the wall.
   // Restrict owning-cover clipping to the lower body band; tucked poses keep full concealment.
   const poly=ownerId&&exposed?polygon.map(p=>({x:p.x,y:Math.max(p.y,groundY-COVER_HEIGHT*elevationScale*.72)})):polygon;
   const m=g.getTransform(),det=m.a*m.d-m.b*m.c,screen=(p:Point)=>({x:m.a*p.x+m.c*p.y+m.e,y:m.b*p.x+m.d*p.y+m.f}),projected=poly.map(screen);
   if(Math.max(...projected.map(p=>p.x))<0||Math.min(...projected.map(p=>p.x))>g.canvas.width||Math.max(...projected.map(p=>p.y))<0||Math.min(...projected.map(p=>p.y))>g.canvas.height)continue;
   const inverse=(x:number,y:number)=>({x:(m.d*(x-m.e)-m.c*(y-m.f))/det,y:(-m.b*(x-m.e)+m.a*(y-m.f))/det});
   g.beginPath();[[-1,-1],[g.canvas.width+1,-1],[g.canvas.width+1,g.canvas.height+1],[-1,g.canvas.height+1]].map(([x,y])=>inverse(x,y)).forEach((p,n)=>n?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.closePath();
   poly.forEach((p,n)=>n?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.closePath();g.clip("evenodd");
  }
 }
 g.setTransform(base);draw();g.restore();
}
