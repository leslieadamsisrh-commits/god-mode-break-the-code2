import {ARENA_UPRIGHT_SCALE47, arenaJacobian46, withUpright} from "./bayBridgePresentation";
import {JADE_PLATE_HP, JADE_SHIELD_FOLD, JADE_SHIELD_IMPACT, JADE_SHIELD_UNFOLD, jadeShieldWrist, type JadeShield, type ShieldPoint} from "./jadeShield";

type Actor = ShieldPoint & {jadeShield?:JadeShield};
type Canvas = CanvasRenderingContext2D;

let glovePose: HTMLImageElement | undefined;
export const jadeGuardPosePath = "/assets/jade-shield/glove-guard.webp";
const poseRegistration = {rootX:774, rootY:982, cuffX:1104, cuffY:351, width:1536, height:1024, unit:.105};

function bearing(p:Actor, angle:number){
 const j=arenaJacobian46(p.x,p.y);
 const x=Math.cos(angle), y=Math.sin(angle);
 return Math.atan2(j.y*y,j.x*x+j.xy*y);
}

function guardOpening(guard:JadeShield,time:number){
 const age=guard.active ? (time-guard.openedAt)/JADE_SHIELD_UNFOLD : 1-(time-guard.closedAt)/JADE_SHIELD_FOLD;
 return Math.max(0,Math.min(1,age));
}

export function drawJadeGuardPose(g:Canvas,p:Actor,scale:number,time:number){
 const guard=p.jadeShield;
 if(!guard)return false;
 if(!glovePose){glovePose=new Image();glovePose.src=jadeGuardPosePath;}
 if(!glovePose.complete||!glovePose.naturalWidth||(!guard.active&&guardOpening(guard,time)<=0))return false;
 const side=Math.cos(bearing(p,guard.angle))<0?-1:1;
 const {rootX,rootY,width,height,unit}=poseRegistration;
 const size=unit*scale;
 // The same full cel is foot-registered in either facing. No torso or head deformation.
 g.save();
 g.translate(p.x,p.y);
 g.scale(side,1);
 g.drawImage(glovePose,-rootX*size,-rootY*size,width*size,height*size);
 g.restore();
 return true;
}

type PlatePath = {shape:Path2D; seam:Path2D; edge:Path2D; accent:Path2D};
function makePlates():PlatePath[]{
 return [
  {
   shape:new Path2D("M 6 -15 L 6 -29 C 21 -26 34 -13 37 -2 C 24 -11 14 -15 6 -15 Z"),
   seam:new Path2D("M 7 -27 C 21 -25 32 -13 36 -3"),
   edge:new Path2D("M 8 -16 C 18 -15 28 -10 36 -3"),
   accent:new Path2D("M 11 -24 L 20 -20"),
  },
  {
   shape:new Path2D("M -1 -15 C 13 -15 28 -9 37 -2 C 38 2 37 8 35 12 C 24 4 10 1 -1 2 Z"),
   seam:new Path2D("M 0 -14 C 13 -14 28 -8 36 -2"),
   edge:new Path2D("M 0 1 C 11 1 25 5 34 11"),
   accent:new Path2D("M 7 -9 C 11 -8 15 -7 18 -6"),
  },
  {
   shape:new Path2D("M 2 2 C 14 2 27 7 35 12 C 33 19 28 24 24 26 C 16 25 9 29 2 31 Z"),
   seam:new Path2D("M 3 4 C 15 4 26 8 34 13"),
   edge:new Path2D("M 33 17 C 31 21 28 24 24 25"),
   accent:new Path2D("M 9 22 L 19 18"),
  }
 ];
}
let platePaths:PlatePath[]|undefined;

