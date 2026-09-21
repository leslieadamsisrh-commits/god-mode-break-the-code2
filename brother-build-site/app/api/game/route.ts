import { env } from "cloudflare:workers";
import { advance, joinGame, newGame, safeState, setInput, startOrRematch, type GameState, type InputState } from "@/lib/game";

export const dynamic = "force-dynamic";
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{"cache-control":"no-store"}});
const clean=(v:unknown,max=24)=>String(v??"").replace(/[^a-zA-Z0-9 _-]/g,"").trim().slice(0,max);
const token=()=>crypto.randomUUID()+crypto.randomUUID();
const roomId=()=>crypto.randomUUID().slice(0,8).toUpperCase();
const joinCode=()=>String(Math.floor(100000+Math.random()*900000));

type Row={id:string;join_code:string;state:string;rev:number;updated_at:number};
function db(){if(!env.DB)throw new Error("Game database unavailable");return env.DB;}
async function read(id:string){return db().prepare("SELECT id, join_code, state, rev, updated_at FROM rooms WHERE id = ?").bind(id).first<Row>();}
async function save(row:Row,state:GameState){
  const now=Date.now(),result=await db().prepare("UPDATE rooms SET state = ?, rev = rev + 1, updated_at = ? WHERE id = ? AND rev = ?")
    .bind(JSON.stringify(state),now,row.id,row.rev).run();
  return Number(result.meta.changes||0)===1;
}
async function mutate(id:string,fn:(s:GameState)=>void){
  for(let attempt=0;attempt<3;attempt++){
    const row=await read(id);if(!row)throw new Error("ROOM_NOT_FOUND");const state=JSON.parse(row.state) as GameState;advance(state);fn(state);
    if(await save(row,state))return state;
  }
  throw new Error("ROOM_BUSY");
}
function slotFor(s:GameState,t:string){const slot=s.players.findIndex(p=>p.token===t);if(slot<0)throw new Error("BAD_TOKEN");return slot;}
function status(error:unknown){const m=String((error as Error)?.message||error);return m==="ROOM_NOT_FOUND"?404:m==="BAD_TOKEN"?403:m==="ROOM_BUSY"?409:400;}

export async function GET(request:Request){
  const u=new URL(request.url),id=clean(u.searchParams.get("room"),8),t=String(u.searchParams.get("token")||"");
  try{let ownSlot=-1;const state=await mutate(id,s=>{ownSlot=slotFor(s,t);});return json({slot:ownSlot,state:safeState(state)});}catch(e){return json({error:String((e as Error).message||e)},status(e));}
}

export async function POST(request:Request){
  let body:any;try{body=await request.json();}catch{return json({error:"Invalid request"},400);}const action=clean(body.action,16),now=Date.now();
  try{
    if(action==="create"){
      const id=roomId(),code=joinCode(),hostToken=token(),state=newGame(clean(body.name)||"Player 1",hostToken,now);
      await db().prepare("INSERT INTO rooms (id, join_code, state, rev, updated_at) VALUES (?, ?, ?, 0, ?)").bind(id,code,JSON.stringify(state),now).run();
      return json({room:id,code,token:hostToken,slot:0,state:safeState(state)},201);
    }
    if(action==="join"){
      const id=clean(body.room,8),code=clean(body.code,6),guestToken=token(),row=await read(id);if(!row||row.join_code!==code)throw new Error("Wrong room code");
      const state=await mutate(id,s=>{if(s.players.length===2)throw new Error("Room is full");joinGame(s,clean(body.name)||"Player 2",guestToken);});
      return json({room:id,token:guestToken,slot:1,state:safeState(state)});
    }
    const id=clean(body.room,8),t=String(body.token||"");
    if(action==="input"){
      let slot=-1;const state=await mutate(id,s=>{slot=slotFor(s,t);setInput(s,slot,Number(body.seq),body.input as Partial<InputState>);});
      return json({slot,state:safeState(state)});
    }
    if(action==="start"||action==="rematch"){
      let slot=-1;const state=await mutate(id,s=>{slot=slotFor(s,t);startOrRematch(s,slot);});return json({slot,state:safeState(state)});
    }
    return json({error:"Unknown action"},404);
  }catch(e){return json({error:String((e as Error).message||e)},status(e));}
}
