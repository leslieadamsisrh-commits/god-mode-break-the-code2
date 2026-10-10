import Link from "next/link";
const checks=[
 ["Movement","Acceleration, braking, directional run, slide, dash and cover escape"],
 ["Weapons","Aim independence, muzzle clearance, shot cadence and hit registration"],
 ["Melee","Combo input, attack recovery, counter windows and knockback"],
 ["Psychic","Shield, parry, Grip, power charge and universal battery economy"],
 ["Controller","A slide; B melee; X selected power; Y charge; LB Grip; RB cover; LT shield; RT fire"],
 ["Networking","Room join, authoritative outcomes, latency and rematch"]
];
export default function CombatLab(){
 return <main style={{minHeight:"100dvh",overflowY:"auto",background:"#080d15",color:"#e6f7f8",padding:"clamp(18px,4vw,48px)",fontFamily:"Arial,sans-serif"}}>
 <div style={{maxWidth:850,margin:"0 auto"}}>
 <small style={{color:"#ff70bb",letterSpacing:2}}>FOUNDATION 01 / READ-ONLY QA</small>
 <h1>COMBAT LAB</h1>
 <p style={{color:"#a2bdc7"}}>Shared competitive rules. No independent simulation is mounted here yet. Use the existing playable game for live mechanical tests while this isolated QA workspace is established.</p>
 <div style={{display:"grid",gap:12}}>{checks.map(([title,detail])=><section key={title} style={{border:"1px solid #294454",background:"#111c2a",borderRadius:10,padding:16}}><strong>{title}</strong><p style={{color:"#b0c5cc",marginBottom:0}}>{detail}</p></section>)}</div>
 <p style={{marginTop:24}}><Link style={{color:"#6ce4e5"}} href="/">OPEN EXISTING GAME FOR PLAYTEST →</Link></p>
 <p><Link style={{color:"#ff70bb"}} href="/studio">← STUDIO LABS</Link></p>
 </div></main>;
}
