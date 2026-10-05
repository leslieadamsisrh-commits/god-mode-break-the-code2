"use client";
import {useEffect,useMemo,useRef,useState} from "react";

const COURSE=[
 ["A1 RIGHT","Hold RIGHT ~4s → stop → repeat ×3","Run family / direction / frame / speed"],
 ["A2 DOWN-RIGHT","Hold DOWN-RIGHT ~4s → stop → repeat ×3","Leg drive, pelvis, boots, backpack, cape"],
 ["A3 DOWN","Hold DOWN ~4s → stop → repeat ×3","Stride continuity / ground anchor"],
 ["A4 DOWN-LEFT","Hold DOWN-LEFT ~4s → stop → repeat ×3","Stride continuity / feet"],
 ["A5 LEFT","Hold LEFT ~4s → stop → repeat ×3","Stride continuity / scale"],
 ["A6 UP-LEFT","Hold UP-LEFT ~4s → stop → repeat ×3","Diagonal leg cycle / cape"],
 ["A7 UP","Hold UP ~4s → stop → repeat ×3","Stride continuity / backpack"],
 ["A8 UP-RIGHT","Hold UP-RIGHT ~4s → stop → repeat ×3","Special: verify d21 corrected presentation donor"],
 ["B TRANSITIONS","Idle↔directions · cardinal↔diagonal · opposites","Foot skating / side-kick / root / helmet / backpack / cape"],
 ["C SLIDE","8-dir run → committed slide → complete → recover","Slide dir / frame / phase / speed"],
 ["D BRAKE","Straight → 45° → 90° → 180° redirects","KB entry / compression / pivot / release"],
 ["E COVER","Waist + tall: FACE / EDGE / CORNER / shuffle / reverse","Topology / attachment / cover speed / state"],
 ["F LT PLANT","Traverse → stop → hold LT → push LS every way → release","PLANTED must hold root; release restores traversal"],
 ["G 360 AIM","Plant → one full clockwise + counterclockwise circle","Sector / major key / connector / muzzle continuity"],
 ["H SHOTGUN","At major keys: AIM → RT → recoil → recovery","Weapon state / cadence / shells / muzzle"],
 ["I RETRACT","Release LT from 45/90/135/180/opposites","Connector → protected; interrupt with LT/shield/A"],
 ["J STRESS","PLAY HARD 60–90 sec","Natural continuity under real input"]
] as const;

function deg(a:number){let d=(a||0)*180/Math.PI;return ((d%360)+360)%360}
function dir24(a:number){return ((Math.round((a||0)/(Math.PI*2)*24)%24)+24)%24}
function sector16(a:number){return ((Math.round((a||0)/(Math.PI*2)*16)%16)+16)%16}
function majorKey(s:number){const d=s*22.5;return [0,45,90,135,180,225,270,315].reduce((a,b)=>Math.abs(b-d)<Math.abs(a-d)?b:a,0)}
function family(p:any){const sp=Math.hypot(p?.vx||0,p?.vy||0);return p?.coverId?"cover":p?.slide>0||p?.pinball>0||p?.knock>.32?"slide":sp>34?"run":"ready"}

