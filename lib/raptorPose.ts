import type {RaptorCoverState11} from './raptorCover11';
import {advanceRaptorJump,type JumpMemory,type JumpPhase} from './raptorJump';
import inventory from '../public/assets/raptor-v2/manifest.json';

export const RAPTOR_POSE_DIRECTIONS=['right','front-right','front','front-left','left','back-left','back','back-right'] as const;
export type RaptorPoseFamily='idle'|'run'|'stalk'|'jog'|'sprint'|'slide'|'jump'|'cover-drive'|'cover-hold'|'cover-lean'|'cover-pop';
export type RaptorPoseFrame={family:RaptorPoseFamily;frame:number;angle:number;key:string};
export type RaptorPoseSample={coverState11?:RaptorCoverState11;coverTall11?:boolean;coverSpeed11?:number;time:number;x?:number;y?:number;angle:number;speed:number;travelAngle?:number;sliding:boolean;slideRemaining?:number;slideDuration?:number;airborne:boolean;verticalVelocity:number;hit:boolean;attached:boolean;firing:boolean};
export type RaptorPoseMemory={
 cover?:{time:number;x?:number;y?:number;phase:number;attached:boolean};
 gait:{time:number;x?:number;y?:number;phase:number;sprinting:boolean;jogging:boolean;airborne:boolean;landedAt:number};
 jump:JumpMemory;
 slide:{time:number;active:boolean;startedAt:number;recoveryUntil:number;angle:number};
};
export type RaptorPoseAvailability={postureDirections:readonly string[];jumpDirections?:readonly string[];coverLeanDirections?:readonly string[];coverPopDirections?:readonly string[]};
const jumpPhases:readonly JumpPhase[]=['push-off','ascent','apex','descent','landing','recovery'];
export const RAPTOR_STRIDE_DISTANCE=100;
export function raptorPoseDirection(angle:number){return RAPTOR_POSE_DIRECTIONS[((Math.round(angle/(Math.PI/4))%8)+8)%8];}
function selected(family:RaptorPoseFamily,frame:number,angle:number):RaptorPoseFrame{return{family,frame,angle,key:`${family}/${raptorPoseDirection(angle)}/${String(frame).padStart(3,'0')}.png`};}

/** Shared by clearance probing and rendered exposure: never test a different barrel. */
export function raptorCoverExposureFrame(angle:number,tall:boolean,available:RaptorPoseAvailability=inventory):RaptorPoseFrame{
 const direction=raptorPoseDirection(angle);
 const lean=available.coverLeanDirections??inventory.coverLeanDirections;
 const pop=available.coverPopDirections??[];
 return selected(tall&&lean.includes(direction)?'cover-lean':!tall&&pop.includes(direction)?'cover-pop':'idle',0,angle);
}

