/* R7 candidate playback. Source PNGs remain unchanged RGB chroma sheets.
 * Color-key compositing happens only in the renderer. No physics writes.
 * Pending art approval; one authored view, no mirrored or invented directions.
 */
(function(root){'use strict';
const wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));
function keyPixels(data,w,h){
 // Conventional chroma test, including enclosed gaps between hair and limbs.
 // Cyan battery light has significant blue and is kept; source files are untouched.
 let removed=0,preservedGreen=0,despilled=0;
 for(let i=0;i<w*h;i++){
  const k=i*4,r=data[k],g=data[k+1],b=data[k+2];
  const matte=g>=170&&r<=110&&b<=110&&g-r>=75&&g-b>=75;
  if(matte){data[k+3]=0;removed++;}
  else if(g-r>42&&g-b>42&&b<130){data[k+1]=Math.max(r,b);despilled++;}
  else if(g>r&&g>b)preservedGreen++;
 }
 return {removedPixels:removed,preservedGreenDominantPixels:preservedGreen,despilledPixels:despilled,totalPixels:w*h};
}
function surface(w,h){const c=root.document.createElement('canvas');c.width=w;c.height=h;return c;}
class Bank{
 constructor(manifest){this.manifest=manifest;this.frames=new Map();this.keying=[];this.loaded=false;this.errors=[];this.seen=new Set();this.states=new WeakMap();this.round=null;}
 async load(){
  const loader=root.JadeResidency.browserLoader(root.JADE_EMBED||{});
  for(const sheet of this.manifest.sheets){
   try{
    const im=await loader(sheet.file),w=im.naturalWidth||im.width,h=im.naturalHeight||im.height;
    if(w!==sheet.width||h!==sheet.height)throw Error('Candidate source dimensions changed: '+sheet.id);
    const keyed=surface(w,h),kg=keyed.getContext('2d',{willReadFrequently:true});kg.drawImage(im,0,0);
    const pixels=kg.getImageData(0,0,w,h);this.keying.push({sheet:sheet.id,...keyPixels(pixels.data,w,h)});kg.putImageData(pixels,0,0);
    for(const record of sheet.frames){
     const [x,y,fw,fh]=record.rect,c=surface(fw,fh),g=c.getContext('2d');
     if(record.polygon){g.beginPath();record.polygon.forEach((p,i)=>i?g.lineTo(p[0]-x,p[1]-y):g.moveTo(p[0]-x,p[1]-y));g.closePath();g.clip();}
     g.drawImage(keyed,-x,-y);
     this.frames.set(record.id,{...record,family:sheet.id,file:sheet.file,image:c,rect:[0,0,fw,fh],anchor:[record.root[0]-x,record.root[1]-y],muzzle:[record.muzzle[0]-x,record.muzzle[1]-y],scale:record.scale||.52});
    }
   }catch(e){this.errors.push(String(e.message||e));}
  }
  this.loaded=true;
 }
 observe(p,slot,world){
  let s=this.states.get(p);
  if(!s||s.round!==world.round||world.time<s.time){s={round:world.round,time:world.time,tick:-1,x:p.x,y:p.y,distance:0,shotTime:-Infinity,aimTime:0,aimed:false,retractTime:-Infinity,wasSliding:false,slideEnd:-Infinity};this.states.set(p,s);}
  if(s.tick===world.tick)return;
  const dt=Math.max(0,Math.min(.1,world.time-s.time)),travel=Math.hypot(p.x-s.x,p.y-s.y);
  if(travel<60)s.distance+=travel;
  for(const e of world.events||[]){const t=Number.isFinite(e.time)?e.time:e.t;if(e.type==='shot'&&e.player===slot&&Number.isFinite(t)&&t>s.shotTime)s.shotTime=Math.min(world.time,t);}
  if(p.aimHeld){s.aimTime=s.aimed?s.aimTime+dt:0;}else if(s.aimed)s.retractTime=world.time;
  if(s.wasSliding&&!(p.slide>0))s.slideEnd=world.time;
  s.wasSliding=p.slide>0;s.aimed=!!p.aimHeld;s.tick=world.tick;s.time=world.time;s.x=p.x;s.y=p.y;
 }
 frame(id,inspection=false){const f=this.frames.get(id);return f?{...f,final:true,candidate:true,id:f.id,kind:'R7_CANDIDATE',availability:inspection?'inspection-only':'review-candidate',requestedFile:f.file,label:f.id+' / '+f.label+' / CANDIDATE · ONE VIEW'}:null;}
 select(p,world){
  if(!this.loaded||p.hp<=0||p.hitReact>0||p.cornerTravel||p.impact>0)return null;
  const state=this.states.get(p);if(!state)return null;
  const facing=Math.abs(wrap(p.aim))<=Math.PI/24;
  const speed=Math.hypot(p.vx,p.vy),motion=Math.atan2(p.vy,p.vx);
  if(p.slide>0){
   if(Math.abs(wrap(p.slideFacing))>Math.PI/24||p.aimHeld)return null;
   const f=Math.min(4,Math.floor((1-p.slide/.7)*5));return this.frame('SLIDE-'+String(f+1).padStart(2,'0'));
  }
  if(!p.cover&&world.time-state.slideEnd<.22&&speed<180&&facing){const f=5+Math.min(2,Math.floor((world.time-state.slideEnd)/.075));return this.frame('SLIDE-'+String(f+1).padStart(2,'0'));}
  // Running remains independent of aim; strafing/backpedaling use their actual fallback art.
  if(!p.cover&&speed>25&&!p.aimHeld&&Math.abs(wrap(motion))<=Math.PI/24){
   const f=Math.floor(state.distance/24)%8;return this.frame('RUN-'+String(f+1).padStart(2,'0'));
  }
  if(!facing||speed>25)return null;
  const supportedCover=p.cover&&p.cover.id==='station'&&p.cover.face==='south';
  if(p.cover&&!supportedCover)return null;
  const since=world.time-state.shotTime;
  let index=null;
  if(since>=0&&since<.16)index=since<.065?4:5;
  else if(p.aimHeld)index=state.aimTime<.10?2:3;
  else if(world.time-state.retractTime<.16)index=6;
  else if(supportedCover)index=[1,7,1,8][Math.floor(world.time/1.1)%4];
  // Free idle uses the slide recovery's standing-ready pose, not a kneeling aim pose.
  if(index!==null&&index>=2&&index<=6&&!root.JadeCore.supported(p))return null;
  if(index!==null)return this.frame('COVER-'+String(index).padStart(2,'0'));
  if(!p.cover)return this.frame('SLIDE-08');
  return null;
 }
 inspect(){return {loaded:this.loaded,frameCount:this.frames.size,seenInGameplay:[...this.seen],keying:this.keying,errors:this.errors,sourceFormat:'RGB chroma keyed only during rendering',artApproval:'pending',view:'right-facing only',socketStatus:'candidate landmarks; original authoritative shot sockets unchanged'};}
}
const api={Bank,keyPixels};root.JadeR7=api;if(typeof module==='object')module.exports=api;
})(globalThis);
