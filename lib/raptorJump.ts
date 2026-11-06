/** Presentation only: reads flight state; never changes jump physics or input. */
export type JumpSample={time:number;airborne:boolean;verticalVelocity:number;interrupted?:boolean};
export type JumpMemory={time:number;airborne:boolean;takeoffAt:number;landedAt:number};
export type JumpPhase="push-off"|"ascent"|"apex"|"descent"|"landing"|"recovery";
export function advanceRaptorJump(previous:JumpMemory|undefined,s:JumpSample):{memory:JumpMemory;phase:JumpPhase|null}{
 const valid=previous&&s.time>=previous.time&&s.time-previous.time<=.25;
 const m:JumpMemory=valid?{...previous}:{time:s.time,airborne:s.airborne,takeoffAt:-Infinity,landedAt:-Infinity};
 const vz=Number.isFinite(s.verticalVelocity)?s.verticalVelocity:0;
 if(s.interrupted){m.takeoffAt=m.landedAt=-Infinity;m.airborne=s.airborne;m.time=s.time;return{memory:m,phase:null};}
 if(valid&&!m.airborne&&s.airborne){m.takeoffAt=vz>0?s.time:-Infinity;m.landedAt=-Infinity;}
 if(valid&&m.airborne&&!s.airborne){m.landedAt=s.time;m.takeoffAt=-Infinity;}
 m.airborne=s.airborne;m.time=s.time;
 let phase:JumpPhase|null=null;
 if(s.airborne){
  if(vz>35)phase=s.time-m.takeoffAt<.065?"push-off":"ascent";
  else if(vz< -35)phase="descent";
  else phase=m.takeoffAt===-Infinity?"descent":"apex";
 }else if(s.time-m.landedAt<.075)phase="landing";
 else if(s.time-m.landedAt<.14)phase="recovery";
 return{memory:m,phase};
}
