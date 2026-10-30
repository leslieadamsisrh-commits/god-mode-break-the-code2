/** Raptor transparent directional frame runtime. Missing art NEVER claims to be production ready. */
export const DIRECTIONS=["right","front-right","front","front-left","left","back-left","back","back-right"] as const;
export type RaptorDirection=typeof DIRECTIONS[number];
export type RaptorAction="idle"|"walk"|"predator-run"|"slide"|"jump"|"land"|"shoot"|"hit";
export const FRAME_COUNTS:Record<RaptorAction,number>={idle:8,walk:8,"predator-run":12,slide:10,jump:8,land:6,shoot:8,hit:6};
const cache=new Map<string,HTMLImageElement>();
const failed=new Set<string>();
export function raptorFacing(angle:number):RaptorDirection{
 const octant=((Math.round(angle/(Math.PI/4))%8)+8)%8;
 return DIRECTIONS[octant];
}
export function raptorAction(speed:number,sliding:boolean,jumping:boolean,hit:boolean):RaptorAction{
 if(hit)return "hit";if(sliding)return "slide";if(jumping)return "jump";if(speed>155)return "predator-run";if(speed>20)return "walk";return "idle";
}
/** File contract: public/assets/raptor-v37/{action}/{direction}/{000..}.png
 * Each frame is a 512x512 RGBA PNG with ground anchor at (256,450).
 */
export function paintRaptorFrame(g:CanvasRenderingContext2D,action:RaptorAction,direction:RaptorDirection,elapsed:number,scale:number){
 const count=FRAME_COUNTS[action],fps=action==="predator-run"?16:action==="slide"?20:action==="shoot"?12:10;
 const index=Math.floor(elapsed*fps)%count;
 const key=`${action}/${direction}/${String(index).padStart(3,"0")}.png`;
 if(failed.has(key))return false;
 let img=cache.get(key);
 if(!img){img=new Image();img.onload=()=>{};img.onerror=()=>failed.add(key);img.src=`/assets/raptor-v37/${key}`;cache.set(key,img);return false}
 if(!img.complete||!img.naturalWidth)return false;
 if(img.naturalWidth!==512||img.naturalHeight!==512){failed.add(key);return false}
 g.drawImage(img,-256*scale,-450*scale,512*scale,512*scale);
 return true;
}
