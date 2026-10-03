"use client";
import {useCallback,useEffect,useRef,useState} from "react";

type Session={room:string;code?:string;token:string;slot:number};
type Config={weaveEnabled:number;moveSpeed:number;response:number;stopDrag:number;slideDrag:number;dashSpeed:number;dashDuration:number;doubleTapWindow:number;slideSpeed:number;slideDuration:number;slideSustain:number;slideSteer:number;slideSteerAngle:number;slideSteerResponse:number;slideBrake:number;slideCancelSpeed:number;shotCadence:number;shotSpread:number;shotDamage:number;shotSpeed:number;throwForce:number;pinballSpeed:number;pinballDuration:number;maxHealth:number;spriteScale:number;cameraZoom:number};
const DEFAULT:Config={weaveEnabled:0,moveSpeed:222.7,response:13,stopDrag:.002,slideDrag:.12,dashSpeed:410,dashDuration:.16,doubleTapWindow:.28,slideSpeed:552.5,slideDuration:.63,slideSustain:360,slideSteer:7.5,slideSteerAngle:.62,slideSteerResponse:7,slideBrake:9.5,slideCancelSpeed:150,shotCadence:.48,shotSpread:.04,shotDamage:10,shotSpeed:820,throwForce:720,pinballSpeed:830,pinballDuration:.5,maxHealth:100,spriteScale:.82,cameraZoom:1.85};
const EMPTY:any={x:0,y:0,aim:0,fire:false,shield:false,coverAim:false,slide:false,melee:false,heavy:false,grip:false,throwMatter:false,cover:false,orbit:false,launchOrbit:false,pinball:false,slow:false};
const keyAction:Record<string,string>={ShiftLeft:"slide",ShiftRight:"slide",KeyF:"melee",KeyC:"heavy",KeyQ:"grip",KeyR:"throwMatter",KeyB:"cover",KeyO:"orbit",KeyP:"launchOrbit",Space:"pinball",KeyX:"slow"};
const jade=new Map<string,HTMLImageElement>();
type EchoFrame={x:number;y:number;angle:number;family:string;dir:number;frame:number;life:number;maxLife:number;speed:number};
const kineticEcho:EchoFrame[]=[];let echoLast=0;
const CLASSIC_LETTERS=[[[0,.225],[.21,.445],[.425,.635],[.605,.815],[.785,1]],[[0,.235],[.215,.41],[.385,.565],[.535,.73],[.7,.89],[.855,1]]];
const classicClamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
const classicAssets=new Map<string,HTMLImageElement>();
const floorWake:{x:number;y:number;angle:number;age:number}[]=[];
let slideWasActive=false,slideWord=0,graffiti:any=null;
function classicGraffiti(e:CanvasRenderingContext2D,t:HTMLImageElement|undefined,n:any,r=1){if(!t?.complete||!t.naturalWidth||n.life<=0)return;let i=CLASSIC_LETTERS[n.word],a=t.naturalHeight/2,o=Math.cos(n.angle),s=Math.sin(n.angle)*.58,c=classicClamp(n.age/.22,0,1),l=classicClamp(n.life/.24,0,1),u=1-Math.min(1,n.age/.2);e.save(),e.globalCompositeOperation=`screen`,e.translate(n.originX,n.originY-8),e.globalAlpha=r*l,e.shadowColor=`#75f6ff`,e.shadowBlur=11,e.strokeStyle=`#f8fbff`,e.lineWidth=1.3,e.beginPath(),e.arc(0,0,5+u*13,0,Math.PI*2),e.stroke();for(let t=0;t<7;t++){let i=t*2.399+n.angle,a=(8+t%3*5)*(1-u*.45);e.fillStyle=t%2?`#ff57b6`:`#72f7ff`,e.globalAlpha=r*l*(.35+u*.55),e.fillRect(Math.cos(i)*a-1,Math.sin(i)*a*.58-1,2+t%2,2+t%2)}for(let u=0;u<i.length;u++){let d=classicClamp((n.age-u*.032)/.16,0,1);if(d<=0)continue;let[f,p]=i[u],m=Math.round(f*t.naturalWidth),h=Math.max(1,Math.round((p-f)*t.naturalWidth)),g=h/a,_=27+u%2,v=classicClamp(g*_*.72,18,29),y=10+c*24+u*15,b=o*y,x=s*y-23-Math.sin(d*Math.PI)*4,ee=1+(1-d)*.28;e.save(),e.translate(b,x),e.rotate(Math.sin(n.angle)*.1),e.shadowColor=u%2?`#ff4eae`:`#67f5ff`,e.shadowBlur=8;for(let i=2;i>0;i--)e.globalAlpha=r*l*d*(.08+i*.035),e.drawImage(t,m,n.word*a,h,a,-v/2-o*i*7,-_/2-s*i*7,v*ee,_);e.globalAlpha=r*l*d*.95,e.drawImage(t,m,n.word*a,h,a,-v/2,-_/2,v*ee,_),e.strokeStyle=u%2?`#ff4eae`:`#67f5ff`,e.lineWidth=1.2,e.globalAlpha=r*l*d*.62,e.beginPath(),e.moveTo(-v*.4-o*4,-s*4),e.lineTo(-v*.4-o*(14+d*8),-s*(14+d*8)),e.stroke(),e.restore()}let d=classicClamp(n.age/.055,0,1),f=n.age<.34?1:classicClamp((.56-n.age)/.22,0,1);if(f>0){let i=1-(1-d)**3,c=n.word?104:94,l=n.word?29:28,u=o*(5+i*8),p=-9+s*(3+i*6)-i*4;e.save(),e.globalCompositeOperation=`source-over`,e.translate(u,p),e.rotate(Math.sin(n.angle)*.045),e.scale(.78+i*.22,.78+i*.22),e.globalAlpha=r*f,e.shadowColor=`#05070c`,e.shadowBlur=3,e.filter=`contrast(1.32) saturate(1.25)`,e.drawImage(t,0,n.word*a,t.naturalWidth,a,-c/2,-l/2,c,l),e.filter=`none`,e.shadowColor=n.word?`#ff48ad`:`#63f4ff`,e.shadowBlur=7,e.globalAlpha=r*f*.42,e.drawImage(t,0,n.word*a,t.naturalWidth,a,-c/2,-l/2,c,l),e.restore()}e.restore()}
let cameraState={x:500,y:310,ready:false,last:0};let loading=false;
const snapshots:{state:any;at:number}[]=[];
function recordSnapshot(s:any,at:number){snapshots.push({state:s,at});if(snapshots.length>20)snapshots.shift()}
function presentation(s:any,now:number){
 if(snapshots.length<2)return s;
 const target=now-100;
 while(snapshots.length>2&&snapshots[1].at<=target)snapshots.shift();
 const a=snapshots[0],b=snapshots[1],blend=Math.max(0,Math.min(1,(target-a.at)/Math.max(1,b.at-a.at)));
 const mix=(xs:any[],ys:any[])=>ys.map(y=>{const x=xs.find(x=>x.id===y.id);return x?{...y,x:x.x+(y.x-x.x)*blend,y:x.y+(y.y-x.y)*blend}:y});
 const players=b.state.players.map((p:any,n:number)=>{const q=a.state.players[n];return q?{...p,x:q.x+(p.x-q.x)*blend,y:q.y+(p.y-q.y)*blend}:p});
 return {...b.state,time:a.state.time+(b.state.time-a.state.time)*blend,players,covers:mix(a.state.covers||[],b.state.covers||[]),matter:mix(a.state.matter||[],b.state.matter||[])};
}
function preload(){if(loading||typeof Image==="undefined")return;loading=true;for(const [key,path] of [["graffiti","/assets/dimension33-map/slide-graffiti-skeet-skurt-v2.png"],["ground","/assets/shotgun-v57-ground-effects.png"]]){const im=new Image();im.onload=()=>classicAssets.set(key,im);im.src="https://jade-v1-combat-lab-v142.leslieadams-isrh.chatgpt.site"+path}for(const family of ["ready","run","slide","cover"])for(let d=0;d<24;d++){const im=new Image();im.onload=()=>jade.set(`${family}-${d}`,im);const n=(family==="run"||family==="slide")&&d===3?`${family}.webp`:`${family}-d${String(d).padStart(2,"0")}.webp`;im.src="https://god-helmet-arcade.leslieadams-isrh.chatgpt.site/assets/shotgun-complete/runtime/"+n}}

