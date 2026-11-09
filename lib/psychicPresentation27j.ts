import {drawFracture32} from './fracturePresentation32';
import {RIP_TIME27J} from './psychicMatter27j';
import {coverSupport27h} from './arenaStructures27e';
import {height as supportHeight29} from './elevation27a';
import {relativeWorld46,vertical46} from './bayBridgePresentation';
import {coverMaterial21} from './dimension33Registration21';
import {triangle20} from './dimension33MapArt20';
import {bayObject} from './bayBridgeMap';
export const RAPTOR_TALL_STEEL='raptor-tall-steel';
// Source face landmarks on the isolated 1024×1536 approved prop, expressed
// as fractions so asset resolution is independent of the cover hull.
const tallSteelFaces={
 front:[[273,354],[869,147],[869,1257],[273,1472]],
 end:[[157,325],[268,354],[268,1472],[157,1420]],
 top:[[164,313],[783,95],[862,141],[270,350]]
} as const;
// Section materials retain the parent's UV interval, including after detachment.
export function drawSection27j(g:CanvasRenderingContext2D,c:any,t:number,images:Map<string,HTMLImageElement>){
 if(c.fracture32){drawFracture32(g,c,t);return;}
 const w=c.w,h=c.h,z=c.height27j??bayObject(c.artId||c.id)?.dimensions.z??48,co=Math.cos(c.a||0),si=Math.sin(c.a||0),mat=coverMaterial21(images,c);
 const point=(x:number,y:number,height:number)=>{const r=relativeWorld46(c.x,c.y,x*co-y*si,x*si+y*co),v=vertical46(c.x,c.y,height+(c.z||0)+(c.hover||0));return{x:c.x+r.x+v.x,y:c.y+r.y+v.y};};
 const low=[point(-w/2,-h/2,0),point(w/2,-h/2,0),point(w/2,h/2,0),point(-w/2,h/2,0)],top=[point(-w/2,-h/2,z),point(w/2,-h/2,z),point(w/2,h/2,z),point(-w/2,h/2,z)];
 const u0=c.section27j?.u0??0,u1=c.section27j?.u1??1;
 const steel=images.get(RAPTOR_TALL_STEEL);
 const useSteel=steel?.complete&&steel.naturalWidth>0&&c.coverClass==='tall'&&!c.section27j
  &&!c.psychicHeld&&c.build===0&&!(c.hover>.1)&&c.reshapePending27j===undefined;
 const faces=[{p:[top[0],top[1],low[1],low[0]],top:false,end:false},{p:[top[0],top[3],low[3],low[0]],top:false,end:true},{p:[top[1],top[2],low[2],low[1]],top:false,end:true},{p:[top[3],top[2],low[2],low[3]],top:false,end:false},{p:top,top:true,end:false}];
 g.save();g.beginPath();[[-w/2,-h/2],[w/2,-h/2],[w/2,h/2],[-w/2,h/2]].map(([x,y])=>point(x,y,supportHeight29(coverSupport27h(c),c)-(c.z||0)-(c.hover||0))).forEach((v,n)=>n?g.lineTo(v.x+3,v.y+3):g.moveTo(v.x+3,v.y+3));g.closePath();g.fillStyle='#050c1460';g.fill();const ordered=[...faces.slice(0,4).sort((a,b)=>a.p.reduce((n,v)=>n+v.y,0)-b.p.reduce((n,v)=>n+v.y,0)),faces[4]];for(const face of ordered){g.beginPath();face.p.forEach((v,n)=>n?g.lineTo(v.x,v.y):g.moveTo(v.x,v.y));g.closePath();g.fillStyle=face.top?'#697785':face.end?'#344451':'#53616d';g.fill();
 if(useSteel){
  const points=tallSteelFaces[face.top?'top':face.end?'end':'front'];
  const uv=points.map(([x,y])=>({x:x/1024*steel.naturalWidth,y:y/1536*steel.naturalHeight}));
  g.save();g.clip();
  for(const idx of [[0,1,2],[0,2,3]])triangle20(g,steel,idx.map(i=>uv[i]),idx.map(i=>face.p[i]),.35);
  g.restore();
  // Canvas paths are not part of the saved drawing state. Stroke the
  // physical quad, not the last triangle left by the texture projection.
  g.beginPath();face.p.forEach((v,n)=>n?g.lineTo(v.x,v.y):g.moveTo(v.x,v.y));g.closePath();
 }else if(mat&&!face.end){g.save();g.globalAlpha=c.generated?.32:.62;const row=face.top?0:1,uv=[[u0,0],[u1,0],[u1,1],[u0,1]].map(([u,v])=>mat.point(0,row,u,v));for(const idx of [[0,1,2],[0,2,3]])triangle20(g,mat.imageFor(0,row),idx.map(i=>uv[i]),idx.map(i=>face.p[i]));g.restore();}
 g.strokeStyle=c.reshapePending27j!==undefined?'#9be8ed':'#101923';g.lineWidth=c.reshapePending27j!==undefined?2.2:1.5;g.stroke();}

 // Joint bands are registered in source UV space; fragments retain their own bands.
 const faceY=(Math.cos(c.a||0)>=0?1:-1)*h/2;
 for(const u of useSteel?[]:[.025,.28,.72,.975]){if(u<u0||u>u1)continue;const preparation=c.reshapePending27j!==undefined?Math.sin(Math.min(1,Math.max(0,(t-(c.reshapeAt27j||0))/.24))*Math.PI)*2:0;const x=((u-u0)/(u1-u0)-.5)*w+preparation*(u<.5?1:-1);
  const a=point(x,faceY,z*.08),b=point(x,faceY,z*.94);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.strokeStyle='#182532';g.lineWidth=3;g.stroke();
  const lamp=point(x,faceY,z*.3);g.fillStyle='#efb66d';g.fillRect(lamp.x-1,lamp.y-2,2,4);
 }
 // The selected boundary is exactly the removable central 44%, never the whole parent.
 if(c.anchored27j&&!c.section27j){
  const tearing=c.ripOwner27j!==undefined,active=tearing||c.selectedRip27j;
  const progress=tearing?Math.max(0,Math.min(1,(t-(c.ripAt27j??t))/RIP_TIME27J)):0;
  for(const f of [-.22,.22]){
   g.beginPath();for(let n=0;n<=8;n++){const q=point(w*f+(n%2?1:-1)*progress*1.6,faceY,z*n/8);n?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y);}
   g.strokeStyle=active?'#b9eff2':'#1b2935';g.lineWidth=active?1.8:1;g.stroke();
  }
  if(active){const a=point(-w*.22,faceY,z),b=point(w*.22,faceY,z);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.strokeStyle='#a7edf2';g.lineWidth=1.6;g.stroke();}
 }
 // Ownership is shown only while actively held. A placed neutral piece loses this mark.
 if(c.heldRelation30){
  const tint=c.blocked30?'#efb66d':c.heldRelation30==='local'?'#65efff':'#ff82c2';
  const trace=(coords:number[][])=>{g.beginPath();coords.map(([x,zz])=>point(x,faceY,zz)).forEach((q,n)=>n?g.lineTo(q.x,q.y):g.moveTo(q.x,q.y));g.strokeStyle=tint;g.lineWidth=2;g.stroke();};
  if(c.heldRelation30==='local')for(const sign of [-1,1])trace([[sign*w*.32,z*.28],[sign*w*.4,z*.28],[sign*w*.4,z*.65],[sign*w*.32,z*.65]]);
  else trace([[0,z*.7],[w*.14,z*.46],[0,z*.22],[-w*.14,z*.46],[0,z*.7]]);
  if(c.blocked30)trace([[-w*.14,z*.24],[w*.14,z*.7]]);
 }

 if(c.hp<c.maxHp){const a=point(-w*.2,h/2,z*.8),b=point(w*.1,h/2,z*.35);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.strokeStyle='#15212b';g.lineWidth=2;g.stroke();}
 g.restore();
}
