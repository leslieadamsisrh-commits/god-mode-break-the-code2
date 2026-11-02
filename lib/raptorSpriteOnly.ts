/** Sprite-only Raptor V2 presentation.
 * Receives authoritative Jade combat state; NEVER modifies movement, collision or input.
 * Missing images are reported visibly instead of falling back to the retired skeletal rig.
 */
export type RaptorAction="idle"|"walk"|"run"|"slide"|"jump"|"land"|"shoot"|"hit";
export const RAPTOR_DIRECTIONS=["right","front-right","front","front-left","left","back-left","back","back-right"] as const;
export type RaptorDirection=typeof RAPTOR_DIRECTIONS[number];
export const RAPTOR_COUNTS:Record<RaptorAction,number>={idle:4,walk:6,run:4,slide:6,jump:4,land:3,shoot:4,hit:4};
const cache=new Map<string,HTMLImageElement>();
const missing=new Set<string>();
export function selectRaptorDirection(angle:number):RaptorDirection {
 const octant=((Math.round(angle/(Math.PI/4))%8)+8)%8;
 return RAPTOR_DIRECTIONS[octant];
}
export function selectRaptorAction(state:{speed:number;sliding:boolean;airborne:boolean;hit:boolean;firing:boolean}):RaptorAction {
 if(state.hit)return "hit";
 if(state.sliding)return "slide";
 if(state.airborne)return "jump";
 if(state.firing)return "shoot";
 if(state.speed>160)return "run";
 if(state.speed>20)return "walk";
 return "idle";
}
export function paintRaptorSprite(g:CanvasRenderingContext2D,state:{x:number;y:number;angle:number;speed:number;sliding:boolean;airborne:boolean;hit:boolean;firing:boolean;time:number;scale:number}):boolean{
 const action=selectRaptorAction(state),direction=selectRaptorDirection(state.angle);
 const frame=Math.floor(state.time*(action==="run"?12:action==="slide"?12:8))%RAPTOR_COUNTS[action];
 // Reuse an existing visual family for unfinished actions; simulation is unchanged.
 // Minimal playtest uses only physically installed Run and Idle artwork.\n // Unfinished actions borrow an existing visual family; never modify simulation.\n const artAction=action==="run"||action==="walk"||action==="slide"?"run":"idle";
 const artFrame=frame%RAPTOR_COUNTS[artAction];
 const key=`${artAction}/${direction}/${String(artFrame).padStart(3,"0")}.png`;
 let img=cache.get(key);
 if(!img&&!missing.has(key)){
   img=new Image();
   img.onerror=()=>missing.add(key);
   img.src=`/assets/raptor-v2/${key}`;
   cache.set(key,img);
 }
 if(img?.complete&&img.naturalWidth===512&&img.naturalHeight===512){
   g.drawImage(img,state.x-256*state.scale,state.y-450*state.scale,512*state.scale,512*state.scale);
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
