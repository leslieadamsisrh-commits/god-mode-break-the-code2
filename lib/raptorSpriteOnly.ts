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
export const RAPTOR_COUNTS={idle:1,run:4,stalk:4,jog:4,sprint:4,slide:3,jump:6,'cover-drive':2,'cover-hold':1,'cover-lean':2,'cover-pop':1,'cover-catch':2,'cover-shuffle':2,'cover-wrap':2,'cover-bridge':2,'cover-corner':1,'cover-recoil':2,'cover-sequence':6,recovery:1,movement:8} as const;
export type RaptorFamily=keyof typeof RAPTOR_COUNTS;
// New posture artwork is enabled only for complete, explicitly accepted directional sets.
export type RaptorVisualState={x:number;y:number;angle:number;speed:number;sliding:boolean;airborne:boolean;hit:boolean;firing:boolean;time:number;scale:number;slideRemaining?:number;slideDuration?:number;attached?:boolean;actorId?:string;worldX?:number;worldY?:number;travelAngle?:number;verticalVelocity?:number;animationState?:string;authoritativeFrame?:RaptorPoseFrame};
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
type AssetResult = "loading" | "ready" | "network-error" | "decode-error" | "timeout" | "unregistered";
type SpriteDiagnostic = {requested: string; displayed: string | null; state: string; result: AssetResult};
const cache=new Map<string,HTMLImageElement>();
const results=new Map<string,AssetResult>();
const pending=new Map<string,Promise<boolean>>();
const diagnostics:SpriteDiagnostic[]=[];
const lastByActor=new Map<string,SpriteDiagnostic>();
const frames:Record<string,RaptorRegistration>=inventory.frames;

export function getRaptorSpriteDiagnostics(){return diagnostics.slice();}

export function loadRaptorSprite(key:string,retry=false):Promise<boolean>{
 if(!Object.hasOwn(frames,key))return Promise.resolve(false);
 if(cache.has(key))return Promise.resolve(true);
 const existing=pending.get(key);
 if(existing)return existing;
 if(results.has(key)&&!retry)return Promise.resolve(false);
 const img=new Image();
 img.decoding="async";
 results.set(key,"loading");
 const request=new Promise<boolean>(resolve=>{
  let settled=false;
  const finish=(result:AssetResult)=>{
   if(settled)return;
   settled=true;
   clearTimeout(timeout);
   img.onload=null;
   img.onerror=null;
   pending.delete(key);
   results.set(key,result);
   if(result==="ready")cache.set(key,img);
   resolve(result==="ready");
  };
  const timeout=setTimeout(()=>finish("timeout"),15000);
  img.onload=async()=>{
   try{
    await img.decode();
    finish(img.naturalWidth===512&&img.naturalHeight===512?"ready":"decode-error");
   }catch{finish("decode-error");}
  };
  img.onerror=()=>finish("network-error");
 });
 pending.set(key,request);
 img.src=`/assets/raptor-v2/${key}?v=${inventory.build}`;
 return request;
}

const openingKeys=Object.keys(frames).filter(key=>
 key.startsWith("idle/")||key==="movement/front-left/001.png"||key.startsWith("cover-catch/back/")||/^movement\/[^/]+\/000\.png$/.test(key)||
 /^(?:stalk|jog|sprint|jump|slide|recovery)\/[^/]+\/000\.png$/.test(key));
async function loadRaptorBatch(keys:string[],retry=false){
 let ready=true;
 for(let i=0;i<keys.length;i+=8){
  const batch=await Promise.all(keys.slice(i,i+8).map(key=>loadRaptorSprite(key,retry)));
  ready=batch.every(Boolean)&&ready;
 }
 return ready;
}
export function prepareRaptorMatch(){return loadRaptorBatch(openingKeys,true);}
let backgroundLoad:Promise<void>|undefined;
export function preloadRaptorSprites():Promise<void>{
 if(!backgroundLoad){
  const keys=Object.keys(frames).filter(key=>!openingKeys.includes(key)&&!key.startsWith("run/"));
  const priority=(key:string)=>/^(?:movement|stalk|jog|sprint|jump|slide)\//.test(key)?0:1;
  keys.sort((a,b)=>priority(a)-priority(b));
  backgroundLoad=loadRaptorBatch(keys,true).then(()=>{}).finally(()=>{backgroundLoad=undefined;});
 }
 return backgroundLoad;
}
export function requestRaptorShotSprite(key:string){
 if(cache.has(key))return true;
 if(!Object.hasOwn(frames,key))return false;
 const now=Date.now();
 if(!pending.has(key)&&(shotRetryAt.get(key)??0)<=now){
  shotRetryAt.set(key,now+3000);
  void loadRaptorSprite(key,true);
 }
 return false;
}
const shotRetryAt=new Map<string,number>();
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
 const selected=state.authoritativeFrame??advanceVisualPose(state).frame;
 const direction=selectRaptorDirection(selected.angle);
 const {key,family,frame}=selected;
 if(!cache.has(key))requestRaptorShotSprite(key);
 const status=Object.hasOwn(frames,key)?results.get(key)??"loading":"unregistered";
 const actor=state.actorId||"local";
 const previous=lastByActor.get(actor);
 const familyKey=`${family}/${direction}/`;
 const related=previous?.displayed?.startsWith(familyKey)?previous.displayed:undefined;
 // Fallback is presentation only. The local combat shot gate checks the exact
 // selected sprite before a shell or a muzzle effect can be committed.
 const candidates=[key,related,`${familyKey}000.png`,
  `idle/${direction}/000.png`,previous?.displayed,"idle/right/000.png"];
 const displayed=candidates.find(candidate=>candidate&&cache.has(candidate));
 const sample={requested:key,displayed:displayed??null,state:state.animationState??family,result:status};
 if(!previous||previous.requested!==key||previous.displayed!==sample.displayed||previous.result!==status||previous.state!==sample.state){
  lastByActor.set(actor,sample);
  if(status!=="ready"||displayed!==key){
   if(diagnostics.length>=160)diagnostics.shift();
   diagnostics.push(sample);
  }
 }
 if(!displayed)return false;
 if(displayed===key){
  const traceKey=direction+" / "+family+(state.firing?" + fire":"");
  const seen=animationTrace.get(traceKey)||new Set<number>();
  seen.add(frame);
  animationTrace.set(traceKey,seen);
 }
 const placement=raptorSpritePlacement(state,frames[displayed]);
 g.drawImage(cache.get(displayed)!,placement.x,placement.y,placement.size,placement.size);
 return displayed===key;
}
