// NEW isolated integration server. Not recovered Sites/D1 infrastructure.
// The original public API remains untouched; this protocol uses shotgun-next.
import {LabDuel,labInput,LAB_PROTOCOL} from './lab-combat-rules.js';
export class LabSessionManager{
 constructor({clock=()=>Date.now(),maxSessions=100}={}){this.clock=clock;this.maxSessions=maxSessions;this.sessions=new Map();this.rooms=new Map();this.serial=0;}
 cleanup(){const now=this.clock();for(const [key,s] of this.sessions)if(now-s.seen>12000)this.leave(key);}
 leave(key){const s=this.sessions.get(key);if(!s)return;if(s.room){const r=this.rooms.get(s.room);if(r){for(const k of r.keys){const other=this.sessions.get(k);if(other&&k!==key){other.room=null;other.ended=true;}}this.rooms.delete(s.room);}}this.sessions.delete(key);}
 tick(){this.cleanup();const now=this.clock();for(const r of this.rooms.values())this.advance(r,now);}
 advance(r,now){
  const elapsed=Math.max(0,(now-r.last)/1000);r.last=now;r.acc=Math.min(.25,r.acc+elapsed);
  while(r.acc+1e-9>=1/60){r.game.update(1/60,r.keys.map(k=>{const s=this.sessions.get(k);return s&&now-s.seen<1500?s.input:labInput();}));r.acc-=1/60;}
 }
 handle(action,body){
  this.tick();const key=body?.key;
  if(body?.protocol!==LAB_PROTOCOL)return {status:409,body:{error:'Client/server version mismatch',protocol:LAB_PROTOCOL}};
  if(typeof key!=='string'||!/^\w{32}$/.test(key))return {status:400,body:{error:'Invalid session'}};
  if(action==='leave'){this.leave(key);return {status:200,body:{left:true,protocol:LAB_PROTOCOL}};}
  if(action!=='queue'&&action!=='pulse')return {status:404,body:{error:'Unknown action'}};
  let s=this.sessions.get(key);const now=this.clock();
  if(!s){if(action!=='queue')return {status:200,body:{ended:true,protocol:LAB_PROTOCOL}};if(body.ready!==true)return {status:400,body:{error:'Finish loading first'}};if(this.sessions.size>=this.maxSessions)return {status:503,body:{error:'Practice continues; lobby is full'}};s={key,seen:now,name:String(body.name||'Psychic').replace(/[\u0000-\u001f]/g,'').slice(0,20),input:labInput(body.input),room:null,rematch:false};this.sessions.set(key,s);}
  if(s.ended){this.sessions.delete(key);return {status:200,body:{ended:true,protocol:LAB_PROTOCOL}};}
  s.seen=now;const input=labInput(body.input);if(input.seq>=s.input.seq)s.input=input;
  if(!s.room){const other=[...this.sessions.values()].find(o=>o!==s&&!o.room&&!o.ended&&now-o.seen<=12000);
   if(other){const id='next-'+ ++this.serial,r={id,keys:[other.key,key],game:new LabDuel(),last:now,acc:0};s.room=other.room=id;this.rooms.set(id,r);}
  }
  if(!s.room)return {status:200,body:{status:'waiting',protocol:LAB_PROTOCOL}};
  const r=this.rooms.get(s.room);this.advance(r,now);
  if(r.game.s.phase==='finished'){if(body.rematch===true)s.rematch=true;if(r.keys.every(k=>this.sessions.get(k)?.rematch)){r.game=new LabDuel();r.last=now;r.acc=0;for(const k of r.keys)this.sessions.get(k).rematch=false;}}
  else s.rematch=false;
  return {status:200,body:{protocol:LAB_PROTOCOL,slot:r.keys.indexOf(key),names:r.keys.map(k=>this.sessions.get(k)?.name||'Opponent'),state:r.game.snapshot()}};
 }
}