/** Pure per-actor selection, sampled by combat authority once per simulation tick. */
export function advanceRaptorPose(previous:RaptorPoseMemory|undefined,s:RaptorPoseSample,available:RaptorPoseAvailability=inventory):{memory:RaptorPoseMemory;frame:RaptorPoseFrame}{
 const valid=previous&&s.time>=previous.gait.time;
 const gait=valid?{...previous.gait}:{time:s.time,x:s.x,y:s.y,phase:0,sprinting:false,jogging:false,airborne:false,landedAt:-Infinity};
 const dt=s.time-gait.time,hasPostures=available.postureDirections.includes(raptorPoseDirection(s.angle));
 const continuous=valid&&dt<=.25;
 if(continuous&&gait.airborne&&!s.airborne)gait.landedAt=s.time;
 gait.airborne=s.airborne;
 const alignment=s.travelAngle===undefined?1:Math.cos(s.travelAngle-s.angle);
 const gaitInterrupted=s.sliding||s.airborne||s.hit||s.attached||s.time-gait.landedAt<.075;
 gait.sprinting=!gaitInterrupted&&s.speed>(gait.sprinting?145:170)&&alignment>(gait.sprinting ? .62 : .78);
 gait.jogging=!gaitInterrupted&&s.speed>(gait.jogging?75:95);
 if(dt>0&&dt<=.25&&!gaitInterrupted&&s.speed>2){
  const distance=s.x!==undefined&&s.y!==undefined&&gait.x!==undefined&&gait.y!==undefined?Math.hypot(s.x-gait.x,s.y-gait.y):s.speed*dt;
  if(distance<=Math.max(12,s.speed*dt*2)){
   const backwards=s.travelAngle!==undefined&&Math.cos(s.travelAngle-s.angle)<-.5;
   const stride=gait.sprinting?120:hasPostures&&!gait.jogging?60:RAPTOR_STRIDE_DISTANCE;
   gait.phase=((gait.phase+(backwards?-1:1)*distance/stride)%1+1)%1;
  }
 }
 if(dt!==0||!valid){gait.time=s.time;gait.x=s.x;gait.y=s.y;}
 const jump=advanceRaptorJump(valid?previous.jump:undefined,{time:s.time,airborne:s.airborne,verticalVelocity:s.verticalVelocity,interrupted:s.hit||s.attached||s.sliding});
 const slide=continuous?{...previous.slide}:{time:s.time,active:false,startedAt:s.time,recoveryUntil:0,angle:s.angle};
 const interrupted=s.airborne||s.hit||s.attached;
 if(interrupted){slide.active=false;slide.recoveryUntil=0;}
 else if(s.sliding){if(!slide.active)slide.startedAt=s.time;slide.active=true;slide.angle=s.angle;slide.recoveryUntil=0;}
 else if(slide.active){slide.active=false;slide.recoveryUntil=s.time+.12;}
 slide.time=s.time;
 const cover=continuous&&previous.cover?{...previous.cover}:{time:s.time,x:s.x,y:s.y,phase:0,attached:s.attached};
 const movingCover=s.attached&&(s.coverState11==='shuffle'||s.coverState11==='drive');
 if(!cover.attached&&s.attached)cover.phase=0;
 if(movingCover&&cover.attached&&continuous&&dt>0){
  const distance=s.x!==undefined&&s.y!==undefined&&cover.x!==undefined&&cover.y!==undefined?Math.hypot(s.x-cover.x,s.y-cover.y):s.speed*dt;
  if(distance<=Math.max(12,s.speed*dt*2))cover.phase=((cover.phase+Math.sign(s.coverSpeed11??s.speed)*distance/60)%1+1)%1;
 }
 cover.time=s.time;cover.x=s.x;cover.y=s.y;cover.attached=s.attached;
 const memory={gait,jump:jump.memory,slide,cover};
 // Explicit reuse of approved poses, never an implicit idle fallback for attachment.
 // Landing is the planted crouch; slide recovery supplies contact compression.
 if(s.attached&&s.coverState11){
  const state=s.coverState11;
  if(state==='expose'||state==='fire')return{memory,frame:raptorCoverExposureFrame(s.angle,!!s.coverTall11,available)};
  if(state==='catch')return{memory,frame:selected('slide',2,s.angle)};
  if(state==='drive'&&raptorPoseDirection(s.angle)==='front-right')return{memory,frame:selected('cover-drive',cover.phase>=.5?1:0,s.angle)};
  if(state==='shuffle'||state==='drive')return{memory,frame:selected('stalk',Math.floor(cover.phase*4),s.angle)};
  return{memory,frame:selected('cover-hold',0,s.angle)};
 }

 if(!interrupted&&s.sliding){
  const duration=Math.max(.01,s.slideDuration??.5),remaining=s.slideRemaining??duration*.5;
  return{memory,frame:selected('slide',s.time-slide.startedAt<.08?0:remaining<.06?2:1,s.angle)};
 }
 if(!interrupted&&s.time<slide.recoveryUntil)return{memory,frame:selected('slide',2,s.firing?s.angle:slide.angle)};
 if(jump.phase&&(available.jumpDirections??[]).includes(raptorPoseDirection(s.angle)))return{memory,frame:selected('jump',jumpPhases.indexOf(jump.phase),s.angle)};
 if(interrupted||s.time-gait.landedAt<.075)return{memory,frame:selected('idle',0,s.angle)};
 const contactFrame=(gait.phase>=.5?2:0)+(gait.phase%.5>=.28?1:0);
 if(gait.sprinting)return{memory,frame:selected('sprint',contactFrame,s.angle)};
 if(s.speed>2&&hasPostures)return{memory,frame:selected(gait.jogging?'jog':'stalk',contactFrame,s.angle)};
 return{memory,frame:selected(s.speed>2?'run':'idle',s.speed>2?Math.floor(gait.phase*4):0,s.angle)};
}

