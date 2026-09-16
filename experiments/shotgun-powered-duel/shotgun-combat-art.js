import {selectLabPose} from './lab-pose.js';
import {loadShotgunArt as loadApprovedArt} from './shotgun-art.js';
import {AtlasCache} from './atlas-cache.js';
import {angleDistance} from './combat-lab-space.js';
async function bitmap(url){const r=await fetch(url);if(!r.ok)throw Error('Cannot load '+url);const blob=await r.blob();if(typeof createImageBitmap==='function')return createImageBitmap(blob);const image=new Image(),objectURL=URL.createObjectURL(blob);try{image.src=objectURL;await image.decode();image.close=()=>{image.src=''};return image}finally{URL.revokeObjectURL(objectURL)}}
async function json(url){const r=await fetch(url);if(!r.ok)throw Error('Artwork catalog unavailable');return r.json()}
export function poseAtResolution(spec,image,full){return {...spec,bitmap:image,sourceRect:full?spec.sourceRect:spec.sourceRect.map(v=>v*.5),runtimeResolution:full?250:125}}
export async function loadShotgunArt({approvedOnly=false,onProgress=()=>{}}={}){
 const loadStarted=performance.now();
 if(approvedOnly){const approved=await loadApprovedArt();return {...approved,coverageText:'Approved front-right comparison.',coverage:{mode:'approved-art-comparison'}}}
 const [manifest,streaming]=await Promise.all([json('assets/shotgun-complete/manifest.json'),json('art-streaming/manifest.json')]);
 const families=manifest.families.filter(f=>f.status==='lab-test'),byId=new Map(families.map(f=>[f.id,f])),lowData=new Map(streaming.families.map(f=>[f.id,f])),low=new Map();
 const fullBytes=families.reduce((n,f)=>n+f.grid[0]*f.grid[1]*250*250*4,0);let loaded=0,lowBytes=0,next=0,lowFrames=0,totalFrames=0;
 // The same view and frame remain visible during streaming. Only source
 // resolution changes; anchors, muzzle coordinates and timing stay untouched.
 const workers=Array.from({length:4},async()=>{while(next<families.length){const f=families[next++],entry=lowData.get(f.id);if(!entry||entry.sourceSha256!==f.runtimeSha256)throw Error('Fallback revision mismatch: '+f.id);const im=await bitmap(entry.url);if(im.width!==f.grid[0]*125||im.height!==f.grid[1]*125){im.close?.();throw Error('Fallback grid mismatch: '+f.id)}low.set(f.id,im);lowBytes+=im.width*im.height*4;onProgress(++loaded,families.length)}});
 const loadedWorkers=await Promise.allSettled(workers);const failure=loadedWorkers.find(r=>r.status==='rejected');if(failure){for(const im of low.values())im.close?.();throw failure.reason}
 const high=new AtlasCache({maxBytes:36*1048576,load:async id=>{const f=byId.get(id);if(!f)throw Error('Unknown atlas');const im=await bitmap(f.runtimeUrl);if(im.width!==f.grid[0]*250||im.height!==f.grid[1]*250){im.close?.();throw Error('Full-resolution grid mismatch')}return im}});
 high.pin(['ready-d00','ready-d12']);await Promise.all(['ready-d00','ready-d12'].filter(id=>byId.has(id)).map(id=>high.request(id,0)));
 const startupMs=performance.now()-loadStarted;
 const coverage={...manifest.coverage,get runtimeFrameBytes(){return lowBytes+high.bytes},get streaming(){return {...high.stats(),fallbackBytes:lowBytes,originalDecodedBytes:fullBytes,lowResolutionDraws:lowFrames,totalDraws:totalFrames,startupMs}}};
 let lastHints='';
 return {manifest,coverage,coverageText:manifest.coverageText+' Full-resolution active views stream over matching lower-resolution frames.',
  prepare(actors,now){const specs=actors.filter(p=>p.weapon==='shotgun').map(p=>selectLabPose(p,now)).filter(Boolean),ids=specs.map(s=>s.family);high.pin(ids);for(const id of ids)high.request(id,0);
   const hints=ids.join('|');if(hints===lastHints)return;lastHints=hints;
   for(const spec of specs){const f=byId.get(spec.family);if(!f)continue;const angle=f.nominalDirection*Math.PI/12;const neighbors=families.filter(o=>o.action===f.action).sort((a,b)=>angleDistance(a.nominalDirection*Math.PI/12,angle)-angleDistance(b.nominalDirection*Math.PI/12,angle)).slice(0,3);for(const o of neighbors)high.request(o.id,1);
    for(const action of ['run','slide','cover']){const candidates=families.filter(o=>o.action===action);const closest=candidates.reduce((a,b)=>!a||angleDistance(b.nominalDirection*Math.PI/12,angle)<angleDistance(a.nominalDirection*Math.PI/12,angle)?b:a,null);if(closest)high.request(closest.id,2)}
   }
  },
  select(actor,now){const spec=selectLabPose(actor,now);if(!spec)return null;const full=high.get(spec.family),im=full||low.get(spec.family);return im?poseAtResolution(spec,im,!!full):null;},
  draw(ctx,spec,x,y){totalFrames++;if(spec.runtimeResolution===125)lowFrames++;ctx.drawImage(spec.bitmap,...spec.sourceRect,Math.round(x-spec.anchor[0]),Math.round(y-spec.anchor[1]),250,250)},
  close(){high.close();for(const im of low.values())im.close?.();low.clear()}
 };
}