export default function Game(){
 const canvas=useRef<HTMLCanvasElement>(null),session=useRef<Session|null>(null),state=useRef<any>(null),seq=useRef(0),keys=useRef<Record<string,boolean>>({}),edges=useRef<Record<string,boolean>>({}),mouse=useRef({x:500,y:310,down:false}),lastAccept=useRef(performance.now()),started=useRef(false);
 const [hud,setHud]=useState<any>(null),[status,setStatus]=useState("BOOTING"),[director,setDirector]=useState(false),[spritePanel,setSpritePanel]=useState(false),[config,setConfig]=useState<Config>(DEFAULT),[note,setNote]=useState(""),[padStatus,setPadStatus]=useState("CONTROLLER: WAITING"),[padGate,setPadGate]=useState(true),[testPass,setTestPass]=useState<Record<string,boolean>>({});
 const post=useCallback(async(body:any)=>{const r=await fetch("/api/game",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)}),v=await r.json();if(!r.ok)throw Error(v.error||"Request failed");return v},[]);
 const accept=useCallback((v:any)=>{if(v.state){if(state.current&&v.state.round===state.current.round&&v.state.lastAt<=state.current.lastAt)return;const at=performance.now();if(state.current&&v.state.round!==state.current.round){snapshots.length=0;kineticEcho.length=0;cameraState.ready=false}recordSnapshot(v.state,at);state.current=v.state;lastAccept.current=at;setHud(v.state);setConfig(v.state.config||DEFAULT);setStatus("COMBAT MASTER LIVE")}},[]);
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
 useEffect(()=>{let pending=false;const timer=setInterval(async()=>{const s=session.current,g=state.current;if(!s||!g||pending)return;pending=true;const p=g.players[0],i:any={...EMPTY};i.x=(keys.current.KeyD?1:0)-(keys.current.KeyA?1:0);i.y=(keys.current.KeyS?1:0)-(keys.current.KeyW?1:0);i.aim=Math.atan2(mouse.current.y-p.y,mouse.current.x-p.x);i.fire=mouse.current.down;i.shield=!!keys.current.KeyE;i.coverAim=!!keys.current.KeyZ;for(const[k,a]of Object.entries(keyAction))i[a]=!!edges.current[k];edges.current={};
  try{const pad=[...navigator.getGamepads()].find(Boolean) as Gamepad|undefined;if(pad){const dz=(v:number)=>Math.abs(v)<.18?0:v;i.x=dz(pad.axes[0]||0);i.y=dz(pad.axes[1]||0);const rx=dz(pad.axes[2]||0),ry=dz(pad.axes[3]||0);if(rx||ry)i.aim=Math.atan2(ry,rx);i.slide||=pad.buttons[0]?.pressed;/* A = slide / vault / cover movement */
i.melee||=pad.buttons[1]?.pressed;/* B = melee / interact — V142 authority */
i.slow||=pad.buttons[2]?.pressed;/* X = Slow Time */
i.grip||=pad.buttons[3]?.pressed;/* Y temporarily keeps Grip until weapon wheel is restored */
i.shield||=pad.buttons[4]?.pressed;/* LB = shield */
i.cover||=pad.buttons[5]?.pressed;/* RB = create cover */
i.coverAim||=pad.buttons[6]?.pressed;/* LT = braced exposure / aim */
i.fire||=pad.buttons[7]?.pressed;/* RT = fire */
i.orbit||=pad.buttons[12]?.pressed;
i.launchOrbit||=pad.buttons[13]?.pressed;
i.heavy||=pad.buttons[14]?.pressed;
i.throwMatter||=pad.buttons[15]?.pressed;
/* Pinball intentionally has no controller binding until its certified V142 slot is recovered. */}}catch{}
  try{accept(await post({action:"input",...s,seq:++seq.current,input:i}))}catch{}finally{pending=false}
 },33);return()=>clearInterval(timer)},[accept,post]);
 useEffect(()=>{let id=0;const loop=()=>{draw(canvas.current,state.current,lastAccept.current,mouse.current,keys.current);id=requestAnimationFrame(loop)};id=requestAnimationFrame(loop);return()=>cancelAnimationFrame(id)},[]);
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
   <div className="minimalHud"><b>HP {Math.ceil(p?.hp||100)}</b><span className="padLine">{config.weaveEnabled<.5?"CLASSIC · A SLIDE":"WEAVE EXPERIMENT · A DOUBLE-TAP SLIDE"}</span><i style={{width:`${p?.battery||100}%`}}/><span>BATTERY {Math.ceil(p?.battery||100)}%</span><span className="padLine">{padStatus}</span></div>
   {padGate&&<button className="controllerGate" onClick={activateController}>ACTIVATE XBOX CONTROLLER<small>Tap once, then press A or move a stick</small></button>}
   <div className="toolbar"><button onClick={()=>setDirector(v=>!v)}>DIRECTOR</button><button onClick={()=>setSpritePanel(v=>!v)}>SPRITES</button><button onClick={reset}>RESET LAB</button></div>
   {director&&<aside className="trainingDirector"><div className="panelTitle"><span>TRAINING DIRECTOR</span><b>{config.weaveEnabled<.5?"INSTRUCTOR 142 CLASSIC":"GOD MODE WEAVE TEST"}</b></div>
    <p>{config.weaveEnabled<.5?<><strong>1.</strong> A · baseball slide<br/><strong>2.</strong> Contact cover · soft catch<br/><strong>3.</strong> Feather stick · flow around connected edges<br/><strong>4.</strong> Pull away · immediate release<br/><strong>5.</strong> A while soft · hard brace<br/><strong>6.</strong> Hold LT · expose/aim/fire<br/><strong>7.</strong> A while braced · kick / edge burst into slide<br/><strong>8.</strong> Y near concrete · rip/carry<br/><strong>9.</strong> D-pad → · throw concrete</>:<><strong>1.</strong> Tap A once · upright boost<br/><strong>2.</strong> Double-tap A · full slide<br/><strong>3.</strong> Hold forward · sustain<br/><strong>4.</strong> Lean 20–30° · curve<br/><strong>5.</strong> Pull opposite · brake<br/><strong>6.</strong> Touch cover · soft attach<br/><strong>7.</strong> Tap A again · brace<br/><strong>8.</strong> Hold LT · expose/aim/fire</>}</p>
    <div className="testGrid">{tests.map(([name])=>{const pass=!!testPass[name];return <div key={name} className={pass?"pass":""}><span>{name}</span><b>{pass?"PASS":"NOT DETECTED"}</b></div>})}</div><button className="resetTests" onClick={()=>setTestPass({})}>RESET TESTS</button>
   </aside>}
   {director&&<aside className="spriteLab"><div className="panelTitle"><span>SPRITE LAB</span><b>RUNTIME ROUTING · KINETIC ECHO</b></div>{(()=>{const info=spriteLabInfo(hud);return <dl><dt>STATE</dt><dd>{info.state}</dd><dt>FAMILY</dt><dd>{info.family.toUpperCase()}</dd><dt>DIRECTION</dt><dd>d{String(info.dir).padStart(2,"0")} · {info.angleDeg}°</dd><dt>FRAME</dt><dd>{info.frame} / {info.total}</dd><dt>FILE</dt><dd>{info.file}</dd><dt>TARGET</dt><dd>{info.expected}</dd><dt>FALLBACK</dt><dd className={info.fallback?"warn":"ok"}>{info.fallback?"YES — ART MISSING":"NO"}</dd></dl>})()}</aside>}
   {director&&<Director cfg={config} patch={patch} applyPreset={applyMovementPreset} save={save} load={load} note={note}/>}
   {spritePanel&&<SpriteInspector s={hud}/>}
  </div>
  <footer><span>LS MOVE</span><span>GUN FACING = SHOT DIRECTION</span><span>{config.weaveEnabled<.5?"A SLIDE · BRACE · KICK":"A TAP BOOST · DOUBLE-TAP SLIDE"}</span><span>B MELEE</span><span>X SLOW TIME</span><span>Y GRIP / RIP COVER</span><span>LB SHIELD</span><span>RB BUILD COVER</span><span>LT BRACED AIM</span><span>RT FIRE</span><span>D-PAD ↑ ORBIT</span><span>D-PAD ↓ LAUNCH</span><span>D-PAD → THROW MATTER/COVER</span><span>PINBALL · UNBOUND</span></footer>
 </main>
}
const MOVEMENT_PRESETS:Record<string,Partial<Config>>={
 "INSTRUCTOR 142 CLASSIC":{weaveEnabled:0,moveSpeed:222.7,response:13,stopDrag:.002,slideDrag:.12,slideSpeed:552.5,slideDuration:.63,cameraZoom:1.85},
 "GOD MODE WEAVE":{weaveEnabled:1,moveSpeed:262,response:13,stopDrag:.002,slideDrag:.12,dashSpeed:470,dashDuration:.12,doubleTapWindow:.26,slideSpeed:690,slideDuration:.68,slideSustain:520,slideSteer:11.5,slideSteerAngle:.70,slideSteerResponse:8.5,slideBrake:14.5,slideCancelSpeed:195},
 "AKIRA AGILE":{weaveEnabled:1,moveSpeed:262,dashSpeed:500,dashDuration:.13,doubleTapWindow:.30,slideSpeed:690,slideDuration:.62,slideSustain:500,slideSteer:10.5,slideSteerAngle:.78,slideSteerResponse:10,slideBrake:13.5,slideCancelSpeed:185},
 "GEARS WEIGHT":{weaveEnabled:1,moveSpeed:262,dashSpeed:350,dashDuration:.18,doubleTapWindow:.26,slideSpeed:610,slideDuration:.82,slideSustain:260,slideSteer:4.5,slideSteerAngle:.42,slideSteerResponse:5,slideBrake:6.5,slideCancelSpeed:115},
 "HIGH-SKILL WEAVE":{weaveEnabled:1,moveSpeed:262,dashSpeed:455,dashDuration:.11,doubleTapWindow:.23,slideSpeed:720,slideDuration:.66,slideSustain:560,slideSteer:12.5,slideSteerAngle:.68,slideSteerResponse:11,slideBrake:15.5,slideCancelSpeed:205}
};
function Director({cfg,patch,applyPreset,save,load,note}:{cfg:Config;applyPreset:(name:string)=>Promise<void>;patch:(k:keyof Config,v:number)=>void;save:()=>void;load:()=>void;note:string}){const rows:[keyof Config,string,number,number,number][]=[
 ["moveSpeed","MOVE SPEED",180,360,1],["response","ACCEL / RESPONSE",5,22,.5],["dashSpeed","BOOST DASH SPEED",280,620,5],["dashDuration","BOOST DASH DURATION",.08,.28,.01],["doubleTapWindow","DOUBLE-TAP WINDOW",.16,.42,.01],["slideSpeed","SLIDE SPEED",420,850,5],["slideDrag","SLIDE DRAG",.03,.35,.01],["slideDuration","SLIDE DURATION",.35,1.05,.01],["slideSustain","SLIDE SUSTAIN THRUST",0,700,10],["slideSteer","SLIDE STEERING",1,14,.25],["slideSteerAngle","MAX STEER ANGLE",.20,1.05,.01],["slideSteerResponse","STEER RESPONSE",2,14,.25],["slideBrake","KINETIC BRAKE",2,18,.25],["slideCancelSpeed","STAND-UP SPEED",70,260,5],["shotCadence","SHOT CADENCE",.18,.8,.01],["shotSpread","SHOT SPREAD",.01,.09,.002],["shotDamage","PELLET DAMAGE",2,24,1],["throwForce","MATTER THROW",350,1100,10],["pinballSpeed","PINBALL SPEED",500,1200,10],["spriteScale","JADE SCALE",.55,1.25,.01],["cameraZoom","CAMERA ZOOM",1.25,2.15,.01]];
 const presetMatches=(name:string)=>Object.entries(MOVEMENT_PRESETS[name]).every(([k,v])=>Math.abs(cfg[k as keyof Config]-Number(v))<.001);
 return <aside className="director"><div className="panelTitle"><span>DIRECTOR MODE</span><b>LIVE COMBAT CONFIG</b></div>
 <div className="presetGrid">{Object.keys(MOVEMENT_PRESETS).map(name=><button key={name} aria-pressed={presetMatches(name)} className={presetMatches(name)?"recommended":""} onClick={()=>applyPreset(name)}>{name}{name==="INSTRUCTOR 142 CLASSIC"?<small>MECHANICAL AUTHORITY</small>:null}</button>)}</div>
 <p className="presetHint">Start with INSTRUCTOR 142 CLASSIC. This is the recovered movement/cover authority. GOD MODE WEAVE remains an experiment for later A/B testing.</p>
 {rows.map(([k,l,min,max,step])=><label key={k}><span>{l}<output>{Number(cfg[k]).toFixed(step<.1?2:0)}</output></span><input type="range" min={min} max={max} step={step} value={cfg[k]} onChange={e=>patch(k,Number(e.target.value))}/></label>)}<div className="actions"><button onClick={save}>SAVE PRESET</button><button onClick={load}>LOAD PRESET</button></div>{note&&<em>{note}</em>}<p>These values update the authoritative solo simulation live. No rebuild required.</p></aside>}
