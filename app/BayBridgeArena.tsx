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

export default function BayBridgeArena({s}:{s:any}){
 const [cam,setCam]=useState<ComicCameraKey>("B"),[qa,setQa]=useState(false);
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
  <div className="arenaControls">
   {(Object.keys(COMIC_CAMERAS) as ComicCameraKey[]).map(k=><button className={cam===k?"active":""} key={k} onClick={()=>setCam(k)}>{k}</button>)}
   <button onClick={()=>setQa(v=>!v)}>{qa?"ARENA QA ON":"ARENA QA"}</button>
  </div>
  <div className="cameraReadout">{c.name} · PITCH {c.pitch}° · YAW {c.yaw}° · ZONE {zone.id} {zone.name}</div>
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
