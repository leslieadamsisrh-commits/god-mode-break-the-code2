"use client";
import {useState} from "react";
import {BAY_CAMERA,BAY_DEPTH_DOMAINS,BAY_LANES,BAY_OBJECTS,BAY_SPAWNS,bayObject} from "../lib/bayBridgeMap";

export function comicProject(x:number,y:number,z=0){
 const p=BAY_CAMERA.pitch*Math.PI/180,q=BAY_CAMERA.yaw*Math.PI/180,rx=x*Math.cos(q)-y*Math.sin(q),ry=x*Math.sin(q)+y*Math.cos(q);
 const raw=1-(ry-330)*.00008,scale=Math.max(BAY_CAMERA.combatScaleMin,Math.min(BAY_CAMERA.combatScaleMax,raw));
 return{x:rx,y:ry*Math.sin(p)-z*Math.cos(p),depth:ry*Math.cos(p)+z*Math.sin(p),scale};
}
function laneFor(x:number,y:number){return BAY_LANES.find(l=>x>=l.x0&&x<=l.x1&&y>=l.y0&&y<=l.y1)?.id||"TRANSIT"}

export default function BayBridgeArena({s,onAnimationQa,onDirector,onSprites,onReset,menuOpen,onMenuToggle}:{s:any;onAnimationQa?:()=>void;onDirector?:()=>void;onSprites?:()=>void;onReset?:()=>void;menuOpen:boolean;onMenuToggle:()=>void}){
 const [qa,setQa]=useState(false),p=s?.players?.[0]||{x:230,y:330},lane=laneFor(p.x||0,p.y||0),near=(s?.covers||[]).map((c:any)=>bayObject(c.id)).filter(Boolean);
 return <div className="bayArena bayContainer01">
  <div className="bayDepth l0"><div className="dimensionalPortal"/><div className="dimensionalMoon"/><div className="riftClouds"/></div>
  <div className="bayDepth l1"><div className="sfSkyline"/><div className="bayWater"/><div className="farBridge"/></div>
  <div className="bayDepth l2"><div className="bayTower left"/><div className="bayTower right"/><div className="bayCables"/><div className="bridgeDeck"/></div>
  <div className="bayDepth l3"><div className="wetRoad"><i className="laneMark a"/><i className="laneMark b"/><i className="expansionJoint"/><i className="wetReflection cyan"/><i className="wetReflection magenta"/><i className="wetReflection orange"/></div></div>
  <div className="bayDepth l4"><div className="steam s1"/><div className="steam s2"/></div>
  <div className="bayDepth l5"><div className="foregroundGirder"/><div className="foregroundCable"/></div>
  <div className="arenaMenu">
   <button className="studioMenuButton" onClick={onMenuToggle}>{menuOpen?"✕ CLOSE":"☰ GOD MODE"}</button>
   <div className="cameraChip">CAM B · 31° · COMIC DEPTH · CONTAINER 01</div>
   {menuOpen&&<div className="studioDropdown">
    <button className="menuClose" onClick={onMenuToggle}><strong>✕ CLOSE MENU</strong><span>Return to full-screen play</span></button>
    <b>PLAY</b><button className="active" onClick={onMenuToggle}><strong>BAY BRIDGE</strong><span>Interdimensional conflict zone · Kinetic Weave frozen</span></button>
    <b>TRAINING</b><button onClick={onAnimationQa}><strong>ANIMATION QA</strong><span>Movement / registration diagnostics</span></button>
    <hr/><b>DEV</b><button onClick={()=>setQa(v=>!v)}><strong>{qa?"✓ ":""}MAP CONTAINER QA</strong><span>Projection · depth · lanes · cover schema</span></button>
    <button onClick={onDirector}><strong>DIRECTOR</strong><span>Combat tests · previews</span></button><button onClick={onSprites}><strong>SPRITES</strong><span>Runtime routing inspector</span></button>
    <hr/><button onClick={onReset}><strong>RESET</strong><span>Reset current playtest</span></button>
   </div>}
  </div>
  {qa&&<div className="arenaQa"><b>BAY BRIDGE MAP CONTAINER 01</b>
   <span>WORLD {Number(p.x||0).toFixed(1)}, {Number(p.y||0).toFixed(1)}, 0 · LANE {lane}</span>
   <span>PROJECT {JSON.stringify(comicProject(p.x||0,p.y||0,0))}</span>
   <span>CAMERA B · PITCH {BAY_CAMERA.pitch}° · YAW {BAY_CAMERA.yaw}° · SCALE CLAMP {BAY_CAMERA.combatScaleMin}–{BAY_CAMERA.combatScaleMax}</span>
   <span>DEPTH {BAY_DEPTH_DOMAINS.map(d=>d.id+":"+d.nominalDistance).join(" · ")}</span>
   <span>SPAWNS {BAY_SPAWNS.map(x=>x.id+" "+x.x+"/"+x.y).join(" · ")}</span>
   <span>OBJECTS {near.map((o:any)=>o.id+":"+o.material+"/"+o.renderedShell).join(" · ")}</span>
  </div>}
 </div>
}
