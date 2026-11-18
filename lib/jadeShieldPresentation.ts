import {drawJadeMotion} from "./jadeMotion";
import {ARENA_UPRIGHT_SCALE47, arenaJacobian46, withUpright} from "./bayBridgePresentation";
import {JADE_PLATE_HP, JADE_SHIELD_IMPACT, jadeShieldOpening, jadeShieldPlates, jadeShieldRecoil, jadeShieldWrist, type JadeShield, type ShieldPoint} from "./jadeShield";

type Actor = ShieldPoint & {jadeShield?:JadeShield;charging?:boolean;gunFacing?:number};
type Canvas = CanvasRenderingContext2D;
type Point = {x:number;y:number};

let glovePose: HTMLImageElement | undefined;
export const jadeGuardPosePath = "/assets/jade-shield/glove-guard.webp";
// Keep the helmet-to-floor distance at the shotgun-ready cel's 88½ upright units.
const guardArt = {rootX:774, rootY:982, cuffX:1104, cuffY:351, shoulderX:926, shoulderY:372, unit:.093};
const mix=(a:Point,b:Point,t:number):Point=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});

function uprightPoint(p:Actor,point:ShieldPoint):Point {
 const j=arenaJacobian46(p.x,p.y),unit=1.536*ARENA_UPRIGHT_SCALE47;
 return {x:p.x+((point.x-p.x)*j.x+(point.y-p.y)*j.xy)/unit,
  y:p.y+(point.y-p.y)*j.y/unit-point.z};
}

export function drawJadeGuardPose(g:Canvas,p:Actor,scale:number,time:number){
 const guard=p.jadeShield;
 if(!guard)return false;
 if(!glovePose){glovePose=new Image();glovePose.src=jadeGuardPosePath;}
 const opening=jadeShieldOpening(guard,time);
 if(!glovePose.complete||!glovePose.naturalWidth||opening<.10)return false;
 const cuff=uprightPoint(p,jadeShieldWrist(p,scale,time));
 const side=cuff.x<p.x?-1:1;
 const {rootX,rootY,cuffX,cuffY,shoulderX,shoulderY,unit}=guardArt;
 if(opening<.47&&drawJadeMotion(g,p,scale,"wristTurn",side))return true;
 const size=unit*scale;
 const shoulder={x:p.x+side*(shoulderX-rootX)*size,y:p.y+(shoulderY-rootY)*size};
 const wrist={x:p.x+side*(cuffX-rootX)*size,y:p.y+(cuffY-rootY)*size};
 const turn=Math.atan2(cuff.y+(p.z||0)-shoulder.y,cuff.x-shoulder.x)
  -Math.atan2(wrist.y-shoulder.y,wrist.x-shoulder.x);
 const arm=[[922,328],[976,336],[1010,355],[1050,337],[1066,289],[1121,225],[1230,232],[1233,340],[1168,408],[1065,447],[965,435]];
 const clipArm=()=>{arm.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();};
 g.save();
 g.translate(p.x,p.y);g.scale(side*size,size);g.translate(-rootX,-rootY);
 g.beginPath();g.rect(0,0,1536,1024);clipArm();g.clip("evenodd");
 g.drawImage(glovePose,0,0,1536,1024);
 g.restore();
 g.save();
 // Rigid rotation keeps the glove silhouette intact while the cuff follows the physics socket.
 const dx=wrist.x-shoulder.x,dy=wrist.y-shoulder.y;
 g.translate(cuff.x-dx*Math.cos(turn)+dy*Math.sin(turn),
  cuff.y+p.z-dx*Math.sin(turn)-dy*Math.cos(turn));g.rotate(turn);
 g.scale(side*size,size);g.translate(-shoulderX,-shoulderY);
 g.beginPath();clipArm();g.clip();g.drawImage(glovePose,0,0,1536,1024);
 g.restore();
 return true;
}

