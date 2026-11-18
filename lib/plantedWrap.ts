import {coverCel} from "./jadeCoverCels";
import {ATTACHED_COVER_POSES,type AttachedCoverPose} from "./attachedCoverPose";
import {arenaJacobian46,arenaPoint46,ARENA_UPRIGHT_SCALE47} from "./bayBridgePresentation";

type Point = readonly [number,number];
type Actor = {x:number;y:number;z?:number;character?:"jade"|"raptor"};
type Edge = {t:number;length:number;nx:number;ny:number;tx:number;ty:number};
type ShotPoint = {x:number;y:number;z:number};
export type WrapObstruction = ShotPoint & {surface:string};
export type WrapAim = {
 requested:number; angle:number; relative:number; end:"start"|"end";
 pose:AttachedCoverPose; limited:boolean; lean:Point; blocked?:WrapObstruction;
};
export const WRAP_EDGE_REACH = 18;
const FAR_LIMIT = 55 * Math.PI / 180;
const ARM_CELS = {
 "jade-left": {shoulder:[221,221],breech:[166,198],mask:[[0,175],[175,177],[182,202],[229,215],[243,244],[209,259],[86,261],[0,247]]},
 "jade-right": {shoulder:[260,197],breech:[331,177],mask:[[246,182],[271,190],[326,169],[512,161],[512,232],[312,243],[257,229]]},
 "raptor-left": {shoulder:[242,256],breech:[198,239],mask:[[0,223],[180,223],[219,231],[250,241],[266,272],[192,287],[0,275]]},
 "raptor-right": {shoulder:[301,260],breech:[355,236],mask:[[276,239],[308,247],[338,228],[512,218],[512,278],[409,302],[332,289],[276,279]]},
} satisfies Partial<Record<AttachedCoverPose,{shoulder:Point;breech:Point;mask:Point[]}>>;
type WrapPose=keyof typeof ARM_CELS;

export function screenBearing(actor:Actor,angle:number){
 const j=arenaJacobian46(actor.x,actor.y);
 return Math.atan2(j.y*Math.sin(angle),j.x*Math.cos(angle)+j.xy*Math.sin(angle));
}

export function plantedWrapAim(actor:Actor,edge:Edge,requested:number):WrapAim|undefined{
 if(Math.min(edge.t,edge.length-edge.t)>=WRAP_EDGE_REACH)return;
 const end=edge.t<edge.length/2?"start":"end";
 const side=end==="start"?-1:1;
 const tx=edge.tx*side,ty=edge.ty*side;
 const x=Math.cos(requested),y=Math.sin(requested);
 const relative=Math.atan2(x*edge.nx+y*edge.ny,x*tx+y*ty);
 const held=Math.max(-FAR_LIMIT,Math.min(Math.PI/2,relative));
 const angle=Math.atan2(ty*Math.cos(held)+edge.ny*Math.sin(held),tx*Math.cos(held)+edge.nx*Math.sin(held));
 const bearing=screenBearing(actor,angle);
 const pose:WrapPose=`${actor.character??"jade"}-${Math.cos(bearing)<0?"left":"right"}`;
 return {requested,angle,relative,end,pose,limited:Math.abs(held-relative)>.0001,lean:[tx*13+edge.nx*3,ty*13+edge.ny*3]};
}

