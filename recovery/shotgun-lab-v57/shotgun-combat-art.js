import {selectLabPose} from './lab-pose.js';
import {loadShotgunArt as loadApprovedArt} from './shotgun-art.js';
import {locomotionView,angleDistance} from './combat-lab-space.js';
export async function loadShotgunArt({approvedOnly=false,onProgress=()=>{}}={}){
 const approved=approvedOnly?await loadApprovedArt():{select:()=>null,draw(ctx,spec,x,y){ctx.drawImage(spec.bitmap,Math.round(x-spec.anchor[0]),Math.round(y-spec.anchor[1]))}};
 if(approvedOnly)return {...approved,coverageText:'Approved front-right artwork. This comparison retains the expanded arena.',coverage:{mode:'approved-art-comparison'}};
 const response=await fetch('assets/shotgun-complete/manifest.json');
 if(!response.ok)throw Error('Shotgun artwork catalog unavailable');
 const manifest=await response.json();
 const families=manifest.families.filter(f=>f.status==='lab-test');
 const cache=new Map(),byAction=new Map(),lastDirections=new WeakMap();let decodedBytes=0,loaded=0;
 const aimedFamilies=families.filter(f=>Number.isInteger(f.movementDirection));
 // Runtime atlases are prepared at their actual 250px display size. Draw directly
 // from each atlas; do not retain a full-resolution image plus a canvas per frame.
 for(const family of families){
  const im=new Image();im.decoding='async';await new Promise((ok,no)=>{im.onload=ok;im.onerror=()=>no(Error('Cannot load '+family.id));im.src=family.runtimeUrl});
  const size=250;
  const item={...family,bitmap:im,anchor:family.anchor.map(v=>Math.round(v*size/family.cell[0]))};
  cache.set(item.id,item);if(!byAction.has(item.action))byAction.set(item.action,[]);byAction.get(item.action).push(item);
  decodedBytes+=im.width*im.height*4;onProgress(++loaded,families.length);
 }
 function choose(action,angle,actor){
  const options=byAction.get(action);if(!options?.length)return null;
  let best=options.reduce((a,b)=>angleDistance(a.nominalDirection*Math.PI/12,angle)<=angleDistance(b.nominalDirection*Math.PI/12,angle)?a:b);
  const old=cache.get(lastDirections.get(actor)?.[action]);
  if(old&&angleDistance(old.nominalDirection*Math.PI/12,angle)<angleDistance(best.nominalDirection*Math.PI/12,angle)+Math.PI/36)best=old;
  const records=lastDirections.get(actor)||{};records[action]=best.id;lastDirections.set(actor,records);return best;
 }
 return {manifest,coverage:{...manifest.coverage,runtimeFrameBytes:decodedBytes},coverageText:manifest.coverageText,
  select(actor,now){const spec=selectLabPose(actor,now);return spec?{...spec,bitmap:cache.get(spec.family)?.bitmap}:approved.select(actor,now);
  },draw(ctx,spec,x,y){if(spec.sourceRect)ctx.drawImage(spec.bitmap,...spec.sourceRect,Math.round(x-spec.anchor[0]),Math.round(y-spec.anchor[1]),250,250);else approved.draw(ctx,spec,x,y)}
 };
}
