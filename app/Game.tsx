"use client";
import {drawSpiral37} from '../lib/spiralPresentation37';
import {interpolateCover35} from "../lib/presentation35";
import {type MatchRules31,PRACTICE_RULES31,validateRules31} from "../lib/matchRules31";
import {drawCitadel29} from '../lib/citadelPresentation29';
import {drawSection27j} from '../lib/psychicPresentation27j';
import {drawStructures27e,withStructureOcclusion27e,drawConcealedSpark27h} from '../lib/arenaPresentation27e';
import {barrelSocket27d} from "../lib/ballistics27d";
import {useCallback,useEffect,useRef,useState} from "react";
import ArenaBuilder27c from "./ArenaBuilder27c";
import {type ArenaLayout27c} from "../lib/arenaLayout27c";
import {updateCamera27c} from "../lib/combatCamera27c";
import {cameraTarget38,cameraZoomStep38,type CameraMode38} from "../lib/cameraDirector38";
import PlaytestGuide from "./PlaytestGuide";
import {paintRaptorSprite} from "../lib/raptorSpriteOnly";
import AnimationQaHarness from "./AnimationQaHarness";
import BayBridgeArena from "./BayBridgeArena";
import GodModeShell from "./GodModeShell";
import {COVER_HEIGHT,withCoverOcclusion} from "../lib/cover-occlusion";
import {DEFAULT_CONFIG,carryBlockReason21,ripReason27j,FIGHT_SCHEMA,BOT_STRATEGY_ID,gripSelection,psychicField,fieldMatter,coverDamageStage,constructionSupply44,constructionPreview21,PSYCHIC_POWERS} from "../lib/game";
import {LocalCombat,isLocalMode} from "../lib/localCombat";
import {GOD_TIERS} from "../lib/gameFramework";
import {bayObject} from "../lib/bayBridgeMap";
import {D33_BARRIER_A20,usesBarrierA20,drawBarrierA20} from "../lib/dimension33Environment20";
import {D33_ATLASES20,d33ImageKey20,artRevision20,drawMapCover20,drawMapArchitecture20,getFloorImage20} from '../lib/dimension33MapArt20';
import {coverMaterial21} from '../lib/dimension33Registration21';
import {drawInteractions21} from '../lib/dimension33Readability21';
import {SelectorGate22,drawSelection22,encounterCamera22,kineticCamera26,stableEncounter27b,minimumZoom27b,type CameraMemory27b} from '../lib/combatPresentation22';
import {fitCombatViewport23} from '../lib/combatViewport23';
import {beginWarScene46,finishWarScene46} from "../lib/warGamesPresentation45";
import {DECK,DECK_SLOPE,DECK_PITCH,DECK_SCREEN_Y,arenaPoint46,arenaJacobian46,relativeWorld46,vertical46,withWorld46,screenVector46,projectWorld,unprojectWorld,withUpright,bayRenderCamera as cameraState} from "../lib/bayBridgePresentation";

const FIGHT_STORAGE="god_mode_fight_memory38";
function readFightMemory(){try{const raw=localStorage.getItem(FIGHT_STORAGE);if(!raw)return null;if(raw.length>2000000)throw Error("Memory exceeds storage limit");const v=JSON.parse(raw);if(v.schema!==FIGHT_SCHEMA||v.strategy!==BOT_STRATEGY_ID)return null;return v;}catch{return null;}}
function storeFightMemory(memory:any,mode:string){const prior=readFightMemory(),value={schema:FIGHT_SCHEMA,strategy:BOT_STRATEGY_ID,mode,profiles:memory.profiles,report:memory.report||prior?.report};const json=JSON.stringify(value);if(json.length>2000000)throw Error("Fight report exceeds local storage limit; download directly");localStorage.setItem(FIGHT_STORAGE,json);return value;}
function downloadFightReport(report:any){if(!report||report.schema!==FIGHT_SCHEMA||report.rounds?.length!==10)throw Error("Complete ten recorded rounds first");const data=JSON.stringify(report,null,2);if(data.length>4000000)throw Error("Report exceeds download limit");const url=URL.createObjectURL(new Blob([data],{type:"application/json"}));try{const a=document.createElement("a");a.href=url;a.download="god-mode-fight-report38.json";document.body.appendChild(a);a.click();a.remove();}finally{setTimeout(()=>URL.revokeObjectURL(url),1000);}}

type Session={local?:boolean;mode?:string;room:string;code?:string;invite?:string;token:string;slot:number};
type Config={legacyPowers:number;chargeMoveScale:number;chargeMoveResponse:number;powerChargeSeconds:number;godDuration:number;godDrain:number;powerRecharge:number;godDamage:number;gripEnergy:number;holdEnergy:number;coverThrowEnergy:number;carryResponse:number;carryTurnResponse:number;carryMomentum:number;slideEnergy:number;dashEnergy:number;rechargeDelay:number;rechargeRate:number;weaveEnabled:number;moveSpeed:number;response:number;stopDrag:number;slideDrag:number;dashSpeed:number;dashDuration:number;doubleTapWindow:number;slideSpeed:number;slideDuration:number;slideSustain:number;slideSteer:number;slideSteerAngle:number;slideSteerResponse:number;slideBrake:number;slideCancelSpeed:number;shotCadence:number;shotSpread:number;shotDamage:number;shotSpeed:number;throwForce:number;pinballSpeed:number;pinballDuration:number;maxHealth:number;spriteScale:number;cameraZoom:number};
const DEFAULT:Config={...DEFAULT_CONFIG};
const EMPTY:any={x:0,y:0,aim:0,fire:false,shield:false,coverAim:false,slide:false,melee:false,heavy:false,grip:false,throwMatter:false,cover:false,orbit:false,launchOrbit:false,pinball:false,powerup:false,slow:false};
function readController(pad:any,i:any,selectors?:boolean[]){
 const down=(n:number)=>!!(pad.buttons[n]?.pressed||pad.buttons[n]?.value>.25),dz=(v:number)=>Math.abs(v)<.18?0:v;
 i.x=dz(pad.axes[0]||0);i.y=dz(pad.axes[1]||0);const rx=dz(pad.axes[2]||0),ry=dz(pad.axes[3]||0);if(rx||ry)i.aim=Math.atan2(ry,rx);i.gripX=rx;i.gripY=ry;
 i.dropMatter34||=down(11);i.jump||=down(10);i.slide||=down(0);i.melee||=down(1);i.powerUse||=down(2);i.powerup||=down(3);i.grip||=down(4);i.cover||=down(5);i.shield||=down(6);i.coverAim||=down(6);i.fire||=down(7);
 const selected=selectors??[down(12),down(13),down(14),down(15)];
 i.weaponCycle||=selected[0];i.powerCycle||=selected[1];i.fieldCycle||=selected[2];i.coverShapeCycle||=selected[3]; // Selection never executes.
 return i;
}
const INPUT_BUTTONS=["dropMatter34","cancelGrip34","jump","slide","fire","shield","coverAim","melee","heavy","grip","throwMatter","cover","orbit","launchOrbit","pinball","powerup","slow","fieldCycle","powerCycle","weaponCycle","powerUse","coverShapeCycle"];
function bufferInput(queue:any[],previous:any,input:any){if(INPUT_BUTTONS.some(k=>!!input[k]!==!!previous[k])){queue.push({...input});if(queue.length>16)queue.shift();}return input;}
const keyAction:Record<string,string>={ShiftLeft:"slide",ShiftRight:"slide",KeyJ:"jump",KeyF:"melee",KeyC:"heavy",KeyQ:"grip",KeyR:"throwMatter",KeyH:"dropMatter34",KeyB:"cover",KeyO:"orbit",KeyP:"launchOrbit",Space:"pinball",KeyX:"slow",KeyV:"powerUse",ArrowLeft:"fieldCycle",ArrowUp:"weaponCycle",ArrowDown:"powerCycle",ArrowRight:"coverShapeCycle"};
const jade=new Map<string,HTMLImageElement>();
const lastGoodSprite=new Map<string,{im:HTMLImageElement;dir:number}>();
type EchoFrame={x:number;y:number;angle:number;family:string;dir:number;frame:number;life:number;maxLife:number;speed:number};
const kineticEcho:EchoFrame[]=[];let echoLast=0;
const hoverWake:{x:number;y:number;age:number;strength:number}[]=[];
const CLASSIC_LETTERS=[[[0,.225],[.21,.445],[.425,.635],[.605,.815],[.785,1]],[[0,.235],[.215,.41],[.385,.565],[.535,.73],[.7,.89],[.855,1]]];
const classicClamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
const classicAssets=new Map<string,HTMLImageElement>();
const floorWake:{x:number;y:number;angle:number;age:number}[]=[];
let slideWasActive=false,slideWord=0,graffiti:any=null;
function classicGraffiti(e:CanvasRenderingContext2D,t:HTMLImageElement|undefined,n:any,r=1){if(!t?.complete||!t.naturalWidth||n.life<=0)return;let i=CLASSIC_LETTERS[n.word],a=t.naturalHeight/2,o=Math.cos(n.angle),s=Math.sin(n.angle)*.58,c=classicClamp(n.age/.22,0,1),l=classicClamp(n.life/.24,0,1),u=1-Math.min(1,n.age/.2);e.save(),e.globalCompositeOperation=`screen`,e.translate(n.originX,n.originY-8),e.globalAlpha=r*l,e.shadowColor=`#75f6ff`,e.shadowBlur=11,e.strokeStyle=`#f8fbff`,e.lineWidth=1.3,e.beginPath(),e.arc(0,0,5+u*13,0,Math.PI*2),e.stroke();for(let t=0;t<7;t++){let i=t*2.399+n.angle,a=(8+t%3*5)*(1-u*.45);e.fillStyle=t%2?`#ff57b6`:`#72f7ff`,e.globalAlpha=r*l*(.35+u*.55),e.fillRect(Math.cos(i)*a-1,Math.sin(i)*a*.58-1,2+t%2,2+t%2)}for(let u=0;u<i.length;u++){let d=classicClamp((n.age-u*.032)/.16,0,1);if(d<=0)continue;let[f,p]=i[u],m=Math.round(f*t.naturalWidth),h=Math.max(1,Math.round((p-f)*t.naturalWidth)),g=h/a,_=27+u%2,v=classicClamp(g*_*.72,18,29),y=10+c*24+u*15,b=o*y,x=s*y-23-Math.sin(d*Math.PI)*4,ee=1+(1-d)*.28;e.save(),e.translate(b,x),e.rotate(Math.sin(n.angle)*.1),e.shadowColor=u%2?`#ff4eae`:`#67f5ff`,e.shadowBlur=8;for(let i=2;i>0;i--)e.globalAlpha=r*l*d*(.08+i*.035),e.drawImage(t,m,n.word*a,h,a,-v/2-o*i*7,-_/2-s*i*7,v*ee,_);e.globalAlpha=r*l*d*.95,e.drawImage(t,m,n.word*a,h,a,-v/2,-_/2,v*ee,_),e.strokeStyle=u%2?`#ff4eae`:`#67f5ff`,e.lineWidth=1.2,e.globalAlpha=r*l*d*.62,e.beginPath(),e.moveTo(-v*.4-o*4,-s*4),e.lineTo(-v*.4-o*(14+d*8),-s*(14+d*8)),e.stroke(),e.restore()}let d=classicClamp(n.age/.055,0,1),f=n.age<.34?1:classicClamp((.56-n.age)/.22,0,1);if(f>0){let i=1-(1-d)**3,c=n.word?104:94,l=n.word?29:28,u=o*(5+i*8),p=-9+s*(3+i*6)-i*4;e.save(),e.globalCompositeOperation=`source-over`,e.translate(u,p),e.rotate(Math.sin(n.angle)*.045),e.scale(.78+i*.22,.78+i*.22),e.globalAlpha=r*f,e.shadowColor=`#05070c`,e.shadowBlur=3,e.filter=`contrast(1.32) saturate(1.25)`,e.drawImage(t,0,n.word*a,t.naturalWidth,a,-c/2,-l/2,c,l),e.filter=`none`,e.shadowColor=n.word?`#ff48ad`:`#63f4ff`,e.shadowBlur=7,e.globalAlpha=r*f*.42,e.drawImage(t,0,n.word*a,t.naturalWidth,a,-c/2,-l/2,c,l),e.restore()}e.restore()}
let loading=false;
const coverAimVisual=new Map<string,number>();
const coverTravelPhase=new Map<string,{phase:number,lastT:number,lastSign:number}>();
type CoverTopology="FACE"|"EDGE"|"CORNER";
const coverTopologyVisual=new Map<string,CoverTopology>();
function coverTopology(p:any):CoverTopology{
 const a=p.coverAnchor;if(!p.coverId||!a||!Number.isFinite(a.t)||!Number.isFinite(a.length))return "FACE";
 const key=p.id||"local",d=Math.min(a.t,a.length-a.t),prev=coverTopologyVisual.get(key)||"FACE";
 // Hysteresis: corner owns the final 8px, edge owns the approach band.
 let next:CoverTopology=prev;
 if(prev==="CORNER")next=d>11?"EDGE":"CORNER";
 else if(prev==="EDGE")next=d<7?"CORNER":d>27?"FACE":"EDGE";
 else next=d<20?(d<7?"CORNER":"EDGE"):"FACE";
 coverTopologyVisual.set(key,next);return next;
}
const presentationQA={unsupportedCoverAim:0,missingExact:0,missing:new Map<string,number>()};
function noteMissing(state:string,family:string,dir:number){const key=`${state}|${family}|d${String(dir).padStart(2,"0")}`;presentationQA.missing.set(key,(presentationQA.missing.get(key)||0)+1)}
function angleDelta(a:number,b:number){return Math.atan2(Math.sin(a-b),Math.cos(a-b))}
function coverAimSector(p:any){
 const raw=p.gunFacing??p.aim??0,key=p.id||"local",step=Math.PI/8,exact=((Math.round(raw/step)%16)+16)%16,prev=coverAimVisual.get(key);
 // 16-sector presentation ring with hysteresis. Gameplay aim remains raw/continuous.
 if(prev!==undefined&&Math.abs(angleDelta(raw,prev*step))<step*.62)return prev;
 coverAimVisual.set(key,exact);return exact;
}
type ActorSectorStatus="AUTHORED"|"COMPOSED"|"SAFE_NEIGHBOR"|"MISSING";
const COVER_ACTOR_SECTORS:ActorSectorStatus[]=[
 "SAFE_NEIGHBOR","SAFE_NEIGHBOR","AUTHORED","SAFE_NEIGHBOR",
 "COMPOSED","SAFE_NEIGHBOR","COMPOSED","SAFE_NEIGHBOR",
 "COMPOSED","SAFE_NEIGHBOR","COMPOSED","SAFE_NEIGHBOR",
 "COMPOSED","SAFE_NEIGHBOR","SAFE_NEIGHBOR","SAFE_NEIGHBOR"
];
function coverActorSectorStatus(p:any){return COVER_ACTOR_SECTORS[coverAimSector(p)]||"MISSING"}
function supportedCoverDir(p:any){
 const raw=p.gunFacing??p.aim??0,exact24=((Math.round(raw/(Math.PI*2)*24)%24)+24)%24;
 if(!p.coverId||p.coverMode!=="braced"||!p.input?.coverAim)return exact24;
 const sector=coverAimSector(p),sectorAngle=sector*Math.PI/8;
 // Existing 30/45/60 art is presentation donor material only. Pick it only when close;
 // otherwise the Sprite Actor falls through to a safe approved whole-body pose.
 const donors=[2,3,4];let best=donors[0],err=Infinity;for(const d of donors){const e=Math.abs(angleDelta(sectorAngle,d*Math.PI/12));if(e<err){err=e;best=d}}
 if(err<=Math.PI/12){coverAimVisual.set((p.id||"local")+"-donor",best);return best}
 presentationQA.unsupportedCoverAim++;return exact24;
}
const snapshots:{state:any;at:number}[]=[];
let snapshotGap=33;
function recordSnapshot(s:any,at:number){const last=snapshots.at(-1);if(last&&s.lastAt<=last.state.lastAt)return;if(last)snapshotGap+=(Math.max(16,Math.min(180,at-last.at))-snapshotGap)*.12;snapshots.push({state:s,at});if(snapshots.length>20)snapshots.shift()}
function presentation(s:any,now:number){
 if(s.local)return s;
 if(snapshots.length<2)return s;
 const target=now-Math.max(65,Math.min(140,snapshotGap*2));
 while(snapshots.length>2&&snapshots[1].at<=target)snapshots.shift();
 const a=snapshots[0],b=snapshots[1],blend=Math.max(0,Math.min(1,(target-a.at)/Math.max(1,b.at-a.at))),base=blend<1?a.state:b.state;
 const angle=(x:number,y:number)=>x+Math.atan2(Math.sin(y-x),Math.cos(y-x))*blend;
 const mix=(xs:any[],ys:any[])=>xs.map(x=>{const y=ys.find(y=>x.id===y.id);return y?{...x,x:x.x+(y.x-x.x)*blend,y:x.y+(y.y-x.y)*blend,...typeof x.a==="number"&&typeof y.a==="number"?{a:angle(x.a,y.a)}:{}}:x});
 const players=base.players.map((p:any,n:number)=>{const q=a.state.players[n],r=b.state.players[n];if(!q||!r||q.coverId!==r.coverId||q.hp<=0||r.hp<=0)return p;return {...p,x:q.x+(r.x-q.x)*blend,y:q.y+(r.y-q.y)*blend,z:(q.z||0)+((r.z||0)-(q.z||0))*blend,vz:(q.vz||0)+((r.vz||0)-(q.vz||0))*blend,vx:q.vx+(r.vx-q.vx)*blend,vy:q.vy+(r.vy-q.vy)*blend,gunFacing:angle(q.gunFacing,r.gunFacing),aim:angle(q.aim,r.aim),...q.charging&&r.charging?{chargeAge:q.chargeAge+(r.chargeAge-q.chargeAge)*blend,godCharge:q.godCharge+(r.godCharge-q.godCharge)*blend}:{}};});
 const covers=(base.covers||[]).map((c:any)=>{const next=(b.state.covers||[]).find((q:any)=>q.id===c.id);if(!next||blend>=1)return c;return interpolateCover35(c,next,blend,q=>!!carryBlockReason21(q,c,{...base,players}));});
 return {...base,time:a.state.time+(b.state.time-a.state.time)*blend,players,covers,matter:mix(base.matter||[],b.state.matter||[]),shots:mix(base.shots||[],b.state.shots||[])};
}
const powerAssets=new Map<string,HTMLImageElement>();
const evolutionAssets=new Map<string,HTMLImageElement>();
const actorAssets=new Map<string,HTMLImageElement>();
const environmentAssets=new Map<string,HTMLImageElement>();
type BootState={done:number;total:number;failed:number;label:string};
let preloadPromise:Promise<BootState>|null=null;
function loadImage(src:string,onReady:(im:HTMLImageElement)=>void,progress:(ok:boolean)=>void,fallback?:string){
 return new Promise<void>(resolve=>{
  const im=new Image();im.decoding="async";let settled=false;
  const finish=async(ok:boolean)=>{if(settled){if(ok&&im.naturalWidth)onReady(im);return}settled=true;clearTimeout(timer);if(ok){try{await Promise.race([im.decode(),new Promise(r=>setTimeout(r,900))])}catch{}if(im.naturalWidth)onReady(im);else ok=false}progress(ok);resolve()};
  // Full Safari can leave cross-origin Image requests pending indefinitely. Never let one asset deadlock boot.
  const timer=setTimeout(()=>void finish(false),3500);
  let fallbackUsed=false;im.onload=()=>void finish(true);im.onerror=()=>{if(fallback&&!fallbackUsed){fallbackUsed=true;im.src=fallback;return}void finish(false)};im.src=src;
 });
}
function preload(onProgress?:(s:BootState)=>void){
 if(preloadPromise)return preloadPromise;
 preloadPromise=(async()=>{
  const power=["cover-d02-d04-exposure-v1","cover-d03-exposure-v1","cover-d03-connectors-v1","psychic-d03-v1","grounded-float-v1","front-d06-loop-v1","front-d06-transitions-v1","front-right-d03-sequence-v1","front-right-d03-dissolve-v1","opening","continuation","face-opening","face-continuation"];
  const actor=[["lower","/assets/sprite-actor-pack03a/lower_body_pack03a.webp"],["aim","/assets/sprite-actor-pack03a/aim_keys_pack03a.webp"],["connectors","/assets/sprite-actor-pack03a/connectors_pack03a.webp"]] as const;
  const classic=[["graffiti","/assets/dimension33-map/slide-graffiti-skeet-skurt-v2.png"],["ground","/assets/shotgun-v57-ground-effects.png"],["concrete","/assets/dimension33-map/concrete-cover-atlas-v2.png"]] as const;
  const sprites:{key:string;src:string}[]=[];
  for(const family of ["ready","run","slide","cover"])for(let d=0;d<24;d++){const n=(family==="run"||family==="slide")&&d===3?`${family}.webp`:`${family}-d${String(d).padStart(2,"0")}.webp`;sprites.push({key:`${family}-${d}`,src:"https://god-helmet-arcade.leslieadams-isrh.chatgpt.site/assets/shotgun-complete/runtime/"+n})}
  const environment=["damaged-jersey","fractured-divider","wrecked-sedan","service-van","maintenance-cabinet","fractured-girder","broken-railing","roadwork-equipment","service-module","maintenance-block"] as const;
  const evolution=[["helix-front","/assets/god-evolution-tier1/helix-front-atlas.svg"],["helix-rear","/assets/god-evolution-tier1/helix-rear-atlas.svg"],["flame","/assets/god-evolution-tier1/flame-atlas.svg"],["geometry","/assets/god-evolution-tier1/geometry-atlas.svg"],["crystal-code","/assets/god-evolution-tier1/crystal-atlas.svg"],["code","/assets/god-evolution-tier1/code-atlas.svg"],["ground-fracture","/assets/god-evolution-tier1/ground-atlas.svg"]] as const;
  const jobs:{label:string;src:string;fallback?:string;ready:(im:HTMLImageElement)=>void}[]=[
   {label:"baron29",src:"/assets/dimension33/build29/baron-broadcast.webp",ready:(im:HTMLImageElement)=>environmentAssets.set("baron29",im)},
   {label:"matter42",src:"/assets/matter42/tumble-atlas.webp",ready:(im:HTMLImageElement)=>environmentAssets.set("matter42",im)},
   {label:"war-foundation45",src:"/assets/dimension33/arena-evolution.svg",fallback:"/assets/war-games45/foundation.webp",ready:(im:HTMLImageElement)=>environmentAssets.set("war-foundation45",im)},
   {label:"d33-cover-preview",src:"/assets/dimension33/cover-straight-a-preview.svg",ready:(im:HTMLImageElement)=>environmentAssets.set("d33-cover-preview",im)},
   {label:D33_BARRIER_A20.key,src:D33_BARRIER_A20.path,ready:(im:HTMLImageElement)=>environmentAssets.set(D33_BARRIER_A20.key,im)},
   ...D33_ATLASES20.map(name=>({label:d33ImageKey20(name),src:'/assets/dimension33/map20/'+name+'.webp',ready:(im:HTMLImageElement)=>environmentAssets.set(d33ImageKey20(name),im)})),
   ...environment.map(key=>({label:"env-"+key,src:"/assets/bay-bridge/manga-v13/"+key+".webp",fallback:"/assets/bay-bridge/actors/"+key+".svg",ready:(im:HTMLImageElement)=>environmentAssets.set(key,im)})),
   ...evolution.map(([key,path])=>({label:"evo-"+key,src:path,ready:(im:HTMLImageElement)=>evolutionAssets.set(key,im)})),
   ...["front-right","rear-left"].map(key=>({label:"melee38-"+key,src:"/assets/melee38/"+key+".webp",ready:(im:HTMLImageElement)=>powerAssets.set("melee38-"+key,im)})),
   ...power.map(key=>({label:key,src:"/assets/god-frame/"+key+".png",ready:(im:HTMLImageElement)=>powerAssets.set(key,im)})),
   ...actor.map(([key,path])=>({label:"actor-"+key,src:path,ready:(im:HTMLImageElement)=>actorAssets.set(key,im)})),
   ...classic.map(([key,path])=>({label:key,src:"https://jade-v1-combat-lab-v142.leslieadams-isrh.chatgpt.site"+path,ready:(im:HTMLImageElement)=>classicAssets.set(key,im)})),
   ...sprites.map(x=>({label:x.key,src:x.src,ready:(im:HTMLImageElement)=>jade.set(x.key,im)}))
  ];
  let done=0,failed=0;const total=jobs.length;loading=true;
  const progress=(label:string)=>(ok:boolean)=>{done++;if(!ok)failed++;onProgress?.({done,total,failed,label})};
  // Bounded parallel batches avoid hammering iPad/Safari with 100 simultaneous decodes.
  for(let i=0;i<jobs.length;i+=12)await Promise.all(jobs.slice(i,i+12).map(j=>loadImage(j.src,j.ready,progress(j.label),j.fallback)));
  // A remote atlas failure is recoverable because safestSprite holds approved loaded poses.
  // Boot completion is mandatory; individual remote requests are not.
  loading=false;return{done,total,failed,label:"READY"};
 })();
 return preloadPromise;
}

// Combat43: confirmation-only feedback; never creates hits, damage or controller inputs.
type FeedbackCue43={kind:string;angle?:number;damage:number};
const feedbackPrefs43={sound:true,haptics:false};
let hapticAt43=-1000;
function pickFeedback43(events:any[],slot:number,s?:any):FeedbackCue43|null{
 const hits=events.filter(e=>e.kind==="hit"&&e.target===slot),blocks=events.filter(e=>e.kind==="shield"&&e.target===slot);
 if(hits.length){const last=hits.at(-1);return{kind:last.source==="cover-throw"?"slam-fighter":"damage",angle:last.incomingAngle,damage:hits.reduce((n,e)=>n+e.damage,0)};}
 if(blocks.length)return{kind:blocks.some(e=>e.parry)?"parry":"block",angle:blocks.at(-1).incomingAngle,damage:0};
 const cover=s?defendedCover43(s,slot):null;
 if(cover&&events.some(e=>{if(e.kind!=="cover")return false;const dx=e.x-cover.x,dy=e.y-cover.y,a=cover.a||0;return Math.abs(dx*Math.cos(a)+dy*Math.sin(a))<=cover.w/2+6&&Math.abs(-dx*Math.sin(a)+dy*Math.cos(a))<=cover.h/2+6;}))return{kind:"cover-defense",damage:0};
 const outgoing=events.filter(e=>e.owner===slot),event=outgoing.find(e=>e.kind==="finish")||outgoing.at(-1);
 return event?{kind:event.source==='rip'?'tear':event.kind==='hit'&&event.source==='cover-throw'?'slam-fighter':event.kind==='cover'&&event.source==='cover-throw'?'slam-'+(event.material==='metal'?'metal':'stone'):event.kind,damage:event.damage||0}:null;
}
function hapticFeedback43(cue:FeedbackCue43){
 if(!feedbackPrefs43.haptics||typeof navigator==="undefined")return;
 const now=performance.now();if(now-hapticAt43<120)return;
 try{const pad=[...navigator.getGamepads()].find(Boolean) as any,actuator=pad?.vibrationActuator;
  if(!actuator?.playEffect)return;hapticAt43=now;
  const pair=cue.kind==="damage"?[.6,.25]:cue.kind==="block"?[.18,.35]:cue.kind==="hit"?[.08,.2]:[.04,.1];
  const result=actuator.playEffect("dual-rumble",{duration:cue.kind==="damage"?90:55,startDelay:0,strongMagnitude:pair[0],weakMagnitude:pair[1]});
  if(result?.catch)void result.catch(()=>{});
 }catch{}
}
const frames43={intervals:new Float64Array(300),draws:new Float64Array(300),index:0,count:0,last:0,key:"",longTasks:0,longTaskMs:0,active:false};
function resetFrames43(key:string){frames43.index=frames43.count=frames43.last=frames43.longTasks=frames43.longTaskMs=0;frames43.key=key;frames43.active=false;}
function recordFrame43(stamp:number,cpu:number,key:string,active:boolean){
 if(key!==frames43.key)resetFrames43(key);frames43.active=active;
 if(!active){frames43.last=0;return;}
 if(frames43.last&&stamp>frames43.last){const n=frames43.index;frames43.intervals[n]=stamp-frames43.last;frames43.draws[n]=Math.max(0,cpu);frames43.index=(n+1)%300;frames43.count=Math.min(300,frames43.count+1);}
 frames43.last=stamp;
}
function frameSummary43(){
 const count=frames43.count,intervals=Array.from(frames43.intervals.slice(0,count)).sort((a,b)=>a-b),draws=Array.from(frames43.draws.slice(0,count)).sort((a,b)=>a-b);
 const percentile=(xs:number[],p:number)=>xs.length?xs[Math.min(xs.length-1,Math.ceil(xs.length*p)-1)]:null;
 return{samples:count,window:"last 300 active frame intervals",median:percentile(intervals,.5),p95:percentile(intervals,.95),p99:percentile(intervals,.99),worst:intervals.at(-1)??null,drawMedian:percentile(draws,.5),drawP95:percentile(draws,.95),over33:intervals.filter(v=>v>33.34).length,over50:intervals.filter(v=>v>50).length,longTasks:frames43.longTasks,longTaskMs:frames43.longTaskMs};
}
function defendedCover43(s:any,slot:number){const p=s.players[slot];if(!p)return null;return s.covers.find((cv:any)=>cv.id===p.coverId&&cv.hp>0)||s.covers.filter((cv:any)=>cv.constructOwner===slot&&cv.hp>0&&Math.hypot(cv.x-p.x,cv.y-p.y)<psychicField(p).radius).sort((a:any,b:any)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0]||null;}
function drawDefense43(g:CanvasRenderingContext2D,s:any,slot:number){
 if(s.mode==="watch")return;const p=s.players[slot];if(!p)return;
 const events=(s.events||[]).filter((e:any)=>s.time>=e.at&&s.time-e.at<.42),hits=events.filter((e:any)=>e.kind==="hit"&&e.target===slot),blocks=events.filter((e:any)=>e.kind==="shield"&&e.target===slot),last=hits.at(-1)||blocks.at(-1);
 g.save();
 if(last){const damage=hits.length>0,fade=Math.max(0,1-(s.time-last.at)/.42);g.globalAlpha=fade;g.lineWidth=2;g.strokeStyle=damage?"#ffb0bf":"#a9f7ff";g.fillStyle=g.strokeStyle;
  if(Number.isFinite(last.incomingAngle)){const a=last.incomingAngle,from=arenaPoint46(p.x,p.y),to=arenaPoint46(p.x+Math.cos(a)*30,p.y+Math.sin(a)*30),bearing=Math.atan2(to.y-from.y,to.x-from.x),x=500+Math.cos(bearing)*442,y=310+Math.sin(bearing)*260;
   g.save();g.translate(x,y);g.rotate(bearing);g.beginPath();g.moveTo(11,0);g.lineTo(-8,-7);g.lineTo(-3,0);g.lineTo(-8,7);g.closePath();g.fill();g.restore();
  }
  g.textAlign="center";g.font="bold 11px monospace";g.fillText(damage?"DAMAGE RECEIVED · "+Math.round(hits.reduce((n:number,e:any)=>n+e.damage,0)):"YOUR SHIELD BLOCKED",500,151);
 }
 const cv=defendedCover43(s,slot);
 if(cv){const ratio=Math.max(0,Math.min(1,cv.hp/Math.max(1,cv.maxHp))),stage=coverDamageStage(cv.hp,cv.maxHp),label=["INTACT","CHIPPED","FRACTURED","CRITICAL"][stage]||"CRITICAL";
  const attached=p.coverId===cv.id,captured=s.players.some((q:any,n:number)=>n!==slot&&q.gripCoverId===cv.id),state=captured?"CAPTURED":attached?"ATTACHED":"NEARBY";
  g.globalAlpha=1;g.textAlign="left";g.font="bold 9px monospace";g.fillStyle="#111722df";g.fillRect(73,277,154,60);g.fillStyle=stage===3?"#ffd39e":"#bdeaf2";g.fillText(state+" · "+label,80,289);g.fillStyle="#060b13";g.fillRect(80,296,137,5);g.fillStyle=stage===3?"#ffd39e":"#9ed4df";g.fillRect(80,296,137*ratio,5);g.fillStyle="#d8e3ec";g.font="8px monospace";g.fillText(cv.protected45?"ANCHORED · ANGLE MATTERS":Math.ceil(cv.hp)+" HP · ANGLE MATTERS",80,313);g.fillText(attached?"A / LEFT STICK · ESCAPE":"A · SLIDE / ATTACH",80,329);
 }
 g.restore();
}

