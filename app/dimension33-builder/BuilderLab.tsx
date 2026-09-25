'use client';
import {drawDimensionalStructure} from './dimensional-asset-style';
import {drawContactShadow} from './contact-shadow';
import {drawChargePose} from './charge-sprites';
import {drawCrystalShield} from './shield-render';
import {drawShieldPose,drawShieldMarch} from './shield-pose';
import {rumble,hasRumble} from './gamepad-rumble';
import { useCallback, useEffect, useRef, useState } from 'react';
import { APPROVED_KINDS, TRIAL_KINDS, INITIAL_LAYOUT, readBuilderLayout, pointInPiece, pointOnPiece, floorDepth, SPECS, STORAGE_KEY, WORLD, ARENA_SCALE, type BuilderLayout, type Layer, type Piece, type PieceKind } from './layout';
import {SOURCE_PIECES} from './source-pieces';
import {drawBridgeModel} from './bridge-model';
import {drawRearBarricade,REAR_BARRICADE_SEGMENTS} from './rear-barricade-model';
import {APPROVED_MOVEMENT,coverFace,moveOnCover,placeOnCover} from './recovered-v57/lab-cover-contact.js';
import {selectLabPose} from './recovered-v57/lab-pose.js';
import {atCoverEdge,coverExit,coverNormal} from './cover-exit';
import styles from './builder.module.css';

