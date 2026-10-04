// Presentation only: exact projected cover-face occlusion. Gameplay collision is untouched.
export const COVER_HEIGHT=15616/332;
type Point={x:number;y:number};
type Cover={x:number;y:number;w:number;h:number;a?:number;generated?:boolean;born?:number};
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
 const floor=floorCorners(c),polys:Point[][]=[];
 for(let n=0;n<4;n++){const a=floor[n],b=floor[(n+1)%4];if(Math.max(a.y,b.y)<=groundY+EPS)continue;
  const clipped=clipFar([a,b,{x:b.x,y:b.y-COVER_HEIGHT},{x:a.x,y:a.y-COVER_HEIGHT}],groundY);
  if(clipped.length>=3)polys.push(clipped);
 }
 const farTop=clipFar(floor.map(p=>({x:p.x,y:p.y-COVER_HEIGHT})),groundY-COVER_HEIGHT);
 if(farTop.length>=3)polys.push(farTop);
 return polys;
}
export function withCoverOcclusion(g:CanvasRenderingContext2D,covers:Cover[],groundY:number,time:number,draw:()=>void){
 g.save();
 for(const c of covers){
  if(c.generated&&typeof c.born==="number"&&time-c.born<.72)continue;
  for(const polygon of coverOccluders(c,groundY)){
   g.beginPath();g.rect(-1000000,-1000000,2000000,2000000);
   polygon.forEach((p,n)=>n?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.closePath();g.clip("evenodd");
  }
 }
 draw();g.restore();
}
