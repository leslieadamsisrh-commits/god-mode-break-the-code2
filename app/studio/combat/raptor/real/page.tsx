"use client";
import {useState} from "react";
import Game from "../../../../Game";
export default function RaptorRealGameTest(){
 const [character,setCharacter]=useState<"jade"|"raptor">("jade");
 return <>
  <Game character={character} cameraPreset="close"/>
  <div aria-label="Choose character" style={{position:"fixed",top:"calc(env(safe-area-inset-top, 0px) + 14px)",right:"calc(env(safe-area-inset-right, 0px) + 14px)",zIndex:2147483000,display:"flex",gap:8,background:"#101a27f5",border:"2px solid #70e8f2",borderRadius:12,padding:8,boxShadow:"0 5px 24px #000a",pointerEvents:"auto",touchAction:"manipulation"}}><button type="button" aria-pressed={character==="jade"} onClick={()=>setCharacter("jade")} style={{font:"bold 14px Arial",padding:"12px 14px",minHeight:44,borderRadius:8,border:"1px solid #70e8f2",background:character==="jade"?"#24748b":"#253341",color:"#fff",touchAction:"manipulation"}}>JADE</button><button type="button" aria-pressed={character==="raptor"} onClick={()=>setCharacter("raptor")} style={{font:"bold 14px Arial",padding:"12px 14px",minHeight:44,borderRadius:8,border:"1px solid #ff6bb6",background:character==="raptor"?"#9a346d":"#253341",color:"#fff",touchAction:"manipulation"}}>RAPTOR</button></div>
  <aside aria-label="Raptor integration status" style={{position:"fixed",left:12,bottom:102,zIndex:2100,maxWidth:"min(340px,calc(100vw - 24px))",padding:"10px 14px",border:"1px solid #ff6bb6",borderRadius:10,background:"#0b1524ed",color:"#fff",font:"12px Arial,sans-serif",pointerEvents:"none"}}>
   <strong style={{display:"block",color:"#ff89c5",marginBottom:4}}>RAPTOR REAL-GAME TEST</strong>
   Shared GOD MODE engine. Raptor appearance is currently procedural artwork, not approved painted sprites.
  </aside>
  <a href="/studio" style={{position:"fixed",right:12,bottom:100,zIndex:2200,padding:"12px 14px",background:"#122b37",border:"1px solid #70e8f2",borderRadius:8,color:"#eaffff",font:"bold 12px Arial,sans-serif",textDecoration:"none",touchAction:"manipulation"}}>STUDIO MENU</a>
 </>;
}
