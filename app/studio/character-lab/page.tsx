"use client";
import {useState,useEffect} from "react";
import Game from "../../Game";
import {preloadRaptorSprites,getRaptorAnimationTrace,clearRaptorAnimationTrace} from "../../../lib/raptorSpriteOnly";
type Fighter="jade"|"raptor";
export default function CombatLab(){
 const [artReady,setArtReady]=useState<boolean|null>(null);
 useEffect(()=>{void preloadRaptorSprites().then(setArtReady)},[]);
 const [fighter,setFighter]=useState<Fighter|null>(null),[reset,setReset]=useState(0);
 const [pace,setPace]=useState(1);
 const [trace,setTrace]=useState("");
 useEffect(()=>{if(fighter!=="raptor")return;const timer=setInterval(()=>setTrace(getRaptorAnimationTrace()),250);return ()=>clearInterval(timer)},[fighter]);
 const button={padding:"18px 20px",background:"#14283a",border:"2px solid #5a8394",borderRadius:12,color:"#f5fbff",font:"bold 19px Arial",cursor:"pointer",touchAction:"manipulation" as const};
 if(fighter)return <main style={{position:"fixed",inset:0,background:"#080f1a"}}>
  <Game combatLab key={fighter+reset} character={fighter} cameraPreset="kinetic" labPace={fighter==="raptor"?pace:1}/>
  {fighter==="raptor"&&<details style={{position:"fixed",right:12,top:145,zIndex:2147483647,maxHeight:"55vh",overflow:"auto",background:"#08101be8",color:"#b7e5ef",padding:8,font:"12px monospace"}}><summary>Animation trace</summary><button onClick={()=>clearRaptorAnimationTrace()}>Clear trace</button><pre>{trace}</pre></details>}
  <div style={{position:"fixed",right:12,top:12,zIndex:2147483647,display:"flex",gap:8}}>
   {fighter==="raptor"&&<label style={{fontSize:12,color:"#e9f3fa",background:"#14283a",padding:8,borderRadius:8}}>Keyboard / touch pace <select aria-label="Keyboard and touch pace" value={pace} onChange={e=>setPace(Number(e.target.value))} style={{padding:6,background:"#243b4d",color:"white"}}><option value={.25}>Stalk</option><option value={.55}>Jog</option><option value={1}>Full</option></select></label>}
   <button style={{...button,fontSize:12,padding:12}} onClick={()=>setReset(n=>n+1)}>RESET</button>
   <button style={{...button,fontSize:12,padding:12}} onClick={()=>setFighter(null)}>CHANGE FIGHTER</button>
  </div>
 </main>;
 return <main style={{minHeight:"100vh",background:"#08101b",color:"#f5fbff",fontFamily:"Arial",padding:"max(25px,env(safe-area-inset-top)) 20px"}}>
  <div style={{maxWidth:800,margin:"auto"}}>
   <a href="/studio" style={{color:"#89e9f2"}}>← BACK TO STUDIO</a>
   <p style={{color:"#ff8d9e",letterSpacing:2,fontSize:12}}>GOD MODE / BUILD 39T7.7 PLAYTEST</p>
   <h1>COMBAT LAB</h1>
   <a href="/raptor-animation-review.html" style={{color:"#89e9f2"}}>Review all run and slide frames</a>
   <p>Both fighters use the newer XYZ combat engine. This is a test build, not a production character unlock.</p>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:14,marginTop:25}}>
    <button style={button} onClick={()=>setFighter("jade")}>JADE <small style={{display:"block",fontWeight:400,marginTop:10}}>Existing gameplay baseline</small></button>
    <button disabled={artReady!==true} style={{...button,borderColor:"#ff925e",opacity:artReady?1:.5}} onClick={()=>setFighter("raptor")}>RAPTOR V2 <small style={{display:"block",fontWeight:400,marginTop:10}}>{artReady===null?"Loading Raptor artwork…":artReady?"Front-diagonal gait pilots · Other views under review":"Artwork failed to load — reload to retry"}</small></button>
   </div>
   <p style={{color:"#f5bf8e",fontSize:13,marginTop:24}}>Standing now has dedicated artwork in all eight directions. Left, right, front-left, and front-right movement have dedicated stalk and jog cycles; the other four slow directions remain provisional. Sprint continuity and firing-effect alignment are still under review. Use the pace selector with keyboard or touch to review the transitions. Controller stick pressure remains analog. Moving fire follows aim.</p>
  </div>
 </main>;
}
