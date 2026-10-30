"use client";
import {useEffect,useRef,useState} from "react";
type State="IDLE"|"WALK"|"PREDATOR RUN"|"BASEBALL SLIDE"|"RECOVERY"|"JUMP";
const clamp=(x:number,a:number,b:number)=>Math.max(a,Math.min(b,x));
export default function RaptorLab(){
 const canvas=useRef<HTMLCanvasElement>(null);const [status,setStatus]=useState("READY");
 useEffect(()=>{
 const c=canvas.current;if(!c)return;const ctx=c.getContext("2d");if(!ctx)return;
 const keys=new Set<string>();let raf=0,last=performance.now(),time=0,shot=0;
 const p={x:240,y:320,vx:0,vy:0,face:1,aim:0,slide:0,recovery:0,jump:0,jumpV:0,run:false,phase:0,hp:100};
 const bullets:{x:number,y:number,vx:number,vy:number}[]=[];const targets=[{x:650,y:240,hp:6},{x:770,y:410,hp:6}];
 const press=(e:KeyboardEvent)=>{if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.code))e.preventDefault();keys.add(e.code);if((e.code==="ShiftLeft"||e.code==="ShiftRight"||e.code==="KeyX")&&!e.repeat&&p.slide<=0&&p.recovery<=0){p.slide=.48;p.run=false}if(e.code==="KeyR"){p.x=240;p.y=320;p.vx=p.vy=0;p.slide=p.recovery=p.jump=0;p.hp=100;targets.forEach(t=>t.hp=6)}if(e.code==="Space"&&p.jump<=0){p.jumpV=390;p.jump=.01}};
 const release=(e:KeyboardEvent)=>keys.delete(e.code);window.addEventListener("keydown",press);window.addEventListener("keyup",release);
 const mouse=(e:MouseEvent)=>{const b=c.getBoundingClientRect();const x=(e.clientX-b.left)*c.width/b.width,y=(e.clientY-b.top)*c.height/b.height;p.aim=Math.atan2(y-p.y,x-p.x);p.face=Math.cos(p.aim)>=0?1:-1};
 const fire=()=>{if(shot>0)return;shot=.16;const a=p.aim;bullets.push({x:p.x+Math.cos(a)*35,y:p.y-26-p.jump+Math.sin(a)*35,vx:Math.cos(a)*640,vy:Math.sin(a)*640})};
 c.addEventListener("mousemove",mouse);const click=()=>fire();c.addEventListener("pointerdown",click);
 const frame=(now:number)=>{const dt=Math.min((now-last)/1000,.035);last=now;time+=dt;shot=Math.max(0,shot-dt);
 const pads=navigator.getGamepads?.()||[];const pad=Array.from(pads).find(Boolean);const ax=pad&&Math.abs(pad.axes[0])>.16?pad.axes[0]:0,ay=pad&&Math.abs(pad.axes[1])>.16?pad.axes[1]:0;
 let dx=Number(keys.has("KeyD")||keys.has("ArrowRight"))-Number(keys.has("KeyA")||keys.has("ArrowLeft"))+ax;
 let dy=Number(keys.has("KeyS")||keys.has("ArrowDown"))-Number(keys.has("KeyW")||keys.has("ArrowUp"))+ay;
 const mag=Math.hypot(dx,dy);if(mag>1){dx/=mag;dy/=mag}
 if(pad){if(Math.hypot(pad.axes[2]||0,pad.axes[3]||0)>.25){p.aim=Math.atan2(pad.axes[3],pad.axes[2]);p.face=Math.cos(p.aim)>=0?1:-1}if(pad.buttons[0]?.pressed&&p.slide<=0&&p.recovery<=0){p.slide=.48;p.run=false}if(pad.buttons[7]?.pressed)fire();if(pad.buttons[10]?.pressed&&p.jump<=0){p.jump=.01;p.jumpV=390}}
 if(keys.has("KeyF"))fire();
 if(p.slide>0){p.slide=Math.max(0,p.slide-dt);p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.slide===0)p.recovery=.16}
 else {p.recovery=Math.max(0,p.recovery-dt);const speed=220;p.vx=dx*speed;p.vy=dy*speed;p.x+=p.vx*dt;p.y+=p.vy*dt;
 const forward=dx*p.face;const eligible=mag>.76&&forward>.45&&p.recovery<=0;
 if(!p.run&&eligible)p.run=true;else if(p.run&&(mag<.58||forward<.2))p.run=false;
 }
 p.x=clamp(p.x,42,918);p.y=clamp(p.y,90,505);
 if(p.jump>0){p.jump+=dt;p.jumpV-=1050*dt;if(p.jumpV<=0&&p.jump>0&&p.jumpV*dt+p.jump<=0){p.jump=0;p.jumpV=0}else{p.jump=Math.max(0,p.jump+p.jumpV*dt)}}
 p.phase+=dt*(p.run?17:mag>.15?9:1);
 const state:State=p.slide>0?"BASEBALL SLIDE":p.recovery>0?"RECOVERY":p.jump>0?"JUMP":p.run?"PREDATOR RUN":mag>.15?"WALK":"IDLE";
 setStatus(s=>s===state?s:state);
 ctx.fillStyle="#0c1421";ctx.fillRect(0,0,960,560);
 ctx.strokeStyle="#263b50";ctx.lineWidth=1;for(let x=0;x<960;x+=48){ctx.beginPath();ctx.moveTo(x,60);ctx.lineTo(x,530);ctx.stroke()}for(let y=60;y<530;y+=48){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(960,y);ctx.stroke()}
 ctx.fillStyle="#142b35";ctx.fillRect(0,50,960,35);ctx.fillRect(0,515,960,45);
 for(const t of targets){if(t.hp<=0)continue;ctx.fillStyle="#ff5775";ctx.fillRect(t.x-16,t.y-36,32,72);ctx.fillStyle="#ffe1e8";ctx.fillRect(t.x-12,t.y-52,24,14);ctx.fillStyle="#111";ctx.fillRect(t.x-20,t.y-65,40,5);ctx.fillStyle="#ff5775";ctx.fillRect(t.x-20,t.y-65,40*t.hp/6,5)}
 for(let i=bullets.length-1;i>=0;i--){const b=bullets[i];b.x+=b.vx*dt;b.y+=b.vy*dt;ctx.fillStyle="#ffda54";ctx.beginPath();ctx.arc(b.x,b.y,4,0,7);ctx.fill();let hit=false;for(const t of targets){if(t.hp>0&&Math.abs(b.x-t.x)<20&&Math.abs(b.y-t.y)<40){t.hp--;hit=true;break}}if(hit||b.x<0||b.x>960||b.y<0||b.y>560)bullets.splice(i,1)}
 ctx.save();ctx.translate(p.x,p.y-p.jump);ctx.scale(p.face,1);
 const slide=state==="BASEBALL SLIDE",run=state==="PREDATOR RUN";const lean=slide?1.0:run?.65:0;const bob=slide?0:Math.sin(p.phase)* (run?5:2);
 ctx.fillStyle="#0008";ctx.beginPath();ctx.ellipse(0,p.jump+5,38,9,0,0,7);ctx.fill();
 ctx.rotate(lean*p.face*.18);
 // articulated silhouette, fixed anchor and separate visual-only tail
 ctx.strokeStyle="#b6a33c";ctx.lineWidth=10;ctx.lineCap="round";
 ctx.beginPath();ctx.moveTo(-10,-47+bob);ctx.quadraticCurveTo(-42,-40+bob,-69+(run?-18:0),-20+bob);ctx.stroke();
 const stride=Math.sin(p.phase)*(run?21:state==="WALK"?10:0);
 ctx.strokeStyle="#687b44";ctx.lineWidth=12;
 ctx.beginPath();ctx.moveTo(-10,-35);ctx.lineTo(slide?-45:-16+stride,slide?-8:-5);ctx.moveTo(11,-35);ctx.lineTo(slide?39:15-stride,slide?-5:-5);ctx.stroke();
 ctx.fillStyle="#596a37";ctx.beginPath();ctx.moveTo(-19,-79+bob);ctx.lineTo(17,-81+bob);ctx.lineTo(25,-34+bob);ctx.lineTo(-16,-34+bob);ctx.closePath();ctx.fill();
 ctx.fillStyle="#d0b445";ctx.fillRect(-13,-78+bob,23,9);ctx.fillRect(-13,-56+bob,23,6);
 ctx.fillStyle="#283d47";ctx.fillRect(-29,-77+bob,15,34);ctx.fillStyle="#d54843";ctx.fillRect(-29,-72+bob,6,8);
 ctx.fillStyle="#6f8649";ctx.beginPath();ctx.moveTo(-8,-99+bob);ctx.lineTo(23,-93+bob);ctx.lineTo(36,-82+bob);ctx.lineTo(5,-77+bob);ctx.closePath();ctx.fill();
 ctx.fillStyle="#ff414c";ctx.fillRect(21,-91+bob,8,5);
 ctx.strokeStyle="#748a52";ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(13,-71+bob);ctx.lineTo(24,-51+bob);ctx.stroke();
 ctx.strokeStyle="#182a32";ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(9,-50+bob);ctx.lineTo(50,-50+bob);ctx.stroke();
 ctx.restore();
 ctx.fillStyle="#e6f4ff";ctx.font="bold 17px monospace";ctx.fillText("RAPTOR / MOTION LAB 37",22,28);ctx.font="13px monospace";ctx.fillStyle="#a8c8d4";ctx.fillText("STATE: "+state+"   |   velocity: "+Math.round(Math.hypot(p.vx,p.vy))+"   |   branch isolated",22,547);
 raf=requestAnimationFrame(frame)};
 raf=requestAnimationFrame(frame);
 return()=>{cancelAnimationFrame(raf);window.removeEventListener("keydown",press);window.removeEventListener("keyup",release);c.removeEventListener("mousemove",mouse);c.removeEventListener("pointerdown",click)};
 },[]);
 return <main style={{minHeight:"100vh",background:"#070c14",color:"#e7f6ff",padding:20,fontFamily:"monospace"}}><h1>GOD MODE / RAPTOR SOLDIER</h1><p>Isolated Build 37 movement prototype — {status}</p><canvas ref={canvas} width={960} height={560} style={{width:"100%",maxWidth:960,border:"1px solid #47626d",touchAction:"none"}}/><p>WASD / left stick move · Shift / X / controller A baseball slide · Mouse aim / click fire · F fire · Space jump · R reset · Right stick aim / RT fire</p><p style={{color:"#f8b15e"}}>Procedural placeholder character. Approved art retargeting and shared combat-system parity are not yet implemented.</p></main>
}
