import {applyArenaLayout27c,fightMemoryControl,fightMemoryData,validateExperience,combatDiagnostics,advance,joinGame,newGame,safeState,setInput,startOrRematch,updateConfig,type CombatConfig,type GameState,type InputState} from "../../../lib/game";
export const dynamic="force-dynamic";export const runtime="nodejs";
const json=(d:unknown,s=200)=>Response.json(d,{status:s,headers:{"cache-control":"no-store"}});
import {clean,createRoom,readRoom as read,pruneRooms as prune,slotFor,tickRoom} from "../../../lib/roomStore";
const token=()=>crypto.randomUUID()+crypto.randomUUID();
function mutate(id:string,fn:(s:GameState)=>void){const r=read(id);if(!r)throw Error("ROOM_NOT_FOUND");tickRoom(r);fn(r.state);r.updatedAt=Date.now();return r.state}
function status(e:unknown){const m=String((e as Error)?.message||e);return m==="ROOM_NOT_FOUND"?404:m==="BAD_TOKEN"?403:m==="Room is full"?409:400}
export async function GET(req:Request){prune();const u=new URL(req.url),id=clean(u.searchParams.get("room"),8),t=String(u.searchParams.get("token")||"");try{let slot=-1;const state=mutate(id,s=>{slot=slotFor(s,t)});return json({slot,state:safeState(state),...u.searchParams.get("memory")==="1"&&slot===0&&state.mode==="watch"?{memory:fightMemoryData(state)}:{},...u.searchParams.get("audit")==="1"?{diagnostics:combatDiagnostics(state)}:{}})}catch(e){return json({error:String((e as Error).message||e)},status(e))}}
export async function POST(req:Request){let b:any;try{b=await req.json()}catch{return json({error:"Invalid request"},400)}const action=clean(b.action,16),now=Date.now();try{
 if(action==="create"){prune();const mode=b.mode==="watch"?"watch":b.mode==="practice"?"practice":b.mode==="duel"?"duel":b.mode==="bot"?"bot":"solo",{r,token:hostToken}=createRoom(clean(b.name)||"Les",mode,now);if(mode==="watch"&&b.memoryProfile!==undefined){try{r.state.botExperience=validateExperience(b.memoryProfile);r.state.botStrategy=b.memoryMode==="adaptive"?"adaptive":"baseline";}catch{r.state.botStrategy="baseline";}}return json({room:r.id,code:r.joinCode,invite:r.invite,token:hostToken,slot:0,state:safeState(r.state)},201)}
 if(action==="join"){const id=clean(b.room,8),row=read(id);if(!row||!(b.invite&&b.invite===row.invite||row.joinCode===clean(b.code,6)))throw Error("Invalid or expired invite");const guestToken=token();const state=mutate(id,s=>{joinGame(s,clean(b.name)||"Player 2",guestToken);row.inputAt[1]=now;if(s.phase==="lobby"&&s.players.length===2){s.phase="countdown";s.countdown=3}});return json({room:id,token:guestToken,slot:1,state:safeState(state)})}
 const id=clean(b.room,8),t=String(b.token||"");
 if(action==="invite"){const r=read(id);if(!r)throw Error("ROOM_NOT_FOUND");if(slotFor(r.state,t)!==0)throw Error("HOST_ONLY");return json({room:id,invite:r.invite});}
 if(action==="input"){let slot=-1;const state=mutate(id,s=>{slot=slotFor(s,t);setInput(s,slot,Number(b.seq),b.input as Partial<InputState>);read(id)!.inputAt[slot]=now});return json({slot,state:safeState(state)})}
 if(action==="fightMemory"){let slot=-1;const state=mutate(id,s=>{slot=slotFor(s,t);if(slot!==0)throw Error("HOST_ONLY");const sha=process.env.RAILWAY_GIT_COMMIT_SHA||process.env.GOD_MODE_BUILD_SHA||"";fightMemoryControl(s,clean(b.operation,16),b.profiles,/^[a-f0-9]{40}$/.test(sha)?sha:null);});return json({slot,state:safeState(state),memory:fightMemoryData(state)})}
 if(action==="watchControl"){let slot=-1;const state=mutate(id,s=>{slot=slotFor(s,t);if(slot!==0||s.mode!=="watch")throw Error("HOST_ONLY");s.watchPaused=!!b.paused;});return json({slot,state:safeState(state)})}
 if(action==="arenaLayout"){let slot=-1;const state=mutate(id,s=>{slot=slotFor(s,t);if(slot!==0)throw Error("HOST_ONLY");applyArenaLayout27c(s,b.layout);});return json({slot,state:safeState(state)})}
 if(action==="config"){let slot=-1;const state=mutate(id,s=>{slot=slotFor(s,t);if(slot!==0)throw Error("HOST_ONLY");updateConfig(s,b.patch as Partial<CombatConfig>)});return json({slot,state:safeState(state)})}
 if(action==="reset"||action==="start"||action==="rematch"){let slot=-1;const state=mutate(id,s=>{slot=slotFor(s,t);if(s.mode==="duel"&&s.players.length<2)throw Error("Waiting for Player 2");startOrRematch(s,slot)});return json({slot,state:safeState(state)})}
 return json({error:"Unknown action"},404)
 }catch(e){return json({error:String((e as Error).message||e)},status(e))}}


