import {advance,joinGame,newGame,safeState,setInput,startOrRematch,updateConfig,type CombatConfig,type GameState,type InputState} from "../../../lib/game";
export const dynamic="force-dynamic";export const runtime="nodejs";
const json=(d:unknown,s=200)=>Response.json(d,{status:s,headers:{"cache-control":"no-store"}});
const clean=(v:unknown,n=24)=>String(v??"").replace(/[^a-zA-Z0-9 _-]/g,"").trim().slice(0,n),token=()=>crypto.randomUUID()+crypto.randomUUID(),roomId=()=>crypto.randomUUID().slice(0,8).toUpperCase(),joinCode=()=>String(Math.floor(100000+Math.random()*900000));
type Room={id:string;joinCode:string;state:GameState;updatedAt:number};declare global{var __godModeStudioRooms:Map<string,Room>|undefined}
const rooms=globalThis.__godModeStudioRooms??(globalThis.__godModeStudioRooms=new Map<string,Room>());
const read=(id:string)=>rooms.get(id),prune=()=>{const c=Date.now()-28800000;for(const[id,r]of rooms)if(r.updatedAt<c)rooms.delete(id)},slotFor=(s:GameState,t:string)=>{const n=s.players.findIndex(p=>p.token===t);if(n<0)throw Error("BAD_TOKEN");return n};
function mutate(id:string,fn:(s:GameState)=>void){const r=read(id);if(!r)throw Error("ROOM_NOT_FOUND");advance(r.state);fn(r.state);r.updatedAt=Date.now();return r.state}
function status(e:unknown){const m=String((e as Error)?.message||e);return m==="ROOM_NOT_FOUND"?404:m==="BAD_TOKEN"?403:m==="Room is full"?409:400}
export async function GET(req:Request){prune();const u=new URL(req.url),id=clean(u.searchParams.get("room"),8),t=String(u.searchParams.get("token")||"");try{let slot=-1;const state=mutate(id,s=>{slot=slotFor(s,t)});return json({slot,state:safeState(state)})}catch(e){return json({error:String((e as Error).message||e)},status(e))}}
export async function POST(req:Request){let b:any;try{b=await req.json()}catch{return json({error:"Invalid request"},400)}const action=clean(b.action,16),now=Date.now();try{
 if(action==="create"){prune();const mode=b.mode==="practice"?"practice":b.mode==="duel"?"duel":b.mode==="bot"?"bot":"solo",id=roomId(),code=joinCode(),hostToken=token(),state=newGame(clean(b.name)||"Les",hostToken,now,mode);rooms.set(id,{id,joinCode:code,state,updatedAt:now});return json({room:id,code,token:hostToken,slot:0,state:safeState(state)},201)}
 if(action==="join"){const id=clean(b.room,8),row=read(id);if(!row||row.joinCode!==clean(b.code,6))throw Error("Wrong room code");const guestToken=token();const state=mutate(id,s=>joinGame(s,clean(b.name)||"Player 2",guestToken));return json({room:id,token:guestToken,slot:1,state:safeState(state)})}
 const id=clean(b.room,8),t=String(b.token||"");
 if(action==="input"){let slot=-1;const state=mutate(id,s=>{slot=slotFor(s,t);setInput(s,slot,Number(b.seq),b.input as Partial<InputState>)});return json({slot,state:safeState(state)})}
 if(action==="config"){let slot=-1;const state=mutate(id,s=>{slot=slotFor(s,t);if(slot!==0)throw Error("HOST_ONLY");updateConfig(s,b.patch as Partial<CombatConfig>)});return json({slot,state:safeState(state)})}
 if(action==="reset"||action==="start"||action==="rematch"){let slot=-1;const state=mutate(id,s=>{slot=slotFor(s,t);if(s.mode==="duel"&&s.players.length<2)throw Error("Waiting for Player 2");startOrRematch(s,slot)});return json({slot,state:safeState(state)})}
 return json({error:"Unknown action"},404)
 }catch(e){return json({error:String((e as Error).message||e)},status(e))}}

