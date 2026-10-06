"use client";
import {useEffect,useState} from "react";

// Bump this batch whenever its tested behavior or instructions change.
const BATCH="bay-bridge-comic-depth-arena-01";
const STORAGE="god_mode_playtest_"+BATCH;
type Result="untested"|"good"|"issue";
const TASKS=[
 {title:"Camera comparison",buttons:"Traverse the same route with CAM A → CAM B → CAM C",watch:"Compare Jade/cover readability, bridge scale, depth, aiming clarity and comic-page composition."},
 {title:"Depth test",buttons:"Move foreground → center → deep roadway → center",watch:"Jade must remain stable while roadway, towers, wrecks, steel and horizon communicate depth."},
 {title:"Cover shells",buttons:"Move/slide around concrete cover, steel structure and vehicle silhouettes",watch:"Rendered shell may be irregular; collision must remain simple and predictable."},
 {title:"Combat flow",buttons:"Slide → soft cover → flow → release → Brake → vehicle → A brace → LT → shotgun → escape",watch:"Does this finally feel like a place rather than a Combat Lab?"},
 {title:"Natural run",buttons:"Play hard 60–90 seconds and record",watch:"Judge the battlefield visual language. Do not retune frozen Jade because of a map issue."}
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