function paintPlate(g:Canvas,corners:Point[],hp:number,index:number,hit:number,scale:number){
 g.beginPath();corners.forEach((v,i)=>i?g.lineTo(v.x,v.y):g.moveTo(v.x,v.y));g.closePath();
 const [start,,high,far,tip,,,inner]=corners;
 const top=mix(start,high,.5),bottom=mix(tip,inner,.72);
 const shade=g.createLinearGradient(bottom.x,bottom.y,top.x,top.y);
 shade.addColorStop(0,"#171d2b");shade.addColorStop(.53,hit>.55?"#665271":index===1?"#38435c":"#2e364b");
 shade.addColorStop(1,"#535e79");
 g.lineJoin="round";g.fillStyle=shade;g.fill();g.lineWidth=1.65*scale;g.strokeStyle="#10101a";g.stroke();
 g.save();g.clip();
 const a=mix(start,inner,.36),b=mix(high,bottom,.27);
 const mid=mix(mix(start,high,.56),bottom,.24);
 g.beginPath();g.moveTo(a.x,a.y);g.quadraticCurveTo(mid.x,mid.y,b.x,b.y);
 g.strokeStyle=hit>.55?"#ffd4ee":hp<JADE_PLATE_HP*.45?"#b73c77":"#ff65b5";
 g.lineWidth=1.45*scale;g.stroke();
 g.beginPath();g.moveTo(start.x,start.y);g.lineTo(high.x,high.y);g.lineTo(far.x,far.y);
 g.strokeStyle="#92e7ef";g.lineWidth=1.25*scale;g.stroke();
 if(hp<JADE_PLATE_HP*.7){
  const d=mix(a,b,.63),e=mix(far,bottom,.6);
  g.beginPath();g.moveTo(a.x,a.y);g.lineTo(d.x,d.y+3*scale);g.lineTo(d.x,d.y);g.lineTo(e.x,e.y);
  g.strokeStyle="#131422";g.lineWidth=1.15*scale;g.stroke();
 }
 g.restore();
}

export function drawJadeShield(g:Canvas,p:Actor,scale:number,time:number){
 const guard=p.jadeShield;
 if(!guard)return;
 const opening=jadeShieldOpening(guard,time);
 const broken=guard.plates.every(hp=>hp<=0),ready=time-guard.readyAt<.46;
 if(opening<=0&&!broken&&!guard.chargeProgress&&!ready)return;
 const guardWrist=uprightPoint(p,jadeShieldWrist(p,scale,time));
 const side=Math.cos(p.gunFacing??guard.angle)<0?-1:1;
 // During recharge and recovery the shoulder is back in the power/ready art.
 // Keep the cuff light low on that pose instead of leaving it at guard height.
 const restWrist={x:p.x+side*(p.charging?-16:24)*scale,y:p.y-p.z-(p.charging?22:62)*scale};
 const wrist=mix(restWrist,guardWrist,Math.min(1,opening*3));
 const plates=jadeShieldPlates(p,scale,time);
 withUpright(g,p.x,p.y,()=>{
  g.save();
  const first=plates.find(plate=>plate.index===1)??plates[0];
  if(first){
   // A cyan link gathers along the forearm first, then stays under surviving plates.
   const elbow={x:p.x+(wrist.x-p.x)*.52,y:wrist.y+8*scale};
   const anchor=uprightPoint(p,first.vertices[0]);
   const trail=mix(wrist,elbow,Math.min(1,opening*3));
   g.beginPath();g.moveTo(trail.x,trail.y);g.lineTo(wrist.x,wrist.y);g.lineTo(anchor.x,anchor.y);
   g.strokeStyle="#203b53";g.lineWidth=5*scale;g.lineCap="round";g.stroke();
   g.strokeStyle="#72edfa";g.lineWidth=1.55*scale;g.stroke();
  }
  for(const plate of plates){
   const hit=guard.hitPlate===plate.index?jadeShieldRecoil(guard,time):0;
   paintPlate(g,plate.vertices.map(vertex=>uprightPoint(p,vertex)),plate.hp,plate.index,hit,scale);
  }
  g.translate(wrist.x,wrist.y);g.scale(scale,scale);
  g.lineJoin="round";g.lineWidth=1.65;
  g.fillStyle=ready||opening>0&&!broken?"#82ecf9":"#29464f";g.strokeStyle="#131420";
  g.beginPath();g.roundRect(-4,-4,8,8,2);g.fill();g.stroke();
  if(guard.chargeProgress||ready||broken)for(let i=0;i<3;i++){
   g.fillStyle=ready||(i+1)/3<=guard.chargeProgress?"#ff66b7":"#574059";
   g.fillRect(i*4-5,6,2.7,1.9);
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
