export class PublicLab{
 constructor({name,onState,onStatus,onWarm}){Object.assign(this,{name,onState,onStatus,onWarm});this.key=Array.from(crypto.getRandomValues(new Uint8Array(16)),v=>v.toString(16).padStart(2,'0')).join('').replaceAll('-','');this.input={};this.rematch=false;this.closed=false;this.queued=false;this.failures=0;this.lastGood=performance.now();}
 start(){this.poll()}
 async poll(){if(this.closed)return;let delay=70;const started=performance.now();try{
 this.abort=new AbortController();this.timeout=setTimeout(()=>this.abort.abort(),5000);
 const r=await fetch('/api/duel/shotgun/'+(this.queued?'pulse':'queue'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:this.key,name:this.name,input:this.input,rematch:this.rematch}),signal:this.abort.signal});const data=await r.json();if(this.closed)return;
 if(data.ended){this.key=Array.from(crypto.getRandomValues(new Uint8Array(16)),v=>v.toString(16).padStart(2,'0')).join('').replaceAll('-','');this.queued=false;this.rematch=false;this.onWarm('Opponent disconnected — bot practice resumes. Searching…');delay=400}
 else if(!r.ok)throw Error(data.error||'Matchmaking unavailable');
 else{this.queued=true;this.failures=0;this.lastGood=performance.now();this.rtt=this.lastGood-started;if(data.state){if(data.state.phase!=='finished')this.rematch=false;this.onState({...data,rtt:this.rtt})}else{this.onStatus(data.status==='connecting'?'Opponent found — waiting for their arena to load.':'Playing against bot — searching for an opponent.');delay=450}}
 }catch(e){if(this.closed)return;this.failures++;delay=Math.min(3000,400*this.failures);if(performance.now()-this.lastGood>2500)this.onWarm('Connection interrupted — bot practice continues. Retrying…');else this.onStatus('Reconnecting…')}
 finally{clearTimeout(this.timeout);if(!this.closed)this.timer=setTimeout(()=>this.poll(),delay)}}
 close(){if(this.closed)return;this.closed=true;clearTimeout(this.timer);clearTimeout(this.timeout);this.abort?.abort();fetch('/api/duel/shotgun/leave',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:this.key}),keepalive:true}).catch(()=>{})}
}
