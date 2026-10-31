import Link from "next/link";
export default function CharacterLab(){
 const card={display:"block",padding:"24px",border:"2px solid #476171",borderRadius:16,color:"#f3faff",background:"#122131",textDecoration:"none",fontFamily:"Arial,sans-serif"} as const;
 return <main style={{minHeight:"100vh",background:"#070e18",color:"#eaf7ff",padding:"max(24px,env(safe-area-inset-top)) 20px",fontFamily:"Arial,sans-serif"}}>
 <div style={{maxWidth:850,margin:"auto"}}><Link href="/studio" style={{color:"#7fe7f1"}}>← STUDIO</Link>
 <p style={{color:"#ff7d9e",letterSpacing:3,fontSize:12}}>GOD MODE / BREAK THE CODE</p><h1>COMBAT LAB</h1>
 <p>One combat system. Select a fighter, test movement and cover, and review before any main-game merge.</p>
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:18,marginTop:28}}>
 <Link href="/" style={card}><h2>JADE</h2><p>Original playable fighter · existing game</p><strong>PLAY JADE →</strong></Link>
 <Link href="/raptor-game" style={{...card,borderColor:"#ff7e5c"}}><h2>RAPTOR V2</h2><p>Experimental fighter · full combat engine · unfinished directional artwork</p><strong>PLAY RAPTOR →</strong></Link>
 <Link href="/raptor-lab" style={card}><h2>GEOMETRIC TEST FLOOR</h2><p>Raptor movement, shotgun and basic cover construction</p><strong>OPEN FLOOR →</strong></Link>
 </div>
 <p style={{color:"#ffc27c",marginTop:30,fontSize:13}}>Experimental character artwork is not approved for production. Jade remains the original game default. No merge has occurred.</p>
 </div></main>
}
