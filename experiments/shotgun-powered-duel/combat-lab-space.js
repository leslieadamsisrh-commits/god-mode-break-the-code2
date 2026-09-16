// Presentation coordinates only. Simulation continues in approved pixels/second.
export const LAB_WORLD=Object.freeze({width:2400,height:1800,minX:240,maxX:2160,minY:390,maxY:1490});
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function followCamera(camera,actor,view,dt,snap=false){
 const x=clamp(actor.x-view.width*.5,0,Math.max(0,LAB_WORLD.width-view.width));
 const y=clamp(actor.y-view.height*.62,0,Math.max(0,LAB_WORLD.height-view.height));
 const blend=snap?1:1-Math.exp(-18*dt);
 camera.x+=(x-camera.x)*blend;camera.y+=(y-camera.y)*blend;
}
export const screenToWorld=(point,camera)=>({x:point.x+camera.x,y:point.y+camera.y});
export const worldToScreen=(point,camera)=>({x:point.x-camera.x,y:point.y-camera.y});
export function controllerAim(actor,lastAngle,ax,ay){
 const active=Math.hypot(ax,ay)>.22,angle=active?Math.atan2(ay,ax):lastAngle;
 return {angle,active,x:actor.x+Math.cos(angle)*280,y:actor.y+Math.sin(angle)*280};
}
export const angleDistance=(a,b)=>Math.abs(Math.atan2(Math.sin(a-b),Math.cos(a-b)));
export function locomotionView(actor,now,aimedFamilies=null){
 if(actor.exit)return {action:'dash',angle:actor.moveFacing??actor.aim};
 if(actor.attached)return {action:'cover',angle:actor.aim};
 if(now<actor.kickUntil)return {action:'kick',angle:actor.slideFacing??Math.atan2(actor.vy,actor.vx)};
 if(now<actor.slideUntil)return {action:'slide',angle:actor.slideFacing??Math.atan2(actor.vy,actor.vx)};
 if(now<actor.recoveryUntil&&!actor.moveInput)return {action:'recovery',angle:actor.slideFacing??actor.aim};
 if((actor.frameMoved??Math.hypot(actor.vx,actor.vy))>.04){
  const move=actor.moveFacing??Math.atan2(actor.vy,actor.vx),delta=angleDistance(move,actor.aim);
  if(aimedFamilies){
   // Match both travel and weapon direction. A back-facing aimed gait is not
   // interchangeable with backpedaling while facing the camera.
   const match=aimedFamilies.filter(f=>angleDistance(f.nominalDirection*Math.PI/12,actor.aim)<Math.PI/8&&angleDistance(f.movementDirection*Math.PI/12,move)<Math.PI/8)
    .sort((a,b)=>(angleDistance(a.nominalDirection*Math.PI/12,actor.aim)+angleDistance(a.movementDirection*Math.PI/12,move))-(angleDistance(b.nominalDirection*Math.PI/12,actor.aim)+angleDistance(b.movementDirection*Math.PI/12,move)))[0];
   if(match)return {action:match.action,angle:match.nominalDirection*Math.PI/12};
   return {action:'run',angle:move,aimGap:delta>Math.PI/4};
  }
  // Authored front-aim combinations. Other combinations retain movement-facing
  // anatomy and explicitly report their missing independent-aim artwork.
  if(angleDistance(actor.aim,Math.PI/2)<Math.PI/10){
   if(angleDistance(move,Math.PI)<Math.PI/8)return {action:'strafe-left',angle:Math.PI/2};
   if(angleDistance(move,0)<Math.PI/8)return {action:'strafe-right',angle:Math.PI/2};
   if(angleDistance(move,Math.PI*1.5)<Math.PI/8)return {action:'backpedal',angle:Math.PI/2};
  }
  return {action:'run',angle:move,aimGap:delta>Math.PI/4};
 }
 if(now<actor.recoveryUntil)return {action:'recovery',angle:actor.slideFacing??actor.aim};
 return {action:'ready',angle:actor.aim};
}
