"use client";
import {useEffect,useRef,useState} from "react";
import {RAPTOR_POSES} from "../../../../../lib/raptorPresentation";
type Inspection={file:string;url:string;width:number;height:number;alpha:boolean;transparentPixels:number;edgePixels:number;anchorX:number;anchorY:number};
const INITIAL=RAPTOR_POSES.slice(0,6);
export default function RaptorMovementRegistration(){
 const [files,setFiles]=useState<Record<string,Inspection>>({});
 const [selected,setSelected]=useState("R001");
 const [bg,setBg]=useState<"checker"|"light"|"dark">("checker");
 const [error,setError]=useState("");
 const canvas=useRef<HTMLCanvasElement>(null);
 useEffect(()=>()=>{Object.values(files).forEach(f=>URL.revokeObjectURL(f.url))},[files]);
 const selectedFile=files[selected];
 async function load(file:File,id:string){
  setError("");
  if(file.type!=="image/png"){setError("Only PNG files are accepted.");return;}
  if(file.size>12_000_000){setError("PNG exceeds the 12 MB inspection limit.");return;}
  const url=URL.createObjectURL(file);
  try{
   const bitmap=await createImageBitmap(file);
   const c=document.createElement("canvas");c.width=bitmap.width;c.height=bitmap.height;
   if(c.width*c.height>8_000_000)throw Error("Image is too large for safe inspection.");
   const context=c.getContext("2d",{willReadFrequently:true});if(!context)throw Error("Canvas unavailable");
   context.drawImage(bitmap,0,0);bitmap.close();
   const data=context.getImageData(0,0,c.width,c.height).data;
   let transparent=0,edge=0;
   for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){
    const a=data[(y*c.width+x)*4+3];
    if(a<255)transparent++;
    if(a>8&&(x===0||y===0||x===c.width-1||y===c.height-1))edge++;
   }
   setFiles(previous=>{if(previous[id])URL.revokeObjectURL(previous[id].url);return {...previous,[id]:{file:file.name,url,width:c.width,height:c.height,alpha:transparent>0,transparentPixels:transparent,edgePixels:edge,anchorX:Math.round(c.width/2),anchorY:c.height-1}}});
  }catch(e){URL.revokeObjectURL(url);setError(e instanceof Error?e.message:"PNG could not be inspected.");}
 }
 function anchor(axis:"anchorX"|"anchorY",v:number){setFiles(old=>old[selected]?{...old,[selected]:{...old[selected],[axis]:v}}:old)}
 function exportManifest(){
  const manifest={schema:"god-mode-raptor-registration-draft-v1",runtimeApproved:false,poses:Object.fromEntries(Object.entries(files).map(([id,f])=>[id,{filename:f.file,width:f.width,height:f.height,alphaDetected:f.alpha,transparentPixels:f.transparentPixels,edgePixels:f.edgePixels,groundAnchor:{x:f.anchorX,y:f.anchorY},verified:false}]))};
  const url=URL.createObjectURL(new Blob([JSON.stringify(manifest,null,2)],{type:"application/json"}));
  const a=document.createElement("a");a.href=url;a.download="raptor-movement-registration-draft.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 return <main style={{position:"fixed",inset:0,zIndex:100,overflowY:"auto",WebkitOverflowScrolling:"touch",touchAction:"pan-y",background:"#090d15",color:"#edf8fc",padding:"clamp(16px,4vw,36px)",fontFamily:"Arial,sans-serif"}}>
 <div style={{maxWidth:1050,margin:"0 auto"}}>
 <small style={{color:"#ff5fb4",letterSpacing:2}}>GOD MODE / RAPTOR MOVEMENT / BATCH 01</small>
 <h1>SPRITE REGISTRATION LAB</h1>
 <p style={{color:"#adc1cc"}}>Load six individual PNGs from your device. This tool inspects actual pixel alpha and detects occupied image borders. Files stay local to your browser session and are not installed into the game.</p>
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(145px,1fr))",gap:9,marginBottom:16}}>
 {INITIAL.map(p=><button key={p.id} onClick={()=>setSelected(p.id)} style={{textAlign:"left",padding:12,color:"#fff",background:selected===p.id?"#6e2452":"#152331",border:"1px solid #456070",borderRadius:8}}><strong>{p.id}</strong><div style={{fontSize:12,marginTop:5}}>{p.label}</div><small>{files[p.id]?"PNG LOADED":"AWAITING PNG"}</small></button>)}
 </div>
 <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(290px,1fr))",gap:18}}>
 <section style={{border:"1px solid #375065",borderRadius:12,padding:16,background:"#111c29"}}>
 <h2>{selected} — {INITIAL.find(p=>p.id===selected)?.label}</h2>
 <input aria-label="Load PNG for selected pose" type="file" accept="image/png" onChange={e=>{const f=e.target.files?.[0];if(f)void load(f,selected);e.target.value=""}}/>
 {error&&<p role="alert" style={{color:"#ff99ae"}}>{error}</p>}
 <div style={{display:"flex",gap:8,margin:"14px 0"}}>{(["checker","light","dark"] as const).map(x=><button key={x} onClick={()=>setBg(x)} style={{padding:8,color:"#fff",background:bg===x?"#8b2a61":"#283c4b",border:0,borderRadius:5}}>{x}</button>)}</div>
 <div style={{height:330,position:"relative",display:"grid",placeItems:"center",overflow:"hidden",border:"1px solid #52697c",background:bg==="checker"?"conic-gradient(#ccc 25%,#fff 0 50%,#ccc 0 75%,#fff 0) 0 0/24px 24px":bg==="light"?"white":"#080808"}}>
 {selectedFile?<img src={selectedFile.url} alt={selected+" uploaded PNG"} style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}}/>:<strong style={{color:bg==="dark"?"#eee":"#444"}}>NO IMAGE LOADED</strong>}
 </div>
 </section>
 <section style={{border:"1px solid #375065",borderRadius:12,padding:16,background:"#111c29"}}>
 <h2>Asset Audit</h2>
 {selectedFile?<><p>File: {selectedFile.file}</p><p>Canvas: {selectedFile.width} × {selectedFile.height}</p><p>Transparency: {selectedFile.alpha?"Detected":"NONE — HOLD"}</p><p>Occupied border pixels: {selectedFile.edgePixels} {selectedFile.edgePixels>0?"— INSPECT FOR CLIPPING":"— No border contact detected"}</p>
 <label style={{display:"block",marginTop:18}}>Foot anchor X: {selectedFile.anchorX}<input style={{display:"block",width:"100%"}} type="range" min={0} max={selectedFile.width-1} value={selectedFile.anchorX} onChange={e=>anchor("anchorX",+e.target.value)}/></label>
 <label style={{display:"block",marginTop:18}}>Foot anchor Y: {selectedFile.anchorY}<input style={{display:"block",width:"100%"}} type="range" min={0} max={selectedFile.height-1} value={selectedFile.anchorY} onChange={e=>anchor("anchorY",+e.target.value)}/></label>
 <p style={{color:"#ffb9c8"}}>NOT RUNTIME APPROVED: automated alpha and border checks cannot certify clean outlines, complete anatomy or accurate foot registration.</p>
 </>:<p>Choose a pose and load its actual PNG to inspect it.</p>}
 <button onClick={exportManifest} disabled={!Object.keys(files).length} style={{padding:12,background:"#793057",border:0,borderRadius:7,color:"#fff"}}>EXPORT DRAFT REGISTRATION JSON</button>
 </section>
 </div>
 <p style={{marginTop:24}}><a style={{color:"#ff75bd"}} href="/studio/character/raptor">← RAPTOR QA</a>　<a style={{color:"#72e7ed"}} href="/studio">STUDIO LABS</a></p>
 </div></main>;
}
