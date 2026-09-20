'use strict';
// Vendor movement/action modules are exact 08K bytes. Only orchestration is new.
const Core=require('../public/vendor/core.js');
const Stance=require('../public/vendor/stance-registration.js');
const Gate=require('../public/slide-gate.js');
const NEUTRAL=Object.freeze({x:0,y:0,aim:0,aimHeld:false,fire:false,slide:false,wrap:false,attach:false});
class InputMailbox{
 constructor(){this.sequence=-1;this.lastAt=0;this.value={...NEUTRAL};this.held={slide:false,wrap:false,attach:false};this.edges={slide:false,wrap:false,attach:false};this.needsNeutral=true;}
 accept(v,now){
  if(!v||Array.isArray(v)||!Number.isSafeInteger(v.seq)||v.seq<=this.sequence)return false;
  if(Object.keys(v).some(k=>!['seq','x','y','aim','slide','wrap','attach','fire','aimHeld'].includes(k)))return false;
  if(!['x','y','aim'].every(k=>typeof v[k]==='number'&&Number.isFinite(v[k]))||Math.abs(v.x)>1||Math.abs(v.y)>1||Math.abs(v.aim)>100)return false;
  if(!['slide','wrap','attach','fire','aimHeld'].every(k=>typeof v[k]==='boolean'))return false;
  this.sequence=v.seq;this.lastAt=now;let next={...v};delete next.seq;
  if(this.needsNeutral){if(['slide','wrap','attach','fire','aimHeld'].every(k=>!v[k]))this.needsNeutral=false;else next={...NEUTRAL,aim:v.aim};}
  const m=Math.hypot(next.x,next.y);if(m>1){next.x/=m;next.y/=m;}
  for(const k of ['slide','wrap','attach']){if(next[k]&&!this.held[k])this.edges[k]=true;this.held[k]=next[k];}
  this.value=next;return true;
 }
 take(now){
  if(now-this.lastAt>500){this.value={...NEUTRAL,aim:this.value.aim};this.edges={slide:false,wrap:false,attach:false};this.held={slide:false,wrap:false,attach:false};this.needsNeutral=true;}
  const out={...this.value,...this.edges};this.edges={slide:false,wrap:false,attach:false};return out;
 }
}
class Duel extends Stance.World{
 constructor({duration=180}={}){super({start:'approach',mode:'none'});this.duration=[120,180,300].includes(duration)?duration:180;this.round=0;this.phase='lobby';this.scores=[0,0];this.winner=null;this.players=[Core.actor(-265,245),Core.actor(265,245)];this.players[1].aim=Math.PI;this.currentSlot=null;this.p=this.players[0];this.stats={rejectedSlides:0};}
 emit(type,data={}){super.emit(type,{...data,player:this.currentSlot??null});}
 begin(){
  this.round++;this.time=0;this.tick=0;this.events=[];this.shots=[];this.effects=[];this.shotId=0;this.metrics={shots:0,hits:0,blocked:0,contacts:0};this.stats={rejectedSlides:0};
  this.players=[Core.actor(-265,245),Core.actor(265,245)];this.players[1].aim=Math.PI;this.players[1].lowerAim=Math.PI;this.phase='playing';this.winner=null;this.p=this.players[0];this.emit('round_start',{round:this.round});
 }
 firePlayer(slot){
  const p=this.players[slot];this.p=p;this.currentSlot=slot;
  if(this.time-p.lastShot<Core.TUNING.shotCycle-1e-8)return false;
  if(Core.supported(p)){p.pose=2;p.raise=1;}
  const origin=this.socket(p),breech=this.socket(p,'breech');p.lastShot=this.time;
  if(this.covers.some(c=>Core.segmentBox(breech,origin,c,1)!==null)){this.metrics.blocked++;this.emit('blocked_muzzle',{x:origin.x,y:origin.y});return false;}
  const id=++this.shotId;for(let j=0;j<7;j++){const a=p.aim+(j-3)*.04;this.shots.push({id,owner:slot,x:origin.x,y:origin.y,z:origin.z,vx:Math.cos(a)*780,vy:Math.sin(a)*780,life:.45});}
  this.effects.push({...origin,type:'muzzle',life:.1,owner:slot});p.recoil=.16;globalThis.JadeAction.shot(p,Core.supported(p),(t,d)=>this.emit(t,d));this.metrics.shots++;this.emit('shot',{id,pellets:7,origin,pose:'K0'+(p.pose+1)});return true;
 }
 stepShots(dt){
  for(const s of this.shots){const a={x:s.x,y:s.y,z:s.z},b={x:s.x+s.vx*dt,y:s.y+s.vy*dt,z:s.z};let first=Infinity,hit=null;
   for(const c of this.covers){const t=Core.segmentBox(a,b,c,1.5);if(t!==null&&t<first){first=t;hit={cover:c.id};}}
   const opponent=this.players[1-s.owner];if(opponent.hp>0){const t=Core.segmentActor(a,b,opponent,opponent.cover?165:185,20);if(t!==null&&t<first){first=t;hit={actor:1-s.owner};}}
   this.currentSlot=s.owner;
   if(hit){s.x=a.x+(b.x-a.x)*first;s.y=a.y+(b.y-a.y)*first;s.life=0;this.effects.push({x:s.x,y:s.y,z:s.z,type:'impact',life:.12,owner:s.owner});
    if(hit.actor!==undefined){const victim=this.players[hit.actor];victim.hp=Math.max(0,victim.hp-18);const hm=Math.hypot(s.vx,s.vy)||1;victim.hitReact=.16;victim.hitDx=s.vx/hm;victim.hitDy=s.vy/hm;this.metrics.hits++;this.emit('hit',{shot:s.id,target:hit.actor,damage:18});}else this.emit('cover_blocks_shot',{shot:s.id,cover:hit.cover});
   }else{s.x=b.x;s.y=b.y;s.life-=dt;}
  }
  this.shots=this.shots.filter(s=>s.life>0);this.effects.forEach(e=>e.life-=dt);this.effects=this.effects.filter(e=>e.life>0);
 }
 advance(inputs,dt=Core.DT){
  if(this.phase!=='playing')return;
  if(dt!==Core.DT)throw Error('Authoritative match uses fixed 1/60 steps');
  this.tick++;this.time+=dt;
  const accepted=[];
  for(let i=0;i<2;i++){this.currentSlot=i;this.p=this.players[i];const source={...NEUTRAL,aim:this.p.aim,...inputs[i]};const q=Gate.evaluate(this.p,source);accepted.push(q.input);
   if(q.blocked){this.stats.rejectedSlides++;this.emit('slide_rejected',{reason:q.reason});}
   const input=q.input;this.p.aim=Core.wrap(input.aim);this.wrapPressed=!!input.wrap;
   this.movement(input,dt);this.action(input,dt);this.wrapPressed=false;
  }
  for(let i=0;i<2;i++)if(accepted[i].fire)this.firePlayer(i);
  this.stepShots(dt);for(const q of this.players)q.hitReact=Math.max(0,(q.hitReact||0)-dt);this.currentSlot=null;this.p=this.players[0];
  if(this.players.some(p=>p.hp<=0)||this.time>=this.duration){const [a,b]=this.players;this.winner=a.hp===b.hp?null:a.hp>b.hp?0:1;this.phase='finished';if(this.winner!==null)this.scores[this.winner]++;this.emit('round_end',{winner:this.winner});}
 }
 snapshot(){return JSON.parse(JSON.stringify({build:'V12-08L',round:this.round,phase:this.phase,tick:this.tick,time:this.time,duration:this.duration,winner:this.winner,scores:this.scores,players:this.players,covers:this.covers,shots:this.shots,effects:this.effects,events:this.events.slice(-120),metrics:this.metrics,stats:this.stats}));}
}
module.exports={Duel,InputMailbox,NEUTRAL};
