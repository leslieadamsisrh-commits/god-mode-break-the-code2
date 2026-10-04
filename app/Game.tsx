"use client";
import {useCallback,useEffect,useRef,useState} from "react";
import PlaytestGuide from "./PlaytestGuide";
import {COVER_HEIGHT,withCoverOcclusion} from "../lib/cover-occlusion";

type Session={room:string;code?:string;token:string;slot:number};
type Config={chargeMoveScale:number;chargeMoveResponse:number;powerChargeSeconds:number;godDuration:number;godDrain:number;powerRecharge:number;godDamage:number;gripEnergy:number;holdEnergy:number;coverThrowEnergy:number;carryResponse:number;carryTurnResponse:number;carryMomentum:number;slideEnergy:number;dashEnergy:number;rechargeDelay:number;rechargeRate:number;weaveEnabled:number;moveSpeed:number;response:number;stopDrag:number;slideDrag:number;dashSpeed:number;dashDuration:number;doubleTapWindow:number;slideSpeed:number;slideDuration:number;slideSustain:number;slideSteer:number;slideSteerAngle:number;slideSteerResponse:number;slideBrake:number;slideCancelSpeed:number;shotCadence:number;shotSpread:number;shotDamage:number;shotSpeed:number;throwForce:number;pinballSpeed:number;pinballDuration:number;maxHealth:number;spriteScale:number;cameraZoom:number};
const DEFAULT:Config={chargeMoveScale:.67145,chargeMoveResponse:8,powerChargeSeconds:2.4,godDuration:12,godDrain:2,powerRecharge:26,godDamage:1.35,gripEnergy:6,holdEnergy:6,coverThrowEnergy:8,carryResponse:12,carryTurnResponse:9,carryMomentum:.65,slideEnergy:12,dashEnergy:6,rechargeDelay:1.1,rechargeRate:9,weaveEnabled:0,moveSpeed:222.7,response:13,stopDrag:.002,slideDrag:.12,dashSpeed:410,dashDuration:.16,doubleTapWindow:.28,slideSpeed:689.15949375,slideDuration:.63,slideSustain:360,slideSteer:7.5,slideSteerAngle:.62,slideSteerResponse:7,slideBrake:9.5,slideCancelSpeed:150,shotCadence:.48,shotSpread:.04,shotDamage:10,shotSpeed:820,throwForce:720,pinballSpeed:830,pinballDuration:.5,maxHealth:100,spriteScale:.82,cameraZoom:1.85};
const EMPTY:any={x:0,y:0,aim:0,fire:false,shield:false,coverAim:false,slide:false,melee:false,heavy:false,grip:false,throwMatter:false,cover:false,orbit:false,launchOrbit:false,pinball:false,powerup:false,slow:false};
function readController(pad:any,i:any){
 const down=(n:number)=>!!(pad.buttons[n]?.pressed||pad.buttons[n]?.value>.25),dz=(v:number)=>Math.abs(v)<.18?0:v;
 i.x=dz(pad.axes[0]||0);i.y=dz(pad.axes[1]||0);const rx=dz(pad.axes[2]||0),ry=dz(pad.axes[3]||0);if(rx||ry)i.aim=Math.atan2(ry,rx);
 i.slide||=down(0);i.melee||=down(1);i.slow||=down(2);i.powerup||=down(3);i.grip||=down(4);i.cover||=down(5);i.shield||=down(6);i.coverAim||=down(6);i.fire||=down(7);
 // D-pad selectors are reserved: do not trigger their former combat actions.
 return i;
}
const keyAction:Record<string,string>={ShiftLeft:"slide",ShiftRight:"slide",KeyF:"melee",KeyC:"heavy",KeyQ:"grip",KeyR:"throwMatter",KeyB:"cover",KeyO:"orbit",KeyP:"launchOrbit",Space:"pinball",KeyX:"slow"};
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
let cameraState={x:500,y:310,ready:false,last:0};let loading=false;
const coverAimVisual=new Map<string,number>();
const presentationQA={unsupportedCoverAim:0,missingExact:0,missing:new Map<string,number>()};
function noteMissing(state:string,family:string,dir:number){const key=`${state}|${family}|d${String(dir).padStart(2,"0")}`;presentationQA.missing.set(key,(presentationQA.missing.get(key)||0)+1)}
function angleDelta(a:number,b:number){return Math.atan2(Math.sin(a-b),Math.cos(a-b))}
function supportedCoverDir(p:any){
 const raw=p.gunFacing??p.aim??0,exact=((Math.round(raw/(Math.PI*2)*24)%24)+24)%24;
 if(!p.coverId||p.coverMode!=="braced"||!p.input?.coverAim)return exact;
 const supported=[2,3,4],prev=coverAimVisual.get(p.id||"local");
 if(prev!==undefined&&supported.includes(prev)&&Math.abs(angleDelta(raw,prev*Math.PI/12))<Math.PI/16)return prev;
 let best=supported[0],err=Infinity;for(const d of supported){const e=Math.abs(angleDelta(raw,d*Math.PI/12));if(e<err){err=e;best=d}}
 // Never fabricate a pose outside the authored 30/45/60-degree family. Hold the closest valid pose.\n if(exact!==best)presentationQA.unsupportedCoverAim++;coverAimVisual.set(p.id||"local",best);return best;
}
const snapshots:{state:any;at:number}[]=[];
function recordSnapshot(s:any,at:number){snapshots.push({state:s,at});if(snapshots.length>20)snapshots.shift()}
function presentation(s:any,now:number){
 if(snapshots.length<2)return s;
 const target=now-50;
 while(snapshots.length>2&&snapshots[1].at<=target)snapshots.shift();
 const a=snapshots[0],b=snapshots[1],blend=Math.max(0,Math.min(1,(target-a.at)/Math.max(1,b.at-a.at)));
 const mix=(xs:any[],ys:any[])=>ys.map(y=>{const x=xs.find(x=>x.id===y.id);return x?{...y,x:x.x+(y.x-x.x)*blend,y:x.y+(y.y-x.y)*blend,...typeof x.a==="number"&&typeof y.a==="number"?{a:x.a+Math.atan2(Math.sin(y.a-x.a),Math.cos(y.a-x.a))*blend}:{}}:y});
 const players=b.state.players.map((p:any,n:number)=>{const q=a.state.players[n];return q?{...p,x:q.x+(p.x-q.x)*blend,y:q.y+(p.y-q.y)*blend,...q.charging&&p.charging?{chargeAge:q.chargeAge+(p.chargeAge-q.chargeAge)*blend,godCharge:q.godCharge+(p.godCharge-q.godCharge)*blend}:{},...q.powerReturn>0&&p.powerReturn>0?{powerReturn:q.powerReturn+(p.powerReturn-q.powerReturn)*blend}:{}}:p});
 return {...b.state,time:a.state.time+(b.state.time-a.state.time)*blend,players,covers:mix(a.state.covers||[],b.state.covers||[]),matter:mix(a.state.matter||[],b.state.matter||[])};
}
const powerAssets=new Map<string,HTMLImageElement>();
function preload(){if(loading||typeof Image==="undefined")return;loading=true;for(const key of ["cover-d02-d04-exposure-v1","cover-d03-exposure-v1","cover-d03-connectors-v1","psychic-d03-v1","grounded-float-v1","front-d06-loop-v1","front-d06-transitions-v1","front-right-d03-sequence-v1","front-right-d03-dissolve-v1","opening","continuation","face-opening","face-continuation"]){const im=new Image();im.onload=()=>powerAssets.set(key,im);im.src="/assets/god-frame/"+key+".png"}for(const [key,path] of [["graffiti","/assets/dimension33-map/slide-graffiti-skeet-skurt-v2.png"],["ground","/assets/shotgun-v57-ground-effects.png"],["concrete","/assets/dimension33-map/concrete-cover-atlas-v2.png"]]){const im=new Image();im.onload=()=>classicAssets.set(key,im);im.src="https://jade-v1-combat-lab-v142.leslieadams-isrh.chatgpt.site"+path}for(const family of ["ready","run","slide","cover"])for(let d=0;d<24;d++){const im=new Image();im.onload=()=>jade.set(`${family}-${d}`,im);const n=(family==="run"||family==="slide")&&d===3?`${family}.webp`:`${family}-d${String(d).padStart(2,"0")}.webp`;im.src="https://god-helmet-arcade.leslieadams-isrh.chatgpt.site/assets/shotgun-complete/runtime/"+n}}

