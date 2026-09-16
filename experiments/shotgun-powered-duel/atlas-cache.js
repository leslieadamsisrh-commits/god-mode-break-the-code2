// Presentation-only bounded cache. Never affects simulation or pose selection.
export class AtlasCache{
 constructor({load,maxBytes=36*1048576,concurrency=2,now=()=>performance.now()}){Object.assign(this,{load,maxBytes,concurrency,now});this.entries=new Map();this.jobs=new Map();this.queue=[];this.pins=new Set();this.active=0;this.bytes=0;this.peakBytes=0;this.loads=0;this.evictions=0;this.failures=0;this.failedUntil=new Map();this.closed=false;}
 pin(ids){this.pins=new Set(ids);this.queue=this.queue.filter(job=>{if(job.priority===0&&!this.pins.has(job.id)){this.jobs.delete(job.id);job.resolve(null);return false}return true})}
 get(id){const e=this.entries.get(id);if(e)e.used=this.now();return e?.bitmap||null}
 request(id,priority=1){if(this.closed)return Promise.resolve(null);const present=this.get(id);if(present)return Promise.resolve(present);const old=this.jobs.get(id);if(old){old.priority=Math.min(old.priority,priority);return old.promise}if((this.failedUntil.get(id)||0)>this.now())return Promise.resolve(null);
  if(priority>0&&this.queue.length>=8)return Promise.resolve(null);
  const job={id,priority};job.promise=new Promise(resolve=>job.resolve=resolve);this.jobs.set(id,job);this.queue.push(job);this.pump();return job.promise;
 }
 pump(){this.queue.sort((a,b)=>a.priority-b.priority);while(!this.closed&&this.active<this.concurrency&&this.queue.length){const job=this.queue.shift();this.active++;Promise.resolve().then(()=>this.load(job.id)).then(bitmap=>{
   if(this.closed){bitmap.close?.();job.resolve(null);return}const size=bitmap.width*bitmap.height*4;
   if(size>this.maxBytes){bitmap.close?.();throw Error('Atlas exceeds cache budget')}
   const victims=[...this.entries].filter(([id])=>!this.pins.has(id)).sort((a,b)=>a[1].used-b[1].used);
   while(this.bytes+size>this.maxBytes&&victims.length){const[id,e]=victims.shift();e.bitmap.close?.();this.entries.delete(id);this.bytes-=e.size;this.evictions++}
   if(this.bytes+size>this.maxBytes){bitmap.close?.();job.resolve(null);return}
   this.entries.set(job.id,{bitmap,size,used:this.now()});this.bytes+=size;this.peakBytes=Math.max(this.peakBytes,this.bytes);this.loads++;job.resolve(bitmap);
  }).catch(()=>{this.failures++;this.failedUntil.set(job.id,this.now()+5000);job.resolve(null)}).finally(()=>{this.active--;this.jobs.delete(job.id);this.pump()});}}
 stats(){return {bytes:this.bytes,peakBytes:this.peakBytes,budgetBytes:this.maxBytes,atlases:this.entries.size,loads:this.loads,evictions:this.evictions,failures:this.failures,queued:this.queue.length,active:this.active}}
 close(){this.closed=true;for(const e of this.entries.values())e.bitmap.close?.();this.entries.clear();this.bytes=0;for(const job of this.queue)job.resolve(null);this.queue=[];}
}
