import type {RaptorSocketRegistration} from "./raptorSocket";

type Side = "left" | "right";
export type AttachedCoverPose = `${"jade" | "raptor"}-${Side}` | `jade-peek-${Side}`;
type Registration = RaptorSocketRegistration & {
 supportFoot: readonly number[];
 barrels: readonly [readonly number[], readonly number[]];
};

// Cell coordinates match the four 512px sprites. The first barrel is the shotgun origin.
export const ATTACHED_COVER_POSES: Record<AttachedCoverPose, Registration> = {
 "jade-left": {anchor:[238,408],supportFoot:[141,407],muzzle:[41,196],barrels:[[41,196],[41,209]],drawScale:.96},
 "jade-right": {anchor:[277,392],supportFoot:[325,393],muzzle:[438,177],barrels:[[438,177],[438,188]],drawScale:.96},
 "jade-peek-left": {anchor:[256,448],supportFoot:[208,449],muzzle:[118,278],barrels:[[118,278],[119,286]],drawScale:1.26},
 "jade-peek-right": {anchor:[299,440],supportFoot:[135,443],muzzle:[457,156],barrels:[[457,156],[455,170]],drawScale:.83},
 "raptor-left": {anchor:[253,384],supportFoot:[167,387],muzzle:[71,239],barrels:[[71,239],[76,251]],drawScale:1.15},
 "raptor-right": {anchor:[257,392],supportFoot:[325,394],muzzle:[503,236],barrels:[[503,236],[498,252]],drawScale:1.11},
};

export function selectAttachedCoverPose(character:"jade"|"raptor"|undefined,aim:number,vx:number,vy:number):AttachedCoverPose|undefined{
 const x=Math.cos(aim),y=Math.sin(aim);
 if(Math.abs(y)>.38||x*vx+y*vy>=-2)return;
 return `${character??"jade"}-${x<0?"left":"right"}`;
}

export function attachedCoverPath(pose:AttachedCoverPose){
 return `/assets/attached-cover/${pose}.webp`;
}
