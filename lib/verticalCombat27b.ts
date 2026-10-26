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
