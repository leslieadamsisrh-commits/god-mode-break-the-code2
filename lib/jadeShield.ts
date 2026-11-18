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

export function jadeShieldWrist(p:ShieldActor,scale:number):ShieldPoint {
 const angle=p.jadeShield?.angle??0;
 return {x:p.x+Math.cos(angle)*23*scale,y:p.y+Math.sin(angle)*23*scale,z:p.z+46*scale};
}

export function jadeShieldPlates(p:ShieldActor,scale:number,time:number):ShieldPlate[] {
 const guard=p.jadeShield;
 if(!guard)return [];
 const opening=guard.active?Math.max(.24,clamp01((time-guard.openedAt)/JADE_SHIELD_UNFOLD)):
  1-clamp01((time-guard.closedAt)/JADE_SHIELD_FOLD);
 if(opening<=0)return [];
 const f=guard.angle, fx=Math.cos(f),fy=Math.sin(f),sx=-fy,sy=fx,wrist=jadeShieldWrist(p,scale);
 const spread=1-(1-opening)**3+.075*Math.sin(Math.PI*opening);
 return guard.plates.flatMap((hp,index)=>{
  if(hp<=0)return [];
  const side=index-1, angle=f+(.29+side*.23)*spread;
  const nx=Math.cos(angle),ny=Math.sin(angle),tx=-ny,ty=nx;
  const depth=(14+side*8)*spread;
  const center={x:wrist.x+(fx*depth+sx*side*20*spread)*scale,y:wrist.y+(fy*depth+sy*side*20*spread)*scale,z:p.z+40*scale};
  const half=13.8*spread, top=(index===1?37:33)*spread, bottom=-32*spread;
  const profile:Vertex[]=[[-half,bottom+4*spread],[-half*.6,bottom],[half*.72,bottom],[half,bottom+5*spread],
   [half,top-6*spread],[half*.66,top],[-half*.68,top],[-half,top-4*spread]];
  const vertices=profile.map(([x,z])=>({x:center.x+tx*x*scale,y:center.y+ty*x*scale,z:center.z+z*scale}));
  return [{index,hp,center,normal:{x:nx,y:ny},tx,ty,profile,vertices,scale}];
 });
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
  if(profile.some(([x0,y0],i)=>{const [x1,y1]=profile[(i+1)%profile.length];return (x1-x0)*(v-y0)-(y1-y0)*(u-x0)<-1e-6;}))continue;
  first={t,index:plate.index,point:{x:from.x+(to.x-from.x)*t,y:from.y+(to.y-from.y)*t,z:from.z+(to.z-from.z)*t}};
 }
 return first;
}
