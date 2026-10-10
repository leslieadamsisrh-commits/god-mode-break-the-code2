import Link from "next/link";
const roster=[
 ["JADE","Mechanical authority. Preserve approved helmet, visor, backpack, Panther boots and directional animation."],
 ["VELOCIRAPTOR SOLDIER","Approved colorful manga/Koopa-inspired reptilian soldier; olive tiger stripes, red monocle, upper carapace, SMG and elevated tail during bipedal sprint. Height approximately Jade's or slightly taller."],
 ["GORILLA MILK","Preserve approved cybernetic gorilla identity, equipment and artwork."],
 ["ADAMUS PRIME","Preserve approved champion identity and artwork."]
];
export default function CharacterLab(){
 return <main style={{minHeight:"100dvh",overflowY:"auto",background:"#080d15",color:"#e6f7f8",padding:"clamp(18px,4vw,48px)",fontFamily:"Arial,sans-serif"}}>
 <div style={{maxWidth:850,margin:"0 auto"}}>
 <small style={{color:"#ff70bb",letterSpacing:2}}>FOUNDATION 01 / DESIGN AUTHORITY</small><h1>CHARACTER LAB</h1>
 <p style={{color:"#a2bdc7"}}>Roster reference and visual QA staging. No new sprite generation or combat-stat modifications. Game-ready directional sprite previews are a later milestone.</p>
 <div style={{display:"grid",gap:12}}>{roster.map(([name,detail])=><section key={name} style={{border:"1px solid #294454",background:"#111c2a",borderRadius:10,padding:16}}><strong>{name}</strong><p style={{color:"#b0c5cc",marginBottom:0}}>{detail}</p></section>)}</div>
 <p style={{borderLeft:"3px solid #6ce4e5",padding:14,background:"#10232b"}}>UNIVERSAL PARITY: Identical competitive movement, health, damage, power availability, timings and collision. Different character visuals and sounds only.</p>
 <p><Link style={{color:"#ff70bb"}} href="/studio">← STUDIO LABS</Link></p>
 </div></main>;
}
