import rims from "../public/assets/jade-floating32/contact.json";
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

// Cross sections of one rigid, curved guard in cuff-local units. The upper
// edge dips beneath the barrel and each band shares its rim with its neighbor.
const sections=[-28,-22,-16,-12,-8,0,8,16,22,28];
export function jadeShieldPlates(p:ShieldActor,scale:number,time:number){
 const guard=p.jadeShield;
 if(!guard)return [];
 const opening=jadeShieldOpening(guard,time),wrist=jadeShieldWrist(p,scale,time);
 const c=Math.cos(guard.angle),s=Math.sin(guard.angle);
 return guard.plates.flatMap((hp,index)=>{
  const spread=jadeGuardSpread(opening,[1,0,2][index]);
  if(hp<=0||spread<=0)return [];
  const kick=guard.hitPlate===index?jadeShieldRecoil(guard,time)*2:0;
  function vertex(u:number,edge:number,back:number){
   const height=[68-Math.max(0,12-Math.abs(u+12)*1.7),47-.32*u,29-.45*u,13+Math.abs(u)*.15][edge];
   const forward=(11-.012*u*u-back-kick)*spread*scale,side=(u-3)*spread*scale;
   return {x:wrist.x+c*forward-s*side,y:wrist.y+s*forward+c*side,z:wrist.z+(height-53)*spread*scale};
  }
  const strips=sections.slice(1).map((u,i)=>{
   const v=sections[i];
   const face=(back:number)=>[vertex(v,index,back),vertex(u,index,back),vertex(u,index+1,back),vertex(v,index+1,back)];
   return {front:face(0),back:face(3)};
  });
  return [{index,hp,strips}];
 });
}
// The sprite and pellet test use the same plane, origin and atlas pixel size.
export function jadePlateFrame(p:ShieldActor,scale:number,time:number,index:number){
 const guard=p.jadeShield!;
 const spread=jadeGuardSpread(jadeShieldOpening(guard,time),[1,0,2][index]);
 const wrist=jadeShieldWrist(p,scale,time);
 const kick=guard.hitPlate===index?2*jadeShieldRecoil(guard,time):0;
 const reach=(11-kick)*scale*spread;
 return {heading:jadeGuardHeading(guard.angle),spread,size:56/124*scale*spread,
  center:{x:wrist.x+Math.cos(guard.angle)*reach,y:wrist.y+Math.sin(guard.angle)*reach,z:wrist.z-12*scale*spread}};
}

// Use a solid interior pixel for a shell's spin pivot and fracture mark.
export function jadePlatePivot(index:number,heading:number){
 const rows=rims[index][heading];
 const first=rows.findIndex(row=>row.length>0);
 let last=rows.length-1;
 while(last>first&&!rows[last])last--;
 const y=Math.floor((first+last)/2),runs=rows[y];
 let left=0,right=0;
 for(let k=0;k<runs.length;k+=2){
  const a=runs.charCodeAt(k)-33,b=runs.charCodeAt(k+1)-33;
  if(b-a>right-left){left=a;right=b;}
 }
 return {x:(left+right)/2-40,y:y+.5-64};
}
export function jadeShieldContact(from:ShieldPoint,to:ShieldPoint,p:ShieldActor,scale:number,time:number,start:ShieldPoint=p){
 const guard=p.jadeShield;
 if(!guard?.active)return null;
 const origin={x:from.x+p.x-start.x,y:from.y+p.y-start.y,z:from.z+p.z-start.z};
 const dx=to.x-origin.x,dy=to.y-origin.y,dz=to.z-origin.z;
 if(dx*Math.cos(guard.angle)+dy*Math.sin(guard.angle)>=0)return null;
 let best:{t:number;index:number;point:ShieldPoint}|null=null;

 const facingX=Math.cos(guard.angle),facingY=Math.sin(guard.angle);
 const j=arenaJacobian46(p.x,p.y),unit=1.536*ARENA_UPRIGHT_SCALE47;
 // The renderer paints lower-index plates first. At coplanar overlapping
 // pixels the last painted shell is the visible one.
 for(let index=2;index>=0;index--){
  if(!guard.plates[index])continue;
  const {heading,center,size,spread}=jadePlateFrame(p,scale,time,index);
  if(spread<=0)continue;
  const {x:cx,y:cy,z:cz}=center;
  const t=((cx-origin.x)*facingX+(cy-origin.y)*facingY)/(dx*facingX+dy*facingY);
  if(t<0||t>1||(best&&t>=best.t))continue;
  const x=origin.x+t*dx-cx,y=origin.y+t*dy-cy,z=origin.z+t*dz-cz;
  if(Math.abs(-x*facingY+y*facingX)>32*scale*spread)continue;

  const col=Math.floor(40+(x*j.x+y*j.xy)/(unit*size)),row=Math.floor(64+(y*j.y/unit-z)/size);
  const runs=rims[index][heading][row]||"";
  for(let k=0;k<runs.length;k+=2){
   if(col<runs.charCodeAt(k)-33||col>=runs.charCodeAt(k+1)-33)continue;
   best={index,t,point:{x:from.x+t*(to.x-from.x),y:from.y+t*(to.y-from.y),z:from.z+t*(to.z-from.z)}};
   break;
  }
 }
 return best;
}
