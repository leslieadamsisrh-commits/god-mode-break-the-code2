import {prisms33,type Fracture32} from './fracture32';
type Point={x:number;y:number;z:number};
type Shape={x:number;y:number;z?:number;hover?:number;w:number;h:number;a?:number;height27j?:number;fracture32?:Fracture32};
const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
// Presentation contact witness on occupied prism geometry. It never decides damage.
// For substepped penetration the witness is the nearest actual surface, not a TOI.
export function contactPoint35(shape:Shape,target:Point):Point{
 let best:Point={x:shape.x,y:shape.y,z:shape.z||0},distance=Infinity;
 const take=(p:Point)=>{const d=(p.x-target.x)**2+(p.y-target.y)**2+(p.z-target.z)**2;if(d<distance){distance=d;best=p;}};
 for(const prism of prisms33(shape)){
  const low=(shape.z||0)+(shape.hover||0)+prism.low,high=(shape.z||0)+(shape.hover||0)+prism.high;
  let inside=true;
  for(let n=0;n<prism.poly.length;n++){
   const a=prism.poly[n],b=prism.poly[(n+1)%prism.poly.length],dx=b.x-a.x,dy=b.y-a.y;
   if(dx*(target.y-a.y)-dy*(target.x-a.x)<-1e-8)inside=false;
   const t=clamp(((target.x-a.x)*dx+(target.y-a.y)*dy)/Math.max(1e-9,dx*dx+dy*dy),0,1);
   take({x:a.x+t*dx,y:a.y+t*dy,z:clamp(target.z,low,high)});
  }
  if(inside){take({x:target.x,y:target.y,z:low});take({x:target.x,y:target.y,z:high});}
 }
 return best;
}
