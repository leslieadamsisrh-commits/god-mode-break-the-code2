// Presentation reads shared combat state. These phases never advance movement.
export const KINETIC_BRAKE_POSE_SECONDS=.24;
export type KineticBrakeTurn={from:number;to:number};
type KineticActor={
 dash?:number;boostState?:number;brakeState?:number;slide?:number;pinball?:number;
 slideFacing?:number;brakeTurn?:KineticBrakeTurn;aim?:number;
 coverId?:string|null;knock?:number;grounded?:boolean;charging?:boolean;
 fireState?:number;pendingFireUntil?:number;input?:{fire?:boolean};
};

export function kineticPose(actor:KineticActor,dashDuration:number){
 if(actor.coverId||actor.knock||actor.grounded===false||actor.charging||actor.slide||actor.pinball||
    actor.input?.fire||actor.fireState||actor.pendingFireUntil!==undefined)return undefined;
 if(actor.brakeState&&actor.brakeTurn){
  const phase=1-actor.brakeState/KINETIC_BRAKE_POSE_SECONDS;
  const frame=phase<.28?0:phase<.59?1:2;
  const {from,to}=actor.brakeTurn;
  const delta=Math.atan2(Math.sin(to-from),Math.cos(to-from));
  return {kind:"brake" as const,frame,angle:frame===0?from:frame===1?from+delta*.5:to};
 }
 if(actor.dash||actor.boostState){
  const ratio=(actor.dash??0)/dashDuration;
  const frame=ratio>.72?0:ratio>.28?1:2;
  return {kind:"dash" as const,frame,angle:actor.slideFacing??actor.aim??0};
 }
}
export type KineticPose=NonNullable<ReturnType<typeof kineticPose>>;
