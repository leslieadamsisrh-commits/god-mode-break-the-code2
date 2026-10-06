"use client";
import {useState} from "react";

export const COMIC_CAMERAS={
 A:{name:"CAM A · ROADWAY THREE-QUARTER",pitch:28,yaw:-18,depthScale:.18,combatScale:.97},
 B:{name:"CAM B · BALANCED OBLIQUE",pitch:31,yaw:-25,depthScale:.23,combatScale:1},
 C:{name:"CAM C · STEEP TACTICAL",pitch:34,yaw:-31,depthScale:.28,combatScale:.98}
} as const;
export type ComicCameraKey=keyof typeof COMIC_CAMERAS;

export const BAY_ZONES=[
 {id:"A",name:"ROADWAY THREE-QUARTER",x0:0,x1:310},
 {id:"B",name:"DEEP BRIDGE DIAGONAL",x0:310,x1:520},
 {id:"C",name:"CROSSWISE COMBAT POCKET",x0:520,x1:710},
 {id:"D",name:"LONG-BRIDGE SIGHTLINE",x0:710,x1:1000}
] as const;

export const BAY_COVER_META:Record<string,{material:"CONCRETE"|"STEEL"|"VEHICLE"|"INFRASTRUCTURE";shell:string;grip:boolean;mass:number;breakThreshold:number}>={
 "cover-piece-01":{material:"CONCRETE",shell:"damaged-jersey-divider",grip:true,mass:7,breakThreshold:140},
 "sniper-tower-base":{material:"STEEL",shell:"bridge-maintenance-enclosure",grip:true,mass:9,breakThreshold:180}
};

export function comicProject(x:number,y:number,z:number,cam:ComicCameraKey){
 const c=COMIC_CAMERAS[cam],p=c.pitch*Math.PI/180,q=c.yaw*Math.PI/180,rx=x*Math.cos(q)-y*Math.sin(q),ry=x*Math.sin(q)+y*Math.cos(q);
 return{x:rx,y:ry*Math.sin(p)-z*Math.cos(p),depth:ry*Math.cos(p)+z*Math.sin(p),scale:Math.max(.92,Math.min(1.05,c.combatScale-(ry-330)*.00008))};
}
function zoneFor(x:number){return BAY_ZONES.find(z=>x>=z.x0&&x<z.x1)||BAY_ZONES[BAY_ZONES.length-1]}

export default function BayBridgeArena({s,onAnimationQa,onDirector,onSprites,onReset,menuOpen,onMenuToggle}:{s:any;onAnimationQa?:()=>void;onDirector?:()=>void;onSprites?:()=>void;onReset?:()=>void;menuOpen:boolean;onMenuToggle:()=>void}){
 const cam:ComicCameraKey="B";const [qa,setQa]=useState(false);const open=menuOpen;
 const p=s?.players?.[0]||{x:230,y:330},zone=zoneFor(p.x||0),c=COMIC_CAMERAS[cam];
 return <div className="bayArena">
  <div className="baySky"><i/><i/><i/></div>
  <div className="bayTower left"/><div className="bayTower right"/>
  <div className="bayCables"/>
  <div className="bayRoad">
   <div className="lane l1"/><div className="lane l2"/><div className="lane l3"/>
   <div className="fracture f1"/><div className="fracture f2"/>
   <div className="wreck sedan"/><div className="wreck van"/>
   <div className="girderFrame"/>
  </div>
  <div className="bayForeground"/>
  <div className="arenaMenu">
   <button className="studioMenuButton" onClick={onMenuToggle}>{open?"✕ CLOSE":"☰ GOD MODE"}</button>
   <div className="cameraChip">CAM {cam} · {c.pitch}° · {cam==="B"?"BALANCED OBLIQUE":cam==="A"?"THREE-QUARTER":"STEEP TACTICAL"}</div>
   {open&&<div className="studioDropdown">
    <button className="menuClose" onClick={onMenuToggle}><strong>✕ CLOSE MENU</strong><span>Return to full-screen play</span></button>
    <b>PLAY</b>
    <button className="active" onClick={onMenuToggle}><strong>BAY BRIDGE</strong><span>CAM B · 31° balanced oblique · frozen combat core</span></button>
    <b>TRAINING</b>
    <button onClick={onAnimationQa}><strong>ANIMATION QA</strong><span>Directed movement / registration diagnostics</span></button>
    <b>SETTINGS</b>
    <button><strong>CONTROLLER</strong><span>Xbox controller active · Start/Menu opens this screen</span></button>
    <hr/><b>DEV</b>
    <button onClick={()=>setQa(v=>!v)}><strong>{qa?"✓ ":""}ARENA QA</strong><span>Projection · zones · depth · cover metadata</span></button>
    <button onClick={onDirector}><strong>DIRECTOR</strong><span>Combat tests · previews</span></button>
    <button onClick={onSprites}><strong>SPRITES</strong><span>Runtime routing inspector</span></button>
    <hr/><button onClick={onReset}><strong>RESET</strong><span>Reset current playtest</span></button>
   </div>}
  </div>
  {qa&&<div className="arenaQa">
   <b>COMIC DEPTH SPACE</b><span>WORLD {Number(p.x||0).toFixed(1)}, {Number(p.y||0).toFixed(1)}, 0</span>
   <span>PROJECT {JSON.stringify(comicProject(p.x||0,p.y||0,0,cam))}</span>
   <span>LAYERS L0 HORIZON · L1 STRUCTURE · L2 ROAD · L3 COVER · L4 ACTOR · L5 FOREGROUND</span>
   <span>ZONE {zone.id} · {zone.x0}→{zone.x1}</span>
   <span>SPAWN P1 230/330 · P2 780/330 · CENTER CONTEST 430→620</span>
   <span>COVER SHELLS {Object.entries(BAY_COVER_META).map(([id,m])=>id+":"+m.material+"/"+m.shell).join(" · ")}</span>
  </div>}
 </div>
}
