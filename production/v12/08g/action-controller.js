/* One-view presentation controller. No movement, damage, input delay or projectile creation here. */
(function(root){
'use strict';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const PHASES=Object.freeze({raise:.18,recoil:.16,retract:.18});
function transition(p,label,emit){
 if(p.action!==label){const old=p.action;p.action=label;p.actionTime=0;emit('action',{from:old,to:label,pose:'K0'+(p.pose+1)});}
}
function pose(p,index,emit){
 const old=p.pose;p.pose=index;
 if(old!==index)emit('pose_key',{from:'K0'+(old+1),to:'K0'+(index+1),raise:+p.raise.toFixed(5)});
}
function interrupt(p,reason,emit){
 const busy=p.raise>0||p.recoil>0;
 p.raise=0;p.recoil=0;pose(p,0,emit);transition(p,'RECOVERED MOTION',emit);
 if(busy)emit('action_interrupted',{reason});
}
function update(p,input,dt,isSupported,emit){
 if(!Number.isFinite(dt)||dt<=0)throw new Error('Action step must be finite and positive');
 p.actionTime+=dt;p.aimHeld=!!input.aimHeld;
 if(!isSupported){interrupt(p,'unsupported-view-or-exit',emit);return;}
 p.recoil=Math.max(0,p.recoil-dt);
 const demand=!!input.aimHeld||!!input.fire||p.recoil>0;
 p.raise=clamp(p.raise+(demand?dt/PHASES.raise:-dt/PHASES.retract),0,1);
 pose(p,p.raise<.2?0:p.raise<.72?1:2,emit);
 transition(p,p.recoil>0?'RECOIL (AIM KEY)':demand?(p.raise>=1?'AIM':'RAISE'):p.raise>0?'RETRACT (KEYS)':'LOW READY',emit);
}
function shot(p,isSupported,emit){
 if(!isSupported)return;
 p.raise=1;p.recoil=PHASES.recoil;pose(p,2,emit);
 // Update the action on the shot tick, not one tick later. This does not create a second shot.
 transition(p,'RECOIL (AIM KEY)',emit);
 emit('recoil_started',{remaining:p.recoil,pose:'K03',art:'held-key; drawn recoil still missing'});
}
function visual(p,studyEnabled){
 let id='K0'+(p.pose+1),file='assets/final/'+id+'.png';
 let kind='APPROVED_SOURCE_POSE',angle=0;
 if(studyEnabled&&p.pose===1){
  const sample=clamp(Math.floor((p.raise-.2)/(.52/4))+1,1,4);
  id='K02-lift-'+sample;file='assets/study/'+id+'.png';kind='SOURCE_PIXEL_STUDY';angle=-1.5*sample;
 }
 return{id,file,kind,angle,drawnNew:false};
}
const api={PHASES,update,shot,interrupt,visual};
root.JadeAction=api;if(typeof module==='object')module.exports=api;
})(typeof globalThis==='object'?globalThis:this);
