// Gamepad haptics are optional: the arena runs normally on platforms that do
// not expose a controller vibration actuator (including some mobile browsers).
type HapticActuator={
  effects?:readonly string[];
  playEffect?:(kind:string,options:{startDelay:number;duration:number;weakMagnitude:number;strongMagnitude:number})=>Promise<unknown>;
  pulse?:(magnitude:number,duration:number)=>Promise<unknown>;
};
type HapticGamepad=Gamepad&{vibrationActuator?:HapticActuator;hapticActuators?:HapticActuator[]};
type RumbleEvent='shot'|'cover'|'impact'|'target'|'targetDown'|'shieldHit'|'shieldBreak';
const patterns:Record<RumbleEvent,{duration:number;weak:number;strong:number;priority:number}>={
  shot:{duration:105,weak:.42,strong:.53,priority:1},
  cover:{duration:150,weak:.43,strong:.78,priority:2},
  impact:{duration:95,weak:.30,strong:.54,priority:2},
  target:{duration:140,weak:.48,strong:.72,priority:3},
  targetDown:{duration:260,weak:.75,strong:1,priority:5},
  shieldHit:{duration:140,weak:.57,strong:.72,priority:3},
  shieldBreak:{duration:300,weak:.9,strong:1,priority:5},
};
let lastAt=0,lastPriority=0;
export function hasRumble(pad:Gamepad|undefined|null){
  const gamepad=pad as HapticGamepad|undefined|null;
  const actuator=gamepad?.vibrationActuator??gamepad?.hapticActuators?.[0];
  return !!actuator&&(!!actuator.pulse||!!actuator.playEffect&&(!actuator.effects||actuator.effects.includes('dual-rumble')));
}
export function rumble(event:RumbleEvent){
  if(typeof navigator==='undefined')return false;
  const pad=navigator.getGamepads?.()?.find(p=>p?.connected) as HapticGamepad|undefined;
  const actuator=pad?.vibrationActuator??pad?.hapticActuators?.[0];
  if(!actuator)return false;
  const effect=patterns[event],now=performance.now();
  // A three-pellet shotgun burst should be one impact, not three restarts.
  if(now-lastAt<55&&effect.priority<=lastPriority)return true;
  lastAt=now;lastPriority=effect.priority;
  try{
    if(actuator.playEffect&&(!actuator.effects||actuator.effects.includes('dual-rumble'))){
      void actuator.playEffect('dual-rumble',{startDelay:0,duration:effect.duration,weakMagnitude:effect.weak,strongMagnitude:effect.strong}).catch(()=>{});
      return true;
    }
    if(actuator.pulse){void actuator.pulse(Math.max(effect.weak,effect.strong),effect.duration).catch(()=>{});return true;}
  }catch{}
  return false;
}