export function drawJadeShield(g:Canvas,p:Actor,scale:number,time:number,usesGuardPose:boolean){
 const guard=p.jadeShield;
 if(!guard)return;
 const opening=guardOpening(guard,time);
 const broken=guard.plates.every(hp=>hp<=0),ready=time-guard.readyAt<.46;
 if(opening<=0&&!broken&&!guard.chargeProgress&&!ready)return;
 const angle=bearing(p,guard.angle),side=Math.cos(angle)<0?-1:1;
 const j=arenaJacobian46(p.x,p.y),unit=1.536*ARENA_UPRIGHT_SCALE47;
 const socket=jadeShieldWrist(p,scale),dx=socket.x-p.x,dy=socket.y-p.y;
 const {rootX,rootY,cuffX,cuffY}=poseRegistration;
 const wristX=usesGuardPose?side*(cuffX-rootX)*poseRegistration.unit*scale:(dx*j.x+dy*j.xy)/unit;
 const wristY=usesGuardPose?(cuffY-rootY)*poseRegistration.unit*scale:dy*j.y/unit-(socket.z-p.z);

 withUpright(g,p.x,p.y,()=>{
  g.save();
  g.translate(p.x+wristX,p.y-p.z+wristY);
  g.scale(side*scale,scale);
  if(opening>0&&!broken){
   const spread=1-(1-opening)**3+.075*Math.sin(Math.PI*opening);
   // Tilt and narrow only the shield artwork as it turns. Preserve its curved face in profile.
   g.save();
   g.rotate(side*Math.sin(angle)*.24);
   g.scale(spread*(.70+.30*Math.abs(Math.cos(angle))),spread);
   const plates=platePaths??=makePlates();
   for(const index of [0,2,1]){
    const hp=guard.plates[index];
    if(hp<=0)continue;
    const plate=plates[index],age=time-guard.hitAt;
    const hit=guard.hitPlate===index&&age>=0&&age<JADE_SHIELD_IMPACT?1-age/JADE_SHIELD_IMPACT:0;
    g.save();
    g.translate(-hit*2.5,(index-1)*(1-opening)*12);
    g.lineJoin="round";g.lineCap="round";
    const shade=g.createLinearGradient(2,-26,33,29);
    shade.addColorStop(0,hit>.55?"#665271":"#46506a");
    shade.addColorStop(.55,index===1?"#30394e":"#293247");
    shade.addColorStop(1,"#171d2b");
    g.fillStyle=shade;g.fill(plate.shape);
    g.strokeStyle="#10101a";g.lineWidth=2.15;g.stroke(plate.shape);
    g.strokeStyle="#95f0f5";g.lineWidth=.84;g.stroke(plate.seam);
    g.strokeStyle="#546477";g.lineWidth=.9;g.stroke(plate.edge);
    g.strokeStyle=hit>.55?"#ffd4ee":hp<JADE_PLATE_HP*.45?"#bd427b":"#ff62b0";
    g.lineWidth=1.3;g.stroke(plate.accent);
    if(hp<JADE_PLATE_HP*.7){
     g.save();g.clip(plate.shape);
     const y=[-18,-3,17][index];
     g.beginPath();g.moveTo(36,y-3);g.lineTo(23,y);g.lineTo(19,y-4);g.lineTo(13,y+2);
     g.strokeStyle="#121321";g.lineWidth=1.15;g.stroke();g.restore();
    }
    g.restore();
   }
   g.restore();
  }
  // The cyan clip sits directly on the authored glove cuff.
  g.lineJoin="round";g.lineWidth=1.65;
  g.fillStyle=ready||opening>0&&!broken?"#82ecf9":"#29464f";g.strokeStyle="#131420";
  g.beginPath();g.roundRect(-4,-4,8,8,2);g.fill();g.stroke();
  for(let i=0;i<3;i++){
   if(guard.chargeProgress||ready||broken){
    g.fillStyle=ready||(i+1)/3<=guard.chargeProgress?"#ff66b7":"#574059";
    g.fillRect(i*4-5,6,2.7,1.9);
   }
  }
  g.restore();
 });
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
