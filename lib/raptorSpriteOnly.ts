/** Sprite-only Raptor V2 presentation.
 * Receives authoritative Jade combat state; NEVER modifies movement, collision or input.
 * Missing images are reported visibly instead of falling back to the retired skeletal rig.
 */
import inventory from "../public/assets/raptor-v2/manifest.json";
export type RaptorAction="idle"|"walk"|"run"|"slide"|"jump"|"land"|"shoot"|"hit";
export const RAPTOR_DIRECTIONS=["right","front-right","front","front-left","left","back-left","back","back-right"] as const;
export type RaptorDirection=typeof RAPTOR_DIRECTIONS[number];
// Physical inventory only. Other actions deliberately borrow these provisional families.
export const RAPTOR_COUNTS={idle:1,run:4,stalk:4,jog:4,sprint:4,slide:3} as const;
export type RaptorFamily=keyof typeof RAPTOR_COUNTS;
// New posture artwork is enabled only for complete, explicitly accepted directional sets.
const postureDirections:readonly string[]=inventory.postureDirections;
const hasPostures=(angle:number)=>postureDirections.includes(selectRaptorDirection(angle));
export type RaptorVisualState={x:number;y:number;angle:number;speed:number;sliding:boolean;airborne:boolean;hit:boolean;firing:boolean;time:number;scale:number;slideRemaining?:number;slideDuration?:number;attached?:boolean;actorId?:string;worldX?:number;worldY?:number;travelAngle?:number};
export type RaptorRegistration={anchor:number[];drawScale?:number};
/** Uniform authored-scale compensation; anchors remain pinned to the same world point.
 * Wide slide poses can use more texture space without shrinking their torso in game.
 * Legacy frames without metadata retain their exact previous placement.
 */
