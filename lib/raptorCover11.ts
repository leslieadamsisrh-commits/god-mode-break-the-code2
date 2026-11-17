/** Explicit cover presentation state. The authority selects it before sockets/fire. */
export type CoverState11='catch'|'hold'|'shuffle'|'brace'|'expose'|'fire'|'retract'|'drive'|'escape';
// Compatibility name for the existing Raptor adapter; authority is shared.
export type RaptorCoverState11=CoverState11;
export type CoverStateActor11={coverId?:string|null;coverMode?:string|null;coverDrive11?:boolean;coverSpeed?:number;contact?:number;returnToCover?:number;fireState?:number;exit?:unknown;kickStage?:string;coverLock?:number;input?:{coverAim?:boolean}};
export function coverState11(p:CoverStateActor11,time:number,canExpose:boolean,aiming=p.input?.coverAim):RaptorCoverState11|undefined{
 if(!p.coverId)return p.exit||p.kickStage&&p.kickStage!=='none'?'escape':undefined;
 if(p.coverDrive11)return 'drive';
 if(aiming&&canExpose)return (p.fireState||0)>0?'fire':'expose';
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



/** Presentation follows accepted exposure, never a blocked LT request or stale recoil. */
export function coverExposed13(p:{coverState11?:CoverState11;peek?:boolean}):boolean{
 return p.coverState11?p.coverState11==='expose'||p.coverState11==='fire':!!p.peek;
}

export type CoverStride13={phase:number;time:number;x:number;y:number;sign:number;coverId:string|null};
/** Measured travel freezes at rest; stale samples and teleports never advance feet. */
export function coverStride13(previous:CoverStride13|undefined,p:{x:number;y:number;coverId?:string|null;coverSpeed?:number},time:number):CoverStride13{
 const sign=Math.sign(p.coverSpeed||0),dt=previous?time-previous.time:0;
 const same=previous&&previous.coverId===p.coverId&&dt>=0&&dt<=.25;
 let phase=same?previous.phase:0;
 if(same&&sign&&Math.abs(p.coverSpeed||0)>2){
  const distance=Math.hypot(p.x-previous.x,p.y-previous.y);
  if(distance<=Math.max(12,Math.abs(p.coverSpeed||0)*dt*2))phase+=distance/18;
 }
 return{phase,time,x:p.x,y:p.y,sign:sign||previous?.sign||1,coverId:p.coverId??null};
}
