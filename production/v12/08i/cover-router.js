/* 08I presentation-only cover routing. Never changes actor, shots, inputs or movement.
 * Observe once after a simulation step. select() is pure and safe to call repeatedly.
 */
(function(root){
'use strict';
const TIMES=Object.freeze({contact:.18,fire:.16,retract:.12,lateralStep:18});
const finite=v=>typeof v==='number'&&Number.isFinite(v);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function validateCatalog(catalog,assets){
 if(!catalog?.families)throw Error('Cover role catalog missing');
 for(let d=0;d<24;d++){
  const key='cover:'+d,m=catalog.families[key],a=assets.recoveredAtlases[key];
  if(!m||!a||m.direction!==d||m.totalFrames!==a.frames||m.runtimeFile!==a.file||m.runtimeSha256!==a.sha256||m.sourceRuntimeSha256!==a.sourceSha256)throw Error('Cover catalog/asset mismatch: '+key);
  if(m.grid[0]!==a.cols||m.grid[1]!==a.rows||m.sourceCell.some(v=>!finite(v)||v<=0))throw Error('Invalid cover grid: '+key);
  const anchorOk=p=>Array.isArray(p)&&p.length===2&&p.every(finite);
  if(!anchorOk(m.anchor)||m.frameAnchors&&(m.frameAnchors.length!==m.totalFrames||!m.frameAnchors.every(anchorOk)))throw Error('Invalid cover anchor: '+key);
  for(const role of ['contact','lateral']){if(!Array.isArray(m.roles[role]))throw Error('Missing role array: '+key+'/'+role);}
  const slots=[...m.roles.contact,...m.roles.lateral,...['brace','peek','fire','return','kick','recovery'].map(k=>m.roles[k])];
  if(!m.roles.contact.length||slots.some(n=>!Number.isInteger(n)||n<0||n>=m.totalFrames))throw Error('Invalid role index: '+key);
 }
 return true;
}
function keyOf(p){return p.cover?p.cover.id+'/'+p.cover.face:null;}
function initial(p,world){return{tick:world.tick,time:world.time,x:p.x,y:p.y,context:keyOf(p),contactAt:-Infinity,shotAt:-Infinity,returnUntil:-Infinity,presented:false,peek:false,moved:0,lateralDistance:0,shotsObserved:0};}
class Tracker{
 constructor(){this.states=new WeakMap();}
 reset(world){this.states=new WeakMap();this.states.set(world.p,initial(world.p,world));}
 observe(world){
  const p=world.p;let s=this.states.get(p);if(!s){s=initial(p,world);s.tick=world.tick-1;this.states.set(p,s);}
  if(s.tick===world.tick)return;
  const current=keyOf(p),changed=current!==s.context;
  if(changed){s.contactAt=-Infinity;s.shotAt=-Infinity;s.returnUntil=-Infinity;s.presented=false;s.lateralDistance=0;}
  s.moved=changed?0:Math.hypot(p.x-s.x,p.y-s.y);
  if(current&&s.moved>.001)s.lateralDistance+=s.moved;
  // Only successful authoritative shots. A blocked_muzzle event is NOT a shot.
  for(const e of world.events){if(e.tick<=s.tick)continue;
   if(e.type==='cover_contact'&&current&&e.cover===p.cover.id){s.contactAt=e.t;}
   if(e.type==='shot'&&!e.enemy&&current){s.shotAt=e.t;s.shotsObserved++;}
  }
  s.peek=!!(current&&p.cover.edge&&p.aimHeld&&!p.cornerTravel);
  const presented=s.peek||(current&&world.time-s.shotAt<TIMES.fire-1e-8);
  if(s.presented&&!presented&&current)s.returnUntil=world.time+TIMES.retract;
  if(presented)s.returnUntil=-Infinity;
  s.presented=!!presented;s.context=current;s.x=p.x;s.y=p.y;s.time=world.time;s.tick=world.tick;
 }
 get(p){const s=this.states.get(p);return s?{...s}:null;}
 select(p,now,meta,cell){return select(p,now,meta,cell,this.get(p));}
}
function select(p,now,meta,cell,state=null){
 if(!meta?.roles||!finite(cell)||cell<=0)throw Error('Invalid cover selection input');
 const r=meta.roles,s=state||{},hasContext=!!p.cover;
 let role='brace',frame=r.brace,missing=null;
 if(p.kick>0&&!hasContext&&!p.cornerTravel){role='kick';frame=r.kick;}
 else if(p.cornerTravel){role='wrap-brace-proxy';missing='Dedicated wrap drawings not available';}
 else if(!hasContext){return null;}
 else if(now-(s.shotAt??-Infinity)<TIMES.fire-1e-8){role='fire';frame=r.fire;}
 else if(p.impact>0){role='contact';const elapsed=finite(s.contactAt)?now-s.contactAt:TIMES.contact-p.impact;frame=r.contact[clamp(Math.floor(Math.max(0,elapsed)/TIMES.contact*r.contact.length),0,r.contact.length-1)];}
 else if(s.peek){role='peek';frame=r.peek;}
 else if(now<(s.returnUntil??-Infinity)-1e-8){role='return';frame=r.return;}
 else if((s.moved||0)>.002){
  if(r.lateral.length){role='lateral';frame=r.lateral[Math.floor((s.lateralDistance||0)/TIMES.lateralStep)%r.lateral.length];}
  else{role='brace';missing='No lateral frames for this view; brace held during movement';}
 }
 if(!Number.isInteger(frame)||frame<0||frame>=meta.totalFrames)throw Error('Out-of-range cover slot');
 const source=meta.frameAnchors?.[frame]||meta.anchor;
 return{frame,role,anchor:[source[0]*cell/meta.sourceCell[0],source[1]*cell/meta.sourceCell[1]],sourceAnchor:source.slice(),anchorBasis:meta.frameAnchors?'archived per-frame anchor':'archived family anchor',roleSource:meta.roleSource,missing};
}
const api={TIMES,Tracker,select,validateCatalog};root.JadeCoverRouter=api;if(typeof module==='object')module.exports=api;
})(typeof globalThis==='object'?globalThis:this);
