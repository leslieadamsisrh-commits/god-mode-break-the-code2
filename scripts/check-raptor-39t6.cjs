const fs=require('fs'),Module=require('module'),assert=require('assert');
require.extensions['.ts']=(mod,file)=>{
 let s=Module.stripTypeScriptTypes(fs.readFileSync(file,'utf8'));const names=[...s.matchAll(/export\s+(?:async\s+)?(?:function|const|let|class)\s+(\w+)/g)].map(m=>m[1]);
 s=s.replace(/import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"];?/g,(_,n,p)=>'const {'+n.replace(/\bas\b/g,':')+'}=require('+JSON.stringify(p)+');');
 s=s.replace(/import\s+(\w+)\s*from\s*['"]([^'"]+)['"];?/g,(_,n,p)=>'const '+n+'=require('+JSON.stringify(p)+');');
 s=s.replace(/export\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"];?/g,(_,n,p)=>'Object.assign(exports,require('+JSON.stringify(p)+'));');
 s=s.replace(/\bexport\s+/g,'');s+='\nObject.assign(exports,{'+names.join(',')+'});';mod._compile(s,file);
};
const {LocalCombat}=require('../lib/localCombat.ts');
const {selectRaptorFrame,RAPTOR_DIRECTIONS}=require('../lib/raptorSpriteOnly.ts');
const results=[];
for(let d=0;d<8;d++){
 const engine=new LocalCombat('QA','solo',0);engine.state.covers=[];engine.state.players[0].x=1100;engine.state.players[0].y=560;const a=d*Math.PI/4,ix=Math.cos(a),iy=Math.sin(a);let wall=0;const observed={run:new Set(),slide:new Set(),movingFire:new Set()},samples=[];
 const step=(input={})=>{wall+=1000/60;engine.frame(wall,{x:ix,y:iy,aim:a,...input},[]);const p=engine.state.players[0],speed=Math.hypot(p.vx,p.vy);const selected=selectRaptorFrame({x:p.x,y:p.y,worldX:p.x,worldY:p.y,angle:p.slide>0?p.slideFacing:a,travelAngle:Math.atan2(p.vy,p.vx),speed,sliding:p.slide>0,slideRemaining:p.slide,slideDuration:engine.state.config.slideDuration,airborne:p.grounded===false,hit:p.knock>0,firing:!!input.fire,time:engine.state.time,scale:1,actorId:'engine-'+d});
  if(selected.family==='sprint')observed.run.add(selected.frame);if(selected.family==='slide')observed.slide.add(selected.frame);if(input.fire&&speed>2)observed.movingFire.add(selected.family);samples.push({time:engine.state.time,slide:p.slide,family:selected.family,frame:selected.frame,speed});return p;};
 for(let n=0;n<50;n++)step({fire:n>=25});
 step({slide:true});step({slide:false});for(let n=0;n<3;n++)step();const sliding=step({slide:true});const started=sliding.slide>0;
 for(let n=0;n<60;n++)step({fire:n<12});
 for(let n=0;n<40;n++)step({x:0,y:0});
 results.push({direction:RAPTOR_DIRECTIONS[d],started,run:[...observed.run].sort(),slide:[...observed.slide].sort(),movingFire:[...observed.movingFire],final:samples.at(-1),maxSlide:Math.max(...samples.map(x=>x.slide))});
}
console.log(JSON.stringify(results,null,2));
assert(results.every(r=>r.started),'all eight slides must start');
assert(results.every(r=>r.slide.length===3),'all eight slides must paint entry, hold, recovery');
assert(results.every(r=>r.run.length===4),'all eight runs must reach four stride phases');
assert(results.every(r=>r.movingFire.includes('sprint')&&r.movingFire.includes('slide')),'moving fire must preserve run and slide');
assert(results.every(r=>r.final.family==='idle'&&r.final.speed<0.1),'all directions must settle into idle');
