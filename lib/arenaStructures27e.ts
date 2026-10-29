import {overlap32,type Fracture32} from './fracture32';
import {D33_BOUNDS25} from './dimension33World25';
import {type Surface,height,inside} from './elevation27a';
import {foundationSurfaces28} from './arenaFoundation28';
export const COMBAT_SURFACES:Surface[]=foundationSurfaces28();
export const openDeck27h=(_s:Surface)=>false;
export const structureBottom27h=(s:Surface)=>openDeck27h(s)?s.height-DECK_THICKNESS27E:0;
export function structureSolids27h():Solid27e[]{return STATIC_SOLIDS27H;}
function makeSolids27h():Solid27e[]{return [...SUPPORTS27E,...COMBAT_SURFACES.filter(s=>s.id!=='ground'&&!s.rise).map(s=>{const xs=s.polygon.map(p=>p.x),ys=s.polygon.map(p=>p.y);return{id:s.id,x:(Math.min(...xs)+Math.max(...xs))/2,y:(Math.min(...ys)+Math.max(...ys))/2,w:Math.max(...xs)-Math.min(...xs),h:Math.max(...ys)-Math.min(...ys),bottom:structureBottom27h(s),top:s.height};})];}
// Height units match upright Jade. Existing surface heights and jump tuning stay fixed.
export const DECK_THICKNESS27E=6;
export type Vertex27e={x:number;y:number;z:number};
export type Face27e={id:string;vertices:Vertex27e[];kind:'top'|'side'|'support';surfaceId:string};
export type Solid27e={id:string;x:number;y:number;w:number;h:number;bottom:number;top:number};
export const SUPPORTS27E:Solid27e[]=COMBAT_SURFACES.filter(s=>openDeck27h(s)).flatMap(s=>{
 const xs=s.polygon.map(p=>p.x),ys=s.polygon.map(p=>p.y),left=Math.min(...xs),right=Math.max(...xs),back=Math.min(...ys),front=Math.max(...ys);
 // Columns sit inside the reserved structure footprints, away from stair mouths.
 return [left+14,right-14].flatMap(x=>[back+9,front-9].map(y=>({id:s.id+'-column-'+x+'-'+y,x,y,w:10,h:10,bottom:0,top:s.height-DECK_THICKNESS27E})));
});
const STATIC_SOLIDS27H=makeSolids27h();
export function structureFaces27e():Face27e[]{
 const faces:Face27e[]=[];
 for(const s of COMBAT_SURFACES){if(s.id==='ground')continue;
 const top=s.polygon.map(p=>({...p,z:height(s,p)}));
 faces.push({id:s.id+'-top',vertices:top,kind:'top',surfaceId:s.id});
 for(let n=0;n<top.length;n++){const a=top[n],b=top[(n+1)%top.length];faces.push({id:s.id+'-edge-'+n,vertices:[a,b,{...b,z:structureBottom27h(s)},{...a,z:structureBottom27h(s)}],kind:'side',surfaceId:s.id});}
 }
 for(const c of SUPPORTS27E){const p=[{x:c.x-c.w/2,y:c.y-c.h/2},{x:c.x+c.w/2,y:c.y-c.h/2},{x:c.x+c.w/2,y:c.y+c.h/2},{x:c.x-c.w/2,y:c.y+c.h/2}];for(let n=0;n<4;n++){const a=p[n],b=p[(n+1)%4];faces.push({id:c.id+'-'+n,vertices:[{...a,z:0},{...b,z:0},{...b,z:c.top},{...a,z:c.top}],kind:'support',surfaceId:c.id});}}
 return faces;
}
// Clip the face to geometry in front of an actor's world-depth plane. This
// permits partial occlusion beside a long deck instead of hiding the full actor.
export function foregroundFace27e(face:Face27e,y:number):Vertex27e[]{
 const result:Vertex27e[]=[];const p=face.vertices;
 for(let n=0;n<p.length;n++){const a=p[n],b=p[(n+1)%p.length],ai=a.y>y+.01,bi=b.y>y+.01;if(ai)result.push(a);if(ai!==bi){const t=(y+.01-a.y)/(b.y-a.y);result.push({x:a.x+(b.x-a.x)*t,y:y+.01,z:a.z+(b.z-a.z)*t});}}
 return result;
}
export function resolveSupports27e(p:{x:number;y:number;z:number;supportSurfaceId?:string|null;grounded?:boolean},radius=18,bodyHeight=63.96){
 const ramp=COMBAT_SURFACES.find(s=>s.id===p.supportSurfaceId&&s.rise);
 const solids=[...structureSolids27h()];
 // Ramp sides are solid wedges. Only a reachable walking slope permits entry.
 for(const s of COMBAT_SURFACES.filter(s=>s.rise)){
  const xs=s.polygon.map(v=>v.x),ys=s.polygon.map(v=>v.y),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
  const q={x:Math.max(x0,Math.min(x1,p.x)),y:Math.max(y0,Math.min(y1,p.y))},top=height(s,q);
  if(top>p.z+5&&s.id!==p.supportSurfaceId)solids.push({id:s.id,x:(x0+x1)/2,y:(y0+y1)/2,w:x1-x0,h:y1-y0,bottom:0,top});
 }
 for(const c of solids){
  if(ramp&&p.grounded&&Math.abs(c.top-ramp.rise!.high)<.01&&height(ramp,p)>=c.top-12)continue;
  if(p.z>=c.top-.01||p.z+bodyHeight<=c.bottom)continue;
  const dx=p.x-c.x,dy=p.y-c.y,ex=c.w/2+radius,ey=c.h/2+radius;
  if(Math.abs(dx)>=ex||Math.abs(dy)>=ey)continue;
  const candidates=[{x:c.x-ex,y:p.y},{x:c.x+ex,y:p.y},{x:p.x,y:c.y-ey},{x:p.x,y:c.y+ey}].filter(q=>q.x>=D33_BOUNDS25.left&&q.x<=D33_BOUNDS25.right&&q.y>=D33_BOUNDS25.top&&q.y<=D33_BOUNDS25.bottom).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y));
  if(candidates[0]){p.x=candidates[0].x;p.y=candidates[0].y;}
 }

}
export function slabShotTime27e(from:Vertex27e,to:Vertex27e){
 let first=Infinity;
 const boxes=structureSolids27h();
 for(const b of boxes){let enter=0,leave=1;for(const [key,low,high]of [['x',b.x-b.w/2,b.x+b.w/2],['y',b.y-b.h/2,b.y+b.h/2],['z',b.bottom,b.top]] as const){const d=to[key]-from[key];if(Math.abs(d)<1e-9){if(from[key]<low||from[key]>high){leave=-1;break;}}else{const a=(low-from[key])/d,c=(high-from[key])/d;enter=Math.max(enter,Math.min(a,c));leave=Math.min(leave,Math.max(a,c));}}if(enter<=leave)first=Math.min(first,enter);}
 for(const s of COMBAT_SURFACES.filter(s=>s.rise)){let enter=0,leave=1;const xs=s.polygon.map(p=>p.x),ys=s.polygon.map(p=>p.y);
 const planes=[(p:Vertex27e)=>p.x-Math.min(...xs),(p:Vertex27e)=>Math.max(...xs)-p.x,(p:Vertex27e)=>p.y-Math.min(...ys),(p:Vertex27e)=>Math.max(...ys)-p.y,(p:Vertex27e)=>p.z,(p:Vertex27e)=>height(s,p)-p.z];
 for(const plane of planes){const a=plane(from),b=plane(to);if(a<0&&b<0){leave=-1;break;}if(a<0)enter=Math.max(enter,a/(a-b));else if(b<0)leave=Math.min(leave,a/(a-b));}if(enter<=leave)first=Math.min(first,enter);
 }
 return first;
}

