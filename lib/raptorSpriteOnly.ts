import type {RaptorPoseFrame} from "./raptorPose";
/** Sprite-only Raptor V2 presentation.
 * Receives authoritative Jade combat state; NEVER modifies movement, collision or input.
 * Missing images are reported visibly instead of falling back to the retired skeletal rig.
 */
import {advanceRaptorPose,raptorPoseDirection,RAPTOR_POSE_DIRECTIONS,type RaptorPoseMemory} from "./raptorPose";
export {RAPTOR_STRIDE_DISTANCE} from "./raptorPose";
import inventory from "../public/assets/raptor-v2/manifest.json";
export type RaptorAction="idle"|"walk"|"run"|"slide"|"jump"|"land"|"shoot"|"hit";
export const RAPTOR_DIRECTIONS=RAPTOR_POSE_DIRECTIONS;
export type RaptorDirection=typeof RAPTOR_DIRECTIONS[number];
// Physical inventory only. Other actions deliberately borrow these provisional families.
export const RAPTOR_COUNTS={idle:1,run:4,stalk:4,jog:4,sprint:4,slide:3,jump:6,'cover-drive':2,'cover-hold':1,'cover-lean':2,'cover-pop':1,'cover-catch':1,'cover-shuffle':2,'cover-wrap':2,'cover-bridge':2,'cover-corner':1,'cover-recoil':2,'cover-sequence':6,recovery:1,movement:8} as const;
export type RaptorFamily=keyof typeof RAPTOR_COUNTS;
// New posture artwork is enabled only for complete, explicitly accepted directional sets.
export type RaptorVisualState={x:number;y:number;angle:number;speed:number;sliding:boolean;airborne:boolean;hit:boolean;firing:boolean;time:number;scale:number;slideRemaining?:number;slideDuration?:number;attached?:boolean;actorId?:string;worldX?:number;worldY?:number;travelAngle?:number;verticalVelocity?:number;authoritativeFrame?:RaptorPoseFrame};
export type RaptorRegistration={anchor:number[];drawScale?:number};
/** Clamp digital diagonals before applying the lab's simulated stick pressure.
 * Controller values bypass this helper and retain their native analog magnitude.
 */
export function raptorLabMovement(x:number,y:number,pace:number){
 const magnitude=Math.max(1,Math.hypot(x,y)),factor=pace/magnitude;
 return {x:x*factor,y:y*factor};
}
/** Uniform authored-scale compensation; anchors remain pinned to the same world point.
 * Wide slide poses can use more texture space without shrinking their torso in game.
 * Legacy frames without metadata retain their exact previous placement.
 */
