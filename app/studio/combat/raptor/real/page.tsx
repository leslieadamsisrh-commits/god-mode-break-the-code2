"use client";
import {useState} from "react";
import Game from "../../../../Game";
export default function RaptorRealGameTest(){
 const [character,setCharacter]=useState<"jade"|"raptor">("jade");
 return <>
  <Game character={character}/>
  <div style={{position:"fixed",top:12,left:12,zIndex:3000,display:"flex",gap:8,background:"#101a27",padding:8}}><button onClick={()=>setCharacter("jade")}>JADE</button><button onClick={()=>setCharacter("raptor")}>RAPTOR</button></div>
  <aside aria-label="Raptor integration status" style={{position:"fixed",left:12,bottom:102,zIndex:2100,maxWidth:"min(340px,calc(100vw - 24px))",padding:"10px 14px",border:"1px solid #ff6bb6",borderRadius:10,background:"#0b1524ed",color:"#fff",font:"12px Arial,sans-serif",pointerEvents:"none"}}>
   <strong style={{display:"block",color:"#ff89c5",marginBottom:4}}>RAPTOR REAL-GAME TEST</strong>
   Shared GOD MODE engine. Raptor appearance is currently procedural artwork, not approved painted sprites.
  </aside>
  <a href="/studio" style={{position:"fixed",right:12,bottom:100,zIndex:2200,padding:"12px 14px",background:"#122b37",border:"1px solid #70e8f2",borderRadius:8,color:"#eaffff",font:"bold 12px Arial,sans-serif",textDecoration:"none",touchAction:"manipulation"}}>STUDIO MENU</a>
 </>;
}
