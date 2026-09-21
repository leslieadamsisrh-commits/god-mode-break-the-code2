export type InputState = {
  x: number; y: number; aim: number; fire: boolean; shield: boolean;
  slide: boolean; melee: boolean; heavy: boolean; grip: boolean; throwMatter: boolean;
  cover: boolean; orbit: boolean; launchOrbit: boolean; pinball: boolean; slow: boolean;
};

export type Player = {
  x:number;y:number;vx:number;vy:number;aim:number;hp:number;battery:number;
  slide:number;slideFacing:number;coverId:string|null;shield:boolean;gripId:string|null;gripCoverId:string|null;
  orbitIds:string[];knock:number;pinball:number;lastShot:number;lastMelee:number;
  score:number;rematch:boolean;input:InputState;processedInput:InputState;lastSeq:number;name:string;token:string;bot:boolean;
};
export type Cover={id:string;x:number;y:number;w:number;h:number;hp:number;maxHp:number;generated:boolean;art:number;build:number};
export type Matter={id:string;x:number;y:number;vx:number;vy:number;r:number;kind:"metal"|"stone";heldBy:number|null;orbitBy:number|null;life:number};
export type Shot={id:string;owner:number;x:number;y:number;vx:number;vy:number;life:number};
export type Fx={id:string;type:string;x:number;y:number;life:number;owner?:number};
export type GameState={
  build:string;mode:"bot"|"solo";phase:"lobby"|"playing"|"finished";round:number;winner:number|null;
  createdAt:number;lastAt:number;time:number;players:Player[];covers:Cover[];matter:Matter[];shots:Shot[];fx:Fx[];
};

const emptyInput=():InputState=>({x:0,y:0,aim:0,fire:false,shield:false,slide:false,melee:false,heavy:false,grip:false,throwMatter:false,cover:false,orbit:false,launchOrbit:false,pinball:false,slow:false});
const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
const wrap=(a:number)=>Math.atan2(Math.sin(a),Math.cos(a));
const distance=(a:{x:number;y:number},b:{x:number;y:number})=>Math.hypot(a.x-b.x,a.y-b.y);
const uid=()=>crypto.randomUUID().slice(0,8);

function player(x:number,y:number,aim:number,name:string,token:string,bot=false):Player{
  return{x,y,vx:0,vy:0,aim,hp:100,battery:100,slide:0,slideFacing:aim,coverId:null,shield:false,gripId:null,gripCoverId:null,orbitIds:[],knock:0,pinball:0,lastShot:-9,lastMelee:-9,score:0,rematch:false,input:emptyInput(),processedInput:emptyInput(),lastSeq:-1,name,token,bot};
}

export function newGame(hostName:string,hostToken:string,now=Date.now(),mode:"bot"|"solo"="bot"):GameState{
  const covers:Cover[]=[
    {id:"north",x:330,y:160,w:190,h:34,hp:160,maxHp:160,generated:false,art:6,build:0},
    {id:"south",x:500,y:430,w:190,h:34,hp:160,maxHp:160,generated:false,art:0,build:0},
    {id:"west",x:170,y:330,w:130,h:34,hp:130,maxHp:130,generated:false,art:2,build:0},
    {id:"east",x:700,y:265,w:130,h:34,hp:130,maxHp:130,generated:false,art:1,build:0},
  ];
  const matter:Matter[]=[];
  [[120,120,"metal"],[850,110,"stone"],[100,510,"stone"],[880,500,"metal"],[490,105,"stone"],[510,540,"metal"]].forEach(([x,y,kind],i)=>matter.push({id:"m"+i,x:x as number,y:y as number,vx:0,vy:0,r:14,kind:kind as "metal"|"stone",heldBy:null,orbitBy:null,life:999}));
  const players=[player(180,310,0,hostName,hostToken)];
  if(mode==="bot")players.push(player(820,310,Math.PI,"RIFT HUNTER","",true));
  return{build:"BROTHER-BUILD-R3-ARENA-DEPTH",mode,phase:"playing",round:1,winner:null,createdAt:now,lastAt:now,time:0,players,covers,matter,shots:[],fx:[]};
}

