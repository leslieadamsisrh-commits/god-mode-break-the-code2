/* 08J image residency only. Does not read or mutate the combat simulation.
 * Ready/final images are resident; dynamic atlases use bounded LRU residency.
 * A pending/failed replacement never masquerades as a decoded image.
 */
(function(root){
'use strict';
class AssetStore {
 constructor({records,pinned=[],capacity=12,concurrency=4,load,onError=()=>{}}){
  if(!Number.isInteger(capacity)||capacity<1||!Number.isInteger(concurrency)||concurrency<1||typeof load!=='function')throw Error('Invalid asset-store configuration');
  this.records=new Map(records.map(r=>[r.file,r]));this.pins=new Set(pinned);
  for(const f of this.pins)if(!this.records.has(f))throw Error('Unknown pinned asset: '+f);
  this.capacity=capacity;this.concurrency=concurrency;this.load=load;this.onError=onError;
  this.entries=new Map();this.queue=[];this.running=0;this.serial=0;this.active=null;
  this.counts={requested:0,decoded:0,evictions:0,failures:0};
 }
 entry(file){
  if(!this.records.has(file))throw Error('Unknown asset: '+file);
  if(!this.entries.has(file))this.entries.set(file,{file,status:'idle',image:null,job:null,error:null,used:0,priority:0});
  return this.entries.get(file);
 }
 get(file){const e=this.entry(file);if(e.status!=='ready')return null;e.used=++this.serial;return e.image;}
 state(file){const e=this.entry(file);return{file,status:e.status,pinned:this.pins.has(file),active:this.active===file,error:e.error};}
 request(file,priority=1){
  const e=this.entry(file);
  if(e.status==='ready'){e.used=++this.serial;return Promise.resolve(e.image);}
  if(e.status==='failed')return Promise.reject(new Error(e.error));
  if(e.job){e.priority=Math.max(e.priority,priority);return e.job;}
  e.status='queued';e.priority=priority;e.used=++this.serial;this.counts.requested++;
  e.job=new Promise((resolve,reject)=>{e.resolve=resolve;e.reject=reject;});
  const job=e.job;this.queue.push(e);this.pump();return job;
 }
 warm(files){
  // Speculation is limited; direct requests are prioritized ahead of it.
  for(const file of files){if(!this.records.has(file)||this.queue.length>=this.concurrency*2)continue;const e=this.entry(file);if(e.status==='idle')this.request(file,-1).catch(()=>{});}
 }
 initialize(){return Promise.all([...this.pins].map(f=>this.request(f,3)));}
 setActive(file){if(file!==null&&this.entry(file).status!=='ready')throw Error('Cannot activate an undecoded image');this.active=file;if(file)this.entry(file).used=++this.serial;this.trim();}
 trim(){
  const dynamic=[...this.entries.values()].filter(e=>e.status==='ready'&&!this.pins.has(e.file));
  let excess=dynamic.length-this.capacity;
  for(const e of dynamic.filter(e=>e.file!==this.active).sort((a,b)=>a.used-b.used)){
   if(excess--<=0)break;
   e.image=null;e.status='idle';e.job=null;this.counts.evictions++;
  }
 }
 pump(){
  while(this.running<this.concurrency&&this.queue.length){
   this.queue.sort((a,b)=>b.priority-a.priority||b.used-a.used);
   const e=this.queue.shift();e.status='loading';this.running++;
   Promise.resolve().then(()=>this.load(e.file,this.records.get(e.file))).then(image=>{
    const r=this.records.get(e.file),d=r.runtimeDimensions||r.dimensions;
    if(!image||image.naturalWidth!==d[0]||image.naturalHeight!==d[1])throw Error('Wrong asset dimensions: '+e.file);
    e.image=image;e.status='ready';e.used=++this.serial;this.counts.decoded++;
    const resolve=e.resolve;e.resolve=null;e.reject=null;e.job=null;this.trim();resolve(image);
   }).catch(reason=>{
    e.status='failed';e.image=null;e.error=String(reason?.message||reason);this.counts.failures++;
    const reject=e.reject;e.resolve=null;e.reject=null;e.job=null;if(reject)reject(new Error(e.error));
    // Report once. Callers may retry request(), but failure is not silently hidden.
    try{this.onError(new Error(e.error));}catch(_){}
   }).finally(()=>{this.running--;this.pump();});
  }
 }
 stats(){
  let pinnedReady=0,dynamicReady=0,decodedPixelBytes=0;
  for(const e of this.entries.values())if(e.status==='ready'){
   if(this.pins.has(e.file))pinnedReady++;else dynamicReady++;
   decodedPixelBytes+=e.image.naturalWidth*e.image.naturalHeight*4;
  }
  return{...this.counts,pinnedTotal:this.pins.size,pinnedReady,dynamicReady,dynamicLimit:this.capacity,active:this.active,loading:this.running,queued:this.queue.length,decodedPixelBytes};
 }
}
function browserLoader(embedded={},timeoutMs=15000){
 return file=>new Promise((resolve,reject)=>{
  const image=new Image();let done=false;
  const finish=(err)=>{if(done)return;done=true;clearTimeout(timer);image.onload=image.onerror=null;err?reject(err):resolve(image);};
  const timer=setTimeout(()=>finish(new Error('Image load timed out: '+file)),timeoutMs);
  image.onload=()=>finish();image.onerror=()=>finish(new Error('Image missing or unreadable: '+file));
  image.src=embedded[file]||file;
 });
}
root.JadeResidency={AssetStore,browserLoader};
if(typeof module==='object')module.exports=root.JadeResidency;
})(typeof globalThis==='object'?globalThis:this);
