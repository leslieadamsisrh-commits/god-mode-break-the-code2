/* Exact approved-source review; no sprite generation or game-state mutation. */
(function(root){
 'use strict';
 const integer=Number.isInteger;
 function validate(c){
  if(c?.kind!=='REFERENCE_REVIEW_ONLY'||c?.schemaVersion!==1||c?.panels?.length!==48)throw Error('Invalid reference catalog');
  const names=new Set();
  for(const s of c.sources){
   if(names.has(s.id))throw Error('Duplicate source');names.add(s.id);
   const entries=c.panels.filter(p=>p.source===s.id);
   if(entries.length!==24||new Set(entries.map(p=>p.direction)).size!==24)throw Error('Incomplete direction catalog');
   for(const p of entries){const [x,y,w,h]=p.sourceRect;
    if(![x,y,w,h,p.direction].every(integer)||p.direction<0||p.direction>23||x<0||y<0||w<=0||h<=0||x+w>s.dimensions[0]||y+h>s.dimensions[1])throw Error('Bad source rectangle');
    if(p.runtimeReady!==false||p.yawVerified!==false||!p.containsLabelsAndBackground)throw Error('Misclassified reference');
   }
  }
  return true;
 }
 function panel(c,source,direction){if(!integer(direction)||direction<0||direction>23)throw Error('Bad direction');const p=c.panels.find(p=>p.source===source&&p.direction===direction);if(!p)throw Error('Unknown panel');return p;}
 function next(direction,delta=1){if(!integer(direction)||!integer(delta))throw Error('Integer direction required');return ((direction+delta)%24+24)%24;}
 function requireProduction(c){if(c.kind==='REFERENCE_REVIEW_ONLY'||c.transparentProductionSprites===0)throw Error('Not production sprites: transparency, full frames, timing and anchors remain unverified');return c;}
 const api={validate,panel,next,requireProduction};root.JadeReferenceReview=api;
 if(typeof module==='object')module.exports=api;
 if(typeof document==='undefined')return;
 const $=id=>document.getElementById(id),c=root.JADE_REFERENCE_CATALOG,ctx=$('canvas').getContext('2d');
 const state={source:'run',direction:0,ready:false,mode:'panel'};const images={};const errors=[];
 function fail(e){const msg=String(e.message||e);errors.push(msg);$('error').textContent=msg;$('error').hidden=false;}
 function render(){
  if(!state.ready)return;const p=panel(c,state.source,state.direction),s=c.sources.find(s=>s.id===state.source),im=images[s.id];
  ctx.clearRect(0,0,1000,640);ctx.fillStyle='#0b111a';ctx.fillRect(0,0,1000,640);
  const rect=state.mode==='sheet'?[0,0,im.naturalWidth,im.naturalHeight]:p.sourceRect;
  const scale=Math.min(940/rect[2],540/rect[3]);
  const w=rect[2]*scale,h=rect[3]*scale;ctx.imageSmoothingEnabled=true;
  ctx.drawImage(im,...rect,(1000-w)/2,(570-h)/2,w,h);
  ctx.fillStyle='#d0d9e2';ctx.font='18px sans-serif';ctx.fillText(p.id+' / '+p.labelAngleDegrees+'° label / native panel '+p.dimensions.join(' × ')+' px',30,593);
  ctx.font='15px sans-serif';ctx.fillText('Reference panel: several pictured poses. Not a transparent sprite or verified motion loop.',30,624);
  $('readout').textContent=s.title+' — D'+String(state.direction).padStart(2,'0')+' — source label '+p.labelAngleDegrees+'°';
  $('size').textContent='Original sheet '+s.dimensions.join(' × ')+' px. Preview magnification does not add detail.';
  $('direction').value=String(state.direction);$('source').value=state.source;
  $('panel').setAttribute('aria-pressed',String(state.mode==='panel'));$('sheet').setAttribute('aria-pressed',String(state.mode==='sheet'));
 }
 function select(source,direction){panel(c,source,direction);state.source=source;state.direction=direction;render();}
 try{validate(c);if(!ctx)throw Error('Canvas unavailable');
  for(let d=0;d<24;d++)$('direction').add(new Option('D'+String(d).padStart(2,'0')+' / '+(15*d)+'°',d));
  $('source').onchange=e=>select(e.target.value,state.direction);$('direction').onchange=e=>select(state.source,Number(e.target.value));
  $('prev').onclick=()=>select(state.source,next(state.direction,-1));$('next').onclick=()=>select(state.source,next(state.direction));
  $('panel').onclick=()=>{state.mode='panel';render();};$('sheet').onclick=()=>{state.mode='sheet';render();};
  window.addEventListener('keydown',e=>{if(/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;if(e.code==='ArrowRight'||e.code==='ArrowLeft'){e.preventDefault();select(state.source,next(state.direction,e.code==='ArrowRight'?1:-1));}});
  Promise.all(c.sources.map(s=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>{if(im.naturalWidth!==s.dimensions[0]||im.naturalHeight!==s.dimensions[1]){reject(Error('Source size mismatch: '+s.id));return;}images[s.id]=im;resolve();};im.onerror=()=>reject(Error('Cannot load '+s.file+'. Open the self-contained HTML or retain the complete sources folder.'));im.src=root.JADE_REFERENCE_IMAGES?.[s.id]||s.file;}))).then(()=>{state.ready=true;$('loading').hidden=true;render();}).catch(fail);
 }catch(e){fail(e);}
 root.__JADE_REFERENCE_REVIEW__={select,render,setMode(mode){if(!['sheet','panel'].includes(mode))throw Error('Bad mode');state.mode=mode;render();},state:()=>({...state,errors:[...errors]})};
})(typeof globalThis==='object'?globalThis:this);
