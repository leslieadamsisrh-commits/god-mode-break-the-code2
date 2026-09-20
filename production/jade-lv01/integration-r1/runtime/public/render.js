/* Renderer adapted from 08K. Images, movement modules and atlas roles remain unchanged. */
(function(root){'use strict';
class DuelRenderer{
 constructor(canvas,onError=console.error){
 const C=root.JadeCore,Motion=root.JadeAction,A=root.JADE_ASSETS,Flow=root.JadeFlow,Stance=root.JadeStance,Route=root.JadeCoverRouter,Catalog=root.JADE_COVER_METADATA,B05=root.JadeB05Fast,B06=root.JadeB06Fast;
 const g=canvas.getContext('2d');let W=900,H=690,zoom=.92,cam={x:0,y:0},world={time:0,tick:0,players:[],p:null,covers:[],shots:[],effects:[]},slot=0,ready=false,lastDrawable=null;
 const settings={finalArt:true,coverArt:true,xray:false,anchors:false,liftStudy:false,flowMode:true,poseRouting:true,stanceRegistration:true};
 const directions=new WeakMap(),frames=new WeakMap(),routing=new Route.Tracker();Route.validateCatalog(Catalog,A);
 const records=[...Object.values(A.recoveredAtlases),...Object.values(A.finalFrames),...Object.values(A.studyFrames),...Object.values(B05.records),...Object.values(B06.records)];
 const pins=records.filter(r=>Object.values(A.finalFrames).includes(r)||Object.values(A.studyFrames).includes(r)||Object.values(B05.records).includes(r)||Object.values(B06.records).includes(r)||/\/(ready|cover)-/.test(r.file)).map(r=>r.file);
 const residency=new root.JadeResidency.AssetStore({records,pinned:pins,capacity:20,concurrency:4,load:root.JadeResidency.browserLoader(root.JADE_EMBED||{}),onError});
 const counts={draws:0,missing:0,fallback:0};let round=-1;
 function requestAtlas(r){const im=residency.get(r.file);if(!im)residency.request(r.file,2).catch(()=>{});return im;}
 function warmNeighbors(family,direction){const step=family.startsWith('strafe')||family==='backpedal'?6:1;residency.warm([-step,step].map(d=>A.recoveredAtlases[family+':'+((direction+d+24)%24)]?.file).filter(Boolean));}
 function resize(){const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);W=r.width;H=r.height;canvas.width=Math.round(W*d);canvas.height=Math.round(H*d);g.setTransform(d,0,0,d,0,0);}
 new ResizeObserver(resize).observe(canvas);resize();
 const point=(x,y,z=0)=>({x:W*.50+(x-cam.x+(y-cam.y)*.22)*zoom,y:H*.60+((y-cam.y)*.60-z)*zoom});
 function worldPoint(x,y,z=90){const yy=((y-H*.60)/zoom+z)/.60+cam.y;return{x:(x-W*.50)/zoom+cam.x-(yy-cam.y)*.22,y:yy};}
function path(points,fill,stroke){g.beginPath();points.forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.closePath();if(fill){g.fillStyle=fill;g.fill();}if(stroke){g.strokeStyle=stroke;g.lineWidth=1.3;g.stroke();}}
function line(a,b,col,w=1){g.strokeStyle=col;g.lineWidth=w;g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke();}
function text(s,x,y,size=12,col='#91b4c4'){g.font=`${size}px monospace`;g.fillStyle=col;g.fillText(s,x,y);}
function cover(r){if(!settings.coverArt)return;const h=r.height,a=point(r.x,r.y),b=point(r.x+r.w,r.y),c=point(r.x+r.w,r.y+r.h),d=point(r.x,r.y+r.h),at=point(r.x,r.y,h),bt=point(r.x+r.w,r.y,h),ct=point(r.x+r.w,r.y+r.h,h),dt=point(r.x,r.y+r.h,h);g.save();g.globalAlpha=settings.xray?.2:1;
 path([a,b,c,d],'#050b1488');path([b,c,ct,bt],'#152a36','#354956');path([d,c,ct,dt],'#263644','#536473');path([at,bt,ct,dt],'#425161','#6b7581');
 for(let n=1;n<4;n++){const x=r.x+r.w*n/4;line(point(x,r.y+r.h,9),point(x,r.y+r.h,h-8),'#112533',2);}
 line(point(r.x+8,r.y+r.h,h-14),point(r.x+r.w-8,r.y+r.h,h-14),r.id==='station'?'#ed4aa4':'#48a8b7',2);
 const p=point(r.x+12,r.y+r.h,h-37);text(r.id==='station'?'COVER / 01':'TEST BARRIER',p.x,p.y,10,'#c0c6bf');g.restore();}
function choose(actor){
 const b05=settings.finalArt?B05.select(actor,world.covers):null;
 if(b05){const r=b05.record;return{final:true,b05:true,id:'B05-'+r.id,file:r.file,image:residency.get(r.file),availability:'exact',requestedFile:r.file,rect:[0,0,r.width,r.height],poseIndex:r.id,anchor:r.anchor,scale:r.scale,kind:'B05_FAST_KEY',label:'FINAL JADE / B05 '+r.id+' / '+b05.role.toUpperCase()+' / PLAYABLE-KEY'};}
 const b06=settings.finalArt?B06.select(actor,world.time):null;
 if(b06){const r=b06.record;return{final:true,b06:true,id:'B06-'+r.id,file:r.file,image:residency.get(r.file),availability:b06.placeholder?'placeholder':'exact',requestedFile:r.file,rect:[0,0,r.width,r.height],poseIndex:r.id,anchor:r.anchor,scale:r.scale,kind:b06.placeholder?'B06_FAST_PLACEHOLDER':'B06_FAST_KEY',label:'FINAL JADE / B06 '+r.id+' / '+b06.role.toUpperCase()+(b06.placeholder?' / PLACEHOLDER':' / PLAYABLE-KEY')};}
 if(settings.finalArt&&C.supported(actor)){const f=C.FINAL[actor.pose],v=Motion.visual(actor,settings.liftStudy);
 return{final:true,id:v.id,file:v.file,image:residency.get(v.file),availability:'exact',requestedFile:v.file,rect:[0,0,f.width,f.height],poseIndex:actor.pose,anchor:Stance.anchor(actor.pose,settings.stanceRegistration),scale:C.ART_SCALE,kind:v.kind,label:'FINAL JADE / '+v.id+' / '+(v.kind==='SOURCE_PIXEL_STUDY'?'DERIVED STUDY — not a new drawing':'original source pose')};}
 let family=actor.cover||actor.cornerTravel||(settings.poseRouting&&actor.kick>0)?'cover':actor.slide>0?'slide':Math.hypot(actor.vx,actor.vy)>(settings.flowMode?1:8)?'run':'ready';let angle=actor.cornerTravel?actor.wrapFacing??actor.aim:actor.aim;if(actor.slide>0)angle=actor.slideFacing;else if(family==='run'&&!actor.aimHeld)angle=Math.atan2(actor.vy,actor.vx);
 if(family==='run'&&actor.aimHeld){const delta=C.wrap(Math.atan2(actor.vy,actor.vx)-actor.aim);if(Math.abs(delta)>2.4)family='backpedal';else if(delta>.6)family='strafe-right';else if(delta<-.6)family='strafe-left';}
 const coarse=family==='backpedal'||family.startsWith('strafe');let direction;
 if(settings.flowMode){let states=directions.get(actor);if(!states){states={};directions.set(actor,states);}const count=coarse?4:24;const selected=Flow.facing(angle,count,states[family]);states[family]=selected;direction=selected*(coarse?6:1);}
 else{direction=((Math.round(angle/(Math.PI/12))%24)+24)%24;if(coarse)direction=(Math.round(direction/6)*6)%24;}
 let requested=A.recoveredAtlases[family+':'+direction],directionPlaceholder=false,requestedDirection=direction;
 if(!requested&&root.JadeB11Fast){const q=root.JadeB11Fast.resolve(A.recoveredAtlases,family,direction);requested=q.record;direction=q.direction;directionPlaceholder=q.placeholder;}
 if(!requested)throw Error('No atlas record for '+family+':'+requestedDirection);
 let record=requested,im=requestAtlas(record),availability=directionPlaceholder?'direction-placeholder':'exact',waitingFor=null;
 warmNeighbors(family,direction);
 if(!im){
  waitingFor=residency.state(requested.file).status;
  record=A.recoveredAtlases['ready:'+direction];im=residency.get(record.file);family='ready';availability='resident-ready';
  // Mandatory ready set is decoded before play. Retain a drawable only as a defensive last resort.
  if(!im)return lastDrawable?{...lastDrawable,availability:'retained-last',requestedFile:requested.file,waitingFor,label:'TEMPORARY RETAINED POSE / waiting for '+requested.file}:null;
 }
 let frame=family==='slide'?Math.min(record.frames-1,Math.max(0,Math.floor((1-Math.max(0,actor.slide)/.7)*record.frames))):family==='ready'?0:Math.floor(actor.phase*2)%record.frames;
 if(settings.flowMode)frame=Flow.frameAt(actor.flowDistance||0,record.frames,family,actor.slide);
 const cs=record.cell;let poseRoute=null;if(family==='cover'&&settings.poseRouting){poseRoute=routing.select(actor,world.time,Catalog.families['cover:'+direction],cs);if(poseRoute)frame=poseRoute.frame;}return{final:false,kind:'RECOVERED_ATLAS',availability,requestedFile:requested.file,waitingFor,id:family+'-d'+direction+'-f'+frame,file:record.file,image:im,rect:[frame%record.cols*cs,Math.floor(frame/record.cols)*cs,cs,cs],anchor:poseRoute?.anchor||[62.5,109.5],poseRoute,scale:220/125,label:(availability==='exact'?'RECOVERED / ':availability==='direction-placeholder'?'DIRECTION PLACEHOLDER '+requestedDirection+'→'+direction+' / ':'TEMP READY (loading '+requested.file.split('/').pop()+') / ')+family.toUpperCase()+' / view '+direction+(poseRoute?' / '+poseRoute.role.toUpperCase()+' / slot '+frame:'')};}

 function character(p,index){lastDrawable=frames.get(p);const f=choose(p);counts.draws++;if(!f?.image){counts.missing++;return;}
 residency.setActive(f.file);let o=point(p.x,p.y);const s=f.scale*zoom,hit=Math.max(0,p.hitReact||0);if(hit>0){const t=Math.sin(Math.min(1,hit/.16)*Math.PI),q=point(p.x+(p.hitDx||0)*22*t,p.y+(p.hitDy||0)*22*t);o={x:q.x,y:q.y};}g.save();g.globalAlpha=p.hp>0?(hit>0?.72:1):.35;g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';g.drawImage(f.image,...f.rect,o.x-f.anchor[0]*s,o.y-f.anchor[1]*s,f.rect[2]*s,f.rect[3]*s);g.restore();if(hit>0){g.save();g.globalAlpha=.85*Math.min(1,hit/.16);g.strokeStyle='#ff72b8';g.lineWidth=3;g.beginPath();g.ellipse(o.x,o.y-65*zoom,35*zoom,62*zoom,0,0,Math.PI*2);g.stroke();g.restore();text('HIT REACT / PLACEHOLDER',o.x-75,o.y-135,10,'#ff8fc8');}frames.set(p,f);if(f.availability!=='exact')counts.fallback++;
 const color=index===0?'#ff52b2':'#62e4ed';g.strokeStyle=color;g.lineWidth=2;g.beginPath();g.ellipse(o.x,o.y,21*zoom,9*zoom,0,0,Math.PI*2);g.stroke();text(('P'+(index+1)+' / ')+(world.names?.[index]||'Jade'),o.x-55,o.y+28,11,color);
 const label=point(p.x,p.y,225);g.fillStyle='#1b2734';g.fillRect(label.x-35,label.y-10,70,5);g.fillStyle=color;g.fillRect(label.x-35,label.y-10,.7*p.hp,5);
 }
 this.load=()=>residency.initialize().then(()=>{ready=true;});
 this.accept=(packet)=>{const s=packet.state;slot=packet.slot??slot;
 if(s.round!==round||world.players.length!==2){world.players=s.players.map(p=>({...p}));round=s.round;}
 else s.players.forEach((p,i)=>Object.assign(world.players[i],p));
 Object.assign(world,{time:s.time,tick:s.tick,covers:s.covers,shots:s.shots,effects:s.effects,names:packet.names});world.p=world.players[slot];
 world.players.forEach((p,i)=>routing.observe({p,tick:s.tick,time:s.time,events:(s.events||[]).filter(e=>e.player===i)}));
 };
 this.draw=(dt=.016)=>{if(!ready||!world.p)return;cam.x=0;cam.y=15; // Shared fixed-arena camera; no player owns the viewport.
 const d=Math.min(devicePixelRatio||1,2);g.setTransform(d,0,0,d,0,0);g.fillStyle='#09121d';g.fillRect(0,0,W,H);path([point(-520,-300),point(520,-300),point(520,330),point(-520,330)],'#111d29','#314a5b');
 for(let y=-300;y<=330;y+=45)line(point(-520,y),point(520,y),'#213444');for(let x=-520;x<=520;x+=65)line(point(x,-300),point(x,330),'#1b2f40');
 for(const p of world.players){const o=point(p.x,p.y);g.fillStyle='#0008';g.beginPath();g.ellipse(o.x,o.y,35*zoom,8*zoom,0,0,Math.PI*2);g.fill();}
 const entities=world.covers.map(r=>({y:r.y+r.h,draw:()=>cover(r)}));world.players.forEach((p,i)=>entities.push({y:p.y,draw:()=>character(p,i)}));entities.sort((a,b)=>a.y-b.y).forEach(e=>e.draw());
 for(const s of world.shots){const a=point(s.x,s.y,s.z),b=point(s.x-s.vx*.012,s.y-s.vy*.012,s.z);line(a,b,s.owner===slot?'#70efff':'#ff819d',2.5);}
 for(const e of world.effects){const q=point(e.x,e.y,e.z);g.save();g.globalAlpha=Math.min(1,e.life*12);for(let i=0;i<8;i++){const a=i*Math.PI/4;line({x:q.x+Math.cos(a)*4,y:q.y+Math.sin(a)*4},{x:q.x+Math.cos(a)*22,y:q.y+Math.sin(a)*14},e.type==='muzzle'?'#fff2bc':'#fb9a95',2);}g.restore();}
 text('LOCAL COUCH DUEL / B11 · INTEGRATION R1',20,H-43,12,'#adcedd');text('Recovered cover keys · directional and animation polish in progress',20,H-25,10,'#91a6b9');
 };
 this.aim=(clientX,clientY)=>{if(!world.p)return 0;const r=canvas.getBoundingClientRect(),m=worldPoint(clientX-r.left,clientY-r.top,90);return Math.atan2(m.y-world.p.y,m.x-world.p.x);};
 this.point=point;this.setZoom=v=>zoom=v;this.setXray=v=>settings.xray=!!v;this.setFinalArt=v=>settings.finalArt=!!v;this.setCoverArt=v=>settings.coverArt=!!v;
 this.inspect=()=>({counts:{...counts},residency:residency.stats(),frames:world.players.map(p=>{const f=frames.get(p);return f?{id:f.id,label:f.label,final:!!f.final,availability:f.availability}:null;}),ready,slot});
 }
}
root.DuelRenderer=DuelRenderer;
})(globalThis);
