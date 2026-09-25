// Soft contact is drawn from a footprint in floor coordinates. The falloff
// stays attached to the model as it moves or turns and has no long hard oval.
export function drawContactShadow(ctx:CanvasRenderingContext2D,x:number,y:number,w:number,d:number,angle=0){
  ctx.save();ctx.translate(x,y+3);ctx.rotate(angle);
  const radius=Math.min(7,d*.24);
  ctx.fillStyle='#040914';ctx.globalAlpha=.32;ctx.filter='blur(9px)';
  ctx.beginPath();ctx.roundRect(-w*.53,-d*.52,w*1.06,d*1.04,radius);ctx.fill();
  ctx.filter='blur(3px)';ctx.globalAlpha=.16;
  ctx.beginPath();ctx.roundRect(-w*.47,-d*.44,w*.94,d*.88,radius);ctx.fill();
  ctx.restore();
}