export function joinGame(s:GameState,name:string,token:string){
  if(s.mode==="solo")throw new Error("Solo Sandbox is not joinable");
  const botSlot=s.players.findIndex(p=>p.bot);
  if(botSlot>=0){
    const old=s.players[botSlot];
    s.players[botSlot]={...old,name,token,bot:false,lastSeq:-1,rematch:false,input:emptyInput(),processedInput:emptyInput()};
    s.players.forEach(p=>p.rematch=false);
    s.fx.push({id:uid(),type:"join",x:old.x,y:old.y,life:1,owner:botSlot});
    if(s.phase==="finished"){s.players.forEach(p=>p.score=0);respawn(s);}
    return;
  }
  if(s.players.length!==1)throw new Error("Room is full");
  s.players.push(player(820,310,Math.PI,name,token));
}

function respawn(s:GameState){
  const scores=s.players.map(p=>p.score),ident=s.players.map(p=>({name:p.name,token:p.token,bot:p.bot}));
  const fresh=newGame(ident[0].name,ident[0].token,s.lastAt,s.mode||"bot");
  fresh.players[1]=player(820,310,Math.PI,ident[1].name,ident[1].token,ident[1].bot);
  fresh.players.forEach((p,i)=>p.score=scores[i]);fresh.phase="playing";fresh.round=s.round+1;fresh.createdAt=s.createdAt;
  Object.assign(s,fresh);
}

export function setInput(s:GameState,slot:number,seq:number,input:Partial<InputState>){
  const p=s.players[slot];if(!p||!Number.isSafeInteger(seq)||seq<=p.lastSeq)return;
  p.lastSeq=seq;const x=clamp(Number(input.x)||0,-1,1),y=clamp(Number(input.y)||0,-1,1),m=Math.hypot(x,y)||1;
  p.input={...emptyInput(),...input,x:m>1?x/m:x,y:m>1?y/m:y,aim:Number.isFinite(input.aim)?wrap(input.aim as number):p.aim};
}

function circleBox(p:{x:number;y:number},r:number,c:Cover){
  const nx=clamp(p.x,c.x,c.x+c.w),ny=clamp(p.y,c.y,c.y+c.h),dx=p.x-nx,dy=p.y-ny,d=Math.hypot(dx,dy);
  return{hit:d<r,nx:d?dx/d:(p.x<c.x+c.w/2?-1:1),ny:d?dy/d:0,depth:r-d};
}
function collidePlayer(p:Player,s:GameState){
  for(const c of s.covers){if(c.hp<=0||p.gripCoverId===c.id)continue;const q=circleBox(p,19,c);if(!q.hit)continue;p.x+=q.nx*(q.depth+1);p.y+=q.ny*(q.depth+1);const dot=p.vx*q.nx+p.vy*q.ny;if(dot<0){p.vx-=dot*q.nx;p.vy-=dot*q.ny;}if(p.slide>0){p.coverId=c.id;p.slide=0;p.vx=p.vy=0;s.fx.push({id:uid(),type:"cover-slam",x:p.x,y:p.y,life:.25});}}
}
function damage(s:GameState,target:number,amount:number,kx:number,ky:number,type:string){
  const p=s.players[target];if(!p||p.hp<=0)return;if(p.shield){p.battery=Math.max(0,p.battery-amount*.5);s.fx.push({id:uid(),type:"shield-hit",x:p.x,y:p.y,life:.2,owner:target});return;}
  p.hp=Math.max(0,p.hp-amount);p.knock=Math.max(p.knock,amount>=24?.65:.28);p.vx+=kx;p.vy+=ky;s.fx.push({id:uid(),type,x:p.x,y:p.y,life:.3,owner:target});
}
function damageCover(s:GameState,c:Cover,amount:number){c.hp=Math.max(0,c.hp-amount);s.fx.push({id:uid(),type:c.hp?"crack":"break",x:c.x+c.w/2,y:c.y+c.h/2,life:.4});if(!c.hp){for(let i=0;i<3;i++)s.matter.push({id:uid(),x:c.x+c.w*(.25+i*.25),y:c.y+c.h/2,vx:(i-1)*75,vy:(i%2?1:-1)*60,r:11,kind:i===1?"metal":"stone",heldBy:null,orbitBy:null,life:999});}}

