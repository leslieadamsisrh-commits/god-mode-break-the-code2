"use client";
import {useEffect,useState} from "react";

// Bump this batch whenever its tested behavior or instructions change.
const BATCH="sprite-actor-pack03-production-boundary-v1";
const STORAGE="god_mode_playtest_"+BATCH;
type Result="untested"|"good"|"issue";
const TASKS=[
 {title:"Lower-body language",buttons:"Slide → cover → shuffle → stop → reverse → edge → corner · then Brake 45° / 90° / 180°",watch:"Approved low-brace/shuffle donors should stay registered. True planted pivots remain production-art missing; judge feet/pelvis and Brake ground response."},
 {title:"Aim-ring QA",buttons:"Cover + LT → rotate 0° → 45° → 90° → 135° → 180° → 225° → 270° → 315° → 360°",watch:"30–60° authored region should read cleanly. Side/rear sectors are intentionally safe fallback/MISSING until approved A90/A135/A180 art is authored; gameplay aim must remain 360°."},
 {title:"Full combat sentence",buttons:"Run → slide → Brake → redirect → cover → shuffle → LT → rotate → fire → recoil → retract → A escape → slide",watch:"Verify immediate control, stable protected mechanics, and no disappearing/debug Jade. Record where missing art—not mechanics—breaks continuity."}
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

