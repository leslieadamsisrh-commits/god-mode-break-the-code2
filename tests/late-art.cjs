const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),{stripTypeScriptTypes}=require('node:module');
const source=fs.readFileSync('app/Game.tsx','utf8'),fn=source.slice(source.indexOf('function loadImage('),source.indexOf('function preload('));
let image,timer,ready=0,progress=0;
class FakeImage{constructor(){image=this;this.naturalWidth=0}decode(){return Promise.resolve()}}
const context={Image:FakeImage,setTimeout:f=>(timer=f,1),clearTimeout:()=>{}};vm.createContext(context);
vm.runInContext(stripTypeScriptTypes(fn)+'\nglobalThis.load=loadImage',context);
(async()=>{const boot=context.load('road.webp',()=>ready++,()=>progress++);timer();await boot;assert.equal(progress,1);assert.equal(ready,0);image.naturalWidth=1672;image.onload();await Promise.resolve();assert.equal(ready,1);assert.equal(progress,1);let fallbackReady=0;const delayed=context.load('actor.webp',()=>fallbackReady++,()=>{},'actor.svg');timer();await delayed;image.onerror();assert.equal(image.src,'actor.svg');image.naturalWidth=768;image.onload();await Promise.resolve();assert.equal(fallbackReady,1);console.log('PASS: late success and post-timeout SVG fallback recover textures without double-counting progress')})().catch(e=>{console.error(e);process.exitCode=1});
