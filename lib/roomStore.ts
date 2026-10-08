import {advance,newGame,type GameState} from "./game";
export type Room={id:string;joinCode:string;invite:string;state:GameState;updatedAt:number;inputAt:number[]};
declare global{var __godModeStudioRooms:Map<string,Room>|undefined}
export const rooms=globalThis.__godModeStudioRooms??(globalThis.__godModeStudioRooms=new Map<string,Room>());
export const clean=(v:unknown,n=24)=>String(v??"").replace(/[^a-zA-Z0-9 _-]/g,"").trim().slice(0,n);
export const readRoom=(id:string)=>rooms.get(id);
export function slotFor(s:GameState,t:string){const n=s.players.findIndex(p=>p.token===t);if(n<0)throw Error("BAD_TOKEN");return n;}
export function pruneRooms(){const c=Date.now()-28800000;for(const[id,r]of rooms)if(r.updatedAt<c)rooms.delete(id);}
export function tickRoom(r:Room,now=Date.now()){
 // A vanished client must not leave a fighter firing or walking indefinitely.
 for(let n=0;n<r.state.players.length;n++)if(!r.state.players[n].bot&&now-(r.inputAt[n]??now)>400){const p=r.state.players[n];p.timeFieldActive=false;p.pendingMelee=undefined;p.pendingFireUntil=undefined;p.input={...p.input,x:0,y:0,fire:false,shield:false,coverAim:false,slide:false,grip:false,powerup:false,slow:false,melee:false,heavy:false,cover:false,orbit:false,launchOrbit:false,pinball:false,throwMatter:false,fieldCycle:false,powerCycle:false,weaponCycle:false,powerUse:false};}
 advance(r.state,now);r.updatedAt=now;
}
export function createRoom(name:string,mode:Parameters<typeof newGame>[3],now=Date.now()){
 let id=crypto.randomUUID().slice(0,8).toUpperCase();while(rooms.has(id))id=crypto.randomUUID().slice(0,8).toUpperCase();
 const token=crypto.randomUUID()+crypto.randomUUID(),r:Room={id,joinCode:String(Math.floor(100000+Math.random()*900000)),invite:crypto.randomUUID(),state:newGame(name,token,now,mode),updatedAt:now,inputAt:[now]};rooms.set(id,r);return{r,token};
}
