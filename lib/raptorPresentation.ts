/** Raptor presentation contract: NO gameplay physics, stats or input remapping. */
export type RaptorPoseId = `R${number}`;
export type PoseFamily = "movement"|"shooting"|"melee"|"cover"|"psychic"|"reaction"|"agility"|"attack";
export type PoseSpec = Readonly<{
 id:RaptorPoseId; family:PoseFamily; label:string; visualOnly:boolean;
 framePath:string|null; fxPath:string|null;
 groundAnchor:Readonly<{x:number;y:number}>|null;
 muzzleSocket:Readonly<{x:number;y:number}>|null;
 headSocket:Readonly<{x:number;y:number}>|null;
 validated:boolean;
}>;
const batches:ReadonlyArray<readonly [PoseFamily, readonly string[]]> = [
 ["movement",["Combat ready","Run left contact","Run left pass","Run right contact","Run right pass","Jurassic sprint entry"]],
 ["shooting",["Aim idle","SMG fire","Recoil","Reload","High angle aim","Low crouch aim"]],
 ["melee",["Claw opening strike","Cross claw","Uppercut","Tail whip","Lunging pounce","Counter recovery"]],
 ["cover",["Slide to cover","Soft cover attach","Lateral cover move","Hard brace peek","Shield parry","Cover escape"]],
 ["psychic",["Charge","Shield activation","Grip lift","Psychic throw","Orbit","Power release"]],
 ["reaction",["Light flinch","Heavy stagger","Shield break","Airborne knockback","Ground knockdown","Get up"]],
 ["agility",["Jurassic sprint","Weave slide","Jump vault concept","Wall run concept","Air dash concept","Land recover"]],
 ["attack",["Claw combo","Tail strike","Shotgun","Rifle burst","Grenade concept","Finisher concept"]]
];
export const RAPTOR_POSES:readonly PoseSpec[]=batches.flatMap(([family,names],batch)=>names.map((label,index)=>({
 id:`R${String(batch*6+index+1).padStart(3,"0")}` as RaptorPoseId,
 family,label,visualOnly:true,framePath:null,fxPath:null,
 groundAnchor:null,muzzleSocket:null,headSocket:null,validated:false
})));
export const RAPTOR_VISUAL_AUTHORITY="Raptor Art V3.0 — olive tiger stripes, red monocle, white/gunmetal carapace, magenta accents, long raised tail";
export function findRaptorPose(id:string){return RAPTOR_POSES.find(p=>p.id===id)||null;}
export function raptorPoseReady(p:PoseSpec){return p.validated&&!!p.framePath&&!!p.groundAnchor&&!!p.headSocket;}
