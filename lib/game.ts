import {bayCoverState,bayObject} from "./bayBridgeMap";
export type InputState={x:number;y:number;aim:number;fire:boolean;shield:boolean;coverAim:boolean;slide:boolean;melee:boolean;heavy:boolean;grip:boolean;throwMatter:boolean;cover:boolean;orbit:boolean;launchOrbit:boolean;pinball:boolean;powerup:boolean;slow:boolean};
export type CombatConfig={chargeMoveScale:number;chargeMoveResponse:number;powerChargeSeconds:number;godDuration:number;godDrain:number;powerRecharge:number;godDamage:number;gripEnergy:number;holdEnergy:number;coverThrowEnergy:number;carryResponse:number;carryTurnResponse:number;carryMomentum:number;slideEnergy:number;dashEnergy:number;rechargeDelay:number;rechargeRate:number;weaveEnabled:number;moveSpeed:number;response:number;stopDrag:number;slideDrag:number;dashSpeed:number;dashDuration:number;doubleTapWindow:number;slideSpeed:number;slideDuration:number;slideSustain:number;slideSteer:number;slideSteerAngle:number;slideSteerResponse:number;slideBrake:number;slideCancelSpeed:number;shotCadence:number;shotSpread:number;shotDamage:number;shotSpeed:number;throwForce:number;pinballSpeed:number;pinballDuration:number;maxHealth:number;spriteScale:number;cameraZoom:number;};
export const DEFAULT_CONFIG:CombatConfig={chargeMoveScale:.67145,chargeMoveResponse:8,powerChargeSeconds:2.4,godDuration:12,godDrain:2,powerRecharge:26,godDamage:1.35,gripEnergy:6,holdEnergy:6,coverThrowEnergy:8,carryResponse:12,carryTurnResponse:9,carryMomentum:.65,slideEnergy:12,dashEnergy:6,rechargeDelay:1.1,rechargeRate:9,weaveEnabled:1,moveSpeed:222.7,response:13,stopDrag:.002,slideDrag:.12,dashSpeed:620,dashDuration:.19,doubleTapWindow:.28,slideSpeed:689.15949375,slideDuration:.63,slideSustain:360,slideSteer:7.5,slideSteerAngle:.62,slideSteerResponse:7,slideBrake:9.5,slideCancelSpeed:150,shotCadence:.39,shotSpread:.04,shotDamage:10,shotSpeed:820,throwForce:720,pinballSpeed:830,pinballDuration:.5,maxHealth:420,spriteScale:.82,cameraZoom:1.85};
export type CoverAnchor={face:"left"|"right"|"top"|"bottom";edge:number;t:number;length:number;offset:number;half:number;nx:number;ny:number;tx:number;ty:number};
export type CoverExit={points:{x:number;y:number}[];index:number;dx:number;dy:number;until:number;travel:number;total:number;coverId:string};
export type Player={botRouteSide?:number;botGripSince?:number;hitUntil?:number;hitAngle?:number;deathAt?:number;shells?:number;maxShells?:number;reserveShells?:number;weaponState?:"READY"|"FIRE"|"RECOIL"|"PUMP"|"EMPTY"|"RELOAD";psychicStartedAt?:number;psychicReturnUntil?:number;chargeSuppressed?:string[];x:number;y:number;vx:number;vy:number;aim:number;hp:number;battery:number;charging:boolean;chargeMotion:number;chargeAge:number;godCharge:number;godTime:number;godDuration:number;powerFlash:number;powerReturn:number;powerReleaseAge:number;powerReleaseCharge:number;godFade:number;godFadeStrength:number;powerBlocked:boolean;lastEnergyAt:number;dash:number;brake:number;slideSteerCurrent:number;lastSlideTap:number;slide:number;slideFacing:number;slideCool:number;kickScale?:number;kickStage:"none"|"burst"|"step";kickTime:number;kickAngle:number;kickNx:number;kickNy:number;coverId:string|null;coverMode:"soft"|"braced"|null;coverAnchor:CoverAnchor|null;coverLock:number;coverSpeed:number;softImpact?:number;softImpactAt?:number;peek:boolean;peekEdge:boolean;contact:number;exit:CoverExit|null;shield:boolean;gripId:string|null;gripCoverId:string|null;coverGripAngle:number;coverGripDist:number;orbitIds:string[];knock:number;pinball:number;lastShot:number;fireBlocked:boolean;fireState:number;recoil:number;returnToCover:number;boostState:number;brakeState:number;diagAuthCorrection?:number;diagNetAge?:number;gunFacing:number;lastMelee:number;score:number;rematch:boolean;input:InputState;processedInput:InputState;lastSeq:number;name:string;token:string;bot:boolean};
export type Cover={scarAt?:number;id:string;x:number;y:number;w:number;h:number;a:number;hp:number;maxHp:number;generated:boolean;build:number;variant:number;artId?:string;coverClass?:"waist"|"tall";born?:number;vx?:number;vy?:number;throwOwner?:number;hitIds?:string[]};
export type Matter={throwOwner?:number;hitIds?:string[];sourceArt?:string;fragment?:number;id:string;x:number;y:number;vx:number;vy:number;r:number;kind:"metal"|"stone";heldBy:number|null;orbitBy:number|null;life:number};
export type Shot={id:string;owner:number;x:number;y:number;vx:number;vy:number;life:number;damage?:number;z?:number;renderOffsetX?:number;clearanceCoverId?:string};
export type Fx={id:string;type:string;x:number;y:number;life:number;owner?:number;text?:string;z?:number;renderOffsetX?:number;angle?:number};
export type HitRegion="low"|"torso"|"head";
export type CombatEvent={seq:number;round:number;at:number;kind:"hit"|"shield"|"cover"|"finish";owner:number;target?:number;region?:HitRegion;damage:number;x:number;y:number;z:number;material?:"stone"|"metal"};
export const REGION_DAMAGE={low:.75,torso:1,head:1.25};
export const FINISHER_SECONDS=1.25;
export type GameState={events?:CombatEvent[];eventSeq?:number;timeScale?:number;fightUntil?:number;build:string;mode:"bot"|"solo"|"duel"|"practice";phase:"lobby"|"countdown"|"playing"|"finisher"|"finished";round:number;winner:number|null;countdown:number;finisher:number;createdAt:number;lastAt:number;time:number;config:CombatConfig;players:Player[];covers:Cover[];matter:Matter[];shots:Shot[];fx:Fx[]};

const empty=():InputState=>({x:0,y:0,aim:0,fire:false,shield:false,coverAim:false,slide:false,melee:false,heavy:false,grip:false,throwMatter:false,cover:false,orbit:false,launchOrbit:false,pinball:false,powerup:false,slow:false});
const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v)),wrap=(a:number)=>Math.atan2(Math.sin(a),Math.cos(a)),dist=(a:{x:number;y:number},b:{x:number;y:number})=>Math.hypot(a.x-b.x,a.y-b.y),uid=()=>crypto.randomUUID().slice(0,8);
const A={left:70,right:930,top:90,bottom:550};
function player(x:number,y:number,aim:number,name:string,token:string,bot=false,hp=100):Player{return{shells:8,maxShells:8,reserveShells:24,weaponState:"READY",x,y,vx:0,vy:0,aim,hp,battery:100,charging:false,chargeMotion:1,chargeAge:0,godCharge:0,godTime:0,godDuration:0,powerFlash:0,powerReturn:0,powerReleaseAge:0,powerReleaseCharge:0,godFade:0,godFadeStrength:0,powerBlocked:false,lastEnergyAt:-9,dash:0,brake:0,slideSteerCurrent:0,lastSlideTap:-9,slide:0,slideFacing:aim,slideCool:0,kickStage:"none",kickTime:0,kickAngle:aim,kickNx:0,kickNy:0,coverId:null,coverMode:null,coverAnchor:null,coverLock:0,coverSpeed:0,softImpact:0,softImpactAt:-9,peek:false,peekEdge:false,contact:0,exit:null,shield:false,gripId:null,gripCoverId:null,coverGripAngle:aim,coverGripDist:92,orbitIds:[],knock:0,pinball:0,lastShot:-9,fireBlocked:false,fireState:0,recoil:0,returnToCover:0,boostState:0,brakeState:0,gunFacing:aim,lastMelee:-9,score:0,rematch:false,input:empty(),processedInput:empty(),lastSeq:-1,name,token,bot}}
export function newGame(name:string,token:string,now=Date.now(),mode:"bot"|"solo"|"duel"|"practice"="solo"):GameState{
 const config={...DEFAULT_CONFIG};
 const players=[player(230,330,0,name,token,false,config.maxHealth)];
 if(mode==="bot"||mode==="practice")players.push(player(780,330,Math.PI,"RIFT HUNTER","",true,config.maxHealth));
 const matter:Matter[]=[];[[170,170,"stone"],[330,190,"metal"],[500,160,"stone"],[680,195,"metal"],[800,165,"stone"],[420,470,"metal"],[610,465,"stone"],[760,445,"metal"]].forEach(([x,y,k],i)=>matter.push({id:"m"+i,x:x as number,y:y as number,vx:0,vy:0,r:14,kind:k as any,heldBy:null,orbitBy:null,life:999}));
 if(mode==="practice")matter.length=0;
 const covers:Cover[]=bayCoverState().filter(c=>mode!=="practice"||["bay-sedan","bay-cabinet","bay-jersey"].includes(c.id));
 return{build:"COMBAT-MASTER-STUDIO-01",mode,phase:mode==="solo"?"playing":mode==="duel"?"lobby":"countdown",round:1,winner:null,countdown:3,finisher:0,events:[],eventSeq:0,timeScale:1,fightUntil:0,createdAt:now,lastAt:now,time:0,config,players,covers,matter,shots:[],fx:[]}
}
export function updateConfig(s:GameState,patch:Partial<CombatConfig>){s.config={...s.config,...patch};for(const p of s.players)p.hp=Math.min(p.hp,s.config.maxHealth)}
export function joinGame(s:GameState,name:string,token:string){if(s.mode==="practice")throw Error("Practice is not joinable");if(s.mode==="solo")throw Error("Solo session is not joinable");const b=s.players.findIndex(p=>p.bot);if(b>=0){s.players[b]={...s.players[b],name,token,bot:false,lastSeq:-1,input:empty(),processedInput:empty()};return}if(s.players.length>1)throw Error("Room is full");s.players.push(player(780,330,Math.PI,name,token,false,s.config.maxHealth))}
function respawn(s:GameState){const cfg={...s.config},ids=s.players.map(p=>({name:p.name,token:p.token,bot:p.bot,score:p.score})),fresh=newGame(ids[0].name,ids[0].token,s.lastAt,s.mode);fresh.config=cfg;fresh.players[0].hp=cfg.maxHealth;if(ids[1])fresh.players[1]=player(780,330,Math.PI,ids[1].name,ids[1].token,ids[1].bot,cfg.maxHealth);fresh.players.forEach((p,i)=>p.score=ids[i]?.score||0);fresh.round=s.round+1;fresh.createdAt=s.createdAt;fresh.phase=s.mode==="solo"?"playing":"countdown";Object.assign(s,fresh)}
export function setInput(s:GameState,slot:number,seq:number,input:Partial<InputState>){const p=s.players[slot];if(!p||seq<=p.lastSeq)return;p.lastSeq=seq;let x=clamp(Number(input.x)||0,-1,1),y=clamp(Number(input.y)||0,-1,1),m=Math.hypot(x,y);if(m>1){x/=m;y/=m}p.input={...empty(),...input,x,y,aim:Number.isFinite(input.aim)?wrap(input.aim as number):p.aim}}

