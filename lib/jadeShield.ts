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

function containsBand(profile:Vertex[],u:number,v:number){
 let inside=false;
 for(let i=0;i<profile.length;i++){
  const [x0,y0]=profile[i],[x1,y1]=profile[(i+1)%profile.length];
  if((y0>v)!==(y1>v)&&u<x0+(x1-x0)*(v-y0)/(y1-y0))inside=!inside;
 }
 return inside;
}

export function jadeShieldContact(from:ShieldPoint,to:ShieldPoint,p:ShieldActor,scale:number,time:number,start:ShieldPoint=p){
 if(!p.jadeShield?.active)return null;
 let first:{t:number;index:number;point:ShieldPoint}|null=null;
 // Trace against the exact visible polygons in the moving fighter's reference frame.
 const a={x:from.x+p.x-start.x,y:from.y+p.y-start.y,z:from.z+p.z-start.z};
 for(const plate of jadeShieldPlates(p,scale,time)){
  const {center,normal,tx,ty,profile}=plate;
  const front=(a.x-center.x)*normal.x+(a.y-center.y)*normal.y;
  const back=(to.x-center.x)*normal.x+(to.y-center.y)*normal.y;
  if(front<0||back>0||front-back<1e-8)continue;
  const t=front/(front-back);
  if(first&&t>=first.t)continue;
  const x=a.x+(to.x-a.x)*t,y=a.y+(to.y-a.y)*t,z=a.z+(to.z-a.z)*t;
  const u=((x-center.x)*tx+(y-center.y)*ty)/scale,v=(z-center.z)/scale;
  if(!containsBand(profile,u,v))continue;
  first={t,index:plate.index,point:{x:from.x+(to.x-from.x)*t,y:from.y+(to.y-from.y)*t,z:from.z+(to.z-from.z)*t}};
 }
 return first;
}
