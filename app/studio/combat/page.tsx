import Link from "next/link";
const checks=[["Movement","Run, acceleration, slide, brake, cover escape"],["Weapons","Aim, shotgun, recoil and hit registration"],["Melee","Combo, counters and knockback"],["Psychic","Shield, Grip, charge and powers"]];
export default function CombatLab(){
 return <main style={{position:"fixed",inset:0,zIndex:100,overflowY:"auto",WebkitOverflowScrolling:"touch",touchAction:"pan-y",background:"#080d15",color:"#e6f7f8",padding:"max(18px,env(safe-area-inset-top)) 18px 40px",fontFamily:"Arial,sans-serif"}}>
 <div style={{maxWidth:850,margin:"0 auto"}}>
 <small style={{color:"#ff70bb"}}>GOD MODE / COMBAT LAB</small><h1>COMBAT LAB</h1>
 <p style={{color:"#a2bdc7"}}>This is the combat QA workspace. The playable Raptor sparring mode is still in development.</p>
 <Link href="/" prefetch={false} style={{display:"block",background:"#143443",border:"2px solid #62edf0",borderRadius:12,padding:22,color:"#eaffff",fontWeight:900,textDecoration:"none",minHeight:64,touchAction:"manipulation"}}>▶ PLAY EXISTING COMBAT BUILD</Link>
 <Link href="/studio/character/raptor/movement" prefetch={false} style={{display:"block",marginTop:12,background:"#30203a",border:"2px solid #ff69b7",borderRadius:12,padding:22,color:"#fff",fontWeight:900,textDecoration:"none",minHeight:64,touchAction:"manipulation"}}>OPEN RAPTOR SPRITE LAB →</Link>
 <div style={{display:"grid",gap:12,marginTop:22}}>{checks.map(([title,detail])=><section key={title} style={{border:"1px solid #294454",background:"#111c2a",borderRadius:10,padding:16}}><strong>{title}</strong><p style={{color:"#b0c5cc"}}>{detail}</p></section>)}</div>
 <Link href="/studio" prefetch={false} style={{display:"block",padding:18,color:"#ff70bb",touchAction:"manipulation"}}>← STUDIO LABS</Link>
 </div></main>;
}
