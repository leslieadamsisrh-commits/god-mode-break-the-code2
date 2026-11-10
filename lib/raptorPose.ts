import type {RaptorCoverState11} from './raptorCover11';
import {advanceRaptorJump,type JumpMemory,type JumpPhase} from './raptorJump';
import inventory from '../public/assets/raptor-v2/manifest.json';

export const RAPTOR_POSE_DIRECTIONS=['right','front-right','front','front-left','left','back-left','back','back-right'] as const;
export type RaptorPoseFamily='idle'|'run'|'stalk'|'jog'|'sprint'|'slide'|'jump'|'cover-drive'|'cover-hold'|'cover-lean'|'cover-pop'|'cover-catch'|'cover-shuffle'|'cover-wrap'|'cover-bridge'|'cover-corner'|'cover-recoil'|'recovery';
export type RaptorPoseFrame={family:RaptorPoseFamily;frame:number;angle:number;key:string};
type RaptorCoverShot={at:number;coverId:string;frame:RaptorPoseFrame};
export type RaptorPoseSample={aimAngle?:number;coverProtectedAngle?:number;coverShot?:RaptorCoverShot;coverState11?:RaptorCoverState11;coverTall11?:boolean;coverEdge?:RaptorCoverEdge;coverId?:string|null;coverEndpointAngle?:number;coverEntryAngle?:number;coverSpeed11?:number;time:number;x?:number;y?:number;angle:number;speed:number;travelAngle?:number;sliding:boolean;slideRemaining?:number;slideDuration?:number;airborne:boolean;verticalVelocity:number;hit:boolean;attached:boolean;firing:boolean};
export type RaptorPoseMemory={
 cover?:{time:number;x?:number;y?:number;phase:number;attached:boolean};
 waistAim?:{id:string;angle:number;since:number;lowering:boolean};
 corner?:{id:string;angle:number;since:number};
 recoveryUntil?:number;
 wrap?:{coverId:string;edge:RaptorCoverEdge;endpointAngle:number;since:number;retracting:boolean};
 gait:{time:number;x?:number;y?:number;phase:number;sprinting:boolean;jogging:boolean;airborne:boolean;landedAt:number};
 jump:JumpMemory;
 slide:{time:number;active:boolean;startedAt:number;recoveryUntil:number;angle:number};
};
export type RaptorPoseAvailability={
 postureDirections:readonly string[];jumpDirections?:readonly string[];
 coverLeanDirections?:readonly string[];coverLeanAltDirections?:readonly string[];
 coverBridgeDirections?:readonly string[];coverCornerDirections?:readonly string[];
 coverRecoilDirections?:readonly string[];coverTallRecoilDirections?:readonly string[];coverRecoilReadyDirections?:readonly string[];
 recoveryDirections?:readonly string[];
 coverLowReadyDirections?:readonly string[];coverPopDirections?:readonly string[];coverCatchDirections?:readonly string[];coverCatchProtectedDirections?:readonly string[];coverShuffleDirections?:readonly string[];coverWrapDirections?:readonly string[];
};
export type RaptorCoverEdge='start'|'end';
type RaptorCoverAnchor={tx:number;ty:number;nx:number;ny:number;t?:number;length?:number};
const COVER_ENDPOINT_DISTANCE=18;
const WRAP_CONNECTOR_SECONDS=.075;

/** Endpoints use the cover tangent and the same outward aim as clearance. */
export function raptorCoverEdge(anchor:RaptorCoverAnchor|null|undefined,angle:number):RaptorCoverEdge|undefined{
 if(anchor?.t===undefined||anchor.length===undefined)return undefined;
 const along=Math.cos(angle)*anchor.tx+Math.sin(angle)*anchor.ty;
 if(anchor.t<COVER_ENDPOINT_DISTANCE&&along<-.18)return 'start';
 if(anchor.length-anchor.t<COVER_ENDPOINT_DISTANCE&&along>.18)return 'end';
}

