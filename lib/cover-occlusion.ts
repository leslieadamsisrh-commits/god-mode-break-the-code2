import {visibleFractureFaces33,type Fracture32} from './fracture32';
// Presentation only: exact projected cover-face occlusion. Gameplay collision is untouched.
import {bayObject} from "./bayBridgeMap";
import {vertical46,relativeWorld46,setWorld46,withUpright} from "./bayBridgePresentation";
export const COVER_HEIGHT=15616/332;
type Point={x:number;y:number;z?:number};
type Cover={fracture32?:Fracture32;id?:string;x:number;y:number;w:number;h:number;a?:number;generated?:boolean;born?:number};
const EPS=1.25;
export function coverOcclusionActive(c:Cover,time:number){
 return !(c.generated&&typeof c.born==='number'&&!(c as any).assembly44?.length&&time-c.born<.72);
}
function floorCorners(c:Cover):Point[]{
 const co=Math.cos(c.a||0),si=Math.sin(c.a||0);
 return [[-c.w/2,-c.h/2],[c.w/2,-c.h/2],[c.w/2,c.h/2],[-c.w/2,c.h/2]].map(([x,y])=>({x:c.x+x*co-y*si,y:c.y+x*si+y*co}));
}
function clipFar(poly:Point[],groundY:number){
 const out:Point[]=[];for(let n=0;n<poly.length;n++){const a=poly[n],b=poly[(n+1)%poly.length],ain=a.y>groundY+EPS,bin=b.y>groundY+EPS;
  if(ain)out.push(a);
  if(ain!==bin){const t=(groundY+EPS-a.y)/(b.y-a.y);const p:Point={x:a.x+(b.x-a.x)*t,y:groundY+EPS};if(a.z!==undefined&&b.z!==undefined)p.z=a.z+(b.z-a.z)*t;out.push(p)}
 }return out;
}
// Return the exact visible front-side quads plus the far top polygon. Avoid a convex hull:
// at rotated corners the hull fills empty screen-space and visually cuts through Jade.
export function coverOccluders(c:Cover,groundY:number,elevationScale=1):Point[][]{
 if((c as any).anchored27j||(c as any).section27j||(c as any).height27j){const q=c as any,height=q.height27j??bayObject(q.artId||q.id)?.dimensions.z??48,base=(q.z||0)+(q.hover||0);
  const project=(p:Point,z:number)=>{const r=relativeWorld46(c.x,c.y,p.x-c.x,p.y-c.y),v=vertical46(c.x,c.y,z);return{x:c.x+r.x+v.x,y:c.y+r.y+v.y};};
  if(c.fracture32){
   // Use the same visible faces as the fracture painter so empty space between
   // chips does not hide the player.
   const co=Math.cos(c.a||0),si=Math.sin(c.a||0),out:Point[][]=[];
   for(const face of visibleFractureFaces33(c)){
    const world=face.points.map(({x,y,z})=>({x:c.x+x*co-y*si,y:c.y+x*si+y*co,z}));
    const clipped=clipFar(world,groundY);
    if(clipped.length>=3)out.push(clipped.map(p=>project(p,base+(p.z??0))));
   }
   return out;
  }
  const floors=[{poly:floorCorners(c),low:0,high:height}],out:Point[][]=[];for(const {poly:floor,low,high} of floors){const clipped=clipFar(floor,groundY);if(clipped.length>=3)out.push(clipped.map(p=>project(p,base+high)));for(let n=0;n<floor.length;n++){const a=floor[n],b=floor[(n+1)%floor.length];if(a.y<=groundY+EPS&&b.y<=groundY+EPS)continue;const edge=(u:Point,v:Point)=>{if(u.y>groundY+EPS)return u;const t=(groundY+EPS-u.y)/(v.y-u.y);return{x:u.x+(v.x-u.x)*t,y:groundY+EPS};};const aa=edge(a,b),bb=edge(b,a);out.push([project(aa,base+low),project(bb,base+low),project(bb,base+high),project(aa,base+high)]);}}return out;}
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
   const point=(p:typeof clipped[number],height:number)=>{const r=relativeWorld46(c.x,c.y,p.x-c.x,p.y-c.y),v=vertical46(c.x,c.y,height+((c as any).z||0)+Math.max(0,Math.min(12,(c as any).hover||0)));return{x:c.x+r.x+v.x,y:c.y+r.y+v.y};};
   out.push(clipped.map(p=>point(p,p.z)));
   for(let i=0;i<clipped.length;i++){const a=clipped[i],b=clipped[(i+1)%clipped.length];out.push([point(a,0),point(b,0),point(b,b.z),point(a,a.z)])}
  }
  return out;
 }
 const floor=floorCorners(c),polys:Point[][]=[],height=COVER_HEIGHT*elevationScale;
 for(let n=0;n<4;n++){const a=floor[n],b=floor[(n+1)%floor.length];if(Math.max(a.y,b.y)<=groundY+EPS)continue;
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
  // Build35: all solid faces occlude, including neighbors of attached cover.
  if(!coverOcclusionActive(c,time))continue;
  setWorld46(g,c.x,c.y);
  for(const polygon of coverOccluders(c,groundY,elevationScale)){
   // Exposure is determined by actual geometry, never by firing/aiming state.
   const poly=polygon;
   const m=g.getTransform(),det=m.a*m.d-m.b*m.c,screen=(p:Point)=>({x:m.a*p.x+m.c*p.y+m.e,y:m.b*p.x+m.d*p.y+m.f}),projected=poly.map(screen);
   if(Math.max(...projected.map(p=>p.x))<0||Math.min(...projected.map(p=>p.x))>g.canvas.width||Math.max(...projected.map(p=>p.y))<0||Math.min(...projected.map(p=>p.y))>g.canvas.height)continue;
   const inverse=(x:number,y:number)=>({x:(m.d*(x-m.e)-m.c*(y-m.f))/det,y:(-m.b*(x-m.e)+m.a*(y-m.f))/det});
   g.beginPath();[[-1,-1],[g.canvas.width+1,-1],[g.canvas.width+1,g.canvas.height+1],[-1,g.canvas.height+1]].map(([x,y])=>inverse(x,y)).forEach((p,n)=>n?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.closePath();
   poly.forEach((p,n)=>n?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.closePath();g.clip("evenodd");
  }
 }
 g.setTransform(base);draw();g.restore();
}

/** Same sparse local-only cue as architecture; solid cover and opponents stay opaque. */
export function drawConcealedCoverCue(g:CanvasRenderingContext2D,covers:Cover[],actor:{x:number;y:number;z?:number;local30?:boolean;hp:number;slide:number;pinball?:number;coverState11?:string},time:number,scale:number,elevationScale=1){
 if(!actor.local30||actor.hp<=0)return;
 g.save();
 const polygons:Point[][]=[];
 for(const c of covers){
  if(!coverOcclusionActive(c,time))continue;
  setWorld46(g,c.x,c.y);const m=g.getTransform();
  for(const poly of coverOccluders(c,actor.y,elevationScale))polygons.push(poly.map(p=>({x:m.a*p.x+m.c*p.y+m.e,y:m.b*p.x+m.d*p.y+m.f})));
 }
 if(!polygons.length){g.restore();return;}
 // Clip in screen space so rotated and fractured faces use exactly the rendering mask.
 g.setTransform(1,0,0,1,0,0);g.beginPath();
 for(const poly of polygons){poly.forEach((p,n)=>n?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.closePath();}
 g.clip();setWorld46(g,actor.x,actor.y);
 withUpright(g,actor.x,actor.y,()=>{
  const protectedHold=!!actor.coverState11&&actor.coverState11!=="expose"&&actor.coverState11!=="fire"&&actor.coverState11!=="escape";
  const posture=actor.slide>0||(actor.pinball||0)>0?.58:protectedHold?.72:1;
  // A stable foot marker remains legible at gameplay scale, clipped to solid cover.
  g.globalAlpha=.55;g.strokeStyle="#8de9ed";g.lineWidth=1.25;
  g.beginPath();g.ellipse(actor.x,actor.y-(actor.z||0),14*scale,3*scale,0,0,Math.PI*2);g.stroke();
  const outline=[[-8,70],[0,76],[8,70],[-15,57],[15,57],[-18,40],[18,40],[-11,23],[11,23],[-13,3],[13,3]];
  for(let n=0;n<outline.length;n++){
   const [x,y]=outline[n],pulse=.5+.5*Math.sin(time*2.8+n*2.399),r=.55+pulse*.5;
   g.globalAlpha=.22+.16*pulse;g.fillStyle=n%3?'#9edce8':'#f2eaff';
   g.fillRect(actor.x+x*scale-r,actor.y-(actor.z||0)-y*scale*posture-r,r*2,r*2);
  }
 });g.restore();
}

