import {coverCel,drawCoverStage,drawCoverAim} from "./jadeCoverCels";
import {arenaJacobian46,ARENA_UPRIGHT_SCALE47} from "./bayBridgePresentation";
import {screenBearing} from "./plantedWrap";

export const jadeMotionPath = "/assets/jade-motion/pose-atlas.webp";
const cels = {
 tallTuck:{src:[0,0,375,333],foot:[225,306],unit:.285},
 lowTuck:{src:[375,0,375,333],foot:[240,305],unit:.285},
 lowAim:{src:[0,333,375,352],foot:[258,320],unit:.285},
 wristTurn:{src:[375,333,375,352],foot:[181,319],unit:.285},
} as const;
type MotionCel = keyof typeof cels;
type Actor = {x:number;y:number;z?:number};
export type JadeLowAim = {angle:number;rise:number};
type Point = {x:number;y:number};
type Canvas = CanvasRenderingContext2D;
let atlas:HTMLImageElement|undefined;

export function setJadeMotionAtlas(image:HTMLImageElement){atlas=image;}

export function drawJadeMotion(g:Canvas,p:Actor,scale:number,key:MotionCel,side:number,alpha=1){
 if(!atlas||alpha<=0)return false;
 const {src,foot,unit}=cels[key],size=unit*scale;
 g.save();
 g.globalAlpha*=alpha;
 g.translate(p.x,p.y);
 g.scale(side*size,size);
 g.drawImage(atlas,src[0],src[1],src[2],src[3],-foot[0],-foot[1],src[2],src[3]);
 g.restore();
 return true;
}

export function jadeLowRig(p:Actor,aim:JadeLowAim,scale:number){
 const cel=coverCel(p,aim.angle,scale,aim.rise);
 return {socket:cel.socket,barrelBase:{...cel.socket,x:cel.socket.x-Math.cos(aim.angle)*12*scale,y:cel.socket.y-Math.sin(aim.angle)*12*scale}};
}
export function drawJadeLowAim(g:Canvas,p:Actor,aim:JadeLowAim,scale:number,recoil:number,fired=false){
 if(!fired&&aim.rise<.55)return drawCoverStage(g,p,scale,2,aim.rise<.25?0:1,Math.cos(aim.angle)<0);
 return drawCoverAim(g,p,aim.angle,scale,aim.rise,[0,0],recoil);
}
