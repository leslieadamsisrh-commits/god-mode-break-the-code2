/** Faceted, camera-facing quarter shield. Face opacity stays low so Jade is visible. */
const prepared=new WeakMap<HTMLImageElement,HTMLCanvasElement>();
function transparentShield(img:HTMLImageElement){
  if(prepared.has(img))return prepared.get(img)!;
  const canvas=document.createElement('canvas');canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;
  const context=canvas.getContext('2d',{willReadFrequently:true})!;context.drawImage(img,0,0);
  const pixels=context.getImageData(0,0,canvas.width,canvas.height),data=pixels.data;
  // Keep the rim crisp while lowering alpha on the broad pale-pink glass.
  // The source sprites have genuine alpha; preserve their silhouette exactly.
  for(let i=0;i<data.length;i+=4){const r=data[i],g=data[i+1],a=data[i+3];
    if(a>0&&r>g&&r-g<105)data[i+3]=Math.min(a,Math.max(65,(r-g)*1.45));
  }
  context.putImageData(pixels,0,0);prepared.set(img,canvas);return canvas;
}

export function drawCrystalShield(ctx:CanvasRenderingContext2D,angle:number,integrity:number,time:number,impact:{x:number;y:number},sprites?:Array<HTMLImageElement|undefined>){
  const direction=((Math.round(angle/(Math.PI/12))%24)+24)%24;
  const img=direction<=3?sprites?.[direction]:undefined;
  const useSprite=!!img?.complete&&!!img.naturalWidth;
  // Match the raised palm: lift the glass from Jade's boot line and keep
  // the forward muzzle clear. Apply the same offset to art and damage mask.
  ctx.save();ctx.translate(0,-48);
  if(useSprite){
    // Art is independently drawn for each view. Only the shield's attachment
    // follows aim; its face pixels are never rotated or mirrored.
    ctx.save();ctx.translate(Math.cos(angle)*39,Math.sin(angle)*39);ctx.globalAlpha=.84;
    const source=transparentShield(img!);
    ctx.drawImage(source,-35,-40,80,80);ctx.restore();
  }
  ctx.rotate(angle);ctx.translate(39,0);ctx.scale(80/90,80/90);
  const shape=()=>{ctx.beginPath();ctx.moveTo(-5,-37);ctx.quadraticCurveTo(31,-42,37,0);ctx.quadraticCurveTo(31,42,-5,37);ctx.quadraticCurveTo(14,17,16,0);ctx.quadraticCurveTo(14,-17,-5,-37);ctx.closePath();};
  if(!useSprite){shape();ctx.fillStyle='rgba(251,105,190,.095)';ctx.fill();}
  ctx.save();shape();ctx.clip();
  // A second, offset surface reads as crystal thickness instead of a flat decal.
  ctx.strokeStyle=useSprite?'rgba(250,213,244,.13)':'rgba(250,213,244,.34)';ctx.lineWidth=1.1;ctx.beginPath();ctx.moveTo(-1,-34);ctx.quadraticCurveTo(36,-32,41,0);ctx.quadraticCurveTo(36,32,-1,34);ctx.stroke();
  ctx.lineWidth=.75;ctx.strokeStyle=useSprite?'rgba(255,208,241,.17)':'rgba(255,208,241,.55)';
  for(let row=-3;row<4;row++)for(let col=-2;col<4;col++){
    const x=col*18+(row%2?9:0),y=row*18,r=10;
    ctx.beginPath();for(let n=0;n<6;n++){const a=Math.PI*n/3,xp=x+Math.cos(a)*r,yp=y+Math.sin(a)*r;n?ctx.lineTo(xp,yp):ctx.moveTo(xp,yp);}ctx.closePath();ctx.stroke();
  }
  ctx.fillStyle=useSprite?'rgba(255,225,247,.01)':'rgba(255,225,247,.06)';for(let n=0;n<5;n++){ctx.beginPath();ctx.moveTo(16,n*17-35);ctx.lineTo(37,n*13-29);ctx.lineTo(22,n*13-19);ctx.closePath();ctx.fill();}
  if(integrity<1){
    const damage=Math.round((1-integrity)*4),x=impact.x,y=impact.y;
    ctx.strokeStyle='rgba(255,246,253,.88)';ctx.lineWidth=1.2;ctx.shadowColor='#ff73cb';ctx.shadowBlur=6;
    for(let n=0;n<damage*3;n++){const a=n*Math.PI*2/(damage*3),reach=9+damage*5+(n%3)*3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(a)*reach*.53,y+Math.sin(a)*reach*.53);ctx.lineTo(x+Math.cos(a+.16)*reach,y+Math.sin(a+.16)*reach);ctx.stroke();}
  }
  ctx.restore();
  if(!useSprite){ctx.shadowColor='#ff7fd5';ctx.shadowBlur=9+Math.sin(time*8)*2;ctx.lineWidth=2.5;ctx.strokeStyle='rgba(255,181,231,.91)';shape();ctx.stroke();}ctx.restore();
}
