/** Explicit cover presentation state. The authority selects it before sockets/fire. */
export type RaptorCoverState11='catch'|'hold'|'shuffle'|'brace'|'expose'|'fire'|'retract'|'drive'|'escape';
export type CoverStateActor11={coverId?:string|null;coverMode?:string|null;coverDrive11?:boolean;coverSpeed?:number;contact?:number;returnToCover?:number;fireState?:number;exit?:unknown;kickStage?:string;coverLock?:number;input?:{coverAim?:boolean}};
export function coverState11(p:CoverStateActor11,time:number,canExpose:boolean):RaptorCoverState11|undefined{
 if(!p.coverId)return p.exit||p.kickStage&&p.kickStage!=='none'?'escape':undefined;
 if(p.coverDrive11)return 'drive';
 if(p.input?.coverAim&&canExpose)return (p.fireState||0)>0?'fire':'expose';
 if((p.contact||0)>time)return 'catch';
 if((p.returnToCover||0)>0)return 'retract';
 if(Math.abs(p.coverSpeed||0)>2)return 'shuffle';
 return p.coverMode==='braced'?'brace':'hold';
}
