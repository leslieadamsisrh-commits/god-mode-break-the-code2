// The generated directional paintings include a baked neutral checker.
// At load time remove only the neutral region connected to the sheet edge;
// the heroine's light armor stays behind its inked silhouette.
const prepared=new WeakMap<HTMLImageElement,HTMLCanvasElement>();
export function chargeAtlas(img:HTMLImageElement|undefined):HTMLCanvasElement|null{
  if(!img?.complete||!img.naturalWidth)return null;
  const old=prepared.get(img);if(old)return old;
  const canvas=document.createElement('canvas');canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;
  const ctx=canvas.getContext('2d',{willReadFrequently:true});if(!ctx)return null;
  ctx.drawImage(img,0,0);const frame=ctx.getImageData(0,0,canvas.width,canvas.height);
  const {data}=frame,w=canvas.width,h=canvas.height,total=w*h;
  const visited=new Uint8Array(total),queue=new Int32Array(total);let tail=0;
  const neutral=(at:number)=>{const i=at*4,r=data[i],g=data[i+1],b=data[i+2];return r>125&&Math.abs(r-g)<13&&Math.abs(g-b)<13;};
  const push=(at:number)=>{if(!visited[at]&&neutral(at)){visited[at]=1;queue[tail++]=at;}};
  for(let x=0;x<w;x++){push(x);push((h-1)*w+x);}for(let y=0;y<h;y++){push(y*w);push(y*w+w-1);}
  for(let head=0;head<tail;head++){
    const at=queue[head],x=at%w,y=(at-x)/w;
    if(x>0)push(at-1);if(x<w-1)push(at+1);if(y>0)push(at-w);if(y<h-1)push(at+w);
    data[at*4+3]=0;
  }
  ctx.putImageData(frame,0,0);prepared.set(img,canvas);return canvas;
}

// 24 aim directions: right, front, left, back, and the turns between them.
// The source paintings have seven columns per row and extra turning studies.
const views=[0,1,2,7,8,9,10,11,12,13,14,15,16,17,18,19,21,22,23,24,25,26,27,6];
const rows=[0,282,552,810,1024];
export function drawChargePose(ctx:CanvasRenderingContext2D,img:HTMLImageElement|undefined,angle:number,time:number){
  const atlas=chargeAtlas(img);if(!atlas)return;
  const direction=((Math.round(angle/(Math.PI*2)*24)%24)+24)%24;
  const cell=views[direction],col=cell%7,row=Math.floor(cell/7),sx=Math.round(col*atlas.width/7),ex=Math.round((col+1)*atlas.width/7);
  const sy=rows[row],sh=rows[row+1]-sy;
  const pulse=1+Math.sin(time*17)*.018;
  ctx.drawImage(atlas,sx,sy,ex-sx,sh,-44*pulse,-92*pulse,88*pulse,92*pulse);
}
