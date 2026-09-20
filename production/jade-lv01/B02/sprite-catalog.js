/* JADE LV01 B02. Reference catalog + deterministic review playback, NOT gameplay.
 * Opaque source panels retain their labels/backgrounds. No segmentation,
 * new anatomy, inferred sockets, or movement tuning occurs in this module.
 */
(function (root) {
  'use strict';
  const positive = n => Number.isFinite(n) && n > 0;
  const pair = a => Array.isArray(a) && a.length === 2 && a.every(n => Number.isInteger(n) && n > 0);
  const safePath = p => typeof p === 'string' && !/^(?:[a-z]+:|\/|\\)/i.test(p) && !p.split(/[\\/]/).includes('..');
  function validate(catalog) {
    if (!catalog || !pair(catalog.source?.size) || !Array.isArray(catalog.frames) || !catalog.frames.length) throw Error('Invalid source catalog');
    if (!/^[a-f0-9]{64}$/.test(catalog.source.sha256)) throw Error('Missing source fingerprint');
    if (!safePath(catalog.source.file)) throw Error('Invalid source path');
    const ids = new Set();
    for (const f of catalog.frames) {
      if (typeof f.id !== 'string' || ids.has(f.id)) throw Error('Missing or duplicate frame id');
      ids.add(f.id);
      const r = f.rect;
      if (!Array.isArray(r) || r.length !== 4 || !r.every(Number.isInteger) || r[0] < 0 || r[1] < 0 || r[2] <= 0 || r[3] <= 0 || r[0]+r[2] > catalog.source.size[0] || r[1]+r[3] > catalog.source.size[1]) throw Error('Out-of-bounds source rectangle: '+f.id);
      if (!pair(f.size) || f.size[0] !== r[2] || f.size[1] !== r[3] || !safePath(f.file)) throw Error('Invalid frame dimensions/path: '+f.id);
    }
    if (!catalog.clips || !Object.keys(catalog.clips).length) throw Error('Missing review clips');
    for (const [name, clip] of Object.entries(catalog.clips)) {
      if (!Array.isArray(clip.frames) || !clip.frames.length || !Array.isArray(clip.durationsMs) || clip.frames.length !== clip.durationsMs.length || clip.frames.some(id => !ids.has(id)) || !clip.durationsMs.every(positive) || typeof clip.loop !== 'boolean') throw Error('Invalid clip: '+name);
    }
    return true;
  }
  class ReviewPlayer {
    constructor(catalog, clipName='all-keys') {
      validate(catalog);
      this.catalog = JSON.parse(JSON.stringify(catalog));
      this.byId = new Map(this.catalog.frames.map(f=>[f.id,f]));
      this.playing=false; this.speed=1; this.selectClip(clipName);
    }
    selectClip(name) {
      if (!Object.hasOwn(this.catalog.clips,name)) throw Error('Unknown clip: '+name);
      this.clipName=name; this.elapsedMs=0; this.manualId=null; this.playing=false;
      return this.current();
    }
    duration() { return this.catalog.clips[this.clipName].durationsMs.reduce((a,b)=>a+b,0); }
    seek(ms) { if (!Number.isFinite(ms) || ms<0) throw Error('Invalid review time'); this.manualId=null; this.elapsedMs=Math.min(ms,this.duration()); return this.current(); }
    selectFrame(id) { if (!this.byId.has(id)) throw Error('Unknown frame: '+id); this.manualId=id; this.playing=false; return this.current(); }
    setSpeed(value) { if (!positive(value)||value>4) throw Error('Review speed must be >0 and <=4'); this.speed=value; }
    play() { this.manualId=null; if(this.elapsedMs>=this.duration())this.elapsedMs=0; this.playing=true; }
    pause() { this.playing=false; }
    update(dtMs) {
      if (!Number.isFinite(dtMs)||dtMs<0) throw Error('Invalid review delta');
      if (!this.playing)return this.current();
      this.elapsedMs+=dtMs*this.speed;
      const total=this.duration();
      if(this.catalog.clips[this.clipName].loop)this.elapsedMs%=total;
      else if(this.elapsedMs>=total){this.elapsedMs=total;this.playing=false;}
      return this.current();
    }
    current() {
      if(this.manualId)return this.byId.get(this.manualId);
      const c=this.catalog.clips[this.clipName]; let t=this.elapsedMs;
      for(let i=0;i<c.frames.length;i++){if(t<c.durationsMs[i])return this.byId.get(c.frames[i]); t-=c.durationsMs[i];}
      return this.byId.get(c.frames[c.frames.length-1]);
    }
  }
  function drawReference(ctx,image,frame,{x=0,y=0,scale=1}={}) {
    if(!positive(scale)||!Number.isFinite(x)||!Number.isFinite(y))throw Error('Invalid review transform');
    const r=frame.rect;
    if(!image||image.naturalWidth<r[0]+r[2]||image.naturalHeight<r[1]+r[3])throw Error('Source image unavailable or too small');
    ctx.drawImage(image,...r,x,y,r[2]*scale,r[3]*scale);
    return {kind:'OPAQUE_REFERENCE_PANEL',frame:frame.id,nativeSize:[r[2],r[3]],scale};
  }
  function assertRuntimeReady(catalog) {
    validate(catalog);
    if(catalog.runtimeReady!==true || catalog.frameKind!=='TRANSPARENT_CHARACTER_FRAME' || catalog.source.hasAlpha!==true || catalog.frames.some(f=>!Array.isArray(f.root)||!f.sockets)) throw Error('Production blocked: reference panels are not transparent registered character sprites');
    return true;
  }
  const api={validate,ReviewPlayer,drawReference,assertRuntimeReady};
  root.JadeSpriteCatalog=api;
  if(typeof module==='object')module.exports=api;
})(typeof globalThis==='object'?globalThis:this);
