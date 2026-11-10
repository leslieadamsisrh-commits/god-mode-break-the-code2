"use client";
import {useState,useEffect} from "react";
import Game from "../../Game";
import type {RaptorCoverDrill} from "../../../lib/game";
import {loadRaptorSprite,preloadRaptorSprites,getRaptorAnimationTrace,clearRaptorAnimationTrace} from "../../../lib/raptorSpriteOnly";
type Fighter="jade"|"raptor";
const lowReadyFrame="cover-hold/front-right/001.png";
const matchFrame="idle/right/000.png";
export default function CombatLab(){
 const [lowReady,setLowReady]=useState<boolean|null>(null),[matchReady,setMatchReady]=useState<boolean|null>(null);
 const [artAttempt,setArtAttempt]=useState(0);
 useEffect(()=>{
  let active=true;
  const low=loadRaptorSprite(lowReadyFrame,artAttempt>0).then(ready=>{if(active)setLowReady(ready)});
  const match=loadRaptorSprite(matchFrame,artAttempt>0).then(ready=>{if(active)setMatchReady(ready)});
  if(artAttempt===0)void Promise.all([low,match]).then(()=>{if(active)void preloadRaptorSprites()});
  return ()=>{active=false};
 },[artAttempt]);
 const [fighter,setFighter]=useState<Fighter|null>(null),[reset,setReset]=useState(0);
 const [pace,setPace]=useState(1);
 const [lowCover,setLowCover]=useState(false);
 const [drill,setDrill]=useState<RaptorCoverDrill|null>(null);
 const [diagnostics,setDiagnostics]=useState(false);
 const [trace,setTrace]=useState("");
 useEffect(()=>{if(fighter!=="raptor")return;const timer=setInterval(()=>setTrace(getRaptorAnimationTrace()),250);return ()=>clearInterval(timer)},[fighter]);
 const button={padding:"18px 20px",background:"#14283a",border:"2px solid #5a8394",borderRadius:12,color:"#f5fbff",font:"bold 19px Arial",cursor:"pointer",touchAction:"manipulation" as const};
 if(fighter)return <main style={{position:"fixed",inset:0,background:"#080f1a"}}>
  <Game combatLab labLowCover={lowCover} labCoverDrill={drill??undefined} labCoverDiagnostics={!!drill&&diagnostics} key={fighter+reset} character={fighter} cameraPreset="kinetic" labPace={fighter==="raptor"?pace:1}/>
  {fighter==="raptor"&&<details style={{position:"fixed",right:12,top:145,zIndex:2147483647,maxHeight:"55vh",overflow:"auto",background:"#08101be8",color:"#b7e5ef",padding:8,font:"12px monospace"}}><summary>Animation trace</summary><button onClick={()=>clearRaptorAnimationTrace()}>Clear trace</button><pre>{trace}</pre></details>}
  <div style={{position:"fixed",right:12,top:12,zIndex:2147483647,display:"flex",gap:8}}>
   {drill&&<button style={{...button,fontSize:12,padding:12}} aria-pressed={diagnostics} onClick={()=>setDiagnostics(v=>!v)}>COVER DEBUG</button>}
   {fighter==="raptor"&&<label style={{fontSize:12,color:"#e9f3fa",background:"#14283a",padding:8,borderRadius:8}}>Keyboard / touch pace <select aria-label="Keyboard and touch pace" value={pace} onChange={e=>setPace(Number(e.target.value))} style={{padding:6,background:"#243b4d",color:"white"}}><option value={.25}>Stalk</option><option value={.55}>Jog</option><option value={1}>Full</option></select></label>}
   <button style={{...button,fontSize:12,padding:12}} onClick={()=>setReset(n=>n+1)}>RESET</button>
   <button style={{...button,fontSize:12,padding:12}} onClick={()=>{setLowCover(false);setDrill(null);setFighter(null)}}>CHANGE FIGHTER</button>
  </div>
 </main>;
 return <main style={{minHeight:"100vh",background:"#08101b",color:"#f5fbff",fontFamily:"Arial",padding:"max(25px,env(safe-area-inset-top)) 20px"}}>
  <div style={{maxWidth:800,margin:"auto"}}>
   <a href="/studio" style={{color:"#89e9f2"}}>← BACK TO STUDIO</a>
   <p style={{color:"#ff8d9e",letterSpacing:2,fontSize:12}}>GOD MODE / BUILD 39T15 COVER DRILL</p>
   <h1>PSYCHIC COVER COMBAT</h1>
   <a href="/raptor-proportion-review.html" style={{color:"#89e9f2"}}>Review proportions beside Jade</a><br/>
   <a href="/raptor-animation-review.html" style={{color:"#89e9f2"}}>Review movement and jump phases</a>
   <p>Both fighters use the newer XYZ combat engine. This is a test build, not a production character unlock.</p>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:14,marginTop:25}}>
    <button style={button} onClick={()=>setFighter("jade")}>PLAY JADE VS BOT <small style={{display:"block",fontWeight:400,marginTop:10}}>Shared cover controls · Existing Jade artwork</small></button>
    <button disabled={lowReady!==true} style={{...button,borderColor:"#89e9f2",opacity:lowReady?1:.5}} onClick={()=>{setLowCover(true);setFighter("raptor")}}>TRY NEW RAPTOR SPRITE <small style={{display:"block",fontWeight:400,marginTop:10}}>{lowReady===null?"Loading the opening pose…":lowReady?"Starts braced in low cover · Center the sticks and release LT":"Opening pose unavailable"}</small></button>
    <button disabled={matchReady!==true} style={{...button,borderColor:"#ff925e",opacity:matchReady?1:.5}} onClick={()=>setFighter("raptor")}>PLAY RAPTOR VS BOT <small style={{display:"block",fontWeight:400,marginTop:10}}>{matchReady===null?"Loading the opening pose…":matchReady?"Start a match · Existing RIFT HUNTER opponent":"Opening pose unavailable"}</small></button>
   </div>
   <h2>Raptor cover drills</h2>
   <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
    {([["shuffle","COVER SHUFFLE DRILL"],["wrap","TALL WRAP DRILL"],["rotated-wrap","ROTATED TALL WRAP"]] as const).map(([mode,label])=>
     <button key={mode} disabled={matchReady!==true} style={{...button,fontSize:14,opacity:matchReady?1:.5}} onClick={()=>{clearRaptorAnimationTrace();setDrill(mode);setFighter("raptor")}}>{label}</button>)}
   </div>
   <p style={{fontSize:14}}>Shuffle drill. Move right and tap A to attach. Center the stick and tap A to brace, then move up and down along the rail. Stop to return to hold.</p>
   <p style={{fontSize:14}}>Tall drill. Move toward the wall and tap A, center the stick and tap A to brace, then shuffle to an end. Aim past the end with the right stick. Hold LT to peek, tap RT to fire, and release LT to tuck back in. Reset restores the same wall and start position.</p>
   {(lowReady===false||matchReady===false)&&<button style={{...button,marginTop:12,fontSize:14,padding:12}} onClick={()=>{
    if(lowReady===false)setLowReady(null);
    if(matchReady===false)setMatchReady(null);
    setArtAttempt(n=>n+1);
   }}>RETRY OPENING POSE</button>}
   <p style={{color:"#f5bf8e",fontSize:13,marginTop:24}}>All eight directions have dedicated standing, stalk, jog, sprint, slide, and six-phase jump artwork. Jump phases follow takeoff, flight, ground contact, and recovery. Use the pace selector with keyboard or touch to review the transitions. Controller stick pressure remains analog. Moving fire follows aim.</p>
  </div>
 </main>;
}


