import {bayObject,BAY_SPAWNS,BAY_BOUNDS} from './bayBridgeMap';
import {COMBAT_SURFACES} from './verticalCombat27b';
export type Placement27c={id:string;objectId:string;x:number;y:number;rotation:number;z:0;surfaceId:'ground'};
export type ArenaLayout27c={version:1;name:string;seed?:string;placements:Placement27c[]};
export const CATALOG27C=[{id:'d33-nw-primary',label:'Concrete barrier'},{id:'d33-center-nw',label:'Angled divider'},{id:'d33-west-north-node',label:'Industrial cabinet'},{id:'floor-panel46',label:'Movable floor slab'}] as const;
export const MAX_OBJECTS27C=24;
export function footprint27c(p:Placement27c,pad=0){const o=bayObject(p.objectId);if(!o)throw Error('Unknown object');const w=o.collisionHull.w/2+pad,h=o.collisionHull.h/2+pad,co=Math.cos(p.rotation),si=Math.sin(p.rotation);return [[-w,-h],[w,-h],[w,h],[-w,h]].map(([x,y])=>({x:p.x+x*co-y*si,y:p.y+x*si+y*co}));}
function overlap(a:{x:number;y:number}[],b:{x:number;y:number}[]){for(const poly of [a,b])for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],nx=p.y-q.y,ny=q.x-p.x;const aa=a.map(v=>v.x*nx+v.y*ny),bb=b.map(v=>v.x*nx+v.y*ny);if(Math.max(...aa)<=Math.min(...bb)||Math.max(...bb)<=Math.min(...aa))return false;}return true;}
export function placementError27c(p:Placement27c,others:Placement27c[]){
 if(!CATALOG27C.some(o=>o.id===p.objectId))return 'Object unavailable';
 if(!Number.isFinite(p.x)||!Number.isFinite(p.y)||!Number.isFinite(p.rotation)||p.z!==0||p.surfaceId!=='ground')return 'Ground placement only';
 const poly=footprint27c(p,14);
 if(poly.some(v=>v.x<BAY_BOUNDS.left||v.x>BAY_BOUNDS.right||v.y<BAY_BOUNDS.top||v.y>BAY_BOUNDS.bottom))return 'Outside arena';
 if(BAY_SPAWNS.some(s=>Math.hypot(s.x-p.x,s.y-p.y)<125))return 'Keep spawn clear';
 if(COMBAT_SURFACES.some(s=>s.id!=='ground'&&overlap(poly,s.polygon)))return 'Keep stairs and elevated routes clear';
 if(others.some(o=>o.id!==p.id&&overlap(poly,footprint27c(o,14))))return 'Objects need more space';
 return '';
}
export function routesConnected27c(ps:Placement27c[]){
 const step=30,cols=44,rows=22,blocked=new Set<string>();
 for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const px=90+x*step,py=105+y*step;if(ps.some(p=>{const o=bayObject(p.objectId)!,dx=px-p.x,dy=py-p.y,co=Math.cos(p.rotation),si=Math.sin(p.rotation);return Math.abs(dx*co+dy*si)<o.collisionHull.w/2+22&&Math.abs(-dx*si+dy*co)<o.collisionHull.h/2+22;}))blocked.add(x+','+y);}
 const index=(p:{x:number;y:number})=>[Math.round((p.x-90)/step),Math.round((p.y-105)/step)];const [sx,sy]=index(BAY_SPAWNS[0]),queue=[[sx,sy]],seen=new Set([sx+','+sy]);
 for(let i=0;i<queue.length;i++){const [x,y]=queue[i];for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,yy=y+dy,k=xx+','+yy;if(xx>=0&&xx<cols&&yy>=0&&yy<rows&&!blocked.has(k)&&!seen.has(k)){seen.add(k);queue.push([xx,yy]);}}}
 // All free grid cells must remain connected, including the other spawn and center.
 return seen.size===cols*rows-blocked.size;
}
export function validateLayout27c(raw:unknown):ArenaLayout27c{
 const r=raw as any;if(!r||r.version!==1||typeof r.name!=='string'||!r.name.trim()||r.name.length>48||!Array.isArray(r.placements)||r.placements.length>MAX_OBJECTS27C)throw Error('Invalid layout schema');
 const ids=new Set<string>();const placements:Placement27c[]=r.placements.map((p:any)=>{if(!p||typeof p.id!=='string'||!/^[a-zA-Z0-9_-]{1,64}$/.test(p.id)||ids.has(p.id))throw Error('Invalid placement ID');ids.add(p.id);return {id:p.id,objectId:p.objectId,x:p.x,y:p.y,rotation:p.rotation,z:p.z,surfaceId:p.surfaceId};});
 for(const p of placements){const e=placementError27c(p,placements);if(e)throw Error(e);}
 if(!routesConnected27c(placements))throw Error('Layout blocks connected routes');
 return {version:1,name:r.name.trim(),...(typeof r.seed==='string'?{seed:r.seed.slice(0,80)}:{}),placements};
}
export function randomLayout27c(seed:string,count=14):ArenaLayout27c{
 let h=2166136261;for(const c of seed)h=Math.imul(h^c.charCodeAt(0),16777619);const rnd=()=>{h+=0x6D2B79F5;let t=h;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};
 const placements:Placement27c[]=[];const desired=Math.max(4,Math.min(MAX_OBJECTS27C,Math.round(count)||14));
 for(let attempt=0;attempt<800&&placements.length<desired;attempt++){const p:Placement27c={id:'piece-'+placements.length,objectId:CATALOG27C[Math.floor(rnd()*CATALOG27C.length)].id,x:180+Math.floor(rnd()*1140/10)*10,y:260+Math.floor(rnd()*350/10)*10,rotation:Math.floor(rnd()*8)*Math.PI/4,z:0,surfaceId:'ground'};if(!placementError27c(p,placements)&&routesConnected27c([...placements,p]))placements.push(p);}
 return validateLayout27c({version:1,name:'Random '+seed.slice(0,32),seed,placements});
}
export function chaseLayout27c():ArenaLayout27c{return {...randomLayout27c('CHASE-27C',16),name:"Chase’s Setup"};}
export function instantiateLayout27c(layout:ArenaLayout27c){return layout.placements.map(p=>{const o=bayObject(p.objectId)!;return {id:'arena-'+p.id,artId:o.id,x:p.x,y:p.y,w:o.collisionHull.w,h:o.collisionHull.h,a:p.rotation,hp:o.breakThreshold,maxHp:o.breakThreshold,generated:false,build:0,variant:o.material==='INFRASTRUCTURE'?1:0,coverClass:o.coverClass as 'waist'|'tall'};});}
