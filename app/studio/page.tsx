export default function StudioHome(){
 const linkStyle={display:"block",padding:"22px 20px",borderRadius:14,textDecoration:"none",color:"#f4fdff",fontWeight:900,fontSize:20,touchAction:"manipulation" as const};
 return <main style={{position:"fixed",inset:0,overflowY:"auto",WebkitOverflowScrolling:"touch",touchAction:"pan-y",background:"#070d17",color:"#e5f7f8",padding:"max(20px,env(safe-area-inset-top)) 16px max(28px,env(safe-area-inset-bottom))",fontFamily:"Arial,sans-serif"}}>
 <div style={{maxWidth:740,margin:"0 auto"}}>
 <small style={{color:"#ff67b7",letterSpacing:2}}>GOD MODE / BREAK THE CODE</small>
 <h1 style={{fontSize:"clamp(30px,6vw,48px)",margin:"14px 0 8px"}}>WHAT DO YOU WANT TO DO?</h1>
 <p style={{color:"#a3c2ce",marginBottom:24}}>One game. Simple choices. Your existing gameplay is preserved.</p>
 <div style={{display:"grid",gap:12}}>
 <a href="/" style={{...linkStyle,background:"#10333b",border:"2px solid #63edf0"}}>▶ PLAY GOD MODE <small style={{display:"block",fontSize:13,fontWeight:400,marginTop:7}}>Existing playable game with Jade</small></a>
 <a href="/studio/character-lab" style={{...linkStyle,background:"#3a2419",border:"2px solid #ffa468"}}>🎮 COMBAT LAB — JADE / RAPTOR <small style={{display:"block",fontSize:13,fontWeight:400,marginTop:7}}>Character select · newest XYZ combat foundation · experimental Raptor</small></a>
 <a href="/studio/elevation" style={{...linkStyle,background:"#163a45",border:"2px solid #63edf0"}}>↗ XYZ ELEVATION LAB <small style={{display:"block",fontSize:13,fontWeight:400,marginTop:7}}>Build 27A · stairs, bridge, jump and fall physics prototype</small></a>
 <a href="/studio/combat" style={{...linkStyle,background:"#162537",border:"1px solid #4d7485"}}>⚙ DEVELOPER TOOLS <small style={{display:"block",fontSize:13,fontWeight:400,marginTop:7}}>Combat QA and sprite registration · Optional</small></a>
 </div>
 <section style={{border:"1px solid #345267",padding:18,borderRadius:12,marginTop:24,background:"#101c29"}}>
 <strong>RAPTOR ART STATUS</strong>
 <p style={{color:"#aac1cc",fontSize:14}}>Build 39P: eight-direction Idle and provisional two-pose Run.</p>
 <p style={{color:"#ffb7d4",fontSize:13}}>Select JADE or RAPTOR V2 in Combat Lab. Unfinished action animations use provisional visual fallbacks; gameplay is shared.</p>
 </section>
 </div></main>;
}

