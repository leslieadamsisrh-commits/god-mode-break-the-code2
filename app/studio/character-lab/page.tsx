"use client";
import {useState,useEffect} from "react";
import Game from "../../Game";
import {preloadRaptorSprites} from "../../../lib/raptorSpriteOnly";
type Fighter="jade"|"raptor";
export default function CombatLab(){
 const [artReady,setArtReady]=useState<boolean|null>(null);
 useEffect(()=>{void preloadRaptorSprites().then(setArtReady)},[]);
 const [fighter,setFighter]=useState<Fighter|null>(null),[reset,setReset]=useState(0);
 const button={padding:"18px 20px",background:"#14283a",border:"2px solid #5a8394",borderRadius:12,color:"#f5fbff",font:"bold 19px Arial",cursor:"pointer",touchAction:"manipulation" as const};
 if(fighter)return <main style={{position:"fixed",inset:0,background:"#080f1a"}}>
  <Game combatLab key={fighter+reset} character={fighter} cameraPreset="kinetic"/>
  <div style={{position:"fixed",right:12,top:12,zIndex:2147483647,display:"flex",gap:8}}>
   <button style={{...button,fontSize:12,padding:12}} onClick={()=>setReset(n=>n+1)}>RESET</button>
   <button style={{...button,fontSize:12,padding:12}} onClick={()=>setFighter(null)}>CHANGE FIGHTER</button>
  </div>
 </main>;
 return <main style={{minHeight:"100vh",background:"#08101b",color:"#f5fbff",fontFamily:"Arial",padding:"max(25px,env(safe-area-inset-top)) 20px"}}>
  <div style={{maxWidth:800,margin:"auto"}}>
   <a href="/studio" style={{color:"#89e9f2"}}>← BACK TO STUDIO</a>
   <p style={{color:"#ff8d9e",letterSpacing:2,fontSize:12}}>GOD MODE / BUILD 39P PLAYTEST</p>
   <h1>COMBAT LAB</h1>
   <p>Both fighters use the newer XYZ combat engine. This is a test build, not a production character unlock.</p>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:14,marginTop:25}}>
    <button style={button} onClick={()=>setFighter("jade")}>JADE <small style={{display:"block",fontWeight:400,marginTop:10}}>Existing gameplay baseline</small></button>
    <button disabled={artReady!==true} style={{...button,borderColor:"#ff925e",opacity:artReady?1:.5}} onClick={()=>setFighter("raptor")}>RAPTOR V2 <small style={{display:"block",fontWeight:400,marginTop:10}}>{artReady===null?"Loading Raptor artwork…":artReady?"Eight directions · provisional two-pose run":"Artwork failed to load — reload to retry"}</small></button>
   </div>
   <p style={{color:"#f5bf8e",fontSize:13,marginTop:24}}>Raptor: provisional Idle and Run artwork. Walk borrows Run; slide, jump, landing, firing and damage borrow Idle. All actions use the shared combat engine.</p>
  </div>
 </main>;
}

