import {LABS,PARITY} from "./labs";
const live=[{id:"combat",name:"COMBAT LAB",description:"Combat rules and playtest access",href:"/studio/combat"},{id:"character",name:"CHARACTER LAB",description:"Raptor sprite QA and movement registration",href:"/studio/character/raptor/movement"}];
export default function StudioHome(){
 return <main style={{position:"fixed",inset:0,zIndex:100,overflowY:"auto",WebkitOverflowScrolling:"touch",background:"#070c14",color:"#e5f7f8",padding:"max(18px,env(safe-area-inset-top)) 18px max(24px,env(safe-area-inset-bottom))",fontFamily:"Arial,sans-serif",touchAction:"pan-y"}}>
  <div style={{maxWidth:940,margin:"0 auto"}}>
   <p style={{color:"#ff68b2",letterSpacing:2,fontSize:12}}>GOD MODE / BREAK THE CODE</p>
   <h1 style={{fontSize:"clamp(30px,6vw,48px)",margin:"12px 0"}}>STUDIO LABS</h1>
   <p style={{color:"#91b3bf"}}>One game. Isolated development labs.</p>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:14,marginTop:24}}>
    {live.map(l=><a key={l.id} href={l.href} style={{display:"block",textDecoration:"none",color:"#eaffff",background:"#102434",border:"2px solid #62edf0",borderRadius:14,padding:24,minHeight:156,touchAction:"manipulation"}}>
     <small style={{color:"#7af0ed"}}>OPEN WORKSPACE</small><h2 style={{fontSize:23,margin:"10px 0"}}>{l.name} →</h2><p style={{fontSize:14,color:"#a5bdc5"}}>{l.description}</p>
    </a>)}
   </div>
   <p style={{padding:14,border:"1px solid #294454",borderRadius:10,marginTop:24}}>{PARITY}</p>
   <h2 style={{fontSize:18,marginTop:26}}>UPCOMING LABS</h2>
   <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:8}}>{LABS.filter(l=>l.id!=="combat"&&l.id!=="character").map(l=><div key={l.id} style={{border:"1px solid #294454",background:"#101b29",padding:14,borderRadius:10}}><strong>{l.name}</strong><p style={{fontSize:12,color:"#91b3bf"}}>Planned</p></div>)}</div>
   <a href="/" style={{display:"block",marginTop:28,padding:18,textAlign:"center",color:"#ff91ca",border:"1px solid #a53e7b",borderRadius:12,touchAction:"manipulation"}}>← RETURN TO GAME</a>
  </div>
 </main>
}
