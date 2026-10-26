import {advanceElevation,STEP,type Body,type Surface,SURFACES} from './elevation27a';
/** Presentation-only opt-in bridge; never used to resolve competitive hits or networking. */
export type CombatXY={x:number;y:number;vx:number;vy:number;aim:number};
export type VerticalCombatState={body:Body};
export function createVerticalCombat(player:CombatXY):VerticalCombatState{return {body:{x:player.x,y:player.y,z:0,vz:0,grounded:true,supportSurfaceId:'ground'}};}
export function stepVerticalCombat(state:VerticalCombatState,player:CombatXY,jump:boolean,dt=STEP,surfaces:SURFACES_TYPE=SURFACES):VerticalCombatState{
 const from=state.body,dx=player.x-from.x,dy=player.y-from.y,distance=Math.hypot(dx,dy);
 const body=advanceElevation(from,{x:dx,y:dy,jump,speed:distance/Math.max(dt,1e-6)},dt,surfaces as Surface[]);
 // XY remains authoritative in the combat engine; only z/vz/support are produced here.
 return {body:{...body,x:player.x,y:player.y}};
}
type SURFACES_TYPE=readonly Surface[];
export const elevationSpriteOffset=(z:number)=>-z*.9;



// Shared authoritative vertical state. XY is always supplied by lib/game.
export type ElevationState={z:number;vz:number;grounded:boolean;supportSurfaceId:string|null};
export const COMBAT_SURFACES:Surface[]=[
 {id:'ground',polygon:[{x:0,y:0},{x:1500,y:0},{x:1500,y:840},{x:0,y:840}],height:0,walkable:true},
 ...(['north','south'] as const).flatMap(side=>{
  const north=side==='north',y=north?140:620,sy=north?220:530;
  return [
   {id:side+'-platform',polygon:[{x:540,y},{x:960,y},{x:960,y:y+80},{x:540,y:y+80}],height:72,walkable:true},
   {id:side+'-stairs',polygon:[{x:680,y:sy},{x:820,y:sy},{x:820,y:sy+90},{x:680,y:sy+90}],height:0,walkable:true,rise:{axis:'y' as const,from:north?310:530,to:north?220:620,low:0,high:72}},
  ];
 }),
 {id:'west-walkway',polygon:[{x:250,y:160},{x:540,y:160},{x:540,y:205},{x:250,y:205}],height:72,walkable:true},
 {id:'east-walkway',polygon:[{x:960,y:160},{x:1250,y:160},{x:1250,y:205},{x:960,y:205}],height:72,walkable:true},
];
import {inside,height,GRAVITY,JUMP_SPEED,PLAYER_HEIGHT} from './elevation27a';
export function integrateVertical(body:Body,previous:{x:number;y:number},jump:boolean,dt:number,surfaces=COMBAT_SURFACES):ElevationState{
 let {z=0,vz=0,grounded=true,supportSurfaceId='ground'}=body;
 const available=surfaces.filter(s=>s.walkable&&inside(body,s));
 if(grounded){
  const travel=Math.hypot(body.x-previous.x,body.y-previous.y);
  const support=available.filter(s=>Math.abs(height(s,body)-z)<=3||(s.rise&&Math.abs(height(s,body)-z)<=travel*.85+1)).sort((a,b)=>height(b,body)-height(a,body))[0];
  if(support){z=height(support,body);vz=0;supportSurfaceId=support.id;}else{grounded=false;supportSurfaceId=null;}
 }
 if(jump&&grounded){grounded=false;supportSurfaceId=null;vz=JUMP_SPEED;}
 if(!grounded){
  const before=z;vz-=GRAVITY*dt;z+=vz*dt;
  if(vz>0){const ceiling=available.filter(s=>height(s,body)>before+PLAYER_HEIGHT&&height(s,body)<=z+PLAYER_HEIGHT).sort((a,b)=>height(a,body)-height(b,body))[0];if(ceiling){z=height(ceiling,body)-PLAYER_HEIGHT;vz=0;}}
  if(vz<=0){const landing=available.filter(s=>height(s,body)<=before+.001&&height(s,body)>=z-.001).sort((a,b)=>height(b,body)-height(a,body))[0];if(landing){z=height(landing,body);vz=0;grounded=true;supportSurfaceId=landing.id;}}
  if(z<0){z=0;vz=0;grounded=true;supportSurfaceId='ground';}
 }
 return {z,vz,grounded,supportSurfaceId};
}
// Swept plane intersection for ramps and platform slabs, including underpasses.
export function surfaceShotTime(from:{x:number;y:number;z:number},to:{x:number;y:number;z:number},surfaces=COMBAT_SURFACES){
 let first=Infinity;
 for(const s of surfaces){const a=from.z-height(s,from),b=to.z-height(s,to);if(a*b>0||Math.abs(a-b)<1e-9)continue;const t=a/(a-b);const point={x:from.x+(to.x-from.x)*t,y:from.y+(to.y-from.y)*t};if(t>=0&&t<=1&&inside(point,s))first=Math.min(first,t);}
 return first;
}
