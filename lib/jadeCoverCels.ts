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
 // Rotate the connected upper body around the hips between authored headings.
 const keyAngle=Math.PI/2-heading*Math.PI/4;
 const bearing=(a:number)=>Math.atan2(j.y*Math.sin(a),j.x*Math.cos(a)+j.xy*Math.sin(a));
 const delta=bearing(angle)-bearing(keyAngle),turn=Math.atan2(Math.sin(delta),Math.cos(delta));
 const hip=85,armX=(mx-fx)*size,armY=(my-hip)*size;
 const dx=armX*Math.cos(turn)-armY*Math.sin(turn)+offsetX;
 const height=(fy-hip)*size-armX*Math.sin(turn)-armY*Math.cos(turn)-lift;
 const dy=offsetY;
 // Calibrate the low pop-up to a level shouldered gun across the turn.
 // Invert the drawn muzzle pixel at that elevation to recover its floor depth.
 const low=lean[0]===0&&lean[1]===0;
 const reach=low?(62*scale-lift-height)*unit/j.y:Math.sin(angle)*22*scale;
 const worldY=dy*unit/j.y+reach;
 const socket={x:p.x+(dx*unit-j.xy*worldY)/j.x,y:p.y+worldY,z:(p.z??0)+height+reach*j.y/unit};
 return {heading,size,fx,fy,offsetX,offsetY,lift,turn,hip,socket};
}
export function drawCoverAim(g:CanvasRenderingContext2D,p:Actor,angle:number,scale:number,rise:number,lean:readonly number[],kick:number){
 if(!aimImage)return false;
 const c=coverCel(p,angle,scale,rise,lean);
 g.save();g.translate(p.x,p.y);
 const sx=c.heading%4*160,sy=Math.floor(c.heading/4)*160;
 const hipY=(c.hip-c.fy)*c.size;
 const x=c.offsetX-Math.cos(angle)*kick*2*scale,y=c.offsetY+c.lift;
 const left=-c.fx*c.size;
 // Flex the legs from the planted sole. Both pieces share the hip position
 // and tangent at their seam; stock, hands and helmet move as one rigid unit.
 g.save();g.transform(Math.cos(c.turn),Math.sin(c.turn),x/hipY,(hipY+y)/hipY,0,0);
 g.drawImage(aimImage,sx,sy+c.hip,160,160-c.hip,left,hipY,160*c.size,(160-c.hip)*c.size);g.restore();
 g.translate(x,hipY+y);g.rotate(c.turn);
 g.drawImage(aimImage,sx,sy,160,c.hip,left,-c.hip*c.size,160*c.size,c.hip*c.size);
 g.restore();return true;
}
const boots=[[70,140],[103,140],[109,140],[112,140],[60,138],[45,138],[39,138],[38,138],[108,144],[105,144],[113,144],[114,144]];
export function drawCoverStage(g:CanvasRenderingContext2D,p:Actor,scale:number,row:number,stage:number,flip=false){
 if(!coverImage)return false;
 const [fx,fy]=boots[row*4+stage],size=.59*scale;
 g.save();g.translate(p.x,p.y);g.scale(flip?-size:size,size);
 g.drawImage(coverImage,stage*160,row*160,160,160,-fx,-fy,160,160);g.restore();return true;
}

// Measured support glove and loading port in each 160px full-body cell.
const reloadHands=[[82,61,82,55],[103,61,98,55],[126,59,113,54],[121,57,111,53],
 [58,57,62,54],[36,54,53,52],[43,56,57,54],[48,57,60,54]];
export function jadeLoadRig(angle:number){
 const h=((Math.round((Math.PI/2-angle)*4/Math.PI)%8)+8)%8;
 const [gx,gy,rx,ry]=reloadHands[h],unit=.58;
 return {h,gx,gy,rx,ry,unit,handX:(gx-80)*unit,handY:(gy-150)*unit,portX:(rx-80)*unit,portY:(ry-150)*unit};
}
export function drawLoadPose(g:CanvasRenderingContext2D,p:Actor,foot:number,angle:number,scale:number,phase:number,seatAge:number){
 if(!aimImage)return false;
 const {h,gx,gy,rx,unit}=jadeLoadRig(angle),sx=h%4*160,sy=Math.floor(h/4)*160;
 const reach=seatAge<.09?1-seatAge/.09:Math.max(0,Math.min(1,(phase-.62)/.38));
 g.save();g.translate(p.x-80*unit*scale,foot-150*unit*scale);g.scale(unit*scale,unit*scale);
 // Keep the gun and shoulder fixed. Move the support glove with the attached sleeve.
 const top=gy-4,bottom=gy+10,left=gx-16,right=gx+16;
 g.drawImage(aimImage,sx,sy,160,top,0,0,160,top);
 for(let y=top;y<bottom;y++){
  const move=(rx-gx)*reach*Math.max(0,1-Math.abs(y-gy)/10);
  const stops=[0,left,gx,right,160],dest=[0,left,gx+move,right,160];
  for(let i=0;i<4;i++)g.drawImage(aimImage,sx+stops[i],sy+y,stops[i+1]-stops[i],1,dest[i],y,dest[i+1]-dest[i],1);
 }
 g.drawImage(aimImage,sx,sy+bottom,160,160-bottom,0,bottom,160,160-bottom);g.restore();return true;
}
