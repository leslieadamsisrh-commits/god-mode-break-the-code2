import { advance, joinGame, newGame, safeState, setInput, startOrRematch, type GameState, type InputState } from "../../../lib/game";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{"cache-control":"no-store"}});
const clean=(v:unknown,max=24)=>String(v??"").replace(/[^a-zA-Z0-9 _-]/g,"").trim().slice(0,max);
const token=()=>crypto.randomUUID()+crypto.randomUUID();
const roomId=()=>crypto.randomUUID().slice(0,8).toUpperCase();
const joinCode=()=>String(Math.floor(100000+Math.random()*900000));

type Room={id:string;joinCode:string;state:GameState;updatedAt:number};
declare global { var __godModeRooms: Map<string,Room> | undefined; }
const rooms = globalThis.__godModeRooms ?? (globalThis.__godModeRooms = new Map<string,Room>());

function read(id:string){ return rooms.get(id); }
function prune(){
  const cutoff=Date.now()-1000*60*60*8;
  for(const [id,row] of rooms) if(row.updatedAt<cutoff) rooms.delete(id);
}
function mutate(id:string,fn:(s:GameState)=>void){
  const row=read(id); if(!row) throw new Error("ROOM_NOT_FOUND");
  advance(row.state); fn(row.state); row.updatedAt=Date.now(); return row.state;
}
function slotFor(s:GameState,t:string){const slot=s.players.findIndex(p=>p.token===t);if(slot<0)throw new Error("BAD_TOKEN");return slot;}
function status(error:unknown){const m=String((error as Error)?.message||error);return m==="ROOM_NOT_FOUND"?404:m==="BAD_TOKEN"?403:m==="Room is full"?409:400;}

export async function GET(request:Request){
  prune();
  const u=new URL(request.url),id=clean(u.searchParams.get("room"),8),t=String(u.searchParams.get("token")||"");
  try{let ownSlot=-1;const state=mutate(id,s=>{ownSlot=slotFor(s,t);});return json({slot:ownSlot,state:safeState(state)});}
  catch(e){return json({error:String((e as Error).message||e)},status(e));}
}

export async function POST(request:Request){
  let body:any;try{body=await request.json();}catch{return json({error:"Invalid request"},400);}
  const action=clean(body.action,16),now=Date.now();
  try{
    if(action==="create"){
      prune();
      const mode=body.mode==="solo"?"solo":"bot";
      const id=roomId(),code=joinCode(),hostToken=token(),state=newGame(clean(body.name)||"Player 1",hostToken,now,mode);
      rooms.set(id,{id,joinCode:code,state,updatedAt:now});
      return json({room:id,code,token:hostToken,slot:0,state:safeState(state)},201);
    }
    if(action==="join"){
      const id=clean(body.room,8),code=clean(body.code,6),guestToken=token(),row=read(id);
      if(!row||row.joinCode!==code)throw new Error("Wrong room code");
      const state=mutate(id,s=>{if(s.players.length===2&&!s.players.some(p=>p.bot))throw new Error("Room is full");joinGame(s,clean(body.name)||"Player 2",guestToken);});
      return json({room:id,token:guestToken,slot:1,state:safeState(state)});
    }
    const id=clean(body.room,8),t=String(body.token||"");
    if(action==="input"){
      let slot=-1;const state=mutate(id,s=>{slot=slotFor(s,t);setInput(s,slot,Number(body.seq),body.input as Partial<InputState>);});
      return json({slot,state:safeState(state)});
    }
    if(action==="start"||action==="rematch"){
      let slot=-1;const state=mutate(id,s=>{slot=slotFor(s,t);startOrRematch(s,slot);});
      return json({slot,state:safeState(state)});
    }
    return json({error:"Unknown action"},404);
  }catch(e){return json({error:String((e as Error).message||e)},status(e));}
}
