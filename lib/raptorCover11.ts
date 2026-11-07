/** Explicit cover presentation state. The authority selects it before sockets/fire. */
export type CoverState11='catch'|'hold'|'shuffle'|'brace'|'expose'|'fire'|'retract'|'drive'|'escape';
// Compatibility name for the existing Raptor adapter; authority is shared.
export type RaptorCoverState11=CoverState11;
export type CoverStateActor11={coverId?:string|null;coverMode?:string|null;coverDrive11?:boolean;coverSpeed?:number;contact?:number;returnToCover?:number;fireState?:number;exit?:unknown;kickStage?:string;coverLock?:number;input?:{coverAim?:boolean}};
export function coverState11(p:CoverStateActor11,time:number,canExpose:boolean):RaptorCoverState11|undefined{
 if(!p.coverId)return p.exit||p.kickStage&&p.kickStage!=='none'?'escape':undefined;
 if(p.coverDrive11)return 'drive';
 if(p.input?.coverAim&&canExpose)return (p.fireState||0)>0?'fire':'expose';
 if((p.contact||0)>time)return 'catch';
 // Deliberate movement wins over the cosmetic retract timer.
 if(Math.abs(p.coverSpeed||0)>2)return 'shuffle';
 if((p.returnToCover||0)>0)return 'retract';
 return p.coverMode==='braced'?'brace':'hold';
}

/** Jade's approved atlases adapt the same authority states as Raptor's poses. */
export function jadeCoverFrame11(p:CoverStateActor11 & {coverState11?:CoverState11;recoil?:number},time:number,total:number,lateral:number|null):number{
 const state=p.coverState11??coverState11(p,time,!!p.input?.coverAim);
 const extended=total===12;
 if(!extended&&total!==6)return 0;
 const pose=extended?{contact:[0,1,2],brace:4,peek:7,fire:8,retract:9}:{contact:[0,1],brace:1,peek:2,fire:3,retract:4};
 if(state==='expose'||state==='fire')return state==='fire'||(p.recoil||0)>0?pose.fire:pose.peek;
 if(state==='catch'){
  const elapsed=Math.max(0,.22-((p.contact||0)-time));
  return pose.contact[Math.min(pose.contact.length-1,Math.floor(elapsed/.22*pose.contact.length))];
 }
 if(state==='shuffle'||state==='drive')return lateral??pose.brace;
 if(state==='retract')return pose.retract;
 return pose.brace;
}

