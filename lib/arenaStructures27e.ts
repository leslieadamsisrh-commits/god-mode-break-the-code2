import {type Surface,height} from './elevation27a';
export const COMBAT_SURFACES:Surface[]=[
 {id:'ground',polygon:[{x:0,y:0},{x:1500,y:0},{x:1500,y:840},{x:0,y:840}],height:0,walkable:true},
 ...(['north','south'] as const).flatMap(side=>{
  const north=side==='north',y=north?140:620,sy=north?220:530;
  return [
   {id:side+'-platform',polygon:[{x:540,y},{x:960,y},{x:960,y:y+80},{x:540,y:y+80}],height:72,walkable:true},
   {id:side+'-stairs',polygon:[{x:680,y:sy},{x:820,y:sy},{x:820,y:sy+90},{x:680,y:sy+90}],height:0,walkable:true,rise:{axis:'y' as const,from:north?310:530,to:north?220:620,low:0,high:72}},
  ];
 }),
 {id:'west-walkway',polygon:[{x:250,y:160},{x:540,y:160},{x:540,y:205},{x:250,y:205}],height:72,walkable:true},
 {id:'east-walkway',polygon:[{x:960,y:160},{x:1250,y:160},{x:1250,y:205},{x:960,y:205}],height:72,walkable:true},
 ...[{id:'west-side-route',x:250,y:205,w:70,h:450},{id:'east-side-route',x:1180,y:205,w:70,h:450},{id:'south-west-link',x:250,y:655,w:290,h:45},{id:'south-east-link',x:960,y:655,w:290,h:45}].map(q=>({id:q.id,polygon:[{x:q.x,y:q.y},{x:q.x+q.w,y:q.y},{x:q.x+q.w,y:q.y+q.h},{x:q.x,y:q.y+q.h}],height:72,walkable:true})),

].map((s:Surface)=>({...s,polygon:s.polygon.map(p=>({x:p.x*2200/1500,y:p.y*1100/840})),...(s.rise?{rise:{...s.rise,from:s.rise.from*1100/840,to:s.rise.to*1100/840}}:{})}));

