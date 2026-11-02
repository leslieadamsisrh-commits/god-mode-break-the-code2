/** Sprite-only Raptor V2 presentation.
 * Receives authoritative Jade combat state; NEVER modifies movement, collision or input.
 * Missing images are reported visibly instead of falling back to the retired skeletal rig.
 */
import inventory from "../public/assets/raptor-v2/manifest.json";
export type RaptorAction="idle"|"walk"|"run"|"slide"|"jump"|"land"|"shoot"|"hit";
export const RAPTOR_DIRECTIONS=["right","front-right","front","front-left","left","back-left","back","back-right"] as const;
export type RaptorDirection=typeof RAPTOR_DIRECTIONS[number];
// Physical inventory only. Other actions deliberately borrow these provisional families.
export const RAPTOR_COUNTS={idle:1,run:2} as const;
const cache=new Map<string,HTMLImageElement>();
const missing=new Set<string>();
export function preloadRaptorSprites():Promise<boolean>{
 return Promise.all(Object.entries(RAPTOR_COUNTS).flatMap(([family,count])=>
  RAPTOR_DIRECTIONS.flatMap(direction=>Array.from({length:count},(_,frame)=>{
   const key=`${family}/${direction}/${String(frame).padStart(3,"0")}.png`;
   return new Promise<boolean>(resolve=>{
    const img=new Image();cache.set(key,img);
    img.onload=()=>resolve(img.naturalWidth===512&&img.naturalHeight===512);
    img.onerror=()=>{missing.add(key);resolve(false)};
    img.src=`/assets/raptor-v2/${key}`;
   });
  })))).then(results=>results.every(Boolean));
}
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
 // Reuse an existing visual family for unfinished actions; simulation is unchanged.
 const artAction=action==="run"||action==="walk"?"run":"idle";
 const artFrame=Math.floor(state.time*(action==="walk"?6:8))%RAPTOR_COUNTS[artAction];
 const key=`${artAction}/${direction}/${String(artFrame).padStart(3,"0")}.png`;
 let img=cache.get(key);
 if(!img&&!missing.has(key)){
   img=new Image();
   img.onerror=()=>missing.add(key);
   img.src=`/assets/raptor-v2/${key}`;
   cache.set(key,img);
 }
 if(img?.complete&&img.naturalWidth===512&&img.naturalHeight===512){
   const anchor=inventory.frames[key].anchor;
   g.drawImage(img,state.x-anchor[0]*state.scale,state.y-anchor[1]*state.scale,512*state.scale,512*state.scale);
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

