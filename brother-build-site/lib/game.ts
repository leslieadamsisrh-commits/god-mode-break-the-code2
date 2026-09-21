export type InputState = {
  x: number; y: number; aim: number; fire: boolean; shield: boolean;
  slide: boolean; melee: boolean; heavy: boolean; grip: boolean; throwMatter: boolean;
  cover: boolean; orbit: boolean; launchOrbit: boolean; pinball: boolean; slow: boolean;
};

export type Player = {
  x:number;y:number;vx:number;vy:number;aim:number;hp:number;battery:number;
  slide:number;slideFacing:number;coverId:string|null;shield:boolean;gripId:string|null;
  orbitIds:string[];knock:number;pinball:number;lastShot:number;lastMelee:number;
  score:number;rematch:boolean;input:InputState;processedInput:InputState;lastSeq:number;name:string;token:string;
};
export type Cover={id:string;x:number;y:number;w:number;h:number;hp:number;maxHp:number;generated:boolean};
export type Matter={id:string;x:number;y:number;vx:number;vy:number;r:number;kind:"metal"|"stone";heldBy:number|null;orbitBy:number|null;life:number};
export type Shot={id:string;owner:number;x:number;y:number;vx:number;vy:number;life:number};
export type Fx={id:string;type:string;x:number;y:number;life:number;owner?:number};
export type GameState={
  build:string;phase:"lobby"|"playing"|"finished";round:number;winner:number|null;
  createdAt:number;lastAt:number;time:number;players:Player[];covers:Cover[];matter:Matter[];shots:Shot[];fx:Fx[];
};

