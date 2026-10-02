export type InputState={x:number;y:number;aim:number;fire:boolean;shield:boolean;slide:boolean;melee:boolean;heavy:boolean;grip:boolean;throwMatter:boolean;cover:boolean;orbit:boolean;launchOrbit:boolean;pinball:boolean;slow:boolean};
export type CombatConfig={moveSpeed:number;response:number;stopDrag:number;slideSpeed:number;slideDuration:number;shotCadence:number;shotSpread:number;shotDamage:number;shotSpeed:number;throwForce:number;pinballSpeed:number;pinballDuration:number;maxHealth:number;spriteScale:number;cameraZoom:number;};
export const DEFAULT_CONFIG:CombatConfig={moveSpeed:262,response:13,stopDrag:.002,slideSpeed:650,slideDuration:.70,shotCadence:.48,shotSpread:.04,shotDamage:10,shotSpeed:820,throwForce:720,pinballSpeed:830,pinballDuration:.5,maxHealth:100,spriteScale:.82,cameraZoom:1};
export type CoverAnchor={face:"left"|"right"|"top"|"bottom";offset:number;half:number;nx:number;ny:number;tx:number;ty:number};
export type CoverExit={points:{x:number;y:number}[];index:number;dx:number;dy:number;until:number;travel:number;total:number;coverId:string};
export type Player={x:number;y:number;vx:number;vy:number;aim:number;hp:number;battery:number;slide:number;slideFacing:number;coverId:string|null;coverAnchor:CoverAnchor|null;coverLock:number;coverSpeed:number;peek:boolean;peekEdge:boolean;contact:number;exit:CoverExit|null;shield:boolean;gripId:string|null;gripCoverId:string|null;orbitIds:string[];knock:number;pinball:number;lastShot:number;lastMelee:number;score:number;rematch:boolean;input:InputState;processedInput:InputState;lastSeq:number;name:string;token:string;bot:boolean};
export type Cover={id:string;x:number;y:number;w:number;h:number;a:number;hp:number;maxHp:number;generated:boolean;build:number};
export type Matter={id:string;x:number;y:number;vx:number;vy:number;r:number;kind:"metal"|"stone";heldBy:number|null;orbitBy:number|null;life:number};
export type Shot={id:string;owner:number;x:number;y:number;vx:number;vy:number;life:number};
export type Fx={id:string;type:string;x:number;y:number;life:number;owner?:number;text?:string};
export type GameState={build:string;mode:"bot"|"solo";phase:"lobby"|"countdown"|"playing"|"finisher"|"finished";round:number;winner:number|null;countdown:number;finisher:number;createdAt:number;lastAt:number;time:number;config:CombatConfig;players:Player[];covers:Cover[];matter:Matter[];shots:Shot[];fx:Fx[]};

