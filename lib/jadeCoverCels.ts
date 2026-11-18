import {arenaJacobian46,ARENA_UPRIGHT_SCALE47} from "./bayBridgePresentation";

type Actor={x:number;y:number;z?:number};
export const coverCelPath="/assets/jade-combat/cover.webp";
export const aimCelPath="/assets/jade-combat/aim.webp";
let coverImage:HTMLImageElement,aimImage:HTMLImageElement;
export function setCoverCels(image:HTMLImageElement){coverImage=image;}
export function setAimCels(image:HTMLImageElement){aimImage=image;}
// Socket and support-boot coordinates are in 160px atlas cells.
const tips=[[83,51],[120,47],[150,48],[146,48],[48,49],[27,48],[12,50],[23,51]];
const soles=[[116,151],[121,150],[114,150],[103,150],[111,151],[110,151],[110,151],[108,151]];
export function coverCel(p:Actor,angle:number,scale:number,rise:number,lean:readonly number[]=[0,0]){
 const heading=((Math.round((Math.PI/2-angle)*4/Math.PI)%8)+8)%8;
 const size=.57*scale,j=arenaJacobian46(p.x,p.y),unit=1.536*ARENA_UPRIGHT_SCALE47;
 const [right,fy]=soles[heading],[mx,my]=tips[heading];
 const left=[49,49,54,53,47,50,48,47][heading];
 const fx=lean[0]>1?left:right;
 const offsetX=(j.x*lean[0]+j.xy*lean[1])/unit,offsetY=j.y*lean[1]/unit;
 const lift=(1-rise)*18*scale;
 const height=(fy-my)*size-lift;
 const dx=(mx-fx)*size+offsetX,dy=offsetY;
 // Calibrate the low pop-up to a level shouldered gun across the turn.
 // Invert the drawn muzzle pixel at that elevation to recover its floor depth.
 const low=lean[0]===0&&lean[1]===0;
 const reach=low?(62*scale-lift-height)*unit/j.y:Math.sin(angle)*22*scale;
 const worldY=dy*unit/j.y+reach;
 const socket={x:p.x+(dx*unit-j.xy*worldY)/j.x,y:p.y+worldY,z:(p.z??0)+height+reach*j.y/unit};
 return {heading,size,fx,fy,offsetX,offsetY,lift,socket};
}
export function drawCoverAim(g:CanvasRenderingContext2D,p:Actor,angle:number,scale:number,rise:number,lean:readonly number[],kick:number){
 if(!aimImage)return false;
 const c=coverCel(p,angle,scale,rise,lean);
 g.save();g.translate(p.x,p.y);
 const height=(c.fy-tips[c.heading][1])*c.size;
 g.transform(1,0,(-c.offsetX+Math.cos(angle)*kick)/height,1-(c.offsetY+c.lift)/height,0,0);
 g.drawImage(aimImage,c.heading%4*160,Math.floor(c.heading/4)*160,160,160,-c.fx*c.size,-c.fy*c.size,160*c.size,160*c.size);
 g.restore();return true;
}
const boots=[[70,140],[103,140],[109,140],[112,140],[60,138],[45,138],[39,138],[38,138],[108,144],[105,144],[113,144],[114,144]];
export function drawCoverStage(g:CanvasRenderingContext2D,p:Actor,scale:number,row:number,stage:number,flip=false){
 if(!coverImage)return false;
 const [fx,fy]=boots[row*4+stage],size=.59*scale;
 g.save();g.translate(p.x,p.y);g.scale(flip?-size:size,size);
 g.drawImage(coverImage,stage*160,row*160,160,160,-fx,-fy,160,160);g.restore();return true;
}
