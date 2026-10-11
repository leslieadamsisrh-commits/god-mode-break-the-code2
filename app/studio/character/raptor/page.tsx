"use client";
import Link from "next/link";
import {useState} from "react";
const POSES=[
 ["R031","Light hit","Impact FX separate"],
 ["R032","Heavy stagger","Debris separate"],
 ["R033","Shield break","Psychic fragments separate"],
 ["R034","Airborne knockback","World root / airborne offset"],
 ["R035","Ground knockdown","Floor-contact anchor"],
 ["R036","Get-up recovery","Transition to ready stance"]
] as const;
const REQUIREMENTS=["True alpha transparency","Consistent anatomy and equipment","FX and debris separated","World-root and ground anchors recorded","Muzzle/head sockets recorded","Game-scale readability verified","Animation timing and parity verified"] as const;
export default function RaptorSpriteQa(){
 const [pose,setPose]=useState(0);
 const [checks,setChecks]=useState<Record<string,boolean>>({});
 const [background,setBackground]=useState<"checker"|"light"|"dark">("checker");
 const p=POSES[pose];
 const complete=REQUIREMENTS.every(x=>checks[p[0]+x]);
 return <main style={{minHeight:"100dvh",overflowY:"auto",background:"#070b12",color:"#eaf5fa",padding:"clamp(16px,4vw,42px)",fontFamily:"Arial,sans-serif"}}>
 <div style={{maxWidth:940,margin:"0 auto"}}>
 <small style={{color:"#ff4aa5",letterSpacing:2}}>GOD MODE / RAPTOR COMBAT LAB / ASSET QA</small>
 <h1 style={{marginBottom:4}}>RAPTOR SPRITE INSPECTOR</h1>
 <p style={{color:"#a2b6c2"}}>Batch 06 — R031–R036. Review metadata and readiness only. No sprite is installed until actual alpha-authored assets are available and tested.</p>
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:18}}>
 <section style={{border:"1px solid #33495b",borderRadius:12,padding:18,background:"#101a27"}}>
 <h2 style={{color:"#ff62b6"}}>{p[0]} — {p[1]}</h2>
 <p style={{color:"#a9c1cc"}}>{p[2]}</p>
 <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{POSES.map((v,i)=><button key={v[0]} onClick={()=>setPose(i)} style={{background:i===pose?"#8b245b":"#192d3d",color:"#fff",border:"1px solid #3a5366",padding:"9px 10px",borderRadius:6}}>{v[0]}</button>)}</div>
 <p>Background preview:</p>
 <div style={{display:"flex",gap:6}}>{(["checker","light","dark"] as const).map(b=><button key={b} onClick={()=>setBackground(b)} style={{background:background===b?"#8b245b":"#192d3d",color:"white",border:"1px solid #3a5366",padding:8}}>{b}</button>)}</div>
 <div style={{height:240,marginTop:12,border:"1px dashed #6a8192",display:"grid",placeItems:"center",background:background==="checker"?"conic-gradient(#c3c3c3 25%,#fff 0 50%,#c3c3c3 0 75%,#fff 0) 0 0/24px 24px":background==="light"?"#fff":"#101010",color:background==="dark"?"#f9c9e4":"#3d1830",textAlign:"center",padding:14}}>
 <strong>NO VERIFIED RUNTIME SPRITE<br/>Asset upload / cleanup required</strong>
 </div>
 </section>
 <section style={{border:"1px solid #33495b",borderRadius:12,padding:18,background:"#101a27"}}>
 <h2>QA Gate</h2>
 <p style={{color:complete?"#81e7cb":"#ffb8c7"}}>{complete?"All local review boxes checked — runtime verification still required":"NOT READY FOR RUNTIME"}</p>
 {REQUIREMENTS.map(x=><label key={x} style={{display:"flex",alignItems:"center",gap:10,margin:"12px 0",fontSize:14}}><input type="checkbox" checked={!!checks[p[0]+x]} onChange={e=>setChecks(v=>({...v,[p[0]+x]:e.target.checked}))}/>{x}</label>)}
 <p style={{fontSize:12,color:"#94aab6"}}>These review checkboxes are local, unsaved notes; checking them does not install sprites or certify game readiness.</p>
 </section>
 </div>
 <p style={{marginTop:26}}><Link href="/studio/character/raptor/movement" style={{color:"#75dff2"}}>OPEN MOVEMENT REGISTRATION LAB →</Link></p><p><Link href="/studio/character" style={{color:"#ff72bb"}}>← CHARACTER LAB</Link>　<Link href="/studio/combat" style={{color:"#75dff2"}}>COMBAT LAB →</Link></p>
 </div></main>;
}