function SpriteInspector({s}:{s:any}){const p=s?.players?.[0]||{},speed=Math.hypot(p.vx||0,p.vy||0),family=p.coverId?"cover":p.slide>0||p.pinball>0||p.knock>.32||p.exit?"slide":p.brake>0?"ready":speed>34?"run":"ready",angle=family==="slide"?p.slideFacing:family==="run"&&speed>55?Math.atan2(p.vy,p.vx):(p.gunFacing??p.aim??0),dir=((Math.round(angle/(Math.PI*2)*24)%24)+24)%24,state=p.exit?"EDGE-DASH":p.coverId?(p.coverMode==="soft"?"SOFT COVER":p.input?.coverAim?(p.peekEdge?"BRACED CORNER AIM":"BRACED AIM"):"BRACED"):p.brake>0?"KINETIC BRAKE":p.slide>0?"SLIDE":p.dash>0?"BOOST DASH":family.toUpperCase();return <aside className="spritePanel"><div className="panelTitle"><span>SPRITE WORKSHOP</span><b>RUNTIME INSPECTOR</b></div><dl><dt>STATE</dt><dd>{state}</dd><dt>DIRECTION</dt><dd>d{String(dir).padStart(2,"0")} · {Math.round(dir*15)}°</dd><dt>SPRITE</dt><dd>{family}-d{String(dir).padStart(2,"0")}.webp</dd><dt>SPEED</dt><dd>{Math.round(speed)}</dd><dt>COVER</dt><dd>{p.coverId||"FREE"}</dd><dt>STATUS</dt><dd>APPROVED RUNTIME</dd></dl><p>Slide into a cover face to attach. Move along it to shimmy. Aim around/outside the cover to peek. Press Slide + direction at an edge to kick or wrap around it.</p></aside>}
function spriteLabInfo(s:any){const p=s?.players?.[0]||{},speed=Math.hypot(p.vx||0,p.vy||0);
 let state="READY",family="ready",fallback=false,expected="READY";
 if(p.exit){state="COVER_EXIT";family="slide";expected="COVER_EXIT";fallback=true}
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
 const angle=family==="slide"?(p.slideFacing||0):state==="BOOST_DASH"||state==="RUN"?Math.atan2(p.vy||0,p.vx||0):(p.gunFacing??p.aim??0);
 const dir=((Math.round(angle/(Math.PI*2)*24)%24)+24)%24;
 const im=nearest(family,dir)||nearest("ready",dir);
 const sourceCell=im?(im.naturalWidth%250===0&&im.naturalHeight%250===0?250:125):125;
 const cols=im?Math.max(1,Math.floor(im.naturalWidth/sourceCell)):1,rows=im?Math.max(1,Math.floor(im.naturalHeight/sourceCell)):1,total=Math.max(1,cols*rows);
 const frame=family==="ready"?0:Math.floor((s?.time||0)*(family==="run"?10:7))%total;
 return{state,family,dir,angleDeg:Math.round(dir*15),frame:frame+1,total,file:`${family}-d${String(dir).padStart(2,"0")}.webp`,fallback,expected}}
