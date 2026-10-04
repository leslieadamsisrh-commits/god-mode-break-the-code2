// Presentation only: use the same ground footprint and vertical height as cover().
export const COVER_HEIGHT=15616/332;
type Point={x:number;y:number};
type Cover={x:number;y:number;w:number;h:number;a?:number;generated?:boolean;born?:number};
export function coverOccluder(c:Cover,groundY:number):Point[]{
 const co=Math.cos(c.a||0),si=Math.sin(c.a||0);
 const floor=[[-c.w/2,-c.h/2],[c.w/2,-c.h/2],[c.w/2,c.h/2],[-c.w/2,c.h/2]].map(([x,y])=>({x:c.x+x*co-y*si,y:c.y+x*si+y*co}));
 // Only material farther into the screen than this actor's ground anchor can hide it.
 if(Math.max(...floor.map(p=>p.y))<=groundY+1e-6)return [];
 const front:Point[]=[];
 for(let n=0;n<floor.length;n++){
  const a=floor[n],b=floor[(n+1)%floor.length],inside=a.y>=groundY,next=b.y>=groundY;
  if(inside)front.push(a);
  if(inside!==next){const f=(groundY-a.y)/(b.y-a.y);front.push({x:a.x+(b.x-a.x)*f,y:groundY})}
 }
 // Project that clipped solid, not its bounding box: a rotated corner changes locally.
 const points=front.flatMap(p=>[p,{x:p.x,y:p.y-COVER_HEIGHT}]).sort((a,b)=>a.x-b.x||a.y-b.y);
 const cross=(a:Point,b:Point,c:Point)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
 const half=(list:Point[])=>{const result:Point[]=[];for(const p of list){while(result.length>1&&cross(result[result.length-2],result[result.length-1],p)<=0)result.pop();result.push(p)}return result.slice(0,-1)};
 return [...half(points),...half([...points].reverse())];
}
export function withCoverOcclusion(g:CanvasRenderingContext2D,covers:Cover[],groundY:number,time:number,draw:()=>void){
 g.save();
 for(const c of covers){
  // Keep the existing translucent formation effect; solid occlusion starts when it finishes.
  if(c.generated&&typeof c.born==="number"&&time-c.born<.72)continue;
  const polygon=coverOccluder(c,groundY);if(polygon.length<3)continue;
  g.beginPath();g.rect(-1000000,-1000000,2000000,2000000);
  polygon.forEach((p,n)=>n?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.closePath();
  // Separate clips intersect: overlapping covers must not XOR holes and reveal Jade.
  g.clip("evenodd");
 }
 draw();g.restore();
}
