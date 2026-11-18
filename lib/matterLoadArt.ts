// Draw only loose surface grit. Arena cover and psychic objects keep their collision.
type ChargingFighter={x:number;y:number;gunFacing:number;shellLoad?:number;lastShellAt?:number;charging:boolean};
export function drawMatterLoad(g:CanvasRenderingContext2D,p:ChargingFighter,foot:number,scale:number,time:number,rig:{handX:number;handY:number;portX:number;portY:number}){
 const phase=Math.min(1,(p.shellLoad??0)*2),seat=time-(p.lastShellAt??-10);
 if(!p.charging||(!phase&&seat>.09))return;
 const facing=Math.cos(p.gunFacing),wrist=rig.handX,height=-rig.handY;
 g.save();g.translate(p.x,foot);g.scale(scale,scale);
 for(let i=0;i<12&&phase>0;i++){
  const t=Math.max(0,Math.min(1,(phase-i*.018)/.62)),angle=i*2.399;
  if(t===1)continue;
  const x=Math.cos(angle)*(20+i%4*6)*(1-t)+wrist*t;
  const y=(p.y-foot)/scale+Math.sin(angle)*5;
  g.fillStyle=t>.65?"#ff82c4":i%2?"#babac1":"#827b86";
  g.fillRect(x,y*(1-t)-height*t-8*Math.sin(t*Math.PI),2+i%2,2);
 }
 if(phase>.4||seat<.09){
  const u=seat<.09?1:Math.min(1,Math.max(0,(phase-.62)/.38));
  g.translate(wrist+(rig.portX-wrist)*u,rig.handY+(rig.portY-rig.handY)*u);g.rotate(facing*.75);
  g.globalAlpha=seat<.09?1-seat/.09:Math.min(1,(phase-.4)*8);
  g.fillStyle="#25172d";g.fillRect(-3,-5,6,10);g.fillStyle="#ff4aa8";g.fillRect(-2,-4,4,7);g.fillStyle="#ffd58c";g.fillRect(-3,2,6,2);
 }
 g.restore();
}
export function drawShellMeter(g:CanvasRenderingContext2D,x:number,y:number,height:number,count:number,elapsed:number,unlimited:boolean){
 g.save();g.textAlign="center";g.font="bold 10px monospace";g.fillStyle="#101520ed";g.fillRect(x-15,y-24,30,height+48);
 g.fillStyle="#ffe6f4";g.fillText("AMMO",x,y-10);
 for(let i=0;i<8;i++){
  const top=y+height-(i+1)*height/8+2;
  g.fillStyle="#171522";g.strokeStyle=!unlimited&&i<2&&count<=2?"#ffa645":"#746579";
  g.fillRect(x-5,top,10,15);g.strokeRect(x-5,top,10,15);
  const amount=unlimited||i<count?1:i===count?Math.min(1,elapsed*2):0;
  if(amount){g.fillStyle="#ff63b0";g.fillRect(x-4,top+14-13*amount,8,13*amount);g.fillStyle="#e7b668";g.fillRect(x-5,top+12,10,3);}
 }
 g.font="bold 12px monospace";g.fillStyle=count<=2&&!unlimited?"#ffb868":"#ffe6f4";g.fillText(unlimited?"∞":count+"/8",x,y+height+18);g.restore();
}