function draw(canvas:HTMLCanvasElement|null,s:any,received:number,mouseState:{x:number;y:number;down:boolean},keyState:Record<string,boolean>){if(!canvas)return;const g=canvas.getContext("2d")!,sx=canvas.width/1000,sy=canvas.height/620;g.setTransform(sx,0,0,sy,0,0);g.fillStyle="#070b10";g.fillRect(0,0,1000,620);if(!s)return;
 const renderNow=performance.now();s=presentation(s,renderNow);const cfg=s.config||DEFAULT,p=s.players[0],local={...p};
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
 for(const e of kineticEcho){const im=nearest(e.family,e.dir)||nearest("ready",e.dir);if(!im)continue;const m=spriteCell(im,e.family,e.frame),fade=Math.max(0,e.life/e.maxLife),sc=cfg.spriteScale,displayCell=125;g.save();g.globalAlpha=.22*fade;g.shadowBlur=10;g.shadowColor="#62edf0";g.drawImage(im,m.sx,m.sy,m.cell,m.cell,e.x-displayCell*.5*sc-3*fade,e.y-displayCell*.88*sc,displayCell*sc,displayCell*sc);g.shadowColor="#ff4aa5";g.globalAlpha=.13*fade;g.drawImage(im,m.sx,m.sy,m.cell,m.cell,e.x-displayCell*.5*sc+4*fade,e.y-displayCell*.88*sc,displayCell*sc,displayCell*sc);g.restore()}
 const heldCoverIds=new Set((s.players||[]).map((p:any)=>p.gripCoverId).filter(Boolean));
 const drawables=[
  ...(s.covers||[]).map((c:any)=>({
   y:c.y+Math.abs(Math.sin(c.a||0))*c.w*.5+Math.abs(Math.cos(c.a||0))*c.h*.5,
   fn:()=>cover(g,{...c,psychicHeld:heldCoverIds.has(c.id)})
  })),
  ...(s.matter||[]).map((m:any)=>({y:m.y,fn:()=>matter(g,m)})),
  {y:local.y,fn:()=>fighter(g,local,s.time,cfg)}
 ].sort((a,b)=>a.y-b.y);
 drawables.forEach(o=>o.fn());


 for(const sh of s.shots||[]){g.strokeStyle="#caffff";g.lineWidth=3;g.beginPath();g.moveTo(sh.x,sh.y);g.lineTo(sh.x-sh.vx*.025,sh.y-sh.vy*.025);g.stroke()}for(const f of s.fx||[])if(f.type!=="slide")fx(g,f);
}
function nearest(f:string,d:number){for(let o=0;o<12;o++)for(const raw of o?[d+o,d-o]:[d]){const im=jade.get(`${f}-${((raw%24)+24)%24}`);if(im)return im}}
function spriteCell(im:HTMLImageElement,family:string,frame:number){
 const cell=im.naturalWidth%250===0&&im.naturalHeight%250===0?250:125;
 const cols=Math.max(1,Math.floor(im.naturalWidth/cell)),rows=Math.max(1,Math.floor(im.naturalHeight/cell)),frames=Math.max(1,cols*rows),fr=((frame%frames)+frames)%frames;
 return{cell,cols,rows,frames,sx:(fr%cols)*cell,sy:Math.floor(fr/cols)*cell}
}
function fighter(g:CanvasRenderingContext2D,p:any,t:number,cfg:Config){const speed=Math.hypot(p.vx||0,p.vy||0),family=p.coverId?"cover":p.slide>0||p.pinball>0||p.knock>.32?"slide":speed>34?"run":"ready",angle=family==="slide"?p.slideFacing:family==="run"&&speed>55?Math.atan2(p.vy,p.vx):p.aim||0,d=((Math.round(angle/(Math.PI*2)*24)%24)+24)%24,im=nearest(family,d)||nearest("ready",d);
 const meta=im?spriteCell(im,family,0):{cell:125,cols:1,rows:1,frames:1,sx:0,sy:0},frames=meta.frames;let frame=family==="ready"?0:Math.floor(t*(family==="run"?10:7))%frames;if(family==="slide"&&p.slide>0)frame=Math.min(frames-1,Math.max(0,Math.floor((1-p.slide/cfg.slideDuration)*frames)));const sc=cfg.spriteScale,displayCell=125;
 g.fillStyle="#0008";g.beginPath();g.ellipse(p.x,p.y+6,25*sc,8*sc,0,0,Math.PI*2);g.fill();if(p.shield){g.strokeStyle="#65f4f2";g.shadowColor="#65f4f2";g.shadowBlur=18;g.lineWidth=4;g.beginPath();g.ellipse(p.x,p.y-34*sc,38*sc,55*sc,0,0,Math.PI*2);g.stroke();g.shadowBlur=0}if(im){const m=spriteCell(im,family,frame);g.imageSmoothingEnabled=true;g.imageSmoothingQuality="high";g.drawImage(im,m.sx,m.sy,m.cell,m.cell,p.x-displayCell*.5*sc,p.y-displayCell*.88*sc,displayCell*sc,displayCell*sc)}else{g.strokeStyle="#ff4aa5";g.strokeRect(p.x-18,p.y-70,36,70)}
 g.strokeStyle="#ff4aa5";g.lineWidth=2;g.beginPath();g.ellipse(p.x,p.y+5,25,8,0,0,Math.PI*2);g.stroke()}
