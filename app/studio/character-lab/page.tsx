"use client";
import {useState} from "react";
import Game from "../../Game";
type Fighter="jade"|"raptor";
export default function CombatLab(){
 const [fighter,setFighter]=useState<Fighter|null>(null),[reset,setReset]=useState(0);
 const button={padding:"18px 20px",background:"#14283a",border:"2px solid #5a8394",borderRadius:12,color:"#f5fbff",font:"bold 19px Arial",cursor:"pointer",touchAction:"manipulation" as const};
 if(fighter)return <main style={{position:"fixed",inset:0,background:"#080f1a"}}>
  <Game key={fighter+reset} character={fighter} cameraPreset="kinetic"/>
  <div style={{position:"fixed",right:12,top:12,zIndex:2147483647,display:"flex",gap:8}}>
   <button style={{...button,fontSize:12,padding:12}} onClick={()=>setReset(n=>n+1)}>RESET</button>
   <button style={{...button,fontSize:12,padding:12}} onClick={()=>setFighter(null)}>CHANGE FIGHTER</button>
  </div>
 </main>;
 return <main style={{minHeight:"100vh",background:"#08101b",color:"#f5fbff",fontFamily:"Arial",padding:"max(25px,env(safe-area-inset-top)) 20px"}}>
  <div style={{maxWidth:800,margin:"auto"}}>
   <a href="/studio" style={{color:"#89e9f2"}}>← BACK TO STUDIO</a>
   <p style={{color:"#ff8d9e",letterSpacing:2,fontSize:12}}>GOD MODE / MASTER CONSOLIDATION</p>
   <h1>COMBAT LAB</h1>
   <p>Both fighters use the newer XYZ combat engine. This is a test build, not a production character unlock.</p>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:14,marginTop:25}}>
    <button style={button} onClick={()=>setFighter("jade")}>JADE <small style={{display:"block",fontWeight:400,marginTop:10}}>Existing gameplay baseline</small></button>
    <button style={{...button,borderColor:"#ff925e"}} onClick={()=>setFighter("raptor")}>RAPTOR V2 <small style={{display:"block",fontWeight:400,marginTop:10}}>Experimental character — detailed sprites pending</small></button>
   </div>
   <p style={{color:"#f5bf8e",fontSize:13,marginTop:24}}>Raptor uses fallback presentation until the approved directional RGBA frames are installed and verified. No production merge has occurred.</p>
  </div>
 </main>;
}
