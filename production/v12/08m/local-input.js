/* Device routing only. No position, damage, animation, or physics modifications. */
(function(root){
'use strict';
const neutral=aim=>({x:0,y:0,aim,aimHeld:false,fire:false,slide:false,wrap:false,attach:false});
function axis(value){return Number.isFinite(value)?Math.max(-1,Math.min(1,value)):0;}
function radial(x,y){x=axis(x);y=axis(y);const m=Math.hypot(x,y);if(m<=.18)return {x:0,y:0};const n=Math.min(1,(m-.18)/.82);return{x:x/m*n,y:y/m*n};}
function fromPad(pad,lastAim=0){
 if(!pad||pad.mapping!=='standard'||pad.connected===false)return neutral(lastAim);
 const move=radial(pad.axes[0],pad.axes[1]),aim=radial(pad.axes[2],pad.axes[3]);
 const down=i=>!!pad.buttons[i]?.pressed;
 return{...move,aim:Math.hypot(aim.x,aim.y)>.01?Math.atan2(aim.y,aim.x):lastAim,aimHeld:down(6),fire:down(7),slide:down(0),wrap:down(1),attach:down(2)};
}
class DeviceRouter{
 constructor(){this.mode='keyboard-pad';this.bindings=[null,null];}
 bind(pads,mode=this.mode,swap=false){
  if(!['keyboard-pad','two-pads'].includes(mode))throw Error('Unknown local control mode');
  const available=pads.filter(p=>p&&p.mapping==='standard'&&p.connected!==false).sort((a,b)=>a.index-b.index);
  if(swap)available.reverse();this.mode=mode;
  this.bindings=mode==='keyboard-pad'?[null,available[0]?.index??null]:[available[0]?.index??null,available[1]?.index??null];
  return this.bindings.slice();
 }
 sample(pads,keyboard,lastAims){
  const slots=this.bindings.map((id,slot)=>slot===0&&this.mode==='keyboard-pad'?{...keyboard}:fromPad(pads.find(p=>p&&p.index===id),lastAims[slot]));
  const missing=this.bindings.map((id,slot)=>(slot===0&&this.mode==='keyboard-pad')?false:id===null||!pads.some(p=>p&&p.index===id&&p.connected!==false));
  return {slots,missing};
 }
}
root.JadeLocalInput={neutral,radial,fromPad,DeviceRouter};
if(typeof module==='object')module.exports=root.JadeLocalInput;
})(globalThis);
