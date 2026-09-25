/** Directional shield hold keyframes, cropped at the authored figure breaks. */
const prepared=new WeakMap<HTMLImageElement,HTMLCanvasElement>();
function cleanDiagonalSheet(img:HTMLImageElement){
  const old=prepared.get(img);if(old)return old;
  const canvas=document.createElement('canvas');canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;
  const ctx=canvas.getContext('2d',{willReadFrequently:true})!;ctx.drawImage(img,0,0);
  const frame=ctx.getImageData(0,0,canvas.width,canvas.height),data=frame.data,w=canvas.width,h=canvas.height;
  const seen=new Uint8Array(w*h),queue=new Int32Array(w*h);let tail=0;
  const neutral=(at:number)=>{const k=at*4,r=data[k],g=data[k+1],b=data[k+2];return r>65&&Math.abs(r-g)<10&&Math.abs(g-b)<10;};
  const push=(at:number)=>{if(!seen[at]&&neutral(at)){seen[at]=1;queue[tail++]=at;}};
  for(let x=0;x<w;x++){push(x);push((h-1)*w+x);}for(let y=0;y<h;y++){push(y*w);push(y*w+w-1);}
  for(let head=0;head<tail;head++){
    const at=queue[head],x=at%w,y=(at-x)/w;
    if(x>0)push(at-1);if(x<w-1)push(at+1);if(y>0)push(at-w);if(y<h-1)push(at+w);
    data[at*4+3]=0;
  }
  ctx.putImageData(frame,0,0);prepared.set(img,canvas);return canvas;
}
export function drawShieldPose(ctx:CanvasRenderingContext2D,cardinal:HTMLImageElement|undefined,diagonal:HTMLImageElement|undefined,angle:number,intermediate?:HTMLImageElement){
  const fineDirection=((Math.round(angle/(Math.PI/12))%24)+24)%24;
  if((fineDirection===1||fineDirection===2)&&intermediate?.complete&&intermediate.naturalWidth){
    const source=cleanDiagonalSheet(intermediate),cell=intermediate.naturalWidth/2,frame=fineDirection-1,scale=.092;
    ctx.drawImage(source,Math.round(cell*frame),0,Math.round(cell),intermediate.naturalHeight,-cell*scale/2,-77,cell*scale,intermediate.naturalHeight*scale);
    return true;
  }
  const direction=((Math.round(angle/(Math.PI/4))%8)+8)%8;
  const img=direction%2?diagonal:cardinal;if(!img?.complete||!img.naturalWidth)return false;
  const frame=Math.floor(direction/2),source=direction%2?cleanDiagonalSheet(img):img;
  const breaks=direction%2?[0,543,1086,1629,2172]:[0,605,987,1540,2172],ratio=img.naturalWidth/2172;
  const sx=Math.round(breaks[frame]*ratio),ex=Math.round(breaks[frame+1]*ratio),w=(ex-sx)*.125,h=img.naturalHeight*.125;
  ctx.drawImage(source,sx,0,ex-sx,img.naturalHeight,-w/2,-78,w,h);
  return true;
}

// Reuse the approved shield-hold artwork as two small opposing foot layers.
// The torso stays braced and the authored equipment stays untouched.
const marchFrames=new Map<string,HTMLCanvasElement>();
export function drawShieldMarch(ctx:CanvasRenderingContext2D,cardinal:HTMLImageElement|undefined,diagonal:HTMLImageElement|undefined,angle:number,intermediate:HTMLImageElement|undefined,travel:number,recoil=0){
  const direction=((Math.round(angle/(Math.PI/12))%24)+24)%24;
  const sheet=direction===1||direction===2?intermediate:Math.round(direction/3)%2?diagonal:cardinal;
  if(!sheet||!sheet.complete||!sheet.naturalWidth)return false;
  const key=`${direction}:${sheet.src}`;
  let frame=marchFrames.get(key);
  if(!frame){frame=document.createElement('canvas');frame.width=128;frame.height=136;
    const pen=frame.getContext('2d');if(!pen)return false;
    pen.translate(64,105);
    if(!drawShieldPose(pen,cardinal,diagonal,angle,intermediate))return false;
    marchFrames.set(key,frame);
  }
  const beat=Math.sin(travel/21),stride=3.1*beat,lift=1.8*Math.max(0,beat);
  for(const side of [-1,1]){
    ctx.save();ctx.beginPath();ctx.rect(side<0?-64:0,-40,64,58);ctx.clip();
    ctx.translate(side*stride,side<0?-lift:-1.8*Math.max(0,-beat));
    ctx.drawImage(frame,-64,-105);ctx.restore();
  }
  ctx.save();ctx.beginPath();ctx.rect(-64,-105,128,73);ctx.clip();
  ctx.translate(-Math.cos(angle)*recoil*3,-Math.sin(angle)*recoil*3);
  ctx.drawImage(frame,-64,-105);ctx.restore();
  return true;
}
