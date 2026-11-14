import {COMBAT_SURFACES} from "./arenaStructures27e";
import {height,inside} from "./elevation27a";
import {vertical46,withWorld46} from "./bayBridgePresentation";

type Charge = {charging?:boolean;chargeAge?:number;godCharge?:number;powerFlash?:number;powerReturn?:number};
type Actor = Charge & {x:number;y:number;z:number;hp:number;character?:string;vx?:number;vy?:number;supportSurfaceId?:string|null};
type Mark = {x:number;y:number;z:number;surface:string;born:number;heats:{at:number;heat:number}[];kind:number};
type Trail = {active:boolean;last?:Mark;marks:Mark[]};

const spacing=22;
const hotSeconds=.85;
const markLimit=96;

export function jadeChargeFrame(actor:Charge,duration:number):number|null{
 if(actor.charging){
  const q=actor.godCharge??0,age=actor.chargeAge??0;
  if(q<.12)return 0;
  if(q<.32)return 1;
  if(q<.55)return 2;
  if(q<.8)return 3;
  if(q<.93)return 4;
  const peakAge=Math.max(0,age-.35-duration*.93);
  return [5,3,5,4][Math.floor(peakAge*15)%4];
 }
 if((actor.powerFlash??0)>0)return actor.powerFlash!>.28?6:7;
 if((actor.powerReturn??0)>0)return actor.powerReturn!>.11?6:7;
 return null;
}

export function drawJadeChargeLayer(g:CanvasRenderingContext2D,atlas:HTMLImageElement,frame:number,x:number,y:number,scale:number,opacity:number){
 const unit=scale*.68;
 g.save();
 g.globalAlpha*=opacity;
 g.drawImage(atlas,frame%4*240,Math.floor(frame/4)*256,240,256,x-120*unit,y-225*unit,240*unit,256*unit);
 g.restore();
}

function beneath(actor:Actor,x:number,y:number){
 const point={x,y};
 const surface=COMBAT_SURFACES.find(s=>s.id===actor.supportSurfaceId&&inside(point,s))
  ?? COMBAT_SURFACES.filter(s=>s.walkable&&inside(point,s)&&height(s,point)<=actor.z+1)
   .sort((a,b)=>height(b,point)-height(a,point))[0];
 return surface?{surface:surface.id,z:height(surface,point)}:null;
}

export class JadeChargeTrails {
 private trails:Trail[]=[];
 private serial=0;
 private time=-Infinity;

 update(players:Actor[],time:number){
  if(time<this.time){this.trails=[];this.serial=0;}
  if(time===this.time)return;
  this.time=time;
  players.forEach((actor,index)=>{
   const trail=this.trails[index]??={marks:[],active:false};
   if(actor.character==="raptor"||actor.hp<=0||!actor.charging){
    trail.active=false;trail.last=undefined;return;
   }
   const root=beneath(actor,actor.x,actor.y);
   if(!root)return;
   const heat=.15+(actor.godCharge??0)*.6;
   const stamp=(x:number,y:number,ignition:boolean)=>{
    const floor=beneath(actor,x,y);
    if(!floor)return;
    const earlier=trail.marks.findLast(m=>m.surface===floor.surface&&Math.hypot(m.x-x,m.y-y)<spacing*.54);
    const mark=earlier??{...floor,x,y,born:time,heats:[],kind:ignition?0:1+(this.serial++%2)};
    if(!earlier){trail.marks.push(mark);if(trail.marks.length>markLimit)trail.marks.shift();}
    const previous=mark.heats.at(-1);
    if(!previous||time-previous.at>=.12){
     mark.heats.push({at:time,heat:Math.min(1,Math.max(heat,(previous?.heat??0)*.95)+.1)});
     while(mark.heats.length>1&&time-mark.heats[1].at>3.9)mark.heats.shift();
    }
    return mark;
   };
   if(!trail.active||!trail.last||trail.last.surface!==root.surface){
    trail.last=stamp(actor.x,actor.y,!trail.active);trail.active=true;return;
   }
   const from=trail.last,distance=Math.hypot(actor.x-from.x,actor.y-from.y);
   if(distance>spacing*8){trail.last=stamp(actor.x,actor.y,false);return;}
   for(let d=spacing;d<=distance;d+=spacing){
    const ratio=d/distance;
    trail.last=stamp(from.x+(actor.x-from.x)*ratio,from.y+(actor.y-from.y)*ratio,false)??trail.last;
   }
   if(distance<spacing*.54||Math.hypot(actor.vx??0,actor.vy??0)<4)
    trail.last=stamp(actor.x,actor.y,false)??trail.last;
  });
 }

 draw(g:CanvasRenderingContext2D,atlas:HTMLImageElement,time:number,elevated:boolean){
  for(const trail of this.trails)for(const mark of trail.marks){
   if(mark.born>time||(mark.surface!=="ground")!==elevated)continue;
   const event=mark.heats.findLast(h=>h.at<=time);
   if(!event)continue;
   const surface=COMBAT_SURFACES.find(s=>s.id===mark.surface);
   if(!surface)continue;
   withWorld46(g,mark.x,mark.y,()=>{
    g.beginPath();
    surface.polygon.forEach((p,index)=>{
     const offset=vertical46(p.x,p.y,height(surface,p));
     if(index===0)g.moveTo(p.x+offset.x,p.y+offset.y);else g.lineTo(p.x+offset.x,p.y+offset.y);
    });
    g.closePath();g.clip();
    const offset=vertical46(mark.x,mark.y,mark.z);
    g.translate(mark.x+offset.x,mark.y+offset.y);
    if(surface.rise){
     const slope=(surface.rise.high-surface.rise.low)/(surface.rise.to-surface.rise.from);
     const v=vertical46(mark.x,mark.y,slope);
     if(surface.rise.axis==="x")g.transform(1+v.x,v.y,0,1,0,0);
     else g.transform(1,0,v.x,1+v.y,0,0);
    }
    const hot=Math.max(0,1-(time-event.at)/hotSeconds);
    const crack=mark.kind===0;
    const w=crack?112:66,h=crack?78:49;
    const paint=(frame:number,alpha:number)=>{
     g.globalAlpha=alpha;
     g.drawImage(atlas,frame%3*256,Math.floor(frame/3)*144,256,144,-w/2,-h/2,w,h);
    };
    paint(crack?2:5,crack ? .9 : .78);
    if(hot>.01)paint(crack?(time-mark.born<.23?0:1):mark.kind+2,hot*event.heat);
   });
  }
 }
}
