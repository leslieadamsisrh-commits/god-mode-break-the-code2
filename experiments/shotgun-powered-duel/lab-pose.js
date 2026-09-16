import {POSE_FAMILIES} from './lab-pose-data.js';
import {locomotionView,angleDistance} from './combat-lab-space.js';
const cache=new Map(POSE_FAMILIES.map(f=>[f.id,f])),byAction=new Map();
for(const f of POSE_FAMILIES){if(!byAction.has(f.action))byAction.set(f.action,[]);byAction.get(f.action).push(f)}
const aimedFamilies=POSE_FAMILIES.filter(f=>Number.isInteger(f.movementDirection));
 function choose(action,angle,actor){
  const options=byAction.get(action);if(!options?.length)return null;
  let best=options.reduce((a,b)=>angleDistance(a.nominalDirection*Math.PI/12,angle)<=angleDistance(b.nominalDirection*Math.PI/12,angle)?a:b);
  const old=cache.get(actor.poseDirections?.[action]);
  if(old&&angleDistance(old.nominalDirection*Math.PI/12,angle)<angleDistance(best.nominalDirection*Math.PI/12,angle)+Math.PI/36)best=old;
  const records=actor.poseDirections||{};records[action]=best.id;actor.poseDirections=records;return best;
 }

export function selectLabPose(actor,now){
   const motion=locomotionView(actor,now,aimedFamilies);let action=motion.action,index=0,mode=action,item;
   if(action==='dash'){item=choose('run',motion.angle,actor);index=Math.floor((actor.travel%216)/216*(item?.totalFrames||1));mode='upright dash / new art pending';}
   else if(action==='kick'){
    const elapsed=.70-(actor.kickUntil-now);
    if(elapsed<.12){item=choose('cover',motion.angle,actor);index=item?.coverPoses?.kick??5}
    else{item=choose('slide',motion.angle,actor);index=Math.max(2,Math.floor(elapsed/.70*(item?.slideTravelFrames||item?.totalFrames||12)))}
   }
   else if(action==='recovery'){item=choose('slide',motion.angle,actor);index=item?Math.min(item.totalFrames-1,Math.floor(item.totalFrames*.75+(1-(actor.recoveryUntil-now)/.18)*item.totalFrames*.25)):0}
   else item=choose(action,motion.angle,actor);
   if(!item){action='run';item=choose(action,actor.moveFacing??actor.aim,actor);mode+=' · aim-pair missing'}
   if(!item)return null;
   if(['run','strafe-left','strafe-right','backpedal'].includes(action)){
    // A complete two-step cycle remains 216 world pixels regardless of how many
    // drawings this particular direction has. Blocked movement freezes phase.
    index=Math.floor((actor.travel%216)/216*item.totalFrames);
   }else if(action==='slide'){
    const progress=Math.max(0,Math.min(1,actor.slideStartedAt!==undefined?(now-actor.slideStartedAt)/.70:1-(actor.slideUntil-now)/.70));
    index=Math.min((item.slideTravelFrames||item.totalFrames)-1,Math.floor(progress*(item.slideTravelFrames||item.totalFrames)));
   }else if(action==='cover'){
    const poses=item.coverPoses;
    if(poses)index=now<actor.contactUntil?poses.contact[Math.min(poses.contact.length-1,Math.floor((now-actor.contactAt)/.22*poses.contact.length))]:now-(actor.lastShotAt??-100)<.2?poses.fire:actor.peek?poses.peek:now-(actor.peekEndedAt??-100)<.12?poses.return:actor.frameMoved>.05&&poses.lateral?.length?poses.lateral[Math.floor(actor.travel/18)%poses.lateral.length]:poses.brace;
    else index=now<actor.contactUntil?(now-actor.contactAt<.1?0:1):now-(actor.lastShotAt??-100)<.2?4:actor.peek?3:2;
    mode=actor.peek?'peek':'braced';
   }else if(action==='ready')index=Math.floor(now*5)%item.totalFrames;
   index=Math.max(0,Math.min(item.totalFrames-1,index));
   return {family:item.id,catalogId:item.catalogId,frame:index,total:item.totalFrames,sourceRect:[index%item.grid[0]*250,Math.floor(index/item.grid[0])*250,250,250],anchor:item.frameAnchors?.[index]?.map(v=>Math.round(v*250/item.cell[0]))||item.anchor.map(v=>Math.round(v*250/item.cell[0])),muzzle:item.muzzles?.[index],view:item.view+(motion.aimGap?' · independent aim art pending':''),mode,coverage:'view-study'};
}