// Both rendered points and authoritative socket come from the same cel transform.
export function wrapRig(actor:Actor,aim:WrapAim,spriteScale:number,recoil=0){
 const pose=aim.pose as WrapPose;
 const cel=ARM_CELS[pose],reg=ATTACHED_COVER_POSES[pose];
 const scale=.26*spriteScale*(reg.drawScale??1);
 const bearing=screenBearing(actor,aim.angle);
 const [sx,sy]=cel.shoulder, [mx,my]=reg.muzzle, [bx,by]=cel.breech;
 const axis=Math.atan2(my-by,mx-bx);
 const rotation=bearing-axis;
 const foreshorten=.72+.28*Math.abs(Math.cos(bearing));
 const left=actor.x-reg.supportFoot[0]*scale,top=actor.y-reg.supportFoot[1]*scale;
 const unit=1.536*ARENA_UPRIGHT_SCALE47;
 const floor=arenaPoint46(actor.x,actor.y);
 const [dx,dy]=aim.lean;
 const base=arenaPoint46(actor.x+dx,actor.y+dy);
 const height=(reg.supportFoot[1]-sy)*scale;
 const shoulder={x:actor.x+(base.x-floor.x)/unit,y:actor.y+(base.y-floor.y)/unit-height};
 const naturalX=left+sx*scale;
 const shear=(naturalX-shoulder.x)/height;
 const stretch=(actor.y-shoulder.y)/height;
 const j=arenaJacobian46(actor.x,actor.y);
 // Transform the actual barrel axis before converting its registered points to world space.
 function barrelPoint(x:number,y:number){
  const localX=(x-sx)*scale,localY=(y-sy)*scale;
  const along=(localX*Math.cos(axis)+localY*Math.sin(axis))*foreshorten;
  const across=-localX*Math.sin(axis)+localY*Math.cos(axis);
  const screenX=along*Math.cos(bearing)-across*Math.sin(bearing);
  const screenY=along*Math.sin(bearing)+across*Math.cos(bearing);
  const worldY=screenY*unit/j.y;
  return {x:actor.x+dx+(screenX*unit-j.xy*worldY)/j.x,y:actor.y+dy+worldY,z:(actor.z??0)+height};
 }
 const jade=pose.startsWith("jade-");
 const socket=jade?coverCel(actor,aim.angle,spriteScale,1,aim.lean).socket:barrelPoint(mx,my);
 const barrelBase=jade?{...socket,x:socket.x-Math.cos(aim.angle)*14*spriteScale,y:socket.y-Math.sin(aim.angle)*14*spriteScale}:barrelPoint(bx,by);
 shoulder.x-=Math.cos(bearing)*recoil*2;
 shoulder.y-=Math.sin(bearing)*recoil*2;

 return {cel,scale,left,top,shoulder,axis,rotation,foreshorten,socket,barrelBase,shear,stretch};
}

export function drawPlantedWrap(g:CanvasRenderingContext2D,image:HTMLImageElement,actor:Actor,aim:WrapAim,scale:number,recoil:number){
 const rig=wrapRig(actor,aim,scale,recoil);
 const {cel,left,top,shoulder,rotation,foreshorten}=rig,unit=rig.scale;
 const mask=()=>{
  g.moveTo(left+cel.mask[0][0]*unit,top+cel.mask[0][1]*unit);
  for(const [x,y] of cel.mask.slice(1))g.lineTo(left+x*unit,top+y*unit);
  g.closePath();
 };
 const bodyClip=(y:number,height:number)=>{
  g.beginPath();g.rect(left,y,512*unit,height);g.clip();
  g.beginPath();g.rect(left,top,512*unit,512*unit);mask();g.clip("evenodd");
 };
 const [sx,sy]=cel.shoulder;
 if(aim.pose==="jade-left"||aim.pose==="jade-right"){
  const side=aim.pose==="jade-left"?-1:1;
  // Authored shoulder rolls for the open-side, along-edge, and far-side poses.
  const relative=Math.max(-FAR_LIMIT,Math.min(Math.PI/2,aim.relative));
  const roll=side*(relative>=0?.04+.045*Math.cos(relative):.085-.055*relative/FAR_LIMIT);
  const hipY=top+(side===1?258:281)*unit;
  const naturalX=left+sx*unit,naturalY=top+sy*unit;
  const hipLength=hipY-naturalY,hipX=naturalX+side*8*unit;
  const jointX=shoulder.x+(hipX-naturalX)*Math.cos(roll)-hipLength*Math.sin(roll);
  const jointY=shoulder.y+(hipX-naturalX)*Math.sin(roll)+hipLength*Math.cos(roll);
  const legLength=actor.y-hipY;
  // Match the waist seam on both pieces while the support boot stays fixed.
  g.save();
  g.translate(actor.x,actor.y);
  g.transform(1,0,(hipX-jointX)/legLength,(actor.y-jointY)/legLength,0,0);
  g.translate(-actor.x,-actor.y);
  bodyClip(hipY-3*unit,top+512*unit-hipY+3*unit);
  g.drawImage(image,left,top,512*unit,512*unit);
  g.restore();
  g.save();
  g.translate(shoulder.x,shoulder.y);g.rotate(roll);g.translate(-naturalX,-naturalY);
  bodyClip(top,hipY-top+3*unit);
  g.drawImage(image,left,top,512*unit,512*unit);
  g.restore();
 }else{
  g.save();
  g.translate(actor.x,actor.y);
  g.transform(1,0,rig.shear,rig.stretch,0,0);
  g.translate(-actor.x,-actor.y);
  bodyClip(top,512*unit);
  g.drawImage(image,left,top,512*unit,512*unit);
  g.restore();
 }
 g.save();
 g.translate(shoulder.x,shoulder.y);
 g.rotate(rotation);
 g.rotate(rig.axis);g.scale(foreshorten,1);g.rotate(-rig.axis);
 g.translate(-left-sx*unit,-top-sy*unit);
 g.beginPath();mask();g.clip();
 g.drawImage(image,left,top,512*unit,512*unit);
 g.restore();
}