export function raptorSpritePlacement(state:Pick<RaptorVisualState,"x"|"y"|"scale">,record:RaptorRegistration){
 const authored=record.drawScale;
 const scale=state.scale*(typeof authored==="number"&&Number.isFinite(authored)&&authored>0?authored:1);
 return {x:state.x-record.anchor[0]*scale,y:state.y-record.anchor[1]*scale,size:512*scale};
}
// World-space samples exclude camera motion, elevation and cover presentation offsets.
const gaitMemory=new Map<string,{time:number;x?:number;y?:number;phase:number;sprinting:boolean;jogging:boolean;airborne:boolean;landedAt:number}>();
export const RAPTOR_STRIDE_DISTANCE=100;
// Side-view contact sweeps about 155 source pixels to passing, or 33 world units at the default render scale.
const SPRINT_STRIDE_DISTANCE=120;
const CONTACT_FRACTION=.28;
export function raptorGaitPhase(state:RaptorVisualState):number{
 const id=state.actorId||"local",old=gaitMemory.get(id);
 const memory=old&&state.time>=old.time?old:{time:state.time,x:state.worldX,y:state.worldY,phase:0,sprinting:false,jogging:false,airborne:false,landedAt:-Infinity};
 const dt=state.time-memory.time;
 if(memory.airborne && !state.airborne) memory.landedAt=state.time;
 memory.airborne=state.airborne;
 const alignment=state.travelAngle===undefined?1:Math.cos(state.travelAngle-state.angle);
 const interrupted=state.sliding || state.airborne || state.hit || state.attached || state.time-memory.landedAt<.075;
 // Separate entry and exit thresholds prevent pose chatter on turns and acceleration.
 memory.sprinting=!interrupted && state.speed>(memory.sprinting?145:170) && alignment>(memory.sprinting ? .62 : .78);
 memory.jogging=!interrupted && state.speed>(memory.jogging?75:95);

 if(dt>0&&dt<=.25&&!interrupted&&state.speed>2){
  const distance=state.worldX!==undefined&&state.worldY!==undefined&&memory.x!==undefined&&memory.y!==undefined
   ?Math.hypot(state.worldX-memory.x,state.worldY-memory.y):state.speed*dt;
  // Reject teleports/snapshot corrections; they are not strides.
  if(distance<=Math.max(12,state.speed*dt*2)){
   const backwards=state.travelAngle!==undefined&&Math.cos(state.travelAngle-state.angle)<-.5;
   const stride=memory.sprinting?SPRINT_STRIDE_DISTANCE:hasPostures(state.angle)&&!memory.jogging?60:RAPTOR_STRIDE_DISTANCE;
   memory.phase=((memory.phase+(backwards?-1:1)*distance/stride)%1+1)%1;
  }
 }
 if(dt!==0||!old){memory.time=state.time;memory.x=state.worldX;memory.y=state.worldY;}
 gaitMemory.set(id,memory);return memory.phase;
}
const slideMemory=new Map<string,{time:number;active:boolean;startedAt:number;recoveryUntil:number;angle:number}>();
/** Presentation-only phase selection. It never delays or writes authoritative actions. */
export function selectRaptorFrame(state:RaptorVisualState):{family:RaptorFamily;frame:number;angle:number}{
 const phase=raptorGaitPhase(state);
 const id=state.actorId||"local",previous=slideMemory.get(id);
 const memory=previous&&state.time>=previous.time?previous:{time:state.time,active:false,startedAt:state.time,recoveryUntil:0,angle:state.angle};
 const interrupted=state.airborne||state.hit||state.attached;
 if(interrupted){memory.active=false;memory.recoveryUntil=0;}
 else if(state.sliding){if(!memory.active)memory.startedAt=state.time;memory.active=true;memory.angle=state.angle;memory.recoveryUntil=0;}
 else if(memory.active){memory.active=false;memory.recoveryUntil=state.time+.12;}
 memory.time=state.time;slideMemory.set(id,memory);
 if(!interrupted&&state.sliding){
  const duration=Math.max(.01,state.slideDuration??.5),remaining=state.slideRemaining??duration*.5;
  const elapsed=Math.max(0,state.time-memory.startedAt);
  return {family:"slide",frame:elapsed<.08?0:remaining<.06?2:1,angle:state.angle};
 }
 if(!interrupted&&state.time<memory.recoveryUntil)return {family:"slide",frame:2,angle:state.firing?state.angle:memory.angle};
 const gait=gaitMemory.get(id)!;
 if(interrupted || state.time-gait.landedAt<.075) return {family:"idle",frame:0,angle:state.angle};
 if(gait.sprinting){
  // Contact occupies 28% of the cycle; the foot passes under the hip in the remaining 22%.
  const frame=(phase>=.5?2:0)+(phase%0.5>=CONTACT_FRACTION?1:0);
  return {family:"sprint",frame,angle:state.angle};
 }
 if(state.speed>2&&hasPostures(state.angle)){
  const family=gait.jogging?"jog":"stalk";
  const frame=(phase>=.5?2:0)+(phase%0.5>=CONTACT_FRACTION?1:0);
  return {family,frame,angle:state.angle};
 }
 const action=selectRaptorAction(state),family=action==="run"||action==="walk"?"run":"idle";
 return {family,frame:family==="run"?Math.floor(phase*RAPTOR_COUNTS.run):0,angle:state.angle};
}
const animationTrace=new Map<string,Set<number>>();
/** Read-only lab diagnostics: records frames actually painted through normal gameplay. */
export function getRaptorAnimationTrace():string{
 return [...animationTrace].map(([key,frames])=>key+": "+[...frames].sort().join(",")).join("\n")||"Move or slide to record painted frames.";
}
export function clearRaptorAnimationTrace():void{animationTrace.clear();}
const cache=new Map<string,HTMLImageElement>();
const missing=new Set<string>();
export function preloadRaptorSprites():Promise<boolean>{
 return Promise.all(Object.keys(inventory.frames).map(key=>{
   return new Promise<boolean>(resolve=>{
    const img=new Image();cache.set(key,img);
    img.onload=()=>resolve(img.naturalWidth===512&&img.naturalHeight===512);
    img.onerror=()=>{missing.add(key);resolve(false)};
    img.src=`/assets/raptor-v2/${key}?v=${inventory.build}`;
   });
  })).then(results=>results.every(Boolean));
}
export function selectRaptorDirection(angle:number):RaptorDirection {
 const octant=((Math.round(angle/(Math.PI/4))%8)+8)%8;
 return RAPTOR_DIRECTIONS[octant];
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
 const selected=selectRaptorFrame(state),direction=selectRaptorDirection(selected.angle);
 const artAction=selected.family,artFrame=selected.frame;
 const key=`${artAction}/${direction}/${String(artFrame).padStart(3,"0")}.png`;
 let img=cache.get(key);
 if(!img&&!missing.has(key)){
   img=new Image();
   img.onerror=()=>missing.add(key);
   img.src=`/assets/raptor-v2/${key}?v=${inventory.build}`;
   cache.set(key,img);
 }
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