function raptorCoverEndpointAngle(anchor:RaptorCoverAnchor|null|undefined,edge:RaptorCoverEdge|undefined){
 if(anchor?.t===undefined||anchor.length===undefined)return undefined;
 const end=anchor.length-anchor.t;
 if(Math.min(anchor.t,end)>=COVER_ENDPOINT_DISTANCE)return undefined;
 const sign=edge?(edge==='start'?-1:1):anchor.t<end?-1:1;
 return Math.atan2(anchor.ty*sign,anchor.tx*sign);
}

const jumpPhases:readonly JumpPhase[]=['push-off','ascent','apex','descent','landing','recovery'];
export const RAPTOR_STRIDE_DISTANCE=100;
export function raptorPoseDirection(angle:number){return RAPTOR_POSE_DIRECTIONS[((Math.round(angle/(Math.PI/4))%8)+8)%8];}
function selected(family:RaptorPoseFamily,frame:number,angle:number):RaptorPoseFrame{return{family,frame,angle,key:`${family}/${raptorPoseDirection(angle)}/${String(frame).padStart(3,'0')}.png`};}

/** Shared by clearance probing and rendered exposure: never test a different barrel. */
export function raptorCoverExposureFrame(angle:number,tall:boolean,available:RaptorPoseAvailability=inventory,edge?:RaptorCoverEdge):RaptorPoseFrame{
 const direction=raptorPoseDirection(angle);
 const lean=available.coverLeanDirections??inventory.coverLeanDirections;
 const pop=available.coverPopDirections??[];
 if(available.coverRecoilReadyDirections?.includes(direction)&&raptorCoverRecoilFrame(angle,tall,available))return selected('cover-recoil',1,angle);
 if(tall&&lean.includes(direction)){
  const frame=edge==='start'&&available.coverLeanAltDirections?.includes(direction)?1:0;
  return selected('cover-lean',frame,angle);
 }
 return selected(!tall&&pop.includes(direction)?'cover-pop':'idle',0,angle);
}

