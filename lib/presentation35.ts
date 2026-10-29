import {swept34,wrap34} from './psychicCarry34';
import type {Cover} from './game';
// Interpolate only a stable physical identity. Shape commits/removal are discrete.
export function interpolateCover35(from:Cover,to:Cover,t:number,blocked:(c:Cover)=>boolean):Cover{
 if(from.hp<=0||to.hp<=0||from.w!==to.w||from.h!==to.h||from.height27j!==to.height27j||from.fracture32?.revision!==to.fracture32?.revision)return from;
 if(from.x===to.x&&from.y===to.y&&from.z===to.z&&from.a===to.a&&from.hover===to.hover)return from;
 const a={x:from.x,y:from.y,z:from.z||0,a:from.a||0};
 const b={x:from.x+(to.x-from.x)*t,y:from.y+(to.y-from.y)*t,z:(from.z||0)+((to.z||0)-(from.z||0))*t,a:a.a+wrap34((to.a||0)-a.a)*t};
 const next={...from,...b,hover:(from.hover||0)+((to.hover||0)-(from.hover||0))*t};
 const radius=Math.hypot(from.w,from.h)/2;
 if(!swept34(a,b,radius,p=>blocked({...next,...p})))return from;
 return next;
}
