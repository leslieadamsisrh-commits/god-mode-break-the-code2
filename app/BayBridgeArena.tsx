"use client";
import {useState} from "react";
import {projectWorld,bayRenderCamera} from "../lib/bayBridgePresentation";
import {BAY_CAMERA,BAY_DEPTH_DOMAINS,BAY_LANES,BAY_OBJECTS,BAY_SPAWNS,bayObject} from "../lib/bayBridgeMap";

export function comicProject(x:number,y:number,z=0){
 return projectWorld(x,y,bayRenderCamera,1.85,z);
}
function laneFor(x:number,y:number){return BAY_LANES.find(l=>x>=l.x0&&x<=l.x1&&y>=l.y0&&y<=l.y1)?.id||"TRANSIT"}
function visiblePlanes(angle:number){const a=((angle%(Math.PI*2))+Math.PI*2)%(Math.PI*2),front=Math.cos(a)>=0,right=Math.sin(a)>=0;return ["TOP",front?"FRONT":"BACK",right?"RIGHT":"LEFT","DETAIL","DAMAGE"]}

export default function BayBridgeArena({s,onAnimationQa,onDirector,onSprites,onReset,menuOpen,onMenuToggle}:{s:any;onAnimationQa?:()=>void;onDirector?:()=>void;onSprites?:()=>void;onReset?:()=>void;menuOpen:boolean;onMenuToggle:()=>void}){
 const [qa,setQa]=useState(false),[selected,setSelected]=useState(0),[testAngle,setTestAngle]=useState(0),p=s?.players?.[0]||{x:230,y:330},lane=laneFor(p.x||0,p.y||0),near=(s?.covers||[]).map((c:any)=>bayObject(c.id)).filter(Boolean),actor=BAY_OBJECTS[selected%BAY_OBJECTS.length],planes=visiblePlanes(testAngle);
 return <div className="bayArena bayContainer01 warArena45">
  <div className="arenaMenu">
   <button className="studioMenuButton" onClick={onMenuToggle}>{menuOpen?"✕ CLOSE":"☰ GOD MODE"}</button>
   <div className="cameraChip">CAM B · 1.85</div>
   {menuOpen&&<div className="studioDropdown">
    <button className="menuClose" onClick={onMenuToggle}><strong>✕ CLOSE MENU</strong><span>Return to full-screen play</span></button>
    <b>PLAY</b><button className="active" onClick={onMenuToggle}><strong>DIMENSION 33 · WAR GAMES</strong><span>1v1 arena candidate · matching routes · anchored shelter</span></button>
    <b>TRAINING</b><button onClick={onAnimationQa}><strong>ANIMATION QA</strong><span>Movement / registration diagnostics</span></button>
    <hr/><b>DEV</b><button onClick={()=>setQa(v=>!v)}><strong>{qa?"✓ ":""}MAP CONTAINER QA</strong><span>Projection · depth · lanes · cover schema</span></button>
    <button onClick={onDirector}><strong>DIRECTOR</strong><span>Combat tests · previews</span></button><button onClick={onSprites}><strong>SPRITES</strong><span>Runtime routing inspector</span></button>
    <hr/><button onClick={onReset}><strong>RESET</strong><span>Reset current playtest</span></button>
   </div>}
  </div>
  {qa&&<div className="arenaQa"><b>WAR GAMES SCALE 47</b>
   <span>WORLD {Number(p.x||0).toFixed(1)}, {Number(p.y||0).toFixed(1)}, 0 · LANE {lane}</span>
   <span>PROJECT {JSON.stringify(comicProject(p.x||0,p.y||0,0))}</span>
   <span>CAMERA B · REGISTERED STADIUM PERSPECTIVE · ZOOM 1.85 · SCALE CLAMP {BAY_CAMERA.combatScaleMin}–{BAY_CAMERA.combatScaleMax}</span>
   <span>DEPTH {BAY_DEPTH_DOMAINS.map(d=>d.id+":"+d.nominalDistance).join(" · ")}</span>
   <span>SPAWNS {BAY_SPAWNS.map(x=>x.id+" "+x.x+"/"+x.y).join(" · ")}</span>
   <span>OBJECTS {near.map((o:any)=>o.id+":"+o.material+"/"+o.renderedShell).join(" · ")}</span>
   <hr/><b>ENVIRONMENT ACTOR INSPECTOR</b>
   <span>{actor.editorMetadata.label} · {actor.material} · {actor.shellProfile}</span>
   <span>WORLD {actor.worldPosition.x}/{actor.worldPosition.y}/{actor.worldPosition.z} · HULL {actor.collisionHull.w}×{actor.collisionHull.h} · MASS {actor.mass}</span>
   <span>ROTATION {Math.round(testAngle*180/Math.PI)}° · VISIBLE {planes.join(" + ")}</span>
   <span>GRIP {actor.gripCompatible?"YES":"NO"} · THROW {actor.throwable?"YES":"NO"} · BREAK {actor.breakThreshold}</span><span>RIG SPINE {actor.rig.spine.x0.toFixed(0)}→{actor.rig.spine.x1.toFixed(0)} · RIBS {actor.rig.ribs.length} · COVER RAILS {actor.rig.coverRails.map(r=>r.side+":"+Math.round(r.from*100)+"–"+Math.round(r.to*100)+"%").join(" · ")}</span>
   <div style={{display:"flex",gap:4,pointerEvents:"auto"}}><button onClick={()=>setSelected(v=>(v+1)%BAY_OBJECTS.length)}>NEXT ACTOR</button><button onClick={()=>setTestAngle(v=>(v+Math.PI/4)%(Math.PI*2))}>ROTATE 45°</button></div>
  </div>}
 </div>
}

