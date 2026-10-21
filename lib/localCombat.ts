import {advance,newGame,safeState,setInput,startOrRematch,updateConfig,combatDiagnostics,type GameState,type InputState} from "./game";
import {registerRepulseLab21,configureRepulse21} from './repulse21';

// Same combat authority, hosted on this device for single-player modes.
// A fixed 60 Hz clock avoids tying physics to display refresh or network arrivals.
export function isLocalMode(mode:unknown){return mode==="solo"||mode==="practice"||mode==="bot";}
export class LocalCombat {
 state:GameState;room:string;token:string;private clock:number|null=null;private remainder=0;private seq=0;
 constructor(name:string,mode:"solo"|"practice"|"bot",now:number){
  this.token=crypto.randomUUID();this.room="local-"+crypto.randomUUID();this.state=newGame(name,this.token,now,mode);
  registerRepulseLab21(this.state);
 }
 reply(){return{local:true,room:this.room,token:this.token,slot:0,state:{...safeState(this.state),local:true}};}
 pause(){this.clock=null;this.remainder=0;setInput(this.state,0,++this.seq,{});}
 frame(now:number,latest:Partial<InputState>,edges:Partial<InputState>[]){
  if(this.clock===null){this.clock=now;return this.reply();}
  this.remainder+=Math.max(0,Math.min(100,now-this.clock));this.clock=now;
  const step=1000/60;
  while(this.remainder+1e-6>=step){setInput(this.state,0,++this.seq,edges.shift()||latest);advance(this.state,this.state.lastAt+step);this.remainder-=step;}
  return this.reply();
 }
 command(body:any){
  if(body.token!==this.token||body.room!==this.room)throw Error("BAD_LOCAL_SESSION");
  if(body.action==="config")updateConfig(this.state,body.patch||{});
  else if(body.action==='repulse21')configureRepulse21(this.state,body.enabled===true,body.patch||{});
  else if(["reset","start","rematch"].includes(body.action)){startOrRematch(this.state,0);this.pause();}
  else throw Error("Unsupported local action");
  return this.reply();
 }
 diagnostics(){return combatDiagnostics(this.state);}
}

