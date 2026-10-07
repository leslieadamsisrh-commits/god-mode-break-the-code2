// Presentation only: exact projected cover-face occlusion. Gameplay collision is untouched.
import {bayObject} from "./bayBridgeMap";
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
export function coverOccluders(c:Cover,groundY:number):Point[][]{
 const meta=c.id?bayObject(c.id):null;
 if(meta){
  const co=Math.cos(c.a||0),si=Math.sin(c.a||0),ribs=meta.rig.ribs,out:Point[][]=[];
  const vertex=(r:typeof ribs[number],side:number)=>{const x=-c.w/2+c.w*r.t,y=side*Math.min(c.h/2,r.width/2);return{x:c.x+x*co-y*si,y:c.y+x*si+y*co,z:Math.min(meta.dimensions.z,r.height)}};
  // Clip in ground depth first, then extrude the retained rib surface vertically.
  // Height/width interpolation makes concealment follow the same shell as the atlas.
  for(let n=0;n<ribs.length-1;n++){
   const poly=[vertex(ribs[n],-1),vertex(ribs[n+1],-1),vertex(ribs[n+1],1),vertex(ribs[n],1)],clipped:typeof poly=[];
   for(let i=0;i<poly.length;i++){const a=poly[i],b=poly[(i+1)%poly.length],ain=a.y>groundY+EPS,bin=b.y>groundY+EPS;if(ain)clipped.push(a);if(ain!==bin){const t=(groundY+EPS-a.y)/(b.y-a.y);clipped.push({x:a.x+(b.x-a.x)*t,y:groundY+EPS,z:a.z+(b.z-a.z)*t})}}
   if(clipped.length<3)continue;
   out.push(clipped.map(p=>({x:p.x,y:p.y-p.z})));
   for(let i=0;i<clipped.length;i++){const a=clipped[i],b=clipped[(i+1)%clipped.length];out.push([{x:a.x,y:a.y},{x:b.x,y:b.y},{x:b.x,y:b.y-b.z},{x:a.x,y:a.y-a.z}])}
  }
  return out;
 }
 const floor=floorCorners(c),polys:Point[][]=[];
 for(let n=0;n<4;n++){const a=floor[n],b=floor[(n+1)%4];if(Math.max(a.y,b.y)<=groundY+EPS)continue;
  const clipped=clipFar([a,b,{x:b.x,y:b.y-COVER_HEIGHT},{x:a.x,y:a.y-COVER_HEIGHT}],groundY);
  if(clipped.length>=3)polys.push(clipped);
 }
 const farTop=clipFar(floor.map(p=>({x:p.x,y:p.y-COVER_HEIGHT})),groundY-COVER_HEIGHT);
 if(farTop.length>=3)polys.push(farTop);
 return polys;
}
export function withCoverOcclusion(g:CanvasRenderingContext2D,covers:Cover[],groundY:number,time:number,draw:()=>void,ownerId?:string|null,exposed=false){

 g.save();
 for(const c of covers){
  // When an actor is attached, its owning cover defines full-body concealment.
  // Nearby stacked covers still render as scenery but do not compound actor clipping.
  if(ownerId&&c.id!==ownerId)continue;
  if(c.generated&&typeof c.born==="number"&&time-c.born<.72)continue;
  for(const polygon of coverOccluders(c,groundY)){
   // Attached exposed poses need the upper silhouette to remain readable above the wall.
   // Restrict owning-cover clipping to the lower body band; tucked poses keep full concealment.
   const poly=ownerId&&exposed?polygon.map(p=>({x:p.x,y:Math.max(p.y,groundY-COVER_HEIGHT*.72)})):polygon;
   g.beginPath();g.rect(-1000000,-1000000,2000000,2000000);
   poly.forEach((p,n)=>n?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.closePath();g.clip("evenodd");
  }
 }
 draw();g.restore();
}
