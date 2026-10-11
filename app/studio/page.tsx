import {raptorArtReadiness} from "../../lib/raptorJadeAnimationMap";
export default function StudioHome(){
 const art=raptorArtReadiness();
 const linkStyle={display:"block",padding:"22px 20px",borderRadius:14,textDecoration:"none",color:"#f4fdff",fontWeight:900,fontSize:20,touchAction:"manipulation" as const};
 return <main style={{position:"fixed",inset:0,overflowY:"auto",WebkitOverflowScrolling:"touch",touchAction:"pan-y",background:"#070d17",color:"#e5f7f8",padding:"max(20px,env(safe-area-inset-top)) 16px max(28px,env(safe-area-inset-bottom))",fontFamily:"Arial,sans-serif"}}>
 <div style={{maxWidth:740,margin:"0 auto"}}>
 <small style={{color:"#ff67b7",letterSpacing:2}}>GOD MODE / BREAK THE CODE</small>
 <h1 style={{fontSize:"clamp(30px,6vw,48px)",margin:"14px 0 8px"}}>WHAT DO YOU WANT TO DO?</h1>
 <p style={{color:"#a3c2ce",marginBottom:24}}>One game. Simple choices. Your existing gameplay is preserved.</p>
 <div style={{display:"grid",gap:12}}>
 <a href="/" style={{...linkStyle,background:"#10333b",border:"2px solid #63edf0"}}>▶ PLAY GOD MODE <small style={{display:"block",fontSize:13,fontWeight:400,marginTop:7}}>Existing playable game with Jade</small></a>
 <a href="/studio/combat/raptor" style={{...linkStyle,background:"#351b37",border:"2px solid #ff6bb7"}}>🦖 RAPTOR MOVEMENT TEST <small style={{display:"block",fontSize:13,fontWeight:400,marginTop:7}}>Temporary vector character · Same local combat simulation · NOT approved Raptor sprites yet</small></a>
 <a href="/studio/combat" style={{...linkStyle,background:"#162537",border:"1px solid #4d7485"}}>⚙ DEVELOPER TOOLS <small style={{display:"block",fontSize:13,fontWeight:400,marginTop:7}}>Combat QA and sprite registration · Optional</small></a>
 </div>
 <section style={{border:"1px solid #345267",padding:18,borderRadius:12,marginTop:24,background:"#101c29"}}>
 <strong>RAPTOR ART STATUS</strong>
 <p style={{color:"#aac1cc",fontSize:14}}>Illustrated references: {art.totalConceptPoses}. Validated game-ready mapped sprites: {art.validated} of {art.referenced} required reference poses.</p>
 <p style={{color:"#ffb7d4",fontSize:13}}>The approved Raptor cannot be selected in the real game until the sprite assets pass registration. No hidden playable Raptor button exists yet.</p>
 </section>
 </div></main>;
}
