import {relativeWorld46,vertical46} from './bayBridgePresentation';
import {coverMaterial21} from './dimension33Registration21';
import {triangle20} from './dimension33MapArt20';
import {bayObject} from './bayBridgeMap';
// Section materials retain the parent's UV interval, including after detachment.
export function drawSection27j(g:CanvasRenderingContext2D,c:any,t:number,images:Map<string,HTMLImageElement>){
 const w=c.w,h=c.h,z=c.height27j??bayObject(c.artId||c.id)?.dimensions.z??48,co=Math.cos(c.a||0),si=Math.sin(c.a||0),mat=coverMaterial21(images,c);
 const point=(x:number,y:number,height:number)=>{const r=relativeWorld46(c.x,c.y,x*co-y*si,x*si+y*co),v=vertical46(c.x,c.y,height+(c.z||0)+(c.hover||0));return{x:c.x+r.x+v.x,y:c.y+r.y+v.y};};
 const low=[point(-w/2,-h/2,0),point(w/2,-h/2,0),point(w/2,h/2,0),point(-w/2,h/2,0)],top=[point(-w/2,-h/2,z),point(w/2,-h/2,z),point(w/2,h/2,z),point(-w/2,h/2,z)];
 const u0=c.section27j?.u0??0,u1=c.section27j?.u1??1;
 const faces=[{p:[top[0],top[1],low[1],low[0]],top:false,end:false},{p:[top[0],top[3],low[3],low[0]],top:false,end:true},{p:[top[1],top[2],low[2],low[1]],top:false,end:true},{p:[top[3],top[2],low[2],low[3]],top:false,end:false},{p:top,top:true,end:false}];
 g.save();g.beginPath();[[-w/2,-h/2],[w/2,-h/2],[w/2,h/2],[-w/2,h/2]].map(([x,y])=>point(x,y,-(c.hover||0))).forEach((v,n)=>n?g.lineTo(v.x+3,v.y+3):g.moveTo(v.x+3,v.y+3));g.closePath();g.fillStyle='#050c1460';g.fill();const ordered=[...faces.slice(0,4).sort((a,b)=>a.p.reduce((n,v)=>n+v.y,0)-b.p.reduce((n,v)=>n+v.y,0)),faces[4]];for(const face of ordered){g.beginPath();face.p.forEach((v,n)=>n?g.lineTo(v.x,v.y):g.moveTo(v.x,v.y));g.closePath();g.fillStyle=face.top?'#697785':face.end?'#344451':'#53616d';g.fill();
 if(mat&&!face.end){const row=face.top?0:1,uv=[[u0,0],[u1,0],[u1,1],[u0,1]].map(([u,v])=>mat.point(0,row,u,v));for(const idx of [[0,1,2],[0,2,3]])triangle20(g,mat.imageFor(0,row),idx.map(i=>uv[i]),idx.map(i=>face.p[i]));}
 g.strokeStyle=c.reshapePending27j!==undefined?'#9be8ed':'#101923';g.lineWidth=c.reshapePending27j!==undefined?2.2:1.5;g.stroke();}

 // Joint bands are registered in source UV space; fragments retain their own bands.
 const faceY=(Math.cos(c.a||0)>=0?1:-1)*h/2;
 for(const u of [.025,.28,.72,.975]){if(u<u0||u>u1)continue;const x=((u-u0)/(u1-u0)-.5)*w;
  const a=point(x,faceY,z*.08),b=point(x,faceY,z*.94);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.strokeStyle='#182532';g.lineWidth=3;g.stroke();
  const lamp=point(x,faceY,z*.3);g.fillStyle='#efb66d';g.fillRect(lamp.x-1,lamp.y-2,2,4);
 }
 if(c.anchored27j&&!c.section27j){for(const f of [-.22,.22]){const a=point(w*f,faceY,0),b=point(w*f,faceY,z);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.strokeStyle=c.ripOwner27j!==undefined?'#b9eff2':c.selectedRip27j?'#65bac4':'#293c48';g.lineWidth=c.ripOwner27j!==undefined?2:1;g.stroke();}}
 if(c.hp<c.maxHp){const a=point(-w*.2,h/2,z*.8),b=point(w*.1,h/2,z*.35);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.strokeStyle='#15212b';g.lineWidth=2;g.stroke();}
 g.restore();
}