function localPoint(c:Cover,x:number,y:number){const ca=Math.cos(c.a||0),sa=Math.sin(c.a||0),dx=x-c.x,dy=y-c.y;return{x:dx*ca+dy*sa,y:-dx*sa+dy*ca}}
function worldPoint(c:Cover,x:number,y:number){const ca=Math.cos(c.a||0),sa=Math.sin(c.a||0);return{x:c.x+x*ca-y*sa,y:c.y+x*sa+y*ca}}
function coverFace(c:Cover,p:Player|{x:number;y:number;r?:number}):CoverAnchor&{gap:number}{
 const q=localPoint(c,p.x,p.y),hw=c.w/2,hh=c.h/2,px=clamp(q.x,-hw,hw),py=clamp(q.y,-hh,hh);
 let face:"left"|"right"|"top"|"bottom";
 if(Math.abs(q.x)>hw&&Math.abs(q.y)>hh)face=Math.abs(q.x)-hw>Math.abs(q.y)-hh?(q.x<0?"left":"right"):(q.y<0?"top":"bottom");
 else if(Math.abs(q.x)>hw)face=q.x<0?"left":"right";else if(Math.abs(q.y)>hh)face=q.y<0?"top":"bottom";
 else{const ds=[q.x+hw,hw-q.x,q.y+hh,hh-q.y];face=(["left","right","top","bottom"] as const)[ds.indexOf(Math.min(...ds))]}
 const edge=face==="top"?0:face==="right"?1:face==="bottom"?2:3;
 const length=edge%2===0?c.w:c.h;
 const t=edge===0?clamp(q.x+hw,0,c.w):edge===1?clamp(q.y+hh,0,c.h):edge===2?clamp(hw-q.x,0,c.w):clamp(hh-q.y,0,c.h);
 const ca=Math.cos(c.a||0),sa=Math.sin(c.a||0);
 const localTangents=[[1,0],[0,1],[-1,0],[0,-1]],localNormals=[[0,-1],[1,0],[0,1],[-1,0]];
 const [ltx,lty]=localTangents[edge],[lnx,lny]=localNormals[edge];
 const tx=ltx*ca-lty*sa,ty=ltx*sa+lty*ca,nx=lnx*ca-lny*sa,ny=lnx*sa+lny*ca;
 const offset=edge===0?t-hw:edge===1?t-hh:edge===2?hw-t:hh-t;
 return{face,edge,t,length,offset,half:length/2,nx,ny,tx,ty,gap:Math.hypot(q.x-px,q.y-py)-(("r" in p&&typeof p.r==="number")?p.r:18)};
}
function anchorForEdge(c:Cover,edge:number,t:number):CoverAnchor{
 const hw=c.w/2,hh=c.h/2,length=edge%2===0?c.w:c.h,tt=clamp(t,0,length),face=(["top","right","bottom","left"] as const)[edge];
 const ca=Math.cos(c.a||0),sa=Math.sin(c.a||0),localTangents=[[1,0],[0,1],[-1,0],[0,-1]],localNormals=[[0,-1],[1,0],[0,1],[-1,0]];
 const [ltx,lty]=localTangents[edge],[lnx,lny]=localNormals[edge],tx=ltx*ca-lty*sa,ty=ltx*sa+lty*ca,nx=lnx*ca-lny*sa,ny=lnx*sa+lny*ca;
 const offset=edge===0?tt-hw:edge===1?tt-hh:edge===2?hw-tt:hh-tt;
 return{face,edge,t:tt,length,offset,half:length/2,nx,ny,tx,ty};
}
function placeOnCover(p:Player,s:GameState){
 const c=s.covers.find(x=>x.id===p.coverId),a=p.coverAnchor;if(!c||!a)return;
 const r=18.5,hw=c.w/2,hh=c.h/2;let lx=0,ly=0;
 if(a.edge===0){lx=-hw+a.t;ly=-hh-r}
 else if(a.edge===1){lx=hw+r;ly=-hh+a.t}
 else if(a.edge===2){lx=hw-a.t;ly=hh+r}
 else{lx=-hw-r;ly=hh-a.t}
 const q=worldPoint(c,lx,ly);p.x=q.x;p.y=q.y;
}
function attachCover(p:Player,c:Cover,s:GameState,mode:"soft"|"braced"="soft"){if(s.time<p.coverLock)return false;const anchor=coverFace(c,p),meta=bayObject(c.artId||c.id),rail=meta?.rig?.coverRails?.find(r=>({FRONT:"bottom",BACK:"top",LEFT:"left",RIGHT:"right"} as const)[r.side]===anchor.face),railT=anchor.length?anchor.t/anchor.length:.5;if(meta&&(!rail||railT<rail.from||railT>rail.to))return false;const incoming=Math.abs(p.vx*anchor.nx+p.vy*anchor.ny),impact=clamp(incoming/Math.max(1,s.config.slideSpeed),0,1);p.coverId=c.id;p.coverMode=mode;p.coverAnchor=anchor;p.slide=0;p.dash=0;p.softImpact=mode==="soft"?impact:0;p.softImpactAt=s.time;p.vx=p.vy=0;p.coverSpeed=0;p.contact=s.time+.22;p.peek=false;placeOnCover(p,s);s.fx.push({id:uid(),type:mode==="soft"?"soft-cover":"cover-slam",x:p.x,y:p.y,life:.25,entrySpeed:incoming} as any);return true}
function releaseCover(p:Player,s:GameState,lock=.18){p.coverId=null;p.coverMode=null;p.coverAnchor=null;p.coverSpeed=0;p.peek=false;p.peekEdge=false;p.coverLock=s.time+lock}
function moveOnCover(p:Player,s:GameState,i:InputState,dt:number){
 const a=p.coverAnchor;if(!a||!p.coverId)return;const c=s.config,moveSpeed=c.moveSpeed*(p.chargeMotion??1),mag=Math.hypot(i.x,i.y),away=i.x*a.nx+i.y*a.ny;
 // PASS07 cover grammar: soft cover follows stick intent; A commits hard brace; LT only plants/exposes hard brace.
 if(p.coverMode==="braced"&&i.coverAim){
  // PASS05 DEFINITIVE COVER GRAMMAR: LT is planted combat exposure.
  // Authoritative cover root/anchor does not translate while held. Right-stick
  // aim remains independent and immediate; A/classic cover action still escapes.
  p.coverSpeed=0;p.vx=0;p.vy=0;
  const forward=Math.cos(p.gunFacing)*a.nx+Math.sin(p.gunFacing)*a.ny;
  p.peek=true;p.peekEdge=Math.min(a.t,a.length-a.t)<18;
  placeOnCover(p,s);return;
 }
 if(p.coverMode==="soft"&&mag>.18&&away/mag>.15){releaseCover(p,s,.055);p.vx=i.x*moveSpeed;p.vy=i.y*moveSpeed;p.x=clamp(p.x+p.vx*dt,A.left,A.right);p.y=clamp(p.y+p.vy*dt,A.top,A.bottom);collide(p,s);return}
 if(c.weaveEnabled<.5){
   if(p.coverMode==="soft"&&mag>.55&&away>.65){releaseCover(p,s,.045);p.vx=i.x*moveSpeed;p.vy=i.y*moveSpeed;return}
   const cv=s.covers.find(x=>x.id===p.coverId);if(!cv){releaseCover(p,s);return}
   let edge=a.edge,cur=anchorForEdge(cv,edge,a.t),along=i.x*cur.tx+i.y*cur.ty,t=cur.t,g=0;
   if(t<.5&&along<-.1)g=-1;else if(t>cur.length-.5&&along>.1)g=1;
   if(g){
     const ne=(edge+g+4)%4,next=anchorForEdge(cv,ne,g>0?0:(ne%2===0?cv.w:cv.h)),nextDot=i.x*next.tx+i.y*next.ty;
     if(nextDot*g>.42){edge=ne;cur=next;t=g>0?0:next.length;along=nextDot}
   }
   const step=moveSpeed*dt*.78;t=clamp(t+along*step,0,cur.length);p.coverAnchor=anchorForEdge(cv,edge,t);p.coverSpeed=along*moveSpeed*.78;p.vx=p.coverAnchor.tx*p.coverSpeed;p.vy=p.coverAnchor.ty*p.coverSpeed;placeOnCover(p,s);
   if(p.coverMode==="braced"&&i.coverAim){const forward=Math.cos(p.gunFacing)*p.coverAnchor.nx+Math.sin(p.gunFacing)*p.coverAnchor.ny;p.peek=true;p.peekEdge=Math.min(p.coverAnchor.t,p.coverAnchor.length-p.coverAnchor.t)<18}else{p.peek=false;p.peekEdge=Math.min(p.coverAnchor.t,p.coverAnchor.length-p.coverAnchor.t)<18}
   return;
 }
 const along=i.x*a.tx+i.y*a.ty;
 if(p.coverMode==="soft"&&away>.38){releaseCover(p,s,.08);p.vx=i.x*moveSpeed*1.15;p.vy=i.y*moveSpeed*1.15;return}
 p.coverSpeed+=(along*moveSpeed-p.coverSpeed)*Math.min(1,dt*c.response);if(Math.abs(along)<.001)p.coverSpeed*=Math.pow(c.stopDrag,dt);
 const before=a.t,raw=a.t+along*moveSpeed*dt;a.t=clamp(raw,0,a.length);
 if(p.coverMode==="soft"&&Math.abs(raw-a.t)>.1&&Math.abs(along)>.2){
   const cv=s.covers.find(x=>x.id===p.coverId);if(cv){const g=raw<0?-1:1,ne=(a.edge+g+4)%4,next=anchorForEdge(cv,ne,g>0?0:(ne%2===0?cv.w:cv.h)),nextDot=i.x*next.tx+i.y*next.ty;if(nextDot*g>.3)p.coverAnchor=next}
 }else if(a.t===before)p.coverSpeed=0;
 placeOnCover(p,s);
 if(p.coverMode==="braced"&&i.coverAim){const forward=Math.cos(p.gunFacing)*p.coverAnchor!.nx+Math.sin(p.gunFacing)*p.coverAnchor!.ny;p.peek=true;p.peekEdge=Math.min(p.coverAnchor!.t,p.coverAnchor!.length-p.coverAnchor!.t)<18}else{p.peek=false;p.peekEdge=Math.min(p.coverAnchor!.t,p.coverAnchor!.length-p.coverAnchor!.t)<18}
}
function classicCoverAction(p:Player,s:GameState,i:InputState){
 const a=p.coverAnchor,cv=s.covers.find(x=>x.id===p.coverId);if(!a||!cv)return false;
 const mag=Math.hypot(i.x,i.y),ax=mag>.18?i.x/mag:a.nx,ay=mag>.18?i.y/mag:a.ny,normal=ax*a.nx+ay*a.ny,tan=Math.abs(ax*a.tx+ay*a.ty);
 const kind=normal>.15?"outward":tan>.55&&normal>=-.05?"past":"blocked";
 if(kind==="blocked"){s.fx.push({id:uid(),type:"cover-block",x:p.x,y:p.y,life:.18});return false}
 // Every valid escape has a free base; charge funds only the bounded boost.
 const cost=Math.min(Math.max(0,p.battery),Math.max(0,s.config.slideEnergy)),scale=.55+.45*(s.config.slideEnergy>0?cost/s.config.slideEnergy:1);
 p.battery=Math.max(0,p.battery-cost);if(cost>0)p.lastEnergyAt=s.time;p.kickScale=scale;
 releaseCover(p,s,.25);p.coverLock=s.time+.25;p.slideSteerCurrent=0;
 if(kind==="past"){
   const sign=ax*a.tx+ay*a.ty<0?-1:1;p.kickAngle=Math.atan2(ay,ax);p.kickNx=a.nx;p.kickNy=a.ny;p.kickStage="burst";p.kickTime=.13;p.vx=Math.cos(p.kickAngle)*408*scale;p.vy=Math.sin(p.kickAngle)*408*scale;p.slideFacing=p.kickAngle;p.slideCool=.94;p.exit=null;s.fx.push({id:uid(),type:"dash",x:p.x,y:p.y,life:.22,text:"BURST"});return true
 }
 const dx=ax,dy=ay,len=Math.hypot(dx,dy)||1;
 p.vx=dx/len*s.config.slideSpeed*scale;p.vy=dy/len*s.config.slideSpeed*scale;p.slideFacing=Math.atan2(p.vy,p.vx);p.slide=s.config.slideDuration;p.slideCool=s.config.slideDuration;s.fx.push({id:uid(),type:"slide",x:p.x,y:p.y,life:.4,text:"KICK"});return true
}
function beginCoverExit(p:Player,s:GameState,i:InputState){
 const a=p.coverAnchor,c=s.covers.find(x=>x.id===p.coverId);if(!a||!c)return false;
 const len=Math.hypot(i.x,i.y),ix=len>.18?i.x/len:a.nx,iy=len>.18?i.y/len:a.ny,out=ix*a.nx+iy*a.ny,tan=ix*a.tx+iy*a.ty;
 if(len<=.18||out>.18){releaseCover(p,s,.7);p.lastSlideTap=-9;p.slide=s.config.slideDuration;p.slideFacing=Math.atan2(iy,ix);p.vx=ix*s.config.slideSpeed;p.vy=iy*s.config.slideSpeed;return true}
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
 if(p.coverId||(p.slide<=0&&p.dash<=0)||s.time<p.coverLock)return;
 for(const c of s.covers){if(s.players.some(q=>q.gripCoverId===c.id))continue;const a=coverFace(c,p);if(a.gap<=3&&p.vx*a.nx+p.vy*a.ny<-1){attachCover(p,c,s,"soft");return}}
}
function circleBox(o:{x:number;y:number},r:number,c:Cover){const q=localPoint(c,o.x,o.y),nx=clamp(q.x,-c.w/2,c.w/2),ny=clamp(q.y,-c.h/2,c.h/2),dx=q.x-nx,dy=q.y-ny,d=Math.hypot(dx,dy),ca=Math.cos(c.a||0),sa=Math.sin(c.a||0),lx=d?dx/d:(q.x<0?-1:1),ly=d?dy/d:0;return{hit:d<r,nx:lx*ca-ly*sa,ny:lx*sa+ly*ca,depth:r-d}}
function collide(p:Player,s:GameState){if(p.coverId||p.exit)return;for(const cv of s.covers){if(s.players.some(q=>q.gripCoverId===cv.id))continue;const q=circleBox(p,18,cv);if(!q.hit)continue;if(s.config.weaveEnabled<.5&&s.time>=p.coverLock){attachCover(p,cv,s,"soft");return}p.x+=q.nx*(q.depth+1);p.y+=q.ny*(q.depth+1)}}
// Reuse the same rotated footprints for carry/throw contact; no new cover geometry.
function damageCover(cv:Cover,s:GameState,damage:number){
 if(cv.hp<=0)return;cv.hp=Math.max(0,cv.hp-damage);if(cv.hp>0)return;
 const meta=bayObject(cv.artId||cv.id),kind=meta?.material==="CONCRETE"?"stone":"metal";
 for(const p of s.players){if(p.coverId===cv.id)releaseCover(p,s,.25);if(p.gripCoverId===cv.id)p.gripCoverId=null;if(p.exit?.coverId===cv.id)p.exit=null;}
 s.fx.push({id:uid(),type:"cover-break",x:cv.x,y:cv.y,life:.8,angle:cv.a,text:kind});
 const count=Math.min(combatFight(s)?3:18,Math.max(0,64-s.matter.length));for(let n=0;n<count;n++){const a=n*2.399+cv.a,speed=50+n%5*24;s.matter.push({id:uid(),x:cv.x+Math.cos(a)*cv.w*.25,y:cv.y+Math.sin(a)*cv.h*.25,vx:Math.cos(a)*speed+(cv.vx||0)*.2,vy:Math.sin(a)*speed+(cv.vy||0)*.2,r:combatFight(s)?11:3+n%4,kind,heldBy:null,orbitBy:null,life:combatFight(s)?999:5,...combatFight(s)?{sourceArt:meta?.renderedShell,fragment:n,throwOwner:cv.throwOwner,hitIds:[]}:{}});}
}
function coverImpact(cv:Cover,s:GameState,key:string,other?:Cover){
 if(!combatFight(s)||cv.hp<=0||cv.build>=0||Math.hypot(cv.vx||0,cv.vy||0)<160||cv.hitIds?.includes(key))return;
 (cv.hitIds??=[]).push(key);const damage=Math.min(100,Math.hypot(cv.vx||0,cv.vy||0)*(bayObject(cv.artId||cv.id)?.mass||9)/90);
 if(other)damageCover(other,s,damage);damageCover(cv,s,damage);s.fx.push({id:uid(),type:"cover-impact",x:cv.x,y:cv.y,life:.3});
}
function settleCover(cv:Cover,s:GameState){
 const ex=Math.abs(Math.cos(cv.a))*cv.w/2+Math.abs(Math.sin(cv.a))*cv.h/2,ey=Math.abs(Math.sin(cv.a))*cv.w/2+Math.abs(Math.cos(cv.a))*cv.h/2;
 const x=clamp(cv.x,A.left+ex,A.right-ex),y=clamp(cv.y,A.top+ey,A.bottom-ey);
 if(x!==cv.x||y!==cv.y)coverImpact(cv,s,"boundary");if(x!==cv.x)cv.vx=0;if(y!==cv.y)cv.vy=0;cv.x=x;cv.y=y;
 for(const other of s.covers){
  if(other.id===cv.id||other.hp<=0)continue;
  const axes=[[Math.cos(cv.a),Math.sin(cv.a)],[-Math.sin(cv.a),Math.cos(cv.a)],[Math.cos(other.a),Math.sin(other.a)],[-Math.sin(other.a),Math.cos(other.a)]];
  let depth=Infinity,nx=0,ny=0,overlap=true;
  for(const [ax,ay]of axes){
   const radius=(c:Cover)=>Math.abs(ax*Math.cos(c.a)+ay*Math.sin(c.a))*c.w/2+Math.abs(-ax*Math.sin(c.a)+ay*Math.cos(c.a))*c.h/2;
   const delta=(cv.x-other.x)*ax+(cv.y-other.y)*ay,penetration=radius(cv)+radius(other)-Math.abs(delta);
   if(penetration<=0){overlap=false;break}
   if(penetration<depth){depth=penetration;const sign=delta<0?-1:1;nx=ax*sign;ny=ay*sign}
  }
  if(overlap){coverImpact(cv,s,other.id,other);cv.x+=nx*(depth+.1);cv.y+=ny*(depth+.1);const toward=(cv.vx||0)*nx+(cv.vy||0)*ny;if(toward<0){cv.vx=(cv.vx||0)-toward*nx;cv.vy=(cv.vy||0)-toward*ny}}
 }
 cv.x=clamp(cv.x,A.left+ex,A.right-ex);cv.y=clamp(cv.y,A.top+ey,A.bottom-ey);
}
function spendEnergy(p:Player,s:GameState,cost:number){if(p.battery<cost){s.fx.push({id:uid(),type:"low-energy",x:p.x,y:p.y,life:.3,text:"LOW CHARGE"});return false}p.battery=Math.max(0,p.battery-cost);p.lastEnergyAt=s.time;return true}
// Charge is vulnerable; timers use real time, never slow-time simulation time.
function powerStep(p:Player,s:GameState,dt:number){
 const i=p.input,c=s.config;
 p.powerFlash=Math.max(0,p.powerFlash-dt);if(p.powerFlash<=0)p.powerReturn=Math.max(0,p.powerReturn-dt);p.godFade=Math.max(0,p.godFade-dt);
 if(!i.powerup)p.powerBlocked=false;
 // Fresh Y can refill mid-window; a held Y still cannot restart at expiry.
 const refill=i.powerup&&!p.processedInput.powerup&&!p.powerBlocked&&p.godTime>dt&&p.battery>c.godDrain*dt;
 if(p.godTime>0&&i.powerup&&!refill)p.powerBlocked=true;
 if(p.godTime>0){const glow=.6*Math.min(1,p.godTime/Math.max(.01,p.godDuration||12));p.godTime=Math.max(0,p.godTime-dt);p.battery=Math.max(0,p.battery-c.godDrain*dt);p.lastEnergyAt=s.time;if(!p.godTime||p.battery<=0){p.godTime=0;p.godFade=.45;p.godFadeStrength=glow}}
 if((p.powerFlash>0||p.powerReturn>0)&&(i.fire||i.slide||i.grip||i.melee||i.cover||i.shield||i.coverAim||p.knock>0)){p.powerFlash=0;p.powerReturn=0}
 const interrupted=!!(i.fire||i.slide||i.melee||i.heavy||i.grip||i.cover||i.shield||i.coverAim||i.slow||i.pinball||p.knock>0||p.slide>0||p.dash>0||p.exit||p.kickStage!=="none");
 if(p.charging&&(!i.powerup||interrupted)){
  if(!interrupted&&p.godCharge>=.35&&p.battery>0){p.godDuration=c.godDuration*p.godCharge;p.godTime=p.godDuration;p.powerFlash=.65;s.fx.push({id:uid(),type:"god-awaken",x:p.x,y:p.y,life:.5,text:"GOD FRAME"})}
  p.powerReleaseAge=p.chargeAge;p.powerReleaseCharge=p.godCharge;p.charging=false;p.powerReturn=interrupted?0:.24;p.chargeAge=0;p.godCharge=0;if(interrupted){p.powerBlocked=true;p.powerFlash=0;}
 }
 if(i.powerup&&!p.charging&&!p.powerBlocked&&(!p.godTime||refill)&&!interrupted){const remaining=p.battery<99.999?clamp(p.battery/100,0,1):0;p.godTime=0;p.powerFlash=0;p.charging=true;p.chargeAge=remaining>.001?.35+remaining*c.powerChargeSeconds:0;p.godCharge=remaining;p.powerReturn=0}
 if(p.charging){p.chargeAge+=dt;p.godCharge=clamp((p.chargeAge-.35)/Math.max(.1,c.powerChargeSeconds),0,1);p.battery=Math.min(100,p.battery+c.powerRecharge*dt);p.lastEnergyAt=s.time;if(p.coverId)p.peek=false}
 const target=p.charging?clamp(c.chargeMoveScale??.67145,.35,.85):1;
 p.chargeMotion=(p.chargeMotion??1)+(target-(p.chargeMotion??1))*(1-Math.exp(-clamp(c.chargeMoveResponse??8,3,16)*dt));
}
// A rejected slide consumes only its own action, not grip/drop or build edges.
function mobilityScale(p:Player,c:CombatConfig,cost:number,min=.34){
 const available=Math.max(0,Math.min(cost,p.battery)),ratio=cost>0?available/cost:1;
 if(available>0){p.battery=Math.max(0,p.battery-available)}
 return min+(1-min)*ratio;
}
function startDash(p:Player,s:GameState,a:number){
 const c=s.config,scale=mobilityScale(p,c,c.dashEnergy,.36);
 p.dash=c.dashDuration*(.72+.28*scale);p.boostState=p.dash+.08;p.slideSteerCurrent=0;p.slideFacing=a;
 const speed=c.dashSpeed*scale;p.vx=Math.cos(a)*speed;p.vy=Math.sin(a)*speed;
 p.lastEnergyAt=s.time;s.fx.push({id:uid(),type:"dash",x:p.x,y:p.y,life:.22,owner:s.players.indexOf(p),text:"ZIP!"});
}
function startClassicSlide(p:Player,s:GameState,a:number){
 const c=s.config,scale=mobilityScale(p,c,c.slideEnergy,.52);
 p.dash=0;p.slideSteerCurrent=0;p.slide=c.slideDuration*(.84+.16*scale);p.slideFacing=a;
 const launch=c.slideSpeed*scale;p.vx=Math.cos(a)*launch;p.vy=Math.sin(a)*launch;p.slideCool=c.slideDuration;
 p.lastEnergyAt=s.time;s.fx.push({id:uid(),type:"slide",x:p.x,y:p.y,life:.48,owner:s.players.indexOf(p),text:Math.floor(s.time)%2?"SKURT!":"SKEET"});
}
function slideAction(s:GameState,n:number,prev:InputState){const p=s.players[n],i=p.input,c=s.config;
 if(!(i.slide&&!prev.slide)||p.knock>0)return false;
 const mag=Math.hypot(i.x,i.y),a=mag>.1?Math.atan2(i.y,i.x):p.gunFacing;
 const doubleTap=(s.time-p.lastSlideTap)<=c.doubleTapWindow;p.lastSlideTap=s.time;

 // Own the soft-cover A edge here, before mobility can release its anchor.
 if(p.coverId&&p.coverMode==="soft"){
   const anchor=p.coverAnchor,out=anchor&&mag>.18?(i.x*anchor.nx+i.y*anchor.ny)/mag:0;
   if(anchor&&out<=.15){p.coverMode="braced";p.vx=p.vy=p.coverSpeed=0;s.fx.push({id:uid(),type:"brace",x:p.x,y:p.y,life:.2,owner:n});return true}
   releaseCover(p,s,.055);startDash(p,s,a);return true;
 }
 // Hard brace / planted cover keeps deliberate commitment, but A is still immediate escape.
 if(p.coverId&&p.coverMode==="braced"){
   releaseCover(p,s,.085);startDash(p,s,a);return true;
 }
 if(p.exit)return false;
 if(doubleTap){
   startClassicSlide(p,s,a);return true;
 }
 startDash(p,s,a);return true;
}
// Duel repairs use the existing pellet damage and action cooldown; movement tuning stays fixed.
function combatFight(s:GameState){return s.mode==="duel"||s.mode==="practice"}
function combatEvent(s:GameState,event:Omit<CombatEvent,"seq"|"round"|"at">){
 const e={...event,seq:(s.eventSeq||0)+1,round:s.round,at:s.time};s.eventSeq=e.seq;(s.events??=[]).push(e);s.events=s.events.slice(-64);return e;
}
function duelContact(s:GameState,owner:number,target:Player,damage:number,vx=0,vy=0,region:HitRegion="torso",point?:{x:number;y:number;z:number}){
 if(target.hp<=0)return;
 const pos=point||{x:target.x,y:target.y,z:36*s.config.spriteScale},targetId=s.players.indexOf(target);
 if(target.shield&&target.input.shield&&!target.coverId&&target.battery>0){combatEvent(s,{kind:"shield",owner,target:targetId,damage:0,...pos});s.fx.push({id:uid(),type:"shield-block",x:pos.x,y:pos.y,z:pos.z,life:.22,owner});return;}
 const dealt=Math.min(target.hp,damage);target.hp=Math.max(0,target.hp-damage);target.knock=.26;target.vx+=vx;target.vy+=vy;target.hitUntil=s.time+.18;target.hitAngle=Math.atan2(vy,vx);if(!target.hp)target.deathAt=s.time;
 combatEvent(s,{kind:"hit",owner,target:targetId,region,damage:dealt,...pos});s.fx.push({id:uid(),type:"hit",x:pos.x,y:pos.y,z:pos.z,life:.32,owner,text:region});
}
function edgeActions(s:GameState,n:number,prev:InputState){const p=s.players[n],i=p.input,c=s.config;
 // Successful immediate brace keeps its original priority over other edges.
 if(slideAction(s,n,prev))return;
 if(i.pinball&&!prev.pinball&&p.battery>=22){p.battery-=22;p.pinball=c.pinballDuration;p.vx=Math.cos(p.aim)*c.pinballSpeed;p.vy=Math.sin(p.aim)*c.pinballSpeed;s.fx.push({id:uid(),type:"pinball",x:p.x,y:p.y,life:.5,owner:n})}
 if((i.melee&&!prev.melee||i.heavy&&!prev.heavy)&&s.time-p.lastMelee>(i.heavy?.85:.38)){p.lastMelee=s.time;s.fx.push({id:uid(),type:i.heavy?"heavy":"melee",x:p.x+Math.cos(p.aim)*40,y:p.y+Math.sin(p.aim)*40,life:.22,owner:n});if(combatFight(s)){const target=s.players[1-n],strike={x:p.x+Math.cos(p.aim)*40,y:p.y+Math.sin(p.aim)*40};if(target&&dist(strike,target)<=21&&!s.covers.some(cv=>segmentCover(p,strike,cv)))duelContact(s,n,target,i.heavy?34:18,Math.cos(p.aim)*(i.heavy?520:280),Math.sin(p.aim)*(i.heavy?520:280))}}
 if(i.cover&&!prev.cover&&p.battery>=30){p.battery-=30;const x=clamp(p.x+Math.cos(p.aim)*100-65,A.left,A.right-130),y=clamp(p.y+Math.sin(p.aim)*100-15,A.top,A.bottom-30);const generated=s.covers.filter(c=>c.generated);if(generated.length>=4){const old=generated[0];if(p.coverId===old.id)releaseCover(p,s,.15);s.covers=s.covers.filter(c=>c.id!==old.id)}const used=new Set(s.covers.filter(c=>c.generated).map(c=>c.variant));let variant=0;while(used.has(variant)&&variant<3)variant++;s.covers.push({id:uid(),x:x+65,y:y+15,w:130,h:30,a:p.aim+Math.PI/2,hp:110,maxHp:110,generated:true,build:1,variant,born:s.time});if(s.mode==="practice"){const cv=s.covers[s.covers.length-1],source=bayObject("bay-jersey")!;cv.artId=source.id;cv.w=source.collisionHull.w;cv.h=source.collisionHull.h;cv.coverClass=source.coverClass||"waist";}s.fx.push({id:uid(),type:"materialize",x:x+65,y:y+15,life:.7,owner:n})}
 if(!i.fire)p.fireBlocked=false;
 if(!i.grip&&prev.grip){
  if(p.gripCoverId){const cv=s.covers.find(c=>c.id===p.gripCoverId);if(cv){cv.build=0;cv.vx=cv.vy=0}p.gripCoverId=null}
  if(p.gripId){const m=s.matter.find(m=>m.id===p.gripId);if(m)m.heldBy=null;p.gripId=null}
 }
 if(i.grip&&!prev.grip){
   if(p.gripCoverId){const cv=s.covers.find(c=>c.id===p.gripCoverId);if(cv){cv.build=0;cv.vx=cv.vy=0}s.fx.push({id:uid(),type:"matter-drop",x:cv?.x??p.x,y:cv?.y??p.y,life:.24,owner:n});p.gripCoverId=null}
   else if(p.gripId){const m=s.matter.find(m=>m.id===p.gripId);if(m)m.heldBy=null;p.gripId=null}
   else{
     const candidates=s.covers.filter(cv=>(cv.generated||!!bayObject(cv.artId||cv.id)?.gripCompatible)&&!s.players.some((q,j)=>j!==n&&(q.coverId===cv.id||q.gripCoverId===cv.id)));
     // The attached block is deliberate intent; loose debris cannot steal this grab.
     let cv=candidates.find(cv=>cv.id===p.coverId)||candidates.filter(cv=>{const d=dist(cv,p);return d<235&&((cv.x-p.x)*Math.cos(p.gunFacing)+(cv.y-p.y)*Math.sin(p.gunFacing))/Math.max(1,d)>.45}).sort((a,b)=>dist(a,p)-dist(b,p))[0];
     const loose=s.matter.filter(m=>m.heldBy===null&&m.orbitBy===null&&dist(m,p)<105&&((m.x-p.x)*Math.cos(p.gunFacing)+(m.y-p.y)*Math.sin(p.gunFacing))/Math.max(1,dist(m,p))>.45).sort((a,b)=>dist(a,p)-dist(b,p))[0];
     if(combatFight(s)&&cv?.id!==p.coverId&&loose&&dist(loose,p)<(cv?dist(cv,p):Infinity))cv=undefined;
     if(cv){if(spendEnergy(p,s,c.gripEnergy)){releaseCover(p,s,.25);p.gripCoverId=cv.id;p.coverGripAngle=cv.a;p.coverGripDist=clamp(dist(cv,p),78,118);cv.vx=cv.vy=0;cv.build=.001;s.fx.push({id:uid(),type:"matter-rip",x:cv.x,y:cv.y,life:.42,owner:n})}}
     else{const m=combatFight(s)?loose:s.matter.filter(m=>m.heldBy===null&&m.orbitBy===null).sort((a,b)=>dist(a,p)-dist(b,p))[0];if(m&&dist(m,p)<105&&spendEnergy(p,s,c.gripEnergy)){p.gripId=m.id;m.heldBy=n}}
   }
 }
 const held=!!(p.gripCoverId||p.gripId);
 if(held&&i.fire)p.fireBlocked=true;
 if((i.throwMatter&&!prev.throwMatter)||(held&&i.grip&&i.fire&&!prev.fire)){
   if(p.gripCoverId){const cv=s.covers.find(c=>c.id===p.gripCoverId);if(cv&&spendEnergy(p,s,c.coverThrowEnergy)){
     const a=p.gunFacing??p.aim,force=c.throwForce*.62*(p.godTime>0?1.25:1)*(combatFight(s)?Math.sqrt(12/(bayObject(cv.artId||cv.id)?.mass||12)):1),inherit=clamp(c.carryMomentum,0,1);
     // Release where it is: preserve orientation and measured carry velocity.
     cv.vx=Math.cos(a)*force+p.vx*inherit+(cv.vx||0)*(1-inherit);cv.vy=Math.sin(a)*force+p.vy*inherit+(cv.vy||0)*(1-inherit);
     cv.throwOwner=n;cv.hitIds=[];cv.build=-Math.hypot(cv.vx,cv.vy);s.fx.push({id:uid(),type:"cover-throw",x:cv.x,y:cv.y,life:.55,owner:n,text:"WHAM"});p.gripCoverId=null;
   }}
   else if(p.gripId){const m=s.matter.find(m=>m.id===p.gripId);if(m&&spendEnergy(p,s,c.coverThrowEnergy)){m.heldBy=null;m.throwOwner=n;m.hitIds=[];m.vx=Math.cos(p.aim)*c.throwForce*(p.godTime>0?1.25:1);m.vy=Math.sin(p.aim)*c.throwForce*(p.godTime>0?1.25:1);m.life=3;p.gripId=null}}
 }
 if(i.orbit&&!prev.orbit&&p.battery>=25){const ms=s.matter.filter(m=>m.heldBy===null&&m.orbitBy===null).sort((a,b)=>dist(a,p)-dist(b,p)).slice(0,3);if(ms.length){p.battery-=25;p.orbitIds=ms.map(m=>m.id);ms.forEach(m=>m.orbitBy=n)}}
 if(i.launchOrbit&&!prev.launchOrbit&&p.orbitIds.length){p.orbitIds.forEach((id,j)=>{const m=s.matter.find(m=>m.id===id);if(m){m.orbitBy=null;m.throwOwner=n;m.hitIds=[];m.vx=Math.cos(p.aim+(j-1)*.12)*c.throwForce*1.05;m.vy=Math.sin(p.aim+(j-1)*.12)*c.throwForce*1.05;m.life=3}});p.orbitIds=[]}
}
function muzzleSocket(p:Player){
 const a=p.gunFacing??p.aim??0,dir=((Math.round(a/(Math.PI*2)*24)%24)+24)%24;
 // Pass05 major-family socket contract. Continuous aim owns shot direction;
 // sector data only describes the registered current-production barrel reach.
 const major=[34,35,36,36,35,34,33,33],sector=((Math.round(a/(Math.PI*2)*8)%8)+8)%8,forward=major[sector];
 const side=[0,-1,-2,-2,-1,0,1,2,2,1,0,-1,-2,-2,-1,0,1,2,2,1,0,-1,-2,-1][dir]||0;
 const px=Math.cos(a),py=Math.sin(a),sx=-py,sy=px;
 return{x:p.x+px*forward+sx*side,y:p.y+py*forward+sy*side,dir};
}
function coverMuzzleClearance(p:Player,cv:Cover|undefined,muzzle:{x:number;y:number},aim:number){
 if(!cv||!p.coverAnchor)return{allowed:true,clearance:undefined as string|undefined,mode:"FREE"};
 const a=p.coverAnchor,topology=Math.min(a.t,a.length-a.t)<18?"EDGE":"FACE";
 if(p.coverMode!=="braced"||!p.input.coverAim)return{allowed:false,clearance:undefined,mode:"PROTECTED"};
 // Tall FACE never clears over the top. EDGE/CORNER must point sufficiently
 // around/outside the owning face. Waist can expose over top from FACE.
 if(cv.coverClass==="tall"&&topology==="FACE")return{allowed:false,clearance:undefined,mode:"TALL_FACE"};
 const px=Math.cos(aim),py=Math.sin(aim),out=px*a.nx+py*a.ny,along=px*a.tx+py*a.ty;
 const sideClear=topology!=="FACE"&&Math.abs(along)>.18;
 const overClear=cv.coverClass!=="tall"&&out>-.35;
 const allowed=sideClear||overClear;
 return{allowed,clearance:allowed?cv.id:undefined,mode:sideClear?"SIDE":overClear?"OVER":"BLOCKED"};
}
// Swept contact in the existing rotated floor footprint. Exposed top fire clears only its own block.
// Earliest footprint entry. Null distinguishes a miss from a valid t=0 hit.
function segmentCoverTime(from:{x:number;y:number},to:{x:number;y:number},cv:Cover):number|null{
 const a=localPoint(cv,from.x,from.y),b=localPoint(cv,to.x,to.y);let enter=0,leave=1;
 for(const [start,delta,half]of [[a.x,b.x-a.x,cv.w/2],[a.y,b.y-a.y,cv.h/2]]){
  if(Math.abs(delta)<1e-8){if(Math.abs(start)>half)return null;continue}
  const u=(-half-start)/delta,v=(half-start)/delta;enter=Math.max(enter,Math.min(u,v));leave=Math.min(leave,Math.max(u,v));if(enter>leave)return null;
 }return leave>=0&&enter<=1?enter:null;
}
function segmentCover(from:{x:number;y:number},to:{x:number;y:number},cv:Cover){return segmentCoverTime(from,to,cv)!==null}
export function bodyRegions(p:Player,scale=.82){
 // World elevation follows the upright sprite, anchored at its existing feet.
 const h=78*scale*(p.slide>0?.58:p.coverId&&!(p.coverMode==="braced"&&p.input.coverAim)?.72:1);
 return [{region:"low" as HitRegion,min:0,max:h*.28,r:18},{region:"torso" as HitRegion,min:h*.28,max:h*.76,r:16},{region:"head" as HitRegion,min:h*.76,max:h,r:11}];
}
function sweptCircle(from:{x:number;y:number},to:{x:number;y:number},start:{x:number;y:number},end:{x:number;y:number},radius:number):number|null{
 const x=from.x-start.x,y=from.y-start.y,dx=to.x-from.x-(end.x-start.x),dy=to.y-from.y-(end.y-start.y),c=x*x+y*y-radius*radius;
 if(c<=0)return 0;const a=dx*dx+dy*dy;if(a<1e-12)return null;const b=2*(x*dx+y*dy),disc=b*b-4*a*c;if(disc<0)return null;const t=(-b-Math.sqrt(disc))/(2*a);return t>=0&&t<=1?t:null;
}
export function shotPlayerTime(from:{x:number;y:number},to:{x:number;y:number},z:number,p:Player,start:{x:number;y:number},scale=.82){
 const r=bodyRegions(p,scale).find(r=>z>=r.min&&z<=r.max);if(!r)return null;const shield=p.shield&&p.input.shield&&!p.coverId&&p.battery>0;
 const t=sweptCircle(from,to,start,p,shield?30:r.r);return t===null?null:{t,region:r.region};
}
// Recovered from lab-psychic-cover.js at efecc43: orbit around holder and sweep
// translation + rotated corners. Current mass response and geometry remain authoritative.
function carryCoverSwept(cv:Cover,p:Player,s:GameState,dt:number){
 const a=p.gunFacing??p.aim,ox=cv.x,oy=cv.y,oa=cv.a,radius=Math.hypot(cv.x-p.x,cv.y-p.y),angle=Math.atan2(cv.y-p.y,cv.x-p.x),safeRadius=Math.hypot(cv.w,cv.h)/2+19;
 const mass=bayObject(cv.artId||cv.id)?.mass||9,response=s.config.carryResponse*Math.sqrt(9/mass),turn=Math.min(3.2,s.config.carryTurnResponse*Math.sqrt(9/mass));
 // Clear the holder radially before turning a freshly ripped close object.
 const orbit=angle+(radius<safeRadius?0:clamp(wrap(a-angle),-turn*dt,turn*dt)),nextRadius=radius+(Math.max(p.coverGripDist,safeRadius)-radius)*(1-Math.exp(-response*dt));
 const dx=p.x+Math.cos(orbit)*nextRadius-cv.x,dy=p.y+Math.sin(orbit)*nextRadius-cv.y,len=Math.hypot(dx,dy),travel=Math.min(len,550*dt),mx=len?dx/len*travel:0,my=len?dy/len*travel:0;
 const da=radius<safeRadius?0:clamp(wrap(a+Math.PI/2-cv.a),-turn*dt,turn*dt),steps=Math.max(1,Math.ceil((travel+Math.abs(da)*Math.hypot(cv.w,cv.h)/2)/3));
 for(let k=1;k<=steps;k++){const candidate={...cv,x:ox+mx*k/steps,y:oy+my*k/steps,a:oa+da*k/steps};if(carryBlocked(candidate,cv,s)){p.gripCoverId=null;cv.build=0;cv.vx=cv.vy=0;s.fx.push({id:uid(),type:"matter-drop",x:cv.x,y:cv.y,life:.24,text:"CONTACT"});return;}cv.x=candidate.x;cv.y=candidate.y;cv.a=candidate.a;}
 cv.vx=(cv.x-ox)/Math.max(.001,dt);cv.vy=(cv.y-oy)/Math.max(.001,dt);cv.build=.001;
}
function carryBlocked(candidate:Cover,original:Cover,s:GameState){
 const ex=Math.abs(Math.cos(candidate.a))*candidate.w/2+Math.abs(Math.sin(candidate.a))*candidate.h/2,ey=Math.abs(Math.sin(candidate.a))*candidate.w/2+Math.abs(Math.cos(candidate.a))*candidate.h/2;
 if(candidate.x-ex<A.left||candidate.x+ex>A.right||candidate.y-ey<A.top||candidate.y+ey>A.bottom)return true;
 if(s.players.some(p=>p.hp>0&&circleBox(p,18,candidate).hit))return true;
 for(const b of s.covers){if(b.id===original.id||b.hp<=0)continue;let overlap=true;
  for(const angle of [candidate.a,candidate.a+Math.PI/2,b.a,b.a+Math.PI/2]){const ax=Math.cos(angle),ay=Math.sin(angle),r=(c:Cover)=>Math.abs(ax*Math.cos(c.a)+ay*Math.sin(c.a))*c.w/2+Math.abs(-ax*Math.sin(c.a)+ay*Math.cos(c.a))*c.h/2;if(Math.abs((candidate.x-b.x)*ax+(candidate.y-b.y)*ay)>=r(candidate)+r(b)){overlap=false;break}}
  if(overlap)return true;
 }return false;
}
// Brother Build 768e3c3: flying matter deals 22 to fighters, 28 to cover,
// with 360 impulse and .45 cover rebound. Sweeps/ownership make that port safe.
function matterContactSwept(m:Matter,from:{x:number;y:number},s:GameState,starts:{x:number;y:number}[]){
 const speed=Math.hypot(m.vx,m.vy);if(speed<=140)return;let nearest=Infinity,cv:Cover|undefined,target:Player|undefined,slot=-1;
 for(const c of s.covers){if(c.hp<=0||m.hitIds?.includes(c.id))continue;const t=segmentCoverTime(from,m,{...c,w:c.w+2*m.r,h:c.h+2*m.r});if(t!==null&&t<nearest){nearest=t;cv=c;}}
 if(speed>170)for(let n=0;n<s.players.length;n++){const p=s.players[n];if(n===m.throwOwner||p.hp<=0||m.hitIds?.includes("player-"+n))continue;const t=sweptCircle(from,m,starts[n],p,m.r+19);if(t!==null&&t<nearest){nearest=t;target=p;slot=n;cv=undefined;}}
 if(!Number.isFinite(nearest))return;m.x=from.x+(m.x-from.x)*nearest;m.y=from.y+(m.y-from.y)*nearest;
 if(target){(m.hitIds??=[]).push("player-"+slot);duelContact(s,m.throwOwner??-1,target,22,m.vx/speed*360,m.vy/speed*360,"low",{x:m.x,y:m.y,z:8});m.vx*=.25;m.vy*=.25;}
 else if(cv){(m.hitIds??=[]).push(cv.id);damageCover(cv,s,28);m.vx*=-.45;m.vy*=-.45;const material=m.kind;combatEvent(s,{kind:"cover",owner:m.throwOwner??-1,damage:28,x:m.x,y:m.y,z:8,material});s.fx.push({id:uid(),type:"cover-hit",x:m.x,y:m.y,z:8,life:.25,text:material});}
}
function botInput(s:GameState){const n=s.players.findIndex(p=>p.bot);if(n<0)return;const p=s.players[n],t=s.players[1-n];if(!t)return;const a=Math.atan2(t.y-p.y,t.x-p.x),d=dist(p,t);const blocked=s.covers.some(cv=>cv.hp>0&&segmentCover(p,t,cv)),side=s.mode==="practice"?(p.botRouteSide??=1):(Math.sin(s.time*.7)>=0?1:-1);if(!blocked)p.botRouteSide=undefined;
 const base={...empty(),x:blocked?-Math.sin(a)*side*.65:Math.cos(a)*(d>260?.7:d<140?-.4:0),y:blocked?Math.cos(a)*side*.65:Math.sin(a)*(d>260?.7:d<140?-.4:0),aim:a,fire:!blocked&&d<520&&s.time%1.4<.1,shield:s.mode==="practice"&&!!t.input.fire&&s.time%3<.4};
 if(s.mode!=="practice"){p.input=base;return;}
 // Recovered Brother Build command families, expressed through the current shared rules.
 if(p.gripCoverId||p.gripId){p.botGripSince??=s.time;p.input={...base,x:0,y:0,grip:true,shield:false,fire:s.time-p.botGripSince>.6};return;}
 p.botGripSince=undefined;const pulse=(rate:number,width=.035,offset=0)=>(s.time+offset)%rate<width;
 const targetCover=s.covers.find(c=>c.hp>0&&dist(c,p)<200&&((c.x-p.x)*Math.cos(a)+(c.y-p.y)*Math.sin(a))/Math.max(1,dist(c,p))>.55&&!s.players.some(q=>q.coverId===c.id||q.gripCoverId===c.id));
 const targetMatter=s.matter.find(m=>m.heldBy===null&&m.orbitBy===null&&dist(m,p)<100);
 const grab=p.battery>24&&!!(targetCover||targetMatter)&&pulse(4.7,.04,1.1),dashPhase=s.time%7.2;
 p.input={...base,grip:grab,fire:grab?false:base.fire,melee:d<60&&pulse(1.05),heavy:d<61&&pulse(7.8,.035,1.2),slide:d>300&&!blocked&&(dashPhase<.025||dashPhase>.12&&dashPhase<.145)};
}
// A fresh Y press cancels voluntary actions; only already-held buttons are
// consumed until released. New combat inputs and incoming hits still interrupt.
function chargeIntent(p:Player,s:GameState,raw:InputState,dt:number){
 const i={...raw},fresh=raw.powerup&&!p.processedInput.powerup;
 const actions=["fire","shield","coverAim","slide","melee","heavy","grip","throwMatter","cover","orbit","launchOrbit","pinball","slow"];
 if(fresh&&!p.powerBlocked&&p.knock<=0&&(!p.godTime||p.godTime>dt&&p.battery>s.config.godDrain*dt)){
  p.chargeSuppressed=actions.filter(key=>(raw as any)[key]);
  p.slide=p.dash=p.pinball=p.brake=0;p.exit=null;p.kickStage="none";p.kickTime=0;p.shield=false;p.peek=false;
  if(p.gripCoverId){const cv=s.covers.find(c=>c.id===p.gripCoverId);if(cv){cv.build=0;cv.vx=cv.vy=0}p.gripCoverId=null}
  if(p.gripId){const m=s.matter.find(m=>m.id===p.gripId);if(m)m.heldBy=null;p.gripId=null}
 }
 if(!raw.powerup)p.chargeSuppressed=[];
 else{p.chargeSuppressed=(p.chargeSuppressed||[]).filter(key=>(raw as any)[key]);for(const key of p.chargeSuppressed)(i as any)[key]=false}
 return i;
}
function step(s:GameState,dt:number,prev:InputState[]){const c=s.config,rawInputs=s.players.map(p=>p.input),playerStarts=s.players.map(p=>({x:p.x,y:p.y}));
 s.players.forEach((p,n)=>p.input=chargeIntent(p,s,rawInputs[n],dt));
 if(combatFight(s))s.players.forEach(p=>p.shield=p.input.shield&&!p.coverId&&p.battery>0);
 const slow=s.players.some(p=>p.input.slow&&p.battery>0),d=dt*(slow?.52:1);
 for(let n=0;n<s.players.length;n++){const p=s.players[n],i=p.input,wasHolding=!!(p.gripId||p.gripCoverId);p.aim=i.aim;powerStep(p,s,dt);
  const coverContext=!!p.coverId;
  // PASS07: soft cover stays mobile/athletic. A commits hard brace; LT only plants an existing hard brace.
  const moveAngle=Math.hypot(p.vx,p.vy)>35?Math.atan2(p.vy,p.vx):p.gunFacing;
  if(p.charging&&!p.coverId){if(Math.hypot(i.x,i.y)>.18)p.gunFacing=Math.atan2(i.y,i.x)}
  else if(p.coverId&&p.coverMode==="braced"&&i.coverAim)p.gunFacing=i.aim;
  else{const maxTwist=145*Math.PI/180,deltaAim=Math.atan2(Math.sin(i.aim-moveAngle),Math.cos(i.aim-moveAngle));p.gunFacing=moveAngle+clamp(deltaAim,-maxTwist/2,maxTwist/2)}
  p.fireState=Math.max(0,p.fireState-dt);p.recoil=Math.max(0,p.recoil-dt);p.returnToCover=Math.max(0,p.returnToCover-dt);p.boostState=Math.max(0,p.boostState-dt);p.brakeState=Math.max(0,p.brakeState-dt);
  const beforeEnergy=p.battery;edgeActions(s,n,prev[n]||empty());if(p.battery<beforeEnergy)p.lastEnergyAt=s.time;p.shield=i.shield&&!coverContext&&!p.coverId&&p.battery>0;if(p.shield)p.battery=Math.max(0,p.battery-18*dt);if(i.slow&&p.battery>0)p.battery=Math.max(0,p.battery-28*dt);if(p.gripId||p.gripCoverId)p.battery=Math.max(0,p.battery-c.holdEnergy*dt);if(p.shield||i.slow||p.gripId||p.gripCoverId)p.lastEnergyAt=s.time;else if(!p.charging&&!p.godTime&&s.time-(p.lastEnergyAt??-9)>=c.rechargeDelay&&!p.slide&&!p.dash&&!p.kickStage?.match(/burst|step/))p.battery=Math.min(100,p.battery+c.rechargeRate*dt);
  if(p.coverMode==="braced"&&prev[n]?.coverAim&&!i.coverAim)p.returnToCover=Math.max(p.returnToCover,.16);
  if(p.battery<=0){if(p.gripId){const held=s.matter.find(m=>m.id===p.gripId);if(held)held.heldBy=null;p.gripId=null}if(p.gripCoverId){const cv=s.covers.find(cv=>cv.id===p.gripCoverId);if(cv){cv.build=0;cv.vx=cv.vy=0}}p.gripCoverId=null}
  p.brake=Math.max(0,p.brake-dt);p.slideCool=Math.max(0,p.slideCool-dt);
  if(p.kickStage!=="none"){
    p.kickTime-=dt;
    if(p.kickTime<=0&&p.kickStage==="burst"){p.kickStage="step";p.kickTime=.09;p.vx=(Math.cos(p.kickAngle)*c.moveSpeed+p.kickNx*81)*(p.kickScale??1);p.vy=(Math.sin(p.kickAngle)*c.moveSpeed+p.kickNy*81)*(p.kickScale??1)}
    else if(p.kickTime<=0&&p.kickStage==="step"){p.kickStage="none";p.slide=c.slideDuration;p.vx=Math.cos(p.kickAngle)*c.slideSpeed*(p.kickScale??1);p.vy=Math.sin(p.kickAngle)*c.slideSpeed*(p.kickScale??1);p.slideFacing=p.kickAngle}
    p.x=clamp(p.x+p.vx*d,A.left,A.right);p.y=clamp(p.y+p.vy*d,A.top,A.bottom);collide(p,s)
  }
  else if(p.knock>0){p.knock-=dt;p.vx*=Math.pow(.08,dt);p.vy*=Math.pow(.08,dt);if(combatFight(s)&&!p.coverId){p.x=clamp(p.x+p.vx*d,A.left,A.right);p.y=clamp(p.y+p.vy*d,A.top,A.bottom);collide(p,s);}}
  else if(p.exit){stepCoverExit(p,s,d)}
  // A edges are handled exactly once by slideAction; LT planting remains in moveOnCover.
  else if(p.coverId){moveOnCover(p,s,i,d)}
  else if(combatFight(s)&&p.shield&&p.slide<=0&&p.dash<=0){p.vx=p.vy=0;}
  else if(p.dash>0){
    const dashBefore=p.dash,phase=1-clamp(dashBefore/Math.max(.001,c.dashDuration),0,1);
    p.dash=Math.max(0,p.dash-dt);
    // KINETIC WEAVE LOCK 10: Advanced-Warfare-class response shape.
    // First ~58% holds the committed vector; final segment releases weight smoothly.
    if(phase>=.58){const release=(phase-.58)/.42,damp=.055-.03*clamp(release,0,1);p.vx*=Math.pow(damp,dt);p.vy*=Math.pow(damp,dt)}
    p.x=clamp(p.x+p.vx*d,A.left,A.right);p.y=clamp(p.y+p.vy*d,A.top,A.bottom);slideCapture(p,s);collide(p,s);
  }
  else if(p.slide>0||p.pinball>0){
    p.slide=Math.max(0,p.slide-dt);p.pinball=Math.max(0,p.pinball-dt);
    if(p.slide>0){
      const speed=Math.hypot(p.vx,p.vy)||1,travel=Math.atan2(p.vy,p.vx),mag=Math.hypot(i.x,i.y);
      // Base Jade Kinetic Brake: promote the previously playtested weave brake into Classic
      // without enabling weave steering, mini-boost, or changing top/slide speed.
      if(mag>.12){
        const inputA=Math.atan2(i.y,i.x),delta=Math.atan2(Math.sin(inputA-travel),Math.cos(inputA-travel)),forward=Math.cos(delta);
        if(forward<-.15){
          const brake=Math.max(0,1-c.slideBrake*d);p.vx*=brake;p.vy*=brake;
          if(Math.hypot(p.vx,p.vy)<c.slideCancelSpeed){
            p.slide=0;p.slideSteerCurrent=0;p.brake=.18;p.brakeState=.24;
            const residual=.22,redirect=Math.max(0,Math.min(1,mag))*c.moveSpeed*.38;
            p.vx=p.vx*residual+i.x*redirect;p.vy=p.vy*residual+i.y*redirect;
            const oldAngle=travel,newAngle=Math.atan2(i.y,i.x),redirectAngle=Math.abs(wrap(newAngle-oldAngle)),hard=redirectAngle>Math.PI*.42&&speed>c.slideSpeed*.62;
            s.fx.push({id:uid(),type:"brake",x:p.x,y:p.y,life:.42,owner:n,text:hard?"SKRRK!":"",entrySpeed:speed,oldAngle,newAngle,redirectAngle,hard} as any);
          }
        }else if(c.weaveEnabled>=.5){
          const targetSteer=clamp(delta,-c.slideSteerAngle,c.slideSteerAngle)*c.slideSteer,steerBlend=1-Math.exp(-c.slideSteerResponse*d);
          p.slideSteerCurrent+=(targetSteer-p.slideSteerCurrent)*steerBlend;const next=travel+p.slideSteerCurrent*d,boost=Math.max(0,forward)*c.slideSustain*d,newSpeed=Math.min(c.slideSpeed*1.08,speed+boost);
          p.vx=Math.cos(next)*newSpeed;p.vy=Math.sin(next)*newSpeed;p.slideFacing=next;
        }else{p.vx*=Math.pow(c.slideDrag,d);p.vy*=Math.pow(c.slideDrag,d)}
      }else{p.vx*=Math.pow(c.weaveEnabled>=.5?.12:c.slideDrag,d);p.vy*=Math.pow(c.weaveEnabled>=.5?.12:c.slideDrag,d)}
    }else{p.vx*=Math.pow(.72,d);p.vy*=Math.pow(.72,d)}
    p.x=clamp(p.x+p.vx*d,A.left,A.right);p.y=clamp(p.y+p.vy*d,A.top,A.bottom);slideCapture(p,s);collide(p,s)
  }
  else{const chargeMove=p.chargeMotion??1,r=1-Math.exp(-c.response*d),m=Math.hypot(i.x,i.y);p.vx+=(i.x*c.moveSpeed*chargeMove-p.vx)*r;p.vy+=(i.y*c.moveSpeed*chargeMove-p.vy)*r;if(m<.05){p.vx*=Math.pow(c.stopDrag,d);p.vy*=Math.pow(c.stopDrag,d)}p.x=clamp(p.x+p.vx*d,A.left,A.right);p.y=clamp(p.y+p.vy*d,A.top,A.bottom);collide(p,s)}
  const holding=!!(p.gripId||p.gripCoverId);if(holding&&!wasHolding){p.psychicStartedAt=s.time;p.psychicReturnUntil=0}else if(!holding&&wasHolding)p.psychicReturnUntil=s.time+.16;
  if(i.fire&&!p.charging&&p.powerReturn<=0&&!p.fireBlocked&&!p.gripId&&!p.gripCoverId&&s.time-p.lastShot>=c.shotCadence*(p.godTime>0?.7:1)&&(!p.coverId||p.coverMode==="soft"||i.coverAim)){
   const attachedCover=p.coverId?s.covers.find(cv=>cv.id===p.coverId):undefined;
   const muzzle=muzzleSocket(p),physical=coverMuzzleClearance(p,attachedCover,muzzle,p.gunFacing);
   // PASS06 TRIGGER AUTHORITY: cover never vetoes a ready trigger. If exposure
   // is invalid, the attached cover remains collidable and consumes the blast.
   const clearance=physical.allowed?physical.clearance:undefined;
   const exposedD03=!!clearance&&muzzle.dir===3,artUnit=(125*143/250/638)*c.spriteScale;
   const neighbor=!!clearance?(muzzle.dir===2?{anchor:[1202,525.1677115987461],muzzle:[1424,97]}:muzzle.dir===4?{anchor:[1189,993.1677115987461],muzzle:[1420,624]}:null):null,neighborUnit=125*143/250/445*c.spriteScale;
   if(exposedD03)muzzle.x=p.x+(1688-1363)*artUnit;
   if(neighbor)muzzle.x=p.x+(neighbor.muzzle[0]-neighbor.anchor[0])*neighborUnit;
   const renderOffsetX=0,shotHeight=neighbor?(muzzle.y-p.y)+(neighbor.anchor[1]-neighbor.muzzle[1])*neighborUnit:exposedD03?(muzzle.y-p.y)+(814-250)*artUnit:clearance?Math.max(44*c.spriteScale,15616/332+4):44*c.spriteScale;
   p.lastShot=s.time;p.fireState=.11;p.recoil=.12;p.weaponState="FIRE";
   // Foundation only: counters are explicit/configurable, but EMPTY/RELOAD gating is deferred
   // until the duel-balance pass so this playtest measures trigger/cadence without a reload interruption.
   if(typeof p.shells==="number")p.shells=Math.max(0,p.shells-1);
   if(p.coverId)p.returnToCover=.28;
   for(let j=-3;j<=3;j++){const a=p.gunFacing+j*c.shotSpread;s.shots.push({id:uid(),owner:n,x:muzzle.x,y:muzzle.y,vx:Math.cos(a)*c.shotSpeed,vy:Math.sin(a)*c.shotSpeed,life:.5,damage:c.shotDamage*(p.godTime>0?c.godDamage:1),z:shotHeight,renderOffsetX,clearanceCoverId:clearance})}
   s.fx.push({id:uid(),type:"muzzle",x:muzzle.x,y:muzzle.y,life:.18,owner:n,z:shotHeight,renderOffsetX,text:"BOOM",angle:p.gunFacing});
  }
 }
 for(let n=0;n<s.players.length;n++){
   const p=s.players[n];if(!p.gripCoverId)continue;const cv=s.covers.find(c=>c.id===p.gripCoverId);if(!cv){p.gripCoverId=null;continue}
   if(combatFight(s)){carryCoverSwept(cv,p,s,d);continue;}
   const a=p.gunFacing??p.aim,ox=cv.x,oy=cv.y,blend=Math.min(1,d*c.carryResponse);
   cv.a+=wrap(a+Math.PI/2-cv.a)*Math.min(1,d*c.carryTurnResponse);cv.x+=(p.x+Math.cos(a)*p.coverGripDist-cv.x)*blend;cv.y+=(p.y+Math.sin(a)*p.coverGripDist-cv.y)*blend;
   settleCover(cv,s);cv.vx=(cv.x-ox)/Math.max(.001,d);cv.vy=(cv.y-oy)/Math.max(.001,d);cv.build=.001;
 }
 for(const cv of s.covers){
   if(cv.build>=0||cv.hp<=0)continue;
   cv.vx??=Math.cos(cv.a-Math.PI/2)*-cv.build;cv.vy??=Math.sin(cv.a-Math.PI/2)*-cv.build;
   const parts=Math.max(1,Math.ceil(Math.hypot(cv.vx,cv.vy)*d/8));
   for(let k=0;k<parts;k++){cv.x+=cv.vx*d/parts;cv.y+=cv.vy*d/parts;settleCover(cv,s);if(combatFight(s)&&cv.hp>0&&Math.hypot(cv.vx||0,cv.vy||0)>160)for(let n=0;n<s.players.length;n++){
    if(n===cv.throwOwner||cv.hitIds?.includes("player-"+n))continue;const target=s.players[n],q=localPoint(cv,target.x,target.y);
    if(Math.hypot(q.x-clamp(q.x,-cv.w/2,cv.w/2),q.y-clamp(q.y,-cv.h/2,cv.h/2))<=17){(cv.hitIds??=[]).push("player-"+n);const damage=Math.min(100,Math.hypot(cv.vx||0,cv.vy||0)*(bayObject(cv.artId||cv.id)?.mass||9)/90);duelContact(s,cv.throwOwner??1-n,target,damage,(cv.vx||0)*.08,(cv.vy||0)*.08);damageCover(cv,s,damage);cv.vx*=.35;cv.vy*=.35;}
   }}
   if(combatFight(s)&&Math.hypot(cv.vx,cv.vy)>80&&s.time-(cv.scarAt??-9)>.09){cv.scarAt=s.time;const scars=s.fx.filter(f=>f.type==="cover-scrape");if(scars.length<24)s.fx.push({id:uid(),type:"cover-scrape",x:cv.x,y:cv.y,life:1.8,angle:Math.atan2(cv.vy,cv.vx),text:bayObject(cv.artId||cv.id)?.material==="CONCRETE"?"stone":"metal"});}
   cv.vx*=Math.pow(.09,d);cv.vy*=Math.pow(.09,d);cv.build=-Math.hypot(cv.vx,cv.vy);
   if(-cv.build<35){cv.build=0;cv.vx=cv.vy=0}
 }
 for(const m of s.matter){
  if(m.heldBy!==null){const p=s.players[m.heldBy];m.x=p.x+Math.cos(p.aim)*70;m.y=p.y+Math.sin(p.aim)*70;continue}
  if(m.orbitBy!==null){const p=s.players[m.orbitBy],j=p.orbitIds.indexOf(m.id),a=s.time*4+j*2.1;m.x=p.x+Math.cos(a)*62;m.y=p.y+Math.sin(a)*62;continue}
  const from={x:m.x,y:m.y};m.x+=m.vx*d;m.y+=m.vy*d;
  if(combatFight(s))matterContactSwept(m,from,s,playerStarts);
  m.vx*=Math.pow(.35,d);m.vy*=Math.pow(.35,d);if(m.life<999)m.life-=dt;
  if(m.x<A.left||m.x>A.right){m.x=clamp(m.x,A.left,A.right);m.vx*=-.6}if(m.y<A.top||m.y>A.bottom){m.y=clamp(m.y,A.top,A.bottom);m.vy*=-.6}
 }
 for(const sh of s.shots){
  if(sh.life<=0)continue;const from={x:sh.x,y:sh.y};sh.x+=sh.vx*d;sh.y+=sh.vy*d;sh.life-=dt;
  if(!combatFight(s)){
   const block=s.covers.find(cv=>cv.hp>0&&cv.id!==sh.clearanceCoverId&&segmentCover(from,sh,cv));if(block){sh.life=0;s.fx.push({id:uid(),type:"cover-block",x:sh.x,y:sh.y,life:.18});continue}
   const target=s.players[1-sh.owner];if(target&&dist(sh,target)<21){if(target.coverId&&target.coverMode==="braced"&&!target.input.coverAim){sh.life=0;s.fx.push({id:uid(),type:"cover-block",x:target.x,y:target.y,life:.18});continue}target.hp=Math.max(0,target.hp-(sh.damage??c.shotDamage));target.knock=.26;target.vx+=sh.vx*.1;target.vy+=sh.vy*.1;sh.life=0;s.fx.push({id:uid(),type:"hit",x:target.x,y:target.y,life:.25})}continue;
  }
  const z=sh.z??36*c.spriteScale,target=s.players[1-sh.owner];let nearest=Infinity,block:Cover|undefined;
  for(const cv of s.covers){if(cv.hp<=0||cv.id===sh.clearanceCoverId)continue;const height=bayObject(cv.artId||cv.id)?.dimensions.z??(cv.coverClass==="tall"?78:15616/332);if(z>height)continue;const t=segmentCoverTime(from,sh,cv);if(t!==null&&t<nearest){nearest=t;block=cv}}
  const hit=target&&target.hp>0?shotPlayerTime(from,sh,z,target,playerStarts[1-sh.owner],c.spriteScale):null;
  if(hit&&hit.t<nearest){const point={x:from.x+(sh.x-from.x)*hit.t,y:from.y+(sh.y-from.y)*hit.t,z};duelContact(s,sh.owner,target,(sh.damage??c.shotDamage)*REGION_DAMAGE[hit.region],sh.vx*.1,sh.vy*.1,hit.region,point);sh.life=0;}
  else if(block){const point={x:from.x+(sh.x-from.x)*nearest,y:from.y+(sh.y-from.y)*nearest,z},material=bayObject(block.artId||block.id)?.material==="CONCRETE"?"stone":"metal";damageCover(block,s,sh.damage??c.shotDamage);combatEvent(s,{kind:"cover",owner:sh.owner,damage:sh.damage??c.shotDamage,material,...point});sh.life=0;s.fx.push({id:uid(),type:"cover-hit",life:.25,owner:sh.owner,text:material,...point});}
 }
 if(combatFight(s)&&s.phase==="playing"&&s.players.some(p=>p.hp<=0)){
  const alive=s.players.map((p,n)=>p.hp>0?n:-1).filter(n=>n>=0);s.winner=alive.length===1?alive[0]:null;
  if(s.winner!==null)s.players[s.winner].score++;s.phase="finisher";s.finisher=FINISHER_SECONDS;s.timeScale=1;s.shots=[];
  const dead=s.players.find(p=>p.hp<=0)!;combatEvent(s,{kind:"finish",owner:s.winner??-1,damage:0,x:dead.x,y:dead.y,z:30});
  for(const p of s.players){p.input=empty();p.processedInput=empty();p.shield=false;if(p.gripCoverId){const cv=s.covers.find(c=>c.id===p.gripCoverId);if(cv){cv.build=0;cv.vx=cv.vy=0}}p.gripCoverId=null;p.gripId=null;p.orbitIds=[];}
  for(const m of s.matter){m.heldBy=null;m.orbitBy=null;}
 }
 s.covers=s.covers.filter(cv=>cv.hp>0);
 s.players.forEach((p,n)=>p.input=rawInputs[n]);
 s.shots=s.shots.filter(x=>x.life>0);s.matter=s.matter.filter(x=>x.life>0);s.fx.forEach(f=>f.life-=dt);s.fx=s.fx.filter(f=>f.life>0);
}
function aftermath(s:GameState,elapsed:number){
 while(elapsed>1e-9&&s.finisher>0){const dt=Math.min(1/60,elapsed,s.finisher),age=FINISHER_SECONDS-s.finisher,t=clamp(age/.35,0,1);s.timeScale=1-.08*(t*t*(3-2*t));const d=dt*s.timeScale;s.time+=d;s.finisher=Math.max(0,s.finisher-dt);
  for(const p of s.players){p.x=clamp(p.x+p.vx*d,A.left,A.right);p.y=clamp(p.y+p.vy*d,A.top,A.bottom);p.vx*=Math.pow(.08,d);p.vy*=Math.pow(.08,d);p.knock=Math.max(0,p.knock-d);p.recoil=Math.max(0,p.recoil-d);collide(p,s);}
  for(const cv of s.covers){if(cv.build>=0)continue;cv.x=clamp(cv.x+(cv.vx||0)*d,A.left+cv.w/2,A.right-cv.w/2);cv.y=clamp(cv.y+(cv.vy||0)*d,A.top+cv.h/2,A.bottom-cv.h/2);cv.vx=(cv.vx||0)*Math.pow(.09,d);cv.vy=(cv.vy||0)*Math.pow(.09,d);cv.build=-Math.hypot(cv.vx,cv.vy);}
  for(const m of s.matter){m.x=clamp(m.x+m.vx*d,A.left,A.right);m.y=clamp(m.y+m.vy*d,A.top,A.bottom);m.vx*=Math.pow(.35,d);m.vy*=Math.pow(.35,d);if(m.life<999)m.life-=d;}
  s.matter=s.matter.filter(m=>m.life>0);s.fx.forEach(f=>f.life-=d);s.fx=s.fx.filter(f=>f.life>0);elapsed-=dt;
 }if(s.finisher<=1e-9){s.finisher=0;s.phase="finished";s.timeScale=.92;for(const p of s.players)p.vx=p.vy=0;}
}
export function advance(s:GameState,now=Date.now()){
 let elapsed=clamp((now-s.lastAt)/1000,0,.25);s.lastAt=now;
 if(s.phase==="countdown"){s.countdown=Math.max(0,s.countdown-elapsed);s.players.forEach(p=>p.processedInput={...p.input});if(!s.countdown){s.phase="playing";s.fightUntil=s.time+.65;}return;}
 if(s.phase==="finisher"){aftermath(s,elapsed);return;}
 if(s.phase!=="playing"||(s.mode!=="solo"&&s.players.length<2))return;
 let prev=s.players.map(p=>({...p.processedInput}));while(elapsed>1e-9){const dt=Math.min(1/60,elapsed);s.time+=dt;botInput(s);step(s,dt,prev);s.players.forEach(p=>p.processedInput={...p.input});prev=s.players.map(p=>({...p.input}));elapsed-=dt;if(s.phase!=="playing"){if(s.phase==="finisher")aftermath(s,elapsed);break;}}
}
export function startOrRematch(s:GameState,slot:number){if(s.mode==="solo"){respawn(s);return}if(slot===0){respawn(s)}}
export function safeState(s:GameState){return{...s,players:s.players.map(({token,...p})=>p)}}




