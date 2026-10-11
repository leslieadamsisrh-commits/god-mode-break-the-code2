"use client";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import {LocalCombat} from "../../../../lib/localCombat";
type Buttons={up:boolean;down:boolean;left:boolean;right:boolean;slide:boolean;fire:boolean;shield:boolean};
const INITIAL:Buttons={up:false,down:false,left:false,right:false,slide:false,fire:false,shield:false};
export default function RaptorSparring(){
 const canvas=useRef<HTMLCanvasElement>(null);
 const controls=useRef<Buttons>({...INITIAL});
 const sim=useRef<LocalCombat|null>(null);
 const [status,setStatus]=useState("Starting isolated local simulation...");
 const [padStatus,setPadStatus]=useState("Xbox controller: press A to activate");
 const padStatusRef=useRef("");
 const lastAim=useRef(0);
 const [skin,setSkin]=useState<"raptor"|"jade">("raptor");
 const skinRef=useRef(skin);
 useEffect(()=>{skinRef.current=skin},[skin]);
 useEffect(()=>{
  let raf=0,alive=true;const keys:Record<string,keyof Buttons>={KeyW:"up",ArrowUp:"up",KeyS:"down",ArrowDown:"down",KeyA:"left",ArrowLeft:"left",KeyD:"right",ArrowRight:"right",Space:"slide",KeyJ:"fire",KeyK:"shield"};
  const down=(e:KeyboardEvent)=>{const k=keys[e.code];if(k){e.preventDefault();controls.current[k]=true}};
  const up=(e:KeyboardEvent)=>{const k=keys[e.code];if(k){e.preventDefault();controls.current[k]=false}};
  window.addEventListener("keydown",down);window.addEventListener("keyup",up);
  const gamepadEvent=()=>{padStatusRef.current="";};
  window.addEventListener("gamepadconnected",gamepadEvent);
  window.addEventListener("gamepaddisconnected",gamepadEvent);
  try{
   const local=new LocalCombat("RAPTOR LAB","practice",performance.now());
   sim.current=local;
   try{local.command({token:local.token,room:local.room,action:"start"})}catch{}
   setStatus("Shared local combat simulation active — visual placeholder only");
  }catch(e){setStatus("Simulation unavailable: "+(e instanceof Error?e.message:"unknown error"))}
  function frame(now:number){
   if(!alive)return;
   const c=canvas.current,local=sim.current;
   if(c&&local){
    const g=c.getContext("2d");if(g){
     const b=controls.current;
     const pads=typeof navigator.getGamepads==="function"?Array.from(navigator.getGamepads()):[];
     const pad=pads.find(p=>p&&p.connected)||null;
     const dz=(v:number)=>Math.abs(v)<.18?0:v;
     const pressed=(n:number)=>!!(pad?.buttons[n]?.pressed||((pad?.buttons[n]?.value||0)>.5));
     const lx=pad?dz(pad.axes[0]||0):0,ly=pad?dz(pad.axes[1]||0):0;
     const rx=pad?dz(pad.axes[2]||0):0,ry=pad?dz(pad.axes[3]||0):0;
     if(rx||ry)lastAim.current=Math.atan2(ry,rx);
     const nextPadStatus=pad?"Xbox controller detected: "+pad.id.slice(0,55):"No controller detected — press A on Xbox pad, then tap this page";
     if(nextPadStatus!==padStatusRef.current){padStatusRef.current=nextPadStatus;setPadStatus(nextPadStatus);}
     const input={x:Math.max(-1,Math.min(1,lx+Number(b.right)-Number(b.left))),y:Math.max(-1,Math.min(1,ly+Number(b.down)-Number(b.up))),aim:lastAim.current,fire:b.fire||pressed(7),slide:b.slide||pressed(0),shield:b.shield||pressed(6),coverAim:false,melee:pressed(1),heavy:false,grip:pressed(4),throwMatter:false,cover:pressed(5),orbit:false,launchOrbit:false,pinball:false,powerup:pressed(3),slow:false};
     try{local.frame(now,input,[])}catch(e){setStatus("Simulation paused: "+(e instanceof Error?e.message:"unknown error"));sim.current=null}
     const w=c.width,h=c.height;g.fillStyle="#091521";g.fillRect(0,0,w,h);
     g.strokeStyle="#254051";g.lineWidth=1;for(let x=0;x<w;x+=40){g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke()}for(let y=0;y<h;y+=40){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke()}
     const p=local.state.players[0];
     if(p){const px=w/2+(p.x-500)*.55,py=h/2+(p.y-330)*.45;g.save();g.translate(px,py);
      g.fillStyle="#02060988";g.beginPath();g.ellipse(0,14,24,7,0,0,Math.PI*2);g.fill();
      const isR=skinRef.current==="raptor";g.fillStyle=isR?"#879452":"#dce5f4";g.strokeStyle=isR?"#ff4ba7":"#5ee6f4";g.lineWidth=3;
      g.beginPath();g.ellipse(0,-9,13,21,.25,0,Math.PI*2);g.fill();g.stroke();
      g.fillStyle=isR?"#d6d5d2":"#f35aaf";g.fillRect(-10,-20,20,9);
      if(isR){g.strokeStyle="#a1a64d";g.lineWidth=9;g.beginPath();g.moveTo(-8,0);g.quadraticCurveTo(-34,-18,-44,-38);g.stroke();g.fillStyle="#a8aa57";g.fillRect(7,-24,20,9);g.fillStyle="#f54478";g.fillRect(18,-22,5,4)}
      g.strokeStyle="#10141a";g.lineWidth=7;g.beginPath();g.moveTo(6,-10);g.lineTo(29,-10);g.stroke();
      if(input.shield){g.strokeStyle="#6feafa";g.lineWidth=4;g.beginPath();g.arc(0,-8,31,-1.4,1.4);g.stroke()}
      g.restore();
      g.fillStyle="#fff";g.font="12px monospace";g.fillText("SHARED PHYSICS • "+(skinRef.current==="raptor"?"RAPTOR PLACEHOLDER":"JADE PLACEHOLDER"),12,22);
      g.fillText("x "+p.x.toFixed(0)+"  y "+p.y.toFixed(0)+"  speed "+Math.hypot(p.vx,p.vy).toFixed(0),12,40);
      g.fillText("slide "+p.slide.toFixed(2)+"   shield "+(p.shield?"ON":"OFF"),12,58);
     }
    }
   }
   raf=requestAnimationFrame(frame);
  }
  raf=requestAnimationFrame(frame);
  return()=>{alive=false;cancelAnimationFrame(raf);window.removeEventListener("keydown",down);window.removeEventListener("keyup",up);window.removeEventListener("gamepadconnected",gamepadEvent);window.removeEventListener("gamepaddisconnected",gamepadEvent);sim.current?.pause();sim.current=null};
 },[]);
 const touch=(key:keyof Buttons)=>(e:React.PointerEvent<HTMLButtonElement>)=>{e.preventDefault();controls.current[key]=true;e.currentTarget.setPointerCapture(e.pointerId)};
 const release=(key:keyof Buttons)=>(e:React.PointerEvent<HTMLButtonElement>)=>{e.preventDefault();controls.current[key]=false};
 const btn=(key:keyof Buttons,label:string)=><button onPointerDown={touch(key)} onPointerUp={release(key)} onPointerCancel={release(key)} onLostPointerCapture={()=>controls.current[key]=false} style={{minHeight:56,minWidth:70,background:"#203b4c",border:"1px solid #6edce9",color:"white",borderRadius:10,fontWeight:800,touchAction:"none"}}>{label}</button>;
 return <main style={{position:"fixed",inset:0,overflowY:"auto",background:"#070c15",color:"#e9f7fb",fontFamily:"Arial,sans-serif",padding:"max(14px,env(safe-area-inset-top)) 14px 30px",touchAction:"pan-y"}}>
 <div style={{maxWidth:900,margin:"0 auto"}}><small style={{color:"#ff64b2"}}>GOD MODE / RAPTOR COMBAT LAB / EXPERIMENT</small><h1 style={{margin:"10px 0"}}>MOVEMENT SPARRING TEST</h1>
 <p role="status" style={{color:"#74e8ef",fontWeight:800}}>{padStatus}</p><p style={{color:"#a5c3cf"}}>{status}. This tests a character placeholder against the existing local combat simulation. Approved raptor artwork and a second fighter are not yet installed.</p>
 <div style={{display:"flex",gap:8,marginBottom:12}}><button onClick={()=>setSkin("raptor")} style={{padding:12,background:skin==="raptor"?"#84305c":"#263744",color:"white",border:0,borderRadius:8}}>RAPTOR</button><button onClick={()=>setSkin("jade")} style={{padding:12,background:skin==="jade"?"#84305c":"#263744",color:"white",border:0,borderRadius:8}}>JADE</button></div>
 <canvas ref={canvas} width={800} height={420} style={{display:"block",width:"100%",height:"auto",aspectRatio:"800/420",border:"2px solid #385c6e",borderRadius:10}}/>
 <div style={{display:"flex",justifyContent:"space-between",gap:12,flexWrap:"wrap",marginTop:12}}>
 <div style={{display:"grid",gridTemplateColumns:"repeat(3,70px)",gap:5}}><span/>{btn("up","▲")}<span/>{btn("left","◀")}{btn("down","▼")}{btn("right","▶")}</div>
 <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>{btn("slide","SLIDE")}{btn("fire","FIRE")}{btn("shield","SHIELD")}</div>
 </div>
 <p style={{fontSize:12,color:"#8faab8"}}>Keyboard: WASD / arrows, Space slide, J fire, K shield. Touch and Xbox Gamepad API input supported in this prototype. B melee, LB Grip, RB cover, Y charge. This is not yet the full versus mode.</p>
 <Link href="/studio/combat" style={{color:"#ff79b7",display:"block",padding:15}}>← COMBAT LAB</Link></div></main>;
}
