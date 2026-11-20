import {drawShellMeter} from "./matterLoadArt";
import {projectWorld,bayRenderCamera as camera} from "./bayBridgePresentation";
import {firstShotObstruction, type GameState} from "./game";

type Point={x:number;y:number;z:number};
const hearingRadius=620;
export function hearsInsertion(listener:Point,source:Point){
 return Math.hypot(source.x-listener.x,source.y-listener.y,source.z-listener.z)<=hearingRadius;
}
export class VisorContact {
 held:Record<number,{id?:string;at:number}>={};
 position?:Point;
 observedAt=-Infinity;
 insertedAt=-Infinity;
 reset(){this.held={};this.position=undefined;this.observedAt=this.insertedAt=-Infinity;}
 observe(point:Point,time:number,insert=false){
  this.position={...point};this.observedAt=time;this.insertedAt=insert?time:-Infinity;
 }
}
function slider(g:CanvasRenderingContext2D,x:number,side:number,label:string){
 g.save();g.translate(x,11);g.rotate(-side*.09);
 g.fillStyle="#161322";g.fillRect(-40,-8,80,16);
 g.fillStyle="#806f85";g.fillRect(-39,-7,78,12);
 g.fillStyle="#352c49";g.fillRect(-36,-5,45,10);
 g.fillStyle="#8466b4";g.fillRect(-33,-5,36,8);
 g.fillStyle="#c2a8e5";g.fillRect(-33,-5,36,1);
 for(let i=-28;i<0;i+=5){g.fillStyle="#58416d";g.fillRect(i,-3,2,5);}
 g.fillStyle="#f0ddeb";g.font="bold 8px monospace";g.textAlign="center";g.fillText(label,23,2);
 g.fillStyle="#ce6598";g.fillRect(-37,5,74,1);g.restore();
}
export function drawVisor(g:CanvasRenderingContext2D,s:GameState,slot:number,memory:VisorContact,scanner:boolean){
 const me=s.players[slot],enemy=s.players[1-slot];if(!me)return;
 g.save();
 slider(g,47,1,"POWER");slider(g,953,-1,"RESET");
 for(const [index,p] of [me,enemy].entries()){
  if(!p)continue;
  const x=index?550:89,w=361;
  g.fillStyle="#141421";g.fillRect(x,7,w,18);
  const hp=w*Math.min(1,Math.max(0,p.hp/s.config.maxHealth));
  g.fillStyle=index?"#d177a6":"#72c5cc";g.fillRect(index?x+w-hp:x,20,hp,4);
  g.fillStyle="#f3eaf8";g.font="bold 11px monospace";g.textAlign=index?"right":"left";
  g.fillText(index?p.name:p.character?.toUpperCase()||p.name,index?x+w-4:x+4,17);
 }
 g.textAlign="center";g.font="bold 13px monospace";g.fillStyle="#141421";g.fillRect(457,5,86,21);
 g.fillStyle="#ecebf5";g.fillText(me.score+"  –  "+(enemy?.score??0),500,20);
 const y=223,h=144;
 g.fillStyle="#262331";g.fillRect(3,y-25,53,h+51);g.fillStyle="#766d82";g.fillRect(4,y-24,51,h+47);
 g.fillStyle="#151724";g.fillRect(7,y-21,45,h+41);
 g.fillStyle="#58909d";g.fillText("B",15,y-6);
 const level=h*Math.max(0,Math.min(1,me.battery/100));g.fillStyle="#293c48";g.fillRect(11,y,9,h);
 g.fillStyle="#67e5ee";g.fillRect(11,y+h-level,9,level);
 drawShellMeter(g,37,y,h,me.shells??8,me.shellLoad??0,s.mode==="practice"&&s.rules31?.battery==="unlimited");
 if(scanner&&enemy&&s.phase==="playing"){
  const target={x:enemy.x,y:enemy.y,z:(enemy.z||0)+46};
  const project=(p:Point)=>projectWorld(p.x,p.y,camera,camera.zoom,p.z);
  const screen=project(target),onScreen=screen.x>=0&&screen.x<=1000&&screen.y>=0&&screen.y<=620;
  if(onScreen){
   if(!firstShotObstruction(s,{x:me.x,y:me.y,z:me.z+52},target))memory.observe(target,s.time);
  }else if(memory.position&&s.time-memory.observedAt<2.2){
   const pos=project(memory.position),origin=project({x:me.x,y:me.y,z:me.z+46});
   const angle=Math.atan2(pos.y-origin.y,pos.x-origin.x),dx=Math.cos(angle),dy=Math.sin(angle);
   const distance=Math.min(481/Math.max(.0001,Math.abs(dx)),282/Math.max(.0001,Math.abs(dy)));
   g.translate(500+dx*distance,310+dy*distance);g.rotate(angle);
   g.globalAlpha=Math.max(0,1-(s.time-memory.observedAt)/2.2);
   g.beginPath();g.moveTo(-8,-8);g.lineTo(5,0);g.lineTo(-8,8);
   g.strokeStyle="#141224";g.lineWidth=5;g.stroke();g.strokeStyle="#b2e8e9";g.lineWidth=2;g.stroke();
   if(s.time-memory.insertedAt<.22){g.fillStyle="#77ffff";g.fillRect(-12,-2,9,4);}
  }
 }
 g.restore();
}
