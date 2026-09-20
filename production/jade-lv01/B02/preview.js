(()=>{
'use strict';
const $=id=>document.getElementById(id),c=$('stage'),ctx=c.getContext('2d'),catalog=window.JADE_B02;
const player=new JadeSpriteCatalog.ReviewPlayer(catalog),source=new Image(),master=new Image();
let ready=false,previous=performance.now(),trace=[],lastId='',zoom=1;
function error(e){$('error').hidden=false;$('error').textContent=String(e.message||e);player.pause();}
function load(im,file){return new Promise((resolve,reject)=>{im.onload=()=>resolve(im);im.onerror=()=>reject(Error('Unable to load '+file));im.src=window.JADE_B02_EMBED?.[file]||file;});}
function draw(){
 if(!ready)return;
 const f=player.current();ctx.fillStyle='#0b1420';ctx.fillRect(0,0,c.width,c.height);
 const scale=Math.min((c.height-116)/388,(c.width-70)/273)*zoom;
 const x=(c.width-f.size[0]*scale)/2,y=c.height-58-f.size[1]*scale;
 const spec=JadeSpriteCatalog.drawReference(ctx,source,f,{x,y,scale});
 ctx.fillStyle='#d4e9f3';ctx.font='15px monospace';ctx.fillText(f.id+'  '+f.label,22,28);
 ctx.fillStyle='#df98c9';ctx.font='12px monospace';ctx.fillText('REFERENCE ONLY / ORIGINAL PANEL PIXELS / NOT IN-GAME SCALE',22,c.height-23);
 $('frameLabel').textContent=f.id+' — '+f.label;
 $('dimensions').textContent=f.size.join(' × ')+' native pixels · source panel includes labels/grid/floor';
 $('status').textContent='Design approved · 12 source crops · transparency/anchors/animation pending';
 $('description').textContent=catalog.clips[player.clipName].description;
 $('play').textContent=player.playing?'Pause':'Play review';
 $('seek').max=player.duration();$('seek').value=player.elapsedMs;
 $('clock').textContent=(player.elapsedMs/1000).toFixed(2)+'s / review timing only';
 document.querySelectorAll('[data-frame]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.frame===f.id)));
 if(f.id!==lastId){trace.push({frame:f.id,clip:player.clipName,elapsedMs:player.elapsedMs});lastId=f.id;}
 window.__JADE_B02_LAST__=spec;
}
for(const [name,clip] of Object.entries(catalog.clips)){const o=document.createElement('option');o.value=name;o.textContent=name.replaceAll('-',' ');$('clip').append(o);}
for(const f of catalog.frames){const b=document.createElement('button');b.textContent=f.id+' '+f.label;b.dataset.frame=f.id;b.onclick=()=>{player.selectFrame(f.id);draw();};$('frames').append(b);}
$('clip').onchange=e=>{player.selectClip(e.target.value);draw();};
$('play').onclick=()=>{player.playing?player.pause():player.play();draw();};
$('seek').oninput=e=>{player.pause();player.seek(+e.target.value);draw();};
$('speed').onchange=e=>player.setSpeed(+e.target.value);
$('zoom').onchange=e=>{zoom=+e.target.value;draw();};
function step(d){const i=catalog.frames.findIndex(f=>f.id===player.current().id);player.selectFrame(catalog.frames[(i+d+12)%12].id);draw();}
$('prev').onclick=()=>step(-1);$('next').onclick=()=>step(1);
addEventListener('keydown',e=>{if(/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;if(['ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault();if(e.repeat)return;if(e.code==='ArrowLeft')step(-1);if(e.code==='ArrowRight')step(1);if(e.code==='Space')$('play').click();});
addEventListener('blur',()=>{player.pause();draw();});
$('export').onclick=()=>{const data={catalog:catalog.id,sourceSha256:catalog.source.sha256,kind:'REFERENCE_REVIEW_NOT_GAMEPLAY',trace};const u=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=u;a.download='JADE_B02_review_trace.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);};
window.__JADE_B02_REVIEW__={ready:()=>ready,player,draw,state:()=>({id:player.current().id,playing:player.playing,time:player.elapsedMs,traceCount:trace.length})};
Promise.all([load(source,catalog.source.file),load(master,catalog.visualAuthority.file)]).then(()=>{
 if(source.naturalWidth!==catalog.source.size[0]||source.naturalHeight!==catalog.source.size[1])throw Error('Source dimensions do not match catalog');
 $('reference').src=master.src;ready=true;draw();
}).catch(error);
function frame(now){const delta=Math.max(0,Math.min(100,now-previous));previous=now;if(ready&&player.playing){try{player.update(delta);draw();}catch(e){error(e);}}requestAnimationFrame(frame);}requestAnimationFrame(frame);
})();
