/** GOD MODE Raptor hybrid visual rig V1.
 * Pure presentation math; does not read or alter combat physics, hitboxes or networking.
 * Art slots are intentionally unapproved until individually authored RGBA layers exist.
 */
export type RaptorBone="root"|"torso"|"neck"|"head"|"jaw"|"leftUpperArm"|"leftForearm"|"rightUpperArm"|"rightForearm"|"weapon"|"leftThigh"|"leftShin"|"leftFoot"|"rightThigh"|"rightShin"|"rightFoot"|"tail0"|"tail1"|"tail2"|"tail3"|"tail4"|"tail5";
export type RigTransform={x:number;y:number;angle:number};
export type RigPose={phase:number;contact:"left"|"right"|"airborne";bones:Record<RaptorBone,RigTransform>;replacement:null|"slide"|"pounce"|"finisher";};
export type MotionInput={time:number;speed:number;runSpeed:number;facing:number;aim:number;state:"idle"|"run"|"slide"|"pounce"|"finisher";};
export type LayerSlot={bone:RaptorBone;png:string|null;pivot:[number,number];verified:boolean};
const B:readonly RaptorBone[]=["root","torso","neck","head","jaw","leftUpperArm","leftForearm","rightUpperArm","rightForearm","weapon","leftThigh","leftShin","leftFoot","rightThigh","rightShin","rightFoot","tail0","tail1","tail2","tail3","tail4","tail5"];
export const RAPTOR_LAYER_SLOTS:readonly LayerSlot[]=B.map(b=>({bone:b,png:null,pivot:[0,0],verified:false}));
const TAU=Math.PI*2;
const clamp=(v:number,min:number,max:number)=>Math.max(min,Math.min(max,v));
const smooth=(v:number)=>v*v*(3-2*v);
const empty=():Record<RaptorBone,RigTransform>=>Object.fromEntries(B.map(b=>[b,{x:0,y:0,angle:0}])) as Record<RaptorBone,RigTransform>;
/** A grounded two-step gait. One leg cycles half a stride behind the other.
 * Y is positive downward; the root stays fixed while planted feet keep ground height.
 */
function leg(bones:Record<RaptorBone,RigTransform>,side:"left"|"right",p:number,amp:number,motion:number){
 const cycle=(p+(side==="right"?.5:0))%1;
 // A long, weight-bearing stance followed by a compact lifted recovery.
 const stance=cycle<.64,u=stance?cycle/.64:(cycle-.64)/.36;
 const travel=stance?1-2*u:-1+2*smooth(u);
 const footX=amp*travel;
 const footY=stance?0:-Math.pow(Math.sin(Math.PI*u),1.2)*13*motion;
 const hipX=side==="left"?-7:7,hipY=0;
 const dx=footX-hipX,dy=36+footY-hipY;
 const upper=27,lower=30;
 const reach=clamp(Math.hypot(dx,dy),.01,upper+lower-.01);
 const base=Math.atan2(dy,dx);
 const bend=Math.acos(clamp((upper*upper+reach*reach-lower*lower)/(2*upper*reach),-1,1));
 // Digitigrade knees bend forward consistently in the character's local profile.
 // Reversing the bend for the far leg previously produced an unnatural scissor gait.
 const thigh=base-bend;
 const kneeX=hipX+Math.cos(thigh)*upper,kneeY=hipY+Math.sin(thigh)*upper;
 const shin=Math.atan2(36+footY-kneeY,footX-kneeX);
 bones[(side+"Thigh") as RaptorBone]={x:hipX,y:hipY,angle:thigh};
 bones[(side+"Shin") as RaptorBone]={x:kneeX,y:kneeY,angle:shin};
 bones[(side+"Foot") as RaptorBone]={x:footX,y:36+footY,angle:stance?0:-.12*Math.sin(Math.PI*u)};
 return stance;
}
export function evaluateRaptorRig(input:MotionInput):RigPose{
 const bones=empty(),motion=clamp(input.speed/Math.max(1,input.runSpeed),0,1);
 const phase=input.state==="idle"?0:((input.time*2.0)%1+1)%1;
 const a=phase*TAU;
 const contactL=leg(bones,"left",phase,input.state==="idle"?0:9+15*motion,motion);
 const contactR=leg(bones,"right",phase,input.state==="idle"?0:9+15*motion,motion);
 bones.root={x:0,y:0,angle:0};
 bones.torso={x:0,y:-13,angle:.012*Math.sin(a*2)*motion};
 bones.neck={x:16,y:-20,angle:.04*Math.sin(a+.6)};
 bones.head={x:27,y:-26+Math.sin(a+.45)*1.2*motion,angle:.02*Math.sin(a+.65)*motion};
 bones.jaw={x:35,y:-22,angle:.03*Math.sin(a)};
 const aimDelta=Math.atan2(Math.sin(input.aim-input.facing),Math.cos(input.aim-input.facing));
 const aimOffset=clamp(aimDelta,-.5,.5);
 bones.leftUpperArm={x:9,y:-15,angle:.10*Math.sin(a-.55)*motion};
 bones.rightUpperArm={x:13,y:-15,angle:-.09*Math.sin(a-.55)*motion};
 bones.leftForearm={x:21,y:-8,angle:aimOffset*.4};
 bones.rightForearm={x:23,y:-8,angle:aimOffset*.4};
 bones.weapon={x:28,y:-8+Math.sin(a-.55)*.6*motion,angle:aimOffset};
 let tx=-15,ty=-12;
 for(let i=0;i<6;i++){
  const sway=Math.sin(a+i*.42)*.09*motion;
  const angle=-.12-i*.09+sway;
  tx-=Math.cos(angle)*12;ty+=Math.sin(angle)*12;
  bones[("tail"+i) as RaptorBone]={x:tx,y:ty,angle};
 }
 const replacement=input.state==="slide"?"slide":input.state==="pounce"?"pounce":input.state==="finisher"?"finisher":null;
 return {phase:Math.floor(phase*12),contact:contactL?"left":contactR?"right":"airborne",bones,replacement};
}
export function raptorArtComplete(slots:readonly LayerSlot[]=RAPTOR_LAYER_SLOTS){
 return slots.length===B.length&&slots.every(s=>s.verified&&!!s.png);
}