function actionEdges(s:GameState,slot:number,prev:InputState){
  const p=s.players[slot],i=p.input,enemy=1-slot;
  if(i.slide&&!prev.slide&&p.slide<=0&&!p.coverId&&p.knock<=0){p.slide=.70;p.slideFacing=Math.atan2(i.y,i.x);p.vx=Math.cos(p.slideFacing)*650;p.vy=Math.sin(p.slideFacing)*650;s.fx.push({id:uid(),type:"speed",x:p.x,y:p.y,life:.35,owner:slot});}
  if(i.pinball&&!prev.pinball&&p.battery>=22){p.battery-=22;p.pinball=.5;p.vx=Math.cos(p.aim)*830;p.vy=Math.sin(p.aim)*830;s.fx.push({id:uid(),type:"pinball",x:p.x,y:p.y,life:.5,owner:slot});}
  const melee=i.heavy?34:18,range=i.heavy?72:58,cool=i.heavy?.85:.38;
  if((i.melee&&!prev.melee||i.heavy&&!prev.heavy)&&s.time-p.lastMelee>cool){p.lastMelee=s.time;const q=s.players[enemy];if(q&&distance(p,q)<range){const a=Math.atan2(q.y-p.y,q.x-p.x);damage(s,enemy,melee,Math.cos(a)*(i.heavy?520:280),Math.sin(a)*(i.heavy?520:280),i.heavy?"heavy":"melee");}s.fx.push({id:uid(),type:i.heavy?"heavy-swing":"melee-swing",x:p.x+Math.cos(p.aim)*35,y:p.y+Math.sin(p.aim)*35,life:.2,owner:slot});}
  if(i.cover&&!prev.cover&&p.battery>=30){p.battery-=30;const x=clamp(p.x+Math.cos(p.aim)*105,40,810),y=clamp(p.y+Math.sin(p.aim)*105,40,535);s.covers.push({id:uid(),x,y,w:150,h:38,hp:110,maxHp:110,generated:true,art:4,build:1});s.fx.push({id:uid(),type:"materialize",x:x+75,y:y+19,life:.8,owner:slot});}
  if(i.grip&&!prev.grip){
    if(p.gripId||p.gripCoverId){const m=s.matter.find(m=>m.id===p.gripId);if(m)m.heldBy=null;p.gripId=null;p.gripCoverId=null;}
    else{
      const m=s.matter.filter(m=>m.heldBy===null&&m.orbitBy===null).sort((a,b)=>distance(a,p)-distance(b,p))[0];
      const c=s.covers.filter(c=>c.generated&&c.hp>0).sort((a,b)=>distance({x:a.x+a.w/2,y:a.y+a.h/2},p)-distance({x:b.x+b.w/2,y:b.y+b.h/2},p))[0];
      const md=m?distance(m,p):Infinity,cd=c?distance({x:c.x+c.w/2,y:c.y+c.h/2},p):Infinity;
      if(Math.min(md,cd)<240&&p.battery>=5){if(cd<md&&c){p.gripCoverId=c.id;p.coverId=null;s.fx.push({id:uid(),type:"grip-cover",x:c.x+c.w/2,y:c.y+c.h/2,life:.3,owner:slot});}else if(m){p.gripId=m.id;m.heldBy=slot;}}
    }
  }
  if(i.throwMatter&&!prev.throwMatter&&p.gripId){const m=s.matter.find(m=>m.id===p.gripId);if(m){m.heldBy=null;m.vx=Math.cos(p.aim)*720;m.vy=Math.sin(p.aim)*720;m.life=2;p.gripId=null;s.fx.push({id:uid(),type:"throw",x:p.x,y:p.y,life:.25,owner:slot});}}
  if(i.orbit&&!prev.orbit&&p.battery>=25){const candidates=s.matter.filter(m=>m.heldBy===null&&m.orbitBy===null).sort((a,b)=>distance(a,p)-distance(b,p)).slice(0,3);if(candidates.length){p.battery-=25;p.orbitIds=candidates.map(m=>m.id);candidates.forEach(m=>m.orbitBy=slot);}}
  if(i.launchOrbit&&!prev.launchOrbit&&p.orbitIds.length){p.orbitIds.forEach((id,n)=>{const m=s.matter.find(m=>m.id===id);if(m){m.orbitBy=null;m.vx=Math.cos(p.aim+(n-1)*.12)*760;m.vy=Math.sin(p.aim+(n-1)*.12)*760;m.life=2;}});p.orbitIds=[];}
}

