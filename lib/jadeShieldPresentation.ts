import {ARENA_UPRIGHT_SCALE47,arenaJacobian46,vertical46} from "./bayBridgePresentation";
import {JADE_PLATE_HP,JADE_SHIELD_FOLD,JADE_SHIELD_IMPACT,jadeShieldPlates,jadeShieldWrist,type JadeShield,type ShieldPoint} from "./jadeShield";

type Actor=ShieldPoint & {jadeShield?:JadeShield};
type Canvas=CanvasRenderingContext2D;
function project(p:ShieldPoint){const offset=vertical46(p.x,p.y,p.z);return {x:p.x+offset.x,y:p.y+offset.y};}

let glovePose:HTMLImageElement|undefined;
export const jadeGuardPosePath="/assets/jade-shield/glove-guard.webp";

export function drawJadeGuardPose(g:Canvas,p:Actor,scale:number,time:number){
 const guard=p.jadeShield;
 if(!guard)return false;
 if(!glovePose){glovePose=new Image();glovePose.src=jadeGuardPosePath;}
 if(!glovePose.complete||!glovePose.naturalWidth)return false;
 const fold=guard.active?1:Math.max(0,1-(time-guard.closedAt)/JADE_SHIELD_FOLD);
 if(fold<=0)return false;
 const socket=jadeShieldWrist(p,scale),j=arenaJacobian46(p.x,p.y),unit=1.536*ARENA_UPRIGHT_SCALE47;
 const dx=socket.x-p.x,dy=socket.y-p.y,x=(dx*j.x+dy*j.xy)/unit;
 const hit=3.5*scale*Math.max(0,1-(time-guard.hitAt)/JADE_SHIELD_IMPACT);
 const y=dy*j.y/unit-(socket.z-p.z);
 const side=x<0?-1:1;
 const size=.105*scale,rootX=774,rootY=982,wristX=1080,wristY=356;
 const waist=p.y-39*scale,artWristX=(wristX-rootX)*size,artWristY=p.y+(wristY-rootY)*size;
 const armSpan=waist-artWristY;
 const shift=Math.max(-20,Math.min(12,Math.abs(x)-artWristX-hit));
 const stretch=Math.max(.8,Math.min(1.12,(waist-(p.y+y))/armSpan));
 const paint=()=>g.drawImage(glovePose!,p.x-rootX*size,p.y-rootY*size,1536*size,1024*size);
 g.save();g.globalAlpha*=Math.min(1,fold*2);
 g.translate(p.x,0);g.scale(side,1);g.translate(-p.x,0);
 g.save();g.beginPath();g.rect(p.x-140,waist,280,150);g.clip();paint();g.restore();
 g.save();g.translate(0,waist);g.transform(1,0,-shift/armSpan,stretch,0,0);g.translate(0,-waist);
 g.beginPath();g.rect(p.x-140,waist-160,280,160);g.clip();paint();g.restore();
 g.restore();
 return true;
}

export function drawJadeShield(g:Canvas,p:Actor,scale:number,time:number){
 const guard=p.jadeShield;
 if(!guard)return;
 const plates=jadeShieldPlates(p,scale,time);
 const broken=guard.plates.every(hp=>hp<=0);
 const ready=time-guard.readyAt<.46;
 if(!plates.length&&!broken&&!guard.chargeProgress&&!ready)return;
 const wrist=project(jadeShieldWrist(p,scale)),jacobian=arenaJacobian46(p.x,p.y);
 const point=(x:number,y:number)=>({x:wrist.x+x/jacobian.x-y*jacobian.xy/(jacobian.x*jacobian.y),y:wrist.y+y/jacobian.y});
 // An upright cyan emitter marks the shared wrist socket.
 const center=point(0,0);
 g.save();
 g.fillStyle=plates.length||ready?"#8ef7ff":"#234750";
 g.strokeStyle="#10121d";
 g.lineWidth=2;
 g.beginPath();g.ellipse(center.x,center.y,4.1/jacobian.x,4.1/jacobian.y,0,0,Math.PI*2);g.fill();g.stroke();
 for(let i=0;i<3;i++){
  const position=point(i*5-5,7);
  g.fillStyle=ready||(i+1)/3<=guard.chargeProgress?"#ff66b7":"#574059";
  if(guard.chargeProgress||ready||broken)g.fillRect(position.x-1.8/jacobian.x,position.y,3.6/jacobian.x,2.5/jacobian.y);
 }
 for(const plate of plates.sort((a,b)=>a.center.y-b.center.y)){
  const points=plate.vertices.map(project),contact=guard.hitPlate===plate.index&&time-guard.hitAt<JADE_SHIELD_IMPACT;
  const [a,b,c,d,e,f,h,j]=points;
  g.beginPath();for(const [i,q] of points.entries())i?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y);
  g.closePath();g.fillStyle=contact?"#6c4969":plate.index===1?"#354052":"#2b3448";g.fill();
  g.strokeStyle="#10101b";g.lineWidth=2.7;g.stroke();
  g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.lineTo(c.x,c.y);g.lineTo(d.x,d.y);g.lineTo(e.x,e.y);
  g.strokeStyle=contact?"#ffd5ed":plate.hp<JADE_PLATE_HP*.45?"#b04180":"#ff67b7";
  g.lineWidth=1.05;g.stroke();
  g.beginPath();g.moveTo(j.x,j.y);g.lineTo(h.x,h.y);g.lineTo(f.x,f.y);
  g.strokeStyle="#718297";g.lineWidth=1;g.stroke();
  if(plate.hp<JADE_PLATE_HP*.7){
   g.beginPath();g.moveTo(j.x,j.y);g.lineTo((j.x+d.x)*.5,(j.y+d.y)*.5);
   g.lineTo((e.x+d.x)*.5,(e.y+d.y)*.5);g.strokeStyle="#141624";g.stroke();
  }
 }
 g.restore();
}

export function drawJadePlateImpact(g:Canvas,life:number,broken:boolean){
 const age=1-Math.min(1,life/JADE_SHIELD_IMPACT);
 g.save();
 g.globalAlpha=(1-age)*.95;g.lineWidth=2;
 g.strokeStyle=broken?"#ff88c4":"#ffeace";
 g.beginPath();
 for(let i=0;i<8;i++){
  const angle=i*Math.PI/4,r=(i%2?5:13)*(1-age*.45);
  g.moveTo(0,0);g.lineTo(Math.cos(angle)*r,Math.sin(angle)*r);
 }
 g.stroke();g.fillStyle="#fff0de";g.fillRect(-1.6,-1.6,3.2,3.2);
 for(let i=0;i<(broken?9:4);i++){
  const angle=(i+1)*2.399,d=3+age*(18+i%3*9);
  const x=Math.cos(angle)*d,y=Math.sin(angle)*d+age*age*14;
  g.fillStyle=i%3===0?"#ff69b7":"#8996b1";
  g.beginPath();g.moveTo(x,y);g.lineTo(x+4,y+1);g.lineTo(x+1,y+4);g.fill();
 }
 g.restore();
}
