import {arenaPoint46,arenaInverse46,ARENA_UPRIGHT_SCALE47} from './bayBridgePresentation';

/** Authored points in the same 512px cell used by raptorSpritePlacement. */
export type RaptorSocketRegistration={
 anchor:readonly number[];
 muzzle:readonly number[];
 /** Floor point directly below the muzzle. Defaults to the anchor's floor line. */
 muzzleGround?:readonly number[];
 drawScale?:number;
};
export type RaptorSocketActor={x:number;y:number;z?:number;gunFacing?:number;aim?:number};
export type RaptorBarrelSocket={
 x:number;y:number;z:number;dir:number;
 /** Coordinate inside withUpright, after the actor elevation translation. */
 rendered:{x:number;y:number};
 /** One scale for both texture axes; never stretch anatomy to place a socket. */
 scale:number;
};

const point=(p:readonly number[]|undefined):p is readonly number[]=>
 !!p&&p.length===2&&p.every(Number.isFinite);

/**
 * DOM-free conversion of one selected Raptor frame's authored muzzle to XYZ.
 * It does not select/mutate animation, accept network input or alter Jade sockets.
 * visualOffset must be the same upright-space offset used to draw that frame.
 * Missing/invalid authoring returns null; callers decide the safe fallback.
 */
export function raptorBarrelSocket(
 actor:RaptorSocketActor,
 registration:RaptorSocketRegistration|undefined,
 spriteScale=.82,
 visualOffset:{x:number;y:number}={x:0,y:0}
):RaptorBarrelSocket|null{
 if(!registration||!point(registration.anchor)||!point(registration.muzzle))return null;
 const {anchor,muzzle}=registration,z=actor.z??0,angle=actor.gunFacing??actor.aim??0;
 if(![actor.x,actor.y,z,angle,spriteScale,visualOffset.x,visualOffset.y].every(Number.isFinite)||spriteScale<=0)return null;
 const ground=registration.muzzleGround??[muzzle[0],anchor[1]];
 // A vertical segment has one source X. Otherwise floor-depth and height are ambiguous.
 if(!point(ground)||Math.abs(ground[0]-muzzle[0])>1e-9||ground[1]<=muzzle[1])return null;
 const authored=registration.drawScale;
 // Matches raptorSpritePlacement's uniform scale fallback exactly.
 const scale=.26*spriteScale*(typeof authored==='number'&&Number.isFinite(authored)&&authored>0?authored:1);
 const floor=arenaPoint46(actor.x,actor.y),unit=1.536*ARENA_UPRIGHT_SCALE47;
 const floorX=(ground[0]-anchor[0])*scale+visualOffset.x;
 const floorY=(ground[1]-anchor[1])*scale+visualOffset.y;
 const height=(ground[1]-muzzle[1])*scale;
 if(![scale,height,floorX,floorY].every(Number.isFinite)||scale<=0||height<=0)return null;
 const root=arenaInverse46(floor.x+floorX*unit,floor.y+floorY*unit);
 const rendered={x:actor.x+visualOffset.x+(muzzle[0]-anchor[0])*scale,y:actor.y+visualOffset.y+(muzzle[1]-anchor[1])*scale-z};
 if(![root.x,root.y,z+height,rendered.x,rendered.y].every(Number.isFinite))return null;
 return {
  ...root,z:z+height,
  dir:((Math.round(angle/(Math.PI*2)*24)%24)+24)%24,
  rendered,
  scale
 };
}
