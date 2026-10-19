import frames from './dimension33Frames20.json';
import {arenaPoint46,arenaJacobian46,relativeWorld46,vertical46,withWorld46,withUpright} from './bayBridgePresentation';
import {bayObject} from './bayBridgeMap';

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
function prop20(g:CanvasRenderingContext2D,images:Images,key:string,x:number,y:number,width:number){
 const item=frame20(images,key);if(!item)return false;
 const {f,im}=item,[sx,sy,sw,sh]=f.rect,j=arenaJacobian46(x,y),w=width*j.x/(1.536*.64),h=w*sh/sw;
 withUpright(g,x,y,()=>{g.save();g.translate(x,y);g.drawImage(im,sx,sy,sw,sh,-w*f.pivot.x/sw,-h*f.pivot.y/sh,w,h);g.restore();});
 return true;
}
export function drawMapArchitecture20(g:CanvasRenderingContext2D,images:Images){
 if(!frame20(images,'architecture/north-platform')||!frame20(images,'architecture/south-platform'))return false;
 // The stadium surrounds extend past the existing 1000x620 combat floor.
 for(const x of [-125,1125])prop20(g,images,'architecture/industrial-facade',x,160,180);
 prop20(g,images,'architecture/watchtower-magenta',15,52,74);
 prop20(g,images,'architecture/watchtower-cyan',985,52,74);
 prop20(g,images,'architecture/bridge-front',185,38,205);
 prop20(g,images,'architecture/bridge-alternate',815,38,205);
 // The 33 tower is beyond the north combat boundary, leaving the central fight unobstructed.
 prop20(g,images,'architecture/central-tower-33-front',500,48,220);
 prop20(g,images,'architecture/north-platform',500,116,158);
 prop20(g,images,'architecture/stair-module-a',500,177,60);
 prop20(g,images,'architecture/south-platform',500,544,158);
 prop20(g,images,'architecture/stair-module-b',500,483,60);
 for(const x of [150,850])for(const y of [163,497]){
  prop20(g,images,'industrial/industrial-crate-front',x,y,44);
  prop20(g,images,'props/lamp-post',x+(x<500?-36:36),y-12,18);
 }
 prop20(g,images,'props/crowd-screen',705,5,114);
 return true;
}

let floorCache20:{revision:number;canvas:HTMLCanvasElement}|null=null;
export function getFloorImage20(images:Images){
 if(typeof document==='undefined'||!frame20(images,'floor/concrete')||!frame20(images,'floor/grating'))return null;
 const revision=images.get(d33ImageKey20('floor'))!.naturalWidth;
 if(floorCache20?.revision===revision)return floorCache20.canvas;
 const world=document.createElement('canvas');world.width=1000;world.height=620;
 const wg=world.getContext('2d')!;wg.fillStyle='#171f2c';wg.fillRect(0,0,1000,620);
 for(let y=0;y<620;y+=54)for(let x=0;x<1000;x+=80){
  const key=x<160?'casing-cyan':x>=840?'casing-magenta':Math.abs(x+40-500)<100?'grating':y<108||y>=486?'industrial-plating':(x/80+y/54)%4===0?'cracked-concrete':'concrete';
  const item=frame20(images,'floor/'+key)||frame20(images,'floor/concrete');if(!item)continue;
  const [sx,sy,w,h]=item.f.rect;wg.drawImage(item.im,sx,sy,w,h,x,y,80,54);
  // Authored panel joints make these modular surfaces; no seamless-texture claim.
  wg.strokeStyle='#101925';wg.lineWidth=1.4;wg.strokeRect(x,y,80,54);
 }
 wg.fillStyle='#07101a55';wg.fillRect(0,0,1000,620);
 const canvas=document.createElement('canvas');canvas.width=1536;canvas.height=1024;const cg=canvas.getContext('2d')!;
 for(let y=0;y<620;y+=62)for(let x=0;x<1000;x+=100){
  const src=[{x,y},{x:x+100,y},{x:x+100,y:y+62},{x,y:y+62}],dst=src.map(p=>arenaPoint46(p.x,p.y));
  for(const indices of [[0,1,2],[0,2,3]])triangle20(cg,world,indices.map(i=>src[i]),indices.map(i=>dst[i]));
 }
 floorCache20={revision,canvas};return canvas;
}
export function drawMapBackdrop20(g:CanvasRenderingContext2D,images:Images){
 const floor=getFloorImage20(images);if(!floor)return false;
 g.fillStyle='#101427';g.fillRect(-600,-600,2736,2224);
 for(const [n,key] of ['skyline-left','skyline-front','skyline-back','skyline-right'].entries()){
  const skyline=frame20(images,'skyline/'+key);if(!skyline)continue;
  const [sx,sy,w,h]=skyline.f.rect;g.drawImage(skyline.im,sx,sy,w,h,(n-1)*768,5,768,280);
 }
 g.drawImage(floor,0,0);return true;
}
