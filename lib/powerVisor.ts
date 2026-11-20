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
type Vertex = [number, number];
function panel(g:CanvasRenderingContext2D, points:Vertex[], color:string) {
 g.beginPath();
 points.forEach(([x,y],i)=>i ? g.lineTo(x,y) : g.moveTo(x,y));
 g.closePath(); g.fillStyle=color; g.fill();
 g.strokeStyle="#1a1626"; g.lineWidth=2; g.stroke();
}
function brow(g:CanvasRenderingContext2D) {
 // Draw the sculpted halves around the score window on the fixed 1000-wide canvas.
 for (const side of [1,-1]) {
  g.save(); g.translate(side===1?0:1000,0); g.scale(side,1);
  panel(g,[[0,2],[24,1],[42,8],[68,0],[415,0],[437,8],[467,8],[480,22],[463,37],[64,37],[49,49],[9,48],[0,39]],"#776b83");
  panel(g,[[4,28],[16,4],[31,0],[41,7],[47,20],[30,27]],"#7051a4");
  for(let x=15;x<=34;x+=5){g.strokeStyle="#483264";g.lineWidth=2;g.beginPath();g.moveTo(x,22);g.lineTo(x+5,7);g.stroke();}
  panel(g,[[48,16],[66,9],[426,9],[451,14],[458,22],[448,30],[62,30],[49,34]],"#151622");
  g.fillStyle="#b4a3ba";g.fillRect(72,2,341,2); g.restore();
 }
 panel(g,[[454,1],[546,1],[553,15],[540,33],[460,33],[447,15]],"#84758d");
 panel(g,[[464,7],[536,7],[542,15],[534,27],[466,27],[458,15]],"#181824");
}
function resources(g:CanvasRenderingContext2D,s:GameState,slot:number) {
 const p=s.players[slot], unlimited=s.mode==="practice"&&s.rules31?.battery==="unlimited";
 const count=p.shells??8;
 panel(g,[[4,41],[16,32],[45,32],[55,42],[55,187],[44,198],[13,198],[4,188]],"#75687f");
 panel(g,[[11,49],[17,42],[43,42],[48,47],[48,178],[43,189],[16,189],[11,184]],"#191925");
 g.fillStyle="#223b45";g.fillRect(17,49,25,32);
 const height=32*Math.max(0,Math.min(1,p.battery/100));
 g.fillStyle="#62e4e9";g.fillRect(17,81-height,25,height);
 for(let row=1;row<4;row++){g.fillStyle="#284351";g.fillRect(17,49+row*8,25,1);}
 for(let i=0;i<8;i++){
  const x=16+(i%2)*15,y=91+Math.floor(i/2)*17;
  g.fillStyle="#615466";g.fillRect(x,y,13,13);g.fillStyle="#292430";g.fillRect(x+1,y+1,11,11);
  const fill=unlimited||i<count?1:i===count?Math.min(1,(p.shellLoad??0)*2):0;
  if(fill>0){g.fillStyle="#fa60a7";g.fillRect(x+1,y+12-11*fill,11,11*fill);}
 }
 g.fillStyle=count<=2&&!unlimited?"#ffba75":"#83eeec";g.font="bold 13px monospace";g.textAlign="center";g.fillText(unlimited?"∞":count+"/8",30,178);
}
export function drawVisor(g:CanvasRenderingContext2D,s:GameState,slot:number,memory:VisorContact,scanner:boolean){
 const me=s.players[slot],enemy=s.players[1-slot];if(!me)return;
 g.save();brow(g);
 for(const [i,p] of [me,enemy].entries()){
  if(!p)continue;
  const x=i?565:162,w=273,filled=w*Math.max(0,Math.min(1,p.hp/s.config.maxHealth));
  g.fillStyle="#36303e";g.fillRect(x,14,w,11);
  g.fillStyle=i?"#ff6cac":"#69e5e2";g.fillRect(i?x+w-filled:x,14,filled,11);
  g.fillStyle="#242234";for(let offset=10;offset<w;offset+=10)g.fillRect(x+offset,14,1,11);
  g.font="bold 12px monospace";g.textAlign=i?"right":"left";g.fillStyle=i?"#ffc2df":"#b3fffa";
  g.fillText((i?p.name:p.character||p.name).toUpperCase(),i?946:54,24,104);
 }
 g.textAlign="center";g.font="bold 14px monospace";g.fillStyle="#ecebf5";g.fillText(me.score+" – "+(enemy?.score??0),500,22);
 resources(g,s,slot);
 if(scanner){
  panel(g,[[760,33],[957,33],[951,48],[944,57],[773,57],[764,50]],"#75687f");
  panel(g,[[771,37],[945,37],[940,51],[777,51]],"#191822");
 }
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
   g.font="bold 12px monospace";g.textAlign="center";g.fillStyle="#ffbe65";
   const arrows=["→","↘","↓","↙","←","↖","↑","↗"];
   const arrow=arrows[(Math.round(angle/(Math.PI/4))+8)%8];
   g.globalAlpha=Math.min(1,(2.2-(s.time-memory.observedAt))*3);
   g.fillText((memory.insertedAt===memory.observedAt?"RELOAD HEARD ":"LAST SEEN ")+arrow,857,48);
   g.translate(500+dx*distance,310+dy*distance);g.rotate(angle);
   g.globalAlpha=Math.max(0,1-(s.time-memory.observedAt)/2.2);
   g.beginPath();g.moveTo(-8,-8);g.lineTo(5,0);g.lineTo(-8,8);
   g.strokeStyle="#141224";g.lineWidth=5;g.stroke();g.strokeStyle="#b2e8e9";g.lineWidth=2;g.stroke();
   if(s.time-memory.insertedAt<.22){g.fillStyle="#77ffff";g.fillRect(-12,-2,9,4);}
  }
 }
 g.restore();
}