function botInput(s:GameState){
  const slot=s.players.findIndex(p=>p.bot);if(slot<0||s.phase!=="playing")return;
  const p=s.players[slot],target=s.players.find((q,i)=>i!==slot&&!q.bot);if(!target||p.hp<=0)return;
  const dx=target.x-p.x,dy=target.y-p.y,dist=Math.hypot(dx,dy)||1,a=Math.atan2(dy,dx),t=s.time;
  const advance=dist>245?1:dist<105?-.72:0,strafe=Math.sin(t*.78)>0?.72:-.72;
  let x=Math.cos(a)*advance+Math.cos(a+Math.PI/2)*strafe,y=Math.sin(a)*advance+Math.sin(a+Math.PI/2)*strafe;
  const mag=Math.hypot(x,y)||1;if(mag>1){x/=mag;y/=mag;}
  const pulse=(rate:number,width=.09,phase=0)=>((t+phase)%rate)<width;
  p.input={...emptyInput(),x,y,aim:a,fire:dist<610&&!p.shield&&((t+.2)%1.1)<.2,shield:p.battery>30&&((t+1.1)%8.2)>7.25,
    slide:dist>260&&pulse(5.4),melee:dist<64&&pulse(.62),heavy:dist<78&&pulse(4.3,.1,1.2),
    grip:!p.gripId&&pulse(8.7,.1,2),throwMatter:!!p.gripId&&pulse(2.8,.1,.7),cover:p.battery>55&&pulse(13.4,.1,4),
    orbit:!p.orbitIds.length&&p.battery>45&&pulse(11.2,.1,3),launchOrbit:!!p.orbitIds.length&&pulse(4.1,.1,1.5),
    pinball:dist>390&&p.battery>35&&pulse(9.3,.1,5),slow:p.battery>55&&((t+2.4)%14)>12.8};
}