export default function Game(){
 const coverPreview=useRef(-1);const [previewCover,setPreviewCover]=useState(-1);const psychicPreview=useRef(-1);const [previewPsychic,setPreviewPsychic]=useState(-1);const chargePreview=useRef(false);const [previewCharging,setPreviewCharging]=useState(false);
 const canvas=useRef<HTMLCanvasElement>(null),session=useRef<Session|null>(null),state=useRef<any>(null),seq=useRef(0),keys=useRef<Record<string,boolean>>({}),edges=useRef<Record<string,boolean>>({}),mouse=useRef({x:500,y:310,down:false}),lastAccept=useRef(performance.now()),started=useRef(false);
 const [hud,setHud]=useState<any>(null),[status,setStatus]=useState("BOOTING"),[director,setDirector]=useState(false),[spritePanel,setSpritePanel]=useState(false),[config,setConfig]=useState<Config>(DEFAULT),[note,setNote]=useState(""),[padStatus,setPadStatus]=useState("CONTROLLER: WAITING"),[padGate,setPadGate]=useState(true),[testPass,setTestPass]=useState<Record<string,boolean>>({});
 const post=useCallback(async(body:any)=>{const r=await fetch("/api/game",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)}),v=await r.json();if(!r.ok)throw Error(v.error||"Request failed");return v},[]);
 const accept=useCallback((v:any)=>{if(v.state){if(state.current&&v.state.round===state.current.round&&v.state.lastAt<=state.current.lastAt)return;const at=performance.now();if(state.current&&v.state.round!==state.current.round){snapshots.length=0;kineticEcho.length=0;hoverWake.length=0;cameraState.ready=false}recordSnapshot(v.state,at);state.current=v.state;lastAccept.current=at;setHud(v.state);setConfig(v.state.config||DEFAULT);setStatus("COMBAT MASTER LIVE")}},[]);
 const create=useCallback(async()=>{if(started.current)return;started.current=true;try{let saved:any=null;try{saved=JSON.parse(sessionStorage.getItem("god_mode_studio_session")||"null")}catch{}if(saved){session.current=saved;accept(await post({action:"config",...saved,patch:DEFAULT}));return}const v=await post({action:"create",name:"Les",mode:"solo"}),s={room:v.room,code:v.code,token:v.token,slot:0};session.current=s;sessionStorage.setItem("god_mode_studio_session",JSON.stringify(s));accept(v)}catch(e:any){started.current=false;setStatus(e.message)}},[accept,post]);
 useEffect(()=>{preload();create()},[create]);
 useEffect(()=>{
   const connected=(e:GamepadEvent)=>{setPadStatus(`CONTROLLER: ${e.gamepad.id||"CONNECTED"}`);setPadGate(false);canvas.current?.focus()};
   const disconnected=()=>{setPadStatus("CONTROLLER: DISCONNECTED");setPadGate(true)};
   addEventListener("gamepadconnected",connected as EventListener);
   addEventListener("gamepaddisconnected",disconnected as EventListener);
   try{const p=[...navigator.getGamepads()].find(Boolean);if(p){setPadStatus(`CONTROLLER: ${p.id||"CONNECTED"}`);setPadGate(false)}}catch{}
   return()=>{removeEventListener("gamepadconnected",connected as EventListener);removeEventListener("gamepaddisconnected",disconnected as EventListener)}
 },[]);
 useEffect(()=>{const kd=(e:KeyboardEvent)=>{if(/INPUT|TEXTAREA|SELECT/.test((e.target as HTMLElement)?.tagName))return;if(["Space","ShiftLeft","ShiftRight"].includes(e.code))e.preventDefault();if(!keys.current[e.code])edges.current[e.code]=true;keys.current[e.code]=true},ku=(e:KeyboardEvent)=>keys.current[e.code]=false;addEventListener("keydown",kd);addEventListener("keyup",ku);return()=>{removeEventListener("keydown",kd);removeEventListener("keyup",ku)}},[]);
 useEffect(()=>{let dead=false;const poll=async()=>{if(dead)return;const s=session.current;if(s)try{const u=new URL("/api/game",location.origin);u.searchParams.set("room",s.room);u.searchParams.set("token",s.token);const r=await fetch(u,{cache:"no-store"}),v=await r.json();if(r.ok)accept(v);else if(r.status===404&&v.error==="ROOM_NOT_FOUND"){session.current=null;sessionStorage.removeItem("god_mode_studio_session");started.current=false;seq.current=0;snapshots.length=0;cameraState.ready=false;await create()}}catch{}setTimeout(poll,80)};poll();return()=>{dead=true}},[accept,create]);
 useEffect(()=>{let pending=false;const timer=setInterval(async()=>{const s=session.current,g=state.current;if(!s||!g||pending)return;pending=true;const p=g.players[0],i:any={...EMPTY};i.x=(keys.current.KeyD?1:0)-(keys.current.KeyA?1:0);i.y=(keys.current.KeyS?1:0)-(keys.current.KeyW?1:0);i.aim=Math.atan2(mouse.current.y-p.y,mouse.current.x-p.x);i.fire=mouse.current.down;i.shield=!!keys.current.KeyE;i.coverAim=!!keys.current.KeyZ;for(const[k,a]of Object.entries(keyAction))i[a]=!!edges.current[k];edges.current={};i.grip=!!keys.current.KeyQ;i.powerup=!!keys.current.KeyY||chargePreview.current;
  try{const pad=[...navigator.getGamepads()].find(Boolean) as Gamepad|undefined;if(pad){i.aim=p.aim;readController(pad,i)}}catch{}
  try{accept(await post({action:"input",...s,seq:++seq.current,input:i}))}catch{}finally{pending=false}
 },33);return()=>clearInterval(timer)},[accept,post]);
 useEffect(()=>{let id=0;const loop=()=>{draw(canvas.current,state.current,lastAccept.current,mouse.current,keys.current,psychicPreview.current,coverPreview.current);id=requestAnimationFrame(loop)};id=requestAnimationFrame(loop);return()=>cancelAnimationFrame(id)},[]);
 const point=(e:React.PointerEvent)=>{const c=canvas.current;if(!c)return;const r=c.getBoundingClientRect();mouse.current.x=(e.clientX-r.left)/r.width*1000;mouse.current.y=(e.clientY-r.top)/r.height*620};
 const patch=async(key:keyof Config,value:number)=>{const next={...config,[key]:value};setConfig(next);const s=session.current;if(s)try{accept(await post({action:"config",...s,patch:{[key]:value}}))}catch{}};
 const applyMovementPreset=async(name:string)=>{const preset=MOVEMENT_PRESETS[name];if(!preset)return;const movementKeys=new Set(Object.values(MOVEMENT_PRESETS).flatMap(p=>Object.keys(p)));const values:Partial<Config>={};for(const k of movementKeys)values[k as keyof Config]=DEFAULT[k as keyof Config];Object.assign(values,preset);const saved=session.current;if(!saved)return;try{accept(await post({action:"config",...saved,patch:values}));setTestPass({});setNote(name+" APPLIED")}catch(e:any){setNote(e.message||"PRESET FAILED")}};
 const reset=async()=>{const s=session.current;if(!s)return;try{accept(await post({action:"reset",...s}))}catch{}};
 const save=()=>{localStorage.setItem("god_mode_studio_combat_preset",JSON.stringify(config));setNote("PRESET SAVED LOCALLY");setTimeout(()=>setNote(""),1200)};
 const load=async()=>{try{const p=JSON.parse(localStorage.getItem("god_mode_studio_combat_preset")||"null");if(!p)return setNote("NO PRESET SAVED");const s=session.current;if(s)for(const[k,v]of Object.entries(p))await post({action:"config",...s,patch:{[k]:v}});setConfig({...DEFAULT,...p});setNote("PRESET LOADED")}catch{setNote("PRESET ERROR")}};
 const activateController=()=>{canvas.current?.focus();try{const p=[...navigator.getGamepads()].find(Boolean);if(p){setPadStatus(`CONTROLLER: ${p.id||"CONNECTED"}`);setPadGate(false)}else{setPadStatus("CONTROLLER: PRESS A / MOVE STICK");setPadGate(false)}}catch{setPadStatus("CONTROLLER API NOT READY")}};
 const p=hud?.players?.[0];
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
 return <main className="studio">
  <header><div><small>GOD MODE: BREAK THE CODE</small><b>V142 STRUCTURE LAB · COMBAT STUDIO</b></div><span>{status}</span></header>
  <div className="stageWrap">
   <canvas ref={canvas} width={1400} height={868} onPointerMove={point} onPointerDown={e=>{point(e);mouse.current.down=true;(e.currentTarget as HTMLElement).focus();(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)}} onPointerUp={()=>mouse.current.down=false} onPointerCancel={()=>mouse.current.down=false}/>
   <div className="minimalHud"><b>HP {Math.ceil(p?.hp??100)}</b><span className="padLine">{config.weaveEnabled<.5?"CLASSIC · A SLIDE":"WEAVE EXPERIMENT · A DOUBLE-TAP SLIDE"}</span><i style={{width:`${p?.battery??100}%`}}/><span>BATTERY {Math.ceil(p?.battery??100)}%</span><span>{p?.charging?`CHARGE ${Math.round((p.godCharge||0)*100)}%`:p?.godTime>0?`GOD FRAME ${p.godTime.toFixed(1)}s`:"HOLD Y · POWER UP"}</span><span className="padLine">{padStatus}</span></div>
   {padGate&&<button className="controllerGate" onClick={activateController}>ACTIVATE XBOX CONTROLLER<small>Tap once, then press A or move a stick</small></button>}
   <PlaytestGuide/>
   <div className="toolbar"><button onClick={()=>setDirector(v=>!v)}>DIRECTOR</button><button onClick={()=>setSpritePanel(v=>!v)}>SPRITES</button><button onClick={reset}>RESET LAB</button></div>
   {director&&<aside className="trainingDirector"><div className="panelTitle"><span>TRAINING DIRECTOR</span><b>{config.weaveEnabled<.5?"INSTRUCTOR 142 CLASSIC":"GOD MODE WEAVE TEST"}</b></div>
    <p>{config.weaveEnabled<.5?<><strong>1.</strong> A · baseball slide<br/><strong>2.</strong> Contact cover · soft catch<br/><strong>3.</strong> Feather stick · flow around connected edges<br/><strong>4.</strong> Soft cover: pull away · release<br/><strong>5.</strong> A or LT while soft · hard brace<br/><strong>6.</strong> Hold LT · plant feet / aim; release · retract<br/><strong>7.</strong> A while braced · kick / edge burst into slide<br/><strong>8.</strong> Hold LB · grip/carry; release · drop<br/><strong>9.</strong> LB + fresh RT · throw; fresh RT · shoot</>:<><strong>1.</strong> Tap A once · upright boost<br/><strong>2.</strong> Double-tap A · full slide<br/><strong>3.</strong> Hold forward · sustain<br/><strong>4.</strong> Lean 20–30° · curve<br/><strong>5.</strong> Pull opposite · brake<br/><strong>6.</strong> Touch cover · soft attach<br/><strong>7.</strong> Tap A again · brace<br/><strong>8.</strong> Hold LT · plant feet / aim; release · retract</>}</p>
    <button onClick={()=>{chargePreview.current=!chargePreview.current;setPreviewCharging(chargePreview.current)}}>{previewCharging?"RELEASE CHARGE PREVIEW":"START CHARGE PREVIEW"}</button><button onClick={()=>{psychicPreview.current=psychicPreview.current===2?-1:psychicPreview.current+1;setPreviewPsychic(psychicPreview.current)}}>{previewPsychic<0?"PSYCHIC ART PREVIEW":["PSYCHIC PREVIEW · REACH","PSYCHIC PREVIEW · HOLD","PSYCHIC PREVIEW · RETRACT"][previewPsychic]}</button><button onClick={()=>{coverPreview.current=coverPreview.current===7?-1:coverPreview.current+1;setPreviewCover(coverPreview.current)}}>{previewCover<0?"COVER ART PREVIEW":["COVER PREVIEW · RECOIL","COVER PREVIEW · RETRACT","COVER PREVIEW · EXPOSED AIM","COVER PREVIEW · EXPOSED RECOIL","COVER PREVIEW · d02 AIM","COVER PREVIEW · d02 RECOIL","COVER PREVIEW · d04 AIM","COVER PREVIEW · d04 RECOIL"][previewCover]}</button><p>Hold Y · charge while moving at a controlled pace; soft cover still flows. Release Y · activate God Frame (up to 12 seconds). Charging is vulnerable. D-pad ↑ gun, → cover shape, ↓ power, ← field size. B uses the existing melee; a full combo chain remains pending.</p><div className="testGrid">{tests.map(([name])=>{const pass=!!testPass[name];return <div key={name} className={pass?"pass":""}><span>{name}</span><b>{pass?"PASS":"NOT DETECTED"}</b></div>})}</div><button className="resetTests" onClick={()=>setTestPass({})}>RESET TESTS</button>
   </aside>}
   {director&&<aside className="spriteLab"><div className="panelTitle"><span>SPRITE LAB</span><b>RUNTIME ROUTING · KINETIC ECHO</b></div>{(()=>{const info=spriteLabInfo(hud);return <dl><dt>STATE</dt><dd>{info.state}</dd><dt>FAMILY</dt><dd>{info.family.toUpperCase()}</dd><dt>DIRECTION</dt><dd>d{String(info.dir).padStart(2,"0")} · {info.angleDeg}°</dd><dt>FRAME</dt><dd>{info.frame} / {info.total}</dd><dt>FILE</dt><dd>{info.file}</dd><dt>TARGET</dt><dd>{info.expected}</dd><dt>FALLBACK</dt><dd className={info.fallback?"warn":"ok"}>{info.fallback?"YES — ART MISSING":"NO"}</dd><dt>MISSING MAP</dt><dd>{[...presentationQA.missing.entries()].sort((a,b)=>b[1]-a[1]).slice(0,6).map(([k,v])=>`${k} ×${v}`).join(" · ")||"NONE"}</dd></dl>})()}</aside>}
   {director&&<Director cfg={config} patch={patch} applyPreset={applyMovementPreset} save={save} load={load} note={note}/>}
   {spritePanel&&<SpriteInspector s={hud}/>}
  </div>
  <footer><span>LS MOVE</span><span>GUN FACING = SHOT DIRECTION</span><span>{config.weaveEnabled<.5?"A SLIDE · BRACE · KICK":"A TAP BOOST · DOUBLE-TAP SLIDE"}</span><span>B MELEE</span><span>X SLOW TIME</span><span>LB GRIP / DROP</span><span>RB BUILD COVER</span><span>LT SHIELD / AIM</span><span>RT FIRE / THROW</span><span>HOLD Y CHARGE · RELEASE POWER</span><span>D-PAD SELECTORS · PENDING</span><span>PINBALL · UNBOUND</span></footer>
 </main>
}
const MOVEMENT_PRESETS:Record<string,Partial<Config>>={
 "INSTRUCTOR 142 CLASSIC":{weaveEnabled:0,moveSpeed:222.7,response:13,stopDrag:.002,slideDrag:.12,slideSpeed:689.15949375,slideDuration:.63,cameraZoom:1.85},
 "GOD MODE WEAVE":{weaveEnabled:1,moveSpeed:262,response:13,stopDrag:.002,slideDrag:.12,dashSpeed:470,dashDuration:.12,doubleTapWindow:.26,slideSpeed:690,slideDuration:.68,slideSustain:520,slideSteer:11.5,slideSteerAngle:.70,slideSteerResponse:8.5,slideBrake:14.5,slideCancelSpeed:195},
 "AKIRA AGILE":{weaveEnabled:1,moveSpeed:262,dashSpeed:500,dashDuration:.13,doubleTapWindow:.30,slideSpeed:690,slideDuration:.62,slideSustain:500,slideSteer:10.5,slideSteerAngle:.78,slideSteerResponse:10,slideBrake:13.5,slideCancelSpeed:185},
 "GEARS WEIGHT":{weaveEnabled:1,moveSpeed:262,dashSpeed:350,dashDuration:.18,doubleTapWindow:.26,slideSpeed:610,slideDuration:.82,slideSustain:260,slideSteer:4.5,slideSteerAngle:.42,slideSteerResponse:5,slideBrake:6.5,slideCancelSpeed:115},
 "HIGH-SKILL WEAVE":{weaveEnabled:1,moveSpeed:262,dashSpeed:455,dashDuration:.11,doubleTapWindow:.23,slideSpeed:720,slideDuration:.66,slideSustain:560,slideSteer:12.5,slideSteerAngle:.68,slideSteerResponse:11,slideBrake:15.5,slideCancelSpeed:205}
};
function Director({cfg,patch,applyPreset,save,load,note}:{cfg:Config;applyPreset:(name:string)=>Promise<void>;patch:(k:keyof Config,v:number)=>void;save:()=>void;load:()=>void;note:string}){const rows:[keyof Config,string,number,number,number][]=[
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
 if(p.coverId&&p.coverAnchor){const exposed=p.input?.coverAim||p.fireState>0||p.recoil>0||p.returnToCover>0;return exposed?(p.gunFacing??p.aim??0):Math.atan2(p.coverAnchor.ny,p.coverAnchor.nx)}
 if(p.input?.fire||p.fireState>0)return p.gunFacing??p.aim??0;
 return family==="run"&&speed>55?Math.atan2(p.vy,p.vx):(p.gunFacing??p.aim??0);
}
function spriteRegistration(family:string){return{groundAnchor:{x:.5,y:family==="cover"?.86:.88}}}
function SpriteInspector({s}:{s:any}){const p=s?.players?.[0]||{},speed=Math.hypot(p.vx||0,p.vy||0),family=p.coverId?"cover":p.slide>0||p.pinball>0||p.knock>.32||p.exit?"slide":p.brake>0?"ready":speed>34?"run":"ready",angle=spriteFacing(p,family,speed),dir=((Math.round(angle/(Math.PI*2)*24)%24)+24)%24,state=p.gripCoverId?"PSYCHIC CARRY":p.gripId?"MATTER GRIP":p.exit?"EDGE-DASH":p.coverId?(p.coverMode==="soft"?"SOFT COVER":p.input?.coverAim?(p.peekEdge?"BRACED CORNER AIM":"BRACED AIM"):"BRACED"):p.brake>0?"KINETIC BRAKE":p.slide>0?"SLIDE":p.dash>0?"BOOST DASH":family.toUpperCase();return <aside className="spritePanel"><div className="panelTitle"><span>SPRITE WORKSHOP</span><b>RUNTIME INSPECTOR</b></div><dl><dt>STATE</dt><dd>{state}</dd><dt>DIRECTION</dt><dd>d{String(dir).padStart(2,"0")} · {Math.round(dir*15)}°</dd><dt>SPRITE</dt><dd>{family}-d{String(dir).padStart(2,"0")}.webp</dd><dt>SPEED</dt><dd>{Math.round(speed)}</dd><dt>COVER</dt><dd>{p.coverId||"FREE"}</dd><dt>STATUS</dt><dd>{p.gripCoverId?"GRIP POSE FALLBACK":"APPROVED RUNTIME"}</dd><dt>PRESENTATION QA</dt><dd>UNSUPPORTED AIM {presentationQA.unsupportedCoverAim} · EXACT MISS {presentationQA.missingExact}</dd></dl><p>Slide to catch soft cover; point away to walk off. A locks hard brace. LT plants feet and exposes; release LT retracts while staying braced. A + left stick kicks away. Hold LB grips the attached block; release drops it. RT while holding throws. Release RT before shooting again.</p></aside>}
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
function draw(canvas:HTMLCanvasElement|null,s:any,received:number,mouseState:{x:number;y:number;down:boolean},keyState:Record<string,boolean>,psychicPreview=-1,coverPreview=-1){if(!canvas)return;const g=canvas.getContext("2d")!,sx=canvas.width/1000,sy=canvas.height/620;g.setTransform(sx,0,0,sy,0,0);g.fillStyle="#070b10";g.fillRect(0,0,1000,620);if(!s)return;
 const renderNow=performance.now();s=presentation(s,renderNow);const cfg=s.config||DEFAULT,p=s.players[0],local={...p};if(psychicPreview>=0){local.psychicPreview=psychicPreview;local.charging=false;local.powerFlash=local.powerReturn=0;}if(coverPreview>=0){local.coverPreview=coverPreview;local.charging=false;local.powerFlash=local.powerReturn=0;}
 const zoom=Math.max(1.25,Math.min(2.15,cfg.cameraZoom||1.85)),look=0,lookY=0,ga=local.gunFacing??local.aim??0;
 const halfW=500/zoom,halfH=310/zoom,targetX=Math.max(halfW,Math.min(1000-halfW,local.x+Math.cos(ga)*look)),targetY=Math.max(halfH,Math.min(620-halfH,local.y+Math.sin(ga)*lookY));
 if(!cameraState.ready){cameraState.x=targetX;cameraState.y=targetY;cameraState.ready=true}
 const frameDt=cameraState.last?Math.min(.05,(renderNow-cameraState.last)/1000):1/60;cameraState.last=renderNow;const follow=1-Math.exp(-8*frameDt);cameraState.x+=(targetX-cameraState.x)*follow;cameraState.y+=(targetY-cameraState.y)*follow;
 const camX=cameraState.x,camY=cameraState.y;
 g.setTransform(sx*zoom,0,0,sy*zoom,(500-camX*zoom)*sx,(310-camY*zoom)*sy);
 g.strokeStyle="#162733";g.lineWidth=1/zoom;for(let x=50;x<1000;x+=50){g.beginPath();g.moveTo(x,70);g.lineTo(x,560);g.stroke()}for(let y=90;y<570;y+=40){g.beginPath();g.moveTo(50,y);g.lineTo(950,y);g.stroke()}g.strokeStyle="#31505c";g.strokeRect(70,90,860,460);g.fillStyle="#aeb7bd";g.font=`${Math.max(8,12/zoom)}px monospace`;g.fillText("INSTRUCTOR 142 CLASSIC // CLOSE COMBAT CAMERA",82,112);
 const travelLen=Math.hypot(local.vx||0,local.vy||0),tx=travelLen?(local.vx/travelLen):0,ty=travelLen?(local.vy/travelLen):0;
 const now=renderNow,echoDt=frameDt;
 const fullSlide=local.slide>0;
 if(fullSlide&&!slideWasActive){const angle=local.slideFacing||0;graffiti={word:slideWord++%2,originX:local.x+Math.cos(angle)*8,originY:local.y+Math.sin(angle)*4,angle,age:0,life:.78}}
 slideWasActive=fullSlide;
 if(graffiti){graffiti.age+=frameDt;graffiti.life-=frameDt;if(graffiti.life<=0)graffiti=null}
 for(const mark of hoverWake)mark.age-=frameDt;
 while(hoverWake.length&&hoverWake[0].age<=0)hoverWake.shift();
 const hoverEnergy=powerAura(local),lastWake=hoverWake[hoverWake.length-1];
 if(hoverEnergy>.05&&travelLen>20&&(!lastWake||Math.hypot(local.x-lastWake.x,local.y-lastWake.y)>10)){hoverWake.push({x:local.x,y:local.y,age:.65,strength:hoverEnergy});if(hoverWake.length>24)hoverWake.shift()}
 for(const mark of hoverWake){g.save();g.globalAlpha=mark.age/.65*mark.strength*.65;g.strokeStyle="#ff41b8";g.shadowColor="#ff41b8";g.shadowBlur=9;g.lineWidth=2;g.beginPath();g.ellipse(mark.x,mark.y+5,20,6,0,0,Math.PI*2);g.stroke();g.strokeStyle="#67f5ff";g.beginPath();g.moveTo(mark.x-11,mark.y+4);g.lineTo(mark.x+9,mark.y+7);g.stroke();g.restore()}
 for(const mark of floorWake)mark.age-=frameDt;
 while(floorWake.length&&floorWake[0].age<=0)floorWake.shift();
 for(const e of kineticEcho){if(!fullSlide){const follow=1-Math.exp(-17*frameDt);e.x+=(local.x-e.x)*follow;e.y+=(local.y-e.y)*follow;e.life-=frameDt}else e.life=Math.max(e.life,.3)}
 while(kineticEcho.length&&(kineticEcho[0].life<=0||Math.hypot(kineticEcho[0].x-local.x,kineticEcho[0].y-local.y)<3))kineticEcho.shift();
 const echoActive=local.slide>0||local.dash>0||local.kickStage&&local.kickStage!=="none"||travelLen>360;
 if(fullSlide&&travelLen>60&&(!kineticEcho.length||Math.hypot(local.x-kineticEcho[kineticEcho.length-1].x,local.y-kineticEcho[kineticEcho.length-1].y)>30)){const family=local.slide>0||local.kickStage&&local.kickStage!=="none"?"slide":"run",angle=family==="slide"?(local.slideFacing||Math.atan2(local.vy,local.vx)):Math.atan2(local.vy,local.vx),dir=((Math.round(angle/(Math.PI*2)*24)%24)+24)%24,im=nearest(family,dir)||nearest("ready",dir),sourceCell=im?(im.naturalWidth%250===0&&im.naturalHeight%250===0?250:125):125,cols=im?Math.max(1,Math.floor(im.naturalWidth/sourceCell)):1,rows=im?Math.max(1,Math.floor(im.naturalHeight/sourceCell)):1,frames=Math.max(1,cols*rows),frame=family==="slide"&&local.slide>0?Math.min(frames-1,Math.max(0,Math.floor((1-local.slide/cfg.slideDuration)*frames))):Math.floor(s.time*10)%frames;kineticEcho.push({x:local.x,y:local.y,angle,family,dir,frame,life:.34,maxLife:.34,speed:travelLen});if(kineticEcho.length>3)kineticEcho.shift();echoLast=now}
 if(fullSlide&&travelLen>60){floorWake.push({x:local.x,y:local.y,angle:Math.atan2(local.vy,local.vx),age:.27});if(floorWake.length>18)floorWake.shift()}
 for(const mark of floorWake){g.save();g.translate(mark.x,mark.y);g.rotate(mark.angle);g.globalAlpha=mark.age/.27*.68;const ground=classicAssets.get("ground");if(ground)g.drawImage(ground,3*384,0,384,384,-48,-43,96,86);g.strokeStyle="#5ef0ff";g.shadowColor="#ff4bb9";g.shadowBlur=9;for(let n=0;n<3;n++){g.beginPath();g.moveTo(-14-n*5,-8+n*8);g.lineTo(-46-n*9,-13+n*11);g.stroke()}g.restore()}
 if(graffiti)classicGraffiti(g,classicAssets.get("graffiti"),graffiti,.94);
 let ix=(keyState.KeyD?1:0)-(keyState.KeyA?1:0),iy=(keyState.KeyS?1:0)-(keyState.KeyW?1:0);try{const pad=[...navigator.getGamepads()].find(Boolean) as Gamepad|undefined;if(pad){const dz=(v:number)=>Math.abs(v)<.18?0:v;ix=dz(pad.axes[0]||0);iy=dz(pad.axes[1]||0)}}catch{}const il=Math.hypot(ix,iy)||1;ix/=il;iy/=il;
 for(const e of kineticEcho){const im=nearest(e.family,e.dir)||nearest("ready",e.dir);if(!im)continue;const m=spriteCell(im,e.family,e.frame),fade=Math.max(0,e.life/e.maxLife),sc=cfg.spriteScale,displayCell=125,registration=spriteRegistration(e.family);g.save();g.globalAlpha=.22*fade;g.shadowBlur=10;g.shadowColor="#62edf0";g.drawImage(im,m.sx,m.sy,m.cell,m.cell,e.x-displayCell*registration.groundAnchor.x*sc-3*fade,e.y-displayCell*registration.groundAnchor.y*sc,displayCell*sc,displayCell*sc);g.shadowColor="#ff4aa5";g.globalAlpha=.13*fade;g.drawImage(im,m.sx,m.sy,m.cell,m.cell,e.x-displayCell*registration.groundAnchor.x*sc+4*fade,e.y-displayCell*registration.groundAnchor.y*sc,displayCell*sc,displayCell*sc);g.restore()}
 const heldCoverIds=new Set((s.players||[]).map((p:any)=>p.gripCoverId).filter(Boolean));
 // Draw solid scenery once, then depth-clip each actor against its actual projected faces.
 // A whole-block Y sort cannot describe a character beside a long or rotated wall.
 const covers=s.covers||[];
 [...covers].sort((a:any,b:any)=>(a.y+Math.abs(Math.sin(a.a||0))*a.w*.5+Math.abs(Math.cos(a.a||0))*a.h*.5)-(b.y+Math.abs(Math.sin(b.a||0))*b.w*.5+Math.abs(Math.cos(b.a||0))*b.h*.5)).forEach((c:any)=>cover(g,{...c,psychicHeld:heldCoverIds.has(c.id)},s.time));
 const actors=[
  ...(s.matter||[]).map((m:any)=>({y:m.y,fn:()=>matter(g,m)})),
  {y:local.y,fn:()=>fighter(g,local,s.time,cfg)}
 ].sort((a,b)=>a.y-b.y);
 actors.forEach(o=>withCoverOcclusion(g,covers,o.y,s.time,o.fn));


 for(const sh of s.shots||[]){g.strokeStyle="#caffff";g.lineWidth=3;g.beginPath();g.moveTo(sh.x+(sh.renderOffsetX||0),sh.y-(sh.z||0));g.lineTo(sh.x+(sh.renderOffsetX||0)-sh.vx*.025,sh.y-(sh.z||0)-sh.vy*.025);g.stroke()}for(const f of s.fx||[])if(f.type!=="slide")fx(g,f);
}
function nearest(f:string,d:number){for(let o=0;o<12;o++)for(const raw of o?[d+o,d-o]:[d]){const im=jade.get(`${f}-${((raw%24)+24)%24}`);if(im?.complete&&im.naturalWidth)return im}}
function exactSprite(f:string,d:number){const im=jade.get(`${f}-${((d%24)+24)%24}`);return im?.complete&&im.naturalWidth?im:undefined}
function safestSprite(f:string,d:number){
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
function coverPoseFrame(p:any,t:number,total:number){
 const extended=total===12;
 const pose=extended?{contact:[0,1,2],brace:4,lateral:[5,6],peek:7,fire:8,return:9}:{contact:[0,1],brace:1,lateral:[],peek:2,fire:3,return:4};
 if(total!==6&&total!==12)return 0;
 if(p.fireState>0||p.recoil>0)return pose.fire;
 if(p.returnToCover>0&&!p.input?.coverAim)return pose.return;
 if(p.coverMode==="braced"&&p.input?.coverAim)return pose.peek;
 if(p.contact>t){const elapsed=Math.max(0,.22-(p.contact-t));return pose.contact[Math.min(pose.contact.length-1,Math.floor(elapsed/.22*pose.contact.length))]}
 if(Math.abs(p.coverSpeed||0)>35&&pose.lateral.length)return pose.lateral[Math.floor(t*7)%pose.lateral.length];
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
 if(p.gripId||p.gripCoverId)return t-(p.psychicStartedAt??t)<.12?0:1;
 if((p.psychicReturnUntil||0)>t&&!p.input?.fire&&!p.input?.cover&&!p.input?.melee&&!p.input?.coverAim&&!p.coverId)return 2;
 return null;
}
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
 const dir=supportedCoverDir(p);
 if(dir!==3)return null;
 return p.fireState>0||p.recoil>0?1:0;
}
function drawCoverExposure(g:CanvasRenderingContext2D,p:any,cfg:Config){const frame=coverExposureFrame(p);if(frame===null)return false;const im=powerAssets.get("cover-d03-exposure-v1")!,[sx,sy,w,h]=COVER_EXPOSURE_RECTS[frame],[ax,ay]=COVER_EXPOSURE_ANCHORS[frame],unit=(125*143/250/638)*cfg.spriteScale;g.drawImage(im,sx,sy,w,h,p.x-(ax-sx)*unit,p.y-(ay-sy)*unit,w*unit,h*unit);return true;}
function coverConnectorFrame(p:any){
 if(!powerAssets.has("cover-d03-connectors-v1"))return null;
 if(p.coverPreview===0||p.coverPreview===1)return p.coverPreview;
 if(!p.coverId||p.coverMode!=="braced"||p.charging||p.powerFlash>0||p.powerReturn>0||p.knock>0||p.slide>0||p.dash>0||p.exit||p.gripId||p.gripCoverId||p.kickStage&&p.kickStage!=="none")return null;
 const angle=p.gunFacing??p.aim??0,dir=supportedCoverDir(p);
 if(dir!==3)return null;
 if(p.fireState>0||p.recoil>0)return 0;
 if(p.returnToCover>0&&!p.input?.coverAim)return 1;
 return null;
}
function drawCoverConnector(g:CanvasRenderingContext2D,p:any,cfg:Config){const frame=coverConnectorFrame(p);if(frame===null)return false;const im=powerAssets.get("cover-d03-connectors-v1")!,[sx,sy,w,h]=COVER_CONNECTOR_RECTS[frame],[ax,ay]=COVER_CONNECTOR_ANCHORS[frame],unit=(125*143/250/638)*cfg.spriteScale;g.drawImage(im,sx,sy,w,h,p.x-(ax-sx)*unit,p.y-(ay-sy)*unit,w*unit,h*unit);return true;}
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
function drawCoverNeighbor(g:CanvasRenderingContext2D,p:any,cfg:Config){
 const frame=coverNeighborFrame(p);if(frame===null)return false;
 const im=powerAssets.get("cover-d02-d04-exposure-v1")!,pose=COVER_NEIGHBOR_POSES[frame],[sx,sy,w,h]=pose.rect,[ax,ay]=pose.anchor,unit=125*143/250/445*cfg.spriteScale;
 g.save();g.beginPath();for(const [x,y,bw,bh] of pose.bands)g.rect(p.x+(x-ax)*unit,p.y+(y-ay)*unit,bw*unit,bh*unit);g.clip();
 g.drawImage(im,sx,sy,w,h,p.x+(sx-ax)*unit,p.y+(sy-ay)*unit,w*unit,h*unit);g.restore();return true;
}
function coverVisualOffset(p:any){
 if(!p.coverId||!p.coverAnchor)return{x:0,y:0};
 const a=p.coverAnchor,exposed=!!(p.input?.coverAim||p.fireState>0||p.recoil>0||p.returnToCover>0);
 // Presentation-only contact correction. Gameplay root/collision remains authoritative.
 // Keep exposed poses closer to authored anchor; tucked poses sit just outside the physical face.
 const push=exposed?1.5:3.25;
 return{x:a.nx*push,y:a.ny*push};
}
function fighter(g:CanvasRenderingContext2D,p:any,t:number,cfg:Config){const visual=coverVisualOffset(p);g.save();g.translate(visual.x,visual.y);const speed=Math.hypot(p.vx||0,p.vy||0),family=p.coverId?"cover":p.slide>0||p.pinball>0||p.knock>.32?"slide":speed>34?"run":"ready",angle=spriteFacing(p,family,speed),rawDir=((Math.round(angle/(Math.PI*2)*24)%24)+24)%24,d=p.coverId&&p.coverMode==="braced"&&p.input?.coverAim?supportedCoverDir(p):rawDir,im=safestSprite(family,d);
 const meta=im?spriteCell(im,family,0):{cell:125,cols:1,rows:1,frames:1,sx:0,sy:0},frames=meta.frames;let frame=family==="cover"?coverPoseFrame(p,t,frames):family==="ready"?0:Math.floor(t*(family==="run"?10:7))%frames;if(family==="slide"&&p.slide>0)frame=Math.min(frames-1,Math.max(0,Math.floor((1-p.slide/cfg.slideDuration)*frames)));const sc=cfg.spriteScale,displayCell=125,registration=spriteRegistration(family);
 g.fillStyle="#0008";g.beginPath();g.ellipse(p.x,p.y+6,25*sc,8*sc,0,0,Math.PI*2);g.fill();if(p.shield){g.strokeStyle="#65f4f2";g.shadowColor="#65f4f2";g.shadowBlur=18;g.lineWidth=4;g.beginPath();g.ellipse(p.x,p.y-34*sc,38*sc,55*sc,0,0,Math.PI*2);g.stroke();g.shadowBlur=0}const aura=powerAura(p);g.save();if(aura>0){g.shadowColor="#ff37b8";g.shadowBlur=18*aura;g.strokeStyle=`rgba(255,65,180,${aura*.7})`;g.lineWidth=2;g.beginPath();g.ellipse(p.x,p.y-(40+powerHover(p))*sc,32*sc,57*sc,0,0,Math.PI*2);g.stroke()}const alpha=powerPoseAlpha(p),hasPower=powerAssets.has("grounded-float-v1")||powerAssets.has(powerFrame(p,cfg)<6?"opening":"continuation"),poseAlpha=hasPower?alpha:0;
 const exposure=poseAlpha===0&&(drawCoverNeighbor(g,p,cfg)||drawCoverExposure(g,p,cfg));const connector=exposure||poseAlpha===0&&drawCoverConnector(g,p,cfg);const psychic=!connector&&poseAlpha===0&&drawPsychicPose(g,p,t,cfg);
 if(!connector&&!psychic&&im&&poseAlpha<1){const m=spriteCell(im,family,frame);g.globalAlpha=1-poseAlpha;g.imageSmoothingEnabled=true;g.imageSmoothingQuality="high";g.drawImage(im,m.sx,m.sy,m.cell,m.cell,p.x-displayCell*registration.groundAnchor.x*sc,p.y-displayCell*registration.groundAnchor.y*sc,displayCell*sc,displayCell*sc)}else if(!connector&&!psychic&&!im&&!poseAlpha){presentationQA.missingExact++}
 if(poseAlpha>0){g.globalAlpha=poseAlpha;drawPowerPose(g,p,cfg)}g.restore();
 g.strokeStyle="#ff4aa5";g.lineWidth=2;g.beginPath();g.ellipse(p.x,p.y+5,25,8,0,0,Math.PI*2);g.stroke();g.restore()}
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
function cover(g:CanvasRenderingContext2D,c:any,t:number){
 // Rotation is applied to the ground footprint; elevation stays vertical.
 // The lab's camera projection is already represented by this build's world coordinates.
 const im=classicAssets.get("concrete"),z=COVER_HEIGHT,w=c.w,h=c.h,co=Math.cos(c.a||0),si=Math.sin(c.a||0);
 const project=(x:number,y:number,height:number)=>({x:x*co-y*si,y:x*si+y*co-height});
 const footprint=[[-w/2,-h/2],[w/2,-h/2],[w/2,h/2],[-w/2,h/2]];
 const ground=footprint.map(([x,y])=>project(x,y,0)),top=footprint.map(([x,y])=>project(x,y,z));
 const stage=c.hp/c.maxHp>=.875?0:c.hp/c.maxHp>=.375?1:2;
 const formation=c.generated&&typeof c.born==="number"?classicClamp((t-c.born)/.72,0,1):1;
 g.save();g.translate(c.x,c.y);
 g.fillStyle="#0008";g.beginPath();g.ellipse(0,7,w*.53,h*.6,c.a||0,0,Math.PI*2);g.fill();
 if(c.psychicHeld){g.shadowColor="#ff4aa5";g.shadowBlur=18}
 const sides=[
  {kind:"back",p:[top[0],top[1],ground[1],ground[0]],fill:"#343b40"},
  {kind:"right",p:[top[1],top[2],ground[2],ground[1]],fill:"#454c51"},
  {kind:"left",p:[top[0],top[3],ground[3],ground[0]],fill:"#30383d"},
  {kind:"front",p:[top[3],top[2],ground[2],ground[3]],fill:"#697176"}
 ];
 sides.sort((a,b)=>a.p.reduce((sum,p)=>sum+p.y,0)-b.p.reduce((sum,p)=>sum+p.y,0));
 if(formation<1){g.globalAlpha=Math.max(.07,formation*.85);g.filter=`blur(${Math.round((1-formation)*5)}px)`}
 for(const face of sides)concreteFace(g,im,CONCRETE_FACES[face.kind][stage],face.p,face.fill);
 concreteFace(g,im,CONCRETE_FACES.top[stage],top,"#899196");g.filter="none";g.globalAlpha=1;g.shadowBlur=0;
 // Original lab cap seams, fastening holes, and edge wear.
 g.strokeStyle="#111a20";g.lineWidth=1.25;g.fillStyle="#141e23";
 for(const fraction of [-.48,.48]){const a=project(w/2*fraction,-h/2,z+.4),b=project(w/2*fraction,h/2,z+.4);g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke()}
 for(const side of [-1,1])for(const fraction of [-.73,.73]){const p=project(w/2*fraction,side*h/2*.7,z+1);g.beginPath();g.arc(p.x,p.y,1.8,0,Math.PI*2);g.fill();g.strokeStyle="#9caeb2";g.lineWidth=.55;g.stroke()}
 g.strokeStyle="#111a20";g.lineWidth=1.1;g.globalAlpha=.7;
 for(const side of [-1,1])for(const fraction of [-.55,.3]){const p=project(side*w/2,fraction*h/2,z*.68);g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x+side*3,p.y+z*.11);g.lineTo(p.x+side*1.4,p.y+z*.2);g.stroke()}
 g.globalAlpha=1;
 if(formation<1)for(let n=0;n<38;n++){const a=n*2.399+t*2,r=(1-formation)*(55+n%6*24)*w/332;g.fillStyle=n%2?"#ff4ca5":"#6af2ff";g.fillRect(Math.cos(a)*r,-z*.55+Math.sin(a)*r*.52,2.4,2.4)}
 g.restore();
}
function matter(g:CanvasRenderingContext2D,m:any){g.save();g.translate(m.x,m.y);g.rotate((m.x+m.y)*.015);g.fillStyle=m.kind==="metal"?"#536f82":"#86766e";g.strokeStyle=m.heldBy!==null?"#62f0f0":m.orbitBy!==null?"#ff4aaa":"#d8d5cf";g.lineWidth=3;g.shadowColor=g.strokeStyle;g.shadowBlur=m.heldBy!==null||m.orbitBy!==null?14:0;g.beginPath();for(let i=0;i<7;i++){const a=i*Math.PI*2/7,r=m.r*(i%2?.74:1);i?g.lineTo(Math.cos(a)*r,Math.sin(a)*r):g.moveTo(Math.cos(a)*r,Math.sin(a)*r)}g.closePath();g.fill();g.stroke();g.restore()}
function fx(g:CanvasRenderingContext2D,f:any){
 if(["soft-cover","cover-slam","brace","cover-block"].includes(f.type)){
  const fade=classicClamp(f.life/.25,0,1);g.save();g.translate(f.x,f.y);g.globalAlpha=fade*.55;g.strokeStyle=f.type==="cover-block"?"#ff78ac":"#74dfe6";g.lineWidth=1;
  g.beginPath();g.ellipse(0,2,7+(1-fade)*4,3,0,0,Math.PI*2);g.stroke();g.restore();return;
 }
 g.save();g.translate(f.renderOffsetX||0,-(f.z||0));g.globalAlpha=Math.min(1,f.life*4);if(f.type==="slide"||f.type==="dash"||f.type==="brake"){g.strokeStyle=f.type==="dash"?"#63eff1":f.type==="brake"?"#fff1a8":"#ff4aa5";g.shadowColor=g.strokeStyle;g.shadowBlur=f.type==="brake"?14:7;g.lineWidth=f.type==="brake"?4:f.type==="slide"?3:2;const count=f.type==="brake"?6:f.type==="slide"?5:3;for(let i=0;i<count;i++){const dir=f.type==="brake"?1:-1;g.beginPath();g.moveTo(f.x+dir*(8+i*5),f.y+5+i*2);g.lineTo(f.x+dir*((f.type==="slide"?58:42)+i*9),f.y+10+i*3);g.stroke()}g.shadowBlur=0;if(f.text){g.fillStyle="#d9ffff";g.font="900 italic 18px Arial";g.fillText(f.text,f.x-18,f.y-18)}}else{g.strokeStyle=f.type==="pinball"?"#ff4aaa":f.type==="muzzle"?"#fff2a0":"#64edf0";g.lineWidth=3;for(let i=0;i<8;i++){const a=i*Math.PI/4,r=10+(1-f.life)*25;g.beginPath();g.moveTo(f.x,f.y);g.lineTo(f.x+Math.cos(a)*r,f.y+Math.sin(a)*r);g.stroke()}}g.restore()}

function arrow(g:CanvasRenderingContext2D,x1:number,y1:number,x2:number,y2:number){const a=Math.atan2(y2-y1,x2-x1);g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();g.beginPath();g.moveTo(x2,y2);g.lineTo(x2-Math.cos(a-.55)*11,y2-Math.sin(a-.55)*11);g.lineTo(x2-Math.cos(a+.55)*11,y2-Math.sin(a+.55)*11);g.closePath();g.fill()}