let combatAudio:AudioContext|null=null;
let audioVoices35=0; // At most twelve active oscillator voices, including layered slams.
function unlockCombatAudio(){try{const C=window.AudioContext||(window as any).webkitAudioContext;if(!combatAudio&&C)combatAudio=new C();void combatAudio?.resume().catch(()=>{});}catch{}}
function combatTone(kind:string,angle?:number){
 if(!feedbackPrefs43.sound||!combatAudio||combatAudio.state!=="running"||audioVoices35+(kind.startsWith("slam-")?3:1)>12)return;const a=combatAudio,now=a.currentTime;
 if(kind.startsWith('slam-')){
  // Reuse the existing synthesized audio path: transient, body, then settling.
  const metal=kind==='slam-metal',body=kind==='slam-fighter';
  for(const [delay,hz,duration,volume] of [[0,metal?690:body?280:180,.045,.035],[.015,metal?105:body?85:65,.2,.055],[.075,metal?360:125,.12,.018]]){
   audioVoices35++;const o=a.createOscillator(),v=a.createGain();o.type=metal?'triangle':'sine';o.frequency.setValueAtTime(hz,now+delay);o.frequency.exponentialRampToValueAtTime(Math.max(35,hz*.4),now+delay+duration);v.gain.setValueAtTime(volume,now+delay);v.gain.exponentialRampToValueAtTime(.001,now+delay+duration);o.connect(v);v.connect(a.destination);o.start(now+delay);o.stop(now+delay+duration);o.onended=()=>{audioVoices35--;o.disconnect();v.disconnect();};
  }return;
 }
 audioVoices35++;const osc=a.createOscillator(),gain=a.createGain();
 const frequency=kind==="tear"?210:kind==="parry"?1500:kind==="cover-defense"?155:kind==="damage"?95:kind==="block"?950:kind==="hit"?330:kind==="shield"?780:kind==="cover"?130:kind==="finish"?90:kind==="fight"?660:440;
 osc.type=kind==="tear"?"sawtooth":kind==="cover"?"triangle":"sine";osc.frequency.setValueAtTime(frequency,now);osc.frequency.exponentialRampToValueAtTime(Math.max(40,frequency*.65),now+.09);gain.gain.setValueAtTime(.045,now);gain.gain.exponentialRampToValueAtTime(.001,now+.13);osc.connect(gain);const pan=a.createStereoPanner?.();if(pan){pan.pan.value=Number.isFinite(angle)?Math.cos(angle!):0;gain.connect(pan);pan.connect(a.destination);}else gain.connect(a.destination);osc.start(now);osc.stop(now+.14);osc.onended=()=>{audioVoices35--;osc.disconnect();gain.disconnect();pan?.disconnect()};
}
export default function Game({character="jade",cameraPreset="default",combatLab=false}:{character?:"jade"|"raptor";cameraPreset?:"default"|"close"|"kinetic";combatLab?:boolean}={}){
 useEffect(()=>{
  const el=canvas.current,parent=el?.parentElement;if(!el||!parent)return;
  const fit=()=>{const size=fitCombatViewport23(parent.clientWidth,parent.clientHeight);Object.assign(el.style,{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%, -50%)',width:size.width+'px',height:size.height+'px'});};
  const observer=new ResizeObserver(fit);observer.observe(parent);fit();return()=>observer.disconnect();
 },[]);
 const characterRef=useRef(character);characterRef.current=character;const cameraPresetRef=useRef(cameraPreset);cameraPresetRef.current=cameraPreset;
 const [cameraMode38,setCameraMode38]=useState<CameraMode38>("auto");
 const [cameraZoom38,setCameraZoom38]=useState(0);
 const cameraModeRef38=useRef(cameraMode38);cameraModeRef38.current=cameraMode38;
 const cameraZoomRef38=useRef(cameraZoom38);cameraZoomRef38.current=cameraZoom38;
 const [sound43,setSound43]=useState(true),[rumble43,setRumble43]=useState(false);
 useEffect(()=>{const visibility43=()=>{frames43.last=0;frames43.active=false;};document.addEventListener("visibilitychange",visibility43);return()=>document.removeEventListener("visibilitychange",visibility43);},[]);
 useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem("god-mode-feedback43")||"null");if(saved){feedbackPrefs43.sound=saved.sound!==false;feedbackPrefs43.haptics=saved.haptics===true;setSound43(feedbackPrefs43.sound);setRumble43(feedbackPrefs43.haptics);}}catch{}},[]);
 const feedbackSettings43=(sound:boolean,haptics:boolean)=>{feedbackPrefs43.sound=sound;feedbackPrefs43.haptics=haptics;setSound43(sound);setRumble43(haptics);try{localStorage.setItem("god-mode-feedback43",JSON.stringify({sound,haptics}));}catch{}};
 useEffect(()=>{if(typeof PerformanceObserver==="undefined"||!PerformanceObserver.supportedEntryTypes?.includes("longtask"))return;const observer=new PerformanceObserver(list=>{if(!frames43.active||document.hidden)return;for(const entry of list.getEntries()){frames43.longTasks++;frames43.longTaskMs+=entry.duration;}});observer.observe({type:"longtask",buffered:false});return()=>observer.disconnect();},[]);
 const [visibleHeight,setVisibleHeight]=useState(0);
 useEffect(()=>{const viewport=window.visualViewport,fit=()=>setVisibleHeight(Math.round(viewport?.height||window.innerHeight));fit();window.addEventListener("resize",fit);viewport?.addEventListener("resize",fit);return()=>{window.removeEventListener("resize",fit);viewport?.removeEventListener("resize",fit);};},[]);
 const [fightStored,setFightStored]=useState<any>(null),[memoryNotice,setMemoryNotice]=useState("");const memoryFetched=useRef("");
 const [combatAudit,setCombatAudit]=useState<any>(null),[auditStatus,setAuditStatus]=useState("");const inputTiming=useRef({rtt:0,samples:0});
 const hudPhase=useRef("");const configRef=useRef<any>(DEFAULT);
 const hudAt=useRef(0);const streamOpen=useRef(false);const [netStatus,setNetStatus]=useState("CONNECTING");const [inviteLink,setInviteLink]=useState("");
 const feedbackSeen=useRef({room:"",round:0,seq:0,cue:""});
 const coverPreview=useRef(-1);const [previewCover,setPreviewCover]=useState(-1);const psychicPreview=useRef(-1);const [previewPsychic,setPreviewPsychic]=useState(-1);const chargePreview=useRef(false);const [previewCharging,setPreviewCharging]=useState(false);
 const [joinRoom,setJoinRoom]=useState(""),[joinCode,setJoinCode]=useState(""),[roomMessage,setRoomMessage]=useState("");
 const startHeld=useRef(false);const canvas=useRef<HTMLCanvasElement>(null),session=useRef<Session|null>(null),state=useRef<any>(null),seq=useRef(0),keys=useRef<Record<string,boolean>>({}),edges=useRef<Record<string,boolean>>({}),mouse=useRef({x:500,y:310,down:false}),lastAccept=useRef(performance.now()),started=useRef(false);const touchMove=useRef({x:0,y:0}),touchDirs=useRef(new Map<number,{x:number;y:number}>()),touchA=useRef(false),touchAEdge=useRef(false),touchTime=useRef(false),touchJump=useRef(false);
 const [rules31,setRules31]=useState<MatchRules31>({...PRACTICE_RULES31});
 useEffect(()=>{try{const raw=localStorage.getItem("god_mode_practice_rules31");if(raw)setRules31(validateRules31(JSON.parse(raw)));}catch{}},[]);
 const chooseRules31=(next:MatchRules31)=>{setRules31(next);try{localStorage.setItem("god_mode_practice_rules31",JSON.stringify(next));}catch{}};
 const [diagnostics30,setDiagnostics30]=useState(false);
 const [hud,setHud]=useState<any>(null),[qaMode,setQaMode]=useState(false),[studioMenu,setStudioMenu]=useState(false),[gameShell,setGameShell]=useState(!combatLab),[status,setStatus]=useState("BOOTING"),[boot,setBoot]=useState<BootState>({done:0,total:112,failed:0,label:"INITIALIZING HELMET"}),[bootReady,setBootReady]=useState(false),[director,setDirector]=useState(false),[spritePanel,setSpritePanel]=useState(false),[config,setConfig]=useState<Config>(DEFAULT),[note,setNote]=useState(""),[padStatus,setPadStatus]=useState("CONTROLLER: WAITING"),[padGate,setPadGate]=useState(!combatLab),[testPass,setTestPass]=useState<Record<string,boolean>>({});
 const [builderOpen,setBuilderOpen]=useState(false);const builderRef=useRef(false);builderRef.current=builderOpen;
 const debugRef21=useRef(false);const [debug21,setDebug21]=useState(false);
 const selectorGate22=useRef(new SelectorGate22());
 const localCombat=useRef<LocalCombat|null>(null);
 const post=useCallback(async(body:any)=>{if(body.action==="create"&&isLocalMode(body.mode)){const engine=new LocalCombat(body.name||"Les",body.mode,performance.now(),body.rules31);if(body.layout)engine.command({action:"arenaLayout",room:engine.room,token:engine.token,layout:body.layout});localCombat.current=engine;return engine.reply();}if(localCombat.current&&body.room===localCombat.current.room)return localCombat.current.command(body);const sentAt=performance.now();const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),2500);try{const r=await fetch("/api/game",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body),signal:controller.signal}),v=await r.json();if(!r.ok)throw Error(v.error||"Request failed");if(body.action==="create"||body.action==="join")localCombat.current=null;if(body.action==="input"){inputTiming.current.rtt=performance.now()-sentAt;inputTiming.current.samples++;}return v;}finally{clearTimeout(timeout);}},[]);
 const reviewCombat=async()=>{const ss=session.current;if(!ss)return;setAuditStatus("Loading confirmed outcomes…");if(ss.local&&localCombat.current){setCombatAudit({...localCombat.current.diagnostics(),frameTimes:frameSummary43(),requestRtt:0,inputRtt:0,inputSamples:0,snapshotGap:0});setAuditStatus("");return;}try{const at=performance.now(),u=new URL("/api/game",location.origin);u.searchParams.set("room",ss.room);u.searchParams.set("token",ss.token);u.searchParams.set("audit","1");const r=await fetch(u,{cache:"no-store"}),v=await r.json();if(!r.ok)throw Error(v.error||"Audit unavailable");setCombatAudit({...v.diagnostics,frameTimes:frameSummary43(),requestRtt:performance.now()-at,inputRtt:inputTiming.current.rtt,inputSamples:inputTiming.current.samples,snapshotGap});setAuditStatus("");}catch(e:any){setAuditStatus(e.message);}};
 const accept=useCallback((v:any)=>{if(v.state){if(state.current&&v.state.round===state.current.round&&v.state.lastAt<=state.current.lastAt)return;const at=performance.now();if(state.current&&v.state.round!==state.current.round){snapshots.length=0;kineticEcho.length=0;hoverWake.length=0;cameraState.ready=false}const incoming=v.state,room=session.current?.room||"",seen=feedbackSeen.current;
 if(seen.room!==room||seen.round!==incoming.round){seen.room=room;seen.round=incoming.round;seen.seq=incoming.eventSeq||0;seen.cue="";}
 else{const fresh=(incoming.events||[]).filter((e:any)=>e.seq>seen.seq&&incoming.time-e.at<.3);seen.seq=Math.max(seen.seq,incoming.eventSeq||0);const cue=pickFeedback43(fresh,session.current?.slot||0,incoming);if(cue){combatTone(cue.kind,cue.angle);hapticFeedback43(cue);}}
 const cue=incoming.phase==="countdown"?String(Math.ceil(incoming.countdown)):incoming.phase==="playing"&&incoming.time<(incoming.fightUntil||0)?"fight":"";if(cue&&cue!==seen.cue)combatTone(cue);seen.cue=cue;
 if(!incoming.local)recordSnapshot(incoming,at);state.current=v.state;seq.current=Math.max(seq.current,incoming.players[session.current?.slot||0]?.lastSeq||0);lastAccept.current=at;if(incoming.phase==="countdown"&&hudPhase.current!=="countdown")document.querySelector("details.fightRoom")?.removeAttribute("open");if(at-hudAt.current>100||incoming.phase!==hudPhase.current){setHud(v.state);hudAt.current=at;hudPhase.current=incoming.phase;}if(JSON.stringify(v.state.config)!==JSON.stringify(configRef.current)){configRef.current=v.state.config;setConfig(v.state.config||DEFAULT);}setStatus(incoming.build==="COMBAT-MASTER-STUDIO-47"?"COMBAT 47 · STADIUM SCALE":incoming.build==="COMBAT-MASTER-STUDIO-46"?"COMBAT 46 · ARENA / FLOOR":incoming.build==="COMBAT-MASTER-STUDIO-45"?"COMBAT 45 · WAR GAMES":incoming.build==="COMBAT-MASTER-STUDIO-44"?"COMBAT 44 · GROUND PEEL":incoming.build==="COMBAT-MASTER-STUDIO-43"?"COMBAT 43 · DEFENSE / FEEDBACK":incoming.build==="COMBAT-MASTER-STUDIO-42"?"COMBAT 42 LIVE · LIVING MATTER":"COMBAT MASTER LIVE")}},[]);
 const create=useCallback(async()=>{if(started.current)return;started.current=true;try{let saved:any=null;try{saved=JSON.parse(sessionStorage.getItem("god_mode_studio_session")||"null")}catch{}const invite=new URLSearchParams(location.hash.slice(1)),invitedRoom=invite.get("room"),inviteToken=invite.get("invite");const requestedWatch=new URLSearchParams(location.search).get("watch")==="1";if(saved&&(saved.local||isLocalMode(saved.mode))){saved=null;sessionStorage.removeItem("god_mode_studio_session");}if(saved&&(!requestedWatch||saved.mode==="watch")&&(!invitedRoom||saved.room===invitedRoom)){try{session.current=saved;const u=new URL("/api/game",location.origin);u.searchParams.set("room",saved.room);u.searchParams.set("token",saved.token);const r=await fetch(u,{cache:"no-store"});if(r.ok){const restored=await r.json();accept(restored);if(restored.state?.mode==="duel"||restored.state?.mode==="practice"||restored.state?.mode==="watch"){setGameShell(false);if(restored.state?.mode==="watch")setPadGate(false);}return}}catch{}if(saved.mode==="watch")setMemoryNotice("Previous watch room expired or restarted; live round reset. Completed reports remain saved.");session.current=null;sessionStorage.removeItem("god_mode_studio_session")}const v=invitedRoom&&inviteToken?await post({action:"join",room:invitedRoom,invite:inviteToken,name:"Player 2"}):await post({action:"create",name:"Les",mode:requestedWatch?"watch":"solo",...requestedWatch?{memoryProfile:readFightMemory()?.profiles,memoryMode:readFightMemory()?.mode}:{}}),s={room:v.room,code:v.code,invite:v.invite,token:v.token,slot:v.slot,mode:v.state?.mode,local:!!v.local};if(invitedRoom||requestedWatch){setGameShell(false);setPadGate(false);}session.current=s;sessionStorage.setItem("god_mode_studio_session",JSON.stringify(s));accept(v)}catch(e:any){started.current=false;setStatus(e.message)}},[accept,post]);
 useEffect(()=>{let dead=false;(async()=>{setStatus("GOD HELMET BOOT");const result=await preload(v=>{if(!dead)setBoot(v)});if(dead)return;setBoot(result);setBootReady(true);setStatus(result.failed?"BOOT READY · FALLBACKS AVAILABLE":"HELMET ONLINE");await create()})();return()=>{dead=true}},[create]);
 useEffect(()=>{
   const connected=(e:GamepadEvent)=>{setPadStatus(`CONTROLLER: ${e.gamepad.id||"CONNECTED"}`);setPadGate(false);canvas.current?.focus()};
   const disconnected=()=>{keys.current={};edges.current={CancelGrip34:true};mouse.current.down=false;selectorGate22.current.sample(null);setPadStatus("CONTROLLER: DISCONNECTED");setPadGate(true)};
   addEventListener("gamepadconnected",connected as EventListener);
   addEventListener("gamepaddisconnected",disconnected as EventListener);
   try{const p=[...navigator.getGamepads()].find(Boolean);if(p){setPadStatus(`CONTROLLER: ${p.id||"CONNECTED"}`);setPadGate(false)}}catch{}
   return()=>{removeEventListener("gamepadconnected",connected as EventListener);removeEventListener("gamepaddisconnected",disconnected as EventListener)}
 },[]);
 useEffect(()=>{const kd=(e:KeyboardEvent)=>{if(/INPUT|TEXTAREA|SELECT/.test((e.target as HTMLElement)?.tagName))return;if(["Space","ShiftLeft","ShiftRight","ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.code))e.preventDefault();if(builderRef.current)return;if(!keys.current[e.code])edges.current[e.code]=true;keys.current[e.code]=true},ku=(e:KeyboardEvent)=>keys.current[e.code]=false;addEventListener("keydown",kd);addEventListener("keyup",ku);return()=>{removeEventListener("keydown",kd);removeEventListener("keyup",ku)}},[]);
 useEffect(()=>{let dead=false,source:EventSource|null=null,active:Session|null=null,lastStream=0,busy=false;const timer=setInterval(async()=>{
 const ss=session.current;if(ss?.local){source?.close();source=null;active=null;streamOpen.current=false;setNetStatus("LOCAL · NO NETWORK");return;}if(!ss||dead)return;
 if(active!==ss){source?.close();active=ss;streamOpen.current=false;const u=new URL("/api/game/stream",location.origin);u.searchParams.set("room",ss.room);u.searchParams.set("token",ss.token);if(typeof EventSource!=="undefined"){source=new EventSource(u);source.onmessage=e=>{if(dead||session.current!==ss)return;lastStream=performance.now();streamOpen.current=true;setNetStatus("CONNECTED");try{accept(JSON.parse(e.data))}catch{}};source.onerror=()=>{streamOpen.current=false;setNetStatus("RECONNECTING");};}}
 if(streamOpen.current&&performance.now()-lastStream<500||busy)return;busy=true;
 try{const u=new URL("/api/game",location.origin);u.searchParams.set("room",ss.room);u.searchParams.set("token",ss.token);const r=await fetch(u,{cache:"no-store"}),v=await r.json();if(dead||session.current!==ss)return;if(r.ok){accept(v);setNetStatus("CONNECTED");}else if(r.status===404&&v.error==="ROOM_NOT_FOUND"){source?.close();session.current=null;sessionStorage.removeItem("god_mode_studio_session");started.current=false;seq.current=0;snapshots.length=0;cameraState.ready=false;setRoomMessage("Lobby expired — host a fresh fight and share its invite");await create();}}
 catch{setNetStatus("RECONNECTING");}finally{busy=false;}
 },100);return()=>{dead=true;clearInterval(timer);source?.close();streamOpen.current=false;};},[accept,create]);
 useEffect(()=>{let raf=0;const uiLoop=()=>{try{const pad=[...navigator.getGamepads()].find(Boolean) as Gamepad|undefined;if(pad){const start=!!(pad.buttons[9]?.pressed||pad.buttons[9]?.value>.25);if(start&&!startHeld.current)setStudioMenu(v=>!v);startHeld.current=start}else startHeld.current=false}catch{}raf=requestAnimationFrame(uiLoop)};raf=requestAnimationFrame(uiLoop);return()=>cancelAnimationFrame(raf)},[]);
 useEffect(()=>{let pending=false,dead=false,raf=0,latest:any={...EMPTY},previous:any={...EMPTY},owner:Session|null=null;const queue:any[]=[];
 const sample=()=>{const s=session.current,g=state.current;if(s&&g&&bootReady&&!document.hidden){if(owner!==s){owner=s;queue.length=0;previous={...EMPTY};}
 const p=g.players[s.slot]||g.players[0],i:any={...EMPTY};i.x=touchMove.current.x||((keys.current.KeyD?1:0)-(keys.current.KeyA?1:0));i.y=touchMove.current.y||((keys.current.KeyS?1:0)-(keys.current.KeyW?1:0));i.jump=touchJump.current;touchJump.current=false;i.slide=touchA.current||touchAEdge.current;touchAEdge.current=false;const muzzle=barrelSocket27d(p,g.config?.spriteScale||.82),zoom=cameraState.ready?cameraState.zoom:g.config?.cameraZoom||1.85;let aimZ=muzzle.z;
 for(const [slot,target] of g.players.entries()){if(slot===s.slot||target.hp<=0)continue;const feet=projectWorld(target.x,target.y,cameraState,zoom,target.z||0),height=78*(g.config?.spriteScale||.82)*(target.slide>0?.58:1),width=22*zoom*.64;if(Math.abs(mouse.current.x-feet.x)<=width&&mouse.current.y<=feet.y&&mouse.current.y>=feet.y-height*zoom*.64){aimZ=(target.z||0)+(feet.y-mouse.current.y)/(zoom*.64);break;}}
 const pointer=unprojectWorld(mouse.current.x,mouse.current.y+aimZ*zoom*.64,cameraState,zoom);i.aimX=pointer.x;i.aimY=pointer.y;i.aimZ=aimZ;i.aim=Math.atan2(pointer.y-muzzle.y,pointer.x-muzzle.x);i.cancelGrip34=!!edges.current.CancelGrip34;i.fire=mouse.current.down||!!keys.current.KeyT;i.shield=!!keys.current.KeyE;i.coverAim=!!keys.current.KeyZ;for(const[k,a]of Object.entries(keyAction))i[a]=!!i[a]||!!edges.current[k];edges.current={};i.melee=!!keys.current.KeyF;i.grip=i.grip||!!keys.current.KeyQ;i.gripX=Math.cos(i.aim)*Math.min(1,Math.hypot(pointer.x-p.x,pointer.y-p.y)/psychicField(p).radius);i.gripY=Math.sin(i.aim)*Math.min(1,Math.hypot(pointer.x-p.x,pointer.y-p.y)/psychicField(p).radius);i.slow=!!keys.current.KeyX||touchTime.current;i.powerup=!!keys.current.KeyY||chargePreview.current;
  try{const pad=[...navigator.getGamepads()].find(Boolean) as Gamepad|undefined;const selectors=selectorGate22.current.sample(studioMenu?null:pad||null);if(pad&&!studioMenu){delete i.aimX;delete i.aimY;delete i.aimZ;i.aim=p.aim;readController(pad,i,selectors);if(Math.hypot(i.gripX||0,i.gripY||0)>.15){const v=screenVector46(p.x,p.y,i.gripX,i.gripY);i.aim=Math.atan2(v.y,v.x);i.gripX=v.x;i.gripY=v.y;}}}catch{}
  if(studioMenu||builderRef.current){i.cancelGrip34=true;Object.assign(i,{dropMatter34:false,x:0,y:0,jump:false,fire:false,shield:false,coverAim:false,slide:false,melee:false,heavy:false,grip:false,throwMatter:false,cover:false,orbit:false,launchOrbit:false,pinball:false,powerup:false,slow:false,fieldCycle:false,powerCycle:false,weaponCycle:false,powerUse:false,coverShapeCycle:false})}

 latest=i;previous=bufferInput(queue,previous,i);if(s.local&&localCombat.current&&!builderRef.current){accept(localCombat.current.frame(performance.now(),latest,queue));}}
 raf=requestAnimationFrame(sample);};raf=requestAnimationFrame(sample);
 const timer=setInterval(async()=>{const ss=session.current;if(dead||pending||!ss||ss.local||!bootReady||state.current?.mode==="watch")return;pending=true;const input=queue.shift()||latest;try{const reply=await post({action:"input",...ss,seq:++seq.current,input});if(!dead&&session.current===ss&&!streamOpen.current)accept(reply);}catch{queue.length=0;}finally{pending=false;}},33);
 const pauseLocal=()=>{if(document.hidden){queue.length=0;latest={...EMPTY};previous={...EMPTY};localCombat.current?.pause();selectorGate22.current.sample(null);keys.current={};edges.current={CancelGrip34:true};mouse.current.down=false;touchMove.current={x:0,y:0};touchA.current=false;touchAEdge.current=false;}};const blur36=()=>{keys.current={};edges.current={CancelGrip34:true};mouse.current.down=false;};addEventListener("blur",blur36);document.addEventListener("visibilitychange",pauseLocal);
 return()=>{dead=true;cancelAnimationFrame(raf);clearInterval(timer);removeEventListener("blur",blur36);document.removeEventListener("visibilitychange",pauseLocal);localCombat.current?.pause();};},[accept,post,bootReady,studioMenu,builderOpen]);
 useEffect(()=>{let id=0;const loop=(stamp:number)=>{const start=performance.now();draw(canvas.current,state.current,lastAccept.current,mouse.current,keys.current,psychicPreview.current,coverPreview.current,session.current?.slot||0,characterRef.current,cameraPresetRef.current,debugRef21.current,cameraModeRef38.current,cameraZoomRef38.current);const s=state.current;recordFrame43(stamp,performance.now()-start,(session.current?.room||"")+"/"+s?.round,!document.hidden&&!!s&&["playing","finisher"].includes(s.phase));id=requestAnimationFrame(loop)};id=requestAnimationFrame(loop);return()=>cancelAnimationFrame(id)},[]);
 const point=(e:React.PointerEvent)=>{const c=canvas.current;if(!c)return;const r=c.getBoundingClientRect();mouse.current.x=(e.clientX-r.left)/r.width*1000;mouse.current.y=(e.clientY-r.top)/r.height*620};
 const patch=async(key:keyof Config,value:number)=>{const next={...config,[key]:value};setConfig(next);const s=session.current;if(s)try{accept(await post({action:"config",...s,patch:{[key]:value}}))}catch{}};
 const applyMovementPreset=async(name:string)=>{const preset=MOVEMENT_PRESETS[name];if(!preset)return;const movementKeys=new Set(Object.values(MOVEMENT_PRESETS).flatMap(p=>Object.keys(p)));const values:Partial<Config>={};for(const k of movementKeys)values[k as keyof Config]=DEFAULT[k as keyof Config];Object.assign(values,preset);const saved=session.current;if(!saved)return;try{accept(await post({action:"config",...saved,patch:values}));setTestPass({});setNote(name+" APPLIED")}catch(e:any){setNote(e.message||"PRESET FAILED")}};
 const openBuilder=()=>{keys.current={};edges.current={CancelGrip34:true};mouse.current.down=false;touchMove.current={x:0,y:0};touchA.current=false;touchAEdge.current=false;touchJump.current=false;touchTime.current=false;touchDirs.current.clear();localCombat.current?.pause();setStudioMenu(false);setGameShell(false);setBuilderOpen(true);};
 const playLayout=async(layout:ArenaLayout27c)=>{const ss=session.current;if(!ss)throw Error("Game is still starting");const reply=await post({action:"arenaLayout",...ss,layout});accept(reply);cameraState.ready=false;setBuilderOpen(false);localCombat.current?.pause();};
 const reset=async()=>{const s=session.current;if(!s)return;try{accept(await post({action:"reset",...s}))}catch{}};
 const repulseLab21=async(enabled:boolean,patch:Record<string,number>={})=>{const ss=session.current;if(!ss?.local)return;try{accept(await post({action:"repulse21",...ss,enabled,patch}));setAuditStatus("");}catch(e:any){setAuditStatus(e.message);}};
 const save=()=>{localStorage.setItem("god_mode_studio_combat_preset",JSON.stringify(config));setNote("PRESET SAVED LOCALLY");setTimeout(()=>setNote(""),1200)};
 const load=async()=>{try{const p=JSON.parse(localStorage.getItem("god_mode_studio_combat_preset")||"null");if(!p)return setNote("NO PRESET SAVED");const s=session.current;if(s)for(const[k,v]of Object.entries(p))await post({action:"config",...s,patch:{[k]:v}});setConfig({...DEFAULT,...p});setNote("PRESET LOADED")}catch{setNote("PRESET ERROR")}};
 const enterSession=(v:any)=>{const next={room:v.room,code:v.code,invite:v.invite,token:v.token,slot:v.slot,mode:v.state?.mode,local:!!v.local};session.current=next;sessionStorage.setItem("god_mode_studio_session",JSON.stringify(next));seq.current=0;snapshots.length=0;state.current=null;cameraState.ready=false;accept(v);setGameShell(false);if(v.state?.mode==="duel"&&v.state?.phase==="lobby")document.querySelector("details.fightRoom")?.setAttribute("open","");else document.querySelector("details.fightRoom")?.removeAttribute("open");setInviteLink("");setRoomMessage(v.local?"Local play ready — no game connection required":v.code?"Share an invite — the fight starts when Player 2 joins":"Joined — countdown starts automatically")};
 const practiceFight=async()=>{unlockCombatAudio();try{enterSession(await post({action:"create",name:"Les",mode:"practice",rules31,layout:hud?.arenaLayout}));setStudioMenu(false)}catch(e:any){setRoomMessage(e.message)}};
 const watchFight=async()=>{unlockCombatAudio();setPadGate(false);try{enterSession(await post({action:"create",name:"Spectator",mode:"watch",memoryProfile:readFightMemory()?.profiles,memoryMode:readFightMemory()?.mode}))}catch(e:any){setRoomMessage(e.message)}};
 const watchPause=async()=>{const ss=session.current;if(ss)accept(await post({action:"watchControl",...ss,paused:!state.current?.watchPaused}));};
 const refreshFightMemory=async()=>{const ss=session.current;if(!ss)return;const u=new URL("/api/game",location.origin);u.searchParams.set("room",ss.room);u.searchParams.set("token",ss.token);u.searchParams.set("memory","1");const r=await fetch(u,{cache:"no-store"}),v=await r.json();if(!r.ok||!v.memory)throw Error(v.error||"Memory unavailable");setFightStored(v.memory);try{storeFightMemory(v.memory,v.state?.fightMemory?.mode||"baseline");setMemoryNotice(previous=>previous.includes("room expired")?previous:"Saved in this browser · experimental strategy memory");}catch(e:any){setMemoryNotice(e.message+" · combat continues");}return v.memory;};
 useEffect(()=>{setFightStored(readFightMemory());},[]);
 useEffect(()=>{if(hud?.mode!=="watch")return;const key=session.current?.room+":"+hud.round+":"+hud.fightMemory?.reportReady;if(memoryFetched.current===key)return;memoryFetched.current=key;void refreshFightMemory().catch(e=>setMemoryNotice(e.message));},[hud?.mode,hud?.round,hud?.fightMemory?.reportReady]);
 const memoryControl=async(operation:string)=>{const ss=session.current;if(!ss)return;try{const v=await post({action:"fightMemory",...ss,operation,...operation==="adaptive"?{profiles:readFightMemory()?.profiles}:{}});accept(v);setFightStored(v.memory);try{storeFightMemory(v.memory,v.state?.fightMemory?.mode||"baseline");setMemoryNotice(operation==="record"?"Recording ten completed rounds · download unlocks at10/10":"Saved in this browser · strategy changes start with a fresh round");}catch(e:any){setMemoryNotice(e.message+" · combat continues");}}catch(e:any){setMemoryNotice(e.message);}};
 const downloadReport=async()=>{try{const report=state.current?.fightMemory?.reportReady?(await refreshFightMemory())?.report:fightStored?.report||readFightMemory()?.report;downloadFightReport(report);setMemoryNotice("Fight data downloaded — bring the JSON and video into chat");}catch(e:any){setMemoryNotice(e.message);}};
 const hostFight=async()=>{unlockCombatAudio();try{enterSession(await post({action:"create",name:"Player 1",mode:"duel",rules31}));setStudioMenu(false)}catch(e:any){setRoomMessage(e.message)}};
 const joinFight=async()=>{unlockCombatAudio();try{enterSession(await post({action:"join",room:joinRoom,code:joinCode,name:"Player 2"}))}catch(e:any){setRoomMessage(e.message)}};
 const shareFight=async()=>{const ss=session.current;if(!ss||ss.slot!==0)return;try{const v=ss.invite?ss:await post({action:"invite",...ss});const link=new URL(location.pathname,location.origin);link.hash=new URLSearchParams({room:ss.room,invite:v.invite}).toString();setInviteLink(link.href);if(navigator.share){try{await navigator.share({title:"Join my GOD MODE fight",url:link.href});return}catch{}}try{await navigator.clipboard.writeText(link.href);setRoomMessage("Invite copied — send it to James");}catch{setRoomMessage("Copy the invite link below");}}catch(e:any){setRoomMessage(e.message)}};
 const activateController=()=>{unlockCombatAudio();canvas.current?.focus();try{const p=[...navigator.getGamepads()].find(Boolean);if(p){setPadStatus(`CONTROLLER: ${p.id||"CONNECTED"}`);setPadGate(false)}else{setPadStatus("CONTROLLER: PRESS A / MOVE STICK");setPadGate(false)}}catch{setPadStatus("CONTROLLER API NOT READY")}};
 const touchDirDown=(e:React.PointerEvent,x:number,y:number)=>{unlockCombatAudio();e.preventDefault();(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);touchDirs.current.set(e.pointerId,{x,y});let sx=0,sy=0;for(const v of touchDirs.current.values()){sx+=v.x;sy+=v.y}const mag=Math.hypot(sx,sy)||1;touchMove.current={x:Math.max(-1,Math.min(1,sx/mag)),y:Math.max(-1,Math.min(1,sy/mag))};setPadGate(false)};
 const touchDirUp=(e:React.PointerEvent)=>{e.preventDefault();touchDirs.current.delete(e.pointerId);let sx=0,sy=0;for(const v of touchDirs.current.values()){sx+=v.x;sy+=v.y}const mag=Math.hypot(sx,sy)||1;touchMove.current=touchDirs.current.size?{x:sx/mag,y:sy/mag}:{x:0,y:0}};
 const touchADown=(e:React.PointerEvent)=>{e.preventDefault();(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);touchA.current=true;touchAEdge.current=true;setPadGate(false)};
 const touchAUp=(e:React.PointerEvent)=>{e.preventDefault();touchA.current=false};
 const p=hud?.players?.[session.current?.slot||0];
 const tests=(config.weaveEnabled<.5?[
  ["FULL SLIDE",(p?.slide||0)>0],
  ["SOFT COVER",!!p?.coverId&&p?.coverMode==="soft"],
  ["COVER FLOW",!!p?.coverId&&Math.abs(p?.coverSpeed||0)>35],
  ["BRACED COVER",!!p?.coverId&&p?.coverMode==="braced"],
  ["LT EXPOSURE",!!p?.coverId&&p?.coverMode==="braced"&&!!p?.input?.coverAim],
  ["COVER FIRE",!!p?.coverId&&(p?.fireState||0)>0],
  ["COVER EXIT",!!p?.kickStage&&p?.kickStage!=="none"],
  ["RIP / CARRY",!!p?.gripCoverId],
  ["THROW COVER",!!hud?.fx?.some((f:any)=>f.type==="cover-throw")]
 ]:[
  ["BOOST DASH",!!p?.dash],
  ["FULL SLIDE",(p?.slide||0)>0],
  ["SUSTAIN",!!p?.slide&&Math.hypot(p?.vx||0,p?.vy||0)>(config.slideSpeed*.88)],
  ["CURVE",!!p?.slide&&Math.abs(p?.slideSteerCurrent||0)>.35],
  ["KINETIC BRAKE",(p?.brake||0)>0],
  ["SOFT COVER",!!p?.coverId&&p?.coverMode==="soft"],
  ["BRACED COVER",!!p?.coverId&&p?.coverMode==="braced"],
  ["COVER EXIT",!!p?.exit]
 ]) as [string,boolean][];
 useEffect(()=>{if(!p)return;setTestPass(prev=>{let changed=false,next={...prev};for(const [name,active] of tests)if(active&&!next[name]){next[name]=true;changed=true}return changed?next:prev})},[p?.dash,p?.slide,p?.slideSteerCurrent,p?.brake,p?.coverId,p?.coverMode,p?.coverSpeed,p?.input?.coverAim,p?.fireState,p?.kickStage,p?.exit,p?.gripCoverId,hud?.fx,config.weaveEnabled]);
 return <main className={(hud?.mode==="watch"?"studio studioWatch":"studio")+(diagnostics30?" diagnostics30":" play30")} style={hud?.mode==="watch"&&visibleHeight?{height:visibleHeight}:undefined}>
  <div style={{position:"fixed",left:12,top:12,zIndex:2147483000,display:"flex",gap:6,alignItems:"center",background:"#071521ee",border:"1px solid #54798c",borderRadius:9,padding:7}}>
   <label htmlFor="camera38" style={{color:"#d9f8ff",font:"bold 11px Arial"}}>CAMERA</label>
   <select id="camera38" aria-label="Camera mode" value={cameraMode38} onChange={e=>setCameraMode38(e.target.value as CameraMode38)} style={{background:"#193144",color:"#fff",border:"1px solid #66879a",padding:6,borderRadius:5}}>
    <option value="auto">AUTO</option><option value="wide">WIDE</option><option value="cinematic">CINEMATIC</option><option value="tactical">TACTICAL</option>
   </select>
   <button type="button" aria-label="Zoom out" onClick={()=>setCameraZoom38(v=>Math.max(-.6,v-.15))} style={{padding:"6px 10px"}}>−</button>
   <button type="button" aria-label="Zoom in" onClick={()=>setCameraZoom38(v=>Math.min(.6,v+.15))} style={{padding:"6px 10px"}}>+</button>
   <button type="button" onClick={()=>{setCameraMode38("auto");setCameraZoom38(0)}} style={{padding:"6px 8px"}}>RESET</button>
  </div>
  {builderOpen&&<ArenaBuilder27c initial={state.current?.arenaLayout} onClose={()=>{setBuilderOpen(false);localCombat.current?.pause();}} onPlay={playLayout}/>}
  {gameShell&&<GodModeShell onPlay={()=>setGameShell(false)} onTraining={()=>{setGameShell(false);setQaMode(true)}} onSettings={()=>{setGameShell(false);setStudioMenu(true)}} onArenaBuilder={openBuilder} onDirector={()=>{setGameShell(false);setDirector(true)}}/>}
  <header><div><small>GOD MODE: BREAK THE CODE</small><b>DIMENSION 33 · THE BARON’S WAR GAMES</b></div><span>{status}</span></header>
  <div className="stageWrap">
   {!bootReady&&<div className="controllerGate" aria-live="polite"><b>GOD HELMET BOOT</b><small>LOADING COMBAT MEMORY · {boot.done}/{boot.total}</small><small>{boot.label}{boot.failed?` · ${boot.failed} FALLBACK${boot.failed===1?"":"S"}`:""}</small><i style={{display:"block",width:"min(320px,70vw)",height:8,border:"1px solid currentColor",marginTop:10}}><span style={{display:"block",height:"100%",width:`${boot.total?boot.done/boot.total*100:0}%`,background:"currentColor"}}/></i></div>}
   <BayBridgeArena rulesPanel={<section className="rules31" aria-label="Practice and match rules"><b>PLAYTEST RULES · NEXT SESSION</b><label>Battery<select value={rules31.battery} onChange={e=>chooseRules31({...rules31,battery:e.target.value as MatchRules31["battery"]})}><option value="unlimited">UNLIMITED</option><option value="current">CURRENT BALANCE</option></select></label><label>Practice opponent<select value={rules31.opponent} onChange={e=>chooseRules31({...rules31,opponent:e.target.value as MatchRules31["opponent"]})}><option value="target">TARGET</option><option value="sparring">SPARRING</option><option value="full">FULL PRESSURE</option></select></label><label>Extraction capacity<select value={rules31.capacity32===undefined?'auto':'custom'} onChange={e=>{const next={...rules31};if(e.target.value==='auto')delete next.capacity32;else next.capacity32=50;chooseRules31(next);}}><option value="auto">AUTO</option><option value="custom">CUSTOM</option></select></label>{rules31.capacity32!==undefined&&<label>Effective capacity {rules31.capacity32}%<input type="range" min="0" max="100" step="5" value={rules31.capacity32} onChange={e=>chooseRules31({...rules31,capacity32:Number(e.target.value)})}/></label>}<small>Capacity changes chunk selection only; it does not change battery or rip cost. AUTO uses current battery, or full capacity with unlimited battery.</small><small>Unlimited battery removes energy costs. Health, cooldowns, collision, and object limits still apply. Selections apply when starting a new session.</small><button onClick={practiceFight}>START / RESET PRACTICE</button><button onClick={hostFight}>HOST NEW FIGHT · {rules31.battery==="unlimited"?"UNLIMITED":"CURRENT BALANCE"}</button>{hud?.mode==="duel"&&session.current?.slot===0&&<button disabled={hud.phase!=="lobby"&&hud.phase!=="finished"} onClick={async()=>{try{accept(await post({...session.current,action:"rules31",rules31}));setRoomMessage("Rules updated for next round");}catch(e:any){setRoomMessage(e.message);}}}>APPLY TO LOBBY / NEXT ROUND</button>}<small role="status">{roomMessage}</small></section>} diagnostics30={diagnostics30} onDiagnostics30={()=>setDiagnostics30(v=>!v)} onArenaBuilder={openBuilder} s={hud} menuOpen={studioMenu} onMenuToggle={()=>setStudioMenu(v=>!v)} onAnimationQa={()=>setQaMode(v=>!v)} onDirector={()=>setDirector(v=>!v)} onSprites={()=>setSpritePanel(v=>!v)} onReset={reset}/>
   <canvas ref={canvas} width={1400} height={868} onPointerMove={point} onPointerDown={e=>{unlockCombatAudio();if(builderRef.current)return;point(e);mouse.current.down=true;(e.currentTarget as HTMLElement).focus();(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)}} onPointerUp={()=>mouse.current.down=false} onPointerCancel={()=>mouse.current.down=false}/>
   {!gameShell&&!studioMenu&&hud?.mode!=="watch"&&<div className="touchPlaytestPad" aria-label="Touch playtest movement controls">
    <div className="touchActions30" aria-label="Psychic combat touch controls">{[['KeyT','FIRE'],['KeyQ',p?.gripCoverId||p?.gripId?'THROW':'FLICK / HOLD'],['KeyB',p?.gripCoverId?'PLACE':'BUILD'],['KeyE','SHIELD'],['KeyF','MELEE'],['ArrowRight','SHAPE'],['KeyY','CHARGE'],['KeyH','DROP']].map(([key,label])=><button key={key} aria-label={label} onPointerDown={e=>{unlockCombatAudio();e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);keys.current[key]=true;edges.current[key]=true;}} onPointerUp={()=>{keys.current[key]=false;}} onPointerCancel={()=>{if(key==="KeyQ")edges.current.CancelGrip34=true;keys.current[key]=false;}} onLostPointerCapture={()=>{if(key==="KeyQ"&&keys.current[key])edges.current.CancelGrip34=true;keys.current[key]=false;}}>{label}</button>)}</div>
    <div className="touchDpad">
     <button className="up" aria-label="Move up" onPointerDown={e=>touchDirDown(e,0,-1)} onPointerUp={touchDirUp} onPointerCancel={touchDirUp}>▲</button>
     <button className="left" aria-label="Move left" onPointerDown={e=>touchDirDown(e,-1,0)} onPointerUp={touchDirUp} onPointerCancel={touchDirUp}>◀</button>
     <button className="right" aria-label="Move right" onPointerDown={e=>touchDirDown(e,1,0)} onPointerUp={touchDirUp} onPointerCancel={touchDirUp}>▶</button>
     <button className="down" aria-label="Move down" onPointerDown={e=>touchDirDown(e,0,1)} onPointerUp={touchDirUp} onPointerCancel={touchDirUp}>▼</button>
    </div>
    <button className="touchTime27g" aria-label="Bullet time" onPointerDown={e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);touchTime.current=true;}} onPointerUp={()=>touchTime.current=false} onPointerCancel={()=>touchTime.current=false}>X · BULLET TIME</button><button className="touchJump27g" aria-label="Jump" onPointerDown={e=>{e.preventDefault();touchJump.current=true;}}>JUMP · J / L3</button>
    <button className="touchAButton" aria-label="A boost and slide" onPointerDown={touchADown} onPointerUp={touchAUp} onPointerCancel={touchAUp}><b>A</b><small>BOOST · TAP-TAP SLIDE</small></button>
   </div>}
   <details className="fightRoom"><summary>PRIVATE FIGHT · {hud?.phase||"READY"}</summary><button onClick={watchFight}>WATCH TWO BOTS · NO CONTROLLER</button><button onClick={practiceFight}>THREE-COVER BOT BATTLE</button><button onClick={hostFight}>HOST TWO-PLAYER FIGHT</button>{session.current?.slot===0&&hud?.mode==="duel"&&<button onClick={shareFight}>INVITE PLAYER 2</button>}{inviteLink&&<input aria-label="Private invite link" readOnly value={inviteLink} onFocus={e=>e.target.select()}/>}<small>{netStatus}</small><details><summary>Manual join fallback</summary><input aria-label="Room ID" placeholder="ROOM ID" value={joinRoom} onChange={e=>setJoinRoom(e.target.value.toUpperCase())}/><input aria-label="Room code" placeholder="6-DIGIT CODE" value={joinCode} onChange={e=>setJoinCode(e.target.value)}/><button onClick={joinFight}>JOIN FIGHT</button></details>{session.current?.slot===0&&(hud?.mode==="duel"||hud?.mode==="practice"||hud?.mode==="watch")&&<button disabled={hud.players.length<2} onClick={reset}>START / NEXT ROUND</button>}<small>{roomMessage}</small></details>
   {(hud?.mode==="duel"||hud?.mode==="practice"||hud?.mode==="watch")?<div className="fightScore" role="status" aria-live="polite">{hud.players.map((f:any,i:number)=><span key={i}>{i===session.current?.slot?"YOU":f.name} · HP {Math.ceil(f.hp)} / {config.maxHealth} · BAT {Math.ceil(f.battery)} · WINS {f.score}</span>)}<b>{hud.phase==="countdown"?Math.ceil(hud.countdown):hud.phase==="finisher"?"FINISHER":hud.phase==="finished"?(hud.winner===null?"DRAW — HOST: NEXT ROUND":`ROUND WON · ${hud.players[hud.winner]?.name||"PLAYER"} — HOST: NEXT ROUND`):hud.phase==="lobby"?"WAITING FOR PLAYER 2 / HOST START":"ROUND "+hud.round}</b></div>:<div className="minimalHud"><b>HP {Math.ceil(p?.hp??config.maxHealth)}</b><span className="padLine">{config.weaveEnabled<.5?"CLASSIC · A SLIDE":"WEAVE · A DOUBLE-TAP SLIDE"}</span><i style={{width:`${p?.battery??100}%`}}/><span>BATTERY {Math.ceil(p?.battery??100)}%</span><span>{p?.charging?`CHARGE ${Math.round((p.godCharge||0)*100)}%`:p?.godTime>0?`TIER I · ${p.godTime.toFixed(1)}s`:"HOLD Y · EVOLVE"}</span><span className="padLine">{padStatus}</span></div>}
   {bootReady&&padGate&&hud?.mode!=="watch"&&<button className="controllerGate" onClick={activateController}>CONNECT CONTROLLER<small>Optional · keyboard and touch are ready</small></button>}
   <details className="combatAudit"><summary>COMBAT AUDIT · FEEDBACK & PERFORMANCE</summary><label><input type="checkbox" checked={debug21} onChange={e=>{debugRef21.current=e.target.checked;setDebug21(e.target.checked)}}/> Detailed HUD and bot intentions</label><label><input type="checkbox" checked={sound43} onChange={e=>feedbackSettings43(e.target.checked,rumble43)}/> Combat sound</label><label><input type="checkbox" checked={rumble43} onChange={e=>feedbackSettings43(sound43,e.target.checked)}/> Controller vibration (optional; device support required)</label><button onClick={reviewCombat}>REFRESH CONFIRMED OUTCOMES</button><p>{auditStatus}</p>{combatAudit&&<><p>Round {combatAudit.round} · {combatAudit.phase}<br/>Input request RTT: {combatAudit.inputSamples?`${combatAudit.inputRtt.toFixed(0)} ms`:"not sampled"} · snapshot gap {combatAudit.snapshotGap.toFixed(0)} ms<br/>Battery loss: {(combatAudit.energySpent||[]).map((v:number,n:number)=>`P${n+1} ${v.toFixed(1)}`).join(" · ")}</p><pre>{JSON.stringify(combatAudit.holds33||[],null,2)}</pre><ol>{(combatAudit.actions||[]).slice(-12).reverse().map((e:any)=><li key={e.seq}>P{e.owner+1} · {e.action} · {e.status}{e.reason?` · ${e.reason}`:""}{e.amount!==undefined?` · ${e.amount.toFixed(1)}`:""}</li>)}</ol>{combatAudit.frameTimes&&<p>Active frame window: {combatAudit.frameTimes.samples}/300 samples<br/>Frame interval median / p95 / p99 / worst: {[combatAudit.frameTimes.median,combatAudit.frameTimes.p95,combatAudit.frameTimes.p99,combatAudit.frameTimes.worst].map(v=>v==null?"collecting":v.toFixed(1)+" ms").join(" / ")}<br/>Draw CPU median / p95: {[combatAudit.frameTimes.drawMedian,combatAudit.frameTimes.drawP95].map(v=>v==null?"collecting":v.toFixed(1)+" ms").join(" / ")}<br/>Frames over 33 ms: {combatAudit.frameTimes.over33} · over 50 ms: {combatAudit.frameTimes.over50}<br/>Observed long tasks: {combatAudit.frameTimes.longTasks} · {combatAudit.frameTimes.longTaskMs.toFixed(0)} ms total (supported browsers only)</p>}<small>Draw CPU excludes GPU completion; frame intervals are browser measurements, not input latency. Hidden-tab gaps are excluded. Request timings are not controller-to-screen latency. Outcomes are authoritative; captions remain intentions.</small></>}</details>
   {hud?.local&&hud?.lab21&&!!config.legacyPowers&&<details className="combatAudit"><summary>LOCAL EXPERIMENT · REPULSE (BUILD 21)</summary><label><input type="checkbox" checked={!!hud.lab21.repulseEnabled} onChange={e=>void repulseLab21(e.target.checked)}/> Enable Repulse for this local session</label><p>Cycle powers with D-pad down to REPULSE; use X (keyboard V). 120° cone, 0.12s wind-up, 0.34s action commitment, zero damage and no hit stun. Shield blocks it; cover obstructs it. Move away, flank, or punish the wind-up. Taking a hit or shielding cancels it without refund. Attached cover, held matter and bullets are unaffected.</p>{([['range',60,120,1],['cost',10,30,1],['cooldown',1,3,.1]] as const).map(([key,min,max,step])=><label key={key}>{key} <input aria-label={'Repulse '+key} type="number" min={min} max={max} step={step} value={hud.lab21.repulse[key]} onChange={e=>void repulseLab21(hud.lab21.repulseEnabled,{[key]:Number(e.target.value)})}/></label>)}<small>Local only; disabled in every new session. Never enabled for watch rooms or multiplayer. Existing controls and loadouts remain unchanged.</small></details>}
   {diagnostics30&&<PlaytestGuide/>}
   {qaMode&&<AnimationQaHarness s={hud} onExit={()=>setQaMode(false)}/>}\n   {director&&<aside className="trainingDirector"><div className="panelTitle"><span>TRAINING DIRECTOR</span><b>{config.weaveEnabled<.5?"INSTRUCTOR 142 CLASSIC":"GOD MODE WEAVE TEST"}</b></div>
    <p>{config.weaveEnabled<.5?<><strong>1.</strong> A · baseball slide<br/><strong>2.</strong> Contact cover · soft catch<br/><strong>3.</strong> Feather stick · flow around connected edges<br/><strong>4.</strong> Soft cover: pull away · release<br/><strong>5.</strong> A or LT while soft · hard brace<br/><strong>6.</strong> Hold LT · plant feet / aim; release · retract<br/><strong>7.</strong> A while braced · kick / edge burst into slide<br/><strong>8.</strong> LB · gather; release · acquire; fresh LB · throw<br/><strong>9.</strong> RT · shoot; RB · place</>:<><strong>1.</strong> Tap A once · upright boost<br/><strong>2.</strong> Double-tap A · full slide<br/><strong>3.</strong> Hold forward · sustain<br/><strong>4.</strong> Lean 20–30° · curve<br/><strong>5.</strong> Pull opposite · brake<br/><strong>6.</strong> Touch cover · soft attach<br/><strong>7.</strong> Tap A again · brace<br/><strong>8.</strong> Hold LT · plant feet / aim; release · retract</>}</p>
    <button onClick={()=>{chargePreview.current=!chargePreview.current;setPreviewCharging(chargePreview.current)}}>{previewCharging?"RELEASE CHARGE PREVIEW":"START CHARGE PREVIEW"}</button><button onClick={()=>{psychicPreview.current=psychicPreview.current===2?-1:psychicPreview.current+1;setPreviewPsychic(psychicPreview.current)}}>{previewPsychic<0?"PSYCHIC ART PREVIEW":["PSYCHIC PREVIEW · REACH","PSYCHIC PREVIEW · HOLD","PSYCHIC PREVIEW · RETRACT"][previewPsychic]}</button><button onClick={()=>{coverPreview.current=coverPreview.current===7?-1:coverPreview.current+1;setPreviewCover(coverPreview.current)}}>{previewCover<0?"COVER ART PREVIEW":["COVER PREVIEW · RECOIL","COVER PREVIEW · RETRACT","COVER PREVIEW · EXPOSED AIM","COVER PREVIEW · EXPOSED RECOIL","COVER PREVIEW · d02 AIM","COVER PREVIEW · d02 RECOIL","COVER PREVIEW · d04 AIM","COVER PREVIEW · d04 RECOIL"][previewCover]}</button><p>Hold Y · charge while moving at a controlled pace; soft cover still flows. Release Y · activate God Frame (up to 12 seconds). Charging is vulnerable. D-pad Left cycles field size; Up selects the verified shotgun. Right changes cover shape. Down selects Build Cover, Orbit, Pinball, Heavy Gauntlet or Bullet Time; X executes. RB always generates cover. Hold B to wind up the Power Glove; release for one strike. A fully charged connected strike opens RT for one stored glove blast. Charge with Y for 1.2 uninterrupted seconds to manufacture it; empty battery does not erase it.</p><div className="testGrid">{tests.map(([name])=>{const pass=!!testPass[name];return <div key={name} className={pass?"pass":""}><span>{name}</span><b>{pass?"PASS":"NOT DETECTED"}</b></div>})}</div><button className="resetTests" onClick={()=>setTestPass({})}>RESET TESTS</button>
   </aside>}
   {director&&<aside className="spriteLab"><div className="panelTitle"><span>SPRITE LAB</span><b>RUNTIME ROUTING · KINETIC ECHO</b></div>{(()=>{const info=spriteLabInfo(hud);return <dl><dt>STATE</dt><dd>{info.state}</dd><dt>FAMILY</dt><dd>{info.family.toUpperCase()}</dd><dt>DIRECTION</dt><dd>d{String(info.dir).padStart(2,"0")} · {info.angleDeg}°</dd><dt>FRAME</dt><dd>{info.frame} / {info.total}</dd><dt>FILE</dt><dd>{info.file}</dd><dt>TARGET</dt><dd>{info.expected}</dd><dt>FALLBACK</dt><dd className={info.fallback?"warn":"ok"}>{info.fallback?"YES — ART MISSING":"NO"}</dd><dt>MISSING MAP</dt><dd>{[...presentationQA.missing.entries()].sort((a,b)=>b[1]-a[1]).slice(0,6).map(([k,v])=>`${k} ×${v}`).join(" · ")||"NONE"}</dd></dl>})()}</aside>}
   {director&&<Director cfg={config} patch={patch} applyPreset={applyMovementPreset} save={save} load={load} note={note}/>}
   {spritePanel&&<SpriteInspector s={hud}/>}
  </div>
  {hud?.mode==="watch"?<div className="watchControls" aria-label="Bot spectator and fight report controls"><div className="watchPrimary"><b>LIVE ROUND {hud.round} · RECORDED {hud.fightMemory?.completed||0}/10</b><button disabled={hud.fightMemory?.recording} onClick={()=>memoryControl("record")}>{hud.fightMemory?.recording?`RECORDING ${hud.fightMemory.completed}/10`:"START RECORDING"}</button><button disabled={!(hud.fightMemory?.reportReady||fightStored?.report)} onClick={downloadReport}>{!hud.fightMemory?.reportReady&&fightStored?.report?"DOWNLOAD PREVIOUS REPORT":"DOWNLOAD REPORT"}</button><button onClick={watchPause}>{hud.watchPaused?"RESUME":"PAUSE"}</button></div><small role="status" aria-live="polite">{memoryNotice||"Start Recording runs ten completed rounds. Download unlocks at10/10."}</small><details><summary>BOT SETTINGS · {hud.fightMemory?.mode||"baseline"}</summary><button disabled={hud.fightMemory?.recording} onClick={()=>memoryControl("baseline")}>BASELINE</button><button disabled={hud.fightMemory?.recording} onClick={()=>memoryControl("adaptive")}>ADAPTIVE</button><button disabled={hud.fightMemory?.recording} onClick={()=>memoryControl("reset")}>RESET MEMORY</button><button onClick={reset}>RESTART ROUND</button><button onClick={practiceFight}>PLAY VS BOT</button><small>Restarted rounds do not count. Saved reports are browser-local. A deployment or expired room starts a fresh live round.</small></details></div>:<footer><span>LS MOVE</span><span>GUN FACING = SHOT DIRECTION</span><span>{config.weaveEnabled<.5?"A SLIDE · BRACE · KICK":"A TAP BOOST · DOUBLE-TAP SLIDE"}</span><span>B MELEE</span><span>X BULLET TIME</span><span>LB TAP FLICK · HOLD GATHER</span><span>RB BUILD / PLACE</span><span>LT SHIELD / AIM</span><span>RT FIRE</span><span>HOLD Y CHARGE · RELEASE POWER</span><span>UP GUN · RIGHT COVER SHAPE · LEFT FIELD · J / L3 JUMP</span></footer>}
 </main>
}
const MOVEMENT_PRESETS:Record<string,Partial<Config>>={
 "INSTRUCTOR 142 CLASSIC":{weaveEnabled:0,moveSpeed:222.7,response:13,stopDrag:.002,slideDrag:.12,slideSpeed:689.15949375,slideDuration:.63,cameraZoom:1.85},
 "GOD MODE WEAVE":{weaveEnabled:1,moveSpeed:262,response:13,stopDrag:.002,slideDrag:.12,dashSpeed:470,dashDuration:.12,doubleTapWindow:.26,slideSpeed:690,slideDuration:.68,slideSustain:520,slideSteer:11.5,slideSteerAngle:.70,slideSteerResponse:8.5,slideBrake:14.5,slideCancelSpeed:195},
 "AKIRA AGILE":{weaveEnabled:1,moveSpeed:262,dashSpeed:500,dashDuration:.13,doubleTapWindow:.30,slideSpeed:690,slideDuration:.62,slideSustain:500,slideSteer:10.5,slideSteerAngle:.78,slideSteerResponse:10,slideBrake:13.5,slideCancelSpeed:185},
 "GEARS WEIGHT":{weaveEnabled:1,moveSpeed:262,dashSpeed:350,dashDuration:.18,doubleTapWindow:.26,slideSpeed:610,slideDuration:.82,slideSustain:260,slideSteer:4.5,slideSteerAngle:.42,slideSteerResponse:5,slideBrake:6.5,slideCancelSpeed:115},
 "HIGH-SKILL WEAVE":{weaveEnabled:1,moveSpeed:262,dashSpeed:455,dashDuration:.11,doubleTapWindow:.23,slideSpeed:720,slideDuration:.66,slideSustain:560,slideSteer:12.5,slideSteerAngle:.68,slideSteerResponse:11,slideBrake:15.5,slideCancelSpeed:205}
};
function Director({cfg,patch,applyPreset,save,load,note}:{cfg:Config;applyPreset:(name:string)=>Promise<void>;patch:(k:keyof Config,v:number)=>void;save:()=>void;load:()=>void;note:string}){const rows:[keyof Config,string,number,number,number][]=[["legacyPowers","EXPERIMENTAL POWERS (0 OFF / 1 ON)",0,1,1],
 ["chargeMoveScale","CHARGE FLOAT SPEED",.35,.85,.00005],["chargeMoveResponse","CHARGE PACE RESPONSE",3,16,.5],["powerChargeSeconds","POWER CHARGE TIME",1,5,.1],["godDuration","FULL GOD WINDOW",10,15,.5],["godDrain","GOD BATTERY / SEC",0,8,.5],["powerRecharge","POWER RECHARGE / SEC",5,40,1],["godDamage","GOD DAMAGE MULTIPLIER",1,2,.05],["gripEnergy","GRAB CHARGE",0,20,1],["holdEnergy","HOLD CHARGE / SEC",0,15,.5],["coverThrowEnergy","THROW CHARGE",0,20,1],["carryResponse","BLOCK FOLLOW RESPONSE",2,20,.5],["carryTurnResponse","BLOCK TURN RESPONSE",2,18,.5],["carryMomentum","THROW MOMENTUM SHARE",0,1,.05],["slideEnergy","SLIDE CHARGE",0,30,1],["dashEnergy","BOOST CHARGE",0,20,1],["rechargeDelay","RECHARGE DELAY",.2,3,.1],["rechargeRate","RECHARGE RATE",1,20,1],["moveSpeed","MOVE SPEED",180,360,1],["response","ACCEL / RESPONSE",5,22,.5],["dashSpeed","BOOST DASH SPEED",280,620,5],["dashDuration","BOOST DASH DURATION",.08,.28,.01],["doubleTapWindow","DOUBLE-TAP WINDOW",.16,.42,.01],["slideSpeed","SLIDE SPEED",420,850,5],["slideDrag","SLIDE DRAG",.03,.35,.01],["slideDuration","SLIDE DURATION",.35,1.05,.01],["slideSustain","SLIDE SUSTAIN THRUST",0,700,10],["slideSteer","SLIDE STEERING",1,14,.25],["slideSteerAngle","MAX STEER ANGLE",.20,1.05,.01],["slideSteerResponse","STEER RESPONSE",2,14,.25],["slideBrake","KINETIC BRAKE",2,18,.25],["slideCancelSpeed","STAND-UP SPEED",70,260,5],["shotCadence","SHOT CADENCE",.18,.8,.01],["shotSpread","SHOT SPREAD",.01,.09,.002],["shotDamage","PELLET DAMAGE",2,24,1],["throwForce","MATTER THROW",350,1100,10],["pinballSpeed","PINBALL SPEED",500,1200,10],["spriteScale","JADE SCALE",.55,1.25,.01],["cameraZoom","CAMERA ZOOM",1.25,2.15,.01]];
 const presetMatches=(name:string)=>Object.entries(MOVEMENT_PRESETS[name]).every(([k,v])=>Math.abs(cfg[k as keyof Config]-Number(v))<.001);
 return <aside className="director"><div className="panelTitle"><span>DIRECTOR MODE</span><b>LIVE COMBAT CONFIG</b></div>
 <div className="presetGrid">{Object.keys(MOVEMENT_PRESETS).map(name=><button key={name} aria-pressed={presetMatches(name)} className={presetMatches(name)?"recommended":""} onClick={()=>applyPreset(name)}>{name}{name==="INSTRUCTOR 142 CLASSIC"?<small>MECHANICAL AUTHORITY</small>:null}</button>)}</div>
 <p className="presetHint">Start with INSTRUCTOR 142 CLASSIC. This is the recovered movement/cover authority. GOD MODE WEAVE remains an experiment for later A/B testing.</p>
 {rows.map(([k,l,min,max,step])=><label key={k}><span>{l}<output>{Number(cfg[k]).toFixed(step<.1?2:0)}</output></span><input type="range" min={min} max={max} step={step} value={cfg[k]} onChange={e=>patch(k,Number(e.target.value))}/></label>)}<div className="actions"><button onClick={save}>SAVE PRESET</button><button onClick={load}>LOAD PRESET</button></div>{note&&<em>{note}</em>}<p>These values update the authoritative solo simulation live. No rebuild required.</p></aside>}
// Shared by the visible fighter and both inspectors: gun aim never selects an idle cover pose.
function spriteFacing(p:any,family:string,speed:number){
 if(family==="slide")return p.slideFacing??p.aim??0;
 if(p.charging&&!p.coverId&&(typeof p.input?.x==="number"||typeof p.input?.y==="number"))return Math.hypot(p.input?.x||0,p.input?.y||0)>.18?Math.atan2(p.input.y,p.input.x):(p.gunFacing??p.aim??0);
 if(p.coverId&&p.coverAnchor){if(p.coverMode==="soft"){const moving=Math.abs(p.coverSpeed||0)>20;return moving?Math.atan2(p.coverAnchor.ty*Math.sign(p.coverSpeed||1),p.coverAnchor.tx*Math.sign(p.coverSpeed||1)):(p.gunFacing??p.aim??Math.atan2(-p.coverAnchor.ny,-p.coverAnchor.nx))}const exposed=p.input?.coverAim||p.fireState>0||p.recoil>0||p.returnToCover>0;return exposed?(p.gunFacing??p.aim??0):Math.atan2(p.coverAnchor.ny,p.coverAnchor.nx)}
 if(p.input?.fire||p.fireState>0)return p.gunFacing??p.aim??0;
 return family==="run"&&speed>55?Math.atan2(p.vy,p.vx):(p.gunFacing??p.aim??0);
}
const JADE_REG_LOCK08={root:{x:.5,y:1},ground:{x:.5,y:.88},crownY:.04,pelvis:{x:.5,y:.60},shoulders:{left:.31,right:.69,y:.31},helmet:{x:.5,y:.15,w:.29,h:.23},backpack:{x:.37,y:.40,w:.25,h:.35},cape:{x:.39,y:.38},weaponHand:{x:.65,y:.39},supportHand:{x:.72,y:.43},muzzle:{x:.88,y:.37},bodyEnvelope:{left:.18,right:.82,top:.04,bottom:.96}} as const;
const FAMILY_REG08={ready:{ground:.88,y:0},run:{ground:.88,y:0},slide:{ground:.89,y:0},cover:{ground:.885,y:0},aim:{ground:.89,y:0},lower:{ground:.89,y:0},connectors:{ground:.89,y:0}} as const;
function spriteRegistration(family:string){const r=(FAMILY_REG08 as any)[family]||FAMILY_REG08.ready;return{groundAnchor:{x:.5,y:r.ground},canonical:JADE_REG_LOCK08}}
function SpriteInspector({s}:{s:any}){const p=s?.players?.[0]||{},speed=Math.hypot(p.vx||0,p.vy||0),family=p.coverId?"cover":p.slide>0||p.pinball>0||p.knock>.32||p.exit?"slide":p.brake>0?"ready":speed>34?"run":"ready",angle=spriteFacing(p,family,speed),dir=((Math.round(angle/(Math.PI*2)*24)%24)+24)%24,state=p.gripCoverId?"PSYCHIC CARRY":p.gripId?"MATTER GRIP":p.exit?"EDGE-DASH":p.coverId?(p.coverMode==="soft"?"SOFT COVER":p.input?.coverAim?(p.peekEdge?"BRACED CORNER AIM":"BRACED AIM"):"BRACED"):p.brake>0?"KINETIC BRAKE":p.slide>0?"SLIDE":p.dash>0?"BOOST DASH":family.toUpperCase();return <aside className="spritePanel"><div className="panelTitle"><span>SPRITE WORKSHOP</span><b>RUNTIME INSPECTOR</b></div><dl><dt>STATE</dt><dd>{state}</dd><dt>DIRECTION</dt><dd>d{String(dir).padStart(2,"0")} · {Math.round(dir*15)}°</dd><dt>SPRITE</dt><dd>{family}-d{String(dir).padStart(2,"0")}.webp</dd><dt>SPEED</dt><dd>{Math.round(speed)}</dd><dt>COVER</dt><dd>{p.coverId||"FREE"}</dd><dt>STATUS</dt><dd>{p.gripCoverId?"GRIP POSE FALLBACK":"APPROVED RUNTIME"}</dd><dt>PRESENTATION QA</dt><dd>UNSUPPORTED AIM {presentationQA.unsupportedCoverAim} · EXACT MISS {presentationQA.missingExact}</dd></dl><p>Slide to catch soft cover; point away to walk off. A locks hard brace. LT plants feet and exposes; release LT retracts while staying braced. A + left stick kicks away. Tap LB to rip and launch; hold LB past the pulse, then release to keep protection. Fresh LB throws held material; RB places. RT always fires the weapon. H / R3 deliberately drops.</p></aside>}
function spriteLabInfo(s:any){const p=s?.players?.[0]||{},speed=Math.hypot(p.vx||0,p.vy||0);
 if(p.charging||p.powerFlash>0||p.powerReturn>0){const frame=powerFrame(p,s.config||DEFAULT),dir=powerDirection(p),front=hasFrontPower(p),right=hasRightPower(p);return {state:p.charging?((p.godCharge||0)>=.8?"GOD_CHARGE_LOOP":"GOD_CHARGE_ENTRY"):p.powerFlash>0?"GOD_FLAME_PEAK":"GOD_WEAPON_RETURN",family:"god-frame",dir,angleDeg:dir*15,frame:frame+1,total:12,file:right?(frame===1?"front-right-d03-dissolve-v1.png":"front-right-d03-sequence-v1.png"):front?(frame>=6&&frame<=8?"front-d06-loop-v1.png":"front-d06-transitions-v1.png"):"grounded-float-v1.png",expected:right?"APPROVED FRONT-RIGHT · d03":front?"APPROVED FRONT · d06":dir===0?"APPROVED FIRST VIEW · d00":"CHARGE VIEW MISSING · d00 FALLBACK",fallback:!right&&!front&&dir!==0}}
 const neighbor=coverNeighborFrame(p);if(neighbor!==null){const pose=COVER_NEIGHBOR_POSES[neighbor];return {state:neighbor%2?"COVER_EXPOSED_RECOIL":"COVER_EXPOSED_AIM",family:"cover-exposure",dir:pose.dir,angleDeg:pose.dir*15,frame:neighbor%2+1,total:2,file:"cover-d02-d04-exposure-v1.png",expected:`APPROVED OVER-COVER · d${String(pose.dir).padStart(2,"0")}`,fallback:false}}
 const exposure=coverExposureFrame(p);if(exposure!==null)return {state:exposure===0?"COVER_EXPOSED_AIM":"COVER_EXPOSED_RECOIL",family:"cover-exposure",dir:3,angleDeg:45,frame:exposure+1,total:2,file:"cover-d03-exposure-v1.png",expected:"APPROVED OVER-COVER · d03",fallback:false};
 const connector=coverConnectorFrame(p);if(connector!==null)return {state:connector===0?"COVER_RECOIL":"COVER_RETURN",family:"cover-connectors",dir:3,angleDeg:45,frame:connector+1,total:2,file:"cover-d03-connectors-v1.png",expected:"APPROVED COVER CONNECTOR · d03",fallback:false};
 const psychic=psychicFrame(p,s.time);if(psychic!==null)return {state:["PSYCHIC_REACH","PSYCHIC_HOLD","PSYCHIC_RETRACT"][psychic],family:"psychic",dir:3,angleDeg:45,frame:psychic+1,total:3,file:"psychic-d03-v1.png",expected:"APPROVED PSYCHIC · d03",fallback:false};
 let state="READY",family="ready",fallback=false,expected="READY";
 if(p.gripCoverId||p.gripId){state="PSYCHIC_CARRY";family=speed>34?"run":"ready";expected="GRIP_CARRY";fallback=true}
 else if(p.exit){state="COVER_EXIT";family="slide";expected="COVER_EXIT";fallback=true}
 else if(p.coverId&&p.fireState>0){state="COVER_FIRE";family="cover";expected="COVER_FIRE";fallback=true}
 else if(p.coverId&&p.recoil>0){state="COVER_RECOIL";family="cover";expected="COVER_RECOIL";fallback=true}
 else if(p.coverId&&p.returnToCover>0){state="COVER_RETURN";family="cover";expected="COVER_RETURN";fallback=true}
 else if(p.coverId&&p.coverMode==="braced"&&p.input?.coverAim){state=p.peekEdge?"BRACED_CORNER_AIM":"BRACED_OVER_AIM";family="cover";expected=state;fallback=true}
 else if(p.coverId&&p.coverMode==="soft"&&Math.abs(p.coverSpeed||0)>35){state="SOFT_COVER_FLOW";family="cover";expected="SOFT_COVER_FLOW";fallback=true}
 else if(p.coverId&&p.coverMode==="soft"){state="SOFT_COVER";family="cover";expected="SOFT_COVER";fallback=true}
 else if(p.coverId&&p.coverMode==="braced"){state="COVER_BRACED";family="cover";expected="COVER_BRACED";fallback=false}
 else if(p.brakeState>0||p.brake>0){state="KINETIC_BRAKE";family="ready";expected="KINETIC_BRAKE";fallback=true}
 else if(p.slide>0){state="FULL_SLIDE";family="slide";expected="FULL_SLIDE";fallback=false}
 else if(p.boostState>0||p.dash>0){state="BOOST_DASH";family="run";expected="BOOST_DASH";fallback=true}
 else if(p.fireState>0){state="FIRE";family="ready";expected="FIRE";fallback=true}
 else if(speed>34){state="RUN";family="run";expected="RUN";fallback=false}
 const angle=spriteFacing(p,family,speed);
 const dir=((Math.round(angle/(Math.PI*2)*24)%24)+24)%24;
 const im=nearest(family,dir)||nearest("ready",dir);if(fallback||!exactSprite(family,dir))noteMissing(state,family,dir);
 const sourceCell=im?(im.naturalWidth%250===0&&im.naturalHeight%250===0?250:125):125;
 const cols=im?Math.max(1,Math.floor(im.naturalWidth/sourceCell)):1,rows=im?Math.max(1,Math.floor(im.naturalHeight/sourceCell)):1,total=Math.max(1,cols*rows);
 const frame=family==="cover"?coverPoseFrame(p,s?.time||0,total):family==="ready"?0:Math.floor((s?.time||0)*(family==="run"?10:7))%total;
 return{state,family,dir,angleDeg:Math.round(dir*15),frame:frame+1,total,file:`${family}-d${String(dir).padStart(2,"0")}.webp`,fallback,expected}}

type EvoStage="BASE"|"IGNITION"|"GATHER"|"DOUBLE_HELIX"|"GROUND_BREAK"|"LEVITATION"|"CRYSTALLINE"|"TIER_READY"|"TIER_I";
function evoCharge(p:any){return Math.max(0,Math.min(1,Number(p?.godCharge||0)))}
function evoStage(p:any):EvoStage{if((p?.godTime||0)>0)return"TIER_I";const q=evoCharge(p);if(!p?.charging&&q<=0)return"BASE";if(q<.15)return"IGNITION";if(q<.32)return"GATHER";if(q<.5)return"DOUBLE_HELIX";if(q<.67)return"GROUND_BREAK";if(q<.82)return"LEVITATION";if(q<.96)return"CRYSTALLINE";return"TIER_READY"}
function helixPoint(p:any,t:number,q:number,phase:number,height:number,radius:number,dir=1){const a=t*(2.2+q*8)*dir+phase;return{x:p.x+Math.cos(a)*radius*(1-q*.2),y:p.y-height+Math.sin(a)*radius*.28}}
function evoSprite(g:CanvasRenderingContext2D,key:string,p:any,alpha:number,w:number,h:number,rot=0,phase=0){const im=evolutionAssets.get(key);if(!im||!im.complete||!im.naturalWidth)return false;const frames=key==="ground-fracture"?8:key==="crystal-code"?8:key==="geometry"?8:key==="code"?8:8,cell=256,fr=((Math.floor(phase*frames)%frames)+frames)%frames,sx=Math.min(im.naturalWidth-cell,fr*cell);g.save();g.translate(p.x,p.y-40);g.rotate(rot);g.globalAlpha=alpha;g.drawImage(im,sx,0,cell,cell,-w/2,-h/2,w,h);g.restore();return true}
function evoRelease(p:any){return !p.charging&&Number(p.powerReturn||0)>0&&Number(p.powerReleaseCharge||0)>=.35}
function evoAfter(p:any){return !p.charging&&!evoRelease(p)&&Number(p.godTime||0)>0}
function evoEnergy(p:any){return Math.max(0,Math.min(1,Number(p.battery||0)/100))}
function drawGodGround(g:CanvasRenderingContext2D,p:any,t:number){
 const q=evoCharge(p),release=evoRelease(p),after=evoAfter(p),energy=evoEnergy(p);if(!p.charging&&!release&&!after)return;
 if(p.charging&&q>.18)evoSprite(g,"ground-fracture",{...p,y:p.y+38},Math.min(.34,.07+q*.27),118+q*46,59+q*22,0,t*.8);
 g.save();g.translate(p.x,p.y+5);
 const collapse=release?Math.max(0,Math.min(1,(p.powerReturn||0)/.24)):0,r=p.charging?22+q*50:after?22+energy*16:24+collapse*54;
 g.globalAlpha=p.charging?.12+.25*q:after?.08+.12*energy:.12+.38*(1-collapse);
 g.strokeStyle=release?"#fff":"#65f7ff";g.lineWidth=1.1+(p.charging?q:energy)*1.4;g.shadowColor="#5ef5ff";g.shadowBlur=5+(p.charging?q:energy)*10;
 g.beginPath();g.ellipse(0,0,r,r*.27,0,0,Math.PI*2);g.stroke();g.restore();
}
function drawDnaRungs(g:CanvasRenderingContext2D,p:any,t:number,q:number,front:boolean){
 if(q<.32)return;g.save();g.globalCompositeOperation="source-over";const n=5+Math.floor(q*3),speed=2.2+q*7.2;
 for(let i=0;i<n;i++){const u=(i+.5)/n,h=15+u*(48+q*46),rad=(40+q*23)*(1-u*.15),phase=u*Math.PI*4,a=t*speed+phase;
  const visible=(Math.sin(a)>0)===front;if(!visible)continue;
  const x1=p.x+Math.cos(a)*rad,y1=p.y-h+Math.sin(a)*rad*.24,x2=p.x+Math.cos(a+Math.PI)*rad,y2=p.y-h+Math.sin(a+Math.PI)*rad*.24;
  g.globalAlpha=.07+.12*q;g.strokeStyle=i%2?"#ff58bd":"#78f8ff";g.lineWidth=1;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();
 }g.restore();
}
function drawGodRear(g:CanvasRenderingContext2D,p:any,t:number){
 const q=evoCharge(p),release=evoRelease(p),after=evoAfter(p),energy=evoEnergy(p);if(!p.charging&&!release&&!after)return;
 g.save();g.globalCompositeOperation="source-over";
 if(p.charging){
  evoSprite(g,"helix-rear",p,.13+.23*q,130+q*52,165+q*60,-.04*Math.sin(t*2),t*(.35+q*.95));
  evoSprite(g,"flame",p,.08+.14*q,118+q*38,150+q*48,0,t*(.28+q*.7));drawDnaRungs(g,p,t,q,false);
 }else if(release){
  const k=Math.max(0,Math.min(1,(p.powerReturn||0)/.24)),collapse=.45+.55*k;
  evoSprite(g,"helix-rear",p,.09+.18*k,(78+90*k)*collapse,(100+115*k)*collapse,0,-t*(1.5+4*(1-k)));
  evoSprite(g,"flame",p,.07+.12*(1-k),88+30*(1-k),118+42*(1-k),0,t*1.4);
 }else{
  const flicker=.78+.22*Math.sin(t*8);evoSprite(g,"flame",p,(.035+.13*energy)*flicker,78+energy*30,104+energy*48,0,t*(.2+energy*.5));
 }
 g.restore();
}
function drawGodFront(g:CanvasRenderingContext2D,p:any,t:number){
 const q=evoCharge(p),release=evoRelease(p),after=evoAfter(p),energy=evoEnergy(p);if(!p.charging&&!release&&!after)return;
 g.save();g.globalCompositeOperation="source-over";
 if(p.charging){
  evoSprite(g,"helix-front",p,.11+.19*q,130+q*52,165+q*60,.04*Math.sin(t*2),t*(.35+q*.95));
  if(q>.5)evoSprite(g,"geometry",p,.025+.055*q,146+q*38,146+q*38,t*.06,t*.18);
  if(q>.67){evoSprite(g,"code",p,.025+.05*q,100+q*22,118+q*28,0,t*.3);evoSprite(g,"crystal-code",p,.018+.04*q,58+q*15,68+q*18,0,t*.28)}
  drawDnaRungs(g,p,t,q,true);
 }else if(release){
  const k=Math.max(0,Math.min(1,(p.powerReturn||0)/.24)),collapse=.45+.55*k;
  evoSprite(g,"helix-front",p,.08+.15*k,(78+90*k)*collapse,(100+115*k)*collapse,0,-t*(1.5+4*(1-k)));
  if(k>.55)evoSprite(g,"geometry",p,.04+.08*k,112*k+30,112*k+30,0,-t*.8);
  if(k<.3){g.globalAlpha=.22*(1-k/.3);g.strokeStyle="#fff";g.lineWidth=2;g.beginPath();g.ellipse(p.x,p.y-2,35+(1-k/.3)*45,10+(1-k/.3)*12,0,0,Math.PI*2);g.stroke()}
 }else{
  const flicker=.75+.25*Math.sin(t*9);g.globalCompositeOperation="lighter";g.globalAlpha=(.035+.10*energy)*flicker;g.strokeStyle="#8dfaff";g.shadowColor="#ff4fbb";g.shadowBlur=5+energy*8;g.lineWidth=1+energy;g.beginPath();g.ellipse(p.x,p.y-38,22+energy*8,40+energy*12,0,0,Math.PI*2);g.stroke();
  if(energy>.2&&Math.sin(t*5)>.72)evoSprite(g,"crystal-code",p,.015+.025*energy,38+energy*8,44+energy*10,0,t*.18);
 }
 g.restore();
}
const skylineCache=new WeakMap<HTMLImageElement,HTMLCanvasElement>();
function cachedSkyline(im:HTMLImageElement){
 const hit=skylineCache.get(im);if(hit)return hit;
 if(typeof document==="undefined")return null;
 const c=document.createElement("canvas");c.width=1200;c.height=791;const g=c.getContext("2d");if(!g)return null;
 g.filter="saturate(.65) brightness(.8)";g.drawImage(im,0,0,1200,350);
 g.drawImage(im,0,im.naturalHeight-75,im.naturalWidth,75,0,349,1200,441);skylineCache.set(im,c);return c;
}
const cameraMemory27b:CameraMemory27b={};
function draw(canvas:HTMLCanvasElement|null,s:any,received:number,mouseState:{x:number;y:number;down:boolean},keyState:Record<string,boolean>,psychicPreview=-1,coverPreview=-1,localSlot=0,character:"jade"|"raptor"="jade",cameraPreset:"default"|"close"|"kinetic"="default",debug21=false,cameraMode38:CameraMode38="auto",cameraZoomAdjust38=0){if(!canvas)return;let g=canvas.getContext("2d")!;const sx=canvas.width/1000,sy=canvas.height/620;g.setTransform(sx,0,0,sy,0,0);g.clearRect(0,0,1000,620);if(!s)return;
 const renderNow=performance.now();s={...presentation(s,renderNow),debug21};const cfg=s.config||DEFAULT,p=s.players[localSlot]||s.players[0],local={...p,id:"fighter-"+localSlot};if(psychicPreview>=0){local.psychicPreview=psychicPreview;local.charging=false;local.powerFlash=local.powerReturn=0;}if(coverPreview>=0){local.coverPreview=coverPreview;local.charging=false;local.powerFlash=local.powerReturn=0;}
 // Independent close camera with stable encounter framing and bounded look-ahead.
 const frameDt=cameraState.last?Math.max(0,Math.min(.05,(renderNow-cameraState.last)/1000)):1/60;
 if(!cameraState.ready){for(const k of Object.keys(cameraMemory27b))delete (cameraMemory27b as any)[k];}
 updateCamera27c(cameraState,local,s.players,localSlot,frameDt);
 // Build 38: apply presentation zoom after authoritative camera tracking.
 const target38=cameraTarget38(cameraMode38,cameraState.zoom,cameraZoomAdjust38);
 cameraState.zoom=cameraMode38==="auto"&&cameraZoomAdjust38===0?cameraState.zoom:cameraZoomStep38(cameraState.zoom,target38,frameDt);
 cameraState.last=renderNow;
 const zoom=cameraState.zoom,camX=cameraState.x,camY=cameraState.y;
 const arena45=environmentAssets.get("war-foundation45");cameraState.zoom=zoom;g=beginWarScene46(canvas,arena45,{x:camX,y:camY},zoom,environmentAssets);
 drawDimension33Architecture(g);
 drawCitadel29(g,environmentAssets);
 drawGround44(g,s);
 drawStructures27e(g,environmentAssets);
 drawKineticCyclone18(g,s);
 const travelLen=Math.hypot(local.vx||0,local.vy||0),tx=travelLen?(local.vx/travelLen):0,ty=travelLen?(local.vy/travelLen):0;
 const now=renderNow,echoDt=frameDt;
 const fullSlide=local.slide>0;
 if(fullSlide&&!slideWasActive){const angle=local.slideFacing||0;graffiti={word:slideWord++%2,originX:local.x+Math.cos(angle)*8,originY:local.y+Math.sin(angle)*4,angle,age:0,life:.42}}
 slideWasActive=fullSlide;
 if(graffiti){graffiti.age+=frameDt;graffiti.life-=frameDt;if(graffiti.life<=0)graffiti=null}
 for(const mark of hoverWake)mark.age-=frameDt;
 while(hoverWake.length&&hoverWake[0].age<=0)hoverWake.shift();
 const hoverEnergy=powerAura(local),lastWake=hoverWake[hoverWake.length-1];
 if(hoverEnergy>.05&&travelLen>20&&(!lastWake||Math.hypot(local.x-lastWake.x,local.y-lastWake.y)>10)){hoverWake.push({x:local.x,y:local.y,age:.65,strength:hoverEnergy});if(hoverWake.length>24)hoverWake.shift()}
 for(const mark of hoverWake){g.save();g.globalAlpha=mark.age/.65*mark.strength*.65;g.strokeStyle="#ff41b8";g.shadowColor="#ff41b8";g.shadowBlur=9;g.lineWidth=2;g.beginPath();g.ellipse(mark.x,mark.y+5,20,6,0,0,Math.PI*2);g.stroke();g.strokeStyle="#67f5ff";g.beginPath();g.moveTo(mark.x-11,mark.y+4);g.lineTo(mark.x+9,mark.y+7);g.stroke();g.restore()}
 for(const mark of floorWake)mark.age-=frameDt;
 while(floorWake.length&&floorWake[0].age<=0)floorWake.shift();
 // Jade body afterimages must never appear behind Raptor; shared ground effects remain.
 if(character==="raptor")kineticEcho.length=0;
 for(const e of kineticEcho){if(!fullSlide){const follow=1-Math.exp(-17*frameDt);e.x+=(local.x-e.x)*follow;e.y+=(local.y-e.y)*follow;e.life-=frameDt}else e.life-=frameDt}
 while(kineticEcho.length&&(kineticEcho[0].life<=0||Math.hypot(kineticEcho[0].x-local.x,kineticEcho[0].y-local.y)<3))kineticEcho.shift();
 const echoActive=local.slide>0||local.dash>0||local.kickStage&&local.kickStage!=="none"||travelLen>360;
 if(character==="jade"&&fullSlide&&travelLen>60&&(!kineticEcho.length||Math.hypot(local.x-kineticEcho[kineticEcho.length-1].x,local.y-kineticEcho[kineticEcho.length-1].y)>30)){const family=local.slide>0||local.kickStage&&local.kickStage!=="none"?"slide":"run",angle=family==="slide"?(local.slideFacing||Math.atan2(local.vy,local.vx)):Math.atan2(local.vy,local.vx),dir=((Math.round(angle/(Math.PI*2)*24)%24)+24)%24,im=nearest(family,dir)||nearest("ready",dir),sourceCell=im?(im.naturalWidth%250===0&&im.naturalHeight%250===0?250:125):125,cols=im?Math.max(1,Math.floor(im.naturalWidth/sourceCell)):1,rows=im?Math.max(1,Math.floor(im.naturalHeight/sourceCell)):1,frames=Math.max(1,cols*rows),frame=family==="slide"&&local.slide>0?Math.min(frames-1,Math.max(0,Math.floor((1-local.slide/cfg.slideDuration)*frames))):Math.floor(s.time*10)%frames;kineticEcho.push({x:local.x,y:local.y,angle,family,dir,frame,life:.20,maxLife:.20,speed:travelLen});if(kineticEcho.length>2)kineticEcho.shift();echoLast=now}
 const fxPriority=local.godTime>0||local.charging?4:local.fireState>0||local.recoil>0?3:local.brakeState>0?2:fullSlide?1:0;
 if(fullSlide&&travelLen>60&&fxPriority<=1){floorWake.push({x:local.x,y:local.y,angle:Math.atan2(local.vy,local.vx),age:.27});if(floorWake.length>18)floorWake.shift()}
 for(const mark of floorWake){if(fxPriority>=2)continue;g.save();g.translate(mark.x,mark.y);g.rotate(mark.angle);g.globalAlpha=mark.age/.27*.68;const ground=classicAssets.get("ground");if(ground)g.drawImage(ground,3*384,0,384,384,-48,-43,96,86);g.strokeStyle="#5ef0ff";g.shadowColor="#ff4bb9";g.shadowBlur=9;for(let n=0;n<3;n++){g.beginPath();g.moveTo(-14-n*5,-8+n*8);g.lineTo(-46-n*9,-13+n*11);g.stroke()}g.restore()}
 if(graffiti)classicGraffiti(g,classicAssets.get("graffiti"),graffiti,.72);
 let ix=(keyState.KeyD?1:0)-(keyState.KeyA?1:0),iy=(keyState.KeyS?1:0)-(keyState.KeyW?1:0);try{const pad=[...navigator.getGamepads()].find(Boolean) as Gamepad|undefined;if(pad){const dz=(v:number)=>Math.abs(v)<.18?0:v;ix=dz(pad.axes[0]||0);iy=dz(pad.axes[1]||0)}}catch{}const il=Math.hypot(ix,iy)||1;ix/=il;iy/=il;
 for(const e of kineticEcho){const im=nearest(e.family,e.dir)||nearest("ready",e.dir);if(!im)continue;const m=spriteCell(im,e.family,e.frame),fade=Math.max(0,e.life/e.maxLife),sc=cfg.spriteScale,displayCell=125,registration=spriteRegistration(e.family);withUpright(g,e.x,e.y,()=>{g.save();g.globalAlpha=.22*fade;g.shadowBlur=10;g.shadowColor="#62edf0";g.drawImage(im,m.sx,m.sy,m.cell,m.cell,e.x-displayCell*registration.groundAnchor.x*sc-3*fade,e.y-displayCell*registration.groundAnchor.y*sc,displayCell*sc,displayCell*sc);g.shadowColor="#ff4aa5";g.globalAlpha=.13*fade;g.drawImage(im,m.sx,m.sy,m.cell,m.cell,e.x-displayCell*registration.groundAnchor.x*sc+4*fade,e.y-displayCell*registration.groundAnchor.y*sc,displayCell*sc,displayCell*sc);g.restore()});}
 const heldCoverIds=new Set((s.players||[]).map((p:any)=>p.gripCoverId).filter(Boolean));
 updateChips42(s);for(const chip of chips42)drawChip42(g,chip);
 for(const f of s.fx||[])if(f.type==="cover-scrape"||f.type==="cyber-stain")fx(g,f);
 // Draw solid scenery once, then depth-clip each actor against its actual projected faces.
 // A whole-block Y sort cannot describe a character beside a long or rotated wall.
 const covers=s.covers||[];const ripCandidate30=local.ripTarget27j?s.covers.find((c:any)=>c.id===local.ripTarget27j):gripSelection(local,s).cover;const selectedRip27j=ripCandidate30&&!ripReason27j(local,s,localSlot,ripCandidate30)?ripCandidate30.id:undefined;
 const environmentLights=[...(s.fx||[]).filter((f:any)=>f.type==="muzzle"&&f.life>0).slice(-3).map((f:any)=>({x:f.x,y:f.y,strength:Math.min(1,f.life/.18),color:"#ffd59b"})),...(powerAura(local)>.12?[{x:local.x,y:local.y,strength:Math.min(1,powerAura(local)),color:"#fa64ca"}]:[])];
 // Ground-projected reach: this ring matches the authoritative Grip center-distance check.
 if(local.hp>0)withStructureOcclusion27e(g,local,()=>withWorld46(g,local.x,local.y,()=>drawPsychicField(g,local,s)));for(const [index,q] of s.players.entries())if(index!==localSlot&&(q.timeFieldActive||q.gripCoverId||q.gripId||q.orbitIds?.length)&&q.hp>0)withStructureOcclusion27e(g,q,()=>withWorld46(g,q.x,q.y,()=>drawPsychicField(g,{...q,fieldTint:"#ff82c2"},s)));
 drawInteractions21(g,s,localSlot);
 // Wet road light pools sit below physical actors, with screen blending instead of camera bounce.
 for(const light of environmentLights){g.save();g.globalCompositeOperation="screen";g.globalAlpha=light.strength*.11;g.fillStyle=light.color;g.beginPath();g.ellipse(light.x,light.y+7,44,9,0,0,Math.PI*2);g.fill();g.restore()}
 [...covers].sort((a:any,b:any)=>(a.y+Math.abs(Math.sin(a.a||0))*a.w*.5+Math.abs(Math.cos(a.a||0))*a.h*.5)-(b.y+Math.abs(Math.sin(b.a||0))*b.w*.5+Math.abs(Math.cos(b.a||0))*b.h*.5)).forEach((c:any)=>withStructureOcclusion27e(g,c,()=>withWorld46(g,c.x,c.y,()=>cover(g,{...c,psychicHeld:heldCoverIds.has(c.id),selectedRip27j:selectedRip27j===c.id,gatherProgress36:local.gather34?.source===c.id?Math.max(0,Math.min(1,(s.time-local.gather34.at-.2))):undefined,protective36:local.gather34?.source===c.id&&local.gather34.protective,selectedCells32:(local.ripCommit32?.sourceId===c.id?local.ripCommit32:local.ripPreview32?.sourceId===c.id?local.ripPreview32:undefined)?.cells,heldRelation30:s.players.findIndex((p:any)=>p.gripCoverId===c.id)===localSlot?'local':heldCoverIds.has(c.id)?'opponent':undefined,blocked30:s.time-(c.carryBlockedAt??-9)<.25},s.time,environmentLights))));
 const actors=[
  ...(s.matter||[]).map((m:any)=>({y:m.y,kind:"matter",player:{x:m.x,y:m.y,z:m.height||0},fn:()=>withUpright(g,m.x,m.y,()=>matter(g,m))})),
  ...s.players.map((raw:any,index:number)=>{const actor={...(index===localSlot?local:{...raw,id:"fighter-"+index}),local30:index===localSlot};return{y:actor.y,kind:"player",player:actor,fn:()=>{drawGodGround(g,actor,s.time);withUpright(g,actor.x,actor.y,()=>{g.translate(0,-(actor.z||0));if(actor.hp>0){drawGodRear(g,actor,s.time);fighter(g,actor,s.time,cfg,index===localSlot?character:"jade");drawGodFront(g,actor,s.time)}else{g.save();const age=Math.max(0,s.time-(actor.deathAt??s.time)),fade=Math.max(.12,1-age/1.5);g.globalAlpha=fade;for(let n=0;n<28;n++){const a=n*2.399,r=8+age*(15+n%5*9);g.fillStyle=actor.bot?(n%3===0?"#d9e1e7":n%2?"#84324f":"#151b26"):(n%3===0?"#f0eaff":n%2?"#65efff":"#ff69bd");const x=actor.x+Math.cos(a)*r,y=actor.y-12-n*1.7+Math.sin(a)*r*.5+age*age*17;if(actor.bot){g.beginPath();g.ellipse(x,y,2+n%3,1+n%2,a,0,Math.PI*2);g.fill()}else g.fillRect(x,y,2+n%3,2+n%2)}g.restore();}g.save();g.fillStyle=index===localSlot?"#65efff":"#ff69bd";g.font="bold 8px monospace";g.textAlign="center";g.fillText(s.mode==="watch"?actor.name:index===localSlot?"YOU":actor.name,actor.x,actor.y-84);g.restore()})}}})
 ].sort((a,b)=>a.y-b.y);
 actors.forEach(o=>{
  if(o.kind==="player"&&(o as any).player.local30&&local.hp>0)drawConcealedSpark27h(g,local,s.time);
  withStructureOcclusion27e(g,(o as any).player||{x:0,y:o.y,z:0},()=>withCoverOcclusion(g,covers,o.y,s.time,o.fn,o.kind==="player"?(o as any).player.coverId:null,o.kind==="player"&&!!((o as any).player.input?.coverAim||(o as any).player.fireState>0||(o as any).player.recoil>0),1/DECK_PITCH));
 });


 for(const sh of s.shots||[])withStructureOcclusion27e(g,sh,()=>withCoverOcclusion(g,covers,sh.y,s.time,()=>withWorld46(g,sh.x,sh.y,()=>drawShot(g,sh)),null,false,1/DECK_PITCH));
 for(const [n,p] of s.players.entries())if(p.arsenal37){const t=p.arsenal37;withStructureOcclusion27e(g,t.pose,()=>withCoverOcclusion(g,covers,t.pose.y,s.time,()=>withWorld46(g,t.pose.x,t.pose.y,()=>drawSpiral37(g,t,s.time,n)),null,false,1/DECK_PITCH));}
 for(const f of s.fx||[])if(f.type!=="slide"&&f.type!=="cover-scrape"&&f.type!=="cyber-stain")withCoverOcclusion(g,covers,f.y,s.time,()=>withWorld46(g,f.x,f.y,()=>fx(g,f)),null,false,1/DECK_PITCH);
 g=finishWarScene46(canvas);drawCombatHelmet(g,s,localSlot);
 // Broadcast spectacle is reserved for round boundaries, never live exchanges.
 const baron=environmentAssets.get('baron29');
 if(s.phase==='finished'&&baron?.complete&&baron.naturalWidth){g.save();g.fillStyle='#0b1522ed';g.fillRect(365,125,270,210);g.drawImage(baron,380,138,240,160);g.strokeStyle='#bd965d';g.lineWidth=2;g.strokeRect(380,138,240,160);g.fillStyle='#ead7b5';g.font='bold 12px monospace';g.textAlign='center';g.fillText("THE BARON’S WAR GAMES",500,320);g.restore();}
}
function drawGloveCore(g:CanvasRenderingContext2D,x:number,y:number,angle:number,scale=1){g.save();g.translate(x,y);g.rotate(angle);g.scale(scale,scale);g.shadowColor="#52eef7";g.shadowBlur=12;g.fillStyle="#071018";g.beginPath();g.ellipse(0,0,11,8,0,0,Math.PI*2);g.fill();g.fillStyle="#ff46b6";g.beginPath();g.ellipse(0,0,9,6,0,0,Math.PI*2);g.fill();g.fillStyle="#55f4ff";g.beginPath();g.ellipse(1,0,7.5,5,0,0,Math.PI*2);g.fill();g.fillStyle="#f5ffff";g.beginPath();g.ellipse(2,0,5,3,0,0,Math.PI*2);g.fill();g.shadowBlur=0;g.strokeStyle="#6ef2ff";g.lineWidth=1.5;g.beginPath();g.moveTo(-11,-3);g.lineTo(-23,-1);g.moveTo(-10,3);g.lineTo(-18,2);g.stroke();g.restore();}
function drawShot(g:CanvasRenderingContext2D,sh:any){const h46=vertical46(sh.x,sh.y,sh.z||0);if(sh.source==="glove-blast"){drawGloveCore(g,sh.x+h46.x,sh.y+h46.y,Math.atan2(sh.vy,sh.vx));return;}const a=Math.atan2(sh.vy,sh.vx),x=sh.x+(sh.renderOffsetX||0)+h46.x,y=sh.y+h46.y,dx=Math.cos(a),dy=Math.sin(a);g.save();g.lineCap="round";if(sh.projectileScale<1){g.strokeStyle="#b59cff";g.lineWidth=1.3;g.beginPath();g.arc(x,y,4,0,Math.PI*2);g.stroke();}g.strokeStyle="#081018";g.lineWidth=3;g.beginPath();g.moveTo(x-dx*13,y-dy*13);g.lineTo(x,y);g.stroke();g.lineWidth=1.15;g.strokeStyle="#b7eced";g.stroke();g.strokeStyle="#fff5ce";g.lineWidth=2;g.beginPath();g.moveTo(x-dx*3,y-dy*3);g.lineTo(x,y);g.stroke();g.restore();}
function groundArc46(g:CanvasRenderingContext2D,p:any,radius:number){for(let n=0;n<=64;n++){const a=n*Math.PI*2/64,r=relativeWorld46(p.x,p.y,Math.cos(a)*radius,Math.sin(a)*radius);n?g.lineTo(p.x+r.x,p.y+r.y):g.moveTo(p.x+r.x,p.y+r.y);}g.closePath();}
function drawPsychicField(g:CanvasRenderingContext2D,p:any,s:any){
 const field=psychicField(p),held=s.covers.find((c:any)=>c.id===p.gripCoverId)||s.matter.find((m:any)=>m.id===p.gripId),slowing=s.phase==="playing"&&p.timeFieldActive,active=!!held||!!p.orbitIds?.length||slowing||p.input?.grip;
 g.save();const fieldLift27j=vertical46(p.x,p.y,p.z||0);g.translate(fieldLift27j.x,fieldLift27j.y);
 if(slowing){
  const tint=p.fieldTint||"#a98aff";g.save();g.beginPath();groundArc46(g,p,field.radius);g.clip();g.fillStyle=tint;g.globalAlpha=.11;g.fillRect(p.x-field.radius,p.y-field.radius,field.radius*2,field.radius*2);
  // World-registered data fractures: readable time volume without hiding tactical inkwork.
  g.strokeStyle=tint;g.fillStyle=tint;g.lineWidth=.9;g.globalAlpha=.28;g.setLineDash([9,17]);const step=44;
  for(let k=-8;k<=8;k++){const x=Math.floor(p.x/step)*step+k*step;g.beginPath();g.moveTo(x,p.y-field.radius);g.lineTo(x,p.y+field.radius);g.stroke();}
  g.setLineDash([]);for(let k=0;k<26;k++){const phase=(s.time*.55+k*.618)%1,angle=k*2.399,r=field.radius*(.2+.75*phase),x=p.x+Math.cos(angle)*r,y=p.y+Math.sin(angle)*r;g.globalAlpha=.25+.3*(1-phase);g.fillRect(x,y,3+k%3,2);g.fillRect(x+7,y+4,2,1);}
  g.restore();g.globalAlpha=.85;g.strokeStyle=tint;g.lineWidth=2.7;g.setLineDash([24,5,3,5]);g.lineDashOffset=-s.time*18;g.beginPath();groundArc46(g,p,field.radius);g.stroke();
 }
 g.strokeStyle=p.battery<s.config.gripEnergy?"#a17988":slowing?(p.fieldTint||"#bf9cff"):"#79e9ee";g.globalAlpha=((p.ripPreview32||p.ripCommit32||p.input?.grip)&&!held) ? .28 : .04;g.lineWidth=1;g.setLineDash(active?[]:[5,10]);g.beginPath();groundArc46(g,p,field.radius);g.stroke();
 if(p.ripCommit32){g.globalAlpha=.14;g.setLineDash([3,14]);g.lineDashOffset=-s.time*12;g.beginPath();groundArc46(g,p,field.radius-5);g.stroke();}
 if(p.orbitIds?.length){g.globalAlpha=.45;g.setLineDash([3,5]);for(const id of p.orbitIds){const m=s.matter.find((m:any)=>m.id===id);if(m){g.beginPath();g.moveTo(p.x,p.y);g.lineTo(m.x,m.y);g.stroke();}}}
 if(p.throwTarget34!==undefined){const t=s.players[p.throwTarget34];if(t){const v=vertical46(t.x,t.y,(t.z||0)-(p.z||0)+32);g.strokeStyle='#ffd993';g.lineWidth=1;g.beginPath();g.arc(t.x+v.x,t.y+v.y,9,0,Math.PI*2);g.stroke();}}
 if(held){const v1=vertical46(p.x,p.y,52),v2=vertical46(p.x,p.y,(held.z??held.height??0)-(p.z||0)+12+(held.hover||0)),r=relativeWorld46(p.x,p.y,held.x-p.x,held.y-p.y),ax=p.x+v1.x,ay=p.y+v1.y,bx=p.x+r.x+v2.x,by=p.y+r.y+v2.y,dx=bx-ax,dy=by-ay,length=Math.hypot(dx,dy)||1,nx=-dy/length,ny=dx/length;g.setLineDash([]);g.lineJoin="round";for(const [width,color,alpha]of [[4,"#210f29",.95],[2,"#f368cb",.85],[.7,"#ffd7f4",.9]] as const){g.lineWidth=width;g.strokeStyle=color;g.globalAlpha=alpha;g.beginPath();g.moveTo(ax,ay);for(let k=1;k<12;k++){const t=k/12,jitter=Math.sin(k*2.7+s.time*7)*Math.sin(t*Math.PI)*.8;g.lineTo(ax+dx*t+nx*jitter,ay+dy*t+ny*jitter);}g.lineTo(bx,by);g.stroke();}g.globalAlpha=.75;g.strokeStyle="#ff9de2";g.lineWidth=1;g.beginPath();g.arc(bx,by,5+Math.sin(s.time*12),0,Math.PI*2);g.stroke();const radial=((held.vx||0)-(p.vx||0))*(held.x-p.x)/Math.max(1,Math.hypot(held.x-p.x,held.y-p.y))+((held.vy||0)-(p.vy||0))*(held.y-p.y)/Math.max(1,Math.hypot(held.x-p.x,held.y-p.y)),magnitude=Math.hypot(p.input?.gripX||0,p.input?.gripY||0),moving=radial>25&&s.time-(p.gripDriveAt??-9)<.16;g.fillStyle="#ffd7f4";g.font="bold 8px monospace";g.textAlign="center";g.fillText("LB THROW · RB PLACE",bx,by-12);}
 g.restore();
}
const batteryVisual=new Map<number,{value:number;trail:number;at:number;round:number;direction:string;changed:number}>();
function drawCombatHelmet(g:CanvasRenderingContext2D,s:any,slot:number){
 const p=s.players[slot]||s.players[0],critical=Math.max(0,1-p.hp/s.config.maxHealth),recent=(s.events||[]).filter((e:any)=>s.time-e.at<.3),incoming=recent.some((e:any)=>e.kind==="hit"&&e.target===slot);
 g.save();g.lineJoin="round";g.lineWidth=2;g.strokeStyle="#6c647e";g.fillStyle="#111521e8";
 // Restrained helmet brow and SNES-style ear ports; the combat center stays open.
 g.beginPath();g.moveTo(175,12);g.lineTo(189,4);g.lineTo(811,4);g.lineTo(825,12);g.lineTo(817,77);g.lineTo(183,77);g.closePath();g.fill();g.stroke();
 for(const x of [166,825]){g.fillStyle="#252337";g.fillRect(x,19,9,37);g.strokeStyle="#ce5299";g.strokeRect(x,19,9,37);g.fillStyle="#6bebf3";g.fillRect(x+2,27,5,3);g.fillRect(x+2,44,5,3);}
 s.players.forEach((f:any,n:number)=>{const x=n===slot?194:516,w=290,color=n===slot?"#68ecf1":"#ec72b8",hp=Math.max(0,f.hp/s.config.maxHealth);g.textAlign="left";g.font="bold 11px monospace";g.fillStyle=color;g.fillText(`${s.mode==="watch"?f.name:n===slot?"YOU":f.name.slice(0,16)}  ${Math.ceil(f.hp)}/${s.config.maxHealth}  W${f.score}`,x,24);g.fillStyle="#080b13";g.fillRect(x,31,w,8);g.fillStyle=hp<.25?"#ff9169":color;g.fillRect(x,31,w*hp,8);g.fillStyle="#515d76";g.fillRect(x,47,w,3);g.fillStyle="#b697e1";g.fillRect(x,47,w*f.battery/100,3);g.fillStyle="#a6b8c5";g.font="9px monospace";g.fillText(`BAT ${s.rules31?.battery==="unlimited"?"∞":Math.ceil(f.battery)}  ${f.shield?(f.timeFieldActive?"SHIELD + TIME":"SHIELD"):f.timeFieldActive?"BULLET FIELD":f.charging?"CHARGING":f.godTime>0?"TIER I":"SHOTGUN ∞"}`,x,64);});
 const pieces37=s.covers.filter((c:any)=>c.constructOwner===slot&&c.hp>0),pending37=p.arsenal37;g.save();g.font='bold 9px monospace';g.textAlign='center';for(let k=1;k<=4;k++){const piece=pieces37.find((c:any)=>c.arsenalSlot37===k),active=pending37?.slot===k;g.fillStyle=active?'#f7d184':piece?'#65efff':'#506176';g.fillText(`${k}${active?'↻':piece?.id===p.gripCoverId?'◆':piece?(p.recallNext37===k?'↻':'■'):'□'}`,440+k*26,145);}g.fillStyle='#b9d9e1';g.fillText('ARSENAL · RB BUILD / RECALL',505,157);g.restore();
 const previous=batteryVisual.get(slot),dt=previous?Math.max(0,Math.min(.05,s.time-previous.at)):0,value=Math.max(0,Math.min(100,p.battery)),changed=!previous||Math.abs(value-previous.value)>.01?s.time:previous.changed,direction=value>=99.99?"FULL":p.charging?"RECHARGING":previous&&value<previous.value-.01?"DRAINING":previous&&value>previous.value+.01?"RECHARGING":previous&&s.time-changed<.25?previous.direction:"READY",trail=!previous||previous.round!==s.round?value:previous.trail+(value-previous.trail)*(1-Math.exp(-5*dt));batteryVisual.set(slot,{value,trail,at:s.time,round:s.round,direction,changed});
 const bx=28,by=220,bh=170;g.fillStyle="#111521db";g.strokeStyle="#82648a";g.lineWidth=2;g.fillRect(bx-9,by-35,42,bh+75);g.strokeRect(bx-9,by-35,42,bh+75);g.fillStyle="#060c16";g.fillRect(bx,by,15,bh);g.fillStyle="#ef7bb6";g.fillRect(bx,by+bh*(1-trail/100),15,bh*trail/100);g.fillStyle=direction==="RECHARGING"?"#a7ffe1":"#64eaf1";g.fillRect(bx,by+bh*(1-value/100),15,bh*value/100);g.textAlign="center";g.font="bold 9px monospace";g.fillStyle="#d9f6ff";g.fillText("BAT",bx+8,by-18);g.fillText(String(Math.ceil(value)),bx+8,by+bh+18);g.save();g.translate(bx+25,by+bh/2);g.rotate(-Math.PI/2);g.font="8px monospace";g.fillText(direction,0,0);g.restore();
 if(s.debug21){
 const held=p.gripCoverId||p.gripId,orbit=p.orbitIds?.length||0,selection=gripSelection(p,s),selected=selection.cover||selection.matter||selection.panel,hint=(p.gripHintUntil||0)>s.time?p.gripHint:orbit?"ORBIT · HOLD LB + TAP RT TO LAUNCH · SELECT ORBIT · X RELEASE":held?(p.input?.fire?"LB THROW · RT FIRE":"LB THROW · RB PLACE · RT FIRE"):selection.panel?"FLOOR PANEL · HOLD LB TO LIFT":selected?"TAP LB FLICK · HOLD LB GATHER":"AIM AT MATERIAL · TAP FLICK / HOLD KEEP",low=value<((held||orbit)?s.config.coverThrowEnergy:s.config.gripEnergy);g.fillStyle="#101927d9";g.fillRect(200,510,600,88);g.textAlign="center";g.fillStyle=low?"#ffc398":"#c1f6ff";g.font="bold 11px monospace";g.fillText(low?"LOW BATTERY · HOLD Y TO RECHARGE":hint,500,584);const field=psychicField(p);g.font="bold 10px monospace";g.fillStyle=p.timeFieldActive&&s.phase==="playing"?"#cbaaff":"#a9d4df";g.fillText(`FIELD ${field.level+1}/3 · ${field.name} · ${field.radius}u · D-PAD LEFT   |   ${p.timeFieldActive?`BULLETS 8% · ${p.timePellets||0}/42 · SELECT TIME · X RELEASE`:"SELECT BULLET TIME · X"}`,500,566);g.font="9px monospace";g.fillStyle="#93abc0";g.fillText("KINETIC WEAVE · STAGE I · 0–100",500,608);
 const supply44=constructionSupply44(p,s),resources=fieldMatter(p,s),stone=resources.filter((m:any)=>m.kind==="stone").length,metal=resources.filter((m:any)=>m.kind==="metal").length;g.fillStyle="#101722d9";g.fillRect(72,187,120,79);g.textAlign="left";g.font="bold 10px monospace";g.fillStyle="#d3b99a";g.fillText(`STONE ${stone} / 2`,80,204);g.fillStyle="#a6dae3";g.fillText(`METAL ${metal} / 1`,80,220);g.fillStyle=stone>=2&&metal>=1?"#9df5d8":"#b9a7b4";g.fillText(supply44.reinforced?"SALVAGE 360 HP":supply44.looseStone>=3?"STONE 280 HP":supply44.groundUnits>=3?"PEEL 280 HP":"NO MATTER IN FIELD",80,238);g.font="9px monospace";g.fillStyle="#b7a9df";g.fillText(`ORBIT ${orbit}/3 · DOWN SELECT`,80,254);g.textAlign="center";g.font="bold 11px monospace";g.fillStyle="#c3e5eb";const constructs=s.covers.filter((c:any)=>c.constructOwner===slot&&c.hp>0).length;const ability=p.selectedPower||0,abilityCost=ability===0?30:ability===1?orbit?0:4*Math.min(3,resources.length):ability===2?22:0,abilityReason=ability===0&&constructs>=2?"2/2 COVERS":ability===0&&!supply44.reinforced&&supply44.looseStone<3&&supply44.groundUnits<3?"NEED MATTER":ability===1&&!orbit&&!resources.length?"NEED MATTER":(value<abilityCost||ability===4&&value<=0)?"LOW BATTERY":"X EXECUTE";g.fillText(`RB COVER · 30 BAT · ${["WIDE WALL","TALL SLAB","COMPACT BLOCK"][p.coverShape||0]} · RIGHT SHAPE  |  UP GUN · DOWN ${["BUILD COVER","ORBIT","PINBALL","HEAVY GAUNTLET","BULLET TIME"][ability]} · ${abilityReason}`,500,540);g.font="9px monospace";g.fillText(p.timeFieldActive?`TIME FIELD · ${p.timeVolleys||0} VOLLEYS · OLDEST ${(p.timeAgeRemaining??8).toFixed(1)}s · ${(8+.2*(p.timePellets||0)).toFixed(1)} BAT/SEC${(p.timePellets||0)>=42?" · CAPACITY: NEW SHOTS PASS":""}`:`COVERS ${constructs}/2 · BUILD 30 · ORBIT 4/PIECE + 3/SEC · PINBALL 22 · HEAVY 0 · TIME 8/SEC`,500,525);
 }else{
  const preview=constructionPreview21(p,s,slot),held=p.gripCoverId||p.gripId,ability=!s.config.legacyPowers?"BULLET TIME":p.selectedPower===5&&s.lab21?.repulseEnabled?"REPULSE · LOCAL LAB":PSYCHIC_POWERS[p.selectedPower||0]||"BUILD COVER";
  const hint=held?"LB THROW · RB PLACE · LB GATHER":(p.gripHintUntil||0)>s.time?p.gripHint:p.charging?"RECHARGING · RELEASE Y":p.shield?"SHIELD ACTIVE":ability==="BUILD COVER"?(preview.reason||"RB BUILD + HOLD · 20 BATTERY"):(p.timeFieldActive?`BULLET TIME · ${Math.max(0,(p.timeUntil27g||s.time)-s.time).toFixed(1)}s · X RELEASE`:"X BULLET TIME · RB BUILD + HOLD · 20 BATTERY");
  g.fillStyle="#101927dc";g.fillRect(190,held?590:527,620,22);g.textAlign="center";g.font="bold 10px monospace";g.fillStyle="#c5edf2";g.fillText(s.rules31?.battery==="unlimited"?hint.replace("20 BATTERY","UNLIMITED"):hint,500,held?605:542,600);
  if(!held)drawSelection22(g,p,s,slot);
 }
 g.textAlign="center";g.fillStyle="#b9dbe5";g.font="bold 10px monospace";g.fillText(`${s.rules31?.battery==="unlimited"?"UNLIMITED BATTERY · ":""}ROUND ${s.round}${s.mode==="practice"?" · "+(s.rules31?.opponent||"full").toUpperCase():""}`,500,91);if((p.followUntil27g||0)>s.time){g.fillStyle="#fff0a0";g.fillText("OPENING · B STRIKE / A REPOSITION",500,142);}
 if(critical>.65||incoming){g.globalAlpha=incoming?.42:(critical-.65)*.55;g.strokeStyle=incoming?"#ff82a9":"#dd69a6";g.lineWidth=incoming?6:3;g.beginPath();g.moveTo(22,90);g.quadraticCurveTo(3,310,22,530);g.moveTo(978,90);g.quadraticCurveTo(997,310,978,530);g.stroke();g.globalAlpha=1;}
 drawDefense43(g,s,slot);
 const fighter=s.players[slot];if(fighter&&((fighter.blastUntil||0)>s.time&&(fighter.blastCharge||0)>0||fighter.gloveHoldStarted!==undefined||s.debug21)){g.fillStyle="#91f9ff";g.font="bold 10px monospace";g.fillText((fighter.blastUntil||0)>s.time&&(fighter.blastCharge||0)>0?"RT · GLOVE FINISH":`GLOVE CHARGE ${Math.round((fighter.gloveCharge||0)*100)}% · RELEASE B`,500,126);}
 const hits=recent.filter((e:any)=>e.owner===slot&&e.kind!=="finish");if(hits.length){const event=hits.at(-1),same=hits.filter((e:any)=>e.kind===event.kind&&e.target===event.target&&e.source===event.source);g.fillStyle=event.kind==="hit"?"#eaffff":event.kind==="shield"?"#7decff":"#d5aa80";g.font="bold 11px monospace";g.fillText(event.kind==="hit"?`${event.source?.includes("throw")?"THROW":event.source==="melee"||event.source==="heavy"?"MELEE":(event.region||"BODY").toUpperCase()} HIT · ${Math.round(same.reduce((n:number,e:any)=>n+e.damage,0))}`:event.kind==="shield"?"TARGET SHIELD BLOCKED":"COVER IMPACT",500,111);}
 if(s.mode==="watch"&&s.debug21){g.fillStyle="#111522df";g.fillRect(140,82,720,46);g.textAlign="center";g.font="bold 11px monospace";g.fillStyle="#78e8ef";g.fillText(`CYAN · ${s.players[0].botIntent||"COUNTDOWN"}`,500,98);g.fillStyle="#f08ec8";g.fillText(`MAGENTA · ${s.players[1].botIntent||"COUNTDOWN"}`,500,115);}
 const matchComplete=s.mode==='duel'&&s.players.some((q:any)=>q.score>=3);
 const cue=s.phase==="countdown"?String(Math.ceil(s.countdown)):s.phase==="playing"&&s.time<(s.fightUntil||0)?"FIGHT":s.phase==="finisher"?"FINISH":s.phase==="finished"?(s.winner===null?"DRAW":s.winner===slot?(matchComplete?'MATCH WON':"ROUND WON"):(matchComplete?'MATCH LOST':"ROUND LOST")):s.phase==="lobby"?"WAITING FOR PLAYER 2":"";
 if(cue&&s.phase==="countdown"){const pulse=1+0.09*Math.sin((s.countdown%1)*Math.PI*2);g.save();g.translate(500,225);g.rotate((Math.ceil(s.countdown)%2?1:-1)*.055);g.scale(pulse,pulse);g.font="900 italic 108px Impact,Arial Black,sans-serif";g.textAlign="center";g.lineJoin="round";g.lineWidth=14;g.strokeStyle="#080a14";g.strokeText(cue,0,0);g.lineWidth=5;g.strokeStyle="#f05abf";g.strokeText(cue,-3,-3);g.fillStyle="#85f6ff";g.fillText(cue,0,0);g.restore();}else if(cue){g.font=`900 italic ${s.phase==="countdown"?88:s.phase==="finished"?42:52}px Arial`;g.lineWidth=7;g.strokeStyle="#080a14";g.strokeText(cue,500,225);g.fillStyle=s.phase==="finished"&&s.winner!==slot?"#f297b3":"#dcfbff";g.fillText(cue,500,225);if(s.phase==="finished"){g.font="bold 12px monospace";g.fillStyle="#b9b5ce";g.fillText(matchComplete?'FIRST TO THREE · HOST STARTS REMATCH':"HOST · START / NEXT ROUND",500,254);}}
 g.restore();
}
function nearest(f:string,d:number){for(let o=0;o<12;o++)for(const raw of o?[d+o,d-o]:[d]){const im=jade.get(`${f}-${((raw%24)+24)%24}`);if(im?.complete&&im.naturalWidth)return im}}
function exactSprite(f:string,d:number){const im=jade.get(`${f}-${((d%24)+24)%24}`);return im?.complete&&im.naturalWidth?im:undefined}
// Pass07: use exact directional runtime art again. The temporary d21→d22 donor
// hid only one symptom and is no longer treated as the final lower-body repair.
function correctedPresentationDir(f:string,d:number){return d}
function safestSprite(f:string,d:number){
 d=correctedPresentationDir(f,d);
 const exact=exactSprite(f,d);if(exact){lastGoodSprite.set(f,{im:exact,dir:d});return exact}
 presentationQA.missingExact++;
 const directionalReady=exactSprite("ready",d),near=nearest(f,d),nearReady=nearest("ready",d),held=lastGoodSprite.get(f)?.im||lastGoodSprite.get("ready")?.im;
 const chosen=directionalReady||near||nearReady||held;
 if(chosen)lastGoodSprite.set(f,{im:chosen,dir:d});
 return chosen;
}
function spriteCell(im:HTMLImageElement,family:string,frame:number){
 const cell=im.naturalWidth%250===0&&im.naturalHeight%250===0?250:125;
 const cols=Math.max(1,Math.floor(im.naturalWidth/cell)),rows=Math.max(1,Math.floor(im.naturalHeight/cell)),frames=Math.max(1,cols*rows),fr=((frame%frames)+frames)%frames;
 return{cell,cols,rows,frames,sx:(fr%cols)*cell,sy:Math.floor(fr/cols)*cell}
}

// The recovered atlases separate contact, brace, peek and fire; they are not idle loops.
function coverTraversalPresentation(p:any){
 const topology=coverTopology(p),speed=Math.abs(p.coverSpeed||0);
 return{topology,moving:speed>20,edge:topology!=="FACE",corner:topology==="CORNER",speed};
}
function coverLateralFrame(p:any,t:number,total:number){
 if(total!==12||Math.abs(p.coverSpeed||0)<=20)return null;
 // Authored 12-cell cover atlas owns lateral locomotion. Direction selects the
 // leading stride; cadence stays presentation-only and never changes coverSpeed.
 const travel=coverTraversalPresentation(p),sign=(p.coverSpeed||0)<0?-1:1;
 // EDGE/CORNER slow the visual cadence slightly to sell planting without changing world movement.
 // Tie cadence to actual cover travel so feet do not cycle while barely moving.
 const key=p.id||"local",prev=coverTravelPhase.get(key)||{phase:0,lastT:t,lastSign:sign},dt=Math.max(0,Math.min(.1,t-prev.lastT));
 // Phase advances from actual cover displacement (speed * dt), not wall-clock cadence.
 // A reversal plants immediately before beginning the opposite stride.
 if(prev.lastSign!==sign){prev.phase=Math.ceil(prev.phase/4)*4;prev.lastSign=sign}
 const topologyScale=travel.corner?.72:travel.edge?.86:1,stepDistance=18;
 prev.phase+=Math.abs(p.coverSpeed||0)*dt/stepDistance*topologyScale;prev.lastT=t;coverTravelPhase.set(key,prev);
 const phase=Math.floor(prev.phase)%4;
 // Four-beat authored cycle: plant -> stride -> opposite plant -> settle.
 const faceCycle=sign<0?[5,6,5,4]:[6,5,6,4];
 const edgeCycle=sign<0?[5,4,6,4]:[6,4,5,4];
 const cornerCycle=sign<0?[4,5,4,6]:[4,6,4,5];
 return (travel.corner?cornerCycle:travel.edge?edgeCycle:faceCycle)[phase];
}
type SoftCoverState="SOFT_CAPTURE"|"SOFT_READY"|"SOFT_FLOW_L"|"SOFT_FLOW_R"|"SOFT_REVERSE"|"SOFT_EDGE"|"SOFT_CORNER"|"SOFT_RELEASE";
const softCoverMemory=new Map<string,{sign:number;changed:number}>();
function softCoverState(p:any,t:number):SoftCoverState{
 const topology=coverTopology(p),speed=p.coverSpeed||0,key=p.id||"local",sign=Math.abs(speed)>12?Math.sign(speed):0,prev=softCoverMemory.get(key)||{sign,changed:t};
 if(sign&&prev.sign&&sign!==prev.sign){prev.sign=sign;prev.changed=t}else if(sign&&!prev.sign)prev.sign=sign;softCoverMemory.set(key,prev);
 if(p.contact>t)return "SOFT_CAPTURE";
 if(topology==="CORNER")return "SOFT_CORNER";
 if(topology==="EDGE")return "SOFT_EDGE";
 if(sign&&t-prev.changed<.14)return "SOFT_REVERSE";
 if(speed<-20)return "SOFT_FLOW_L";
 if(speed>20)return "SOFT_FLOW_R";
 return "SOFT_READY";
}
function softCoverFrame(p:any,t:number,total:number){
 if(p.coverMode!=="soft"||total!==12)return null;
 const st=softCoverState(p,t),map:Record<SoftCoverState,number>={SOFT_CAPTURE:2,SOFT_READY:4,SOFT_FLOW_L:5,SOFT_FLOW_R:6,SOFT_REVERSE:4,SOFT_EDGE:5,SOFT_CORNER:4,SOFT_RELEASE:6};
 return map[st];
}
function coverPoseFrame(p:any,t:number,total:number){
 const soft=softCoverFrame(p,t,total);if(soft!==null)return soft;
 const extended=total===12;
 // LT released always resolves toward the protected low cover family.
 // returnToCover may show an authored retract first; traversal input can interrupt immediately.
 if(p.coverId&&p.coverMode==="braced"&&!p.input?.coverAim&&p.returnToCover<=0&&Math.abs(p.coverSpeed||0)<=20)return extended?4:Math.min(total-1,2);
 const pose=extended?{contact:[0,1,2],brace:4,lateral:[5,6],peek:7,fire:8,return:9}:{contact:[0,1],brace:1,lateral:[],peek:2,fire:3,return:4};
 if(total!==6&&total!==12)return 0;
 if(p.fireState>0||p.recoil>0)return pose.fire;
 if(p.returnToCover>0&&!p.input?.coverAim)return pose.return;
 if(p.coverMode==="braced"&&p.input?.coverAim)return pose.peek;
 if(p.contact>t){const elapsed=Math.max(0,.22-(p.contact-t));return pose.contact[Math.min(pose.contact.length-1,Math.floor(elapsed/.22*pose.contact.length))]}
 const lateral=coverLateralFrame(p,t,total);if(lateral!==null)return lateral;
 return pose.brace;
}

const POWER_ANCHORS=[[263,493],[271,493],[276,493],[289,475],[287,475],[295,475],[293,490],[292,490],[294,490],[305,479],[306,479],[309,479]];
const POWER_FACES=[[278,110,25,28],[278,110,25,28],[285,110,25,28],[290,102,25,28],[290,100,25,28],[290,98,25,28],[297,113,24,27],[297,113,24,27],[297,113,24,27],[308,122,24,27],[310,123,24,27],[311,125,24,27]];
// Entry plays once. Only the settled charge poses cycle; activation has its own peak.
function chargeFrame(age:number,charge:number,seconds=2.4){
 if(age<.35)return Math.min(2,Math.floor(age/.35*3));
 if(charge<.8)return 3+Math.min(2,Math.floor(charge/.8*3));
 // Full-charge peak plays once while held, never as part of the hover loop.
 const fullAge=.35+seconds;if(charge>=1&&age>=fullAge&&age<fullAge+.18)return 9;
 return [6,7,8,7][Math.floor((age-.35)*5)%4];
}
function powerFrame(p:any,cfg:Config){
 if(p.charging)return chargeFrame(p.chargeAge||0,p.godCharge||0,cfg.powerChargeSeconds);
 if(p.powerFlash>0)return (p.powerReleaseCharge||0)>=.99&&p.powerFlash>.45?9:p.powerFlash>.15?10:11;
 if(p.powerReturn>0)return p.godTime>0?11:chargeFrame(p.powerReleaseAge||0,p.powerReleaseCharge||0,cfg.powerChargeSeconds);
 return 11;
}
function powerHover(p:any){
 const lift=(charge:number)=>{const x=Math.max(0,Math.min(1,charge/.8));return 6*x*x*(3-2*x)};
 if(p.charging)return lift(p.godCharge||0);
 if(p.powerFlash>0)return lift(p.powerReleaseCharge||0)*Math.max(0,Math.min(1,(p.powerFlash-.15)/.3));
 if(p.powerReturn>0&&!p.godTime)return lift(p.powerReleaseCharge||0)*Math.min(1,p.powerReturn/.24);
 return 0;
}
function powerPoseAlpha(p:any){return p.charging||p.powerFlash>0?1:Math.max(0,Math.min(1,(p.powerReturn||0)/.24))}
function powerAura(p:any){return p.charging?(p.godCharge||0)*.8:p.godTime>0?.6*Math.min(1,p.godTime/Math.max(.01,p.godDuration||12)):(p.godFade||0)/.45*(p.godFadeStrength||0)}
// Anchors register each pose to the same world position. Source anatomy uses one
// uniform scale, matched to ready-d00: 174 visible pixels in a 250-pixel cell.
// Wider source rectangles retain barrels that extend beyond the nominal grid.
const FLOAT_ANCHORS=[[225,336],[225,336],[225,336],[238,336],[232,336],[236,336],[238,336],[237,336],[236,336],[236,336],[229,336],[225,336]];
const FLOAT_RECTS=[[0,0,438,339],[438,0,368,339],[806,0,380,341],[1186,0,350,341],[0,341,384,342],[384,341,384,342],[768,341,384,342],[1152,341,384,342],[0,683,384,341],[384,683,384,341],[768,683,405,341],[1173,683,363,341]];
// Explicit source rectangles preserve complete silhouettes and weapon particles.
// One scale per source resolution; individual poses are never resized.
const FRONT_RECTS=[[0,0,407,444],[407,0,408,444],[815,0,408,443],[0,445,407,405],[407,445,408,405],[815,442,408,408],[0,0,724,724],[724,0,724,724],[1448,0,724,724],[0,850,411,436],[411,850,404,436],[815,850,408,436]];
const FRONT_ANCHORS=[[215,446],[613,446],[1019,446],[219,862],[615,862],[1020,862],[516,667],[1086,667],[1654,667],[219,1262],[613,1262],[1019,1262]];
// Approved d03: use compact dissolve and reuse opening ready on return.
// Full source silhouettes, one anatomical scale per sheet resolution.
const RIGHT_RECTS=[[23,20,325,347],[230,190,780,896],[732,20,310,350],[1090,20,318,350],[23,367,293,357],[376,366,304,357],[730,366,309,357],[1090,366,305,357],[16,720,302,351],[371,720,315,351],[730,720,371,351],[23,20,325,347]];
const RIGHT_ANCHORS=[[192,364],[662,1076],[905,366],[1268,366],[190,716],[550,716],[904,716],[1264,716],[184,1066],[544,1066],[902,1066],[192,364]];
function hasRightPower(p:any){return powerDirection(p)===3&&powerAssets.has("front-right-d03-sequence-v1")&&powerAssets.has("front-right-d03-dissolve-v1")}
function powerDirection(p:any){const speed=Math.hypot(p.vx||0,p.vy||0),family=p.coverId?"cover":p.slide>0||p.pinball>0||p.knock>.32?"slide":speed>34?"run":"ready",angle=spriteFacing(p,family,speed);return ((Math.round(angle/(Math.PI*2)*24)%24)+24)%24}
function hasFrontPower(p:any){return powerDirection(p)===6&&powerAssets.has("front-d06-loop-v1")&&powerAssets.has("front-d06-transitions-v1")}
function drawPowerFrame(g:CanvasRenderingContext2D,p:any,cfg:Config,frame:number){
 if(hasRightPower(p)){
  const im=powerAssets.get(frame===1?"front-right-d03-dissolve-v1":"front-right-d03-sequence-v1")!,[sx,sy,w,h]=RIGHT_RECTS[frame],[ax,ay]=RIGHT_ANCHORS[frame],unit=(125*178/250/(frame===1?876:339))*cfg.spriteScale,dx=p.x-(ax-sx)*unit,dy=p.y-(ay-sy)*unit-powerHover(p)*cfg.spriteScale;
  // Pose 3 padding contains discarded neighboring particles. Keep cape below y200.
  if(frame===2){g.save();g.beginPath();g.moveTo(dx+(745-sx)*unit,dy);g.lineTo(dx+w*unit,dy);g.lineTo(dx+w*unit,dy+h*unit);g.lineTo(dx,dy+h*unit);g.lineTo(dx,dy+(200-sy)*unit);g.lineTo(dx+(745-sx)*unit,dy+(200-sy)*unit);g.closePath();g.clip()}
  g.drawImage(im,sx,sy,w,h,dx,dy,w*unit,h*unit);
  if(frame===2)g.restore();return true;
 }
 if(hasFrontPower(p)){
  const loop=frame>=6&&frame<=8,im=powerAssets.get(loop?"front-d06-loop-v1":"front-d06-transitions-v1")!,[sx,sy,w,h]=FRONT_RECTS[frame],[ax,ay]=FRONT_ANCHORS[frame],unit=(125*176/250/(loop?595:405))*cfg.spriteScale;
  g.drawImage(im,sx,sy,w,h,p.x-(ax-sx)*unit,p.y-(ay-sy)*unit-powerHover(p)*cfg.spriteScale,w*unit,h*unit);return true;
 }
 const atlas=powerAssets.get("grounded-float-v1");
 if(atlas){const [sx,sy,w,h]=FLOAT_RECTS[frame],[ax,ay]=FLOAT_ANCHORS[frame],col=frame%4,row=Math.floor(frame/4),sourceX=ax+col*384-sx,sourceY=ay+Math.round(row*1024/3)-sy,unit=(125*174/250/325)*cfg.spriteScale;
  g.drawImage(atlas,sx,sy,w,h,p.x-sourceX*unit,p.y-sourceY*unit-powerHover(p)*cfg.spriteScale,w*unit,h*unit);return true}
 // Preserve the installed baseline if the new sheet has not loaded yet.
 const local=frame%6,key=frame<6?"opening":"continuation",im=powerAssets.get(key),face=powerAssets.get("face-"+key);if(!im)return false;
 const sx=local%3*512,sy=Math.floor(local/3)*512,[ax,ay]=POWER_ANCHORS[frame],size=125*cfg.spriteScale,unit=size/512,dx=p.x-ax*unit,dy=p.y-ay*unit;
 g.drawImage(im,sx,sy,512,512,dx,dy,size,size);
 if(face){const [x,y,w,h]=POWER_FACES[frame];g.save();g.beginPath();g.ellipse(dx+(x+w/2)*unit,dy+(y+h/2)*unit,w/2*unit,h/2*unit,0,0,Math.PI*2);g.clip();g.drawImage(face,sx+x,sy+y,w,h,dx+x*unit,dy+y*unit,w*unit,h*unit);g.restore()}
 return true;
}
function drawPowerPose(g:CanvasRenderingContext2D,p:any,cfg:Config){
 // Keep the approved inkwork opaque: overlapping full poses produce double outlines.
 return drawPowerFrame(g,p,cfg,powerFrame(p,cfg));
}
// Approved d03 psychic poses: one anatomical scale and grounded foot line.
const PSYCHIC_RECTS=[[0,0,683,768],[683,0,683,768],[1366,0,682,768]];
const PSYCHIC_ANCHORS=[[410,736],[1060,736],[1730,736]];
function psychicFrame(p:any,t:number){
 if(p.psychicPreview>=0&&p.psychicPreview<=2&&powerAssets.has("psychic-d03-v1"))return p.psychicPreview;
 if(powerDirection(p)!==3||!powerAssets.has("psychic-d03-v1")||p.charging||p.powerFlash>0||p.powerReturn>0||p.knock>0||p.slide>0||p.dash>0||p.kickStage&&p.kickStage!=="none")return null;
 if(p.gripId||p.gripCoverId||(p.orbitIds?.length&&!p.fireState&&!p.recoil))return t-(p.psychicStartedAt??t)<.12?0:1;
 if((p.psychicReturnUntil||0)>t&&!p.input?.fire&&!p.input?.cover&&!p.input?.melee&&!p.input?.coverAim&&!p.coverId)return 2;
 return null;
}
// Two authored views plus explicit mirrored approximation; no rotation of upright artwork.
function drawMelee38Pose(g:CanvasRenderingContext2D,p:any,t:number,cfg:Config){const m=p.meleeCombo,blastAge=t-(p.blastPoseAt??-9);if(!m&&!(blastAge>=0&&blastAge<.3))return false;
 const specs=[{startup:.08,active:.07},{startup:.10,active:.08},{startup:.12,active:.08},{startup:.14,active:.09}],a=m?.angle??p.aim,back=Math.sin(a)<-.05,mirror=back?Math.cos(a)>0:Math.cos(a)<0,im=powerAssets.get("melee38-"+(back?"rear-left":"front-right"));if(!im)return false;
 const age=m?t-m.started:blastAge,spec=m?specs[m.stage]:{startup:.03,active:.12},frame=age<spec.startup?0:age<spec.startup+spec.active?1:2,row=m?m.stage:4,unit=125*cfg.spriteScale/256;
 g.save();g.translate(p.x,p.y);if(mirror)g.scale(-1,1);g.drawImage(im,frame*384,row*384,384,384,-192*unit,-288*unit,384*unit,384*unit);g.restore();return true;}
function drawPsychicPose(g:CanvasRenderingContext2D,p:any,t:number,cfg:Config){const frame=psychicFrame(p,t);if(frame===null)return false;const im=powerAssets.get("psychic-d03-v1")!,[sx,sy,w,h]=PSYCHIC_RECTS[frame],[ax,ay]=PSYCHIC_ANCHORS[frame],unit=(125*178/250/697)*cfg.spriteScale;g.drawImage(im,sx,sy,w,h,p.x-(ax-sx)*unit,p.y-(ay-sy)*unit,w*unit,h*unit);return true;}
// Approved d03 cover connectors share one crouched anatomical scale.
const COVER_CONNECTOR_RECTS=[[0,0,887,887],[887,0,887,887]];
const COVER_CONNECTOR_ANCHORS=[[514,828],[1320,831]];
const COVER_EXPOSURE_RECTS=[[0,0,925,887],[925,0,849,887]];
const COVER_EXPOSURE_ANCHORS=[[553,817],[1363,814]];
function coverExposureFrame(p:any){
 if(!powerAssets.has("cover-d03-exposure-v1"))return null;
 if(p.coverPreview===2||p.coverPreview===3)return p.coverPreview-2;
 if(!p.coverId||p.coverMode!=="braced"||!p.peek||!p.input?.coverAim||p.charging||p.powerFlash>0||p.powerReturn>0||p.knock>0||p.slide>0||p.dash>0||p.exit||p.gripId||p.gripCoverId||p.kickStage&&p.kickStage!=="none")return null;
 const dir=supportedCoverDir(p),status=coverActorSectorStatus(p);
 if(status==="MISSING"||dir!==3)return null;
 return p.fireState>0||p.recoil>0?1:0;
}
function drawCoverExposure(g:CanvasRenderingContext2D,p:any,cfg:Config,upperOnly=false){const frame=coverExposureFrame(p);if(frame===null)return false;const im=powerAssets.get("cover-d03-exposure-v1")!,[sx,sy,w,h]=COVER_EXPOSURE_RECTS[frame],[ax,ay]=COVER_EXPOSURE_ANCHORS[frame],unit=(125*143/250/638)*cfg.spriteScale;g.save();if(upperOnly){g.beginPath();g.rect(-1e4,-1e4,2e4,p.y-31+1e4);g.clip()}g.drawImage(im,sx,sy,w,h,p.x-(ax-sx)*unit,p.y-(ay-sy)*unit,w*unit,h*unit);g.restore();return true;}
function coverConnectorFrame(p:any){
 if(!powerAssets.has("cover-d03-connectors-v1"))return null;
 if(p.coverPreview===0||p.coverPreview===1)return p.coverPreview;
 if(!p.coverId||p.coverMode!=="braced"||p.charging||p.powerFlash>0||p.powerReturn>0||p.knock>0||p.slide>0||p.dash>0||p.exit||p.gripId||p.gripCoverId||p.kickStage&&p.kickStage!=="none")return null;
 const angle=p.gunFacing??p.aim??0,dir=supportedCoverDir(p),status=coverActorSectorStatus(p);
 if(status==="MISSING"||dir!==3)return null;
 if(p.fireState>0||p.recoil>0)return 0;
 if(p.returnToCover>0&&!p.input?.coverAim)return 1;
 return null;
}
function drawCoverConnector(g:CanvasRenderingContext2D,p:any,cfg:Config,upperOnly=false){const frame=coverConnectorFrame(p);if(frame===null)return false;const im=powerAssets.get("cover-d03-connectors-v1")!,[sx,sy,w,h]=COVER_CONNECTOR_RECTS[frame],[ax,ay]=COVER_CONNECTOR_ANCHORS[frame],unit=(125*143/250/638)*cfg.spriteScale;g.save();if(upperOnly){g.beginPath();g.rect(-1e4,-1e4,2e4,p.y-31+1e4);g.clip()}g.drawImage(im,sx,sy,w,h,p.x-(ax-sx)*unit,p.y-(ay-sy)*unit,w*unit,h*unit);g.restore();return true;}
const COVER_NEIGHBOR_POSES=[{"dir":2,"pose":"aim","rect":[130,0,685,552],"anchor":[520,524.1677115987461],"muzzle":[785,161],"bands":[[130,0,685,531],[276,531,2,1],[279,531,110,1],[636,531,1,1],[674,531,3,1],[678,531,91,1],[276,532,1,1],[279,532,109,1],[676,532,3,1],[680,532,87,1],[769,532,1,1],[278,533,2,1],[281,533,107,1],[678,533,88,1],[767,533,2,1],[282,534,2,1],[285,534,100,1],[386,534,1,1],[681,534,1,1],[683,534,3,1],[687,534,80,1],[283,535,101,1],[385,535,2,1],[683,535,1,1],[685,535,71,1],[757,535,9,1],[767,535,1,1],[285,536,101,1],[387,536,1,1],[685,536,9,1],[695,536,57,1],[755,536,9,1],[765,536,1,1],[283,537,1,1],[285,537,1,1],[287,537,101,1],[684,537,4,1],[689,537,39,1],[731,537,1,1],[733,537,12,1],[751,537,5,1],[758,537,1,1],[760,537,2,1],[763,537,4,1],[287,538,97,1],[385,538,2,1],[688,538,1,1],[690,538,22,1],[713,538,1,1],[715,538,5,1],[724,538,1,1],[726,538,26,1],[758,538,1,1],[761,538,6,1],[284,539,1,1],[286,539,102,1],[685,539,1,1],[687,539,42,1],[734,539,13,1],[760,539,8,1],[287,540,99,1],[691,540,37,1],[730,540,1,1],[737,540,1,1],[739,540,3,1],[743,540,1,1],[763,540,3,1],[286,541,1,1],[288,541,12,1],[301,541,83,1],[691,541,37,1],[729,541,1,1],[731,541,1,1],[734,541,9,1],[744,541,1,1],[763,541,2,1],[293,542,2,1],[297,542,1,1],[299,542,84,1],[695,542,25,1],[721,542,2,1],[725,542,1,1],[290,543,1,1],[292,543,1,1],[303,543,78,1],[697,543,5,1],[703,543,19,1],[723,543,2,1],[726,543,1,1],[308,544,8,1],[325,544,16,1],[342,544,4,1],[355,544,24,1],[311,545,1,1],[313,545,21,1],[335,545,21,1],[361,545,15,1],[362,546,12,1],[361,547,11,1],[362,548,9,1],[361,549,6,1],[362,550,3,1]]},{"dir":2,"pose":"recoil","rect":[840,0,685,552],"anchor":[1202,525.1677115987461],"muzzle":[1424,97],"bands":[[840,0,685,531],[933,531,1,1],[935,531,2,1],[940,531,110,1],[1309,531,5,1],[1322,531,20,1],[1348,531,1,1],[1350,531,105,1],[941,532,107,1],[1049,532,1,1],[1313,532,9,1],[1340,532,9,1],[1350,532,104,1],[939,533,2,1],[942,533,107,1],[1323,533,19,1],[1343,533,1,1],[1345,533,4,1],[1350,533,104,1],[943,534,107,1],[1333,534,4,1],[1339,534,1,1],[1341,534,1,1],[1343,534,3,1],[1347,534,107,1],[941,535,1,1],[943,535,107,1],[1051,535,1,1],[1334,535,2,1],[1337,535,1,1],[1339,535,2,1],[1342,535,110,1],[1453,535,1,1],[942,536,104,1],[1047,536,3,1],[1051,536,1,1],[1331,536,3,1],[1335,536,17,1],[1354,536,96,1],[1451,536,1,1],[942,537,112,1],[1333,537,1,1],[1336,537,19,1],[1356,537,88,1],[1445,537,3,1],[1449,537,2,1],[1452,537,2,1],[942,538,112,1],[1336,538,22,1],[1362,538,86,1],[1449,538,1,1],[941,539,1,1],[943,539,112,1],[1336,539,113,1],[1451,539,1,1],[943,540,112,1],[1339,540,27,1],[1367,540,79,1],[1447,540,1,1],[1449,540,1,1],[942,541,112,1],[1339,541,108,1],[943,542,1,1],[945,542,24,1],[970,542,83,1],[1347,542,1,1],[1349,542,3,1],[1359,542,1,1],[1362,542,2,1],[1365,542,1,1],[1367,542,1,1],[1369,542,53,1],[1423,542,16,1],[1442,542,1,1],[944,543,17,1],[963,543,2,1],[967,543,1,1],[969,543,3,1],[975,543,49,1],[1025,543,27,1],[1346,543,1,1],[1351,543,1,1],[1353,543,2,1],[1357,543,1,1],[1359,543,2,1],[1362,543,1,1],[1382,543,9,1],[1403,543,23,1],[1427,543,1,1],[1434,543,1,1],[1436,543,1,1],[1439,543,2,1],[1442,543,3,1],[947,544,7,1],[955,544,3,1],[959,544,2,1],[962,544,1,1],[971,544,8,1],[987,544,4,1],[993,544,1,1],[995,544,1,1],[997,544,1,1],[999,544,15,1],[1021,544,29,1],[1401,544,1,1],[946,545,1,1],[950,545,1,1],[976,545,20,1],[997,545,3,1],[1009,545,12,1],[1029,545,2,1],[1032,545,17,1],[981,546,2,1],[1034,546,13,1],[1034,547,11,1],[1035,548,9,1],[1036,549,6,1],[1038,550,1,1]]},{"dir":4,"pose":"aim","rect":[130,531,685,493],"anchor":[502,992.1677115987461],"muzzle":[718,681],"bands":[[130,552,685,472],[489,533,1,1],[489,534,6,1],[483,535,2,1],[488,535,3,1],[494,535,2,1],[483,536,2,1],[486,536,10,1],[482,537,15,1],[482,538,15,1],[388,539,2,1],[411,539,1,1],[482,539,14,1],[497,539,1,1],[386,540,3,1],[399,540,16,1],[481,540,15,1],[497,540,1,1],[384,541,7,1],[395,541,22,1],[481,541,18,1],[383,542,13,1],[397,542,18,1],[417,542,3,1],[479,542,18,1],[498,542,1,1],[381,543,12,1],[395,543,23,1],[420,543,4,1],[426,543,1,1],[475,543,2,1],[478,543,19,1],[498,543,1,1],[380,544,46,1],[428,544,1,1],[444,544,2,1],[447,544,2,1],[451,544,1,1],[455,544,2,1],[471,544,3,1],[475,544,24,1],[380,545,48,1],[435,545,26,1],[462,545,1,1],[469,545,33,1],[503,545,4,1],[381,546,50,1],[433,546,1,1],[435,546,29,1],[465,546,1,1],[469,546,31,1],[501,546,1,1],[503,546,4,1],[381,547,89,1],[471,547,37,1],[509,547,1,1],[382,548,83,1],[466,548,2,1],[469,548,40,1],[367,549,5,1],[383,549,127,1],[365,550,8,1],[384,550,126,1],[361,551,13,1],[384,551,126,1],[511,551,1,1]]},{"dir":4,"pose":"recoil","rect":[840,531,685,493],"anchor":[1189,993.1677115987461],"muzzle":[1420,624],"bands":[[840,552,685,472],[1172,533,1,1],[1169,534,6,1],[1169,535,4,1],[1174,535,3,1],[1167,536,9,1],[1165,537,1,1],[1167,537,11,1],[1165,538,13,1],[1163,539,13,1],[1177,539,1,1],[1079,540,1,1],[1083,540,13,1],[1155,540,3,1],[1163,540,13,1],[1177,540,1,1],[1054,541,1,1],[1077,541,23,1],[1153,541,26,1],[1053,542,5,1],[1075,542,7,1],[1083,542,13,1],[1098,542,6,1],[1150,542,1,1],[1153,542,24,1],[1178,542,1,1],[1052,543,17,1],[1071,543,6,1],[1079,543,22,1],[1103,543,2,1],[1146,543,35,1],[1053,544,51,1],[1105,544,2,1],[1119,544,2,1],[1136,544,1,1],[1139,544,2,1],[1143,544,37,1],[1053,545,52,1],[1107,545,75,1],[1047,546,2,1],[1054,546,128,1],[1210,546,1,1],[1045,547,4,1],[1054,547,130,1],[1205,547,1,1],[1207,547,6,1],[1044,548,6,1],[1055,548,129,1],[1207,548,9,1],[1042,549,8,1],[1055,549,127,1],[1183,549,1,1],[1204,549,13,1],[1039,550,12,1],[1056,550,126,1],[1183,550,1,1],[1201,550,3,1],[1205,550,11,1],[1038,551,13,1],[1056,551,129,1],[1203,551,14,1],[1218,551,1,1]]}];
function coverNeighborFrame(p:any){
 if(!powerAssets.has("cover-d02-d04-exposure-v1"))return null;
 if(p.coverPreview>=4&&p.coverPreview<=7)return p.coverPreview-4;
 if(p.coverPreview>=0)return null;
 if(!p.coverId||p.coverMode!=="braced"||!p.peek||!p.input?.coverAim||p.charging||p.powerFlash>0||p.powerReturn>0||p.knock>0||p.slide>0||p.dash>0||p.exit||p.gripId||p.gripCoverId||p.kickStage&&p.kickStage!=="none")return null;
 const dir=supportedCoverDir(p);
 if(dir!==2&&dir!==4)return null;
 return (dir===2?0:2)+(p.fireState>0||p.recoil>0?1:0);
}
function drawCoverNeighbor(g:CanvasRenderingContext2D,p:any,cfg:Config,upperOnly=false){
 const frame=coverNeighborFrame(p);if(frame===null)return false;
 const im=powerAssets.get("cover-d02-d04-exposure-v1")!,pose=COVER_NEIGHBOR_POSES[frame],[sx,sy,w,h]=pose.rect,[ax,ay]=pose.anchor,unit=125*143/250/445*cfg.spriteScale;
 g.save();g.beginPath();for(const [x,y,bw,bh] of pose.bands)g.rect(p.x+(x-ax)*unit,p.y+(y-ay)*unit,bw*unit,bh*unit);g.clip();if(upperOnly){g.beginPath();g.rect(-1e4,-1e4,2e4,p.y-31+1e4);g.clip()}
 g.drawImage(im,sx,sy,w,h,p.x+(sx-ax)*unit,p.y+(sy-ay)*unit,w*unit,h*unit);g.restore();return true;
}
function coverVisualOffset(p:any){
 if(!p.coverId||!p.coverAnchor)return{x:0,y:0};
 const a=p.coverAnchor,exposed=!!(p.input?.coverAim||p.fireState>0||p.recoil>0||p.returnToCover>0);
 // Presentation-only contact correction. Gameplay root/collision remains authoritative.
 // Keep exposed poses closer to authored anchor; tucked poses sit just outside the physical face.
 // Face-specific socket correction derived from the attached cover basis.
 // Normal keeps Jade outside the wall; tangent corrects authored silhouette bias.
 const topology=coverTopology(p),normal=exposed?1.25:3.5;
 const faceBias=a.face==="left"?-.9:a.face==="right"?.9:a.face==="top"?-.45:.45;
 const endSign=(a.t??0)<(a.length??0)/2?-1:1;
 const topologyTangent=topology==="FACE"?0:topology==="EDGE"?endSign*1.35:endSign*2.05;
 // Keep corner art outside the owning footprint; large tangential offsets caused visual cross-through.
 const topologyNormal=topology==="CORNER"?2.15:topology==="EDGE"?.8:0;
 return{x:a.nx*(normal+topologyNormal)+a.tx*(faceBias+topologyTangent),y:a.ny*(normal+topologyNormal)+a.ty*(faceBias+topologyTangent)};
}
// Pack04 registration contract: every Pack03A cel shares one ground/root line.
// Per-family offsets correct atlas framing only; never gameplay root/collision.
const PACK04_REG={aim:{scale:1,ground:.89,x:0},lower:{scale:1,ground:.89,x:0},connectors:{scale:1,ground:.89,x:0}} as const;
function drawActorAtlasFrame(g:CanvasRenderingContext2D,im:HTMLImageElement,index:number,cols:number,rows:number,p:any,cfg:Config,scale=1,family:keyof typeof PACK04_REG="aim"){
 const cw=im.naturalWidth/cols,ch=im.naturalHeight/rows,sx=(index%cols)*cw,sy=Math.floor(index/cols)*ch,r=PACK04_REG[family];
 const h=125*cfg.spriteScale*scale*r.scale,w=h*(cw/ch);
 g.drawImage(im,sx,sy,cw,ch,p.x-w*.5+r.x*cfg.spriteScale,p.y-h*r.ground,w,h);return true;
}
function pack03AimIndex(p:any){
 if(!p.coverId||p.coverMode!=="braced"||!p.input?.coverAim)return null;
 const sector=coverAimSector(p),base:Record<number,number>={4:0,6:4,8:8,10:12,12:16};
 const b=base[sector];if(b===undefined)return null;
 const state=p.recoil>0?2:p.fireState>0?1:0;return b+state;
}
function drawPack03Aim(g:CanvasRenderingContext2D,p:any,cfg:Config){
 const im=actorAssets.get("aim"),idx=pack03AimIndex(p);if(!im||idx===null)return false;
 return drawActorAtlasFrame(g,im,idx,5,4,p,cfg,1,"aim");
}
function drawPack03Brake(g:CanvasRenderingContext2D,p:any,cfg:Config){
 const im=actorAssets.get("lower");if(!im||!(p.brakeState>0)||p.coverId)return false;
 const age=1-Math.max(0,Math.min(1,p.brakeState/.24)),idx=4+Math.min(3,Math.floor(age*4));
 return drawActorAtlasFrame(g,im,idx,4,2,p,cfg,1,"lower");
}
function pack03RetractIndex(p:any){
 if(!p.coverId||p.coverMode!=="braced"||!(p.returnToCover>0)||p.input?.coverAim)return null;
 const sector=coverAimSector(p);let pair:number|null=null;
 if(sector===8||sector===7||sector===9)pair=12; // R01
 else if(sector===6||sector===10||sector===5||sector===11)pair=14; // R02
 else if(sector===4||sector===12)pair=16; // R03
 if(pair===null)return null;
 const phase=p.returnToCover>.08?0:1;return pair+phase;
}
function drawPack03Retract(g:CanvasRenderingContext2D,p:any,cfg:Config){
 const im=actorAssets.get("connectors"),idx=pack03RetractIndex(p);if(!im||idx===null)return false;
 return drawActorAtlasFrame(g,im,idx,6,3,p,cfg,1,"connectors");
}
function drawPlantPunctuation(g:CanvasRenderingContext2D,p:any,t:number){
 if(!p.coverId||p.coverMode!=="braced")return;
 const justPlant=p.input?.coverAim&&p.contact<=t&&Math.abs(p.coverSpeed||0)<1;
 if(!justPlant)return;
 // Restrained micro punctuation: only while planted; low alpha keeps reticle/muzzle clear.
 g.save();g.globalAlpha=.22;g.fillStyle="#d9ffff";g.font="900 italic 9px Arial";g.fillText("CHK!",p.x-12,p.y+5);g.restore();
}
function coverCaptureBridge(p:any,t:number){
 if(!p.coverId||typeof p.contact!=="number"||p.contact<=t)return null;
 const age=Math.max(0,.22-(p.contact-t)),topology=coverTopology(p);
 // Three presentation-only bridge beats over the existing authoritative .22s contact window.
 // B01 pre-impact inherits the terminal slide silhouette; B02 compression and B03 settle
 // reuse the existing authored cover contact cells. No gameplay timer or root is changed.
 if(age<.04)return{kind:"slide",phase:.94,compression:0,rise:0,topology};
 // B02: use the authored contact silhouette but add a tiny presentation-only compression
 // along the cover normal. This sells impact without moving collision/root or inventing Jade.
 if(age<.115)return{kind:"cover",frame:0,compression:Math.sin((age-.04)/.075*Math.PI),rise:0,topology};
 if(age<.18)return{kind:"cover",frame:1,compression:(.18-age)/.065*.35,rise:(age-.115)/.065,topology};
 return{kind:"cover",frame:2,compression:0,rise:1,topology};
}
const turnVisual=new Map<string,{angle:number;at:number;bank:number}>();
const actorVisualMemory=new Map<string,{family:string;dir:number;changed:number}>();
function actorContinuity(p:any,family:string,dir:number,t:number){
 const key=p.id||p.name||"local",old=actorVisualMemory.get(key);let settle=1;
 if(!old||old.family!==family||old.dir!==dir){actorVisualMemory.set(key,{family,dir,changed:t});settle=0}else settle=Math.min(1,(t-old.changed)/.09);
 // Tiny presentation-only settle dampens donor-family silhouette bounce without changing gameplay root.
 return{settle,y:0}; // Registered root stays fixed across donor/direction changes.
}
// Direction-aware Power Glove wind-up presentation. Temporary vector overlay,
// not an approved directional sprite; combat collision and damage stay authoritative.
function drawGloveWindup(g:CanvasRenderingContext2D,p:any,t:number,cfg:Config,character:"jade"|"raptor"="jade"){
 const holding=p.gloveHoldStarted!==undefined&&p.input?.melee;
 const m=p.meleeCombo,active=!!m&&m.gloveCharge!==undefined;
 if(!holding&&!active)return;
 const charge=Math.max(0,Math.min(1,holding?(p.gloveCharge||0):(m?.gloveCharge||0)));
 const aim=active?(m?.angle??p.aim):p.aim;
 const age=active?t-m.started:0;
 const thrust=active?Math.max(0,Math.min(1,(age-.025)/.085)):0;
 const release=active?Math.max(0,1-Math.abs(age-.105)/.10):0;
 const sc=cfg.spriteScale||1;
 const accent=character==="raptor"?"#e45b67":"#ff53b5";
 // Grounded weight transfer: planted foot anchors, rear heel load, forward hip drive.
 // Presentation-only geometry; never alter actual player coordinates or hitboxes.
 const ux=Math.cos(aim),uy=Math.sin(aim),sideX=-uy,sideY=ux;
 const weight=holding?charge*.65:release;
 const rootX=p.x,rootY=p.y+3*sc;
 g.save();g.lineCap="round";
 for(const side of [-1,1]){
  const footX=rootX+sideX*side*10*sc-ux*(side===-1?9*weight:-4*weight)*sc;
  const footY=rootY+sideY*side*5*sc+uy*(side===-1?6*weight:3*weight)*sc;
  g.fillStyle="#202b38";g.strokeStyle=accent;g.lineWidth=1.5*sc;
  g.beginPath();g.ellipse(footX,footY,10*sc,3.2*sc,aim,0,Math.PI*2);g.fill();g.stroke();
 }
 const hipX=rootX-ux*6*weight*sc,hipY=p.y-12*sc;
 const chestX=rootX+ux*(4+release*9)*sc,chestY=p.y-30*sc;
 g.strokeStyle="#222b3b";g.lineWidth=13*sc;
 g.beginPath();g.moveTo(hipX,hipY);g.lineTo(chestX,chestY);g.stroke();
 g.strokeStyle=character==="raptor"?"#8d995b":"#9ca8bb";g.lineWidth=8*sc;
 g.beginPath();g.moveTo(hipX,hipY);g.lineTo(chestX,chestY);g.stroke();
 g.restore();
 // Eight-direction anatomical wind-up: hips anchor, shoulder turns, elbow coils,
 // fist retracts and then drives forward. Presentation only; gameplay root never moves.
 const facing=aim,fx=Math.cos(facing),fy=Math.sin(facing);
 const px=p.x+ux*release*7*sc,py=p.y-23*sc;
 const twist=(holding?charge*.34:charge*(1-thrust)*.34);
 const sx=px-fx*(3+twist*13)*sc,sy=py-fy*(3+twist*9)*sc;
 const elbowDistance=(holding?13+charge*9:12+thrust*8)*sc;
 const ex=sx-fx*elbowDistance+(-fy)*(7+charge*4)*sc;
 const ey=sy-fy*elbowDistance+fx*(7+charge*4)*sc;
 const pull=holding?(9+charge*15)*sc:0;
 const reach=(16+thrust*(21+charge*19))*sc-pull;
 const hx=px+fx*reach,hy=py+fy*reach;
 g.save();
 g.lineCap="round";
 g.strokeStyle="#141a28";g.lineWidth=(12+charge*5)*sc;
 g.beginPath();g.moveTo(sx,sy);g.lineTo(ex,ey);g.lineTo(hx,hy);g.stroke();
 g.strokeStyle="#a7aebd";g.lineWidth=(8+charge*3)*sc;
 g.beginPath();g.moveTo(sx,sy);g.lineTo(ex,ey);g.lineTo(hx,hy);g.stroke();
 // Shoulder counterrotation and armor plate make the wind-up read as body-driven.
 g.save();g.translate(sx,sy);g.rotate(facing+twist);
 g.fillStyle="#333d50";g.strokeStyle="#f267a9";g.lineWidth=1.6*sc;
 g.beginPath();g.ellipse(0,0,(8+charge*3)*sc,6*sc,0,0,Math.PI*2);g.fill();g.stroke();g.restore();
 const radius=(7+charge*8+thrust*5)*sc;
 g.shadowColor=accent;g.shadowBlur=(7+charge*18)*sc;
 g.fillStyle="#f2a5d8";g.beginPath();g.arc(hx,hy,radius,0,Math.PI*2);g.fill();
 g.strokeStyle="#5eeaff";g.lineWidth=2*sc;g.beginPath();g.arc(hx,hy,radius+4*sc,0,Math.PI*2*charge);g.stroke();
 // Hit punctuation at the authored contact window; no extra damage or collision.
 if(active&&release>0){
  g.globalAlpha=release*(.35+.65*charge);
  g.strokeStyle=accent;g.lineWidth=(2+charge*4)*sc;
  for(let i=0;i<6;i++){
   const a=aim+(i-2.5)*Math.PI/5,near=radius+5*sc,far=radius+(14+charge*25)*sc;
   g.beginPath();g.moveTo(hx+Math.cos(a)*near,hy+Math.sin(a)*near);g.lineTo(hx+Math.cos(a)*far,hy+Math.sin(a)*far);g.stroke();
  }
  g.globalAlpha=1;
 }
 g.restore();
}
function fighter(g:CanvasRenderingContext2D,p:any,t:number,cfg:Config,character:"jade"|"raptor"="jade"){
 if(character==="raptor"){
  const speed=Math.hypot(p.vx||0,p.vy||0);
  const visual=coverVisualOffset(p);
  const family=p.slide>0||p.pinball>0?"slide":speed>20?"run":"ready";
  paintRaptorSprite(g,{x:visual.x+p.x,y:visual.y+p.y,angle:spriteFacing(p,family,speed),
    speed,sliding:p.slide>0||p.pinball>0,slideRemaining:p.slide>0?p.slide:undefined,slideDuration:cfg.slideDuration,
    attached:!!p.coverId,actorId:p.id||"local",airborne:p.grounded===false||Math.abs(p.vz||0)>.1||(p.jumpHeight||0)>0,
    hit:p.knock>0||(p.hitUntil||0)>t,firing:!!p.input?.fire,time:t,scale:cfg.spriteScale*.26});
  drawGloveWindup(g,p,t,cfg,"raptor");
  return;
 }
 const visual=coverVisualOffset(p);g.save();g.translate(visual.x,visual.y);
 if((p.hitUntil||0)>t){g.filter="brightness(1.35) saturate(.85)";} // Reaction must not displace the registered body through a wall.

 if(p.coverId&&p.coverMode==="soft"){
  const sc=softCoverState(p,t),impact=Math.max(0,Math.min(1,p.softImpact||0));
  // One-knee language from approved current-production cover cells: lower silhouette,
  // stronger direct-impact compression, subtle mobile lean. Gameplay root is untouched.
  const low=sc==="SOFT_CAPTURE"?4.5+impact*4:sc==="SOFT_READY"?5.5:3.2;
  // Registered cover frames already contain the crouch; do not sink the root.
  if(p.coverAnchor&&(sc==="SOFT_FLOW_L"||sc==="SOFT_FLOW_R"))g.translate(p.coverAnchor.tx*Math.sign(p.coverSpeed||1)*1.5,p.coverAnchor.ty*Math.sign(p.coverSpeed||1)*1.5);
 }
 const impact=coverCaptureBridge(p,t);if(impact&&p.coverAnchor){
  if(impact.compression)g.translate(-p.coverAnchor.nx*impact.compression*2.4,-p.coverAnchor.ny*impact.compression*2.4);
  // B03 planted rise is visual only and remains inside the authoritative .22s contact window.
  if(impact.rise)g.translate(p.coverAnchor.nx*impact.rise*.65,p.coverAnchor.ny*impact.rise*.65-impact.rise*1.1);
 }
const speed=Math.hypot(p.vx||0,p.vy||0),family=p.coverId?"cover":p.slide>0||p.pinball>0||p.knock>.32?"slide":speed>34?"run":"ready",angle=spriteFacing(p,family,speed),rawDir=((Math.round(angle/(Math.PI*2)*24)%24)+24)%24,d=p.coverId&&p.coverMode==="braced"&&p.input?.coverAim?supportedCoverDir(p):rawDir,im=safestSprite(family,d);const continuity=actorContinuity(p,family,d,t);if(continuity.y)g.translate(0,continuity.y);
 let bridge=impact,renderFamily=family,renderIm=im;
 if(bridge?.kind==="slide"){renderFamily="slide";renderIm=safestSprite("slide",rawDir)}
 else if(bridge?.kind==="cover"){renderFamily="cover";renderIm=safestSprite("cover",rawDir)}
 const meta=renderIm?spriteCell(renderIm,renderFamily,0):{cell:125,cols:1,rows:1,frames:1,sx:0,sy:0},frames=meta.frames;
 let frame=bridge?.kind==="cover"?Math.min(frames-1,bridge.frame):bridge?.kind==="slide"?Math.min(frames-1,Math.max(0,Math.floor(bridge.phase*frames))):family==="cover"?coverPoseFrame(p,t,frames):family==="ready"?0:Math.floor(t*(family==="run"?10:7))%frames;
 if(!bridge&&family==="slide"&&p.slide>0)frame=Math.min(frames-1,Math.max(0,Math.floor((1-p.slide/cfg.slideDuration)*frames)));const sc=cfg.spriteScale,displayCell=125,registration=spriteRegistration(family);
 g.fillStyle="#0008";g.beginPath();g.ellipse(p.x,p.y+6*DECK_PITCH,25*sc,8*sc*DECK_PITCH,0,0,Math.PI*2);g.fill();if(p.shield){g.strokeStyle=p.local30?"#65f4f2":"#ff82c2";g.shadowColor=g.strokeStyle;g.shadowBlur=18;g.lineWidth=4;g.beginPath();g.ellipse(p.x,p.y-34*sc,38*sc,55*sc,0,0,Math.PI*2);g.stroke();g.shadowBlur=0}const aura=powerAura(p);g.save();if(aura>0){g.shadowColor="#ff37b8";g.shadowBlur=18*aura;g.strokeStyle=`rgba(255,65,180,${aura*.7})`;g.lineWidth=2;g.beginPath();g.ellipse(p.x,p.y-(40+powerHover(p))*sc,32*sc,57*sc,0,0,Math.PI*2);g.stroke()}const alpha=powerPoseAlpha(p),hasPower=powerAssets.has("grounded-float-v1")||powerAssets.has(powerFrame(p,cfg)<6?"opening":"continuation"),poseAlpha=hasPower?alpha:0;
 const splitCover=poseAlpha===0&&p.coverId&&p.coverMode==="braced"&&Math.abs(p.coverSpeed||0)>20&&!!(p.input?.coverAim||p.fireState>0||p.recoil>0||p.returnToCover>0);
 if(splitCover&&renderIm){const lm=spriteCell(renderIm,renderFamily,frame),lr=spriteRegistration(renderFamily);g.save();g.beginPath();g.rect(-1e4,p.y-31,2e4,1e4);g.clip();g.drawImage(renderIm,lm.sx,lm.sy,lm.cell,lm.cell,p.x-displayCell*lr.groundAnchor.x*sc,p.y-displayCell*lr.groundAnchor.y*sc,displayCell*sc,displayCell*sc);g.restore()}
 const meleeArt=poseAlpha===0&&drawMelee38Pose(g,p,t,cfg);
 const packBrake=!meleeArt&&poseAlpha===0&&drawPack03Brake(g,p,cfg);
 const packAim=!meleeArt&&!packBrake&&poseAlpha===0&&drawPack03Aim(g,p,cfg);
 const packRetract=!meleeArt&&!packBrake&&!packAim&&poseAlpha===0&&drawPack03Retract(g,p,cfg);
 const exposure=!meleeArt&&!packBrake&&!packAim&&!packRetract&&poseAlpha===0&&(drawCoverNeighbor(g,p,cfg,splitCover)||drawCoverExposure(g,p,cfg,splitCover));
 const connector=meleeArt||packBrake||packAim||packRetract||exposure||poseAlpha===0&&drawCoverConnector(g,p,cfg,splitCover);
 const psychic=!connector&&poseAlpha===0&&drawPsychicPose(g,p,t,cfg);
 if(!connector&&!psychic&&renderIm&&poseAlpha<1){const m=spriteCell(renderIm,renderFamily,frame);g.globalAlpha=1-poseAlpha;g.imageSmoothingEnabled=true;g.imageSmoothingQuality="high";(()=>{const paint=()=>g.drawImage(renderIm,m.sx,m.sy,m.cell,m.cell,p.x-displayCell*spriteRegistration(renderFamily).groundAnchor.x*sc,p.y-displayCell*spriteRegistration(renderFamily).groundAnchor.y*sc,displayCell*sc,displayCell*sc);if(family!=="run"||p.shield||p.gripCoverId||p.gripId||p.charging){paint();return;}const key=p.id||p.name,travel=Math.atan2(p.vy,p.vx),prev=turnVisual.get(key)||{angle:travel,at:t,bank:0},dt=Math.max(0,Math.min(.05,t-prev.at)),rate=dt>.001?angleDelta(travel,prev.angle)/dt:0,target=Math.max(-.035,Math.min(.035,rate*.007))*Math.min(1,speed/222.7),bank=prev.bank+(target-prev.bank)*(1-Math.exp(-12*dt));turnVisual.set(key,{angle:travel,at:t,bank});const waist=p.y-25*sc;g.save();g.beginPath();g.rect(-1e4,waist,2e4,1e4);g.clip();paint();g.restore();g.save();g.beginPath();g.rect(-1e4,-1e4,2e4,1e4+waist);g.clip();g.translate(p.x,waist);g.rotate(bank);g.translate(-p.x,-waist);paint();g.restore();})()}else if(!connector&&!psychic&&!im&&!poseAlpha){presentationQA.missingExact++}
 if(poseAlpha>0){g.globalAlpha=poseAlpha;drawPowerPose(g,p,cfg)}g.globalAlpha=1;drawGloveWindup(g,p,t,cfg,"jade");g.restore();
 drawPlantPunctuation(g,p,t);g.strokeStyle=p.local30?"#65efff":"#ff69bd";g.lineWidth=2;g.beginPath();if(p.local30){g.ellipse(p.x,p.y+5*DECK_PITCH,25,8*DECK_PITCH,0,0,Math.PI*2);}else{g.moveTo(p.x-27,p.y+5*DECK_PITCH);g.lineTo(p.x,p.y-5*DECK_PITCH);g.lineTo(p.x+27,p.y+5*DECK_PITCH);g.lineTo(p.x,p.y+15*DECK_PITCH);g.closePath();}g.stroke();g.restore()}
// Structure Lab concrete-cover-atlas-v2: original face registration, not replacement artwork.
type CoverPoint={x:number;y:number};
const CONCRETE_FACES:Record<string,number[][]>={
 front:[[45,58,240,106],[351,59,240,105],[657,96,237,98]],
 back:[[43,250,243,109],[351,251,240,109],[657,292,237,98]],
 top:[[43,435,236,33],[353,436,233,32],[656,440,234,34]],
 left:[[66,549,46,108],[360,550,48,107],[673,551,48,107]],
 right:[[220,549,44,108],[529,549,46,109],[825,550,45,106]]
};
function concreteFace(g:CanvasRenderingContext2D,im:HTMLImageElement|undefined,crop:number[],points:CoverPoint[],fill:string){
 const path=()=>{g.beginPath();points.forEach((p,n)=>n?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.closePath()};
 path();g.fillStyle=fill;g.fill();
 if(im?.complete&&im.naturalWidth){const [x,y,w,h]=crop,[a,b,,d]=points;g.save();path();g.clip();g.transform((b.x-a.x)/w,(b.y-a.y)/w,(d.x-a.x)/h,(d.y-a.y)/h,a.x,a.y);g.drawImage(im,x,y,w,h,0,0,w,h);g.restore()}
 path();g.strokeStyle="#070a0e";g.lineWidth=2.5;g.stroke();
}
// Ground44: shallow scars and three recognizable production fragments; no extra particles.
// Golden Cover 18: presentation-only cyclone, independent of authoritative cover collision.
// Build 19: source-linked cyclone; fragments move from the actual reserved cells
// to the authoritative cover object. Visuals do not mint additional physical matter.
function drawKineticCyclone18(g:CanvasRenderingContext2D,s:any){
 for(const cv of s.covers||[]){
  if(!cv.generated||cv.born===undefined||!cv.assembly44?.length)continue;
  const age=s.time-cv.born;if(age<0||age>.28)continue;
  const u=Math.max(0,Math.min(1,age/.28)),ease=u*u*(3-2*u);
  g.save();
  for(let k=0;k<Math.min(12,cv.assembly44.length*3);k++){
   const source=cv.assembly44[k%cv.assembly44.length];
   const sx=source.originX??cv.x,sy=source.originY??cv.y;
   const spin=u*Math.PI*4+k*2.399,rad=(1-u)*28;
   const x=sx+(cv.x-sx)*ease+Math.cos(spin)*rad;
   const y=sy+(cv.y-sy)*ease+Math.sin(spin)*rad*.6-(1-u)*14;
   g.save();g.translate(x,y);g.rotate(spin);
   g.globalAlpha=Math.min(1,(1-u)*1.8+.12);
   g.fillStyle=source.kind==="metal"?"#b5c8cf":k%3===0?"#7dd9e2":"#92949a";
   g.fillRect(-5,-3,10,6);g.restore();
  }
  g.save();g.translate(cv.x,cv.y);g.strokeStyle="#6de7f0";
  g.globalAlpha=(1-u)*.7;g.lineWidth=2;g.beginPath();
  g.ellipse(0,0,23+(1-u)*25,12+(1-u)*15,u*3,0,Math.PI*2);g.stroke();g.restore();
  g.restore();
 }
}
// Dimension 33 reference-map architectural pass: world-registered decoration.
// No new collisions, elevation rules, or visibility cheats; those require separate QA.
// Dimension 33 playable environment slice: architectural surfaces registered to world.
// Visual geometry is separated from authoritative collision until verified.
function drawDimension33Architecture(g:CanvasRenderingContext2D){
 // Only registered out-of-bounds backdrop assets; obsolete decorative platforms removed.
 drawMapArchitecture20(g,environmentAssets);
}

function drawGround44(g:CanvasRenderingContext2D,s:any){
 for(const source of s.groundSources44||[])withWorld46(g,source.x,source.y,()=>{
  if(source.id?.startsWith("floor15-")&&source.remaining!==source.initial){
   g.save();g.translate(source.x,source.y);g.strokeStyle=source.remaining===source.initial?"#6d7c8838":"#ef6ea0bb";
   g.lineWidth=source.remaining===source.initial?.65:1.6;
   g.strokeRect(-38,-26,76,52);g.restore();
  }
  drawGroundSource46(g,source,s);
 });
}
function drawGroundSource46(g:CanvasRenderingContext2D,source:any,s:any){
 if(source.panel46){g.save();g.translate(source.x,source.y);g.lineWidth=1;
  if(source.remaining===source.initial){g.restore();return;}
  else{g.fillStyle="#171921";g.fillRect(-40,-27,80,54);g.fillStyle="#49434b";g.fillRect(-37,-19,74,43);g.fillStyle="#11141a";g.fillRect(-40,-27,80,8);g.strokeStyle="#8c7974";g.strokeRect(-40,-27,80,54);g.strokeStyle="#9a8781";for(const x of [-25,0,25]){g.beginPath();g.moveTo(x,-25);g.lineTo(x+3,-14);g.stroke();}g.strokeStyle="#26212c";g.beginPath();g.moveTo(-33,13);g.lineTo(-6,-6);g.lineTo(17,7);g.lineTo(31,-12);g.stroke();}
  g.restore();return;}
 if(source.remaining===source.initial)return;const age=Math.max(0,s.time-(source.peeledAt??-9));g.save();g.translate(source.x,source.y);g.rotate(source.angle||0);g.fillStyle="#11141ccd";g.strokeStyle=age<.24?"#91dfe6":"#565963";g.lineWidth=1;g.beginPath();g.moveTo(-24,-11);g.lineTo(18,-14);g.lineTo(27,5);g.lineTo(12,13);g.lineTo(-21,10);g.closePath();g.fill();g.stroke();g.strokeStyle="#8a858466";g.beginPath();g.moveTo(-20,8);g.lineTo(12,11);g.lineTo(23,4);g.stroke();g.restore();}
function floorTexture46(g:CanvasRenderingContext2D,c:any,points:CoverPoint[]){
 const im=getFloorImage20(environmentAssets)||environmentAssets.get("war-foundation45");if(!im||!('naturalWidth' in im?im.naturalWidth:im.width))return;
 const origin=c.floorPanel46,uv=[[-40,-27],[40,-27],[40,27],[-40,27]].map(([x,y])=>arenaPoint46(origin.originX+x,origin.originY+y));
 for(const ids of [[0,1,2],[0,2,3]]){const [a,b,d]=ids.map(i=>uv[i]),[A,B,D]=ids.map(i=>points[i]),det=(b.x-a.x)*(d.y-a.y)-(d.x-a.x)*(b.y-a.y),xx=((B.x-A.x)*(d.y-a.y)-(D.x-A.x)*(b.y-a.y))/det,xy=((D.x-A.x)*(b.x-a.x)-(B.x-A.x)*(d.x-a.x))/det,yx=((B.y-A.y)*(d.y-a.y)-(D.y-A.y)*(b.y-a.y))/det,yy=((D.y-A.y)*(b.x-a.x)-(B.y-A.y)*(d.x-a.x))/det;
  g.save();g.beginPath();[A,B,D].forEach((p,n)=>n?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.closePath();g.clip();g.transform(xx,yx,xy,yy,A.x-xx*a.x-xy*a.y,A.y-yx*a.x-yy*a.y);g.drawImage(im,0,0);g.restore();}
 g.strokeStyle="#14151c";g.lineWidth=1;g.beginPath();points.forEach((p,n)=>n?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.closePath();g.stroke();
}
function drawAssembly44(g:CanvasRenderingContext2D,c:any,t:number,z:number){const q=classicClamp((t-c.born)/.24,0,1),ease=1-Math.pow(1-q,3);for(const [n,source] of c.assembly44.entries()){const x=(source.originX-c.x)*(1-ease)+(n-1)*c.w*.24*ease,y=(source.originY-c.y)*(1-ease)+c.h*.65*ease;g.save();g.globalAlpha=(1-q)*.95;withUpright(g,x,y,()=>matter(g,{...source,x,y,r:14,spin:q*Math.PI*2+n,heldBy:null,orbitBy:null,height:Math.sin(q*Math.PI)*10}));g.restore();}}
function drawStamp44(g:CanvasRenderingContext2D,c:any,points:CoverPoint[]){if(c.stamp44===undefined)return;const [a,b,,d]=points;g.save();g.globalAlpha*=c.stampPhase44??1;g.beginPath();points.forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.closePath();g.clip();g.transform((b.x-a.x)/32,(b.y-a.y)/32,(d.x-a.x)/22,(d.y-a.y)/22,a.x,a.y);g.lineJoin="round";g.lineWidth=2;g.strokeStyle="#080c12";g.beginPath();g.moveTo(5,3);g.lineTo(27,3);g.lineTo(30,10);g.lineTo(24,18);g.lineTo(8,18);g.lineTo(2,10);g.closePath();g.stroke();g.translate(.6,-.6);g.lineWidth=1;g.strokeStyle=c.stamp44===0?"#5ef3f2":"#ff69b6";g.stroke();g.beginPath();g.moveTo(8,8);g.lineTo(24,8);g.lineTo(21,12);g.lineTo(11,12);g.closePath();g.stroke();g.beginPath();g.moveTo(16,12);g.lineTo(16,17);g.stroke();const stage=coverDamageStage(c.hp,c.maxHp);if(stage){g.strokeStyle="#14171e";g.lineWidth=1.4;g.beginPath();g.moveTo(9,0);g.lineTo(12,7);g.lineTo(10,13);g.lineTo(17,22);g.stroke();}g.restore();}
function environmentActorAtlas(g:CanvasRenderingContext2D,c:any,meta:any,z:number,w:number,h:number,project:(x:number,y:number,height:number)=>{x:number;y:number}){
 const material21=coverMaterial21(environmentAssets,c);let im=material21?.image||environmentAssets.get(meta?.renderedShell);if(!meta?.rig)return;
 const textured=!!(im?.complete&&im.naturalWidth&&im.naturalHeight);
 const cellW=textured?im!.naturalWidth/3:256,cellH=textured?im!.naturalHeight/2:128;
 const ribs=meta.rig.ribs,co=Math.cos(c.a||0),si=Math.sin(c.a||0);
 // Fixed object-space UVs. Each rib panel projects the same material coordinates
 // at every angle; two affine triangles handle sloped/irregular quadrilaterals.
 const triangle=(src:CoverPoint[],dst:CoverPoint[])=>{
  const [a,b,d]=src,[A,B,D]=dst,ux=b.x-a.x,uy=b.y-a.y,vx=d.x-a.x,vy=d.y-a.y,det=ux*vy-uy*vx;
  if(Math.abs(det)<1e-6)return;
  const xx=((B.x-A.x)*vy-(D.x-A.x)*uy)/det,xy=((D.x-A.x)*ux-(B.x-A.x)*vx)/det;
  const yx=((B.y-A.y)*vy-(D.y-A.y)*uy)/det,yy=((D.y-A.y)*ux-(B.y-A.y)*vx)/det;
  g.save();g.beginPath();dst.forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.closePath();g.clip();
  if(textured){g.transform(xx,yx,xy,yy,A.x-xx*a.x-xy*a.y,A.y-yx*a.x-yy*a.y);const left=Math.max(0,Math.min(...src.map(p=>p.x))),top=Math.max(0,Math.min(...src.map(p=>p.y))),right=Math.min(im!.naturalWidth,Math.max(...src.map(p=>p.x))),bottom=Math.min(im!.naturalHeight,Math.max(...src.map(p=>p.y)));
   if(right>left&&bottom>top)g.drawImage(im!,left,top,right-left,bottom-top,left,top,right-left,bottom-top)}
  else{g.fillStyle=meta.material==="CONCRETE"?"#777c82":meta.material==="VEHICLE"?"#59465b":"#4b6071";g.fill()}
  g.restore();
 };
 const panel=(col:number,row:number,u0:number,u1:number,pts:CoverPoint[],v0=0,v1=1,farTop=v0)=>{
  if(material21)im=material21.imageFor(col,row);
  const uv=material21?[material21.point(col,row,u0,v0),material21.point(col,row,u1,farTop),material21.point(col,row,u1,v1),material21.point(col,row,u0,v1)]:[{x:(col+u0)*cellW,y:(row+v0)*cellH},{x:(col+u1)*cellW,y:(row+farTop)*cellH},{x:(col+u1)*cellW,y:(row+v1)*cellH},{x:(col+u0)*cellW,y:(row+v1)*cellH}];
  triangle([uv[0],uv[1],uv[2]],[pts[0],pts[1],pts[2]]);triangle([uv[0],uv[2],uv[3]],[pts[0],pts[2],pts[3]]);
  // Stable object-space fractures: no animation jitter, no collision holes.
  const damage=coverDamageStage(c.hp,c.maxHp);
  if(damage>0){g.save();g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.closePath();g.clip();
   const point=(u:number,v:number)=>({x:(1-v)*(pts[0].x+(pts[1].x-pts[0].x)*u)+v*(pts[3].x+(pts[2].x-pts[3].x)*u),y:(1-v)*(pts[0].y+(pts[1].y-pts[0].y)*u)+v*(pts[3].y+(pts[2].y-pts[3].y)*u)});
   g.lineJoin="round";g.strokeStyle="#11131a";g.lineWidth=.45+damage*.15;
   for(let k=0;k<damage;k++){const u=.2+k*.27;g.beginPath();for(let n=0;n<5;n++){const p=point(u+(n%2?.045:-.03),.12+k*.04+n*.17);n?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y);}g.stroke();const a=point(u,.46),b=point(u+.15,.64);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke();}
   g.fillStyle="#060c16";g.globalAlpha=.18+damage*.07;for(let k=0;k<damage;k++){const p=point(.18+k*.29,.2+k*.19);g.beginPath();g.moveTo(p.x-3,p.y-2);g.lineTo(p.x+5,p.y);g.lineTo(p.x,p.y+4);g.closePath();g.fill();}g.restore();
  }
  // Restrained plane lighting follows the projected shell, preserving painted ink.
  g.save();g.globalAlpha=col===0&&row===0?.055:.08;g.fillStyle=col===0&&row===0?"#ffc58d":"#17283e";
  g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.closePath();g.fill();g.restore();
 };
 const side=co>=0?1:-1,col=side>0?1:2;
 for(let n=0;n<ribs.length-1;n++){
  const a=ribs[n],b=ribs[n+1],xa=-w/2+w*a.t,xb=-w/2+w*b.t,ya=side*Math.min(h*.5,a.width*.5),yb=side*Math.min(h*.5,b.width*.5),za=Math.min(z,a.height),zb=Math.min(z,b.height);
  panel(col,0,a.t,b.t,[project(xa,ya,za),project(xb,yb,zb),project(xb,yb,0),project(xa,ya,0)],1-za/z,1,1-zb/z);
 }
 // Small amber fixtures belong to the face, not an enlarged painted roof.
 // Their six-by-three world-unit footprint stays constant on every cover size.
 if(meta.material==='CONCRETE')for(const lx of [-w*.30,w*.30]){
  const yy=side*h*.48,zz=z*.78;
  const lamp=[project(lx-3,yy,zz+1.5),project(lx+3,yy,zz+1.5),project(lx+3,yy,zz-1.5),project(lx-3,yy,zz-1.5)];
  g.save();g.fillStyle='#ffad43';g.strokeStyle='#191c22';g.lineWidth=1;
  g.beginPath();lamp.forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.closePath();g.fill();g.stroke();g.restore();
 }
 const sy=side*h*.5;drawStamp44(g,c,[project(-w*.16,sy,z*.70),project(w*.16,sy,z*.70),project(w*.16,sy,z*.26),project(-w*.16,sy,z*.26)]);
 const r=si>=0?ribs[ribs.length-1]:ribs[0],x=-w/2+w*r.t,y=Math.min(h*.5,r.width*.5),height=Math.min(z,r.height);
 panel(si>=0?1:0,1,0,1,[project(x,-y,height),project(x,y,height),project(x,y,0),project(x,-y,0)]);
 for(let n=0;n<ribs.length-1;n++){
  const a=ribs[n],b=ribs[n+1],xa=-w/2+w*a.t,xb=-w/2+w*b.t,ya=Math.min(h*.5,a.width*.5),yb=Math.min(h*.5,b.width*.5);
  panel(0,0,a.t,b.t,[project(xa,-ya,Math.min(z,a.height)),project(xb,-yb,Math.min(z,b.height)),project(xb,yb,Math.min(z,b.height)),project(xa,ya,Math.min(z,a.height))]);
  // Preserve the approved painted cap/lights only along a narrow trim band.
  // The remaining roof stays a broad flat material, so bevels cannot balloon.
  if(material21){
   im=material21.image;
   const trim=Math.min(3,h*.12),za=Math.min(z,a.height),zb=Math.min(z,b.height);
   const dst=[project(xa,side*(ya-trim),za),project(xb,side*(yb-trim),zb),project(xb,side*yb,zb),project(xa,side*ya,za)];
   const uv=[material21.trimPoint(a.t,0),material21.trimPoint(b.t,0),material21.trimPoint(b.t,1),material21.trimPoint(a.t,1)];
   triangle([uv[0],uv[1],uv[2]],[dst[0],dst[1],dst[2]]);triangle([uv[0],uv[2],uv[3]],[dst[0],dst[2],dst[3]]);
  }
 }
 // Manga contour weights stay consistent on screen: deck pitch must not flatten the ink.
 // Trace the existing rib shell, with a heavier silhouette and finer roof/side seam.
 const contour=(points:CoverPoint[],weight:number)=>{
  g.save();g.strokeStyle="#080b10";g.lineJoin="round";g.lineCap="round";
  let path=points;
  if(typeof g.getTransform==="function"){
   const m=g.getTransform(),canvas=g.canvas as HTMLCanvasElement,ratio=canvas.width/(canvas.clientWidth||canvas.width);
   path=points.map(p=>({x:(m.a*p.x+m.c*p.y+m.e)/ratio,y:(m.b*p.x+m.d*p.y+m.f)/ratio}));
   g.setTransform(ratio,0,0,ratio,0,0);
  }
  g.lineWidth=weight;g.beginPath();path.forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.stroke();g.restore();
 };
 const roofEdge=(sign:number)=>ribs.map((r:any)=>project(-w/2+w*r.t,sign*Math.min(h*.5,r.width*.5),Math.min(z,r.height)));
 const groundEdge=ribs.map((r:any)=>project(-w/2+w*r.t,side*Math.min(h*.5,r.width*.5),0));
 contour(roofEdge(-side),2.4);contour(roofEdge(side),1.7);contour(groundEdge,2.4);
 contour([project(x,-y,height),project(x,-y,0),project(x,y,0),project(x,y,height)],2.4);
}
function environmentActorInk(g:CanvasRenderingContext2D,c:any,meta:any,z:number,w:number,h:number,project:(x:number,y:number,height:number)=>{x:number;y:number}){
 if(!meta)return;
 // Detailed ink is authored into the atlas. Only the rig envelope and grounding
 // remain procedural, avoiding duplicate windows, cracks and rectangular outlines.
 const rp=project(0,h/2,0);g.save();g.globalCompositeOperation="lighter";g.globalAlpha=.1;
 g.fillStyle=meta.material==="VEHICLE"?"#ff4f9b":meta.material==="STEEL"?"#61efff":"#d8a17b";
 g.beginPath();g.ellipse(rp.x,rp.y+5,w*.34,Math.max(2,h*.12),c.a||0,0,Math.PI*2);g.fill();g.restore();
}
const coverCache46=new Map<string,{canvas:HTMLCanvasElement;x:number;y:number;w:number;h:number}>();
function cover(g:CanvasRenderingContext2D,c:any,t:number,lights:{x:number;y:number;strength:number;color:string}[]=[]){if(c.anchored27j||c.section27j||c.height27j){drawSection27j(g,c,t,environmentAssets);return;}g.save();const lift=vertical46(c.x,c.y,c.z||0);g.translate(lift.x,lift.y);coverGround27h(g,c,t,lights);g.restore();}
function coverGround27h(g:CanvasRenderingContext2D,c:any,t:number,lights:{x:number;y:number;strength:number;color:string}[]=[]){
 // Cache only intact, settled scenery. Held/damaged/forming/lit structures retain
 // their live renderer. Bound the cache; never cache an authoritative game object.
 if(typeof document!=="undefined"&&!c.generated&&!c.floorPanel46&&!c.psychicHeld&&c.build===0&&!(c.hover>.1)&&c.hp===c.maxHp&&!lights.length){
  const key=[c.artId||c.id,c.x,c.y,c.w,c.h,c.a,c.hp,c.stamp44,artRevision20(environmentAssets),environmentAssets.get(D33_BARRIER_A20.key)?.naturalWidth||0,environmentAssets.get(bayObject(c.artId||c.id)?.renderedShell||'')?.naturalWidth||0].join('/');let hit=coverCache46.get(key);
  if(!hit){const z=bayObject(c.artId||c.id)?.dimensions.z||COVER_HEIGHT,v=vertical46(c.x,c.y,z),r=Math.hypot(c.w,c.h)*.65,x=-r-Math.abs(v.x)-16,y=-r+v.y-16,w=(r+Math.abs(v.x)+16)*2,h=r*2-v.y+40,canvas=document.createElement('canvas');canvas.width=Math.ceil(w*2);canvas.height=Math.ceil(h*2);const cg=canvas.getContext('2d')!;cg.setTransform(2,0,0,2,-(c.x+x)*2,-(c.y+y)*2);coverUncached46(cg,c,t,lights);hit={canvas,x,y,w:canvas.width/2,h:canvas.height/2};if(coverCache46.size>=32)coverCache46.delete(coverCache46.keys().next().value!);coverCache46.set(key,hit);}
  g.drawImage(hit.canvas,c.x+hit.x,c.y+hit.y,hit.w,hit.h);return;
 }
 coverUncached46(g,c,t,lights);
}
function coverUncached46(g:CanvasRenderingContext2D,c:any,t:number,lights:{x:number;y:number;strength:number;color:string}[]=[]){
 // Use one rig/material path for every physical state. Build 20 cutouts remain
 // recoverable fallbacks when the registered face material cannot load.
 if(!coverMaterial21(environmentAssets,c)){
 if(drawMapCover20(g,environmentAssets,c))return;
 const barrier20=environmentAssets.get(D33_BARRIER_A20.key);
 if(barrier20?.complete&&barrier20.naturalWidth&&usesBarrierA20(c)){
  const co=Math.cos(c.a||0),si=Math.sin(c.a||0),z=bayObject(c.artId||c.id)?.dimensions.z||COVER_HEIGHT;
  drawBarrierA20(g,barrier20,c,z,(x,y,height)=>{const r=relativeWorld46(c.x,c.y,x*co-y*si,x*si+y*co),v=vertical46(c.x,c.y,height);return{x:c.x+r.x+v.x,y:c.y+r.y+v.y};});
  return;
 }
 // Rotation is applied to the ground footprint; elevation stays vertical.
 // The lab's camera projection is already represented by this build's world coordinates.
 // Art integration preview: reuse authoritative collision, show approved source cutout only
 // on the four primary concrete covers. Damaged/held objects keep their live renderer.
 const preview=environmentAssets.get("d33-cover-preview");
 if(preview?.complete&&preview.naturalWidth&&/^d33-(?:nw|ne|sw|se)-primary$|^d33-(?:north|south)-(?:west|east)-step$|^d33-center-(?:nw|ne|sw|se)$|^d33-(?:west|east)-(?:north|south)-flank$/.test(c.id)&&c.hp>0&&!c.psychicHeld){
  g.save();g.translate(c.x,c.y);g.rotate(c.a||0);
  const artW=c.w,artH=artW*64/86;
  const ratio=c.hp/Math.max(1,c.maxHp);
  // Damage retains original game authority; tint/scars signal wear, not extra collision.
  g.globalAlpha=ratio<.35?.72:1;
  g.drawImage(preview,-artW/2,-artH+8,artW,artH);
  if(ratio<.875){
   g.strokeStyle=ratio<.375?"#16171c":"#2b2b30";g.lineWidth=ratio<.375?2.5:1.5;
   g.beginPath();g.moveTo(-artW*.2,-artH*.7);g.lineTo(-artW*.08,-artH*.43);g.lineTo(artW*.07,-artH*.52);g.lineTo(artW*.19,-artH*.2);g.stroke();
  }
  g.restore();return;
 }
 }
 const im=classicAssets.get("concrete"),meta=bayObject(c.artId||c.id),material=meta?.material||"CONCRETE",z=meta?.dimensions?.z||COVER_HEIGHT,w=c.w,h=c.h,co=Math.cos(c.a||0),si=Math.sin(c.a||0);
 const project=(x:number,y:number,height:number)=>{const r=relativeWorld46(c.x,c.y,x*co-y*si,x*si+y*co),v=vertical46(c.x,c.y,height);return{x:r.x+v.x,y:r.y+v.y};};
 const footprint=[[-w/2,-h/2],[w/2,-h/2],[w/2,h/2],[-w/2,h/2]];
 const ground=footprint.map(([x,y])=>project(x,y,0)),top=footprint.map(([x,y])=>project(x,y,z));
 const stage=c.hp/c.maxHp>=.875?0:c.hp/c.maxHp>=.375?1:2;
 const damageStage=coverDamageStage(c.hp,c.maxHp);
 const formation=c.generated&&typeof c.born==="number"?classicClamp((t-c.born)/(c.assembly44?.length?.24:.72),0,1):1;
 g.save();g.translate(c.x,c.y);
 g.fillStyle="#03060a66";g.beginPath();g.ellipse(5,9,w*.56,h*.64,c.a||0,0,Math.PI*2);g.fill();
 if(c.build<0&&Math.hypot(c.vx||0,c.vy||0)>240){const a=Math.atan2(c.vy||0,c.vx||0);g.save();g.globalAlpha=.38;g.strokeStyle="#f29dde";g.lineWidth=1.2;for(const side of [-1,1]){g.beginPath();g.moveTo(-Math.cos(a)*w*.2-Math.sin(a)*side*h*.25,-Math.sin(a)*w*.2+Math.cos(a)*side*h*.25);g.lineTo(-Math.cos(a)*(w*.2+22)-Math.sin(a)*side*h*.25,-Math.sin(a)*(w*.2+22)+Math.cos(a)*side*h*.25);g.stroke();}g.restore();}
 g.fillStyle="#020408aa";g.beginPath();ground.forEach((p,i)=>i?g.lineTo(p.x,p.y+3):g.moveTo(p.x,p.y+3));g.closePath();g.fill();
 const lift=Math.max(0,Math.min(12,c.hover||0)),lift46=vertical46(c.x,c.y,lift);g.translate(lift46.x,lift46.y);
 if(c.psychicHeld){g.save();g.strokeStyle="#74e5ef";g.shadowColor="#ee70b8";g.shadowBlur=5;g.lineWidth=2;g.beginPath();ground.forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.closePath();g.stroke();g.restore()}
 const pal=material==="STEEL"?["#242b35","#4c5966","#1e2630","#5e6c78","#697682"]:material==="VEHICLE"?["#251d2a","#493248","#211b27","#5d3c55","#6b455d"]:material==="INFRASTRUCTURE"?["#24282c","#4b5155","#202529","#596166","#687075"]:["#343b40","#454c51","#30383d","#697176","#899196"];
 const sides=[
  {kind:"back",p:[top[0],top[1],ground[1],ground[0]],fill:pal[0]},
  {kind:"right",p:[top[1],top[2],ground[2],ground[1]],fill:pal[1]},
  {kind:"left",p:[top[0],top[3],ground[3],ground[0]],fill:pal[2]},
  {kind:"front",p:[top[3],top[2],ground[2],ground[3]],fill:pal[3]}
 ];
 sides.sort((a,b)=>a.p.reduce((sum,p)=>sum+p.y,0)-b.p.reduce((sum,p)=>sum+p.y,0));
 if(formation<1&&!c.assembly44?.length){g.globalAlpha=Math.max(.07,formation*.85);g.filter=`blur(${Math.round((1-formation)*5)}px)`}
 if(meta){
  // Production Bay actors: invisible cuboid collision, visible rig-derived illustrated shell.
  environmentActorAtlas(g,c.assembly44?.length?{...c,stampPhase44:classicClamp((formation-.55)/.45,0,1)}:c,meta,z,w,h,project);g.filter="none";g.globalAlpha=1;g.shadowBlur=0;environmentActorInk(g,c,meta,z,w,h,project);
  if(c.floorPanel46){floorTexture46(g,c,top);g.strokeStyle="#262330";g.lineWidth=2;for(const x of [-25,0,25]){const a=project(x,h/2,3),b=project(x+3,h/2+5,1);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke();g.strokeStyle="#a5988e";g.lineWidth=.6;g.stroke();g.strokeStyle="#262330";g.lineWidth=2;}}
 }else{
  // Generated/legacy cover retains the proven concrete shell.
  for(const face of sides)concreteFace(g,im,CONCRETE_FACES[face.kind][stage],face.p,face.fill);
  concreteFace(g,im,CONCRETE_FACES.top[stage],top,pal[4]);g.filter="none";g.globalAlpha=1;g.shadowBlur=0;
  g.strokeStyle="#111a20";g.lineWidth=1.25;g.fillStyle="#141e23";
  for(const fraction of [-.48,.48]){const a=project(w/2*fraction,-h/2,z+.4),b=project(w/2*fraction,h/2,z+.4);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke()}
  for(const side of [-1,1])for(const fraction of [-.73,.73]){const p=project(w/2*fraction,side*h/2*.7,z+1);g.beginPath();g.arc(p.x,p.y,1.8,0,Math.PI*2);g.fill();g.strokeStyle="#9caeb2";g.lineWidth=.55;g.stroke()}
 }
 // Light only the rig-derived surface facing the source. At most four sources/frame.
 if(meta)for(const light of lights){const dx=light.x-c.x,dy=light.y-c.y,dist=Math.hypot(dx,dy);if(dist>170)continue;
  const sign=(-dx*si+dy*co)>=0?1:-1,ribs=meta.rig.ribs,edge=ribs.map(r=>project(-w/2+w*r.t,sign*Math.min(h*.5,r.width*.5),Math.min(z,r.height))),base=ribs.map(r=>project(-w/2+w*r.t,sign*Math.min(h*.5,r.width*.5),0));
  g.save();g.globalCompositeOperation="screen";g.globalAlpha=light.strength*(1-dist/170)*.22;g.fillStyle=light.color;g.beginPath();[...edge,...base.reverse()].forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.closePath();g.fill();g.restore();
 }
 if(c.psychicHeld||damageStage>0)withUpright(g,0,0,()=>{g.save();g.fillStyle="#071018cc";g.fillRect(-w*.3,-z-9,w*.6,3);g.fillStyle=c.hp<c.maxHp*.3?"#ff8263":"#67dce9";g.fillRect(-w*.3,-z-9,w*.6*Math.max(0,c.hp/c.maxHp),3);g.restore()});
 if(formation<1&&!c.assembly44?.length&&c.matterSources){c.matterSources.forEach((source:any,n:number)=>{const a=n*Math.PI*2/3+t*2,r=(1-formation)*80;g.save();g.globalAlpha=(1-formation)*.9;matter(g,{...source,x:Math.cos(a)*r,y:-z*.45+Math.sin(a)*r*.4,r:10,heldBy:0,orbitBy:null});g.restore()});}
 if(formation<1&&!c.assembly44?.length)for(let n=0;n<38;n++){const a=n*2.399+t*2,r=(1-formation)*(55+n%6*24)*w/332;g.fillStyle=n%2?"#ff4ca5":"#6af2ff";g.fillRect(Math.cos(a)*r,-z*.55+Math.sin(a)*r*.52,2.4,2.4)}
 if(formation<1&&c.assembly44?.length)drawAssembly44(g,c,t,z);
 g.restore();
}
// Matter42: local cosmetic pool. These chips never enter recipes, collision damage or network state.
type Chip42={x:number;y:number;vx:number;vy:number;z:number;vz:number;r:number;spin:number;spinV:number;family:number;kind:string;life:number;rest:boolean;lastKick:number};
const chips42:Chip42[]=[];let chipScene42="",chipTime42=0;
const chipSeen42=new Set<string>();
function chipHash42(text:string){let h=2166136261;for(let n=0;n<text.length;n++)h=Math.imul(h^text.charCodeAt(n),16777619);return h>>>0;}
function addChip42(chip:Chip42){const slot=chips42.findIndex(c=>c.life<=0);if(slot>=0)chips42[slot]=chip;else if(chips42.length<192)chips42.push(chip);else{const replace=chips42.findIndex(c=>c.life<999);if(replace>=0)chips42[replace]=chip;}}
function chip42(x:number,y:number,kind:string,seed:number,speed=0,persistent=false):Chip42{const angle=(seed%997)/997*Math.PI*2;return{x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,z:0,vz:speed*.4,r:kind==="cyber"?1+seed%3*.4:1.8+seed%3*.6,spin:angle,spinV:speed*.06,family:(kind==="metal"?3:0)+seed%3,kind,life:persistent?999:6,rest:!speed,lastKick:-9};}
function updateChips42(s:any){
 const key=s.createdAt+"/"+s.round+"/"+s.mode;
 if(chipScene42!==key||s.time<chipTime42){chipScene42=key;chipTime42=s.time;chipSeen42.clear();chips42.length=0;
  for(const m of s.matter||[])for(let n=0;n<6;n++){const seed=chipHash42(m.id+":"+n),a=(seed%997)/997*Math.PI*2,r=9+seed%21;addChip42(chip42(m.x+Math.cos(a)*r,m.y+Math.sin(a)*r,m.kind,seed,0,true));}
 }
 const dt=Math.max(0,Math.min(.05,s.time-chipTime42));chipTime42=s.time;
 for(const f of s.fx||[]){if(chipSeen42.has(f.id))continue;chipSeen42.add(f.id);
  const debris=f.type==="cover-break"||f.type==="cover-hit"||f.type==="cover-impact",cyber=f.type==="hit"&&f.material==="cyber";
  if(debris||cyber){const strength=f.strength??1,count=cyber?18:f.type==="cover-break"?30:f.type==='cover-impact'?Math.round(3+9*strength):5;for(let n=0;n<count;n++){const seed=chipHash42(f.id+":"+n),kind=cyber?"cyber":f.text==="metal"?"metal":"stone",chip=chip42(f.x,f.y,kind,seed,(45+seed%100)*(.5+.5*strength));chip.z=f.z||0;if(f.type==='cover-impact'&&Number.isFinite(f.angle)){chip.vx+=Math.cos(f.angle)*45*strength;chip.vy+=Math.sin(f.angle)*45*strength;}addChip42(chip);}}
 }
 if(chipSeen42.size>256){const live=new Set((s.fx||[]).map((f:any)=>f.id));for(const id of chipSeen42)if(!live.has(id))chipSeen42.delete(id);}
 if(!dt)return;
 for(const c of chips42){if(c.life<=0)continue;if(c.life<999)c.life-=dt;
  if(c.kind!=="cyber"&&s.phase==="playing"&&s.time-c.lastKick>.14)for(const p of s.players||[]){if(p.hp<=0||p.coverId||p.knock>0)continue;const speed=Math.hypot(p.vx,p.vy),combo=p.meleeCombo,age=combo?s.time-combo.started:0,kick=combo&&combo.stage%2===1&&age>.1&&age<.24,angle=kick?combo.angle:Math.atan2(p.vy,p.vx),x=p.x+(kick?Math.cos(angle)*28:0),y=p.y+(kick?Math.sin(angle)*28:0);
   if((speed>45||kick)&&Math.hypot(c.x-x,c.y-y)<19+c.r){const force=kick?175:Math.min(190,speed*.5);c.vx=Math.cos(angle)*force;c.vy=Math.sin(angle)*force;c.vz=30;c.spinV=c.kind==="metal"?13:8;c.rest=false;c.lastKick=s.time;break;}
  }
  if(c.rest)continue;
  c.x+=c.vx*dt;c.y+=c.vy*dt;c.vz-=240*dt;c.z+=c.vz*dt;c.spin+=c.spinV*dt;
  if(c.z<0){c.z=0;c.vz=Math.abs(c.vz)*(c.kind==="metal"?.36:.19);if(c.vz<8)c.vz=0;}
  const drag=Math.exp(-(c.kind==="metal"?2.6:4.2)*dt);c.vx*=drag;c.vy*=drag;c.spinV*=drag;
  if(c.x<35||c.x>965){c.x=classicClamp(c.x,35,965);c.vx*=-.35;}if(c.y<70||c.y>570){c.y=classicClamp(c.y,70,570);c.vy*=-.35;}
  if(Math.hypot(c.vx,c.vy)<3&&c.z===0&&c.vz===0){c.vx=c.vy=c.spinV=0;c.rest=true;}
 }
}
function drawChip42(g:CanvasRenderingContext2D,c:Chip42){
 if(c.life<=0)return;
 g.save();g.globalAlpha=c.life<999?Math.min(1,c.life/.8):.85;
 if(c.kind==="cyber"){g.translate(c.x,c.y-c.z/DECK_PITCH);g.rotate(Math.atan2(c.vy,c.vx));g.fillStyle="#512f49";g.beginPath();g.ellipse(0,0,c.r*(c.rest?1.8:1),c.r*.5,0,0,Math.PI*2);g.fill();g.fillStyle="#bbc4d5";g.fillRect(-c.r*.3,-c.r*.3,c.r*.7,.5);}
 else withUpright(g,c.x,c.y,()=>matter(g,{...c,height:c.z,r:c.r,heldBy:null,orbitBy:null,fragment:c.family%3,kind:c.kind,spin:c.spin}));
 g.restore();
}

function matter(g:CanvasRenderingContext2D,m:any){
 const held=m.heldBy!=null||m.orbitBy!=null,im=environmentAssets.get("matter42"),spin=m.spin||0;
 g.save();g.translate(m.x,m.y);if(!held){g.fillStyle="#080c1640";g.beginPath();g.ellipse(1,1,m.r*.8,m.r*.25,0,0,Math.PI*2);g.fill();}g.translate(0,-(held?10:m.height||0));
 const family=(m.kind==="metal"?3:0)+Math.abs(m.fragment||0)%3,frame=((Math.floor(spin/(Math.PI/4))%8)+8)%8;
 if(im?.complete&&im.naturalWidth){g.rotate(spin*.3);g.drawImage(im,frame*96,family*96,96,96,-m.r*1.4,-m.r*1.4,m.r*2.8,m.r*2.8);}
 else{g.rotate(spin);g.fillStyle=m.kind==="metal"?"#536f82":"#86766e";g.beginPath();g.moveTo(-m.r,-m.r*.5);g.lineTo(m.r*.7,-m.r);g.lineTo(m.r,m.r*.5);g.lineTo(-m.r*.5,m.r);g.closePath();g.fill();}
 if(held){g.strokeStyle=m.heldBy!=null?"#62f0f0":"#ff4aaa";g.lineWidth=.8;g.beginPath();g.ellipse(0,0,m.r*1.2,m.r*.7,0,0,Math.PI*2);g.stroke();}g.restore();
}
function impactSpray(g:CanvasRenderingContext2D,f:any){const age=1-classicClamp(f.life/.32,0,1),a=f.angle||0,z=f.z??27,cyber=f.material==="cyber";g.save();g.globalAlpha=(1-age)*.95;for(let n=0;n<8;n++){const angle=a+(n%7-3)*.18,speed=18+n%5*9,r=(1-Math.exp(-age*4))*speed,x=f.x+Math.cos(angle)*r,y=f.y+Math.sin(angle)*r-(z+Math.sin(age*Math.PI)*7-age*age*17)/DECK_PITCH;g.fillStyle=cyber?(n%4===0?"#d8e8ef":n%3===0?"#dc74a7":n%2?"#79344f":"#111924"):(n%3?"#72e9ef":"#ed9dc9");g.strokeStyle="#0a1019";g.lineWidth=.65;g.beginPath();if(cyber){g.ellipse(x,y,1.3+n%3,1+n%2,angle,0,Math.PI*2)}else g.rect(x,y,2+n%3,2/DECK_PITCH);g.fill();g.stroke();if(cyber&&n%5===0){g.strokeStyle="#82374f";g.lineWidth=1.5;g.beginPath();g.moveTo(x-Math.cos(angle)*7,y-Math.sin(angle)*7);g.lineTo(x,y);g.stroke();}if(cyber&&n%4===0){g.fillStyle="#e4f6fa";g.fillRect(x,y,1,1/DECK_PITCH);}}g.restore();}
function fx(g:CanvasRenderingContext2D,f:any){
 const height=f.z??(f.type==="hit"||f.type==="cover-hit"?27:0),v=vertical46(f.x,f.y,height);g.save();g.translate(v.x,v.y);fxBody47(g,{...f,z:0});g.restore();
}
function fxBody47(g:CanvasRenderingContext2D,f:any){
 if(f.type==="repulse21"||f.type==="repulse-windup21"){const windup=f.type==="repulse-windup21",progress=1-classicClamp(f.life/(windup?.12:.22),0,1),r=(f.strength||96)*(windup?.18+.12*progress:.3+.7*progress);g.save();g.translate(f.x,f.y);g.rotate(f.angle||0);g.globalAlpha=(windup?.5:1-progress)*.8;g.strokeStyle="#a4f6ff";g.lineWidth=windup?1:2;g.beginPath();g.arc(0,0,r,-Math.PI/3,Math.PI/3);g.stroke();if(windup){g.beginPath();g.moveTo(0,0);g.lineTo(r*.5,-r*.866);g.moveTo(0,0);g.lineTo(r*.5,r*.866);g.stroke();}g.restore();return;}
 if(f.type==="glove-muzzle"){const a=f.angle||0,k=Math.max(0,Math.min(1,f.life/.25));g.save();g.globalAlpha=k;drawGloveCore(g,f.x+Math.cos(a)*26,f.y+Math.sin(a)*26-(f.z||0)/DECK_PITCH,a,.7+.7*k);g.restore();return;}
 if(f.type==="melee-strike"){const a=f.angle||0,k=Math.max(0,Math.min(1,f.life/.14));g.save();g.translate(f.x,f.y-(f.z||0)/DECK_PITCH);g.rotate(a);g.globalAlpha=k*.6;g.strokeStyle="#111721";g.lineWidth=3;g.beginPath();g.arc(-10,0,13,-.7,.7);g.stroke();g.strokeStyle="#d7eef2";g.lineWidth=1;g.stroke();g.restore();return;}

 if(f.type==="grip-acquire"){const age=1-classicClamp(f.life/.22,0,1);g.save();g.globalAlpha=(1-age)*.8;g.strokeStyle="#ff9bdd";g.lineWidth=1.5;g.beginPath();g.ellipse(f.x,f.y-10/DECK_PITCH,8+age*18,4+age*7,0,0,Math.PI*2);g.stroke();g.restore();return;}
 if(f.type==="cyber-stain"){const age=4-f.life;g.save();g.translate(f.x,f.y);g.rotate(f.angle||0);g.globalAlpha=Math.min(1,age/.16)*Math.min(.62,f.life/.8);g.fillStyle="#0b121bd9";g.beginPath();g.ellipse(7,0,16,6,0,0,Math.PI*2);g.fill();for(let n=0;n<7;n++){g.fillStyle=n%2?"#76324e":"#444754";g.beginPath();g.ellipse(3+n*3,(n%3-1)*5,2+n%3,1.3,0,0,Math.PI*2);g.fill()}g.strokeStyle="#be94b4";g.lineWidth=.65;g.beginPath();g.ellipse(7,0,12,3,0,-.4,2.5);g.stroke();g.restore();return;}
 if(f.type==="materialize"||f.type==="cover-dissolve"){const duration=f.type==="materialize"?.72:.8,age=1-classicClamp(f.life/duration,0,1);g.save();g.strokeStyle=f.type==="materialize"?"#95efff":"#c39eea";g.globalAlpha=(1-age)*.6;g.lineWidth=1.2;g.beginPath();g.ellipse(f.x,f.y,12+age*55,7+age*14,0,0,Math.PI*2);g.stroke();g.restore();return;}
 if(f.type==="parry27g"){g.save();g.translate(f.x,f.y);g.strokeStyle="#fff3a0";g.lineWidth=3;g.globalAlpha=Math.min(1,f.life/.12);g.beginPath();for(let n=0;n<16;n++){const a=n*Math.PI/8,r=n%2?7:24;n?g.lineTo(Math.cos(a)*r,Math.sin(a)*r):g.moveTo(Math.cos(a)*r,Math.sin(a)*r);}g.closePath();g.stroke();g.restore();return;}
 if(f.type==="hit"&&f.material){
  // One brief contact flash before the directional spray; no camera or control change.
  if(f.life>.24){g.save();g.globalAlpha=(f.life-.24)/.08;g.strokeStyle="#f4f7ee";g.lineWidth=2;g.beginPath();g.moveTo(f.x-6,f.y-5);g.lineTo(f.x+6,f.y+5);g.moveTo(f.x+5,f.y-7);g.lineTo(f.x-5,f.y+7);g.stroke();g.restore();}
  impactSpray(g,f);return;
 }

 if(f.type==="cover-scrape"){const fade=Math.min(.65,f.life/1.8);g.save();g.translate(f.x,f.y);g.rotate(f.angle||0);g.globalAlpha=fade;g.strokeStyle="#141a23";g.lineWidth=2;for(const side of [-1,1]){g.beginPath();g.moveTo(-18,side*8);g.lineTo(3,side*8);g.stroke();}g.strokeStyle=f.text==="stone"?"#9f9380":"#939baf";g.lineWidth=.8;g.beginPath();g.moveTo(-17,-7);g.lineTo(2,-7);g.stroke();g.restore();return;}

 if(["soft-cover","cover-slam","brace","cover-block"].includes(f.type)){
  const fade=classicClamp(f.life/.25,0,1);g.save();g.translate(f.x,f.y);g.globalAlpha=fade*.55;g.strokeStyle=f.type==="cover-block"?"#ff78ac":"#74dfe6";g.lineWidth=1;
  g.beginPath();g.ellipse(0,2,7+(1-fade)*4,3,0,0,Math.PI*2);g.stroke();g.restore();return;
 }
 if(f.type==="cover-break"||f.type==="cover-impact"){
  if(f.type==='cover-impact'&&f.strength!==undefined){
   const age=1-classicClamp(f.life/.3,0,1),strength=f.strength;
   g.save();g.globalAlpha=(1-age)*(.2+.45*strength);g.strokeStyle=f.text==='metal'?'#ffe0a0':'#c5b6a4';g.lineWidth=1+strength;g.beginPath();g.ellipse(f.x,f.y,4+age*(8+strength*17),2+age*5,0,0,Math.PI*2);g.stroke();g.restore();
  }
  if(environmentAssets.get("matter42")?.complete)return;
  const age=1-classicClamp(f.life/(f.type==="cover-break"?.8:.3),0,1),count=f.type==="cover-break"?38:12;g.save();g.globalAlpha=(1-age)*.8;
  for(let n=0;n<count;n++){const a=n*2.399+(f.angle||0),r=10+age*(25+n%7*11),z=Math.sin(age*Math.PI)*(8+n%4*5);g.fillStyle=f.text==="stone"?(n%2?"#8d8277":"#3d4149"):(n%3?"#647583":"#d29c78");g.beginPath();g.moveTo(f.x+Math.cos(a)*r,f.y+Math.sin(a)*r-z/DECK_PITCH);g.lineTo(f.x+Math.cos(a)*r+3+n%3,f.y+Math.sin(a)*r-z/DECK_PITCH+2/DECK_PITCH);g.lineTo(f.x+Math.cos(a)*r-2,f.y+Math.sin(a)*r-z/DECK_PITCH+5/DECK_PITCH);g.closePath();g.fill();}g.restore();return;
 }
 if(f.type==="shield-block"){
  withUpright(g,f.x,f.y,()=>{g.save();g.globalAlpha=classicClamp(f.life/.22,0,1);g.strokeStyle="#baffff";g.lineWidth=2;g.beginPath();g.ellipse(f.x,f.y,9+(1-f.life/.22)*12,13,0,0,Math.PI*2);g.stroke();g.restore()});return;
 }
 if(f.type==="cover-hit"||f.type==="hit"){
  const age=1-classicClamp(f.life/(f.type==="hit"?.32:.25),0,1),stone=f.text==="stone";g.save();g.translate(f.x,f.y-(f.z??27)/DECK_PITCH);g.globalAlpha=(1-age)*.9;
  for(let n=0;n<12;n++){const a=n*2.399,travel=5+age*(13+n%4*7),x=Math.cos(a)*travel,y=(Math.sin(a)*travel+age*age*16)/DECK_PITCH;g.fillStyle=f.type==="hit"?(n%2?"#b5f4ff":"#f092c8"):stone?(n%2?"#978a7b":"#d0bba0"):(n%2?"#ffe4a7":"#f09066");g.fillRect(x,y,1.5+n%3,1.5/DECK_PITCH);}
  g.strokeStyle=f.type==="hit"?"#eeffff":"#fff0c5";g.lineWidth=1.4;g.beginPath();g.moveTo(-6,-6/DECK_PITCH);g.lineTo(6,6/DECK_PITCH);g.moveTo(6,-6/DECK_PITCH);g.lineTo(-6,6/DECK_PITCH);g.stroke();g.restore();return;
 }
 g.save();const lift=vertical46(f.x,f.y,f.z||0);g.translate((f.renderOffsetX||0)+lift.x,lift.y);g.globalAlpha=Math.min(1,f.life*4);
 if(f.type==="brake"&&Number.isFinite(f.oldAngle)){
  const age=1-classicClamp(f.life/.42,0,1),oa=f.oldAngle,na=f.newAngle??oa,strength=classicClamp((f.entrySpeed||0)/689.15949375,0,1);
  g.save();g.translate(f.x,f.y);
  // Short scrape scar and incoming/outgoing vector arcs: presentation only.
  g.globalAlpha=(1-age)*.7;g.lineWidth=2.2;g.strokeStyle="#8f8178";g.beginPath();g.moveTo(-Math.cos(oa)*6,-Math.sin(oa)*6);g.lineTo(-Math.cos(oa)*(18+30*strength),-Math.sin(oa)*(18+30*strength));g.stroke();
  g.strokeStyle="#6af2ff";g.globalAlpha=(1-age)*.55;g.beginPath();g.moveTo(0,0);g.lineTo(Math.cos(na)*(16+18*strength),Math.sin(na)*(16+18*strength));g.stroke();
  // Bounded deterministic concrete chips; no authoritative matter objects.
  const count=f.hard?8:Math.max(2,Math.round(3+strength*2));for(let i=0;i<count;i++){const spread=(i-(count-1)/2)*.12,a=oa+Math.PI+spread,r=(10+i*3)*(1+age*.8);g.save();g.translate(Math.cos(a)*r,Math.sin(a)*r-age*(5+i%3));g.rotate(a+i*.7);g.fillStyle=i%2?"#82736a":"#a39185";g.fillRect(-2,-1.5,4+(i%3),3);g.restore()}
  // Panther-boot contact spark / compressed psychic wake.
  g.globalAlpha=(1-age)*.85;g.strokeStyle="#fff1a8";g.lineWidth=1.5;for(let i=0;i<4;i++){const a=oa+Math.PI+(i-1.5)*.28;g.beginPath();g.moveTo(0,0);g.lineTo(Math.cos(a)*(8+i*3),Math.sin(a)*(8+i*3));g.stroke()}
  g.restore();
 }
 if(f.type==="slide"||f.type==="dash"||f.type==="brake"){g.strokeStyle=f.type==="dash"?"#63eff1":f.type==="brake"?"#fff1a8":"#ff4aa5";g.shadowColor=g.strokeStyle;g.shadowBlur=f.type==="brake"?14:7;g.lineWidth=f.type==="brake"?4:f.type==="slide"?3:2;const count=f.type==="brake"?6:f.type==="slide"?5:3;for(let i=0;i<count;i++){if(f.type==="brake"&&Number.isFinite(f.oldAngle)){const a=f.oldAngle+Math.PI,near=8+i*4,far=30+i*6;g.beginPath();g.moveTo(f.x+Math.cos(a)*near,f.y+Math.sin(a)*near);g.lineTo(f.x+Math.cos(a)*far,f.y+Math.sin(a)*far);g.stroke()}else{const dir=-1;g.beginPath();g.moveTo(f.x+dir*(8+i*5),f.y+5+i*2);g.lineTo(f.x+dir*((f.type==="slide"?58:42)+i*9),f.y+10+i*3);g.stroke()}}g.shadowBlur=0;if(f.text){g.fillStyle="#d9ffff";g.font="900 italic 18px Arial";g.fillText(f.text,f.x-18,f.y-18)}}else if(f.type==="muzzle"){const a=Number.isFinite(f.angle)?f.angle:0,k=Math.max(0,Math.min(1,f.life/.18));g.save();g.translate(f.x,f.y);g.rotate(a);g.globalCompositeOperation="lighter";g.strokeStyle="#fff3b0";g.shadowColor="#ffcf62";g.shadowBlur=16;g.lineWidth=4;g.globalAlpha=.35+.65*k;g.beginPath();g.moveTo(-5,0);g.lineTo(34+20*k,0);g.stroke();g.fillStyle="#fff7cf";g.beginPath();g.moveTo(2,-10);g.lineTo(44+18*k,0);g.lineTo(2,10);g.lineTo(13,0);g.closePath();g.fill();g.strokeStyle="#ff5ebd";g.lineWidth=2;for(let j=-2;j<=2;j++){const aa=j*.12,len=30+Math.abs(j)*6+18*k;g.beginPath();g.moveTo(5,0);g.lineTo(Math.cos(aa)*len,Math.sin(aa)*len);g.stroke()}g.restore()}else{g.strokeStyle=f.type==="pinball"?"#ff4aaa":"#64edf0";g.lineWidth=3;for(let i=0;i<8;i++){const a=i*Math.PI/4,r=10+(1-f.life)*25;g.beginPath();g.moveTo(f.x,f.y);g.lineTo(f.x+Math.cos(a)*r,f.y+Math.sin(a)*r);g.stroke()}}g.restore()}

function arrow(g:CanvasRenderingContext2D,x1:number,y1:number,x2:number,y2:number){const a=Math.atan2(y2-y1,x2-x1);g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();g.beginPath();g.moveTo(x2,y2);g.lineTo(x2-Math.cos(a-.55)*11,y2-Math.sin(a-.55)*11);g.lineTo(x2-Math.cos(a+.55)*11,y2-Math.sin(a+.55)*11);g.closePath();g.fill()}







