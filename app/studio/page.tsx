import Link from "next/link";
import {LABS,PARITY} from "./labs";
export default function StudioHome(){
 return <main style={{minHeight:"100dvh",overflowY:"auto",background:"#070c14",color:"#e5f7f8",padding:"clamp(18px,4vw,48px)",fontFamily:"Arial,sans-serif"}}>
  <div style={{maxWidth:940,margin:"0 auto"}}>
   <p style={{color:"#ff68b2",letterSpacing:3,fontSize:12}}>GOD MODE / BREAK THE CODE</p>
   <h1 style={{fontSize:"clamp(28px,5vw,48px)",margin:"12px 0"}}>STUDIO LABS</h1>
   <p style={{color:"#91b3bf"}}>Foundation 01 · Isolated development workspaces · Existing game preserved</p>
   <p style={{padding:16,border:"1px solid #294454",borderRadius:12}}>{PARITY}</p>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:12,marginTop:24}}>
    {LABS.map(l=><div key={l.id} style={{border:"1px solid #294454",background:"#101b29",padding:20,borderRadius:12}}>
     <small style={{color:l.phase==="FOUNDATION 01"?"#6be6e5":"#9ba8b2"}}>{l.phase}</small>
     <h2 style={{fontSize:20}}>{l.name}</h2><p style={{fontSize:14,color:"#a5bdc5",minHeight:46}}>{l.description}</p>
     {l.phase==="FOUNDATION 01"?<Link style={{color:"#79eced"}} href={"/studio/"+l.id}>OPEN LAB →</Link>:<span style={{color:"#899ba5"}}>Reserved for later</span>}
    </div>)}
   </div>
   <p style={{marginTop:28}}><Link style={{color:"#ff79bc"}} href="/">← RETURN TO EXISTING GAME</Link></p>
  </div>
 </main>
}
