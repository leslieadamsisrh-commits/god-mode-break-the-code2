const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),ts=require('typescript');
const manifest=JSON.parse(fs.readFileSync('public/assets/raptor-v2/manifest.json'));
const draws=[],requests=[];
class Image {constructor(){this.complete=true;this.naturalWidth=this.naturalHeight=512;}set src(v){this.url=v;requests.push(v);assert(fs.existsSync('public'+v),v);this.onload?.();}}
const context={exports:{},Image,Map,Set,Math,Promise,require:()=>({default:manifest})};vm.createContext(context);
vm.runInContext(ts.transpileModule(fs.readFileSync('lib/raptorSpriteOnly.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,context);
const a=context.exports;
assert.equal(JSON.stringify(a.RAPTOR_COUNTS),JSON.stringify(manifest.counts));
const g={drawImage:(...args)=>draws.push(args)};
const base={x:300,y:300,speed:0,sliding:false,airborne:false,hit:false,firing:false,time:0,scale:.2};
(async()=>{assert(await a.preloadRaptorSprites());assert.equal(requests.length,24);
for(let i=0;i<8;i++){
 assert.equal(a.selectRaptorDirection(i*Math.PI/4),manifest.directions[i]);
 assert.equal(a.selectRaptorDirection(i*Math.PI/4-2*Math.PI),manifest.directions[i]);
 for(const state of [{},{speed:100},{speed:200},{sliding:true},{airborne:true},{hit:true},{firing:true}])for(const time of [0,.125])assert(a.paintRaptorSprite(g,{...base,...state,angle:i*Math.PI/4,time}));
 const paths=draws.slice(-14).map(d=>d[0].url);assert(paths.some(p=>p.includes('/run/')));assert(paths.some(p=>p.endsWith('001.png')));
}
assert.equal(requests.length,24,'Rendering must not request nonexistent unfinished families');
console.log('PASS39P eight directions, negative angles, all action fallbacks, real paths, changing Run frames, preload inventory');})();
