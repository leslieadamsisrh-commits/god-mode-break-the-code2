"use client";
import {useEffect,useState} from "react";

// Bump this batch whenever its tested behavior or instructions change.
const BATCH="sprite-actor-art-integration-03a";
const STORAGE="god_mode_playtest_"+BATCH;
type Result="untested"|"good"|"issue";
const TASKS=[
 {title:"Brake / pivots",buttons:"Slide → Brake → redirect 45° / 90° / 180°",watch:"Current-production L04/L05 + KB actor frames should read as planted momentum changes. Watch root, feet, scale and concrete response."},
 {title:"Aim Ring",buttons:"Cover + LT → slowly rotate full 360° → fire at 45° / 90° / 135° / 180° and opposite directions",watch:"Gameplay aim remains continuous. A90/A135/A180 current-production keys should replace side/rear fallbacks without disappearing, mirroring errors or muzzle drift."},
 {title:"Full flow",buttons:"Run → slide → Brake → redirect → cover → shuffle → LT → 360° aim → fire → recoil → retract → A escape",watch:"Judge whether current-production Jade now reads as one actor through the full combat circle. Flag any component that should be rejected/rebuilt."}
];
const LABELS:Record<Result,string>={untested:"Untested",good:"✓ Feels good",issue:"Issue reported"};
export default function PlaytestGuide(){
 const [ready,setReady]=useState(false),[visible,setVisible]=useState(true),[task,setTask]=useState(0),[results,setResults]=useState<Result[]>(["untested","untested","untested"]),[saved,setSaved]=useState(true);
 useEffect(()=>{try{const v=JSON.parse(localStorage.getItem(STORAGE)||"null");if(v?.batch===BATCH){if(Array.isArray(v.results)&&v.results.length===3&&v.results.every((r:unknown)=>r==="untested"||r==="good"||r==="issue"))setResults(v.results);if(Number.isInteger(v.task)&&v.task>=0&&v.task<3)setTask(v.task);if(typeof v.visible==="boolean")setVisible(v.visible)}}catch{}setReady(true)},[]);
 useEffect(()=>{if(!ready)return;try{localStorage.setItem(STORAGE,JSON.stringify({batch:BATCH,task,visible,results}));setSaved(true)}catch{setSaved(false)}},[ready,task,visible,results]);
 const mark=(result:Result)=>setResults(previous=>previous.map((r,n)=>n===task?result:r));
 const good=results.filter(r=>r==="good").length;
 return <aside className="playtestGuide" aria-label="Playtest guide" onKeyDown={e=>e.stopPropagation()} onKeyUp={e=>e.stopPropagation()}>
  <div className="guideHeading"><strong>PLAYTEST GUIDE</strong><span>{good}/3 approved</span><button onClick={()=>setVisible(!visible)} aria-expanded={visible}>{visible?"Hide":"Show"}</button></div>
  {visible&&<><small>{BATCH} · TASK {task+1}/3</small><h2>{TASKS[task].title}</h2><p className="guideButtons">{TASKS[task].buttons}</p><p>{TASKS[task].watch}</p>
   <div className="guideStatus" role="status">{LABELS[results[task]]}</div>
   <div className="guideFeedback"><button aria-pressed={results[task]==="good"} onClick={()=>mark("good")}>✓ Feels good</button><button onClick={()=>mark("untested")}>↻ Try again</button><button aria-pressed={results[task]==="issue"} onClick={()=>mark("issue")}>Issue</button></div>
   <div className="guideNavigation"><button disabled={task===0} onClick={()=>setTask(task-1)}>Previous</button><span>{results.map((r,n)=><span key={n} aria-label={`Task ${n+1}: ${LABELS[r]}`} className={r}>{n+1}{r==="good"?" ✓":r==="issue"?" !":" ○"} </span>)}</span><button disabled={task===2} onClick={()=>setTask(task+1)}>Next</button></div>
   <small>Your check confirms feel. Try again clears only this task. {saved?"Saved on this device.":"Saving unavailable on this device."}</small></>}
 </aside>;
}

