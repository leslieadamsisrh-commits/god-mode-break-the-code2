import registration from "../public/assets/jade-guard32/registration.json";
import {ARENA_UPRIGHT_SCALE47, arenaJacobian46, withUpright} from "./bayBridgePresentation";
import {jadeGuardHeading, jadeGuardSpread, jadeShieldRecoil, newJadeShield, JADE_PLATE_HP, JADE_SHIELD_IMPACT, jadeShieldOpening, jadeShieldPlates, jadeShieldWrist, type JadeShield, type ShieldPoint} from "./jadeShield";

type Actor = ShieldPoint & {jadeShield?:JadeShield;charging?:boolean;gunFacing?:number};
type Canvas = CanvasRenderingContext2D;
type Point = {x:number;y:number};

const guardLayers:HTMLImageElement[]=[];
const plateImages:HTMLImageElement[]=[];
const painted=new WeakSet<Actor>();
function preloadGuard(){
 if(guardLayers.length)return;
 for(let i=0;i<3;i++){
  const image=new Image();image.src=`/assets/jade-floating32/plate-${i}.webp`;plateImages.push(image);
 }
 for(const n of [0,7,8]){
  const image=new Image();
  image.src=`/assets/jade-guard32/layer-${n}.webp`;
  guardLayers[n]=image;
 }
}
const mix=(a:Point,b:Point,t:number):Point=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});

function uprightPoint(p:Actor,point:ShieldPoint):Point {
 const j=arenaJacobian46(p.x,p.y),unit=1.536*ARENA_UPRIGHT_SCALE47;
 return {x:p.x+((point.x-p.x)*j.x+(point.y-p.y)*j.xy)/unit,
  y:p.y+(point.y-p.y)*j.y/unit-point.z};
}

export function drawJadeGuardPose(g:Canvas,p:Actor,scale:number,time:number){
 const guard=p.jadeShield;
 if(!guard)return false;
 preloadGuard();
 const opening=jadeShieldOpening(guard,time);
 if(opening<=0||!guardLayers.every(image=>image.complete&&image.naturalWidth))return false;
 const i=jadeGuardHeading(guard.angle);
 const pose=registration.headings[i],unit=88.5/256*scale;
 const x=i%8*320,y=Math.floor(i/8)*296;
 const layer=(n:number)=>g.drawImage(guardLayers[n],x,y,320,296,0,0,320,296);
 const plates=()=>{
  g.save();g.translate(0,p.z);paintGuard(g,p,scale,time);g.restore();
 };
 if(pose.shells_behind_body)plates();
 g.save();g.translate(p.x-160*unit,p.y-264*unit);g.scale(unit,unit);
 layer(0);
 if(i===8)layer(opening<.55?7:8);
 g.restore();
 if(!pose.shells_behind_body)plates();
 painted.add(p);
 return true;
}

function paintGuard(g:Canvas,p:Actor,scale:number,time:number){
 const guard=p.jadeShield;
 if(!guard)return;
 preloadGuard();
 const heading=jadeGuardHeading(guard.angle),opening=jadeShieldOpening(guard,time);
 const wrist=jadeShieldWrist(p,scale,time),anchor=uprightPoint(p,wrist);
 const forward={x:Math.cos(guard.angle),y:Math.sin(guard.angle)};
 for(let i=0;i<3;i++){
  const hp=guard.plates[i],image=plateImages[i];
  if(!hp||!image?.naturalWidth)continue;
  const spread=jadeGuardSpread(opening,[1,0,2][i]);
  if(!spread)continue;
  const kick=guard.hitPlate===i?2*jadeShieldRecoil(guard,time):0;
  const center=uprightPoint(p,{x:wrist.x+forward.x*(11-kick)*scale,y:wrist.y+forward.y*(11-kick)*scale,z:wrist.z-12*scale});
  const size=56/124*scale*spread,at=mix(anchor,center,spread);
  g.save();g.translate(at.x,at.y);g.scale(size,size);
  g.drawImage(image,heading%8*80,Math.floor(heading/8)*128,80,128,-40,-64,80,128);
  if(hp<JADE_PLATE_HP*.7){
   const y=[-33,0,34][i];
   g.strokeStyle="#332538";g.lineWidth=1.8;g.beginPath();g.moveTo(-4,y-5);g.lineTo(1,y-1);g.lineTo(-1,y+1);g.lineTo(4,y+5);g.stroke();
  }
  g.restore();
 }
}

export function drawJadeShield(g:Canvas,p:Actor,scale:number,time:number){
 if(painted.delete(p))return;
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
 withUpright(g,p.x,p.y,()=>{
  g.save();
  paintGuard(g,p,scale,time);
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

export function drawJadeShellDrop(g:Canvas,index:number,angle:number,scale:number,life:number,root:ShieldPoint){
 const phase=Math.min(1,Math.max(0,(.46-life)/.32));
 const guard=newJadeShield(angle);
 guard.active=true;
 guard.plates=guard.plates.map((hp,i)=>i===index?hp*.4:0);
 const actor={...root,jadeShield:guard};
 const shell=jadeShieldPlates(actor,scale,1)[0];
 if(!shell)return;
 const bottom=Math.min(...shell.strips.flatMap(strip=>strip.front.map(v=>v.z-root.z)));
 g.save();
 g.globalAlpha=Math.min(1,life/.12);
 g.translate(-root.x+Math.cos(angle)*8*phase,-root.y+root.z+bottom*phase*phase);
 paintGuard(g,actor,scale,1);
 g.restore();
}
