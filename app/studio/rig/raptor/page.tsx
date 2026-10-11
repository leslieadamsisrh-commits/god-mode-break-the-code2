"use client";
import {useEffect,useRef,useState} from "react";
import {evaluateRaptorRig,type RigPose} from "../../../../lib/raptorHybridRig";
export default function HybridRigPreview(){
 const canvas=useRef<HTMLCanvasElement>(null),pose=useRef<RigPose|null>(null),running=useRef(true),speedRef=useRef(.85),jointRef=useRef(true);
 const [playing,setPlaying]=useState(true),[speed,setSpeed]=useState(.85),[joints,setJoints]=useState(true),[phase,setPhase]=useState(0);
 useEffect(()=>{running.current=playing},[playing]);
 useEffect(()=>{speedRef.current=speed},[speed]);
 useEffect(()=>{jointRef.current=joints},[joints]);
 useEffect(()=>{
 let raf=0,last=0,clock=0,lastPhase=-1;
 const line=(g:CanvasRenderingContext2D,x:number,y:number,X:number,Y:number,width:number,color:string)=>{g.strokeStyle=color;g.lineWidth=width;g.lineCap="round";g.beginPath();g.moveTo(x,y);g.lineTo(X,Y);g.stroke()};
 const frame=(now:number)=>{
  const dt=Math.min(.05,last?(now-last)/1000:0);last=now;if(running.current)clock+=dt;
  const p=evaluateRaptorRig({time:clock,speed:speedRef.current*300,runSpeed:300,facing:0,aim:0,state:"run"});pose.current=p;
  if(p.phase!==lastPhase){lastPhase=p.phase;setPhase(p.phase+1)}
  const c=canvas.current,g=c?.getContext("2d");
  if(g&&c){
   g.fillStyle="#081320";g.fillRect(0,0,c.width,c.height);
   g.save();g.translate(390,245);g.scale(2.3,2.3);
   const b=p.bones;
   g.strokeStyle="#243b4a";g.lineWidth=.5;g.beginPath();g.moveTo(-155,36);g.lineTo(155,36);g.stroke();
   // Diagnostic puppet shapes: intentionally NOT the approved separated Raptor artwork.
   for(let i=5;i>=0;i--){const q=b[("tail"+i) as keyof typeof b];line(g,q.x,q.y,q.x-15,q.y-1,10-i*.7,"#9e9d50");}
   for(const side of ["left","right"] as const){
    const hip=b[(side+"Thigh") as keyof typeof b],knee=b[(side+"Shin") as keyof typeof b],foot=b[(side+"Foot") as keyof typeof b];
    line(g,hip.x,hip.y,knee.x,knee.y,10,"#84975a");line(g,knee.x,knee.y,foot.x,foot.y,7,"#7a8590");line(g,foot.x,foot.y,foot.x+12,foot.y+1,5,"#cba66b");
   }
   g.fillStyle="#84965a";g.beginPath();g.ellipse(0,-12,22,15,-.12,0,Math.PI*2);g.fill();
   g.fillStyle="#cbd1d7";g.fillRect(-13,-26,23,9);
   const h=b.head;g.save();g.translate(h.x,h.y);g.rotate(h.angle);g.fillStyle="#89975c";g.beginPath();g.ellipse(0,0,15,9,.1,0,Math.PI*2);g.fill();g.fillStyle="#ff4659";g.beginPath();g.arc(7,-3,3,0,Math.PI*2);g.fill();g.restore();
   const w=b.weapon;line(g,w.x-10,w.y,w.x+27,w.y,6,"#8e98a3");
   if(jointRef.current){g.fillStyle="#65eaf1";for(const key of ["root","head","weapon","leftThigh","rightThigh","leftShin","rightShin","leftFoot","rightFoot"] as const){const q=b[key];g.beginPath();g.arc(q.x,q.y,2.4,0,Math.PI*2);g.fill()}}
   g.restore();
   g.fillStyle="#f6f6fa";g.font="16px monospace";g.fillText("12-PHASE RIG  /  "+String(p.phase+1).padStart(2,"0"),18,26);
   g.fillStyle="#a7c6d4";g.font="12px monospace";g.fillText("CONTACT: "+p.contact.toUpperCase()+"  |  COSMETIC MOTION ONLY",18,46);
   g.fillText("DIAGNOSTIC VECTOR PARTS — APPROVED ART NOT YET ATTACHED",18,405);
  }
  raf=requestAnimationFrame(frame);
 };
 raf=requestAnimationFrame(frame);return()=>cancelAnimationFrame(raf);
 },[]);
 return <main style={{position:"fixed",inset:0,overflowY:"auto",background:"#070e19",color:"#f4f8ff",padding:"18px",fontFamily:"Arial,sans-serif",touchAction:"pan-y"}}>
 <div style={{maxWidth:850,margin:"auto"}}><a href="/studio" style={{color:"#80e8f2"}}>← STUDIO</a><h1 style={{fontSize:28}}>RAPTOR HYBRID RIG</h1>
 <p style={{color:"#a5c3cd"}}>12-phase articulated movement test. This moves separate skeletal parts; final approved artwork is not attached yet.</p>
 <canvas ref={canvas} width={800} height={420} style={{width:"100%",height:"auto",border:"2px solid #2b5768",borderRadius:12}}/>
 <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center",marginTop:16}}>
 <button onClick={()=>setPlaying(v=>!v)} style={{padding:"14px 24px",borderRadius:10,background:"#b33e80",color:"white",border:0,fontWeight:800}}>{playing?"PAUSE":"PLAY"}</button>
 <label>Speed <input type="range" min="0" max="1" step=".05" value={speed} onChange={e=>setSpeed(Number(e.target.value))}/></label>
 <label><input type="checkbox" checked={joints} onChange={e=>setJoints(e.target.checked)}/> Show joints</label>
 <strong>Phase {phase}/12</strong>
 </div>
 <p style={{fontSize:13,color:"#a8bdc7"}}>Use Play/Pause, Speed, and Show joints. This is an animation workshop, not a second combat engine; Jade's gameplay remains unchanged.</p>
 </div></main>;
}
