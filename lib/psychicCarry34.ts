// Deterministic bounded local carry planning. No cosmetic collision bypass.
export type Pose34={x:number;y:number;z:number;a:number};
export const CARRY34={distance:100,gap:3,maxLift:96,lateral:48,lookAhead:.10,speed:550,turn:3.2,response:12,step:2};
export const wrap34=(a:number)=>Math.atan2(Math.sin(a),Math.cos(a));
export function swept34(from:Pose34,to:Pose34,radius:number,blocked:(p:Pose34)=>boolean){
 const da=wrap34(to.a-from.a),length=Math.hypot(to.x-from.x,to.y-from.y,to.z-from.z)+Math.abs(da)*radius,steps=Math.max(1,Math.ceil(length/CARRY34.step));if(steps>256)return false;
 for(let k=1;k<=steps;k++){const t=k/steps;if(blocked({x:from.x+(to.x-from.x)*t,y:from.y+(to.y-from.y)*t,z:from.z+(to.z-from.z)*t,a:from.a+da*t}))return false;}return true;
}
export function planCarry34(from:Pose34,desired:Pose34,radius:number,blocked:(p:Pose34)=>boolean,lifts:number[],side:number){
 if(!blocked(desired)&&swept34(from,desired,radius,blocked))return{target:desired,mode:'forward',side};
 for(const z of [...new Set(lifts)].sort((a,b)=>a-b)){if(z<desired.z||z>desired.z+CARRY34.maxLift)continue;const up={...from,z:Math.max(from.z,z)},over={...desired,z};if(!blocked(over)&&swept34(from,up,radius,blocked)&&swept34(up,over,radius,blocked))return{target:Math.abs(from.z-up.z)>1?up:over,mode:'lift',side};}
 const nx=-Math.sin(desired.a-Math.PI/2),ny=Math.cos(desired.a-Math.PI/2);
 for(const sign of [side||1,-(side||1)])for(const offset of [24,48]){const current=(from.x-desired.x)*nx+(from.y-desired.y)*ny,delta=offset*sign-current,aside={...from,x:from.x+nx*delta,y:from.y+ny*delta},goal={...desired,x:desired.x+nx*offset*sign,y:desired.y+ny*offset*sign};if(!blocked(goal)&&swept34(from,aside,radius,blocked)&&swept34(aside,goal,radius,blocked))return{target:Math.hypot(aside.x-from.x,aside.y-from.y)>1?aside:goal,mode:'slide',side:sign};}
 // Rotation alone or axis slides can free a corner without changing ownership.
 for(const target of [{...desired,x:from.x},{...desired,y:from.y},{...from,a:desired.a}])if(!blocked(target)&&swept34(from,target,radius,blocked))return{target,mode:'adjust',side};
 return{target:from,mode:'blocked',side};
}
export function advanceCarry34(from:Pose34,to:Pose34,radius:number,dt:number,blocked:(p:Pose34)=>boolean){
 const distance=Math.hypot(to.x-from.x,to.y-from.y,to.z-from.z),f=distance?Math.min(1,1-Math.exp(-CARRY34.response*dt),CARRY34.speed*dt/distance):1,da=wrap34(to.a-from.a),a=from.a+Math.max(-CARRY34.turn*dt,Math.min(CARRY34.turn*dt,da));
 const next={x:from.x+(to.x-from.x)*f,y:from.y+(to.y-from.y)*f,z:from.z+(to.z-from.z)*f,a};return swept34(from,next,radius,blocked)?next:from;
}
