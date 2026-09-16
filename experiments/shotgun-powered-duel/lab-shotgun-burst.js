// Explicit experiment tuning: same 18 actor / 24 cover maximum per press as v57.
// Battery integration is pending verified original resource rules.
export const BURST_RULES=Object.freeze({shots:3,spacing:.10,cycle:.48,damage:6,coverDamage:8,energyPerShot:null});
export function startShotgunBurst(p,now,id){
 if(p.pendingBurst||now<p.fireAt||p.hp<=0)return false;
 p.pendingBurst={id,startedAt:now,next:0};p.fireAt=now+BURST_RULES.cycle;return true;
}
export function cancelShotgunBurst(p,reason){if(p.pendingBurst){p.lastBurstCancellation=reason;p.pendingBurst=null;}}
export function advanceShotgunBurst(p,now,emit){
 const b=p.pendingBurst;if(!b)return;
 if(p.hp<=0||p.weapon!=='shotgun'||p.charging||p.incompatiblePower){cancelShotgunBurst(p,'state-change');return;}
 while(b.next<BURST_RULES.shots&&now+1e-8>=b.startedAt+b.next*BURST_RULES.spacing){
  const cost=BURST_RULES.energyPerShot;
  if(cost!==null&&(!Number.isFinite(p.battery)||p.battery<cost)){cancelShotgunBurst(p,'energy-depleted');return;}
  if(cost!==null)p.battery-=cost;
  const index=b.next++;
  emit({burstId:b.id,subShot:index,damage:BURST_RULES.damage,coverDamage:BURST_RULES.coverDamage,scheduledAt:b.startedAt+index*BURST_RULES.spacing});
 }
 if(b.next===BURST_RULES.shots)p.pendingBurst=null;
}