export function raptorSpritePlacement(state:Pick<RaptorVisualState,"x"|"y"|"scale">,record:RaptorRegistration){
 const authored=record.drawScale;
 const scale=state.scale*(typeof authored==="number"&&Number.isFinite(authored)&&authored>0?authored:1);
 return {x:state.x-record.anchor[0]*scale,y:state.y-record.anchor[1]*scale,size:512*scale};
}
// Rendering-only fallback contexts. Authoritative actors carry their already selected frame.
// Both paths use the same pure selector; server memory lives on each Player, never here.
const poseMemory=new Map<string,RaptorPoseMemory>();
function advanceVisualPose(state:RaptorVisualState){
 const id=state.actorId||"local";
 const result=advanceRaptorPose(poseMemory.get(id),{
  time:state.time,x:state.worldX,y:state.worldY,angle:state.angle,speed:state.speed,
  travelAngle:state.travelAngle,sliding:state.sliding,slideRemaining:state.slideRemaining,
  slideDuration:state.slideDuration,airborne:state.airborne,verticalVelocity:state.verticalVelocity??0,
  hit:state.hit,attached:!!state.attached,firing:state.firing
 });
 poseMemory.set(id,result.memory);return result;
}
export function raptorGaitPhase(state:RaptorVisualState):number{return advanceVisualPose(state).memory.gait.phase;}
export function selectRaptorFrame(state:RaptorVisualState):{family:RaptorFamily;frame:number;angle:number}{
 const {family,frame,angle}=advanceVisualPose(state).frame;return{family,frame,angle};
}
const animationTrace=new Map<string,Set<number>>();
/** Read-only lab diagnostics: records frames actually painted through normal gameplay. */
export function getRaptorAnimationTrace():string{
 return [...animationTrace].map(([key,frames])=>key+": "+[...frames].sort().join(",")).join("\n")||"Move or slide to record painted frames.";
}
export function clearRaptorAnimationTrace():void{animationTrace.clear();}
const cache=new Map<string,HTMLImageElement>();
const missing=new Set<string>();
const pending=new Map<string,Promise<boolean>>();
export function loadRaptorSprite(key:string,retry=false):Promise<boolean>{
 const existing=pending.get(key);
 if(existing)return existing;
 if(retry&&missing.delete(key))cache.delete(key);
 if(missing.has(key))return Promise.resolve(false);
 if(cache.has(key))return Promise.resolve(true);
 const img=new Image();
 cache.set(key,img);
 const request=new Promise<boolean>(resolve=>{
  const finish=(ready:boolean)=>{
   clearTimeout(timeout);
   img.onload=null;
   img.onerror=null;
   pending.delete(key);
   if(!ready)missing.add(key);
   resolve(ready);
  };
  const timeout=setTimeout(()=>finish(false),8000);
  img.onload=()=>finish(img.naturalWidth===512&&img.naturalHeight===512);
  img.onerror=()=>finish(false);
 });
 pending.set(key,request);
 img.src=`/assets/raptor-v2/${key}?v=${inventory.build}`;
 return request;
}
export async function preloadRaptorSprites():Promise<void>{
 const keys=Object.keys(inventory.frames);
 for(let i=0;i<keys.length;i+=8){
  await Promise.all(keys.slice(i,i+8).map(key=>loadRaptorSprite(key)));
 }
}
export function selectRaptorDirection(angle:number):RaptorDirection {
 return raptorPoseDirection(angle);
}
export function selectRaptorAction(state:{speed:number;sliding:boolean;airborne:boolean;hit:boolean;firing:boolean}):RaptorAction {
 if(state.hit)return "hit";
 if(state.sliding)return "slide";
 if(state.airborne)return "jump";
 if(state.speed>160)return "run";
 if(state.speed>2)return "walk";
 if(state.firing)return "shoot";
 return "idle";
}
export function paintRaptorSprite(g:CanvasRenderingContext2D,state:RaptorVisualState):boolean{
 const selected=state.authoritativeFrame??selectRaptorFrame(state),direction=selectRaptorDirection(selected.angle);
 const artAction=selected.family,artFrame=selected.frame;
 const key=`${artAction}/${direction}/${String(artFrame).padStart(3,"0")}.png`;
 if(!cache.has(key))void loadRaptorSprite(key);
 const img=cache.get(key);
 if(img?.complete&&img.naturalWidth===512&&img.naturalHeight===512){
   const traceKey=direction+" / "+artAction+(state.firing?" + fire":"");
   const seen=animationTrace.get(traceKey)||new Set<number>();seen.add(artFrame);animationTrace.set(traceKey,seen);
   const placement=raptorSpritePlacement(state,inventory.frames[key] as RaptorRegistration);
   g.drawImage(img,placement.x,placement.y,placement.size,placement.size);
   return true;
 }
 // Explicit missing-art marker; NEVER impersonate the approved Raptor with a skeletal rig.
 g.save();g.translate(state.x,state.y);
 g.fillStyle="#1b2a36";g.strokeStyle="#ff865d";g.lineWidth=2;
 g.fillRect(-18,-64,36,64);g.strokeRect(-18,-64,36,64);
 g.fillStyle="#fff";g.font="bold 9px monospace";g.textAlign="center";
 g.fillText("RAPTOR V2",0,-72);g.fillText("ART PENDING",0,-83);
 g.restore();return false;
}







