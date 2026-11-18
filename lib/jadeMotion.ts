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

const shoulder={x:166,y:96};
const breech={x:229,y:101};
const muzzle={x:337,y:91};
const arm=[[179,100],[198,87],[231,83],[344,75],[348,112],[303,117],[272,151],[235,154],[211,144],[180,133]];
const cellAxis=Math.atan2(muzzle.y-breech.y,muzzle.x-breech.x);

export function jadeLowRig(p:Actor,aim:JadeLowAim,spriteScale:number){
 const bearing=screenBearing(p,aim.angle),side=Math.cos(bearing)<0?-1:1;
 const visibleAngle=side===1?bearing:Math.atan2(Math.sin(bearing),-Math.cos(bearing));
 const rotation=visibleAngle-cellAxis,size=cels.lowAim.unit*spriteScale;
 const [fx,fy]=cels.lowAim.foot;
 const lift=(1-aim.rise)*18*spriteScale;
 const base={x:(shoulder.x-fx)*side*size,y:(shoulder.y-fy)*size+lift};
 const cos=Math.cos(rotation),sin=Math.sin(rotation);
 const transform=(point:Point)=>({x:base.x+((point.x-shoulder.x)*cos-(point.y-shoulder.y)*sin)*size*side,
  y:base.y+((point.x-shoulder.x)*sin+(point.y-shoulder.y)*cos)*size});
 // Barrel tilt follows the floor bearing. Convert its lower receiver height into
 // one shared world height and retain the rendered planar direction.
 const from=transform(breech),tip=transform(muzzle);
 const j=arenaJacobian46(p.x,p.y),unit=1.536*ARENA_UPRIGHT_SCALE47;
 const height=(fy-breech.y)*size-lift;
 function socket(a:Point){
  const dy=(a.y+height)*unit/j.y;
  return {x:p.x+(a.x*unit-j.xy*dy)/j.x,y:p.y+dy,z:(p.z??0)+height};
 }
 return {side,rotation,size,base,barrelBase:socket(from),socket:socket(tip)};
}

export function drawJadeLowAim(g:Canvas,p:Actor,aim:JadeLowAim,scale:number,recoil:number,fired=false){
 if(!atlas)return false;
 const rig=jadeLowRig(p,aim,scale);
 const {src,foot}=cels.lowAim;
 if(!fired&&aim.rise<.22)return drawJadeMotion(g,p,scale,"lowTuck",rig.side);
 const mask=()=>{arm.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();};
 g.save();
 g.translate(p.x,p.y);g.scale(rig.side*rig.size,rig.size);g.translate(-foot[0],-foot[1]);
 const hip=194;
 // The crouch-to-rise shifts the shoulders while the authored lower body remains grounded.
 g.drawImage(atlas,src[0],src[1]+hip,src[2],src[3]-hip,0,hip,src[2],src[3]-hip);
 g.translate(0,(1-aim.rise)*18*scale/rig.size);
 g.beginPath();g.rect(0,0,src[2],hip);mask();g.clip("evenodd");
 g.drawImage(atlas,src[0],src[1],src[2],hip,0,0,src[2],hip);
 g.restore();
 g.save();
 const bearing=screenBearing(p,aim.angle);
 g.translate(p.x+rig.base.x-Math.cos(bearing)*recoil*2,p.y+rig.base.y-Math.sin(bearing)*recoil*2);
 g.scale(rig.side*rig.size,rig.size);g.rotate(rig.rotation);g.translate(-shoulder.x,-shoulder.y);
 g.beginPath();mask();g.clip();g.drawImage(atlas,...src,0,0,src[2],src[3]);
 g.restore();
 return true;
}
