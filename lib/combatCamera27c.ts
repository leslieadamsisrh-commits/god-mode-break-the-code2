import {arenaPoint46,arenaInverse46,projectWorld} from './bayBridgePresentation';
import {height} from './elevation27a';
import {COMBAT_SURFACES} from './verticalCombat27b';
export type Camera27c={x:number;y:number;zoom:number;ready:boolean;aimX?:number;aimY?:number;supportZ?:number;zoomTarget?:number;opponent?:number};
export const CAMERA27C={hunt:6.7,engage:6.9,clash:7.1,zoomRate:.65,safe:{left:160,right:840,top:105,bottom:510},anchorY:435};
const clamp=(x:number,a:number,b:number)=>Math.max(a,Math.min(b,x));
export function updateCamera27c(c:Camera27c,p:any,players:any[],slot:number,dt:number){
 if(!c.ready){c.aimX=undefined;c.aimY=undefined;c.supportZ=undefined;c.zoomTarget=undefined;c.opponent=undefined;}
 dt=clamp(dt,0,.05);const blend=(rate:number)=>1-Math.exp(-rate*dt),angle=p.gunFacing??p.aim??0;
 c.aimX??=Math.cos(angle);c.aimY??=Math.sin(angle);c.aimX+=(Math.cos(angle)-c.aimX)*blend(2.4);c.aimY+=(Math.sin(angle)-c.aimY)*blend(2.4);
 if(c.opponent===undefined||!players[c.opponent]||players[c.opponent].hp<=0||c.opponent===slot)c.opponent=players.findIndex((q,n)=>n!==slot&&q.hp>0);
 const enemy=players[c.opponent],dist=enemy?Math.hypot(enemy.x-p.x,enemy.y-p.y):Infinity;
 c.zoomTarget??=CAMERA27C.hunt;
 if(dist<125)c.zoomTarget=CAMERA27C.clash;else if(dist>170&&dist<270)c.zoomTarget=CAMERA27C.engage;else if(dist>320)c.zoomTarget=CAMERA27C.hunt;
 c.zoom=c.ready?c.zoom+clamp((c.zoomTarget-c.zoom)*blend(2.2),-CAMERA27C.zoomRate*dt,CAMERA27C.zoomRate*dt):c.zoomTarget;
 const surface=COMBAT_SURFACES.find(s=>s.id===p.supportSurfaceId);
 const groundedZ=p.grounded&&surface?height(surface,p):undefined;
 c.supportZ??=groundedZ??0;if(groundedZ!==undefined)c.supportZ+=(groundedZ-c.supportZ)*blend(4);
 // Grounded support follows terrain; an ordinary jump does not change the anchor.
 const baseZ=c.supportZ,leadX=c.aimX*30,leadY=c.aimY*25,anchorX=500-leadX,anchorY=CAMERA27C.anchorY-leadY;
 const ground=arenaPoint46(p.x,p.y),scale=1000/1536*c.zoom;
 const desired={x:ground.x-(anchorX-500)/scale,y:ground.y-(anchorY-430+baseZ*c.zoom*.64)/scale};
 if(!c.ready){const w=arenaInverse46(desired.x,desired.y);c.x=w.x;c.y=w.y;c.ready=true;}
 const current=arenaPoint46(c.x,c.y),dx=(desired.x-current.x)*scale,dy=(desired.y-current.y)*scale;
 // Dead zone is measured in screen pixels, before perspective inversion.
 const dead=(v:number,r:number)=>Math.sign(v)*Math.max(0,Math.abs(v)-r);
 const next={x:current.x+dead(dx,20)/scale*blend(9),y:current.y+dead(dy,14)/scale*blend(9)};
 let w=arenaInverse46(next.x,next.y);c.x=w.x;c.y=w.y;
 // Keep the entire fighter visible on fast slides and high jumps. No zoom override.
 const feet=projectWorld(p.x,p.y,c,c.zoom,p.z||0),body=78*.82*c.zoom*.64;
 const correctionX=feet.x-clamp(feet.x,CAMERA27C.safe.left,CAMERA27C.safe.right),correctionY=feet.y-clamp(feet.y,CAMERA27C.safe.top+body,CAMERA27C.safe.bottom);
 if(correctionX||correctionY){const at=arenaPoint46(c.x,c.y);w=arenaInverse46(at.x+correctionX/scale,at.y+correctionY/scale);c.x=w.x;c.y=w.y;}
 return c;
}
