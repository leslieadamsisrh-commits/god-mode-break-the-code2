const fs=require('fs'),ts=require('typescript'),assert=require('node:assert/strict');
require.extensions['.ts']=(m,p)=>m._compile(ts.transpileModule(fs.readFileSync(p,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,p);
const {createCanvas}=require('@napi-rs/canvas');
const {drawConcealedCoverCue,withCoverOcclusion}=require('../lib/cover-occlusion.ts');
const {setArenaContext46}=require('../lib/bayBridgePresentation.ts');
function render(covers,actor,mask=false){const c=createCanvas(1000,620),g=c.getContext('2d');setArenaContext46(g,{x:500,y:310},2,1,1);if(mask)withCoverOcclusion(g,covers,actor.y,10,()=>{g.setTransform(1,0,0,1,0,0);g.fillStyle='white';g.fillRect(0,0,1000,620)},null,false,1/.52);else drawConcealedCoverCue(g,covers,actor,10,1,1/.52);return g.getImageData(0,0,1000,620).data;}
const actor={x:500,y:310,z:0,hp:100,local30:true,slide:0};let visible=0;
for(const angle of [0,.3,.8,1.4])for(const slide of [0,1]){
 const a={...actor,slide},covers=[{x:500,y:330,w:180,h:30,a:angle}],cue=render(covers,a),clear=render(covers,a,true);
 for(let i=3;i<cue.length;i+=4)if(cue[i]){visible++;assert(clear[i]<255,'cue must stay within the exact concealment mask');}
 assert(!render(covers,{...a,local30:false}).some(Boolean),'opponent must never receive cue');
 assert(!render(covers,{...a,hp:0}).some(Boolean),'dead actor has no cue');
}
assert(visible>0,'concealed local actor must have a visible cue');assert(!render([],actor).some(Boolean));
assert(!render([{x:500,y:330,w:180,h:30,generated:true,born:9.8}],actor).some(Boolean),'assembling non-solid cover cannot expose cue');
console.log('PASS: actual canvas pixels — concealed local points only, clear air/opponents/dead actors untouched; rotated cover and slide posture.');