const empty=():InputState=>({x:0,y:0,aim:0,fire:false,shield:false,slide:false,melee:false,heavy:false,grip:false,throwMatter:false,cover:false,orbit:false,launchOrbit:false,pinball:false,slow:false});
const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v)),wrap=(a:number)=>Math.atan2(Math.sin(a),Math.cos(a)),dist=(a:{x:number;y:number},b:{x:number;y:number})=>Math.hypot(a.x-b.x,a.y-b.y),uid=()=>crypto.randomUUID().slice(0,8);
const A={left:70,right:930,top:90,bottom:550};
function player(x:number,y:number,aim:number,name:string,token:string,bot=false,hp=100):Player{return{x,y,vx:0,vy:0,aim,hp,battery:100,slide:0,slideFacing:aim,coverId:null,coverAnchor:null,coverLock:0,coverSpeed:0,peek:false,peekEdge:false,contact:0,exit:null,shield:false,gripId:null,gripCoverId:null,orbitIds:[],knock:0,pinball:0,lastShot:-9,lastMelee:-9,score:0,rematch:false,input:empty(),processedInput:empty(),lastSeq:-1,name,token,bot}}
export function newGame(name:string,token:string,now=Date.now(),mode:"bot"|"solo"="solo"):GameState{
 const config={...DEFAULT_CONFIG};
 const players=[player(230,330,0,name,token,false,config.maxHealth)];
 if(mode==="bot")players.push(player(780,330,Math.PI,"RIFT HUNTER","",true,config.maxHealth));
 const matter:Matter[]=[];[[170,170,"stone"],[330,190,"metal"],[500,160,"stone"],[680,195,"metal"],[800,165,"stone"],[420,470,"metal"],[610,465,"stone"],[760,445,"metal"]].forEach(([x,y,k],i)=>matter.push({id:"m"+i,x:x as number,y:y as number,vx:0,vy:0,r:14,kind:k as any,heldBy:null,orbitBy:null,life:999}));
 const covers:Cover[]=[
 {id:"cover-center",x:438,y:285,w:124,h:30,a:0,hp:999,maxHp:999,generated:false,build:0},
 {id:"cover-left",x:190,y:380,w:150,h:32,a:0,hp:999,maxHp:999,generated:false,build:0},
 {id:"cover-right",x:660,y:190,w:150,h:32,a:0,hp:999,maxHp:999,generated:false,build:0},
 {id:"cover-vertical",x:720,y:390,w:118,h:30,a:Math.PI/2,hp:999,maxHp:999,generated:false,build:0}
];
 return{build:"COMBAT-MASTER-STUDIO-01",mode,phase:mode==="solo"?"playing":"countdown",round:1,winner:null,countdown:3,finisher:0,createdAt:now,lastAt:now,time:0,config,players,covers,matter,shots:[],fx:[]}
}
export function updateConfig(s:GameState,patch:Partial<CombatConfig>){s.config={...s.config,...patch};for(const p of s.players)p.hp=Math.min(p.hp,s.config.maxHealth)}
export function joinGame(s:GameState,name:string,token:string){if(s.mode==="solo")throw Error("Solo session is not joinable");const b=s.players.findIndex(p=>p.bot);if(b>=0){s.players[b]={...s.players[b],name,token,bot:false,lastSeq:-1,input:empty(),processedInput:empty()};return}if(s.players.length>1)throw Error("Room is full");s.players.push(player(780,330,Math.PI,name,token,false,s.config.maxHealth))}
function respawn(s:GameState){const cfg={...s.config},ids=s.players.map(p=>({name:p.name,token:p.token,bot:p.bot,score:p.score})),fresh=newGame(ids[0].name,ids[0].token,s.lastAt,s.mode);fresh.config=cfg;if(ids[1])fresh.players[1]=player(780,330,Math.PI,ids[1].name,ids[1].token,ids[1].bot,cfg.maxHealth);fresh.players.forEach((p,i)=>p.score=ids[i]?.score||0);fresh.round=s.round+1;fresh.createdAt=s.createdAt;fresh.phase=s.mode==="solo"?"playing":"countdown";Object.assign(s,fresh)}
export function setInput(s:GameState,slot:number,seq:number,input:Partial<InputState>){const p=s.players[slot];if(!p||seq<=p.lastSeq)return;p.lastSeq=seq;let x=clamp(Number(input.x)||0,-1,1),y=clamp(Number(input.y)||0,-1,1),m=Math.hypot(x,y);if(m>1){x/=m;y/=m}p.input={...empty(),...input,x,y,aim:Number.isFinite(input.aim)?wrap(input.aim as number):p.aim}}

