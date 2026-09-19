'use strict';
/* Private single-process authority. Bounded JSON POST input; authenticated SSE snapshots.
 * No client-side prediction yet. Rooms and sessions are ephemeral, not persisted.
 */
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {Duel,InputMailbox}=require('./duel.cjs');
const token=(n=24)=>crypto.randomBytes(n).toString('base64url');
const equal=(a,b)=>{if(typeof a!=='string'||typeof b!=='string')return false;const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&crypto.timingSafeEqual(x,y);};
const PUBLIC=path.resolve(__dirname,'../public');
function createService({accessKey=process.env.DUEL_ACCESS_KEY||token(),origin=process.env.DUEL_ORIGIN||'',secure=process.env.DUEL_SECURE==='1',maxRooms=8,roomTtlMs=7200000}={}){
 if(accessKey.length<16)throw Error('Use an access key of at least 16 characters');
 const sessions=new Map(),rooms=new Map(),attempts=new Map();let closed=false;
 function reply(res,status,obj){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(obj));}
 function session(req){const raw=(req.headers.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith('jade_session='));const s=raw&&sessions.get(raw.slice(13));return s&&s.expires>Date.now()?s:null;}
 function newSession(res,admin=false){if(sessions.size>=128)throw Error('Session capacity reached');const s={id:token(32),admin,expires:Date.now()+28800000};sessions.set(s.id,s);res.setHeader('Set-Cookie',`jade_session=${s.id}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800${secure?'; Secure':''}`);return s;}
 function member(req,room){const s=session(req);return s&&room?.members.find(m=>m&&m.session===s.id);}
 function sameOrigin(req){const own=origin||`${secure?'https':'http'}://${req.headers.host}`;return !req.headers.origin||req.headers.origin===own;}
 async function body(req){if(!String(req.headers['content-type']||'').startsWith('application/json'))throw Error('JSON required');let b='';for await(const chunk of req){b+=chunk;if(Buffer.byteLength(b)>8192)throw Error('Request too large');}const v=JSON.parse(b||'{}');if(!v||typeof v!=='object'||Array.isArray(v))throw Error('Object required');return v;}
 function addMember(s,name,slot){return{session:s.id,name:String(name||('Player '+(slot+1))).trim().slice(0,24)||('Player '+(slot+1)),slot,ready:false,stream:null,lease:null,mailbox:new InputMailbox(),rematch:false,rateAt:0,rate:0};}
 function packet(room){return{type:'state',room:room.id,serverTime:Date.now(),connected:room.members.map(m=>!!m?.stream),names:room.members.map(m=>m?.name||'Waiting'),ready:room.members.map(m=>!!m?.ready),rematch:room.members.map(m=>!!m?.rematch),waiting:room.members.filter(m=>m?.stream&&m.ready).length!==2,state:room.match.snapshot()};}
 function send(m,data){if(!m.stream||m.stream.destroyed)return;if(m.stream.writableLength>131072){m.stream.end();return;}m.stream.write('data: '+JSON.stringify(data)+'\n\n');}
 function broadcast(room){const data=packet(room);for(const m of room.members)if(m)send(m,{...data,slot:m.slot,lease:m.lease,ack:m.mailbox.sequence});}
 function removeRoom(room,reason){for(const m of room.members)if(m?.stream){send(m,{type:'closed',reason});m.stream.end();}rooms.delete(room.id);}
 async function handle(req,res){
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('X-Frame-Options','DENY');res.setHeader('Content-Security-Policy',"default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'");
  let u;try{u=new URL(req.url,'http://local');}catch{return reply(res,400,{error:'Bad request'});}
  if(req.method==='GET'&&u.pathname==='/health')return reply(res,200,{status:'ok',build:'V12-08L'});
  if(req.method==='POST'){
   if(!sameOrigin(req)||req.headers['x-jade-client']!=='08L')return reply(res,403,{error:'Same-origin client required'});
   let v;try{v=await body(req);}catch(e){return reply(res,400,{error:e.message});}
   if(u.pathname==='/api/login'){
    const ip=req.socket.remoteAddress||'unknown',now=Date.now();let a=attempts.get(ip);if(!a||now-a.at>60000){a={at:now,n:0};attempts.set(ip,a);}if(++a.n>12)return reply(res,429,{error:'Too many attempts. Wait one minute.'});
    if(!equal(v.key,accessKey))return reply(res,401,{error:'Invalid host access key'});
    newSession(res,true);return reply(res,200,{ok:true});
   }
   if(u.pathname==='/api/join'){
    const room=rooms.get(v.room);if(!room||!equal(v.invite,room.invite))return reply(res,403,{error:'Invalid or expired invite'});
    let s=session(req),m=s&&room.members.find(m=>m?.session===s.id);if(m)return reply(res,200,{room:room.id,slot:m.slot});
    if(room.members[1])return reply(res,409,{error:'This two-player room is full'});
    s=s||newSession(res,false);room.members[1]=addMember(s,v.name,1);broadcast(room);return reply(res,200,{room:room.id,slot:1});
   }
   const s=session(req);if(!s)return reply(res,401,{error:'Sign in or open a private invite first'});
   if(u.pathname==='/api/create'){
    if(!s.admin)return reply(res,403,{error:'Host access required'});
    if(rooms.size>=maxRooms||[...rooms.values()].filter(r=>r.members[0].session===s.id).length>=2)return reply(res,429,{error:'Room limit reached. Leave an existing room first.'});
    const id=token(12),room={id,invite:token(24),created:Date.now(),members:[addMember(s,v.name,0),null],match:new Duel({duration:v.duration})};rooms.set(id,room);return reply(res,201,{room:id,slot:0,invite:room.invite});
   }
   const room=rooms.get(v.room),m=member(req,room);if(!m)return reply(res,403,{error:'Not a member of this room'});
   if(u.pathname==='/api/ready'){m.ready=true;broadcast(room);return reply(res,200,{ok:true});}
   if(u.pathname==='/api/start'){
    if(m.slot!==0||room.match.phase!=='lobby'||!room.members.every(m=>m?.ready&&m.stream))return reply(res,409,{error:'Host can start the lobby when both players are connected and loaded'});
    room.members.forEach(m=>{m.mailbox=new InputMailbox();m.rematch=false;});room.match.begin();broadcast(room);return reply(res,200,{ok:true});
   }
   if(u.pathname==='/api/rematch'){
    if(room.match.phase!=='finished')return reply(res,409,{error:'Finish the round first'});m.rematch=true;
    if(room.members.every(m=>m?.rematch&&m.ready&&m.stream)){room.members.forEach(m=>{m.mailbox=new InputMailbox();m.rematch=false;});room.match.begin();}broadcast(room);return reply(res,200,{ok:true});
   }
   if(u.pathname==='/api/input'){
    if(!m.stream||!equal(v.lease,m.lease))return reply(res,409,{error:'Connection replaced; reconnect this tab'});
    const now=Date.now();if(now-m.rateAt>=1000){m.rateAt=now;m.rate=0;}if(++m.rate>90)return reply(res,429,{error:'Input rate exceeded'});
    if(!m.mailbox.accept(v.input,now))return reply(res,400,{error:'Invalid or stale input'});
    return reply(res,200,{ok:true,ack:m.mailbox.sequence,tick:room.match.tick});
   }
   if(u.pathname==='/api/leave'){removeRoom(room,'A player ended the private room.');return reply(res,200,{ok:true});}
   return reply(res,404,{error:'Unknown route'});
  }
  if(req.method!=='GET')return reply(res,405,{error:'Method not supported'});
  if(u.pathname==='/api/events'){
   if(!sameOrigin(req))return reply(res,403,{error:'Origin denied'});
   const room=rooms.get(u.searchParams.get('room')),m=member(req,room);if(!m)return reply(res,403,{error:'Room access denied'});
   if(m.stream)m.stream.end();m.stream=res;m.lease=token(16);m.mailbox=new InputMailbox();
   res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-store, no-transform','Connection':'keep-alive','X-Accel-Buffering':'no'});res.write('retry: 750\n\n');
   res.on('close',()=>{if(m.stream===res){m.stream=null;m.mailbox=new InputMailbox();}});broadcast(room);return;
  }
  if(u.pathname==='/api/session'){const s=session(req);return reply(res,s?200:401,{authenticated:!!s,host:!!s?.admin});}
  if(!new Set(['/','/gate.js','/style.css']).has(u.pathname)&&!session(req))return reply(res,401,{error:'Private assets require an invite or host session'});
  if(u.pathname==='/play'){const room=rooms.get(u.searchParams.get('room'));if(!member(req,room))return reply(res,403,{error:'Private room access required'});}
  let relative=u.pathname==='/'?'gate.html':u.pathname==='/play'?'index.html':decodeURIComponent(u.pathname).slice(1);const file=path.resolve(PUBLIC,relative);
  if(!file.startsWith(PUBLIC+path.sep)||relative.includes('\0'))return reply(res,403,{error:'Invalid path'});
  try{const info=fs.statSync(file);if(!info.isFile())throw Error();const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp','.json':'application/json'}[path.extname(file)]||'application/octet-stream';res.writeHead(200,{'Content-Type':mime,'Content-Length':info.size,'Cache-Control':'private, no-store'});fs.createReadStream(file).pipe(res);}catch{return reply(res,404,{error:'File not found'});}
 }
 const server=http.createServer((req,res)=>{handle(req,res).catch(()=>{if(!res.headersSent)reply(res,500,{error:'Request could not be completed'});else res.destroy();});});
 server.requestTimeout=10000;server.headersTimeout=10000;server.on('clientError',(_,socket)=>socket.destroy());
 let last=performance.now(),acc=0,broadcastAt=last;
 const timer=setInterval(()=>{
  const now=performance.now();acc+=Math.min((now-last)/1000,.1);last=now;
  while(acc>=1/60){for(const room of rooms.values())if(room.members.every(m=>m?.stream&&m.ready))room.match.advance(room.members.map(m=>m.mailbox.take(Date.now())));acc-=1/60;}
  if(now-broadcastAt>=1000/30){for(const room of rooms.values())broadcast(room);broadcastAt=now;}
 },8);timer.unref();
 const sweep=setInterval(()=>{const now=Date.now();for(const room of rooms.values())if(now-room.created>roomTtlMs)removeRoom(room,'Private room expired');for(const [id,s]of sessions)if(s.expires<now)sessions.delete(id);for(const [ip,a]of attempts)if(now-a.at>60000)attempts.delete(ip);},10000);sweep.unref();
 return{server,accessKey,listen:(port=8787,host='127.0.0.1')=>new Promise(resolve=>server.listen(port,host,()=>resolve(server.address()))),close:()=>new Promise(resolve=>{if(closed)return resolve();closed=true;clearInterval(timer);clearInterval(sweep);for(const room of rooms.values())removeRoom(room,'Server stopped');server.close(resolve);server.closeAllConnections();})};
}
module.exports={createService};
if(require.main===module){const service=createService(),host=process.env.DUEL_HOST||'127.0.0.1',port=Number(process.env.PORT||8787);service.listen(port,host).then(a=>{if(host==='0.0.0.0')for(const items of Object.values(require('node:os').networkInterfaces()))for(const ip of items||[])if(ip.family==='IPv4'&&!ip.internal)console.log(`Home-network address: http://${ip.address}:${a.port}/ (use this address BEFORE creating an invite)`);console.log(`JADE V12 08L — PRIVATE TWO-PLAYER TEST\nOpen http://localhost:${a.port}/\nHost access key: ${service.accessKey}\nBound to ${host}. Keep this terminal open. Ctrl+C stops it.\nNo public deployment was started.`);});for(const sig of ['SIGINT','SIGTERM'])process.on(sig,async()=>{await service.close();process.exit();});}
