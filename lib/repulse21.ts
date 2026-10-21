import type {GameState,InputState,ActionOutcome} from './game';

export type RepulseSettings21={range:number;cost:number;cooldown:number};
export const REPULSE_DEFAULT21:Readonly<RepulseSettings21>={range:96,cost:16,cooldown:1.4};
type Cast={impactAt:number;recoverUntil:number;angle:number;resolved:boolean};
type Lab={enabled:boolean;settings:RepulseSettings21;round:number;casts:Map<number,Cast>;ready:Map<number,number>};
// Capability lives only in this process and is registered by LocalCombat.
// Serialized snapshots, input payloads and server config cannot enable it.
const labs=new WeakMap<GameState,Lab>();
export function registerRepulseLab21(s:GameState){
 if(!['solo','practice','bot'].includes(s.mode))throw Error('REPULSE_LOCAL_ONLY');
 labs.set(s,{enabled:false,settings:{...REPULSE_DEFAULT21},round:s.round,casts:new Map(),ready:new Map()});
}
export function configureRepulse21(s:GameState,enabled:boolean,patch:Partial<RepulseSettings21>={}){
 const lab=labs.get(s);if(!lab||!['solo','practice','bot'].includes(s.mode))throw Error('REPULSE_LOCAL_ONLY');
 const limits={range:[60,120],cost:[10,30],cooldown:[1,3]} as const;
 const next={...lab.settings};for(const key of Object.keys(limits) as (keyof RepulseSettings21)[]){
  const value=patch[key];if(value===undefined)continue;
  if(!Number.isFinite(value)||value<limits[key][0]||value>limits[key][1])throw Error('INVALID_REPULSE_'+key.toUpperCase());next[key]=value;
 }
 lab.settings=next;lab.enabled=enabled;lab.casts.clear();
 // Toggling does not reset cooldown, so it cannot bypass deliberate recovery.
 if(!enabled)for(const p of s.players)if(p.selectedPower===5)p.selectedPower=0;
}
export function repulseEnabled21(s:GameState){return !!labs.get(s)?.enabled&&['solo','practice','bot'].includes(s.mode);}
export function repulseView21(s:GameState){const lab=labs.get(s);return lab?{repulseEnabled:repulseEnabled21(s),repulse:{...lab.settings}}:undefined;}
type Hooks={blocked:(from:{x:number;y:number},to:{x:number;y:number})=>boolean;emit:(owner:number,status:ActionOutcome['status'],reason:string)=>void;spend:(owner:number,amount:number)=>boolean};
export function startRepulse21(s:GameState,n:number,hooks:Hooks){
 const lab=labs.get(s),p=s.players[n];if(!repulseEnabled21(s)||!lab||!p)return;
 const reject=(reason:string)=>hooks.emit(n,'rejected',reason);
 if(s.time<(lab.ready.get(n)||0)||lab.casts.has(n)){reject('Repulse recovering');return;}
 if(p.hp<=0||p.knock>0||p.charging||p.shield||p.coverId||p.gripId||p.gripCoverId||p.orbitIds.length||p.meleeCombo||p.gloveHoldStarted!==undefined||p.slide>0||p.dash>0||p.pinball>0||p.exit||p.kickStage!=='none'){reject('Repulse requires a free standing action');return;}
 if(p.battery<lab.settings.cost){reject('Repulse needs battery');return;}
 if(!hooks.spend(n,lab.settings.cost))return;
 lab.ready.set(n,s.time+lab.settings.cooldown);lab.casts.set(n,{impactAt:s.time+.12,recoverUntil:s.time+.34,angle:p.aim,resolved:false});
 p.pendingFireUntil=undefined;p.pendingMelee=undefined;
 hooks.emit(n,'activated','Repulse wind-up; zero damage');
 s.fx.push({id:crypto.randomUUID(),type:'repulse-windup21',x:p.x,y:p.y,angle:p.aim,life:.12,owner:n,strength:lab.settings.range});
}
export function repulseInput21(s:GameState,n:number,input:InputState):InputState{
 if(!repulseEnabled21(s)||!labs.get(s)?.casts.has(n))return input;
 // Preserve the raw X edge so holding X cannot auto-recast after recovery.
 return {...input,fire:false,melee:false,heavy:false,grip:false,cover:false,orbit:false,pinball:false,powerCycle:false,powerup:false,throwMatter:false,launchOrbit:false,slow:false,slide:false};
}
export function stepRepulse21(s:GameState,hooks:Hooks){
 const lab=labs.get(s);if(!lab||!repulseEnabled21(s))return;
 if(lab.round!==s.round){lab.round=s.round;lab.casts.clear();lab.ready.clear();return;}
 for(const [n,cast] of lab.casts){
  const p=s.players[n];
  if(!p||p.hp<=0||p.knock>0||p.charging||p.input.shield){lab.casts.delete(n);hooks.emit(n,'cancelled','Repulse interrupted');continue;}
  if(!cast.resolved&&s.time>=cast.impactAt){
   cast.resolved=true;let contacts=0;
   const inCone=(q:{x:number;y:number})=>{const dx=q.x-p.x,dy=q.y-p.y,d=Math.hypot(dx,dy);return d<=lab.settings.range&&d>0&&(dx*Math.cos(cast.angle)+dy*Math.sin(cast.angle))/d>=Math.cos(Math.PI/3)&&!hooks.blocked(p,q);};
   for(const [index,target] of s.players.entries())if(index!==n&&target.hp>0&&inCone(target)){
    if(target.shield&&target.battery>0){hooks.emit(n,'contact','Repulse blocked by shield');continue;}
    // No hit stun, damage, detach, or action cancellation. Ordinary movement and
    // collision resolve the impulse; existing reactions cannot be prolonged.
    if(target.knock>0||target.coverId)continue;
    const angle=Math.atan2(target.y-p.y,target.x-p.x);target.vx+=Math.cos(angle)*240;target.vy+=Math.sin(angle)*240;contacts++;
   }
   for(const m of s.matter)if(m.life>0&&m.heldBy===null&&m.orbitBy===null&&m.throwOwner===undefined&&Math.hypot(m.vx,m.vy)<140&&inCone(m)){
    const angle=Math.atan2(m.y-p.y,m.x-p.x);m.vx=Math.cos(angle)*120;m.vy=Math.sin(angle)*120;contacts++;
   }
   // Anchored and loose cover, bullets, and floor matter ledgers are untouched.
   s.fx.push({id:crypto.randomUUID(),type:'repulse21',x:p.x,y:p.y,angle:cast.angle,life:.22,owner:n,strength:lab.settings.range});
   hooks.emit(n,contacts?'contact':'missed',contacts?'Repulse displaced eligible targets':'No unblocked eligible target');
  }
  if(s.time>=cast.recoverUntil){lab.casts.delete(n);hooks.emit(n,'recovered','Repulse recovery complete');}
 }
}
