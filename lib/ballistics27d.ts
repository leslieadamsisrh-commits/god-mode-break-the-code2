import {ATTACHED_COVER_POSES,type AttachedCoverPose} from "./attachedCoverPose";
import {prisms33,rayPoly32,type Fracture32} from './fracture32';
import {arenaPoint46,arenaInverse46,arenaJacobian46} from './bayBridgePresentation';
import {raptorBarrelSocket,type RaptorSocketRegistration} from './raptorSocket';
import raptorInventory from '../public/assets/raptor-v2/manifest.json';
export type BarrelActor27d={attachedCoverPose?:AttachedCoverPose;x:number;y:number;z?:number;gunFacing?:number;aim?:number;slide?:number;character?:'jade'|'raptor';raptorFrame?:{key:string}};
export type BarrelSocket27d={x:number;y:number;z:number;dir:number;raptorAligned?:boolean;attachedAligned?:boolean};
// Upright sprite registration: 125px cell, feet .88, barrel .88/.37.
// Convert the socket into the floor projection rather than adding sprite pixels to world XY.
export function barrelSocket27d(p:BarrelActor27d,scale=.82):BarrelSocket27d{
 if(p.attachedCoverPose){
  const socket=raptorBarrelSocket(p,ATTACHED_COVER_POSES[p.attachedCoverPose],scale);
  if(socket)return{x:socket.x,y:socket.y,z:socket.z,dir:socket.dir,attachedAligned:true};
 }
 if(p.character==='raptor'&&p.raptorFrame){
  const record=(raptorInventory.frames as unknown as Record<string,RaptorSocketRegistration|undefined>)[p.raptorFrame.key];
  const socket=raptorBarrelSocket(p,record,scale);
  if(socket)return{x:socket.x,y:socket.y,z:socket.z,dir:socket.dir,raptorAligned:true};
 }
 // Missing Raptor authoring retains the legacy path, without claiming alignment.
 const a=p.gunFacing??p.aim??0,j=arenaJacobian46(p.x,p.y),dx=j.x*Math.cos(a)+j.xy*Math.sin(a),dy=j.y*Math.sin(a),angle=Math.atan2(dy,dx),floor=arenaPoint46(p.x,p.y),unit=1.536*.64;
 const offsetX=Math.cos(angle)*125*.38*scale,offsetY=Math.sin(angle)*14*scale;
 const root=arenaInverse46(floor.x+offsetX*unit,floor.y+offsetY*unit);
 return {...root,z:(p.z||0)+125*(.88-.37)*scale*(p.slide&&p.slide>0?.58:1),dir:((Math.round(a/(Math.PI*2)*24)%24)+24)%24};
}
export function cylinderTime27d(from:{x:number;y:number;z:number},to:{x:number;y:number;z:number},start:{x:number;y:number;z?:number},end:{x:number;y:number;z?:number},radius:number,low:number,high:number){
 const x=from.x-start.x,y=from.y-start.y,dx=to.x-from.x-(end.x-start.x),dy=to.y-from.y-(end.y-start.y),a=dx*dx+dy*dy,b=2*(x*dx+y*dy),c=x*x+y*y-radius*radius;
 let enter=0,exit=1;
 if(a<1e-12){if(c>0)return null;}else{const disc=b*b-4*a*c;if(disc<0)return null;const root=Math.sqrt(disc);enter=Math.max(enter,(-b-root)/(2*a));exit=Math.min(exit,(-b+root)/(2*a));}
 const z=from.z-(start.z||0),dz=to.z-from.z-((end.z||0)-(start.z||0));
 if(Math.abs(dz)<1e-12){if(z<low||z>high)return null;}else{const t0=(low-z)/dz,t1=(high-z)/dz;enter=Math.max(enter,Math.min(t0,t1));exit=Math.min(exit,Math.max(t0,t1));}
 return enter<=exit&&enter>=0&&enter<=1?enter:null;
}
export function coverTime27d(from:{x:number;y:number;z:number},to:{x:number;y:number;z:number},cover:{x:number;y:number;w:number;h:number;a:number;fracture32?:Fracture32},height:number,pad=0){
 if(cover.fracture32){let first=Infinity;for(const {poly,low,high} of prisms33(cover)){const interval=rayPoly32(from,to,poly,pad);if(!interval)continue;let {lo,hi}=interval;const dz=to.z-from.z;if(Math.abs(dz)<1e-12){if(from.z < low-pad||from.z>high+pad)continue;}else{const a=(low-pad-from.z)/dz,b=(high+pad-from.z)/dz;lo=Math.max(lo,Math.min(a,b));hi=Math.min(hi,Math.max(a,b));}if(lo<=hi)first=Math.min(first,lo);}return Number.isFinite(first)?first:null;}
 const co=Math.cos(cover.a),si=Math.sin(cover.a),local=(p:typeof from)=>{const x=p.x-cover.x,y=p.y-cover.y;return [x*co+y*si,-x*si+y*co,p.z];},a=local(from),b=local(to),lo=[-cover.w/2-pad,-cover.h/2-pad,-pad],hi=[cover.w/2+pad,cover.h/2+pad,height+pad];let enter=0,exit=1;
 for(let i=0;i<3;i++){const d=b[i]-a[i];if(Math.abs(d)<1e-12){if(a[i]<lo[i]||a[i]>hi[i])return null;}else{const t0=(lo[i]-a[i])/d,t1=(hi[i]-a[i])/d;enter=Math.max(enter,Math.min(t0,t1));exit=Math.min(exit,Math.max(t0,t1));}}
 return enter<=exit&&enter>=0&&enter<=1?enter:null;
}