export function raptorCoverRecoilFrame(angle:number,tall:boolean,available:RaptorPoseAvailability=inventory){
 const directions=tall?available.coverTallRecoilDirections:available.coverRecoilDirections;
 return directions?.includes(raptorPoseDirection(angle))?selected('cover-recoil',0,angle):undefined;
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
 const leavingCover=cover.attached&&!s.attached;
 if(!cover.attached&&s.attached)cover.phase=0;
 if(movingCover&&cover.attached&&continuous&&dt>0){
  const distance=s.x!==undefined&&s.y!==undefined&&cover.x!==undefined&&cover.y!==undefined?Math.hypot(s.x-cover.x,s.y-cover.y):s.speed*dt;
  if(distance<=Math.max(12,s.speed*dt*2))cover.phase=((cover.phase+Math.sign(s.coverSpeed11??s.speed)*distance/60)%1+1)%1;
 }
 cover.time=s.time;cover.x=s.x;cover.y=s.y;cover.attached=s.attached;
 const memory:RaptorPoseMemory={gait,jump:jump.memory,slide,cover};
 if(!interrupted)memory.recoveryUntil=leavingCover?s.time+.09:continuous?previous.recoveryUntil:undefined;
 // Explicit reuse of approved poses, never an implicit idle fallback for attachment.
 // Landing is the planted crouch; slide recovery supplies contact compression.
 if(s.attached&&s.coverState11){
  const state=s.coverState11,direction=raptorPoseDirection(s.angle);
  if(continuous&&s.coverEndpointAngle!==undefined&&previous.corner?.id===s.coverId)memory.corner=previous.corner;
  const wrap=continuous&&previous.wrap&&previous.wrap.coverId===s.coverId?previous.wrap:undefined;
  const waist=continuous&&previous.waistAim?.id===s.coverId?previous.waistAim:undefined;
  const shot=s.coverShot;
  const shotAge=shot?s.time-shot.at:Infinity;
  if(shot&&shot.coverId===s.coverId&&shotAge>=0&&shotAge<.12&&
     (state==='fire'||state==='expose'||state==='retract')&&
     raptorPoseDirection(shot.frame.angle)===raptorPoseDirection(s.aimAngle??s.angle)){
   memory.waistAim=waist;
   memory.wrap=wrap;
   return{memory,frame:shotAge<.055?shot.frame:selected('cover-recoil',1,shot.frame.angle)};
  }
  if(state==='expose'||state==='fire'){
   const exposure=raptorCoverExposureFrame(s.angle,!!s.coverTall11,available,s.coverEdge);
   const endpointAngle=s.coverEndpointAngle;
   if(!s.coverTall11&&s.coverId&&available.coverBridgeDirections?.includes(direction)&&
      raptorPoseDirection(s.coverProtectedAngle??s.angle)===direction){
    const since=waist&&!waist.lowering&&raptorPoseDirection(waist.angle)===direction?waist.since:s.time;
    memory.waistAim={id:s.coverId,angle:s.angle,since,lowering:false};
    if(!s.firing&&state==='expose'&&s.time-since<.045)return{memory,frame:selected('cover-bridge',0,s.angle)};
   }
   if(s.coverTall11&&s.coverId&&s.coverEdge&&endpointAngle!==undefined&&(exposure.family==='cover-lean'||exposure.family==='cover-recoil')&&available.coverWrapDirections?.includes(raptorPoseDirection(endpointAngle))){
    const same=wrap&&!wrap.retracting&&wrap.edge===s.coverEdge&&raptorPoseDirection(wrap.endpointAngle)===raptorPoseDirection(endpointAngle);
    const since=same?wrap.since:s.time;
    memory.wrap={coverId:s.coverId,edge:s.coverEdge,endpointAngle,since,retracting:false};
    // A short visual pivot is skipped on the trigger tick so the authored
    // exposure barrel drives both the visible shot and the clearance probe.
    if(state!=='fire'&&!s.firing&&s.time-since<WRAP_CONNECTOR_SECONDS)return{memory,frame:selected('cover-wrap',1,endpointAngle)};
   }
   return{memory,frame:exposure};
  }
  if(state==='catch'){
   const entry=s.coverEntryAngle??s.angle;
   const incoming=raptorPoseDirection(entry);
   const protectedReady=available.coverCatchProtectedDirections?.includes(direction)??true;
   const frame=protectedReady&&available.coverCatchDirections?.includes(incoming)?selected('cover-catch',0,entry):selected('slide',2,s.angle);
   return{memory,frame};
  }
  if(!s.coverTall11&&state==='retract'&&waist){
   const since=waist.lowering?waist.since:s.time;
   if(s.time-since<.065){
    memory.waistAim={...waist,since,lowering:true};
    return{memory,frame:selected('cover-bridge',1,waist.angle)};
   }
  }
  if(s.coverTall11&&s.coverId&&s.coverEndpointAngle!==undefined&&direction==='back'&&
     (state==='shuffle'||state==='hold'||state==='brace')){
   const endpoint=s.coverEndpointAngle;
   const cornerAngle=Math.atan2(Math.sin(s.angle)+Math.sin(endpoint),Math.cos(s.angle)+Math.cos(endpoint));
   const cornerDirection=raptorPoseDirection(cornerAngle);
   const old=memory.corner&&raptorPoseDirection(memory.corner.angle)===cornerDirection?memory.corner:undefined;
   if((old||state==='shuffle')&&available.coverCornerDirections?.includes(cornerDirection)){
    memory.corner=old??{id:s.coverId,angle:cornerAngle,since:s.time};
    if(s.time-memory.corner.since<.08)return{memory,frame:selected('cover-corner',0,cornerAngle)};
   }
  }
  if(state==='shuffle'&&available.coverShuffleDirections?.includes(direction)){
   const phase=Math.floor(cover.phase*4);
   const frame=phase%2===0?selected('cover-hold',0,s.angle):selected('cover-shuffle',Math.floor(phase/2),s.angle);
   return{memory,frame};
  }
  if(state==='drive'&&raptorPoseDirection(s.angle)==='front-right')return{memory,frame:selected('cover-drive',cover.phase>=.5?1:0,s.angle)};
  if(state==='shuffle'||state==='drive')return{memory,frame:selected('stalk',Math.floor(cover.phase*4),s.angle)};
  if(s.coverTall11&&s.coverEndpointAngle!==undefined){
   if(wrap){
    const since=wrap.retracting?wrap.since:s.time;
    if(s.time-since<WRAP_CONNECTOR_SECONDS){
     memory.wrap={...wrap,since,retracting:true};
     return{memory,frame:selected('cover-wrap',1,wrap.endpointAngle)};
    }
   }
   if(available.coverWrapDirections?.includes(raptorPoseDirection(s.coverEndpointAngle)))return{memory,frame:selected('cover-wrap',0,s.coverEndpointAngle)};
  }
  const lowReady=s.coverTall11===false&&available.coverLowReadyDirections?.includes(direction);
  return{memory,frame:selected('cover-hold',lowReady?1:0,s.angle)};
 }

 if(!interrupted&&s.sliding){
  const duration=Math.max(.01,s.slideDuration??.5),remaining=s.slideRemaining??duration*.5;
  return{memory,frame:selected('slide',s.time-slide.startedAt<.08?0:remaining<.06?2:1,s.angle)};
 }
 const recoveryAngle=s.travelAngle??slide.angle;
 const recovering=s.time<(memory.recoveryUntil??0)||s.time<slide.recoveryUntil;
 if(!interrupted&&!s.firing&&recovering&&available.recoveryDirections?.includes(raptorPoseDirection(recoveryAngle))){
  gait.phase=0;
  return{memory,frame:selected('recovery',0,recoveryAngle)};
 }
 if(!interrupted&&s.time<slide.recoveryUntil)return{memory,frame:selected('slide',2,s.firing?s.angle:slide.angle)};
 if(jump.phase&&(available.jumpDirections??[]).includes(raptorPoseDirection(s.angle)))return{memory,frame:selected('jump',jumpPhases.indexOf(jump.phase),s.angle)};
 if(interrupted||s.time-gait.landedAt<.075)return{memory,frame:selected('idle',0,s.angle)};
 const contactFrame=(gait.phase>=.5?2:0)+(gait.phase%.5>=.28?1:0);
 if(gait.sprinting)return{memory,frame:selected('sprint',contactFrame,s.angle)};
 if(s.speed>2&&hasPostures)return{memory,frame:selected(gait.jogging?'jog':'stalk',contactFrame,s.angle)};
 return{memory,frame:selected(s.speed>2?'run':'idle',s.speed>2?Math.floor(gait.phase*4):0,s.angle)};
}

