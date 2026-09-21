/* Offline same-computer host. The 08L Duel owns all movement, shots, and damage. */
(()=>{
'use strict';
const $=id=>document.getElementById(id),C=window.JadeCore,L=window.JadeLocalDuel,I=window.JadeLocalInput,F=window.JadeFixture;
const renderer=new DuelRenderer($('stage'),fail),devices=new I.DeviceRouter();
let world=new L.Duel(),boxes=[new L.InputMailbox(),new L.InputMailbox()],sequence=[0,0],loaded=false,paused=true,elapsed=0,last=performance.now(),key={},pulse={},mouse={x:0,y:0,left:false,right:false,active:false},lastAims=[0,Math.PI],previousMenu=new Map(),swapped=false,inspection=false,fixtureInfo=null,focusPaused=false,gamepadDenied=false;
const notes=[],inputLog=[];let lastSample=[I.neutral(0),I.neutral(Math.PI)];
function note(type,extra={}){notes.push({time:world.time,tick:world.tick,type,...extra});if(notes.length>300)notes.shift();}
function fail(reason){const msg=String(reason?.message||reason);$('error').textContent=msg;loaded=false;paused=true;$('banner').hidden=false;$('banner').textContent='Asset or runtime error. Previous saved builds are unchanged.';}
function pads(){try{gamepadDenied=false;return Array.from(navigator.getGamepads?.()||[]).filter(Boolean);}catch(e){gamepadDenied=true;return [];}}
function clear(){key={};pulse={};mouse.left=mouse.right=false;boxes=[new L.InputMailbox(),new L.InputMailbox()];sequence=[0,0];elapsed=0;}
function pause(reason='Paused'){paused=true;clear();$('banner').textContent=reason+' · Release action buttons, then Resume.';$('banner').hidden=false;$('pause').textContent='Resume';note('pause',{reason});}
function bindDevices(){const found=pads();devices.bind(found,$('mode').value,swapped);previousMenu=new Map(found.map(p=>[p.index,!!p.buttons[9]?.pressed]));return found;}
function names(){return[$('name0').value.trim()||'Player 1',$('name1').value.trim()||'Player 2'];}
function packet(){return{state:world.snapshot(),slot:0,names:names()};}
function render(){if(!loaded)return;renderer.accept(packet());renderer.draw(1/60);readout();}
function start(){if(!loaded)return;clear();bindDevices();inspection=false;fixtureInfo=null;renderer.setFollowSeat(null);world.duration=Number($('duration').value);world.begin();lastAims=[0,Math.PI];paused=false;focusPaused=false;last=performance.now();$('banner').hidden=true;$('pause').textContent='Pause';note('round_start_local',{devices:devices.bindings.slice()});render();}
function resume(){if(!loaded)return;if(world.phase!=='playing'){start();return;}clear();bindDevices();paused=false;focusPaused=false;last=performance.now();$('banner').hidden=true;$('pause').textContent='Pause';note('resume');}
function keyboard(){const out=I.neutral(lastAims[0]);out.x=(key.KeyD?1:0)-(key.KeyA?1:0);out.y=(key.KeyS?1:0)-(key.KeyW?1:0);const m=Math.hypot(out.x,out.y);if(m>1){out.x/=m;out.y/=m;}
 if(mouse.active)out.aim=renderer.aim(mouse.x,mouse.y);
 out.aimHeld=mouse.right;out.fire=mouse.left||!!pulse.fire;out.slide=!!(key.ShiftLeft||key.ShiftRight||pulse.slide);out.wrap=!!(key.Space||pulse.wrap);out.attach=!!(key.KeyE||pulse.attach);return out;}
function collect(){const found=pads();
 // Do not silently transfer a disconnected controller's seat to another device.
 const previouslyBound=devices.bindings.slice();
 const result=devices.sample(found,keyboard(),lastAims);
 if(previouslyBound.some((id,i)=>id!==null&&result.missing[i])){pause('A controller disconnected');return null;}
 for(const p of found){const now=!!p.buttons[9]?.pressed,prior=previousMenu.get(p.index)||false;previousMenu.set(p.index,now);if(now&&!prior){pause('Controller Menu pause');return null;}}
 lastSample=result.slots;lastAims=result.slots.map(x=>x.aim);pulse={};return result.slots;}
function advance(raw){
 const now=world.time*1000;
 const inputs=raw.map((r,i)=>{boxes[i].accept({seq:sequence[i]++,...r},now);return boxes[i].take(now);});
 inputLog.push({tick:world.tick+1,inputs});if(inputLog.length>3600)inputLog.shift();world.advance(inputs);
 if(world.phase==='finished'){paused=true;clear();const who=world.winner===null?'Draw':names()[world.winner]+' wins';$('banner').textContent=who+' · Start / rematch for another round.';$('banner').hidden=false;note('round_end_local',{winner:world.winner});}
}
function readout(){
 const remaining=Math.max(0,Math.ceil(world.duration-world.time));$('clock').textContent=`${Math.floor(remaining/60)}:${String(remaining%60).padStart(2,'0')}`;
 $('round').textContent=inspection?`P${fixtureInfo.slot+1} ${fixtureInfo.kind} inspection`:`Round ${world.round||'—'} · ${paused?'paused':world.phase}`;
 const nn=names();for(let i=0;i<2;i++){$('p'+i).textContent=nn[i];$('hp'+i).textContent=world.players[i].hp;}
 $('score').textContent=`Score ${world.scores[0]} : ${world.scores[1]}`;
 const found=pads();$('inputStatus').textContent=(devices.mode==='keyboard-pad'?'P1: keyboard / mouse':'P1: controller '+(devices.bindings[0]===null?'not assigned':devices.bindings[0]+1))+'\nP2: controller '+(devices.bindings[1]===null?'not assigned':devices.bindings[1]+1)+(gamepadDenied?'\nBrowser denied controller access. Keyboard inspection remains available.':'');
 $('deviceStatus').textContent=found.length?`${found.length} controller(s) visible. Start/Resume binds devices.`:'Press a face button on each connected controller, then Start. Without one, P2 stays idle.';
 const r=renderer.inspect();$('artStatus').textContent=r.frames.map((f,i)=>`P${i+1}: ${f?.label||'not drawn'}`).join('\n');
 $('stats').textContent=`Shared local simulation · ${world.tick} ticks\nShots ${world.metrics.shots} · hits ${world.metrics.hits}\nSlide restarts rejected ${world.stats.rejectedSlides}\nMissing image draws ${r.counts.missing}`;
}
$('start').onclick=start;$('pause').onclick=()=>paused?resume():pause();
$('mode').onchange=()=>{pause('Control assignment changed');bindDevices();readout();};
$('swap').onclick=()=>{swapped=!swapped;pause('Controller order changed');bindDevices();readout();};
$('xray').onchange=e=>{renderer.setXray(e.target.checked);render();};$('cover').onchange=e=>{renderer.setCoverArt(e.target.checked);render();};$('finalArt').onchange=e=>{renderer.setFinalArt(e.target.checked);render();};
$('calibrated').onchange=e=>{renderer.setCalibration(e.target.checked);render();};
$('coverMotion').onchange=e=>{renderer.setCoverMotion(e.target.checked);render();};
$('lowCover').onchange=e=>{renderer.setLowCover(e.target.checked);render();};
$('coverSize').oninput=e=>{const v=Number(e.target.value);renderer.setCoverSize(v);$('coverSizeReadout').textContent=Math.round(v*100)+'%';render();};
$('crouchCycle').onchange=e=>{renderer.setCrouchCycle(e.target.checked);render();};
$('followJade').onchange=e=>{renderer.setFollowSeat(e.target.checked&&inspection?fixtureInfo.slot:null);render();};
$('compareR1').onclick=()=>{const old=$('calibrated').checked||$('coverMotion').checked;$('calibrated').checked=!old;$('coverMotion').checked=!old;renderer.setCalibration(!old);renderer.setCoverMotion(!old);$('lowCover').checked=!old;renderer.setLowCover(!old);$('compareR1').textContent=old?'Return to R4 presentation':'Compare original R1 presentation';note('presentation_compare',{version:old?'R1':'R4'});render();};
$('zoom').oninput=e=>{renderer.setZoom(Number(e.target.value));render();};
function fit(){const r=$('stage').getBoundingClientRect(),z=Math.max(.35,Math.min(.95,(r.width-100)/1180,(r.height-105)/620));$('zoom').value=z;renderer.setZoom(z);render();}
$('fit').onclick=fit;
function setupFixture(kind='corner') {
 if(!loaded)return;
 clear();
 const slot=F.seat($('inspectSeat').value,$('mode').value);
 fixtureInfo=F.setup(world,slot,kind);
 inspection=true;renderer.setFollowSeat($('followJade').checked?slot:null);lastAims=fixtureInfo.aims.slice();
 const instruction=kind==='cover-movement'?'Move left/right with A/D or LS. Aim right for the supported art view.':kind==='corner'?'Aim right with LT / right mouse, then fire.':kind==='cover-entry'?'Resume, aim right, then move up + slide toward the barrier. Move left/right once attached.':'Two stationary players are aligned. Aim right and tap fire.';
 pause('P'+(slot+1)+' '+kind+' fixture. '+instruction);
 note('fixture_setup',{slot,kind,controlsUnchanged:true});render();
}
$('inspect').onclick=()=>setupFixture('corner');
$('lineOfFire').onclick=()=>setupFixture('clear-shot');
$('coverEntry').onclick=()=>setupFixture('cover-entry');
$('quickCover').onclick=()=>{bindDevices();const slot=devices.mode==='keyboard-pad'&&devices.bindings[1]!==null?1:0;$('inspectSeat').value=String(slot);setupFixture('cover-movement');$('zoom').value=1.1;renderer.setZoom(1.1);resume();};
$('export').onclick=()=>{const payload={build:'B11-LOW-COVER-TEST-R4',localOnly:true,transport:'none',state:world.snapshot(),names:names(),devices:{mode:devices.mode,bindings:devices.bindings},renderer:renderer.inspect(),inputs:inputLog,notes,fixtureInfo};const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='GOD-MODE-B11-R4-playtest.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
function focusLoss(){if(loaded&&world.phase==='playing'){focusPaused=true;pause('Window lost focus');}else clear();}
addEventListener('blur',focusLoss);document.addEventListener('visibilitychange',()=>{if(document.hidden)focusLoss();});
addEventListener('keydown',e=>{if(/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;if(['Space','ShiftLeft','ShiftRight'].includes(e.code))e.preventDefault();if(e.repeat)return;key[e.code]=true;
 if(e.code==='KeyP'){paused?resume():pause();return;}if(e.code==='Enter'){start();return;}
 if(!paused){if(e.code.startsWith('Shift'))pulse.slide=true;if(e.code==='Space')pulse.wrap=true;if(e.code==='KeyE')pulse.attach=true;}
});addEventListener('keyup',e=>{key[e.code]=false;});
const canvas=$('stage');canvas.addEventListener('contextmenu',e=>e.preventDefault());
canvas.addEventListener('pointermove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;mouse.active=true;});
canvas.addEventListener('pointerdown',e=>{canvas.focus();mouse.x=e.clientX;mouse.y=e.clientY;mouse.active=true;if(e.button===2)mouse.right=true;else if(e.button===0){mouse.left=true;pulse.fire=true;}});
addEventListener('pointerup',e=>{if(e.button===2)mouse.right=false;else if(e.button===0)mouse.left=false;});canvas.addEventListener('pointercancel',()=>{mouse.left=mouse.right=false;pulse.fire=false;});
function frame(now){const dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;
 try{if(loaded){if(!paused){elapsed+=dt;while(elapsed>=C.DT&&!paused){const raw=collect();if(!raw)break;advance(raw);elapsed-=C.DT;}}render();}}catch(e){fail(e);}requestAnimationFrame(frame);}
window.__JADE_COUCH__={inspect:()=>({loaded,paused,inspection,fixtureInfo,focusPaused,state:world.snapshot(),inputs:lastSample,devices:{mode:devices.mode,bindings:devices.bindings.slice()},render:renderer.inspect(),notes:[...notes]}),start,pause,resume,setupFixture,world:()=>world,step:(inputs,n=1)=>{for(let k=0;k<n;k++)advance(inputs);render();},render};
renderer.load().then(()=>{loaded=true;$('start').disabled=false;$('pause').disabled=false;$('inspect').disabled=false;$('lineOfFire').disabled=false;$('coverEntry').disabled=false;$('quickCover').disabled=false;bindDevices();fit();$('banner').textContent='Local two-player test ready. Choose controls and Start.';render();}).catch(fail);
requestAnimationFrame(frame);
})();