// Height units match upright Jade. Existing surface heights and jump tuning stay fixed.
export const DECK_THICKNESS27E=6;
export type Vertex27e={x:number;y:number;z:number};
export type Face27e={id:string;vertices:Vertex27e[];kind:'top'|'side'|'support';surfaceId:string};
export type Solid27e={id:string;x:number;y:number;w:number;h:number;bottom:number;top:number};
export const SUPPORTS27E:Solid27e[]=COMBAT_SURFACES.filter(s=>s.id!=='ground'&&!s.rise).flatMap(s=>{
 const xs=s.polygon.map(p=>p.x),ys=s.polygon.map(p=>p.y),left=Math.min(...xs),right=Math.max(...xs),back=Math.min(...ys),front=Math.max(...ys);
 // Columns sit inside the reserved structure footprints, away from stair mouths.
 return [left+14,right-14].flatMap(x=>[back+9,front-9].map(y=>({id:s.id+'-column-'+x+'-'+y,x,y,w:10,h:10,bottom:0,top:s.height-DECK_THICKNESS27E})));
});
export function structureFaces27e():Face27e[]{
 const faces:Face27e[]=[];
 for(const s of COMBAT_SURFACES){if(s.id==='ground')continue;
 const top=s.polygon.map(p=>({...p,z:height(s,p)}));
 faces.push({id:s.id+'-top',vertices:top,kind:'top',surfaceId:s.id});
 for(let n=0;n<top.length;n++){const a=top[n],b=top[(n+1)%top.length];faces.push({id:s.id+'-edge-'+n,vertices:[a,b,{...b,z:s.rise?0:Math.max(0,b.z-DECK_THICKNESS27E)},{...a,z:s.rise?0:Math.max(0,a.z-DECK_THICKNESS27E)}],kind:'side',surfaceId:s.id});}
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
 const solids=[...SUPPORTS27E,...COMBAT_SURFACES.filter(s=>s.id!=='ground'&&!s.rise).map(s=>{const xs=s.polygon.map(p=>p.x),ys=s.polygon.map(p=>p.y);return{id:s.id,x:(Math.min(...xs)+Math.max(...xs))/2,y:(Math.min(...ys)+Math.max(...ys))/2,w:Math.max(...xs)-Math.min(...xs),h:Math.max(...ys)-Math.min(...ys),bottom:s.height-DECK_THICKNESS27E,top:s.height};})];
 for(const c of solids){if(c.bottom>0&&p.grounded&&p.supportSurfaceId?.endsWith('-stairs'))continue;if(p.z>=c.top||p.z+bodyHeight<=c.bottom)continue;const dx=p.x-c.x,dy=p.y-c.y,ex=c.w/2+radius,ey=c.h/2+radius;if(Math.abs(dx)>=ex||Math.abs(dy)>=ey)continue;if(ex-Math.abs(dx)<ey-Math.abs(dy))p.x=c.x+(dx<0?-ex:ex);else p.y=c.y+(dy<0?-ey:ey);}
}
export function slabShotTime27e(from:Vertex27e,to:Vertex27e){
 let first=Infinity;
 const boxes:Solid27e[]=[...SUPPORTS27E,...COMBAT_SURFACES.filter(s=>s.id!=='ground'&&!s.rise).map(s=>{const xs=s.polygon.map(p=>p.x),ys=s.polygon.map(p=>p.y);return{id:s.id,x:(Math.min(...xs)+Math.max(...xs))/2,y:(Math.min(...ys)+Math.max(...ys))/2,w:Math.max(...xs)-Math.min(...xs),h:Math.max(...ys)-Math.min(...ys),bottom:s.height-DECK_THICKNESS27E,top:s.height};})];
 for(const b of boxes){let enter=0,leave=1;for(const [key,low,high]of [['x',b.x-b.w/2,b.x+b.w/2],['y',b.y-b.h/2,b.y+b.h/2],['z',b.bottom,b.top]] as const){const d=to[key]-from[key];if(Math.abs(d)<1e-9){if(from[key]<low||from[key]>high){leave=-1;break;}}else{const a=(low-from[key])/d,c=(high-from[key])/d;enter=Math.max(enter,Math.min(a,c));leave=Math.min(leave,Math.max(a,c));}}if(enter<=leave)first=Math.min(first,enter);}
 for(const s of COMBAT_SURFACES.filter(s=>s.rise)){let enter=0,leave=1;const xs=s.polygon.map(p=>p.x),ys=s.polygon.map(p=>p.y);
 const planes=[(p:Vertex27e)=>p.x-Math.min(...xs),(p:Vertex27e)=>Math.max(...xs)-p.x,(p:Vertex27e)=>p.y-Math.min(...ys),(p:Vertex27e)=>Math.max(...ys)-p.y,(p:Vertex27e)=>p.z,(p:Vertex27e)=>height(s,p)-p.z];
 for(const plane of planes){const a=plane(from),b=plane(to);if(a<0&&b<0){leave=-1;break;}if(a<0)enter=Math.max(enter,a/(a-b));else if(b<0)leave=Math.min(leave,a/(a-b));}if(enter<=leave)first=Math.min(first,enter);
 }
 return first;
}

// Ground-level carried cover uses the same structure bounds as traversal.
export function coverStructureBlocked27f(c:{x:number;y:number;w:number;h:number;a:number},bodyHeight:number){
 const solids=[...SUPPORTS27E,...COMBAT_SURFACES.filter(s=>s.id!=='ground').map(s=>{const xs=s.polygon.map(p=>p.x),ys=s.polygon.map(p=>p.y);return {x:(Math.min(...xs)+Math.max(...xs))/2,y:(Math.min(...ys)+Math.max(...ys))/2,w:Math.max(...xs)-Math.min(...xs),h:Math.max(...ys)-Math.min(...ys),bottom:s.rise?0:s.height-DECK_THICKNESS27E,top:s.rise?72:s.height};})];
 return solids.some(b=>{if(bodyHeight<=b.bottom)return false;return [0,Math.PI/2,c.a,c.a+Math.PI/2].every(a=>{const x=Math.cos(a),y=Math.sin(a),r=Math.abs(Math.cos(a-c.a))*c.w/2+Math.abs(Math.sin(a-c.a))*c.h/2,br=Math.abs(x)*b.w/2+Math.abs(y)*b.h/2;return Math.abs((c.x-b.x)*x+(c.y-b.y)*y)<r+br;});});
}