function localPoint(c:Cover,x:number,y:number){const ca=Math.cos(c.a||0),sa=Math.sin(c.a||0),dx=x-c.x,dy=y-c.y;return{x:dx*ca+dy*sa,y:-dx*sa+dy*ca}}
function worldPoint(c:Cover,x:number,y:number){const ca=Math.cos(c.a||0),sa=Math.sin(c.a||0);return{x:c.x+x*ca-y*sa,y:c.y+x*sa+y*ca}}
function coverFace(c:Cover,p:Player|{x:number;y:number;r?:number}):CoverAnchor&{gap:number}{
 const q=localPoint(c,p.x,p.y),hw=c.w/2,hh=c.h/2,px=clamp(q.x,-hw,hw),py=clamp(q.y,-hh,hh);
 let face:"left"|"right"|"top"|"bottom";
 if(Math.abs(q.x)>hw&&Math.abs(q.y)>hh)face=Math.abs(q.x)-hw>Math.abs(q.y)-hh?(q.x<0?"left":"right"):(q.y<0?"top":"bottom");
 else if(Math.abs(q.x)>hw)face=q.x<0?"left":"right";else if(Math.abs(q.y)>hh)face=q.y<0?"top":"bottom";
 else{const ds=[q.x+hw,hw-q.x,q.y+hh,hh-q.y];face=(["left","right","top","bottom"] as const)[ds.indexOf(Math.min(...ds))]}
 const vertical=face==="left"||face==="right",sign=face==="left"||face==="top"?-1:1,ca=Math.cos(c.a||0),sa=Math.sin(c.a||0);
 return{face,offset:clamp(vertical?q.y:q.x,-(vertical?hh:hw),vertical?hh:hw),half:vertical?hh:hw,nx:vertical?sign*ca:-sign*sa,ny:vertical?sign*sa:sign*ca,tx:vertical?-sa:ca,ty:vertical?ca:sa,gap:Math.hypot(q.x-px,q.y-py)-(("r" in p && typeof p.r==="number")?p.r:18)};
}
function placeOnCover(p:Player,s:GameState){
 const c=s.covers.find(x=>x.id===p.coverId),a=p.coverAnchor;if(!c||!a)return;
 const vertical=a.face==="left"||a.face==="right",sign=a.face==="left"||a.face==="top"?-1:1,half=vertical?c.h/2:c.w/2;
 a.offset=clamp(a.offset,-half,half);a.half=half;const ca=Math.cos(c.a||0),sa=Math.sin(c.a||0);
 a.nx=vertical?sign*ca:-sign*sa;a.ny=vertical?sign*sa:sign*ca;a.tx=vertical?-sa:ca;a.ty=vertical?ca:sa;
 const q=worldPoint(c,vertical?sign*(c.w/2+18.5):a.offset,vertical?a.offset:sign*(c.h/2+18.5));p.x=q.x;p.y=q.y;
}
function attachCover(p:Player,c:Cover,s:GameState){if(s.time<p.coverLock)return false;p.coverId=c.id;p.coverAnchor=coverFace(c,p);p.slide=0;p.vx=p.vy=0;p.coverSpeed=0;p.contact=s.time+.22;p.peek=false;placeOnCover(p,s);s.fx.push({id:uid(),type:"cover-slam",x:p.x,y:p.y,life:.25});return true}
function releaseCover(p:Player,s:GameState,lock=.18){p.coverId=null;p.coverAnchor=null;p.coverSpeed=0;p.peek=false;p.peekEdge=false;p.coverLock=s.time+lock}
function moveOnCover(p:Player,s:GameState,i:InputState,dt:number){
 const a=p.coverAnchor;if(!a||!p.coverId)return;const along=i.x*a.tx+i.y*a.ty,c=s.config;
 p.coverSpeed+=(along*c.moveSpeed-p.coverSpeed)*Math.min(1,dt*c.response);if(Math.abs(along)<.001)p.coverSpeed*=Math.pow(c.stopDrag,dt);
 const before=a.offset;a.offset=clamp(a.offset+p.coverSpeed*dt,-a.half,a.half);if(a.offset===before)p.coverSpeed=0;
 p.vx=a.tx*p.coverSpeed;p.vy=a.ty*p.coverSpeed;placeOnCover(p,s);
 const forward=Math.cos(p.aim)*a.nx+Math.sin(p.aim)*a.ny;p.peek=forward<.2;p.peekEdge=Math.abs(a.offset)>a.half-18;
}
function beginCoverExit(p:Player,s:GameState,i:InputState){
 const a=p.coverAnchor,c=s.covers.find(x=>x.id===p.coverId);if(!a||!c)return false;
 const len=Math.hypot(i.x,i.y),ix=len>.18?i.x/len:a.nx,iy=len>.18?i.y/len:a.ny,out=ix*a.nx+iy*a.ny,tan=ix*a.tx+iy*a.ty;
 if(len<=.18||out>.18){releaseCover(p,s,.7);p.slide=s.config.slideDuration;p.slideFacing=Math.atan2(iy,ix);p.vx=ix*s.config.slideSpeed;p.vy=iy*s.config.slideSpeed;return true}
 const end=Math.abs(tan)>.18?Math.sign(tan):(a.offset<0?-1:1),toEnd=a.half-end*a.offset;if(toEnd>56)return false;
 const reach=toEnd+21,first={x:p.x+a.tx*end*reach,y:p.y+a.ty*end*reach},points=[first];
 if(out<-.18){const depth=(a.face==="left"||a.face==="right")?c.w:c.h;points.push({x:first.x-a.nx*(depth+40),y:first.y-a.ny*(depth+40)})}
 const last=points[points.length-1];points.push({x:last.x+ix*70,y:last.y+iy*70});
 releaseCover(p,s,.8);p.exit={points,index:0,dx:ix,dy:iy,until:s.time+.6,travel:0,total:points.reduce((sum,q,j)=>j?sum+Math.hypot(q.x-points[j-1].x,q.y-points[j-1].y):sum,0),coverId:c.id};return true;
}
function stepCoverExit(p:Player,s:GameState,dt:number){
 const e=p.exit;if(!e)return false;if(s.time>=e.until){p.exit=null;return true}let rem=600*dt,ox=p.x,oy=p.y;
 while(rem>.01&&e.index<e.points.length){const q=e.points[e.index],dx=q.x-p.x,dy=q.y-p.y,d=Math.hypot(dx,dy);if(d<.01){e.index++;continue}const tr=Math.min(d,rem);p.x+=dx/d*tr;p.y+=dy/d*tr;e.travel+=tr;rem-=tr;if(tr>=d-.01)e.index++}
 p.vx=(p.x-ox)/dt;p.vy=(p.y-oy)/dt;if(e.index>=e.points.length)p.exit=null;return true;
}
function slideCapture(p:Player,s:GameState){
 if(p.coverId||p.slide<=0||s.time<p.coverLock)return;
 for(const c of s.covers){const a=coverFace(c,p);if(a.gap<=2&&p.vx*a.nx+p.vy*a.ny<-1){attachCover(p,c,s);return}}
}
function circleBox(o:{x:number;y:number},r:number,c:Cover){const q=localPoint(c,o.x,o.y),nx=clamp(q.x,-c.w/2,c.w/2),ny=clamp(q.y,-c.h/2,c.h/2),dx=q.x-nx,dy=q.y-ny,d=Math.hypot(dx,dy),ca=Math.cos(c.a||0),sa=Math.sin(c.a||0),lx=d?dx/d:(q.x<0?-1:1),ly=d?dy/d:0;return{hit:d<r,nx:lx*ca-ly*sa,ny:lx*sa+ly*ca,depth:r-d}}
function collide(p:Player,s:GameState){if(p.coverId||p.exit)return;for(const c of s.covers){const q=circleBox(p,18,c);if(!q.hit)continue;p.x+=q.nx*(q.depth+1);p.y+=q.ny*(q.depth+1)}}
function edgeActions(s:GameState,n:number,prev:InputState){const p=s.players[n],i=p.input,c=s.config;
 if(i.slide&&!prev.slide&&p.slide<=0&&!p.coverId&&!p.exit&&p.knock<=0&&Math.hypot(i.x,i.y)>.1){p.slide=c.slideDuration;p.slideFacing=Math.atan2(i.y,i.x);p.vx=Math.cos(p.slideFacing)*c.slideSpeed;p.vy=Math.sin(p.slideFacing)*c.slideSpeed;s.fx.push({id:uid(),type:"slide",x:p.x,y:p.y,life:.48,owner:n,text:Math.floor(s.time)%2?"SKURT!":"SKEET"})}
 if(i.pinball&&!prev.pinball&&p.battery>=22){p.battery-=22;p.pinball=c.pinballDuration;p.vx=Math.cos(p.aim)*c.pinballSpeed;p.vy=Math.sin(p.aim)*c.pinballSpeed;s.fx.push({id:uid(),type:"pinball",x:p.x,y:p.y,life:.5,owner:n})}
 if((i.melee&&!prev.melee||i.heavy&&!prev.heavy)&&s.time-p.lastMelee>(i.heavy?.85:.38)){p.lastMelee=s.time;s.fx.push({id:uid(),type:i.heavy?"heavy":"melee",x:p.x+Math.cos(p.aim)*40,y:p.y+Math.sin(p.aim)*40,life:.22,owner:n})}
 if(i.cover&&!prev.cover&&p.battery>=30){p.battery-=30;const x=clamp(p.x+Math.cos(p.aim)*100-65,A.left,A.right-130),y=clamp(p.y+Math.sin(p.aim)*100-15,A.top,A.bottom-30);s.covers.push({id:uid(),x:x+65,y:y+15,w:130,h:30,a:p.aim+Math.PI/2,hp:110,maxHp:110,generated:true,build:1});s.fx.push({id:uid(),type:"materialize",x:x+65,y:y+15,life:.7,owner:n})}
 if(i.grip&&!prev.grip){if(p.gripId){const m=s.matter.find(m=>m.id===p.gripId);if(m)m.heldBy=null;p.gripId=null}else{const m=s.matter.filter(m=>m.heldBy===null&&m.orbitBy===null).sort((a,b)=>dist(a,p)-dist(b,p))[0];if(m&&dist(m,p)<245){p.gripId=m.id;m.heldBy=n}}}
 if(i.throwMatter&&!prev.throwMatter&&p.gripId){const m=s.matter.find(m=>m.id===p.gripId);if(m){m.heldBy=null;m.vx=Math.cos(p.aim)*c.throwForce;m.vy=Math.sin(p.aim)*c.throwForce;m.life=3;p.gripId=null}}
 if(i.orbit&&!prev.orbit&&p.battery>=25){const ms=s.matter.filter(m=>m.heldBy===null&&m.orbitBy===null).sort((a,b)=>dist(a,p)-dist(b,p)).slice(0,3);if(ms.length){p.battery-=25;p.orbitIds=ms.map(m=>m.id);ms.forEach(m=>m.orbitBy=n)}}
 if(i.launchOrbit&&!prev.launchOrbit&&p.orbitIds.length){p.orbitIds.forEach((id,j)=>{const m=s.matter.find(m=>m.id===id);if(m){m.orbitBy=null;m.vx=Math.cos(p.aim+(j-1)*.12)*c.throwForce*1.05;m.vy=Math.sin(p.aim+(j-1)*.12)*c.throwForce*1.05;m.life=3}});p.orbitIds=[]}
}
function botInput(s:GameState){const n=s.players.findIndex(p=>p.bot);if(n<0)return;const p=s.players[n],t=s.players[1-n];if(!t)return;const a=Math.atan2(t.y-p.y,t.x-p.x),d=dist(p,t);p.input={...empty(),x:Math.cos(a)*(d>260?.7:0),y:Math.sin(a)*(d>260?.7:0),aim:a,fire:d<520&&s.time%1.4<.1}}
function step(s:GameState,dt:number,prev:InputState[]){const c=s.config,slow=s.players.some(p=>p.input.slow&&p.battery>0),d=dt*(slow?.52:1);
 for(let n=0;n<s.players.length;n++){const p=s.players[n],i=p.input;p.aim=i.aim;edgeActions(s,n,prev[n]||empty());p.shield=i.shield&&p.battery>0;if(p.shield)p.battery=Math.max(0,p.battery-18*dt);if(i.slow&&p.battery>0)p.battery=Math.max(0,p.battery-28*dt);if(p.gripId)p.battery=Math.max(0,p.battery-6*dt);if(!p.shield&&!i.slow&&!p.gripId)p.battery=Math.min(100,p.battery+9*dt);
  if(p.knock>0){p.knock-=dt;p.vx*=Math.pow(.08,dt);p.vy*=Math.pow(.08,dt)}
  else if(p.exit){stepCoverExit(p,s,d)}
  else if(p.coverId){moveOnCover(p,s,i,d);if(i.slide&&!prev[n]?.slide)beginCoverExit(p,s,i)}
  else if(p.slide>0||p.pinball>0){p.slide=Math.max(0,p.slide-dt);p.pinball=Math.max(0,p.pinball-dt);p.vx*=Math.pow(p.pinball>0?.72:.12,dt);p.vy*=Math.pow(p.pinball>0?.72:.12,dt);p.x=clamp(p.x+p.vx*d,A.left,A.right);p.y=clamp(p.y+p.vy*d,A.top,A.bottom);slideCapture(p,s);collide(p,s)}
  else{const r=1-Math.exp(-c.response*d),m=Math.hypot(i.x,i.y);p.vx+=(i.x*c.moveSpeed-p.vx)*r;p.vy+=(i.y*c.moveSpeed-p.vy)*r;if(m<.05){p.vx*=Math.pow(c.stopDrag,d);p.vy*=Math.pow(c.stopDrag,d)}p.x=clamp(p.x+p.vx*d,A.left,A.right);p.y=clamp(p.y+p.vy*d,A.top,A.bottom);collide(p,s)}
  if(i.fire&&s.time-p.lastShot>=c.shotCadence){p.lastShot=s.time;for(let j=-3;j<=3;j++){const a=p.aim+j*c.shotSpread;s.shots.push({id:uid(),owner:n,x:p.x+Math.cos(a)*25,y:p.y+Math.sin(a)*25,vx:Math.cos(a)*c.shotSpeed,vy:Math.sin(a)*c.shotSpeed,life:.5})}s.fx.push({id:uid(),type:"muzzle",x:p.x+Math.cos(p.aim)*35,y:p.y+Math.sin(p.aim)*35,life:.12,owner:n})}
 }
 for(const m of s.matter){if(m.heldBy!==null){const p=s.players[m.heldBy];m.x=p.x+Math.cos(p.aim)*70;m.y=p.y+Math.sin(p.aim)*70;continue}if(m.orbitBy!==null){const p=s.players[m.orbitBy],j=p.orbitIds.indexOf(m.id),a=s.time*4+j*2.1;m.x=p.x+Math.cos(a)*62;m.y=p.y+Math.sin(a)*62;continue}m.x+=m.vx*d;m.y+=m.vy*d;m.vx*=Math.pow(.35,d);m.vy*=Math.pow(.35,d);if(m.life<999)m.life-=dt;if(m.x<A.left||m.x>A.right){m.x=clamp(m.x,A.left,A.right);m.vx*=-.6}if(m.y<A.top||m.y>A.bottom){m.y=clamp(m.y,A.top,A.bottom);m.vy*=-.6}}
 for(const sh of s.shots){sh.x+=sh.vx*d;sh.y+=sh.vy*d;sh.life-=dt;const target=s.players[1-sh.owner];if(target&&dist(sh,target)<21){target.hp=Math.max(0,target.hp-c.shotDamage);target.knock=.26;target.vx+=sh.vx*.1;target.vy+=sh.vy*.1;sh.life=0;s.fx.push({id:uid(),type:"hit",x:target.x,y:target.y,life:.25})}}
 s.shots=s.shots.filter(x=>x.life>0);s.matter=s.matter.filter(x=>x.life>0);s.fx.forEach(f=>f.life-=dt);s.fx=s.fx.filter(f=>f.life>0);
}
export function advance(s:GameState,now=Date.now()){let elapsed=clamp((now-s.lastAt)/1000,0,.25);s.lastAt=now;if(s.phase==="countdown"){s.countdown=Math.max(0,s.countdown-elapsed);if(!s.countdown)s.phase="playing";return}if(s.phase!=="playing"||(s.mode!=="solo"&&s.players.length<2))return;let prev=s.players.map(p=>({...p.processedInput}));while(elapsed>0){const dt=Math.min(1/60,elapsed);s.time+=dt;botInput(s);step(s,dt,prev);s.players.forEach(p=>p.processedInput={...p.input});prev=s.players.map(p=>({...p.input}));elapsed-=dt}}
export function startOrRematch(s:GameState,slot:number){if(s.mode==="solo"){respawn(s);return}if(slot===0){respawn(s)}}
export function safeState(s:GameState){return{...s,players:s.players.map(({token,...p})=>p)}}
