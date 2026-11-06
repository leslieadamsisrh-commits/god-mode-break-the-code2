/** Presentation only: reads flight state; never changes jump physics or input. */
export type JumpSample={time:number;airborne:boolean;verticalVelocity:number;interrupted?:boolean};
export type JumpMemory={time:number;airborne:boolean;takeoffAt:number;landedAt:number;observedAscent?:boolean};
export type JumpPhase="push-off"|"ascent"|"apex"|"descent"|"landing"|"recovery";
export function advanceRaptorJump(previous:JumpMemory|undefined,s:JumpSample):{memory:JumpMemory;phase:JumpPhase|null}{
 const valid=previous&&s.time>=previous.time&&s.time-previous.time<=.25;
 const m:JumpMemory=valid?{...previous}:{time:s.time,airborne:s.airborne,takeoffAt:-Infinity,landedAt:-Infinity,observedAscent:false};
 const vz=Number.isFinite(s.verticalVelocity)?s.verticalVelocity:0;
 if(s.interrupted){m.takeoffAt=m.landedAt=-Infinity;m.observedAscent=false;m.airborne=s.airborne;m.time=s.time;return{memory:m,phase:null};}
 if(valid&&!m.airborne&&s.airborne){m.takeoffAt=vz>0?s.time:-Infinity;m.landedAt=-Infinity;m.observedAscent=vz>0;}
 if(valid&&m.airborne&&!s.airborne){m.landedAt=s.time;m.takeoffAt=-Infinity;m.observedAscent=false;}
 m.airborne=s.airborne;m.time=s.time;
 let phase:JumpPhase|null=null;
 if(s.airborne){
  // Resuming during ascent can observe an apex without inventing a takeoff.
  if(vz>35)m.observedAscent=true;
  if(vz>0&&s.time-m.takeoffAt<.065)phase="push-off";
  else if(vz>35)phase="ascent";
  else if(vz< -35)phase="descent";
  else phase=m.observedAscent?"apex":"descent";
 }else if(s.time-m.landedAt<.075)phase="landing";
 else if(s.time-m.landedAt<.14)phase="recovery";
 return{memory:m,phase};
}

