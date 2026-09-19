/* Isolated art-registration review. No game movement files are imported or modified. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const canvas = $('stage'), ctx = canvas.getContext('2d');
  const data = window.JADE_PROOF_DATA;
  const state = {ready:false,index:0,playing:false,time:0,speed:1,cover:true,opacity:.4,anchors:true,onion:false,scale:.6,flash:0,shots:0,framesDrawn:0};
  const images = [], buttons = [], errors = [];
  const sequence = [0,1,2,2,1,0]; // Held poses; deliberately no invented/interpolated artwork.
  let previousTime = performance.now(), padPrevious = [], padAiming = false;
  let view = {w:900,h:650,scale:1,ox:0,oy:0};
  const fixture = {left:150,right:560,top:180,bottom:630};
  const root = {x:370,y:605};
  function fail(message) { errors.push(String(message)); $('error').hidden=false; $('error').textContent=String(message); state.playing=false; }
  if (!ctx || !data || !Array.isArray(data.frames) || data.frames.length !== 3) { fail('Review setup is incomplete. The original gameplay build is unaffected.'); return; }
  function resize(){const r=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,Math.round(r.width*dpr));canvas.height=Math.max(1,Math.round(r.height*dpr));view.w=r.width;view.h=r.height;view.scale=Math.min(r.width/900,r.height/670);view.ox=(r.width-900*view.scale)/2;view.oy=(r.height-670*view.scale)/2;ctx.setTransform(dpr,0,0,dpr,0,0);}
  new ResizeObserver(resize).observe(canvas); window.addEventListener('resize',resize); resize();
  function pose(index){state.index=Math.max(0,Math.min(2,Math.round(index)));const f=data.frames[state.index];$('poseName').textContent=f.id+' · '+f.name;$('frameInfo').textContent=f.width+' × '+f.height+' px · original RGBA pixels';buttons.forEach((b,i)=>{b.classList.toggle('active',i===state.index);b.setAttribute('aria-pressed',String(i===state.index));});}
  function select(index){state.playing=false;state.time=0;pose(index);sync();}
  function sync(){$('play').textContent=state.playing?'Pause':'Play review';$('play').classList.toggle('active',state.playing);}
  function toggle(){if(!state.ready)return;state.playing=!state.playing;sync();}
  function muzzle(){const f=data.frames[state.index],s=state.scale;return{x:root.x+(f.muzzle[0]-f.groundAnchor[0])*s,y:root.y+(f.muzzle[1]-f.groundAnchor[1])*s};}
  function testEffect(){if(!state.ready)return false;const m=muzzle();if(state.index!==2){$('feedback').textContent='Effect withheld: choose the AIM key first. No new recoil pose exists yet.';return false;}if(state.cover&&m.x<=fixture.right+4){$('feedback').textContent='Effect withheld: candidate muzzle is still inside the screen-space cover fixture.';return false;}state.flash=.11;state.shots++;$('feedback').textContent='Separate muzzle effect shown. This is not a projectile/hit-detection test.';return true;}
  data.frames.forEach((f,i)=>{const b=document.createElement('button');b.innerHTML='<b>'+f.id+'</b> '+f.name;b.onclick=()=>select(i);$('timeline').append(b);buttons.push(b);});
  $('prev').onclick=()=>select((state.index+2)%3);$('next').onclick=()=>select((state.index+1)%3);$('play').onclick=toggle;$('fire').onclick=testEffect;
  $('speed').onchange=e=>state.speed=Number(e.target.value);
  for(const id of ['cover','anchors','onion'])$(id).onchange=e=>state[id]=e.target.checked;
  $('opacity').oninput=e=>state.opacity=Number(e.target.value);$('scale').oninput=e=>state.scale=Number(e.target.value);
  addEventListener('keydown',e=>{if(/INPUT|SELECT/.test(e.target.tagName))return;if(['ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();if(e.repeat)return;if(e.code==='ArrowLeft')select((state.index+2)%3);if(e.code==='ArrowRight')select((state.index+1)%3);if(e.code==='Space')toggle();if(e.code==='KeyC'){state.cover=!state.cover;$('cover').checked=state.cover;}if(e.code==='KeyF')testEffect();});
  addEventListener('blur',()=>{padPrevious=[];padAiming=false;state.playing=false;sync();});
  function pollPad(){const gp=Array.from(navigator.getGamepads?.()||[]).find(p=>p&&p.mapping==='standard');if(!gp){padPrevious=[];return;}const down=gp.buttons.map(b=>b.pressed),edge=i=>down[i]&&!padPrevious[i];$('padState').textContent='Controller detected · LB/RB step · A play · LT aim · RT effect';if(edge(4))select((state.index+2)%3);if(edge(5))select((state.index+1)%3);if(edge(0))toggle();if(down[6]&&!padAiming){padAiming=true;select(2);}if(!down[6]&&padAiming){padAiming=false;select(0);}if(edge(7))testEffect();padPrevious=down;}
  function text(s,x,y,size=12,color='#b8ced8'){ctx.font=size+'px Arial';ctx.fillStyle=color;ctx.fillText(s,x,y);}
  function cross(x,y,col){ctx.strokeStyle=col;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x-9,y);ctx.lineTo(x+9,y);ctx.moveTo(x,y-9);ctx.lineTo(x,y+9);ctx.stroke();}
  function sprite(index,alpha=1){const f=data.frames[index],s=state.scale;ctx.save();ctx.globalAlpha=alpha;ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(images[index],root.x-f.groundAnchor[0]*s,root.y-f.groundAnchor[1]*s,f.width*s,f.height*s);ctx.restore();}
  function coverLayer(){if(!state.cover)return;ctx.save();ctx.globalAlpha=state.opacity;ctx.fillStyle='#223742';ctx.fillRect(fixture.left,fixture.top,fixture.right-fixture.left,fixture.bottom-fixture.top);ctx.fillStyle='#10232e';ctx.fillRect(fixture.right-32,fixture.top,32,fixture.bottom-fixture.top);ctx.strokeStyle='#55d8e8';ctx.lineWidth=2;ctx.strokeRect(fixture.left,fixture.top,fixture.right-fixture.left,fixture.bottom-fixture.top);for(let x=fixture.left+24;x<fixture.right-32;x+=72){ctx.strokeStyle='#345366';ctx.beginPath();ctx.moveTo(x,fixture.top+20);ctx.lineTo(x,fixture.bottom-12);ctx.stroke();}ctx.restore();text('SEPARATE COVER FIXTURE',fixture.left+15,fixture.top+27,11,'#91e7f5');text('Not baked into Jade',fixture.left+15,fixture.top+44,10);}
  function draw(){if(!state.ready)return;const dpr=Math.min(devicePixelRatio||1,2);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,view.w,view.h);ctx.fillStyle='#09121c';ctx.fillRect(0,0,view.w,view.h);ctx.save();ctx.translate(view.ox,view.oy);ctx.scale(view.scale,view.scale);
    const grad=ctx.createLinearGradient(0,0,0,670);grad.addColorStop(0,'#101724');grad.addColorStop(1,'#081119');ctx.fillStyle=grad;ctx.fillRect(0,0,900,670);
    ctx.strokeStyle='#1a2b3a';ctx.lineWidth=1;for(let x=-100;x<1000;x+=60){ctx.beginPath();ctx.moveTo(x,540);ctx.lineTo(x+95,670);ctx.stroke();}for(let y=550;y<670;y+=25){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(900,y);ctx.stroke();}
    text('CHARACTER-ONLY ART / REGISTERED KEY REVIEW',28,30,12,'#50e3ee');text('Three actual poses. No synthetic in-between drawings.',28,51,11);
    ctx.fillStyle='#03090fa0';ctx.beginPath();ctx.ellipse(root.x+90,root.y,150,12,0,0,Math.PI*2);ctx.fill();if(state.onion)sprite((state.index+2)%3,.18);sprite(state.index);coverLayer();
    const m=muzzle();if(state.anchors){cross(root.x,root.y,'#ffe36b');cross(m.x,m.y,'#64f4fd');text('SUPPORT FOOT • candidate',root.x-86,root.y+34,10,'#ffe36b');text('MUZZLE • candidate',Math.min(m.x+14,715),m.y-12,10,'#64f4fd');ctx.setLineDash([5,6]);ctx.strokeStyle='#3c6678';ctx.beginPath();ctx.moveTo(fixture.right,fixture.top-30);ctx.lineTo(fixture.right,fixture.bottom+15);ctx.stroke();ctx.setLineDash([]);}
    if(state.flash>0){ctx.save();ctx.translate(m.x,m.y);ctx.fillStyle='#fff6c1';ctx.beginPath();for(let n=0;n<12;n++){const a=n/12*Math.PI*2,r=n%2?9:36;const x=Math.cos(a)*r,y=Math.sin(a)*r*.55;n?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.closePath();ctx.fill();ctx.restore();}
    text(data.frames[state.index].id+'  '+data.frames[state.index].name,28,651,15,'#ff63b5');text('REVIEW TIMING • NOT v11.1 GAMEPLAY',552,651,11,'#a9bdca');ctx.restore();state.framesDrawn++;
  }
  function advance(dt){if(state.playing){state.time+=dt*state.speed;pose(sequence[Math.floor(state.time/.75)%sequence.length]);}state.flash=Math.max(0,state.flash-dt);}
  function frame(now){const dt=Math.max(0,Math.min(.05,(now-previousTime)/1000));previousTime=now;try{pollPad();advance(dt);draw();}catch(e){fail(e.message);}requestAnimationFrame(frame);}
  window.__JADE_REVIEW__={getState:()=>({...state,errors:[...errors],muzzle:muzzle(),root:{...root}}),select,setCover:(on)=>{state.cover=!!on;$('cover').checked=state.cover;draw();},testEffect,draw,advance,ready:()=>state.ready};
  Promise.all(data.frames.map((f,i)=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>{if(im.naturalWidth!==f.width||im.naturalHeight!==f.height){reject(new Error(f.id+' dimension mismatch'));return;}images[i]=im;resolve();};im.onerror=()=>reject(new Error('Could not load '+f.file+'. Extract the whole package, or open the self-contained HTML.'));im.src=window.JADE_EMBEDDED_IMAGES?.[f.id]||f.file;}))).then(()=>{state.ready=true;$('loading').hidden=true;pose(0);draw();}).catch(e=>fail(e.message));
  requestAnimationFrame(frame);
})();