function step(s:GameState,dt:number,previous:InputState[]){
  const slowActive=s.players.some(p=>p.input.slow&&p.battery>0),scale=slowActive?.52:1,d=dt*scale;
  for(let slot=0;slot<s.players.length;slot++){
    const p=s.players[slot],i=p.input;p.aim=i.aim;actionEdges(s,slot,previous[slot]||emptyInput());
    p.shield=!!i.shield&&p.battery>0&&p.knock<=0;if(p.shield)p.battery=Math.max(0,p.battery-18*dt);if(i.slow&&p.battery>0)p.battery=Math.max(0,p.battery-28*dt);
    if(p.gripId||p.gripCoverId)p.battery=Math.max(0,p.battery-(p.gripCoverId?10:6)*dt);if(!p.shield&&!i.slow&&!p.gripId&&!p.gripCoverId)p.battery=Math.min(100,p.battery+9*dt);
    if(p.battery<=0&&p.gripCoverId)p.gripCoverId=null;
    if(p.hp<=0)continue;if(p.knock>0){p.knock-=dt;p.vx*=Math.pow(.08,dt);p.vy*=Math.pow(.08,dt);}
    else if(p.slide>0||p.pinball>0){p.slide=Math.max(0,p.slide-dt);p.pinball=Math.max(0,p.pinball-dt);p.vx*=Math.pow(p.pinball>0?.72:.12,dt);p.vy*=Math.pow(p.pinball>0?.72:.12,dt);}
    else if(p.coverId){const c=s.covers.find(c=>c.id===p.coverId&&c.hp>0);if(!c)p.coverId=null;else{const horizontal=c.w>=c.h,move=horizontal?i.x:i.y;p.vx=horizontal?move*262:0;p.vy=horizontal?0:move*262;if((horizontal&&Math.abs(i.y)>.7)||(!horizontal&&Math.abs(i.x)>.7))p.coverId=null;}}
    else{const response=1-Math.exp(-13*d),m=Math.hypot(i.x,i.y);p.vx+=(i.x*262-p.vx)*response;p.vy+=(i.y*262-p.vy)*response;if(m<.05){p.vx*=Math.pow(.002,d);p.vy*=Math.pow(.002,d);}}
    p.x=clamp(p.x+p.vx*d,24,976);p.y=clamp(p.y+p.vy*d,24,596);collidePlayer(p,s);
    if(p.gripCoverId){const c=s.covers.find(c=>c.id===p.gripCoverId&&c.hp>0);if(!c)p.gripCoverId=null;else{c.x=clamp(p.x+Math.cos(p.aim)*105-c.w/2,20,980-c.w);c.y=clamp(p.y+Math.sin(p.aim)*105-c.h/2,20,600-c.h);c.build=0;}}
    if(i.fire&&s.time-p.lastShot>=.48&&p.knock<=0){p.lastShot=s.time;for(let n=-3;n<=3;n++){const a=p.aim+n*.04;s.shots.push({id:uid(),owner:slot,x:p.x+Math.cos(a)*26,y:p.y+Math.sin(a)*26,vx:Math.cos(a)*820,vy:Math.sin(a)*820,life:.48});}s.fx.push({id:uid(),type:"muzzle",x:p.x+Math.cos(p.aim)*34,y:p.y+Math.sin(p.aim)*34,life:.12,owner:slot});}
  }
  for(const c of s.covers)c.build=Math.max(0,(c.build||0)-dt/0.72);
  for(const m of s.matter){if(m.heldBy!==null){const p=s.players[m.heldBy];m.x=p.x+Math.cos(p.aim)*70;m.y=p.y+Math.sin(p.aim)*70;continue;}if(m.orbitBy!==null){const p=s.players[m.orbitBy],idx=p.orbitIds.indexOf(m.id),a=s.time*4+idx*Math.PI*2/Math.max(1,p.orbitIds.length);m.x=p.x+Math.cos(a)*62;m.y=p.y+Math.sin(a)*62;continue;}m.x+=m.vx*d;m.y+=m.vy*d;m.vx*=Math.pow(.35,d);m.vy*=Math.pow(.35,d);if(m.life<999)m.life-=dt;for(let slot=0;slot<s.players.length;slot++){const p=s.players[slot];if(Math.hypot(m.vx,m.vy)>170&&distance(m,p)<m.r+19){const a=Math.atan2(m.vy,m.vx);damage(s,slot,22,Math.cos(a)*360,Math.sin(a)*360,"matter-hit");m.vx*=.25;m.vy*=.25;}}for(const c of s.covers){if(c.hp>0&&circleBox(m,m.r,c).hit&&Math.hypot(m.vx,m.vy)>140){damageCover(s,c,28);m.vx*=-.45;m.vy*=-.45;}}}
  for(const shot of s.shots){shot.x+=shot.vx*d;shot.y+=shot.vy*d;shot.life-=dt;const target=1-shot.owner,p=s.players[target];if(p&&p.hp>0&&distance(shot,p)<22){damage(s,target,10,shot.vx*.12,shot.vy*.12,"shot-hit");shot.life=0;continue;}for(const c of s.covers){if(c.hp>0&&circleBox(shot,2,c).hit){damageCover(s,c,7);shot.life=0;break;}}}
  s.shots=s.shots.filter(x=>x.life>0);s.matter=s.matter.filter(x=>x.life>0);s.fx.forEach(x=>x.life-=dt);s.fx=s.fx.filter(x=>x.life>0);
  const [a,b]=s.players;if(s.mode!=="solo"&&b&&(a.hp<=0||b.hp<=0)){s.phase="finished";s.winner=a.hp===b.hp?null:a.hp>b.hp?0:1;if(s.winner!==null)s.players[s.winner].score++;}
}

export function advance(s:GameState,now=Date.now()){
  s.mode||=(s.players.some(p=>p.bot)?"bot":"bot");s.players.forEach(p=>{if(p.gripCoverId===undefined)p.gripCoverId=null;});s.covers.forEach(c=>{if(c.build===undefined)c.build=0;});
  if(s.phase!=="playing"||(s.players.length<2&&s.mode!=="solo")){s.lastAt=now;return;}
  let elapsed=clamp((now-s.lastAt)/1000,0,.25);s.lastAt=now;let previous=s.players.map(p=>({...p.processedInput}));
  while(elapsed>0){const dt=Math.min(1/60,elapsed);s.time+=dt;botInput(s);step(s,dt,previous);s.players.forEach(p=>p.processedInput={...p.input});previous=s.players.map(p=>({...p.input}));elapsed-=dt;if(s.phase!=="playing")break;}
}
export function startOrRematch(s:GameState,slot:number){const p=s.players[slot];if(!p||p.bot)return;if(s.phase==="lobby"&&slot===0&&s.players.length===2){respawn(s);return;}if(s.phase==="finished"){p.rematch=true;if(s.players.some(p=>p.bot)||s.players.every(p=>p.rematch))respawn(s);}}
export function safeState(s:GameState){return{...s,players:s.players.map(({token,...p})=>p)};}