// Ground-level carried cover uses the same structure bounds as traversal.
export function coverStructureBlocked27f(c:{x:number;y:number;w:number;h:number;a:number;z?:number;fracture32?:Fracture32},bodyHeight:number){
 const solids=[...structureSolids27h()];
 const z=c.z||0;
 for(const s of COMBAT_SURFACES.filter(s=>s.rise)){const xs=s.polygon.map(p=>p.x),ys=s.polygon.map(p=>p.y);const top=height(s,c);if(z<top-.1)solids.push({id:s.id,x:(Math.min(...xs)+Math.max(...xs))/2,y:(Math.min(...ys)+Math.max(...ys))/2,w:Math.max(...xs)-Math.min(...xs),h:Math.max(...ys)-Math.min(...ys),bottom:0,top});}
 return solids.some(b=>{if(z>=b.top-.1||z+bodyHeight<=b.bottom)return false;if(c.fracture32)return overlap32({...c,height27j:bodyHeight},{...b,z:b.bottom,height27j:b.top-b.bottom}).hit;return [0,Math.PI/2,c.a,c.a+Math.PI/2].every(a=>{const x=Math.cos(a),y=Math.sin(a),r=Math.abs(Math.cos(a-c.a))*c.w/2+Math.abs(Math.sin(a-c.a))*c.h/2,br=Math.abs(x)*b.w/2+Math.abs(y)*b.h/2;return Math.abs((c.x-b.x)*x+(c.y-b.y)*y)<r+br;});});
}
export function coverSupport27h(c:{x:number;y:number;z?:number}){
 return COMBAT_SURFACES.filter(s=>inside(c,s)&&height(s,c)<=(c.z||0)+12).sort((a,b)=>height(b,c)-height(a,c))[0]||COMBAT_SURFACES[0];
}