export default function AnimationQaHarness({s,onExit}:{s:any;onExit:()=>void}){
 const [step,setStep]=useState(0),[events,setEvents]=useState<string[]>([]),[warn,setWarn]=useState<string[]>([]);
 const prev=useRef<any>(null),lastSector=useRef<{v:number,t:number}|null>(null),lastMuzzle=useRef<{x:number;y:number;aim:number}|null>(null);
 const p=s?.players?.[0]||{},cfg=s?.config||{},fam=family(p),speed=Math.hypot(p.vx||0,p.vy||0),ang=fam==="run"&&speed>55?Math.atan2(p.vy||0,p.vx||0):(p.gunFacing??p.aim??0);
 const d=dir24(ang),sec=sector16(p.gunFacing??p.aim??0),topology=p?.coverAnchor?(Math.min(p.coverAnchor.t||0,(p.coverAnchor.length||0)-(p.coverAnchor.t||0))<18?"EDGE":"FACE"):"—";
 const source=`${fam}-d${String(d).padStart(2,"0")}.webp`,corrected=fam==="run"&&d===21;
 const mu={x:(p.x||0)+Math.cos(p.gunFacing??p.aim??0)*34,y:(p.y||0)+Math.sin(p.gunFacing??p.aim??0)*34};
 const weapon=p.weaponState||((p.recoil||0)>0?"RECOIL":(p.fireState||0)>0?"FIRE":"READY");
 const cadence=Math.max(0,(cfg.shotCadence||.39)-((s?.time||0)-(p.lastShot??-99)));
 useEffect(()=>{
  const now=performance.now(),q=prev.current,lines:string[]=[],warnings:string[]=[];
  const state=`${fam.toUpperCase()} d${String(d).padStart(2,"0")}`;
  if(!q||q.state!==state)lines.push(state);
  if(q&&q.cover!==p.coverId)lines.push(`COVER ${p.coverId||"FREE"}`);
  if(q&&q.planted!==!!p.input?.coverAim)lines.push(p.input?.coverAim?"LT PLANT":"LT RELEASE");
  if(q&&q.fire<=0&&(p.fireState||0)>0)lines.push("FIRE");
  if(q&&q.recoil<=0&&(p.recoil||0)>0)lines.push("RECOIL");
  if(q&&q.return<=0&&(p.returnToCover||0)>0)lines.push("RETRACT");
  if(corrected&&(!q||!q.corrected))lines.push("d21 → d22 CORRECTED DONOR");
  if(p.input?.coverAim&&q&&Math.hypot((p.x||0)-q.x,(p.y||0)-q.y)>2.5)warnings.push("⚠ COVER ROOT DRIFT");
  if(speed<2&&q&&fam==="run"&&q.frame!==Math.floor((s?.time||0)*10)%6)warnings.push("⚠ FOOT PHASE WARNING");
  if(lastSector.current&&lastSector.current.v!==sec&&now-lastSector.current.t<90)warnings.push("⚠ SECTOR CHATTER");
  if(!lastSector.current||lastSector.current.v!==sec)lastSector.current={v:sec,t:now};
  if(lastMuzzle.current){const dm=Math.hypot(mu.x-lastMuzzle.current.x,mu.y-lastMuzzle.current.y),da=Math.abs(deg((p.gunFacing??p.aim??0)-lastMuzzle.current.aim));if(dm>20&&da<12)warnings.push("⚠ MUZZLE POP")}
  lastMuzzle.current={...mu,aim:p.gunFacing??p.aim??0};
  if(lines.length)setEvents(e=>[...lines,...e].slice(0,12));
  if(warnings.length)setWarn(w=>[...warnings,...w].slice(0,6));
  prev.current={state,cover:p.coverId,planted:!!p.input?.coverAim,fire:p.fireState||0,recoil:p.recoil||0,return:p.returnToCover||0,corrected,x:p.x||0,y:p.y||0,frame:Math.floor((s?.time||0)*(fam==="run"?10:7))%6};
 },[s?.time,p.x,p.y,p.coverId,p.input?.coverAim,p.fireState,p.recoil,p.returnToCover,fam,d,sec,corrected]);

 const c=COURSE[Math.max(0,Math.min(COURSE.length-1,step))];
 return <div className="qaHarness">
  <div className="qaHead"><div><small>ANIMATION QA HARNESS 01</small><b>{c[0]}</b></div><button onClick={onExit}>EXIT QA / PLAY NORMALLY</button></div>
  <div className="qaPrompt"><strong>INPUT</strong><span>{c[1]}</span><strong>WATCH</strong><span>{c[2]}</span></div>
  <div className="qaNav"><button onClick={()=>setStep(Math.max(0,step-1))}>PREVIOUS</button><button onClick={()=>{setEvents([]);setWarn([])}}>REPEAT / CLEAR</button><button onClick={()=>setStep(Math.min(COURSE.length-1,step+1))}>NEXT</button><span>{step+1}/{COURSE.length}</span></div>
  <div className="qaGrid">
   <section><b>MOVEMENT</b><span>STATE {fam.toUpperCase()}</span><span>SPEED {speed.toFixed(1)}</span><span>VEL {deg(Math.atan2(p.vy||0,p.vx||0)).toFixed(0)}°</span><span>INPUT {deg(Math.atan2(p.input?.y||0,p.input?.x||0)).toFixed(0)}°</span></section>
   <section><b>SPRITE</b><span>DIR d{String(d).padStart(2,"0")} · {deg(ang).toFixed(0)}°</span><span>SRC {source}</span><span>FRAME {Math.floor((s?.time||0)*(fam==="run"?10:7))%6}</span><span>{corrected?"CORRECTED DONOR d22":"EXACT / RUNTIME"}</span></section>
   <section><b>ACTOR</b><span>ROOT {(p.x||0).toFixed(1)}, {(p.y||0).toFixed(1)}</span><span>PELVIS runtime root</span><span>GROUND {fam==="cover"?.86:.88}</span><span>SCALE {(cfg.spriteScale||.82).toFixed(2)}</span></section>
   <section><b>COVER</b><span>ID {p.coverId||"FREE"}</span><span>CLASS {p.coverId?(s?.covers||[]).find((x:any)=>x.id===p.coverId)?.coverClass||"generated":"—"}</span><span>TOPO {topology}</span><span>PLANTED {p.input?.coverAim?"YES":"NO"}</span></section>
   <section><b>AIM</b><span>RAW {deg(p.gunFacing??p.aim??0).toFixed(1)}°</span><span>SECTOR {sec}/15</span><span>KEY A{majorKey(sec)}</span><span>CONNECTOR {(p.returnToCover||0)>0?"RETRACT":(p.input?.coverAim?"AIM":"—")}</span></section>
   <section><b>WEAPON</b><span>{weapon}</span><span>MUZZLE {mu.x.toFixed(1)}, {mu.y.toFixed(1)}</span><span>CADENCE {cadence.toFixed(2)}s</span><span>SHELLS {p.shells??"—"}/{p.maxShells??"—"} · RES {p.reserveShells??"—"}</span></section>
  </div>
  <div className="qaBottom"><section><b>EVENT STRIP</b>{events.length?events.map((e,i)=><span key={i}>{e}</span>):<span>WAITING FOR TRANSITIONS…</span>}</section><section className="qaWarnings"><b>WARNINGS</b>{warn.length?warn.map((e,i)=><span key={i}>{e}</span>):<span>NONE</span>}</section></div>
 </div>
}