function cover(g:CanvasRenderingContext2D,c:any){
 g.save();g.translate(c.x,c.y);g.rotate(c.a||0);
 const variant=(c.variant||0)%4,profiles=[
  {z:66,bevel:12,top:"#39434d",front:"#202b34",side:"#151d25",edge:"#8e9aa4"},
  {z:78,bevel:18,top:"#30434b",front:"#18313a",side:"#10242b",edge:"#69edf0"},
  {z:58,bevel:9,top:"#473b47",front:"#2d2130",side:"#1d151f",edge:"#ff62ad"},
  {z:86,bevel:15,top:"#3b3d46",front:"#242730",side:"#171922",edge:"#a7b4c2"}
 ][variant];
 const w=c.w,h=c.h,z=profiles.z,b=profiles.bevel,build=c.generated?Math.max(0,Math.min(1,1-(c.build||0))):1;
 g.fillStyle="#0009";g.beginPath();g.ellipse(0,h/2+12,w*.44,12,0,0,Math.PI*2);g.fill();
 g.globalAlpha=c.generated?.35+.65*build:1;g.shadowColor=c.generated?profiles.edge:"#000";g.shadowBlur=c.generated?16:6;
 g.fillStyle=profiles.front;g.strokeStyle=c.psychicHeld?"#62edf0":profiles.edge;g.lineWidth=c.psychicHeld?4:2.5;if(c.psychicHeld){g.shadowColor="#ff4aa5";g.shadowBlur=20}
 g.beginPath();g.moveTo(-w/2,-h/2-z+b);g.lineTo(-w/2+b,-h/2-z);g.lineTo(w/2-b,-h/2-z);g.lineTo(w/2,-h/2-z+b);g.lineTo(w/2,h/2);g.lineTo(-w/2,h/2);g.closePath();g.fill();g.stroke();
 g.fillStyle=profiles.top;g.beginPath();g.moveTo(-w/2+b,-h/2-z);g.lineTo(w/2-b,-h/2-z);g.lineTo(w/2,h/2-z+b*.35);g.lineTo(-w/2,h/2-z+b*.35);g.closePath();g.fill();g.stroke();
 g.fillStyle=profiles.side;g.beginPath();g.moveTo(w/2,-h/2-z+b);g.lineTo(w/2,h/2-z+b*.35);g.lineTo(w/2,h/2);g.lineTo(w/2,-h/2);g.closePath();g.fill();g.stroke();
 g.globalAlpha*=.7;g.strokeStyle=c.generated?"#d3ffff":"#12161b";g.lineWidth=2;
 for(let n=0;n<2+variant;n++){g.beginPath();g.moveTo(-w*.36+n*w*.2,-z*.35-n*4);g.lineTo(w*.28+n*5,-z*.52+n*3);g.stroke()}
 if(c.generated&&build<1){g.globalAlpha=.9-build*.4;g.strokeStyle="#c97cff";g.shadowColor="#c97cff";g.shadowBlur=14;for(let n=0;n<6;n++){const a=n*Math.PI/3+build*2,r=22+(1-build)*52;g.beginPath();g.moveTo(Math.cos(a)*r,Math.sin(a)*r*.45-z*.35);g.lineTo(Math.cos(a)*r*1.18,Math.sin(a)*r*.55-z*.35);g.stroke()}}
 g.restore()
}
function matter(g:CanvasRenderingContext2D,m:any){g.save();g.translate(m.x,m.y);g.rotate((m.x+m.y)*.015);g.fillStyle=m.kind==="metal"?"#536f82":"#86766e";g.strokeStyle=m.heldBy!==null?"#62f0f0":m.orbitBy!==null?"#ff4aaa":"#d8d5cf";g.lineWidth=3;g.shadowColor=g.strokeStyle;g.shadowBlur=m.heldBy!==null||m.orbitBy!==null?14:0;g.beginPath();for(let i=0;i<7;i++){const a=i*Math.PI*2/7,r=m.r*(i%2?.74:1);i?g.lineTo(Math.cos(a)*r,Math.sin(a)*r):g.moveTo(Math.cos(a)*r,Math.sin(a)*r)}g.closePath();g.fill();g.stroke();g.restore()}
function fx(g:CanvasRenderingContext2D,f:any){g.save();g.globalAlpha=Math.min(1,f.life*4);if(f.type==="slide"||f.type==="dash"||f.type==="brake"){g.strokeStyle=f.type==="dash"?"#63eff1":f.type==="brake"?"#fff1a8":"#ff4aa5";g.shadowColor=g.strokeStyle;g.shadowBlur=f.type==="brake"?14:7;g.lineWidth=f.type==="brake"?4:f.type==="slide"?3:2;const count=f.type==="brake"?6:f.type==="slide"?5:3;for(let i=0;i<count;i++){const dir=f.type==="brake"?1:-1;g.beginPath();g.moveTo(f.x+dir*(8+i*5),f.y+5+i*2);g.lineTo(f.x+dir*((f.type==="slide"?58:42)+i*9),f.y+10+i*3);g.stroke()}g.shadowBlur=0;if(f.text){g.fillStyle="#d9ffff";g.font="900 italic 18px Arial";g.fillText(f.text,f.x-18,f.y-18)}}else{g.strokeStyle=f.type==="pinball"?"#ff4aaa":f.type==="muzzle"?"#fff2a0":"#64edf0";g.lineWidth=3;for(let i=0;i<8;i++){const a=i*Math.PI/4,r=10+(1-f.life)*25;g.beginPath();g.moveTo(f.x,f.y);g.lineTo(f.x+Math.cos(a)*r,f.y+Math.sin(a)*r);g.stroke()}}g.restore()}

function arrow(g:CanvasRenderingContext2D,x1:number,y1:number,x2:number,y2:number){const a=Math.atan2(y2-y1,x2-x1);g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();g.beginPath();g.moveTo(x2,y2);g.lineTo(x2-Math.cos(a-.55)*11,y2-Math.sin(a-.55)*11);g.lineTo(x2-Math.cos(a+.55)*11,y2-Math.sin(a+.55)*11);g.closePath();g.fill()}
