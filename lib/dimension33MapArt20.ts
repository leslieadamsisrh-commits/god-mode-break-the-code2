import frames from './dimension33Frames20.json';
import {arenaPoint46,arenaJacobian46,relativeWorld46,vertical46,withWorld46,withUpright} from './bayBridgePresentation';
import {bayObject,BAY_DEPTH_DOMAINS} from './bayBridgeMap';
import {D33_SCENERY21} from './dimension33Registration21';

type Images=Map<string,HTMLImageElement>;
type Point={x:number;y:number};
export const D33_ATLASES20=['architecture','concrete','concrete-corrections','industrial','props','floor','skyline','destruction'] as const;
export const d33ImageKey20=(name:string)=>'d33-map20-'+name;
function frame20(images:Images,key:string){
 const f=(frames as any)[key],im=f&&images.get(d33ImageKey20(f.atlas));
 return f&&im?.complete&&im.naturalWidth?{f,im}:null;
}
export function artRevision20(images:Images){return D33_ATLASES20.reduce((n,k)=>n+(images.get(d33ImageKey20(k))?.naturalWidth||0),0);}

// One common affine mapping for artwork, floor sampling, and authoritative hulls.
function triangle20(g:CanvasRenderingContext2D,im:CanvasImageSource,src:Point[],dst:Point[]){
 const [a,b,d]=src,[A,B,D]=dst,ux=b.x-a.x,uy=b.y-a.y,vx=d.x-a.x,vy=d.y-a.y,det=ux*vy-vx*uy;
 if(Math.abs(det)<.00001)return;
 const xx=((B.x-A.x)*vy-(D.x-A.x)*uy)/det,xy=((D.x-A.x)*ux-(B.x-A.x)*vx)/det;
 const yx=((B.y-A.y)*vy-(D.y-A.y)*uy)/det,yy=((D.y-A.y)*ux-(B.y-A.y)*vx)/det;
 g.save();g.beginPath();dst.forEach((p,n)=>n?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.closePath();g.clip();
 g.transform(xx,yx,xy,yy,A.x-xx*a.x-xy*a.y,A.y-yx*a.x-yy*a.y);g.drawImage(im,0,0);g.restore();
}

function coverKey20(c:any){
 if(/^war-shelter-[ab]$/.test(c.id))return 'concrete-corrections/tall-slab-intact';
 if(/^d33-center-(?:nw|ne|sw|se)$/.test(c.id))return 'destruction/barrier-a';
 if(/^d33-(?:nw|ne|sw|se)-primary$/.test(c.id))return 'destruction/barrier-a';
 if(/^d33-(?:west|east)-(?:north|south)-flank$/.test(c.id))return 'concrete/barrier-b-front';
 if(/^d33-(?:north|south)-(?:west|east)-step$/.test(c.id))return 'concrete-corrections/half-wall-front';
 if(/^d33-(?:west|east)-(?:north|south)-node$/.test(c.id))return 'props/utility-cabinet';
 return null;
}
export function drawMapCover20(g:CanvasRenderingContext2D,images:Images,c:any){
 // Directional art has not been verified for rotating/held structures. Keep their renderer.
 if(c.hp<=0||c.generated||c.floorPanel46||c.psychicHeld||c.build!==0||(c.hover||0)>.1||Math.abs(c.a||0)>.55)return false;
 const base=coverKey20(c);if(!base)return false;
 const ratio=c.hp/Math.max(1,c.maxHp),state=ratio>=.875?'intact':ratio>=.375?'light':'heavy';
 // Only the matched barrier A family has registered damage states in this pass.
 const key=base==='destruction/barrier-a'?base+'-'+state:ratio<.875?null:base;
 const item=key&&frame20(images,key);if(!item)return false;
 const {f,im}=item,[a,b,d]=f.contacts,[sx,sy,sw,sh]=f.rect;
 if(b.x-a.x<1)return false;
 const z=bayObject(c.artId||c.id)?.dimensions.z||32;
 const co=Math.cos(c.a||0),si=Math.sin(c.a||0);
 const project=(x:number,y:number,height:number)=>{const r=relativeWorld46(c.x,c.y,x*co-y*si,x*si+y*co),v=vertical46(c.x,c.y,height);return{x:c.x+r.x+v.x,y:c.y+r.y+v.y};};
 const side=c.h>c.w*2;
 if(side){
  // Long spawn shelters need two visible faces. A single billboard becomes edge-on.
  // Sample the approved slab's material onto the existing hull, rather than widening it.
  const tex=[{x:sx+sw*.28,y:sy+sh*.20},{x:sx+sw*.72,y:sy+sh*.20},{x:sx+sw*.72,y:sy+sh*.70},{x:sx+sw*.28,y:sy+sh*.70}];
  const sign=c.x<500?1:-1;
  const faces=[
   [project(sign*c.w/2,-c.h/2,z),project(sign*c.w/2,c.h/2,z),project(sign*c.w/2,c.h/2,0),project(sign*c.w/2,-c.h/2,0)],
   [project(-c.w/2,c.h/2,z),project(c.w/2,c.h/2,z),project(c.w/2,c.h/2,0),project(-c.w/2,c.h/2,0)],
   [project(-c.w/2,-c.h/2,z),project(c.w/2,-c.h/2,z),project(c.w/2,c.h/2,z),project(-c.w/2,c.h/2,z)],
  ];
  for(const face of faces){
   for(const indices of [[0,1,2],[0,2,3]])triangle20(g,im,indices.map(i=>tex[i]),indices.map(i=>face[i]));
   g.save();g.strokeStyle='#10131c';g.lineWidth=1.3;g.beginPath();face.forEach((p,n)=>n?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.closePath();g.stroke();g.restore();
  }
  return true;
 }
 const edge=[[-c.w/2,c.h/2],[c.w/2,c.h/2]];
 const A=project(edge[0][0],edge[0][1],0),B=project(edge[1][0],edge[1][1],0),D=project(edge[0][0],edge[0][1],z);
 const ux=b.x-a.x,uy=b.y-a.y,vx=d.x-a.x,vy=d.y-a.y,det=ux*vy-vx*uy;
 const xx=((B.x-A.x)*vy-(D.x-A.x)*uy)/det,xy=((D.x-A.x)*ux-(B.x-A.x)*vx)/det;
 const yx=((B.y-A.y)*vy-(D.y-A.y)*uy)/det,yy=((D.y-A.y)*ux-(B.y-A.y)*vx)/det;
 g.save();g.transform(xx,yx,xy,yy,A.x-xx*a.x-xy*a.y,A.y-yx*a.x-yy*a.y);
 g.drawImage(im,sx,sy,sw,sh,0,0,sw,sh);g.restore();return true;
}

// Architecture is scenery at existing visual anchors; it creates no new collision/elevation.
// Cache a color treatment, not transparency. source-atop preserves the original
// silhouette/openings and alpha, while solid walls continue to hide scenery.
const sceneryCache24=new WeakMap<object,Map<string,HTMLCanvasElement>>();
export function sceneryFrame24(im:HTMLImageElement,key:string,rect:number[]){
 let cache=sceneryCache24.get(im);if(!cache){cache=new Map();sceneryCache24.set(im,cache);}
 const existing=cache.get(key);if(existing)return existing;
 if(typeof document==='undefined')return null;
 const [sx,sy,w,h]=rect,canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
 const g=canvas.getContext('2d');if(!g)return null;
 g.drawImage(im,sx,sy,w,h,0,0,w,h);
 g.globalCompositeOperation='source-atop';g.fillStyle='#172334';g.globalAlpha=.20;g.fillRect(0,0,w,h);
 g.globalAlpha=1;g.globalCompositeOperation='source-over';cache.set(key,canvas);return canvas;
}
function prop20(g:CanvasRenderingContext2D,images:Images,key:string,x:number,y:number,height:number){
 const item=frame20(images,key);if(!item)return false;
 const {f,im}=item,[sx,sy,sw,sh]=f.rect,h=height,w=h*sw/sh;
 const pivot=f.pivot||{x:sw/2,y:sh-16},treated=sceneryFrame24(im,key,f.rect);
 withUpright(g,x,y,()=>{g.save();g.globalAlpha=1;g.translate(x,y);
 if(treated)g.drawImage(treated,-w*pivot.x/sw,-h*pivot.y/sh,w,h);
 else g.drawImage(im,sx,sy,sw,sh,-w*pivot.x/sw,-h*pivot.y/sh,w,h);
 g.restore();});
 return true;
}
export function drawMapArchitecture20(g:CanvasRenderingContext2D,images:Images){
 if(!frame20(images,'architecture/north-platform')||!frame20(images,'architecture/south-platform'))return false;
 // Decorative stands stay beyond playable ground. Clip projected scenery out
 // of the physical combat floor, so it cannot imply non-existent cover/stairs.
 withWorld46(g,500,310,()=>{g.save();g.beginPath();g.rect(-10000,-10000,20000,20000);
 const bounds=[[70,90],[930,90],[930,550],[70,550]].map(([x,y])=>{const r=relativeWorld46(500,310,x-500,y-310);return{x:500+r.x,y:310+r.y};});
 bounds.forEach((p,n)=>n?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.closePath();g.clip('evenodd');
 g.globalAlpha=1;
 // Contact shadows belong to scenery anchors, outside the same playable inset.
 for(const prop of D33_SCENERY21)withWorld46(g,prop.x,prop.y,()=>{
  g.save();g.fillStyle='#050b1470';g.beginPath();g.ellipse(prop.x,prop.y,prop.height*.30,12,0,0,Math.PI*2);g.fill();g.restore();
 });
 for(const prop of [...D33_SCENERY21].sort((a,b)=>a.y-b.y))prop20(g,images,prop.key,prop.x,prop.y,prop.height);
 for(const x of [32,968])for(const y of [163,497])prop20(g,images,'props/lamp-post',x,y,100);
 g.restore();});
 return true;
}

let floorCache20:{revision:number;canvas:HTMLCanvasElement}|null=null;
export function getFloorImage20(images:Images){
 if(typeof document==='undefined'||!frame20(images,'floor/concrete')||!frame20(images,'floor/grating'))return null;
 const revision=images.get(d33ImageKey20('floor'))!.naturalWidth;
 if(floorCache20?.revision===revision)return floorCache20.canvas;
 const world=document.createElement('canvas');world.width=1000;world.height=620;
 const wg=world.getContext('2d')!;wg.fillStyle='#171f2c';wg.fillRect(0,0,1000,620);
 // Smaller modules establish human scale without changing floor cells/matter.
 const tileW=40,tileH=27;
 for(let y=0;y<620;y+=tileH)for(let x=0;x<1000;x+=tileW){
  const key=x<80?'casing-cyan':x>=920?'casing-magenta':Math.abs(x+tileW/2-500)<40?'grating':y<81||y>=540?'industrial-plating':(x/tileW+y/tileH)%4===0?'cracked-concrete':'concrete';
  const item=frame20(images,'floor/'+key)||frame20(images,'floor/concrete');if(!item)continue;
  const [sx,sy,w,h]=item.f.rect;wg.drawImage(item.im,sx,sy,w,h,x,y,tileW,tileH);
  // Authored panel joints make these modular surfaces; no seamless-texture claim.
  wg.strokeStyle='#101925';wg.lineWidth=.6;wg.strokeRect(x,y,tileW,tileH);
 }
 wg.fillStyle='#07101a55';wg.fillRect(0,0,1000,620);
 // Restrained spill from existing flank lighting. Baked into the shared floor
 // image so lifted floor panels retain the same material and texture scale.
 for(const [x,color] of [[80,'#41dce81c'],[920,'#ee4caa1c']] as const){
  const light=wg.createLinearGradient(x-110,0,x+110,0);light.addColorStop(0,'#0000');light.addColorStop(.5,color);light.addColorStop(1,'#0000');wg.fillStyle=light;wg.fillRect(x-110,0,220,620);
 }
 const canvas=document.createElement('canvas');canvas.width=1536;canvas.height=1024;const cg=canvas.getContext('2d')!;
 for(let y=0;y<620;y+=62)for(let x=0;x<1000;x+=100){
  const src=[{x,y},{x:x+100,y},{x:x+100,y:y+62},{x,y:y+62}],dst=src.map(p=>arenaPoint46(p.x,p.y));
  for(const indices of [[0,1,2],[0,2,3]])triangle20(cg,world,indices.map(i=>src[i]),indices.map(i=>dst[i]));
 }
 floorCache20={revision,canvas};return canvas;
}
export function skylineOffset24(camera:{x:number;y:number}){
 const far=BAY_DEPTH_DOMAINS.find(d=>d.id==='L1_FAR')!;
 return (arenaPoint46(camera.x,camera.y).x-768)*(1-far.parallax);
}
export function drawMapBackdrop20(g:CanvasRenderingContext2D,images:Images,camera={x:500,y:310}){
 const floor=getFloorImage20(images);if(!floor)return false;
 g.fillStyle='#101427';g.fillRect(-600,-600,2736,2224);
 for(const [n,key] of ['skyline-left','skyline-front','skyline-back','skyline-right'].entries()){
  const skyline=frame20(images,'skyline/'+key);if(!skyline)continue;
  // Reuse the authored far-layer horizontal parallax. Keep the skyline's base
  // height registered to the horizon; neither floor nor input projection changes.
  const [sx,sy,w,h]=skyline.f.rect;g.drawImage(skyline.im,sx,sy,w,h,(n-1)*768+skylineOffset24(camera),5,768,280);
 }
 g.drawImage(floor,0,0);return true;
}
