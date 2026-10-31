"use client";
import {useState} from "react";
import Game from "../../Game";
type Fighter="jade"|"raptor";
export default function CharacterLab(){
 const [fighter,setFighter]=useState<Fighter|null>(null);
 const [session,setSession]=useState(0);
 const button={background:"#102331",border:"2px solid #456778",color:"#f4fcff",padding:"20px",borderRadius:12,font:"bold 19px Arial",cursor:"pointer",textAlign:"left" as const,touchAction:"manipulation" as const};
 if(fighter)return <main style={{position:"fixed",inset:0,background:"#07101b"}}>
  <Game key={fighter+"-"+session} character={fighter} cameraPreset="kinetic"/>
  <div style={{position:"fixed",top:12,right:12,zIndex:2147483647,display:"flex",gap:8}}>
   <button style={{...button,padding:"12px",fontSize:13}} onClick={()=>setSession(v=>v+1)}>RESET</button>
   <button style={{...button,padding:"12px",fontSize:13,borderColor:"#ff9b64"}} onClick={()=>setFighter(null)}>CHANGE FIGHTER</button>
  </div>
 </main>;
 return <main style={{minHeight:"100vh",background:"#080e19",color:"#ecf9ff",fontFamily:"Arial,sans-serif",padding:"max(24px,env(safe-area-inset-top)) 20px"}}>
  <div style={{maxWidth:780,margin:"auto"}}>
   <a href="/studio" style={{color:"#87e5f0"}}>← STUDIO</a>
   <p style={{color:"#ff7a9d",letterSpacing:2,fontSize:12}}>GOD MODE / BREAK THE CODE</p>
   <h1>COMBAT LAB</h1><p>Choose your fighter. Both run on the same GOD MODE combat engine in this isolated build.</p>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:14,marginTop:25}}>
    <button style={button} onClick={()=>setFighter("jade")}>JADE <small style={{display:"block",fontWeight:400,fontSize:13,marginTop:8}}>Original fighter · baseline movement and combat</small></button>
    <button style={{...button,borderColor:"#f07c55"}} onClick={()=>setFighter("raptor")}>RAPTOR V2 <small style={{display:"block",fontWeight:400,fontSize:13,marginTop:8}}>Experimental fighter · shotgun · unfinished artwork</small></button>
   </div>
   <p style={{marginTop:28,color:"#ffc27c",fontSize:13}}>Art status: Raptor V2 detailed frames are not yet installed. The current Raptor uses fallback rig rendering. This mode is isolated and does not modify the original Jade game.</p>
  </div>
 </main>;
}