export type RaptorPoseActor={coverState11?:RaptorCoverState11;coverTall11?:boolean;x:number;y:number;vx:number;vy:number;aim:number;gunFacing:number;slide:number;pinball:number;slideFacing:number;grounded?:boolean;vz?:number;jumpHeight?:number;knock:number;hitUntil?:number;charging:boolean;coverId:string|null;coverMode?:string|null;coverSpeed?:number;coverAnchor?:{tx:number;ty:number;nx:number;ny:number}|null;fireState:number;recoil:number;returnToCover:number;pendingFireUntil?:number;input?:{x?:number;y?:number;fire?:boolean;coverAim?:boolean}};
/** Same facing rules as the original Raptor draw path, independent of a render clock. */
export function raptorActorFacing(p:RaptorPoseActor){
 const speed=Math.hypot(p.vx,p.vy),sliding=p.slide>0||p.pinball>0;
 if(sliding)return p.slideFacing??p.aim??0;
 if(p.charging&&!p.coverId&&(typeof p.input?.x==='number'||typeof p.input?.y==='number'))return Math.hypot(p.input?.x||0,p.input?.y||0)>.18?Math.atan2(p.input!.y||0,p.input!.x||0):p.gunFacing??p.aim??0;
 if(p.coverId&&p.coverAnchor){
  if(p.coverState11)return p.coverState11==='expose'||p.coverState11==='fire'?p.gunFacing:Math.atan2(-p.coverAnchor.ny,-p.coverAnchor.nx);
  if(p.coverMode==='soft'){const moving=Math.abs(p.coverSpeed||0)>20;return moving?Math.atan2(p.coverAnchor.ty*Math.sign(p.coverSpeed||1),p.coverAnchor.tx*Math.sign(p.coverSpeed||1)):p.gunFacing??p.aim??Math.atan2(-p.coverAnchor.ny,-p.coverAnchor.nx);}
  const exposed=p.input?.coverAim||p.fireState>0||p.recoil>0||p.returnToCover>0;
  return exposed?p.gunFacing??p.aim??0:Math.atan2(p.coverAnchor.ny,p.coverAnchor.nx);
 }
 if(p.input?.fire||p.fireState>0||p.pendingFireUntil!==undefined)return p.gunFacing??p.aim??0;
 return speed>2?Math.atan2(p.vy,p.vx):p.gunFacing??p.aim??0;
}
export function raptorActorSample(p:RaptorPoseActor,time:number,slideDuration:number):RaptorPoseSample{
 const speed=Math.hypot(p.vx,p.vy);
 // Damage flash is cosmetic; only physical knockback interrupts the pose clock.
 return{coverTall11:p.coverTall11,coverState11:p.coverState11,coverSpeed11:p.coverSpeed,time,x:p.x,y:p.y,angle:raptorActorFacing(p),speed,travelAngle:speed>2?Math.atan2(p.vy,p.vx):undefined,sliding:p.slide>0||p.pinball>0,slideRemaining:p.slide>0?p.slide:undefined,slideDuration,airborne:p.grounded===false||Math.abs(p.vz||0)>.1||(p.jumpHeight||0)>0,verticalVelocity:p.vz||0,hit:p.knock>0,attached:!!p.coverId,firing:!!p.input?.fire||p.pendingFireUntil!==undefined};
}


