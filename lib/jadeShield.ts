import registration from "../public/assets/jade-guard32/registration.json";
import silhouettes from "./jadeGuardSilhouettes.json";
import {arenaJacobian46,ARENA_UPRIGHT_SCALE47} from "./bayBridgePresentation";

export function jadeGuardHeading(angle:number){
 return (Math.round((Math.PI/2-angle)*16/Math.PI)%32+32)%32;
}
export function jadeGuardSpread(opening:number,index:number){
 const phase=Math.max(0,Math.min(1,(opening-.12*index)/(1-.12*index)));
 return 1-(1-phase)**3;
}
// All dimensions are referenced to the upright Jade sprite's world scale.
export const JADE_PLATE_HP = 44;
export const JADE_SHIELD_UNFOLD = .12;
export const JADE_SHIELD_FOLD = .14;
export const JADE_SHIELD_IMPACT = .18;

export type ShieldPoint = {x:number;y:number;z:number};
export type JadeShield = {
 plates:number[];
 angle:number;
 active:boolean;
 openedAt:number;
 closedAt:number;
 openingFrom?:number;
 closingFrom?:number;
 hitAt:number;
 hitPlate:number;
 requireRelease:boolean;
 chargeHeld:number;
 chargeProgress:number;
 readyAt:number;
};
type ShieldActor = ShieldPoint & {jadeShield?:JadeShield};
type Vertex = [side:number,height:number];
type ShieldPlate = {index:number;hp:number;vertices:ShieldPoint[];normal:{x:number;y:number};profile:Vertex[];center:ShieldPoint;tx:number;ty:number;scale:number};

export function newJadeShield(angle:number):JadeShield {
 return {plates:[JADE_PLATE_HP,JADE_PLATE_HP,JADE_PLATE_HP],angle,active:false,openedAt:-9,closedAt:-9,hitAt:-9,
  hitPlate:-1,requireRelease:false,chargeHeld:0,chargeProgress:0,readyAt:-9};
}

const clamp01=(n:number)=>Math.min(1,Math.max(0,n));

export function jadeShieldOpening(guard:JadeShield,time:number){
 return guard.active
  ? Math.min(1,(guard.openingFrom??0)+clamp01((time-guard.openedAt)/JADE_SHIELD_UNFOLD))
  : Math.max(0,(guard.closingFrom??1)-clamp01((time-guard.closedAt)/JADE_SHIELD_FOLD));
}

export function jadeShieldRecoil(guard:JadeShield,time:number){
 const age=(time-guard.hitAt)/JADE_SHIELD_IMPACT;
 return age>=0&&age<1?Math.pow(1-age,3):0;
}

export function jadeShieldWrist(p:ShieldActor,scale:number,time:number):ShieldPoint {
 const guard=p.jadeShield,angle=guard?.angle??0;
 const reach=23*scale;
 return {x:p.x+Math.cos(angle)*reach,y:p.y+Math.sin(angle)*reach,z:p.z+(53-(guard?jadeShieldRecoil(guard,time):0)*1.6)*scale};
}

// Design A's three bands, traced as plate outlines in cuff-local coordinates.
// Their adjacent edges share points so breaking a band leaves its actual opening.
const BAND_OUTLINES:readonly (readonly Vertex[])[]=[
 [[2,-27],[13,-27],[23,-23],[31,-16],[36,-7],[37,-2],[22,-10],[2,-15]],
 [[-5,-15],[6,-15],[22,-10],[37,-2],[37,4],[35,12],[17,5],[-5,2]],
 [[0,2],[17,5],[35,12],[31,20],[24,26],[16,26],[8,29],[2,30]],
];
const TANGENT_LENGTH=Math.hypot(.83,1.6);

export function jadeShieldPlates(p:ShieldActor,scale:number,time:number):ShieldPlate[] {
 const guard=p.jadeShield;
 if(!guard)return [];
 const opening=jadeShieldOpening(guard,time);
 if(opening<=0)return [];
 const wrist=jadeShieldWrist(p,scale,time);
 const f=guard.angle,fx=Math.cos(f),fy=Math.sin(f);
 return guard.plates.flatMap((hp,index)=>{
  if(hp<=0)return [];
  const side=index-1,delay=side===0?0:side===-1?.16:.30;
  const phase=clamp01((opening-delay)/(1-delay));
  if(phase<=0)return [];
  const spread=1-(1-phase)**3+.065*Math.sin(phase*Math.PI);
  const fold=f+side*(1-spread)*.90,co=Math.cos(fold),si=Math.sin(fold);
  const tx=(.83*co-1.6*si)/TANGENT_LENGTH,ty=(.83*si+1.6*co)/TANGENT_LENGTH;
  const depth=-3*spread;
  const center={x:wrist.x+(depth*fx+24*spread*fy)*scale,
   y:wrist.y+(depth*fy-24*spread*fx)*scale,z:wrist.z-32.12*spread*scale};
  const profile=BAND_OUTLINES[index].map(([u,v]):Vertex=>[u*TANGENT_LENGTH*spread,(u*1.408-v)*spread]);
  const vertices=profile.map(([u,z])=>({x:center.x+tx*u*scale,y:center.y+ty*u*scale,z:center.z+z*scale}));
  return [{index,hp,center,normal:{x:ty,y:-tx},tx,ty,profile,vertices,scale}];
 });
}

// Intersect the moving guard plane, then sample the same unfolded shell as the renderer.
export function jadeShieldContact(from:ShieldPoint,to:ShieldPoint,p:ShieldActor,scale:number,time:number,start:ShieldPoint=p){
 const guard=p.jadeShield;
 if(!guard?.active)return null;
 const heading=jadeGuardHeading(guard.angle),pose=registration.headings[heading];
 const fx=Math.cos(guard.angle),fy=Math.sin(guard.angle);
 const nx=fx+.42*fy,ny=fy-.42*fx;
 const depth=26*scale;
 const ax=from.x-start.x,ay=from.y-start.y,bx=to.x-p.x,by=to.y-p.y;
 const front=ax*nx+ay*ny-depth,back=bx*nx+by*ny-depth;
 if(front<0||back>0||front-back<1e-8)return null;
 const t=front/(front-back),x=ax+(bx-ax)*t,y=ay+(by-ay)*t;
 const z=(from.z-start.z)*(1-t)+(to.z-p.z)*t;
 const j=arenaJacobian46(p.x,p.y),upright=1.536*ARENA_UPRIGHT_SCALE47,unit=88.5/256*scale;
 const px=160+(j.x*x+j.xy*y)/(upright*unit);
 const py=264+(j.y*y/upright-z)/unit;
 const [cx,cy]=pose.plate_pivot,opening=jadeShieldOpening(guard,time);
 for(let index=2;index>=0;index--){
  const spread=jadeGuardSpread(opening,index);
  if(!spread||guard.plates[index]<=0)continue;
  const sx=Math.floor(cx+(px-cx)/spread);
  const bounce=guard.hitPlate===index?jadeShieldRecoil(guard,time)*2:0;
  const sy=Math.floor(cy+(py-cy-bounce)/spread);
  const [top,rows]=silhouettes[heading][index] as [number,number[][]];
  const spans=rows[sy-top];
  if(!spans)continue;
  for(let k=0;k<spans.length;k+=2){
   if(sx>=spans[k]&&sx<spans[k+1])return {t,index,point:{x:from.x+(to.x-from.x)*t,y:from.y+(to.y-from.y)*t,z:from.z+(to.z-from.z)*t}};
  }
 }
 return null;
}