export type RaptorPoseActor={raptorCoverShot?:RaptorCoverShot;coverState11?:RaptorCoverState11;coverTall11?:boolean;coverEntryAngle?:number;x:number;y:number;vx:number;vy:number;aim:number;gunFacing:number;slide:number;pinball:number;slideFacing:number;grounded?:boolean;vz?:number;jumpHeight?:number;knock:number;hitUntil?:number;charging:boolean;coverId:string|null;coverMode?:string|null;coverSpeed?:number;coverAnchor?:RaptorCoverAnchor|null;fireState:number;recoil:number;returnToCover:number;pendingFireUntil?:number;input?:{x?:number;y?:number;fire?:boolean;coverAim?:boolean}};
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
 const coverEdge=raptorCoverEdge(p.coverAnchor,p.gunFacing);
 // Damage flash is cosmetic; only physical knockback interrupts the pose clock.
 return{aimAngle:p.gunFacing,coverProtectedAngle:p.coverAnchor?Math.atan2(-p.coverAnchor.ny,-p.coverAnchor.nx):undefined,coverShot:p.raptorCoverShot,coverTall11:p.coverTall11,coverState11:p.coverState11,coverEdge,coverId:p.coverId,coverEndpointAngle:raptorCoverEndpointAngle(p.coverAnchor,coverEdge),coverEntryAngle:p.coverEntryAngle,coverSpeed11:p.coverSpeed,time,x:p.x,y:p.y,angle:raptorActorFacing(p),speed,travelAngle:speed>2?Math.atan2(p.vy,p.vx):undefined,sliding:p.slide>0||p.pinball>0,slideRemaining:p.slide>0?p.slide:undefined,slideDuration,airborne:p.grounded===false||Math.abs(p.vz||0)>.1||(p.jumpHeight||0)>0,verticalVelocity:p.vz||0,hit:p.knock>0,attached:!!p.coverId,firing:!!p.input?.fire||p.pendingFireUntil!==undefined};
}