const emptyInput=():InputState=>({x:0,y:0,aim:0,fire:false,shield:false,slide:false,melee:false,heavy:false,grip:false,throwMatter:false,cover:false,orbit:false,launchOrbit:false,pinball:false,slow:false});
const clamp=(v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
const wrap=(a:number)=>Math.atan2(Math.sin(a),Math.cos(a));
const distance=(a:{x:number;y:number},b:{x:number;y:number})=>Math.hypot(a.x-b.x,a.y-b.y);
const uid=()=>crypto.randomUUID().slice(0,8);

function player(x:number,y:number,aim:number,name:string,token:string):Player{
  return{x,y,vx:0,vy:0,aim,hp:100,battery:100,slide:0,slideFacing:aim,coverId:null,shield:false,gripId:null,orbitIds:[],knock:0,pinball:0,lastShot:-9,lastMelee:-9,score:0,rematch:false,input:emptyInput(),processedInput:emptyInput(),lastSeq:-1,name,token};
}

export function newGame(hostName:string,hostToken:string,now=Date.now()):GameState{
  const covers:Cover[]=[
    {id:"north",x:330,y:160,w:190,h:34,hp:160,maxHp:160,generated:false},
    {id:"south",x:500,y:430,w:190,h:34,hp:160,maxHp:160,generated:false},
    {id:"west",x:170,y:330,w:130,h:34,hp:130,maxHp:130,generated:false},
    {id:"east",x:700,y:265,w:130,h:34,hp:130,maxHp:130,generated:false},
  ];
  const matter:Matter[]=[];
  [[120,120,"metal"],[850,110,"stone"],[100,510,"stone"],[880,500,"metal"],[490,105,"stone"],[510,540,"metal"]].forEach(([x,y,kind],i)=>matter.push({id:"m"+i,x:x as number,y:y as number,vx:0,vy:0,r:14,kind:kind as "metal"|"stone",heldBy:null,orbitBy:null,life:999}));
  return{build:"BROTHER-BUILD-R1",phase:"lobby",round:0,winner:null,createdAt:now,lastAt:now,time:0,players:[player(180,310,0,hostName,hostToken)],covers,matter,shots:[],fx:[]};
}

export function joinGame(s:GameState,name:string,token:string){
  if(s.players.length!==1)throw new Error("Room is full");
  s.players.push(player(820,310,Math.PI,name,token));
}

function respawn(s:GameState){
  const scores=s.players.map(p=>p.score),ident=s.players.map(p=>({name:p.name,token:p.token}));
  const fresh=newGame(ident[0].name,ident[0].token,s.lastAt);joinGame(fresh,ident[1].name,ident[1].token);
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
  for(const c of s.covers){if(c.hp<=0)continue;const q=circleBox(p,19,c);if(!q.hit)continue;p.x+=q.nx*(q.depth+1);p.y+=q.ny*(q.depth+1);const dot=p.vx*q.nx+p.vy*q.ny;if(dot<0){p.vx-=dot*q.nx;p.vy-=dot*q.ny;}if(p.slide>0){p.coverId=c.id;p.slide=0;p.vx=p.vy=0;s.fx.push({id:uid(),type:"cover-slam",x:p.x,y:p.y,life:.25});}}
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
  if(i.cover&&!prev.cover&&p.battery>=30){p.battery-=30;const x=clamp(p.x+Math.cos(p.aim)*90,40,860),y=clamp(p.y+Math.sin(p.aim)*90,40,545);s.covers.push({id:uid(),x,y,w:100,h:28,hp:90,maxHp:90,generated:true});s.fx.push({id:uid(),type:"materialize",x:x+50,y:y+14,life:.8,owner:slot});}
  if(i.grip&&!prev.grip){if(p.gripId){const m=s.matter.find(m=>m.id===p.gripId);if(m)m.heldBy=null;p.gripId=null;}else{const m=s.matter.filter(m=>m.heldBy===null&&m.orbitBy===null).sort((a,b)=>distance(a,p)-distance(b,p))[0];if(m&&distance(m,p)<220&&p.battery>=5){p.gripId=m.id;m.heldBy=slot;}}}
  if(i.throwMatter&&!prev.throwMatter&&p.gripId){const m=s.matter.find(m=>m.id===p.gripId);if(m){m.heldBy=null;m.vx=Math.cos(p.aim)*720;m.vy=Math.sin(p.aim)*720;m.life=2;p.gripId=null;s.fx.push({id:uid(),type:"throw",x:p.x,y:p.y,life:.25,owner:slot});}}
  if(i.orbit&&!prev.orbit&&p.battery>=25){const candidates=s.matter.filter(m=>m.heldBy===null&&m.orbitBy===null).sort((a,b)=>distance(a,p)-distance(b,p)).slice(0,3);if(candidates.length){p.battery-=25;p.orbitIds=candidates.map(m=>m.id);candidates.forEach(m=>m.orbitBy=slot);}}
  if(i.launchOrbit&&!prev.launchOrbit&&p.orbitIds.length){p.orbitIds.forEach((id,n)=>{const m=s.matter.find(m=>m.id===id);if(m){m.orbitBy=null;m.vx=Math.cos(p.aim+(n-1)*.12)*760;m.vy=Math.sin(p.aim+(n-1)*.12)*760;m.life=2;}});p.orbitIds=[];}
}

function step(s:GameState,dt:number,previous:InputState[]){
  const slowActive=s.players.some(p=>p.input.slow&&p.battery>0),scale=slowActive?.52:1,d=dt*scale;
  for(let slot=0;slot<s.players.length;slot++){
    const p=s.players[slot],i=p.input;p.aim=i.aim;actionEdges(s,slot,previous[slot]||emptyInput());
    p.shield=!!i.shield&&p.battery>0&&p.knock<=0;if(p.shield)p.battery=Math.max(0,p.battery-18*dt);if(i.slow&&p.battery>0)p.battery=Math.max(0,p.battery-28*dt);
    if(p.gripId)p.battery=Math.max(0,p.battery-6*dt);if(!p.shield&&!i.slow&&!p.gripId)p.battery=Math.min(100,p.battery+9*dt);
    if(p.hp<=0)continue;if(p.knock>0){p.knock-=dt;p.vx*=Math.pow(.08,dt);p.vy*=Math.pow(.08,dt);}
    else if(p.slide>0||p.pinball>0){p.slide=Math.max(0,p.slide-dt);p.pinball=Math.max(0,p.pinball-dt);p.vx*=Math.pow(p.pinball>0?.72:.12,dt);p.vy*=Math.pow(p.pinball>0?.72:.12,dt);}
    else if(p.coverId){const c=s.covers.find(c=>c.id===p.coverId&&c.hp>0);if(!c)p.coverId=null;else{const horizontal=c.w>=c.h,move=horizontal?i.x:i.y;p.vx=horizontal?move*262:0;p.vy=horizontal?0:move*262;if((horizontal&&Math.abs(i.y)>.7)||(!horizontal&&Math.abs(i.x)>.7))p.coverId=null;}}
    else{const response=1-Math.exp(-13*d),m=Math.hypot(i.x,i.y);p.vx+=(i.x*262-p.vx)*response;p.vy+=(i.y*262-p.vy)*response;if(m<.05){p.vx*=Math.pow(.002,d);p.vy*=Math.pow(.002,d);}}
    p.x=clamp(p.x+p.vx*d,24,976);p.y=clamp(p.y+p.vy*d,24,596);collidePlayer(p,s);
    if(i.fire&&s.time-p.lastShot>=.48&&p.knock<=0){p.lastShot=s.time;for(let n=-3;n<=3;n++){const a=p.aim+n*.04;s.shots.push({id:uid(),owner:slot,x:p.x+Math.cos(a)*26,y:p.y+Math.sin(a)*26,vx:Math.cos(a)*820,vy:Math.sin(a)*820,life:.48});}s.fx.push({id:uid(),type:"muzzle",x:p.x+Math.cos(p.aim)*34,y:p.y+Math.sin(p.aim)*34,life:.12,owner:slot});}
  }
  for(const m of s.matter){if(m.heldBy!==null){const p=s.players[m.heldBy];m.x=p.x+Math.cos(p.aim)*70;m.y=p.y+Math.sin(p.aim)*70;continue;}if(m.orbitBy!==null){const p=s.players[m.orbitBy],idx=p.orbitIds.indexOf(m.id),a=s.time*4+idx*Math.PI*2/Math.max(1,p.orbitIds.length);m.x=p.x+Math.cos(a)*62;m.y=p.y+Math.sin(a)*62;continue;}m.x+=m.vx*d;m.y+=m.vy*d;m.vx*=Math.pow(.35,d);m.vy*=Math.pow(.35,d);if(m.life<999)m.life-=dt;for(let slot=0;slot<s.players.length;slot++){const p=s.players[slot];if(Math.hypot(m.vx,m.vy)>170&&distance(m,p)<m.r+19){const a=Math.atan2(m.vy,m.vx);damage(s,slot,22,Math.cos(a)*360,Math.sin(a)*360,"matter-hit");m.vx*=.25;m.vy*=.25;}}for(const c of s.covers){if(c.hp>0&&circleBox(m,m.r,c).hit&&Math.hypot(m.vx,m.vy)>140){damageCover(s,c,28);m.vx*=-.45;m.vy*=-.45;}}}
  for(const shot of s.shots){shot.x+=shot.vx*d;shot.y+=shot.vy*d;shot.life-=dt;const target=1-shot.owner,p=s.players[target];if(p&&p.hp>0&&distance(shot,p)<22){damage(s,target,10,shot.vx*.12,shot.vy*.12,"shot-hit");shot.life=0;continue;}for(const c of s.covers){if(c.hp>0&&circleBox(shot,2,c).hit){damageCover(s,c,7);shot.life=0;break;}}}
  s.shots=s.shots.filter(x=>x.life>0);s.matter=s.matter.filter(x=>x.life>0);s.fx.forEach(x=>x.life-=dt);s.fx=s.fx.filter(x=>x.life>0);
  const [a,b]=s.players;if(b&&(a.hp<=0||b.hp<=0)){s.phase="finished";s.winner=a.hp===b.hp?null:a.hp>b.hp?0:1;if(s.winner!==null)s.players[s.winner].score++;}
}

export function advance(s:GameState,now=Date.now()){
  if(s.phase!=="playing"||s.players.length<2){s.lastAt=now;return;}
  let elapsed=clamp((now-s.lastAt)/1000,0,.25);s.lastAt=now;let previous=s.players.map(p=>({...p.processedInput}));
  while(elapsed>0){const dt=Math.min(1/60,elapsed);s.time+=dt;step(s,dt,previous);s.players.forEach(p=>p.processedInput={...p.input});previous=s.players.map(p=>({...p.input}));elapsed-=dt;if(s.phase!=="playing")break;}
}
export function startOrRematch(s:GameState,slot:number){const p=s.players[slot];if(!p)return;if(s.phase==="lobby"&&slot===0&&s.players.length===2){respawn(s);return;}if(s.phase==="finished"){p.rematch=true;if(s.players.every(p=>p.rematch))respawn(s);}}
export function safeState(s:GameState){return{...s,players:s.players.map(({token,...p})=>p)};}