type Shot={x:number;y:number;vx:number;vy:number;life:number;damage:number;ignoreCoverId?:string};
type Chip={x:number;y:number;vx:number;vy:number;life:number;crystal?:boolean;spin?:number;variant?:number};
type HitFx={x:number;y:number;angle:number;life:number;target:boolean};
const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
// Arena feel tuning stays separate from the recovered Version 57 source.
const MOVE_SPEED=APPROVED_MOVEMENT.speed*.85;
const SHIELD_MARCH_SPEED=.32;
const SLIDE_SPEED=APPROVED_MOVEMENT.slideSpeed*.85;
const SLIDE_DURATION=APPROVED_MOVEMENT.slideDuration*.9;
// Walkable concrete inset from the stadium rail. Reserve space for Jade's
// silhouette at the far edge so her feet never enter the stage or audience.
const floorOutline:[[number,number],...Array<[number,number]>]=[[535,159],[665,159],[797,192],[970,261],[1078,335],[1126,410],[1106,495],[1018,566],[850,625],[640,650],[560,650],[350,625],[182,566],[94,495],[74,410],[122,335],[230,261],[403,192]].map(([x,y])=>[x*ARENA_SCALE,y*ARENA_SCALE]) as [[number,number],...Array<[number,number]>];
function onArenaFloor(x:number,y:number){let inside=false;for(let i=0,j=floorOutline.length-1;i<floorOutline.length;j=i++){const [xi,yi]=floorOutline[i],[xj,yj]=floorOutline[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)inside=!inside;}return inside;}
function floorContact(x:number,y:number){if(onArenaFloor(x,y))return{x,y};let best={x,y,d:Infinity};for(let i=0;i<floorOutline.length;i++){const [ax,ay]=floorOutline[i],[bx,by]=floorOutline[(i+1)%floorOutline.length],t=clamp(((x-ax)*(bx-ax)+(y-ay)*(by-ay))/((bx-ax)**2+(by-ay)**2),0,1),px=ax+t*(bx-ax),py=ay+t*(by-ay),d=(x-px)**2+(y-py)**2;if(d<best.d)best={x:px,y:py,d};}return{x:best.x,y:best.y};}
const assetPaths={arena:'/assets/dimension33-map/arena-war-games-empty.png',original:'/assets/dimension33-map/arena-war-games-hires.webp',floor:'/assets/r13/arena-floor-navigation-atlas-v2.webp',architecture:'/assets/r13/arena-rear-architecture-atlas-v2.webp',cover:'/assets/r12/dimensional-cover-atlas.webp',coverNew:'/assets/dimension33-map/concrete-cover-atlas-v2.png',charge:'/assets/dimension33-map/helmet-charge-helix-v1.png',chargeLow:'/assets/dimension33-map/jade-charge-low-28.png',chargeHigh:'/assets/dimension33-map/jade-charge-high-28.png',scorch:'/assets/dimension33-map/charge-cracked-floor-v1.png',shieldPose:'/assets/dimension33-map/jade-shield-four-poses-v1.png',shieldCrystal:'/assets/dimension33-map/crystal-shield-right-v1.png',shieldDiagonals:'/assets/dimension33-map/jade-shield-diagonals-v1.png',shieldIntermediate:'/assets/dimension33-map/jade-shield-d01-d02-v1.png',shieldD01:'/assets/dimension33-map/crystal-shield-d01-v1.png',shieldD02:'/assets/dimension33-map/crystal-shield-d02-v1.png',shieldD03:'/assets/dimension33-map/crystal-shield-d03-v1.png',shieldShards:'/assets/dimension33-map/crystal-shards-v1.png',container:'/assets/dimension33-map/weapon-container-faces-v1.png',rubble:'/assets/dimension33-map/cover-rubble-0.webp',ground:'/assets/shotgun-v57-ground-effects.png',jade:'/assets/jade/ready-d18.webp',run:'/assets/jade/run-d18.webp',slide:'/assets/jade/slide-d18.webp'};
const collidable=(p:Piece)=>SPECS[p.kind].breakable;
const platformRim=(p:Piece)=>({rx:SPECS.platform.w*(p.scale||1)*.53,ry:SPECS.platform.h*(p.scale||1)*.51});
type Point={x:number;y:number};
const coverFaces={front:[[65,104,397,208],[572,104,397,208],[1072,104,394,208],[1585,104,397,208]],back:[[65,423,397,205],[572,423,397,205],[1072,423,394,205],[1585,423,397,205]],top:[[95,720,365,24],[605,720,360,24],[1115,720,350,24],[1625,720,350,24]],left:[[106,905,38,165],[610,905,38,165],[1112,905,38,165],[1625,905,38,165]],right:[[407,910,38,165],[910,910,38,165],[1418,910,38,165],[1925,910,38,165]],rubble:[[15,1595,520,365],[535,1595,510,365],[1045,1595,510,365],[1555,1595,493,365]]} as const;
// New inked concrete face sheet sampled into the same approved oblique geometry.
const concreteFaces={
 front:[[45,58,240,106],[351,59,240,105],[657,96,237,98]],
 back:[[43,250,243,109],[351,251,240,109],[657,292,237,98]],
 top:[[43,435,236,33],[353,436,233,32],[656,440,234,34]],
 left:[[66,549,46,108],[360,550,48,107],[673,551,48,107]],
 right:[[220,549,44,108],[529,549,46,109],[825,550,45,106]],
} as const;
function drawQuad(ctx:CanvasRenderingContext2D,img:HTMLImageElement|undefined,frame:readonly number[],pts:Point[],fill:string){
 const path=()=>{ctx.beginPath();pts.forEach((pt,i)=>i?ctx.lineTo(pt.x,pt.y):ctx.moveTo(pt.x,pt.y));ctx.closePath();};path();ctx.fillStyle=fill;ctx.fill();
 if(img?.complete&&img.naturalWidth){const [sx,sy,sw,sh]=frame,[tl,tr,,bl]=pts;ctx.save();path();ctx.clip();ctx.transform((tr.x-tl.x)/sw,(tr.y-tl.y)/sw,(bl.x-tl.x)/sh,(bl.y-tl.y)/sh,tl.x,tl.y);ctx.drawImage(img,sx,sy,sw,sh,0,0,sw,sh);ctx.restore();}
 path();ctx.strokeStyle='#070a0e';ctx.lineWidth=2.5;ctx.stroke();
}
// Canonical dimensional floor asset: all four textured walls and the roof share
// the same rotation, scale and floor footprint as their cover collision.
const containerFaces={front:[0,0,627,627],back:[627,0,627,627],end:[0,627,627,627],roof:[627,627,627,627]} as const;
// The approved weapons container from the one-block test: four independently
// textured vertical faces and a roof, projected from its rotated floor corners.
function drawWeaponsContainer(ctx:CanvasRenderingContext2D,atlas:HTMLImageElement|undefined,rubble:HTMLImageElement|undefined,spec:{w:number;h:number},hp:number,maxHp:number,theta:number){
 const w=spec.w/2,d=spec.h/2,z=65,co=Math.cos(theta),si=Math.sin(theta);
 const corner=(x:number,y:number):Point=>({x:x*co-y*si,y:x*si+y*co});
 const base=[corner(-w,-d),corner(w,-d),corner(w,d),corner(-w,d)];
 drawContactShadow(ctx,0,0,spec.w,spec.h,theta);
 if(hp<=0){if(rubble?.complete&&rubble.naturalWidth)ctx.drawImage(rubble,...coverFaces.rubble[3],-w*1.2,-d,w*2.4,d*2);return;}
 const top=base.map(p=>({x:p.x,y:p.y-z})),damage=1-hp/maxHp;
 const walls=[{p:[top[0],top[1],base[1],base[0]],src:containerFaces.back,fill:'#273a4c'},
  {p:[top[1],top[2],base[2],base[1]],src:containerFaces.end,fill:'#26384a'},
  {p:[top[3],top[2],base[2],base[3]],src:containerFaces.front,fill:'#425368'},
  {p:[top[0],top[3],base[3],base[0]],src:containerFaces.end,fill:'#30445a'}];
 walls.sort((a,b)=>a.p[2].y+a.p[3].y-b.p[2].y-b.p[3].y);
 for(const face of walls)drawQuad(ctx,atlas,face.src,face.p,face.fill);
 drawQuad(ctx,atlas,containerFaces.roof,top,'#3c3054');
 if(damage>.15){ctx.strokeStyle=damage>.65?'#0a0e18':'#152231';ctx.lineWidth=2+damage*3;ctx.beginPath();ctx.moveTo(-w*.31,-z*.76);ctx.lineTo(0,-z*.42);ctx.lineTo(-w*.12,d*.5);ctx.stroke();}
}
const ghostMask=new WeakMap<HTMLImageElement,Point[]>();
function drawHiddenJade(ctx:CanvasRenderingContext2D,img:HTMLImageElement|undefined,x:number,y:number,p:Piece,time:number,hp=p.hp){
 if(!img?.complete||!img.naturalWidth)return;
 let points=ghostMask.get(img);
 if(!points){const cv=document.createElement('canvas');cv.width=50;cv.height=50;const mask=cv.getContext('2d');if(!mask)return;mask.drawImage(img,0,0,img.width,img.height,0,0,50,50);const rgba=mask.getImageData(0,0,50,50).data;
  const alpha=(px:number,py:number)=>px<0||py<0||px>=50||py>=50?0:rgba[(py*50+px)*4+3];points=[];
  for(let py=1;py<49;py+=2)for(let px=1;px<49;px+=2)if(alpha(px,py)>75&&(alpha(px-2,py)<65||alpha(px+2,py)<65||alpha(px,py-2)<65||alpha(px,py+2)<65))points.push({x:px,y:py});ghostMask.set(img,points);}
 const ps=p.scale||1,w=SPECS[p.kind].w*ps/2,d=SPECS[p.kind].h*ps/2,z=(p.kind==='sniperTower'&&hp<=p.hp/2?50:(SOURCE_PIECES[p.kind]?.height||65))*ps,co=Math.cos(p.angle),si=Math.sin(p.angle);
 const at=(xx:number,yy:number):Point=>({x:p.x+xx*co-yy*si,y:p.y+xx*si+yy*co});
 const base=[at(-w,-d),at(w,-d),at(w,d),at(-w,d)],top=base.map(v=>({x:v.x,y:v.y-z}));
 const silhouette=new Path2D();for(const face of [top,...base.map((_,i)=>[top[i],top[(i+1)%4],base[(i+1)%4],base[i]])]){silhouette.moveTo(face[0].x,face[0].y);for(const pt of face.slice(1))silhouette.lineTo(pt.x,pt.y);silhouette.closePath();}
 ctx.save();ctx.clip(silhouette);ctx.shadowColor='#67e9fa';ctx.shadowBlur=7;
 for(let i=0;i<points.length;i++){if((i*13+Math.floor(time/100))%7>2)continue;const q=points[i];ctx.globalAlpha=.19+((i*7+Math.floor(time/170))%4)*.07;ctx.fillStyle=i%11?'#75edff':'#ff6bb8';ctx.beginPath();ctx.arc(x-42+q.x*84/50,y-87+q.y*84/50,i%9===0?2:1.15,0,Math.PI*2);ctx.fill();}
 ctx.restore();
}
function drawBridgeGhost(ctx:CanvasRenderingContext2D,img:HTMLImageElement|undefined,x:number,y:number,p:Piece,sideX:number,time:number){
 if(!img?.complete||!img.naturalWidth)return;
 let points=ghostMask.get(img);if(!points){const cv=document.createElement('canvas');cv.width=50;cv.height=50;const mask=cv.getContext('2d');if(!mask)return;mask.drawImage(img,0,0,img.width,img.height,0,0,50,50);const rgba=mask.getImageData(0,0,50,50).data;const alpha=(px:number,py:number)=>px<0||py<0||px>=50||py>=50?0:rgba[(py*50+px)*4+3];points=[];for(let py=1;py<49;py+=2)for(let px=1;px<49;px+=2)if(alpha(px,py)>75&&(alpha(px-2,py)<65||alpha(px+2,py)<65||alpha(px,py-2)<65||alpha(px,py+2)<65))points.push({x:px,y:py});ghostMask.set(img,points);}if(!points.length)return;
 const scale=p.scale||1,angle=p.flipX?-p.angle:p.angle,c=Math.cos(angle),sn=Math.sin(angle),at=(xx:number,yy:number,z:number):Point=>({x:p.x+(xx*c-yy*sn)*scale,y:p.y+(xx*sn+yy*c-z)*scale});
 const corners=[at(sideX-33,-27,75),at(sideX+33,-27,75),at(sideX+33,51,75),at(sideX-33,51,75),at(sideX-33,-27,0),at(sideX+33,-27,0),at(sideX+33,51,0),at(sideX-33,51,0)];
 ctx.save();const path=new Path2D();path.moveTo(corners[0].x,corners[0].y);for(const q of [corners[1],corners[2],corners[6],corners[7],corners[4]])path.lineTo(q.x,q.y);path.closePath();ctx.clip(path);
 ctx.shadowColor='#64e8ff';ctx.shadowBlur=7;
 for(let i=0;i<points.length;i++){if((i*13+Math.floor(time/100))%7>2)continue;const q=points[i];ctx.globalAlpha=.18+((i*7+Math.floor(time/170))%4)*.07;ctx.fillStyle=i%11?'#78efff':'#fc6bb9';ctx.beginPath();ctx.arc(x-42+q.x*84/50,y-87+q.y*84/50,i%9===0?2:1.1,0,Math.PI*2);ctx.fill();}ctx.restore();
}
function drawRearGhost(ctx:CanvasRenderingContext2D,img:HTMLImageElement|undefined,x:number,y:number,p:Piece,index:number,time:number){
 if(!img?.complete||!img.naturalWidth)return;
 let points=ghostMask.get(img);if(!points){const cv=document.createElement('canvas');cv.width=50;cv.height=50;const mask=cv.getContext('2d');if(!mask)return;mask.drawImage(img,0,0,img.width,img.height,0,0,50,50);const data=mask.getImageData(0,0,50,50).data,alpha=(px:number,py:number)=>px<0||py<0||px>=50||py>=50?0:data[(py*50+px)*4+3];points=[];for(let py=1;py<49;py+=2)for(let px=1;px<49;px+=2)if(alpha(px,py)>75&&(alpha(px-2,py)<65||alpha(px+2,py)<65||alpha(px,py-2)<65||alpha(px,py+2)<65))points.push({x:px,y:py});ghostMask.set(img,points);}if(!points.length)return;
 const seg=REAR_BARRICADE_SEGMENTS[index],scale=p.scale||1,angle=p.angle+seg.angle,c=Math.cos(angle),sn=Math.sin(angle),outerC=Math.cos(p.angle),outerS=Math.sin(p.angle),baseX=p.x+(seg.x*outerC-seg.y*outerS)*scale,baseY=p.y+(seg.x*outerS+seg.y*outerC)*scale;
 const at=(xx:number,yy:number,z:number)=>({x:baseX+(xx*c-yy*sn)*scale,y:baseY+(xx*sn+yy*c-z)*scale});const w=seg.w/2,d=seg.d/2;
 const face=[at(-w,d,40),at(w,d,40),at(w,d,0),at(-w,d,0)];ctx.save();const path=new Path2D();face.forEach((q,i)=>i?path.lineTo(q.x,q.y):path.moveTo(q.x,q.y));path.closePath();ctx.clip(path);ctx.shadowColor='#70eaff';ctx.shadowBlur=6;
 for(let i=0;i<points.length;i++){if((i*13+Math.floor(time/105))%7>2)continue;const q=points[i];ctx.globalAlpha=.17+((i*7+Math.floor(time/170))%4)*.07;ctx.fillStyle=i%11?'#80eaff':'#ff71ad';ctx.beginPath();ctx.arc(x-42+q.x*84/50,y-87+q.y*84/50,i%9===0?2:1.1,0,Math.PI*2);ctx.fill();}ctx.restore();
}
// Exact atlas coordinates and oblique face projection from the uploaded
// approved-cover-viewer.tsx, scaled into the arena's floor footprint.
function drawDimensionalCover(ctx:CanvasRenderingContext2D,img:HTMLImageElement|undefined,rubble:HTMLImageElement|undefined,spec:{w:number;h:number},hp:number,formation=1,t=0,theta=0){
 const halfW=spec.w/2,halfD=spec.h/2,height=spec.w*122/332,co=Math.cos(theta),si=Math.sin(theta);
 const project=(x:number,z:number,h:number):Point=>({x:x*co-z*si,y:(x*si+z*co)*.39-h});
 const base=[project(-halfW,-halfD,0),project(halfW,-halfD,0),project(halfW,halfD,0),project(-halfW,halfD,0)];
 drawContactShadow(ctx,0,0,spec.w,spec.h*.39,theta);
 if(hp<=0){if(rubble?.complete&&rubble.naturalWidth)ctx.drawImage(rubble,...coverFaces.rubble[3],-spec.w*.572,-height*.94,spec.w*1.145,height*1.64);return;}
 const n=hp>=4?0:hp===3?1:2,top=[project(-halfW,-halfD,height),project(halfW,-halfD,height),project(halfW,halfD,height),project(-halfW,halfD,height)];
 const sides=[{kind:'back' as const,points:[top[0],top[1],base[1],base[0]],fill:'#343b40'},
  {kind:'right' as const,points:[top[1],top[2],base[2],base[1]],fill:'#454c51'},
  {kind:'left' as const,points:[top[0],top[3],base[3],base[0]],fill:'#30383d'},
  {kind:'front' as const,points:[top[3],top[2],base[2],base[3]],fill:'#697176'}];
 sides.sort((a,b)=>a.points.reduce((v,p)=>v+p.y,0)-b.points.reduce((v,p)=>v+p.y,0));
 if(formation<1){ctx.globalAlpha=Math.max(.07,formation*.85);ctx.filter=`blur(${Math.round((1-formation)*5)}px)`;}
 sides.forEach(f=>drawQuad(ctx,img,concreteFaces[f.kind][n],f.points,f.fill));drawQuad(ctx,img,concreteFaces.top[n],top,'#899196');ctx.filter='none';ctx.globalAlpha=1;
 // Retain the approved face atlas; inked seams and fasteners follow its projected top.
 ctx.save();ctx.strokeStyle='#111a20';ctx.lineWidth=1.25;ctx.fillStyle='#141e23';
 for(const fraction of [-.48,.48]){const a=project(halfW*fraction,-halfD,height+.4),b=project(halfW*fraction,halfD,height+.4);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
 for(const side of [-1,1])for(const fraction of [-.73,.73]){const pin=project(halfW*fraction,side*halfD*.7,height+1);ctx.beginPath();ctx.arc(pin.x,pin.y,1.8,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#9caeb2';ctx.lineWidth=.55;ctx.stroke();}ctx.restore();
 ctx.save();ctx.strokeStyle='#111a20';ctx.lineWidth=1.1;ctx.globalAlpha=.7;
 for(const side of [-1,1]){const faceX=side*halfW;for(const z of [-.55,.3]){const start=project(faceX,z*halfD,height*.68);ctx.beginPath();ctx.moveTo(start.x,start.y);ctx.lineTo(start.x+side*3,start.y+height*.11);ctx.lineTo(start.x+side*1.4,start.y+height*.2);ctx.stroke();}}
 ctx.restore();
 if(formation<1){for(let i=0;i<38;i++){const spin=i*2.399+t*2,dist=(1-formation)*(55+i%6*24)*spec.w/332;ctx.fillStyle=i%2?'#ff4ca5':'#6af2ff';ctx.fillRect(Math.cos(spin)*dist,-height*.55+Math.sin(spin)*dist*.52,2.4,2.4);}}
}
export default function BuilderLab(){
  const [layout,setLayout]=useState<BuilderLayout>(INITIAL_LAYOUT);
  const layoutRef=useRef(layout);layoutRef.current=layout;
  const [mode,setMode]=useState<'edit'|'play'>('edit');
  const modeRef=useRef(mode);modeRef.current=mode;
  const [tool,setTool]=useState<PieceKind|null>(null);
  const toolRef=useRef(tool);toolRef.current=tool;
  const [selected,setSelected]=useState<string|null>(null);
  const selectedRef=useRef(selected);selectedRef.current=selected;
  const [zoom,setZoom]=useState(1);
  const zoomRef=useRef(zoom);zoomRef.current=zoom;
  const [notice,setNotice]=useState('Source layout loaded. Tap any structure to set its final size and position.');
  const [scraps,setScraps]=useState(0);
  const [battery,setBattery]=useState(100);
  const [hapticStatus,setHapticStatus]=useState<'off'|'ready'|'unsupported'>('off');
  const lastHapticStatus=useRef<'off'|'ready'|'unsupported'>('off');
  const matchCover=useRef<Piece[]>([]);
  const carry=useRef({vx:0,vy:0,lastX:0,lastY:0});
  const poseDirections=useRef<Record<string,string>>({});
  const view=useRef<HTMLCanvasElement>(null);
  const camera=useRef({x:600*ARENA_SCALE,y:560*ARENA_SCALE});
  const drag=useRef<null|{id:string;dx:number;dy:number;moved:boolean;startX:number;startY:number}>(null);
  const pan=useRef({x:0,y:0});
  const pointer=useRef<null|{x:number;y:number}>(null);
  const controls=useRef({keys:new Set<string>(),stick:{x:0,y:0},touchFire:false,touchShield:false,touchField:false,touchCharge:false,shoot:false});
  const game=useRef({x:600*ARENA_SCALE,y:560*ARENA_SCALE,vx:0,vy:0,angle:-.4,slide:0,slideFacing:0,travel:0,stepTravel:0,coverSpeed:0,coverCommitted:false,coverPartId:null as string|null,coverSegment:null as number|null,bridgeSide:null as number|null,slideStarted:false,slideCool:0,slideEchoes:[] as {x:number;y:number;angle:number;age:number}[],kickStage:'none' as 'none'|'burst'|'step',kickTime:0,kickAngle:0,kickNormal:{nx:0,ny:0},kickUntil:0,coverLockId:null as string|null,coverLockTime:0,peek:false,peekUntil:0,lastShotAt:-100,fireCool:0,battery:100,field:false,charging:false,chargeTime:0,chargeRelease:0,chargeMarked:false,chargeScars:[] as {x:number;y:number;coverId:string|null;angle:number}[],bump:0,flash:{x:0,y:0,angle:0,life:0},climb:0,shots:[] as Shot[],chips:[] as Chip[],impacts:[] as HitFx[],target:{x:690*ARENA_SCALE,y:594*ARENA_SCALE,hp:6,recover:0},health:{} as Record<string,number>,created:{} as Record<string,number>,attached:null as string|null,collected:0,shield:false,shieldBrace:0,marchMoving:false,shieldIntegrity:1,shieldImpact:{x:19,y:0},shieldGenerated:false,shieldHeld:false,targetFireCool:1,testBolts:[] as {x:number;y:number;vx:number;vy:number;life:number}[],held:null as string|null,slideMarks:[] as {x:number;y:number;angle:number;age:number}[]});
  const transform=useRef({scale:1,ox:0,oy:0});
  const [ready,setReady]=useState(false);

  useEffect(()=>{const restored=readBuilderLayout();setLayout(restored);layoutRef.current=restored;setSelected(restored.pieces.some(p=>p.id==='ref-center')?'ref-center':null);setReady(true);},[]);
  useEffect(()=>{if(ready)localStorage.setItem(STORAGE_KEY,JSON.stringify(layout));},[layout,ready]);
  const update=(fn:(l:BuilderLayout)=>BuilderLayout)=>{setLayout(prev=>{const next=fn(prev);layoutRef.current=next;return next;});};
  const play=()=>{const g=game.current;g.x=600*ARENA_SCALE;g.y=560*ARENA_SCALE;camera.current={x:g.x,y:g.y};g.vx=g.vy=0;g.slide=0;g.slideFacing=0;g.travel=0;g.stepTravel=0;g.coverSpeed=0;g.coverCommitted=false;g.coverPartId=null;g.coverSegment=null;g.bridgeSide=null;g.slideStarted=false;g.slideCool=0;g.slideEchoes=[];g.kickStage='none';g.kickTime=0;g.kickUntil=0;g.coverLockId=null;g.coverLockTime=0;g.peek=false;g.peekUntil=0;g.lastShotAt=-100;g.fireCool=0;g.battery=60;g.field=false;g.charging=false;g.chargeTime=0;g.chargeRelease=0;g.chargeMarked=false;g.chargeScars=[];setBattery(60);g.bump=0;g.flash.life=0;g.slideMarks=[];g.climb=0;g.shots=[];g.impacts=[];g.target={x:690*ARENA_SCALE,y:594*ARENA_SCALE,hp:6,recover:0};g.chips=[];g.health={};g.created={};g.attached=null;g.collected=0;g.shield=false;g.shieldBrace=0;g.marchMoving=false;g.shieldHeld=false;g.shieldIntegrity=1;g.shieldImpact={x:19,y:0};g.shieldGenerated=false;g.targetFireCool=1;g.testBolts=[];g.held=null;poseDirections.current={};matchCover.current=[];carry.current={vx:0,vy:0,lastX:0,lastY:0};setScraps(0);setMode('play');setNotice('Hold Y to charge the helmet. A slides into cover; RT fires the shotgun.');};
  const edit=()=>{controls.current.keys.clear();controls.current.shoot=false;controls.current.touchFire=false;matchCover.current=[];setMode('edit');setNotice('Your source layout is saved. Tap a structure to resize, turn, mirror, or move it.');};
  const shoot=useCallback(()=>{
    const g=game.current;if(g.fireCool>0||g.charging)return;
    const a=g.angle,forward={x:Math.cos(a),y:Math.sin(a)},now=performance.now()/1000;
    const moving=Math.hypot(g.vx,g.vy)>34;
    const pose=selectLabPose({x:g.x,y:g.y,aim:a,vx:g.vx,vy:g.vy,weapon:'shotgun',state:g.attached?'cover':g.slide>0?'slide':moving?'run':'ready',attached:g.attached?{id:g.attached}:null,peek:g.peek,contactUntil:0,lastShotAt:g.lastShotAt,frameMoved:moving?1:0,moveInput:moving,moveFacing:g.slide>0?g.slideFacing:a,slideFacing:g.slideFacing,slideUntil:g.slide>0?now+g.slide:0,slideStartedAt:now-(SLIDE_DURATION-g.slide),kickUntil:g.kickUntil,recoveryUntil:0,travel:g.stepTravel,poseDirections:poseDirections.current},now);
    const anchor=pose?.anchor,muzzle=pose?.muzzle;
    // The atlas muzzle is authoritative when it actually lies forward of the
    // facing torso. The projected barrel tip covers missing or misregistered
    // views without ever emitting a pellet from Jade's feet or back.
    const spriteX=anchor&&Number.isFinite(muzzle?.x)?g.x+(muzzle.x-anchor[0])*.40:NaN;
    const spriteY=anchor&&Number.isFinite(muzzle?.y)?g.y+(muzzle.y-anchor[1])*.40:NaN;
    const ahead=(spriteX-g.x)*forward.x+(spriteY-(g.y-43))*forward.y;
    const sideways=Math.abs((spriteX-g.x)*forward.y-(spriteY-(g.y-43))*forward.x);
    const aligned=Number.isFinite(ahead)&&ahead>12&&ahead<95&&sideways<34;
    let x=aligned?spriteX:g.x+forward.x*43;
    let y=aligned?spriteY:g.y-43+forward.y*43;
    const attached=[...layoutRef.current.pieces,...matchCover.current].find(p=>p.id===g.attached);
    if(attached&&pointInPiece(x,y,attached,3)){
      if(!g.peek){g.fireCool=.12;setNotice('LINE UP THE BARREL AT THE COVER EDGE TO FIRE.');return;}
      for(let step=0;step<28&&pointInPiece(x,y,attached,3);step++){x+=forward.x*4;y+=forward.y*4;}
      if(pointInPiece(x,y,attached,3)){g.fireCool=.12;return;}
      g.peekUntil=now+.23;
    }
    g.fireCool=.56;g.bump=Math.max(g.bump,1.7);rumble('shot');
    const usingDebris=g.collected>0;if(usingDebris){g.collected--;setScraps(g.collected);}
    g.lastShotAt=now;g.flash={x,y,angle:a,life:.12};
    for(const spread of [-.10,0,.10]){const direction=a+spread;g.shots.push({x,y,vx:Math.cos(direction)*780,vy:Math.sin(direction)*780,life:.32,damage:usingDebris?2:1,ignoreCoverId:attached&&g.peek?attached.id:undefined});}
  },[]);
  const slide=useCallback(()=>{const g=game.current;if((g.slideCool>0&&!g.attached)||g.kickStage!=='none')return;
    if(g.attached){if(!g.coverCommitted){g.coverCommitted=true;g.vx=g.vy=0;g.coverSpeed=0;setNotice('COVER BRACED · move along the edge · A kicks out.');return;}const p=[...layoutRef.current.pieces,...matchCover.current].find(p=>p.id===g.attached);if(p){const face=coverNormal(p,g.x,g.y),exit=coverExit(g.angle,face);if(exit==='blocked'){setNotice('Aim away from cover to kick, or along its edge to burst into a slide.');return;}g.coverLockId=p.id;g.coverLockTime=performance.now()/1000+.25;g.attached=null;g.coverSpeed=0;g.slideEchoes=[];
      if(exit==='past'){const dot=Math.cos(g.angle)*face.tx+Math.sin(g.angle)*face.ty,sign=dot<0?-1:1;g.kickAngle=Math.atan2(face.ty*sign,face.tx*sign);g.kickNormal={nx:face.nx,ny:face.ny};g.kickStage='burst';g.kickTime=.13;g.vx=Math.cos(g.kickAngle)*408;g.vy=Math.sin(g.kickAngle)*408;g.slideFacing=g.kickAngle;g.slideCool=.94;g.kickUntil=performance.now()/1000+.13;setNotice('EDGE BURST → one step → baseball slide.');return;}
      const tangent=clamp((g.vx*face.tx+g.vy*face.ty)/MOVE_SPEED,-.35,.35),length=Math.hypot(face.nx+face.tx*tangent,face.ny+face.ty*tangent)||1;g.vx=(face.nx+face.tx*tangent)/length*SLIDE_SPEED;g.vy=(face.ny+face.ty*tangent)/length*SLIDE_SPEED;g.slideFacing=Math.atan2(g.vy,g.vx);g.slide=SLIDE_DURATION;g.slideStarted=true;g.slideCool=SLIDE_DURATION;g.kickUntil=performance.now()/1000+.16;setNotice('KICK AWAY · baseball slide.');return;}}
    const nearby=[...layoutRef.current.pieces,...matchCover.current].filter(p=>(g.health[p.id]??p.hp)>0&&p.id!==g.held&&pointInPiece(g.x,g.y,p,25)).sort((a,b)=>Math.hypot(g.x-a.x,g.y-a.y)-Math.hypot(g.x-b.x,g.y-b.y))[0];if(nearby){g.attached=nearby.id;g.coverCommitted=true;g.vx=g.vy=0;g.coverSpeed=0;setNotice('COVER BRACED · follow its edge · A kicks out.');return;}
    g.slide=SLIDE_DURATION;g.slideStarted=false;g.slideFacing=Math.hypot(g.vx,g.vy)>25?Math.atan2(g.vy,g.vx):g.angle;g.slideCool=SLIDE_DURATION;g.slideEchoes=[];},[]);
  const build=useCallback(()=>{const g=game.current;const id=`made-${Date.now()}`;
    const x=clamp(g.x+Math.cos(g.angle)*92,110*ARENA_SCALE,1090*ARENA_SCALE),y=clamp(g.y+Math.sin(g.angle)*92,100*ARENA_SCALE,640*ARENA_SCALE);
    if(layoutRef.current.pieces.some(p=>pointInPiece(x,y,p,25)))return;
    if(g.attached?.startsWith('made-'))g.attached=null;
    matchCover.current=[];
    matchCover.current.push({id,kind:'barrier',x,y,angle:g.angle+Math.PI/2,hp:4,scale:.72});g.created[id]=performance.now();g.held=id;carry.current={vx:0,vy:0,lastX:x,lastY:y};setNotice('Matter formed into the approved slab. Hold COVER and aim to drag its weight across the floor.');
  },[]);
  const attach=useCallback(()=>{const g=game.current;if(g.kickStage!=='none'||g.slide>0||g.attached)return;const nearby=[...layoutRef.current.pieces,...matchCover.current].filter(p=>(g.health[p.id]??p.hp)>0&&p.id!==g.held&&pointInPiece(g.x,g.y,p,38)).sort((a,b)=>Math.hypot(g.x-a.x,g.y-a.y)-Math.hypot(g.x-b.x,g.y-b.y))[0];if(nearby){g.attached=nearby.id;g.coverCommitted=false;g.coverSpeed=0;setNotice('SOFT COVER · pull away to release or press A to brace.');}},[]);
  const release=useCallback(()=>{if(game.current.held){game.current.held=null;carry.current.vx=0;carry.current.vy=0;}},[]);
  useEffect(()=>{
    const down=(e:KeyboardEvent)=>{if(modeRef.current!=='play')return;
      if([' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)||e.code.startsWith('Shift'))e.preventDefault();
      controls.current.keys.add(e.key.toLowerCase());
      if((e.key===' '||e.code.startsWith('Shift'))&&!e.repeat)slide();
      if((e.key.toLowerCase()==='c'||e.key.toLowerCase()==='f')&&!e.repeat)build();
      if(e.key.toLowerCase()==='e'&&!e.repeat)attach();
    };
    const up=(e:KeyboardEvent)=>{controls.current.keys.delete(e.key.toLowerCase());if(e.key.toLowerCase()==='c'||e.key.toLowerCase()==='f')release();};
    const blur=()=>{controls.current.keys.clear();controls.current.shoot=false;controls.current.touchFire=false;controls.current.touchCharge=false;controls.current.stick={x:0,y:0};release();};
    window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',blur);
    return()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',blur);};
  },[slide,build,release,attach]);

  useEffect(()=>{
    const canvas=view.current!,ctx=canvas.getContext('2d',{alpha:false})!;
    const art:Record<string,HTMLImageElement>={};
    for(const [name,url] of Object.entries(assetPaths)){const image=new Image();image.src=url;art[name]=image;}
    for(const family of ['ready','run','slide','cover'])for(let direction=0;direction<24;direction++){
      const name=`${family}-d${String(direction).padStart(2,'0')}`,image=new Image();
      // The recovered v57 atlas has no run/slide d03 file. Fill that one
      // transition from the adjacent d04 frames until its authored art lands.
      const artDirection=direction===3&&(family==='run'||family==='slide')?4:direction;
      image.src=`/assets/shotgun-v57/${family}-d${String(artDirection).padStart(2,'0')}.webp`;art[name]=image;
    }
    for(const family of ['run','slide','cover','ready']){const image=new Image();image.src=`/assets/shotgun-v57/${family}.webp`;art[family]=image;}
    const sprite=(name:string,sx:number,sy:number,sw:number,sh:number,dx:number,dy:number,dw:number,dh:number)=>{
      const image=art[name];if(image?.complete&&image.naturalWidth)ctx.drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh);
    };
    const image=(name:string,x:number,y:number,w:number,h:number)=>{const im=art[name];if(im?.complete&&im.naturalWidth)ctx.drawImage(im,x,y,w,h);};
    let id=0,last=performance.now(),accumulator=0;
    const frame=(now:number)=>{
      const elapsed=Math.min(.04,(now-last)/1000);last=now;
      const rect=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2),vw=rect.width,vh=rect.height;
      if(canvas.width!==Math.round(vw*dpr)||canvas.height!==Math.round(vh*dpr)){canvas.width=Math.round(vw*dpr);canvas.height=Math.round(vh*dpr);}
      ctx.setTransform(dpr,0,0,dpr,0,0);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.fillStyle='#060e1a';ctx.fillRect(0,0,vw,vh);
      const g=game.current,playing=modeRef.current==='play',magnify=playing?3.0:zoomRef.current;
      // Keep Jade's screen size and close play camera; only the environment grows.
      const scale=(playing?Math.min(vw/1200,vh/720):Math.min(vw/WORLD.width,vh/WORLD.height))*magnify;
      if(playing){const follow=1-Math.exp(-elapsed*18);camera.current.x+=(g.x-camera.current.x)*follow;camera.current.y+=(g.y-camera.current.y)*follow;}
      const focusX=playing?camera.current.x:zoomRef.current>1?layoutRef.current.pieces.find(p=>p.id===selectedRef.current)?.x??WORLD.width/2:WORLD.width/2;
      const focusY=playing?camera.current.y:zoomRef.current>1?layoutRef.current.pieces.find(p=>p.id===selectedRef.current)?.y??WORLD.height/2:WORLD.height/2;
      let ox=vw/2-focusX*scale+(!playing?pan.current.x:0),oy=vh/2-focusY*scale+(!playing?pan.current.y:0);
      if(WORLD.width*scale>vw){ox=clamp(ox,vw-WORLD.width*scale,0);}else ox=(vw-WORLD.width*scale)/2;
      if(WORLD.height*scale>vh){oy=clamp(oy,vh-WORLD.height*scale,0);}else oy=(vh-WORLD.height*scale)/2;
      if(playing&&g.bump>0){ox+=Math.sin(now*.095)*g.bump*1.4;oy+=Math.cos(now*.13)*g.bump*.85;}
      transform.current={scale,ox,oy};
      ctx.save();ctx.translate(ox,oy);ctx.scale(scale,scale);
      ctx.fillStyle='#111827';ctx.fillRect(0,0,WORLD.width,WORLD.height);
      image('arena',0,0,WORLD.width,WORLD.height);
      if(playing&&art.scorch?.complete&&art.scorch.naturalWidth)for(const scar of g.chargeScars){ctx.save();ctx.globalAlpha=.79;ctx.translate(scar.x,scar.y);ctx.rotate(scar.angle*.12);ctx.drawImage(art.scorch,-53,-22,106,43);ctx.restore();}
      const pieces=playing?[...layoutRef.current.pieces,...matchCover.current]:layoutRef.current.pieces;
      const drawPiece=(p:Piece,opacity=1,bridgePart:'all'|'supports'|'deck'|'supportLeft'|'supportRight'|0|1|2='all')=>{const spec=SPECS[p.kind],hp=g.health[p.id]??p.hp,ps=p.scale||1;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle);ctx.scale((p.flipX?-1:1)*ps,ps);ctx.globalAlpha=opacity;
        if(p.kind==='supplyContainer'){ctx.rotate((p.flipX?1:-1)*p.angle);drawWeaponsContainer(ctx,art.container,art.cover,spec,hp,p.hp,p.flipX?-p.angle:p.angle);ctx.rotate((p.flipX?-1:1)*p.angle);}
        else if(p.kind==='curvedBarricade'){ctx.rotate((p.flipX?1:-1)*p.angle);drawRearBarricade(ctx,art.container,hp,p.flipX?-p.angle:p.angle,typeof bridgePart==='number'?bridgePart:'all',art.original);ctx.rotate((p.flipX?-1:1)*p.angle);}
        else if(p.kind==='leftBridge'){ctx.rotate((p.flipX?1:-1)*p.angle);drawBridgeModel(ctx,art.cover,art.container,hp,p.flipX?-p.angle:p.angle,typeof bridgePart==='number'?'all':bridgePart,art.original);ctx.rotate((p.flipX?-1:1)*p.angle);}
        else if(p.kind!=='barrier'&&SOURCE_PIECES[p.kind]){ctx.rotate((p.flipX?1:-1)*p.angle);drawDimensionalStructure(ctx,art.original,p.kind,spec.w,spec.h,hp,p.hp,p.flipX?-p.angle:p.angle);ctx.rotate((p.flipX?-1:1)*p.angle);}
        else if(spec.breakable){
          const start=g.created[p.id],formation=start?clamp((now-start)/720,0,1):1;
          ctx.rotate((p.flipX?1:-1)*p.angle);drawDimensionalCover(ctx,art.coverNew,art.cover,spec,hp,formation,now/1000,p.flipX?-p.angle:p.angle);ctx.rotate((p.flipX?-1:1)*p.angle);
          if(playing&&hp<4&&hp>0){ctx.fillStyle='#ff3496';ctx.fillRect(-spec.w/2,-spec.h-90,(hp/4)*spec.w,3);}
        }
        if(playing&&hp>0&&art.scorch?.complete&&art.scorch.naturalWidth){for(const scar of g.chargeScars){if(scar.coverId!==p.id)continue;ctx.save();ctx.globalAlpha=.75;ctx.globalCompositeOperation='screen';ctx.drawImage(art.scorch,-29,-spec.h*.57,58,22);ctx.restore();}}
        if(!playing){
          const isSelected=p.id===selectedRef.current;
          if(isSelected){ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.setLineDash([6,5]);ctx.strokeRect(-spec.w/2,-spec.h/2-(SOURCE_PIECES[p.kind]?.height||0),spec.w,spec.h+(SOURCE_PIECES[p.kind]?.height||0));ctx.setLineDash([]);
            ctx.fillStyle='#ff329b';ctx.beginPath();ctx.arc(0,0,3,0,Math.PI*2);ctx.fill();}
          ctx.save();if(p.flipX)ctx.scale(-1,1);
          ctx.fillStyle='#d8f8ff';ctx.font='bold 11px system-ui';ctx.textAlign='center';ctx.shadowColor='#000';ctx.shadowBlur=7;ctx.fillText(spec.label,0,-spec.h/2-(SOURCE_PIECES[p.kind]?.height||0)-27);ctx.restore();
        }
        ctx.restore();};
      const floor=pieces.slice().sort((a,b)=>a.y-b.y);
      if(!playing)for(const p of floor)drawPiece(p);
      if(!playing){
        if(toolRef.current&&pointer.current&&pointer.current.x>40*ARENA_SCALE&&pointer.current.x<1160*ARENA_SCALE&&pointer.current.y>85*ARENA_SCALE&&pointer.current.y<650*ARENA_SCALE){
          const kind=toolRef.current,pt=pointer.current,spec=SPECS[kind];
          drawPiece({id:'placement-preview',kind,x:pt.x,y:pt.y,angle:0,scale:1,hp:spec.hp},.52);
          ctx.strokeStyle='#f5fcff';ctx.lineWidth=1.5;ctx.strokeRect(pt.x-spec.w/2,pt.y-spec.h/2,spec.w,spec.h);
          ctx.fillStyle='#ff249f';ctx.beginPath();ctx.arc(pt.x,pt.y,3,0,Math.PI*2);ctx.fill();
        }
      }
      if(playing){
        accumulator+=elapsed;
        let mag=0;
        while(accumulator>=APPROVED_MOVEMENT.fixedStep){
        accumulator-=APPROVED_MOVEMENT.fixedStep;
        const dt=APPROVED_MOVEMENT.fixedStep;
        g.fireCool=Math.max(0,g.fireCool-dt);g.flash.life=Math.max(0,g.flash.life-dt);g.bump=Math.max(0,g.bump-dt*11);g.slideCool=Math.max(0,g.slideCool-dt);g.slide=Math.max(0,g.slide-dt);g.climb=Math.max(0,g.climb-dt);
        const k=controls.current.keys,pad=navigator.getGamepads?.()?.find(Boolean);
        const status=pad?(hasRumble(pad)?'ready':'unsupported'):'off';
        if(status!==lastHapticStatus.current){lastHapticStatus.current=status;setHapticStatus(status);}
        let dx=Number(k.has('d')||k.has('arrowright'))-Number(k.has('a')||k.has('arrowleft'))+controls.current.stick.x+(pad&&Math.abs(pad.axes[0])>.15?pad.axes[0]:0);
        let dy=Number(k.has('s')||k.has('arrowdown'))-Number(k.has('w')||k.has('arrowup'))+controls.current.stick.y+(pad&&Math.abs(pad.axes[1])>.15?pad.axes[1]:0);
        mag=Math.hypot(dx,dy);dx/=Math.max(1,mag);dy/=Math.max(1,mag);
        // Movement and aim share the left stick. Hold the last facing when it
        // returns to center; the right stick never changes the barrel heading.
        if(mag>.2)g.angle=Math.atan2(dy,dx);
        if(pad?.buttons[0]?.pressed&&!padSlide)slide();padSlide=!!pad?.buttons[0]?.pressed;
        // X is reserved for the planned slow-time field; cover commitment is on A.
        const wantsCharge=!!pad?.buttons[3]?.pressed||k.has('y')||controls.current.touchCharge;
        const charging=wantsCharge&&g.slide<=0&&g.kickStage==='none';
        if(charging){g.chargeTime+=dt;g.chargeRelease=0;if(g.chargeTime>.42&&!g.chargeMarked){g.chargeScars.push({x:g.x,y:g.y,coverId:g.attached,angle:g.angle});g.chargeMarked=true;if(g.chargeScars.length>24)g.chargeScars.shift();}}
        else if(g.charging){g.chargeRelease=.28;g.chargeTime=0;g.chargeMarked=false;}
        g.charging=charging;g.chargeRelease=Math.max(0,g.chargeRelease-dt);
        g.field=!charging&&(!!pad?.buttons[2]?.pressed||k.has('q')||controls.current.touchField)&&g.battery>0;
        g.battery=clamp(g.battery+(charging?30:g.field?-22:0)*dt,0,100);if(Math.round(g.battery)!==Math.round(batteryValue)) {batteryValue=g.battery;setBattery(Math.round(g.battery));}
        
        if(pad?.buttons[5]?.pressed&&!padBuild)build();if(!pad?.buttons[5]?.pressed&&padBuild)release();padBuild=!!pad?.buttons[5]?.pressed;
        g.peek=!!g.attached&&(performance.now()/1000<g.peekUntil||!!pieces.find(p=>p.id===g.attached&&atCoverEdge(p,g.x,g.y)));
        const wantsShield=controls.current.touchShield||k.has('v')||!!pad?.buttons[6]?.pressed;
        if(wantsShield&&!g.shieldHeld&&!g.shieldGenerated&&g.battery>=25){g.shieldGenerated=true;g.shieldIntegrity=1;g.shieldImpact={x:19,y:0};g.battery-=25;setNotice('CRYSTAL SHIELD · aim it at the target bolts. Four direct hits will break it.');}
        g.shieldHeld=wantsShield;
        g.shield=wantsShield&&g.shieldGenerated&&!g.charging&&g.slide<=0&&g.kickStage==='none';
        g.shieldBrace=clamp(g.shieldBrace+(g.shield?dt*5:-dt*7),0,1);
        if(Math.round(g.battery)!==Math.round(batteryValue)){batteryValue=g.battery;setBattery(Math.round(g.battery));}
        // The practice target fires visible, harmless bolts only while the shield is up.
        // Shield integrity changes only when one actually crosses its aimed front arc.
        g.targetFireCool-=dt;
        if(g.shield&&g.target.hp>0&&g.targetFireCool<=0){const a=Math.atan2(g.y-35-(g.target.y-28),g.x-g.target.x);g.testBolts.push({x:g.target.x,y:g.target.y-28,vx:Math.cos(a)*245,vy:Math.sin(a)*245,life:2.8});g.targetFireCool=1.45;}
        for(const bolt of g.testBolts){bolt.x+=bolt.vx*dt;bolt.y+=bolt.vy*dt;bolt.life-=dt;
          if(g.shield&&bolt.life>0){const vx=bolt.x-g.x,vy=bolt.y-(g.y-43),dist=Math.hypot(vx,vy),arc=Math.atan2(Math.sin(Math.atan2(vy,vx)-g.angle),Math.cos(Math.atan2(vy,vx)-g.angle));
            if(dist<72&&dist>20&&Math.abs(arc)<Math.PI/4){bolt.life=0;g.shieldIntegrity=Math.max(0,g.shieldIntegrity-.25);rumble(g.shieldIntegrity<=0?'shieldBreak':'shieldHit');const cs=Math.cos(g.angle),sn=Math.sin(g.angle);g.shieldImpact={x:clamp(vx*cs+vy*sn-34,-2,33),y:clamp(-vx*sn+vy*cs,-29,29)};g.impacts.push({x:bolt.x,y:bolt.y,angle:g.angle,life:.36,target:false});
              if(g.shieldIntegrity<=0){g.shield=false;g.shieldGenerated=false;for(let n=0;n<10;n++){const a=g.angle+(n-4.5)*.13;g.chips.push({x:g.x+Math.cos(a)*58,y:g.y-35+Math.sin(a)*50,vx:Math.cos(a)*(70+n*5),vy:Math.sin(a)*(70+n*5),life:12,crystal:true,spin:n*.7,variant:n%4});}setNotice('SHIELD SHATTERED · collect the crystal debris. Release LT and spend 25 battery to make another.');}
            }
          }
          if(Math.hypot(bolt.x-g.x,bolt.y-(g.y-35))<15)bolt.life=0;
        }
        g.testBolts=g.testBolts.filter(bolt=>bolt.life>0);
        if(controls.current.touchFire||controls.current.shoot||pad?.buttons[7]?.pressed)shoot();
        if(g.held){const held=pieces.find(p=>p.id===g.held);if(held){
          const targetX=clamp(g.x+Math.cos(g.angle)*92,90*ARENA_SCALE,1110*ARENA_SCALE),targetY=clamp(g.y+Math.sin(g.angle)*92,105*ARENA_SCALE,625*ARENA_SCALE),v=carry.current;
          const xForce=(targetX-held.x)*55-v.vx*13,yForce=(targetY-held.y)*55-v.vy*13;
          v.vx=clamp(v.vx+xForce*dt,-410,410);v.vy=clamp(v.vy+yForce*dt,-410,410);
          held.x=clamp(held.x+v.vx*dt,90*ARENA_SCALE,1110*ARENA_SCALE);held.y=clamp(held.y+v.vy*dt,105*ARENA_SCALE,625*ARENA_SCALE);
          const wanted=g.angle+Math.PI/2,diff=Math.atan2(Math.sin(wanted-held.angle),Math.cos(wanted-held.angle));held.angle+=diff*(1-Math.exp(-12*dt));
          const movement=Math.hypot(held.x-v.lastX,held.y-v.lastY);if(movement>3){v.lastX=held.x;v.lastY=held.y;}
         }}
        if(g.climb<=0){
          if(g.kickStage!=='none'){
            g.kickTime-=dt;
            if(g.kickTime<=0&&g.kickStage==='burst'){
              g.kickStage='step';g.kickTime=.09;
              g.vx=Math.cos(g.kickAngle)*MOVE_SPEED+g.kickNormal.nx*81;
              g.vy=Math.sin(g.kickAngle)*MOVE_SPEED+g.kickNormal.ny*81;
            }else if(g.kickTime<=0&&g.kickStage==='step'){
              g.kickStage='none';g.slide=SLIDE_DURATION;g.slideStarted=true;
              g.vx=Math.cos(g.kickAngle)*SLIDE_SPEED;
              g.vy=Math.sin(g.kickAngle)*SLIDE_SPEED;
              g.slideFacing=g.kickAngle;g.slideEchoes=[];
            }
          }
          const sliding=g.slide>0;
          if(sliding&&!g.slideStarted){const direction=mag>.05?Math.atan2(dy,dx):g.slideFacing;g.vx=Math.cos(direction)*SLIDE_SPEED;g.vy=Math.sin(direction)*SLIDE_SPEED;g.slideFacing=direction;g.slideStarted=true;}
          const bracePace=1-(1-SHIELD_MARCH_SPEED)*g.shieldBrace;
          if(sliding){g.vx*=Math.pow(APPROVED_MOVEMENT.slideDrag,dt);g.vy*=Math.pow(APPROVED_MOVEMENT.slideDrag,dt);}
          else if(!g.attached&&g.kickStage==='none'){const response=Math.min(1,dt*APPROVED_MOVEMENT.response),targetSpeed=MOVE_SPEED*(g.charging?.36:g.held?.62:1)*bracePace;g.vx+=(dx*targetSpeed-g.vx)*response;g.vy+=(dy*targetSpeed-g.vy)*response;if(mag<.05){const brake=Math.pow(APPROVED_MOVEMENT.stopDrag,dt);g.vx*=brake;g.vy*=brake;}}
          const speed=MOVE_SPEED*dt,edgeSpeed=speed*.78*bracePace,stepX=g.vx*dt,stepY=g.vy*dt,beforeX=g.x,beforeY=g.y;
          const nx=clamp(g.x+stepX,70*ARENA_SCALE,1130*ARENA_SCALE),ny=clamp(g.y+stepY,100*ARENA_SCALE,640*ARENA_SCALE);
          const blocks=(x:number,y:number)=>{if(!onArenaFloor(x,y))return true;const hit=pieces.find(p=>collidable(p)&&(g.health[p.id]??p.hp)>0&&p.id!==g.held&&!(p.id===g.coverLockId&&performance.now()/1000<g.coverLockTime)&&pointInPiece(x,y,p,9));
            if(hit&&sliding){g.attached=hit.id;g.coverCommitted=false;g.coverSpeed=0;g.slide=0;g.vx=g.vy=0;g.bump=Math.max(g.bump,2.1);rumble('cover');setNotice(`SOFT COVER · ${SPECS[hit.kind].label}. Pull away to release or press A to brace.`);}return !!hit;};
          if(g.attached&&!g.coverCommitted&&mag>.55){const contact=pieces.find(p=>p.id===g.attached);if(contact){const normal=coverNormal(contact,g.x,g.y);if(dx*normal.nx+dy*normal.ny>.65){g.attached=null;g.coverSpeed=0;g.vx=dx*MOVE_SPEED*bracePace;g.vy=dy*MOVE_SPEED*bracePace;}}}
          if(g.coverPartId!==g.attached){g.coverPartId=g.attached;g.coverSegment=null;g.bridgeSide=null;}
          const edge=pieces.find(p=>p.id===g.attached&&p.kind==='platform'&&(g.health[p.id]??p.hp)>0);
          if(edge){
            const rim=platformRim(edge),rx=rim.rx+12,ry=rim.ry+12,co=Math.cos(edge.angle),si=Math.sin(edge.angle);
            const xx=(g.x-edge.x)*co+(g.y-edge.y)*si,yy=-(g.x-edge.x)*si+(g.y-edge.y)*co+16*(edge.scale||1);
            const theta=Math.atan2(yy/ry,xx/rx),tx=-Math.sin(theta)*rx,ty=Math.cos(theta)*ry,length=Math.hypot(tx,ty);
            const localDX=dx*co+dy*si,localDY=-dx*si+dy*co,along=(localDX*tx+localDY*ty)/Math.max(1,length);
            const next=theta+along*edgeSpeed/Math.max(60,Math.hypot(rx,ry));
              const nx=Math.cos(next)*rx,ny=Math.sin(next)*ry-16*(edge.scale||1);g.x=edge.x+nx*co-ny*si;g.y=edge.y+nx*si+ny*co;
          }else if(g.attached){
            const cover=pieces.find(p=>p.id===g.attached);
            if(cover?.kind==='curvedBarricade'){
              const cs=cover.scale||1,co=Math.cos(-cover.angle),sn=Math.sin(-cover.angle),lx=(g.x-cover.x)*co-(g.y-cover.y)*sn,ly=(g.x-cover.x)*sn+(g.y-cover.y)*co;
              const candidate=REAR_BARRICADE_SEGMENTS.reduce((best,s)=>Math.hypot(lx-s.x*cs,ly-s.y*cs)<Math.hypot(lx-best.x*cs,ly-best.y*cs)?s:best);
              g.coverSegment??=REAR_BARRICADE_SEGMENTS.indexOf(candidate);const segment=REAR_BARRICADE_SEGMENTS[g.coverSegment];
              const c=Math.cos(-segment.angle),si=Math.sin(-segment.angle),rx=(lx-segment.x*cs)*c-(ly-segment.y*cs)*si,ry=(lx-segment.x*cs)*si+(ly-segment.y*cs)*c;
              const vx=dx*co-dy*sn,vy=dx*sn+dy*co,localDX=vx*c-vy*si,localDY=vx*si+vy*c,halfX=segment.w*cs/2+12,halfY=segment.d*cs/2+12;
              const onX=Math.abs(Math.abs(rx)-halfX)<Math.abs(Math.abs(ry)-halfY),sx=rx>=0?1:-1,sy=ry>=0?1:-1;
               {const tx=rx+localDX*edgeSpeed,ty=ry+localDY*edgeSpeed,candidates=[[sx*halfX,clamp(ty,-halfY,halfY)],[clamp(tx,-halfX,halfX),sy*halfY]];
                const near=candidates.reduce((a,b)=>Math.hypot(tx-a[0],ty-a[1])<=Math.hypot(tx-b[0],ty-b[1])?a:b);
                const xx=segment.x*cs+near[0]*Math.cos(segment.angle)-near[1]*Math.sin(segment.angle),yy=segment.y*cs+near[0]*Math.sin(segment.angle)+near[1]*Math.cos(segment.angle);
                g.x=cover.x+xx*Math.cos(cover.angle)-yy*Math.sin(cover.angle);g.y=cover.y+xx*Math.sin(cover.angle)+yy*Math.cos(cover.angle);}
            }else if(cover?.kind==='leftBridge'){
              const cs=cover.scale||1,c=Math.cos(-cover.angle),ss=Math.sin(-cover.angle),lx=(g.x-cover.x)*c-(g.y-cover.y)*ss,ly=(g.x-cover.x)*ss+(g.y-cover.y)*c;
              g.bridgeSide??=Math.abs(lx+116*cs)<Math.abs(lx-116*cs)?-1:1;const sideX=g.bridgeSide*116*cs;
              const halfX=33*cs+12,halfY=39*cs+12,cy=12*cs,rx=lx-sideX,ry=ly-cy;
              const horizontal=Math.abs(Math.abs(rx)-halfX)<Math.abs(Math.abs(ry)-halfY);
              const normalX=rx>=0?1:-1,normalY=ry>=0?1:-1;
              const vx=dx*c-dy*ss,vy=dx*ss+dy*c;
              {
                const tx=rx+vx*edgeSpeed,ty=ry+vy*edgeSpeed;
                const candidates=[[normalX*halfX,clamp(ty,-halfY,halfY)],[clamp(tx,-halfX,halfX),normalY*halfY]];
                const nearest=candidates.reduce((a,b)=>Math.hypot(tx-a[0],ty-a[1])<=Math.hypot(tx-b[0],ty-b[1])?a:b);
                g.x=cover.x+(sideX+nearest[0])*Math.cos(cover.angle)-(cy+nearest[1])*Math.sin(cover.angle);
                g.y=cover.y+(sideX+nearest[0])*Math.sin(cover.angle)+(cy+nearest[1])*Math.cos(cover.angle);
              }
            }else if(cover){const cs=cover.scale||1,c={x:cover.x,y:cover.y,a:cover.angle,w:SPECS[cover.kind].w*cs,h:SPECS[cover.kind].h*floorDepth(cover.kind)*cs,hp:g.health[cover.id]??cover.hp};
              const anchor=coverFace(c,{x:g.x,y:g.y,r:APPROVED_MOVEMENT.radius});
              {const actor={x:g.x,y:g.y,r:APPROVED_MOVEMENT.radius,attached:c,coverAnchor:anchor,coverSpeed:g.coverSpeed,vx:0,vy:0,peek:false,side:1,peekEdge:false};
                moveOnCover(actor,dx*.78*bracePace,dy*.78*bracePace,dt,g.angle);g.coverSpeed=actor.coverSpeed;
                const along=dx*anchor.tx+dy*anchor.ty,atStart=anchor.offset<=-anchor.half+.01,atEnd=anchor.offset>=anchor.half-.01;
                const next=atStart&&along<-.2?({top:['left',-c.h/2],right:['top',c.w/2],bottom:['left',c.h/2],left:['top',-c.w/2]} as Record<string,[string,number]>)[anchor.face]:atEnd&&along>.2?({top:['right',-c.h/2],right:['bottom',c.w/2],bottom:['right',c.h/2],left:['bottom',-c.w/2]} as Record<string,[string,number]>)[anchor.face]:null;
                const localX=dx*Math.cos(c.a)+dy*Math.sin(c.a),localY=-dx*Math.sin(c.a)+dy*Math.cos(c.a);
                const turn=next&&({top:{left:localY,right:localY},bottom:{left:-localY,right:-localY},left:{top:localX,bottom:localX},right:{top:-localX,bottom:-localX}} as Record<string,Record<string,number>>)[anchor.face]?.[next[0]]>.42;
                if(next&&turn){actor.coverAnchor.face=next[0];actor.coverAnchor.offset=next[1];actor.coverSpeed=0;placeOnCover(actor);g.coverSpeed=0;}
                g.x=actor.x;g.y=actor.y;}
            }else g.attached=null;
          }else{
            if(!blocks(nx,ny)){g.x=nx;g.y=ny;}
            else if(!g.attached){
              if(!blocks(nx,g.y))g.x=nx;
              if(!blocks(g.x,ny))g.y=ny;
              // When a corner blocks both axes, move along its actual cover tangent.
              if(g.x===beforeX&&g.y===beforeY&&!sliding&&mag>.05){
                const obstruction=pieces.find(p=>collidable(p)&&(g.health[p.id]??p.hp)>0&&p.id!==g.held&&pointInPiece(nx,ny,p,9));
                if(obstruction){const edge=coverNormal(obstruction,beforeX,beforeY),along=dx*edge.tx+dy*edge.ty;
                  const sx=clamp(beforeX+edge.tx*along*speed,70*ARENA_SCALE,1130*ARENA_SCALE),sy=clamp(beforeY+edge.ty*along*speed,100*ARENA_SCALE,640*ARENA_SCALE);
                  if(Math.abs(along)>.08&&!blocks(sx,sy)){g.x=sx;g.y=sy;}
                }
              }
            }
          }
          if(g.attached){g.vx=g.vy=0;const p=pieces.find(q=>q.id===g.attached);if(!p||(g.health[p.id]??p.hp)<=0)g.attached=null;}
          const allowed=floorContact(g.x,g.y);g.x=allowed.x;g.y=allowed.y;
          if(sliding&&!g.attached&&Math.hypot(g.x-beforeX,g.y-beforeY)<.1){g.slide=0;g.vx=g.vy=0;g.bump=Math.max(g.bump,1.2);rumble('cover');}
          const stepDistance=Math.hypot(g.x-beforeX,g.y-beforeY);
          g.travel+=stepDistance;
          g.stepTravel+=stepDistance*(g.fireCool>0&&!g.shield&&!sliding?1.45:1);
          g.marchMoving=stepDistance>.24;
        }
        if(g.slide>0&&Math.hypot(g.vx,g.vy)>60){g.slideMarks.push({x:g.x,y:g.y,angle:Math.atan2(g.vy,g.vx),age:.38});if(g.slideMarks.length>42)g.slideMarks.shift();}
          if(g.slide>0&&Math.hypot(g.vx,g.vy)>60&&(!g.slideEchoes.length||Math.hypot(g.x-g.slideEchoes.at(-1)!.x,g.y-g.slideEchoes.at(-1)!.y)>24)){
            g.slideEchoes.push({x:g.x-g.vx*dt,y:g.y-g.vy*dt,angle:g.slideFacing,age:.58});if(g.slideEchoes.length>7)g.slideEchoes.shift();}
          for(const echo of g.slideEchoes){if(g.slide<=0){const catchUp=1-Math.exp(-17*dt);echo.x+=(g.x-echo.x)*catchUp;echo.y+=(g.y-echo.y)*catchUp;echo.age-=dt;}else echo.age=Math.max(echo.age,.45);}
          g.slideEchoes=g.slideEchoes.filter(echo=>echo.age>0&&Math.hypot(echo.x-g.x,echo.y-g.y)>3);
        for(const mark of g.slideMarks)mark.age-=dt;g.slideMarks=g.slideMarks.filter(mark=>mark.age>0);
        if(g.target.hp<=0){g.target.recover-=dt*(g.field&&Math.hypot(g.target.x-g.x,g.target.y-g.y)<135?.45:1);if(g.target.recover<=0)g.target.hp=6;}
        for(const impact of g.impacts)impact.life-=dt;
        g.impacts=g.impacts.filter(impact=>impact.life>0);
        for(const shot of g.shots){const px=shot.x,py=shot.y;shot.x+=shot.vx*dt;shot.y+=shot.vy*dt;shot.life-=dt;
          const steps=6,points=Array.from({length:steps+1},(_,i)=>({x:px+(shot.x-px)*i/steps,y:py+(shot.y-py)*i/steps}));
          const contact=points.find(q=>pieces.some(p=>collidable(p)&&p.id!==shot.ignoreCoverId&&(g.health[p.id]??p.hp)>0&&pointInPiece(q.x,q.y,p,2))||g.target.hp>0&&Math.hypot(q.x-g.target.x,q.y-g.target.y+18)<19);
          const hit=contact&&pieces.find(p=>collidable(p)&&p.id!==shot.ignoreCoverId&&(g.health[p.id]??p.hp)>0&&pointInPiece(contact.x,contact.y,p,2));
          if(contact){shot.life=0;g.bump=Math.max(g.bump,hit?1.3:2.3);g.impacts.push({x:contact.x,y:contact.y,angle:Math.atan2(shot.vy,shot.vx),life:.36,target:!hit});if(g.impacts.length>32)g.impacts.shift();rumble(hit?'impact':g.target.hp<=shot.damage?'targetDown':'target');}
          if(contact&&!hit&&g.target.hp>0){g.target.hp=Math.max(0,g.target.hp-shot.damage);if(g.target.hp===0){g.target.recover=2.5;setNotice('TARGET DOWN · reset in 2.5 seconds. Slide back into cover and shoot again.');}}
          if(hit){const before=g.health[hit.id]??hit.hp,hp=before-shot.damage;g.health[hit.id]=Math.max(0,hp);
            if(hit.kind==='sniperTower'&&before>hit.hp/2&&hp<=hit.hp/2){for(let i=0;i<8;i++){const a=i*Math.PI/4;g.chips.push({x:hit.x+Math.cos(a)*28,y:hit.y-52,vx:Math.cos(a)*95,vy:Math.sin(a)*95,life:12});}setNotice('TOWER TOP SHATTERED · lower block still has cover.');}
            if(hp<=0){const count=Math.max(6,Math.round(SPECS[hit.kind].hp*.8));for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2;g.chips.push({x:hit.x+(Math.random()-.5)*SPECS[hit.kind].w*.7,y:hit.y,vx:Math.cos(a)*(65+Math.random()*95),vy:Math.sin(a)*(65+Math.random()*95),life:12});}}
          }
        }
        g.shots=g.shots.filter(s=>s.life>0&&s.x>40*ARENA_SCALE&&s.x<1160*ARENA_SCALE&&s.y>70*ARENA_SCALE&&s.y<675*ARENA_SCALE);
        for(const chip of g.chips){const fieldDrag=g.field&&Math.hypot(chip.x-g.x,chip.y-g.y)<135?.45:1;chip.x+=chip.vx*dt*fieldDrag;chip.y+=chip.vy*dt*fieldDrag;chip.vx*=Math.exp(-5*dt);chip.vy*=Math.exp(-5*dt);if(chip.crystal)chip.spin=(chip.spin||0)+chip.vx*dt*.025;chip.life-=dt;
          if(Math.hypot(chip.x-g.x,chip.y-g.y)<32&&chip.life<11.6){chip.life=0;g.collected++;setScraps(g.collected);}}
        g.chips=g.chips.filter(c=>c.life>0);
        }
        if(g.field){ctx.save();ctx.translate(g.x,g.y-8);ctx.strokeStyle='#78e7f5';ctx.shadowColor='#e150bd';ctx.shadowBlur=13;ctx.globalAlpha=.45;ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(0,0,132,0,Math.PI*2);ctx.stroke();ctx.setLineDash([3,11]);ctx.rotate(now*.00012);ctx.strokeStyle='#e77cbf';ctx.beginPath();ctx.arc(0,0,125,0,Math.PI*2);ctx.stroke();ctx.restore();}
        for(const mark of g.slideMarks){ctx.save();ctx.translate(mark.x,mark.y);ctx.rotate(mark.angle);ctx.globalAlpha=mark.age/.38*.68;if(art.ground?.complete&&art.ground.naturalWidth)ctx.drawImage(art.ground,3*384,0,384,384,-48,-43,96,86);ctx.strokeStyle='#5ef0ff';ctx.shadowColor='#ff4bb9';ctx.shadowBlur=9;for(let n=0;n<3;n++){ctx.beginPath();ctx.moveTo(-14-n*5,-8+n*8);ctx.lineTo(-46-n*9,-13+n*11);ctx.stroke();}ctx.restore();}
        const target=g.target;if(target.hp>0){ctx.save();ctx.translate(target.x,target.y);drawContactShadow(ctx,0,0,37,15);ctx.fillStyle='#233445';ctx.strokeStyle='#0c121b';ctx.lineWidth=3;ctx.fillRect(-13,-40,26,29);ctx.strokeRect(-13,-40,26,29);ctx.fillStyle='#e0e8e9';ctx.fillRect(-10,-37,20,23);ctx.fillStyle='#e4448f';ctx.fillRect(-4,-34,8,17);ctx.fillRect(-8,-29,16,7);ctx.fillStyle='#6ef2f8';ctx.fillRect(-15,-47,30*target.hp/6,3);ctx.strokeStyle='#0a1320';ctx.strokeRect(-15,-47,30,3);ctx.restore();}
        for(const bolt of g.testBolts){ctx.save();ctx.translate(bolt.x,bolt.y);ctx.shadowColor='#ff5ac9';ctx.shadowBlur=13;ctx.fillStyle='#fff3fa';ctx.beginPath();ctx.arc(0,0,3.5,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#ff5ac9';ctx.beginPath();ctx.moveTo(-bolt.vx*.045,-bolt.vy*.045);ctx.lineTo(0,0);ctx.stroke();ctx.restore();}
        for(const shot of g.shots){ctx.save();ctx.translate(shot.x,shot.y);ctx.rotate(Math.atan2(shot.vy,shot.vx));ctx.shadowColor=shot.damage>1?'#56f2ff':'#ff4bb4';ctx.shadowBlur=12;ctx.fillStyle='#fff9e6';ctx.beginPath();ctx.ellipse(-7,0,15,2.7,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#ff68ac';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-28,-3);ctx.lineTo(-9,-1);ctx.moveTo(-26,3);ctx.lineTo(-9,1);ctx.stroke();ctx.restore();}
        for(const impact of g.impacts){ctx.save();ctx.translate(impact.x,impact.y);ctx.rotate(impact.angle);ctx.globalAlpha=Math.min(1,impact.life/.18);const size=(.36-impact.life)*52+26;if(art.ground?.complete&&art.ground.naturalWidth)ctx.drawImage(art.ground,4*384,0,384,384,-size/2,-size/2,size,size);ctx.strokeStyle=impact.target?'#ed5e9b':'#ff77af';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,size*.24,0,Math.PI*2);ctx.stroke();if(impact.target){ctx.fillStyle='#9d143e';ctx.strokeStyle='#f691b4';for(let i=0;i<8;i++){const spread=(i-3.5)*.22,reach=(1-impact.life/.36)*(18+i%3*8);ctx.beginPath();ctx.arc(Math.cos(spread)*reach,Math.sin(spread)*reach,i%3===0?2.6:1.4,0,Math.PI*2);ctx.fill();if(i%2===0)ctx.stroke();}}ctx.restore();}
        if(g.flash.life>0){const f=g.flash;ctx.save();ctx.translate(f.x,f.y);ctx.rotate(f.angle);ctx.globalAlpha=f.life/.12;ctx.fillStyle='#fff8d4';ctx.shadowColor='#ff65ad';ctx.shadowBlur=10;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(23,-7);ctx.lineTo(15,0);ctx.lineTo(23,7);ctx.closePath();ctx.fill();ctx.restore();}
        for(const chip of g.chips){ctx.save();ctx.translate(chip.x,chip.y);if(chip.crystal){ctx.rotate(chip.spin||0);if(art.shieldShards?.complete&&art.shieldShards.naturalWidth){const sw=art.shieldShards.naturalWidth/4;ctx.drawImage(art.shieldShards,Math.round((chip.variant||0)*sw),0,Math.round(sw),art.shieldShards.naturalHeight,-10,-10,20,20);}else{ctx.fillStyle='rgba(255,132,215,.55)';ctx.strokeStyle='#ffe4f6';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(-6,-5);ctx.lineTo(5,-7);ctx.lineTo(9,1);ctx.lineTo(0,6);ctx.lineTo(-6,-5);ctx.fill();ctx.stroke();ctx.strokeStyle='#ff8bd9';ctx.beginPath();ctx.moveTo(5,-7);ctx.lineTo(0,6);ctx.stroke();}}else{ctx.fillStyle='#eaf7fa';ctx.strokeStyle='#ff47aa';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,5,0,Math.PI*2);ctx.fill();ctx.stroke();}ctx.restore();}

        const isForeground=(p:Piece)=>{
          if(p.kind==='leftBridge')return false;
          const ps=p.scale||1,dx=g.x-p.x,dy=g.y-p.y,co=Math.cos(p.angle),si=Math.sin(p.angle),lx=dx*co+dy*si,ly=-dx*si+dy*co;
          const spec=SPECS[p.kind];
          if(p.kind==='platform'){
            const rx=spec.w*ps*.53,ry=spec.h*ps*.51,cy=-16*ps;
            if(Math.abs(lx)>rx+10)return false;
            const front=cy+ry*Math.sqrt(Math.max(0,1-(lx/rx)**2));
            return ly<front&&ly>cy-ry-29*ps-53;
          }
          const depth=p.kind==='supplyContainer'?1:p.kind==='barrier'?.39:.46;
          const halfW=spec.w*ps/2,halfD=spec.h*ps*depth/2;
          const height=(p.kind==='barrier'?spec.w*122/332:SOURCE_PIECES[p.kind]?.height||45)*ps;
          const screenDepth=Math.abs(Math.sin(p.angle))*halfW+Math.abs(Math.cos(p.angle))*halfD;
          return Math.abs(lx)<halfW+11&&ly<halfD+1&&g.y>p.y-screenDepth-height-53;
        };
        const behindRearSection=(p:Piece,index:number)=>{const cs=p.scale||1,seg=REAR_BARRICADE_SEGMENTS[index],dx=g.x-p.x,dy=g.y-p.y,c=Math.cos(-p.angle),sn=Math.sin(-p.angle),lx=dx*c-dy*sn-seg.x*cs,ly=dx*sn+dy*c-seg.y*cs,cs2=Math.cos(-seg.angle),sn2=Math.sin(-seg.angle),rx=lx*cs2-ly*sn2,ry=lx*sn2+ly*cs2;return Math.abs(rx)<seg.w*cs/2+11&&ry<seg.d*cs/2+1&&ry>-seg.d*cs/2-42*cs-35;};
        const bridgeOccludes=(p:Piece)=>{const cs=p.scale||1,dx=g.x-p.x,dy=g.y-p.y,c=Math.cos(-p.angle),sn=Math.sin(-p.angle),lx=dx*c-dy*sn,ly=dx*sn+dy*c;return Math.abs(lx)<151*cs&&ly>-52*cs&&ly<47*cs;};
        const behindBridgeSupport=(p:Piece,sx:number)=>{const cs=p.scale||1,dx=g.x-p.x,dy=g.y-p.y,c=Math.cos(-p.angle),sn=Math.sin(-p.angle),lx=dx*c-dy*sn,ly=dx*sn+dy*c;return Math.abs(lx-sx*cs)<33*cs+11&&ly<51*cs+1&&ly>-27*cs-75*cs-35;};
        for(const p of floor){if(p.kind==='curvedBarricade'){for(let i=0;i<3;i++)if(!behindRearSection(p,i))drawPiece(p,1,i as 0|1|2);}else if(p.kind==='leftBridge'){
          if(!behindBridgeSupport(p,-116))drawPiece(p,1,'supportLeft');
          if(!behindBridgeSupport(p,116))drawPiece(p,1,'supportRight');
          if(!bridgeOccludes(p))drawPiece(p,1,'deck');
        }else if(!isForeground(p))drawPiece(p);}
        if(g.held){const held=pieces.find(p=>p.id===g.held);if(held){const v=carry.current,speed=Math.hypot(v.vx,v.vy);
          if(speed>25){ctx.save();ctx.translate(held.x,held.y+SPECS.barrier.h*.19);ctx.rotate(Math.atan2(v.vy,v.vx));ctx.strokeStyle='#03080cbc';ctx.lineWidth=2.5;for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(-8,-5+i*5);ctx.lineTo(-Math.min(32,speed*.075),-5+i*5);ctx.stroke();}ctx.fillStyle='#a9b0aa99';for(let i=0;i<7;i++){const seed=Math.sin(i*79.3+Math.floor(now/65)*13.1);ctx.fillRect(-12-Math.abs(seed)*Math.min(26,speed*.08),-14+i*3,1.3+i%2,1.3+i%2);}ctx.restore();}
         }}
        if(g.attached){const rear=pieces.find(p=>p.id===g.attached&&p.kind==='curvedBarricade');if(rear){const cs=rear.scale||1,c=Math.cos(rear.angle),sn=Math.sin(rear.angle),lx=(g.x-rear.x)*c+(g.y-rear.y)*sn,ly=-(g.x-rear.x)*sn+(g.y-rear.y)*c,seg=REAR_BARRICADE_SEGMENTS.reduce((best,q)=>Math.hypot(lx-q.x*cs,ly-q.y*cs)<Math.hypot(lx-best.x*cs,ly-best.y*cs)?q:best);
          const at=(x:number,y:number)=>{const cs2=Math.cos(seg.angle),sn2=Math.sin(seg.angle),xx=seg.x*cs+x*cs2-y*sn2,yy=seg.y*cs+x*sn2+y*cs2;return{x:rear.x+xx*c-yy*sn,y:rear.y+xx*sn+yy*c};};
          const edge=[at(-seg.w*cs/2,-seg.d*cs/2),at(seg.w*cs/2,-seg.d*cs/2),at(seg.w*cs/2,seg.d*cs/2),at(-seg.w*cs/2,seg.d*cs/2)];ctx.save();ctx.strokeStyle='#7defff';ctx.shadowColor='#41cffe';ctx.shadowBlur=6;ctx.lineWidth=2;ctx.beginPath();edge.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));ctx.closePath();ctx.stroke();ctx.restore();}}
        if(g.attached){const bridge=pieces.find(p=>p.id===g.attached&&p.kind==='leftBridge');if(bridge){const cs=bridge.scale||1,c=Math.cos(bridge.angle),sn=Math.sin(bridge.angle),rx=(g.x-bridge.x)*c+(g.y-bridge.y)*sn,sx=Math.abs(rx+116*cs)<Math.abs(rx-116*cs)?-116*cs:116*cs;
          const at=(x:number,y:number)=>({x:bridge.x+x*c-y*sn,y:bridge.y+x*sn+y*c});const corners=[at(sx-33*cs,-27*cs),at(sx+33*cs,-27*cs),at(sx+33*cs,51*cs),at(sx-33*cs,51*cs)];ctx.save();ctx.strokeStyle='#7defff';ctx.shadowColor='#41cffe';ctx.shadowBlur=7;ctx.lineWidth=2;ctx.beginPath();corners.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));ctx.closePath();ctx.stroke();ctx.restore();}}
        // The painted floor recedes into the stage; scale only Jade's rendered
        // silhouette around her feet. Physics, movement and constructed cover
        // retain their authored dimensions and the near-camera view stays fixed.
        const rearDepth=clamp((g.y/ARENA_SCALE-190)/410,0,1);
        const jadeDepthScale=.76+.24*rearDepth;
        ctx.save();ctx.translate(g.x,g.y);ctx.scale(jadeDepthScale,jadeDepthScale);drawContactShadow(ctx,0,0,40,15);
        if((g.charging||g.chargeRelease>0)&&art.charge?.complete&&art.charge.naturalWidth){
          const atlas=art.charge,frame=g.charging?(g.chargeTime<.8?Math.min(11,Math.floor(g.chargeTime*15)):12+Math.floor(g.chargeTime*11)%4):15;
          const col=frame%4,row=Math.floor(frame/4),sx=Math.round(col*atlas.width/4),sy=Math.round(row*atlas.height/4);
          const sw=Math.round((col+1)*atlas.width/4)-sx,sh=Math.round((row+1)*atlas.height/4)-sy;
          ctx.save();ctx.scale(.82,.82);ctx.globalAlpha=g.charging?1:g.chargeRelease/.28;ctx.filter='drop-shadow(0 0 9px #9d4cff)';
          ctx.drawImage(atlas,sx,sy,sw,sh,-74,-125,148,148);ctx.restore();
        }
        if(g.attached){ctx.strokeStyle='#75f5ff';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,2,26,11,0,0,Math.PI*2);ctx.stroke();}
        const moving=Math.hypot(g.vx,g.vy)>34,active=g.attached?'cover':g.slide>0?'slide':moving?'run':'ready';
        const facing=g.slide>0?g.slideFacing:active==='run'?Math.atan2(g.vy,g.vx):g.angle;
        const pose=selectLabPose({x:g.x,y:g.y,aim:g.angle,vx:g.vx,vy:g.vy,weapon:'shotgun',state:active,attached:g.attached?{id:g.attached}:null,peek:g.peek,contactUntil:0,lastShotAt:g.lastShotAt,frameMoved:moving?1:0,moveInput:moving,moveFacing:facing,slideFacing:g.slideFacing,slideUntil:g.slide>0?now/1000+g.slide:0,slideStartedAt:now/1000-(SLIDE_DURATION-g.slide),kickUntil:g.kickUntil,recoveryUntil:0,travel:g.stepTravel,poseDirections:poseDirections.current},now/1000);
        const im=pose?.family?art[pose.family]:undefined,scale=.40;
        if(g.charging&&(art.chargeLow?.complete&&art.chargeLow.naturalWidth)){
          const raised=g.chargeTime>.45&&(Math.floor(g.chargeTime*5)%4!==0);
          ctx.save();ctx.scale(.82,.82);drawChargePose(ctx,raised?art.chargeHigh:art.chargeLow,g.angle,g.chargeTime);
          ctx.save();ctx.globalCompositeOperation='screen';ctx.shadowColor='#f95abe';ctx.shadowBlur=9;ctx.lineWidth=1.8;
          for(let strand=0;strand<2;strand++){ctx.strokeStyle=strand?'#f956b9':'#73faff';ctx.beginPath();for(let step=0;step<=14;step++){const t=step/14,x=Math.sin(t*16+g.chargeTime*12+strand*Math.PI)*7+(1-t)*3,y=-15-t*66;step?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();}
          ctx.globalAlpha=.7;ctx.strokeStyle='#aaf9ff';ctx.beginPath();ctx.arc(0,-79,14+Math.sin(g.chargeTime*9)*3,Math.PI*1.1,Math.PI*1.9);ctx.stroke();ctx.restore();ctx.restore();
        }else if(g.shield&&((g.marchMoving&&drawShieldMarch(ctx,art.shieldPose,art.shieldDiagonals,g.angle,art.shieldIntermediate,g.travel,Math.max(0,1-(now/1000-g.lastShotAt)/.18)))||drawShieldPose(ctx,art.shieldPose,art.shieldDiagonals,g.angle,art.shieldIntermediate))){
          // The shield keyframe stays braced above a short alternating step.
        }else if(pose&&im?.complete&&im.naturalWidth){const [sx,sy,sw,sh]=pose.sourceRect,x=-pose.anchor[0]*scale,y=-pose.anchor[1]*scale;
          for(const [i,echo] of g.slideEchoes.entries()){ctx.save();ctx.globalAlpha=(.16+i*.03)*Math.min(1,echo.age/.22);ctx.shadowColor=i%2?'#ff4ba4':'#5cfaff';ctx.shadowBlur=12;ctx.drawImage(im,sx,sy,sw,sh,echo.x-g.x+x,echo.y-g.y+y,250*scale,250*scale);ctx.restore();}
          const recoil=Math.max(0,1-(now/1000-g.lastShotAt)/.18);ctx.drawImage(im,sx,sy,sw,sh,x-Math.cos(g.angle)*recoil*5,y-Math.sin(g.angle)*recoil*5,250*scale,250*scale);
        }else if(art.jade?.complete&&art.jade.naturalWidth){image('jade',-42,-87,84,84);
        }
        if(g.shield)drawCrystalShield(ctx,g.angle,g.shieldIntegrity,now/1000,g.shieldImpact,[art.shieldCrystal,art.shieldD01,art.shieldD02,art.shieldD03]);
        ctx.restore();
        for(const p of floor.filter(p=>p.kind==='curvedBarricade'))for(let i=0;i<3;i++)if(behindRearSection(p,i)){drawPiece(p,1,i as 0|1|2);drawRearGhost(ctx,art.jade,g.x,g.y,p,i,now);}
        for(const p of floor.filter(p=>p.kind==='leftBridge')){
          if(behindBridgeSupport(p,-116)){drawPiece(p,1,'supportLeft');drawBridgeGhost(ctx,art.jade,g.x,g.y,p,-116,now);}
          if(behindBridgeSupport(p,116)){drawPiece(p,1,'supportRight');drawBridgeGhost(ctx,art.jade,g.x,g.y,p,116,now);}
          if(bridgeOccludes(p))drawPiece(p,1,'deck');
        }
        for(const p of floor.filter(p=>p.kind!=='leftBridge'&&p.kind!=='curvedBarricade'&&collidable(p)&&isForeground(p))){
          drawPiece(p);if((g.health[p.id]??p.hp)>0)drawHiddenJade(ctx,art.jade,g.x,g.y,p,now,g.health[p.id]??p.hp);
        }
      }
      ctx.restore();id=requestAnimationFrame(frame);
    };
    let padSlide=false,padBuild=false,batteryValue=60;
    id=requestAnimationFrame(frame);return()=>cancelAnimationFrame(id);
  },[slide,shoot,build,release,attach]);

  const point=(e:React.PointerEvent<HTMLCanvasElement>)=>{const b=view.current!.getBoundingClientRect(),t=transform.current;return{x:(e.clientX-b.left-t.ox)/t.scale,y:(e.clientY-b.top-t.oy)/t.scale};};
  const pointerDown=(e:React.PointerEvent<HTMLCanvasElement>)=>{
    const p=point(e);pointer.current=p;
    if(modeRef.current==='play'){if(e.pointerType==='mouse'){controls.current.shoot=true;shoot();}return;}
    const picked=layoutRef.current.pieces.slice().reverse().find(item=>pointOnPiece(p.x,p.y,item,8));
    if(picked){setSelected(picked.id);setTool(null);drag.current={id:picked.id,dx:p.x-picked.x,dy:p.y-picked.y,moved:false,startX:p.x,startY:p.y};e.currentTarget.setPointerCapture(e.pointerId);return;}
    const kind=toolRef.current;if(kind){const spec=SPECS[kind],id=`${kind}-${Date.now()}-${Math.random().toString(36).slice(2,5)}`;
      const item:Piece={id,kind,x:clamp(p.x,spec.w/2+50*ARENA_SCALE,1150*ARENA_SCALE-spec.w/2),y:clamp(p.y,spec.h/2+80*ARENA_SCALE,640*ARENA_SCALE-spec.h/2),angle:kind==='leftBridge'?Math.PI*28/180:0,scale:1,hp:spec.hp};
      update(l=>({...l,pieces:[...l.pieces,item]}));setSelected(id);setTool(null);setNotice(`${spec.label} placed. Resize, rotate, mirror, or duplicate it from the inspector.`);
    }else{setSelected(null);if(zoomRef.current>1){drag.current={id:'__pan',dx:e.clientX,dy:e.clientY,moved:false,startX:p.x,startY:p.y};e.currentTarget.setPointerCapture(e.pointerId);}}
  };
  const pointerMove=(e:React.PointerEvent<HTMLCanvasElement>)=>{
    const p=point(e);pointer.current=p;
    if(modeRef.current==='play')return;
    if(drag.current){const d=drag.current;if(d.id==='__pan'){pan.current.x+=e.clientX-d.dx;pan.current.y+=e.clientY-d.dy;d.dx=e.clientX;d.dy=e.clientY;return;}
      d.moved||=Math.hypot(p.x-d.startX,p.y-d.startY)>3;
      update(l=>({...l,pieces:l.pieces.map(item=>item.id===d.id?{...item,x:clamp(p.x-d.dx,80*ARENA_SCALE,1120*ARENA_SCALE),y:clamp(p.y-d.dy,105*ARENA_SCALE,640*ARENA_SCALE)}:item)}));}
  };
  const pointerUp=()=>{drag.current=null;controls.current.shoot=false;};
  const selectedPiece=layout.pieces.find(p=>p.id===selected);
  const reset=()=>{update(()=>({...INITIAL_LAYOUT,pieces:[]}));setSelected(null);setNotice('Arena cleared. Place your pieces wherever you want.');};
  const restoreReference=()=>{update(()=>({version:1,pieces:INITIAL_LAYOUT.pieces.map(p=>({...p}))}));setSelected('ref-center');setNotice('Original drawing layout restored. Tap a piece to change its size or placement.');};
  const copy=async()=>{try{await navigator.clipboard.writeText(JSON.stringify(layout));setNotice('Layout copied. Paste it into our chat to show me your exact setup.');}catch{setNotice('Clipboard unavailable. Download the layout instead.');}};
  const download=()=>{const blob=new Blob([JSON.stringify(layout,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='dimension33-asset-layout.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  const moveStick=(e:React.PointerEvent<HTMLDivElement>)=>{const b=e.currentTarget.getBoundingClientRect(),x=(e.clientX-b.left-b.width/2)/(b.width/2),y=(e.clientY-b.top-b.height/2)/(b.height/2),m=Math.max(1,Math.hypot(x,y));controls.current.stick={x:x/m,y:y/m};};
  return <main className={styles.shell}>
    <header className={styles.header}><div><span>GOD MODE / DIMENSION 33</span><h1>WAR GAMES · BUILD THE ARENA</h1></div><div className={styles.headerActions}><a href="/cover-piece">COVER REFERENCE ↗</a><button className={mode==='edit'?styles.active:''} onClick={edit}>PLACE PIECES</button><button className={mode==='play'?styles.playActive:''} onClick={play}>SLIDE TEST ▶</button></div></header>
    <div className={styles.workspace}>
      {mode==='edit'&&<aside className={styles.palette} aria-label="Asset selection"><b>REFERENCE BOARD · {layout.pieces.length} PLACED</b><p>The original arena layout spawns automatically. Tap any piece to tune its size or drag it; your changes return every match.</p><b>ADD MORE · 2 APPROVED + 6 TEST</b><div className={styles.assetList}>{[...APPROVED_KINDS,...TRIAL_KINDS].map(k=><button key={k} className={tool===k?styles.picked:''} onClick={()=>{setTool(k);setSelected(null)}}><span className={styles.assetIcon}>▰</span><span>{SPECS[k].label}<small>{k==='leftBridge'?'TEST PIECE · WALK UNDER':k==='curvedBarricade'?'TEST PIECE · THREE COVER FACES':(APPROVED_KINDS as readonly string[]).includes(k)?'APPROVED · '+SPECS[k].hp+' INTEGRITY':'TEST PIECE · '+SPECS[k].hp+' INTEGRITY'}</small></span></button>)}</div><p><a href="/arena-assets/rear-barricade" style={{color:'#79f1ff'}}>COMPARE NEW BARRICADE WITH SOURCE ↗</a> · <a href="/arena-assets/left-bridge" style={{color:'#79f1ff'}}>BRIDGE ↗</a> · <a href="/arena-assets/new-structures" style={{color:'#79f1ff'}}>FOUR NEW PIECES ↗</a></p></aside>}
      <section className={styles.stage} aria-label="Playable layout"><canvas ref={view} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp} aria-label="Dimension 33 editable arena test floor"/><div className={styles.stageTag}>{mode==='edit'?`EDITING FLOOR · ${Math.round(zoom*100)}%`:'ON ARENA FLOOR'}</div>{mode==='edit'&&<div className={styles.zoom}><button onClick={()=>setZoom(z=>clamp(z-.25,1,2.5))} aria-label="Zoom out">−</button><button onClick={()=>setZoom(z=>clamp(z+.25,1,2.5))} aria-label="Zoom in">＋</button></div>}
        {mode==='play'&&<><div className={styles.playStats}><span>DEBRIS <b>{scraps}</b></span><span>HELMET <b>{battery}%</b></span>{hapticStatus!=='off'&&<span>RUMBLE <b>{hapticStatus==='ready'?'READY':'UNAVAILABLE'}</b></span>}<span>ARENA FLOOR</span></div><div className={styles.controlsLegend}>A SLIDE / BRACE / EXIT · Y CHARGE · X FIELD · RB BUILD<br/>PEEK AUTO AT EDGE · RT FIRE · LT SHIELD · LEFT STICK MOVE + POINT</div><div className={styles.joy} onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);moveStick(e)}} onPointerMove={e=>{if(e.buttons)moveStick(e)}} onPointerUp={()=>controls.current.stick={x:0,y:0}} onPointerCancel={()=>controls.current.stick={x:0,y:0}} aria-label="Move and point joystick"><i/></div><div className={styles.touchActions}><button onPointerDown={slide}>SLIDE</button><button onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);build()}} onPointerUp={release} onPointerCancel={release}>COVER</button><button onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);controls.current.touchCharge=true}} onPointerUp={()=>controls.current.touchCharge=false} onPointerCancel={()=>controls.current.touchCharge=false}>CHARGE</button><button onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);controls.current.touchField=true}} onPointerUp={()=>controls.current.touchField=false} onPointerCancel={()=>controls.current.touchField=false}>FIELD</button><button onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);controls.current.touchFire=true;shoot()}} onPointerUp={()=>controls.current.touchFire=false} onPointerCancel={()=>controls.current.touchFire=false}>FIRE</button><button onPointerDown={e=>{e.currentTarget.setPointerCapture(e.pointerId);controls.current.touchShield=true}} onPointerUp={()=>{controls.current.touchShield=false}} onPointerCancel={()=>{controls.current.touchShield=false}}>SHIELD</button></div></>}
      </section>
      {mode==='edit'&&<aside className={styles.inspector}><b>SELECTED PIECE</b>{selectedPiece?<><strong>{SPECS[selectedPiece.kind].label}</strong><span>FLOOR · {Math.round(selectedPiece.x)}, {Math.round(selectedPiece.y)}</span><label style={{display:'grid',gap:8,margin:'18px 0',fontSize:14}}>SIZE · {Math.round((selectedPiece.scale||1)*100)}%<input type="range" min="0.35" max="1.8" step="0.01" value={selectedPiece.scale||1} onChange={e=>{const scale=Number(e.target.value);update(l=>({...l,pieces:l.pieces.map(p=>p.id===selected?{...p,scale}:p)}));}} aria-label="Scale selected asset"/></label><label style={{display:'grid',gap:8,margin:'12px 0',fontSize:14}}>TURN · {Math.round(((selectedPiece.angle*180/Math.PI)%360+360)%360)}°<input type="range" min="0" max="360" step="1" value={((selectedPiece.angle*180/Math.PI)%360+360)%360} onChange={e=>{const angle=Number(e.target.value)*Math.PI/180;update(l=>({...l,pieces:l.pieces.map(p=>p.id===selected?{...p,angle}:p)}));}} aria-label="Rotate selected asset 360 degrees"/></label><div className={styles.inlineActions}>{selectedPiece.kind!=='platform'&&<><button onClick={()=>update(l=>({...l,pieces:l.pieces.map(p=>p.id===selected?{...p,angle:p.angle-Math.PI/12}:p)}))}>↶ 15°</button><button onClick={()=>update(l=>({...l,pieces:l.pieces.map(p=>p.id===selected?{...p,angle:p.angle+Math.PI/12}:p)}))}>15° ↷</button><button onClick={()=>update(l=>({...l,pieces:l.pieces.map(p=>p.id===selected?{...p,flipX:!p.flipX}:p)}))}>MIRROR</button></>}<button onClick={()=>{const source=layoutRef.current.pieces.find(p=>p.id===selected);if(source){const id=`${source.kind}-${Date.now()}`;update(l=>({...l,pieces:[...l.pieces,{...source,id,x:clamp(source.x+35,60*ARENA_SCALE,1140*ARENA_SCALE),y:clamp(source.y+35,80*ARENA_SCALE,640*ARENA_SCALE)}]}));setSelected(id);setNotice('Copy placed. Drag it to the opposite side and mirror or rotate it.');}}}>DUPLICATE</button><button onClick={()=>{update(l=>({...l,pieces:l.pieces.filter(p=>p.id!==selected)}));setSelected(null)}}>REMOVE</button></div></>:<p>Tap a piece to select it, then drag it into position. Place more copies from the palette or duplicate one.</p>}<hr/><b>SINGLE FLOOR</b><p>Every match starts from your saved arrangement. The lower tower block stays usable as cover after its upper block breaks. Generated cover and damage reset on restart.</p><b>YOUR LAYOUT</b><div className={styles.inlineActions}><button onClick={copy}>COPY LAYOUT</button><button onClick={download}>DOWNLOAD</button><button onClick={restoreReference}>RESTORE REFERENCE</button><button onClick={reset}>CLEAR ALL</button></div></aside>}
    </div>
    <footer className={styles.footer}><span>{notice}</span><span>{mode==='play'?'MOVE + POINT WASD / LS · A / Shift slide, brace or exit · E soft contact · peek automatically at cover edge · RT / click fire · RB / C cover · LT / V shield':'Single-floor pieces · resize, duplicate, rotate, mirror · slide along cover edges.'}</span></footer>
  </main>;
}
